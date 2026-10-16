import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Droplets, Flower2, Phone, Sun } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import { canonicalUrl, ORGANIZATION_ID, publicPageSchema, safeJsonLd } from "@/lib/seo";
import { publicImageUrl } from "@/lib/public-image-url";
import "@/components/site/GreenRoof.css";

const PATH = "/dachbegruenung";
const IMAGE = "/images/dachbegruenung/sedumdach-illustration-1200.webp";
const ALT =
  "KI-Illustration einer Garage mit blühender Sedum-Dachbegrünung, Kiesrand und Holzfassade.";
const FAQS = [
  {
    question: "Wie ist eine Dachbegrünung aufgebaut?",
    answer:
      "Unter den Pflanzen liegen ein geeignetes Dachsubstrat sowie Filter-, Dränage- und Schutzlagen. Wurzelschutz und Dachabdichtung müssen dazu passen. Der konkrete Aufbau richtet sich nach Gebäude, Begrünungsziel und gewähltem System; gewöhnliche Gartenerde ist dafür kein pauschaler Ersatz.",
  },
  {
    question: "Kann ich mein Garagendach oder meinen Carport nachträglich begrünen lassen?",
    answer:
      "Das lässt sich erst nach Prüfung des Bestands beantworten. Entscheidend sind unter anderem Tragfähigkeit, Zustand und Wurzelschutz der Abdichtung, Dachneigung und Entwässerung. Auch ein bislang bekiestes Dach ist nicht automatisch geeignet. Nennen Sie uns den Projektort und die ungefähre Fläche; vorhandene Pläne und Fotos helfen, die nächsten Prüfungen einzugrenzen.",
  },
  {
    question: "Was ist der Unterschied zwischen extensiver und intensiver Dachbegrünung?",
    answer:
      "Eine extensive Dachbegrünung ist eine eher niedrig wachsende Vegetation, häufig mit Sedum, und benötigt vergleichsweise wenig Pflege. Ein intensiver Dachgarten bietet mehr Gestaltungsmöglichkeiten, verlangt aber meist einen stärkeren Aufbau, mehr Tragreserven, Bewässerung und Pflege. Welche Variante für Ihr Vorhaben infrage kommt und welche Arbeiten wir übernehmen können, klären wir individuell.",
  },
  {
    question: "Was kostet eine Dachbegrünung pro Quadratmeter?",
    answer:
      "Ein Quadratmeterpreis allein sagt wenig über den Gesamtaufwand aus. Fläche, gewünschte Bepflanzung, Aufbau, Dachzugang und Materialtransport beeinflussen die Kosten. Hinzu kommen gegebenenfalls Prüfungen und Vorarbeiten an Abdichtung oder Entwässerung. Wir besprechen zunächst Ihr Dach und halten den vereinbarten Leistungsumfang im Angebot fest.",
  },
  {
    question: "Wie viel Pflege braucht ein begrüntes Dach?",
    answer:
      "Auch eine extensive Begrünung ist nicht wartungsfrei. Pflanzenentwicklung, unerwünschter Bewuchs und freie Abläufe müssen regelmäßig kontrolliert werden. Der konkrete Pflege- und Bewässerungsbedarf hängt vom System, Standort und Entwicklungszustand ab. Ein sicherer Zugang für spätere Pflege gehört deshalb von Beginn an zur Planung.",
  },
  {
    question: "Bearbeitet Loni GalaBau auch Anfragen außerhalb von Hattersheim?",
    answer:
      "Ja. Von Hattersheim am Main aus besprechen wir Dachbegrünungsprojekte in Frankfurt, Wiesbaden, Mainz, Hofheim und dem weiteren Rhein-Main-Gebiet. Auch überregionale Vorhaben können Sie anfragen. Eignung, Leistungsumfang und Ausführungsmöglichkeiten prüfen wir für jedes Projekt gesondert.",
  },
];

