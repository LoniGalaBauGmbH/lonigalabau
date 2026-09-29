import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  Loader2,
  Phone,
} from "lucide-react";
import { createContactRequest } from "@/lib/site.functions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ContactAttachments } from "./ContactAttachments";
import { useContactAttachments } from "@/hooks/useContactAttachments";
import { scrollStepIntoView, useStepTransition } from "@/hooks/useStepTransition";
import "./Motion.css";
import {
  BUDGETS,
  CHANNELS,
  INITIAL_INQUIRY,
  INQUIRY_SERVICES,
  PROJECT_TYPES,
  TIMEFRAMES,
  buildInquiryPayload,
  validateInquiryStep,
  type InquiryErrors,
  type InquiryForm,
  type InquiryStep,
} from "@/lib/project-inquiry";

const STEPS = [
  {
    label: "Projekt",
    title: "Was haben Sie vor?",
    hint: "Wählen Sie den Bereich, der am besten zu Ihrem Vorhaben passt.",
  },
  {
    label: "Wünsche",
    title: "Wie sieht Ihre Idee aus?",
    hint: "Ein paar Sätze reichen. Die Details klären wir gemeinsam.",
  },
  {
    label: "Kontakt",
    title: "Wie erreichen wir Sie?",
    hint: "Wir melden uns persönlich, um die nächsten Schritte zu besprechen.",
  },
];
const inputClass =
  "min-w-0 w-full rounded-xl border border-brand/15 bg-white px-4 py-3.5 text-base text-brand outline-none transition-colors placeholder:text-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/10 aria-[invalid=true]:border-red-600";
const buttonClass =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60";

