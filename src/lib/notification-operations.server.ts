import { createHash, timingSafeEqual } from "node:crypto";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { attemptSubmissionEmails } from "./customer-confirmation.server";

export async function notificationOperations(request: Request): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!["/api/notifications/retry", "/api/notifications/resend"].includes(path)) return null;
  if (request.method !== "POST")
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (path.endsWith("/retry")) {
    const secret = process.env.NOTIFICATION_CRON_SECRET;
    const actual = request.headers.get("authorization") || "";
    if (
      !secret ||
      !timingSafeEqual(
        createHash("sha256").update(actual).digest(),
        createHash("sha256")
          .update("Bearer " + secret)
          .digest(),
      )
    )
      return new Response(null, { status: 401 });
    let attempted = 0,
      sent = 0,
      confirmations = 0;
    for (const table of ["contact_requests", "applications"] as const) {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select("id")
        .or(
          "notification_sent_at.is.null,and(customer_confirmation_requested_at.not.is.null,customer_confirmation_sent_at.is.null)",
        )
        .gte("created_at", new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString())
        .lt("created_at", new Date(Date.now() - 2 * 60 * 1000).toISOString())
        .order("created_at")
        .limit(1);
      if (error) return new Response("Queue unavailable", { status: 503 });
      for (const row of data || []) {
        attempted++;
        const result = await attemptSubmissionEmails(supabaseAdmin, table, row.id);
        if (result.sent) sent++;
        if (result.confirmationSent) confirmations++;
      }
    }
    return Response.json({ attempted, sent, confirmations });
  }
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return new Response(null, { status: 503 });
  if (Number(request.headers.get("content-length")) > 65536)
    return new Response(null, { status: 413 });
  const raw = await request.text();
  if (raw.length > 65536) return new Response(null, { status: 413 });
  let event: {
    type?: string;
    created_at?: string;
    data?: { email_id?: string; tags?: Record<string, unknown> };
  };
  try {
    new Webhook(secret).verify(raw, {
      "svix-id": request.headers.get("svix-id") || "",
      "svix-timestamp": request.headers.get("svix-timestamp") || "",
      "svix-signature": request.headers.get("svix-signature") || "",
    });
    event = JSON.parse(raw);
    if (!event || typeof event !== "object") return new Response(null, { status: 400 });
  } catch {
    return new Response(null, { status: 400 });
  }
  const statuses: Record<string, string> = {
    "email.delivered": "delivered",
    "email.bounced": "bounced",
    "email.complained": "complained",
    "email.failed": "failed",
    "email.delivery_delayed": "delayed",
  };
  const status = statuses[event.type || ""];
  if (!status) return new Response(null, { status: 204 });
  if (
    typeof event.data?.email_id !== "string" ||
    !event.data.email_id ||
    event.data.email_id.length > 100 ||
    typeof event.created_at !== "string" ||
    !event.created_at ||
    !Number.isFinite(Date.parse(event.created_at))
  )
    return new Response(null, { status: 400 });
  // No addresses, message bodies or attachments are stored from the provider event.
  const source = event.data.tags?.source;
  const submissionId = event.data.tags?.submission_id;
  const tagged =
    (source === "contact_requests" || source === "applications") &&
    typeof submissionId === "string" &&
    /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(submissionId);
  const { error } = await supabaseAdmin.rpc("record_submission_email_delivery", {
    p_id: event.data.email_id,
    p_status: status,
    p_at: event.created_at,
    p_source: tagged ? source : null,
    p_submission_id: tagged ? submissionId : null,
  });
  return new Response(null, { status: error ? 503 : 204 });
}
