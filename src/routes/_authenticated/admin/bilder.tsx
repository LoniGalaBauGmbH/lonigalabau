import logoFallback from "@/assets/logo-loni.svg";
import pavingFallback from "@/assets/svc-pflaster.jpg";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getSiteImages, getSitePartners } from "@/lib/site.functions";
import {
  adminUpdateSiteImages,
  adminUploadFile,
  adminUpdateSitePartners,
} from "@/lib/admin.functions";
import {
  Upload,
  Save,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Users,
} from "lucide-react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lesefehler"));
    reader.readAsDataURL(file);
  });
}

export const Route = createFileRoute("/_authenticated/admin/bilder")({
  component: Page,
});

type ImageKey =
  | "logo"
  | "hero_bg"
  | "before_garden"
  | "after_garden"
  | "about_hero_bg"
  | "service_detail_bg"
  | "logo_white";

type ImageSettings = Partial<Record<ImageKey, string>>;

const labels: Record<ImageKey, { title: string; desc: string; fallback: string; aspect: string }> =
  {
    logo: {
      title: "Firmen-Logo",
      desc: "Wird im Header und Footer auf allen Seiten angezeigt. Empfehlung: SVG oder PNG mit transparentem Hintergrund.",
      fallback: logoFallback,
      aspect: "aspect-[3/1]",
    },
    hero_bg: {
      title: "Startseiten Hero-Hintergrund",
      desc: "Das große Hintergrundbild ganz oben auf der Homepage. Empfehlung: min. 1920×1080px, Querformat.",
      fallback: pavingFallback,
      aspect: "aspect-[16/9]",
    },
    before_garden: {
      title: "Vorher-Bild (Before/After Slider)",
      desc: "Das Baustellen- oder Vorher-Foto im Schieberegler-Vergleich auf der Startseite.",
      fallback: "",
      aspect: "aspect-[16/9]",
    },
    after_garden: {
      title: "Nachher-Bild (Before/After Slider)",
      desc: "Das Nachher-Foto im Schieberegler-Vergleich auf der Startseite.",
      fallback: "",
      aspect: "aspect-[16/9]",
    },
    about_hero_bg: {
      title: "Hintergrundbild 'Über uns'",
      desc: "Das Bannerbild auf der Firmenvorstellungsseite /ueber-uns.",
      fallback: pavingFallback,
      aspect: "aspect-[16/9]",
    },
    service_detail_bg: {
      title: "Standard Leistungs-Hintergrund",
      desc: "Fallback-Hintergrund für Leistungs-Detailseiten ohne eigenes Bild.",
      fallback: pavingFallback,
      aspect: "aspect-[16/9]",
    },
    logo_white: {
      title: "Helles Logo im Fußbereich",
      desc: "Optionales Logo für dunklen Hintergrund. Ohne eigenes Bild wird das Hauptlogo verwendet.",
      fallback: logoFallback,
      aspect: "aspect-[3/1]",
    },
  };

const Page_BUCKET = "service-images";

