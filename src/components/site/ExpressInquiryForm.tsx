import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";
import { createExpressInquiry } from "@/lib/site.functions";
import { EXPRESS_SERVICES, expressInquirySchema, validateExpressStep } from "@/lib/express-inquiry";
import { scrollStepIntoView, useStepTransition } from "@/hooks/useStepTransition";
import { useContactAttachments } from "@/hooks/useContactAttachments";
import { ContactAttachments } from "./ContactAttachments";
import { DiscoverySourceField } from "./DiscoverySourceField";
import "./CallbackForm.css";

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  service: "",
  address: "",
  description: "",
  privacy: false,
  website: "",
  discoverySource: "",
};
type Form = typeof emptyForm;
type Errors = Partial<Record<keyof Form, string>>;
const steps = [
  {
    label: "Kontakt",
    title: "Wie erreichen wir Sie?",
    hint: "Damit wir Ihr Vorhaben persönlich besprechen können.",
  },
  {
    label: "Projekt",
    title: "Was haben Sie vor?",
    hint: "Eine kurze Beschreibung reicht für den ersten Schritt.",
  },
  {
    label: "Anhänge",
    title: "Zeigen Sie uns Ihre Idee.",
    hint: "Fotos, Skizzen oder Pläne helfen uns. Auch ohne Anhänge können Sie anfragen.",
  },
];

