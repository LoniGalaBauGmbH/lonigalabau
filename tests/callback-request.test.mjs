import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(name) {
  const module = { exports: {} };
  const source = readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8");
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      module,
      exports: module.exports,
      Date,
      Intl,
      require: (id) => (id.startsWith("./") ? load(id.slice(2)) : require(id)),
    },
  );
  return module.exports;
}
const api = load("callback-request");
const now = new Date("2026-10-01T08:00:00Z");
const valid = {
  firstName: "Anna",
  lastName: "Müller",
  phone: "+49 176 12345678",
  email: "",
  date: "2026-10-02",
  time: "10:30",
  privacy: true,
};

test("callback steps validate only the visible fields and final submission still requires every step", () => {
  assert.equal(
    api.validateCallbackStep(
      { firstName: "Anna", lastName: "Müller", phone: "", privacy: false },
      0,
    ).success,
    true,
  );
  assert.equal(api.validateCallbackStep({ firstName: "", lastName: "Müller" }, 0).success, false);
  assert.equal(
    api.validateCallbackStep({ phone: "+49 176 12345678", email: "", date: "" }, 1).success,
    true,
  );
  assert.equal(api.validateCallbackStep({ phone: "123", email: "" }, 1).success, false);
  assert.equal(
    api.validateCallbackStep({ phone: "+49 176 12345678", email: "falsch" }, 1).success,
    false,
  );
  assert.equal(api.validateCallbackStep({ ...valid, privacy: false }, 2).success, false);
});

test("callback validates a real weekday, Berlin time, opening hours and lead time on the server", () => {
  assert.equal(api.validateCallback(valid, now).success, true);
  for (const change of [
    { date: "2026-02-31" },
    { date: "2026-09-30" },
    { date: "2026-10-03" },
    { time: "18:00" },
    { time: "06:30" },
    { time: "10:13" },
    { date: "2026-10-01", time: "10:30" },
    { phone: "123" },
    { phone: "abcdefghi" },
    { firstName: "" },
    { lastName: "" },
    { email: "bad" },
    { privacy: false },
    { website: "spam" },
  ])
    assert.equal(
      api.validateCallback({ ...valid, ...change }, now).success,
      false,
      JSON.stringify(change),
    );
  assert.equal(
    api.validateCallback({ ...valid, date: "2026-10-01", time: "11:00" }, now).success,
    true,
  );
  assert.equal(api.berlinClock(new Date("2026-12-01T09:00:00Z")).time, "10:00");
  assert.equal(api.berlinClock(new Date("2026-07-01T08:00:00Z")).time, "10:00");
  assert.equal(
    api.validateCallback(
      { ...valid, date: "2026-10-01", time: "11:00" },
      new Date("2026-10-01T08:00:00.001Z"),
    ).success,
    false,
  );
});

test("phone-only callback requests never queue a customer email; optional email enables the receipt", () => {
  const data = api.validateCallback(valid, now).data;
  const record = api.buildCallbackRecord(data);
  assert.equal(record.name, "Anna Müller");
  assert.equal(record.email, null);
  assert.equal(record.customer_confirmation_requested_at, null);
  assert.equal(record.ticket_format_version, 2);
  assert.match(record.message, /02.10.2026/);
  assert.match(record.message, /10:30 Uhr \(Europe\/Berlin\)/);
  const withEmail = api.buildCallbackRecord({ ...data, email: "anna@example.invalid" });
  assert.equal(withEmail.email, "anna@example.invalid");
  assert.equal(Object.hasOwn(withEmail, "customer_confirmation_requested_at"), false);
});

test("callback persistence rejects forged or expired data before writing and preserves all valid fields", async () => {
  const { persistCallbackSubmission } = load("callback-submission.server");
  const records = [];
  const client = {
    from: (table) => {
      assert.equal(table, "contact_requests");
      return {
        insert: async (record) => {
          records.push(record);
          return { error: null };
        },
      };
    },
  };
  await assert.rejects(persistCallbackSubmission(client, { ...valid, date: "2020-01-01" }));
  assert.equal(records.length, 0);
  const future = new Date(Date.now() + 7 * 86400000);
  while ([0, 6].includes(future.getUTCDay())) future.setUTCDate(future.getUTCDate() + 1);
  const result = await persistCallbackSubmission(client, {
    ...valid,
    date: future.toISOString().slice(0, 10),
  });
  assert.equal(records[0].id, result.id);
  assert.equal(records[0].phone, valid.phone);
  assert.equal(records[0].email, null);
  assert.equal(records[0].customer_confirmation_requested_at, null);
  assert.equal(records[0].ticket_number, undefined);
});
