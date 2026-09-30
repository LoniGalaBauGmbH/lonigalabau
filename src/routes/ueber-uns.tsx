import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, Handshake, Leaf, Sparkles, MapPin } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useSiteImages } from "@/hooks/useSiteImages";
import founder from "@/assets/about-founder-valon.webp";
import { projectPhotos } from "@/lib/project-photos";
import { ProjectImage } from "@/components/site/ProjectImage";
import { TeamPhoto } from "@/components/site/TeamPhoto";
const svcGarten = projectPhotos[81].src;
const svcPflaster = projectPhotos[30].src;
const svcNaturstein = projectPhotos[19].src;

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über uns – Loni Galabau GmbH" },
      {
        name: "description",
        content:
          "Seit 2011 im Garten- und Landschaftsbau tätig. Lernen Sie das Team der Loni GalaBau GmbH aus Hattersheim am Main kennen.",
      },
    ],
  }),
  component: AboutPage,
});

const WORK = [
  {
    t: "Platz für Ihren Alltag",
    d: "Sitzplätze, Wege und Pflanzen sollen zusammenpassen – und so angeordnet sein, wie Sie Ihren Garten nutzen möchten.",
    img: svcGarten,
  },
  {
    t: "Wege und Übergänge",
    d: "Vom Hauseingang bis zur Terrasse: Wir berücksichtigen Höhen, Anschlüsse und die Ableitung von Regenwasser.",
    img: svcPflaster,
  },
  {
    t: "Material im Detail",
    d: "Oberfläche, Fugen und Einfassungen prägen das Ergebnis. Wir besprechen, welche Ausführung zu Ihrem Vorhaben passt.",
    img: svcNaturstein,
  },
];

const VALUES = [
  {
    Icon: Heart,
    t: "Persönlich besprechen",
    d: "Wir hören zu, klären Ihre Wünsche und besprechen die nächsten Schritte mit Ihnen.",
  },
  {
    Icon: Handshake,
    t: "Klar abstimmen",
    d: "Gestaltung, Materialien und Leistungsumfang stimmen wir vor der Ausführung gemeinsam ab.",
  },
  {
    Icon: Leaf,
    t: "Pflege mitdenken",
    d: "Wir berücksichtigen, wie Sie Ihren Garten nutzen und wie viel Zeit Sie für die Pflege einplanen möchten.",
  },
  {
    Icon: Sparkles,
    t: "Passend umsetzen",
    d: "Wege, Höhen und Übergänge richten wir nach den Gegebenheiten Ihres Grundstücks aus.",
  },
];

