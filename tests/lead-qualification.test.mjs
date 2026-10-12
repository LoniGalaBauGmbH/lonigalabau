import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(name) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { module, exports: module.exports, Date, Intl, Buffer, console, URL,
    require: (id) => id.startsWith("./") ? load(id.slice(2)) : require(id),
  });
  return module.exports;
}
const { discoverySourceSchema, leadQualificationUpdateSchema } = load("lead-qualification");
const { loadLeadQualificationSummary, saveLeadQualification } = load("lead-qualification.server");
const { incomingTodayWindow } = load("incoming-contact-summary");
const now = new Date("2026-10-12T10:00:00Z");
const id = "11111111-1111-4111-8111-111111111111";

test("optional discovery answer stays unknown and accepts only the fixed choices", () => {
  assert.equal(discoverySourceSchema.parse(undefined), undefined);
  assert.equal(discoverySourceSchema.parse(""), undefined);
  assert.equal(discoverySourceSchema.parse("google_search"), "google_search");
  for (const value of [null, "organic", "?utm_source=google", "https://referrer.invalid", "arbitrary text"]) {
    assert.equal(discoverySourceSchema.safeParse(value).success, false);
  }
});
test("public contact validators cannot set private quality or arbitrary source metadata", () => {
  const { contactSubmissionSchema } = load("validators");
  const parsed = contactSubmissionSchema.parse({ name: "Synthetic", email: "qa@example.invalid", message: "Synthetic request", discoverySource: "recommendation", lead_qualification: "qualified", lead_qualification_version: 12, referrer: "private.invalid" });
  assert.equal(parsed.discoverySource, "recommendation");
  for (const field of ["lead_qualification", "lead_qualification_version", "referrer"]) assert.equal(field in parsed, false);
});
test("quality updates have their own validated CAS version and no status/notes fields", () => {
  assert.equal(leadQualificationUpdateSchema.safeParse({ id, qualification: "qualified", version: 0 }).success, true);
  for (const input of [{ id, qualification: "handled", version: 0 }, { id, qualification: "qualified", version: -1 }, { id, qualification: "qualified", version: 2_147_483_647 }, { id, qualification: "qualified", version: 0, status: "handled" }]) assert.equal(leadQualificationUpdateSchema.safeParse(input).success, false);
});

function updateClient({ conflict = false, error = null } = {}) {
  const calls = [];
  let update;
  const query = {
    update(value) { update = value; calls.push(["update", value]); return query; },
    eq(...args) { calls.push(["eq", ...args]); return query; },
    select(...args) { calls.push(["select", ...args]); return query; },
    async maybeSingle() { return { data: conflict ? null : update, error }; },
  };
  return { calls, from(table) { assert.equal(table, "contact_requests"); return query; } };
}
test("manual classification uses CAS without altering processing status or notes", async () => {
  const client = updateClient();
  const result = await saveLeadQualification(client, { id, qualification: "qualified", version: 2 }, now);
  assert.equal(result.qualification, "qualified"); assert.equal(result.version, 3); assert.equal(result.reviewedAt, now.toISOString());
  const update = client.calls.find(([kind]) => kind === "update")[1];
  assert.deepEqual(Object.keys(update).sort(), ["lead_qualification", "lead_qualification_reviewed_at", "lead_qualification_version"]);
  assert.ok(client.calls.some(([kind, key, value]) => kind === "eq" && key === "lead_qualification_version" && value === 2));
  assert.ok(client.calls.some(([kind, key, value]) => kind === "eq" && key === "id" && value === id));
});
test("resetting to unreviewed clears the review timestamp", async () => {
  const result = await saveLeadQualification(updateClient(), { id, qualification: "unreviewed", version: 2 }, now);
  assert.equal(result.reviewedAt, null); assert.equal(result.version, 3);
});
test("stale classifications fail rather than overwrite a newer decision", async () => {
  await assert.rejects(saveLeadQualification(updateClient({ conflict: true }), { id, qualification: "spam", version: 0 }, now), /inzwischen geändert/);
});
test("database failure is safe and does not announce saved classification", async () => {
  await assert.rejects(saveLeadQualification(updateClient({ error: { message: "private DB detail" } }), { id, qualification: "spam", version: 0 }, now), /Die Bewertung konnte nicht gespeichert werden/);
});
test("classification transport failures do not expose database or network detail", async () => {
  await assert.rejects(saveLeadQualification({ from() { throw new Error("private network detail"); } }, { id, qualification: "qualified", version: 0 }, now), /Die Bewertung konnte nicht gespeichert werden/);
});

