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
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      module,
      exports: module.exports,
      Buffer,
      console,
      require: (id) => (id.startsWith("./") ? load(id.slice(2)) : require(id)),
    },
  );
  return module.exports;
}
const api = load("express-inquiry");
const { contactSubmissionSchema } = load("validators");
const { persistContactSubmission } = load("contact-submission.server");
const { renderSubmissionEmail, emailSections } = load("submission-email");
const valid = {
  firstName: " Anna ",
  lastName: " Müller ",
  phone: "+49 176 12345678",
  email: "anna@example.invalid",
  service: "Pflasterarbeiten",
  address: "",
  description: "Terrasse neu pflastern, etwa 30 m².",
  privacy: true,
  website: "",
};
const pdf = {
  name: "Skizze.pdf",
  contentType: "application/pdf",
  base64: Buffer.from("%PDF-1.7\n").toString("base64"),
};
test("playground inquiry preserves service, public landing page and PDF plans through submission", async () => {
  const input = api.expressSubmissionSchema.parse({
    ...valid,
    service: "Spielplatzbau",
    inquiryPage: "/spielplatzbau",
    description: "Kita-Außengelände mit neuer Spielanlage; Lageplan anbei.",
    attachments: [pdf],
  });
  const payload = api.buildExpressPayload(input);
  assert.equal(contactSubmissionSchema.safeParse(payload).success, true);
  assert.match(payload.message, /Spielplatzbau/);
  assert.equal(payload.inquiryPage, "/spielplatzbau");
  assert.equal(payload.attachments[0].name, "Skizze.pdf");
  const h = harness();
  await persistContactSubmission(h.client, payload);
  assert.match(h.records[0].message, /https:\/\/www\.loni-galabau\.de\/spielplatzbau/);
});
for (const inquiryPage of ["/holzterrasse-bad-soden", "/holzterrasse-bauen-lassen"]) {
  test(`wood terrace inquiry preserves service and ${inquiryPage} through storage`, async () => {
    const input = api.expressSubmissionSchema.parse({
      ...valid,
      service: "Holzterrassenbau",
      inquiryPage,
      description: "Holzterrasse in Bad Soden erneuern, ungefähr 30 m².",
      attachments: [pdf],
    });
    const payload = api.buildExpressPayload(input);
    assert.equal(contactSubmissionSchema.safeParse(payload).success, true);
    assert.match(payload.message, /Holzterrassenbau/);
    assert.equal(payload.inquiryPage, inquiryPage);
    const h = harness();
    await persistContactSubmission(h.client, payload);
    assert.ok(h.records[0].message.includes(`https://www.loni-galabau.de${inquiryPage}`));
    assert.equal(h.uploads.length, 1);
  });
}

function harness() {
  const uploads = [],
    records = [];
  const client = {
    storage: {
      from: () => ({
        upload: async (path, buffer, options) => {
          uploads.push({ path, buffer, options });
          return { error: null };
        },
        remove: async () => ({ error: null }),
      }),
    },
    from: () => ({
      insert: async (record) => {
        records.push(record);
        return { error: null };
      },
    }),
  };
  return { client, uploads, records };
}

test("express steps allow progress before later fields and require full contact details", () => {
  assert.equal(
    api.validateExpressStep({ ...valid, service: "", description: "", privacy: false }, 0).success,
    true,
  );
  assert.equal(
    api.validateExpressStep({ ...valid, firstName: "", privacy: false }, 1).success,
    true,
  );
  for (const change of [
    { firstName: "" },
    { lastName: " " },
    { phone: "123" },
    { phone: "abc12345678" },
    { phone: "0176+++12345678" },
    { email: "" },
    { email: "bad" },
    { service: "unknown" },
    { description: "" },
    { privacy: false },
    { website: "spam" },
  ]) {
    assert.equal(
      api.expressSubmissionSchema.safeParse({ ...valid, ...change }).success,
      false,
      JSON.stringify(change),
    );
  }
  assert.equal(
    api.expressSubmissionSchema.safeParse(valid).success,
    true,
    "No callback date/time or address required",
  );
});