function AboutPage() {
  const { images } = useSiteImages();

  return (
    <PageShell>
      {/* 1. HERO – split layout */}
      <section className="px-6 md:px-10 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="max-w-[1480px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow eyebrow-bracket text-accent">Über uns</span>
            <h1 className="display text-[clamp(3rem,7vw,7rem)] mt-6 text-brand">
              Wer wir
              <br />
              <span className="italic font-light text-brand-muted">wirklich</span> sind.
            </h1>
            <p className="mt-10 text-lg md:text-xl max-w-xl text-foreground/75 leading-relaxed">
              Wir sind Loni GalaBau aus Hattersheim. Unser Team auf der Baustelle und im Büro
              begleitet Ihr Vorhaben – vom ersten Gespräch bis zur Umsetzung.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center gap-2 text-brand">
                <MapPin className="h-4 w-4 text-accent" strokeWidth={1.6} />
                <span className="font-display font-semibold uppercase tracking-[0.18em]">
                  Hattersheim · Rhein-Main
                </span>
              </div>

              <div className="text-foreground/60">Seit 2011 in der Branche tätig</div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <TeamPhoto
                src={images.about_hero_bg}
                sizes="(min-width: 1024px) 42vw, 100vw"
                loading="eager"
                className="w-full rounded-3xl shadow-2xl shadow-brand/10"
              />
              <div className="pointer-events-none absolute -bottom-5 -left-5 bg-brand text-brand-foreground px-6 py-4 rounded-2xl shadow-xl shadow-brand/20">
                <div className="text-[10px] tracking-[0.24em] uppercase text-accent font-display font-semibold">
                  Seit 2011
                </div>
                <div className="mt-1 font-display font-extrabold text-lg leading-tight">
                  Garten- & Landschaftsbau
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PEOPLE */}
      <section className="bg-brand text-brand-foreground px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-[1480px] mx-auto grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <div className="max-w-md aspect-[4/5] overflow-hidden rounded-3xl">
              <ProjectImage
                src={founder}
                alt="Valon Sinanaj – Geschäftsführer der Loni GalaBau GmbH"
                width={830}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <span className="eyebrow text-accent">Menschen hinter Loni</span>
            <h2 className="display mt-5 text-[clamp(2.25rem,5vw,4rem)] text-white">
              Valon Sinanaj.
            </h2>
            <p className="mt-3 text-accent font-semibold">Geschäftsführer</p>
            <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">
              Valon begleitet die Planung und Umsetzung Ihrer Außenanlage. Mit ihm besprechen Sie
              Ihre Vorstellungen und die Gegebenheiten auf Ihrem Grundstück.
            </p>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-white/80 max-w-2xl">
              <p>
                Auf der Baustelle setzt unser Team die abgestimmten Arbeiten um. Im Büro laufen die
                Koordination und die Abstimmung mit Ihnen zusammen.
              </p>
              <p>
                Seit 2011 sind wir im Garten- und Landschaftsbau tätig. Heute arbeiten wir für
                private, gewerbliche und öffentliche Auftraggeber im Rhein-Main-Gebiet.
              </p>
            </div>
            <Link
              to="/downloads"
              className="inline-block mt-8 text-sm font-semibold text-white underline underline-offset-8 decoration-white/40 hover:decoration-white"
            >
              Unsere Qualifikationen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* CRAFT */}
      <section className="px-6 md:px-10 py-16 md:py-24 bg-surface">
        <div className="max-w-[1480px] mx-auto">
          <div className="max-w-3xl mb-10 md:mb-14">
            <span className="eyebrow text-brand/70">Ein Blick auf unsere Arbeit</span>
            <h2 className="display mt-5 text-[clamp(2rem,4vw,3.5rem)] text-brand">
              Vom Gartenraum{" "}
              <span className="italic font-light text-brand-muted">bis zur Fuge.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {WORK.map(({ t, d, img }) => (
              <figure key={t}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <ProjectImage
                    src={img}
                    alt={t}
                    loading="lazy"
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-6">
                  <h3 className="text-xl font-display font-bold text-brand">{t}</h3>
                  <p className="mt-3 text-base text-foreground/75 leading-relaxed">{d}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VALUES */}
      <section className="px-6 md:px-10 py-16 md:py-24 bg-background">
        <div className="max-w-[1480px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="eyebrow eyebrow-bracket text-brand/70">So arbeiten wir</span>
              <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,4rem)] text-brand max-w-2xl">
                Was Sie von uns
                <br />
                <span className="italic font-light text-brand-muted">erwarten können.</span>
              </h2>
            </div>
            <p className="text-base text-foreground/75 max-w-sm leading-relaxed">
              Ihre Wünsche und die Bedingungen vor Ort bilden die Grundlage unserer Arbeit.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {VALUES.map(({ Icon, t, d }, i) => (
              <div key={t} className="group relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="size-11 rounded-full grid place-items-center">
                    <Icon
                      className="h-5 w-5 text-brand group-hover:text-accent transition-colors"
                      strokeWidth={1.6}
                    />
                  </div>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-brand/30 font-display font-semibold">
                    / 0{i + 1}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-brand text-lg leading-tight">
                  {t}
                </h3>

                <p className="mt-3 text-base text-foreground/75 leading-relaxed max-w-xl">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="px-6 md:px-10 py-24 md:py-32 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <span className="eyebrow eyebrow-bracket text-brand/70">Lust auf ein Gespräch?</span>
          <h2 className="display mt-6 text-[clamp(2rem,4.5vw,3.75rem)] text-brand">
            Erzählen Sie uns von
            <br />
            <span className="italic font-light text-brand-muted">Ihrem Garten.</span>
          </h2>
          <p className="mt-6 text-foreground/70 max-w-xl mx-auto leading-relaxed">
            Schildern Sie uns Ihr Vorhaben. Wir besprechen die nächsten Schritte persönlich und
            stimmen einen passenden Termin mit Ihnen ab.
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
