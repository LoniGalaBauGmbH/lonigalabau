import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
function harness(config = {}) {
  const calls = [],
    events = [];
  const record = {
    id: "12345678-abcd-4321-a123-1234abcdef01",
    ticket_number: 1042,
    ticket_format_version: 2,
    created_at: new Date().toISOString(),
    customer_confirmation_requested_at: new Date().toISOString(),
    name: "Untrusted name",
    email: "customer@example.invalid",
    subject: config.subject || "Frage",
    message: "https://untrusted.invalid",
    image_paths: ["private.pdf"],
    ...config.record,
  };
  const env = {
    RESEND_API_KEY: "test-key",
    RESEND_FROM: "Website <website@example.invalid>",
    ...config.env,
  };
  const query = () => {
    let update,
      onlyEmpty = false;
    const q = {
      select: () => q,
      eq: () => q,
      is: () => {
        onlyEmpty = true;
        return q;
      },
      single: async () => ({
        data: config.missingRecord ? null : structuredClone(record),
        error: null,
      }),
      update: (data) => {
        update = data;
        return q;
      },
      then(resolve) {
        events.push(update.customer_confirmation_payload ? "snapshot" : "stamp");
        const error =
          (update.customer_confirmation_payload && config.snapshotFails) ||
          (update.customer_confirmation_sent_at && config.stampFails);
        if (!error && (!onlyEmpty || !record.customer_confirmation_payload))
          Object.assign(record, structuredClone(update));
        resolve({ error });
      },
    };
    return q;
  };
  const client = { from: query, storage: {} };
  const cache = {};
  function load(name) {
    if (name === "./submission-notification.server")
      return {
        NOTIFICATION_TO: "webseite@loni-galabau.de",
        attemptSubmissionNotification: async () => {
          events.push("internal");
          return { sent: !config.internalFails };
        },
      };
    if (cache[name]) return cache[name];
    const module = { exports: {} };
    const source = fs.readFileSync(
      new URL("../src/lib/" + name.replace("./", "") + ".ts", import.meta.url),
      "utf8",
    );
    vm.runInNewContext(
      ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      }).outputText,
      {
        module,
        exports: module.exports,
        require: load,
        process: { env },
        URL,
        Buffer,
        AbortSignal,
        console: { info() {}, error() {} },
        fetch: async (url, options) => {
          assert.ok(
            record.customer_confirmation_payload,
            "snapshot must exist before any provider call",
          );
          events.push("send");
          calls.push({ url, options });
          return {
            ok: !config.providerFails,
            status: config.providerFails ? 503 : 200,
            json: async () => ({ id: config.noProviderId ? undefined : "receipt-id" }),
          };
        },
      },
    );
    return (cache[name] = module.exports);
  }
  return {
    ...load("./customer-confirmation.server"),
    render: load("./customer-confirmation-email").renderCustomerConfirmation,
    client,
    calls,
    events,
    record,
    env,
    config,
  };
}
test("all form variants produce branded receipts, stable tickets, embedded photos and plain text", async () => {
  for (const [table, subject, noun] of [
    ["contact_requests", "Kontakt", "Nachricht"],
    ["contact_requests", "Rückrufwunsch: Fr., 02.10.2026 · 10:30 Uhr", "Rückrufwunsch"],
    ["contact_requests", "Projektanfrage: Terrasse", "Projektanfrage"],
    ["contact_requests", "Gartenplaner: Pflaster", "Gartenplanung"],
    ["applications", "", "Bewerbung"],
  ]) {
    const h = harness({ subject, record: { cv_path: "private-cv.pdf" } });
    await h.sendCustomerConfirmation(h.client, table, h.record.id);
    const body = JSON.parse(h.calls[0].options.body);
    assert.equal(body.to.join(), h.record.email);
    assert.equal(body.reply_to, "webseite@loni-galabau.de");
    assert.ok(body.subject.includes(noun));
    const ticket = (table === "applications" ? "B" : "A") + "-1042";
    assert.ok(body.subject.includes(ticket));
    for (const part of [body.html, body.text]) {
      assert.ok(part.includes(ticket));
      assert.ok(!part.includes(h.record.id));
      assert.ok(part.includes("1 Anhang"));
      assert.ok(!part.includes("untrusted.invalid"));
    }
    for (const cid of ["loni-logo", "gartenverband-logo", "confirmation-photo-v1"]) {
      assert.ok(body.html.includes("cid:" + cid));
      assert.ok(body.attachments.some((a) => a.content_id === cid));
    }
    assert.equal(body.attachments.length, 3, "no private attachments forwarded");
    assert.equal(body.headers["Auto-Submitted"], "auto-generated");
    assert.ok(body.html.length < 102400, "avoid Gmail clipping");
    assert.equal(h.record.customer_confirmation_email_id, "receipt-id");
    assert.deepEqual(h.events, ["snapshot", "send", "stamp"]);
  }
});
test("accepted and pre-rollout submissions do not send a confirmation", async () => {
  for (const record of [
    { customer_confirmation_sent_at: "2026-09-29" },
    { customer_confirmation_requested_at: null },
    { email: null },
  ]) {
    const h = harness({ record });
    await h.sendCustomerConfirmation(h.client, "contact_requests", h.record.id);
    assert.equal(h.calls.length, 0);
  }
});

