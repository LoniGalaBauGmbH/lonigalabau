/** Re-encode public photos before upload so phone location/EXIF data is not published. */
export async function publicImageToDataUrl(file: File): Promise<string> {
  if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    const bitmap = await createImageBitmap(file);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Das Bild konnte nicht vorbereitet werden.");
      context.drawImage(bitmap, 0, 0);
      const result = canvas.toDataURL(file.type, 0.94);
      if (!result.startsWith("data:" + file.type + ";base64,"))
        throw new Error("Dieses Bildformat wird vom Browser nicht unterstützt.");
      return result;
    } finally {
      bitmap.close();
    }
  }
  // Vector logos and animated GIFs are not rasterized.
  if (!["image/svg+xml", "image/gif"].includes(file.type))
    throw new Error("Bitte öffentliche Fotos als JPG, PNG oder WebP hochladen.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lesefehler"));
    reader.readAsDataURL(file);
  });
}
