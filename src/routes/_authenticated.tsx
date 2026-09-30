import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useRouter,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminWhoami } from "@/lib/admin.functions";
import { useSiteImages } from "@/hooks/useSiteImages";
import {
  LayoutDashboard,
  Wrench,
  Images,
  Briefcase,
  Users,
  Mail,
  Image as ImageIcon,
  BarChart2,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  // The session lives in browser storage. Server functions enforce access separately.
  ssr: false,
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw redirect({ to: "/login", replace: true });
    }
    const assurance = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance.error) throw new Error("Der Sicherheitsstatus konnte nicht geprüft werden.");
    if (assurance.data.nextLevel === "aal2" && assurance.data.currentLevel !== "aal2")
      throw redirect({ to: "/login", replace: true });
    await adminWhoami();
  },
  errorComponent: AdminAccessError,
  component: Layout,
});

function AdminAccessError() {
  const [signOutError, setSignOutError] = useState("");
  async function switchAccount() {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      setSignOutError("Die Abmeldung ist fehlgeschlagen. Bitte versuche es erneut.");
      return;
    }
    window.location.replace("/login");
  }

  return (
    <main className="min-h-screen grid place-items-center bg-background px-6">
      <div className="max-w-md rounded-3xl bg-surface p-8 border border-brand/10">
        <h1 className="font-serif text-3xl">Adminzugang nicht verfügbar</h1>
        <p className="mt-4 text-sm text-foreground/70">
          Dein Konto benötigt eine freigeschaltete Adminrolle. Falls du bereits berechtigt bist,
          versuche es später erneut.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-brand px-5 py-2 text-sm text-brand-foreground"
          >
            Erneut versuchen
          </button>
          <button
            onClick={switchAccount}
            className="rounded-full border border-brand/20 px-5 py-2 text-sm"
          >
            Anderes Konto verwenden
          </button>
        </div>
        {signOutError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {signOutError}
          </p>
        )}
        <Link to="/" className="mt-6 inline-block text-sm underline">
          Zur Website
        </Link>
      </div>
    </main>
  );
}

const navItems = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/leistungen", label: "Leistungen", Icon: Wrench },
  { to: "/admin/projekte", label: "Projekte", Icon: Images },
  { to: "/admin/jobs", label: "Jobs", Icon: Briefcase },
  { to: "/admin/bewerbungen", label: "Bewerbungen", Icon: Users },
  { to: "/admin/anfragen", label: "Anfragen", Icon: Mail },
  { to: "/admin/bilder", label: "Bilder", Icon: ImageIcon },
  { to: "/admin/tracking", label: "Tracking", Icon: BarChart2 },
];

function Layout() {
  const router = useRouter();
  const location = useLocation();
  const { images } = useSiteImages();
  const [email, setEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void import("@/integrations/supabase/client")
      .then(({ supabase }) => supabase.auth.getUser())
      .then(({ data }) => {
        if (active) setEmail(data.user?.email ?? null);
      })
      .catch(() => {
        if (active) setEmail(null);
      });
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
    router.navigate({ to: "/login" });
  }

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar (desktop) ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-brand/10 fixed top-0 left-0 bottom-0 z-20">
        {/* Logo */}
        <div className="p-5 border-b border-brand/10">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={images.logo} alt="Loni Galabau" className="h-8 w-auto" />
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mt-1.5 ml-0.5">
            Admin-Bereich
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((n) => {
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-brand/5"
                }`}
              >
                <n.Icon
                  className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-foreground/40"}`}
                />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-brand/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/50 hover:text-brand hover:bg-brand/5 transition-all"
          >
            <Globe className="w-4 h-4" />
            Zur Website
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </button>
          {email && <p className="text-[10px] text-foreground/30 px-3 pt-1 truncate">{email}</p>}
        </div>
      </aside>

      {/* ── Mobile Header ──────────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-surface border-b border-brand/10 flex items-center justify-between px-4 py-3">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={images.logo} alt="Loni Galabau" className="h-7 w-auto" />
          <span className="text-xs text-foreground/40 font-semibold">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-brand/5 transition"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Nav Drawer ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-brand/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-14 left-0 right-0 bg-surface border-b border-brand/10 p-3 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((n) => {
              const active = isActive(n.to, n.exact);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? "bg-brand text-white" : "text-foreground/60 hover:bg-brand/5"
                  }`}
                >
                  <n.Icon className={`w-4 h-4 ${active ? "text-white" : "text-foreground/40"}`} />
                  {n.label}
                </Link>
              );
            })}
            <div className="border-t border-brand/10 pt-2 mt-2 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground/50"
              >
                <Globe className="w-4 h-4" /> Zur Website
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Abmelden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
