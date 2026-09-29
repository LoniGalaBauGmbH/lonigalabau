import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Link2, Leaf, Sparkles, Heart } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectInquiryForm } from "@/components/site/ProjectInquiryForm";
import { StatsBand } from "@/components/site/StatsBand";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { GardenDetails } from "@/components/site/GardenDetails";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { Awards } from "@/components/site/Awards";

import { FAQ } from "@/components/site/FAQ";
import { getServices, getFeaturedProject, getSitePartners } from "@/lib/site.functions";
import { ServiceCarousel } from "@/components/site/ServiceCarousel";
import { useSiteImages } from "@/hooks/useSiteImages";
import { projectPhotos } from "@/lib/project-photos";
import { ProjectImage } from "@/components/site/ProjectImage";
const aboutImg = projectPhotos[98].src;

import partnerBickhardt from "@/assets/partners/bickhardt-bau.png";
import partnerHattersheim from "@/assets/partners/hattersheim.png";
import partnerLimbach from "@/assets/partners/limbach.webp";
import partnerRose from "@/assets/partners/rose-gleisbau.webp";
import partnerVgf from "@/assets/partners/vgf.png";
import partnerFrankfurt from "@/assets/partners/frankfurt.svg";

const servicesQuery = queryOptions({ queryKey: ["services"], queryFn: () => getServices() });
const featuredQuery = queryOptions({
  queryKey: ["featured-project"],
  queryFn: () => getFeaturedProject(),
});
const partnersQuery = queryOptions({ queryKey: ["partners"], queryFn: () => getSitePartners() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loni Galabau GmbH – Ihr Garten, unsere Leidenschaft" },
      {
        name: "description",
        content:
          "Garten- und Landschaftsbau aus Hattersheim am Main. Natursteinarbeiten, Gartengestaltung, Pflasterarbeiten und mehr.",
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
  { name: "Bickhardt Bau", src: partnerBickhardt },
  { name: "Stadt Hattersheim", src: partnerHattersheim },
  { name: "Stadt Frankfurt am Main", src: partnerFrankfurt },
  { name: "Limbach Gruppe", src: partnerLimbach },
  { name: "ROSE Gleisbau", src: partnerRose },
  { name: "VGF", src: partnerVgf },
];

const values = [
  {
    Icon: Link2,
    t: "Wir verwirklichen Träume!",
    d: "Wir lassen Ihre Designträume Wirklichkeit werden, indem wir Ihre persönlichen Vorstellungen mit unserer Erfahrung seit 2011 im Bereich Garten- und Landschaftsbau kreativ verbinden.",
  },
  {
    Icon: Leaf,
    t: "Nachhaltigkeit im Blick",
    d: "Nachhaltigkeit ist fester Bestandteil unserer Pflegearbeit. Mit dem Einsatz nachhaltiger Produkte und sorgfältig ausgewählten Pflegemaßnahmen tragen wir dazu bei, Gärten und Grünflächen langfristig gesund und lebendig zu erhalten.",
  },
  {
    Icon: Sparkles,
    t: "Kreativität entfesselt!",
    d: "Unsere Gartendesigns verbinden kreative Ideen mit funktionalen Lösungen. So entstehen individuelle Gärten, die nicht nur hervorstechen, sondern auch praktische Herausforderungen sinnvoll lösen.",
  },
  {
    Icon: Heart,
    t: "Leidenschaft in jeder Arbeit",
    d: "Die Schaffung schöner, nachhaltiger Außenanlagen ist unsere große Leidenschaft. Jeder Garten ist individuell und stellt uns vor neue Herausforderungen. Genau darin liegt unsere Stärke: Materialien und Pflanzen harmonisch zu verbinden und so einzigartige Gartenlandschaften zu gestalten.",
  },
];

const steps = [
  {
    n: "01",
    t: "Design-Beratung",
    d: "Im ersten Schritt setzen wir uns mit Ihnen zusammen, um Ihre Wünsche und Vorstellungen für den Garten ausführlich zu besprechen und zu verstehen.",
  },
  {
    n: "02",
    t: "Individuelle Planung",
    d: "Wenn gewünscht, entwirft unser Partner ein individuelles und passgenaues Gartendesign, das genau auf Ihre Vorstellungen und die Besonderheiten Ihres Grundstücks zugeschnitten ist.",
  },
  {
    n: "03",
    t: "Umsetzung & Bau",
    d: "Nach Fertigstellung des Entwurfs stellen wir Ihnen das Konzept persönlich vor und gehen alle Details gemeinsam durch. Nach Ihrer Freigabe starten wir unmittelbar mit der Einplanung und der fachgerechten Umsetzung.",
  },
  {
    n: "04",
    t: "Gestaltung & Ausstattung",
    d: "Im Bereich Gestaltung & Ausstattung integrieren wir zeitgemäße Lösungen wie Gartenbeleuchtung, automatische Bewässerung und Mähroboter. So verbinden wir Funktionalität, Komfort und ein gepflegtes Erscheinungsbild.",
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
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: "Loni Galabau GmbH",
            url: "https://www.loni-galabau.de",
            logo: "https://www.loni-galabau.de/images/partner/loni.svg",
            image: "https://www.loni-galabau.de/images/social-preview.jpg",
            telephone: "+49-6190-9266134",
            email: "info@loni-galabau.de",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Auf der Roos 3",
              addressLocality: "Hattersheim am Main",
              postalCode: "65795",
              addressCountry: "DE",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "07:00",
                closes: "18:00",
              },
            ],
            areaServed: [
              { "@type": "City", name: "Hattersheim am Main" },
              { "@type": "City", name: "Frankfurt am Main" },
              { "@type": "City", name: "Wiesbaden" },
              { "@type": "City", name: "Mainz" },
              { "@type": "City", name: "Darmstadt" },
              { "@type": "Place", name: "Rhein-Main-Gebiet" },
            ],
          }),
        }}
      />
      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden text-white">
        <div className="absolute inset-0">
          <img
            src={images.hero_bg}
            fetchPriority="high"
            alt="Modern gestalteter Garten in der Abenddämmerung"
            width={1920}
            height={1080}
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>

        <div className="relative z-[1] max-w-[1480px] mx-auto px-6 md:px-10 min-h-[100svh] flex flex-col justify-end pb-16 md:pb-24 pt-28 md:pt-32 lg:pt-72">
          {/* In normal flow on smaller screens, so the badge never covers the headline. */}
          <div className="self-start mb-9 sm:self-end lg:absolute lg:right-10 lg:top-32 lg:mb-0">
            <div className="rounded-3xl backdrop-blur-md bg-white/5 px-5 py-4 md:px-9 md:py-7 text-left sm:text-right">
              <div className="display text-3xl sm:text-4xl md:text-5xl text-white">Seit 2011</div>
              <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/80 mt-1">
                Im Garten- & Landschaftsbau
              </div>
            </div>
          </div>
          <div className="max-w-5xl animate-fade-up">
            <h1
              lang="de"
              className="display break-words hyphens-auto text-white text-[clamp(2rem,8vw,8rem)]"
            >
              Ihr Garten
              <br />
              <span className="text-white">unsere Leidenschaft</span>
            </h1>

            <p className="mt-10 max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed font-normal">
              Gärten sind mehr als nur Grünflächen – sie sind Orte der Entspannung, Inspiration und
              Naturverbundenheit. Wir verwandeln Ihren Außenbereich in eine harmonische Oase, die
              Ästhetik und Funktionalität vereint.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 bg-white text-brand px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-brand transition"
              >
                Mehr erfahren
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
                <img
                  src={c.src}
                  alt={c.name}
                  loading="lazy"
                  className="h-12 md:h-16 w-auto max-w-[200px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
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
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <span className="eyebrow eyebrow-bracket text-brand">Unsere Werte</span>
              <h2 className="display text-[clamp(2.25rem,8vw,5.5rem)] mt-6 text-brand leading-[1.05]">
                Wir sind{" "}
                <span className="text-brand-muted">
                  in jeder
                  <br className="hidden lg:inline" /> Hinsicht anders
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-6 flex lg:justify-end">
              <Link
                to="/ueber-uns"
                className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-10 py-5 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-brand/90 transition"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mt-20">
            <div className="lg:col-span-6 space-y-14">
              {values.map(({ Icon, t, d }) => (
                <div key={t}>
                  <div className="size-12 grid place-items-center mb-5">
                    <Icon className="h-5 w-5 text-brand" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-brand">
                    {t}
                  </h3>
                  <p className="mt-3 text-base text-foreground/75 leading-relaxed max-w-xl">{d}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-6 lg:sticky lg:top-32 h-fit">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl">
                <ProjectImage
                  src={aboutImg}
                  alt="Bagger und Radlader bei Erdarbeiten im Abendlicht"
                  width={941}
                  height={1672}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-brand text-brand-foreground px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1480px] mx-auto">
          <span className="eyebrow eyebrow-bracket text-brand-foreground/70">
            Wie es funktioniert
          </span>
          <h2
            lang="de"
            className="display break-words hyphens-auto text-[clamp(2rem,5vw,4.5rem)] mt-6 text-brand-foreground max-w-6xl"
          >
            EINFACHE SCHRITTE FÜR <br />
            IHRE <span className="text-accent">GARTENGESTALTUNG</span>
          </h2>

          <div className="mt-20 grid md:grid-cols-2 gap-x-16 gap-y-14 relative">
            {steps.map((s, i) => (
              <div key={s.n} className={`relative md:px-8 ${i < 2 ? "md:pb-14" : "md:pt-4"}`}>
                <h3 className="text-2xl md:text-3xl text-accent font-display font-extrabold tracking-tight">
                  {s.n} <span className="text-brand-foreground/30 mx-2">|</span> {s.t}
                </h3>
                <p className="mt-5 text-brand-foreground/75 leading-relaxed max-w-md">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
            <div className="lg:col-span-8">
              <span className="eyebrow eyebrow-bracket text-brand">Leistungen</span>
              <h2 className="display text-[clamp(2.5rem,6vw,5.5rem)] mt-6 text-brand">
                Unsere Gewerke
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                to="/leistungen"
                className="inline-flex items-center gap-2 text-brand text-sm uppercase tracking-[0.2em] font-semibold border-b border-brand/40 pb-1 hover:border-brand transition"
              >
                Alle Leistungen <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <ServiceCarousel services={services} />
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
              <h2 className="display text-3xl md:text-5xl text-brand leading-[1.1]">
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
      <ProjectInquiryForm />
    </PageShell>
  );
}
