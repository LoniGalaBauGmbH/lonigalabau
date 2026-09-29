import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminSendSubmissionNotification } from "@/lib/admin.functions";

export function SubmissionNotification({
  id,
  table,
  sentAt,
  deliveryStatus,
}: {
  id: string;
  table: "contact_requests" | "applications";
  sentAt?: string | null;
  deliveryStatus?: string | null;
}) {
  const send = useServerFn(adminSendSubmissionNotification);
  const [sent, setSent] = useState(!!sentAt);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="mt-4 rounded-xl bg-brand/5 p-4 text-sm text-brand">
      {deliveryStatus && (
        <p role="status" className="mb-2 font-semibold">
          {{
            delivered: "Zustellung vom Empfänger-Mailserver bestätigt.",
            bounced: "Zustellung fehlgeschlagen: Nachricht zurückgewiesen.",
            complained: "Der Empfänger hat die Nachricht als Spam gemeldet.",
            failed: "Versand fehlgeschlagen.",
            delayed: "Zustellung verzögert. Der Maildienst versucht es weiter.",
            unknown: "Zustellstatus derzeit nicht abrufbar.",
          }[deliveryStatus] || deliveryStatus}
        </p>
      )}
      <p role="status">
        {sent
          ? "E-Mail-Benachrichtigung vom Versanddienst angenommen."
          : "E-Mail-Benachrichtigung noch ausstehend. Der Vorgang ist sicher gespeichert."}
      </p>
      <p className="mt-1 text-xs text-brand/60">Empfänger: webseite@loni-galabau.de</p>
      {!sent && (
        <button
          type="button"
          disabled={pending}
          className="mt-3 min-h-10 font-semibold underline underline-offset-4 disabled:opacity-50"
          onClick={async () => {
            if (pending) return;
            setPending(true);
            setError("");
            try {
              await send({ data: { id, table } });
              setSent(true);
            } catch (failure) {
              setError(
                failure instanceof Error
                  ? failure.message
                  : "Versand fehlgeschlagen. Bitte erneut versuchen.",
              );
            } finally {
              setPending(false);
            }
          }}
        >
          {pending ? "E-Mail wird gesendet …" : "Benachrichtigung jetzt senden"}
        </button>
      )}
      {error && (
        <p role="alert" className="mt-2 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
