import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminDeleteSubmission } from "@/lib/admin.functions";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function DeleteSubmission({
  table,
  id,
  onDeleted,
}: {
  table: "contact_requests" | "applications" | "partner_applications";
  id: string;
  onDeleted: () => void;
}) {
  const remove = useServerFn(adminDeleteSubmission);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-red-700 underline my-3"
      >
        Vorgang und Anhänge löschen
      </button>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!busy) setOpen(v);
        }}
      >
        <DialogContent>
          <DialogTitle>Vorgang endgültig löschen</DialogTitle>
          <DialogDescription>
            Nach Prüfung Ihrer Aufbewahrungspflichten können Sie diesen Vorgang einschließlich
            seiner privaten Anhänge löschen. E-Mail-Kopien werden dadurch nicht gelöscht und müssen
            separat geprüft werden.
          </DialogDescription>
          <label className="text-sm">
            Zur Bestätigung LÖSCHEN eingeben
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="block border rounded-lg p-3 w-full mt-2"
              autoComplete="off"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy || value !== "LÖSCHEN"}
            className="rounded-lg bg-red-700 text-white px-4 py-3 disabled:opacity-50"
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await remove({ data: { table, id, confirmation: "LÖSCHEN" } });
                try {
                  localStorage.removeItem(
                    `${table === "applications" ? "ats" : "crm"}-notes-${id}`,
                  );
                } catch {
                  // The saved record is already deleted even if browser storage is unavailable.
                }
                setOpen(false);
                onDeleted();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Löschen fehlgeschlagen");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Wird gelöscht…" : "Endgültig löschen"}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
