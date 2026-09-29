import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { applicationSubmissionSchema } from "./validators";
import { preparePublicUpload } from "./public-upload.server";

export async function persistApplicationSubmission(
  client: Pick<SupabaseClient, "storage" | "from">,
  input: unknown,
) {
  const data = applicationSubmissionSchema.parse(input);
  const document = data.document ? preparePublicUpload({ bucket: "cvs", ...data.document }) : null;
  const { data: job, error: jobError } = await client
    .from("jobs")
    .select("id")
    .eq("id", data.job_id)
    .eq("active", true)
    .maybeSingle();
  if (jobError || !job)
    throw new Error("Diese Stelle ist derzeit nicht verfügbar. Bitte laden Sie die Seite neu.");
  const id = randomUUID();
  let uploaded = false;
  const bucket = client.storage.from("cvs");
  try {
    if (document) {
      const { error } = await bucket.upload(document.path, document.buffer, {
        contentType: document.contentType,
        upsert: false,
        metadata: { originalName: data.document!.name },
      });
      if (error)
        throw new Error("Die PDF konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut.");
      uploaded = true;
    }
    const { error } = await client.from("applications").insert({
      id,
      job_id: data.job_id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      cv_path: document?.path || null,
    });
    if (error)
      throw new Error(
        "Ihre Bewerbung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
      );
    return { ok: true, id };
  } catch (error) {
    if (uploaded && document) {
      try {
        const { error: cleanupError } = await bucket.remove([document.path]);
        if (cleanupError) console.error("Application attachment cleanup failed");
      } catch {
        console.error("Application attachment cleanup failed");
      }
    }
    throw error;
  }
}
