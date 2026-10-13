import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Phone, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CisternIllustration } from "@/components/site/CisternIllustration";
import { CisternOfferCheck } from "@/components/site/CisternOfferCheck";
import { ProjectImage } from "@/components/site/ProjectImage";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { canonicalUrl, publicPageSchema, safeJsonLd } from "@/lib/seo";
import { publicImageUrl } from "@/lib/public-image-url";

const PATH = "/zisterne-einbauen-lassen";
const PREVIEW_IMAGE =
  "https://www.loni-galabau.de/__public-assets/images/zisternen/zisterne-garten-schnitt-ki-v2-1200.webp";
const IMAGE_DESCRIPTION =
  "KI-generierte Schnittillustration: gestalteter Garten mit unterirdischer Regenwasserzisterne und technischen Anschlüssen.";
const PHOTO_SIZES = "(min-width: 1536px) 670px, (min-width: 1024px) 45vw, calc(100vw - 48px)";

const PLOT_SITUATIONS = [
  {
    title: "Neubau oder Gartenumbau",
    points: [
      "Baugrube und Leitungen vor den neuen Wegen und Beeten einplanen.",
      "Zufahrt, Stellplatz für Maschinen und Platz für Aushub freihalten.",
    ],
  },
  {
    title: "Fertiger Garten: Zisterne nachrüsten",
    points: [
      "Engstellen auf dem Weg zum Einbauplatz zeigen und ausmessen.",
      "Festhalten, welche Pflanzen und Beläge erhalten oder wiederhergestellt werden sollen.",
    ],
  },
  {
    title: "Einbau unter Einfahrt oder Stellplatz",
    points: [
      "Angeben, welche Fahrzeuge die Fläche später nutzen sollen.",
      "Tank, Schacht und Abdeckung für diese Belastung gemeinsam auswählen.",
    ],
  },
];

const WATERING_OPTIONS = [
  {
    title: "Gießhahn & Gartenschlauch",
    text: "Wo soll der Wasserhahn stehen, und wie weit reichen Sie von dort mit dem Schlauch? Diese Wege bestimmen die Lage der Entnahmestelle und die erforderliche Förderleistung mit.",
  },
  {
    title: "Automatische Bewässerung",
    text: "Welche Beete oder Rasenflächen werden versorgt, und welche Zonen laufen gleichzeitig? Tropfschläuche und Regner haben unterschiedliche Anforderungen an Wassermenge und Druck.",
  },
];

const MANUFACTURERS = [
  {
    name: "GRAF",
    logo: "/images/zisternen/hersteller/graf-logo.jpg",
    logoWidth: 500,
    logoHeight: 500,
    logoClassName: "h-auto w-20 max-w-full",
    href: "https://www.graf.info/de/regenwassernutzung-unterirdisch/regenwassertanks/flachtank-platin.html",
  },
  {
    name: "REWATEC",
    logo: "/images/zisternen/hersteller/rewatec-logo.png",
    logoWidth: 2216,
    logoHeight: 600,
    logoClassName: "h-auto w-[100px] max-w-full",
    href: "https://www.premiertechaqua.com/de-de/regenwasser/regenwasser-komplettanlagen",
  },
  {
    name: "Mall",
    logo: "/images/zisternen/hersteller/mall-logo.svg",
    logoWidth: 161,
    logoHeight: 60,
    logoClassName: "h-auto w-[90px] max-w-full",
    href: "https://www.mall.info/produkte/regenwasserbewirtschaftung/regenwassernutzung/garten-paket-fontana/",
  },
];

const STEPS = [
  {
    title: "Vorhaben klären",
    text: "Projektort, Nutzung und Fotos einordnen: Welche Einbauwege kommen infrage, welche Angaben fehlen noch?",
  },
  {
    title: "Standort prüfen",
    text: "Zugang, Leitungen, Boden, Grundwasser und zulässigen Überlauf abstimmen.",
  },
  {
    title: "Umfang festlegen",
    text: "Speicher, Technik, Erdarbeiten und erforderliche Facharbeiten im Angebot beschreiben.",
  },
  {
    title: "Zisterne einbauen",
    text: "Baugrube, Bettung, Tank und Anschlüsse nach abgestimmtem Aufbau ausführen.",
  },
  {
    title: "Garten fertigstellen",
    text: "Flächen wiederherstellen und Bedienung sowie Wartungszugänge gemeinsam durchgehen.",
  },
];

