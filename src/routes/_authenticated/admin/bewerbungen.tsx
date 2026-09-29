import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { adminListApplications, adminCvSignedUrl, adminUpdateApplicationStatus } from "@/lib/admin.functions";
import { 
  Mail, 
  Phone, 
  Clock, 
  Briefcase, 
  Search, 
  X, 
  CheckCircle2, 
  Inbox, 
  FileText, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { SubmissionNotification } from "@/components/admin/SubmissionNotification";

export const Route = createFileRoute("/_authenticated/admin/bewerbungen")({ component: Page });

type Application = {
  id: string;
  job_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  cv_path: string | null;
  status: string;
  created_at: string;
  notification_sent_at?: string | null;
  jobs?: {
    title?: string;
    slug?: string;
  } | null;
};

function Page() {
  const list = useServerFn(adminListApplications);
  const sign = useServerFn(adminCvSignedUrl);
  const setStatus = useServerFn(adminUpdateApplicationStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Application[]>({ 
    queryKey: ["admin-apps"], 
    queryFn: () => list() as Promise<Application[]>
  });

  const [activeTab, setActiveTab] = useState<"new" | "reviewing" | "accepted" | "rejected">("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");

  // Load notes from localStorage when a candidate is selected
  useEffect(() => {
    if (selectedCandidate) {
      const savedNotes = localStorage.getItem(`ats-notes-${selectedCandidate.id}`) || "";
      setNotes(savedNotes);
    }
  }, [selectedCandidate]);

  const handleSaveNotes = () => {
    if (selectedCandidate) {
      localStorage.setItem(`ats-notes-${selectedCandidate.id}`, notes);
      toast.success("Bewerber-Notizen lokal gespeichert");
    }
  };

  async function openCv(path: string | null) {
    if (!path || path.trim() === "") {
      toast.error("Kein Lebenslauf hochgeladen");
      return;
    }
    try {
      toast.loading("Lebenslauf-Link wird signiert...", { id: "cv-sign" });
      const { url } = await sign({ data: { path } });
      toast.success("Dokument geöffnet", { id: "cv-sign" });
      window.open(url, "_blank");
    } catch (e: unknown) {
      toast.error("Fehler beim Öffnen des Lebenslaufs", { id: "cv-sign" });
    }
  }

  async function changeStatus(id: string, status: "new" | "reviewing" | "accepted" | "rejected") {
    try {
      await setStatus({ data: { id, status } });
      qc.invalidateQueries({ queryKey: ["admin-apps"] });
      
      if (selectedCandidate && selectedCandidate.id === id) {
        setSelectedCandidate({ ...selectedCandidate, status });
      }
      
      toast.success(`Bewerber-Status aktualisiert: ${
        status === "new" ? "Neu" : status === "reviewing" ? "In Prüfung" : status === "accepted" ? "Angenommen" : "Abgelehnt"
      }`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Fehler beim Ändern des Status");
    }
  }

  // Filter and search applicants
  const filteredData = data?.filter((a) => {
    const matchesTab = a.status === activeTab;
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.phone && a.phone.includes(searchQuery)) ||
      (a.message && a.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.jobs?.title && a.jobs.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  }) || [];

  // E-mail template generator helper
  const getMailUrl = (candidate: Application, type: "invite" | "reject") => {
    const jobTitle = candidate.jobs?.title || "der ausgeschriebenen Stelle";
    let body = "";
    let subject = "";

    if (type === "invite") {
      subject = `Bewerbung als ${jobTitle} bei Loni Galabau GmbH`;
      body = `Sehr geehrte(r) Frau/Herr ${candidate.name},\n\nvielen Dank für Ihre Bewerbung und Ihr Interesse an einer Tätigkeit als ${jobTitle} bei der Loni Galabau GmbH.\n\nIhre Unterlagen haben uns überzeugt. Wir möchten Sie daher gerne zu einem persönlichen Vorstellungsgespräch einladen.\n\nBitte teilen Sie uns zeitnah mit, welcher der folgenden Termine für Sie am besten passt:\n- [Datum/Uhrzeit 1]\n- [Datum/Uhrzeit 2]\n\nWir freuen uns auf das Gespräch!\n\nMit freundlichen Grüßen,\nLoni Galabau GmbH`;
    } else {
      subject = `Ihre Bewerbung bei Loni Galabau GmbH`;
      body = `Sehr geehrte(r) Frau/Herr ${candidate.name},\n\nvielen Dank für Ihre Bewerbung als ${jobTitle} bei der Loni Galabau GmbH und die Zeit, die Sie investiert haben.\n\nLeider müssen wir Ihnen heute mitteilen, dass wir Ihre Bewerbung für das weitere Verfahren nicht berücksichtigen können. Diese Entscheidung fiel uns angesichts der vielen qualifizierten Einsendungen nicht leicht.\n\nFür Ihren weiteren Berufs- und Lebensweg wünschen wir Ihnen viel Erfolg und alles Gute.\n\nMit freundlichen Grüßen,\nLoni Galabau GmbH`;
    }

    return `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-8 animate-fade-up relative min-h-[70vh]">
      {/* HEADER */}
      <div>
        <p className="text-xs uppercase tracking-widest text-accent font-semibold font-display">ATS Portal</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-1 text-brand tracking-tight">Bewerber-Pipeline</h1>
        <p className="opacity-60 text-sm mt-2 max-w-2xl">
          Sichten Sie eingegangene Bewerbungsunterlagen, bewerten Sie Kandidaten und managen Sie Ihren Rekrutierungsprozess.
        </p>
      </div>

      {/* FILTER & SEARCH ACTIONS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface p-4 rounded-3xl border border-brand/5 shadow-sm">
        {/* Tabs */}
        <div className="flex p-1 bg-background rounded-full border border-brand/5 w-fit overflow-x-auto max-w-full">
          {[
            { id: "new", label: "Neu", count: data?.filter(a => a.status === "new").length || 0 },
            { id: "reviewing", label: "In Prüfung", count: data?.filter(a => a.status === "reviewing").length || 0 },
            { id: "accepted", label: "Angenommen", count: data?.filter(a => a.status === "accepted").length || 0 },
            { id: "rejected", label: "Abgelehnt", count: data?.filter(a => a.status === "rejected").length || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as never);
                setSelectedCandidate(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-brand text-brand-foreground shadow"
                  : "hover:bg-brand/5 opacity-70 hover:opacity-100"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-brand/10 text-brand"
              }`}>
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
            placeholder="Bewerber oder Stellen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-brand/10 bg-background text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/5 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* PIPELINE LIST */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
          <p className="text-sm text-foreground/40">Lade Bewerbungsunterlagen…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredData.length === 0 ? (
            <div className="bg-surface rounded-3xl p-16 text-center border border-brand/5 shadow-sm">
              <Briefcase className="w-12 h-12 text-brand/20 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-brand">Keine Bewerber gefunden</h3>
              <p className="text-xs text-foreground/50 mt-1">In dieser Pipeline-Stufe befinden sich aktuell keine Einträge.</p>
            </div>
          ) : (
            filteredData.map((a) => (
              <div 
                key={a.id} 
                onClick={() => setSelectedCandidate(a)}
                className={`bg-surface border rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-brand/20 ${
                  selectedCandidate?.id === a.id ? "border-brand bg-brand/5 ring-1 ring-brand/10" : "border-brand/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-brand text-base">{a.name}</span>
                      {a.cv_path && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-brand/5 text-brand px-2 py-0.5 rounded-full border border-brand/10">
                          <FileText className="w-3 h-3" /> CV
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-foreground/50 flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-brand/85"><Briefcase className="w-3.5 h-3.5 text-accent" /> {a.jobs?.title || "—"}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {a.email}</span>
                      {a.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {a.phone}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(a.created_at).toLocaleDateString("de-DE")}</span>
                    </div>
                  </div>

                  {/* Quick Action status shifts */}
                  <div className="flex items-center gap-1.5 self-start md:self-auto" onClick={e => e.stopPropagation()}>
                    {a.status !== "reviewing" && (
                      <button 
                        onClick={() => changeStatus(a.id, "reviewing")} 
                        title="In Prüfung schieben"
                        className="p-2 hover:bg-brand/5 rounded-full border border-brand/5 text-brand hover:text-brand-foreground transition"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}
                    {a.status !== "accepted" && (
                      <button 
                        onClick={() => changeStatus(a.id, "accepted")} 
                        title="Annehmen"
                        className="p-2 hover:bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600 hover:text-emerald-750 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {a.status !== "rejected" && (
                      <button 
                        onClick={() => changeStatus(a.id, "rejected")} 
                        title="Ablehnen"
                        className="p-2 hover:bg-red-50 rounded-full border border-red-100 text-red-600 hover:text-red-750 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {a.message && (
                  <div className="mt-4 pt-4 border-t border-brand/5">
                    <p className="text-sm opacity-80 line-clamp-1 leading-relaxed whitespace-pre-line font-light italic">
                      "{a.message}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* CANDIDATE DETAIL DRAWER VIEW */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" onClick={() => setSelectedCandidate(null)}>
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
                    <span className={`text-[9px] font-display font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                      selectedCandidate.status === "new" ? "bg-accent/15 text-accent" : selectedCandidate.status === "reviewing" ? "bg-amber-100 text-amber-800 border-amber-200" : selectedCandidate.status === "accepted" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}>
                      {selectedCandidate.status === "new" ? "Neu" : selectedCandidate.status === "reviewing" ? "In Prüfung" : selectedCandidate.status === "accepted" ? "Angenommen" : "Abgelehnt"}
                    </span>
                    <span className="text-[10px] text-foreground/40 font-semibold">{new Date(selectedCandidate.created_at).toLocaleString("de-DE")}</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-brand tracking-tight mt-3 font-semibold">{selectedCandidate.name}</h2>
                  <p className="text-xs uppercase tracking-widest text-foreground/45 mt-1.5 font-extrabold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-accent" /> Bewerbung als: {selectedCandidate.jobs?.title || "—"}
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-brand/5 rounded-full border border-brand/5 transition"
                >
                  <X className="w-5 h-5 text-foreground/60" />
                </button>
              </div>

              {/* Direct Actions */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <SubmissionNotification key={selectedCandidate.id} id={selectedCandidate.id} table="applications" sentAt={selectedCandidate.notification_sent_at} />
                {selectedCandidate.cv_path && (
                  <button 
                    onClick={() => openCv(selectedCandidate.cv_path!)}
                    className="flex items-center gap-2 text-xs font-semibold px-4.5 py-2.5 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> Lebenslauf öffnen <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                {selectedCandidate.phone && (
                  <a 
                    href={`tel:${selectedCandidate.phone}`}
                    className="flex items-center gap-2 text-xs font-semibold px-4.5 py-2.5 border border-brand/20 hover:bg-brand/5 rounded-full text-brand transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Anrufen
                  </a>
                )}
              </div>
            </div>

            {/* Drawer Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Message/Anschreiben Box */}
              {selectedCandidate.message && (
                <div className="bg-surface border border-brand/5 p-6 rounded-3xl space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-brand" /> Anschreiben / Nachricht
                  </p>
                  <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-line font-light">{selectedCandidate.message}</p>
                </div>
              )}

              {/* Quick Communication Response mail links */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-brand" /> Schnelle E-Mail-Antworten</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={getMailUrl(selectedCandidate, "invite")}
                    className="flex items-center justify-between text-left p-3.5 rounded-2xl border border-emerald-100 hover:bg-emerald-50/[0.3] text-sm text-emerald-800 transition"
                  >
                    <div>
                      <span className="font-semibold block text-emerald-950">Zum Vorstellungsgespräch einladen</span>
                      <span className="text-xs opacity-75">Vorformulierte Terminabsprache öffnen</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                  </a>

                  <a
                    href={getMailUrl(selectedCandidate, "reject")}
                    className="flex items-center justify-between text-left p-3.5 rounded-2xl border border-red-100 hover:bg-red-50/[0.3] text-sm text-red-800 transition"
                  >
                    <div>
                      <span className="font-semibold block text-red-950">Bewerbung absagen</span>
                      <span className="text-xs opacity-75">Freundlich formulierte Absage-Vorlage</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-red-600" />
                  </a>
                </div>
              </div>

              {/* Status Update Block */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Pipeline-Status ändern</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "new", label: "Neu", color: "hover:bg-brand/5", activeColor: "bg-brand/10 border-brand text-brand" },
                    { id: "reviewing", label: "Prüfen", color: "hover:bg-amber-50", activeColor: "bg-amber-50 border-amber-500 text-amber-700" },
                    { id: "accepted", label: "Zusagen", color: "hover:bg-emerald-50", activeColor: "bg-emerald-50 border-emerald-500 text-emerald-700" },
                    { id: "rejected", label: "Absagen", color: "hover:bg-red-50", activeColor: "bg-red-50 border-red-500 text-red-700" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => changeStatus(selectedCandidate.id, st.id as never)}
                      className={`py-2 px-1 border rounded-xl text-xs font-semibold text-center transition-all ${
                        selectedCandidate.status === st.id
                          ? st.activeColor
                          : `border-brand/10 bg-background ${st.color} opacity-70`
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CRM Admin Notes */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold flex items-center justify-between">
                  <span>Bewerber-Notizen</span>
                  <span className="text-[9px] opacity-60 normal-case">(Lokal gespeichert)</span>
                </p>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hinterlassen Sie interne Anmerkungen zum Werdegang, Qualifikationen oder Gehaltswunsch..."
                  className="w-full p-4.5 rounded-2xl border border-brand/10 bg-surface/50 text-sm outline-none focus:border-brand/40 focus:bg-background transition resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  className="text-xs font-bold font-display uppercase tracking-wider text-brand hover:text-accent border border-brand/20 hover:border-brand/40 px-4 py-2 rounded-full transition"
                >
                  Notizen sichern
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-brand/5 bg-surface/20 text-center">
              <p className="text-[10px] text-foreground/35">Loni Galabau Rekrutierung • Bewerber-ID: {selectedCandidate.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