function Page() {
  const fetchFn = useServerFn(getSiteImages);
  const saveFn = useServerFn(adminUpdateSiteImages);
  const fetchPartnersFn = useServerFn(getSitePartners);
  const savePartnersFn = useServerFn(adminUpdateSitePartners);
  const uploadFn = useServerFn(adminUploadFile);
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState<"images" | "partners">("images");

  // ── SITE IMAGES QUERY & STATE ──────────────────────────────────────────────
  const {
    data: imagesData,
    isLoading: isLoadingImages,
    error: loadImagesError,
  } = useQuery({
    queryKey: ["site-images"],
    queryFn: () => fetchFn(),
  });

  const [form, setForm] = useState<ImageSettings>({});
  const [dirty, setDirty] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<ImageKey | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (imagesData) {
      setForm(imagesData as ImageSettings);
      setDirty(false);
    }
  }, [imagesData]);

  const mut = useMutation({
    mutationFn: async (payload: ImageSettings) => {
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(payload)) {
        if (v && typeof v === "string" && v.trim() !== "") clean[k] = v.trim();
      }
      return saveFn({ data: clean });
    },
    onSuccess: () => {
      toast.success("Bilder erfolgreich gespeichert ✓");
      qc.invalidateQueries({ queryKey: ["site-images"] });
      setDirty(false);
    },
    onError: (e: Error) => {
      toast.error("Speichern fehlgeschlagen: " + (e.message || "Unbekannter Fehler"));
    },
  });

  function update(key: ImageKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function handleReset(key: ImageKey) {
    setForm((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setDirty(true);
    toast.info(`'${labels[key].title}' zurückgesetzt auf Standard.`);
  }

  async function handleUpload(key: ImageKey, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Format nicht unterstützt. Erlaubt: JPG, PNG, WebP, SVG");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Bild zu groß – maximal 10 MB erlaubt.");
      return;
    }

    setUploadingKey(key);
    setUploadProgress((p) => ({ ...p, [key]: "Wird hochgeladen…" }));
    const toastId = `upload-${key}`;
    toast.loading(`Lade '${labels[key].title}' hoch…`, { id: toastId });

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const name = `site-asset-${key}-${Date.now()}.${ext}`;
      const base64 = await fileToBase64(file);

      const { url: publicUrl } = await uploadFn({
        data: { bucket: Page_BUCKET, path: name, base64, contentType: file.type },
      });

      update(key, publicUrl);
      setUploadProgress((p) => ({ ...p, [key]: "✓ Hochgeladen" }));
      toast.success(`'${labels[key].title}' hochgeladen`, { id: toastId });

      const newForm = { ...form, [key]: publicUrl };
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(newForm)) {
        if (v && typeof v === "string" && v.trim() !== "") clean[k] = v.trim();
      }
      await saveFn({ data: clean });
      qc.invalidateQueries({ queryKey: ["site-images"] });
      setDirty(false);
      toast.success("Automatisch gespeichert ✓", { id: `autosave-${key}` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload fehlgeschlagen";
      toast.error(msg, { id: toastId });
      setUploadProgress((p) => ({ ...p, [key]: "❌ Fehler" }));
    } finally {
      setUploadingKey(null);
      setTimeout(
        () =>
          setUploadProgress((p) => {
            const n = { ...p };
            delete n[key];
            return n;
          }),
        3000,
      );
    }
  }

  // ── PARTNERS QUERY & STATE ──────────────────────────────────────────────────
  const {
    data: partnersData,
    isLoading: isLoadingPartners,
    error: loadPartnersError,
  } = useQuery({
    queryKey: ["site-partners"],
    queryFn: () => fetchPartnersFn(),
  });

  const [partners, setPartners] = useState<Array<{ name: string; src: string }>>([]);
  const [partnersDirty, setPartnersDirty] = useState(false);
  const [uploadingPartnerIdx, setUploadingPartnerIdx] = useState<number | null>(null);

  useEffect(() => {
    if (partnersData) {
      setPartners(partnersData);
      setPartnersDirty(false);
    }
  }, [partnersData]);

  const partnersMut = useMutation({
    mutationFn: async (payload: Array<{ name: string; src: string }>) => {
      return savePartnersFn({ data: payload });
    },
    onSuccess: () => {
      toast.success("Partner-Logos erfolgreich gespeichert ✓");
      qc.invalidateQueries({ queryKey: ["site-partners"] });
      setPartnersDirty(false);
    },
    onError: (e: Error) => {
      toast.error("Speichern fehlgeschlagen: " + (e.message || "Unbekannter Fehler"));
    },
  });

  function handleAddPartner() {
    setPartners((prev) => [...prev, { name: "", src: "" }]);
    setPartnersDirty(true);
  }

  function handleRemovePartner(idx: number) {
    setPartners((prev) => prev.filter((_, i) => i !== idx));
    setPartnersDirty(true);
  }

  function handleUpdatePartner(idx: number, field: "name" | "src", value: string) {
    setPartners((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
    setPartnersDirty(true);
  }

  function handleMovePartner(idx: number, direction: "up" | "down") {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === partners.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const next = [...partners];
    const temp = next[idx];
    next[idx] = next[swapIdx];
    next[swapIdx] = temp;

    setPartners(next);
    setPartnersDirty(true);
  }

  async function handlePartnerUpload(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      toast.error("Format nicht unterstützt. Erlaubt: JPG, PNG, WebP, SVG");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bild zu groß – maximal 5 MB erlaubt.");
      return;
    }

    setUploadingPartnerIdx(idx);
    const toastId = `upload-partner-${idx}`;
    toast.loading("Partner-Logo wird hochgeladen…", { id: toastId });

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const name = `partner-logo-${Date.now()}.${ext}`;
      const base64 = await fileToBase64(file);

      const { url: publicUrl } = await uploadFn({
        data: { bucket: Page_BUCKET, path: name, base64, contentType: file.type },
      });

      handleUpdatePartner(idx, "src", publicUrl);
      toast.success("Partner-Logo erfolgreich hochgeladen ✓", { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload fehlgeschlagen";
      toast.error(msg, { id: toastId });
    } finally {
      setUploadingPartnerIdx(null);
    }
  }

  const isLoading = isLoadingImages || isLoadingPartners;
  const loadError = loadImagesError || loadPartnersError;

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center gap-4 text-center">
        <div className="size-10 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
        <p className="text-sm text-foreground/50">Lade Einstellungen…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-16 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-sm text-red-600 font-medium">Fehler beim Laden der Einstellungen.</p>
        <p className="text-xs text-foreground/50">{(loadError as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-brand/5 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold">
            Marken-Identität
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mt-1 text-brand tracking-tight">
            Bilder & Partner-Verwaltung
          </h1>
          <p className="opacity-60 text-sm mt-2 max-w-xl leading-relaxed">
            Verwalten Sie alle Bilder Ihrer Website und steuern Sie die angezeigten Partner-Logos
            flexibel.
          </p>
        </div>

        {activeTab === "images" && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => mut.mutate(form)}
              disabled={mut.isPending || !dirty}
              className="flex items-center gap-2 bg-brand text-brand-foreground px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/90 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {mut.isPending ? "Speichere…" : dirty ? "Änderungen speichern" : "Alles gespeichert"}
            </button>
            {dirty && (
              <p className="text-[10px] text-amber-600 font-semibold animate-pulse">
                ⚠ Ungespeicherte Änderungen
              </p>
            )}
          </div>
        )}

        {activeTab === "partners" && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => partnersMut.mutate(partners)}
              disabled={partnersMut.isPending || !partnersDirty}
              className="flex items-center gap-2 bg-brand text-brand-foreground px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/90 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {partnersMut.isPending
                ? "Speichere…"
                : partnersDirty
                  ? "Partner speichern"
                  : "Alles gespeichert"}
            </button>
            {partnersDirty && (
              <p className="text-[10px] text-amber-600 font-semibold animate-pulse">
                ⚠ Ungespeicherte Partner-Änderungen
              </p>
            )}
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="flex border-b border-brand/10 gap-2 pb-px">
        <button
          onClick={() => setActiveTab("images")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "images"
              ? "border-brand text-brand"
              : "border-transparent text-foreground/40 hover:text-foreground/70"
          }`}
        >
          <Layers className="w-4 h-4" />
          Globale Bilder
        </button>
        <button
          onClick={() => setActiveTab("partners")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "partners"
              ? "border-brand text-brand"
              : "border-transparent text-foreground/40 hover:text-foreground/70"
          }`}
        >
          <Users className="w-4 h-4" />
          Partner-Logos ({partners.length})
        </button>
      </div>

      {/* CONTENT: SITE IMAGES TAB */}
      {activeTab === "images" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(labels) as ImageKey[]).map((key) => {
            const cfg = labels[key];
            const currentUrl = form[key] ?? "";
            const hasCustom = !!currentUrl;
            const isUploading = uploadingKey === key;

            return (
              <div
                key={key}
                className={`bg-surface border rounded-3xl p-6 flex flex-col gap-5 shadow-sm transition-all ${
                  isUploading
                    ? "border-accent/40 shadow-md"
                    : "border-brand/10 hover:shadow-md hover:border-brand/20"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-brand">{cfg.title}</h3>
                    <p className="text-xs text-foreground/55 mt-0.5 leading-relaxed">{cfg.desc}</p>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                      hasCustom
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-foreground/8 text-foreground/40 border border-foreground/10"
                    }`}
                  >
                    {hasCustom ? "✓ Eigenes Bild" : "Standard"}
                  </span>
                </div>

                {/* Image Preview */}
                <div
                  className={`${cfg.aspect} w-full bg-background border border-brand/8 rounded-2xl overflow-hidden relative group`}
                >
                  {currentUrl || cfg.fallback ? (
                    <>
                      <img
                        src={currentUrl || cfg.fallback}
                        alt={cfg.title}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <a
                          href={currentUrl || cfg.fallback}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Öffnen
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-4">
                      <ImageIcon className="w-7 h-7 text-foreground/15" />
                      <p className="text-[10px] text-foreground/35">
                        {cfg.fallback ? "Standardbild" : "Kein Bild hinterlegt"}
                      </p>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-brand/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <div className="size-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <p className="text-xs text-white font-semibold">
                        {uploadProgress[key] || "Wird hochgeladen…"}
                      </p>
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <label className="block space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                    Direkte Bild-URL (optional)
                  </span>
                  <input
                    type="url"
                    value={currentUrl}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder="https://deine-domain.de/bild.jpg"
                    className="i"
                    disabled={isUploading}
                  />
                </label>

                {/* Upload / Reset Row */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-brand/5">
                  <label
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
                      isUploading
                        ? "opacity-50 cursor-not-allowed border-brand/10 text-brand/50"
                        : "border-brand/20 text-brand hover:bg-brand/5 hover:border-brand/40"
                    }`}
                  >
                    {isUploading ? (
                      <div className="size-3.5 rounded-full border border-brand/30 border-t-brand animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    {isUploading ? "Lädt hoch…" : "Bild hochladen"}
                    <input
                      ref={(el) => {
                        fileRefs.current[key] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={(e) => handleUpload(key, e)}
                      disabled={isUploading || uploadingKey !== null}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    {uploadProgress[key] === "✓ Hochgeladen" && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Gespeichert
                      </span>
                    )}
                    {hasCustom && (
                      <button
                        type="button"
                        onClick={() => handleReset(key)}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <RefreshCw className="w-3 h-3" /> Zurücksetzen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENT: PARTNERS TAB */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          <div className="bg-surface border border-brand/10 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand/5 pb-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand">
                  Partner & Referenzen verwalten
                </h3>
                <p className="text-xs text-foreground/55 mt-0.5">
                  Hier können Sie die im Band auf der Startseite rotierenden Logos vollständig
                  verwalten.
                </p>
              </div>
            </div>

            {/* List */}
            {partners.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3 text-center border-2 border-dashed border-brand/10 rounded-2xl">
                <ImageIcon className="w-10 h-10 text-foreground/15 animate-bounce" />
                <p className="text-sm font-semibold text-brand/80">
                  Noch keine Partner-Logos konfiguriert
                </p>
                <p className="text-xs text-foreground/45 max-w-sm leading-relaxed">
                  Fügen Sie einen bestätigten Partner und dessen freigegebenes Logo hinzu.
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleAddPartner}
                    className="bg-brand/5 text-brand border border-brand/25 text-xs font-bold px-6 py-2.5 rounded-full hover:bg-brand/10 transition"
                  >
                    Partner hinzufügen
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {partners.map((partner, idx) => {
                  const isUploadingThis = uploadingPartnerIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row items-center gap-4 bg-background border border-brand/10 rounded-2xl p-4 transition-all hover:border-brand/20 shadow-sm"
                    >
                      {/* Logo Preview box */}
                      <div className="w-24 h-16 bg-white border border-brand/10 rounded-xl overflow-hidden flex items-center justify-center relative p-2 shrink-0">
                        {partner.src ? (
                          <img
                            src={partner.src}
                            alt={partner.name || "Vorschau"}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-foreground/15" />
                        )}
                        {isUploadingThis && (
                          <div className="absolute inset-0 bg-brand/90 flex items-center justify-center">
                            <div className="size-5 rounded-full border border-white/30 border-t-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                        <label className="block">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/45 block mb-1">
                            Partner / Firmenname
                          </span>
                          <input
                            type="text"
                            value={partner.name}
                            onChange={(e) => handleUpdatePartner(idx, "name", e.target.value)}
                            placeholder="z. B. Bickhardt Bau"
                            className="i-simple"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/45 block mb-1">
                            Logo Bild-URL
                          </span>
                          <input
                            type="url"
                            value={partner.src}
                            onChange={(e) => handleUpdatePartner(idx, "src", e.target.value)}
                            placeholder="https://deine-domain.de/logo.png"
                            className="i-simple"
                          />
                        </label>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
                        {/* File upload trigger */}
                        <label className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-brand/15 text-[10px] font-bold text-brand hover:bg-brand/5 transition cursor-pointer whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5" />
                          Hochladen
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePartnerUpload(idx, e)}
                            disabled={isUploadingThis}
                            className="hidden"
                          />
                        </label>

                        {/* Reordering */}
                        <div className="flex border border-brand/10 rounded-full overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleMovePartner(idx, "up")}
                            disabled={idx === 0}
                            className="p-2 bg-brand/5 hover:bg-brand/10 text-brand disabled:opacity-30 disabled:hover:bg-brand/5 transition border-r border-brand/10"
                            title="Nach oben verschieben"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePartner(idx, "down")}
                            disabled={idx === partners.length - 1}
                            className="p-2 bg-brand/5 hover:bg-brand/10 text-brand disabled:opacity-30 disabled:hover:bg-brand/5 transition"
                            title="Nach unten verschieben"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemovePartner(idx)}
                          className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition"
                          title="Partner löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add new button */}
                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleAddPartner}
                    className="flex items-center gap-2 bg-brand text-brand-foreground px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/90 transition shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Partner hinzufügen
                  </button>

                  <button
                    type="button"
                    onClick={() => partnersMut.mutate(partners)}
                    disabled={partnersMut.isPending || !partnersDirty}
                    className="flex items-center gap-2 bg-brand text-brand-foreground px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand/90 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Änderungen speichern
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Save Bar */}
      {dirty && activeTab === "images" && (
        <div className="sticky bottom-4 flex items-center justify-between bg-brand text-white p-4 rounded-2xl shadow-xl border border-brand/20 animate-fade-up z-20">
          <p className="text-sm font-semibold">
            ⚠ Ungespeicherte Bilder-Änderungen – bitte speichern!
          </p>
          <button
            onClick={() => mut.mutate(form)}
            disabled={mut.isPending}
            className="flex items-center gap-2 bg-white text-brand px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {mut.isPending ? "Speichere…" : "Jetzt speichern"}
          </button>
        </div>
      )}

      {partnersDirty && activeTab === "partners" && (
        <div className="sticky bottom-4 flex items-center justify-between bg-brand text-white p-4 rounded-2xl shadow-xl border border-brand/20 animate-fade-up z-20">
          <p className="text-sm font-semibold">
            ⚠ Ungespeicherte Partner-Änderungen – bitte speichern!
          </p>
          <button
            onClick={() => partnersMut.mutate(partners)}
            disabled={partnersMut.isPending}
            className="flex items-center gap-2 bg-white text-brand px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {partnersMut.isPending ? "Speichere…" : "Jetzt speichern"}
          </button>
        </div>
      )}

      {/* Input styles */}
      <style>{`
        .i {
          width: 100%;
          background: var(--background);
          border: 1px solid color-mix(in oklab, var(--brand) 15%, transparent);
          border-radius: 0.75rem;
          padding: 0.6rem 0.8rem;
          font-size: 0.8rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .i:focus {
          border-color: color-mix(in oklab, var(--brand) 50%, transparent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand) 10%, transparent);
        }
        .i:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .i-simple {
          width: 100%;
          background: var(--surface);
          border: 1px solid color-mix(in oklab, var(--brand) 10%, transparent);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          outline: none;
          transition: border-color .15s;
          color: var(--foreground);
        }
        .i-simple:focus {
          border-color: var(--brand);
        }
      `}</style>
    </div>
  );
}
