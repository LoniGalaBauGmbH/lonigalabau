import { randomUUID } from "node:crypto";
import { z } from "zod";

const MAX_BYTES = 10 * 1024 * 1024;
export const publicUploadSchema = z.object({
  bucket: z.enum(["configurator-images", "cvs"]),
  // Kept for older callers; the server always generates the actual path.
  path: z.string().max(500).optional(),
  base64: z
    .string()
    .min(1)
    .max(Math.ceil(MAX_BYTES / 3) * 4 + 100),
  contentType: z.string().min(1).max(100),
});

export function preparePublicUpload(input: z.infer<typeof publicUploadSchema>) {
  const data = publicUploadSchema.parse(input);
  const raw = data.base64.replace(/^data:[^;]+;base64,/, "");
  if (raw.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(raw)) {
    throw new Error("Ungültige Dateidaten.");
  }
  const buffer = Buffer.from(raw, "base64");
  if (buffer.toString("base64") !== raw) throw new Error("Ungültige Dateidaten.");
  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    throw new Error("Dateien dürfen maximal 10 MB groß sein.");
  }

  let contentType = "";
  let extension = "";
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    contentType = "image/jpeg";
    extension = "jpg";
  } else if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    contentType = "image/png";
    extension = "png";
  } else if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    contentType = "image/webp";
    extension = "webp";
  } else if (buffer.toString("ascii", 0, 5) === "%PDF-") {
    contentType = "application/pdf";
    extension = "pdf";
  }
  const allowed =
    data.bucket === "cvs"
      ? ["application/pdf", "image/jpeg", "image/png"]
      : ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (
    !allowed.includes(contentType) ||
    data.contentType.replace("image/jpg", "image/jpeg") !== contentType
  ) {
    throw new Error("Dateiformat nicht erlaubt. Bitte eine passende PDF- oder Bilddatei wählen.");
  }
  return { bucket: data.bucket, path: `${randomUUID()}.${extension}`, buffer, contentType };
}
