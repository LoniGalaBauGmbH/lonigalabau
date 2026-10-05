import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, MapPin, Phone } from "lucide-react";
import { PageShell } from "./PageShell";
import { RegionalProjectGallery } from "./RegionalProjectGallery";
import { RegionalMap } from "./RegionalMap";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import { getRegion, regionImage, regions, type RegionPage } from "@/lib/regions";
import "./RegionalLandingPage.css";

const serviceSlugs = new Set([
  "gartengestaltung",
  "pflasterarbeiten",
  "natursteinarbeiten",
  "zaunarbeiten",
  "rasenanlagen",
  "bewaesserungsanlagen",
  "erdarbeiten",
  "entwaesserung",
]);

function RegionalText({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of children.matchAll(/\[([^\]\n]+)\]\(\/leistungen\/([a-z-]+)\)/g)) {
    const index = match.index ?? 0;
    parts.push(children.slice(cursor, index));
    parts.push(
      serviceSlugs.has(match[2]) ? (
        <Link key={index} to="/leistungen/$slug" params={{ slug: match[2] }}>
          {match[1]}
        </Link>
      ) : (
        match[0]
      ),
    );
    cursor = index + match[0].length;
  }
  parts.push(children.slice(cursor));
  return <>{parts}</>;
}

function RegionalImage({
  page,
  sizes,
  priority = false,
}: {
  page: RegionPage;
  sizes: string;
  priority?: boolean;
}) {
  const image = regionImage(page);
  return (
    <picture>
      <source type="image/avif" srcSet={image.avif} sizes={sizes} />
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <img
        src={image.src}
        srcSet={image.webp}
        sizes={sizes}
        alt={page.imageAlt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

export function RegionalLandingPage({ page }: { page: RegionPage }) {
  const related = page.relatedSlugs.map(getRegion).slice(0, 3);
  return (
    <PageShell>
      <article className="regions" lang="de">
        <header className="region-wrap region-header">
          <nav aria-label="Brotkrümelnavigation" className="region-breadcrumb">
            <Link to="/">Startseite</Link>
            <span aria-hidden="true">/</span>
            <a href="/einsatzgebiete">Einsatzgebiete</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.city}</span>
          </nav>
          <div className="region-hero">
            <div className="region-hero-copy">
              <span className="region-kicker">{page.kicker}</span>
              <h1>{page.h1}</h1>
              <p className="region-lead">
                <RegionalText>{page.intro[0]}</RegionalText>
              </p>
              <a href="#anfrage" className="region-button">
                Projekt anfragen <ArrowUpRight aria-hidden="true" size={19} />
              </a>
              <a href="#projektbilder" className="region-hero-gallery-link region-text-link">
                Projektbilder ansehen <ArrowUpRight aria-hidden="true" size={17} />
              </a>
              <div className="region-districts">
                <MapPin aria-hidden="true" size={19} />
                <p>{page.districts.join(" · ")}</p>
              </div>
            </div>
            <figure className="region-hero-image">
              <RegionalImage
                page={page}
                sizes="(max-width: 800px) calc(100vw - 36px), (max-width: 1328px) 44vw, 580px"
                priority
              />
              <figcaption>{page.imageCaption}</figcaption>
            </figure>
          </div>
        </header>

        <div className="region-wrap region-body">
          <aside className="region-aside">
            <div className="region-aside-inner">
              <nav aria-label="Inhalt dieser Seite">
                <span className="region-kicker">Ihr Vorhaben</span>
                <ul>
                  {page.sections.map((section, index) => (
                    <li key={section.heading}>
                      <a href={`#abschnitt-${index + 1}`}>{section.heading}</a>
                    </li>
                  ))}
                  <li>
                    <a href="#fragen">Häufige Fragen</a>
                  </li>
                  <li>
                    <a href="#projektbilder">Einblicke in unsere Arbeiten</a>
                  </li>
                  <li>
                    <a href="#karte">Ihr Ort auf der Karte</a>
                  </li>
                </ul>
              </nav>
              <div className="region-local-note">
                <MapPin aria-hidden="true" size={21} />
                <p>{page.focus}</p>
                <p>
                  Unser Firmensitz ist Hattersheim am Main. Wir gestalten Außenanlagen
                  deutschlandweit – auch in {page.city}.
                </p>
              </div>
            </div>
          </aside>

          <div className="region-prose">
            {page.intro.length > 1 && (
              <div className="region-introduction">
                {page.intro.slice(1).map((paragraph) => (
                  <p key={paragraph}>
                    <RegionalText>{paragraph}</RegionalText>
                  </p>
                ))}
              </div>
            )}
            {page.sections.map((section, index) => (
              <section key={section.heading} id={`abschnitt-${index + 1}`}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    <RegionalText>{paragraph}</RegionalText>
                  </p>
                ))}
              </section>
            ))}
            <section className="region-checklist" aria-labelledby="vorbereitung">
              <span className="region-kicker">Gut vorbereitet</span>
              <h2 id="vorbereitung">Für unser erstes Gespräch</h2>
              <ul>
                {page.checklist.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" size={18} />
                    <span>
                      <RegionalText>{item}</RegionalText>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="region-faq" id="fragen" aria-labelledby="region-faq-title">
              <span className="region-kicker">Noch eine Frage?</span>
              <h2 id="region-faq-title">Gartenbau in {page.shortName}: häufige Fragen</h2>
              {page.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>
                    <RegionalText>{faq.answer}</RegionalText>
                  </p>
                </details>
              ))}
            </section>
          </div>
        </div>

        <RegionalProjectGallery key={page.slug} slug={page.slug} />
        <RegionalMap key={page.slug + "-map"} city={page.city} />

        <section className="region-wrap region-contact" aria-labelledby="anfrage-title">
          <div className="region-contact-copy">
            <span className="region-kicker">Von der Idee zur Umsetzung</span>
            <h2 id="anfrage-title">
              Ihr Gartenprojekt in {page.shortName} beginnt mit einem Gespräch.
            </h2>
            <p>
              Erzählen Sie uns, was Sie verändern möchten. Die Lage Ihres Grundstücks, einige Fotos
              und Ihre Wünsche helfen uns, das Vorhaben einzuordnen und die nächsten Schritte mit
              Ihnen zu besprechen.
            </p>
            <a href="tel:+4961909266134" className="region-phone">
              <Phone aria-hidden="true" size={20} /> 06190 9266134
            </a>
            <span className="region-contact-note">
              Loni GalaBau · Firmensitz Hattersheim am Main
            </span>
          </div>
          <div className="region-contact-form" id="anfrage">
            <ServiceMiniContact
              key={page.slug}
              serviceTitle={`Gartenbau in ${page.city}`}
              messagePlaceholder={`Was möchten Sie in ${page.city} verändern?`}
            />
          </div>
        </section>

        <section className="region-wrap region-related" aria-labelledby="region-related-title">
          <div className="region-section-heading">
            <h2 id="region-related-title">Auch in Ihrer Umgebung</h2>
            <a href="/einsatzgebiete" className="region-text-link">
              Zur regionalen Übersicht <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
          <div className="region-related-grid">
            {related.map((item) => (
              <a className="region-related-link" key={item.slug} href={`/${item.slug}`}>
                <span>Gartenbau</span>
                <h3>{item.city}</h3>
                <ArrowUpRight aria-hidden="true" size={22} />
              </a>
            ))}
          </div>
        </section>
      </article>
    </PageShell>
  );
}

