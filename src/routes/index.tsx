import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectInquiryForm } from "@/components/site/ProjectInquiryForm";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { FAQ } from "@/components/site/FAQ";
import { getServices, getSitePartners } from "@/lib/site.functions";
import { getServiceImage } from "@/lib/service-images";
import { useSiteImages } from "@/hooks/useSiteImages";
import { company, absoluteUrl } from "@/lib/company";
import paving from "@/assets/svc-pflaster.jpg";
import stone from "@/assets/svc-naturstein.jpg";

const servicesQuery = queryOptions({ queryKey: ["services"], queryFn: () => getServices() });
const partnersQuery = queryOptions({
  queryKey: ["site-partners"],
  queryFn: () => getSitePartners(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garten- und Landschaftsbau in Hattersheim | Loni GalaBau" },
      {
        name: "description",
        content:
          "Loni GalaBau aus Hattersheim: Pflasterarbeiten, Naturstein, Gärten und Außenanlagen im Rhein-Main-Gebiet. Beschreiben Sie uns Ihr Vorhaben.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(partnersQuery),
    ]),
  component: HomePage,
});

const descriptions: Record<string, string> = {
  natursteinarbeiten: "Mauern, Stufen und Einfassungen aus Naturstein.",
  gartengestaltung: "Gärten neu anlegen oder bestehende Flächen umgestalten.",
  pflasterarbeiten: "Terrassen, Einfahrten und Wege mit passendem Unterbau.",
};

function HomePage() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: partners } = useSuspenseQuery(partnersQuery);
  const { images, customImages } = useSiteImages();
  const highlighted = ["pflasterarbeiten", "natursteinarbeiten", "gartengestaltung"];
  const mainServices = highlighted.flatMap((slug) =>
    services.filter((service) => service.slug === slug),
  );
  const otherServices = services.filter((service) => !highlighted.includes(service.slug));

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: company.name,
            url: absoluteUrl("/"),
            logo: absoluteUrl(images.logo),
            telephone: company.phone,
            email: company.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: company.street,
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
            areaServed: "Rhein-Main-Gebiet",
          }).replace(/</g, "\\u003c"),
        }}
      />

      <section className="site-width home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Hattersheim am Main · Rhein-Main</p>
          <h1>
            Hof, Terrasse,
            <br />
            Garten.
          </h1>
          <p className="home-intro">
            Garten- und Landschaftsbau beginnt beim Boden und reicht bis zum letzten Pflasterstein.
            Wir kümmern uns um Ihre Außenanlage.
          </p>
          <div className="flex flex-wrap gap-5 items-center mt-8">
            <Link to="/kontakt" className="primary-link">
              Projekt anfragen <ArrowUpRight size={18} />
            </Link>
            <a href="#leistungen" className="text-link">
              Leistungen ansehen <ArrowRight size={16} />
            </a>
          </div>
          <p className="mt-9 text-sm text-foreground/65">
            Eine neue Einfahrt? Mehr Platz auf der Terrasse?
            <br />
            Erzählen Sie uns, was Sie vorhaben.
          </p>
        </div>
        <figure className="home-hero-image">
          <img
            src={customImages.hero_bg || paving}
            alt="Gepflasterter Weg zwischen Rasenflächen"
            width={768}
            height={768}
            fetchPriority="high"
          />
          <figcaption>Stein, Grün und Platz für den Alltag.</figcaption>
        </figure>
      </section>

      <section id="leistungen" className="site-width section-space scroll-mt-24">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Was wir machen</p>
            <h2>
              Von einzelnen Arbeiten
              <br />
              bis zur ganzen Außenanlage.
            </h2>
          </div>
          <Link to="/leistungen" className="text-link">
            Alle Leistungen <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {mainServices.map((service) => (
            <Link
              key={service.id}
              to="/leistungen/$slug"
              params={{ slug: service.slug }}
              className="service-preview group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={getServiceImage(service.slug, service.hero_image)}
                  alt={service.title}
                  width={768}
                  height={576}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex justify-between gap-4 mt-5">
                <h3>{service.title}</h3>
                <ArrowUpRight size={21} className="shrink-0 mt-1" />
              </div>
              <p>{descriptions[service.slug] || service.short_text}</p>
            </Link>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 mt-10">
          {otherServices.map((service) => (
            <Link
              key={service.id}
              to="/leistungen/$slug"
              params={{ slug: service.slug }}
              className="flex justify-between gap-4 py-5 border-t border-brand/20 font-medium hover:text-brand"
            >
              <span>{service.title}</span>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand text-brand-foreground section-space">
        <div className="site-width grid lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <p className="eyebrow text-white/65">Die Zusammenarbeit</p>
            <h2 className="home-heading text-white mt-4">
              Erst besprechen.
              <br />
              Dann anpacken.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/75">
              Was soll entstehen, was ist schon da und was passt zum Grundstück? Diese Fragen klären
              wir gemeinsam, bevor die Arbeiten beginnen.
            </p>
            <Link to="/ueber-uns" className="text-link text-white mt-8">
              Mehr über unseren Betrieb <ArrowUpRight size={18} />
            </Link>
          </div>
          <ol className="divide-y divide-white/20">
            {[
              [
                "Vorhaben besprechen",
                "Sie schicken uns die wichtigsten Angaben. Fotos und ungefähre Maße helfen bei der ersten Einschätzung.",
              ],
              [
                "Umfang und Angebot klären",
                "Wir stimmen die Arbeiten, Materialien und den möglichen Zeitraum mit Ihnen ab.",
              ],
              [
                "Arbeiten umsetzen",
                "Auf der Baustelle setzen wir die vereinbarten Leistungen um und besprechen offene Fragen direkt.",
              ],
            ].map(([title, text], index) => (
              <li key={title} className="py-6 first:pt-0 grid grid-cols-[2rem_1fr] gap-5">
                <span className="text-white/50 text-sm pt-1">0{index + 1}</span>
                <div>
                  <h3 className="text-white text-xl font-medium">{title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-width section-space grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
        <img
          src={stone}
          alt="Detail einer Mauer aus Naturstein"
          width={768}
          height={768}
          loading="lazy"
          className="w-full aspect-[5/4] object-cover"
        />
        <div>
          <p className="eyebrow">Ihr Vorhaben</p>
          <h2 className="home-heading mt-4">
            Noch keine fertige Planung?
            <br />
            Das ist in Ordnung.
          </h2>
          <p className="mt-6 leading-relaxed text-foreground/75">
            Im Gartenplaner können Sie Ihre Wünsche Schritt für Schritt beschreiben und Fotos
            ergänzen. Aus Ihren Angaben entsteht eine Anfrage, die wir persönlich mit Ihnen
            besprechen.
          </p>
          <Link to="/konfigurator" className="primary-link mt-8">
            Gartenprojekt beschreiben <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {customImages.before_garden && customImages.after_garden && <BeforeAfterSlider />}
      {partners.length > 0 && (
        <section className="site-width pb-16">
          <p className="eyebrow mb-8">Auftraggeber & Partner</p>
          <div className="flex flex-wrap gap-10 items-center">
            {partners.map((partner) => (
              <img
                key={partner.name}
                src={partner.src}
                alt={partner.name}
                loading="lazy"
                className="max-w-36 max-h-12 object-contain"
              />
            ))}
          </div>
        </section>
      )}
      <FAQ />
      <section id="projektanfrage" className="site-width section-space scroll-mt-24">
        <ProjectInquiryForm />
      </section>
    </PageShell>
  );
}
