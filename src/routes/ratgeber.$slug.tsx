import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { GuideCard } from "@/components/site/GuideCard";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { guides, guideDate, guideSchema, serviceNames } from "@/lib/ratgeber";
import { canonicalUrl, safeJsonLd } from "@/lib/seo";
import { publicImageUrl } from "@/lib/public-image-url";
import "@/components/site/Ratgeber.css";

function sourceLabel(url: string) {
  if (url.includes("GranitAussen")) return "Lithofin: Granit außen reinigen, schützen und pflegen";
  if (url.includes("KalksteinAussen"))
    return "Lithofin: Kalkstein außen reinigen, schützen und pflegen";
  if (url.includes("SandsteinAussen"))
    return "Lithofin: Sandstein außen reinigen, schützen und pflegen";
  return `${new URL(url).hostname.replace(/^www\./, "")} – Fachinformation`;
}

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
      ...(loaderData
        ? [
            { property: "og:image", content: canonicalUrl(publicImageUrl(loaderData.image)) },
            { name: "twitter:image", content: canonicalUrl(publicImageUrl(loaderData.image)) },
            { property: "og:image:alt", content: loaderData.imageCaption },
          ]
        : []),
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
            <span>
              Veröffentlicht{" "}
              <time dateTime={article.publishedAt}>{guideDate(article.publishedAt)}</time>
            </span>
            {article.updatedAt !== article.publishedAt && (
              <span>
                Aktualisiert{" "}
                <time dateTime={article.updatedAt}>{guideDate(article.updatedAt)}</time>
              </span>
            )}
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
          <figcaption>
            {article.imageCaption} Aufnahme aus unserem Bildarchiv.
            {article.projectExample && (
              <>
                {" "}
                <Link to="/projekte/$id" params={{ id: article.projectExample.projectId }}>
                  Zur Projektgalerie
                </Link>
              </>
            )}
          </figcaption>
        </figure>
        <div className="guide-body-layout guide-wrap">
          <aside className="guide-toc">
            <nav aria-label="Inhaltsverzeichnis">
              <p>In diesem Ratgeber</p>
              <ol>
                {article.takeaways && (
                  <li>
                    <a href="#kurzueberblick">Kurzüberblick</a>
                  </li>
                )}
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
            {article.takeaways && (
              <section id="kurzueberblick" className="guide-key-points">
                <h2>Das Wichtigste vorab</h2>
                <ul>
                  {article.takeaways.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            )}
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
                {section.comparison && (
                  <div
                    className="guide-comparison"
                    role="region"
                    aria-label={section.comparison.caption}
                  >
                    <Table tabIndex={0} aria-label={section.comparison.caption}>
                      <TableCaption>{section.comparison.caption}</TableCaption>
                      <TableHeader>
                        <TableRow>
                          {section.comparison.columns.map((column) => (
                            <TableHead scope="col" key={column}>
                              {column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {section.comparison.rows.map((row) => (
                          <TableRow key={row[0]}>
                            <TableHead scope="row">{row[0]}</TableHead>
                            {row.slice(1).map((cell, j) => (
                              <TableCell key={j}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {section.references && (
                  <p className="guide-section-sources">
                    Fachliche Grundlagen:{" "}
                    {section.references.map((source, j) => (
                      <span key={source.url}>
                        {j > 0 && " · "}
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.label}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </section>
            ))}
            {article.projectExample && (
              <section className="guide-project-example" aria-labelledby="projektbezug">
                <span className="guide-kicker">Aus unserem Bildarchiv</span>
                <h2 id="projektbezug">{article.projectExample.title}</h2>
                <p>{article.projectExample.description}</p>
                <Link
                  className="guide-text-link"
                  to="/projekte/$id"
                  params={{ id: article.projectExample.projectId }}
                >
                  {article.projectExample.linkLabel}
                </Link>
              </section>
            )}
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
                      {sourceLabel(url)}
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
