import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source = readFileSync(
  new URL("../src/lib/submission-notification.server.ts", import.meta.url),
  "utf8",
);
const ticketModule = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(new URL("../src/lib/submission-ticket.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText,
  { module: ticketModule, exports: ticketModule.exports },
);
const emailModule = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(new URL("../src/lib/submission-email.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText,
  { module: emailModule, exports: emailModule.exports, require: () => ticketModule.exports },
);
const logoModule = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(new URL("../src/lib/email-logo-assets.server.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText,
  { module: logoModule, exports: logoModule.exports },
);
function harness({ sent = false, failed = false, missingKey = false, missingFile = false } = {}) {
  const module = { exports: {} };
  const calls = [],
    updates = [];
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      module,
      exports: module.exports,
      require: (name) => {
        if (name === "./submission-ticket") return ticketModule.exports;
        if (name === "./email-logo-assets.server") return logoModule.exports;
        assert.equal(name, "./submission-email");
        return emailModule.exports;
      },
      Buffer,
      AbortSignal,
      process: {
        env: missingKey
          ? {}
          : { RESEND_API_KEY: "test-key", RESEND_FROM: "Website <mail@example.invalid>" },
      },
      console: { info() {}, error() {} },
      fetch: async (url, options) => {
        calls.push({ url, options });
        return { ok: !failed, status: failed ? 503 : 200, json: async () => ({ id: "mail-id" }) };
      },
    },
  );
  const record = {
    id: "11111111-1111-4111-8111-111111111111",
    ticket_number: 1042,
    ticket_format_version: 2,
    name: "<img onerror='bad'>",
    email: "qa@example.invalid",
    phone: "123",
    subject: "Garten\nTest",
    message: "Wünsche & Maße <script>bad</script>",
    image_paths: ["test.pdf"],
    notification_sent_at: sent ? "2026-09-29" : null,
  };
  const query = {
    select: () => query,
    eq: () => query,
    single: async () => ({ data: record, error: null }),
    update: (data) => {
      updates.push(data);
      return { eq: async () => ({ error: null }) };
    },
  };
  const client = {
    from: () => query,
    storage: {
      from: () => ({
        download: async () => ({
          data: missingFile ? null : new Blob(["%PDF-1.7 test"]),
          error: missingFile,
        }),
        info: async () => ({ data: { metadata: { originalName: "Plan.pdf" } } }),
      }),
    },
  };
  return { ...module.exports, client, record, calls, updates };
}
test("notification goes only to the chosen company mailbox and includes all fields and attachment", async () => {
  const h = harness();
  await h.notifySavedSubmission(h.client, "contact_requests", h.record.id);
  const body = JSON.parse(h.calls[0].options.body);
  assert.equal(body.to.join(), "webseite@loni-galabau.de");
  assert.equal(body.reply_to, h.record.email);
  assert.match(body.text, /123/);
  assert.ok(body.text.includes(h.record.message));
  assert.equal(body.attachments[0].filename, "Plan.pdf");
  assert.equal(Buffer.from(body.attachments[0].content, "base64").toString(), "%PDF-1.7 test");
  assert.ok(!body.html.includes("<script>"));
  assert.ok(!body.subject.includes("\n"));
  assert.equal(h.calls[0].options.headers["Idempotency-Key"], "contact_requests/" + h.record.id);
  assert.equal(h.updates.length, 1);
  assert.equal(body.attachments.length, 3);
  for (const id of ["loni-logo", "gartenverband-logo"]) {
    const image = body.attachments.find((a) => a.content_id === id);
    assert.equal(image.content_type, "image/png");
    assert.equal(Buffer.from(image.content, "base64").subarray(1, 4).toString(), "PNG");
    assert.ok(body.html.includes("cid:" + id));
  }
});
test("already accepted notification is not sent again", async () => {
  const h = harness({ sent: true });
  await h.notifySavedSubmission(h.client, "contact_requests", h.record.id);
  assert.equal(h.calls.length, 0);
});

test("phone-only callback notifications include the requested time without an invalid reply-to", () => {
  const h = harness();
  const message = h.notificationMessage(
    {
      ...h.record,
      email: null,
      subject: "Rückrufwunsch: 02.10.2026",
      message:
        "RÜCKRUF · Wunschzeitpunkt\nVorname: Anna\nNachname: Müller\nWunschdatum: 02.10.2026\nWunschuhrzeit: 10:30 Uhr (Europe/Berlin)",
    },
    "contact_requests",
    "",
    [],
  );
  assert.equal(Object.hasOwn(message, "reply_to"), false);
  assert.equal(message.to.join(), "webseite@loni-galabau.de");
  for (const part of [message.html, message.text]) {
    assert.ok(part.includes("10:30 Uhr"));
    assert.ok(part.includes("A-1042"));
    assert.ok(part.includes("Bitte rufen Sie"));
    assert.ok(!part.includes("auf diese E-Mail antworten"));
  }
});

test("old pending notifications keep identical content after adding database ticket numbers", () => {
  const h = harness();
  const previous = { ...h.record, ticket_number: undefined, ticket_format_version: undefined };
  const migrated = { ...h.record, ticket_format_version: 1 };
  for (const table of ["contact_requests", "applications"]) {
    assert.deepEqual(
      h.notificationMessage(previous, table, "", []),
      h.notificationMessage(migrated, table, "", []),
    );
  }
});
test("all form notifications show the same compact reference in subject, HTML and plain text", () => {
  const h = harness();
  for (const [table, subject] of [
    ["contact_requests", "Kontakt"],
    ["contact_requests", "Projektanfrage: Terrasse"],
    ["contact_requests", "Gartenplaner: Pflaster"],
    ["applications", "Bewerbung"],
  ]) {
    const message = h.notificationMessage({ ...h.record, subject }, table, "", []);
    const ticket = ticketModule.exports.submissionTicket(
      h.record.id,
      table === "applications",
      h.record,
    );
    for (const part of [message.subject, message.html, message.text]) {
      assert.ok(part.includes(ticket));
      assert.ok(!part.includes(h.record.id));
    }
    assert.equal(message.tags.find((tag) => tag.name === "submission_id").value, h.record.id);
  }
});
test("missing configuration, unavailable attachments and provider failures leave notifications pending", async () => {
  for (const config of [{ failed: true }, { missingKey: true }, { missingFile: true }]) {
    const h = harness(config);
    const result = await h.attemptSubmissionNotification(h.client, "contact_requests", h.record.id);
    assert.equal(result.sent, false);
    assert.equal(h.updates.length, 0);
  }
});
