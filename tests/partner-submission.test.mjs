import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(name) {
  const module = { exports: {} };
  const source = fs.readFileSync(new URL("../src/lib/" + name + ".ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    Buffer,
    console,
    require: (id) => (id.startsWith("./") ? load(id.slice(2)) : require(id)),
  });
  return module.exports;
}
const { persistPartnerSubmission } = load("partner-submission.server");
const { partnerSubmissionSchema, berlinToday } = load("partner-application");
const { submissionTicket } = load("submission-ticket");
export const fixture = {
  company_name: "SYSTEMTEST Partner GmbH",
  legal_form: "GmbH",
  street: "Auf der Roos 3",
  postal_code: "65795",
  city: "Hattersheim",
  country: "DE",
  name: "SYSTEMTEST",
  email: "qa@example.invalid",
  phone: "+49 6190 9266134",
  trades: ["Pflasterarbeiten"],
  other_trade: "",
  service_area: "Rhein-Main",
  workforce: "employees",
  team_size: 3,
  availability: "nach_absprache",
  available_from: "",
  uses_subcontractors: false,
  message: "SYSTEMTEST – keine echte Bewerbung",
  certificate_valid_until: "2099-12-31",
  vat_certificate_valid_until: "2099-12-31",
  privacy: true,
  website: "",
  request_token: "11111111-1111-4111-8111-111111111111",
  document: {
    name: "SYSTEMTEST.pdf",
    contentType: "application/pdf",
    base64: Buffer.from("%PDF-1.7\nSYSTEMTEST\n%%EOF").toString("base64"),
  },
};
fixture.vat_document = { ...fixture.document, name: "SYSTEMTEST-13b.pdf" };
function harness(config = {}) {
  const records = [],
    uploads = [],
    removed = [];
  let reads = 0;
  const bucket = {
    upload: async (path) => {
      if (config.uploadError || (config.secondUploadError && uploads.length === 1))
        return { error: true };
      uploads.push(path);
      return { error: null };
    },
    remove: async (paths) => {
      removed.push(...paths);
      return { error: null };
    },
  };
  const client = {
    storage: {
      from: (name) => {
        assert.equal(name, "partner-documents");
        return bucket;
      },
    },
    from: (table) => {
      assert.equal(table, "partner_applications");
      let candidate, token;
      const q = {
        select: () => q,
        eq: (_key, value) => {
          token = value;
          return q;
        },
        maybeSingle: async () => {
          reads++;
          if (config.lookupFailsAfterInsert && reads > 1) return { error: true };
          return { data: records.find((r) => r.request_token === token) || null, error: null };
        },
        insert: (data) => {
          candidate = data;
          return q;
        },
        single: async () => {
          await new Promise((resolve) => setTimeout(resolve, 1));
          if (config.insertError) return { error: { code: "500" } };
          if (records.some((r) => r.request_token === candidate.request_token))
            return { error: { code: "23505" } };
          const row = { ...candidate, ticket_number: 1000 };
          records.push(row);
          if (config.lostResponse) throw new Error("response lost");
          return { data: row, error: null };
        },
      };
      return q;
    },
  };
  return { client, records, uploads, removed };
}
test("partner record preserves every field with private PDF and database ticket", async () => {
  const h = harness();
  const result = await persistPartnerSubmission(h.client, fixture);
  assert.equal(result.ticket, "P-1000");
  assert.equal(h.records[0].certificate_path, h.uploads[0]);
  assert.equal(h.records[0].vat_certificate_path, h.uploads[1]);
  assert.equal(h.records[0].vat_certificate_name, fixture.vat_document.name);
  assert.equal(h.records[0].team_size, 3);
  assert.equal(h.records[0].ticket_number, 1000);
  assert.equal(h.records[0].privacy, undefined);
  assert.equal(result.certificate_path, undefined);
});
test("sequential and concurrent retries create one application and keep its certificate", async () => {
  const h = harness();
  const [a, b] = await Promise.all([
    persistPartnerSubmission(h.client, fixture),
    persistPartnerSubmission(h.client, fixture),
  ]);
  assert.equal(a.id, b.id);
  assert.equal(h.records.length, 1);
  assert.equal(h.removed.length, 2);
  assert.ok(!h.removed.includes(h.records[0].certificate_path));
  const c = await persistPartnerSubmission(h.client, fixture);
  assert.equal(c.id, a.id);
  assert.equal(h.uploads.length, 4);
  await assert.rejects(
    () => persistPartnerSubmission(h.client, { ...fixture, company_name: "Changed" }),
    /anderen Angaben/,
  );
});
test("a lost insert response preserves the committed certificate; ambiguous reads do not delete it", async () => {
  const h = harness({ lostResponse: true });
  const result = await persistPartnerSubmission(h.client, fixture);
  assert.equal(result.ticket, "P-1000");
  assert.equal(h.removed.length, 0);
  const h2 = harness({ lostResponse: true, lookupFailsAfterInsert: true });
  await assert.rejects(() => persistPartnerSubmission(h2.client, fixture));
  assert.equal(h2.records.length, 1);
  assert.equal(h2.removed.length, 0);
});
test("upload and definite insert failures leave no saved invalid application", async () => {
  const a = harness({ uploadError: true });
  await assert.rejects(() => persistPartnerSubmission(a.client, fixture));
  assert.equal(a.records.length, 0);
  const partial = harness({ secondUploadError: true });
  await assert.rejects(() => persistPartnerSubmission(partial.client, fixture));
  assert.equal(partial.removed[0], partial.uploads[0]);
  assert.equal(partial.records.length, 0);
  const b = harness({ insertError: true });
  await assert.rejects(() => persistPartnerSubmission(b.client, fixture));
  assert.deepEqual(b.removed, b.uploads);
});
test("server rejects foreign country, missing proof, old/impossible dates, unsafe names and forged PDF", async () => {
  for (const input of [
    { ...fixture, country: "AT" },
    { ...fixture, document: undefined },
    { ...fixture, vat_document: undefined },
    { ...fixture, vat_certificate_valid_until: "2000-01-01" },
    { ...fixture, vat_certificate_valid_until: "2099-02-30" },
    { ...fixture, vat_document: { ...fixture.vat_document, name: "wrong.html" } },
    {
      ...fixture,
      vat_document: { ...fixture.vat_document, base64: Buffer.from("fake pdf").toString("base64") },
    },
    { ...fixture, certificate_valid_until: "2000-01-01" },
    { ...fixture, certificate_valid_until: "2099-02-30" },
    { ...fixture, document: { ...fixture.document, name: "proof.html" } },
    { ...fixture, trades: ["Sonstige"] },
    { ...fixture, availability: "ab_datum", available_from: "2000-01-01" },
    { ...fixture, certificate_path: "someone.pdf" },
    {
      ...fixture,
      document: {
        ...fixture.document,
        base64: Buffer.from("<html>fake</html>").toString("base64"),
      },
    },
  ]) {
    const h = harness();
    await assert.rejects(() => persistPartnerSubmission(h.client, input));
    assert.equal(h.records.length + h.uploads.length, 0);
  }
  assert.equal(
    partnerSubmissionSchema.safeParse({ ...fixture, certificate_valid_until: berlinToday() })
      .success,
    true,
  );
});
test("server enforces 10 MiB and existing A/B ticket formats stay compatible", async () => {
  const h = harness();
  await assert.rejects(() =>
    persistPartnerSubmission(h.client, {
      ...fixture,
      document: {
        ...fixture.document,
        base64: Buffer.alloc(10 * 1024 * 1024 + 1).toString("base64"),
      },
    }),
  );
  assert.equal(h.uploads.length, 0);
  assert.equal(
    submissionTicket("x", false, { ticket_number: 1042, ticket_format_version: 2 }),
    "A-1042",
  );
  assert.equal(
    submissionTicket("x", true, { ticket_number: 1042, ticket_format_version: 2 }),
    "B-1042",
  );
});

