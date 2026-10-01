import { publicImageUrl } from "@/lib/public-image-url";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Hydrate } from "@tanstack/react-start";
import { visible } from "@tanstack/react-start/hydration";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CallbackForm } from "@/components/site/CallbackForm";
import { ProjectInquiryForm } from "@/components/site/ProjectInquiryForm";
import { StatsBand } from "@/components/site/StatsBand";
import { TeamPhoto } from "@/components/site/TeamPhoto";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { GardenDetails } from "@/components/site/GardenDetails";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { Awards } from "@/components/site/Awards";

import { FAQ } from "@/components/site/FAQ";
import { getServices, getFeaturedProject, getSitePartners } from "@/lib/site.functions";
import { ServiceCarousel } from "@/components/site/ServiceCarousel";
import { AdditionalServices } from "@/components/site/AdditionalServices";
import { useSiteImages } from "@/hooks/useSiteImages";
import { projectPhotos } from "@/lib/project-photos";
import { ProjectImage } from "@/components/site/ProjectImage";
import { organizationSchema, websiteSchema, safeJsonLd } from "@/lib/seo";
import "@/components/site/HomeHero.css";
import heroWebp from "@/assets/performance/hero-garden-1920.webp";
import heroAvif from "@/assets/performance/hero-garden-1920.avif";
import workPhoto from "@/assets/performance/bagger-radlader-941.webp";
import workPhotoSmall from "@/assets/performance/bagger-radlader-640.webp";
import workPhotoAvif from "@/assets/performance/bagger-radlader-941.avif";
import workPhotoSmallAvif from "@/assets/performance/bagger-radlader-640.avif";
const aboutImg = projectPhotos[98].src;

import partnerBickhardt from "@/assets/partners/bickhardt-bau.png";
import partnerHattersheim from "@/assets/partners/hattersheim.png";
import partnerLimbach from "@/assets/partners/limbach.webp";
import partnerRose from "@/assets/performance/rose-gleisbau-200.webp";
import partnerRoseAvif from "@/assets/performance/rose-gleisbau-200.avif";
import partnerVgf from "@/assets/partners/vgf.png";
import partnerFrankfurt from "@/assets/partners/frankfurt.svg";

const servicesQuery = queryOptions({
  staleTime: 60_000,
  queryKey: ["services"],
  queryFn: () => getServices(),
});
const featuredQuery = queryOptions({
  staleTime: 60_000,
  queryKey: ["featured-project"],
  queryFn: () => getFeaturedProject(),
});
const partnersQuery = queryOptions({
  staleTime: 60_000,
  queryKey: ["partners"],
  queryFn: () => getSitePartners(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garten- und Landschaftsbau deutschlandweit | Loni GalaBau" },
      {
        name: "description",
        content:
          "Garten- und Landschaftsbau deutschlandweit: Gartengestaltung, Pflasterarbeiten, Naturstein, Rasen und Zäune. Sitz in Hattersheim bei Frankfurt. Jetzt anfragen.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(featuredQuery),
      context.queryClient.ensureQueryData(partnersQuery),
    ]),
  component: HomePage,
});

const clients = [
  { name: "Bickhardt Bau", src: partnerBickhardt, width: 512, height: 220 },
  { name: "Stadt Hattersheim", src: partnerHattersheim, width: 512, height: 137 },
  { name: "Stadt Frankfurt am Main", src: partnerFrankfurt, width: 1024, height: 154 },
  { name: "Limbach Gruppe", src: partnerLimbach, width: 512, height: 128 },
  { name: "ROSE Gleisbau", src: partnerRose, width: 200, height: 99 },
  { name: "VGF", src: partnerVgf, width: 512, height: 182 },
];

const values = [
  {
    t: "Material, das zur Nutzung passt",
    d: "Sitzplatz, Gartenweg oder Einfahrt: Wir besprechen mit Ihnen, welche Oberflächen und welcher Aufbau dafür geeignet sind.",
  },
  {
    t: "Wasser und Höhen mitgedacht",
    d: "Gefälle, Entwässerung und Übergänge zum Haus gehören von Anfang an zur Planung – genauso wie der sichtbare Belag.",
  },
  {
    t: "Ein Garten für Ihren Alltag",
    d: "Wie möchten Sie Ihren Garten nutzen? Wie viel Pflege passt in Ihren Alltag? Danach richten wir Pflanzen, Flächen und Ausstattung aus.",
  },
];

