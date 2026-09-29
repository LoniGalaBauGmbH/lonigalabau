import { z } from "zod";

export const MAX_APPLICATION_BYTES = 10 * 1024 * 1024;
export const APPLICATION_ACCEPT = ".pdf,application/pdf";
const validFileName = (name: string) =>
  !/[\\/]/.test(name) && [...name].every((character) => character.charCodeAt(0) >= 32);
export const applicationDocumentSchema = z.object({
  name: z.string().trim().min(1).max(180).refine(validFileName),
  contentType: z.literal("application/pdf"),
  base64: z
    .string()
    .min(1)
    .max(Math.ceil(MAX_APPLICATION_BYTES / 3) * 4),
});

export function validateApplicationDocument(file: { name: string; type: string; size: number }) {
  if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== "application/pdf"))
    return "Bitte wählen Sie eine PDF-Datei. Word-Dateien können Sie vorher als PDF speichern.";
  if (!file.size) return "Die Datei ist leer. Bitte wählen Sie eine andere PDF-Datei.";
  if (file.size > MAX_APPLICATION_BYTES)
    return "Die PDF-Datei ist zu groß. Erlaubt sind maximal 10 MB.";
  if (file.name.length > 180 || !validFileName(file.name))
    return "Bitte verwenden Sie einen kürzeren Dateinamen ohne Sonderzeichen.";
  return "";
}
