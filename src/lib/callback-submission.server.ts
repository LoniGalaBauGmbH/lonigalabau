import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildCallbackRecord, validateCallback } from "./callback-request";

export async function persistCallbackSubmission(
  client: Pick<SupabaseClient, "from">,
  input: unknown,
) {
  const parsed = validateCallback(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const id = randomUUID();
  const { error } = await client
    .from("contact_requests")
    .insert({ id, ...buildCallbackRecord(parsed.data) });
  if (error)
    throw new Error(
      "Der Rückrufwunsch konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
    );
  return { ok: true, id };
}
