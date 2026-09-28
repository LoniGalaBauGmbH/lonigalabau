import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, Handshake, Leaf, Sparkles, Quote, MapPin } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useSiteImages } from "@/hooks/useSiteImages";
import founder from "@/assets/about-founder.jpg";
import heroGarden from "@/assets/hero-garden.jpg";
import svcGarten from "@/assets/svc-gartengestaltung.jpg";
import svcPflaster from "@/assets/svc-pflaster.jpg";
import svcNaturstein from "@/assets/svc-naturstein.jpg";
import aboutSite from "@/assets/about-site.jpg";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über uns – Loni Galabau GmbH" },
      {
        name: "description",
        content:
          "Seit 2011 stehen wir für hochwertige Außenanlagen – akademische Expertise trifft handwerkliche Präzision.",
      },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  {
    year: "2011",
    t: "Die Gründung",
    d: "Loni wird in Hattersheim gegründet – mit einer klaren Vision: zuverlässige und fachgerechte Gartenpflege für Privatkunden im Rhein-Main-Gebiet.",
    img: svcGarten,
  },
  {
    year: "2013",
    t: "Garten- und Landschaftsbau",
    d: "Erweiterung des Leistungsspektrums um den klassischen GaLaBau – von der Neuanlage kompletter Gärten bis zu Pflaster- und Terrassenarbeiten.",
    img: svcPflaster,
  },
  {
    year: "2017",
    t: "Akademische Expertise",
    d: "Unser Geschäftsführer schließt den Bachelor of Engineering in Landschaftsarchitektur an der Hochschule Geisenheim ab – Planung trifft Handwerk.",
    img: svcNaturstein,
  },
  {
    year: "Heute",
    t: "Ein eingespieltes Team",
    d: "Hochwertige Außenanlagen für Privat, Gewerbe und öffentliche Hand. Mitglied im Fachverband GaLaBau, aktiv in der Ausbildung der nächsten Generation.",
    img: aboutSite,
  },
];

