import { publicImageToDataUrl as fileToBase64 } from "@/lib/public-image-upload";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  adminListProjects,
  adminUpsertProject,
  adminDeleteProject,
  adminListServices,
  adminUploadFile,
} from "@/lib/admin.functions";
import { projectSchema, type ProjectInput } from "@/lib/validators";
import {
  Hammer,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  Upload,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon,
  Layers,
  Star,
} from "lucide-react";
import { toast } from "sonner";

/** Reads a File as a base64 data-URL string */

export const Route = createFileRoute("/_authenticated/admin/projekte")({ component: Page });

const empty: ProjectInput = {
  title: "",
  service_id: "",
  location: "",
  description: "",
  images: [],
  featured: false,
  active: true,
};

function Page() {
  const listProjects = useServerFn(adminListProjects);
  const listServices = useServerFn(adminListServices);
  const upsert = useServerFn(adminUpsertProject);
  const del = useServerFn(adminDeleteProject);
  const uploadFn = useServerFn(adminUploadFile);
  const qc = useQueryClient();

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => listProjects(),
  });

  const { data: services } = useQuery({
    queryKey: ["admin-services-list"],
    queryFn: () => listServices(),
  });

  const [editing, setEditing] = useState<ProjectInput | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [err, setErr] = useState("");

  function open(p?: ProjectInput) {
    const v = p ? { ...p } : { ...empty };
    setEditing({
      ...v,
      service_id: v.service_id || "",
    });
    setNewUrl("");
    setErr("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setErr("");
    setSaving(true);
    try {
      const parsed = projectSchema.parse(editing);
      await upsert({ data: parsed });
      toast.success(
        editing.id ? "Referenzprojekt aktualisiert" : "Neues Referenzprojekt veröffentlicht",
      );
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    } catch (e2: unknown) {
      setErr(
        e2 instanceof Error ? e2.message : "Ein unerwarteter Validierungsfehler ist aufgetreten.",
      );
      toast.error("Validierung fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (
      !confirm(
        "Möchten Sie dieses Referenzprojekt wirklich unwiderruflich aus dem Portfolio löschen?",
      )
    )
      return;
    try {
      await del({ data: { id } });
      toast.success("Referenzprojekt gelöscht");
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
    } catch (e) {
      toast.error("Löschen fehlgeschlagen");
    }
  }

  // Upload photos via server-side function (supabaseAdmin – bypasses RLS)
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    e.target.value = ""; // reset so same file can be re-selected
    if (!files || files.length === 0 || !editing) return;

    setUploading(true);
    const toastId = "photo-upload";
    toast.loading(`Lade ${files.length} Foto(s) hoch…`, { id: toastId });
    try {
      const updatedImages = [...(editing.images || [])];
      const slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "projekt";

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          toast.warning(`${file.name}: übersteigt 10 MB – übersprungen`);
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${slug}-${Date.now()}-${i}.${ext}`;
        const base64 = await fileToBase64(file);

        const { url } = await uploadFn({
          data: { bucket: "project-images", path, base64, contentType: file.type },
        });
        updatedImages.push(url);
      }

      setEditing({ ...editing, images: updatedImages });
      toast.success(`${files.length} Foto(s) erfolgreich hochgeladen ✓`, { id: toastId });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Upload fehlgeschlagen";
      toast.error(msg, { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  // Add custom URL to images list manually
  const handleAddUrl = () => {
    if (!newUrl.trim() || !editing) return;
    const currentImgs = [...(editing.images || [])];
    currentImgs.push(newUrl.trim());
    setEditing({ ...editing, images: currentImgs });
    setNewUrl("");
    toast.success("Bild-URL hinzugefügt");
  };

  // Remove image from list
  const handleRemoveImage = (indexToRemove: number) => {
    if (!editing) return;
    const currentImgs = (editing.images || []).filter((_, idx) => idx !== indexToRemove);
    setEditing({ ...editing, images: currentImgs });
    toast.success("Bild aus der Auswahl entfernt");
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold font-display">
            Portfolio
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mt-1 text-brand tracking-tight">
            Referenzprojekte
          </h1>
          <p className="opacity-60 text-sm mt-2 max-w-xl">
            Verwalten Sie Ihre abgeschlossenen Gartenprojekte im Portfolio. Laden Sie mehrere Fotos
            hoch und weisen Sie diese Gewerken zu.
          </p>
        </div>

        <button
          onClick={() => open()}
          className="flex items-center gap-2 bg-brand text-brand-foreground px-5 py-3 rounded-full text-xs font-bold font-display uppercase tracking-wider hover:bg-brand/90 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Neues Projekt
        </button>
      </div>

      {/* PORTFOLIO GRID LIST */}
      {isProjectsLoading ? (
        <div className="py-20 text-center opacity-60 text-sm">Lade Portfolio...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.length === 0 ? (
            <div className="col-span-full bg-surface rounded-3xl p-16 text-center border border-brand/5 shadow-sm">
              <Hammer className="w-12 h-12 text-brand/20 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-brand">Keine Referenzprojekte online</h3>
              <p className="text-xs text-foreground/50 mt-1">
                Klicken Sie oben auf "Neues Projekt", um Ihre erste Gartengestaltung zu
                präsentieren.
              </p>
            </div>
          ) : (
            projects?.map((p) => {
              const linkedService = services?.find((s) => s.id === p.service_id);
              const previewImage = p.images && p.images.length > 0 ? p.images[0] : null;

              return (
                <div
                  key={p.id}
                  className="bg-surface border border-brand/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group shadow-sm"
                >
                  {/* Photo Preview card */}
                  <div className="aspect-[4/3] w-full bg-background border-b border-brand/5 relative overflow-hidden flex items-center justify-center shrink-0">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-foreground/20" />
                    )}

                    {p.featured && (
                      <span
                        className="absolute top-4 left-4 bg-amber-500 text-white p-2 rounded-full shadow-lg"
                        title="Featured Projekt"
                      >
                        <Star className="w-4 h-4 fill-white" />
                      </span>
                    )}

                    {p.images && p.images.length > 1 && (
                      <span className="absolute bottom-4 right-4 bg-brand/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full font-display uppercase tracking-wider font-semibold">
                        +{p.images.length - 1} Fotos
                      </span>
                    )}
                  </div>

                  {/* Details block */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-bold text-brand leading-snug">
                        {p.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-foreground/50">
                        {p.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-accent" /> {p.location}
                          </span>
                        )}
                        {linkedService && (
                          <span className="flex items-center gap-1 font-semibold text-brand/70">
                            <Layers className="w-3.5 h-3.5" /> {linkedService.title}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/75 leading-relaxed line-clamp-3 font-light pt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand/5 flex items-center justify-between">
                      <span
                        className={`text-[9px] font-display font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                          p.active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-foreground/10 text-foreground/50"
                        }`}
                      >
                        {p.active ? "Aktiv" : "Inaktiv"}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => open(p as ProjectInput)}
                          className="p-2 hover:bg-brand/5 border border-brand/10 text-brand rounded-full transition"
                          title="Bearbeiten"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => remove(p.id!)}
                          className="p-2 hover:bg-red-50 border border-red-100 text-red-600 rounded-full transition"
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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

          {/* Drawer panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-surface shadow-2xl z-50 flex flex-col border-l border-brand/10 animate-slide-in-right">
            {/* ── Sticky Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand/10 shrink-0 bg-surface">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-accent font-bold">
                  {editing.id ? "Projekt bearbeiten" : "Neues Projekt"}
                </p>
                <h2 className="font-serif text-xl text-brand font-semibold leading-tight mt-0.5">
                  {editing.title || "Unbenanntes Projekt"}
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

            {/* ── Scrollable Content ── */}
            <form onSubmit={save} className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-6">
                {/* Error */}
                {err && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-tight">{err}</span>
                  </div>
                )}

                {/* Fields */}
                <div className="space-y-4">
                  <F label="Projektname *">
                    <input
                      required
                      type="text"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="z. B. Luxus-Terrasse Hattersheim"
                      className="i"
                    />
                  </F>

                  <div className="grid grid-cols-2 gap-4">
                    <F label="Zugehöriges Gewerk">
                      <select
                        value={editing.service_id || ""}
                        onChange={(e) => setEditing({ ...editing, service_id: e.target.value })}
                        className="i"
                      >
                        <option value="">Allgemein</option>
                        {services?.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </F>

                    <F label="Standort / Region">
                      <input
                        type="text"
                        value={editing.location || ""}
                        onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                        placeholder="z. B. Wiesbaden"
                        className="i"
                      />
                    </F>
                  </div>

                  <F label="Projekt-Beschreibung">
                    <textarea
                      rows={5}
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Beschreiben Sie das Referenzprojekt ausführlich..."
                      className="i font-light leading-relaxed resize-none"
                    />
                  </F>
                </div>

                {/* ── Fotogalerie ── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest opacity-50 font-extrabold">
                      Fotogalerie ({(editing.images || []).length} Fotos)
                    </span>
                    {uploading && (
                      <span className="text-[10px] text-accent font-semibold animate-pulse">
                        Wird hochgeladen...
                      </span>
                    )}
                  </div>

                  {/* Thumbnail grid */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {(editing.images || []).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-brand/10 bg-background group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-red-600/80 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-brand/80 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Upload-Slot */}
                    <label
                      className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                        uploading
                          ? "border-accent/30 bg-accent/5 text-accent/50 cursor-wait"
                          : "border-brand/20 hover:border-brand/40 bg-background hover:bg-brand/5 text-foreground/40 hover:text-brand"
                      }`}
                    >
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {uploading ? "Lädt..." : "Upload"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* URL paste input */}
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                      placeholder="Externe Bild-URL einfügen..."
                      className="i text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      disabled={!newUrl.trim()}
                      className="px-4 py-2 border border-brand/20 hover:bg-brand/5 text-xs font-bold uppercase tracking-wider rounded-full text-brand transition disabled:opacity-40"
                    >
                      + URL
                    </button>
                  </div>
                </div>

                {/* ── Toggles ── */}
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-widest opacity-50 font-extrabold">
                    Einstellungen
                  </span>

                  <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-brand/10 bg-background/50">
                    <div>
                      <p className="text-sm font-semibold text-brand">
                        Auf Startseite hervorheben?
                      </p>
                      <p className="text-[10px] opacity-50">
                        Zeigt das Projekt im Featured-Bereich.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, featured: !editing.featured })}
                      className="transition-colors shrink-0"
                    >
                      {editing.featured ? (
                        <ToggleRight className="w-10 h-10 text-amber-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-foreground/30" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-brand/10 bg-background/50">
                    <div>
                      <p className="text-sm font-semibold text-brand">Projekt öffentlich listen?</p>
                      <p className="text-[10px] opacity-50">
                        Schaltet die Ansicht im Portfolio frei.
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
              </div>

              {/* ── Sticky Footer ── */}
              <div className="sticky bottom-0 px-6 py-4 border-t border-brand/10 bg-surface/95 backdrop-blur-sm flex justify-between gap-3 shrink-0">
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
                    "Projekt speichern"
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Styled inline inputs */}
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
