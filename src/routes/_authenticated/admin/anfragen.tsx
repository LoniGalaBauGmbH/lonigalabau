import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import {
  adminListContacts,
  adminUpdateContactStatus,
  adminPhotoSignedUrl,
} from "@/lib/admin.functions";
import {
  Mail,
  Phone,
  Clock,
  User,
  Search,
  X,
  CheckCircle2,
  Archive,
  Inbox,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { adminSaveNotes } from "@/lib/admin.functions";
import { DeleteSubmission } from "@/components/admin/DeleteSubmission";
import { SubmissionNotification } from "@/components/admin/SubmissionNotification";

export const Route = createFileRoute("/_authenticated/admin/anfragen")({ component: Page });

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  image_paths?: string[];
  status: string;
  created_at: string;
  notification_sent_at?: string | null;
  notification_status?: string | null;
  notes?: string;
  notes_version?: number;
};

function PrivateAttachment({ path, index }: { path: string; index: number }) {
  const signPhoto = useServerFn(adminPhotoSignedUrl);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const isPdf = path.endsWith(".pdf");
  async function showPhoto() {
    setLoading(true);
    try {
      const signed = await signPhoto({ data: { path } });
      setUrl(signed.url);
      setName(signed.name);
    } catch {
      toast.error("Der Anhang konnte nicht geöffnet werden.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-2">
      <button
        onClick={showPhoto}
        disabled={loading}
        className="text-sm underline disabled:opacity-50"
      >
        {loading ? "Anhang wird geladen…" : `${isPdf ? "PDF" : "Foto"} ${index + 1} öffnen`}
      </button>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block break-all text-sm text-brand underline underline-offset-4"
        >
          {isPdf ? (
            `PDF herunterladen: ${name}`
          ) : (
            <>
              <img
                src={url}
                alt={`Kundenfoto ${index + 1}`}
                className="max-h-64 rounded-xl"
                onError={() => setUrl("")}
              />
              <span className="mt-2 block">{name}</span>
            </>
          )}
        </a>
      )}
    </div>
  );
}

