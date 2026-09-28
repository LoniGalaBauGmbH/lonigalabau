import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  getTrackingSettings,
  updateTrackingSettings,
  type TrackingSettings,
} from "@/lib/tracking.functions";
import { BarChart3, Megaphone, Cookie, Code2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/tracking")({
  component: Page,
});

function Page() {
  const fetchFn = useServerFn(getTrackingSettings);
  const saveFn = useServerFn(updateTrackingSettings);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tracking-settings"],
    queryFn: () => fetchFn(),
  });

  const [form, setForm] = useState<TrackingSettings | null>(null);
  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  const mut = useMutation({
    mutationFn: (payload: TrackingSettings) => saveFn({ data: payload }),
    onSuccess: () => {
      toast.success("Einstellungen gespeichert");
      qc.invalidateQueries({ queryKey: ["tracking-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !form) return <p className="opacity-60">Lade…</p>;

  const update = <K extends keyof TrackingSettings>(k: K, v: TrackingSettings[K]) =>
    setForm({ ...form, [k]: v });

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-start justify-between gap-6 border-b border-brand/5 pb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold">Datenschutz & Analytics</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-1 text-brand tracking-tight">Tracking-Verwaltung</h1>
          <p className="opacity-60 text-sm mt-2 max-w-2xl leading-relaxed">
            Tracking-IDs werden nur geladen, wenn Besucher der jeweiligen Kategorie zustimmen. Bei Änderung der Consent-Version müssen alle Besucher erneut zustimmen.
          </p>
        </div>
        <button
          onClick={() => mut.mutate(form)}
          disabled={mut.isPending}
          className="flex items-center gap-2 bg-brand text-brand-foreground px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/90 transition shadow-lg disabled:opacity-50 shrink-0 self-start"
        >
          {mut.isPending ? "Speichere…" : "Einstellungen speichern"}
        </button>
      </div>

      <Section icon={<Cookie className="w-4 h-4" />} title="Banner-Texte">
        <Field label="Überschrift">
          <input
            type="text"
            value={form.banner.title}
            onChange={(e) => update("banner", { ...form.banner, title: e.target.value })}
            className="input"
            maxLength={120}
          />
        </Field>
        <Field label="Beschreibung">
          <textarea
            value={form.banner.description}
            onChange={(e) => update("banner", { ...form.banner, description: e.target.value })}
            rows={3}
            className="input"
            maxLength={800}
          />
        </Field>
      </Section>

      <Section icon={<BarChart3 className="w-4 h-4" />} title="Statistik / Analytics">
        <Field label="Google Analytics 4 (Measurement-ID)" hint="Format: G-XXXXXXX">
          <input
            type="text"
            value={form.ga4}
            onChange={(e) => update("ga4", e.target.value.trim())}
            placeholder="G-XXXXXXXXXX"
            className="input"
          />
        </Field>
        <Field label="Google Tag Manager (Container-ID)" hint="Format: GTM-XXXXXX">
          <input
            type="text"
            value={form.gtm}
            onChange={(e) => update("gtm", e.target.value.trim())}
            placeholder="GTM-XXXXXXX"
            className="input"
          />
        </Field>
        <ToggleRow
          label="IP-Adressen anonymisieren"
          description="Empfohlen für DSGVO-konforme Reichweitenmessung."
          checked={form.anonymizeIp}
          onChange={(v) => update("anonymizeIp", v)}
        />
      </Section>

      <Section icon={<Megaphone className="w-4 h-4" />} title="Marketing-Pixel">
        <Field label="Meta (Facebook) Pixel-ID" hint="Nur Zahlen">
          <input
            type="text"
            value={form.metaPixel}
            onChange={(e) => update("metaPixel", e.target.value.trim())}
            placeholder="1234567890"
            className="input"
          />
        </Field>
        <Field label="LinkedIn Insight Tag (Partner-ID)" hint="Nur Zahlen">
          <input
            type="text"
            value={form.linkedinId}
            onChange={(e) => update("linkedinId", e.target.value.trim())}
            placeholder="123456"
            className="input"
          />
        </Field>
        <Field label="TikTok Pixel-ID">
          <input
            type="text"
            value={form.tiktokId}
            onChange={(e) => update("tiktokId", e.target.value.trim())}
            placeholder="CXXXXXXXXXXXXXXXXXXX"
            className="input"
          />
        </Field>
      </Section>

      <Section icon={<Code2 className="w-4 h-4" />} title="Custom Script (Statistik-Consent)">
        <Field
          label="HTML/JavaScript (wird in <head> eingefügt)"
          hint="Achtung: Code wird unverändert ausgeführt – nur vertrauenswürdigen Code einfügen."
        >
          <textarea
            value={form.customHead}
            onChange={(e) => update("customHead", e.target.value)}
            rows={6}
            className="input font-mono text-xs"
            placeholder="// z. B. Plausible, Matomo, etc."
            maxLength={10000}
          />
        </Field>
      </Section>

      <Section icon={<RefreshCw className="w-4 h-4" />} title="Consent-Version">
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-brand/10 bg-surface/40">
          <div>
            <p className="text-sm font-medium">Aktuelle Version: {form.consentVersion}</p>
            <p className="text-xs opacity-60 mt-1">
              Erhöhen Sie die Version, um allen Besuchern den Banner erneut zu zeigen.
            </p>
          </div>
          <button
            type="button"
            onClick={() => update("consentVersion", form.consentVersion + 1)}
            className="text-sm px-4 py-2 rounded-full border border-brand/20 hover:bg-brand/5"
          >
            Version erhöhen
          </button>
        </div>
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={() => mut.mutate(form)}
          disabled={mut.isPending}
          className="flex items-center gap-2 bg-brand text-brand-foreground px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/90 transition shadow-lg disabled:opacity-50"
        >
          {mut.isPending ? "Speichere…" : "Alle Einstellungen sichern"}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid color-mix(in oklab, var(--brand) 15%, transparent);
          background: var(--background);
          color: var(--foreground);
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: color-mix(in oklab, var(--brand) 50%, transparent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand) 12%, transparent);
        }
      `}</style>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface rounded-2xl p-6 border border-brand/5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center">
          {icon}
        </div>
        <h2 className="font-serif text-xl">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1.5">{label}</span>
      {children}
      {hint && <span className="text-xs opacity-50 block mt-1">{hint}</span>}
    </label>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-brand/10">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs opacity-60 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition shrink-0 ${checked ? "bg-brand" : "bg-foreground/15"}`}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}