export const Route = createFileRoute("/dachbegruenung")({
  head: () => ({
    meta: [
      { title: "Dachbegrünung Frankfurt & Rhein-Main | Loni GalaBau" },
      {
        name: "description",
        content:
          "Dachbegrünung in Frankfurt, Wiesbaden, Mainz & Hofheim anfragen. Loni GalaBau aus Hattersheim klärt Dacheignung, Möglichkeiten und Kosten für Ihr Projekt.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: canonicalUrl(publicImageUrl(IMAGE)) },
      { property: "og:image:alt", content: ALT },
      { name: "twitter:image", content: canonicalUrl(publicImageUrl(IMAGE)) },
      { name: "twitter:image:alt", content: ALT },
    ],
  }),
  component: GreenRoofPage,
});

function GreenRoofPage() {
  const base = publicPageSchema(PATH, "Dachbegrünung im Rhein-Main-Gebiet", "AboutPage");
  const schema = {
    ...base,
    "@graph": [
      ...base["@graph"],
      {
        "@type": "Service",
        "@id": canonicalUrl(PATH) + "#service",
        name: "Dachbegrünung – projektbezogene Beratung und Umsetzung",
        url: canonicalUrl(PATH),
        provider: { "@id": ORGANIZATION_ID },
        serviceType: "Dachbegrünung",
        description:
          "Möglichkeiten, Dacheignung und ausführbaren Leistungsumfang für Dachbegrünungsprojekte individuell klären.",
        areaServed: [
          "Frankfurt am Main",
          "Wiesbaden",
          "Mainz",
          "Hattersheim am Main",
          "Hofheim am Taunus",
        ].map((name) => ({ "@type": "City", name })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Dachbegrünung", item: canonicalUrl(PATH) },
        ],
      },
    ],
  };

  return (
    <PageShell transparentHeader>
      <article className="roof-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
        <section className="roof-hero" aria-labelledby="roof-title">
          <div className="roof-hero-image">
            <RoofPhoto name="sedumdach-illustration" alt={ALT} hero />
          </div>
          <div className="roof-container roof-hero-inner">
            <nav aria-label="Brotkrümelnavigation" className="roof-breadcrumb">
              <Link to="/">Startseite</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Dachbegrünung</span>
            </nav>
            <div className="roof-hero-copy">
              <span className="eyebrow eyebrow-bracket">FRANKFURT · RHEIN-MAIN</span>
              <h1 id="roof-title" className="display">
                Dachbegrünung.
              </h1>
              <p className="roof-hero-subtitle display">Mehr Grün. Auch oben.</p>
              <p className="roof-hero-description">
                Aus einer Dachfläche wird ein Stück Natur. Wir besprechen Ihre Ideen für Garage,
                Carport und Flachdach – und prüfen, was zu Ihrem Gebäude passt.
              </p>
              <div className="roof-actions">
                <a className="roof-button roof-button-white" href="#dach-anfragen">
                  Projekt anfragen <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a className="roof-text-link" href="#dach-moeglichkeiten">
                  Möglichkeiten entdecken <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
            <p className="roof-hero-caption">
              Gestaltungsidee · KI-Illustration, keine Projektreferenz
            </p>
          </div>
        </section>
        <div className="roof-benefits roof-container" aria-label="Dachbegrünung mit Loni">
          <div>
            <Flower2 aria-hidden="true" />
            <span>
              <strong>Mehr Natur</strong>
              <small>Direkt auf Ihrem Dach</small>
            </span>
          </div>
          <div>
            <Droplets aria-hidden="true" />
            <span>
              <strong>Wasser mitgedacht</strong>
              <small>Aufbau und Entwässerung zusammen planen</small>
            </span>
          </div>
          <div>
            <Phone aria-hidden="true" />
            <span>
              <strong>Persönlich besprechen</strong>
              <small>Aus Hattersheim am Main</small>
            </span>
          </div>
        </div>
        <section
          id="dach-moeglichkeiten"
          className="roof-photo-section roof-container"
          aria-labelledby="roof-photo-title"
        >
          <div className="roof-section-heading">
            <div>
              <span className="eyebrow eyebrow-bracket text-accent-ink">
                MÖGLICHKEITEN ENTDECKEN
              </span>
              <h2 id="roof-photo-title" className="display">
                Ihr Dach.
                <br />
                <span className="text-brand-muted">Ein neuer Blick.</span>
              </h2>
            </div>
            <p>
              Vom kleinen Gartenhaus bis zur großen Dachfläche: Entscheidend ist, was Ihr Dach
              mitbringt.
            </p>
          </div>
          <div className="roof-cards">
            {[
              {
                n: "01",
                tag: "KLEINE DACHFLÄCHEN",
                title: "Garage, Carport & Gartenhaus",
                image: "gartenhaus-visualisierung",
                alt: "KI-Visualisierung eines Gartenhauses mit Holzfassade und begrüntem Sedumdach.",
                text: "Auch kleine Dächer können Raum für Pflanzen bieten. Bei Garage, Carport und Gartenhaus prüfen wir zuerst Tragfähigkeit, Abdichtung und Dachneigung.",
              },
              {
                n: "02",
                tag: "BESTAND & NEUBAU",
                title: "Begrünung auf dem Flachdach",
                image: "flachdach-visualisierung",
                alt: "KI-Visualisierung einer Sedum-Dachbegrünung auf einem modernen Flachdach mit Kiesrand.",
                text: "Größere Flachdächer brauchen einen abgestimmten Aufbau. Abläufe, Randbereiche, Materialtransport und spätere Pflege gehören von Anfang an dazu.",
              },
              {
                n: "03",
                tag: "PFLANZEN & GESTALTUNG",
                title: "Extensiv mit Sedum",
                image: "sedum-visualisierung",
                alt: "KI-Visualisierung grüner und rötlicher Sedumpflanzen mit kleinen gelben Blüten.",
                text: "Niedrig wachsende Sedumpflanzen prägen viele extensive Gründächer. Welche Pflanzen passen, hängt vom Standort und Aufbau ab. Pflegeleicht heißt dabei nicht pflegefrei.",
              },
            ].map((item) => (
              <details className="roof-image-card" key={item.n}>
                <summary>
                  <RoofPhoto name={item.image} alt={item.alt} />
                  <span className="roof-card-top">
                    <span>{item.n}</span>
                    <span>{item.tag}</span>
                  </span>
                  <span className="roof-card-copy">
                    <span className="roof-card-title">{item.title}</span>
                    <span className="roof-card-action">
                      Das ist wichtig{" "}
                      <span className="roof-card-plus" aria-hidden="true">
                        +
                      </span>
                    </span>
                  </span>
                </summary>
                <div className="roof-card-detail">
                  <p>{item.text}</p>
                  <a className="roof-text-link" href="#dach-anfragen">
                    Ihr Dach besprechen <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </details>
            ))}
          </div>
          <p className="roof-photo-note">
            Für Loni erstellte KI-Visualisierungen – Gestaltungsideen, keine Projektreferenzen.{" "}
            <a href="#dach-bildnachweise">Zu den Bildern</a>
          </p>
        </section>
        <section className="roof-container roof-value-section" aria-labelledby="roof-value-title">
          <div className="roof-value-panel">
            <figure className="roof-value-photo">
              <RoofPhoto
                name="dachflaeche-visualisierung"
                alt="KI-Visualisierung eines begrünten Flachdachs mit Sedum und umlaufendem Kiesstreifen."
              />
              <figcaption>Ein begrüntes Flachdach · KI-Visualisierung</figcaption>
            </figure>
            <div className="roof-value-copy">
              <span className="eyebrow eyebrow-bracket">GUT FÜRS UMFELD</span>
              <h2 id="roof-value-title" className="display">
                Grün, das
                <br />
                <span>mehr kann.</span>
              </h2>
              <div className="roof-value-list">
                <div>
                  <Droplets aria-hidden="true" />
                  <div>
                    <h3>Regenwasser zurückhalten</h3>
                    <p>Pflanzen und Substrat können Wasser aufnehmen und den Abfluss verzögern.</p>
                  </div>
                </div>
                <div>
                  <Sun aria-hidden="true" />
                  <div>
                    <h3>Aufheizung abmildern</h3>
                    <p>Vegetation und Verdunstung können die Dachoberfläche im Sommer kühlen.</p>
                  </div>
                </div>
                <div>
                  <Flower2 aria-hidden="true" />
                  <div>
                    <h3>Lebensraum schaffen</h3>
                    <p>Eine passende Bepflanzung bietet Insekten Nahrung und neue Rückzugsorte.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="dach-eignung"
          className="roof-container roof-process"
          aria-labelledby="roof-process-title"
        >
          <div className="roof-section-heading">
            <div>
              <span className="eyebrow eyebrow-bracket text-accent-ink">
                VON DER IDEE ZUR UMSETZUNG
              </span>
              <h2 id="roof-process-title" className="display">
                Ein grünes Dach.
                <br />
                <span className="text-brand-muted">Gut vorbereitet.</span>
              </h2>
            </div>
            <p>Die Eignung und unseren Leistungsumfang klären wir für jedes Projekt individuell.</p>
          </div>
          <ol className="roof-steps">
            <li>
              <span className="roof-step-number">01</span>
              <h3>Ihr Dach kennenlernen</h3>
              <p>
                Ort, ungefähre Fläche und Dachart. Vorhandene Fotos und Pläne helfen beim ersten
                Gespräch.
              </p>
            </li>
            <li>
              <span className="roof-step-number">02</span>
              <h3>Voraussetzungen klären</h3>
              <p>
                Tragfähigkeit, Abdichtung, Entwässerung und Zugang. Erforderliche Prüfungen mit den
                zuständigen Fachleuten abstimmen.
              </p>
            </li>
            <li>
              <span className="roof-step-number">03</span>
              <h3>Umfang & Angebot abstimmen</h3>
              <p>
                Aufbau, Bepflanzung und ausführbare Arbeiten besprechen. Erst dann stehen Umfang und
                nächste Schritte fest.
              </p>
            </li>
          </ol>
          <a className="roof-button" href="#dach-anfragen">
            Ihr Vorhaben besprechen <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </section>
        <section className="roof-faq-section">
          <div className="roof-container roof-faq-grid">
            <div>
              <span className="eyebrow eyebrow-bracket text-accent-ink">HÄUFIGE FRAGEN</span>
              <h2 className="display">
                Kurz gefragt.
                <br />
                <span className="text-brand-muted">Klar erklärt.</span>
              </h2>
              <p>Aufbau, Kosten und Pflege – die wichtigsten Antworten zum Aufklappen.</p>
            </div>
            <div className="roof-faqs">
              {FAQS.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="dach-anfragen" className="roof-contact-section roof-container">
          <div className="roof-contact-grid">
            <div className="roof-contact-copy">
              <span className="eyebrow eyebrow-bracket text-accent-ink">
                IHR PROJEKT BEGINNT HIER
              </span>
              <h2 className="display">
                Ihr Dach.
                <br />
                <span className="text-brand-muted">Unser Gespräch.</span>
              </h2>
              <p>
                Sie möchten eine Dachbegrünung in Frankfurt, Wiesbaden, Mainz oder Hofheim anfragen?
                Von Hattersheim am Main aus besprechen wir Ihr Vorhaben persönlich.
              </p>
              <figure className="roof-team-photo">
                <ProjectImage
                  src="/images/projekte/loni-team-baustelle.webp"
                  alt="Das Team von Loni GalaBau gemeinsam auf einer Baustelle"
                  width={1448}
                  height={1086}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  loading="lazy"
                />
                <figcaption>Die Menschen hinter Loni GalaBau.</figcaption>
              </figure>
              <a className="roof-phone" href="tel:+4961909266134">
                <Phone size={20} aria-hidden="true" />
                06190 9266134 <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <details className="roof-places">
                <summary>
                  Weitere Orte & überregionale Projekte <span aria-hidden="true">+</span>
                </summary>
                <p>
                  Auch in Eschborn, Bad Soden, Kelkheim, Flörsheim, Hochheim und Rüsselsheim können
                  Sie Ihr Vorhaben anfragen. Überregional sind wir aus Hattersheim am Main in ganz
                  Deutschland gut vernetzt.
                </p>
              </details>
              <Link className="roof-contact-membership" to="/fachverband-mitgliedschaft">
                Mitglied im Fachverband Garten-, Landschafts- und Sportplatzbau Hessen-Thüringen{" "}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <ServiceMiniContact
              serviceTitle="Dachbegrünung"
              messagePlaceholder="Projektort, ungefähre Dachfläche und Dachart – was haben Sie vor?"
            />
          </div>
        </section>
        <aside id="dach-bildnachweise" className="roof-sources roof-container">
          <details>
            <summary>Zu den Bildern & fachliche Grundlagen</summary>
            <p>
              Die Dach- und Pflanzenmotive wurden mit KI für Loni GalaBau erstellt. Sie zeigen
              Gestaltungsideen und keine ausgeführten Kundenprojekte. Das Teamfoto stammt von Loni
              GalaBau.
            </p>
            <p>
              Fachliche Grundlagen:{" "}
              <a
                href="https://www.gebaeudegruen.info/wissen-und-ressourcen/gebaeudebegruenung/dachbegruenung/planungshinweise/"
                target="_blank"
                rel="noreferrer"
              >
                BuGG-Planungshinweise
              </a>{" "}
              ·{" "}
              <a
                href="https://www.bmigroup.com/de/fachwissen/extensive-intensive-begruenung/"
                target="_blank"
                rel="noreferrer"
              >
                Begrünungsarten bei BMI
              </a>{" "}
              ·{" "}
              <a
                href="https://www.abg.de/planen-und-bauen/dachbegruenung/"
                target="_blank"
                rel="noreferrer"
              >
                Grüne Dächer bei ABG Frankfurt
              </a>
              .
            </p>
          </details>
        </aside>
      </article>
    </PageShell>
  );
}

function RoofPhoto({ name, alt, hero = false }: { name: string; alt: string; hero?: boolean }) {
  const widths = hero ? [480, 800, 1200, 1536] : [480, 800, 1200];
  const sizes = hero
    ? "100vw"
    : "(min-width: 1560px) 600px, (min-width: 768px) 45vw, calc(100vw - 48px)";
  const srcSet = (format: string) =>
    widths
      .map(
        (width) =>
          `${publicImageUrl(`/images/dachbegruenung/${name}-${width}.${format}`)} ${width}w`,
      )
      .join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        src={publicImageUrl(`/images/dachbegruenung/${name}-1200.webp`)}
        srcSet={srcSet("webp")}
        sizes={sizes}
        width={1200}
        height={800}
        alt={alt}
        loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
