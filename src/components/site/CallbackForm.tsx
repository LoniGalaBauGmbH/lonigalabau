import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Loader2, Phone } from "lucide-react";
import { createCallbackRequest } from "@/lib/site.functions";
import { scrollStepIntoView, useStepTransition } from "@/hooks/useStepTransition";
import {
  berlinClock,
  CALLBACK_TIMES,
  callbackDateError,
  callbackTimeError,
  formatCallbackDate,
  validateCallback,
  validateCallbackStep,
} from "@/lib/callback-request";
import "./CallbackForm.css";

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  privacy: false,
  website: "",
};
type Form = typeof emptyForm;
type Errors = Partial<Record<keyof Form, string>>;
const steps = [
  {
    label: "Name",
    title: "Wie dürfen wir Sie ansprechen?",
    hint: "Der erste Schritt zu Ihrem Gartenprojekt.",
  },
  {
    label: "Kontakt",
    title: "Wie erreichen wir Sie?",
    hint: "Mit E-Mail erhalten Sie auch eine Eingangsbestätigung.",
  },
  {
    label: "Wunschzeit",
    title: "Wann passt es Ihnen?",
    hint: "Mo–Fr · deutsche Zeit · mindestens 1 Stunde Vorlauf.",
  },
];

export function CallbackForm() {
  const send = useServerFn(createCallbackRequest);
  const uid = useId();
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(0);
  const motion = useStepTransition(step);
  const navigating = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [failure, setFailure] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const submitting = useRef(false);
  const focusError = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const id = (key: string) => `${uid}-${key}`;

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!focusError.current) return;
    focusError.current = false;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);
  useEffect(() => {
    if (status === "success") successRef.current?.focus({ preventScroll: true });
  }, [status]);
  useEffect(() => {
    if (!navigating.current) return;
    navigating.current = false;
    headingRef.current?.focus({ preventScroll: true });
    scrollStepIntoView(headingRef.current, motion.reduced);
  }, [step, motion.reduced]);

  function go(next: number) {
    if (submitting.current || motion.isMoving.current || next === step) return;
    motion.changeStep(
      () => {
        navigating.current = true;
        setErrors({});
        setStatus("idle");
        setStep(next);
      },
      next > step ? 1 : -1,
    );
  }

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value, ...(key === "date" ? { time: "" } : {}) }));
    setErrors((current) => ({
      ...current,
      [key]: key === "date" && value ? callbackDateError(String(value)) : undefined,
      ...(key === "date" ? { time: undefined } : {}),
    }));
    if (status === "error") setStatus("idle");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || motion.isMoving.current) return;
    const parsed = validateCallbackStep(form, step);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Form] ??= issue.message;
      focusError.current = true;
      setErrors(next);
      return;
    }
    if (step < 2) {
      go(step + 1);
      return;
    }
    const complete = validateCallback(form);
    if (!complete.success) return;
    submitting.current = true;
    setStatus("pending");
    setErrors({});
    try {
      await send({ data: complete.data });
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
    <section id="rueckruf" className="callback-section" aria-labelledby={id("title")}>
      <div className="callback-card">
        <div className="callback-intro">
          <span className="callback-icon">
            <Phone aria-hidden="true" size={23} />
          </span>
          <div>
            <h2 id={id("title")}>
              Ein Gespräch.
              <br />
              <span>Ein guter Anfang.</span>
            </h2>
            <p>Wir rufen Sie zurück. Persönlich und unverbindlich.</p>
          </div>
        </div>
        {status === "success" ? (
          <div className="callback-success" role="status">
            <span className="callback-success-icon">
              <Check aria-hidden="true" size={30} />
            </span>
            <h3 ref={successRef} tabIndex={-1}>
              Ihr Rückrufwunsch ist angekommen.
            </h3>
            <p>Wir versuchen, Sie zum gewünschten Zeitpunkt zu erreichen.</p>
            <div className="callback-summary">
              <CalendarDays aria-hidden="true" size={20} />
              <span>
                {formatCallbackDate(form.date)}
                <br />
                <strong>{form.time} Uhr · deutsche Zeit</strong>
              </span>
            </div>
            {form.email && <p>Sie erhalten zusätzlich eine Eingangsbestätigung per E-Mail.</p>}
            <p className="callback-note">Der Wunschzeitpunkt ist noch kein bestätigter Termin.</p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="callback-form"
            aria-label="Rückruf anfragen"
          >
            <fieldset disabled={pending}>
              <legend className="sr-only">Kontaktdaten und gewünschter Rückrufzeitpunkt</legend>
              <ol className="callback-steps" aria-label="Schritte der Rückrufanfrage">
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
                      </>
                    )}
                    {step === 1 && (
                      <>
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
                          <label htmlFor={id("email")}>
                            E-Mail <span>optional</span>
                          </label>
                          <input
                            {...field("email")}
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            maxLength={320}
                            placeholder="Für Ihre Eingangsbestätigung"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                          />
                          {error("email")}
                        </div>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <div className="callback-field">
                          <label htmlFor={id("date")}>Wunschdatum</label>
                          <input
                            {...field("date")}
                            type="date"
                            min={now ? berlinClock(now).date : undefined}
                            required
                            value={form.date}
                            onChange={(e) => update("date", e.target.value)}
                          />
                          {error("date")}
                        </div>
                        <div className="callback-field">
                          <label htmlFor={id("time")}>Wunschuhrzeit</label>
                          <select
                            {...field("time")}
                            required
                            value={form.time}
                            onChange={(e) => update("time", e.target.value)}
                          >
                            <option value="">Uhrzeit wählen</option>
                            {CALLBACK_TIMES.map((time) => (
                              <option
                                key={time}
                                value={time}
                                disabled={
                                  !!now &&
                                  !!form.date &&
                                  (!!callbackDateError(form.date, now) ||
                                    !!callbackTimeError(form.date, time, now))
                                }
                              >
                                {time} Uhr
                              </option>
                            ))}
                          </select>
                          {error("time")}
                        </div>
                      </>
                    )}
                  </div>
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
                  {step === 2 && (
                    <div className="callback-consent-wrap">
                      <p className="callback-note">
                        Wir berücksichtigen Ihren Wunsch. Die genaue Uhrzeit ist noch nicht
                        bestätigt.
                      </p>
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
                          gelesen und bitte um einen Rückruf.
                        </span>
                      </label>
                      {error("privacy")}
                    </div>
                  )}
                  <div className="callback-bottom">
                    {step > 0 ? (
                      <button type="button" className="callback-back" onClick={() => go(step - 1)}>
                        <ArrowLeft size={16} aria-hidden="true" />
                        Zurück
                      </button>
                    ) : (
                      <span className="callback-small-note">In drei kurzen Schritten.</span>
                    )}
                    <button type="submit" className="callback-submit">
                      {pending ? (
                        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      ) : step === 2 ? (
                        <Phone size={18} aria-hidden="true" />
                      ) : null}
                      {pending ? "Wird gesendet …" : step === 2 ? "Rückruf anfragen" : "Weiter"}
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
