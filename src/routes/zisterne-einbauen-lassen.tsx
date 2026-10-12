import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Check, Droplets, Phone, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CisternIllustration } from "@/components/site/CisternIllustration";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { canonicalUrl, publicPageSchema, safeJsonLd } from "@/lib/seo";

const PATH = "/zisterne-einbauen-lassen";
const PREVIEW_IMAGE =
  "https://www.loni-galabau.de/__public-assets/images/zisternen/zisterne-garten-schnitt-ki-1200.webp";
const IMAGE_DESCRIPTION =
  "KI-generierte Schnittillustration: gestalteter Garten mit unterirdischer Regenwasserzisterne und technischen Anschlüssen.";

const SYSTEM = [
  {
    title: "Regen sammeln & filtern",
    text: "Geeignete Dachflächen liefern das Wasser. Ein passend ausgelegter Filter hält Schmutz vor dem Speicher zurück; seine Zugänglichkeit gehört zur Planung.",
  },
  {
    title: "Ruhig einleiten & entnehmen",
    text: "Ein beruhigter Zulauf reduziert das Aufwirbeln von Ablagerungen. Entnahme, Pumpe und Leitungsnetz werden auf die gewünschte Gartenbewässerung abgestimmt.",
  },
  {
    title: "Den Überlauf mitplanen",
    text: "Auch eine volle Zisterne braucht einen geklärten Wasserweg. Ob Versickerung oder Kanalanschluss möglich ist, hängt von Grundstück und örtlichen Vorgaben ab.",
  },
];

const STEPS = [
  {
    title: "Vorhaben klären",
    text: "Projektort, Nutzung, Dachfläche und erste Fotos gemeinsam einordnen.",
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
    question: "Was kostet es, eine Zisterne einbauen zu lassen?",
    answer:
      "Das Angebot hängt von Speichergröße und Bauart, Baugrube, Boden, Abtransport, Maschinenzugang und Anschlüssen ab. Pumpe, Filter, Überlauf und die Wiederherstellung vorhandener Flächen kommen dazu. Fotos und Grundstücksdaten helfen beim Einstieg; für eine belastbare Kalkulation wird der konkrete Einbauort geprüft.",
  },
  {
    question: "Welche Zisternengröße passt zu meinem Garten?",
    answer:
      "Die Größe wird aus nutzbarer Dachfläche, örtlichem Niederschlag und Wasserbedarf abgeleitet. Gartenfläche und Bewässerungsart spielen ebenfalls eine Rolle. Ein möglichst großer Tank ist nicht automatisch die sinnvollste Lösung: Ertrag, Bedarf und Platz müssen zusammenpassen.",
  },
  {
    question: "Kann ich eine Zisterne im bestehenden Garten nachrüsten?",
    answer:
      "Eine Nachrüstung ist grundsätzlich prüfbar. Entscheidend sind Platz, Maschinenzugang, vorhandene Leitungen, Dachentwässerung und der Wasserweg des Überlaufs. Erhaltene Pflanzen und Beläge werden in die Planung einbezogen. Besonders sinnvoll lässt sich der Einbau mit einem ohnehin geplanten Garten- oder Terrassenumbau abstimmen.",
  },
  {
    question: "Betonzisterne oder Kunststoffzisterne: Was ist besser?",
    answer:
      "Beide Bauarten haben passende Einsatzbereiche. Gewicht und Einbringung, Boden, Grundwasser, mögliche Auftriebskräfte und spätere Belastungen bestimmen die Auswahl mit. Für eine befahrbare Fläche müssen Tank, Schacht und Abdeckung als vollständiges System für die vorgesehene Belastung geeignet sein.",
  },
  {
    question: "Braucht eine Zisterne eine Genehmigung oder Rückstausicherung?",
    answer:
      "Die Anforderungen hängen von Standort, Nutzung und Entwässerungsweg ab. Versickerung und Kanalanschluss werden mit der zuständigen Stelle beziehungsweise dem Entwässerungsbetrieb geklärt. Bei Kanalanschluss wird der Rückstauschutz anhand der Rückstauebene und konkreten Anschlussbedingungen geplant; eine einzelne Rückstauklappe ist keine pauschale Lösung.",
  },
  {
    question: "Kann das Regenwasser auch im Haus genutzt werden?",
    answer:
      "Regenwasser ist kein Trinkwasser. Eine Nutzung im Haus benötigt ein getrenntes, gekennzeichnetes Nichttrinkwassernetz. Auch eine Trinkwassernachspeisung muss hygienisch sicher getrennt sein. Arbeiten an Trinkwasserinstallation und elektrischen Anschlüssen stimmen wir bei Bedarf mit den dafür zuständigen Fachbetrieben ab.",
  },
];

