import { submissionTicket } from "./submission-ticket";
import type { SupabaseClient } from "@supabase/supabase-js";
import { renderSubmissionEmail } from "./submission-email";
import { EMAIL_LOGO_ATTACHMENTS } from "./email-logo-assets.server";

export type SubmissionTable = "contact_requests" | "applications";
export const NOTIFICATION_TO = "webseite@loni-galabau.de";
const SITE = process.env.SITE_ADMIN_ORIGIN || "https://loni-galabau.serhad1999.chatgpt.site";

export function notificationMessage(
  record: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message?: string | null;
  },
  table: SubmissionTable,
  jobTitle: string,
  files: string[],
) {
  const title = table === "applications" ? "Neue Bewerbung" : "Neue Website-Anfrage";
  const adminUrl = SITE + (table === "applications" ? "/admin/bewerbungen" : "/admin/anfragen");
  return {
    to: [NOTIFICATION_TO],
    reply_to: record.email,
    subject: (
      submissionTicket(record.id, table === "applications") +
      " · " +
      title +
      " · " +
      (jobTitle || record.subject || record.name)
    )
      .replace(/[\r\n]/g, " ")
      .slice(0, 200),
    ...renderSubmissionEmail(record, table === "applications", jobTitle, files, adminUrl),
    headers: { "Auto-Submitted": "auto-generated" },
    tags: [
      { name: "source", value: table },
      { name: "submission_id", value: record.id },
    ],
  };
}

/** A failed notification never rolls back an already saved customer request. */
export async function notifySavedSubmission(
  client: Pick<SupabaseClient, "storage" | "from">,
  table: SubmissionTable,
  id: string,
) {
  const { data: record, error } = await client.from(table).select("*").eq("id", id).single();
  if (error || !record) throw new Error("Der gespeicherte Vorgang konnte nicht geladen werden.");
  if (record.notification_sent_at) return { sent: true, alreadySent: true };
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) throw new Error("Der E-Mail-Versand ist noch nicht eingerichtet.");
  let jobTitle = "";
  if (table === "applications" && record.job_id) {
    const { data: job, error: jobError } = await client
      .from("jobs")
      .select("title")
      .eq("id", record.job_id)
      .maybeSingle();
    if (jobError) throw new Error("Die Stellenbezeichnung konnte nicht geladen werden.");
    jobTitle = job?.title || "";
  }
  const paths: string[] =
    table === "applications" ? (record.cv_path ? [record.cv_path] : []) : record.image_paths || [];
  const bucket = client.storage.from(table === "applications" ? "cvs" : "configurator-images");
  const attachments: { filename: string; content: string }[] = [];
  for (const [index, path] of paths.entries()) {
    const { data: file, error: downloadError } = await bucket.download(path);
    if (downloadError || !file)
      throw new Error("Ein gespeicherter Anhang konnte nicht für die E-Mail geladen werden.");
    const { data: info } = await bucket.info(path);
    const storedName = info?.metadata?.originalName;
    const filename =
      typeof storedName === "string" ? storedName : `Anhang-${index + 1}.${path.split(".").pop()}`;
    attachments.push({
      filename,
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    });
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `${table}/${id}`,
    },
    body: JSON.stringify({
      from,
      ...notificationMessage(
        record,
        table,
        jobTitle,
        attachments.map((file) => file.filename),
      ),
      attachments: [...attachments, ...EMAIL_LOGO_ATTACHMENTS],
    }),
  });
  if (!response.ok)
    throw new Error(`Der E-Mail-Dienst hat den Versand abgelehnt (HTTP ${response.status}).`);
  const result = (await response.json()) as { id?: string };
  if (!result.id) throw new Error("Der E-Mail-Dienst hat den Versand nicht bestätigt.");
  const { error: updateError } = await client
    .from(table)
    .update({ notification_sent_at: new Date().toISOString(), notification_email_id: result.id })
    .eq("id", id);
  // Log only identifiers, never message text, attachment content or credentials.
  console.info("Submission notification accepted", { table, id, emailId: result.id });
  if (updateError)
    throw new Error(
      "Die E-Mail wurde angenommen, der Versandstatus konnte aber nicht gespeichert werden.",
    );
  return { sent: true, emailId: result.id };
}

export async function attemptSubmissionNotification(
  client: Pick<SupabaseClient, "storage" | "from">,
  table: SubmissionTable,
  id: string,
) {
  try {
    return await notifySavedSubmission(client, table, id);
  } catch {
    console.error("Submission notification pending", { table, id });
    return { sent: false };
  }
}
