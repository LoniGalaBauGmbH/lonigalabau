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
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    module, exports: module.exports, Date, Intl,
    require: (id) => id.startsWith("./") ? load(id.slice(2)) : require(id),
  });
  return module.exports;
}

const { incomingContactWindow } = load("incoming-contact-summary");
const { loadIncomingContactSummary } = load("incoming-contact-summary.server");

for (const sample of [
  { now: "2026-10-12T07:09:00Z", first: "2026-09-13", today: "2026-10-12", start: "2026-09-12T22:00:00.000Z", end: "2026-10-12T22:00:00.000Z", hours: 720 },
  { now: "2026-03-29T12:00:00Z", first: "2026-02-28", today: "2026-03-29", start: "2026-02-27T23:00:00.000Z", end: "2026-03-29T22:00:00.000Z", hours: 719 },
  { now: "2026-10-25T12:00:00Z", first: "2026-09-26", today: "2026-10-25", start: "2026-09-25T22:00:00.000Z", end: "2026-10-25T23:00:00.000Z", hours: 721 },
  { now: "2027-01-02T12:00:00Z", first: "2026-12-04", today: "2027-01-02", start: "2026-12-03T23:00:00.000Z", end: "2027-01-02T23:00:00.000Z", hours: 720 },
  { now: "2026-10-12T22:30:00Z", first: "2026-09-14", today: "2026-10-13", start: "2026-09-13T22:00:00.000Z", end: "2026-10-13T22:00:00.000Z", hours: 720 },
]) {
  test(`30 Berlin calendar days for ${sample.now}`, () => {
    const actual = incomingContactWindow(new Date(sample.now));
    assert.equal(actual.startDate, sample.first);
    assert.equal(actual.endDate, sample.today);
    assert.equal(actual.start, sample.start);
    assert.equal(actual.end, sample.end);
    assert.equal((Date.parse(actual.end) - Date.parse(actual.start)) / 3_600_000, sample.hours);
    assert.equal(actual.days, 30);
    assert.equal(actual.timeZone, "Europe/Berlin");
  });
}

test("invalid measurement time is rejected", () => {
  assert.throws(() => incomingContactWindow(new Date("invalid")), /Ungültiger Messzeitpunkt/);
});

function countClient(result) {
  const calls = [];
  const builder = {
    select(...args) { calls.push(["select", ...args]); return builder; },
    gte(...args) { calls.push(["gte", ...args]); return builder; },
    lt(...args) { calls.push(["lt", ...args]); return Promise.resolve(result); },
  };
  return { calls, from(table) { calls.push(["from", table]); return builder; } };
}

test("requests an exact head count of customer contacts, with inclusive/exclusive boundaries", async () => {
  const client = countClient({ count: 1400, error: null, data: null });
  const result = await loadIncomingContactSummary(client, new Date("2026-10-12T07:09:00Z"));
  assert.deepEqual(JSON.parse(JSON.stringify(client.calls)), [
    ["from", "contact_requests"],
    ["select", "*", { count: "exact", head: true }],
    ["gte", "created_at", "2026-09-12T22:00:00.000Z"],
    ["lt", "created_at", "2026-10-12T22:00:00.000Z"],
  ]);
  assert.equal(result.count, 1400);
  assert.deepEqual(Object.keys(result).sort(), ["count", "days", "endDate", "startDate", "timeZone"]);
});

test("a successful empty aggregate is a real zero", async () => {
  assert.equal((await loadIncomingContactSummary(countClient({ count: 0, error: null }))).count, 0);
});

for (const result of [
  { count: null, error: { message: "private database detail" } },
  { count: 0, error: { message: "private database detail" } },
  { count: null, error: null },
  { count: -1, error: null },
  { count: 1.5, error: null },
]) {
  test(`failed or invalid aggregate never becomes zero: ${JSON.stringify(result)}`, async () => {
    await assert.rejects(loadIncomingContactSummary(countClient(result)), (error) => {
      assert.equal(error.message, "Die Anzahl der Kundenkontakte konnte nicht geladen werden. Bitte erneut versuchen.");
      return true;
    });
  });
}

test("transport exceptions are displayed safely without database detail", async () => {
  await assert.rejects(loadIncomingContactSummary({ from() { throw new Error("private network detail"); } }), /Die Anzahl der Kundenkontakte konnte nicht geladen werden/);
});

test("the aggregate endpoint requires the existing admin middleware", () => {
  const source = readFileSync(new URL("../src/lib/incoming-contact-summary.functions.ts", import.meta.url), "utf8");
  assert.match(source, /\.middleware\(\[requireAdmin\]\)/);
  assert.match(source, /loadIncomingContactSummary\(supabaseAdmin\)/);
});
