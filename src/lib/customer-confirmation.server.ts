import type { SupabaseClient } from "@supabase/supabase-js";
import { renderCustomerConfirmation } from "./customer-confirmation-email";
import { EMAIL_LOGO_ATTACHMENTS } from "./email-logo-assets.server";
import { CUSTOMER_EMAIL_PHOTOS } from "./customer-email-assets.server";
import {
  attemptSubmissionNotification,
  NOTIFICATION_TO,
  type SubmissionTable,
} from "./submission-notification.server";

type Client = Pick<SupabaseClient, "storage" | "from">;

/** Persist the exact message before delivery, so concurrent calls and retries use one immutable payload. */
export async function sendCustomerConfirmation(client: Client, table: SubmissionTable, id: string) {
  const read = () => client.from(table).select("*").eq("id", id).single();
  const { data: record, error } = await read();
  if (error || !record) throw new Error("Vorgang nicht verfügbar.");
  // Records from before the rollout deliberately receive no retrospective email.
  if (!record.customer_confirmation_requested_at) return { sent: false, skipped: true };
  if (record.customer_confirmation_sent_at) return { sent: true, alreadySent: true };
  if (Date.now() - Date.parse(record.customer_confirmation_requested_at) > 23 * 60 * 60 * 1000)
    throw new Error("Bestätigung außerhalb des sicheren Wiederholungszeitraums. Bitte prüfen.");
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) throw new Error("E-Mail-Versand nicht konfiguriert.");
  let payload = record.customer_confirmation_payload;
  if (!payload) {
    const application = table === "applications";
    const kind = application
      ? "application"
      : record.subject?.startsWith("Gartenplaner:")
        ? "planner"
        : record.subject?.startsWith("Projektanfrage:")
          ? "project"
          : "contact";
    const siteOrigin = new URL(
      process.env.SITE_ADMIN_ORIGIN || "https://loni-galabau.serhad1999.chatgpt.site",
    ).origin;
    if (!siteOrigin.startsWith("https://")) throw new Error("Ungültige Website-Adresse.");
    const message = renderCustomerConfirmation({
      id,
      kind,
      createdAt: record.created_at,
      attachmentCount: application ? Number(!!record.cv_path) : (record.image_paths || []).length,
      siteOrigin,
    });
    const candidate = {
      from,
      to: [record.email],
      reply_to: NOTIFICATION_TO,
      ...message,
      headers: { "Auto-Submitted": "auto-generated", "X-Auto-Response-Suppress": "All" },
      tags: [
        { name: "source", value: table },
        { name: "submission_id", value: id },
        { name: "purpose", value: "customer_confirmation" },
      ],
      // Never repeat customer attachments or arbitrary free text in an automatic reply.
      attachments: [
        ...EMAIL_LOGO_ATTACHMENTS,
        CUSTOMER_EMAIL_PHOTOS[application ? "application" : "contact"],
      ],
    };
    const { error: snapshotError } = await client
      .from(table)
      .update({ customer_confirmation_payload: candidate })
      .eq("id", id)
      .is("customer_confirmation_payload", null);
    if (snapshotError) throw new Error("Bestätigung konnte nicht vorbereitet werden.");
    const { data: stored, error: reloadError } = await read();
    if (reloadError || !stored?.customer_confirmation_payload)
      throw new Error("Bestätigung konnte nicht geladen werden.");
    if (stored.customer_confirmation_sent_at) return { sent: true, alreadySent: true };
    payload = stored.customer_confirmation_payload;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `customer-confirmation/${table}/${id}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok)
    throw new Error(`Bestätigung vom Versanddienst abgelehnt (${response.status}).`);
  const result = (await response.json()) as { id?: string };
  if (!result.id) throw new Error("Versand wurde nicht bestätigt.");
  const { error: updateError } = await client
    .from(table)
    .update({
      customer_confirmation_sent_at: new Date().toISOString(),
      customer_confirmation_email_id: result.id,
    })
    .eq("id", id);
  if (updateError) throw new Error("Versandstatus konnte nicht gespeichert werden.");
  console.info("Customer confirmation accepted", { table, id, emailId: result.id });
  return { sent: true, emailId: result.id };
}

export async function attemptCustomerConfirmation(
  client: Client,
  table: SubmissionTable,
  id: string,
) {
  try {
    return await sendCustomerConfirmation(client, table, id);
  } catch {
    console.error("Customer confirmation pending", { table, id });
    return { sent: false };
  }
}

/** Internal notification and customer receipt fail independently; the saved request always survives. */
export async function attemptSubmissionEmails(client: Client, table: SubmissionTable, id: string) {
  const confirmation = await attemptCustomerConfirmation(client, table, id);
  const notification = await attemptSubmissionNotification(client, table, id);
  return { sent: notification.sent, confirmationSent: confirmation.sent };
}
