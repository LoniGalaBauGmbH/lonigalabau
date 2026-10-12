import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, GraduationCap, Handshake, Phone } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { ServiceMiniContact } from "@/components/leistungen/ServiceMiniContact";
import { canonicalUrl, publicPageSchema, safeJsonLd } from "@/lib/seo";
import { publicImageUrl } from "@/lib/public-image-url";
import { projectPhotos } from "@/lib/project-photos";

const PATH = "/fachverband-mitgliedschaft";
const MEMBERSHIP_URL = "https://www.galabau-ht.de/mitgliedschaft-ht";
const APPLICATION_URL = "https://www.galabau-ht.de/aufnahmeantrag-fgl-hessen-thueringen.pdfx";
const SIGNUM_URL = "https://www.galabau.de/logoundleitbild";
const NETWORK_URL = "https://www.galabau.de/mitgliedschaft";
const projectPhoto = projectPhotos[14];

export const Route = createFileRoute("/fachverband-mitgliedschaft")({
  head: () => ({
    meta: [
      { title: "Mitglied im Fachverband GaLaBau | Loni GalaBau" },
      {
        name: "description",
        content:
          "Loni GalaBau ist ordentliches Mitglied im Fachverband Hessen-Thüringen. Erfahren Sie mehr über Voraussetzungen und unseren Anspruch an Ihr Projekt.",
      },
    ],
  }),
  component: MembershipPage,
});

const REQUIREMENTS = [
  {
    title: "Ein Betrieb unserer Branche",
    text: "Vorausgesetzt wird ein gewerbliches Unternehmen im Garten-, Landschafts- oder Sportplatzbau.",
  },
  {
    title: "Fachliche Qualifikation",
    text: "Der Inhaber oder eine dauerhaft beschäftigte Fachkraft muss eine entsprechende Qualifikation nachweisen, etwa als Meister, Techniker oder mit einem einschlägigen Hochschulabschluss.",
  },
  {
    title: "Anspruch an die Ausführung",
    text: "Zu den Voraussetzungen gehört, Arbeiten fachgerecht und mit einem bewussten Anspruch an ihre Qualität auszuführen.",
  },
];

const ADMISSION = [
  {
    title: "Antrag & Nachweise",
    text: "Das Unternehmen reicht seinen Antrag mit den erforderlichen Unterlagen beim Verband ein.",
  },
  {
    title: "Persönliches Kennenlernen",
    text: "Bei erfüllten Grundvoraussetzungen lernen zwei Präsidiumsmitglieder den Betrieb kennen; idealerweise gehört ein Baustellenbesuch dazu.",
  },
  {
    title: "Entscheidung im Präsidium",
    text: "Anschließend wird die Bewerbung vorgestellt und über die Aufnahme entschieden.",
  },
];

const NETWORK = [
  {
    Icon: BookOpen,
    title: "Fachwissen im Blick",
    text: "Der Verband stellt aktuelle Brancheninformationen und fachliche Beratung bereit. Das eröffnet Mitgliedern zusätzliche Anlaufstellen für betriebliche Fragen.",
  },
  {
    Icon: GraduationCap,
    title: "Wissen weiterentwickeln",
    text: "Seminare und Schulungen bieten Möglichkeiten zur Weiterbildung. Fachliche Entwicklung gehört zu einem Beruf, in dem Materialien und Anforderungen sich verändern.",
  },
  {
    Icon: Handshake,
    title: "Im Austausch bleiben",
    text: "Ein Netzwerk von Betrieben und Branchenprofis schafft Raum für Erfahrungen und neue Perspektiven auf die Aufgaben im Garten- und Landschaftsbau.",
  },
];