const FAQS = [
  {
    question: "Welche Firma baut Zisternen ein, und was übernimmt Loni GalaBau?",
    answer:
      "Loni GalaBau plant und übernimmt den abgestimmten Zisternen-Einbau mit Erdarbeiten, Tank, Leitungen und Wiederherstellung der Außenflächen. Unser Sitz ist Hattersheim am Main bei Frankfurt; wir bearbeiten Vorhaben deutschlandweit. Im Angebot wird festgehalten, welche Arbeiten enthalten sind und welche Schnittstellen zu weiteren Fachbetrieben bestehen.",
  },
  {
    question: "Wie vergleiche ich Kosten und ein Zisternen-Komplettset mit Einbau?",
    answer:
      "Vergleichen Sie den vollständigen Einbauumfang: Baugrube und Bettung, Tank, Aushubabfuhr, Filter und Pumpe, Leitungen und Überlauf sowie die Wiederherstellung der Fläche. Ein Produkt-Komplettset kann eine vorbereitete Baugrube voraussetzen; auch Druckleitungen oder weitere Arbeiten sind nicht automatisch enthalten. Gleiche Tankgröße bedeutet deshalb nicht gleicher Gesamtumfang. Unsere Angebots-Checkliste hilft, offene Positionen zu klären.",
  },
  {
    question: "Kann ich eine Zisterne im bestehenden Garten nachrüsten?",
    answer:
      "Das hängt vor allem von Einbauplatz, Maschinenzugang, vorhandenen Leitungen, Dachentwässerung und zulässigem Überlauf ab. Fotos vom gesamten Zugang helfen dabei ebenso wie Bilder des Einbauplatzes. Wir klären auch, wo Aushub gelagert oder verladen werden kann und welche Pflanzen, Wege oder Terrassen zu schützen beziehungsweise wiederherzustellen sind.",
  },
  {
    question: "Sind 5.000 oder 10.000 Liter für meine Zisterne sinnvoll?",
    answer:
      "Die Literzahl allein beantwortet das nicht. Nutzbare Dachfläche und örtlicher Niederschlag bestimmen den möglichen Ertrag; Gartenfläche, Bepflanzung und Bewässerungsart den Bedarf. Dazu kommen Platz, Boden und Nutzung über dem Tank. Ein größerer Speicher erzeugt kein zusätzliches Regenwasser und ersetzt keine abgestimmte Planung. Wir vergleichen die Größen anhand dieser Angaben statt pauschal eine Tankgröße zu empfehlen.",
  },
  {
    question: "Was muss auf meinem Grundstück zu Genehmigung und Rückstau geklärt werden?",
    answer:
      "Die Anforderungen hängen von Standort, Nutzung und Entwässerungsweg ab. Versickerung und Kanalanschluss werden mit der zuständigen Stelle beziehungsweise dem Entwässerungsbetrieb geklärt. Bei Kanalanschluss wird der Rückstauschutz anhand der Rückstauebene und konkreten Anschlussbedingungen geplant; eine einzelne Rückstauklappe ist keine pauschale Lösung.",
  },
  {
    question: "Kann ich Regenwasser auch im Haus nutzen, und wer schließt es an?",
    answer:
      "Regenwasser ist kein Trinkwasser. Eine Nutzung im Haus benötigt ein getrenntes, gekennzeichnetes Nichttrinkwassernetz. Auch eine Trinkwassernachspeisung muss hygienisch sicher getrennt sein. Arbeiten an Trinkwasserinstallation und elektrischen Anschlüssen stimmen wir bei Bedarf mit den dafür zuständigen Fachbetrieben ab.",
  },
];

