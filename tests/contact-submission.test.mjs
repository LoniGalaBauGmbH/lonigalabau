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
  assert.equal(h.records[0].image_paths.join(), h.uploads.map((file) => file.path).join());
  assert.equal(h.uploads[1].options.metadata.originalName, "Gartenplan.pdf");
  assert.equal(h.uploads[1].options.upsert, false);
  assert.match(h.uploads[1].path, /^[0-9a-f-]{36}\.pdf$/);
  assert.equal(h.removals.length, 0);
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

test("a failed contact insert removes newly uploaded files but not older configurator photos", async () => {
  const h = harness({ failedInsert: true });
  const previous = "11111111-1111-4111-8111-111111111111.jpg";
  await assert.rejects(
    () => persistContactSubmission(h.client, { ...lead, image_paths: [previous] }),
    /gespeichert/,
  );
  assert.equal(h.removals.join(), h.uploads[0].path);
  assert.ok(!h.removals.includes(previous));
});

test("existing contact and configurator submissions remain compatible without new attachments", async () => {
  const h = harness();
  const previous = "11111111-1111-4111-8111-111111111111.jpg";
  await persistContactSubmission(h.client, {
    name: lead.name,
    email: lead.email,
    message: lead.message,
    image_paths: [previous],
  });
  assert.equal(h.records[0].image_paths[0], previous);
  assert.equal(h.uploads.length, 0);
});

test("limits and formats are enforced in both the picker and submission schema", () => {
  const file = { name: "plan.pdf", type: "application/pdf", size: 100 };
  assert.equal(validateContactFiles([file], 0), "");
  assert.match(validateContactFiles([file], 3), /bis zu 3/);
  assert.match(validateContactFiles([{ ...file, size: MAX_CONTACT_FILE_BYTES + 1 }], 0), /5 MB/);
  assert.match(
    validateContactFiles([{ ...file, name: "script.svg", type: "image/svg+xml" }], 0),
    /Dateiformate/,
  );
  assert.match(validateContactFiles([{ ...file, size: 0 }], 0), /Leere/);
  assert.equal(
    contactSubmissionSchema.safeParse({ ...lead, attachments: Array(4).fill(attachment()) })
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
