import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { servicePreparation } from "@/lib/service-preparation";
import { ProjectOfferLinks } from "@/components/site/ProjectOfferLinks";

export function ServicePreparation({ slug }: { slug: string }) {
  const content = servicePreparation[slug];
  if (!content) return null;

  return (
    <section aria-labelledby="service-preparation-heading" className="px-6 pb-20 md:px-10 md:pb-28">
      <div className="mx-auto max-w-[1480px] rounded-3xl border border-brand/10 bg-surface p-6 md:p-10">
        <span className="eyebrow eyebrow-bracket text-brand">Angebot vorbereiten</span>
        <h2
          id="service-preparation-heading"
          lang="de"
          className="mt-4 max-w-4xl font-serif text-2xl leading-tight font-semibold text-brand hyphens-auto [overflow-wrap:anywhere] md:text-3xl"
        >
          {content.heading}
        </h2>
        <p className="mt-5 max-w-4xl text-base leading-relaxed text-foreground/80">
          {content.lead}
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-brand">
              Diese Punkte beeinflussen den Aufwand
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-foreground/80">
              {content.costFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-brand">
              Diese Angaben helfen bei Ihrer Anfrage
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-foreground/80">
              {content.requestChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              href="#anfrage"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Ihr Vorhaben anfragen <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        {(slug === "gartengestaltung" || slug === "erdarbeiten") && (
          <div className="mt-8 border-t border-brand/15 pt-6">
            <h3 className="font-display text-lg font-bold text-brand">
              Ein Spielplatz ist Teil Ihres Vorhabens?
            </h3>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-foreground/80">
              Für Kitas, Schulen, Kommunen und Wohnanlagen verbinden wir Erdarbeiten,
              Spielgeräte-Montage, Fallschutz und die Gestaltung der Außenanlage. Hier finden Sie
              Projektbilder und die passende Anfrage für Ihren Neubau oder Umbau.
            </p>
            <Link
              to="/spielplatzbau"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Spielplatzbau und Spielplatzgestaltung <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
        {slug === "gartengestaltung" && (
          <div className="mt-8 border-t border-brand/15 pt-6" id="hecke-pflanzen-lassen">
            <h3 className="font-display text-lg font-bold text-brand">
              Hecke pflanzen lassen: Sichtschutz passend zum Garten
            </h3>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-foreground/80">
              Eine neue Hecke soll zu Ihrem Grundstück und dem gewünschten Pflegeaufwand passen. Wir
              besprechen den Verlauf, den verfügbaren Platz und die gewünschte Höhe. Zur
              Vorbereitung gehören auch Sonne und Schatten, vorhandene Pflanzen, der Boden und die
              Wasserversorgung nach der Pflanzung. Pflanzenart und Größe stimmen wir gemeinsam mit
              Ihnen ab; der Grenzverlauf und geltende Pflanzabstände müssen vorab geklärt sein.
            </p>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h4 className="font-semibold text-brand">Was kostet eine Hecke pro Meter?</h4>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                  Die Länge allein ergibt noch keinen vergleichbaren Preis. Pflanzenart, Liefergröße
                  und Stückzahl, Bodenvorbereitung, Zugang und eine mögliche Entfernung der alten
                  Hecke beeinflussen den Aufwand. Im Angebot grenzen wir Pflanzenlieferung,
                  Pflanzarbeiten, Abtransport und gegebenenfalls Bewässerung voneinander ab.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand">So bereiten Sie Ihre Anfrage vor</h4>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                  Senden Sie Fotos, die ungefähre Länge, Ihre gewünschte Sichtschutzhöhe und den
                  Projektort. Zeigen Sie bestehende Pflanzen, den Materialzugang und den
                  Wasseranschluss. Erwähnen Sie, ob die Hecke neu angelegt oder ersetzt werden soll.
                  Auch die Betreuung und Bewässerung nach der Pflanzung sprechen wir mit Ihnen ab.
                </p>
              </div>
            </div>
            <a
              href="#anfrage"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Heckenpflanzung anfragen <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        )}
        {slug === "gartengestaltung" && (
          <div className="mt-8 border-t border-brand/15 pt-6">
            <h3 className="font-display text-lg font-bold text-brand">
              Ihr Gartenprojekt in Frankfurt
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
              Sie möchten Ihren Garten in Frankfurt neu anlegen oder umgestalten? Auf unserer
              Ortsseite finden Sie Leistungen, Hinweise zum Aufwand und die direkte Projektanfrage.
            </p>
            <Link
              to="/gartenbau-frankfurt"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Garten- und Landschaftsbau in Frankfurt <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
        {slug === "zaunarbeiten" && (
          <div className="mt-8 border-t border-brand/15 pt-6">
            <h3 className="font-display text-lg font-bold text-brand">
              Zaunbau in Frankfurt und im Rhein-Main-Gebiet
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
              Für einen neuen Zaun in Frankfurt helfen Fotos des Grenzverlaufs, die ungefähre Länge
              und die gewünschte Torbreite. Zeigen Sie auch, wie Material in den Garten gelangt und
              welche vorhandenen Zaunabschnitte erhalten bleiben sollen. Von unserem Firmensitz in
              Hattersheim betreuen wir Projekte nach individueller Abstimmung auch deutschlandweit.
            </p>
            <Link
              to="/gartenbau-frankfurt"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Ihr Gartenprojekt in Frankfurt vorbereiten{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
        {[
          "gartengestaltung",
          "pflasterarbeiten",
          "natursteinarbeiten",
          "erdarbeiten",
          "entwaesserung",
        ].includes(slug) && <ProjectOfferLinks compact />}
        {["erdarbeiten", "entwaesserung", "bewaesserungsanlagen", "rasenanlagen"].includes(
          slug,
        ) && (
          <div className="mt-8 border-t border-brand/15 pt-6">
            <h3 className="font-display text-lg font-bold text-brand">
              Regenwasser im Garten nutzen
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
              Sie planen eine Zisterne? Wir betrachten Speicher, Erdarbeiten, Wasserwege und
              Gartenbewässerung gemeinsam. Die Themenseite erklärt Einbau, Nachrüstung und die
              Angaben für eine passende Anfrage.
            </p>
            <Link
              to="/zisterne-einbauen-lassen"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Zisterne einbauen lassen <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