const rows = [
  { created_at: "2026-10-12T00:00:00Z", lead_qualification: "qualified" },
  { created_at: "2026-10-12T01:00:00Z", lead_qualification: "unreviewed" },
  { created_at: "2026-10-12T02:00:00Z", lead_qualification: "spam" },
  ...["qualified", "unqualified", "duplicate", "test"].map((lead_qualification) => ({ created_at: "2026-09-20T00:00:00Z", lead_qualification })),
  { created_at: "2025-10-12T00:00:00Z", lead_qualification: "qualified" },
];
function countClient(change) {
  const calls = [];
  return { calls, from(table) {
    assert.equal(table, "contact_requests");
    const spec = { table, filters: [] };
    const query = {
      select(columns, options) { spec.select = { columns, ...options }; return query; },
      gte(key, value) { spec.filters.push(["gte", key, value]); return query; },
      lt(key, value) { spec.filters.push(["lt", key, value]); return query; },
      eq(key, value) { spec.filters.push(["eq", key, value]); return query; },
      in(key, value) { spec.filters.push(["in", key, [...value]]); return query; },
      then(resolve, reject) {
        const count = rows.filter((row) => spec.filters.every(([op, key, value]) => op === "gte" ? row[key] >= value : op === "lt" ? row[key] < value : op === "eq" ? row[key] === value : value.includes(row[key]))).length;
        const index = calls.length; calls.push(spec);
        return Promise.resolve(change?.({ count, error: null, data: null }, index) ?? { count, error: null, data: null }).then(resolve, reject);
      },
    }; return query;
  } };
}
test("today and 30-day summaries use eight exact head counts, excluding jobs and partners", async () => {
  const client = countClient(); const result = await loadLeadQualificationSummary(client, now);
  assert.equal(client.calls.length, 8);
  assert.equal(result.last30Days.incoming, 7); assert.equal(result.last30Days.qualified, 2); assert.equal(result.last30Days.unreviewed, 1); assert.equal(result.last30Days.excluded, 4);
  assert.equal(result.today.incoming, 3); assert.equal(result.today.qualified, 1); assert.equal(result.today.unreviewed, 1); assert.equal(result.today.excluded, 1);
  for (const call of client.calls) { assert.equal(call.select.head, true); assert.equal(call.select.count, "exact"); }
  assert.deepEqual(Object.keys(result).sort(), ["last30Days", "timeZone", "today"]);
});
test("a plausible zero is displayed as zero", async () => {
  const result = await loadLeadQualificationSummary(countClient(() => ({ count: 0, error: null })), now);
  assert.equal(result.last30Days.incoming, 0); assert.equal(result.today.qualified, 0);
});
test("concurrent inconsistent partial counts trigger exactly one complete retry", async () => {
  const client = countClient((result, index) => index === 0 ? { count: 99, error: null } : result);
  assert.equal((await loadLeadQualificationSummary(client, now)).last30Days.incoming, 7);
  assert.equal(client.calls.length, 16);
});
test("persistent inconsistent counts fail visibly after one retry", async () => {
  const client = countClient((result, index) => index % 8 === 0 ? { count: 99, error: null } : result);
  await assert.rejects(loadLeadQualificationSummary(client, now), /nicht verfügbar/);
  assert.equal(client.calls.length, 16);
});
test("an unavailable aggregate never becomes an empty success", async () => {
  for (const result of [{ count: null, error: null }, { count: 0, error: { message: "private DB detail" } }, { count: -1, error: null }]) await assert.rejects(loadLeadQualificationSummary(countClient(() => result), now), /nicht verfügbar/);
});
test("today uses Berlin midnight and correctly spans the two daylight saving transitions", () => {
  for (const [date, hours] of [["2026-03-29T12:00:00Z", 23], ["2026-10-25T12:00:00Z", 25]]) {
    const period = incomingTodayWindow(new Date(date));
    assert.equal((Date.parse(period.end) - Date.parse(period.start)) / 3_600_000, hours);
    assert.equal(period.startDate, period.endDate);
  }
});
test("Express and project builders forward voluntary source but leave it optional", () => {
  const { buildExpressPayload } = load("express-inquiry");
  const input = { firstName: "Synthetic", lastName: "Test", phone: "06190123456", email: "qa@example.invalid", service: "Erdarbeiten", description: "Synthetic project request", privacy: true };
  assert.equal(buildExpressPayload(input).discoverySource, undefined);
  assert.equal(buildExpressPayload({ ...input, discoverySource: "google_maps" }).discoverySource, "google_maps");
  const { buildInquiryPayload, INITIAL_INQUIRY } = load("project-inquiry");
  assert.equal(buildInquiryPayload({ ...INITIAL_INQUIRY, name: "Synthetic", email: "qa@example.invalid", description: "Synthetic", discoverySource: "social_media" }).discoverySource, "social_media");
});
