import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(relative) {
  const module = { exports: {} };
  const source = readFileSync(new URL(relative, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    require: (name) =>
      name.startsWith("./") ? load("../src/lib/" + name.slice(2) + ".ts") : require(name),
  });
  return module.exports;
}
const { INITIAL_INQUIRY, validateInquiryStep, buildInquiryPayload } = load(
  "../src/lib/project-inquiry.ts",
);
const valid = {
  ...INITIAL_INQUIRY,
  service: "Pflasterarbeiten",
  description: "Unsere Terrasse soll erneuert werden.",
  name: "Testperson",
  email: "test@example.com",
  consent: true,
};

test("early steps require project details but do not require contact details", () => {
  assert.ok(validateInquiryStep(INITIAL_INQUIRY, 0).service);
  assert.equal(
    Object.keys(validateInquiryStep({ ...INITIAL_INQUIRY, service: "Noch unsicher" }, 0)).length,
    0,
  );
  assert.ok(validateInquiryStep({ ...valid, description: "   " }, 1).description);
  assert.equal(
    Object.keys(validateInquiryStep({ ...valid, name: "", email: "", consent: false }, 1)).length,
    0,
  );
});

test("final step rejects missing consent and invalid contact details", () => {
  const errors = validateInquiryStep(
    { ...valid, email: "not-an-email", name: " ", consent: false },
    2,
  );
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.consent);
  assert.equal(Object.keys(validateInquiryStep(valid, 2)).length, 0);
});

test("phone is required only when a phone-based contact channel is chosen", () => {
  for (const channel of ["Telefon", "WhatsApp"]) {
    assert.ok(validateInquiryStep({ ...valid, channel }, 2).phone);
    assert.ok(validateInquiryStep({ ...valid, channel, phone: "+---" }, 2).phone);
    assert.equal(
      validateInquiryStep({ ...valid, channel, phone: "+49 6190 123456" }, 2).phone,
      undefined,
    );
  }
  assert.equal(validateInquiryStep({ ...valid, phone: "" }, 2).phone, undefined);
});

test("optional area can be omitted but cannot be zero or malformed", () => {
  assert.equal(validateInquiryStep(valid, 1).area, undefined);
  for (const area of ["0", "-1", "abc"]) assert.ok(validateInquiryStep({ ...valid, area }, 1).area);
  assert.equal(validateInquiryStep({ ...valid, area: "150" }, 1).area, undefined);
});

test("submission preserves answers from every step and respects the server schema", () => {
  const payload = buildInquiryPayload({
    ...valid,
    name: " Testperson ",
    email: " test@example.com ",
    area: "150",
    budget: "10.000 – 25.000 €",
    zip: "65795 Hattersheim",
    timeframe: "3–6 Monate",
    channel: "Telefon",
    phone: "06190 123456",
  });
  assert.equal(payload.name, "Testperson");
  assert.equal(payload.email, "test@example.com");
  assert.equal(payload.subject, "Projektanfrage: Pflasterarbeiten – Privatgarten");
  for (const answer of [
    "150 m²",
    "10.000 – 25.000 €",
    "65795 Hattersheim",
    "3–6 Monate",
    "Telefon",
    valid.description,
  ])
    assert.ok(payload.message.includes(answer));
  assert.equal(payload.phone, "06190 123456");
  assert.equal(payload.image_paths.length, 0);
  assert.doesNotThrow(() =>
    buildInquiryPayload({ ...valid, description: "a".repeat(4000), zip: "b".repeat(120) }),
  );
});
