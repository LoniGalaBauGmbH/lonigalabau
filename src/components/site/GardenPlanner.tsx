import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Lightbulb,
  Loader2,
  Ruler,
  Save,
  Sprout,
  X,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ContactAttachments } from "./ContactAttachments";
import { useContactAttachments } from "@/hooks/useContactAttachments";
import { scrollStepIntoView, useStepTransition } from "@/hooks/useStepTransition";
import { useSiteImages } from "@/hooks/useSiteImages";
import { createGardenPlannerRequest } from "@/lib/site.functions";
import {
  INITIAL_PLANNER,
  OPEN,
  TRADES,
  SITE_QUESTIONS,
  FRAME_QUESTIONS,
  plannerSteps,
  visibleQuestions,
  validatePlannerStep,
  plannerSummary,
  plannerOpenPoints,
  plannerText,
  plannerDraftSchema,
  privatePlannerDraft,
  rectangleMeasure,
  type PlannerState,
  type PlannerErrors,
  type Question,
} from "@/lib/garden-planner";
import "./GardenPlanner.css";
import "./Motion.css";

const DRAFT_KEY = "loni-garden-planner-v1";
const stepLabels: Record<string, string> = {
  project: "Vorhaben",
  site: "Grundstück",
  frame: "Rahmen",
  photos: "Fotos & Wünsche",
  review: "Prüfen & anfragen",
};
const inputClass = "planner-input";

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="planner-field">
      <label htmlFor={htmlFor} className="planner-label">
        {label}
      </label>
      <div className="planner-field-control">{children}</div>
      <div className="planner-field-note">
        {hint && (
          <p id={htmlFor + "-hint"} className="planner-hint">
            {hint}
          </p>
        )}
        {error && (
          <p id={htmlFor + "-error"} className="planner-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
function MeasureHelper({ unit, onApply }: { unit: string; onApply: (value: string) => void }) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const id = useId();
  const result = rectangleMeasure(length, width, unit === "m³" ? depth : undefined);
  return (
    <details className="planner-measure-helper">
      <summary>
        <Ruler className="size-4" aria-hidden="true" />
        Beim Abschätzen helfen
      </summary>
      <p className="planner-hint mt-3">
        Für einen rechteckigen Bereich. Unregelmäßige Flächen in Rechtecke aufteilen und die
        Ergebnisse zusammenzählen.
      </p>
      <div className="planner-measure-grid">
        {[
          ["length", "Länge (m)", length, setLength],
          ["width", "Breite (m)", width, setWidth],
          ...(unit === "m³" ? [["depth", "Tiefe / Höhe (m)", depth, setDepth]] : []),
        ].map(([key, label, value, setter]) => (
          <label key={String(key)} htmlFor={id + key} className="text-sm">
            {String(label)}
            <input
              id={id + key}
              className={inputClass}
              inputMode="decimal"
              value={String(value)}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              maxLength={9}
            />
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <output className="text-sm font-semibold" aria-live="polite">
          {result === null
            ? "Maße eingeben"
            : result.toLocaleString("de-DE") + " " + unit + " (ca.)"}
        </output>
        <button
          type="button"
          className="planner-text-button"
          disabled={result === null || result === 0}
          onClick={() => result !== null && onApply(String(result).replace(".", ","))}
        >
          Wert übernehmen
        </button>
      </div>
    </details>
  );
}
function QuestionField({
  question: q,
  value,
  onChange,
  error,
  fieldKey,
  helper = false,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  fieldKey: string;
  helper?: boolean;
}) {
  const id = useId();
  const props = {
    id,
    "data-field": fieldKey,
    "aria-invalid": !!error,
    "aria-describedby":
      [q.help ? id + "-hint" : "", error ? id + "-error" : ""].filter(Boolean).join(" ") ||
      undefined,
  };
  return (
    <Field
      label={q.label + (q.optional ? " (optional)" : "")}
      htmlFor={id}
      error={error}
      hint={q.help}
    >
      {q.options ? (
        <div className="planner-select">
          <select
            {...props}
            className={inputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Bitte auswählen</option>
            {q.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" />
        </div>
      ) : (
        <>
          <div className="planner-input-with-unit">
            <input
              {...props}
              className={inputClass}
              inputMode="decimal"
              disabled={value === OPEN}
              value={value === OPEN ? "" : value}
              onChange={(e) => onChange(e.target.value)}
              maxLength={9}
              placeholder={value === OPEN ? "Klären wir gemeinsam" : "z. B. 25"}
            />
            <span className="planner-unit">{q.unit}</span>
          </div>
          {!q.optional && (
            <label className="planner-unknown">
              <Checkbox
                checked={value === OPEN}
                onCheckedChange={(v) => onChange(v === true ? OPEN : "")}
                aria-label={q.short + ": noch unklar"}
              />
              Noch unklar – bitte gemeinsam klären
            </label>
          )}
          {helper && q.unit && (q.unit === "m²" || q.unit === "m³") && (
            <MeasureHelper unit={q.unit} onApply={onChange} />
          )}
        </>
      )}
    </Field>
  );
}

export function GardenPlanner() {
  const [form, setForm] = useState<PlannerState>(INITIAL_PLANNER);
  const [active, setActive] = useState("project");
  const [visited, setVisited] = useState<string[]>(["project"]);
  const [errors, setErrors] = useState<PlannerErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");
  const [draft, setDraft] = useState<PlannerState | null>(null);
  const [notice, setNotice] = useState("");
  const [savedFiles, setSavedFiles] = useState<string[]>([]);
  const attachments = useContactAttachments();
  const send = useServerFn(createGardenPlannerRequest);
  const { images } = useSiteImages();
  const heading = useRef<HTMLHeadingElement>(null);
  const formElement = useRef<HTMLFormElement>(null);
  const moving = useRef(false);
  const invalid = useRef(false);
  const sending = useRef(false);
  const uid = useId();
  const steps = plannerSteps(form);
  const index = Math.max(
    0,
    steps.findIndex((s) => s.id === active),
  );
  const step = steps[index];
  const trade = TRADES.find((t) => t.id === step.id);
  const pending = status === "sending";
  const summary = plannerSummary(form);
  const openPoints = plannerOpenPoints(form);
  const final = step.id === "review";
  const motion = useStepTransition(step.id);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        if (raw.length >= 50000) throw new Error("Invalid draft");
        const data = JSON.parse(raw);
        if (
          data.version === 1 &&
          Number.isFinite(data.savedAt) &&
          data.savedAt <= Date.now() &&
          Date.now() - data.savedAt < 7 * 24 * 60 * 60 * 1000
        ) {
          const parsed = plannerDraftSchema.safeParse(data.form);
          if (parsed.success) {
            const safe = privatePlannerDraft(parsed.data);
            setDraft(safe);
            localStorage.setItem(
              DRAFT_KEY,
              JSON.stringify({ version: 1, savedAt: data.savedAt, form: safe }),
            );
          } else {
            localStorage.removeItem(DRAFT_KEY);
          }
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* Storage is optional. */
      }
    }
  }, []);
  useEffect(() => {
    if (moving.current) {
      moving.current = false;
      heading.current?.focus({ preventScroll: true });
      scrollStepIntoView(heading.current, motion.reduced);
    }
    if (invalid.current) {
      invalid.current = false;
      const field = formElement.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [active, errors, status, motion.reduced]);

  function change<K extends keyof PlannerState>(key: K, value: PlannerState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors({});
    if (status === "error") setStatus("idle");
  }
  function answer(group: string, key: string, value: string) {
    if (group === "site" || group === "frame") change(group, { ...form[group], [key]: value });
    else change("details", { ...form.details, [group]: { ...form.details[group], [key]: value } });
  }
  function toggleService(id: string) {
    const services =
      id === "beratung"
        ? form.services.includes(id)
          ? []
          : [id]
        : form.services.includes(id)
          ? form.services.filter((s) => s !== id)
          : [...form.services.filter((s) => s !== "beratung"), id];
    change("services", services);
  }
  function go(id: string) {
    if (pending || id === step.id) return;
    motion.changeStep(
      () => {
        moving.current = true;
        setErrors({});
        setActive(id);
        setVisited((v) => (v.includes(id) ? v : [...v, id]));
        if (status === "error") setStatus("idle");
      },
      steps.findIndex((s) => s.id === id) > index ? 1 : -1,
    );
  }
  function keepDraft() {
    try {
      const safe = privatePlannerDraft(form);
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ version: 1, savedAt: Date.now(), form: safe }),
      );
      setNotice(
        "Entwurf auf diesem Gerät gespeichert und 7 Tage wiederherstellbar. Abgelaufene Entwürfe werden beim nächsten Öffnen des Planers entfernt. Name, Kontaktdaten, Anschrift, Freitext, Termindetails und Anhänge werden nicht mitgespeichert.",
      );
    } catch {
      setNotice(
        "Der Browser erlaubt das Speichern gerade nicht. Sie können die Planung trotzdem fortsetzen.",
      );
    }
  }
  function removeDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* Optional storage. */
    }
    setDraft(null);
  }
  function download() {
    const blob = new Blob(
      [
        plannerText(
          form,
          status === "success" ? savedFiles : attachments.items.map((i) => i.file.name),
        ),
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Loni-Galabau-Projektuebersicht.txt";
    a.hidden = true;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function next(event: FormEvent) {
    event.preventDefault();
    if (sending.current || motion.isMoving.current) return;
    const check = final ? steps : [step];
    for (const s of check) {
      const found = validatePlannerStep(form, s.id);
      if (Object.keys(found).length) {
        invalid.current = true;
        moving.current = s.id !== step.id;
        setActive(s.id);
        setErrors(found);
        return;
      }
    }
    if (!final) {
      go(steps[index + 1].id);
      return;
    }
    sending.current = true;
    setStatus("sending");
    try {
      const files = await attachments.serialize();
      await send({ data: { plan: form, attachments: files } });
      setSavedFiles(attachments.items.map((i) => i.file.name));
      attachments.clear();
      removeDraft();
      moving.current = true;
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
    }
  }
  const fieldProps = (key: string) => ({
    id: uid + "-" + key,
    "data-field": key,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? uid + "-" + key + "-error" : undefined,
  });
  const renderQuestion = (q: Question, group: string, helper = false) => (
    <QuestionField
      key={group + "-" + q.id}
      question={q}
      value={
        (group === "site" ? form.site : group === "frame" ? form.frame : form.details[group] || {})[
          q.id
        ] || ""
      }
      onChange={(v) => answer(group, q.id, v)}
      error={errors[group + "." + q.id]}
      fieldKey={group + "." + q.id}
      helper={helper}
    />
  );
  const nameFor = (id: string) => stepLabels[id] || TRADES.find((t) => t.id === id)?.title || id;

  return (
    <div className="site-ui garden-planner">
      <header className="planner-header">
        <Link to="/" aria-label="Zur Loni-Galabau-Website">
          <img src={images.logo} alt="Loni Galabau" width={180} height={40} />
        </Link>
        <Link to="/" className="planner-exit">
          <X aria-hidden="true" className="size-4" />
          <span>Zur Website</span>
        </Link>
      </header>
      <div className="planner-layout">
        <aside className="planner-sidebar">
          <div className="planner-sidebar-photo">
            <img src={images.hero_bg} alt="" />
            <div>
              <span className="planner-eyebrow">Ihr Garten. Ihr Plan.</span>
              <p>
                Schritt für Schritt
                <br />
                zur passenden Lösung.
              </p>
            </div>
          </div>
          <nav aria-label="Planungsschritte" className="planner-step-list">
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                disabled={pending || status === "success" || !visited.includes(s.id)}
                aria-current={step.id === s.id ? "step" : undefined}
              >
                <span>
                  {i < index ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                {nameFor(s.id)}
              </button>
            ))}
          </nav>
          <p className="planner-sidebar-note">
            Sie müssen noch nicht alles wissen. Offene Fragen gehören zu einer guten Planung.
          </p>
        </aside>
        <main className="planner-main">
          {status === "success" ? (
            <section className="planner-success">
              <CheckCircle2 className="size-12 text-brand" aria-hidden="true" />
              <span className="planner-eyebrow mt-6">Vielen Dank für Ihre Planung</span>
              <h1 ref={heading} tabIndex={-1}>
                Ihr Projekt ist bei uns angekommen.
              </h1>
              <p>
                Wir sehen uns Ihre Wünsche, Maße und Anhänge an und melden uns persönlich bei Ihnen.
                Gemeinsam klären wir die offenen Punkte und einen möglichen Vor-Ort-Termin.
              </p>
              <ol className="planner-next">
                <li>
                  <span>01</span>Projekt und Unterlagen prüfen
                </li>
                <li>
                  <span>02</span>Details und Aufmaß abstimmen
                </li>
                <li>
                  <span>03</span>Individuelles Angebot ausarbeiten
                </li>
              </ol>
              <button type="button" onClick={download} className="planner-primary">
                <Download className="size-4" aria-hidden="true" />
                Projektübersicht als Text speichern
              </button>
              <Link to="/" className="planner-text-button mt-5 inline-flex">
                Zur Website <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </section>
          ) : (
            <>
              <div className="planner-mobile-progress">
                <span>
                  Schritt {index + 1} von {steps.length}
                </span>
                <span>{nameFor(step.id)}</span>
              </div>
              <Progress
                value={((index + 1) / steps.length) * 100}
                aria-label={"Planungsschritt " + (index + 1) + " von " + steps.length}
                className="mb-8 h-1.5 bg-brand/10"
              />
              <div ref={motion.frameRef} className="step-motion-frame">
                <div ref={motion.panelRef} className="step-motion-panel">
                  <div className="planner-title">
                    <span className="planner-eyebrow">
                      {trade ? "Die Details machen den Unterschied" : "Gartenplaner"}
                    </span>
                    <h1 ref={heading} tabIndex={-1}>
                      {step.title}
                    </h1>
                    <p>{step.intro}</p>
                  </div>
                  {draft && step.id === "project" && (
                    <div className="planner-notice">
                      <p>
                        Auf diesem Gerät liegt ein gespeicherter Entwurf. Kontaktdaten und Anhänge
                        bitte erneut ergänzen.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-4">
                        <button
                          type="button"
                          className="planner-text-button"
                          onClick={() => {
                            setForm({ ...draft, name: "", email: "", phone: "", consent: false });
                            setDraft(null);
                            setNotice(
                              "Entwurf geladen. Bitte prüfen Sie Ihre Angaben und wählen Sie Anhänge erneut aus.",
                            );
                          }}
                        >
                          Entwurf fortsetzen
                        </button>
                        <button type="button" className="planner-text-button" onClick={removeDraft}>
                          Entwurf verwerfen
                        </button>
                      </div>
                    </div>
                  )}
                  <form
                    ref={formElement}
                    onSubmit={next}
                    noValidate
                    aria-label="Gartenprojekt planen"
                    aria-busy={pending}
                  >
                    <fieldset disabled={pending} className="min-w-0">
                      <legend className="sr-only">{step.title}</legend>
                      {!!Object.keys(errors).length && (
                        <div role="alert" className="planner-error-banner">
                          Bitte prüfen Sie die markierten Angaben. Unbekannte Maße können Sie
                          ausdrücklich offenlassen.
                        </div>
                      )}
                      {step.id === "project" && (
                        <div className="space-y-8">
                          <fieldset>
                            <legend className="planner-label">Für wen planen Sie?</legend>
                            <RadioGroup
                              aria-label="Art des Projekts"
                              value={form.clientType}
                              onValueChange={(v) => change("clientType", v)}
                              className="flex flex-wrap gap-3"
                              aria-invalid={!!errors.clientType}
                            >
                              {["Privat", "Gewerbe", "Verwaltung / Gemeinschaft"].map((v) => (
                                <label
                                  key={v}
                                  className="planner-choice"
                                  data-selected={form.clientType === v}
                                >
                                  <RadioGroupItem value={v} />
                                  {v}
                                </label>
                              ))}
                            </RadioGroup>
                            {errors.clientType && (
                              <p className="planner-error">{errors.clientType}</p>
                            )}
                          </fieldset>
                          <fieldset aria-invalid={!!errors.services} tabIndex={-1}>
                            <legend className="planner-label">
                              Welche Bereiche gehören zu Ihrem Projekt?
                            </legend>
                            <p className="planner-hint mb-4">
                              Mehrfachauswahl möglich. Für einen kompletten Garten können Sie
                              passende Einzelgewerke ergänzen.
                            </p>
                            <div className="planner-trades">
                              {TRADES.map((t) => (
                                <label
                                  key={t.id}
                                  className="planner-trade"
                                  data-selected={form.services.includes(t.id)}
                                >
                                  <Checkbox
                                    checked={form.services.includes(t.id)}
                                    onCheckedChange={() => toggleService(t.id)}
                                    aria-label={t.title}
                                  />
                                  <span>
                                    <strong>{t.title}</strong>
                                    <span>{t.description}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                            <label className="planner-orientation">
                              <Checkbox
                                checked={form.services.includes("beratung")}
                                onCheckedChange={() => toggleService("beratung")}
                                aria-label="Ich brauche Orientierung"
                              />
                              <span>
                                <strong>Ich brauche Orientierung</strong>
                                <span>Wir finden gemeinsam heraus, was zu Ihrem Garten passt.</span>
                              </span>
                            </label>
                            {errors.services && <p className="planner-error">{errors.services}</p>}
                          </fieldset>
                          <div className="planner-guidance">
                            <Sprout className="size-5 shrink-0" aria-hidden="true" />
                            <p>
                              Sie erhalten am Ende eine persönliche Projektübersicht. Ein
                              verbindliches Angebot erarbeiten wir nach Klärung von Maßen, Material
                              und Ausführung.
                            </p>
                          </div>
                        </div>
                      )}
                      {trade && (
                        <div className="space-y-8">
                          <div className="planner-guidance">
                            <Lightbulb className="size-5 shrink-0" aria-hidden="true" />
                            <p>{trade.tip}</p>
                          </div>
                          <div className="planner-question-grid">
                            {visibleQuestions(trade, form.details[trade.id] || {}).map((q, i) =>
                              renderQuestion(
                                q,
                                trade.id,
                                i === 0 || q.id === "area" || q.id === "volume",
                              ),
                            )}
                          </div>
                        </div>
                      )}
                      {step.id === "site" && (
                        <div className="space-y-8">
                          <div className="planner-question-grid">
                            <Field
                              label="Postleitzahl des Projekts *"
                              htmlFor={uid + "-zip"}
                              error={errors.zip}
                            >
                              <input
                                {...fieldProps("zip")}
                                className={inputClass}
                                inputMode="numeric"
                                autoComplete="postal-code"
                                value={form.zip}
                                onChange={(e) => change("zip", e.target.value)}
                                maxLength={5}
                                placeholder="z. B. 65795"
                              />
                            </Field>
                            <Field label="Ort *" htmlFor={uid + "-city"} error={errors.city}>
                              <input
                                {...fieldProps("city")}
                                className={inputClass}
                                autoComplete="address-level2"
                                value={form.city}
                                onChange={(e) => change("city", e.target.value)}
                                maxLength={60}
                                placeholder="z. B. Hattersheim am Main"
                              />
                            </Field>
                          </div>
                          <Field
                            label="Straße & Hausnummer (optional)"
                            htmlFor={uid + "-street"}
                            error={errors.street}
                            hint="Hilfreich für eine Besichtigung; können Sie auch später ergänzen."
                          >
                            <input
                              {...fieldProps("street")}
                              className={inputClass}
                              autoComplete="street-address"
                              value={form.street}
                              onChange={(e) => change("street", e.target.value)}
                              maxLength={100}
                            />
                          </Field>
                          <div className="planner-question-grid">
                            {SITE_QUESTIONS.map((q) => renderQuestion(q, "site"))}
                          </div>
                        </div>
                      )}
                      {step.id === "frame" && (
                        <div className="space-y-8">
                          <div className="planner-question-grid">
                            {FRAME_QUESTIONS.map((q) => renderQuestion(q, "frame"))}
                          </div>
                          <Field
                            label="Gibt es einen festen Termin oder besondere Zeitfenster? (optional)"
                            htmlFor={uid + "-deadline"}
                            error={errors.deadline}
                          >
                            <input
                              {...fieldProps("deadline")}
                              className={inputClass}
                              value={form.deadline}
                              onChange={(e) => change("deadline", e.target.value)}
                              maxLength={80}
                              placeholder="z. B. vor dem Einzug; nur nachmittags erreichbar"
                            />
                          </Field>
                        </div>
                      )}
                      {step.id === "photos" && (
                        <div className="space-y-8">
                          <div className="planner-photo-guide">
                            <h2>Drei hilfreiche Blickwinkel</h2>
                            <ol>
                              <li>
                                <span>01</span>
                                <div>
                                  <strong>Die ganze Fläche</strong>
                                  <p>Ein Überblick vom Haus oder Gartenrand.</p>
                                </div>
                              </li>
                              <li>
                                <span>02</span>
                                <div>
                                  <strong>Zufahrt & Übergänge</strong>
                                  <p>Engste Stelle, Stufen und Anschlüsse ans Gebäude.</p>
                                </div>
                              </li>
                              <li>
                                <span>03</span>
                                <div>
                                  <strong>Details oder Wunschbild</strong>
                                  <p>Problemstellen, eine Skizze oder ein vorhandener Plan.</p>
                                </div>
                              </li>
                            </ol>
                          </div>
                          <ContactAttachments attachments={attachments} disabled={pending} />
                          <Field
                            label={
                              "Was sollten wir außerdem wissen?" +
                              (form.services.includes("beratung") ? " *" : " (optional)")
                            }
                            htmlFor={uid + "-notes"}
                            error={errors.notes}
                            hint="Zum Beispiel weitere Nutzungen, Materialien, Pflanzen, Dinge zum Erhalten oder besondere Anforderungen."
                          >
                            <textarea
                              {...fieldProps("notes")}
                              className={inputClass + " min-h-36 resize-y"}
                              value={form.notes}
                              onChange={(e) => change("notes", e.target.value)}
                              maxLength={600}
                              rows={5}
                            />
                            <p className="mt-2 text-right text-xs text-brand/60">
                              {form.notes.length} / 600
                            </p>
                          </Field>
                        </div>
                      )}
                      {final && (
                        <div className="space-y-8">
                          <section className="planner-summary" aria-label="Projektübersicht">
                            {summary.map((section) => (
                              <details key={section.id} open={section.id === "project"}>
                                <summary>
                                  {section.title}
                                  <ChevronDown className="size-4" aria-hidden="true" />
                                </summary>
                                <dl>
                                  {section.rows.map(([label, value]) => (
                                    <div key={label}>
                                      <dt>{label}</dt>
                                      <dd>{value}</dd>
                                    </div>
                                  ))}
                                </dl>
                                <button
                                  type="button"
                                  className="planner-text-button mt-4"
                                  onClick={() => go(section.id)}
                                >
                                  {section.title} bearbeiten{" "}
                                  <ArrowRight className="size-4" aria-hidden="true" />
                                </button>
                              </details>
                            ))}
                            <div className="planner-summary-files">
                              <strong>Anhänge ({attachments.items.length})</strong>
                              <p>
                                {attachments.items.map((i) => i.file.name).join(", ") ||
                                  "Keine Anhänge ausgewählt"}
                              </p>
                              <button
                                type="button"
                                className="planner-text-button mt-3"
                                onClick={() => go("photos")}
                              >
                                Anhänge bearbeiten
                              </button>
                            </div>
                          </section>
                          <div className="planner-guidance block!">
                            <h2 className="font-semibold">
                              {openPoints.length
                                ? "Das klären wir gemeinsam"
                                : "Gut vorbereitet für das erste Gespräch"}
                            </h2>
                            {openPoints.length ? (
                              <>
                                <p className="mt-2">
                                  Offene Angaben sind kein Hindernis. Wir berücksichtigen sie bei
                                  unserer Rückmeldung.
                                </p>
                                <ul className="mt-3 list-disc space-y-1 pl-5">
                                  {openPoints.slice(0, 6).map((p) => (
                                    <li key={p}>{p}</li>
                                  ))}
                                </ul>
                                {openPoints.length > 6 && (
                                  <p className="mt-2">
                                    Weitere {openPoints.length - 6} offene Angaben stehen in Ihrer
                                    Übersicht.
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="mt-2">
                                Im nächsten Schritt prüfen wir die Ausführung und ob ein Aufmaß vor
                                Ort nötig ist.
                              </p>
                            )}
                          </div>
                          <div className="planner-question-grid">
                            <Field label="Name *" htmlFor={uid + "-name"} error={errors.name}>
                              <input
                                {...fieldProps("name")}
                                className={inputClass}
                                autoComplete="name"
                                value={form.name}
                                onChange={(e) => change("name", e.target.value)}
                                maxLength={200}
                              />
                            </Field>
                            <Field label="E-Mail *" htmlFor={uid + "-email"} error={errors.email}>
                              <input
                                {...fieldProps("email")}
                                type="email"
                                className={inputClass}
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => change("email", e.target.value)}
                                maxLength={320}
                              />
                            </Field>
                            <Field
                              label="Bevorzugter Kontakt"
                              htmlFor={uid + "-channel"}
                              error={errors.channel}
                            >
                              <div className="planner-select">
                                <select
                                  {...fieldProps("channel")}
                                  className={inputClass}
                                  value={form.channel}
                                  onChange={(e) => change("channel", e.target.value)}
                                >
                                  <option>E-Mail</option>
                                  <option>Telefon</option>
                                </select>
                                <ChevronDown aria-hidden="true" />
                              </div>
                            </Field>
                            <Field
                              label={
                                "Telefon" + (form.channel === "Telefon" ? " *" : " (optional)")
                              }
                              htmlFor={uid + "-phone"}
                              error={errors.phone}
                            >
                              <input
                                {...fieldProps("phone")}
                                type="tel"
                                className={inputClass}
                                autoComplete="tel"
                                value={form.phone}
                                onChange={(e) => change("phone", e.target.value)}
                                maxLength={50}
                              />
                            </Field>
                          </div>
                          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                            <Checkbox
                              {...fieldProps("consent")}
                              checked={form.consent}
                              onCheckedChange={(v) => change("consent", v === true)}
                              className="mt-1 shrink-0"
                            />
                            <span>
                              Ich habe die{" "}
                              <Link
                                to="/datenschutz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-4"
                              >
                                Datenschutzhinweise
                              </Link>{" "}
                              gelesen und zur Kenntnis genommen. *
                            </span>
                          </label>
                          {errors.consent && (
                            <p id={uid + "-consent-error"} className="planner-error">
                              {errors.consent}
                            </p>
                          )}
                          <button type="button" onClick={download} className="planner-text-button">
                            <Download className="size-4" aria-hidden="true" />
                            Projektübersicht als Text speichern
                          </button>
                        </div>
                      )}
                      {status === "error" && (
                        <div role="alert" className="planner-error-banner mt-6">
                          Ihre Anfrage konnte gerade nicht gesendet werden. Ihre Angaben und Anhänge
                          bleiben erhalten. Bitte versuchen Sie es erneut oder rufen Sie uns unter
                          06190 9266134 an.
                        </div>
                      )}
                      <div className="planner-actions">
                        {index > 0 ? (
                          <button
                            type="button"
                            onClick={() => go(steps[index - 1].id)}
                            className="planner-back"
                          >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Zurück
                          </button>
                        ) : (
                          <span className="hidden text-sm text-brand/60 sm:block">
                            Kostenlos & unverbindlich
                          </span>
                        )}
                        <button type="submit" className="planner-primary">
                          {pending ? (
                            <>
                              <Loader2
                                className="size-4 animate-spin motion-reduce:animate-none"
                                aria-hidden="true"
                              />
                              Wird gesendet …
                            </>
                          ) : (
                            <>
                              {final ? "Projektanfrage senden" : "Weiter"}
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
              <div className="planner-draft-actions">
                <button
                  type="button"
                  onClick={keepDraft}
                  disabled={pending}
                  className="planner-text-button"
                >
                  <Save className="size-4" aria-hidden="true" />
                  Entwurf auf diesem Gerät speichern
                </button>
                <p>Freiwillig. Ohne Kontaktdaten und Anhänge.</p>
              </div>
              {notice && (
                <p role="status" className="planner-notice mt-4">
                  {notice}
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