export const Route = createFileRoute("/zisterne-einbauen-lassen")({
  head: () => ({
    meta: [
      { title: "Zisterne einbauen lassen & nachrüsten | Loni GalaBau" },
      {
        name: "description",
        content:
          "Zisterne einbauen oder nachrüsten lassen: Einbauumfang, Kostenfaktoren und passende Speichergröße klären. Deutschlandweit mit Loni GalaBau.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: PREVIEW_IMAGE },
      { property: "og:image:alt", content: IMAGE_DESCRIPTION },
      { name: "twitter:image", content: PREVIEW_IMAGE },
      { name: "twitter:image:alt", content: IMAGE_DESCRIPTION },
    ],
  }),
  component: CisternPage,
});

function CisternPage() {
  const pageSchema = publicPageSchema(PATH, "Zisterne einbauen lassen", "AboutPage");
  const schema = {
    ...pageSchema,
    "@graph": [
      ...pageSchema["@graph"],
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: canonicalUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Zisterne einbauen lassen",
            item: canonicalUrl(PATH),
          },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <article className="hyphens-auto [overflow-wrap:anywhere]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
        <div className="bg-surface px-6 pt-6 md:px-10 md:pt-8">
          <nav
            aria-label="Brotkrümelnavigation"
            className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-2 text-xs text-brand/70"
          >
            <Link to="/" className="underline underline-offset-4">
              Startseite
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Zisterne einbauen lassen</span>
          </nav>
        </div>

        <header className="bg-surface px-6 pb-12 pt-10 md:px-10 md:pb-16 md:pt-14">
          <div className="mx-auto grid max-w-[1400px] items-center gap-9 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-12">
            <div className="min-w-0">
              <p className="eyebrow text-accent-ink">Regenwasser für Ihren Garten</p>
              <h1 className="display mt-5 text-[clamp(2.5rem,5.1vw,5rem)] leading-[1.04] text-brand">
                Zisterne
                <br />
                <span className="font-light italic">einbauen lassen.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/75">
                Vom Grundstück bis zum Gartenhahn: Wir planen und übernehmen den abgestimmten Einbau
                mit Baugrube, Tank und Leitungen – einschließlich der Wiederherstellung Ihrer
                Außenflächen.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-foreground/75">
                Nach Ihrer Anfrage klären wir mit Ihnen, welcher Einbauweg infrage kommt, welche
                Angaben noch fehlen und wie Ihr Einbauangebot vorbereitet wird.
              </p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-brand/70">
                Neubau oder Nachrüstung: Loni GalaBau begleitet Ihr Vorhaben deutschlandweit, mit
                Sitz in Hattersheim am Main bei Frankfurt.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="#zisterne-anfragen"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
                >
                  Zisternen-Einbau anfragen{" "}
                  <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                </a>
                <a
                  href="#planung"
                  className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-semibold text-brand underline underline-offset-4"
                >
                  Passt es auf Ihr Grundstück? <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <figure className="min-w-0">
              <CisternIllustration
                priority
                className="aspect-[1586/992] h-auto w-full rounded-[1.5rem] object-contain"
              />
              <figcaption className="mt-3 px-1 text-xs leading-relaxed text-brand/60">
                KI-Visualisierung · schematisches Beispiel, keine Ausführungsplanung. Behälter,
                Bettung, Anschlüsse und Rückstauschutz werden standort- und systemabhängig geplant.
              </figcaption>
            </figure>
          </div>
        </header>

        <section
          aria-label="Zisternenhersteller"
          className="border-y border-brand/10 bg-white px-6 py-3 md:px-10"
        >
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-1 md:flex-row md:justify-center md:gap-12">
            <p className="pt-3 text-center text-xs text-brand/60 md:pt-0 md:text-left">
              Hersteller für Regenwasserspeicher
            </p>
            <div className="grid w-full max-w-md grid-cols-3 gap-3 sm:gap-8 md:w-[420px]">
              {MANUFACTURERS.map((manufacturer) => (
                <a
                  key={manufacturer.name}
                  href={manufacturer.href}
                  aria-label={`${manufacturer.name}: Zisternensysteme beim Hersteller ansehen`}
                  className="flex min-h-20 min-w-0 items-center justify-center rounded-md px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <img
                    src={publicImageUrl(manufacturer.logo)}
                    alt={`${manufacturer.name} – Herstellerlogo`}
                    width={manufacturer.logoWidth}
                    height={manufacturer.logoHeight}
                    loading="lazy"
                    decoding="async"
                    className={`shrink-0 object-contain ${manufacturer.logoClassName}`}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="planung"
          aria-labelledby="planung-titel"
          className="scroll-mt-28 bg-background px-6 py-14 md:px-10 md:py-20"
        >
          <div className="mx-auto grid max-w-[1400px] items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0 lg:max-w-xl">
              <p className="eyebrow text-accent-ink">Welcher Einbauweg passt?</p>
              <h2
                id="planung-titel"
                className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand"
              >
                Ihr Grundstück
                <br />
                <span className="font-light italic text-brand-muted">entscheidet mit.</span>
              </h2>
              <p className="mt-6 leading-relaxed text-foreground/75">
                Nicht nur die Tankgröße bestimmt den Aufwand. Öffnen Sie die Situation, die zu Ihrem
                Vorhaben passt:
              </p>
              <div className="mt-6 divide-y divide-brand/15" data-cistern-plot-situations>
                {PLOT_SITUATIONS.map((situation) => (
                  <details key={situation.title} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-4 font-medium text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                      <span>{situation.title}</span>
                      <ChevronDown
                        className="size-4 shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <ul className="list-disc space-y-2 pb-5 pl-4 text-sm leading-relaxed text-foreground/75">
                      {situation.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
              <a
                href="#zisterne-anfragen"
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand underline underline-offset-4"
              >
                Ihren Einbauplatz besprechen <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <figure className="min-w-0">
              <ProjectImage
                src="/images/projekte/garten-mit-rasen-und-bepflanzung.webp"
                alt="Garten mit Rasen, Hecken und Pflanzkübeln"
                loading="lazy"
                sizes={PHOTO_SIZES}
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
              />
              <figcaption className="mt-3 px-1 text-xs leading-relaxed text-brand/60">
                Einblick in unsere Gartengestaltung: Rasen, Hecken und Pflanzkübel.
              </figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="system-titel" className="bg-surface px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="min-w-0">
                <p className="eyebrow text-accent-ink">Vom Dach bis ins Beet</p>
                <h2
                  id="system-titel"
                  className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand"
                >
                  Sinnvoll speichern.
                  <br />
                  <span className="font-light italic text-brand-muted">Gezielt bewässern.</span>
                </h2>
                <p className="mt-6 leading-relaxed text-foreground/75">
                  Wofür möchten Sie das gespeicherte Wasser nutzen? Die Antwort entscheidet mit
                  darüber, welche Pumpe, Leitungen und Anschlüsse gebraucht werden.
                </p>
                <ul className="mt-7 divide-y divide-brand/15" data-cistern-watering-options>
                  {WATERING_OPTIONS.map((item) => (
                    <li key={item.title} className="py-5 first:pt-0 last:pb-0">
                      <h3 className="font-display text-xl font-bold text-brand">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/75">{item.text}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl bg-background p-4 text-sm leading-relaxed text-brand/80">
                  Zeigen Sie uns die gewünschten Entnahmestellen und Bewässerungsflächen. Anhand von
                  Leitungswegen, Höhenunterschieden und Nutzung stimmen wir Wassermenge, Druck und
                  Pumpe ab. Filter, Zulauf und zulässiger Überlauf werden ebenfalls mitgeplant.
                </p>
              </div>
              <figure className="min-w-0 lg:order-first">
                <ProjectImage
                  src="/images/projekte/tropfbewaesserung-im-pflanzbeet.webp"
                  alt="Tropfschlauch in einem Pflanzbeet"
                  loading="lazy"
                  sizes={PHOTO_SIZES}
                  className="aspect-[4/3] w-full rounded-[1.5rem] object-cover object-[50%_65%]"
                />
                <figcaption className="mt-3 px-1 text-xs leading-relaxed text-brand/60">
                  Detail aus unseren Bewässerungsarbeiten: Tropfschlauch im Pflanzbeet.
                </figcaption>
              </figure>
            </div>
            <aside
              aria-labelledby="speichergroesse-titel"
              className="mt-10 rounded-2xl border border-brand/15 bg-background p-6 md:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,.65fr)_minmax(0,1.35fr)] lg:gap-12">
                <div className="min-w-0">
                  <p className="eyebrow text-accent-ink">Speichergröße sinnvoll wählen</p>
                  <h3
                    id="speichergroesse-titel"
                    className="mt-3 font-display text-2xl font-bold text-brand"
                  >
                    5.000 oder 10.000 Liter?
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    Mehr Volumen bringt nur dann einen Nutzen, wenn Regenwasserertrag und Bedarf
                    dazu passen. Ein größerer Tank erzeugt kein zusätzliches Wasser.
                  </p>
                </div>
                <ul className="grid gap-5 sm:grid-cols-3">
                  {[
                    {
                      title: "Was kommt an?",
                      text: "Nutzbare Dachfläche, Dachmaterial und örtlicher Niederschlag.",
                    },
                    {
                      title: "Was wird gebraucht?",
                      text: "Gartenfläche, Bepflanzung, Bewässerungsart und Nutzungszeiten.",
                    },
                    {
                      title: "Was passt vor Ort?",
                      text: "Einbauplatz, Boden, Grundwasser und Belastung über dem Tank.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="min-w-0 border-t border-brand/15 pt-4">
                      <p className="font-semibold text-brand">{item.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/75">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <div className="mt-10 border-t border-brand/15 pt-6 md:mt-12">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-brand/60">
                Details für die Einbauplanung
              </p>
              <div className="mt-2">
                <details id="einbaubedingungen" className="group border-b border-brand/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 font-medium text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                    <span>Bettung, Einbautiefe und Belastung</span>
                    <ChevronDown
                      className="size-4 shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="max-w-4xl pb-6 text-sm leading-relaxed text-foreground/75">
                    Kunststoff oder Beton: Tanksystem und Standort bestimmen Einbautiefe,
                    Bettungsmaterial, Verfüllung und Verdichtung. Grundwasser, Auftrieb,
                    Leitungsgefälle und spätere Flächennutzung werden geprüft. Für befahrbare
                    Flächen müssen Tank, Schacht und Abdeckung zusammen geeignet sein. Ein
                    pauschaler Schichtaufbau passt nicht zu jeder Zisterne.
                  </p>
                  <p className="max-w-4xl pb-6 text-sm leading-relaxed text-foreground/75">
                    Auch Abstände zum Haus und zur Grundstücksgrenze werden am Einbauort geklärt.
                    Entscheidend sind unter anderem Baugrube, Standsicherheit, Herstellervorgaben,
                    Grenzlage und örtliche Vorgaben. Zeigen Sie uns deshalb auch die Lage von Haus
                    und Grundstücksgrenzen; erforderliche Abstände werden für den gewählten Behälter
                    und Aushub festgelegt.
                  </p>
                </details>
                <details id="wirtschaftlichkeit" className="group border-b border-brand/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 font-medium text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                    <span>Lohnt sich eine Zisterne für meinen Garten?</span>
                    <ChevronDown
                      className="size-4 shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="max-w-4xl pb-6 text-sm leading-relaxed text-foreground/75">
                    Vergleichen Sie die Investition sowie Wartungs- und Stromkosten mit Ihrer
                    tatsächlich nutzbaren Regenwassermenge und dem örtlichen Wasserpreis.
                    Regenwasser ersetzt beim Gießen nur dann Trinkwasser, wenn es verfügbar ist und
                    genutzt wird. Ob und wann sich der Einbau finanziell rechnet, hängt deshalb vom
                    Grundstück und Ihrer Nutzung ab; eine feste Einsparung oder Amortisationszeit
                    lässt sich daraus nicht pauschal zusagen.
                  </p>
                </details>
                <details id="ueberlauf" className="group border-b border-brand/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 font-medium text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                    <span>Überlauf und Rückstauschutz</span>
                    <ChevronDown
                      className="size-4 shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="max-w-4xl pb-6 text-sm leading-relaxed text-foreground/75">
                    Bei Kanalanschluss bestimmen Kanalart, Rückstauebene und örtliche
                    Anschlussbedingungen die Sicherung. Überlauf und Rückstauschutz werden als
                    System geplant; eine einzelne Rückstauklappe ist keine pauschale Lösung.
                    Versickerung braucht geeigneten Boden und muss am Standort zulässig sein.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="nachruesten-titel"
          className="bg-background px-6 py-14 md:px-10 md:py-20"
        >
          <div className="mx-auto grid max-w-[1400px] items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0 lg:max-w-xl">
              <p className="eyebrow text-accent-ink">Bestehende Gärten weiterdenken</p>
              <h2
                id="nachruesten-titel"
                className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand"
              >
                Zisterne nachrüsten.
                <br />
                <span className="font-light italic text-brand-muted">Garten mitdenken.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground/75">
                Im fertigen Garten zählt auch, wie die Baustelle organisiert wird und wie die Fläche
                danach aussehen soll. Diese Punkte gehören in die Einbauplanung:
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/75">
                {[
                  "Welche Wege, Beete oder Terrassen müssen geschützt, geöffnet und wiederhergestellt werden?",
                  "Wo können Aushub und Material zwischengelagert oder direkt verladen werden?",
                  "Wie erreichen die Leitungen Fallrohre und Entnahmestellen, ohne unnötig Flächen zu öffnen?",
                ].map((text) => (
                  <li key={text} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-foreground/75">
                Ist ohnehin ein Garten- oder Terrassenumbau geplant, stimmen wir Baugrube und
                Leitungen vor den neuen Oberflächen ab. Wartungszugänge bleiben erreichbar.
              </p>
              <a
                href="#zisterne-anfragen"
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand underline underline-offset-4"
              >
                Nachrüstung anfragen <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <figure className="min-w-0">
              <ProjectImage
                src="/images/projekte/terrassenunterkonstruktion.webp"
                alt="Terrassenunterkonstruktion vor Verlegung des Decks"
                loading="lazy"
                sizes={PHOTO_SIZES}
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
              />
              <figcaption className="mt-3 px-1 text-xs leading-relaxed text-brand/60">
                Bauphase einer Terrasse aus unseren Arbeiten: Unterkonstruktion vor der
                Deckverlegung.
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          aria-labelledby="ablauf-titel"
          className="bg-brand px-6 py-16 text-brand-foreground md:px-10 md:py-20"
        >
          <div className="mx-auto max-w-[1400px]">
            <p className="eyebrow text-brand-foreground/65">Von der Idee bis zum Wasseranschluss</p>
            <h2
              id="ablauf-titel"
              className="display mt-5 max-w-3xl text-[clamp(2rem,4vw,3.75rem)] text-brand-foreground"
            >
              Ihr Zisternen-Einbau.
              <br />
              <span className="font-light italic">Schritt für Schritt.</span>
            </h2>
            <ol className="mt-11 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {STEPS.map((step, index) => (
                <li key={step.title} className="min-w-0 border-t border-brand-foreground/25 pt-5">
                  <span
                    className="text-xs font-semibold tracking-[.2em] text-brand-foreground/60"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-brand-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-foreground/75">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-9 max-w-3xl text-sm leading-relaxed text-brand-foreground/75">
              Filter, Pumpe und Überlauf bleiben für regelmäßige Kontrolle und Wartung zugänglich.
              Die Hinweise des gewählten Systems besprechen wir bei der Übergabe.
            </p>
          </div>
        </section>

        <CisternOfferCheck />

        <section aria-labelledby="faq-titel" className="bg-background px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow text-accent-ink">Vor dem ersten Spatenstich</p>
              <h2 id="faq-titel" className="display mt-5 text-[clamp(2rem,4vw,3.5rem)] text-brand">
                Ihre Fragen.
                <br />
                <span className="font-light italic text-brand-muted">Klar beantwortet.</span>
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/70">
                Zum Einbauen, Nachrüsten und Nutzen einer Zisterne im Garten.
              </p>
            </div>
            <Accordion type="single" collapsible className="min-w-0">
              {FAQS.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`cistern-${index}`}
                  className="border-b border-brand/15"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-medium text-brand hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-[15px] leading-relaxed text-foreground/75">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section
          id="zisterne-anfragen"
          aria-labelledby="anfrage-titel"
          className="scroll-mt-28 bg-surface px-6 py-16 md:px-10 md:py-24"
        >
          <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow text-accent-ink">Regenwasser sinnvoll nutzen</p>
              <h2
                id="anfrage-titel"
                className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand"
              >
                Ihre Zisterne.
                <br />
                <span className="font-light italic text-brand-muted">Unser nächstes Gespräch.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground/75">
                Nennen Sie uns Projektort, geplante Nutzung und ob es um einen Neubau oder eine
                Nachrüstung geht. Wir ordnen die Einbausituation mit Ihnen ein und klären die
                nächsten Schritte zu Ihrem Angebot. Fehlende Grundstücksdaten sind kein Hindernis
                für die erste Anfrage.
              </p>
              <div
                aria-labelledby="anfrage-fotos-titel"
                className="mt-7 rounded-2xl border border-brand/15 bg-background p-5 md:p-6"
              >
                <h3 id="anfrage-fotos-titel" className="font-display text-xl font-bold text-brand">
                  Drei Fotos für den ersten Überblick
                </h3>
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground/75">
                  <li>Den vorgesehenen Einbauplatz mit seiner Umgebung.</li>
                  <li>Den gesamten Zugang mit Engstellen; Breite und Höhe, falls bekannt.</li>
                  <li>Die Fallrohre und die Fläche, die Sie bewässern möchten.</li>
                </ol>
                <p className="mt-4 text-sm leading-relaxed text-brand/70">
                  Fotos und vorhandene Pläne können Sie über unser{" "}
                  <Link to="/kontakt" className="font-semibold underline underline-offset-4">
                    Kontaktformular mit Dateiupload
                  </Link>{" "}
                  senden. Für die Kurzanfrage auf dieser Seite reicht zunächst Ihre Beschreibung.
                </p>
              </div>
              <Link
                to="/fachverband-mitgliedschaft"
                className="mt-7 flex min-h-11 items-start gap-3 text-sm leading-relaxed text-brand underline underline-offset-4"
              >
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span>
                  Ordentliches Mitglied im Fachverband Garten-, Landschafts- und Sportplatzbau
                  Hessen-Thüringen.
                </span>
              </Link>
              <div className="mt-7 flex flex-col items-start gap-3 text-brand">
                <a
                  href="tel:+4961909266134"
                  className="inline-flex min-h-11 items-center gap-3 text-lg font-semibold"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  06190 9266134
                </a>
                <Link
                  to="/kontakt"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4"
                >
                  Fotos und Pläne übermitteln <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="min-w-0">
              <ServiceMiniContact
                serviceTitle="Zisternen-Einbau"
                messagePlaceholder="Projektort: … Neubau oder Nachrüstung: … Gewünschte Nutzung (Gießhahn oder automatische Bewässerung): … Einbauplatz und Zugang: … Was ist Ihnen besonders wichtig?"
              />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="weiterdenken"
          className="bg-background px-6 py-12 md:px-10 md:py-16"
        >
          <div className="mx-auto max-w-[1400px]">
            <h2 id="weiterdenken" className="font-display text-2xl font-bold text-brand">
              Das Gartenprojekt weiterdenken.
            </h2>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-sm font-semibold text-brand">
              <Link
                to="/leistungen/$slug"
                params={{ slug: "erdarbeiten" }}
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                Erdarbeiten <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/leistungen/$slug"
                params={{ slug: "bewaesserungsanlagen" }}
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                Bewässerungsanlagen <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/leistungen/$slug"
                params={{ slug: "entwaesserung" }}
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                Entwässerung <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/ratgeber/$slug"
                params={{ slug: "gartenbewaesserung-planen" }}
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
              >
                Gartenbewässerung planen <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-9 border-t border-brand/10 pt-6 text-xs leading-relaxed text-foreground/65">
              <p className="font-semibold text-brand/75">
                Fachlicher Hintergrund · Stand Oktober 2026
              </p>
              <p className="mt-2 max-w-4xl">
                Zur Regenwassernutzung:{" "}
                <a
                  href="https://www.umweltbundesamt.de/umwelttipps-fuer-den-alltag/tipps-fuer-eine-nachhaltige-regenwassernutzung"
                  className="underline underline-offset-4"
                >
                  Umweltbundesamt
                </a>
                . Zu systemabhängigen Einbaubedingungen:{" "}
                <a
                  href="https://www.premiertechaqua.com/de-de/lagertanks/zisterne"
                  className="underline underline-offset-4"
                >
                  Rewatec-Zisternen
                </a>
                . Zum Umfang von Produktpaketen:{" "}
                <a
                  href="https://www.mall.info/produkte/regenwasserbewirtschaftung/regenwassernutzung/garten-paket-fontana/"
                  className="underline underline-offset-4"
                >
                  Mall Garten-Paket Fontana
                </a>
                . Zur Planung und Rückstausicherheit:{" "}
                <a
                  href="https://www.mall.ch/fileadmin/user_upload/produkte/fachbuchreihe-oekologie-aktuell/ratgeber-regenwasser-auflage-11-2026-teil-2-von-3.pdf"
                  className="underline underline-offset-4"
                >
                  Mall-Ratgeber Regenwasser 2026 (PDF, Seiten 20–21)
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
