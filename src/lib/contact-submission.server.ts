import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { contactSubmissionSchema } from "./validators";
import { MAX_CONTACT_FILE_BYTES, MAX_CONTACT_TOTAL_BYTES } from "./contact-attachments";
import { preparePublicUpload } from "./public-upload.server";

export async function persistContactSubmission(
  client: Pick<SupabaseClient, "storage" | "from">,
  input: unknown,
) {
  const data = contactSubmissionSchema.parse(input);
  // Validate every attachment before writing any file or contact record.
  const files = data.attachments.map((attachment) => {
    const file = preparePublicUpload({ bucket: "configurator-images", ...attachment });
    if (file.buffer.length > MAX_CONTACT_FILE_BYTES)
      throw new Error("Anhänge dürfen maximal 5 MB groß sein.");
    return { ...file, name: attachment.name };
  });
  if (files.reduce((sum, file) => sum + file.buffer.length, 0) > MAX_CONTACT_TOTAL_BYTES)
    throw new Error("Die Anhänge dürfen zusammen maximal 20 MB groß sein.");
  const bucket = client.storage.from("configurator-images");
  const uploaded: string[] = [];
  const id = randomUUID();
  try {
    for (const file of files) {
      const { error } = await bucket.upload(file.path, file.buffer, {
        contentType: file.contentType,
        upsert: false,
        metadata: { originalName: file.name },
      });
      if (error)
        throw new Error(
          "Ein Anhang konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut.",
        );
      uploaded.push(file.path);
    }
    const { error } = await client.from("contact_requests").insert({
      id,
      ticket_format_version: 2,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      ...(data.discoverySource ? { discovery_source: data.discoverySource } : {}),
      image_paths: uploaded,
    });
    if (error)
      throw new Error(
        "Die Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
      );
    return { ok: true, id };
  } catch (error) {
    if (uploaded.length) {
      try {
        const cleanup = await bucket.remove(uploaded);
        if (cleanup.error) console.error("Contact attachment cleanup failed");
      } catch {
        console.error("Contact attachment cleanup failed");
      }
    }
    throw error;
  }
}
