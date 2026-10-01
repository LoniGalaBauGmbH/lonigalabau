import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import {
  AssistantGate,
  AssistantError,
  AssistantUnsavedChanges,
  errorText,
} from "@/components/admin/AssistantGate";
import {
  assistantDocuments,
  assistantDocument,
  assistantSaveDocument,
  assistantDeleteDocument,
  assistantSearch,
} from "@/lib/assistant.functions";
import type { KnowledgeDocument, KnowledgeSource } from "@/lib/assistant.types";

export const Route = createFileRoute("/_authenticated/admin/wissensbank")({
  component: () => (
    <AssistantGate>
      <KnowledgePage />
    </AssistantGate>
  ),
});
type Meta = Omit<KnowledgeDocument, "content">;
const blank = { title: "", category: "Allgemein", source: "", content: "", approved: false };
function KnowledgePage() {
  const [documents, setDocuments] = useState<Meta[]>([]),
    [doc, setDoc] = useState<(Partial<KnowledgeDocument> & typeof blank) | null>(null);
  const [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const [query, setQuery] = useState(""),
    [results, setResults] = useState<KnowledgeSource[] | null>(null);
  async function refresh() {
    setDocuments((await assistantDocuments()) as Meta[]);
  }
  useEffect(() => {
    void refresh().catch((e) => setError(errorText(e)));
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function leave() {
    return !dirty || window.confirm("Ungespeicherte Änderungen verwerfen?");
  }
  async function open(id?: string) {
    if (!leave() || busy) return;
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      setDoc(id ? await assistantDocument({ data: { id } }) : { ...blank });
      setDirty(false);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  function edit(patch: Partial<typeof blank>) {
    setDoc((current) =>
      current
        ? { ...current, ...patch, ...("approved" in patch ? {} : { approved: false }) }
        : current,
    );
    setDirty(true);
    setSuccess("");
  }
  async function save() {
    if (!doc || busy) return;
    setBusy(true);
    setError("");
    try {
      const { id, version, title, category, source, content, approved } = doc;
      const saved = await assistantSaveDocument({
        data: { ...(id ? { id, version } : {}), title, category, source, content, approved },
      });
      setDoc(saved);
      setDirty(false);
      setSuccess(
        approved
          ? "Gespeichert und für die KI freigegeben."
          : "Gespeichert. Die KI verwendet dieses Dokument noch nicht.",
      );
      setResults(null);
      await refresh();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (
      !doc?.id ||
      !doc.version ||
      busy ||
      !window.confirm(
        "Dieses Wissensdokument endgültig löschen? Die KI kann es danach nicht mehr suchen. Bestehende Entwürfe bitte gesondert prüfen.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await assistantDeleteDocument({ data: { id: doc.id, version: doc.version } });
      setDoc(null);
      setDirty(false);
      setResults(null);
      await refresh();
      setSuccess("Dokument gelöscht.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function importFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.size > 200000 || !/\.(txt|md)$/i.test(file.name)) {
      setError(
        "Bitte eine TXT- oder Markdown-Datei bis 200 KB wählen. PDF- und Office-Dateien werden später über die Dokumentenanbindung eingelesen.",
      );
      return;
    }
    const content = await file.text();
    if (content.includes("\u0000")) {
      setError("Diese Datei enthält keinen gültigen Text.");
      return;
    }
    edit({
      content,
      title: doc?.title || file.name.replace(/\.[^.]+$/, ""),
      source: doc?.source || file.name,
    });
  }
  async function search() {
    if (!query.trim() || busy) return;
    setError("");
    setBusy(true);
    try {
      setResults(await assistantSearch({ data: { query } }));
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <AssistantUnsavedChanges dirty={dirty} />
      <div className="assistant-toolbar">
        <div>
          <p className="assistant-eyebrow">Loni · Firmenwissen</p>
          <h1>Wissensbank</h1>
          <p className="assistant-muted">Verlässliche Informationen für gute Antworten.</p>
        </div>
        <button className="assistant-primary" onClick={() => open()} disabled={busy}>
          <Plus size={16} className="inline mr-2" />
          Dokument hinzufügen
        </button>
      </div>
      <div className="assistant-note">
        Nur freigegebene Dokumente werden von der KI durchsucht. Bearbeitungen heben die Freigabe
        auf. Hier gehören allgemeine Firmeninformationen hinein; einzelne Kundenverläufe bleiben im
        jeweiligen Vorgang.
      </div>
      <AssistantError message={error} />
      {success && (
        <p role="status" className="assistant-success mt-3">
          {success}
        </p>
      )}
      <div className="assistant-layout">
        <aside className="assistant-panel">
          <div className="assistant-toolbar">
            <h2>
              <BookOpen size={18} className="inline mr-2" />
              Dokumente
            </h2>
            <span className="assistant-count">{documents.length}</span>
          </div>
          <div className="assistant-list">
            {documents.map((d) => (
              <button
                key={d.id}
                aria-current={doc?.id === d.id}
                onClick={() => open(d.id)}
                disabled={busy}
              >
                <strong>{d.title}</strong>
                <small>
                  {d.category} · Version {d.version}
                </small>
                <small>{d.approved ? "Freigegeben" : "Entwurf · nicht für KI"}</small>
              </button>
            ))}
            {!documents.length && (
              <p className="assistant-empty">Noch kein Firmenwissen hinterlegt.</p>
            )}
          </div>
          <p className="assistant-muted mt-4">Bis zu 500 aktuelle Dokumente werden angezeigt.</p>
        </aside>
        <div className="assistant-stack">
          <section className="assistant-panel">
            <h2>Wissen suchen</h2>
            <form
              className="assistant-actions mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                void search();
              }}
            >
              <label className="flex-1">
                Suchbegriffe
                <input
                  value={query}
                  maxLength={500}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="z. B. Einfahrt oder Bewässerung"
                />
              </label>
              <button className="assistant-secondary self-end" disabled={busy || !query.trim()}>
                <Search size={16} className="inline mr-1" />
                Suchen
              </button>
            </form>
            {results && (
              <div className="assistant-results">
                {results.length === 0 ? (
                  <p className="assistant-muted">
                    Keine freigegebene Quelle gefunden. Versuchen Sie einzelne Begriffe oder
                    „Pflaster OR Einfahrt“.
                  </p>
                ) : (
                  results.map((s) => (
                    <div key={s.chunkId} className="assistant-source">
                      <button onClick={() => open(s.documentId)} disabled={busy}>
                        {s.title} · Version {s.version}
                      </button>
                      <p>{s.text}</p>
                      <small>{s.source || "Interne Wissensbank"}</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
          {doc ? (
            <section className="assistant-panel assistant-stack">
              <div className="assistant-toolbar">
                <h2>{doc.id ? "Dokument bearbeiten" : "Neues Dokument"}</h2>
                <span className={`assistant-badge ${doc.approved ? "" : "pending"}`}>
                  {dirty ? "Ungespeichert" : doc.approved ? "Freigegeben" : "Entwurf"}
                </span>
              </div>
              <fieldset disabled={busy} className="assistant-stack">
                <div className="assistant-fieldgrid">
                  <label>
                    Titel
                    <input
                      value={doc.title}
                      maxLength={180}
                      onChange={(e) => edit({ title: e.target.value })}
                    />
                  </label>
                  <label>
                    Kategorie
                    <input
                      value={doc.category}
                      maxLength={80}
                      onChange={(e) => edit({ category: e.target.value })}
                      placeholder="z. B. Leistungen, Ablauf, Material"
                    />
                  </label>
                </div>
                <label>
                  Herkunft / Quelle
                  <input
                    value={doc.source}
                    maxLength={500}
                    onChange={(e) => edit({ source: e.target.value })}
                    placeholder="z. B. interne Leistungsbeschreibung, Stand Oktober 2026"
                  />
                </label>
                <label className="assistant-import">
                  Textdatei übernehmen
                  <input
                    className="assistant-file"
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    onChange={(e) => {
                      void importFile(e.target.files?.[0]).catch((err) => setError(errorText(err)));
                      e.target.value = "";
                    }}
                  />
                  <span className="assistant-muted">
                    TXT oder Markdown bis 200 KB. Es wird nur der Text gespeichert.
                  </span>
                </label>
                <label>
                  Inhalt
                  <textarea
                    rows={15}
                    maxLength={200000}
                    value={doc.content}
                    onChange={(e) => edit({ content: e.target.value })}
                  />
                </label>
                <label className="assistant-check">
                  <input
                    type="checkbox"
                    checked={doc.approved}
                    onChange={(e) => edit({ approved: e.target.checked })}
                  />
                  <span>
                    Inhalt fachlich geprüft und für die KI freigeben. Keine vertraulichen
                    Kundendaten oder Zugangsdaten enthalten.
                  </span>
                </label>
              </fieldset>
              <div className="assistant-actions">
                <button
                  className="assistant-primary"
                  disabled={busy || !doc.title.trim() || !doc.content.trim()}
                  onClick={save}
                >
                  {busy ? "Wird verarbeitet …" : "Dokument speichern"}
                </button>
                {doc.id && (
                  <button className="assistant-danger" disabled={busy} onClick={remove}>
                    Löschen
                  </button>
                )}
              </div>
            </section>
          ) : (
            <section className="assistant-panel assistant-empty">
              <BookOpen size={30} className="mx-auto mb-3" />
              <h2>Wissen gezielt bereitstellen</h2>
              <p className="mt-2">
                Legen Sie Leistungen, Arbeitsabläufe und häufige Rückfragen an. Preise und Zusagen
                nur dann freigeben, wenn sie verbindlich geklärt sind.
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
