import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminListJobs, adminUpsertJob, adminDeleteJob } from "@/lib/admin.functions";
import { jobSchema, type JobInput } from "@/lib/validators";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/jobs")({ component: Page });

const empty: JobInput = { 
  slug: "", 
  title: "", 
  description: "", 
  requirements: "", 
  location: "", 
  employment_type: "", 
  active: true 
};

function Page() {
  const list = useServerFn(adminListJobs);
  const upsert = useServerFn(adminUpsertJob);
  const del = useServerFn(adminDeleteJob);
  const qc = useQueryClient();
  
  const { data, isLoading } = useQuery({ 
    queryKey: ["admin-jobs"], 
    queryFn: () => list() 
  });
  
  const [editing, setEditing] = useState<JobInput | null>(null);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setErr("");
    setSaving(true);
    try {
      const parsed = jobSchema.parse(editing);
      await upsert({ data: parsed });
      toast.success(editing.id ? "Stellenanzeige aktualisiert" : "Neue Stellenanzeige angelegt");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    } catch (e2: unknown) { 
      setErr(e2 instanceof Error ? e2.message : "Ein Validierungsfehler ist aufgetreten."); 
      toast.error("Validierung fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Möchten Sie diese Stellenanzeige wirklich dauerhaft löschen?")) return;
    try {
      await del({ data: { id } });
      toast.success("Stelle erfolgreich gelöscht");
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    } catch (e) {
      toast.error("Löschen fehlgeschlagen");
    }
  }

  // Automatic slug generation from title
  const handleTitleChange = (val: string) => {
    if (!editing) return;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Only update slug if it was empty or matched previous auto-generated value
    setEditing({ 
      ...editing, 
      title: val, 
      slug: editing.id ? editing.slug : generatedSlug 
    });
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold font-display">Recruitment</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-1 text-brand tracking-tight">Stellenverwaltung</h1>
          <p className="opacity-60 text-sm mt-2 max-w-xl">
            Aktualisieren Sie Jobangebote für Fachkräfte, Meister, Auszubildende und Planer auf der Karriereseite.
          </p>
        </div>

        <button 
          onClick={() => setEditing({ ...empty })} 
          className="flex items-center gap-2 bg-brand text-brand-foreground px-5 py-3 rounded-full text-xs font-bold font-display uppercase tracking-wider hover:bg-brand/90 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Neue Stelle
        </button>
      </div>

      {/* JOBS GRID */}
      {isLoading ? (
        <div className="py-20 text-center opacity-60 text-sm">Lade Stellenangebote...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.length === 0 ? (
            <div className="col-span-full bg-surface rounded-3xl p-16 text-center border border-brand/5 shadow-sm">
              <Briefcase className="w-12 h-12 text-brand/20 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-brand">Keine Ausschreibungen online</h3>
              <p className="text-xs text-foreground/50 mt-1">Klicken Sie oben auf "Neue Stelle", um das erste Jobangebot zu veröffentlichen.</p>
            </div>
          ) : (
            data?.map((j) => (
              <div 
                key={j.id} 
                className="bg-surface border border-brand/10 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group shadow-sm"
              >
                {/* Ribbon active flag */}
                <div className={`absolute top-0 right-0 w-2.5 h-full ${j.active ? "bg-emerald-600/80" : "bg-foreground/15"}`} />

                <div className="space-y-4">
                  <div className="space-y-1 pr-4">
                    <span className="text-[10px] bg-brand/5 text-brand/75 font-mono px-2 py-0.5 rounded-md border border-brand/10 inline-block">
                      /{j.slug}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-brand tracking-tight pt-1 leading-snug">
                      {j.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-foreground/50">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent" /> {j.location || "Hattersheim"}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand/60" /> {j.employment_type || "Vollzeit"}</span>
                  </div>

                  <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed whitespace-pre-line font-light">
                    {j.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand/5 flex items-center justify-between">
                  <span className={`text-[9px] font-display font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                    j.active ? "bg-emerald-100 text-emerald-800" : "bg-foreground/10 text-foreground/50"
                  }`}>
                    {j.active ? "Aktiv" : "Inaktiv"}
                  </span>

                  <div className="flex gap-2">
                    <a
                      href={`/jobs/${j.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-accent/10 border border-accent/20 text-accent rounded-full transition"
                      title="Live-Vorschau öffnen"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => setEditing(j as JobInput)} 
                      className="p-2 hover:bg-brand/5 border border-brand/10 text-brand rounded-full transition"
                      title="Bearbeiten"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => remove(j.id!)} 
                      className="p-2 hover:bg-red-50 border border-red-100 text-red-600 rounded-full transition"
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

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-surface shadow-2xl z-50 flex flex-col border-l border-brand/10 animate-slide-in-right">
            
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand/10 shrink-0 bg-surface">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-accent font-bold">
                  {editing.id ? "Stellenanzeige bearbeiten" : "Neue Stellenanzeige"}
                </p>
                <h2 className="font-serif text-xl text-brand font-semibold leading-tight mt-0.5">
                  {editing.title || "Unbenannte Stelle"}
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

            {/* Scrollable Form Content */}
            <form onSubmit={save} className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-5">
                
                {/* ERROR DISPLAY */}
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
                      placeholder="z. B. Gärtnermeister (m/w/d)"
                      className="i" 
                    />
                  </F>

                  <F label="Job-Slug * (Teil der URL)">
                    <input 
                      required 
                      type="text" 
                      pattern="^[a-z0-9\\-]+$"
                      title="Nur Kleinbuchstaben, Ziffern und Bindestrich"
                      value={editing.slug} 
                      onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().trim() })} 
                      placeholder="z-b-gaertnermeister"
                      className="i font-mono" 
                    />
                  </F>

                  <F label="Standort">
                    <input 
                      type="text" 
                      value={editing.location || ""} 
                      onChange={(e) => setEditing({ ...editing, location: e.target.value })} 
                      placeholder="z. B. Hattersheim am Main"
                      className="i" 
                    />
                  </F>

                  <F label="Anstellungsart">
                    <input 
                      type="text" 
                      value={editing.employment_type || ""} 
                      onChange={(e) => setEditing({ ...editing, employment_type: e.target.value })} 
                      placeholder="z. B. Vollzeit / Ausbildung"
                      className="i" 
                    />
                  </F>
                </div>

                <F label="Aufgabenbeschreibung">
                  <textarea 
                    rows={4} 
                    value={editing.description} 
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })} 
                    placeholder="Beschreiben Sie die primären Tätigkeiten des Bewerbers..."
                    className="i resize-none font-light leading-relaxed" 
                  />
                </F>

                <F label="Anforderungen an den Bewerber">
                  <textarea 
                    rows={4} 
                    value={editing.requirements} 
                    onChange={(e) => setEditing({ ...editing, requirements: e.target.value })} 
                    placeholder="Welche Erfahrungen, Zeugnisse oder Führerscheine sind nötig? (z. B. Klasse B/C)..."
                    className="i resize-none font-light leading-relaxed" 
                  />
                </F>

                {/* Toggle switch for Active */}
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-brand/10 bg-background/50 w-full">
                  <div>
                    <p className="text-sm font-semibold text-brand">Stelle sofort veröffentlichen?</p>
                    <p className="text-xs opacity-50">Inaktive Stellen werden auf der Karriereseite verborgen.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, active: !editing.active })}
                    className="text-brand transition-colors shrink-0"
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
                  className="px-5 py-2.5 rounded-full text-xs font-bold font-display uppercase tracking-wider hover:bg-brand/5 transition text-foreground/60"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-brand text-brand-foreground px-8 py-2.5 rounded-full text-xs font-bold font-display uppercase tracking-wider hover:bg-brand/90 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="size-3.5 rounded-full border border-white/30 border-t-white animate-spin" />
                      Speichert...
                    </>
                  ) : "Stelle Speichern"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}


      {/* Styled inline components styles */}
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
      <span className="block text-[10px] uppercase tracking-widest opacity-50 font-extrabold">{label}</span>
      {children}
    </label>
  );
}
