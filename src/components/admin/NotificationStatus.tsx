import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminNotificationStatus, adminRetryNotifications } from "@/lib/admin.functions";
export function NotificationStatus() {
  const getStatus = useServerFn(adminNotificationStatus);
  const retry = useServerFn(adminRetryNotifications);
  const { data, error, refetch } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: () => getStatus(),
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function sendPending() {
    setBusy(true);
    setMessage("");
    try {
      const result = await retry();
      setMessage(result.sent + " Meldung(en) an Resend übergeben.");
      await refetch();
    } catch (failure) {
      setMessage(failure instanceof Error ? failure.message : "Versand fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <aside className="mb-7 border border-brand/20 p-4 text-sm rounded-md space-y-2">
      <p className="font-semibold">E-Mail-Benachrichtigungen</p>
      <p>
        {error
          ? "Versandstatus konnte nicht geladen werden."
          : !data
            ? "Status wird geladen…"
            : data.configured
              ? data.pending + " Meldung(en) noch nicht an Resend übergeben."
              : "Resend ist vorbereitet. Für den Versand fehlen noch die Serverkonfiguration und eine bestätigte Absenderdomain. Neue Eingänge finden Sie hier in der Verwaltung."}
      </p>
      {data?.configured && data.pending > 0 && (
        <button type="button" disabled={busy} onClick={sendPending} className="underline">
          {busy ? "Versand läuft…" : "Bis zu 10 ausstehende Meldungen senden"}
        </button>
      )}
      {message && <p role="status">{message}</p>}
    </aside>
  );
}