test("express maps all fields and valid attachments into a compatible bounded contact record", () => {
  const payload = api.buildExpressPayload({
    ...valid,
    address: " Musterstraße 1, 65795 Hattersheim ",
    attachments: [pdf],
  });
  assert.equal(payload.name, "Anna Müller");
  assert.equal(payload.email, valid.email);
  assert.equal(payload.phone, valid.phone);
  assert.equal(payload.subject, "Express-Anfrage: Pflasterarbeiten");
  assert.ok(payload.message.includes("Musterstraße 1, 65795 Hattersheim"));
  assert.ok(payload.message.includes(valid.description));
  assert.equal(payload.attachments[0].base64, pdf.base64);
  assert.equal(contactSubmissionSchema.safeParse(payload).success, true);
  assert.ok(api.buildExpressPayload(valid).message.includes("Noch nicht angegeben"));
  const longest = api.buildExpressPayload({
    ...valid,
    firstName: "a".repeat(90),
    lastName: "b".repeat(90),
    description: "d".repeat(3000),
    address: "a".repeat(300),
  });
  assert.equal(contactSubmissionSchema.safeParse(longest).success, true);
  assert.equal(
    api.expressSubmissionSchema.safeParse({ ...valid, description: "d".repeat(3001) }).success,
    false,
  );
});

test("express rejects claimed existing files, unsupported types and excess files", () => {
  for (const extra of [
    { image_paths: ["private.pdf"] },
    { attachments: Array(11).fill(pdf) },
    { attachments: [{ ...pdf, contentType: "image/svg+xml" }] },
    { attachments: [{ ...pdf, base64: "" }] },
  ]) {
    assert.equal(api.expressSubmissionSchema.safeParse({ ...valid, ...extra }).success, false);
  }
});

test("express attachment validation checks exact decoded size before writes", async () => {
  const max = 5 * 1024 * 1024;
  const buffer = Buffer.alloc(max, 32);
  Buffer.from("%PDF-1.7\n").copy(buffer);
  const maximum = { ...pdf, base64: buffer.toString("base64") };
  const h = harness();
  await persistContactSubmission(
    h.client,
    api.buildExpressPayload({ ...valid, attachments: Array(3).fill(maximum) }),
  );
  assert.equal(h.uploads.length, 3);
  assert.equal(h.records[0].image_paths.length, 3);
  assert.equal(h.uploads[0].buffer.length, max);
  assert.equal(h.uploads[0].options.metadata.originalName, pdf.name);
  const tooLarge = { ...pdf, base64: Buffer.concat([buffer, Buffer.from("x")]).toString("base64") };
  assert.equal(
    tooLarge.base64.length,
    maximum.base64.length,
    "base64 length alone is insufficient",
  );
  const bad = harness();
  await assert.rejects(
    () =>
      persistContactSubmission(
        bad.client,
        api.buildExpressPayload({ ...valid, attachments: [tooLarge] }),
      ),
    /5 MB/,
  );
  assert.equal(bad.uploads.length + bad.records.length, 0);
});

test("express validates every attachment signature before writing the first file", async () => {
  const h = harness();
  await assert.rejects(
    () =>
      persistContactSubmission(
        h.client,
        api.buildExpressPayload({
          ...valid,
          attachments: [pdf, { ...pdf, base64: Buffer.from("Not a PDF").toString("base64") }],
        }),
      ),
    /Dateiformat/,
  );
  assert.equal(h.uploads.length + h.records.length, 0);
});

test("express mail has structured project details and escapes user text without callback promises", () => {
  const payload = api.buildExpressPayload({
    ...valid,
    address: "Straße 1\nBeschreibung:\nAndere",
    description: "<script>test</script>\nGewünschte Leistung: fremd",
  });
  const record = {
    ...payload,
    id: "12345678-abcd-4321-a123-1234abcdef01",
    ticket_number: 1042,
    ticket_format_version: 2,
  };
  const parsed = emailSections(record, false);
  assert.equal(parsed.sections.length, 2);
  assert.equal(parsed.sections[0].rows[1][1], "Straße 1, Beschreibung:, Andere");
  assert.equal(parsed.sections[1].text, "<script>test</script>\nGewünschte Leistung: fremd");
  const mail = renderSubmissionEmail(
    record,
    false,
    "",
    ["Skizze.pdf"],
    "https://www.loni-galabau.de/admin/anfragen",
  );
  for (const body of [mail.html, mail.text]) {
    assert.match(body, /Neue Express-Anfrage/i);
    assert.match(body, /Pflasterarbeiten/);
    assert.match(body, /A-1042/);
    assert.doesNotMatch(body, /Wunschzeitpunkt|Rückrufwunsch/);
  }
  assert.ok(mail.html.includes("&lt;script&gt;"));
  assert.ok(!mail.html.includes("<script>"));
});
