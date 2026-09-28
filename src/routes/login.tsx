import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin-Login – Loni Galabau" }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) nav({ to: "/admin", replace: true });
    });
  }, [nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else nav({ to: "/admin", replace: true });
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center px-6">
      <div className="w-full max-w-md bg-surface rounded-[2rem] p-10 shadow-xl">
        <Link to="/" className="text-xs uppercase tracking-widest opacity-60">← Zur Website</Link>
        <h1 className="font-serif text-4xl mt-4">Admin-Login</h1>
        <p className="text-sm opacity-70 mt-2">Verwaltung der Inhalte und Anfragen.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-widest opacity-60 mb-2">E-Mail</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-brand/10 rounded-2xl px-4 py-3 text-sm focus:border-accent focus:outline-none" />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest opacity-60 mb-2">Passwort</span>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-brand/10 rounded-2xl px-4 py-3 text-sm focus:border-accent focus:outline-none" />
          </label>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={loading} className="w-full bg-brand text-brand-foreground py-3 rounded-full text-sm font-medium hover:bg-brand/90 disabled:opacity-50">
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
        <p className="text-xs opacity-60 mt-6">Hinweis: Selbstregistrierung ist deaktiviert. Admin-Zugänge werden manuell freigeschaltet.</p>
      </div>
    </div>
  );
}
