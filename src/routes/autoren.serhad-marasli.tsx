import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { GuideCard } from "@/components/site/GuideCard";
import { guides } from "@/lib/guide-index";
import { canonicalUrl, safeJsonLd } from "@/lib/seo";
import "@/components/site/Ratgeber.css";

export const Route = createFileRoute("/autoren/serhad-marasli")({
  head: () => ({
    meta: [
      { title: "Serhad Marasli – Autor im Gartenratgeber | Loni GalaBau" },
      {
        name: "description",
        content:
          "Die Ratgeber von Serhad Marasli bei Loni GalaBau: Entscheidungshilfen zu Gartenplanung, Pflaster, Rasen, Naturstein und Bewässerung.",
      },
      { name: "author", content: "Serhad Marasli" },
    ],
  }),
  component: Author,
});

function Author() {
  return (
    <PageShell>
      <div className="guides guide-wrap">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              mainEntity: {
                "@type": "Person",
                "@id": canonicalUrl("/autoren/serhad-marasli") + "#person",
                name: "Serhad Marasli",
                url: canonicalUrl("/autoren/serhad-marasli"),
              },
            }),
          }}
        />
        <header className="guide-index-intro">
          <span className="guide-kicker">Autor im Loni Gartenratgeber</span>
          <h1>Serhad Marasli</h1>
          <div className="guide-intro-bottom">
            <p>
              Hier finden Sie meine Beiträge zu Gartenplanung und Außenanlagen. Sie helfen dabei,
              Wünsche zu sortieren, Materialien einzuordnen und ein persönliches Projektgespräch
              vorzubereiten.
            </p>
          </div>
        </header>
        <section className="max-w-3xl text-lg leading-relaxed pb-16" aria-labelledby="redaktion">
          <h2 id="redaktion" className="text-3xl mb-5">
            Verständlich planen. Fundiert entscheiden.
          </h2>
          <p>
            Die Ratgeber verbinden konkrete Fragen von Gartenbesitzern mit fachlichen Grundlagen.
            Herangezogene Fachinformationen sind am jeweiligen Artikel verlinkt. Bilder stammen aus
            dem Bildarchiv von Loni GalaBau.
          </p>
          <p className="mt-5">
            Ein Artikel kann die Bedingungen auf Ihrem Grundstück nicht vollständig abbilden. Für
            ein konkretes Vorhaben besprechen wir daher Bestand, Nutzung und Leistungsumfang
            persönlich. Hinweise zu einem Beitrag erreichen uns unter{" "}
            <a href="mailto:info@loni-galabau.de" className="guide-text-link">
              info@loni-galabau.de
            </a>
            .
          </p>
        </section>
        <section className="guide-related" aria-labelledby="autor-beitraege">
          <div className="guide-section-heading">
            <h2 id="autor-beitraege">Meine Ratgeber</h2>
          </div>
          <div className="guide-grid">
            {guides.map((article) => (
              <GuideCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