const VALUES = [
  {
    Icon: Heart,
    t: "Leidenschaft in jedem Projekt",
    d: "Seit über 15 Jahren realisieren wir Außenanlagen mit echter Begeisterung für Gestaltung, Funktion und Qualität.",
  },
  {
    Icon: Handshake,
    t: "Zusammenarbeit auf Augenhöhe",
    d: "Fachliche Planung trifft praktische Umsetzung – transparent, zuverlässig und partnerschaftlich.",
  },
  {
    Icon: Leaf,
    t: "Nachhaltig & durchdacht",
    d: "Wir planen Außenanlagen so, dass sie langfristig funktionieren – ressourcenschonend und an die Nutzung angepasst.",
  },
  {
    Icon: Sparkles,
    t: "Individuelle Lösungen",
    d: "Jeder Garten ist anders. Unsere Konzepte entstehen individuell – technisch fundiert, kreativ und exakt auf Ihre Anforderungen.",
  },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

function AboutPage() {
  const { images } = useSiteImages();

  return (
    <PageShell>
      {/* 1. HERO – split layout */}
      <section className="px-6 md:px-10 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="max-w-[1480px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow eyebrow-bracket text-accent">Über uns</span>
            <h1 className="display text-[clamp(3rem,7vw,7rem)] mt-6 text-brand leading-[0.95]">
              Wer wir<br />
              <span className="italic font-light text-brand-muted">wirklich</span> sind.
            </h1>
            <p className="mt-10 text-lg md:text-xl max-w-xl text-foreground/75 leading-relaxed">
              Die Firma Loni wurde 2011 in Hattersheim gegründet – mit einer klaren Vision:
              zuverlässige, fachgerechte Außenanlagen, geplant mit Verstand und umgesetzt mit
              Handwerksstolz.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center gap-2 text-brand">
                <MapPin className="h-4 w-4 text-accent" strokeWidth={1.6} />
                <span className="font-display font-semibold uppercase tracking-[0.18em]">
                  Hattersheim · Rhein-Main
                </span>
              </div>

              <div className="text-foreground/60">Gegründet 2011 · Meisterbetrieb</div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-surface shadow-2xl shadow-brand/10">
                <img
                  src={images.about_hero_bg}
                  alt="Loni Garten- und Landschaftsbau – Projekteindruck"
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-brand text-brand-foreground px-6 py-4 rounded-2xl shadow-xl shadow-brand/20">
                <div className="text-[10px] tracking-[0.24em] uppercase text-accent font-display font-semibold">
                  Seit 2011
                </div>
                <div className="mt-1 font-display font-extrabold text-lg leading-tight">
                  15+ Jahre Handwerk
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STORY — ausführlicher Unternehmenstext */}
      <section className="px-6 md:px-10 py-24 md:py-32 bg-surface">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Bild links */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="sticky top-8">
                  <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-brand/10">
                    <img
                      src={svcGarten}
                      alt="Garten- und Landschaftsbau Loni – Gartengestaltung"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Text rechts */}
            <div className="lg:col-span-7">
              <Reveal>
                <span className="eyebrow eyebrow-bracket text-brand/70">Unsere Geschichte im Detail</span>
                <h2 className="display mt-6 text-[clamp(2rem,4vw,3.5rem)] text-brand leading-[1.05]">
                  Von der Vision<br />
                  <span className="italic font-light text-brand-muted">zur Realität.</span>
                </h2>
              </Reveal>

              <div className="mt-14 space-y-10">
                <Reveal delay={100}>
                  <div className="relative pl-6">
                    <p className="text-foreground/80 leading-[1.8] text-lg">
                      Die Firma Loni wurde 2011 in Hattersheim gegründet mit einem kleinen Team und einer klaren Vision: zuverlässige und fachgerechte Gartenpflege für Privatkunden.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={150}>
                  <div className="relative pl-6">
                    <p className="text-foreground/80 leading-[1.8] text-lg">
                      Bereits 2013 erweiterten wir unser Leistungsspektrum um den klassischen Garten- und Landschaftsbau – von der Neuanlage kompletter Gärten bis hin zu Pflaster- und Terrassenarbeiten.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div className="relative pl-6">
                    <p className="text-foreground/80 leading-[1.8] text-lg">
                      Heute stehen wir für hochwertige Außenanlagen im privaten, gewerblichen und öffentlichen Bereich. Fachwissen, langjährige Erfahrung und eine praxisorientierte Arbeitsweise bilden dabei die Grundlage unserer Arbeit.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={250}>
                  <div className="relative pl-6">
                    <p className="text-foreground/80 leading-[1.8] text-lg">
                      Seit 2017 bringt unser Geschäftsführer seine akademische Expertise als Bachelor of Engineering (B. Ing.) im Studiengang Landschaftsarchitektur der Hochschule Geisenheim in die Planung und Umsetzung unserer Projekte ein.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={300}>
                  <div className="relative pl-6">
                    <p className="text-foreground/80 leading-[1.8] text-lg">
                      Dank unseres umfassenden Know-hows realisieren wir erfolgreich anspruchsvolle Bauprojekte im privaten, gewerblichen und öffentlichen Bereich. Qualität, Zuverlässigkeit und eine strukturierte Projektabwicklung stehen dabei stets im Mittelpunkt unserer Arbeit.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={350}>
                  <div className="relative pl-6">
                    <p className="text-foreground/80 leading-[1.8] text-lg">
                      Unser Unternehmen verfügt über ein erfahrenes, leistungsstarkes Team aus Fachkräften sowie ein professionell organisiertes Backoffice, das sämtliche Abläufe in den Bereichen Koordination, Kundenservice und Projektmanagement effizient steuert. Darüber hinaus engagieren wir uns aktiv in der Ausbildung zukünftiger Fachkräfte im Bereich Garten- und Landschaftsbau sowie Büromanagement.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={400}>
                  <div className="relative pl-6">
                    <p className="text-foreground/80 leading-[1.8] text-lg">
                      Wir sind zudem Mitglied im Fachverband Garten-, Landschafts- und Sportplatzbau, was unser Engagement für Qualität, fachliche Standards und kontinuierliche Weiterentwicklung in der Branche unterstreicht.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TIMELINE */}
      <section className="px-6 md:px-10 py-24 md:py-32 bg-surface">
        <div className="max-w-[1480px] mx-auto">
          <div className="max-w-2xl mb-20">
            <span className="eyebrow eyebrow-bracket text-brand/70">Unsere Geschichte</span>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,4rem)] text-brand leading-[1]">
              Von einer Idee<br />
              <span className="italic font-light text-brand-muted">zum Fachbetrieb.</span>
            </h2>
          </div>

          <div className="relative">
            {/* vertical line */}
            <div
              aria-hidden
              className="absolute left-[7px] md:left-1/2 top-2 bottom-2 w-px bg-brand/15 md:-translate-x-px"
            />
            <ol className="space-y-20 md:space-y-28">
              {TIMELINE.map((item, i) => {
                const flip = i % 2 === 1;
                return (
                  <li key={item.year} className="relative md:grid md:grid-cols-2 md:gap-16 items-center">
                    {/* dot */}
                    <span
                      aria-hidden
                      className="absolute left-0 md:left-1/2 top-2 size-4 rounded-full bg-accent ring-4 ring-surface md:-translate-x-1/2"
                    />

                    {/* text */}
                    <div
                      className={`pl-10 md:pl-0 ${
                        flip ? "md:col-start-2 md:pl-16" : "md:pr-16 md:text-right"
                      }`}
                    >
                      <Reveal>
                        <div className="display text-[clamp(2.5rem,4vw,3.75rem)] text-accent leading-none">
                          {item.year}
                        </div>
                        <h3 className="display mt-4 text-2xl md:text-3xl text-brand">{item.t}</h3>
                        <p className="mt-4 text-foreground/75 leading-relaxed max-w-md md:inline-block">
                          {item.d}
                        </p>
                      </Reveal>
                    </div>

                    {/* image */}
                    <div
                      className={`mt-8 md:mt-0 pl-10 md:pl-0 ${
                        flip ? "md:col-start-1 md:row-start-1 md:pr-16" : "md:pl-16"
                      }`}
                    >
                      <Reveal delay={150}>
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-brand/10">
                          <img
                            src={item.img}
                            alt={item.t}
                            loading="lazy"
                            className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                          />
                        </div>
                      </Reveal>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* 3. FOUNDER QUOTE */}
      <section className="relative bg-brand text-brand-foreground overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 80% at 10% 0%, oklch(0.74 0.20 135 / 0.14), transparent 60%), radial-gradient(50% 70% at 100% 100%, oklch(0.74 0.20 135 / 0.10), transparent 65%)",
          }}
        />
        <div className="relative max-w-[1480px] mx-auto px-6 md:px-10 py-24 md:py-32 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <div className="relative max-w-md">
              <div className="aspect-square overflow-hidden rounded-3xl">
                <img
                  src={founder}
                  alt="Geschäftsführer Loni Galabau GmbH"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Quote className="h-12 w-12 text-accent" strokeWidth={1.2} />
            <blockquote className="mt-6 display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.15] text-brand-foreground">
              „Jeder Garten erzählt eine Geschichte –<br />
              <span className="italic font-light text-brand-foreground/70">
                wir geben ihr Form, Tiefe und Bestand.
              </span>"
            </blockquote>
            <div className="mt-10 flex items-center gap-4">

              <div>
                <div className="font-display font-extrabold text-brand-foreground">
                  Valon Sinanaj
                </div>
                <div className="text-xs uppercase tracking-[0.22em] text-brand-foreground/60 mt-1">
                  Geschäftsführer · B. Ing. Landschaftsarchitektur
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUES */}
      <section className="px-6 md:px-10 py-24 md:py-32 bg-background">
        <div className="max-w-[1480px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="eyebrow eyebrow-bracket text-brand/70">Was uns trägt</span>
              <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,4rem)] text-brand leading-[1] max-w-2xl">
                Vier Werte,<br />
                <span className="italic font-light text-brand-muted">ein Anspruch.</span>
              </h2>
            </div>
            <p className="text-sm text-foreground/65 max-w-sm leading-relaxed">
              Das, woran wir jeden Auftrag messen – vom ersten Beratungsgespräch bis zur letzten
              Pflanzung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden">
            {VALUES.map(({ Icon, t, d }, i) => (
              <div
                key={t}
                className="group relative bg-background p-8 md:p-10 hover:bg-surface transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="size-11 rounded-full grid place-items-center">
                    <Icon className="h-5 w-5 text-brand group-hover:text-accent transition-colors" strokeWidth={1.6} />
                  </div>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-brand/30 font-display font-semibold">
                    / 0{i + 1}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-brand text-lg leading-tight">
                  {t}
                </h3>

                <p className="mt-9 text-sm text-foreground/70 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEAM TEASER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroGarden}
            alt=""
            aria-hidden
            className="h-full w-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-brand/85" />
        </div>
        <div className="relative max-w-[1480px] mx-auto px-6 md:px-10 py-24 md:py-32 text-center text-brand-foreground">
          <span className="eyebrow eyebrow-bracket text-accent">Unser Team</span>
          <h2 className="display mt-6 text-[clamp(2rem,4vw,3.5rem)] max-w-3xl mx-auto leading-[1.05] text-white">
            Ein eingespieltes Team aus Fachkräften,<br />
            <span className="italic font-light text-brand-foreground/70">
              Auszubildenden und Backoffice.
            </span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm">
            {[
              { v: "12+", l: "Mitarbeiter" },
              { v: "2", l: "Auszubildende" },
              { v: "Mitglied", l: "Fachverband GaLaBau" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-12">
                {i > 0 && <span className="hidden sm:block h-8 w-px bg-brand-foreground/20" />}
                <div className="text-center">
                  <div className="display text-3xl md:text-4xl text-accent">{s.v}</div>
                  <div className="mt-2 text-[10px] tracking-[0.24em] uppercase text-brand-foreground/60">
                    {s.l}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="px-6 md:px-10 py-24 md:py-32 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow eyebrow-bracket text-brand/70">Lust auf ein Gespräch?</span>
          <h2 className="display mt-6 text-[clamp(2rem,4.5vw,3.75rem)] text-brand leading-[1.05]">
            Erzählen Sie uns von<br />
            <span className="italic font-light text-brand-muted">Ihrem Garten.</span>
          </h2>
          <p className="mt-6 text-foreground/70 max-w-xl mx-auto leading-relaxed">
            Kostenloser Vor-Ort-Termin, transparentes Festpreisangebot, Rückmeldung innerhalb von
            24 Stunden – verbindlich.
          </p>
          <Link
            to="/"
            hash="projektanfrage"
            className="mt-10 inline-flex items-center gap-2 bg-brand text-brand-foreground px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-brand/90 transition rounded-full"
          >
            Projekt anfragen <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