test("older tickets retain their original receipt payload across the short-ticket rollout", async () => {
  const h = harness({ record: { ticket_format_version: 1 }, providerFails: true });
  await h.attemptCustomerConfirmation(h.client, "contact_requests", h.record.id);
  assert.ok(JSON.parse(h.calls[0].options.body).subject.includes("A-14D2PF2NWVVR1"));
  h.record.ticket_format_version = 2;
  h.config.providerFails = false;
  await h.sendCustomerConfirmation(h.client, "contact_requests", h.record.id);
  assert.equal(h.calls[0].options.body, h.calls[1].options.body);
});
test("missing record, snapshot failure and configuration failure cannot send unsaved mail", async () => {
  for (const config of [
    { missingRecord: true },
    { snapshotFails: true },
    { env: { RESEND_API_KEY: "" } },
  ]) {
    const h = harness(config);
    assert.equal(
      (await h.attemptCustomerConfirmation(h.client, "contact_requests", h.record.id)).sent,
      false,
    );
    assert.equal(h.calls.length, 0);
  }
});
test("provider and persistence failures retry the identical immutable message and idempotency key", async () => {
  for (const config of [{ providerFails: true }, { stampFails: true }, { noProviderId: true }]) {
    const h = harness(config);
    await h.attemptCustomerConfirmation(h.client, "contact_requests", h.record.id);
    assert.ok(!h.record.customer_confirmation_sent_at);
    h.record.email = "edited@example.invalid";
    h.env.RESEND_FROM = "Changed <new@example.invalid>";
    h.config.providerFails = false;
    h.config.stampFails = false;
    h.config.noProviderId = false;
    await h.sendCustomerConfirmation(h.client, "contact_requests", h.record.id);
    assert.equal(h.calls[0].options.body, h.calls[1].options.body);
    assert.equal(
      h.calls[0].options.headers["Idempotency-Key"],
      h.calls[1].options.headers["Idempotency-Key"],
    );
    assert.equal(
      h.calls[0].options.headers["Idempotency-Key"],
      "customer-confirmation/contact_requests/" + h.record.id,
    );
    await h.sendCustomerConfirmation(h.client, "contact_requests", h.record.id);
    assert.equal(h.calls.length, 2);
  }
});
test("concurrent attempts share the winning payload and provider idempotency key", async () => {
  const h = harness();
  await Promise.all([
    h.sendCustomerConfirmation(h.client, "contact_requests", h.record.id),
    h.sendCustomerConfirmation(h.client, "contact_requests", h.record.id),
  ]);
  assert.ok(h.calls.length >= 1);
  assert.equal(new Set(h.calls.map((c) => c.options.body)).size, 1);
  assert.equal(new Set(h.calls.map((c) => c.options.headers["Idempotency-Key"])).size, 1);
});
test("customer and internal mail failures never block each other's attempt", async () => {
  for (const config of [{ providerFails: true }, { internalFails: true }]) {
    const h = harness(config);
    const result = await h.attemptSubmissionEmails(h.client, "contact_requests", h.record.id);
    assert.equal(result.sent, !config.internalFails);
    assert.equal(result.confirmationSent, !config.providerFails);
    assert.ok(h.events.includes("internal"));
    assert.ok(h.events.includes("send"));
  }
});
test("expired uncertain deliveries are not replayed after the provider deduplication window", async () => {
  const h = harness({
    record: {
      customer_confirmation_requested_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  });
  assert.equal(
    (await h.attemptCustomerConfirmation(h.client, "contact_requests", h.record.id)).sent,
    false,
  );
  assert.equal(h.calls.length, 0);
});
test("public routes send receipts only after successful persistence and retry queue includes customer failures", () => {
  const source = fs.readFileSync(new URL("../src/lib/site.functions.ts", import.meta.url), "utf8");
  assert.equal((source.match(/await attemptSubmissionEmails/g) || []).length, 4);
  for (const block of source
    .split("export const ")
    .filter((b) => /createContactRequest|createGardenPlannerRequest|createApplication/.test(b))) {
    assert.ok(block.indexOf("await persist") < block.indexOf("await attemptSubmissionEmails"));
  }
  const retry = fs.readFileSync(
    new URL("../src/lib/notification-operations.server.ts", import.meta.url),
    "utf8",
  );
  assert.match(retry, /customer_confirmation_sent_at.is.null/);
  assert.match(retry, /attemptSubmissionEmails/);
});
