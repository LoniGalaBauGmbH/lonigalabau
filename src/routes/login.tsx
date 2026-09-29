import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin-Login – Loni Galabau" }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const finishLogin = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) {
      setErr("Der Sicherheitsstatus konnte nicht geprüft werden.");
      return;
    }
    if (data.nextLevel === "aal2" && data.currentLevel !== "aal2") {
      const factors = await supabase.auth.mfa.listFactors();
      const factor = factors.data?.totp[0];
      if (!factor) {
        setErr("Authenticator nicht verfügbar. Bitte den Administrator kontaktieren.");
        return;
      }
      setFactorId(factor.id);
    } else {
      await nav({ to: "/admin", replace: true });
    }
  }, [nav]);
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void finishLogin();
    });
  }, [finishLogin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = factorId
      ? await supabase.auth.mfa.challengeAndVerify({ factorId, code })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr("Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben.");
    else {
      setPassword("");
      await finishLogin();
    }
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center px-6">
      <div className="w-full max-w-md bg-surface rounded-[2rem] p-10 shadow-xl">
        <Link to="/" className="text-xs uppercase tracking-widest opacity-60">
          ← Zur Website
        </Link>
        <h1 className="font-serif text-4xl mt-4">Admin-Login</h1>
        <p className="text-sm opacity-70 mt-2">Verwaltung der Inhalte und Anfragen.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {!factorId && (
            <>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest opacity-60 mb-2">
                  E-Mail
                </span>
                <input
                  required
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-brand/10 rounded-2xl px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest opacity-60 mb-2">
                  Passwort
                </span>
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-brand/10 rounded-2xl px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </label>
            </>
          )}
          {factorId && (
            <label className="block">
              <span className="block text-sm mb-2">Code aus Ihrer Authenticator-App</span>
              <input
                autoFocus
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border rounded-2xl px-4 py-3"
              />
            </label>
          )}
          {err && (
            <p role="alert" className="text-sm text-red-600">
              {err}
            </p>
          )}
          <button
            disabled={loading}
            className="w-full bg-brand text-brand-foreground py-3 rounded-full text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
          >
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
        <p className="text-xs opacity-60 mt-6">
          Hinweis: Selbstregistrierung ist deaktiviert. Admin-Zugänge werden manuell freigeschaltet.
        </p>
      </div>
    </div>
  );
}