const steps = [
  {
    n: "01",
    t: "Vorhaben besprechen",
    d: "Sie erzählen uns, was Sie verändern möchten. Wir klären Wünsche, Nutzung und die Bedingungen auf Ihrem Grundstück.",
  },
  {
    n: "02",
    t: "Planung abstimmen",
    d: "Wir besprechen Materialien, Aufbau und Leistungsumfang. Für eine weitergehende Gartenplanung beziehen wir bei Bedarf unseren Planungspartner ein.",
  },
  {
    n: "03",
    t: "Angebot & Ausführung",
    d: "Sie erhalten ein Angebot für die besprochenen Arbeiten. Nach Ihrer Freigabe stimmen wir den Ablauf ab und setzen das Vorhaben um.",
  },
  {
    n: "04",
    t: "Gemeinsam durchgehen",
    d: "Zum Abschluss sehen wir uns das Ergebnis gemeinsam an und besprechen, worauf Sie bei Nutzung und Pflege achten sollten.",
  },
];

function HomePage() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: featured } = useSuspenseQuery(featuredQuery);
  const { data: partnersData } = useSuspenseQuery(partnersQuery);
  const { images } = useSiteImages();

  const activePartners = partnersData && partnersData.length > 0 ? partnersData : clients;

  return (
    <PageShell transparentHeader>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@graph": [organizationSchema(), websiteSchema()],
          }),
        }}
      />
      {/* HERO */}
      <section className="home-hero relative w-full overflow-hidden text-white">
        <div className="absolute inset-0">
          <picture>
            {images.hero_bg === heroWebp && <source type="image/avif" srcSet={heroAvif} />}
            <img
              src={publicImageUrl(images.hero_bg)}
              fetchPriority="high"
              decoding="async"
              alt="Modern gestalteter Garten in der Abenddämmerung"
              width={1920}
              height={1080}
              className="w-full h-full object-cover animate-slow-zoom"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>

        <div className="home-hero-inner relative z-[1] max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="home-hero-badge rounded-3xl backdrop-blur-md bg-white/5">
            <div className="home-hero-year display text-white">Seit 2011</div>
            <div className="home-hero-caption uppercase text-white/80 mt-1">
              Im Garten- & Landschaftsbau
            </div>
          </div>
          <div className="home-hero-copy max-w-5xl animate-fade-up">
            <h1 lang="de" className="home-hero-title display break-words hyphens-auto text-white">
              Garten- und <br />
              <span className="text-white">Landschaftsbau</span>
            </h1>

            <p className="home-hero-description max-w-2xl text-white/90 font-normal">
              Deutschlandweit für Sie im Einsatz – mit Sitz in Hattersheim am Main bei Frankfurt.
              Wir gestalten Ihren Garten, bauen Terrassen und pflastern Einfahrten – passend zu
              Ihrem Grundstück und Ihrem Alltag.
            </p>

            <div className="home-hero-actions flex flex-wrap items-center">
              <Link
                to="/"
                hash="rueckruf"
                className="inline-flex items-center gap-2 bg-white text-brand px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-brand transition"
              >
                Rückruf anfragen
              </Link>
              <Link
                to="/leistungen"
                className="group inline-flex items-center gap-3 text-white text-sm uppercase tracking-[0.2em] font-semibold border-b border-white/60 pb-1 hover:border-accent hover:text-accent transition"
              >
                Unsere Leistungen
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS BAND — auto-scrolling marquee */}
      <section className="bg-background border-b border-brand/10 overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 pt-14 md:pt-16 pb-10 md:pb-12">
          <div className="text-center mb-10">
            <span className="eyebrow text-brand">Auftraggeber & Partner</span>
          </div>
        </div>
        <div
          className="relative group"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex w-max animate-partner-marquee group-hover:[animation-play-state:paused] pb-14 md:pb-16">
            {[...activePartners, ...activePartners].map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className="shrink-0 px-10 md:px-16 flex items-center justify-center"
              >
                <picture>
                  {c.src === partnerRose && <source type="image/avif" srcSet={partnerRoseAvif} />}
                  <img
                    src={publicImageUrl(c.src)}
                    alt={c.name}
                    width={clients.find((item) => item.src === c.src)?.width || 200}
                    height={clients.find((item) => item.src === c.src)?.height || 64}
                    loading="lazy"
                    decoding="async"
                    className="h-12 md:h-16 w-auto max-w-[200px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes partner-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .animate-partner-marquee {
            animation: partner-marquee 40s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-partner-marquee { animation: none; }
          }
        `}</style>
      </section>

      <StatsBand />

      {/* VALUES */}
      <section className="px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <span className="eyebrow eyebrow-bracket text-brand">So arbeiten wir</span>
              <h2 className="display text-[clamp(2.25rem,5.8vw,4.5rem)] mt-5 text-brand">
                Schön geplant.
                <br />
                <span className="text-brand-muted">Bis in den Unterbau.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-6 flex lg:justify-end">
              <Link
                to="/ueber-uns"
                className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-10 py-5 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-brand/90 transition"
              >
                Loni kennenlernen
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-10 md:mt-14 items-center">
            <div className="lg:col-span-6">
              <p className="text-xl md:text-2xl leading-relaxed text-brand max-w-xl">
                Eine schöne Terrasse beginnt mit einem Unterbau, den später niemand mehr sieht. Auf
                diese Details kommt es uns an.
              </p>
              <div className="mt-8 space-y-7">
                {values.map(({ t, d }) => (
                  <div key={t}>
                    <h3 className="text-lg font-display font-bold text-brand">{t}</h3>
                    <p className="mt-2 text-base text-foreground/75 leading-relaxed max-w-xl">
                      {d}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <TeamPhoto
                  src={images.about_hero_bg}
                  sizes="(min-width: 640px) 160px, 80vw"
                  className="w-full sm:w-40 rounded-2xl"
                />
                <div>
                  <p className="font-semibold text-brand">Die Menschen hinter der Arbeit.</p>
                  <p className="mt-2 text-sm text-foreground/75 leading-relaxed max-w-sm">
                    Unser Team auf der Baustelle und im Büro begleitet Ihr Vorhaben. Lernen Sie
                    Valon Sinanaj und Loni GalaBau kennen.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 h-fit">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`${workPhotoSmallAvif} 640w, ${workPhotoAvif} 941w`}
                    sizes="(min-width: 1480px) 700px, (min-width: 1024px) 46vw, calc(100vw - 48px)"
                  />
                  <img
                    src={publicImageUrl(workPhoto)}
                    srcSet={`${publicImageUrl(workPhotoSmall)} 640w, ${publicImageUrl(workPhoto)} 941w`}
                    alt="Bagger und Radlader bei Erdarbeiten im Abendlicht"
                    width={941}
                    height={1672}
                    sizes="(min-width: 1480px) 700px, (min-width: 1024px) 46vw, calc(100vw - 48px)"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallbackForm />

      {/* PROCESS */}
      <section className="bg-brand text-brand-foreground px-6 md:px-10 py-16 md:py-20">
        <div className="max-w-[1480px] mx-auto">
          <span className="eyebrow eyebrow-bracket text-brand-foreground/70">
            Von der Anfrage zur Umsetzung
          </span>
          <h2
            lang="de"
            className="display break-words hyphens-auto text-[clamp(2rem,4vw,3.5rem)] mt-5 text-brand-foreground max-w-4xl"
          >
            Ihr Vorhaben.
            <br />
            <span className="text-accent">Die nächsten Schritte.</span>
          </h2>

          <ol className="mt-10 md:mt-14 grid sm:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4 sm:block">
                <span className="font-display text-xl text-accent font-semibold sm:block sm:mb-5">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl text-brand-foreground font-display font-bold tracking-tight">
                    {s.t}
                  </h3>
                  <p className="mt-3 text-brand-foreground/80 leading-relaxed max-w-md">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
            <div className="lg:col-span-8">
              <span className="eyebrow eyebrow-bracket text-brand">Leistungen</span>
              <h2 className="display text-[clamp(2.5rem,6vw,5.5rem)] mt-6 text-brand">
                Gärten und Außenanlagen
              </h2>
              <p className="mt-6 max-w-2xl text-base text-foreground/75 leading-relaxed">
                Von der{" "}
                <Link
                  to="/leistungen/$slug"
                  params={{ slug: "gartengestaltung" }}
                  className="underline underline-offset-4 hover:text-brand"
                >
                  Gartengestaltung
                </Link>{" "}
                bis zu{" "}
                <Link
                  to="/leistungen/$slug"
                  params={{ slug: "pflasterarbeiten" }}
                  className="underline underline-offset-4 hover:text-brand"
                >
                  Pflasterarbeiten
                </Link>
                : Wir stimmen Flächen, Bepflanzung und Technik aufeinander ab. Auch einzelne
                Arbeiten an einem bestehenden Garten können Sie bei uns anfragen.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                to="/leistungen"
                className="inline-flex items-center gap-2 text-brand text-sm uppercase tracking-[0.2em] font-semibold border-b border-brand/40 pb-1 hover:border-brand transition"
              >
                Leistungen entdecken <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <Hydrate
            when={visible({ rootMargin: "800px" })}
            prefetch={visible({ rootMargin: "1200px" })}
          >
            <ServiceCarousel services={services} />
            <AdditionalServices />
          </Hydrate>
        </div>
      </section>

      <Awards />

      <BeforeAfterSlider />

      {/* FEATURED PROJECT */}
      {featured && (
        <section className="px-6 md:px-10 pb-24 md:pb-36">
          <div className="max-w-[1480px] mx-auto bg-brand text-brand-foreground rounded-[2.5rem] overflow-hidden grid lg:grid-cols-2">
            <div className="p-10 md:p-16 flex flex-col gap-7 justify-center">
              <span className="eyebrow eyebrow-bracket text-accent">Referenz</span>
              <h2 className="display text-4xl md:text-6xl text-brand-foreground">
                {featured.title}
              </h2>
              {featured.location && (
                <p className="text-xs uppercase tracking-[0.22em] text-brand-foreground/60">
                  Standort · {featured.location}
                </p>
              )}
              <p className="text-lg text-brand-foreground/90 font-normal leading-relaxed max-w-lg">
                {featured.description}
              </p>
              <Link
                to="/projekte"
                className="inline-flex items-center gap-2 bg-brand-foreground text-brand px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold self-start hover:bg-accent transition"
              >
                Alle Projekte <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <ProjectGallery project={featured}>
              <button
                type="button"
                aria-label={featured.title + " – Bilder ansehen"}
                className="group relative block min-h-[360px] w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-accent lg:min-h-full"
              >
                {featured.images?.[0] ? (
                  <ProjectImage
                    src={featured.images[0]}
                    alt={featured.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ProjectImage
                    src={aboutImg}
                    alt={featured.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-brand/90 px-5 py-3 text-sm text-white backdrop-blur-sm group-hover:bg-brand">
                  Projekt ansehen <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </button>
            </ProjectGallery>
          </div>
        </section>
      )}

      <GardenDetails />

      {/* CONFIGURATOR CTA BANNER */}
      <section className="px-6 md:px-10 pt-24 md:pt-36 pb-24 md:pb-36 animate-fade-up">
        <div className="max-w-[1480px] mx-auto bg-surface rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-8 space-y-6">
              <span className="eyebrow eyebrow-bracket text-brand">Angebots-Assistent</span>
              <h2 className="display text-3xl md:text-5xl text-brand">
                Ihr Gartenprojekt. Klar geplant.
                <br />
                <span className="font-normal text-brand-muted">Schritt für Schritt mit uns.</span>
              </h2>
              <p className="text-foreground/75 leading-relaxed text-sm md:text-base max-w-2xl font-light">
                Kombinieren Sie passende Gewerke, beschreiben Sie Ihre Wünsche und ergänzen Sie
                Maße, Fotos oder Pläne. Sie erhalten eine persönliche Projektübersicht – wir eine
                gute Grundlage für die Beratung und Ihr individuelles Angebot.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-xs font-semibold text-brand/85">
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-accent/15 text-accent grid place-items-center shrink-0">
                    ✓
                  </span>
                  <span>100% kostenlos & unverbindlich</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-accent/15 text-accent grid place-items-center shrink-0">
                    ✓
                  </span>
                  <span>Eigene Fotos bequem hochladen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-accent/15 text-accent grid place-items-center shrink-0">
                    ✓
                  </span>
                  <span>Persönliche Projektübersicht</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                to="/konfigurator"
                className="group inline-flex items-center gap-3 bg-brand text-brand-foreground px-8 py-4.5 rounded-full text-xs font-bold font-display uppercase tracking-wider hover:bg-brand/90 transition shadow-lg shrink-0"
              >
                Projekt planen
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FAQ />
      <Hydrate when={visible({ rootMargin: "800px" })} prefetch={visible({ rootMargin: "1200px" })}>
        <ProjectInquiryForm />
      </Hydrate>
    </PageShell>
  );
}
