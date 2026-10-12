import type { SupabaseClient } from "@supabase/supabase-js";
import { EXCLUDED_LEAD_QUALIFICATIONS, leadQualificationUpdateSchema } from "./lead-qualification";
import { incomingContactWindow, incomingTodayWindow } from "./incoming-contact-summary";

const SUMMARY_ERROR = "Die Anfragestatistik ist derzeit nicht verfügbar. Bitte erneut versuchen.";
const SAVE_ERROR = "Die Bewertung konnte nicht gespeichert werden.";
const CONFLICT_ERROR = "Die Bewertung wurde inzwischen geändert. Bitte die Anfrage neu öffnen.";
type Client = Pick<SupabaseClient, "from">;
type Window = ReturnType<typeof incomingContactWindow> | ReturnType<typeof incomingTodayWindow>;
type CountKind = "incoming" | "qualified" | "unreviewed" | "excluded";

export async function saveLeadQualification(client: Client, input: unknown, now = new Date()) {
  const data = leadQualificationUpdateSchema.parse(input);
  const reviewedAt = data.qualification === "unreviewed" ? null : now.toISOString();
  try {
    const { data: row, error } = await client
      .from("contact_requests")
      .update({
        lead_qualification: data.qualification,
        lead_qualification_version: data.version + 1,
        lead_qualification_reviewed_at: reviewedAt,
      })
      .eq("id", data.id)
      .eq("lead_qualification_version", data.version)
      .select("lead_qualification,lead_qualification_version,lead_qualification_reviewed_at")
      .maybeSingle();
    if (error) throw new Error(SAVE_ERROR);
    if (!row) throw new Error(CONFLICT_ERROR);
    return {
      qualification: row.lead_qualification,
      version: row.lead_qualification_version,
      reviewedAt: row.lead_qualification_reviewed_at,
    };
  } catch (error) {
    if (error instanceof Error && error.message === CONFLICT_ERROR) throw error;
    throw new Error(SAVE_ERROR);
  }
}

async function countContacts(client: Client, window: Window, kind: CountKind) {
  let query = client
    .from("contact_requests")
    .select("*", { count: "exact", head: true })
    .gte("created_at", window.start)
    .lt("created_at", window.end);
  if (kind === "qualified" || kind === "unreviewed") query = query.eq("lead_qualification", kind);
  if (kind === "excluded")
    query = query.in("lead_qualification", [...EXCLUDED_LEAD_QUALIFICATIONS]);
  const { count, error } = await query;
  if (error || typeof count !== "number" || !Number.isSafeInteger(count) || count < 0)
    throw new Error(SUMMARY_ERROR);
  return count;
}

async function periodSummary(client: Client, window: Window) {
  const [incoming, qualified, unreviewed, excluded] = await Promise.all(
    (["incoming", "qualified", "unreviewed", "excluded"] as const).map((kind) =>
      countContacts(client, window, kind),
    ),
  );
  return {
    incoming,
    qualified,
    unreviewed,
    excluded,
    startDate: window.startDate,
    endDate: window.endDate,
  };
}

/** Exact counts only. Retry once if concurrent reviews make the separate counts disagree. */
export async function loadLeadQualificationSummary(client: Client, now = new Date()) {
  const windows = [incomingContactWindow(now), incomingTodayWindow(now)] as const;
  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const [last30Days, today] = await Promise.all(
        windows.map((window) => periodSummary(client, window)),
      );
      const valid =
        [last30Days, today].every(
          (period) => period.incoming === period.qualified + period.unreviewed + period.excluded,
        ) &&
        (["incoming", "qualified", "unreviewed", "excluded"] as const).every(
          (key) => today[key] <= last30Days[key],
        );
      if (valid) return { last30Days, today, timeZone: "Europe/Berlin" };
    }
  } catch {
    /* Do not return a partial or misleading zero statistic. */
  }
  throw new Error(SUMMARY_ERROR);
}
