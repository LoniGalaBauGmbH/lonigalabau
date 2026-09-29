import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AccountSecurity() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [factor, setFactor] = useState<{ id: string; qr: string } | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void supabase.auth.mfa.listFactors().then(({ data, error }) => {
      if (error) setMessage("Sicherheitsstatus konnte nicht geladen werden.");
      else setEnabled(!!data.totp.length);
    });
  }, []);
  async function enroll() {
    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Loni Website " + new Date().toISOString(),
      });
      if (error) throw error;
      setFactor({ id: data.id, qr: data.totp.qr_code });
    } catch {
      setMessage("Einrichtung fehlgeschlagen. Bitte erneut anmelden und versuchen.");
    } finally {
      setBusy(false);
    }
  }
  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!factor) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
      if (error) throw error;
      setEnabled(true);
      setFactor(null);
      setCode("");
      setMessage("Zwei-Faktor-Anmeldung ist aktiv.");
    } catch {
      setMessage(
        "Der Code konnte nicht bestätigt werden. Bitte den aktuellen Code erneut eingeben.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="rounded-2xl bg-surface border border-brand/10 p-6 space-y-4"
      aria-labelledby="account-security"
    >
      <h2 id="account-security" className="font-semibold text-xl text-brand">
        Kontosicherheit
      </h2>
      <p className="text-sm">
        {enabled
          ? "Zwei-Faktor-Anmeldung ist für dieses Konto aktiviert."
          : "Schützen Sie den Zugriff auf Anfragen und Bewerbungen mit Ihrer Authenticator-App."}
      </p>
      {!enabled && !factor && (
        <button
          onClick={enroll}
          disabled={busy || enabled === null}
          className="rounded-full bg-brand text-white px-5 py-2 disabled:opacity-50"
        >
          Authenticator einrichten
        </button>
      )}
      {factor && (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-sm">
            QR-Code mit Ihrer Authenticator-App scannen. Zugang zur App sicher aufbewahren.
          </p>
          <img
            src={factor.qr}
            alt="Persönlicher QR-Code zur Einrichtung der Authenticator-App"
            width={200}
            height={200}
          />
          <label className="block text-sm">
            Sechsstelliger Code
            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="block border rounded-lg p-3 mt-2"
            />
          </label>
          <button disabled={busy} className="rounded-full bg-brand text-white px-5 py-2">
            Aktivieren
          </button>
          <button
            type="button"
            className="ml-4 underline"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
              if (!error) setFactor(null);
              else setMessage("Abbrechen fehlgeschlagen.");
              setBusy(false);
            }}
          >
            Abbrechen
          </button>
        </form>
      )}
      <form
        className="space-y-3 pt-3 border-t border-brand/10"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMessage("");
          try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setPassword("");
            setMessage(
              "Passwort geändert. Nutzen Sie ein eigenes, nur für dieses Konto verwendetes Passwort.",
            );
          } catch {
            setMessage(
              "Passwort konnte nicht geändert werden. Bitte erneut anmelden und ein längeres, einzigartiges Passwort verwenden.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="block text-sm">
          Neues Passwort (mindestens 14 Zeichen)
          <input
            required
            type="password"
            minLength={14}
            maxLength={128}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full max-w-md border rounded-lg p-3 mt-2"
          />
        </label>
        <button disabled={busy} className="text-sm underline underline-offset-4">
          Passwort ändern
        </button>
      </form>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </section>
  );
}
