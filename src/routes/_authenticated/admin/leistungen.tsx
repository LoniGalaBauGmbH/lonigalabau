import { publicImageToDataUrl as fileToBase64 } from "@/lib/public-image-upload";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  adminListServices,
  adminUpsertService,
  adminDeleteService,
  adminUploadFile,
} from "@/lib/admin.functions";
import { serviceSchema, type ServiceInput } from "@/lib/validators";
import {
  Sprout,
  Layers,
  Plus,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  Upload,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  HelpCircle,
  MapPin,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/leistungen")({
  component: Page,
});

const empty: ServiceInput = {
  slug: "",
  title: "",
  category: "Gartengestaltung",
  short_text: "",
  long_text: "",
  hero_image: "",
  sort_order: 0,
  active: true,
  meta_title: "",
  meta_description: "",
  geo_focus: "",
  custom_benefits: [],
  custom_faqs: [],
};

function Page() {
  const list = useServerFn(adminListServices);
  const upsert = useServerFn(adminUpsertService);
  const del = useServerFn(adminDeleteService);
  const uploadFn = useServerFn(adminUploadFile);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => list(),
  });

  const [editing, setEditing] = useState<ServiceInput | null>(null);
  const [showSeo, setShowSeo] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showFaqs, setShowFaqs] = useState(false);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setErr("");
    setSaving(true);
    try {
      const parsed = serviceSchema.parse(editing);
      await upsert({ data: parsed });
      toast.success(editing.id ? "Leistung aktualisiert" : "Gewerk erfolgreich angelegt");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    } catch (e2: unknown) {
      setErr(e2 instanceof Error ? e2.message : "Fehler bei der Validierung.");
      toast.error("Validierungsfehler");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (
      !confirm(
        "Möchten Sie dieses Gewerk wirklich löschen? Dies blendet alle verknüpften Detailseiten aus.",
      )
    )
      return;
    try {
      await del({ data: { id } });
      toast.success("Dienstleistung gelöscht");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    } catch (e) {
      toast.error("Löschen fehlgeschlagen");
    }
  }

  // Upload service hero image via server function (supabaseAdmin – bypasses RLS)
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editing) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Bild zu groß – maximal 10 MB erlaubt");
      return;
    }

    setUploading(true);
    const toastId = "svc-img-upload";
    toast.loading("Bild wird hochgeladen…", { id: toastId });
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `svc-${editing.slug || "gen"}-${Date.now()}.${ext}`;
      const base64 = await fileToBase64(file);

      const { url } = await uploadFn({
        data: { bucket: "service-images", path, base64, contentType: file.type },
      });

      setEditing({ ...editing, hero_image: url });
      toast.success("Bild erfolgreich hochgeladen ✓", { id: toastId });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Upload fehlgeschlagen";
      toast.error(msg, { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  // Live slug creator helper
  const handleTitleChange = (val: string) => {
    if (!editing) return;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setEditing({
      ...editing,
      title: val,
      slug: editing.id ? editing.slug : generatedSlug,
    });
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold font-display">
            Services & Gewerke
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mt-1 text-brand tracking-tight">
            Leistungs-Manager
          </h1>
          <p className="opacity-60 text-sm mt-2 max-w-xl">
            Verwalten Sie die Haupt-Dienstleistungen und Gewerke Ihrer Webseite. Steuern Sie
            Beschreibungen und Bildmaterial.
          </p>
        </div>

        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 bg-brand text-brand-foreground px-5 py-3 rounded-full text-xs font-bold font-display uppercase tracking-wider hover:bg-brand/90 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Neues Gewerk
        </button>
      </div>

      {/* LIST SERVICES */}
      {isLoading ? (
        <div className="py-20 text-center opacity-60 text-sm">Lade Leistungen...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.length === 0 ? (
            <div className="bg-surface rounded-3xl p-16 text-center border border-brand/5 shadow-sm">
              <Sprout className="w-12 h-12 text-brand/20 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-brand">Keine Leistungen angelegt</h3>
              <p className="text-xs text-foreground/50 mt-1">
                Klicken Sie oben auf "Neues Gewerk", um Ihren ersten Service zu veröffentlichen.
              </p>
            </div>
          ) : (
            data?.map((s) => (
              <div
                key={s.id}
                className="bg-surface border border-brand/10 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-shadow shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Image Thumbnail */}
                  <div className="w-16 h-12 rounded-xl bg-background border border-brand/5 overflow-hidden shrink-0 flex items-center justify-center">
                    {s.hero_image ? (
                      <img
                        src={s.hero_image}
                        alt={s.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-foreground/35" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-bold text-brand leading-snug">
                        {s.title}
                      </h3>
                      <span className="text-[9px] bg-brand/5 text-brand/75 font-mono px-2 py-0.5 rounded-md border border-brand/10">
                        /{s.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-foreground/50 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-accent">
                        <Layers className="w-3.5 h-3.5" /> {s.category || "Gartengestaltung"}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Sortier-Index: {s.sort_order}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-brand/5">
                  <span
                    className={`text-[9px] font-display font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                      s.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-foreground/10 text-foreground/50"
                    }`}
                  >
                    {s.active ? "Aktiv" : "Inaktiv"}
                  </span>

                  <div className="flex gap-2">
                    <a
                      href={`/leistungen/${s.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 hover:bg-accent/10 border border-accent/20 text-accent rounded-full transition"
                      title="Live-Vorschau öffnen"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() =>
                        setEditing({
                          ...s,
                          category: s.category || "",
                          meta_title: s.meta_title || "",
                          meta_description: s.meta_description || "",
                          geo_focus: s.geo_focus || "",
                          custom_benefits: serviceSchema.shape.custom_benefits.parse(
                            s.custom_benefits || [],
                          ),
                          custom_faqs: serviceSchema.shape.custom_faqs.parse(s.custom_faqs || []),
                        })
                      }
                      className="p-2.5 hover:bg-brand/5 border border-brand/10 text-brand rounded-full transition"
                      title="Bearbeiten"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(s.id!)}
                      className="p-2.5 hover:bg-red-50 border border-red-100 text-red-600 rounded-full transition"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EDIT DRAWER — full-height side panel */}
      {editing && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-brand/30 backdrop-blur-sm z-40"
            onClick={() => setEditing(null)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-surface shadow-2xl z-50 flex flex-col border-l border-brand/10 animate-slide-in-right">
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand/10 shrink-0 bg-surface">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-accent font-bold">
                  {editing.id ? "Gewerk bearbeiten" : "Neues Gewerk"}
                </p>
                <h2 className="font-serif text-xl text-brand font-semibold leading-tight mt-0.5">
                  {editing.title || "Unbenannte Leistung"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="p-2 hover:bg-brand/8 rounded-full transition text-foreground/50 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <form onSubmit={save} className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-5">
                {err && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-tight">{err}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <F label="Titel *">
                    <input
                      required
                      type="text"
                      value={editing.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="z. B. Natursteinarbeiten"
                      className="i"
                    />
                  </F>

                  <F label="Slug * (URL)">
                    <input
                      required
                      type="text"
                      pattern="^[a-z0-9\\-]+$"
                      title="Nur Kleinbuchstaben, Ziffern und Bindestrich"
                      value={editing.slug}
                      onChange={(e) =>
                        setEditing({ ...editing, slug: e.target.value.toLowerCase().trim() })
                      }
                      placeholder="natursteinarbeiten"
                      className="i font-mono"
                    />
                  </F>

                  <F label="Kategorie">
                    <select
                      value={editing.category || "Gartengestaltung"}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className="i"
                    >
                      <option value="Gartengestaltung">Gartengestaltung</option>
                      <option value="Steinarbeiten">Steinarbeiten / Pflasterarbeiten</option>
                      <option value="Tiefbau">Tiefbau / Erdarbeiten</option>
                      <option value="Technik">Technik / Bewässerung</option>
                    </select>
                  </F>

                  <F label="Sort-Index">
                    <input
                      type="number"
                      value={editing.sort_order}
                      onChange={(e) =>
                        setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })
                      }
                      className="i"
                    />
                  </F>
                </div>

                {/* Hero Image */}
                <div className="space-y-2">
                  <span className="block text-[10px] uppercase tracking-widest opacity-50 font-extrabold">
                    Hero-Bild
                  </span>
                  <div className="flex gap-4 items-center p-4 border border-brand/10 bg-background rounded-2xl">
                    <div className="w-20 h-14 rounded-xl bg-surface border overflow-hidden flex items-center justify-center shrink-0">
                      {editing.hero_image ? (
                        <img
                          src={editing.hero_image}
                          alt="Vorschau"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={editing.hero_image || ""}
                        onChange={(e) => setEditing({ ...editing, hero_image: e.target.value })}
                        placeholder="Direkte Bild-URL..."
                        className="i text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand/20 hover:bg-brand/5 cursor-pointer text-xs font-semibold text-brand transition">
                          <Upload className="w-3.5 h-3.5" />
                          {uploading ? "Hochladen..." : "Hochladen"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                        {editing.hero_image && (
                          <button
                            type="button"
                            onClick={() => setEditing({ ...editing, hero_image: "" })}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Entfernen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <F label="Kurztext (max. 500 Zeichen)">
                  <textarea
                    rows={3}
                    value={editing.short_text}
                    maxLength={500}
                    onChange={(e) => setEditing({ ...editing, short_text: e.target.value })}
                    placeholder="Kurze, prägnante Zusammenfassung..."
                    className="i resize-none"
                  />
                </F>

                <F label="Langtext (Ausführliche Leistungsbeschreibung)">
                  <textarea
                    rows={8}
                    value={editing.long_text}
                    onChange={(e) => setEditing({ ...editing, long_text: e.target.value })}
                    placeholder="Ausführlicher Text mit Leistungsbeschreibungen..."
                    className="i font-light leading-relaxed resize-none"
                  />
                </F>

                {/* ── SEO & Geo-SEO COLLAPSIBLE SECTION ── */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSeo(!showSeo)}
                    className="w-full flex items-center justify-between p-4 border border-brand/10 bg-background/30 hover:bg-brand/5 rounded-2xl transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-brand/5 flex items-center justify-center text-brand">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-display uppercase tracking-wider text-brand">
                          SEO & Geo-Marketing
                        </h4>
                        <p className="text-[10px] text-foreground/45 mt-0.5">
                          Suchmaschinen-Metadaten & Regionaler Fokus
                        </p>
                      </div>
                    </div>
                    {showSeo ? (
                      <ChevronUp className="w-4 h-4 text-brand/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-brand/50" />
                    )}
                  </button>

                  {showSeo && (
                    <div className="p-4 border border-brand/10 bg-background/10 rounded-2xl space-y-4 animate-fade-down">
                      <div className="grid grid-cols-2 gap-4">
                        <F label="Meta-Titel (Optional)">
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={editing.meta_title || ""}
                              onChange={(e) =>
                                setEditing({ ...editing, meta_title: e.target.value })
                              }
                              placeholder="z.B. Pflasterarbeiten Frankfurt | Loni"
                              className="i text-xs"
                            />
                            <div className="flex justify-between text-[8px] text-foreground/40 font-mono px-1">
                              <span>Optimal: 50-60 Z.</span>
                              <span>{(editing.meta_title || "").length} Z.</span>
                            </div>
                          </div>
                        </F>
                        <F label="Geo-Fokus (Städte/Regionen)">
                          <input
                            type="text"
                            value={editing.geo_focus || ""}
                            onChange={(e) => setEditing({ ...editing, geo_focus: e.target.value })}
                            placeholder="z.B. Hattersheim, Frankfurt, Wiesbaden"
                            className="i text-xs"
                          />
                        </F>
                      </div>
                      <F label="Meta-Beschreibung (Optional)">
                        <div className="space-y-1">
                          <textarea
                            rows={3}
                            value={editing.meta_description || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, meta_description: e.target.value })
                            }
                            placeholder="z.B. Exklusive Pflasterarbeiten in Frankfurt & Hattersheim. ✔ Meisterbetrieb ✔ Festpreisgarantie. Jetzt anfragen!"
                            className="i resize-none text-xs"
                          />
                          <div className="flex justify-between text-[8px] text-foreground/40 font-mono px-1">
                            <span>Optimal: 150-160 Z.</span>
                            <span>{(editing.meta_description || "").length} Z.</span>
                          </div>
                        </div>
                      </F>
                    </div>
                  )}
                </div>

                {/* ── CUSTOM BENEFITS COLLAPSIBLE SECTION ── */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowBenefits(!showBenefits)}
                    className="w-full flex items-center justify-between p-4 border border-brand/10 bg-background/30 hover:bg-brand/5 rounded-2xl transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-brand/5 flex items-center justify-center text-brand">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-display uppercase tracking-wider text-brand">
                          Vorteile & Leistungsumfang
                        </h4>
                        <p className="text-[10px] text-foreground/45 mt-0.5">
                          Ersetzt den standardmäßig angezeigten Leistungsumfang (max. 6 Boxen)
                        </p>
                      </div>
                    </div>
                    {showBenefits ? (
                      <ChevronUp className="w-4 h-4 text-brand/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-brand/50" />
                    )}
                  </button>

                  {showBenefits && (
                    <div className="p-4 border border-brand/10 bg-background/10 rounded-2xl space-y-4 animate-fade-down">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                          Leistungsumfang ({(editing.custom_benefits || []).length} / 6)
                        </span>
                        <button
                          type="button"
                          disabled={(editing.custom_benefits || []).length >= 6}
                          onClick={() => {
                            const current = [...(editing.custom_benefits || [])];
                            current.push({ t: "", d: "" });
                            setEditing({ ...editing, custom_benefits: current });
                          }}
                          className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline disabled:opacity-40"
                        >
                          + Vorteil hinzufügen
                        </button>
                      </div>

                      {(editing.custom_benefits || []).length === 0 ? (
                        <p className="text-xs text-foreground/45 text-center py-4 bg-background/20 rounded-xl">
                          Keine benutzerdefinierten Vorteile. Es wird der Standard-Leistungsumfang
                          des Gewerks angezeigt.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {(editing.custom_benefits || []).map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 bg-surface border border-brand/5 rounded-xl space-y-2 relative group shadow-sm"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const current = (editing.custom_benefits || []).filter(
                                    (_, i) => i !== idx,
                                  );
                                  setEditing({ ...editing, custom_benefits: current });
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Vorteil entfernen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <input
                                required
                                type="text"
                                value={item.t}
                                onChange={(e) => {
                                  const current = [...(editing.custom_benefits || [])];
                                  current[idx].t = e.target.value;
                                  setEditing({ ...editing, custom_benefits: current });
                                }}
                                placeholder={`Vorteil #${idx + 1} Titel (z.B. CAD-Planung)`}
                                className="i font-semibold text-xs"
                              />
                              <textarea
                                required
                                rows={2}
                                value={item.d}
                                onChange={(e) => {
                                  const current = [...(editing.custom_benefits || [])];
                                  current[idx].d = e.target.value;
                                  setEditing({ ...editing, custom_benefits: current });
                                }}
                                placeholder="Kurze Ausformulierung des Vorteils..."
                                className="i text-xs resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── CUSTOM FAQs COLLAPSIBLE SECTION ── */}
                <div className="space-y-3 pb-3">
                  <button
                    type="button"
                    onClick={() => setShowFaqs(!showFaqs)}
                    className="w-full flex items-center justify-between p-4 border border-brand/10 bg-background/30 hover:bg-brand/5 rounded-2xl transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-brand/5 flex items-center justify-center text-brand">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-display uppercase tracking-wider text-brand">
                          Fragen & Antworten (FAQ)
                        </h4>
                        <p className="text-[10px] text-foreground/45 mt-0.5">
                          Ersetzt die Standard-Häufigen Fragen (FAQs) dieses Gewerks
                        </p>
                      </div>
                    </div>
                    {showFaqs ? (
                      <ChevronUp className="w-4 h-4 text-brand/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-brand/50" />
                    )}
                  </button>

                  {showFaqs && (
                    <div className="p-4 border border-brand/10 bg-background/10 rounded-2xl space-y-4 animate-fade-down">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                          FAQ-Liste ({(editing.custom_faqs || []).length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = [...(editing.custom_faqs || [])];
                            current.push({ q: "", a: "" });
                            setEditing({ ...editing, custom_faqs: current });
                          }}
                          className="text-[10px] font-bold text-brand uppercase tracking-wider hover:underline"
                        >
                          + FAQ hinzufügen
                        </button>
                      </div>

                      {(editing.custom_faqs || []).length === 0 ? (
                        <p className="text-xs text-foreground/45 text-center py-4 bg-background/20 rounded-xl">
                          Keine benutzerdefinierten FAQs. Es werden die Standard-FAQs des Gewerks
                          angezeigt.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {(editing.custom_faqs || []).map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 bg-surface border border-brand/5 rounded-xl space-y-2 relative group shadow-sm"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const current = (editing.custom_faqs || []).filter(
                                    (_, i) => i !== idx,
                                  );
                                  setEditing({ ...editing, custom_faqs: current });
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="FAQ entfernen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <input
                                required
                                type="text"
                                value={item.q}
                                onChange={(e) => {
                                  const current = [...(editing.custom_faqs || [])];
                                  current[idx].q = e.target.value;
                                  setEditing({ ...editing, custom_faqs: current });
                                }}
                                placeholder={`Frage #${idx + 1} (z.B. Wie lange dauert die Verlegung?)`}
                                className="i font-semibold text-xs"
                              />
                              <textarea
                                required
                                rows={2}
                                value={item.a}
                                onChange={(e) => {
                                  const current = [...(editing.custom_faqs || [])];
                                  current[idx].a = e.target.value;
                                  setEditing({ ...editing, custom_faqs: current });
                                }}
                                placeholder="Antwort..."
                                className="i text-xs resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-brand/10 bg-background/50">
                  <div>
                    <p className="text-sm font-semibold text-brand">Gewerk online anzeigen?</p>
                    <p className="text-xs opacity-50">
                      Inaktive Gewerke werden auf der Webseite ausgeblendet.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, active: !editing.active })}
                    className="transition-colors shrink-0"
                  >
                    {editing.active ? (
                      <ToggleRight className="w-10 h-10 text-brand" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-foreground/30" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 px-6 py-4 border-t border-brand/10 bg-surface/95 backdrop-blur-sm flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/5 transition text-foreground/60"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-brand text-brand-foreground px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/90 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="size-3.5 rounded-full border border-white/30 border-t-white animate-spin" />
                      Speichert...
                    </>
                  ) : (
                    "Gewerk speichern"
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Inline inputs stylings */}
      <style>{`
        .i {
          width: 100%;
          background: var(--background);
          border: 1px solid color-mix(in oklab, var(--brand) 15%, transparent);
          border-radius: 0.85rem;
          padding: 0.65rem 0.85rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .i:focus {
          border-color: color-mix(in oklab, var(--brand) 50%, transparent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand) 12%, transparent);
        }
      `}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-[10px] uppercase tracking-widest opacity-50 font-extrabold">
        {label}
      </span>
      {children}
    </label>
  );
}