function MembershipPage() {
  const pageSchema = publicPageSchema(
    PATH,
    "Unsere Mitgliedschaft im Fachverband GaLaBau",
    "AboutPage",
  );
  const schema = {
    ...pageSchema,
    "@graph": [
      ...pageSchema["@graph"],
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Über uns", item: canonicalUrl("/ueber-uns") },
          {
            "@type": "ListItem",
            position: 3,
            name: "Fachverband-Mitgliedschaft",
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
        <div className="mx-auto max-w-[1480px] px-6 py-6 md:px-10 md:py-8">
          <nav
            aria-label="Brotkrümelnavigation"
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-brand/70"
          >
            <Link to="/" className="underline underline-offset-4">
              Startseite
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/ueber-uns" className="underline underline-offset-4">
              Über uns
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Fachverband-Mitgliedschaft</span>
          </nav>
        </div>

        <header className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="min-w-0 bg-brand px-6 py-14 text-brand-foreground md:px-10 md:py-20 lg:py-24 lg:pl-[max(2.5rem,calc((100vw-1400px)/2))] lg:pr-16">
            <p className="eyebrow text-brand-foreground/75">Ordentliches Mitglied im Fachverband</p>
            <h1 className="display mt-6 text-[clamp(2.5rem,5.8vw,5.5rem)] leading-[1.06] text-brand-foreground">
              Fachlich stark.
              <br />
              <span className="font-light italic">Für Ihr Projekt.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-brand-foreground/90 md:text-xl">
              Loni GalaBau ist ordentliches Mitglied im Fachverband Garten-, Landschafts- und
              Sportplatzbau Hessen-Thüringen e. V. Eine Verbindung zu unserer Branche – und ein
              Anspruch, den wir in die Planung und Umsetzung Ihrer Außenanlage mitnehmen.
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-brand-foreground/75">
              Unser Sitz ist in Hattersheim am Main bei Frankfurt. Für private, gewerbliche und
              öffentliche Auftraggeber arbeiten wir deutschlandweit.
            </p>
            <a
              href="#projekt-besprechen"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-brand-foreground px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-foreground/90"
            >
              Ihr Projekt besprechen <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <div className="flex min-w-0 flex-col items-center justify-center bg-surface px-6 py-14 md:px-10 md:py-16">
            <img
              src={publicImageUrl("/images/partner/gartenverband.svg")}
              alt="Signum der Fachbetriebe: Ihre Experten für Garten und Landschaft"
              width={100}
              height={133}
              decoding="async"
              className="h-auto w-[min(230px,65vw)]"
            />
            <p className="mt-8 max-w-xs text-center text-sm leading-relaxed text-brand/75">
              Das Signum macht unsere Zugehörigkeit zum Fachverband sichtbar.
            </p>
            <a
              href={SIGNUM_URL}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Das Zeichen erklärt <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </header>

        <section
          aria-labelledby="voraussetzungen"
          className="bg-background px-6 py-16 md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="max-w-3xl">
              <p className="eyebrow text-brand/70">Was hinter der Mitgliedschaft steht</p>
              <h2
                id="voraussetzungen"
                className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand"
              >
                Fachbetrieb sein.
                <br />
                <span className="font-light italic text-brand-muted">
                  Voraussetzungen erfüllen.
                </span>
              </h2>
              <p className="mt-6 leading-relaxed text-foreground/75">
                Für die ordentliche Mitgliedschaft nennt der Fachverband drei fachliche Grundlagen.
                Sie verbinden die betriebliche Tätigkeit mit qualifiziertem Wissen und der
                Ausführung.
              </p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {REQUIREMENTS.map((item, index) => (
                <div key={item.title} className="min-w-0 border-t border-brand/20 pt-5">
                  <span
                    className="text-xs font-semibold tracking-[0.2em] text-brand/50"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-brand">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/75">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-brand/70">
              Die Voraussetzungen beschreibt der{" "}
              <a href={MEMBERSHIP_URL} className="font-semibold underline underline-offset-4">
                Fachverband Hessen-Thüringen
              </a>
              . Der{" "}
              <a href={APPLICATION_URL} className="font-semibold underline underline-offset-4">
                Aufnahmeantrag (PDF)
              </a>{" "}
              verlangt außerdem, dass mehr als die Hälfte der ausgeführten Arbeiten zum GaLaBau
              gehört. Hinzu kommen die Anerkennung der Verbandssatzung und der Signum-Regeln sowie
              die Erfüllung der Beitragspflichten.
            </p>
          </div>
        </section>

        <section aria-labelledby="aufnahme" className="bg-surface px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1400px]">
            <h2
              id="aufnahme"
              className="display max-w-3xl text-[clamp(1.75rem,3.4vw,3rem)] text-brand"
            >
              Wie der Verband Betriebe aufnimmt.
            </h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-foreground/75">
              Der Fachverband beschreibt sein Aufnahmeverfahren in drei Schritten:
            </p>
            <ol className="mt-9 grid gap-8 md:grid-cols-3 md:gap-10">
              {ADMISSION.map((item, index) => (
                <li key={item.title} className="min-w-0">
                  <span
                    className="grid size-9 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-foreground"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-brand">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">{item.text}</p>
                </li>
              ))}
            </ol>
            <a
              href={MEMBERSHIP_URL}
              className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Das Aufnahmeverfahren beim Verband nachlesen{" "}
              <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section aria-labelledby="netzwerk" className="bg-background px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="max-w-3xl">
              <p className="eyebrow text-brand/70">Unsere Branche. Unser Netzwerk.</p>
              <h2 id="netzwerk" className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand">
                Gute Arbeit braucht auch{" "}
                <span className="font-light italic text-brand-muted">Austausch.</span>
              </h2>
              <p className="mt-6 leading-relaxed text-foreground/75">
                Als Mitglied sind wir Teil einer Fachgemeinschaft. Der Verband eröffnet dafür
                Angebote, die über den Alltag einer einzelnen Baustelle hinausgehen.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {NETWORK.map(({ Icon, title, text }) => (
                <div key={title} className="min-w-0 rounded-2xl bg-surface p-7 md:p-8">
                  <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-6 font-display text-xl font-bold text-brand">{title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/75">{text}</p>
                </div>
              ))}
            </div>
            <a
              href={NETWORK_URL}
              className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Angebote der GaLaBau-Verbände ansehen{" "}
              <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section aria-labelledby="arbeitsweise" className="bg-surface px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <figure className="min-w-0">
              <ProjectImage
                src={projectPhoto.src}
                alt={projectPhoto.alt}
                width={1200}
                height={900}
                loading="lazy"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-4 text-xs leading-relaxed text-brand/65">
                Ein Detail aus unseren Projektfotos: Wasserführung an einer Terrasse.
              </figcaption>
            </figure>
            <div className="min-w-0">
              <p className="eyebrow text-brand/70">So arbeiten wir bei Loni</p>
              <h2
                id="arbeitsweise"
                className="display mt-5 text-[clamp(2rem,4vw,3.5rem)] text-brand"
              >
                Der Anspruch zeigt sich{" "}
                <span className="font-light italic text-brand-muted">im Detail.</span>
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-foreground/75">
                <p>
                  Am Anfang stehen Ihre Wünsche und die Gegebenheiten vor Ort. Wie wird die Fläche
                  genutzt? Welche Anschlüsse gibt es? Wie gelangen Material und Maschinen auf das
                  Grundstück? Daraus stimmen wir Leistungsumfang und nächste Schritte mit Ihnen ab.
                </p>
                <p>
                  Bei Terrassen, Wegen und Einfahrten betrachten wir Oberfläche und Unterbau
                  gemeinsam. Höhen, Übergänge und Wasserführung gehören zur Planung. Materialien
                  wählen wir passend zur Nutzung und zur gewünschten Gestaltung aus.
                </p>
                <p>
                  Auch die Abstimmung zählt: Wir besprechen die Ausführung, koordinieren die
                  vereinbarten Arbeiten und gehen das Ergebnis mit Ihnen durch. So wird aus einer
                  Idee ein Vorhaben mit nachvollziehbaren Schritten.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-brand">
                <Link
                  to="/leistungen"
                  className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
                >
                  Unsere Leistungen <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/projekte"
                  className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
                >
                  Projektfotos ansehen <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/downloads"
                  className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
                >
                  Weitere Nachweise <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="projekt-besprechen"
          aria-labelledby="anfrage"
          className="scroll-mt-28 bg-background px-6 py-16 md:px-10 md:py-24"
        >
          <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow text-brand/70">Ihr Vorhaben beginnt mit einem Gespräch</p>
              <h2 id="anfrage" className="display mt-5 text-[clamp(2rem,4vw,3.75rem)] text-brand">
                Was haben Sie <span className="font-light italic text-brand-muted">vor?</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground/75">
                Ob einzelne Baumaßnahme oder umfassende Außenanlage: Erzählen Sie uns, was Sie
                planen. Standort, gewünschte Arbeiten und erste Fotos helfen uns, Ihr Projekt
                einzuordnen. Weitere Leistungen bieten wir auf Anfrage an.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 text-brand">
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
                  Zum Kontakt mit Datei-Upload{" "}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="min-w-0">
              <ServiceMiniContact
                serviceTitle="Garten- und Landschaftsbau"
                messagePlaceholder="Wo liegt Ihr Grundstück und welche Arbeiten möchten Sie mit uns besprechen?"
              />
            </div>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