export const Route = createFileRoute("/zisterne-einbauen-lassen")({
  head: () => ({
    meta: [
      { title: "Zisterne einbauen lassen: Planung & Einbau | Loni GalaBau" },
      {
        name: "description",
        content:
          "Zisterne einbauen oder nachrüsten lassen: Regenwasser für den Garten nutzen. Loni GalaBau plant Erdarbeiten, Tank und Anschlüsse. Jetzt Projekt anfragen.",
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
                Regen sammeln. Wasser speichern. Den Garten versorgen. Wir planen den
                Zisternen-Einbau mit Ihren Außenanlagen zusammen – von der Baugrube bis zur fertigen
                Fläche.
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
                  So planen wir <ArrowDown className="size-4" aria-hidden="true" />
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

        <div className="border-y border-brand/10 bg-background px-6 py-6 md:px-10">
          <div className="mx-auto grid max-w-[1400px] gap-5 text-sm font-medium text-brand md:grid-cols-3 md:gap-8">
            {[
              "Speicher und Garten gemeinsam planen",
              "Erdarbeiten und Anschlüsse abstimmen",
              "Bestehende Flächen wiederherstellen",
            ].map((text) => (
              <p key={text} className="flex min-w-0 items-center gap-3">
                <Check className="size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                {text}
              </p>
            ))}
          </div>
        </div>

        <section
          id="planung"
          aria-labelledby="planung-titel"
          className="scroll-mt-28 bg-background px-6 py-16 md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-7 lg:grid-cols-2 lg:gap-16">
              <div className="min-w-0">
                <p className="eyebrow text-accent-ink">Was unter der Oberfläche zählt</p>
                <h2
                  id="planung-titel"
                  className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand"
                >
                  Ein Speicher.
                  <br />
                  <span className="font-light italic text-brand-muted">
                    Ein durchdachtes System.
                  </span>
                </h2>
              </div>
              <p className="min-w-0 self-end text-lg leading-relaxed text-foreground/75">
                Eine Regenwasserzisterne kann Trinkwasser bei der Gartenbewässerung ersetzen,
                solange gespeichertes Wasser verfügbar ist. Dafür betrachten wir Dachfläche, Bedarf
                und Grundstück gemeinsam: Wie kommt das Wasser in den Tank, wie wird es genutzt und
                wohin fließt der Überschuss?
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SYSTEM.map((item, index) => (
                <div key={item.title} className="min-w-0 rounded-2xl bg-surface p-7 md:p-8">
                  <div className="flex items-center justify-between text-brand/50">
                    <span className="text-xs font-semibold tracking-[.2em]">0{index + 1}</span>
                    <Droplets className="size-5" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-brand">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/75">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-7 rounded-2xl border border-brand/15 p-7 md:p-8 lg:grid-cols-2 lg:gap-12">
              <div className="min-w-0">
                <h3 className="font-display text-xl font-bold text-brand">
                  Bettung, Tiefe und Belastung
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                  Einbautiefe, Bettungsmaterial, Verfüllung und Verdichtung richten sich nach dem
                  gewählten Tanksystem und den örtlichen Verhältnissen. Grundwasser, Auftrieb,
                  Leitungsgefälle und die spätere Flächennutzung werden dabei geprüft. Ein
                  pauschaler Schichtaufbau passt nicht zu jeder Zisterne.
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-bold text-brand">
                  Überlauf und Rückstauschutz
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">
                  Bei einem Kanalanschluss entscheiden Kanalart und Lage zur Rückstauebene mit über
                  die erforderliche Sicherung. Überlauf, Rückstauschutz und örtliche
                  Anschlussbedingungen werden als System geklärt. Eine Versickerung braucht
                  geeigneten Boden und muss am Standort zulässig sein.
                </p>
              </div>
            </div>
            <div className="mt-10 grid gap-5 border-t border-brand/15 pt-8 lg:grid-cols-2 lg:gap-16">
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight text-brand">
                Zisterne im Garten nachrüsten
              </h2>
              <p className="text-sm leading-relaxed text-foreground/75">
                Auch im bestehenden Garten lässt sich ein Regenwasserspeicher prüfen. Wir betrachten
                den Weg für Maschinen und Material, Platz für Aushub sowie vorhandene Leitungen und
                Regenrohre. Erhaltenswerte Pflanzen, Terrassen und Wege werden in die Standortwahl
                einbezogen. Die spätere Oberfläche planen wir von Anfang an mit. Wenn ohnehin ein
                Gartenumbau ansteht, stimmen wir die Bauabschnitte zusammen ab: So können
                Erdarbeiten und Leitungsverlegung vor neuen Belägen erfolgen, statt fertige Flächen
                erneut zu öffnen.
              </p>
            </div>
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

        <section aria-labelledby="kosten-titel" className="bg-surface px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow text-accent-ink">Kosten nachvollziehbar planen</p>
              <h2
                id="kosten-titel"
                className="display mt-5 text-[clamp(2rem,4vw,3.5rem)] text-brand"
              >
                Was kostet der
                <br />
                <span className="font-light italic text-brand-muted">Zisternen-Einbau?</span>
              </h2>
              <p className="mt-6 leading-relaxed text-foreground/75">
                Der Tankpreis ist ein Teil des Gesamtprojekts. Baugrube, Bodenverhältnisse,
                Aushubentsorgung und Zugänglichkeit beeinflussen den Aufwand ebenso wie Filter,
                Pumpe, Leitungswege und Überlauf. Bei einer Nachrüstung kommt die Wiederherstellung
                von Rasen, Beeten oder Pflaster hinzu.
              </p>
              <p className="mt-5 leading-relaxed text-foreground/75">
                Wir stimmen ab, welche Arbeiten im Angebot enthalten sind und welche Schnittstellen
                weitere Fachbetriebe benötigen. So vergleichen Sie den vollständigen Leistungsumfang
                für Ihr Grundstück.
              </p>
              <a
                href="#zisterne-anfragen"
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand underline underline-offset-4"
              >
                Einbauangebot anfragen <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="min-w-0 rounded-2xl bg-background p-7 md:p-9">
              <h3 className="font-display text-2xl font-bold text-brand">
                Das hilft für Ihre Anfrage
              </h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/75">
                {[
                  "Projektort und Fotos vom vorgesehenen Einbauplatz",
                  "Dachfläche und bisheriger Verlauf der Regenrohre, soweit bekannt",
                  "Gewünschte Nutzung: Gießwasser oder automatische Bewässerung",
                  "Zugang zum Garten sowie vorhandene Pläne und Leitungen",
                  "Geplante Flächennutzung über dem Tank und gewünschter Zeitraum",
                ].map((text) => (
                  <li key={text} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-brand/10 pt-5 text-sm leading-relaxed text-brand/65">
                Noch nicht alles bekannt? Beginnen Sie mit dem Projektort und Ihrer Idee. Die
                offenen Punkte klären wir gemeinsam.
              </p>
            </div>
          </div>
        </section>

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
                Sie möchten eine Zisterne installieren oder nachrüsten lassen? Schildern Sie uns
                Ihren Standort und die gewünschte Nutzung. Wir besprechen, wie Speicher, Erdarbeiten
                und Garten zusammenpassen.
              </p>
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
                messagePlaceholder="Wo soll die Zisterne eingebaut werden? Neubau oder bestehender Garten, gewünschte Nutzung und erste Grundstücksdaten helfen uns weiter."
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
