import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(relative) {
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(
    readFileSync(new URL(relative, import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  );
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    require: (name) =>
      name.startsWith("./") ? load("../src/lib/" + name.slice(2) + ".ts") : require(name),
  });
  return module.exports;
}
const p = load("../src/lib/garden-planner.ts");
function plan(ids = ["pflaster"]) {
  const s = structuredClone(p.INITIAL_PLANNER);
  Object.assign(s, {
    services: ids,
    clientType: "Privat",
    zip: "65795",
    city: "Hattersheim",
    name: "Testperson",
    email: "test@example.invalid",
    consent: true,
    notes: "Wir möchten unseren Garten neu gestalten.",
  });
  for (const t of p.TRADES.filter((t) => ids.includes(t.id)))
    s.details[t.id] = Object.fromEntries(
      t.questions.map((q) => [q.id, q.options ? q.options[0] : String(Math.min(q.max, 20))]),
    );
  for (const [key, qs] of [
    ["site", p.SITE_QUESTIONS],
    ["frame", p.FRAME_QUESTIONS],
  ])
    s[key] = Object.fromEntries(qs.map((q) => [q.id, q.options[0]]));
  return s;
}
test("planner supports all trades and explicit unknown measurements without assumptions", () => {
  for (const t of p.TRADES) {
    const s = plan([t.id]);
    for (const q of t.questions) s.details[t.id][q.id] = p.OPEN;
    assert.equal(p.plannerStateSchema.safeParse(s).success, true, t.id);
    const payload = p.buildPlannerPayload(s);
    assert.ok(payload.message.includes(p.OPEN));
    assert.ok(payload.message.includes(t.title.toUpperCase()));
  }
  assert.ok(Object.keys(p.validatePlannerStep(p.INITIAL_PLANNER, "project")).length);
});
test("conditional questions follow selection and stale answers never enter the briefing", () => {
  const s = plan(["zaun"]);
  s.details.zaun.gate = "Gartentor";
  delete s.details.zaun.gateWidth;
  assert.ok(p.validatePlannerStep(s, "zaun")["zaun.gateWidth"]);
  s.details.zaun.gateWidth = "1,25";
  assert.equal(Object.keys(p.validatePlannerStep(s, "zaun")).length, 0);
  assert.match(p.buildPlannerPayload(s).message, /Torbreite: ca. 1,25 m/);
  s.details.zaun.gate = "Kein Tor";
  assert.doesNotMatch(p.buildPlannerPayload(s).message, /Torbreite/);
  s.services = ["pflaster"];
  s.details.pflaster = plan().details.pflaster;
  assert.doesNotMatch(p.buildPlannerPayload(s).message, /ZAUN|Torbreite/);
});
test("invalid contact, missing consent and unfinished earlier steps cannot submit", () => {
  const s = plan();
  s.consent = false;
  assert.equal(p.plannerStateSchema.safeParse(s).success, false);
  s.consent = true;
  s.email = "wrong";
  assert.throws(() => p.buildPlannerPayload(s));
  s.email = "test@example.invalid";
  s.channel = "Telefon";
  s.phone = "";
  assert.ok(p.validatePlannerStep(s, "review").phone);
  s.phone = "+49 6190 123456";
  s.zip = "123";
  assert.equal(p.plannerStateSchema.safeParse(s).success, false);
  s.zip = "65795";
  s.details.pflaster.material = "invented";
  assert.equal(p.plannerStateSchema.safeParse(s).success, false);
});
test("decimal measurements and rectangular area/volume calculation reject invalid values", () => {
  assert.equal(p.rectangleMeasure("4,5", "6"), 27);
  assert.equal(p.rectangleMeasure("4", "5", "0,3"), 6);
  for (const bad of ["0", "-1", "1e3", "NaN", "2..2", "9999999"])
    assert.equal(p.validMeasure(bad), false, bad);
  assert.equal(p.rectangleMeasure("-2", "3"), null);
  assert.equal(p.rectangleMeasure("1000", "1000"), null);
  const s = plan(["naturstein"]);
  s.details.naturstein.type = "Treppe / Stufen";
  s.details.naturstein.steps = "1,5";
  assert.ok(p.validatePlannerStep(s, "naturstein")["naturstein.steps"]);
});
test("orientation route works without fake service specifications but requires a description", () => {
  const s = plan(["beratung"]);
  s.notes = "";
  assert.ok(p.validatePlannerStep(s, "photos").notes);
  s.notes = "Ich wünsche mir einen pflegeleichten Garten.";
  assert.equal(p.plannerSteps(s).length, 5);
  assert.equal(p.plannerStateSchema.safeParse(s).success, true);
  assert.match(p.buildPlannerPayload(s).message, /Beratung \/ Orientierung/);
  s.services.push("pflaster");
  assert.ok(p.validatePlannerStep(s, "project").services);
});
test("largest supported complete briefing preserves every answer within the contact database limit", () => {
  const s = plan(p.TRADES.map((t) => t.id));
  s.street = "S".repeat(100);
  s.city = "O".repeat(60);
  s.deadline = "T".repeat(80);
  s.notes = "N".repeat(600);
  for (const t of p.TRADES)
    for (const q of t.questions)
      s.details[t.id][q.id] = q.options
        ? [...q.options].sort((a, b) => b.length - a.length)[0]
        : String(q.max);
  s.details.zaun.gate = "Einfahrtstor";
  s.details.naturstein.type = "Stützmauer am Hang";
  s.details.pflege.work = "Hecken / Gehölze";
  for (const [key, qs] of [
    ["site", p.SITE_QUESTIONS],
    ["frame", p.FRAME_QUESTIONS],
  ])
    for (const q of qs) s[key][q.id] = [...q.options].sort((a, b) => b.length - a.length)[0];
  const payload = p.buildPlannerPayload(s);
  assert.ok(payload.message.length <= 5000);
  assert.ok(payload.message.includes(s.notes));
  for (const t of p.TRADES) assert.ok(payload.message.includes(t.title.toUpperCase()));
  assert.ok(payload.subject.length <= 200);
});
test("download includes attachments and contact, while briefing remains readable in admin", () => {
  const s = plan();
  const text = p.plannerText(s, ["Garten.jpg", "Plan.pdf"]);
  assert.match(text, /Garten.jpg/);
  assert.match(text, /Plan.pdf/);
  assert.match(text, /test@example.invalid/);
  assert.ok(p.plannerOpenPoints(s).includes("Genaue Projektadresse"));
  const draft = { ...s, name: "", email: "", phone: "", consent: false };
  assert.equal(p.plannerDraftSchema.safeParse(draft).success, true);
});