export function ProjectInquiryForm({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: () => void;
}) {
  const send = useServerFn(createContactRequest);
  const attachments = useContactAttachments();
  const uid = useId();
  const [form, setForm] = useState<InquiryForm>(INITIAL_INQUIRY);
  const [step, setStep] = useState<InquiryStep>(0);
  const [showOptional, setShowOptional] = useState(false);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const navigating = useRef(false);
  const focusingError = useRef(false);
  const submitting = useRef(false);
  const pending = status === "loading";
  const motion = useStepTransition(step);
  const id = (key: string) => uid + "-" + key;

  useEffect(() => {
    if (!navigating.current) return;
    navigating.current = false;
    const heading = status === "ok" ? successRef.current : headingRef.current;
    heading?.focus({ preventScroll: true });
    scrollStepIntoView(heading, motion.reduced);
  }, [step, status, motion.reduced]);

  useEffect(() => {
    if (!focusingError.current) return;
    focusingError.current = false;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  function update<K extends keyof InquiryForm>(key: K, value: InquiryForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
      ...(key === "channel" ? { phone: undefined } : {}),
    }));
    if (status === "err") setStatus("idle");
  }

  function goTo(next: InquiryStep) {
    if (pending || next === step) return;
    motion.changeStep(
      () => {
        setErrors({});
        setStatus("idle");
        navigating.current = true;
        setStep(next);
      },
      next > step ? 1 : -1,
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || motion.isMoving.current) return;
    for (let i = 0; i <= step; i++) {
      const found = validateInquiryStep(form, i as InquiryStep);
      if (Object.keys(found).length) {
        focusingError.current = true;
        setErrors(found);
        setStep(i as InquiryStep);
        return;
      }
    }
    if (step < 2) {
      goTo((step + 1) as InquiryStep);
      return;
    }
    submitting.current = true;
    setStatus("loading");
    try {
      const files = await attachments.serialize();
      await send({ data: { ...buildInquiryPayload(form), attachments: files } });
      navigating.current = true;
      setStatus("ok");
      setForm(INITIAL_INQUIRY);
      attachments.clear();
    } catch {
      setStatus("err");
    } finally {
      submitting.current = false;
    }
  }

  const fieldProps = (key: keyof InquiryForm) => ({
    id: id(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? id(key) + "-error" : undefined,
  });

  const content = (
    <div
      className={
        "site-ui mx-auto grid w-full max-w-[1320px] overflow-hidden bg-white lg:grid-cols-[0.8fr_1.6fr] " +
        (isModal ? "" : "rounded-[2rem] md:rounded-[2.5rem]")
      }
    >
      <aside className="flex flex-col bg-brand p-7 text-white md:p-10 lg:p-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Ihr Projekt beginnt hier
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-[2.6rem]">
          Ihr Garten.
          <br />
          <span className="font-serif font-normal italic text-white/75">
            Unser nächstes Projekt.
          </span>
        </h2>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-white/75">
          Von der ersten Idee bis zur fertigen Außenanlage. Erzählen Sie uns, was Sie vorhaben.
        </p>
        <div className="mt-8 hidden space-y-5 lg:block">
          {[
            "Unverbindlich anfragen",
            "Persönlich beraten lassen",
            "Gemeinsam die nächsten Schritte planen",
          ].map((text) => (
            <p key={text} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              {text}
            </p>
          ))}
        </div>
        <div className="mt-7 lg:mt-auto lg:pt-12">
          <p className="mb-2 text-sm text-white/60">Lieber direkt sprechen?</p>
          <a
            href="tel:+4961909266134"
            className="inline-flex min-h-11 items-center gap-3 text-lg font-medium text-white hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <Phone className="size-4" aria-hidden="true" />
            06190 9266134
          </a>
          <p className="hidden text-sm text-white/60 lg:block">Montag–Freitag · 7–18 Uhr</p>
        </div>
      </aside>

      <div className="min-w-0 p-6 md:p-10 lg:p-12">
        {status === "ok" ? (
          <div className="flex min-h-[480px] flex-col items-start justify-center gap-6">
            <span className="grid size-16 place-items-center rounded-full bg-accent/15 text-brand">
              <CheckCheck className="size-8" aria-hidden="true" />
            </span>
            <h3
              ref={successRef}
              tabIndex={-1}
              className="scroll-mt-28 font-serif text-4xl text-brand outline-none"
            >
              Ihre Anfrage ist angekommen.
            </h3>
            <p className="max-w-md text-base leading-relaxed text-brand/70">
              Vielen Dank für Ihr Vertrauen. Wir sehen uns Ihr Vorhaben an und melden uns persönlich
              bei Ihnen.
            </p>
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                navigating.current = true;
                setStep(0);
                setErrors({});
                setStatus("idle");
              }}
            >
              Weiteres Projekt anfragen <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 text-sm text-brand underline underline-offset-4"
              >
                Fenster schließen
              </button>
            )}
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-label="Projektanfrage"
            className="scroll-mt-28"
            aria-busy={pending}
          >
            <nav aria-label="Schritte der Projektanfrage">
              <ol className="mb-4 grid grid-cols-3 gap-2">
                {STEPS.map((item, i) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      disabled={i >= step || pending}
                      onClick={() => goTo(i as InquiryStep)}
                      aria-current={i === step ? "step" : undefined}
                      aria-label={i < step ? "Zurück zu " + item.label : item.label}
                      className={
                        "flex min-h-11 items-center gap-2 rounded-md text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
                        (i <= step ? "text-brand" : "text-brand/40")
                      }
                    >
                      <span
                        className={
                          "grid size-7 shrink-0 place-items-center rounded-full text-xs " +
                          (i === step
                            ? "bg-brand text-white"
                            : i < step
                              ? "bg-accent/20 text-brand"
                              : "bg-brand/5")
                        }
                      >
                        {i < step ? (
                          <Check className="size-3.5" aria-hidden="true" />
                        ) : (
                          "0" + (i + 1)
                        )}
                      </span>
                      <span className={i === step ? "font-semibold" : ""}>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <Progress
                value={((step + 1) / 3) * 100}
                aria-label={"Schritt " + (step + 1) + " von 3"}
                getValueLabel={() => "Schritt " + (step + 1) + " von 3"}
                className="h-1 bg-brand/10 [&>div]:bg-accent [&>div]:motion-reduce:transition-none"
              />
            </nav>
            <div ref={motion.frameRef} className="step-motion-frame">
              <div ref={motion.panelRef} className="step-motion-panel">
                <div className="mb-7 mt-8" aria-live="polite" aria-atomic="true">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-brand/80">
                    Schritt {step + 1} von 3
                  </p>
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="scroll-mt-28 font-serif text-3xl leading-tight text-brand outline-none md:text-4xl"
                  >
                    {STEPS[step].title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-brand/80">{STEPS[step].hint}</p>
                </div>

                <fieldset disabled={pending} className="min-w-0 space-y-6">
                  <legend className="sr-only">{STEPS[step].title}</legend>
                  {step === 0 && (
                    <>
                      <Choices
                        label="Leistungsbereich *"
                        uid={id("service")}
                        options={INQUIRY_SERVICES}
                        value={form.service}
                        onChange={(value) => update("service", value)}
                        error={errors.service}
                        tiles
                      />
                      <Choices
                        label="Es geht um"
                        uid={id("projectType")}
                        options={PROJECT_TYPES}
                        value={form.projectType}
                        onChange={(value) => update("projectType", value)}
                      />
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <Field label="Ihre Idee *" id={id("description")} error={errors.description}>
                        <textarea
                          {...fieldProps("description")}
                          required
                          rows={4}
                          maxLength={4000}
                          value={form.description}
                          onChange={(event) => update("description", event.target.value)}
                          className={inputClass + " resize-y leading-relaxed"}
                          placeholder="Zum Beispiel: Wir möchten unsere Terrasse erneuern und wünschen uns pflegeleichte Beete …"
                        />
                      </Field>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Wann möchten Sie starten?" id={id("timeframe")}>
                          <Select
                            id={id("timeframe")}
                            value={form.timeframe}
                            onChange={(value) => update("timeframe", value)}
                            options={TIMEFRAMES}
                          />
                        </Field>
                        <Field label="PLZ / Ort (optional)" id={id("zip")}>
                          <input
                            id={id("zip")}
                            autoComplete="postal-code"
                            maxLength={120}
                            value={form.zip}
                            onChange={(event) => update("zip", event.target.value)}
                            className={inputClass}
                            placeholder="z. B. 65795 Hattersheim"
                          />
                        </Field>
                      </div>
                      <ContactAttachments attachments={attachments} disabled={pending} />
                      <details
                        className="rounded-2xl bg-brand/[0.035] p-5"
                        open={showOptional || !!errors.area}
                        onToggle={(event) => setShowOptional(event.currentTarget.open)}
                      >
                        <summary className="cursor-pointer text-sm font-semibold text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                          Fläche & Budget ergänzen{" "}
                          <span className="font-normal text-brand/55">(optional)</span>
                        </summary>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                          <Field label="Fläche in m² (ca.)" id={id("area")} error={errors.area}>
                            <input
                              {...fieldProps("area")}
                              inputMode="numeric"
                              maxLength={10}
                              value={form.area}
                              onChange={(event) =>
                                update("area", event.target.value.replace(/[^0-9]/g, ""))
                              }
                              className={inputClass}
                              placeholder="z. B. 100"
                            />
                          </Field>
                          <Field label="Budgetrahmen" id={id("budget")}>
                            <Select
                              id={id("budget")}
                              value={form.budget}
                              onChange={(value) => update("budget", value)}
                              options={BUDGETS}
                              allowEmpty
                            />
                          </Field>
                        </div>
                      </details>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div className="flex items-start justify-between gap-4 rounded-2xl bg-brand/[0.035] p-5">
                        <div className="min-w-0 text-sm text-brand">
                          <p className="font-semibold">
                            {form.service} · {form.projectType}
                          </p>
                          <p className="mt-1 text-brand/60">
                            {form.zip && form.zip + " · "}
                            {form.timeframe}
                            {attachments.items.length > 0 &&
                              " · " + attachments.items.length + " Anhänge"}
                          </p>
                          <details className="mt-3">
                            <summary className="cursor-pointer underline underline-offset-4">
                              Ihre Angaben ansehen
                            </summary>
                            <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">
                              {form.description}
                            </p>
                            {attachments.items.length > 0 && (
                              <ul className="mt-3 space-y-1" aria-label="Anhänge der Anfrage">
                                {attachments.items.map((item) => (
                                  <li key={item.id} className="break-all text-sm">
                                    {item.file.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {(form.area || form.budget) && (
                              <p className="mt-2 text-brand/60">
                                {[form.area && form.area + " m²", form.budget]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                          </details>
                        </div>
                        <button
                          type="button"
                          onClick={() => goTo(1)}
                          className="min-h-11 shrink-0 text-sm font-semibold text-brand underline underline-offset-4"
                        >
                          Ändern
                        </button>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Ihr Name *" id={id("name")} error={errors.name}>
                          <input
                            {...fieldProps("name")}
                            autoComplete="name"
                            required
                            maxLength={200}
                            value={form.name}
                            onChange={(event) => update("name", event.target.value)}
                            className={inputClass}
                          />
                        </Field>
                        <Field label="E-Mail-Adresse *" id={id("email")} error={errors.email}>
                          <input
                            {...fieldProps("email")}
                            autoComplete="email"
                            required
                            type="email"
                            maxLength={320}
                            value={form.email}
                            onChange={(event) => update("email", event.target.value)}
                            className={inputClass}
                          />
                        </Field>
                      </div>
                      <Choices
                        label="Wie dürfen wir Sie kontaktieren?"
                        uid={id("channel")}
                        options={CHANNELS}
                        value={form.channel}
                        onChange={(value) => update("channel", value)}
                      />
                      <Field
                        label={form.channel === "E-Mail" ? "Telefon (optional)" : "Telefon *"}
                        id={id("phone")}
                        error={errors.phone}
                      >
                        <input
                          {...fieldProps("phone")}
                          autoComplete="tel"
                          type="tel"
                          required={form.channel !== "E-Mail"}
                          maxLength={50}
                          value={form.phone}
                          onChange={(event) => update("phone", event.target.value)}
                          className={inputClass}
                          placeholder="Ihre Telefonnummer"
                        />
                      </Field>
                      <div>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            {...fieldProps("consent")}
                            checked={form.consent}
                            onCheckedChange={(checked) => update("consent", checked === true)}
                            className="mt-1 size-5 rounded-md border-brand/30 data-[state=checked]:bg-brand data-[state=checked]:text-white"
                          />
                          <label
                            htmlFor={id("consent")}
                            className="text-sm leading-relaxed text-brand/70"
                          >
                            Ich habe die{" "}
                            <a
                              href="/datenschutz"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand underline underline-offset-4"
                            >
                              Datenschutzhinweise (neuer Tab)
                            </a>{" "}
                            gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung
                            dieser Anfrage zu. *
                          </label>
                        </div>
                        {errors.consent && (
                          <p id={id("consent") + "-error"} className="mt-2 text-sm text-red-700">
                            {errors.consent}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </fieldset>

                {!!Object.values(errors).filter(Boolean).length && (
                  <p role="alert" className="mt-5 text-sm text-red-700">
                    Bitte prüfen Sie die markierten Angaben.
                  </p>
                )}
                {status === "err" && (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-relaxed text-red-800"
                  >
                    Die Anfrage konnte gerade nicht gesendet werden. Ihre Eingaben sind noch da.
                    Bitte versuchen Sie es erneut oder rufen Sie uns unter 06190 9266134 an.
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  {step > 0 ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => goTo((step - 1) as InquiryStep)}
                      className="inline-flex min-h-12 items-center gap-2 rounded-full px-2 text-sm font-semibold text-brand hover:text-brand/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Zurück
                    </button>
                  ) : (
                    <p className="text-sm text-brand/80">Unverbindlich & kostenlos</p>
                  )}
                  <button type="submit" disabled={pending} className={buttonClass + " ml-auto"}>
                    {pending ? (
                      <>
                        <Loader2
                          className="size-4 animate-spin motion-reduce:animate-none"
                          aria-hidden="true"
                        />
                        {attachments.items.length
                          ? "Anfrage & Dateien werden gesendet …"
                          : "Wird gesendet …"}
                      </>
                    ) : (
                      <>
                        {step === 2
                          ? "Anfrage senden"
                          : step === 0
                            ? "Weiter zu Ihren Wünschen"
                            : "Weiter zum Kontakt"}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-brand/80">
                  {step === 2
                    ? "Ihre Angaben werden nur zur Bearbeitung Ihrer Anfrage verwendet."
                    : "* Pflichtangaben. Sie können Ihre Auswahl später ändern."}
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return isModal ? (
    content
  ) : (
    <section id="projektanfrage" className="scroll-mt-28 px-4 pb-24 pt-4 md:px-10 md:pb-36">
      {content}
    </section>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-brand">
        {label}
      </label>
      {children}
      {error && (
        <p id={id + "-error"} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function Choices({
  label,
  uid,
  options,
  value,
  onChange,
  error,
  tiles = false,
}: {
  label: string;
  uid: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  tiles?: boolean;
}) {
  return (
    <div>
      <p id={uid + "-label"} className="mb-3 text-sm font-medium text-brand">
        {label}
      </p>
      <RadioGroup
        id={uid}
        aria-labelledby={uid + "-label"}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? uid + "-error" : undefined}
        tabIndex={-1}
        value={value}
        onValueChange={onChange}
        className={
          tiles ? "grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2" : "flex flex-wrap gap-2"
        }
      >
        {options.map((option, index) => (
          <label
            key={option}
            data-selected={value === option}
            htmlFor={uid + "-" + index}
            className={
              "relative flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 " +
              (tiles ? "rounded-xl " : "rounded-full ") +
              (value === option ? "bg-brand text-white" : "bg-brand/5 text-brand hover:bg-brand/10")
            }
          >
            <RadioGroupItem id={uid + "-" + index} value={option} className="sr-only" />
            <span lang="de" className="min-w-0 break-words hyphens-auto">
              {option}
            </span>
            {tiles && (
              <span className="size-4 shrink-0" aria-hidden="true">
                {value === option && <Check className="size-4 text-accent" />}
              </span>
            )}
          </label>
        ))}
      </RadioGroup>
      {error && (
        <p id={uid + "-error"} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  allowEmpty,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allowEmpty?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass + " appearance-none pr-10"}
      >
        {allowEmpty && <option value="">Noch offen</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-brand/80"
        aria-hidden="true"
      />
    </div>
  );
}
