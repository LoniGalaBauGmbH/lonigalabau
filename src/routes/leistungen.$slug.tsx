import { ProjectImage } from "@/components/site/ProjectImage";
import { ServiceProjectPhotos } from "@/components/site/ServiceProjectPhotos";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  GraduationCap,
  Compass,
  Layers,
  Hammer,
  Droplet,
  Sprout,
  CheckCircle2,
  ArrowRight,
  Award,
  Coins,
  Search,
  Grid,
  Maximize,
  RefreshCw,
  Wrench,
  PenTool,
  Eye,
  Trees,
  Waves,
  HardHat,
  Calculator,
  Smartphone,
  Snowflake,
  Key,
  Shield,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { getProjectsByService, getRelatedServices, getServiceBySlug } from "@/lib/site.functions";
import { getServiceImage } from "@/lib/service-images";
import { ServiceFAQ } from "@/components/leistungen/ServiceFAQ";
import { canonicalUrl, safeJsonLd } from "@/lib/seo";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";

const slugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug({ data: { slug } }),
  });

const projectsByServiceQuery = (serviceId: string) =>
  queryOptions({
    queryKey: ["projects-by-service", serviceId],
    queryFn: () => getProjectsByService({ data: { serviceId } }),
  });

const relatedQuery = (excludeSlug: string) =>
  queryOptions({
    queryKey: ["related-services", excludeSlug],
    queryFn: () => getRelatedServices({ data: { excludeSlug } }),
  });

export const Route = createFileRoute("/leistungen/$slug")({
  head: ({ loaderData, params }) => {
    const d = loaderData as Awaited<ReturnType<typeof getServiceBySlug>> | undefined;
    const title =
      d?.meta_title && d.meta_title.trim() !== ""
        ? d.meta_title
        : `${d?.title ?? params.slug} – Loni Galabau GmbH`;
    const desc =
      d?.meta_description && d.meta_description.trim() !== ""
        ? d.meta_description
        : (d?.short_text?.slice(0, 160) ?? "Detaillierte Informationen zu unserer Leistung.");
    const img = d ? getServiceImage(params.slug, d.hero_image) : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        ...(img ? [{ property: "og:image", content: new URL(img, canonicalUrl("/")).href }] : []),
        ...(img ? [{ name: "twitter:image", content: new URL(img, canonicalUrl("/")).href }] : []),
      ],
    };
  },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(slugQuery(params.slug));
    if (!data) throw notFound();
    void context.queryClient.prefetchQuery(projectsByServiceQuery(data.id));
    void context.queryClient.prefetchQuery(relatedQuery(params.slug));
    return data;
  },
  component: Page,
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="display text-5xl text-brand">Leistung nicht gefunden</h1>
        <Link to="/leistungen" className="mt-6 inline-block text-accent hover:underline">
          ← Zurück zur Übersicht
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ reset }) => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="display text-4xl text-brand">Etwas ist schief gelaufen</h1>
        <p className="mt-4 text-foreground/70">
          Die Inhalte sind vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-block bg-brand text-brand-foreground px-6 py-3 rounded-full text-sm"
        >
          Erneut versuchen
        </button>
      </div>
    </PageShell>
  ),
});

const STEPS = [
  {
    n: "01",
    t: "Vermessung & Analyse",
    d: "Digitale Erfassung der Geländehöhen und Bodenverhältnisse vor Ort als exakte Planungsgrundlage.",
  },
  {
    n: "02",
    t: "Planung & Materialauswahl",
    d: "Abstimmung von Gestaltung, Materialien und Arbeitsschritten für Ihr Vorhaben.",
  },
  {
    n: "03",
    t: "Logistik & Fuhrpark",
    d: "Disposition unseres eigenen Maschinenparks und erfahrener Facharbeiter für einen termingerechten Start.",
  },
  {
    n: "04",
    t: "Fachgerechter Bau",
    d: "Fachgerechte Ausführung der vereinbarten Arbeiten und gemeinsame Besprechung bei der Übergabe.",
  },
];

