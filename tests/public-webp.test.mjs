import test from "node:test";
import assert from "node:assert/strict";
import { publicWebpResponse } from "../scripts/public-webp.mjs";
const asset = "/images/projekte/example.webp";
const allowed = new Set([asset]);
const url = "https://www.loni-galabau.de/__public-webp" + asset;
test("public WebP responses correct MIME and preserve asset validators without forwarding credentials", async () => {
  const response = await publicWebpResponse(
    new Request(url, {
      headers: {
        Cookie: "private",
        Authorization: "Bearer private",
        "If-None-Match": '"old"',
        Range: "bytes=0-11",
      },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          assert.equal(request.url, "https://assets.local" + asset);
          assert.equal(request.headers.get("cookie"), null);
          assert.equal(request.headers.get("authorization"), null);
          assert.equal(request.headers.get("if-none-match"), '"old"');
          assert.equal(request.headers.get("range"), "bytes=0-11");
          return new Response("RIFF1234WEBP", {
            status: 206,
            headers: {
              "Content-Type": "application/octet-stream",
              ETag: '"image"',
              "Content-Range": "bytes 0-11/100",
              "Content-Length": "12",
            },
          });
        },
      },
    },
    allowed,
  );
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("content-type"), "image/webp");
  assert.equal(response.headers.get("content-range"), "bytes 0-11/100");
  assert.equal(response.headers.get("etag"), '"image"');
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(await response.text(), "RIFF1234WEBP");
});
test("image route restricts paths and methods; missing bindings never return HTML", async () => {
  const env = {
    ASSETS: {
      fetch() {
        throw new Error("must not be called");
      },
    },
  };
  for (const suffix of [
    "/images/private.webp",
    asset + "?url=https://example.com",
    "/assets/page.html",
    "/images/%2e%2e/private.webp",
  ]) {
    const r = await publicWebpResponse(
      new Request("https://www.loni-galabau.de/__public-webp" + suffix),
      env,
      allowed,
    );
    assert.equal(r.status, 404);
    assert.equal(r.headers.get("cache-control"), "no-store");
  }
  assert.equal(
    (await publicWebpResponse(new Request(url, { method: "POST" }), env, allowed)).status,
    405,
  );
  assert.equal((await publicWebpResponse(new Request(url), {}, allowed)).status, 503);
  assert.equal(
    await publicWebpResponse(new Request("https://www.loni-galabau.de/admin"), env, allowed),
    null,
  );
});
test("HEAD and conditional responses have no body; upstream errors stay uncached", async () => {
  for (const [method, status] of [
    ["HEAD", 200],
    ["GET", 304],
  ]) {
    const r = await publicWebpResponse(
      new Request(url, { method }),
      {
        ASSETS: {
          fetch: async () =>
            new Response(status === 304 ? null : "image", {
              status,
              headers: { ETag: '"v1"', "Content-Type": "application/octet-stream" },
            }),
        },
      },
      allowed,
    );
    assert.equal(r.status, status);
    assert.equal(await r.text(), "");
    assert.equal(r.headers.get("etag"), '"v1"');
  }
  for (const response of [
    new Response("not found", { status: 404 }),
    new Response("HTML", { headers: { "Content-Type": "text/html" } }),
    new Response("image", { headers: { "Set-Cookie": "session=private" } }),
  ]) {
    const r = await publicWebpResponse(
      new Request(url),
      { ASSETS: { fetch: async () => response } },
      allowed,
    );
    assert.ok(r.status >= 400);
    assert.equal(r.headers.get("cache-control"), "no-store");
  }
});

test("versioned WebP assets are immutable while editable public images can refresh", async () => {
  const versioned = "/assets/hero-garden-1920-abcdefgh.webp";
  for (const [path, expected] of [
    [versioned, "public, max-age=31536000, immutable"],
    [asset, "public, max-age=86400"],
  ]) {
    const response = await publicWebpResponse(
      new Request("https://www.loni-galabau.de/__public-webp" + path),
      {
        ASSETS: {
          fetch: async () =>
            new Response("RIFF1234WEBP", {
              headers: { "Content-Type": "application/octet-stream" },
            }),
        },
      },
      new Set([versioned, asset]),
    );
    assert.equal(response.headers.get("content-type"), "image/webp");
    assert.equal(response.headers.get("cache-control"), expected);
  }
});
