import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadMiddleware(getSession) {
  const source = readFileSync(
    new URL("../src/integrations/supabase/auth-attacher.ts", import.meta.url),
    "utf8",
  );
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    require(id) {
      if (id === "@tanstack/react-start")
        return { createMiddleware: () => ({ client: (handler) => handler }) };
      if (id === "./client") return { supabase: { auth: { getSession } } };
      throw new Error(`Unexpected dependency: ${id}`);
    },
  });
  return module.exports.attachSupabaseAuth;
}

test("client RPC waits for the current session before attaching its bearer token", async () => {
  let resolveSession;
  const session = new Promise((resolve) => {
    resolveSession = resolve;
  });
  let request;
  const run = loadMiddleware(() => session)({
    next: (options) => {
      request = options;
      return "done";
    },
  });
  await Promise.resolve();
  assert.equal(request, undefined);
  resolveSession({ data: { session: { access_token: "current-test-token" } } });
  assert.equal(await run, "done");
  assert.equal(request.headers.Authorization, "Bearer current-test-token");
});

test("anonymous public RPC sends no authorization header", async () => {
  const run = loadMiddleware(async () => ({ data: { session: null } }));
  const result = await run({ next: ({ headers }) => Object.keys(headers) });
  assert.deepEqual(result, []);
});

test("session loading failure does not silently dispatch a protected RPC without credentials", async () => {
  let requested = false;
  const run = loadMiddleware(async () => {
    throw new Error("Session unavailable");
  });
  await assert.rejects(
    run({
      next: () => {
        requested = true;
      },
    }),
    /Session unavailable/,
  );
  assert.equal(requested, false);
});
