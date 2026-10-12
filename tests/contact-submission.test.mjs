import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(name) {
  const module = { exports: {} };
  const source = readFileSync(new URL("../src/lib/" + name + ".ts", import.meta.url), "utf8");
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
const { persistContactSubmission } = load("contact-submission.server");
const { validateContactFiles, MAX_CONTACT_FILE_BYTES } = load("contact-attachments");
const { contactSubmissionSchema } = load("validators");
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
const attachment = (extra = {}) => ({
  name: "Garten.png",
  contentType: "image/png",
  base64: png.toString("base64"),
  ...extra,
});
const lead = {
  name: "Test",
  email: "qa@example.invalid",
  message: "Synthetische Anfrage",
  attachments: [attachment()],
};
function harness({ failedUpload = 0, failedInsert = false } = {}) {
  const uploads = [],
    removals = [],
    records = [];
  const bucket = {
    upload: async (path, buffer, options) => {
      uploads.push({ path, buffer, options });
      return { error: uploads.length === failedUpload ? new Error("upload") : null };
    },
    remove: async (paths) => {
      removals.push(...paths);
      return { error: null };
    },
  };
  const client = {
    storage: {
      from: (name) => {
        assert.equal(name, "configurator-images");
        return bucket;
      },
    },
    from: (name) => {
      assert.equal(name, "contact_requests");
      return {
        insert: async (record) => {
          records.push(record);
          return { error: failedInsert ? new Error("insert") : null };
        },
      };
    },
  };
  return { client, uploads, removals, records };
}

test("files and PDF attachments are linked to the contact only after successful uploads", async () => {
  const h = harness();
  const pdf = attachment({
    name: "Gartenplan.pdf",
    contentType: "application/pdf",
    base64: Buffer.from("%PDF-1.7\n").toString("base64"),
  });
  await persistContactSubmission(h.client, { ...lead, attachments: [attachment(), pdf] });
  assert.equal(h.uploads.length, 2);
  assert.equal(h.records.length, 1);
  assert.equal(h.records[0].ticket_format_version, 2);
  assert.equal(h.records[0].ticket_number, undefined, "database assigns the number");
  assert.equal(h.records[0].image_paths.join(), h.uploads.map((file) => file.path).join());
  assert.equal(h.uploads[1].options.metadata.originalName, "Gartenplan.pdf");
  assert.equal(h.uploads[1].options.upsert, false);
  assert.match(h.uploads[1].path, /^[0-9a-f-]{36}\.pdf$/);
  assert.equal(h.removals.length, 0);
});

test("voluntary source is stored separately while public callers cannot qualify themselves", async () => {
  const h = harness();
  await persistContactSubmission(h.client, { ...lead, discoverySource: "google_search", lead_qualification: "qualified", lead_qualification_version: 7, referrer: "private.invalid" });
  assert.equal(h.records[0].discovery_source, "google_search");
  assert.equal(h.records[0].lead_qualification, undefined);
  assert.equal(h.records[0].lead_qualification_version, undefined);
  assert.equal(h.records[0].referrer, undefined);
  const empty = harness();
  await persistContactSubmission(empty.client, { ...lead, discoverySource: "" });
  assert.equal(empty.records[0].discovery_source, undefined);
});

test("forged attachments fail validation before any storage or database write", async () => {
  const h = harness();
  await assert.rejects(
    () =>
      persistContactSubmission(h.client, {
        ...lead,
        attachments: [
          attachment(),
          attachment({ base64: Buffer.from("<script>bad</script>").toString("base64") }),
        ],
      }),
    /Dateiformat/,
  );
  assert.equal(h.uploads.length + h.records.length, 0);
});

test("a partial upload failure removes only files created by that submission", async () => {
  const h = harness({ failedUpload: 2 });
  await assert.rejects(
    () =>
      persistContactSubmission(h.client, { ...lead, attachments: [attachment(), attachment()] }),
    /hochgeladen/,
  );
  assert.equal(h.removals.join(), h.uploads[0].path);
  assert.equal(h.records.length, 0);
});

test("a failed contact insert removes newly uploaded files", async () => {
  const h = harness({ failedInsert: true });
  await assert.rejects(() => persistContactSubmission(h.client, lead), /gespeichert/);
  assert.equal(h.removals.join(), h.uploads[0].path);
});

test("a public submission cannot claim another request's existing private attachment", async () => {
  const h = harness();
  const previous = "11111111-1111-4111-8111-111111111111.jpg";
  await assert.rejects(
    () =>
      persistContactSubmission(h.client, {
        name: lead.name,
        email: lead.email,
        message: lead.message,
        image_paths: [previous],
      }),
    /neu hoch/,
  );
  assert.equal(h.records.length + h.uploads.length + h.removals.length, 0);
});

test("limits and formats are enforced in both the picker and submission schema", () => {
  const file = { name: "plan.pdf", type: "application/pdf", size: 100 };
  assert.equal(validateContactFiles([file], 0), "");
  assert.match(validateContactFiles([file], 10), /bis zu 10/);
  assert.match(validateContactFiles([{ ...file, size: MAX_CONTACT_FILE_BYTES + 1 }], 0), /5 MB/);
  assert.match(
    validateContactFiles([{ ...file, name: "script.svg", type: "image/svg+xml" }], 0),
    /Dateiformate/,
  );
  assert.match(validateContactFiles([{ ...file, size: 0 }], 0), /Leere/);
  assert.equal(
    contactSubmissionSchema.safeParse({ ...lead, attachments: Array(11).fill(attachment()) })
      .success,
    false,
  );
  assert.equal(
    contactSubmissionSchema.safeParse({
      ...lead,
      image_paths: Array(3).fill("11111111-1111-4111-8111-111111111111.jpg"),
    }).success,
    false,
  );
});

test("oversize content is rejected on the server even if browser checks are bypassed", async () => {
  const h = harness();
  const bytes = Buffer.alloc(MAX_CONTACT_FILE_BYTES + 1);
  png.copy(bytes);
  await assert.rejects(() =>
    persistContactSubmission(h.client, {
      ...lead,
      attachments: [attachment({ base64: bytes.toString("base64") })],
    }),
  );
  assert.equal(h.uploads.length + h.records.length, 0);
});

test("ten attachments and exactly 20 MiB persist, but a one-byte total overflow writes nothing", async () => {
  const bytes = Buffer.alloc(2 * 1024 * 1024);
  png.copy(bytes);
  const files = Array.from({ length: 10 }, (_, i) =>
    attachment({ name: `Foto-${i}.png`, base64: bytes.toString("base64") }),
  );
  const good = harness();
  await persistContactSubmission(good.client, { ...lead, attachments: files });
  assert.equal(good.uploads.length, 10);
  assert.equal(good.records[0].image_paths.length, 10);
  const bad = harness();
  const oversized = [...files];
  oversized[9] = attachment({
    base64: Buffer.concat([bytes, Buffer.from([0])]).toString("base64"),
  });
  await assert.rejects(
    () => persistContactSubmission(bad.client, { ...lead, attachments: oversized }),
    /zusammen maximal 20 MB/,
  );
  assert.equal(bad.uploads.length + bad.records.length, 0);
  await assert.rejects(
    () => persistContactSubmission(bad.client, { ...lead, attachments: [...files, attachment()] }),
    /höchstens 10/,
  );
  assert.equal(bad.uploads.length + bad.records.length, 0);
});

test("the picker counts total bytes across separate selections and allows removal to free capacity", () => {
  const file = { name: "Plan.pdf", type: "application/pdf", size: 2 * 1024 * 1024 };
  assert.equal(validateContactFiles([file], 9, 18 * 1024 * 1024), "");
  assert.match(
    validateContactFiles([{ ...file, size: file.size + 1 }], 9, 18 * 1024 * 1024),
    /zusammen maximal 20 MB/,
  );
  assert.equal(validateContactFiles([{ ...file, size: file.size + 1 }], 8, 16 * 1024 * 1024), "");
  assert.equal(validateContactFiles(Array(10).fill({ ...file, size: 100 }), 0), "");
});
