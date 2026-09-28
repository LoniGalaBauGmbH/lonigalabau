import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shield, BarChart3, Megaphone, X } from "lucide-react";
import { getTrackingSettings } from "@/lib/tracking.functions";

import { readConsent, writeConsent, type Consent } from "@/lib/consent";

export function CookieBanner() {
  const fetchSettings = useServerFn(getTrackingSettings);
  const { data: settings } = useQuery({
    queryKey: ["tracking-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 5 * 60_000,
  });

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Initial show
  useEffect(() => {
    setMounted(true);
    if (!settings) return;
    if (
      ![
        settings.ga4,
        settings.gtm,
        settings.customHead,
        settings.metaPixel,
        settings.linkedinId,
        settings.tiktokId,
      ].some(Boolean)
    )
      return;
    const existing = readConsent();
    if (!existing || existing.version !== settings.consentVersion) {
      const t = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(t);
    }
    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, [settings]);

  // Re-open from footer/link
  useEffect(() => {
    const handler = () => {
      const existing = readConsent();
      if (existing) {
        setAnalytics(existing.analytics);
        setMarketing(existing.marketing);
      }
      setSettingsOpen(true);
      setOpen(true);
    };
    window.addEventListener("loni:open-cookies", handler);
    return () => window.removeEventListener("loni:open-cookies", handler);
  }, []);

  function persist(c: Omit<Consent, "version" | "ts" | "necessary">) {
    if (!settings) return;
    writeConsent({
      necessary: true,
      analytics: c.analytics,
      marketing: c.marketing,
      version: settings.consentVersion,
      ts: Date.now(),
    });
    setOpen(false);
    setSettingsOpen(false);
  }

  const acceptAll = () => persist({ analytics: true, marketing: true });
  const rejectAll = () => persist({ analytics: false, marketing: false });
  const saveSelection = () => persist({ analytics, marketing });

  if (!mounted || !open || !settings) return null;

  const hasAnalytics = !!(settings.ga4 || settings.gtm || settings.customHead);
  const hasMarketing = !!(settings.metaPixel || settings.linkedinId || settings.tiktokId);

  return (
    <>
      {/* Settings modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_.2s_ease]"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden animate-[popIn_.25s_cubic-bezier(.2,1,.3,1)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
          >
            <div className="p-6 md:p-7 border-b border-border/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="cookie-settings-title" className="text-xl font-bold text-brand">
                    Datenschutz-Einstellungen
                  </h2>
                  <p className="text-xs text-foreground/70 mt-1">
                    Entscheiden Sie selbst, welche Cookies und Dienste Sie zulassen möchten.
                  </p>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-lg p-1.5 text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
              <ConsentRow
                icon={<Shield className="w-4 h-4 text-brand" />}
                title="Technisch notwendig"
                description="Diese Cookies sind für das Grundgerüst und die Sicherheit der Website zwingend erforderlich."
                badge="Immer aktiv"
                checked
                disabled
              />
              <ConsentRow
                icon={<BarChart3 className="w-4 h-4 text-brand" />}
                title="Statistik & Performance"
                description="Hilft uns zu verstehen, wie Besucher unsere Website nutzen (anonymisierte Reichweitenmessung)."
                services={[
                  settings.ga4 && "Google Analytics 4",
                  settings.gtm && "Google Tag Manager",
                ]
                  .filter(Boolean)
                  .join(", ")}
                available={hasAnalytics}
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentRow
                icon={<Megaphone className="w-4 h-4 text-brand" />}
                title="Marketing & Werbung"
                description="Ermöglicht das Einbinden externer Medien und personalisierter Werbeangebote."
                services={[
                  settings.metaPixel && "Meta Pixel",
                  settings.linkedinId && "LinkedIn",
                  settings.tiktokId && "TikTok",
                ]
                  .filter(Boolean)
                  .join(", ")}
                available={hasMarketing}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="p-6 bg-background/60 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-4 text-xs font-medium text-foreground/60">
                <a
                  href="/datenschutz"
                  className="hover:text-brand underline-offset-2 hover:underline"
                >
                  Datenschutz
                </a>
                <a
                  href="/impressum"
                  className="hover:text-brand underline-offset-2 hover:underline"
                >
                  Impressum
                </a>
              </div>
              <div className="flex flex-wrap gap-2.5 ml-auto">
                <button
                  onClick={saveSelection}
                  className="text-xs px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-background transition font-medium text-foreground"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={acceptAll}
                  className="text-xs px-4 py-2.5 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 transition font-semibold shadow-sm"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact banner */}
      {!settingsOpen && (
        <div
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto z-[100] md:max-w-md"
          role="dialog"
          aria-labelledby="cookie-title"
        >
          <div className="bg-surface/95 backdrop-blur-md border border-border shadow-xl rounded-2xl p-5 md:p-6 animate-[slideUp_.35s_cubic-bezier(.2,1,.3,1)]">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-brand" />
              <h3 id="cookie-title" className="font-bold text-sm text-brand">
                {settings.banner.title || "Hinweis zum Datenschutz"}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-foreground/75">
              {settings.banner.description ||
                "Wir nutzen Cookies auf unserer Website. Einige sind essenziell, während andere uns helfen, diese Website und Ihre Erfahrung zu verbessern."}{" "}
              <a
                href="/datenschutz"
                className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand font-medium"
              >
                Datenschutzerklärung
              </a>
              .
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={acceptAll}
                className="flex-1 min-w-[120px] text-xs px-4 py-2.5 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 transition font-semibold shadow-sm"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={rejectAll}
                className="text-xs px-3.5 py-2.5 rounded-xl border border-border bg-background hover:bg-border/40 transition font-medium text-foreground"
              >
                Nur essenzielle
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="text-xs px-3.5 py-2.5 rounded-xl text-foreground/70 hover:text-brand hover:bg-brand/5 transition font-medium"
              >
                Einstellungen
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </>
  );
}

function ConsentRow({
  icon,
  title,
  description,
  services,
  badge,
  available = true,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  services?: string;
  badge?: string;
  available?: boolean;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  const isDisabled = disabled || !available;
  return (
    <div
      className={`p-4 rounded-2xl border transition ${
        checked && !isDisabled ? "border-brand/30 bg-brand/5" : "border-brand/10 bg-surface/40"
      } ${isDisabled ? "opacity-80" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-sm">{title}</p>
            {badge ? (
              <span className="text-[10px] uppercase tracking-wider text-accent font-medium">
                {badge}
              </span>
            ) : (
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={isDisabled}
                onClick={() => !isDisabled && onChange?.(!checked)}
                className={`relative w-10 h-6 rounded-full transition shrink-0 ${
                  checked ? "bg-brand" : "bg-foreground/15"
                } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
                />
              </button>
            )}
          </div>
          <p className="text-xs text-foreground/60 mt-1 leading-relaxed">{description}</p>
          {services && <p className="text-[11px] text-foreground/50 mt-1.5">Dienste: {services}</p>}
          {!available && !disabled && (
            <p className="text-[11px] text-foreground/40 mt-1.5 italic">
              Aktuell keine Dienste konfiguriert.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
