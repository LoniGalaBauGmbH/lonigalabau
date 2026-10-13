import { useId, useState } from "react";
import { ArrowUpRight, Copy, RotateCcw } from "lucide-react";

const OFFER_ITEMS = [
  {
    title: "Baugrube & Einbaugrund",
    question: "Welche Bodenannahmen, Erdarbeiten, Bettung und Verfüllung sind enthalten?",
  },
  {
    title: "Aushub & Entsorgung",
    question: "Bleibt der Aushub auf dem Grundstück oder sind Abfuhr und Entsorgung enthalten?",
  },
  {
    title: "Tank & Einbringung",
    question: "Welche Tankgröße und Abdeckung sind vorgesehen – inklusive Lieferung und Einheben?",
  },
  {
    title: "Zulauf & Überlauf",
    question: "Wohin führt der Überlauf und welche Leitungslängen sind berücksichtigt?",
  },
  {
    title: "Filter, Pumpe & Wasserentnahme",
    question: "Welche Technik, Entnahmestelle und verbindenden Leitungen sind enthalten?",
  },
  {
    title: "Garten wiederherstellen",
    question: "Welche Rasenflächen, Beläge und Pflanzbereiche werden danach wiederhergestellt?",
  },
  {
    title: "Fachanschlüsse & Zuständigkeit",
    question: "Wer übernimmt elektrische und gegebenenfalls weitere erforderliche Fachanschlüsse?",
  },
] as const;

const FINAL_COMPARISON_QUESTION =
  "Bitte gleichen Sie zusätzlich Mengen, Leistungsgrenzen und die enthaltenen Steuern ab. Welche Arbeiten oder Nebenkosten sind ausdrücklich ausgeschlossen?";

export function CisternOfferCheck() {
  const checklistId = useId();
  const [checkedItems, setCheckedItems] = useState<boolean[]>(() => OFFER_ITEMS.map(() => false));
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const [manualText, setManualText] = useState("");
  const checkedCount = checkedItems.filter(Boolean).length;
  const openQuestions = OFFER_ITEMS.filter((_, index) => !checkedItems[index]);
  const copyText = openQuestions.length
    ? `Offene Fragen zu meinem Zisternen-Einbauangebot:\n\n${openQuestions
        .map((item, index) => `${index + 1}. ${item.question}`)
        .join("\n")}`
    : FINAL_COMPARISON_QUESTION;

  function toggleItem(index: number) {
    setCheckedItems((current) =>
      current.map((checked, itemIndex) => (itemIndex === index ? !checked : checked)),
    );
    setCopyState("idle");
    setManualText("");
  }

  function resetChecklist() {
    setCheckedItems(OFFER_ITEMS.map(() => false));
    setCopyState("idle");
    setManualText("");
  }

  async function copyQuestions() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(copyText);
      setManualText("");
      setCopyState("copied");
    } catch {
      setManualText(copyText);
      setCopyState("manual");
    }
  }

  return (
    <section
      id="kosten"
      aria-labelledby="kosten-titel"
      className="scroll-mt-24 bg-surface px-6 py-14 md:px-10 md:py-20"
    >
      <div className="mx-auto grid max-w-[1400px] items-start gap-8 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="min-w-0">
          <p className="eyebrow text-accent-ink">Angebote sinnvoll vergleichen</p>
          <h2 id="kosten-titel" className="display mt-5 text-[clamp(2rem,4vw,3.5rem)] text-brand">
            Was kostet der <br />
            <span className="font-light italic text-brand-muted">Zisternen-Einbau?</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/75">
            Ein Tank-Komplettset ist noch kein fertiger Einbau. Vergleichen Sie den vollständigen
            Umfang.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/75">
            Boden, Maschinenzugang, Leitungslängen und die spätere Oberfläche bestimmen den Aufwand
            mit. Achten Sie darauf, was enthalten ist und wer die einzelnen Arbeiten übernimmt.
          </p>
          <p className="mt-5 max-w-xl text-xs leading-relaxed text-brand/65">
            Ein Beispiel: Das{" "}
            <a
              href="https://www.mall.info/produkte/regenwasserbewirtschaftung/regenwassernutzung/garten-paket-fontana/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Garten-Paket Fontana von Mall
            </a>{" "}
            beschreibt das Setzen in eine vorbereitete Baugrube; die Druckleitung zur Entnahmestelle
            ist optional. Paketumfang und Arbeiten vor Ort sollten deshalb zusammen betrachtet
            werden.
          </p>
          <a
            href="#zisterne-anfragen"
            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            Mein Einbauangebot anfragen{" "}
            <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <div className="min-w-0 rounded-[1.5rem] border border-brand/10 bg-background p-5 sm:p-7 md:p-8">
          <fieldset>
            <legend className="max-w-xl font-display text-xl font-bold leading-snug text-brand sm:text-2xl">
              Markieren Sie, was in Ihrem Angebot eindeutig beschrieben ist
            </legend>
            <div className="mt-5 divide-y divide-brand/10">
              {OFFER_ITEMS.map((item, index) => (
                <label
                  key={item.title}
                  htmlFor={`${checklistId}-${index}`}
                  className="flex cursor-pointer items-start gap-3 rounded-sm py-4 first:pt-0"
                >
                  <input
                    id={`${checklistId}-${index}`}
                    type="checkbox"
                    checked={checkedItems[index]}
                    onChange={() => toggleItem(index)}
                    className="mt-1 size-5 shrink-0 cursor-pointer accent-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-relaxed text-brand">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-foreground/70">
                      {item.question}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-2 border-t border-brand/15 pt-5">
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="text-sm font-semibold text-brand"
            >
              {checkedCount} von 7 Positionen gefunden
            </p>
            <p className="mt-2 text-xs leading-relaxed text-brand/65">
              {checkedCount === OFFER_ITEMS.length
                ? "Gleichen Sie jetzt noch Mengen, Leistungsgrenzen und Steuern ab. Halten Sie außerdem fest, welche Arbeiten ausgeschlossen sind."
                : "Unklare Positionen? Kopieren Sie die offenen Fragen für Ihr nächstes Angebotsgespräch."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <button
                type="button"
                onClick={copyQuestions}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand/25 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                <Copy className="size-4 shrink-0" aria-hidden="true" />
                {checkedCount === OFFER_ITEMS.length
                  ? "Weitere Prüffragen kopieren"
                  : "Offene Fragen kopieren"}
              </button>
              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs text-brand/70 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                <RotateCcw className="size-3.5 shrink-0" aria-hidden="true" />
                Zurücksetzen
              </button>
            </div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mt-3 text-xs leading-relaxed text-brand/70"
            >
              {copyState === "copied"
                ? "Die Fragen wurden in die Zwischenablage kopiert."
                : copyState === "manual"
                  ? "Automatisches Kopieren ist hier nicht möglich. Markieren und kopieren Sie den Text im Feld darunter."
                  : ""}
            </p>
            {copyState === "manual" && (
              <textarea
                aria-label="Fragen zum manuellen Kopieren"
                readOnly
                value={manualText}
                onFocus={(event) => event.currentTarget.select()}
                rows={7}
                className="mt-2 block w-full min-w-0 resize-y rounded-lg border border-brand/25 bg-white p-3 text-sm leading-relaxed text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
