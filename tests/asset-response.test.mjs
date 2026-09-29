import test from "node:test";
import assert from "node:assert/strict";
import { assetResponse } from "../scripts/asset-response.mjs";
test("static responses cache by version and serve WOFF2 MIME", () => {
  const response = () =>
    new Response("asset", { headers: { "Content-Type": "application/octet-stream" } });
  assert.match(
    assetResponse(
      new Request("https://example.test/assets/index-abcdefgh.js"),
      response(),
    ).headers.get("Cache-Control"),
    /immutable/,
  );
  const font = assetResponse(
    new Request("https://example.test/fonts/jakarta-normal-latin.woff2"),
    response(),
  );
  assert.equal(font.headers.get("Content-Type"), "font/woff2");
  assert.equal(font.headers.get("Cache-Control"), "public, max-age=86400");
});
test("asset policy preserves private, HTML and failed responses", () => {
  for (const [path, init] of [
    ["/admin", { headers: { "Cache-Control": "no-store" } }],
    ["/images/missing.svg", { status: 404 }],
    ["/assets/index-abcdefgh.js", { headers: { "Content-Type": "text/html" } }],
    ["/images/private.jpg", { headers: { "Set-Cookie": "session=placeholder" } }],
  ]) {
    const response = new Response("example", init);
    assert.equal(assetResponse(new Request("https://example.test" + path), response), response);
  }
});
