import type { SupabaseClient } from "@supabase/supabase-js";
import { incomingContactWindow } from "./incoming-contact-summary";

const LOAD_ERROR =
  "Die Anzahl der Kundenkontakte konnte nicht geladen werden. Bitte erneut versuchen.";

/** Only an aggregate is requested and returned; no contact records are loaded. */
export async function loadIncomingContactSummary(
  client: Pick<SupabaseClient, "from">,
  now: Date = new Date(),
) {
  const window = incomingContactWindow(now);
  try {
    const { count, error } = await client
      .from("contact_requests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", window.start)
      .lt("created_at", window.end);

    if (error || typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) {
      throw new Error(LOAD_ERROR);
    }
    return {
      count,
      startDate: window.startDate,
      endDate: window.endDate,
      days: window.days,
      timeZone: window.timeZone,
    };
  } catch {
    throw new Error(LOAD_ERROR);
  }
}
