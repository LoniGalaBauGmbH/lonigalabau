import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { GuideCard } from "@/components/site/GuideCard";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import { guides } from "@/lib/ratgeber";
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
      <div className="guides">
        <header className="guide-index-intro guide-wrap">
          <div className="guide-kicker">Der Loni Gartenratgeber</div>
          <h1>
            Gute Gärten beginnen
            <br />
            mit <em>guten Fragen.</em>
          </h1>
          <div className="guide-intro-bottom">
            <p>
              Ideen einordnen, Materialien verstehen und die nächsten Schritte planen. Unser Wissen
              für Ihren Garten in Hattersheim und im Rhein-Main-Gebiet.
            </p>
            <a href="#alle-ratgeber" className="guide-text-link">
              Alle Ratgeber entdecken
            </a>
          </div>
        </header>
        <section className="guide-wrap" aria-labelledby="featured-guide">
          <div className="guide-feature">
            <ProjectImage
              src={featured.image}
              alt={featured.imageCaption}
              width={1200}
              height={900}
              fetchPriority="high"
              sizes="(max-width: 800px) 100vw, 60vw"
            />
            <div className="guide-feature-copy">
              <span className="guide-kicker">Gut vorbereitet starten</span>
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
                Garten in Etappen planen
              </Link>
              <span className="guide-feature-note">Mit Checkliste für Ihr Vorhaben</span>
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
