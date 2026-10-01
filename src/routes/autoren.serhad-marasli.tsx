import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { GuideCard } from "@/components/site/GuideCard";
import { guides } from "@/lib/guide-index";
import {
  canonicalUrl,
  editorialAuthorSchema,
  organizationSchema,
  WEBSITE_ID,
  safeJsonLd,
} from "@/lib/seo";
import "@/components/site/Ratgeber.css";

export const Route = createFileRoute("/autoren/serhad-marasli")({
  head: () => ({
    meta: [
      { title: "Über unsere Ratgeber | Loni GalaBau" },
      {
        name: "description",
        content:
          "Hintergründe zu den Ratgebern von Loni GalaBau: verständliche Informationen zu Gartenplanung, Pflaster, Rasen, Naturstein und Bewässerung.",
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
              "@graph": [
                organizationSchema(),
                {
                  "@type": "ProfilePage",
                  "@id": canonicalUrl("/autoren/serhad-marasli") + "#webpage",
                  url: canonicalUrl("/autoren/serhad-marasli"),
                  name: "Über unsere Ratgeber | Loni GalaBau",
                  inLanguage: "de-DE",
                  isPartOf: { "@id": WEBSITE_ID },
                  mainEntity: editorialAuthorSchema(),
                },
              ],
            }),
          }}
        />
        <header className="guide-index-intro">
          <span className="guide-kicker">Loni GalaBau</span>
          <h1>Über unsere Ratgeber.</h1>
          <div className="guide-intro-bottom">
            <p>
              Unsere Beiträge zu Gartenplanung und Außenanlagen helfen dabei, Wünsche zu sortieren,
              Materialien einzuordnen und ein persönliches Projektgespräch vorzubereiten.
            </p>
          </div>
          <p className="mt-6 text-sm leading-relaxed">
            Autor: Serhad Marasli · Bau- &amp; Operations Manager bei Loni GalaBau
          </p>
        </header>
        <section className="max-w-3xl text-lg leading-relaxed pb-16" aria-labelledby="redaktion">
          <h2 id="redaktion" className="text-3xl mb-5">
            Verständlich planen. Fundiert entscheiden.
          </h2>
          <p>
            Die Ratgeber verbinden konkrete Fragen von Gartenbesitzern mit fachlichen Grundlagen.
            Herangezogene Fachinformationen sind am jeweiligen Artikel verlinkt. Bilder stammen aus
            dem Bildarchiv von Loni GalaBau und führen zu den passenden Projektgalerien. Die dort
            sichtbaren Arbeiten veranschaulichen Materialien und Gartensituationen; konkrete Kosten
            und Ausführungsdetails werden für jedes Vorhaben gesondert geklärt.
          </p>
          <p className="mt-5">
            Wir arbeiten deutschlandweit, mit Firmensitz in Hattersheim am Main bei Frankfurt.
            Fachliche Ergänzungen an den Beiträgen werden mit einem sichtbaren Aktualisierungsdatum
            kenntlich gemacht.
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
            <h2 id="autor-beitraege">Unsere Ratgeber</h2>
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
