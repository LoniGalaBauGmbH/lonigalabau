import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Plus, ShieldCheck, BookOpen } from "lucide-react";
import {
  AssistantGate,
  AssistantError,
  AssistantUnsavedChanges,
  errorText,
} from "@/components/admin/AssistantGate";
import * as api from "@/lib/assistant.functions";
import type { AssistantCase } from "@/lib/assistant.types";
export const Route = createFileRoute("/_authenticated/admin/assistent")({
  component: () => (
    <AssistantGate>
      <AssistantPage />
    </AssistantGate>
  ),
});
type CaseMeta = {
  id: string;
  title: string;
  customer: string;
  review_on: string | null;
  updated_at: string;
};
function AssistantPage() {
  const [cases, setCases] = useState<CaseMeta[]>([]),
    [item, setItem] = useState<AssistantCase | null>(null),
    [tab, setTab] = useState<"cases" | "settings">("cases");
  const [status, setStatus] = useState<Awaited<ReturnType<typeof api.assistantStatus>> | null>(
    null,
  );
  const [contacts, setContacts] = useState<{ id: string; name: string; subject: string | null }[]>(
      [],
    ),
    [contactId, setContactId] = useState("");
  const [showNew, setShowNew] = useState(false),
    [newCase, setNewCase] = useState({ title: "", customer: "", content: "" });
  const [draft, setDraft] = useState(""),
    [notes, setNotes] = useState(""),
    [review, setReview] = useState(""),
    [message, setMessage] = useState(""),
    [role, setRole] = useState<"user" | "assistant">("user");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [reviewed, setReviewed] = useState(false);
  const [audit, setAudit] = useState<
    { id: string; entity_type: string; action: string; created_at: string }[]
  >([]);
  const dirty =
    (showNew && Object.values(newCase).some((value) => !!value.trim())) ||
    (!!item &&
      (draft !== item.draft ||
        notes !== item.notes ||
        review !== (item.review_on ?? "") ||
        !!message.trim()));
  async function refresh() {
    setCases((await api.assistantCases()) as CaseMeta[]);
  }
  useEffect(() => {
    void Promise.all([
      refresh(),
      api.assistantStatus().then(setStatus),
      api.assistantContacts().then(setContacts),
    ]).catch((e) => setError(errorText(e)));
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
  function adopt(next: AssistantCase) {
    setItem(next);
    setDraft(next.draft);
    setNotes(next.notes);
    setReview(next.review_on ?? "");
    setMessage("");
    setReviewed(false);
  }
  async function action(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await fn();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  function open(id: string) {
    if (dirty && !window.confirm("Ungespeicherte Änderungen verwerfen?")) return;
    void action(async () => {
      adopt(await api.assistantCase({ data: { id } }));
      setShowNew(false);
    });
  }
  function save() {
    if (!item) return;
    void action(async () => {
      const next = await api.assistantSaveCase({
        data: { id: item.id, version: item.version, notes, draft, review_on: review || null },
      });
      setItem(next);
      setReviewed(false);
      setSuccess("Entwurf und Notizen gespeichert.");
      await refresh();
    });
  }
  function append() {
    if (!item || !message.trim()) return;
    void action(async () => {
      let current = item;
      if (notes !== item.notes || draft !== item.draft || review !== (item.review_on ?? ""))
        current = await api.assistantSaveCase({
          data: { id: item.id, version: item.version, notes, draft, review_on: review || null },
        });
      adopt(
        await api.assistantAppendMessage({
          data: { id: current.id, version: current.version, role, content: message },
        }),
      );
      await refresh();
    });
  }
  function analyze() {
    if (!item || dirty || !reviewed) return;
    void action(async () => {
      adopt(
        await api.assistantAnalyze({
          data: {
            id: item.id,
            version: item.version,
            reviewed: true,
            reviewToken: item.reviewToken,
          },
        }),
      );
      await refresh();
      setSuccess("Analyse erstellt. Bitte prüfen Sie den Vorschlag und seine Quellen.");
    });
  }
  function remove() {
    if (
      !item ||
      !window.confirm(
        "Diesen Assistenten-Vorgang mit Verlauf, Notizen und Entwurf endgültig löschen? Eine verknüpfte ursprüngliche Website-Anfrage bleibt unter „Anfragen“ erhalten.",
      )
    )
      return;
    void action(async () => {
      await api.assistantDeleteCase({ data: { id: item.id, version: item.version } });
      setItem(null);
      setMessage("");
      await refresh();
      setSuccess("Assistenten-Vorgang gelöscht.");
    });
  }
  function exportCase() {
    if (!item) return;
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: "application/json" }),
      url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "loni-vorgang-" + item.id + ".json";
    link.click();
    URL.revokeObjectURL(url);
    setSuccess(
      "Gespeicherten Vorgang exportiert. Die Datei enthält personenbezogene Daten; bitte geschützt aufbewahren.",
    );
  }
  const analysis = item?.analysis;
  return (
    <>
      <AssistantUnsavedChanges dirty={dirty} />
      <div className="assistant-toolbar">
        <div>
          <p className="assistant-eyebrow">Loni · Kundenkommunikation</p>
          <h1>KI-Assistent</h1>
          <p className="assistant-muted">
            Anfragen verstehen. Antworten vorbereiten. Wissen nutzen.
          </p>
        </div>
        <span className={`assistant-badge ${status?.aiReady ? "" : "pending"}`}>
          <ShieldCheck size={14} className="mr-1" />
          {status?.aiReady ? "KI verbunden · Entwurfsmodus" : "KI-Anbindung noch offen"}
        </span>
      </div>
      <div className="assistant-tabs" role="tablist" aria-label="Assistentenbereich">
        <button role="tab" aria-selected={tab === "cases"} onClick={() => setTab("cases")}>
          Vorgänge
        </button>
        <button
          role="tab"
          aria-selected={tab === "settings"}
          onClick={() => {
            setTab("settings");
            void api
              .assistantAudit()
              .then(setAudit)
              .catch((e) => setError(errorText(e)));
          }}
        >
          Verbindungen & Datenschutz
        </button>
        <Link to="/admin/wissensbank" className="assistant-secondary rounded-lg px-3 py-2 text-sm">
          <BookOpen size={15} className="inline mr-1" />
          Wissensbank
        </Link>
      </div>
      <AssistantError message={error} />
      {success && (
        <p role="status" className="assistant-success my-3">
          {success}
        </p>
      )}
      {tab === "settings" ? (
        <div className="assistant-stack">
          <section className="assistant-panel assistant-stack">
            <h2>Verbindungen</h2>
            <p>
              KI-Dienst:{" "}
              <strong>{status?.aiReady ? "Konfiguriert" : "Noch nicht freigeschaltet"}</strong>
              {status?.aiReady && ` · Region: ${status.region === "eu" ? "EU" : "Global"}`}
            </p>
            <p>
              Outlook: nicht verbunden · OneDrive: nicht verbunden · Firmenserver: nicht verbunden
            </p>
            <div className="assistant-note">
              Die letzte Einrichtung erfolgt gemeinsam: Anbieterzugang, erlaubte Ordner,
              Postfachrechte und Datenschutzvereinbarungen. Zugangsschlüssel werden ausschließlich
              auf dem Server eingerichtet.
            </div>
            <p className="assistant-muted">
              Antworten werden als Entwürfe vorbereitet. Der Assistent hat keine Versand- oder
              Terminbuchungsfunktion.
            </p>
          </section>
          <section className="assistant-panel assistant-stack">
            <h2>Datenschutz im Arbeitsalltag</h2>
            <ul>
              <li>
                Kundenverläufe nur im zugehörigen Vorgang führen; keine Kundendaten in die
                allgemeine Wissensbank übernehmen.
              </li>
              <li>Nur notwendige Inhalte erfassen. Anhänge werden nicht an die KI übermittelt.</li>
              <li>
                Vor jeder Analyse den Verlauf und die Notizen prüfen. Freitext kann personenbezogene
                Daten enthalten.
              </li>
              <li>
                Für Vorgänge ein Prüfdatum setzen. Danach entscheiden Sie über weitere Aufbewahrung
                oder Löschung.
              </li>
              <li>
                Export und Löschung stehen im geöffneten Vorgang zur Verfügung. Verknüpfte
                Website-Anfragen werden gesondert unter „Anfragen“ verwaltet.
              </li>
            </ul>
            <p>
              Vor der KI-Freischaltung sind Rechtsgrundlage, Auftragsverarbeitung, Datenregion,
              Informationspflichten und Löschfristen betrieblich festzulegen. Diese technische
              Einrichtung ersetzt keine rechtliche Prüfung.
            </p>
          </section>
          <section className="assistant-panel">
            <h2>Letzte Änderungen</h2>
            <p className="assistant-muted mb-3">
              Bis zu 100 Einträge; ohne Nachrichten- oder Dokumentinhalte.
            </p>
            {audit.length ? (
              audit.map((entry) => (
                <p key={entry.id} className="assistant-muted">
                  {new Date(entry.created_at).toLocaleString("de-DE")} ·{" "}
                  {entry.entity_type === "case" ? "Vorgang" : "Wissensdokument"} ·{" "}
                  {entry.action === "INSERT" ? "angelegt" : "geändert"}
                </p>
              ))
            ) : (
              <p className="assistant-muted">Noch keine Änderungen protokolliert.</p>
            )}
          </section>
        </div>
      ) : (
        <>
          <div className="assistant-note">
            {status?.aiReady
              ? "Die KI durchsucht freigegebenes Firmenwissen und erstellt Vorschläge mit Quellen. Prüfen Sie jeden Entwurf vor Verwendung."
              : "Vorgänge, Notizen, Entwürfe und Wissensbank können Sie bereits vorbereiten. Echte KI-Antworten werden nach Einrichtung des Anbieterzugangs freigeschaltet."}
          </div>
          <div className="assistant-layout">
            <aside className="assistant-panel assistant-stack">
              <button
                className="assistant-primary"
                disabled={busy}
                onClick={() => {
                  if (!dirty || window.confirm("Ungespeicherte Änderungen verwerfen?")) {
                    setItem(null);
                    setMessage("");
                    setShowNew(true);
                    setError("");
                  }
                }}
              >
                <Plus size={16} className="inline mr-1" />
                Neuer Vorgang
              </button>
              <div className="assistant-list">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    aria-current={item?.id === c.id}
                    onClick={() => open(c.id)}
                    disabled={busy}
                  >
                    <strong>{c.title}</strong>
                    <small>{c.customer || "Ohne Kundenname"}</small>
                    {c.review_on && (
                      <small>
                        Prüfen: {new Date(c.review_on + "T12:00:00").toLocaleDateString("de-DE")}
                      </small>
                    )}
                  </button>
                ))}
                {!cases.length && <p className="assistant-empty">Noch keine Vorgänge.</p>}
              </div>
              <p className="assistant-muted">Die 200 zuletzt bearbeiteten Vorgänge.</p>
            </aside>
            <div className="assistant-stack">
              {showNew ? (
                <section className="assistant-panel assistant-stack">
                  <h2>Vorgang anlegen</h2>
                  <div className="assistant-import assistant-stack">
                    <label>
                      Vorhandene Website-Anfrage auswählen
                      <select value={contactId} onChange={(e) => setContactId(e.target.value)}>
                        <option value="">Bitte auswählen</option>
                        {contacts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} · {c.subject || "Anfrage"}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      disabled={busy || !contactId}
                      className="assistant-secondary"
                      onClick={() => {
                        void action(async () => {
                          const id = await api.assistantOpenContact({ data: { id: contactId } });
                          adopt(await api.assistantCase({ data: { id } }));
                          setShowNew(false);
                          await refresh();
                        });
                      }}
                    >
                      Anfrage verknüpfen
                    </button>
                    <p className="assistant-muted">
                      Die 200 neuesten Anfragen. Bestehende Kundendaten werden weiterverwendet.
                    </p>
                  </div>
                  <h3>Oder eine E-Mail manuell erfassen</h3>
                  <fieldset disabled={busy} className="assistant-stack">
                    <label>
                      Betreff
                      <input
                        value={newCase.title}
                        maxLength={180}
                        onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                      />
                    </label>
                    <label>
                      Kunde / Projektbezeichnung
                      <input
                        value={newCase.customer}
                        maxLength={180}
                        onChange={(e) => setNewCase({ ...newCase, customer: e.target.value })}
                      />
                    </label>
                    <label>
                      Nachricht
                      <textarea
                        rows={7}
                        value={newCase.content}
                        maxLength={20000}
                        onChange={(e) => setNewCase({ ...newCase, content: e.target.value })}
                      />
                    </label>
                  </fieldset>
                  <button
                    disabled={busy || !newCase.title.trim() || !newCase.content.trim()}
                    className="assistant-primary"
                    onClick={() => {
                      void action(async () => {
                        const id = await api.assistantCreateCase({ data: newCase });
                        adopt(await api.assistantCase({ data: { id } }));
                        setNewCase({ title: "", customer: "", content: "" });
                        setShowNew(false);
                        await refresh();
                      });
                    }}
                  >
                    Vorgang speichern
                  </button>
                </section>
              ) : !item ? (
                <section className="assistant-panel assistant-empty">
                  <Sparkles size={32} className="mx-auto mb-3" />
                  <h2>Jede Anfrage mit ihrem eigenen Verlauf</h2>
                  <p className="mt-2">
                    Öffnen Sie einen Vorgang oder übernehmen Sie eine bestehende Website-Anfrage.
                  </p>
                </section>
              ) : (
                <>
                  <section className="assistant-panel assistant-stack">
                    <div className="assistant-toolbar">
                      <div>
                        <h2>{item.title}</h2>
                        <p className="assistant-muted">
                          {item.customer} · Version {item.version}
                          {dirty ? " · Ungespeicherte Änderungen" : ""}
                        </p>
                      </div>
                      <div className="assistant-actions">
                        <button
                          className="assistant-secondary"
                          disabled={busy || dirty}
                          onClick={exportCase}
                        >
                          Export
                        </button>
                        <button className="assistant-danger" disabled={busy} onClick={remove}>
                          Löschen
                        </button>
                      </div>
                    </div>
                    <h3>Kundenverlauf</h3>
                    {item.contact && (
                      <div className="assistant-message">
                        <small>Ursprüngliche Website-Anfrage</small>
                        {item.contact.message}
                      </div>
                    )}
                    {item.messages.map((m) => (
                      <div key={m.id} className="assistant-message">
                        <small>
                          {m.role === "user" ? "Kunde" : "Team · manuell dokumentiert"} ·{" "}
                          {new Date(m.createdAt).toLocaleString("de-DE")}
                        </small>
                        {m.content}
                      </div>
                    ))}
                    <fieldset disabled={busy} className="assistant-stack">
                      <label>
                        Art der Nachricht
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as "user" | "assistant")}
                        >
                          <option value="user">Kundennachricht</option>
                          <option value="assistant">Bereits erfolgte Teamantwort</option>
                        </select>
                      </label>
                      <label>
                        Weitere Nachricht
                        <textarea
                          rows={4}
                          value={message}
                          maxLength={20000}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            setReviewed(false);
                          }}
                          placeholder="Nur den für diesen Vorgang relevanten Text übernehmen."
                        />
                      </label>
                      <button
                        className="assistant-secondary"
                        disabled={!message.trim()}
                        onClick={append}
                      >
                        Zum Verlauf hinzufügen
                      </button>
                    </fieldset>
                    {item.contact?.notes && (
                      <details>
                        <summary>Notizen aus der Website-Anfrage</summary>
                        <p className="assistant-message mt-3">{item.contact.notes}</p>
                      </details>
                    )}
                    <label>
                      Interne Vorgangsnotizen
                      <textarea
                        disabled={busy}
                        rows={4}
                        value={notes}
                        maxLength={20000}
                        onChange={(e) => {
                          setNotes(e.target.value);
                          setReviewed(false);
                        }}
                      />
                    </label>
                    <div className="assistant-section assistant-stack">
                      <h3>Analyse und Besichtigung vorbereiten</h3>
                      <p className="assistant-muted">
                        Übermittelt werden Betreff, Kundenverlauf, Notizen und passende freigegebene
                        Wissensauszüge. Separate E-Mail-, Telefon- und Adressfelder sowie Anhänge
                        werden nicht übertragen. Namen und andere Angaben im Freitext sind weiterhin
                        möglich.
                      </p>
                      <label className="assistant-check">
                        <input
                          type="checkbox"
                          disabled={busy || !status?.aiReady || dirty}
                          checked={reviewed}
                          onChange={(e) => setReviewed(e.target.checked)}
                        />
                        <span>
                          Ich habe die Inhalte geprüft. Sie sind für die Bearbeitung erforderlich
                          und dürfen an den eingerichteten KI-Dienst übermittelt werden.
                        </span>
                      </label>
                      <button
                        className="assistant-primary"
                        disabled={busy || !status?.aiReady || dirty || !reviewed}
                        onClick={analyze}
                      >
                        <Sparkles size={16} className="inline mr-2" />
                        {busy ? "Wird bearbeitet …" : "Mit Firmenwissen analysieren"}
                      </button>
                      {dirty && (
                        <p className="assistant-muted">
                          Änderungen zuerst speichern und neue Nachrichten zum Verlauf hinzufügen.
                        </p>
                      )}
                    </div>
                  </section>
                  {analysis && (
                    <section className="assistant-panel assistant-stack">
                      <h2>KI-Vorschlag · bitte prüfen</h2>
                      {(item.knowledgeStale || item.analysisStale) && (
                        <p className="assistant-error">
                          Der Kundenverlauf oder eine verwendete Wissensquelle wurde verändert.
                          Dieser Vorschlag ist überholt und muss erneut geprüft werden.
                        </p>
                      )}
                      <p>{analysis.summary}</p>
                      {analysis.reviewReason && (
                        <div className="assistant-note">{analysis.reviewReason}</div>
                      )}
                      {[
                        ["Bekannte Angaben", analysis.knownFacts],
                        ["Offene Rückfragen", analysis.missingQuestions],
                        ["Für die Besichtigung", analysis.visitBriefing],
                      ].map(([title, lines]) => (
                        <div key={title as string}>
                          <h3>{title as string}</h3>
                          <ul>
                            {(lines as string[]).map((text, index) => (
                              <li key={index}>{text}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <details>
                        <summary>Verwendete Wissensquellen ({analysis.sources.length})</summary>
                        {analysis.sources.map((s) => (
                          <p className="assistant-source mt-2" key={s.chunkId}>
                            {s.title} · Version {s.version}
                            <br />
                            {s.source}
                          </p>
                        ))}
                        {!analysis.sources.length && (
                          <p>Keine passende freigegebene Quelle gefunden.</p>
                        )}
                      </details>
                      {analysis.draft && analysis.draft !== draft && (
                        <details>
                          <summary>Neuen KI-Entwurf ansehen</summary>
                          <p className="assistant-message mt-3">{analysis.draft}</p>
                          <button
                            className="assistant-secondary mt-3"
                            disabled={busy}
                            onClick={() => {
                              if (
                                !draft ||
                                window.confirm("Aktuellen Entwurf durch den KI-Vorschlag ersetzen?")
                              )
                                setDraft(analysis.draft);
                            }}
                          >
                            Vorschlag in den Editor übernehmen
                          </button>
                        </details>
                      )}
                    </section>
                  )}
                  <section className="assistant-panel assistant-stack">
                    <h2>Antwortentwurf</h2>
                    <label>
                      Nachricht an den Kunden
                      <textarea
                        disabled={busy}
                        rows={12}
                        value={draft}
                        maxLength={12000}
                        onChange={(e) => {
                          setDraft(e.target.value);
                          setReviewed(false);
                        }}
                        placeholder="Hier erscheint Ihr KI-Entwurf. Sie können auch bereits selbst einen Entwurf vorbereiten."
                      />
                    </label>
                    <label>
                      Aufbewahrung prüfen am
                      <input
                        disabled={busy}
                        type="date"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                    </label>
                    <p className="assistant-muted">
                      Das Prüfdatum löst keine automatische Löschung aus. Gesetzliche und
                      betriebliche Aufbewahrungspflichten vor dem Löschen berücksichtigen.
                    </p>
                    <div className="assistant-actions">
                      <button className="assistant-primary" disabled={busy} onClick={save}>
                        Entwurf & Notizen speichern
                      </button>
                      <button
                        className="assistant-secondary"
                        disabled={busy || !draft}
                        onClick={() => {
                          void navigator.clipboard
                            .writeText(draft)
                            .then(() =>
                              setSuccess("Entwurf kopiert. Es wurde keine E-Mail versandt."),
                            )
                            .catch(() =>
                              setError(
                                "Kopieren nicht möglich. Bitte den Text markieren und kopieren.",
                              ),
                            );
                        }}
                      >
                        Text kopieren
                      </button>
                    </div>
                    <p className="assistant-muted">
                      Es wird nichts automatisch versandt und kein Besichtigungstermin verbindlich
                      gebucht.
                    </p>
                  </section>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
