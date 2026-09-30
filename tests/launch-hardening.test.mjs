import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { Webhook } from "svix";
const require = createRequire(import.meta.url);
function moduleAt(path, imports = {}, env = {}) {
  const source = readFileSync(new URL("../" + path, import.meta.url), "utf8");
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      module,
      exports: module.exports,
      require: (id) => imports[id] ?? require(id),
      process: { env },
      URL,
      Response,
      Request,
      Headers,
      Buffer,
      console,
    },
  );
  return module.exports;
}
const seo = moduleAt("src/lib/seo.ts");
const policy = moduleAt("src/lib/http-policy.server.ts", {
  "./seo": seo,
  "../content/ratgeber.json": JSON.parse(
    readFileSync(new URL("../src/content/ratgeber.json", import.meta.url), "utf8"),
  ),
});

test("public image settings reject tracking origins, private buckets and origin lookalikes", () => {
  const validators = moduleAt("src/lib/validators.ts", {
    "./contact-attachments": moduleAt("src/lib/contact-attachments.ts"),
    "./application-document": moduleAt("src/lib/application-document.ts"),
  });
  const schema = validators.publicImageUrlSchema;
  for (const url of [
    "",
    "/images/team.webp",
    "https://fvctfguvupdcscthrxeb.supabase.co/storage/v1/object/public/project-images/team.webp",
  ]) {
    assert.equal(schema.safeParse(url).success, true, url);
  }
  for (const url of [
    "//tracker.example/pixel",
    "/\\tracker.example/pixel",
    "https://tracker.example/pixel",
    "https://fvctfguvupdcscthrxeb.supabase.co.evil.test/storage/v1/object/public/project-images/a.png",
    "https://fvctfguvupdcscthrxeb.supabase.co:8443/storage/v1/object/public/project-images/a.png",
    "https://fvctfguvupdcscthrxeb.supabase.co/storage/v1/object/sign/cvs/private.pdf?token=x",
  ]) {
    assert.equal(schema.safeParse(url).success, false, url);
  }
  const headers = policy.secureResponse(
    new Request("https://www.loni-galabau.de"),
    new Response(),
  ).headers;
  assert.equal(headers.get("referrer-policy"), "no-referrer");
  assert.match(headers.get("content-security-policy"), /font-src 'self'/);
  assert.equal(
    headers.get("content-security-policy").match(/img-src[^;]+/)[0],
    "img-src 'self' data: blob: https://fvctfguvupdcscthrxeb.supabase.co",
  );
});
test("legacy URLs preserve queries and normalize the preferred host", async () => {
  for (const [old, next] of Object.entries(seo.LEGACY_REDIRECTS)) {
    const response = await policy.publicUtilityResponse(
      new Request("https://www.loni-galabau.de" + old + "?source=old"),
    );
    assert.equal(response.status, 301);
    assert.equal(
      response.headers.get("location"),
      "https://www.loni-galabau.de" + next + "?source=old",
    );
  }
  const response = await policy.publicUtilityResponse(
    new Request("https://loni-galabau.de/kontakt/"),
  );
  assert.equal(response.headers.get("location"), "https://www.loni-galabau.de/kontakt");
});
test("private responses cannot be cached or indexed; launch pages can be indexed", () => {
  const headers = policy.secureResponse(
    new Request("https://www.loni-galabau.de/admin/anfragen"),
    new Response("private"),
  ).headers;
  assert.equal(headers.get("cache-control"), "no-store");
  assert.match(headers.get("x-robots-tag"), /noindex/);
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.match(headers.get("content-security-policy"), /object-src 'none'/);
  assert.equal(
    policy
      .secureResponse(new Request("https://www.loni-galabau.de/kontakt"), new Response())
      .headers.has("x-robots-tag"),
    false,
  );
  assert.match(
    policy
      .secureResponse(new Request("https://preview.chatgpt.site/"), new Response())
      .headers.get("x-robots-tag"),
    /noindex/,
  );
});
test("sitemaps and structured data escape untrusted text", () => {
  assert.match(seo.sitemapXml([{ path: "/a?x=1&y=2", modified: "invalid" }]), /&amp;/);
  assert.doesNotMatch(seo.sitemapXml([{ path: "/", modified: "invalid" }]), /lastmod/);
  assert.doesNotMatch(seo.safeJsonLd({ name: "</script><script>alert(1)</script>" }), /</);
});
function quotaHarness(result) {
  const calls = [],
    status = [],
    headers = [];
  const api = moduleAt(
    "src/lib/form-quota.server.ts",
    {
      "@tanstack/react-start/server": {
        getRequest: () =>
          new Request("https://site.test", {
            headers: { "cf-connecting-ip": "192.0.2.2", "x-forwarded-for": "forged" },
          }),
        setResponseStatus: (value) => status.push(value),
        setResponseHeader: (...v) => headers.push(v),
      },
      "@/integrations/supabase/client.server": {
        supabaseAdmin: {
          rpc: async (name, input) => {
            calls.push(input);
            return result;
          },
        },
      },
    },
    { FORM_RATE_LIMIT_SECRET: "test-only-secret" },
  );
  return { api, calls, status, headers };
}
test("shared form quotas use scoped HMAC keys and normalized email", async () => {
  const h = quotaHarness({ data: true, error: null });
  await h.api.enforceFormQuota(" PERSON@EXAMPLE.TEST ");
  assert.equal(h.calls.length, 2);
  assert.equal(h.calls[0].p_limit, 12);
  assert.equal(h.calls[1].p_limit, 5);
  assert.equal(
    h.calls[1].p_key,
    h.api.quotaKey("test-only-secret", "email", "person@example.test"),
  );
  assert.notEqual(h.calls[0].p_key, h.api.quotaKey("different", "network", "192.0.2.2"));
  assert.doesNotMatch(JSON.stringify(h.calls), /192\.0|person@|forged/);
});
test("quota rejection and database outage fail closed", async () => {
  const limited = quotaHarness({ data: false, error: null });
  await assert.rejects(limited.api.enforceFormQuota("x@example.test"), /Zu viele/);
  assert.equal(limited.status[0], 429);
  assert.equal(limited.calls.length, 1);
  const failed = quotaHarness({ data: null, error: { message: "down" } });
  await assert.rejects(failed.api.enforceFormQuota("x@example.test"), /vorübergehend/);
  assert.equal(failed.status[0], 503);
});
test("planner drafts retain selections while dropping personal and free-text details", () => {
  const attachments = moduleAt("src/lib/contact-attachments.ts");
  const document = moduleAt("src/lib/application-document.ts");
  const validators = moduleAt("src/lib/validators.ts", {
    "./contact-attachments": attachments,
    "./application-document": document,
  });
  const planner = moduleAt("src/lib/garden-planner.ts", { "./validators": validators });
  const draft = planner.privatePlannerDraft({
    ...planner.INITIAL_PLANNER,
    services: ["garten"],
    name: "Private Name",
    email: "private@example.test",
    street: "Private Street",
    notes: "Sensitive message",
    deadline: "Private date",
    details: {
      garten: {
        area: "50",
        state: "Bestehender Garten",
        style: "Private free text",
        unknown: "Private data",
      },
    },
    site: { unknown: "Private data" },
  });
  assert.equal(draft.details.garten.area, "50");
  assert.equal(draft.details.garten.state, "Bestehender Garten");
  assert.equal(draft.name, "");
  assert.doesNotMatch(JSON.stringify(draft), /Private|Sensitive|private@/);
});
test("signed delivery webhooks are accepted, forged/expired/invalid events are rejected", async () => {
  const secret = "whsec_" + randomBytes(32).toString("base64"),
    calls = [];
  const api = moduleAt(
    "src/lib/notification-operations.server.ts",
    {
      "@/integrations/supabase/client.server": {
        supabaseAdmin: {
          rpc: async (...v) => {
            calls.push(v);
            return { error: null };
          },
        },
      },
      "./customer-confirmation.server": {},
    },
    { RESEND_WEBHOOK_SECRET: secret, NOTIFICATION_CRON_SECRET: "private-cron" },
  );
  const body = JSON.stringify({
    type: "email.delivered",
    created_at: new Date().toISOString(),
    data: {
      email_id: "test-id",
      to: ["sensitive@example.test"],
      tags: { source: "contact_requests", submission_id: "aa000000-0000-4000-8000-000000000001" },
    },
  });
  const request = (payload = body, date = new Date(), signature) =>
    new Request("https://site.test/api/notifications/resend", {
      method: "POST",
      body: payload,
      headers: {
        "svix-id": "event1",
        "svix-timestamp": String(Math.floor(date.getTime() / 1000)),
        "svix-signature": signature || new Webhook(secret).sign("event1", date, payload),
      },
    });
  assert.equal((await api.notificationOperations(request())).status, 204);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "record_submission_email_delivery");
  assert.equal(calls[0][1].p_source, "contact_requests");
  assert.equal(calls[0][1].p_submission_id, "aa000000-0000-4000-8000-000000000001");
  assert.equal(calls[0][1].p_status, "delivered");
  assert.doesNotMatch(JSON.stringify(calls), /sensitive@/);
  assert.equal(
    (await api.notificationOperations(request(body, new Date(), "v1,forged"))).status,
    400,
  );
  assert.equal(
    (await api.notificationOperations(request(body, new Date(Date.now() - 600000)))).status,
    400,
  );
  assert.equal((await api.notificationOperations(request("null"))).status, 400);
  assert.equal(
    (
      await api.notificationOperations(
        new Request("https://site.test/api/notifications/retry", { method: "POST" }),
      )
    ).status,
    401,
  );
  assert.equal(calls.length, 1);
  const legacy = JSON.stringify({
    type: "email.delivered",
    created_at: new Date().toISOString(),
    data: { email_id: "legacy-id" },
  });
  assert.equal((await api.notificationOperations(request(legacy))).status, 204);
  assert.equal(calls[1][1].p_source, null);
  assert.equal(calls[1][1].p_submission_id, null);
});
