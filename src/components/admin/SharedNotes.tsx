import { useEffect, useId, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { adminUpdateNotes } from "@/lib/admin.functions";

export function SharedNotes({
  record,
  table,
  queryKey,
}: {
  record: { id: string; notes: string; notes_version: number };
  table: "contact_requests" | "applications";
  queryKey: string;
}) {
  const id = useId();
  const save = useServerFn(adminUpdateNotes);
  const qc = useQueryClient();
  const [draft, setDraft] = useState(record.notes);
  const [version, setVersion] = useState(record.notes_version);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const [legacy, setLegacy] = useState("");
  const [conflict, setConflict] = useState<{ notes: string; notes_version: number } | null>(null);
  const oldKey = (table === "contact_requests" ? "crm-notes-" : "ats-notes-") + record.id;
  useEffect(() => {
    try {
      setLegacy(localStorage.getItem(oldKey) || "");
    } catch {
      /* Storage can be unavailable. */
    }
  }, [oldKey]);
  async function submit() {
    if (state === "saving" || conflict) return;
    setState("saving");
    setError("");
    try {
      const result = await save({ data: { table, id: record.id, notes: draft, version } });
      if (!result.ok) {
        setConflict(result);
        setState("idle");
        return;
      }
      setVersion(result.notes_version);
      setState("saved");
      void qc.invalidateQueries({ queryKey: [queryKey] });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Speichern fehlgeschlagen.");
      setState("idle");
    }
  }
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="form-label">
        Interne Notizen
      </label>
      <p className="text-xs text-foreground/60">Für beide Administratoren sichtbar.</p>
      {legacy && (
        <details className="text-sm">
          <summary className="cursor-pointer underline">Frühere lokale Notiz anzeigen</summary>
          <p className="whitespace-pre-wrap mt-2">{legacy}</p>
        </details>
      )}
      <textarea
        id={id}
        rows={5}
        maxLength={20000}
        className="form-input"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setState("idle");
        }}
      />
      {conflict && (
        <div role="alert" className="p-4 border border-amber-500 text-sm space-y-3">
          <p>
            Diese Notiz wurde zwischenzeitlich geändert. Ihr Entwurf bleibt erhalten. Vergleichen
            Sie ihn vor dem Speichern mit dem aktuellen Stand:
          </p>
          <p className="whitespace-pre-wrap bg-white p-3">{conflict.notes || "(Leer)"}</p>
          <button
            className="underline"
            type="button"
            onClick={() => {
              setVersion(conflict.notes_version);
              setConflict(null);
            }}
          >
            Verglichen – Entwurf weiterbearbeiten
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={state === "saving" || !!conflict}
        onClick={submit}
        className="primary-link"
      >
        {state === "saving" ? "Speichert…" : "Notizen speichern"}
      </button>
      {state === "saved" && (
        <p role="status" className="text-sm">
          In der Datenbank gespeichert.
        </p>
      )}
    </div>
  );
}
