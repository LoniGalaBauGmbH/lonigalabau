import test from "node:test";
import assert from "node:assert/strict";
import { publicAssetResponse } from "../scripts/public-assets.mjs";
const paths = new Map([
  ["/assets/index-abcdefgh.js", "text/javascript"],
  ["/assets/style-abcdefgh.css", "text/css"],
  ["/assets/hero-abcdefgh.avif", "image/avif"],
  ["/fonts/jakarta-normal-latin.woff2", "font/woff2"],
  ["/videos/holzterrasse-rundgang.mp4", "video/mp4"],
]);
const request = (path, init) =>
  new Request("https://www.loni-galabau.de/__public-assets" + path, init);

test("public files retain bytes and validators with version-aware cache and exact MIME", async () => {
  for (const [path, type] of paths) {
    const response = await publicAssetResponse(
      request(path, {
        headers: {
          Cookie: "private",
          Authorization: "Bearer private",
          "If-None-Match": '"old"',
          Range: "bytes=0-3",
        },
      }),
      {
        ASSETS: {
          fetch: async (r) => {
            assert.equal(r.url, "https://assets.local" + path);
            assert.equal(r.headers.get("cookie"), null);
            assert.equal(r.headers.get("authorization"), null);
            assert.equal(r.headers.get("if-none-match"), '"old"');
            assert.equal(r.headers.get("range"), "bytes=0-3");
            return new Response("file", {
              status: 206,
              headers: {
                "Content-Type": "application/octet-stream",
                ETag: '"v1"',
                "Content-Range": "bytes 0-3/10",
              },
            });
          },
        },
      },
      paths,
    );
    assert.equal(response.status, 206);
    assert.equal(await response.text(), "file");
    assert.equal(response.headers.get("content-type"), type);
    assert.equal(response.headers.get("etag"), '"v1"');
    assert.equal(response.headers.get("content-range"), "bytes 0-3/10");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(
      response.headers.get("cache-control"),
      path.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=86400",
    );
  }
});

test("public asset route rejects arbitrary files, queries, methods and unsafe upstream responses", async () => {
  const never = {
    ASSETS: {
      fetch: () => {
        throw Error("must not fetch");
      },
    },
  };
  for (const path of [
    "/admin",
    "/assets/unknown-abcdefgh.js",
    "/assets/index-abcdefgh.js?target=private",
    "/assets/%2e%2e/secret.js",
  ])
    assert.equal((await publicAssetResponse(request(path), never, paths)).status, 404);
  assert.equal(
    (
      await publicAssetResponse(
        request("/assets/index-abcdefgh.js", { method: "POST" }),
        never,
        paths,
      )
    ).status,
    405,
  );
  assert.equal(
    (await publicAssetResponse(request("/assets/index-abcdefgh.js"), {}, paths)).status,
    503,
  );
  assert.equal(
    await publicAssetResponse(new Request("https://example.test/admin"), never, paths),
    null,
  );
  for (const response of [
    new Response("HTML", { headers: { "Content-Type": "text/html" } }),
    new Response("private", { headers: { "Set-Cookie": "session=private" } }),
    new Response("missing", { status: 404 }),
    new Response(null, { status: 302, headers: { Location: "/admin" } }),
  ]) {
    const result = await publicAssetResponse(
      request("/assets/index-abcdefgh.js"),
      { ASSETS: { fetch: async () => response } },
      paths,
    );
    assert.ok(result.status >= 400);
    assert.equal(result.headers.get("cache-control"), "no-store");
  }
});

test("HEAD and conditional asset responses have no body and retain validators", async () => {
  for (const [method, status] of [
    ["HEAD", 200],
    ["GET", 304],
  ]) {
    const result = await publicAssetResponse(
      request("/assets/index-abcdefgh.js", { method }),
      {
        ASSETS: {
          fetch: async () =>
            new Response(status === 304 ? null : "file", {
              status,
              headers: { "Content-Type": "application/javascript", ETag: '"v1"' },
            }),
        },
      },
      paths,
    );
    assert.equal(result.status, status);
    assert.equal(await result.text(), "");
    assert.equal(result.headers.get("etag"), '"v1"');
  }
});
