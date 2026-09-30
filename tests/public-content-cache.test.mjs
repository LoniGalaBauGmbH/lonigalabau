import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
const module = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(new URL("../src/lib/public-content-cache.server.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText,
  { module, exports: module.exports, Date, Map, Promise },
);
const { createPublicContentCache } = module.exports;

test("resolved public content is reused and refreshed after its short TTL", async () => {
  let time = 0,
    calls = 0,
    release;
  const cache = createPublicContentCache(30, () => time);
  const load = () => {
    calls++;
    return new Promise((resolve) => {
      release = resolve;
    });
  };
  const first = cache("services", load);
  assert.equal(calls, 1);
  release({ error: null, data: ["old"] });
  assert.deepEqual((await first).data, ["old"]);
  time = 29;
  await cache("services", load);
  assert.equal(calls, 1);
  time = 30;
  const fresh = cache("services", load);
  await Promise.resolve();
  assert.equal(calls, 2);
  release({ error: null, data: ["new"] });
  assert.deepEqual((await fresh).data, ["new"]);
});
test("database error responses and rejected requests never poison the public cache", async () => {
  const cache = createPublicContentCache();
  let calls = 0;
  const bad = () => {
    calls++;
    return Promise.resolve({ error: "unavailable" });
  };
  await cache("services", bad);
  await cache("services", bad);
  assert.equal(calls, 2);
  await assert.rejects(
    cache("services", () => Promise.reject(new Error("offline"))),
    /offline/,
  );
  const good = await cache("services", () => Promise.resolve({ error: null, data: "recovered" }));
  assert.equal(good.data, "recovered");
});
test("independent public collections cannot return each other's data", async () => {
  const cache = createPublicContentCache();
  const services = await cache("services", () =>
    Promise.resolve({ error: null, data: "services" }),
  );
  const project = await cache("featured-project", () =>
    Promise.resolve({ error: null, data: "project" }),
  );
  assert.equal(services.data, "services");
  assert.equal(project.data, "project");
});

test("an unresolved request never blocks subsequent requests for the same collection", async () => {
  const cache = createPublicContentCache();
  void cache("services", () => new Promise(() => {}));
  const result = await cache("services", () => Promise.resolve({ error: null, data: "fresh" }));
  assert.equal(result.data, "fresh");
});
