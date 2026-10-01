import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { createContactRequest } from "@/lib/site.functions";
import { contactSchema } from "@/lib/validators";
import { useSiteImages } from "@/hooks/useSiteImages";
import { useContactAttachments } from "@/hooks/useContactAttachments";
import { ContactAttachments } from "@/components/site/ContactAttachments";
import portraitOriginal from "@/assets/about-founder-valon.webp";
import portrait160 from "@/assets/performance/about-founder-valon-160.webp";
import portrait320 from "@/assets/performance/about-founder-valon-320.webp";
import portrait160Avif from "@/assets/performance/about-founder-valon-160.avif";
import portrait320Avif from "@/assets/performance/about-founder-valon-320.avif";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt & Projektanfrage | Loni GalaBau Hattersheim" },
      {
        name: "description",
        content:
          "Ihr Gartenprojekt in ganz Deutschland: Loni GalaBau telefonisch, per E-Mail oder Formular kontaktieren. Fotos und Angaben zum Vorhaben mitsenden.",
      },
    ],
  }),
  component: Page,
});

const SUBJECTS = [
  "Gartengestaltung",
  "Pflasterarbeiten",
  "Naturstein",
  "Gartenpflege",
  "Bewässerung",
  "Sonstiges",
];

function Page() {
  const send = useServerFn(createContactRequest);
  const attachments = useContactAttachments();
  const submitting = useRef(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const { images } = useSiteImages();
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "loading">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setStatus("loading");
    try {
      const parsed = contactSchema.parse(form);
      await send({ data: { ...parsed, attachments: await attachments.serialize() } });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      attachments.clear();
    } catch {
      setStatus("err");
      setErrorMsg(
        "Ihre Anfrage konnte gerade nicht gesendet werden. Bitte prüfen Sie Ihre Angaben und Dateien und versuchen Sie es erneut. Ihre Eingaben bleiben erhalten.",
      );
    } finally {
      submitting.current = false;
    }
  }

  return (
    <PageShell>
      <section className="px-6 pt-10 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-10 md:mb-14">
            <span className="eyebrow text-brand">Kontakt</span>
            <h1 className="display text-4xl sm:text-5xl md:text-6xl text-brand mt-5">
              Sprechen wir über <span className="font-light italic">Ihr Vorhaben.</span>
            </h1>
            <p className="mt-5 text-lg text-foreground/75 max-w-xl">
              Schreiben Sie uns oder rufen Sie an. Wir klären gemeinsam, wie wir Sie unterstützen
              können.
            </p>
          </div>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <aside aria-label="Direkter Kontakt" className="lg:col-span-4">
              <div className="flex items-center gap-4">
                <picture className="shrink-0">
                  {images.contact_portrait === portraitOriginal && (
                    <source
                      type="image/avif"
                      srcSet={`${portrait160Avif} 160w, ${portrait320Avif} 320w`}
                      sizes="80px"
                    />
                  )}
                  <img
                    src={
                      images.contact_portrait === portraitOriginal
                        ? portrait160
                        : images.contact_portrait
                    }
                    srcSet={
                      images.contact_portrait === portraitOriginal
                        ? `${portrait160} 160w, ${portrait320} 320w`
                        : undefined
                    }
                    sizes="80px"
                    decoding="async"
                    alt="Valon Sinanaj"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-2xl object-cover object-top"
                  />
                </picture>
                <div>
                  <p className="font-semibold text-brand">Valon Sinanaj</p>
                  <p className="text-sm text-foreground/70 mt-1">Ihr Ansprechpartner</p>
                </div>
              </div>
              <div className="mt-7 flex flex-col gap-4">
                <a
                  href="tel:+4961909266134"
                  className="flex items-center gap-3 text-brand font-medium hover:underline underline-offset-4"
                >
                  <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />
                  06190 9266134
                </a>
                <a
                  href="mailto:info@loni-galabau.de"
                  className="flex items-center gap-3 text-brand font-medium hover:underline underline-offset-4"
                >
                  <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
                  info@loni-galabau.de
                </a>
              </div>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-1 gap-6 text-sm text-foreground/75">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-brand mb-1">Erreichbarkeit</p>
                    <p>Montag–Freitag · 07–18 Uhr</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-brand mb-1">Loni GalaBau GmbH</p>
                    <p>
                      Auf der Roos 3<br />
                      65795 Hattersheim am Main
                    </p>
                    <a
                      href="https://maps.google.com/?q=Auf+der+Roos+3,+65795+Hattersheim"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 underline underline-offset-4 hover:text-brand"
                    >
                      Anfahrt in Google Maps
                    </a>
                    <p className="mt-2 text-xs max-w-64">
                      Die externe Karte öffnet sich erst nach Ihrem Klick.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
            <div
              id="formular"
              className="lg:col-span-8 min-w-0 scroll-mt-28 rounded-3xl bg-white p-6 sm:p-8 md:p-10"
            >
              {status === "ok" ? (
                <div className="relative py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/15 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="display text-3xl mt-6 text-brand">Vielen Dank!</h2>
                  <p className="mt-3 text-foreground/70 max-w-md mx-auto">
                    Ihre Nachricht ist bei uns angekommen. Wir melden uns persönlich bei Ihnen
                    zurück.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 inline-flex items-center gap-2 text-sm text-brand hover:text-accent border-b border-brand/30 hover:border-accent pb-0.5"
                  >
                    Weitere Nachricht senden
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="relative space-y-6"
                  aria-label="Kontaktformular"
                  aria-busy={status === "loading"}
                >
                  <fieldset disabled={status === "loading"} className="min-w-0 space-y-6">
                    <legend className="sr-only">Ihre Nachricht an Loni Galabau</legend>
                    <div>
                      <h2 className="display text-2xl md:text-3xl text-brand">
                        Schreiben Sie uns.
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Name" required>
                        <input
                          required
                          maxLength={200}
                          autoComplete="name"
                          name="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="contact-input"
                          placeholder="Ihr vollständiger Name"
                        />
                      </Field>
                      <Field label="E-Mail" required>
                        <input
                          required
                          type="email"
                          autoComplete="email"
                          name="email"
                          maxLength={320}
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="contact-input"
                          placeholder="ihre@email.de"
                        />
                      </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Telefon (optional)">
                        <input
                          maxLength={50}
                          type="tel"
                          autoComplete="tel"
                          name="phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="contact-input"
                          placeholder="Optional"
                        />
                      </Field>
                      <Field label="Betreff (optional)">
                        <input
                          list="subjects"
                          maxLength={200}
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="contact-input"
                          placeholder="Wählen oder eingeben"
                        />
                        <datalist id="subjects">
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </Field>
                    </div>

                    <Field label="Nachricht" required>
                      <textarea
                        required
                        maxLength={5000}
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="contact-input resize-y"
                        placeholder="Beschreiben Sie kurz Ihr Anliegen, Ihren Garten oder Wunschtermin…"
                      />
                      <div className="mt-1.5 text-xs text-foreground/80 text-right">
                        {form.message.length} / 5000
                      </div>
                    </Field>

                    <ContactAttachments attachments={attachments} disabled={status === "loading"} />

                    {status === "err" && (
                      <div
                        role="alert"
                        className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700"
                      >
                        {errorMsg}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <p className="text-sm leading-relaxed text-foreground/75 max-w-sm">
                        Informationen zur Verarbeitung Ihrer Angaben finden Sie in unserer{" "}
                        <Link to="/datenschutz" className="underline underline-offset-2">
                          Datenschutzerklärung
                        </Link>
                        .
                      </p>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-8 py-3.5 rounded-full text-sm font-medium hover:bg-brand/90 disabled:opacity-50 transition group"
                      >
                        {status === "loading" ? (
                          attachments.items.length ? (
                            "Anfrage & Dateien werden gesendet…"
                          ) : (
                            "Wird gesendet…"
                          )
                        ) : (
                          <>Nachricht senden </>
                        )}
                      </button>
                    </div>
                  </fieldset>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .contact-input { width:100%; background:var(--background); border:1px solid color-mix(in oklab, var(--brand) 14%, transparent); border-radius:.875rem; padding:.85rem 1rem; font-size:1rem; transition:border-color .2s, box-shadow .2s; }
        .contact-input::placeholder { color:color-mix(in oklab,var(--foreground) 55%,transparent); }
        .contact-input:focus { outline:none; border-color:var(--brand); box-shadow:0 0 0 3px color-mix(in oklab,var(--brand) 12%,transparent); }
      `}</style>
    </PageShell>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground/80 mb-2">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
