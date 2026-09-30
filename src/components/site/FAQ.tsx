import { ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Was kostet eine Gartengestaltung?",
    a: "Die Kosten hängen stark von Größe, Materialien und Aufwand ab. Nach der Klärung Ihres Vorhabens erstellen wir ein Angebot mit dem vereinbarten Leistungsumfang.",
  },
  {
    q: "Wie lange dauert ein typisches Projekt?",
    a: "Bauzeit und Starttermin hängen vom Umfang, von Materiallieferungen, Zufahrt und Witterung ab. Nach der Bestandsaufnahme besprechen wir einen realistischen Ablauf für Ihr Vorhaben.",
  },
  {
    q: "Arbeiten Sie auch bei kleinen Aufträgen?",
    a: "Ja. Ob Pflegeeinsatz, einzelne Pflanzung oder kompletter Neubau – wir nehmen jedes Projekt mit der gleichen Sorgfalt an.",
  },
  {
    q: "In welchem Umkreis sind Sie tätig?",
    a: "Wir arbeiten im gesamten Rhein-Main-Gebiet – schwerpunktmäßig in Hattersheim, Frankfurt am Main, Kelkheim, Hofheim und dem Main-Taunus-Kreis.",
  },
  {
    q: "Übernehmen Sie auch die Pflege nach Fertigstellung?",
    a: "Selbstverständlich. Wir bieten regelmäßige Pflegeverträge an – von der saisonalen Pflege bis zur ganzjährigen Komplettbetreuung.",
  },
  {
    q: "Gibt es Garantie auf Pflanzen und Pflasterarbeiten?",
    a: "Auf alle handwerklichen Leistungen geben wir die gesetzliche Gewährleistung. Pflegeleistungen und etwaige zusätzliche Garantien vereinbaren wir ausdrücklich im jeweiligen Angebot.",
  },
  {
    q: "Wie läuft die Erstberatung ab?",
    a: "Nach Ihrer Anfrage melden wir uns persönlich. Wir klären Ihre Wünsche und vereinbaren bei Bedarf einen Termin zur Besichtigung.",
  },
  {
    q: "Kommen Fördermittel für mein Vorhaben infrage?",
    a: "Für Entsiegelung oder Regenwassernutzung können kommunale Programme infrage kommen. Die zuständige Stadt oder Gemeinde informiert über aktuelle Voraussetzungen und Antragsfristen. Klären Sie eine mögliche Förderung vor der Beauftragung.",
  },
];

export function FAQ() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 bg-surface">
      <div className="max-w-[1480px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <span className="eyebrow eyebrow-bracket text-brand">Häufige Fragen</span>
            <h2 className="display text-[clamp(2.25rem,5vw,4.5rem)] mt-6 text-brand">
              Antworten
              <br />
              vor dem Spatenstich
            </h2>
            <p className="mt-6 text-base text-foreground/75 leading-relaxed max-w-md">
              Sie haben eine Frage, die hier nicht beantwortet wird? Schreiben Sie uns – wir melden
              uns persönlich bei Ihnen.
            </p>
            <a
              href="#projektanfrage"
              className="mt-8 inline-flex items-center gap-2 bg-brand text-brand-foreground px-8 py-4 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-brand/90 transition"
            >
              Projekt anfragen <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b border-brand/15">
                  <AccordionTrigger className="text-left text-base md:text-lg font-display font-extrabold text-brand py-6 hover:no-underline hover:text-brand/80">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-foreground/75 leading-relaxed pb-6 pr-6">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
