import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Clock, MapPin, FileCheck2, Phone, Mail, ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react";
import { createContactRequest } from "@/lib/site.functions";
import { contactSchema } from "@/lib/validators";
import { useSiteImages } from "@/hooks/useSiteImages";

const SERVICES = [
  "Gartengestaltung",
  "Pflasterarbeiten",
  "Natursteinarbeiten",
  "Bewässerungsanlagen",
  "Gartenpflege",
  "Sonstiges",
];
const PROJECT_TYPES = ["Privatgarten", "Gewerbe", "Außenanlage", "Sanierung"];
const TIMEFRAMES = ["So bald wie möglich", "1–3 Monate", "3–6 Monate", "Flexibel"];
const BUDGETS = ["< 10.000 €", "10.000 – 25.000 €", "25.000 – 50.000 €", "50.000 € +", "Noch unklar"];
const CHANNELS = ["E-Mail", "Telefon", "WhatsApp"];

type FormState = {
  service: string;
  projectType: string;
  area: string;
  timeframe: string;
  budget: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  zip: string;
  channel: string;
  consent: boolean;
};

const INITIAL: FormState = {
  service: SERVICES[0],
  projectType: PROJECT_TYPES[0],
  area: "",
  timeframe: TIMEFRAMES[0],
  budget: "",
  description: "",
  name: "",
  email: "",
  phone: "",
  zip: "",
  channel: "E-Mail",
  consent: false,
};

