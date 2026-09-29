import { useId, useRef, useState } from "react";
import { Check, FileText, Upload, X } from "lucide-react";
import { APPLICATION_ACCEPT, validateApplicationDocument } from "@/lib/application-document";

export function ApplicationUpload({
  file,
  onChange,
  disabled,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled: boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  function select(files: File[]) {
    if (disabled || !files.length) return;
    const problem =
      files.length > 1
        ? "Bitte fassen Sie Ihre Unterlagen in einer PDF-Datei zusammen."
        : validateApplicationDocument(files[0]);
    setError(problem);
    if (!problem) onChange(files[0]);
  }
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-base font-semibold text-brand">
        Bewerbungsunterlagen <span className="font-normal text-brand/60">(optional)</span>
      </label>
      <p id={id + "-help"} className="mt-2 text-sm leading-relaxed text-brand/70">
        Lebenslauf, Zeugnisse oder Anschreiben – bitte als eine PDF-Datei, maximal 10 MB. Sie können
        sich auch ohne Unterlagen bewerben.
      </p>
      <div
        className={
          "mt-4 rounded-2xl p-4 sm:p-6 transition-colors " +
          (dragging ? "bg-accent/20 ring-2 ring-brand/30" : "bg-brand/[0.045]")
        }
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          select(Array.from(event.dataTransfer.files));
        }}
      >
        <input
          ref={input}
          id={id}
          type="file"
          accept={APPLICATION_ACCEPT}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-describedby={id + "-help"}
          onChange={(event) => {
            select(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        {file ? (
          <div className="flex min-w-0 items-center gap-3" aria-live="polite">
            <span className="hidden size-12 shrink-0 place-items-center rounded-xl bg-white text-brand sm:grid">
              <FileText size={24} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="break-all text-sm font-semibold text-brand">{file.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-brand/65">
                <Check size={14} aria-hidden="true" />
                Bereit zum Senden ·{" "}
                {file.size < 1024 * 1024
                  ? `${Math.max(1, Math.round(file.size / 1024))} KB`
                  : `${(file.size / 1024 / 1024).toLocaleString("de-DE", { maximumFractionDigits: 2 })} MB`}
              </p>
            </div>
            <button
              type="button"
              disabled={disabled}
              aria-label="Bewerbungsunterlagen entfernen"
              className="grid size-11 shrink-0 place-items-center rounded-full text-brand hover:bg-brand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              onClick={() => {
                onChange(null);
                setError("");
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <span className="hidden size-12 shrink-0 place-items-center rounded-xl bg-white text-brand sm:grid">
              <Upload size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-medium text-brand">Ihre Unterlagen an einem Ort</p>
              <p className="mt-1 text-sm text-brand/65">
                PDF auswählen<span className="hidden sm:inline"> oder hier hineinziehen</span>.
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={() => input.current?.click()}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand hover:bg-brand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          <Upload size={18} aria-hidden="true" />
          {file ? "Andere PDF auswählen" : "PDF-Datei auswählen"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-brand/60">
          Die Datei wird erst mit „Bewerbung absenden“ übertragen und vertraulich für Ihre Bewerbung
          gespeichert.
        </p>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
