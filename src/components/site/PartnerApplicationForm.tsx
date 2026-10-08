import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, Loader2, Upload, X } from "lucide-react";
import { createPartnerApplication } from "@/lib/site.functions";
import {
  PARTNER_TRADES,
  berlinToday,
  partnerAvailability,
  validatePartnerStep,
} from "@/lib/partner-application";
import { validateApplicationDocument } from "@/lib/application-document";
import { useStepTransition, scrollStepIntoView } from "@/hooks/useStepTransition";

const initial = {
  company_name: "",
  legal_form: "",
  street: "",
  postal_code: "",
  city: "",
  country: "DE" as const,
  name: "",
  email: "",
  phone: "",
  trades: [] as string[],
  other_trade: "",
  service_area: "",
  workforce: "employees" as "employees" | "solo",
  team_size: 1,
  availability: "nach_absprache" as "sofort" | "nach_absprache" | "ab_datum",
  available_from: "",
  uses_subcontractors: false,
  message: "",
  certificate_valid_until: "",
  vat_certificate_valid_until: "",
  privacy: false,
  website: "",
};
type Form = typeof initial;
type Errors = Partial<Record<keyof Form | "document" | "vat_document", string>>;
const steps = ["Betrieb", "Leistung", "Nachweise"];
const titles = ["Ihr Betrieb. Ihr Kontakt.", "Was bringen Sie mit?", "Ihre Nachweise."];
const hints = [
  "Firmensitz Deutschland. Bitte gültige Nachweise nach § 48b EStG und § 13b UStG als PDF bereithalten. * Pflichtfelder.",
  "Ihre Leistungen und freien Kapazitäten – damit wir gezielt anknüpfen können.",
  "Zwei gültige Nachweise Ihres Betriebs. Jeweils eine PDF, maximal 10 MB.",
];
export function PartnerApplicationForm() {
  const send = useServerFn(createPartnerApplication);
  const uid = useId();
  const id = (key: string) => `${uid}-${key}`;
  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ document: File | null; vat_document: File | null }>({
    document: null,
    vat_document: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "error" | "success">("idle");
  const [failure, setFailure] = useState("");
  const [ticket, setTicket] = useState("");
  const [today, setToday] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const motion = useStepTransition(step);
  const heading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const focusError = useRef(false);
  const navigating = useRef(false);
  const submitting = useRef(false);
  const token = useRef<string | null>(null);
  useEffect(() => {
    setToday(berlinToday());
    const timer = window.setInterval(() => setToday(berlinToday()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (focusError.current) {
      const field = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (field) {
        focusError.current = false;
        field.focus({ preventScroll: true });
        scrollStepIntoView(field, motion.reduced);
      }
    }
  }, [errors, step, motion.reduced]);
  useEffect(() => {
    if (navigating.current) {
      navigating.current = false;
      heading.current?.focus({ preventScroll: true });
      scrollStepIntoView(heading.current, motion.reduced);
    }
  }, [step, motion.reduced]);
  useEffect(() => {
    if (status === "success") {
      heading.current?.focus({ preventScroll: true });
      scrollStepIntoView(heading.current, motion.reduced);
    }
  }, [status, motion.reduced]);
  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "workforce" && value === "solo" ? { team_size: 1 } : {}),
      ...(key === "availability" && value !== "ab_datum" ? { available_from: "" } : {}),
      ...(key === "trades" && !(value as string[]).includes("Sonstige") ? { other_trade: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }
  function go(next: number) {
    if (submitting.current || motion.isMoving.current || step === next) return;
    motion.changeStep(
      () => {
        navigating.current = true;
        setErrors({});
        setStep(next);
      },
      next > step ? 1 : -1,
    );
  }
  function selectFile(key: "document" | "vat_document", selected: File[]) {
    if (status === "pending" || !selected.length) return;
    const problem =
      selected.length > 1
        ? "Bitte genau eine PDF-Datei auswählen."
        : validateApplicationDocument(selected[0]);
    setErrors((current) => ({ ...current, [key]: problem || undefined }));
    setFiles((current) => ({ ...current, [key]: problem ? null : selected[0] }));
  }
  const error = (key: keyof Errors) =>
    errors[key] ? (
      <span className="partner-error" id={id(`${key}-error`)} role="alert">
        {errors[key]}
      </span>
    ) : null;
  const attrs = (key: keyof Form) => ({
    id: id(key),
    name: key,
    "aria-required": key !== "message" && key !== "website",
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? id(`${key}-error`) : undefined,
  });
  function field(
    key: Extract<
      keyof Form,
      | "company_name"
      | "legal_form"
      | "street"
      | "postal_code"
      | "city"
      | "name"
      | "email"
      | "phone"
      | "other_trade"
      | "service_area"
      | "available_from"
      | "certificate_valid_until"
      | "vat_certificate_valid_until"
    >,
    label: string,
    autoComplete?: string,
    type = "text",
    wide = false,
  ) {
    return (
      <label className={wide ? "partner-wide" : undefined} htmlFor={id(key)}>
        {label} *
        <input
          {...attrs(key)}
          type={type}
          autoComplete={autoComplete}
          value={form[key]}
          min={type === "date" ? today : undefined}
          max={type === "date" ? "9999-12-31" : undefined}
          inputMode={key === "postal_code" ? "numeric" : undefined}
          maxLength={key === "postal_code" ? 5 : undefined}
          onChange={(e) => update(key, e.target.value)}
        />
        {error(key)}
      </label>
    );
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || motion.isMoving.current) return;
    const parsed = validatePartnerStep(form, step);
    const problems: Errors = {};
    if (!parsed.success)
      for (const issue of parsed.error.issues)
        problems[issue.path[0] as keyof Errors] ??= issue.message;
    if (step === 2) {
      for (const key of ["document", "vat_document"] as const) {
        const file = files[key];
        const problem = file
          ? validateApplicationDocument(file)
          : `Bitte den Nachweis ${key === "document" ? "nach § 48b EStG" : "nach § 13b UStG (USt 1 TG)"} als PDF auswählen.`;
        if (problem) problems[key] = problem;
      }
    }
    if (Object.keys(problems).length) {
      const first = Object.keys(problems)[0];
      const target = [
        "company_name",
        "legal_form",
        "street",
        "postal_code",
        "city",
        "name",
        "email",
        "phone",
        "country",
      ].includes(first)
        ? 0
        : [
              "trades",
              "other_trade",
              "service_area",
              "workforce",
              "team_size",
              "availability",
              "available_from",
              "uses_subcontractors",
              "message",
            ].includes(first)
          ? 1
          : 2;
      const reveal = () => {
        focusError.current = true;
        setErrors(problems);
        setStep(target);
      };
      if (target !== step) motion.changeStep(reveal, -1);
      else reveal();
      return;
    }
    if (step < 2) {
      go(step + 1);
      return;
    }
    submitting.current = true;
    setStatus("pending");
    setFailure("");
    try {
      token.current ??= crypto.randomUUID();
      const readFile = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = () =>
            reject(
              new Error("Die PDF konnte nicht gelesen werden. Bitte wählen Sie die Datei erneut."),
            );
          reader.readAsDataURL(file);
        });
      const [base64, vatBase64] = await Promise.all([
        readFile(files.document!),
        readFile(files.vat_document!),
      ]);
      const result = await send({
        data: {
          ...form,
          privacy: true,
          trades: form.trades as (typeof PARTNER_TRADES)[number][],
          request_token: token.current,
          document: { name: files.document!.name, contentType: "application/pdf", base64 },
          vat_document: {
            name: files.vat_document!.name,
            contentType: "application/pdf",
            base64: vatBase64,
          },
        },
      });
      setTicket(result.ticket);
      setStatus("success");
      setFiles({ document: null, vat_document: null });
    } catch (err) {
      setFailure(
        err instanceof Error
          ? err.message
          : "Die Bewerbung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      );
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }
  if (status === "success")
    return (
      <div className="partner-form partner-success" role="status">
        <CheckCircle2 size={48} />
        <p className="partner-eyebrow justify-center">Gut angekommen. Bei Loni.</p>
        <h2 ref={heading} tabIndex={-1}>
          Vielen Dank für Ihre Bewerbung.
        </h2>
        <p>
          Ihr Betrieb und Ihre Unterlagen sind bei uns eingegangen. Wir prüfen Ihre Angaben
          persönlich.
        </p>
        <span className="text-sm">Ihre Vorgangsnummer</span>
        <strong>{ticket}</strong>
        <p>
          Die Eingangsbestätigung senden wir an <b>{form.email}</b>. Bitte prüfen Sie auch Ihren
          Spamordner.
        </p>
        <p className="partner-form-foot">
          Eine Zusammenarbeit oder Beauftragung entsteht erst nach gesonderter Abstimmung.
        </p>
      </div>
    );
  return (
    <form
      className="partner-form"
      ref={formRef}
      noValidate
      onSubmit={submit}
      aria-label="Als Nachunternehmen bewerben"
    >
      <div className="partner-form-top">
        <span>Ihre Partnerbewerbung</span>
        <FileCheck2 size={21} />
      </div>
      <ol className="partner-steps" aria-label="Bewerbungsschritte">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            data-complete={index < step}
          >
            <b>{index < step ? "✓" : `0${index + 1}`}</b>
            {label}
          </li>
        ))}
      </ol>
      <div ref={motion.frameRef}>
        <div ref={motion.panelRef}>
          <h2 ref={heading} tabIndex={-1}>
            {titles[step]}
          </h2>
          <p className="partner-form-hint">{hints[step]}</p>
          <fieldset disabled={status === "pending"}>
            <legend className="sr-only">{steps[step]}</legend>
            {step === 0 && (
              <div className="partner-fields">
                {field("company_name", "Firmenname", "organization")}
                <label htmlFor={id("legal_form")}>
                  Rechtsform *
                  <select
                    {...attrs("legal_form")}
                    value={form.legal_form}
                    onChange={(e) => update("legal_form", e.target.value)}
                  >
                    <option value="">Bitte wählen</option>
                    {[
                      "Einzelunternehmen",
                      "GmbH",
                      "UG (haftungsbeschränkt)",
                      "GbR",
                      "GmbH & Co. KG",
                      "KG",
                      "OHG",
                      "AG",
                      "Sonstige",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                  {error("legal_form")}
                </label>
                {field("street", "Straße und Hausnummer", "street-address", "text", true)}
                {field("postal_code", "Postleitzahl", "postal-code")}
                {field("city", "Ort", "address-level2")}
                {field("name", "Ansprechpartner – Vor- und Nachname", "name", "text", true)}
                {field("email", "E-Mail", "email", "email")}
                {field("phone", "Telefon", "tel", "tel")}
              </div>
            )}
            {step === 1 && (
              <div className="partner-fields">
                <fieldset
                  className="partner-wide"
                  aria-describedby={errors.trades ? id("trades-error") : undefined}
                >
                  <legend className="partner-field-label mb-3">Ihre Leistungen *</legend>
                  <div className="partner-checks">
                    {PARTNER_TRADES.map((trade, i) => (
                      <label key={trade}>
                        <input
                          type="checkbox"
                          name="trades"
                          value={trade}
                          checked={form.trades.includes(trade)}
                          aria-invalid={i === 0 && !!errors.trades}
                          onChange={(e) =>
                            update(
                              "trades",
                              e.target.checked
                                ? [...form.trades, trade]
                                : form.trades.filter((t) => t !== trade),
                            )
                          }
                        />
                        {trade}
                      </label>
                    ))}
                  </div>
                  {error("trades")}
                </fieldset>
                {form.trades.includes("Sonstige") &&
                  field("other_trade", "Weitere Leistungen", undefined, "text", true)}
                {field("service_area", "Einsatzgebiet / Umkreis", undefined, "text", true)}
                <label htmlFor={id("workforce")}>
                  Betriebsstruktur *
                  <select
                    {...attrs("workforce")}
                    value={form.workforce}
                    onChange={(e) => update("workforce", e.target.value as Form["workforce"])}
                  >
                    <option value="employees">Mit Beschäftigten</option>
                    <option value="solo">Einpersonenbetrieb</option>
                  </select>
                  {error("workforce")}
                </label>
                <label htmlFor={id("team_size")}>
                  Verfügbare Personen *
                  <input
                    {...attrs("team_size")}
                    type="number"
                    min={1}
                    max={form.workforce === "solo" ? 1 : 10000}
                    value={Number.isNaN(form.team_size) ? "" : form.team_size}
                    onChange={(e) => update("team_size", e.target.valueAsNumber)}
                  />
                  {error("team_size")}
                </label>
                <label className="partner-wide" htmlFor={id("availability")}>
                  Verfügbarkeit *
                  <select
                    {...attrs("availability")}
                    value={form.availability}
                    onChange={(e) => update("availability", e.target.value as Form["availability"])}
                  >
                    <option value="nach_absprache">Nach Absprache</option>
                    <option value="sofort">Ab sofort</option>
                    <option value="ab_datum">Ab einem bestimmten Datum</option>
                  </select>
                  {error("availability")}
                </label>
                {form.availability === "ab_datum" &&
                  field("available_from", "Verfügbar ab", undefined, "date", true)}
                <label className="partner-wide" htmlFor={id("uses_subcontractors")}>
                  Weitere Nachunternehmen vorgesehen? *
                  <select
                    {...attrs("uses_subcontractors")}
                    value={String(form.uses_subcontractors)}
                    onChange={(e) => update("uses_subcontractors", e.target.value === "true")}
                  >
                    <option value="false">Nein, eigene Ausführung</option>
                    <option value="true">Ja, nach gemeinsamer Abstimmung</option>
                  </select>
                </label>
                <label className="partner-wide" htmlFor={id("message")}>
                  Was möchten Sie uns noch sagen? <span className="font-normal">(optional)</span>
                  <textarea
                    {...attrs("message")}
                    rows={3}
                    maxLength={3000}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Besondere Erfahrung, eigene Maschinen oder ein Referenzlink …"
                  />
                  {error("message")}
                </label>
              </div>
            )}
            {step === 2 && (
              <>
                {(
                  [
                    {
                      key: "document",
                      title: "Freistellungsbescheinigung § 48b EStG",
                      dateKey: "certificate_valid_until",
                      dateLabel: "§ 48b EStG gültig bis",
                    },
                    {
                      key: "vat_document",
                      title: "Nachweis § 13b UStG (USt 1 TG)",
                      dateKey: "vat_certificate_valid_until",
                      dateLabel: "§ 13b UStG gültig bis",
                    },
                  ] as const
                ).map(({ key, title, dateKey, dateLabel }) => (
                  <div key={key} className="mb-6">
                    <div
                      className="partner-upload"
                      style={dragging === key ? { outline: "2px solid #548745" } : undefined}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(key);
                      }}
                      onDragLeave={() => setDragging(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragging(null);
                        selectFile(key, Array.from(e.dataTransfer.files));
                      }}
                    >
                      <label htmlFor={id(key)}>
                        <Upload size={19} className="inline mr-2" />
                        {title} *
                      </label>
                      <p>Eine PDF, maximal 10 MB. Vertrauliche Übertragung beim Absenden.</p>
                      <input
                        id={id(key)}
                        name={key}
                        type="file"
                        aria-required="true"
                        accept=".pdf,application/pdf"
                        aria-invalid={!!errors[key]}
                        aria-describedby={errors[key] ? id(`${key}-error`) : undefined}
                        onChange={(e) => {
                          selectFile(key, Array.from(e.target.files ?? []));
                          e.target.value = "";
                        }}
                      />
                      {files[key] && (
                        <div className="mt-4 flex items-center gap-3 min-w-0">
                          <FileCheck2 className="shrink-0" size={21} />
                          <span className="text-sm break-all flex-1">
                            {files[key].name} ·{" "}
                            {(files[key].size / 1024 / 1024).toLocaleString("de-DE", {
                              maximumFractionDigits: 1,
                            })}{" "}
                            MB
                          </span>
                          <button
                            type="button"
                            aria-label={`${title} entfernen`}
                            className="p-3 shrink-0"
                            onClick={() => setFiles((current) => ({ ...current, [key]: null }))}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                      {error(key)}
                    </div>
                    <div className="partner-fields">
                      {field(dateKey, dateLabel, undefined, "date", true)}
                    </div>
                  </div>
                ))}
                <div className="partner-review">
                  <div className="flex justify-between gap-3 mb-3">
                    <strong>Ihre Angaben im Überblick</strong>
                    <button type="button" onClick={() => go(0)} className="underline">
                      Bearbeiten
                    </button>
                  </div>
                  <dl>
                    <dt>Betrieb</dt>
                    <dd>
                      {form.company_name} · {form.legal_form}
                    </dd>
                    <dt>Anschrift</dt>
                    <dd>
                      {form.street}, {form.postal_code} {form.city}
                    </dd>
                    <dt>Kontakt</dt>
                    <dd>
                      {form.name}
                      <br />
                      {form.email}
                      <br />
                      {form.phone}
                    </dd>
                    <dt>Leistungen</dt>
                    <dd>
                      {form.trades.join(", ")}
                      {form.other_trade ? ` · ${form.other_trade}` : ""}
                    </dd>
                    <dt>§ 48b EStG</dt>
                    <dd>
                      {files.document?.name || "Noch nicht ausgewählt"}
                      <br />
                      Gültig bis{" "}
                      {form.certificate_valid_until.split("-").reverse().join(".") || "–"}
                    </dd>
                    <dt>§ 13b UStG</dt>
                    <dd>
                      {files.vat_document?.name || "Noch nicht ausgewählt"}
                      <br />
                      Gültig bis{" "}
                      {form.vat_certificate_valid_until.split("-").reverse().join(".") || "–"}
                    </dd>
                    <dt>Einsatzgebiet</dt>
                    <dd>{form.service_area}</dd>
                    <dt>Kapazität</dt>
                    <dd>
                      {form.team_size} {form.team_size === 1 ? "Person" : "Personen"} ·{" "}
                      {form.workforce === "solo" ? "ohne Beschäftigte" : "mit Beschäftigten"}
                      <br />
                      {partnerAvailability(form)}
                    </dd>
                    <dt>Weitere Nachunternehmen</dt>
                    <dd>{form.uses_subcontractors ? "Ja, nach Abstimmung" : "Nein"}</dd>
                    {form.message && (
                      <>
                        <dt>Nachricht</dt>
                        <dd className="whitespace-pre-wrap">{form.message}</dd>
                      </>
                    )}
                  </dl>
                  <button type="button" className="mt-3 underline" onClick={() => go(1)}>
                    Leistungen und Kapazität bearbeiten
                  </button>
                </div>
                <label className="partner-consent" htmlFor={id("privacy")}>
                  <input
                    {...attrs("privacy")}
                    type="checkbox"
                    checked={form.privacy}
                    onChange={(e) => update("privacy", e.target.checked)}
                  />
                  <span>
                    Ich habe die{" "}
                    <a
                      href="/datenschutz#partneranfragen"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Datenschutzhinweise
                    </a>{" "}
                    zur Bearbeitung meiner Partnerbewerbung gelesen. *
                  </span>
                </label>
                {error("privacy")}
              </>
            )}
          </fieldset>
        </div>
      </div>
      <div className="partner-honeypot" aria-hidden="true">
        <label>
          Website
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>
      {failure && (
        <p className="partner-error mt-4" role="alert">
          {failure} Ihre Eingaben bleiben erhalten.
        </p>
      )}
      <div className="partner-form-actions">
        {step > 0 && (
          <button
            type="button"
            className="partner-back"
            disabled={status === "pending"}
            onClick={() => go(step - 1)}
            aria-label="Vorheriger Schritt"
          >
            <ArrowLeft size={18} />
            <span>Zurück</span>
          </button>
        )}
        <button type="submit" className="partner-primary" disabled={status === "pending"}>
          {status === "pending" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Wird gesendet …
            </>
          ) : (
            <>
              {step === 2
                ? "Bewerbung absenden"
                : step === 0
                  ? "Weiter zu Ihren Leistungen"
                  : "Weiter zu den Nachweisen"}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
      <p className="partner-form-foot">
        {step === 0
          ? "Für die Bewerbung benötigen wir beide Nachweise Ihres Betriebs: § 48b EStG und § 13b UStG (USt 1 TG), jeweils als PDF bis 10 MB."
          : step === 1
            ? "Weitere Unterlagen klären wir erst bei einer möglichen Zusammenarbeit."
            : "Wir prüfen Ihre Angaben persönlich. Die Bewerbung ist noch keine Beauftragung."}
      </p>
    </form>
  );
}
