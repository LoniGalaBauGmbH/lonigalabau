import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(path, state) {
  const module = { exports: {} };
  const compiled = ts.transpileModule(
    readFileSync(new URL("../" + path, import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText;
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    process: { env: state.env || {} },
    AbortSignal,
    console: { warn() {} },
    fetch: state.fetch,
    require: (id) =>
      id.includes("client.server")
        ? { supabaseAdmin: state.db }
        : id === "@tanstack/react-start/server"
          ? { getRequestHeader: () => "192.0.2.1" }
          : require(id),
  });
  return module.exports;
}
const env = {
  RESEND_API_KEY: "test-secret",
  RESEND_FROM_EMAIL: "Website <test@example.invalid>",
  NOTIFICATION_TO_EMAIL: "owner@example.invalid",
};
function notificationHarness(overrides = {}) {
  const requests = [],
    updates = [];
  const state = {
    env,
    fetch: async (url, init) => {
      requests.push([url, init]);
      return { ok: true, json: async () => ({ id: "test-message" }) };
    },
    db: {
      from: (table) => ({
        update: (value) => ({
          eq: async (column, id) => {
            updates.push({ table, value, column, id });
            return { error: null };
          },
        }),
      }),
    },
    ...overrides,
  };
  return { module: load("src/lib/notifications.server.ts", state), requests, updates };
}
test("unconfigured email does not send or mark a notification complete", async () => {
  const h = notificationHarness({ env: {} });
  assert.equal(await h.module.notifyNewEntry("contact_requests", "test-id"), false);
  assert.equal(h.requests.length, 0);
  assert.equal(h.updates.length, 0);
});
test("notification uses fixed recipient and stable idempotency key without customer content", async () => {
  const h = notificationHarness();
  assert.equal(await h.module.notifyNewEntry("contact_requests", "test-id"), true);
  const [url, init] = h.requests[0],
    body = JSON.parse(init.body);
  assert.equal(url, "https://api.resend.com/emails");
  assert.deepEqual(body.to, ["owner@example.invalid"]);
  assert.equal(init.headers["Idempotency-Key"], "contact_requests/test-id");
  assert.match(body.text, /\/admin\/anfragen/);
  assert.deepEqual(Object.keys(body).sort(), ["from", "subject", "text", "to"]);
  assert.equal(h.updates[0].id, "test-id");
});
test("email rejection keeps notification pending", async () => {
  const h = notificationHarness({ fetch: async () => ({ ok: false, status: 429 }) });
  assert.equal(await h.module.notifyNewEntry("applications", "test-id"), false);
  assert.equal(h.updates.length, 0);
});
test("email timeout is contained and keeps notification pending", async () => {
  const h = notificationHarness({
    fetch: async () => {
      throw Error("timeout");
    },
  });
  assert.equal(await h.module.notifyNewEntry("contact_requests", "test-id"), false);
  assert.equal(h.updates.length, 0);
});
test("missing provider message id is not recorded as sent", async () => {
  const h = notificationHarness({ fetch: async () => ({ ok: true, json: async () => ({}) }) });
  assert.equal(await h.module.notifyNewEntry("contact_requests", "test-id"), false);
  assert.equal(h.updates.length, 0);
});
for (const [label, result] of [
  ["limit exceeded", { data: false, error: null }],
  ["database unavailable", { data: null, error: { message: "offline" } }],
]) {
  test("quota fails closed when " + label, async () => {
    const m = load("src/lib/form-quota.server.ts", {
      env: { SUPABASE_SECRET_KEY: "test" },
      db: { rpc: async () => result },
    });
    await assert.rejects(m.checkFormQuota("contact"));
  });
}
test("quota hashes addresses and separates actions", async () => {
  const calls = [];
  const m = load("src/lib/form-quota.server.ts", {
    env: { SUPABASE_SECRET_KEY: "test" },
    db: {
      rpc: async (fn, args) => {
        calls.push({ fn, ...args });
        return { data: true, error: null };
      },
    },
  });
  await m.checkFormQuota("contact");
  await m.checkFormQuota("upload");
  assert.equal(calls[0].fn, "consume_form_quota");
  assert.match(calls[0].p_key, /^[0-9a-f]{64}$/);
  assert.notEqual(calls[0].p_key, calls[1].p_key);
  assert.equal(calls[0].p_limit, 6);
  assert.equal(calls[1].p_limit, 20);
});
