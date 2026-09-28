import { supabaseAdmin } from "@/integrations/supabase/client.server";

type InboxTable = "contact_requests" | "applications";
export function notificationConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}
// A generic alert avoids copying customer messages or application files into another service.
export async function notifyNewEntry(table: InboxTable, id: string): Promise<boolean> {
  if (!notificationConfigured()) return false;
  const isContact = table === "contact_requests";
  const origin = (process.env.SITE_URL || "https://loni-galabau.serhad1999.chatgpt.site").replace(
    /\/$/,
    "",
  );
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": table + "/" + id,
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.NOTIFICATION_TO_EMAIL || "webseite@loni-galabau.de"],
        subject: isContact
          ? "Neue Website-Anfrage – Loni GalaBau"
          : "Neue Bewerbung – Loni GalaBau",
        text:
          (isContact ? "Eine neue Anfrage" : "Eine neue Bewerbung") +
          " ist eingegangen.\n\nZum geschützten Adminbereich:\n" +
          origin +
          (isContact ? "/admin/anfragen" : "/admin/bewerbungen") +
          "\n\nVorgang: " +
          id,
      }),
    });
    if (!response.ok) {
      console.warn("Notification provider rejected request:", response.status);
      return false;
    }
    const payload = (await response.json()) as { id?: string };
    if (!payload.id) return false;
    const { error } = await supabaseAdmin
      .from(table)
      .update({ notification_sent_at: new Date().toISOString() })
      .eq("id", id);
    return !error;
  } catch {
    console.warn("Notification could not be completed; entry remains pending.");
    return false;
  }
}