function Page() {
  const list = useServerFn(adminListContacts);
  const setStatus = useServerFn(adminUpdateContactStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ContactRequest[]>({
    queryKey: ["admin-contacts"],
    queryFn: () => list() as Promise<ContactRequest[]>,
  });

  const [activeTab, setActiveTab] = useState<"new" | "handled" | "archived">("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<ContactRequest | null>(null);
  const [notes, setNotes] = useState("");
  const saveNotes = useServerFn(adminSaveNotes);
  const [savingNotes, setSavingNotes] = useState(false);

  // Load notes from localStorage when a lead is selected
  useEffect(() => {
    if (selectedLead) {
      let savedNotes = selectedLead.notes || "";
      try {
        if (!savedNotes) savedNotes = localStorage.getItem(`crm-notes-${selectedLead.id}`) || "";
      } catch {
        /* Browser storage is optional. */
      }
      setNotes(savedNotes);
    }
  }, [selectedLead]);

  // Save notes to localStorage
  const handleSaveNotes = async () => {
    if (!selectedLead || savingNotes) return;
    setSavingNotes(true);
    try {
      const result = await saveNotes({
        data: {
          table: "contact_requests",
          id: selectedLead.id,
          notes,
          version: selectedLead.notes_version ?? 0,
        },
      });
      setSelectedLead({ ...selectedLead, notes, notes_version: result.version });
      try {
        localStorage.removeItem(`crm-notes-${selectedLead.id}`);
      } catch {
        /* Already saved securely. */
      }
      void qc.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Notizen sicher gespeichert");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Speichern fehlgeschlagen");
    } finally {
      setSavingNotes(false);
    }
  };

  async function changeStatus(id: string, status: "new" | "handled" | "archived") {
    try {
      await setStatus({ data: { id, status } });
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });

      // Update selected lead status in real-time
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }

      toast.success(
        `Status aktualisiert: ${
          status === "new" ? "Neu" : status === "handled" ? "Bearbeitet" : "Archiviert"
        }`,
      );
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Fehler beim Aktualisieren");
    }
  }

  // Filter and search logic
  const filteredData =
    data?.filter((c) => {
      const matchesTab = c.status === activeTab;
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery)) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.subject && c.subject.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    }) || [];

  return (
    <div className="space-y-8 animate-fade-up relative min-h-[70vh]">
      {/* HEADER */}
      <div>
        <p className="text-xs uppercase tracking-widest text-accent font-semibold font-display">
          CRM Portal
        </p>
        <h1 className="font-serif text-3xl md:text-4xl mt-1 text-brand tracking-tight">
          Kundenanfragen
        </h1>
        <p className="opacity-60 text-sm mt-2 max-w-2xl">
          Verwalten Sie eingehende Anfragen von Ihrer Website, dokumentieren Sie Fortschritte und
          leiten Sie direkte Absprachen ein.
        </p>
      </div>

      {/* FILTER & SEARCH ACTIONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-3xl border border-brand/5 shadow-sm">
        {/* Tabs */}
        <div className="flex p-1 bg-background rounded-full border border-brand/5 w-fit">
          {[
            { id: "new", label: "Neu", count: data?.filter((c) => c.status === "new").length || 0 },
            {
              id: "handled",
              label: "Bearbeitet",
              count: data?.filter((c) => c.status === "handled").length || 0,
            },
            {
              id: "archived",
              label: "Archiviert",
              count: data?.filter((c) => c.status === "archived").length || 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as never);
                setSelectedLead(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-brand text-brand-foreground shadow"
                  : "hover:bg-brand/5 opacity-70 hover:opacity-100"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-brand/10 text-brand"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Anfragen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-brand/10 bg-background text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/5 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* CRM GRID LIST */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
          <p className="text-sm text-foreground/40">Lade Kundenkontakte…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredData.length === 0 ? (
            <div className="bg-surface rounded-3xl p-16 text-center border border-brand/5 shadow-sm">
              <Inbox className="w-12 h-12 text-brand/20 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-brand">Keine Anfragen gefunden</h3>
              <p className="text-xs text-foreground/50 mt-1">
                In diesem Filter befinden sich aktuell keine Einträge.
              </p>
            </div>
          ) : (
            filteredData.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedLead(c)}
                className={`bg-surface border rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-brand/20 ${
                  selectedLead?.id === c.id
                    ? "border-brand bg-brand/5 ring-1 ring-brand/10"
                    : "border-brand/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-brand text-base">
                        {c.name}
                      </span>
                      {c.status === "new" && (
                        <span className="size-2 rounded-full bg-accent animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-foreground/50 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {c.email}
                      </span>
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {c.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />{" "}
                        {new Date(c.created_at).toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-1.5 self-start md:self-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.status !== "new" && (
                      <button
                        onClick={() => changeStatus(c.id, "new")}
                        title="Als Neu markieren"
                        className="p-2 hover:bg-brand/5 rounded-full border border-brand/5 text-foreground/60 hover:text-brand transition"
                      >
                        <Inbox className="w-4 h-4" />
                      </button>
                    )}
                    {c.status !== "handled" && (
                      <button
                        onClick={() => changeStatus(c.id, "handled")}
                        title="Als Bearbeitet markieren"
                        className="p-2 hover:bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600 hover:text-emerald-700 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {c.status !== "archived" && (
                      <button
                        onClick={() => changeStatus(c.id, "archived")}
                        title="Archivieren"
                        className="p-2 hover:bg-amber-50 rounded-full border border-amber-100 text-amber-600 hover:text-amber-700 transition"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-brand/5">
                  <p className="text-xs uppercase tracking-widest text-foreground/40 font-bold mb-1">
                    {c.subject || "Betreff: Allgemeine Anfrage"}
                  </p>
                  <p className="text-sm opacity-80 line-clamp-2 leading-relaxed whitespace-pre-line">
                    {c.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* LEAD SLIDING DRAWER DETAIL VIEWER */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 overflow-hidden flex justify-end"
          onClick={() => setSelectedLead(null)}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-brand/35 backdrop-blur-sm transition-opacity duration-300" />

          {/* Drawer Body */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-background h-full shadow-2xl flex flex-col justify-between border-l border-brand/10 animate-fade-left"
          >
            {/* Drawer Header */}
            <div className="p-6 md:p-8 border-b border-brand/15 bg-surface/50">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[9px] font-display font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                        selectedLead.status === "new"
                          ? "bg-accent/15 text-accent"
                          : selectedLead.status === "handled"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-foreground/10 text-foreground/50"
                      }`}
                    >
                      {selectedLead.status === "new"
                        ? "Neu"
                        : selectedLead.status === "handled"
                          ? "Bearbeitet"
                          : "Archiviert"}
                    </span>
                    <span className="text-[10px] text-foreground/40 font-semibold">
                      {new Date(selectedLead.created_at).toLocaleString("de-DE")}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-brand tracking-tight mt-3 font-semibold">
                    {selectedLead.name}
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-foreground/45 mt-1.5 font-bold">
                    {selectedLead.subject || "Allgemeine Anfrage"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-brand/5 rounded-full border border-brand/5 transition"
                >
                  <X className="w-5 h-5 text-foreground/60" />
                </button>
              </div>

              {/* Quick Communication Actions bar */}
              <DeleteSubmission
                table="contact_requests"
                id={selectedLead.id}
                onDeleted={() => {
                  setSelectedLead(null);
                  void qc.invalidateQueries({ queryKey: ["admin-contacts"] });
                }}
              />
              <SubmissionNotification
                key={selectedLead.id}
                id={selectedLead.id}
                table="contact_requests"
                sentAt={selectedLead.notification_sent_at}
                deliveryStatus={selectedLead.notification_status}
              />
              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href={`mailto:${selectedLead.email}?subject=Ihre Anfrage bei Loni Galabau GmbH`}
                  className="flex items-center gap-2 text-xs font-semibold px-4.5 py-2.5 bg-brand text-brand-foreground rounded-full hover:bg-brand/90 transition shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" /> E-Mail schreiben{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
                {selectedLead.phone && (
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center gap-2 text-xs font-semibold px-4.5 py-2.5 border border-brand/20 hover:bg-brand/5 rounded-full text-brand transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Anrufen
                  </a>
                )}
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Message Block */}
              <div className="bg-surface border border-brand/5 p-6 rounded-3xl space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand" /> Kundennachricht
                </p>
                <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-line">
                  {selectedLead.message}
                </p>
                {selectedLead.image_paths?.map((path, index) => (
                  <PrivateAttachment key={path} path={path} index={index} />
                ))}
              </div>

              {/* Status Update Box */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                  Status ändern
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "new",
                      label: "Neu",
                      color: "hover:bg-accent/15",
                      activeColor: "bg-accent/10 border-accent text-accent",
                    },
                    {
                      id: "handled",
                      label: "Bearbeitet",
                      color: "hover:bg-emerald-50",
                      activeColor: "bg-emerald-50 border-emerald-500 text-emerald-700",
                    },
                    {
                      id: "archived",
                      label: "Archivieren",
                      color: "hover:bg-amber-50",
                      activeColor: "bg-amber-50 border-amber-500 text-amber-700",
                    },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => changeStatus(selectedLead.id, st.id as never)}
                      className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all ${
                        selectedLead.status === st.id
                          ? st.activeColor
                          : `border-brand/10 bg-background ${st.color} opacity-70`
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CRM Admin Notes (server backed) */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold flex items-center justify-between">
                  <span>Interne Notizen</span>
                  <span className="text-[9px] opacity-60 normal-case">(Lokal gespeichert)</span>
                </p>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Geben Sie hier Notizen zum Telefonat, Fortschritt oder Vereinbarungen ein..."
                  className="w-full p-4.5 rounded-2xl border border-brand/10 bg-surface/50 text-sm outline-none focus:border-brand/40 focus:bg-background transition resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="text-xs font-bold font-display uppercase tracking-wider text-brand hover:text-accent border border-brand/20 hover:border-brand/40 px-4 py-2 rounded-full transition"
                >
                  Notizen sichern
                </button>
              </div>
            </div>

            {/* Drawer Footer info */}
            <div className="p-4 border-t border-brand/5 bg-surface/20 text-center">
              <p className="text-[10px] text-foreground/35">
                Loni Galabau CRM Steuerzentrale • ID: {selectedLead.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
