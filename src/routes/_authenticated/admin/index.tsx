import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminWhoami,
  adminListContacts,
  adminListApplications,
  adminListServices,
  adminListProjects,
  adminListJobs,
} from "@/lib/admin.functions";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Sprout,
  Hammer,
  Briefcase,
  FileCheck,
  ChevronRight,
  Inbox,
  Clock,
  CheckCircle2,
  Sun,
  Moon,
  Sunset,
  Mail,
  Users,
  ArrowUpRight,
  Leaf,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Page,
});

const BRAND = "#2d5a27";
const ACCENT = "#4a7c59";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Guten Morgen", Icon: Sun, color: "text-amber-500" };
  if (h < 17) return { text: "Guten Tag", Icon: Sunset, color: "text-orange-400" };
  return { text: "Guten Abend", Icon: Moon, color: "text-indigo-400" };
}

function today() {
  return new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Page() {
  const whoamiFn   = useServerFn(adminWhoami);
  const contactsFn = useServerFn(adminListContacts);
  const appsFn     = useServerFn(adminListApplications);
  const servicesFn = useServerFn(adminListServices);
  const projectsFn = useServerFn(adminListProjects);
  const jobsFn     = useServerFn(adminListJobs);

  const { data: whoami, isLoading } = useQuery({
    queryKey: ["whoami"],
    queryFn: () => whoamiFn(),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: () => contactsFn(),
    enabled: !!whoami?.isAdmin,
  });
  const { data: apps = [] } = useQuery({
    queryKey: ["admin-apps"],
    queryFn: () => appsFn(),
    enabled: !!whoami?.isAdmin,
  });
  const { data: services = [] } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => servicesFn(),
    enabled: !!whoami?.isAdmin,
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => projectsFn(),
    enabled: !!whoami?.isAdmin,
  });
  const { data: jobs = [] } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => jobsFn(),
    enabled: !!whoami?.isAdmin,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
          <p className="text-sm text-foreground/40 font-medium">Dashboard wird geladen…</p>
        </div>
      </div>
    );
  }

  if (!whoami?.isAdmin) {
    return (
      <div className="bg-surface rounded-3xl p-12 border border-brand/10 max-w-xl mx-auto mt-12 text-center shadow-xl">
        <div className="size-16 rounded-full bg-red-100 grid place-items-center mx-auto mb-6">
          <Users className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="font-serif text-3xl text-brand">Kein Admin-Zugriff</h1>
        <p className="opacity-60 mt-3 text-sm leading-relaxed">
          Ihr Konto ist angemeldet, besitzt jedoch keine Administrator-Rechte.
        </p>
      </div>
    );
  }

  // ── Stats ─────────────────────────────────────────
  const totalContacts  = (contacts as any[]).length;
  const totalApps      = (apps as any[]).length;
  const totalServices  = (services as any[]).length;
  const totalProjects  = (projects as any[]).length;
  const totalJobs      = (jobs as any[]).length;
  const newContacts    = (contacts as any[]).filter((c: any) => c.status === "new").length;
  const newApps        = (apps as any[]).filter((a: any) => a.status === "new").length;
  const activeJobs     = (jobs as any[]).filter((j: any) => j.active).length;

  // ── Chart data: contacts last 14 days ─────────────
  const chartData = (() => {
    const days: Record<string, { Anfragen: number; Bewerbungen: number }> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
      days[key] = { Anfragen: 0, Bewerbungen: 0 };
    }
    (contacts as any[]).forEach((c: any) => {
      const key = new Date(c.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
      if (key in days) days[key].Anfragen++;
    });
    (apps as any[]).forEach((a: any) => {
      const key = new Date(a.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
      if (key in days) days[key].Bewerbungen++;
    });
    return Object.entries(days).map(([name, vals]) => ({ name, ...vals }));
  })();

  // ── Recent activity feed (combined, sorted by time) ─
  type ActivityItem = { id: string; type: "contact" | "application"; name: string; sub: string; time: string; status: string };
  const recentActivity: ActivityItem[] = [
    ...(contacts as any[]).slice(0, 5).map((c: any) => ({
      id: c.id,
      type: "contact" as const,
      name: c.name,
      sub: c.subject || "Allgemeine Anfrage",
      time: c.created_at,
      status: c.status,
    })),
    ...(apps as any[]).slice(0, 5).map((a: any) => ({
      id: a.id,
      type: "application" as const,
      name: a.name,
      sub: a.jobs?.title || "Offene Stelle",
      time: a.created_at,
      status: a.status,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  const greeting = getGreeting();
  const GreetIcon = greeting.Icon;

  // ── KPI Cards ─────────────────────────────────────
  const kpiCards = [
    {
      label: "Projektanfragen",
      value: totalContacts,
      badge: newContacts > 0 ? `${newContacts} neu` : null,
      badgeColor: "bg-emerald-100 text-emerald-700",
      sub: newContacts > 0 ? `${newContacts} unbearbeitet` : "Alle bearbeitet",
      Icon: FileCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      href: "/admin/anfragen",
      progress: Math.min(100, totalContacts * 10),
      progressColor: "bg-green-500",
    },
    {
      label: "Bewerbungen",
      value: totalApps,
      badge: newApps > 0 ? `${newApps} neu` : null,
      badgeColor: "bg-blue-100 text-blue-700",
      sub: newApps > 0 ? `${newApps} in Pipeline` : "Pipeline leer",
      Icon: Briefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      href: "/admin/bewerbungen",
      progress: Math.min(100, totalApps * 15),
      progressColor: "bg-blue-500",
    },
    {
      label: "Leistungsseiten",
      value: totalServices,
      badge: null,
      badgeColor: "",
      sub: `${totalServices} aktiv`,
      Icon: Sprout,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      href: "/admin/leistungen",
      progress: Math.min(100, (totalServices / 8) * 100),
      progressColor: "bg-amber-500",
    },
    {
      label: "Referenzprojekte",
      value: totalProjects,
      badge: null,
      badgeColor: "",
      sub: `${totalProjects} im Portfolio`,
      Icon: Hammer,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      href: "/admin/projekte",
      progress: Math.min(100, totalProjects * 8),
      progressColor: "bg-orange-500",
    },
    {
      label: "Stellenanzeigen",
      value: totalJobs,
      badge: activeJobs > 0 ? `${activeJobs} aktiv` : null,
      badgeColor: "bg-purple-100 text-purple-700",
      sub: `${activeJobs} ausgeschrieben`,
      Icon: Leaf,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      href: "/admin/jobs",
      progress: Math.min(100, totalJobs * 20),
      progressColor: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">

      {/* ── GREETING HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-brand/8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <GreetIcon className={`w-5 h-5 ${greeting.color}`} />
            <span className="text-sm font-semibold text-foreground/50">{today()}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-brand tracking-tight leading-tight">
            {greeting.text}, Chef! 🌱
          </h1>
          <p className="text-sm text-foreground/50 mt-1.5">
            Hier ist Ihre Übersicht für heute – alles auf einem Blick.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {newContacts > 0 && (
            <Link
              to="/admin/anfragen"
              className="flex items-center gap-2 bg-accent/10 border border-accent/20 hover:bg-accent/15 text-accent px-4 py-2.5 rounded-full text-xs font-bold transition"
            >
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              {newContacts} neue Anfragen
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {newApps > 0 && (
            <Link
              to="/admin/bewerbungen"
              className="flex items-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-full text-xs font-bold transition"
            >
              <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
              {newApps} Bewerbungen
            </Link>
          )}
        </div>
      </div>

      {/* ── KPI CARDS ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map(({ label, value, badge, badgeColor, sub, Icon, iconBg, iconColor, href, progress, progressColor }) => (
          <Link
            key={label}
            to={href}
            className="bg-surface border border-brand/10 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-brand/20 transition-all group flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className={`size-10 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              {badge && (
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold text-foreground/45 mb-1">
                {label}
              </p>
              <div className="flex items-end justify-between gap-2">
                <span className="text-3xl font-black text-brand font-display tabular-nums">{value}</span>
                <ArrowUpRight className="w-4 h-4 text-brand/25 group-hover:text-brand transition-colors mb-0.5" />
              </div>
              <p className="text-[11px] text-foreground/45 mt-1">{sub}</p>
            </div>

            {/* Mini progress bar */}
            <div className="h-1 bg-foreground/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* ── CHART + ACTIVITY ────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* Area Chart */}
        <div className="lg:col-span-8 bg-surface border border-brand/10 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display font-extrabold text-brand text-lg">Eingangs-Übersicht</h2>
              <p className="text-xs text-foreground/45 mt-0.5">Anfragen & Bewerbungen — letzte 14 Tage</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-green-500 inline-block" />Anfragen</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-blue-400 inline-block" />Bewerbungen</span>
            </div>
          </div>

          {totalContacts === 0 && totalApps === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center gap-3">
              <div className="size-14 rounded-full bg-brand/5 flex items-center justify-center">
                <Inbox className="h-6 w-6 text-brand/25" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand/50">Noch keine Einträge</p>
                <p className="text-xs text-foreground/35 mt-1 max-w-xs">
                  Sobald Kunden das Kontaktformular oder den Gartenplaner nutzen, erscheinen hier die Daten.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradAnfragen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradBewerbungen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} interval={1} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "1rem",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Area name="Anfragen" type="monotone" dataKey="Anfragen" stroke={BRAND} strokeWidth={2.5} fill="url(#gradAnfragen)" dot={false} activeDot={{ r: 5, fill: BRAND }} />
                  <Area name="Bewerbungen" type="monotone" dataKey="Bewerbungen" stroke="#60a5fa" strokeWidth={2} fill="url(#gradBewerbungen)" dot={false} activeDot={{ r: 4, fill: "#60a5fa" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-4 bg-surface border border-brand/10 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-extrabold text-brand text-base">Aktivitäts-Log</h2>
            <Link
              to="/admin/anfragen"
              className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-brand transition"
            >
              Alle
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-8">
              <Inbox className="w-8 h-8 text-brand/20" />
              <p className="text-xs text-foreground/40">Noch keine Aktivität</p>
            </div>
          ) : (
            <div className="space-y-0.5 flex-1 overflow-y-auto">
              {recentActivity.map((item) => {
                const isNew = item.status === "new";
                const relTime = (() => {
                  const diff = Date.now() - new Date(item.time).getTime();
                  const mins = Math.floor(diff / 60000);
                  if (mins < 60) return `${mins}m`;
                  const hrs = Math.floor(mins / 60);
                  if (hrs < 24) return `${hrs}h`;
                  return `${Math.floor(hrs / 24)}T`;
                })();

                return (
                  <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand/4 transition group">
                    {/* Avatar */}
                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                      item.type === "contact" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-brand truncate">{item.name}</p>
                        <span className="text-[10px] text-foreground/35 shrink-0">{relTime}</span>
                      </div>
                      <p className="text-[10px] text-foreground/50 truncate mt-0.5">{item.sub}</p>
                    </div>
                    {isNew && (
                      <span className="size-2 rounded-full bg-accent mt-2 shrink-0 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── LETZTE ANFRAGEN TABLE ───────────────────────────────────────── */}
      <div className="bg-surface border border-brand/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-brand/6">
          <div>
            <h2 className="font-display font-extrabold text-brand text-base">Letzte Projektanfragen</h2>
            <p className="text-xs text-foreground/45 mt-0.5">Direkt aus Ihrer Datenbank — nur echte Einträge</p>
          </div>
          <Link
            to="/admin/anfragen"
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent hover:text-brand transition"
          >
            Alle <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {(contacts as any[]).length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-4 text-center px-8">
            <div className="size-14 rounded-full bg-brand/5 flex items-center justify-center">
              <Mail className="h-7 w-7 text-brand/20" />
            </div>
            <div>
              <p className="font-semibold text-brand/50">Noch keine Anfragen</p>
              <p className="text-xs text-foreground/35 mt-1 max-w-sm">
                Wenn Kunden das Kontaktformular oder den Gartenplaner nutzen, erscheinen hier die Anfragen in Echtzeit.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-brand/5">
            {(contacts as any[]).slice(0, 6).map((c: any, i: number) => (
              <Link
                key={c.id}
                to="/admin/anfragen"
                className="flex items-center gap-4 px-6 md:px-8 py-4 hover:bg-brand/[0.025] transition-colors group"
              >
                {/* Index avatar */}
                <div className="size-9 rounded-full bg-brand/8 flex items-center justify-center flex-shrink-0 text-xs font-bold text-brand">
                  {c.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-brand truncate">{c.name}</p>
                    {c.status === "new" && (
                      <span className="size-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-foreground/45 truncate mt-0.5">
                    {c.subject || "Allgemeine Anfrage"} · {c.email}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                    c.status === "new"
                      ? "bg-accent/15 text-accent"
                      : c.status === "handled"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-foreground/10 text-foreground/45"
                  }`}>
                    {c.status === "new" ? "Neu" : c.status === "handled" ? "Erledigt" : "Archiviert"}
                  </span>
                  <span className="text-[10px] text-foreground/35 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(c.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-brand/20 group-hover:text-brand transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── SCHNELLZUGRIFF ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Neue Leistung", sub: "Gewerk anlegen", href: "/admin/leistungen", Icon: Sprout, color: "bg-green-100 text-green-700" },
          { label: "Projekt upload", sub: "Mit Fotos & Gewerk", href: "/admin/projekte", Icon: Hammer, color: "bg-orange-100 text-orange-700" },
          { label: "Stelle schalten", sub: "Job anlegen & aktiv", href: "/admin/jobs", Icon: Briefcase, color: "bg-blue-100 text-blue-700" },
          { label: "Bilder & Logo", sub: "Hero, About, Logo", href: "/admin/bilder", Icon: Leaf, color: "bg-purple-100 text-purple-700" },
        ].map(({ label, sub, href, Icon, color }) => (
          <Link
            key={label}
            to={href}
            className="bg-surface border border-brand/10 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-brand/20 transition-all group flex items-center gap-3"
          >
            <div className={`size-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand truncate">{label}</p>
              <p className="text-[10px] text-foreground/45 truncate">{sub}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-brand/20 group-hover:text-brand transition-colors ml-auto flex-shrink-0" />
          </Link>
        ))}
      </div>

    </div>
  );
}
