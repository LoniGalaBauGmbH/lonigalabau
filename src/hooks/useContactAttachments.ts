import { useEffect, useRef, useState } from "react";
import {
  contactFileType,
  validateContactFiles,
  type ContactAttachmentInput,
} from "@/lib/contact-attachments";

export type SelectedContactFile = { id: string; file: File; preview: string; contentType: string };

export function useContactAttachments() {
  const [items, setItems] = useState<SelectedContactFile[]>([]);
  const current = useRef<SelectedContactFile[]>([]);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      current.current.forEach((item) => URL.revokeObjectURL(item.preview));
    },
    [],
  );

  function add(files: File[]) {
    const problem = validateContactFiles(files, current.current.length);
    if (problem) {
      setError(problem);
      return;
    }
    const next = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      contentType: contactFileType(file),
      preview: contactFileType(file).startsWith("image/") ? URL.createObjectURL(file) : "",
    }));
    current.current = [...current.current, ...next];
    setItems(current.current);
    setError("");
  }

  function remove(id: string) {
    const file = current.current.find((item) => item.id === id);
    if (file?.preview) URL.revokeObjectURL(file.preview);
    current.current = current.current.filter((item) => item.id !== id);
    setItems(current.current);
    setError("");
  }

  function clear() {
    current.current.forEach((item) => URL.revokeObjectURL(item.preview));
    current.current = [];
    setItems([]);
    setError("");
  }

  async function serialize(): Promise<ContactAttachmentInput[]> {
    const result: ContactAttachmentInput[] = [];
    for (const item of current.current) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () =>
          reject(
            new Error("Die Datei konnte nicht gelesen werden. Bitte wählen Sie sie erneut aus."),
          );
        reader.onabort = () => reject(new Error("Das Lesen der Datei wurde abgebrochen."));
        reader.readAsDataURL(item.file);
      });
      result.push({
        name: item.file.name,
        contentType: item.contentType as ContactAttachmentInput["contentType"],
        base64,
      });
    }
    return result;
  }
  return { items, error, add, remove, clear, serialize };
}
