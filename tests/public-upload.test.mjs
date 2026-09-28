import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const module = { exports: {} };
const source = readFileSync(new URL("../src/lib/public-upload.server.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
vm.runInNewContext(outputText, {
  module,
  exports: module.exports,
  require: createRequire(import.meta.url),
  Buffer,
});
const { preparePublicUpload } = module.exports;
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
const input = (bytes = png, extra = {}) => ({
  bucket: "configurator-images",
  contentType: "image/png",
  path: "../../existing.png",
  base64: bytes.toString("base64"),
  ...extra,
});

test("guest uploads receive a fresh server-generated path", () => {
  const first = preparePublicUpload(input());
  const second = preparePublicUpload(input());
  assert.match(first.path, /^[0-9a-f-]{36}\.png$/);
  assert.notEqual(first.path, second.path);
  assert.equal(first.buffer.compare(png), 0);
});
test("data URL format is accepted", () => {
  const file = preparePublicUpload(
    input(png, { base64: "data:image/png;base64," + png.toString("base64") }),
  );
  assert.equal(file.contentType, "image/png");
});
test("fake image content is rejected", () => {
  assert.throws(
    () => preparePublicUpload(input(Buffer.from("<script>alert(1)</script>"))),
    /Dateiformat/,
  );
});
test("mismatching declared MIME type is rejected", () => {
  assert.throws(
    () => preparePublicUpload(input(png, { contentType: "image/jpeg" })),
    /Dateiformat/,
  );
});
test("PDF is accepted only for applications", () => {
  const pdf = Buffer.from("%PDF-1.7\n");
  assert.equal(
    preparePublicUpload(input(pdf, { bucket: "cvs", contentType: "application/pdf" })).contentType,
    "application/pdf",
  );
  assert.throws(
    () => preparePublicUpload(input(pdf, { contentType: "application/pdf" })),
    /Dateiformat/,
  );
});
test("SVG is not accepted from guests", () => {
  assert.throws(
    () => preparePublicUpload(input(Buffer.from("<svg></svg>"), { contentType: "image/svg+xml" })),
    /Dateiformat/,
  );
});
test("malformed base64 is rejected", () => {
  for (const base64 of ["???", "AAAA=AAA", "AA", "===="]) {
    assert.throws(() => preparePublicUpload(input(png, { base64 })), /Dateidaten/);
  }
});
test("size limit is enforced for decoded data", () => {
  const largest = Buffer.alloc(10 * 1024 * 1024);
  png.copy(largest);
  assert.equal(preparePublicUpload(input(largest)).buffer.length, largest.length);
  assert.throws(
    () => preparePublicUpload(input(Buffer.concat([largest, Buffer.from([0])]))),
    /10 MB/,
  );
});
