import { z } from "zod";

export const MAX_CONTACT_FILES = 10;
export const MAX_CONTACT_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_CONTACT_TOTAL_BYTES = 20 * 1024 * 1024;
export const CONTACT_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;
export const CONTACT_FILE_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf";
const validFileName = (name: string) =>
  !/[\\/]/.test(name) && [...name].every((character) => character.charCodeAt(0) >= 32);

export const contactAttachmentSchema = z.object({
  name: z.string().trim().min(1).max(180).refine(validFileName),
  contentType: z.enum(CONTACT_FILE_TYPES),
  base64: z
    .string()
    .min(1)
    .max(Math.ceil(MAX_CONTACT_FILE_BYTES / 3) * 4),
});
export type ContactAttachmentInput = z.infer<typeof contactAttachmentSchema>;

// Bound decoded bytes before allocating buffers; signatures and exact bytes are checked on the server.
export const contactAttachmentsSchema = z
  .array(contactAttachmentSchema)
  .max(MAX_CONTACT_FILES, `Es sind höchstens ${MAX_CONTACT_FILES} Anhänge pro Anfrage möglich.`)
  .refine(
    (files) =>
      files.reduce(
        (sum, file) =>
          sum +
          (file.base64.length * 3) / 4 -
          (file.base64.endsWith("==") ? 2 : file.base64.endsWith("=") ? 1 : 0),
        0,
      ) <= MAX_CONTACT_TOTAL_BYTES,
    "Die Anhänge dürfen zusammen maximal 20 MB groß sein.",
  );

export function contactFileType(file: { name: string; type: string }) {
  const fallback: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  return file.type === "image/jpg"
    ? "image/jpeg"
    : file.type || fallback[file.name.split(".").pop()?.toLowerCase() ?? ""] || "";
}

export function validateContactFiles(
  files: { name: string; type: string; size: number }[],
  currentCount: number,
  currentBytes = 0,
) {
  if (files.length + currentCount > MAX_CONTACT_FILES)
    return `Sie können bis zu ${MAX_CONTACT_FILES} Dateien hinzufügen. Entfernen Sie bei Bedarf zuerst eine Datei.`;
  for (const file of files) {
    if (!file.name.trim() || file.name.length > 180 || !validFileName(file.name))
      return "Bitte kürzen Sie den Dateinamen auf höchstens 180 Zeichen.";
    if (!CONTACT_FILE_TYPES.includes(contactFileType(file) as (typeof CONTACT_FILE_TYPES)[number]))
      return "Bitte wählen Sie JPG, PNG, WebP oder PDF. Andere Dateiformate werden nicht unterstützt.";
    if (!file.size) return "Leere Dateien können nicht angehängt werden.";
    if (file.size > MAX_CONTACT_FILE_BYTES)
      return "Die Datei „" + file.name + "“ ist zu groß. Erlaubt sind maximal 5 MB pro Datei.";
  }
  if (currentBytes + files.reduce((sum, file) => sum + file.size, 0) > MAX_CONTACT_TOTAL_BYTES)
    return "Die Anhänge dürfen zusammen maximal 20 MB groß sein. Bitte wählen Sie kleinere Dateien oder entfernen Sie einen Anhang.";
  return "";
}
