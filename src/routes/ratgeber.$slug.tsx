import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { GuideCard } from "@/components/site/GuideCard";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import { guides, guideDate, guideSchema, serviceNames } from "@/lib/ratgeber";
import { safeJsonLd } from "@/lib/seo";
import "@/components/site/Ratgeber.css";

export const Route = createFileRoute("/ratgeber/$slug")({
  loader: ({ params }) => {
    const article = guides.find((item) => item.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.metaTitle ?? "Ratgeber nicht gefunden | Loni GalaBau" },
      {
        name: "description",
        content:
          loaderData?.metaDescription ?? "Entdecken Sie unsere Ratgeber rund um Ihren Garten.",
      },
      { property: "og:type", content: "article" },
      { name: "author", content: "Serhad Marasli" },
    ],
  }),
  component: Article,
  notFoundComponent: () => (
    <PageShell>
      <div className="guide-wrap guides guide-not-found">
        <h1>Ratgeber nicht gefunden</h1>
        <p>Dieser Beitrag ist unter dieser Adresse nicht verfügbar.</p>
        <Link to="/ratgeber" className="guide-button">
          Zur Ratgeberübersicht
        </Link>
      </div>
    </PageShell>
  ),
});

function Article() {
  const article = Route.useLoaderData();
  const related = guides
    .filter((item) => item.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.relatedServiceSlugs.some((slug) => article.relatedServiceSlugs.includes(slug))) -
        Number(a.relatedServiceSlugs.some((slug) => article.relatedServiceSlugs.includes(slug))),
    )
    .slice(0, 3);
  return (
    <PageShell>
      <article className="guides">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(guideSchema(article)) }}
        />
        <header className="guide-article-header guide-wrap">
          <nav aria-label="Brotkrümelnavigation" className="guide-breadcrumb">
            <Link to="/">Startseite</Link>
            <span aria-hidden="true">/</span>
            <Link to="/ratgeber">Ratgeber</Link>
            <span aria-hidden="true">/</span>
            <span>{article.category}</span>
          </nav>
          <div className="guide-kicker">{article.category}</div>
          <h1>{article.title}</h1>
          <p className="guide-lead">{article.excerpt}</p>
          <div className="guide-byline">
            <Link to="/autoren/serhad-marasli">Von Serhad Marasli</Link>
            <time dateTime={article.publishedAt}>{guideDate(article.publishedAt)}</time>
            <span>{article.readingMinutes} Min. Lesezeit</span>
          </div>
        </header>
        <figure className="guide-hero guide-wrap">
          <ProjectImage
            src={article.image}
            alt={article.imageCaption}
            width={1200}
            height={900}
            fetchPriority="high"
            sizes="(max-width: 1400px) 100vw, 1280px"
          />
          <figcaption>{article.imageCaption} Aufnahme aus unserem Bildarchiv.</figcaption>
        </figure>
        <div className="guide-body-layout guide-wrap">
          <aside className="guide-toc">
            <nav aria-label="Inhaltsverzeichnis">
              <p>In diesem Ratgeber</p>
              <ol>
                {article.sections.map((section, i) => (
                  <li key={section.heading}>
                    <a href={`#abschnitt-${i + 1}`}>{section.heading}</a>
                  </li>
                ))}
              </ol>
              <a href="#anfrage" className="guide-text-link">
                Projekt besprechen
              </a>
            </nav>
          </aside>
          <div className="guide-prose">
            {article.sections.map((section, i) => (
              <section key={section.heading} id={`abschnitt-${i + 1}`}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.checklist && (
                  <ul className="guide-checklist">
                    {section.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <section className="guide-faq" aria-labelledby="fragen">
              <h2 id="fragen">Häufige Fragen</h2>
              {article.faqs.map((faq) => (
                <details key={faq.q}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </section>
            <section className="guide-services" aria-labelledby="leistungen">
              <h2 id="leistungen">Passende Leistungen</h2>
              <p>Für die Umsetzung Ihres Projekts – deutschlandweit:</p>
              <div>
                {article.relatedServiceSlugs.map((slug) => (
                  <Link key={slug} to="/leistungen/$slug" params={{ slug }}>
                    {serviceNames[slug]}
                  </Link>
                ))}
              </div>
            </section>
            <details className="guide-sources">
              <summary>Fachliche Quellen &amp; weitere Informationen</summary>
              <p>
                Grundlagen für diesen Ratgeber. Die konkrete Ausführung wird an Ihr Grundstück
                angepasst.
              </p>
              <ul>
                {article.sourceURLs.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {new URL(url).hostname.replace(/^www\./, "")} – Fachinformation
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
        <section
          className="guide-contact guide-wrap"
          id="anfrage"
          aria-labelledby="article-contact-title"
        >
          <div>
            <span className="guide-kicker">Persönlich weiterplanen</span>
            <h2 id="article-contact-title">{article.cta.heading}</h2>
            <p>{article.cta.text}</p>
            <a href="tel:+4961909266134" className="guide-text-link">
              Direkt anrufen: 06190 9266134
            </a>
          </div>
          <ServiceMiniContact
            key={article.slug}
            serviceTitle={serviceNames[article.relatedServiceSlugs[0]]}
          />
        </section>
      </article>
      <section className="guides guide-wrap guide-related" aria-labelledby="weiterlesen">
        <div className="guide-section-heading">
          <h2 id="weiterlesen">Auch gut zu wissen.</h2>
          <Link to="/ratgeber" className="guide-text-link">
            Alle Ratgeber
          </Link>
        </div>
        <div className="guide-grid">
          {related.map((item) => (
            <GuideCard key={item.slug} article={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