export function ProjectInquiryForm({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: () => void;
}) {
  const { images } = useSiteImages();
  const send = useServerFn(createContactRequest);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setStatus("err");
      setErrorMsg("Bitte stimmen Sie der Datenschutzerklärung zu.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const subject = `Projektanfrage: ${form.service} – ${form.projectType}`;
    const message = [
      `Leistungsbereich: ${form.service}`,
      `Projekttyp: ${form.projectType}`,
      form.area && `Fläche: ${form.area} m²`,
      `Zeitraum: ${form.timeframe}`,
      form.budget && `Budget: ${form.budget}`,
      form.zip && `PLZ/Ort: ${form.zip}`,
      `Bevorzugter Kontakt: ${form.channel}`,
      "",
      "Beschreibung:",
      form.description,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const parsed = contactSchema.parse({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject,
        message,
      });
      await send({ data: parsed });
      setStatus("ok");
      setForm(INITIAL);
    } catch (err: unknown) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  }

  const innerContent = (
    <div className={`w-full bg-white overflow-hidden ${isModal ? "" : "max-w-[1480px] mx-auto rounded-[2.5rem] border border-brand/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]"}`}>
      <div className="grid lg:grid-cols-12">
        {/* LEFT — Editorial pitch with portrait */}
        <aside className="lg:col-span-5 relative bg-[var(--surface)] flex flex-col">
          <div className="relative h-72 lg:h-[420px] overflow-hidden">
            <img
              src={images.contact_portrait}
              alt="Ihr persönlicher Ansprechpartner"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] opacity-80">Ihr Ansprechpartner</p>
              <p className="font-serif text-2xl mt-1">Wir beraten Sie persönlich.</p>
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col gap-10">
            <div className="space-y-5">
              <span className="eyebrow eyebrow-bracket text-brand/70">Projektanfrage</span>
              <h2 className="display text-3xl md:text-4xl leading-[1] text-brand">
                Erzählen Sie uns von Ihrem <span className="italic font-light">Garten</span>projekt.
              </h2>
              <p className="text-brand/65 font-serif italic font-light text-base leading-relaxed">
                Ein paar Angaben genügen – wir melden uns persönlich mit einem
                unverbindlichen Erstgespräch und einem fairen Festpreisangebot.
              </p>
            </div>

            <ul className="space-y-4 border-t border-brand/10 pt-8">
              {[
                { Icon: Clock, t: "Antwort innerhalb 24 Stunden" },
                { Icon: MapPin, t: "Kostenloser Vor-Ort-Termin" },
                { Icon: FileCheck2, t: "Transparentes Festpreisangebot" },
                { Icon: ShieldCheck, t: "Meisterbetrieb · Versichert · Geprüft" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-brand/5 grid place-items-center">
                    <Icon className="h-4 w-4 text-brand" strokeWidth={1.6} />
                  </div>
                  <span className="text-brand text-sm">{t}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-brand/10 space-y-3">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-brand/45 font-semibold">
                Lieber direkt sprechen?
              </p>
              <a href="tel:+4961909266134" className="flex items-center gap-3 text-brand hover:text-accent transition">
                <Phone className="h-4 w-4" strokeWidth={1.6} />
                <span className="font-serif text-lg">06190 9266134</span>
              </a>
              <a href="mailto:info@loni-galabau.de" className="flex items-center gap-3 text-brand hover:text-accent transition">
                <Mail className="h-4 w-4" strokeWidth={1.6} />
                <span className="font-serif text-lg">info@loni-galabau.de</span>
              </a>
            </div>
          </div>
        </aside>

        {/* RIGHT — Form */}
        <div className="lg:col-span-7 p-8 md:p-14 bg-white">
          {status === "ok" ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center gap-6">
              <div className="w-16 h-16 rounded-full bg-accent/20 grid place-items-center">
                <FileCheck2 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="display text-3xl md:text-4xl">Vielen Dank!</h3>
              <p className="max-w-md text-brand/70 font-serif italic text-lg">
                Ihre Projektanfrage ist bei uns eingegangen. Wir melden uns innerhalb von
                24 Stunden persönlich bei Ihnen.
              </p>
              <div className="flex flex-col gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold border-b border-brand/40 pb-1 hover:border-brand"
                >
                  Weitere Anfrage senden <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                {isModal && onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 bg-brand text-brand-foreground px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-brand/90 transition"
                  >
                    Fenster schließen
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-10">
              {/* SECTION 1 */}
              <fieldset className="space-y-6">
                <legend className="text-[0.7rem] uppercase tracking-[0.25em] text-brand/50 font-semibold mb-5">
                  01 — Zu Ihrem Projekt
                </legend>

                <Field label="Leistungsbereich">
                  <Select value={form.service} onChange={(v) => update("service", v)} options={SERVICES} />
                </Field>

                <Field label="Projekttyp">
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((t) => (
                      <Chip key={t} active={form.projectType === t} onClick={() => update("projectType", t)}>{t}</Chip>
                    ))}
                  </div>
                </Field>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Fläche (ca.)">
                    <div className="relative">
                      <input
                        inputMode="numeric"
                        maxLength={10}
                        value={form.area}
                        onChange={(e) => update("area", e.target.value.replace(/[^0-9]/g, ""))}
                        className="pi-input pr-12"
                        placeholder="z. B. 250"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-brand/45">m²</span>
                    </div>
                  </Field>
                  <Field label="Zeitraum">
                    <Select value={form.timeframe} onChange={(v) => update("timeframe", v)} options={TIMEFRAMES} />
                  </Field>
                </div>

                <Field label="Budgetrahmen (optional)">
                  <Select
                    value={form.budget}
                    onChange={(v) => update("budget", v)}
                    options={BUDGETS}
                    placeholder="Bitte wählen…"
                    allowEmpty
                  />
                </Field>

                <Field label="Projektbeschreibung *">
                  <textarea
                    required
                    rows={5}
                    maxLength={4000}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="pi-input resize-none leading-relaxed"
                    placeholder="Was schwebt Ihnen vor? Pflanzen, Materialien, besondere Wünsche…"
                  />
                </Field>
              </fieldset>

              {/* SECTION 2 */}
              <fieldset className="space-y-6 border-t border-brand/10 pt-10">
                <legend className="text-[0.7rem] uppercase tracking-[0.25em] text-brand/50 font-semibold mb-5">
                  02 — Ihre Kontaktdaten
                </legend>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Name *">
                    <input required maxLength={200} value={form.name} onChange={(e) => update("name", e.target.value)} className="pi-input" />
                  </Field>
                  <Field label="E-Mail *">
                    <input required type="email" maxLength={320} value={form.email} onChange={(e) => update("email", e.target.value)} className="pi-input" />
                  </Field>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Telefon">
                    <input maxLength={50} value={form.phone} onChange={(e) => update("phone", e.target.value)} className="pi-input" />
                  </Field>
                  <Field label="PLZ / Ort">
                    <input maxLength={120} value={form.zip} onChange={(e) => update("zip", e.target.value)} className="pi-input" placeholder="65795 Hattersheim" />
                  </Field>
                </div>

                <Field label="Bevorzugte Kontaktart">
                  <div className="flex flex-wrap gap-2">
                    {CHANNELS.map((c) => (
                      <Chip key={c} active={form.channel === c} onClick={() => update("channel", c)}>{c}</Chip>
                    ))}
                  </div>
                </Field>
              </fieldset>

              {/* CONSENT + SUBMIT */}
              <div className="space-y-5 border-t border-brand/10 pt-8">
                <label className="flex gap-3 text-sm text-brand/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[var(--brand)] shrink-0"
                  />
                  <span>
                    Ich habe die Datenschutzhinweise gelesen und bin damit einverstanden, dass
                    meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden.
                  </span>
                </label>

                {status === "err" && (
                  <p className="text-sm text-red-600">{errorMsg}</p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-brand/45 max-w-xs">
                    Mit dem Absenden stimmen Sie unserer Datenverarbeitung gemäss Datenschutzerklärung zu.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex items-center gap-3 bg-brand text-brand-foreground px-9 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-semibold hover:bg-brand/90 disabled:opacity-50 transition"
                  >
                    {status === "loading" ? "Wird gesendet…" : "Projektanfrage senden"}
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>
                </div>

                <p className="text-xs text-brand/45">
                  Pflichtfelder sind mit * gekennzeichnet. Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="w-full">
        {innerContent}
        <style>{`
          .pi-input {
            width: 100%;
            background: #ffffff;
            border: 1px solid color-mix(in oklab, var(--brand) 14%, transparent);
            border-radius: 0.85rem;
            padding: 0.85rem 1rem;
            font-size: 0.95rem;
            color: var(--brand);
            font-family: inherit;
            transition: border-color .15s, box-shadow .15s, background-color .15s;
            appearance: none;
            -webkit-appearance: none;
          }
          .pi-input::placeholder { color: color-mix(in oklab, var(--brand) 35%, transparent); }
          .pi-input:hover { border-color: color-mix(in oklab, var(--brand) 28%, transparent); }
          .pi-input:focus {
            outline: none;
            border-color: var(--brand);
            box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand) 10%, transparent);
          }
        `}</style>
      </div>
    );
  }

  return (
    <section id="projektanfrage" className="px-6 md:px-10 pb-24 md:pb-36 pt-4">
      {innerContent}
      <style>{`
        .pi-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid color-mix(in oklab, var(--brand) 14%, transparent);
          border-radius: 0.85rem;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          color: var(--brand);
          font-family: inherit;
          transition: border-color .15s, box-shadow .15s, background-color .15s;
          appearance: none;
          -webkit-appearance: none;
        }
        .pi-input::placeholder { color: color-mix(in oklab, var(--brand) 35%, transparent); }
        .pi-input:hover { border-color: color-mix(in oklab, var(--brand) 28%, transparent); }
        .pi-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand) 10%, transparent);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-brand/55 mb-2 font-semibold">{label}</span>
      {children}
    </label>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm border transition ${
        active
          ? "bg-brand text-brand-foreground border-brand"
          : "bg-white text-brand/75 border-brand/15 hover:border-brand/40"
      }`}
    >
      {children}
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  allowEmpty,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  allowEmpty?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pi-input pr-12 cursor-pointer bg-white"
      >
        {allowEmpty && <option value="">{placeholder ?? "Bitte wählen…"}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand/50"
        strokeWidth={1.8}
      />
    </div>
  );
}