test("the second PDF is included in deduplication and must obey the same size limit", async () => {
  const h = harness();
  await persistPartnerSubmission(h.client, fixture);
  await assert.rejects(
    () =>
      persistPartnerSubmission(h.client, {
        ...fixture,
        vat_document: { ...fixture.vat_document, name: "changed.pdf" },
      }),
    /anderen Angaben/,
  );
  const fresh = harness();
  await assert.rejects(() =>
    persistPartnerSubmission(fresh.client, {
      ...fixture,
      vat_document: {
        ...fixture.vat_document,
        base64: Buffer.alloc(10 * 1024 * 1024 + 1).toString("base64"),
      },
    }),
  );
  assert.equal(fresh.uploads.length, 0);
});
test("different concurrent submissions with one token clean up the losing PDF pair", async () => {
  const h = harness();
  const result = await Promise.allSettled([
    persistPartnerSubmission(h.client, fixture),
    persistPartnerSubmission(h.client, { ...fixture, company_name: "Changed concurrent request" }),
  ]);
  assert.equal(result.filter((item) => item.status === "fulfilled").length, 1);
  assert.equal(h.records.length, 1);
  assert.equal(h.removed.length, 2);
  assert.ok(!h.removed.includes(h.records[0].certificate_path));
  assert.ok(!h.removed.includes(h.records[0].vat_certificate_path));
});

test("two PDFs at the permitted maximum are accepted and preserved independently", async () => {
  const buffer = Buffer.alloc(10 * 1024 * 1024, 32);
  buffer.write("%PDF-1.7");
  const proof = { ...fixture.document, base64: buffer.toString("base64") };
  const h = harness();
  await persistPartnerSubmission(h.client, {
    ...fixture,
    document: proof,
    vat_document: { ...proof, name: "13b.pdf" },
  });
  assert.equal(h.uploads.length, 2);
  assert.notEqual(h.records[0].certificate_path, h.records[0].vat_certificate_path);
});