function Page() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(slugQuery(slug));
  if (!data) return null;

  return <ServicePage slug={slug} data={data} />;
}

function ServicePage({
  slug,
  data,
}: {
  slug: string;
  data: NonNullable<Awaited<ReturnType<typeof getServiceBySlug>>>;
}) {
  const img = getServiceImage(slug, data.hero_image);
  const { data: projects = [] } = useSuspenseQuery(projectsByServiceQuery(data.id));
  const { data: related = [] } = useSuspenseQuery(relatedQuery(slug));

  const benefits = (() => {
    const custom = data.custom_benefits as { t: string; d: string }[] | null;
    if (Array.isArray(custom) && custom.length > 0) {
      return custom.map((item) => {
        let resolvedIcon = CheckCircle2;
        const titleL = (item.t || "").toLowerCase();
        if (titleL.includes("beratung") || titleL.includes("suche") || titleL.includes("analyse"))
          resolvedIcon = Search;
        else if (
          titleL.includes("planung") ||
          titleL.includes("zeichnung") ||
          titleL.includes("entwurf") ||
          titleL.includes("konzept")
        )
          resolvedIcon = PenTool;
        else if (
          titleL.includes("transport") ||
          titleL.includes("lieferung") ||
          titleL.includes("lkw") ||
          titleL.includes("fuhrpark")
        )
          resolvedIcon = Truck;
        else if (
          titleL.includes("garantie") ||
          titleL.includes("sicherheit") ||
          titleL.includes("gewährleistung") ||
          titleL.includes("zertifikat") ||
          titleL.includes("meister")
        )
          resolvedIcon = ShieldCheck;
        else if (
          titleL.includes("wasser") ||
          titleL.includes("bewässerung") ||
          titleL.includes("tropf") ||
          titleL.includes("entwässerung")
        )
          resolvedIcon = Droplet;
        else if (
          titleL.includes("stein") ||
          titleL.includes("pflaster") ||
          titleL.includes("mauer") ||
          titleL.includes("terrasse") ||
          titleL.includes("platte")
        )
          resolvedIcon = Layers;
        else if (
          titleL.includes("pflege") ||
          titleL.includes("rasen") ||
          titleL.includes("baum") ||
          titleL.includes("pflanz")
        )
          resolvedIcon = Sprout;
        else if (
          titleL.includes("bau") ||
          titleL.includes("montage") ||
          titleL.includes("arbeit") ||
          titleL.includes("tiefbau")
        )
          resolvedIcon = Hammer;

        return {
          t: item.t,
          d: item.d,
          Icon: resolvedIcon,
        };
      });
    }
    return buildBenefits(slug);
  })();

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: data.title,
                description: data.short_text,
                url: canonicalUrl("/leistungen/" + slug),
                provider: {
                  "@type": "HomeAndConstructionBusiness",
                  name: "Loni GalaBau GmbH",
                  url: canonicalUrl("/"),
                },
                areaServed: { "@type": "Place", name: "Rhein-Main-Gebiet" },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Startseite", item: canonicalUrl("/") },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Leistungen",
                    item: canonicalUrl("/leistungen"),
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: data.title,
                    item: canonicalUrl("/leistungen/" + slug),
                  },
                ],
              },
            ],
          }),
        }}
      />
      {/* 1. HERO - Balanced Magazine Split-Layout */}
      <section className="px-6 md:px-10 pt-8 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-[1480px] mx-auto">
          {/* Elegant Minimalist Breadcrumb */}
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.24em] text-foreground/50 font-display font-semibold">
            <Link to="/leistungen" className="hover:text-brand transition-colors">
              Leistungen
            </Link>
            <span className="text-brand/35">/</span>
            <span className="text-brand font-bold">{data.category ?? data.title}</span>
          </div>

          <div className="mt-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content (6 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  {data.category && (
                    <span className="eyebrow eyebrow-bracket text-accent/90">{data.category}</span>
                  )}
                  {data.geo_focus && (
                    <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-accent font-bold font-display bg-brand/5 px-3 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5 text-accent" /> {data.geo_focus}
                    </span>
                  )}
                </div>
                <h1 className="font-serif font-semibold text-4xl md:text-5xl lg:text-6xl text-brand leading-[1.05] tracking-tight">
                  {data.title}
                </h1>
              </div>

              <p className="text-base md:text-lg text-foreground/75 leading-relaxed max-w-2xl font-sans">
                {data.short_text}
              </p>

              {/* Enterprise Authority Badge */}
              <div className="bg-brand/[0.03] rounded-2xl p-5 flex items-start gap-4 max-w-xl shadow-sm">
                <div className="size-10 rounded-xl bg-brand/5 grid place-items-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-5 w-5 text-brand" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand">
                    Persönlich koordiniert
                  </h4>
                  <p className="text-[12px] text-foreground/60 leading-relaxed">
                    Wir stimmen Arbeitsschritte, Material und Maschineneinsatz auf Ihr Projekt ab.
                    Sie haben einen persönlichen Ansprechpartner.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#anfrage"
                  className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-brand/90 transition shadow-md shadow-brand/10 hover:shadow-lg"
                >
                  Projekt anfragen
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="tel:+4961909266134"
                  className="inline-flex items-center gap-2.5 border border-brand/20 text-brand px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-brand/5 transition"
                >
                  <Phone className="h-4 w-4 text-accent" strokeWidth={1.8} />
                  06190 9266134
                </a>
              </div>
            </div>

            {/* Right Media (5 Cols) - Harmonious 4:3 Aspect Ratio */}
            <div className="lg:col-span-5 lg:pl-4">
              <div className="relative group">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-brand/5 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.18)]">
                  <ProjectImage
                    src={img}
                    alt={data.title}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 ease-out"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING ENTERPRISE FACT-CARD - Clean 2-Layer Hierarchy & Scannability */}
      <section className="px-6 md:px-10 py-6 relative z-10">
        <div className="max-w-[1480px] mx-auto bg-surface rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(45,90,39,0.06)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
            {[
              { v: "Erfahrung seit 2011", sub: "Garten- und Landschaftsbau", Icon: Award },
              {
                v: "Eigener Fuhrpark",
                sub: "Maximale Schlagkraft · Eigene Bagger & Lader",
                Icon: Truck,
              },
              { v: "Klares Angebot", sub: "Umfang und Kosten vorab besprechen", Icon: Coins },
              {
                v: "Persönliche Planung",
                sub: "Abgestimmt auf Ihr Grundstück",
                Icon: GraduationCap,
              },
            ].map((s, i) => (
              <div key={i} className="flex min-w-0 gap-4 items-start">
                <div className="size-11 rounded-2xl bg-brand/5 flex items-center justify-center shrink-0">
                  <s.Icon className="h-5 w-5 text-brand" strokeWidth={1.8} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-brand text-base md:text-lg leading-tight">
                    {s.v}
                  </h3>
                  <p className="text-[12px] text-foreground/60 leading-relaxed font-sans">
                    {s.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DOCK & DETAIL DESCRIPTION (Über die Leistung) */}
      <section id="ueber" className="px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left Box (4 Cols) */}
            <div className="lg:col-span-4 bg-brand text-brand-foreground rounded-3xl p-8 md:p-10 space-y-6 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -right-10 -bottom-10 size-40 rounded-full bg-accent/10 pointer-events-none"
              />
              <span className="text-[10px] tracking-[0.24em] uppercase text-accent font-display font-semibold">
                Qualität & Anspruch
              </span>
              <h3 className="font-serif font-semibold text-2xl md:text-3xl text-brand-foreground leading-tight">
                Warum Loni die erste Wahl ist.
              </h3>
              <p className="text-sm text-brand-foreground/75 leading-relaxed font-sans">
                Wir betrachten Ihren Außenbereich als Ganzes: Nutzung, Gelände, Materialien und
                Pflegeaufwand. Daraus entwickeln wir gemeinsam eine passende Umsetzung.
              </p>
              <div className="pt-4 border-t border-brand-foreground/20 flex flex-col gap-3 text-xs text-brand-foreground/90 font-display uppercase tracking-widest font-semibold">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>ISO-konforme Ausführung</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Partner im Fachverband</span>
                </div>
              </div>
            </div>

            {/* Right Text Content (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <span className="eyebrow eyebrow-bracket text-brand/70">Über die Leistung</span>
              <h2 className="font-serif font-semibold text-3xl md:text-4xl text-brand leading-tight">
                Planungskompetenz trifft handwerkliche Präzision.
              </h2>
              <div className="text-base md:text-lg text-foreground/80 leading-[1.85] whitespace-pre-line font-sans space-y-4">
                {data.long_text || data.short_text}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PORTFOLIO REFERENCES */}
      {projects.length > 0 && (
        <section className="px-6 md:px-10 pb-24 md:pb-32">
          <div className="max-w-[1480px] mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12 pb-6">
              <div>
                <span className="eyebrow eyebrow-bracket text-accent">Referenzen</span>
                <h2 className="font-serif font-semibold text-3xl md:text-4xl text-brand">
                  Einblicke in unsere Projekte.
                </h2>
              </div>
              <Link
                to="/projekte"
                className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-widest text-brand hover:text-accent transition border-b border-brand/20 pb-0.5"
              >
                Ganzes Portfolio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ServiceProjectPhotos projects={projects} />
          </div>
        </section>
      )}

      {/* 4. VISUAL BENEFITS - Sage themed cards with exact matched Lucide Icons */}
      {benefits.length > 0 && (
        <section className="px-6 md:px-10 pb-24 md:pb-32">
          <div className="max-w-[1480px] mx-auto">
            <div className="mb-14">
              <span className="eyebrow eyebrow-bracket text-accent">Leistungsumfang</span>
              <h2 className="font-serif font-semibold text-3xl md:text-4xl text-brand mt-4">
                Was wir abdecken.
              </h2>
              <p className="text-sm text-foreground/60 mt-2">
                Unser vollumfängliches Leistungsspektrum im Detail.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="group bg-brand/[0.015] rounded-3xl p-8 hover:bg-white hover:shadow-[0_15px_40px_rgba(45,90,39,0.05)] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="size-11 rounded-2xl bg-brand/5 flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <b.Icon
                        className="h-5 w-5 text-brand group-hover:text-brand transition-colors duration-300"
                        strokeWidth={1.8}
                      />
                    </div>
                    <span className="font-display font-extrabold text-brand/20 text-xs tracking-[0.24em]">
                      / 0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-brand group-hover:text-brand transition-colors">
                    {b.t}
                  </h3>
                  <p className="mt-3 text-sm text-foreground/65 leading-relaxed font-sans">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. STRATEGIC BANNER: Kapazitäten & Fuhrpark (Enterprise Demonstration) */}
      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-[1480px] mx-auto bg-brand text-brand-foreground rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-xl shadow-brand/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(80% 100% at 90% 10%, oklch(0.74 0.20 135 / 0.15), transparent 70%)",
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            {/* Text Content */}
            <div className="lg:col-span-8 space-y-6">
              <span className="text-[10px] tracking-[0.26em] uppercase text-accent font-display font-semibold">
                Projektbegleitung
              </span>
              <h2 className="font-serif font-semibold text-3xl md:text-5xl text-brand-foreground leading-tight tracking-tight max-w-4xl mx-auto">
                Schweres Gerät.
                <br />
                Erfahrene Hände.
              </h2>
              <p className="text-base text-brand-foreground/80 leading-relaxed max-w-3xl font-sans">
                Für Erdarbeiten, Materialtransport und den Bau Ihrer Außenanlage setzen wir unseren
                Fuhrpark passend zur Aufgabe ein. Welche Maschinen benötigt werden, hängt auch von
                Zufahrt, Platz und Bodenverhältnissen ab. Den Ablauf und die nächsten Schritte
                stimmen wir mit Ihnen ab.
              </p>
            </div>

            {/* Stat Counters inside banner */}
            <div className="lg:col-span-4 lg:pl-10 space-y-6">
              {[
                { v: "Fuhrpark", l: "Passend zur Aufgabe", sub: "Bagger, Radlader und Transport" },
                { v: "Seit 2011", l: "Branchenerfahrung", sub: "Garten- und Landschaftsbau" },
                { v: "Persönlich", l: "Begleitung", sub: "Klare Absprachen" },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1 pl-6">
                  <div className="text-3xl md:text-4xl font-display font-extrabold text-accent leading-none">
                    {stat.v}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-foreground font-bold mt-1">
                    {stat.l}
                  </div>
                  <div className="text-xs text-brand-foreground/50">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONNECTED WORKFLOW TIMELINE */}
      <section id="ablauf" className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="max-w-[1480px] mx-auto">
          <div className="mb-16">
            <span className="eyebrow eyebrow-bracket text-accent">Strukturierter Ablauf</span>
            <h2 className="font-serif font-semibold text-3xl md:text-4xl text-brand mt-4">
              In vier Schritten zum Meisterwerk.
            </h2>
            <p className="text-sm text-foreground/60 mt-2">
              Ein durchdachter und transparenter Ablauf für planbare Bauphasen.
            </p>
          </div>

          <div className="relative">
            {/* Connected horizontal line on large screens */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-px bg-brand/10" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {STEPS.map((s) => (
                <div key={s.n} className="relative space-y-6">
                  {/* Step counter with elegant status circle */}
                  <div className="size-14 rounded-2xl bg-brand text-brand-foreground grid place-items-center font-display font-extrabold text-base relative z-10 shadow-md shadow-brand/10 border-2 border-surface group">
                    <span className="text-brand-foreground group-hover:scale-110 transition-transform duration-300">
                      {s.n}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display font-extrabold text-lg text-brand flex items-center gap-2">
                      {s.t}
                    </h3>
                    <p className="text-sm text-foreground/75 leading-relaxed font-sans">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ + MINIMALIST CONTACT PANEL */}
      <section id="anfrage" className="px-6 md:px-10 pb-24 md:pb-32 pt-24">
        <div className="max-w-[1480px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <ServiceFAQ
              slug={slug}
              title={data.title}
              customFaqs={data.custom_faqs as { q: string; a: string }[] | undefined}
            />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <ServiceMiniContact serviceTitle={data.title} />
            </div>
          </div>
        </div>
      </section>

      {/* 9. WEITERE LEISTUNGEN - Sage Themed hover scroller */}
      {related.length > 0 && (
        <section className="px-6 md:px-10 pb-24 pt-24 bg-brand/[0.01]">
          <div className="max-w-[1480px] mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <div>
                <span className="eyebrow eyebrow-bracket text-brand/70">Dienstleistungen</span>
                <h2 className="font-serif font-semibold text-2xl md:text-3xl text-brand mt-2">
                  Weitere Fachbereiche
                </h2>
              </div>
              <Link
                to="/leistungen"
                className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-widest text-brand hover:text-accent transition border-b border-brand/20 pb-0.5"
              >
                Alle Gewerke <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.slice(0, 3).map((s) => (
                <Link
                  key={s.id}
                  to="/leistungen/$slug"
                  params={{ slug: s.slug }}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] block shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <ProjectImage
                    src={getServiceImage(s.slug, s.hero_image)}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/20 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-brand-foreground">
                    {s.category && (
                      <span className="text-[9px] uppercase tracking-[0.22em] text-accent font-display font-bold mb-2">
                        {s.category}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-lg flex items-center justify-between gap-3 text-brand-foreground">
                      {s.title}
                      <span className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative text-brand-foreground group-hover:text-brand transition-colors duration-500 text-sm">
                          →
                        </span>
                      </span>
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. LUXURY FINAL CALL TO ACTION */}
      <section className="px-6 md:px-10 pb-24 md:pb-32 bg-surface">
        <div className="max-w-[1480px] mx-auto rounded-[2.5rem] bg-brand text-brand-foreground p-12 md:p-24 text-center relative overflow-hidden shadow-xl shadow-brand/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 100%, oklch(0.74 0.20 135 / 0.15), transparent 75%)",
            }}
          />

          <div className="relative z-10 space-y-6">
            <span className="text-[10px] tracking-[0.28em] uppercase text-accent font-display font-bold">
              Unverbindlicher Erstkontakt
            </span>
            <h2 className="font-serif font-semibold text-3xl md:text-5xl text-brand-foreground leading-tight tracking-tight max-w-4xl mx-auto">
              Lassen Sie uns Ihr Gartenprojekt realisieren.
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-brand-foreground/75 text-sm md:text-base leading-relaxed font-sans">
              Besprechen Sie Ihr Vorhaben mit unserem Team. Nach der Bestandsaufnahme stimmen wir
              Leistungsumfang, Materialien und Angebot mit Ihnen ab.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 bg-white text-brand px-9 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-accent transition shadow-md"
              >
                Termin buchen
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+4961909266134"
                className="inline-flex items-center gap-2.5 border border-brand-foreground/20 text-brand-foreground px-9 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-brand-foreground/5 transition"
              >
                <Phone className="h-4 w-4 text-accent" />
                06190 9266134
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

interface BenefitItem {
  t: string;
  d: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function buildBenefits(slug: string): BenefitItem[] {
  const map: Record<string, BenefitItem[]> = {
    natursteinarbeiten: [
      {
        t: "Materialauswahl",
        d: "Detaillierte Beratung zu Basalt, Granit, Travertin und edlen Natursteinen.",
        Icon: Search,
      },
      {
        t: "Trockenmauern",
        d: "Klassisch geschichtet, statisch bemessen und extrem langlebig.",
        Icon: Layers,
      },
      {
        t: "Treppen & Stufen",
        d: "Geradlinige, trittsichere Höhenausgleiche im Gelände.",
        Icon: Layers,
      },
      {
        t: "Terrassen & Beläge",
        d: "Exklusiv verlegte Großformatplatten oder Polygonalverbände nach Designstil.",
        Icon: Grid,
      },
      {
        t: "Einfassungen",
        d: "Präzise Steinabgrenzungen für Beetflächen, Wege und Baumgruppen.",
        Icon: Maximize,
      },
      {
        t: "Sanierung & Werterhalt",
        d: "Fachgerechte Reinigung, Festigkeitsprüfung und Neuverfugung von Naturstein.",
        Icon: RefreshCw,
      },
    ],
    pflasterarbeiten: [
      {
        t: "Einfahrten & Logistik",
        d: "Unterbau und Belag werden auf die vorgesehene Belastung abgestimmt.",
        Icon: Truck,
      },
      {
        t: "Premium Gartenwege",
        d: "Harmonisch geordnete Pflasterpfade, passend zur Geländelinie.",
        Icon: Compass,
      },
      {
        t: "Hof- und Stellflächen",
        d: "Robuste, entwässerte Befestigungen für jahrzehntelange Formstabilität.",
        Icon: Grid,
      },
      {
        t: "Versickerungs-Systeme",
        d: "Ökologisches Fugenpflaster für zeitgemäßes Regenwassermanagement.",
        Icon: Droplet,
      },
      {
        t: "Randeinfassungen",
        d: "Saubere Fundamentkanten mit Beton- oder Naturstein-Rückenstütze.",
        Icon: Maximize,
      },
      {
        t: "Sanierung & Fuge",
        d: "Tiefenreinigung, wasserundurchlässige Epoxidharz-Verfugung und Nivellierung.",
        Icon: Wrench,
      },
    ],
    gartengestaltung: [
      {
        t: "Konzept & Planung",
        d: "Detaillierter Entwurf inklusive vollumfänglicher Bepflanzungspläne.",
        Icon: PenTool,
      },
      {
        t: "Gestaltung besprechen",
        d: "Materialien, Flächen und Übergänge stimmen wir vor der Ausführung mit Ihnen ab.",
        Icon: Eye,
      },
      {
        t: "Materialberatung",
        d: "Edle Kompositionen aus Naturstein, Holz und Zierelementen.",
        Icon: Layers,
      },
      {
        t: "Großbaumpflanzung",
        d: "Lieferung und meisterhaftes Setzen von Solitärbäumen.",
        Icon: Trees,
      },
      {
        t: "Wasserlandschaften",
        d: "Einbau von formstabilen Zierteichen, Bachläufen und Wasserspielen.",
        Icon: Waves,
      },
      {
        t: "Ganzheitlicher Tiefbau",
        d: "Komplettabwicklung von schweren Erdarbeiten bis zum feinsten Rollrasen.",
        Icon: HardHat,
      },
    ],
    bewaesserungsanlagen: [
      {
        t: "Hydraulik-Berechnung",
        d: "Exakte Berechnung des Wasserbedarfs, Fließdrucks und der Sektoraufteilung.",
        Icon: Calculator,
      },
      {
        t: "Versenkregner-Systeme",
        d: "Unsichtbar im Boden integriert, gleichmäßige Bewässerung per Getrieberegner.",
        Icon: Droplet,
      },
      {
        t: "Tropfbewässerung",
        d: "Wassersparende, punktgenaue Hecken- und Solitärgehölz-Versorgung.",
        Icon: Droplet,
      },
      {
        t: "Smart Control (App)",
        d: "WLAN-Steuerung mit Sensoranbindung und automatischer Wetterdaten-Anpassung.",
        Icon: Smartphone,
      },
      {
        t: "Winterservice",
        d: "Wintersichere Druckluft-Entleerung zur Frostsicherung im Spätherbst.",
        Icon: Snowflake,
      },
      {
        t: "Minimal-invasive Nachrüstung",
        d: "Schonender Einzug in bestehende Rasenflächen mit Spezialwerkzeug.",
        Icon: Wrench,
      },
    ],
  };

  const defaultBenefits: BenefitItem[] = [
    {
      t: "Audit & Vermessung",
      d: "Detaillierte Höhenvermessung und Bestandsaufnahme direkt vor Ort.",
      Icon: Search,
    },
    {
      t: "Projektplanung",
      d: "Präzise zeichnerische Konzeption inklusive Materialauswahl.",
      Icon: PenTool,
    },
    {
      t: "Termintreuer Tiefbau",
      d: "Koordinierte Bauphase mit abgestimmten Arbeitsschritten.",
      Icon: Hammer,
    },
    {
      t: "Schlüsselfertige Übergabe",
      d: "Gemeinsame Übergabe mit Hinweisen zur Nutzung und Pflege.",
      Icon: Key,
    },
    {
      t: "Dauerhafter Werterhalt",
      d: "Optionale dauerhafte Pflege Ihrer Großanlage durch unsere Kolonnen.",
      Icon: Shield,
    },
    {
      t: "Gewährleistung",
      d: "Es gelten die vertraglich vereinbarten und gesetzlichen Mängelrechte.",
      Icon: ShieldCheck,
    },
  ];

  return map[slug] ?? defaultBenefits;
}
