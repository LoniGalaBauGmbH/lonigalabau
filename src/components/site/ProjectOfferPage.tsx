import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Check, Phone } from "lucide-react";
import { PageShell } from "./PageShell";
import { ProjectImage } from "./ProjectImage";
import { ExpressInquiryForm } from "./ExpressInquiryForm";
import { projectPhotos } from "@/lib/project-photos";
import { canonicalUrl, ORGANIZATION_ID, publicPageSchema, safeJsonLd } from "@/lib/seo";
import type { ProjectOffer } from "@/lib/project-offers";
import "./ProjectOfferPage.css";

export function ProjectOfferPage({ content }: { content: ProjectOffer }) {
  const hero = projectPhotos[content.image];
  const detail = projectPhotos[content.detail.image];
  const base = publicPageSchema(content.path, content.label, "WebPage");
  const schema = {
    ...base,
    "@graph": [
      ...base["@graph"],
      {
        "@type": "Service",
        "@id": canonicalUrl(content.path) + "#service",
        name: content.label,
        description: content.description,
        url: canonicalUrl(content.path),
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Country", name: "Deutschland" },
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
            name: content.label,
            item: canonicalUrl(content.path),
          },
        ],
      },
    ],
  };
  return (
    <PageShell>
      <article className="offer-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
        <header className="offer-wrap offer-hero">
          <div className="offer-hero-copy">
            <nav className="offer-breadcrumb" aria-label="Brotkrümelnavigation">
              <Link to="/leistungen">Leistungen</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{content.label}</span>
            </nav>
            <span className="eyebrow eyebrow-bracket">Von der Idee zur fertigen Fläche</span>
            <h1 className="display">{content.title}</h1>
            <p className="offer-intro">{content.intro}</p>
            <p className="offer-location">
              Aus Hattersheim am Main · Deutschlandweit für Sie im Einsatz
            </p>
            <div className="offer-actions">
              <a className="offer-button" href="#projekt-anfragen">
                Projekt anfragen <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="offer-link" href="#moeglichkeiten">
                Mehr erfahren <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="offer-hero-photo">
            <ProjectImage
              src={hero.src}
              alt={hero.alt}
              fetchPriority="high"
              sizes="(max-width: 800px) calc(100vw - 40px), 45vw"
            />
            <figcaption>{hero.alt} · Einblick in unsere Arbeiten</figcaption>
          </figure>
        </header>

        <section
          className="offer-wrap offer-section"
          id="moeglichkeiten"
          aria-labelledby="offer-cases-title"
        >
          <span className="eyebrow eyebrow-bracket">Ihr Ausgangspunkt</span>
          <h2 className="display" id="offer-cases-title">
            Was möchten Sie verändern?
          </h2>
          <div className="offer-cases">
            {content.cases.map((item, index) => (
              <div key={item.title}>
                <span className="offer-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="offer-wrap offer-detail offer-section"
          aria-labelledby="offer-detail-title"
        >
          <figure>
            <ProjectImage
              src={detail.src}
              alt={detail.alt}
              loading="lazy"
              sizes="(max-width: 800px) calc(100vw - 40px), 45vw"
            />
            <figcaption>{detail.alt}</figcaption>
          </figure>
          <div>
            <span className="eyebrow eyebrow-bracket">Auf die Details kommt es an</span>
            <h2 className="display" id="offer-detail-title">
              {content.detail.title}
            </h2>
            <p>{content.detail.text}</p>
            <ul className="offer-checklist">
              {content.detail.points.map((point) => (
                <li key={point}>
                  <Check size={19} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="offer-wrap offer-section" aria-labelledby="offer-choice-title">
          <h2 className="display" id="offer-choice-title">
            {content.choiceHeading}
          </h2>
          <div className="offer-choices">
            {content.choices.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="offer-wrap offer-section" aria-labelledby="offer-cost-title">
          <div className="offer-cost">
            <div>
              <span className="eyebrow eyebrow-bracket">
                Ein Angebot, das zu Ihrem Vorhaben passt
              </span>
              <h2 className="display" id="offer-cost-title">
                Was bestimmt die Kosten?
              </h2>
              <p>{content.costIntro}</p>
              <p>
                Wir halten fest, welche Arbeiten enthalten sind und welche Punkte noch geklärt
                werden müssen. So können Sie Angebote auf derselben Grundlage vergleichen.
              </p>
            </div>
            <div>
              <h3>Diese Positionen gemeinsam klären</h3>
              <ol>
                {content.costs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="offer-wrap offer-section" aria-labelledby="offer-process-title">
          <span className="eyebrow eyebrow-bracket">Der Weg zur Umsetzung</span>
          <h2 className="display" id="offer-process-title">
            Persönlich abgestimmt. Schritt für Schritt.
          </h2>
          <ol className="offer-process">
            {content.steps.map((item, index) => (
              <li key={item.title}>
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="offer-wrap offer-section offer-faq" aria-labelledby="offer-faq-title">
          <div>
            <span className="eyebrow eyebrow-bracket">Vor dem ersten Spatenstich</span>
            <h2 className="display" id="offer-faq-title">
              Ihre Fragen.
            </h2>
            <p>
              Jedes Grundstück ist anders. Hier finden Sie Antworten für die ersten Entscheidungen.
            </p>
          </div>
          <div>
            {content.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="offer-wrap offer-section offer-request"
          id="projekt-anfragen"
          aria-labelledby="offer-request-title"
        >
          <div>
            <span className="eyebrow eyebrow-bracket">
              Lassen Sie uns Ihr Vorhaben kennenlernen
            </span>
            <h2 className="display" id="offer-request-title">
              Drei Fotos. Ein guter Anfang.
            </h2>
            <p>
              Ort, ungefähre Größe und Ihre Wünsche reichen für den ersten Kontakt. Diese Bilder
              helfen uns, die nächsten Schritte vorzubereiten:
            </p>
            <ul className="offer-checklist">
              {content.photos.map((point) => (
                <li key={point}>
                  <Check size={19} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p>
              Fotos oder Skizzen können Sie im dritten Schritt der Anfrage ergänzen. Auch ohne
              Anhänge können Sie Ihr Vorhaben anfragen.
            </p>
            <a className="offer-link" href="tel:+4961909266134">
              <Phone size={17} aria-hidden="true" />
              06190 9266134
            </a>
          </div>
          <ExpressInquiryForm
            key={content.path}
            variant="compact"
            heading={`${content.label} anfragen`}
            initialService="Pflasterarbeiten"
            descriptionPlaceholder={content.request}
          />
        </section>

        <aside className="offer-wrap offer-related" aria-label="Passende Leistungen und Ratgeber">
          <h2 className="display">Ihr Projekt weiterdenken.</h2>
          <ul>
            {content.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>
                  {link.label}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </article>
    </PageShell>
  );
}
