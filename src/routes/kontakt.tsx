import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, MapPin, Clock, ArrowUpRight, CheckCircle2, Send, Sparkles } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { createContactRequest } from "@/lib/site.functions";
import { contactSchema } from "@/lib/validators";
import { useSiteImages } from "@/hooks/useSiteImages";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt – Loni Galabau GmbH" },
      { name: "description", content: "Sprechen Sie mit Loni Galabau in Hattersheim. Persönliche Beratung, faire Angebote und schnelle Rückmeldung – telefonisch, per E-Mail oder Formular." },
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

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setVisible(true), io.disconnect()),
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .8s ease ${delay}ms, transform .8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Page() {
  const send = useServerFn(createContactRequest);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const { images } = useSiteImages();
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "loading">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const parsed = contactSchema.parse(form);
      await send({ data: parsed });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  }

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto pt-10 md:pt-16 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 items-end">
          <Reveal className="lg:col-span-7">
            <span className="eyebrow eyebrow-bracket text-accent">In Kontakt treten</span>
            <h1 className="display text-5xl md:text-7xl lg:text-[5.5rem] mt-6 leading-[1.02] text-brand text-balance">
              Lassen Sie uns über <span className="italic font-light">Ihren Garten</span> sprechen.
            </h1>
            <p className="mt-8 text-lg md:text-xl max-w-xl text-foreground/75 leading-relaxed">
              Ob erste Idee, konkrete Anfrage oder Wunsch nach einem Vor-Ort-Termin – wir hören zu und melden uns innerhalb von <span className="text-brand font-medium">24 Stunden</span> zurück.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#formular" className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-7 py-3.5 rounded-full text-sm font-medium hover:bg-brand/90 transition">
                Formular ausfüllen <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="tel:+4961909266134" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium border border-brand/20 hover:bg-brand/5 transition">
                <Phone className="w-4 h-4" /> 06190 9266134
              </a>
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-5">
            <div className="relative">

              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                <img src={images.contact_portrait} alt="Ansprechpartner Loni Galabau" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <p className="text-white/80 text-xs uppercase tracking-widest">Ihr Ansprechpartner</p>
                  <p className="text-white font-serif text-2xl mt-1">Valon Sinanaj</p>
                  <p className="text-white/70 text-sm">Geschäftsführer</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-background rounded-2xl px-5 py-3 shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Antwort in 24 h</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            { icon: Mail, eyebrow: "E-Mail", main: "info@loni-galabau.de", href: "mailto:info@loni-galabau.de", sub: "Antwort innerhalb 24 h" },
            { icon: Phone, eyebrow: "Telefon", main: "06190 9266134", href: "tel:+4961909266134", sub: "Mo–Fr · 7–18 Uhr" },
            { icon: MapPin, eyebrow: "Adresse", main: "Auf der Roos 3", href: "https://maps.google.com/?q=Auf+der+Roos+3,+65795+Hattersheim", sub: "65795 Hattersheim am Main" },
          ].map((c, i) => (
            <Reveal key={c.eyebrow} delay={i * 100}>
              <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group block h-full bg-surface rounded-3xl p-7 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand/5 group-hover:bg-accent/15 flex items-center justify-center transition-colors">
                    <c.icon className="w-5 h-5 text-brand" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-foreground/30 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="mt-6 text-xs uppercase tracking-widest text-foreground/60">{c.eyebrow}</p>
                <p className="mt-2 font-serif text-2xl text-brand leading-tight">{c.main}</p>
                <p className="mt-2 text-sm text-foreground/60">{c.sub}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section id="formular" className="px-6 pb-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <Reveal className="lg:col-span-4 space-y-6">
            <div className="bg-brand text-brand-foreground rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 0%, var(--accent), transparent 60%)" }} />
              <div className="relative">
                <span className="eyebrow eyebrow-bracket text-accent">So läuft's ab</span>
                <h3 className="display text-2xl mt-4 mb-6 text-white">In drei Schritten<br />zu Ihrem Garten.</h3>
                <ol className="space-y-5">
                  {[
                    { t: "Anfrage stellen", d: "Formular, E-Mail oder Anruf." },
                    { t: "Vor-Ort-Termin", d: "Wir besichtigen und beraten – kostenlos." },
                    { t: "Angebot & Umsetzung", d: "Transparente Planung, sauberer Ablauf." },
                  ].map((s, i) => (
                    <li key={s.t} className="flex gap-4">
                      <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif">{i + 1}</span>
                      <div>
                        <p className="font-medium">{s.t}</p>
                        <p className="text-sm text-brand-foreground/70 mt-0.5">{s.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="bg-surface rounded-3xl p-7">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-brand" />
                <h4 className="font-serif text-xl text-brand">Öffnungszeiten</h4>
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  ["Montag – Freitag", "07:00 – 18:00"],
                  ["Sonntag", "Geschlossen"],
                ].map(([d, t]) => (
                  <div key={d} className="flex justify-between border-b border-brand/10 last:border-0 pb-2 last:pb-0">
                    <dt className="text-foreground/70">{d}</dt>
                    <dd className="font-medium">{t}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={150} className="lg:col-span-8">
            <div className="bg-background rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">


              {status === "ok" ? (
                <div className="relative py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/15 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="display text-3xl mt-6 text-brand">Vielen Dank!</h3>
                  <p className="mt-3 text-foreground/70 max-w-md mx-auto">
                    Ihre Nachricht ist bei uns angekommen. Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 inline-flex items-center gap-2 text-sm text-brand hover:text-accent border-b border-brand/30 hover:border-accent pb-0.5"
                  >
                    Weitere Nachricht senden
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="relative space-y-6">
                  <div>
                    <span className="eyebrow eyebrow-bracket text-accent">Anfrageformular</span>
                    <h3 className="display text-3xl md:text-4xl mt-3 text-brand">Schreiben Sie uns.</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Name" required>
                      <input required maxLength={200} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Ihr vollständiger Name" />
                    </Field>
                    <Field label="E-Mail" required>
                      <input required type="email" maxLength={320} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="ihre@email.de" />
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Telefon">
                      <input maxLength={50} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="Optional" />
                    </Field>
                    <Field label="Betreff">
                      <input list="subjects" maxLength={200} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input" placeholder="Wählen oder eingeben" />
                      <datalist id="subjects">
                        {SUBJECTS.map((s) => <option key={s} value={s} />)}
                      </datalist>
                    </Field>
                  </div>

                  <Field label="Nachricht" required>
                    <textarea required maxLength={5000} rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" placeholder="Beschreiben Sie kurz Ihr Anliegen, Ihren Garten oder Wunschtermin…" />
                    <div className="mt-1.5 text-xs text-foreground/50 text-right">{form.message.length} / 5000</div>
                  </Field>

                  {status === "err" && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-foreground/50 max-w-xs">
                      Mit dem Absenden stimmen Sie unserer Datenverarbeitung gemäss Datenschutzerklärung zu.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-8 py-3.5 rounded-full text-sm font-medium hover:bg-brand/90 disabled:opacity-50 transition group"
                    >
                      {status === "loading" ? "Wird gesendet…" : (<>Nachricht senden <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>)}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MAP / LOCATION */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
          <Reveal className="lg:col-span-5 flex flex-col justify-center">
            <span className="eyebrow eyebrow-bracket text-accent">Hier finden Sie uns</span>
            <h2 className="display text-4xl md:text-5xl mt-6 text-brand leading-tight">
              Mitten im <span className="italic font-light">Rhein-Main-Gebiet</span>.
            </h2>
            <p className="mt-6 text-foreground/75 leading-relaxed">
              Unser Standort in Hattersheim liegt zentral zwischen Frankfurt, Wiesbaden und Mainz. Wir arbeiten im gesamten Rhein-Main-Gebiet – persönlich, zuverlässig und mit Liebe zum Detail.
            </p>
            <a
              href="https://maps.google.com/?q=Auf+der+Roos+3,+65795+Hattersheim"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 self-start px-6 py-3 rounded-full text-sm font-medium border border-brand/20 hover:bg-brand/5 transition"
            >
              <MapPin className="w-4 h-4" /> In Google Maps öffnen <ArrowUpRight className="w-4 h-4" />
            </a>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-7">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg">
              <iframe
                title="Standort Loni Galabau"
                src="https://www.openstreetmap.org/export/embed.html?bbox=8.4750%2C50.0650%2C8.5050%2C50.0850&layer=mapnik&marker=50.0750%2C8.4900"
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto relative rounded-[2rem] overflow-hidden">
          <img src={images.about_hero_bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/85 to-brand/60" />
          <div className="relative px-8 md:px-14 py-14 md:py-20 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="eyebrow eyebrow-bracket text-accent">Lieber kurz anrufen?</span>
              <h3 className="display text-3xl md:text-4xl text-white mt-4 leading-tight">
                Wir nehmen uns Zeit für Ihr Anliegen.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a href="tel:+4961909266134" className="inline-flex items-center gap-2 bg-white text-brand px-7 py-3.5 rounded-full text-sm font-medium hover:bg-accent hover:text-brand-foreground transition">
                <Phone className="w-4 h-4" /> 06190 9266134
              </a>
              <a href="mailto:info@loni-galabau.de" className="inline-flex items-center gap-2 border border-white/40 text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition">
                <Mail className="w-4 h-4" /> E-Mail senden
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          background: white;
          border: 1px solid color-mix(in oklab, var(--brand) 12%, transparent);
          border-radius: 1rem;
          padding: 0.85rem 1.1rem;
          font-size: 0.95rem;
          transition: border-color .2s, box-shadow .2s;
        }
        .input::placeholder { color: color-mix(in oklab, var(--foreground) 35%, transparent); }
        .input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 15%, transparent);
        }
      `}</style>
    </PageShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">
        {label}{required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