export function RegionsOverviewPage() {
  return (
    <PageShell>
      <div className="regions" lang="de">
        <header className="region-wrap region-overview-header">
          <nav aria-label="Brotkrümelnavigation" className="region-breadcrumb">
            <Link to="/">Startseite</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Einsatzgebiete</span>
          </nav>
          <span className="region-kicker">Loni GalaBau · Von Hattersheim aus</span>
          <h1>Gartenbau im Main-Taunus-Kreis und Frankfurt-West</h1>
          <div className="region-overview-lead">
            <p>
              Jeder Ort hat seinen eigenen Charakter. Und jedes Grundstück braucht einen eigenen
              Plan. Entdecken Sie unsere Ansätze für Gärten und Außenanlagen im Main-Taunus-Kreis,
              im Frankfurter Westen und im benachbarten Kelsterbach.
            </p>
            <a href="#orte" className="region-text-link">
              Ihren Ort entdecken <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
          <p className="region-scope-note">
            Diese Orte sind regionale Beispiele unseres Angebots. Loni GalaBau arbeitet
            deutschlandweit; unser Firmensitz ist Hattersheim am Main.
          </p>
        </header>

        <section className="region-wrap region-overview" id="orte" aria-labelledby="orte-title">
          <div className="region-section-heading">
            <h2 id="orte-title">Ihr Ort. Ihr Vorhaben.</h2>
            <p>Planung und Handwerk für Garten, Hof und Einfahrt.</p>
          </div>
          <div className="region-card-grid">
            {regions.map((page) => (
              <article className="region-card" key={page.slug}>
                <a href={`/${page.slug}`} className="region-card-link">
                  <div className="region-card-image">
                    <RegionalImage
                      page={page}
                      sizes="(max-width: 600px) calc(100vw - 36px), (max-width: 1100px) 45vw, (max-width: 1328px) 30vw, 405px"
                    />
                    {page.slug === "gartenbau-hattersheim" && (
                      <span className="region-base-badge">Unser Firmensitz</span>
                    )}
                  </div>
                  <div className="region-card-heading">
                    <h3>{page.city}</h3>
                    <ArrowUpRight aria-hidden="true" size={22} />
                  </div>
                  <p>{page.focus}</p>
                  <span className="region-card-read">Gartenbau in {page.shortName}</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <RegionalProjectGallery slug="gartenbau-hattersheim" />

        <section className="region-wrap region-contact" aria-labelledby="anfrage-title">
          <div className="region-contact-copy">
            <span className="region-kicker">Wir hören uns Ihre Ideen an</span>
            <h2 id="anfrage-title">Was möchten Sie draußen verändern?</h2>
            <p>
              Ein neuer Garten, eine erneuerte Einfahrt oder eine Außenanlage für Ihr Unternehmen:
              Schildern Sie uns Ihr Vorhaben und nennen Sie den Projektort. Wir besprechen mit
              Ihnen, wie es weitergehen kann.
            </p>
            <Link to="/leistungen" className="region-text-link">
              Unsere Leistungen kennenlernen <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            <a href="tel:+4961909266134" className="region-phone">
              <Phone aria-hidden="true" size={20} /> 06190 9266134
            </a>
          </div>
          <div className="region-contact-form" id="anfrage">
            <ServiceMiniContact serviceTitle="Garten- und Landschaftsbau" />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
