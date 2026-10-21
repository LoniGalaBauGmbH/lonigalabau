import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { GuideCard } from "@/components/site/GuideCard";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import { guides } from "@/lib/guide-index";
import { publicPageSchema, safeJsonLd } from "@/lib/seo";
import "@/components/site/Ratgeber.css";

export const Route = createFileRoute("/ratgeber/")({
  head: () => ({
    meta: [
      { title: "Garten-Ratgeber: Planung, Terrasse & Rasen | Loni GalaBau" },
      {
        name: "description",
        content:
          "Garten, Einfahrt und Terrasse besser planen: Ratgeber zu Pflasterkosten, Rasen, Naturstein und Bewässerung. Mit Checklisten und persönlicher Beratung.",
      },
    ],
  }),
  component: Ratgeber,
});

function Ratgeber() {
  const featured = guides[2];
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            publicPageSchema(
              "/ratgeber",
              "Garten-Ratgeber",
              "CollectionPage",
              guides.map((article) => ({ path: "/ratgeber/" + article.slug, name: article.title })),
            ),
          ),
        }}
      />
      <div className="guides guide-index">
        <header className="guide-index-hero">
          <div className="guide-index-hero-image">
            <ProjectImage
              src="/images/projekte/rasengarten-mit-plattenterrasse.webp"
              alt="Gestalteter Garten mit grüner Rasenfläche, Terrasse und blühender Bepflanzung"
              original
              width={1600}
              height={1200}
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 1600px) 100vw, 1536px"
            />
          </div>
          <div className="guide-index-hero-content">
            <div className="guide-kicker">Der Loni Gartenratgeber</div>
            <div className="guide-index-hero-copy">
              <h1>
                Gute Gärten beginnen <br />
                mit <em>guten Fragen.</em>
              </h1>
              <p>
                Ideen finden. Materialien verstehen. Mit Wissen aus der Praxis den nächsten Schritt
                für Ihren Garten planen.
              </p>
              <a href="#alle-ratgeber" className="guide-button guide-hero-button">
                Ratgeber entdecken <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
            <span className="guide-index-hero-note">Planung · Materialien · Gartengestaltung</span>
          </div>
        </header>
        <section className="guide-wrap guide-feature-section" aria-labelledby="featured-guide">
          <div className="guide-feature">
            <div className="guide-feature-copy">
              <span className="guide-kicker">Unser Lesetipp · {featured.readingMinutes} Min.</span>
              <h2 id="featured-guide">
                Ein Garten.
                <br />
                <em>Ihr Tempo.</em>
              </h2>
              <p>
                Terrasse zuerst, Rasen später? Wie Sie Ihren Garten in Etappen verändern und dabei
                das Ganze im Blick behalten.
              </p>
              <Link to="/ratgeber/$slug" params={{ slug: featured.slug }} className="guide-button">
                Garten in Etappen planen <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <span className="guide-feature-note">Mit Checkliste für Ihr Vorhaben</span>
            </div>
            <div className="guide-feature-image">
              <ProjectImage
                src="/images/projekte/garten-mit-rasen-und-bepflanzung.webp"
                alt="Fertiger Hausgarten mit Rasen, Terrasse und dichter Bepflanzung"
                loading="lazy"
                sizes="(max-width: 800px) 100vw, 600px"
              />
            </div>
          </div>
        </section>
        <section
          className="guide-wrap guide-library"
          id="alle-ratgeber"
          aria-labelledby="guide-library-title"
        >
          <div className="guide-section-heading">
            <h2 id="guide-library-title">Wissen fürs Draußen.</h2>
            <p>Sechs Themen. Konkrete Entscheidungshilfen.</p>
          </div>
          <div className="guide-grid">
            {guides.map((article) => (
              <GuideCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
        <section
          className="guide-contact guide-wrap"
          id="anfrage"
          aria-labelledby="guide-contact-title"
        >
          <div>
            <span className="guide-kicker">Von der Idee zum Gespräch</span>
            <h2 id="guide-contact-title">
              Was haben Sie
              <br />
              <em>im Garten vor?</em>
            </h2>
            <p>
              Vielleicht steht Ihr Plan schon fest. Vielleicht haben Sie erst eine Frage.
              Beschreiben Sie Ihre Fläche und Ihre Wünsche – wir besprechen gemeinsam den nächsten
              Schritt.
            </p>
            <a href="tel:+4961909266134" className="guide-text-link">
              06190 9266134
            </a>
          </div>
          <ServiceMiniContact serviceTitle="Garten" />
        </section>
      </div>
    </PageShell>
  );
}