export function ExpressInquiryForm({
  variant = "default",
  heading = "Express-Anfrage",
  initialService = "",
  descriptionPlaceholder,
}: {
  variant?: "default" | "compact";
  heading?: string;
  initialService?: (typeof EXPRESS_SERVICES)[number] | "";
  descriptionPlaceholder?: string;
} = {}) {
  const compact = variant === "compact";
  const send = useServerFn(createExpressInquiry);
  const attachments = useContactAttachments();
  const uid = useId();
  const [form, setForm] = useState({ ...emptyForm, service: initialService as string });
  const [step, setStep] = useState(0);
  const motion = useStepTransition(step);
  const navigating = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [failure, setFailure] = useState("");
  const submitting = useRef(false);
  const focusError = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const id = (key: string) => `${uid}-${key}`;

  useEffect(() => {
    if (!focusError.current) return;
    focusError.current = false;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);
  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus({ preventScroll: true });
      scrollStepIntoView(successRef.current, motion.reduced);
    }
  }, [status, motion.reduced]);
  useEffect(() => {
    if (!navigating.current) return;
    navigating.current = false;
    headingRef.current?.focus({ preventScroll: true });
    scrollStepIntoView(headingRef.current, motion.reduced);
  }, [step, motion.reduced]);

  function go(next: number, nextErrors: Errors = {}) {
    if (submitting.current || motion.isMoving.current || next === step) return;
    motion.changeStep(
      () => {
        navigating.current = true;
        setErrors(nextErrors);
        setStatus("idle");
        setStep(next);
      },
      next > step ? 1 : -1,
    );
  }

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "error") setStatus("idle");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || motion.isMoving.current) return;
    const parsed =
      step === 2 ? expressInquirySchema.safeParse(form) : validateExpressStep(form, step);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Form] ??= issue.message;
      const invalidStep = ["firstName", "lastName", "phone", "email"].some(
        (key) => next[key as keyof Form],
      )
        ? 0
        : ["service", "address", "description"].some((key) => next[key as keyof Form])
          ? 1
          : 2;
      if (invalidStep !== step) go(invalidStep, next);
      else {
        focusError.current = true;
        setErrors(next);
      }
      return;
    }
    if (step < 2) {
      go(step + 1);
      return;
    }
    submitting.current = true;
    setStatus("pending");
    setErrors({});
    try {
      await send({
        data: { ...expressInquirySchema.parse(form), attachments: await attachments.serialize() },
      });
      attachments.clear();
      setStatus("success");
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : "Bitte versuchen Sie es erneut oder rufen Sie uns an.",
      );
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  const field = (key: keyof Form) => ({
    id: id(key),
    name: key,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? id(`${key}-error`) : undefined,
  });
  const error = (key: keyof Form) =>
    errors[key] ? (
      <span id={id(`${key}-error`)} className="callback-error">
        {errors[key]}
      </span>
    ) : null;
  const pending = status === "pending";

  return (
    <section
      id="express-anfrage"
      className={`callback-section express-section${compact ? " callback-section--compact" : ""}`}
      aria-labelledby={id("title")}
    >
      <span id="rueckruf" className="express-legacy-anchor" aria-hidden="true" />
      <div className="callback-card">
        {compact ? (
          <div className="callback-compact-intro">
            <span className="callback-icon">
              <Send aria-hidden="true" size={20} />
            </span>
            <div>
              <h2 id={id("title")}>{heading}</h2>
              <p>Ihr Projekt. Persönlich besprochen.</p>
            </div>
          </div>
        ) : (
          <div className="callback-intro">
            <span className="callback-icon">
              <Send aria-hidden="true" size={23} />
            </span>
            <div>
              <span className="express-kicker">Express-Anfrage</span>
              <h2 id={id("title")}>
                Ihre Idee.
                <br />
                <span>Ein guter Anfang.</span>
              </h2>
              <p>Erzählen Sie uns kurz von Ihrem Projekt. Wir melden uns persönlich bei Ihnen.</p>
              <span className="express-intro-note">Unverbindlich · in drei Schritten</span>
            </div>
          </div>
        )}
        {status === "success" ? (
          <div className="callback-success" role="status">
            <span className="callback-success-icon">
              <Check aria-hidden="true" size={30} />
            </span>
            <h3 ref={successRef} tabIndex={-1}>
              Ihre Express-Anfrage ist angekommen.
            </h3>
            <p>Wir schauen uns Ihr Vorhaben an und melden uns persönlich bei Ihnen.</p>
            <p>
              Die Eingangsbestätigung mit Ihrer Ticketnummer senden wir an{" "}
              <strong className="express-email">{form.email}</strong>.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="callback-form"
            aria-label="Express-Anfrage"
          >
            <fieldset disabled={pending}>
              <legend className="sr-only">Kontaktdaten, Projekt und Anhänge</legend>
              <ol className="callback-steps" aria-label="Schritte der Express-Anfrage">
                {steps.map((item, index) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      disabled={index >= step}
                      aria-current={index === step ? "step" : undefined}
                      data-complete={index < step}
                      onClick={() => go(index)}
                    >
                      <span>
                        {index < step ? <Check size={14} aria-hidden="true" /> : `0${index + 1}`}
                      </span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ol>
              <div
                className="callback-progress"
                role="progressbar"
                aria-label="Fortschritt"
                aria-valuemin={0}
                aria-valuemax={3}
                aria-valuenow={step + 1}
              >
                <span style={{ transform: `scaleX(${(step + 1) / 3})` }} />
              </div>
              <div ref={motion.frameRef} className="callback-motion-frame">
                <div ref={motion.panelRef} className="callback-motion-panel">
                  <div className="callback-step-heading">
                    <h3 ref={headingRef} tabIndex={-1}>
                      {steps[step].title}
                    </h3>
                    <p>{steps[step].hint}</p>
                  </div>
                  <div className="callback-fields">
                    {step === 0 && (
                      <>
                        <div className="callback-field">
                          <label htmlFor={id("firstName")}>Vorname</label>
                          <input
                            {...field("firstName")}
                            autoComplete="given-name"
                            maxLength={90}
                            required
                            placeholder="Ihr Vorname"
                            value={form.firstName}
                            onChange={(e) => update("firstName", e.target.value)}
                          />
                          {error("firstName")}
                        </div>
                        <div className="callback-field">
                          <label htmlFor={id("lastName")}>Nachname</label>
                          <input
                            {...field("lastName")}
                            autoComplete="family-name"
                            maxLength={90}
                            required
                            placeholder="Ihr Nachname"
                            value={form.lastName}
                            onChange={(e) => update("lastName", e.target.value)}
                          />
                          {error("lastName")}
                        </div>
                        <div className="callback-field">
                          <label htmlFor={id("phone")}>Telefonnummer</label>
                          <input
                            {...field("phone")}
                            type="tel"
                            autoComplete="tel"
                            inputMode="tel"
                            maxLength={50}
                            required
                            placeholder="z. B. 0176 12345678"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                          />
                          {error("phone")}
                        </div>
                        <div className="callback-field">
                          <label htmlFor={id("email")}>E-Mail</label>
                          <input
                            {...field("email")}
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            maxLength={320}
                            required
                            placeholder="Für Ihre Eingangsbestätigung"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                          />
                          {error("email")}
                        </div>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <div className="callback-field express-full">
                          <label htmlFor={id("service")}>Gewünschte Leistung</label>
                          <select
                            {...field("service")}
                            required
                            value={form.service}
                            onChange={(e) => update("service", e.target.value)}
                          >
                            <option value="">Bitte auswählen</option>
                            {EXPRESS_SERVICES.map((service) => (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            ))}
                          </select>
                          {error("service")}
                        </div>
                        <div className="callback-field express-full">
                          <label htmlFor={id("description")}>Was soll gemacht werden?</label>
                          <textarea
                            {...field("description")}
                            required
                            rows={3}
                            maxLength={3000}
                            placeholder={
                              descriptionPlaceholder ??
                              "Zum Beispiel: Wir möchten unsere Terrasse neu pflastern lassen, etwa 30 m² …"
                            }
                            value={form.description}
                            onChange={(e) => update("description", e.target.value)}
                          />
                          {error("description")}
                        </div>
                        <div className="callback-field express-full">
                          <label htmlFor={id("address")}>
                            Adresse für das Angebot <span>optional</span>
                          </label>
                          <input
                            {...field("address")}
                            maxLength={300}
                            autoComplete="off"
                            placeholder="Straße, Hausnummer, PLZ und Ort"
                            value={form.address}
                            onChange={(e) => update("address", e.target.value)}
                          />
                          {error("address")}
                        </div>
                      </>
                    )}
                  </div>
                  {step === 2 && (
                    <>
                      <div className="express-attachments">
                        <ContactAttachments attachments={attachments} disabled={pending} />
                        <DiscoverySourceField
                          value={form.discoverySource}
                          onChange={(value) => update("discoverySource", value)}
                          disabled={pending}
                        />
                      </div>
                      <details className="express-review">
                        <summary>Ihre Angaben prüfen</summary>
                        <dl>
                          <div>
                            <dt>Kontakt</dt>
                            <dd>
                              {form.firstName} {form.lastName}
                              <br />
                              {form.phone}
                              <br />
                              {form.email}
                            </dd>
                          </div>
                          <div>
                            <dt>Leistung</dt>
                            <dd>{form.service}</dd>
                          </div>
                          {form.address && (
                            <div>
                              <dt>Adresse</dt>
                              <dd>{form.address}</dd>
                            </div>
                          )}
                          <div>
                            <dt>Vorhaben</dt>
                            <dd>{form.description}</dd>
                          </div>
                        </dl>
                        <button type="button" onClick={() => go(0)}>
                          Angaben bearbeiten <ArrowLeft size={14} aria-hidden="true" />
                        </button>
                      </details>
                      <div className="callback-consent-wrap">
                        <label className="callback-consent">
                          <input
                            {...field("privacy")}
                            type="checkbox"
                            checked={form.privacy}
                            required
                            onChange={(e) => update("privacy", e.target.checked)}
                          />
                          <span>
                            Ich habe die{" "}
                            <a href="/datenschutz" target="_blank" rel="noopener noreferrer">
                              Datenschutzhinweise
                            </a>{" "}
                            gelesen und bitte um Kontakt zu meiner Anfrage.
                          </span>
                        </label>
                        {error("privacy")}
                      </div>
                    </>
                  )}
                  <div className="callback-honey" aria-hidden="true">
                    <label htmlFor={id("website")}>Website</label>
                    <input
                      id={id("website")}
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </div>
                  <div className="callback-bottom">
                    {step > 0 ? (
                      <button type="button" className="callback-back" onClick={() => go(step - 1)}>
                        <ArrowLeft size={16} aria-hidden="true" />
                        Zurück
                      </button>
                    ) : (
                      <span className="callback-small-note">Persönlich & unverbindlich.</span>
                    )}
                    <button type="submit" className="callback-submit">
                      {pending ? (
                        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      ) : step === 2 ? (
                        <Send size={18} aria-hidden="true" />
                      ) : null}
                      {pending ? "Wird gesendet …" : step === 2 ? "Anfrage senden" : "Weiter"}
                      {step < 2 && <ArrowRight size={18} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              </div>
            </fieldset>
            {status === "error" && (
              <p role="alert" className="callback-failure">
                {failure} <a href="tel:+4961909266134">06190 9266134</a>
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
