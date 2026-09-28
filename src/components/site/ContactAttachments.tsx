import { useId, useRef, useState } from "react";
import { FileText, Paperclip, X } from "lucide-react";
import { CONTACT_FILE_ACCEPT, MAX_CONTACT_FILES } from "@/lib/contact-attachments";
import type { useContactAttachments } from "@/hooks/useContactAttachments";

export function ContactAttachments({
  attachments,
  disabled = false,
}: {
  attachments: ReturnType<typeof useContactAttachments>;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const full = attachments.items.length >= MAX_CONTACT_FILES;
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm text-brand">
        <label htmlFor={id} className="font-medium">
          Fotos & Anhänge <span className="font-normal text-brand/55">(optional)</span>
        </label>
        <span aria-live="polite" className="shrink-0 text-brand/55">
          {attachments.items.length} / {MAX_CONTACT_FILES}
        </span>
      </div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) attachments.add(Array.from(event.dataTransfer.files));
        }}
        className={
          "rounded-2xl p-5 transition-colors " +
          (dragging ? "bg-accent/20 ring-2 ring-brand/25" : "bg-brand/[0.045]")
        }
      >
        <input
          ref={input}
          id={id}
          type="file"
          accept={CONTACT_FILE_ACCEPT}
          multiple
          disabled={disabled || full}
          tabIndex={-1}
          className="sr-only"
          aria-describedby={id + "-help"}
          onChange={(event) => {
            attachments.add(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={disabled || full}
          onClick={() => input.current?.click()}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default disabled:opacity-50"
        >
          <Paperclip className="size-5 shrink-0" aria-hidden="true" />
          {full ? "3 Dateien ausgewählt" : "Fotos oder PDFs auswählen"}
        </button>
        <p id={id + "-help"} className="mt-3 text-sm leading-relaxed text-brand/65">
          <span className="hidden sm:inline">Auch per Drag & Drop. </span>JPG, PNG, WebP oder PDF ·
          bis zu 3 Dateien · jeweils max. 5 MB.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-brand/55">
          Zum Beispiel Gartenfotos, Skizzen oder Pläne. Die Dateien werden erst mit Ihrer Anfrage
          gesendet.
        </p>
      </div>
      {attachments.items.length > 0 && (
        <ul aria-label="Ausgewählte Anhänge" className="mt-3 space-y-2">
          {attachments.items.map((item) => (
            <li
              key={item.id}
              className="flex min-w-0 items-center gap-3 rounded-xl bg-brand/[0.035] p-3"
            >
              {item.preview ? (
                <img
                  src={item.preview}
                  alt={"Vorschau: " + item.file.name}
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-white text-brand/65">
                  <FileText className="size-6" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="break-all text-sm font-medium text-brand">{item.file.name}</p>
                <p className="mt-1 text-xs text-brand/55">
                  {item.contentType === "application/pdf" ? "PDF" : "Foto"} ·{" "}
                  {item.file.size < 1024 * 1024
                    ? Math.max(1, Math.ceil(item.file.size / 1024)) + " KB"
                    : (item.file.size / 1024 / 1024).toLocaleString("de-DE", {
                        maximumFractionDigits: 1,
                        minimumFractionDigits: 1,
                      }) + " MB"}{" "}
                  · ausgewählt
                </p>
              </div>
              <button
                type="button"
                disabled={disabled}
                aria-label={item.file.name + " entfernen"}
                onClick={() => attachments.remove(item.id)}
                className="grid size-11 shrink-0 place-items-center rounded-full text-brand/65 hover:bg-brand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-40"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {attachments.error && (
        <p role="alert" className="mt-3 text-sm leading-relaxed text-red-700">
          {attachments.error}
        </p>
      )}
    </div>
  );
}
