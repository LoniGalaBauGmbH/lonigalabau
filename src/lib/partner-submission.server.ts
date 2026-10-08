import { createHash, randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { partnerSubmissionSchema } from "./partner-application";
import { preparePublicUpload } from "./public-upload.server";
import { submissionTicket } from "./submission-ticket";

/** A request token binds a retry to the same content; concurrent attempts own separate uploads. */
export async function persistPartnerSubmission(
  client: Pick<SupabaseClient, "storage" | "from">,
  input: unknown,
) {
  const data = partnerSubmissionSchema.parse(input);
  const document = preparePublicUpload({ bucket: "partner-documents", ...data.document });
  const vatDocument = preparePublicUpload({ bucket: "partner-documents", ...data.vat_document });
  const { document: original, vat_document: vatOriginal, privacy, website, ...fields } = data;
  void privacy;
  void website;
  const hash = createHash("sha256")
    .update(
      JSON.stringify({
        ...fields,
        vat_document: {
          name: vatOriginal.name,
          sha256: createHash("sha256").update(vatDocument.buffer).digest("hex"),
        },
        document: {
          name: original.name,
          sha256: createHash("sha256").update(document.buffer).digest("hex"),
        },
      }),
    )
    .digest("hex");
  const existing = async (verifyHash = true) => {
    const result = await client
      .from("partner_applications")
      .select(
        "id,request_hash,ticket_number,ticket_format_version,certificate_path,vat_certificate_path",
      )
      .eq("request_token", data.request_token)
      .maybeSingle();
    if (result.error)
      throw new Error("Die Bewerbung konnte nicht geprüft werden. Bitte versuchen Sie es erneut.");
    if (verifyHash && result.data && result.data.request_hash !== hash)
      throw new Error(
        "Diese Bewerbung wurde bereits mit anderen Angaben gesendet. Bitte laden Sie für eine neue Bewerbung die Seite neu.",
      );
    return result.data;
  };
  const response = (row: { id: string; ticket_number: number; ticket_format_version: number }) => ({
    ok: true as const,
    id: row.id,
    ticket: submissionTicket(row.id, "partner", row),
  });
  const previous = await existing();
  if (previous) return response(previous);
  const bucket = client.storage.from("partner-documents");
  const uploaded: string[] = [];
  const cleanup = async (paths: string[]) => {
    if (!paths.length) return;
    try {
      const result = await bucket.remove(paths);
      if (result.error) console.error("Partner attachment cleanup failed");
    } catch {
      console.error("Partner attachment cleanup failed");
    }
  };
  let insertionStarted = false;
  try {
    for (const [prepared, source] of [
      [document, original],
      [vatDocument, vatOriginal],
    ] as const) {
      const upload = await bucket.upload(prepared.path, prepared.buffer, {
        contentType: "application/pdf",
        upsert: false,
        metadata: { originalName: source.name },
      });
      if (upload.error)
        throw new Error("Eine PDF konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut.");
      uploaded.push(prepared.path);
    }
    insertionStarted = true;
    const { data: row, error } = await client
      .from("partner_applications")
      .insert({
        ...fields,
        id: randomUUID(),
        request_hash: hash,
        certificate_path: document.path,
        certificate_name: original.name,
        vat_certificate_path: vatDocument.path,
        vat_certificate_name: vatOriginal.name,
        ticket_format_version: 2,
      })
      .select("id,ticket_number,ticket_format_version")
      .single();
    if (error || !row) {
      throw new Error(
        "Ihre Bewerbung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
      );
    }
    return response(row);
  } catch (error) {
    if (insertionStarted) {
      // A lost INSERT response is not proof of a failed commit. Never remove a saved record's PDF.
      let duplicate;
      try {
        duplicate = await existing(false);
      } catch {
        throw error;
      } // Preserve an ambiguous upload for reconciliation instead of risking data loss.
      if (duplicate) {
        const referenced = [duplicate.certificate_path, duplicate.vat_certificate_path];
        await cleanup(uploaded.filter((path) => !referenced.includes(path)));
        if (duplicate.request_hash !== hash)
          throw new Error(
            "Diese Bewerbung wurde bereits mit anderen Angaben gesendet. Bitte laden Sie für eine neue Bewerbung die Seite neu.",
          );
        return response(duplicate);
      }
    }
    await cleanup(uploaded);
    throw error;
  }
}
