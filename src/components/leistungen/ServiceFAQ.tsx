import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type QA = { q: string; a: string };

const GENERIC: QA[] = [
  {
    q: "Wie läuft ein Projekt bei Loni Galabau ab?",
    a: "Wir klären Ihre Wünsche, besprechen bei Bedarf einen Vor-Ort-Termin und erstellen ein Angebot. Nach der Beauftragung stimmen wir die Ausführung ab.",
  },
  {
    q: "Wie wird das Angebot erstellt?",
    a: "Wir stimmen Leistungsumfang und Materialien mit Ihnen ab. Das Angebot beschreibt die vereinbarten Leistungen; Änderungen besprechen wir vor der Ausführung.",
  },
  {
    q: "In welchem Umkreis sind Sie tätig?",
    a: "Wir arbeiten im gesamten Rhein-Main-Gebiet – Hattersheim, Frankfurt, Kelkheim, Hofheim und im Main-Taunus-Kreis.",
  },
  {
    q: "Welche Garantie geben Sie auf Ihre Arbeit?",
    a: "Sie erhalten die gesetzliche Gewährleistung auf alle handwerklichen Leistungen. Zusätzliche Pflegeleistungen und Garantien bedürfen einer ausdrücklichen Vereinbarung.",
  },
  {
    q: "Wie schnell können Sie starten?",
    a: "Der mögliche Beginn hängt von Umfang, Materialverfügbarkeit und unserer Auslastung ab. Einen Termin stimmen wir im persönlichen Gespräch ab.",
  },
];

const SERVICE_FAQS: Record<string, QA[]> = {
  natursteinarbeiten: [
    {
      q: "Welche Natursteine empfehlen Sie für meine Region?",
      a: "Die Auswahl richtet sich nach Nutzung, gewünschter Oberfläche und den Eigenschaften des konkreten Steins. Wir besprechen passende Materialien für Ihr Vorhaben.",
    },
    {
      q: "Sind Natursteinarbeiten pflegeintensiv?",
      a: "Nein. Hochwertige Natursteine altern in Würde. Eine jährliche Reinigung und gelegentliche Imprägnierung reichen meist aus.",
    },
    {
      q: "Wie verhindern Sie unschönes Fugenkraut?",
      a: "Wir setzen auf wasserdurchlässige Spezialfugenmörtel oder gebundene Verlegung. Die passende Fuge hängt vom Aufbau und der Nutzung ab; regelmäßige Pflege bleibt erforderlich.",
    },
    {
      q: "Kann Naturstein auch im Innen- und Außenbereich kombiniert werden?",
      a: "Ja, sehr beliebt. Wir planen fließende Übergänge zwischen Terrasse, Eingang und Innenraum mit demselben Steinbild.",
    },
    {
      q: "Wie lange dauert eine typische Natursteinterrasse?",
      a: "Für eine Terrasse zwischen 25–50 m² rechnen Sie mit 5–10 Arbeitstagen inklusive Unterbau, Drainage und Fugenarbeit.",
    },
  ],
  pflasterarbeiten: [
    {
      q: "Welche Pflasterarten sind besonders langlebig?",
      a: "Beton- und Natursteinpflaster mit korrekt verdichtetem Unterbau halten Jahrzehnte. Entscheidend sind Schichtdicken, Gefälle und Randeinfassung.",
    },
    {
      q: "Sind Ihre Pflasterflächen befahrbar?",
      a: "Teilen Sie uns mit, welche Fahrzeuge die Fläche nutzen sollen. Unterbau, Pflaster und Einfassungen werden darauf abgestimmt.",
    },
    {
      q: "Wie wird das Regenwasser abgeführt?",
      a: "Gefälle, Rinnen oder Versickerung werden anhand des Grundstücks und der zulässigen Entwässerung geplant. Vorhandene Anschlüsse prüfen wir gemeinsam.",
    },
    {
      q: "Wie lange dauert eine neue Einfahrt?",
      a: "Eine durchschnittliche Einfahrt von 40–60 m² ist in 1–2 Wochen einschließlich Aushub, Unterbau und Pflasterung fertig.",
    },
    {
      q: "Können Sie altes Pflaster wiederverwenden?",
      a: "In vielen Fällen ja – wir reinigen, sortieren und verlegen es neu. Das spart Kosten und erhält Charakter.",
    },
  ],
  gartengestaltung: [
    {
      q: "Wie individuell ist Ihre Planung?",
      a: "Jeder Garten ist ein Unikat. Wir analysieren Lichtverhältnisse, Boden, Architektur und Ihre Lebensgewohnheiten – und entwickeln daraus ein maßgeschneidertes Konzept.",
    },
    {
      q: "Erstellen Sie auch 3D-Visualisierungen?",
      a: "Welche Planungsdarstellung für Ihr Projekt sinnvoll und verfügbar ist, klären wir im Beratungsgespräch.",
    },
    {
      q: "Welche Pflanzen wählen Sie aus?",
      a: "Wir setzen auf standortgerechte, pflegeleichte und vorzugsweise heimische Pflanzen – ökologisch sinnvoll und langfristig schön.",
    },
    {
      q: "Wie viel kostet eine komplette Gartenneugestaltung?",
      a: "Die Kosten hängen von Bestand, Fläche, Materialien und Arbeitsumfang ab. Für eine belastbare Kalkulation benötigen wir Projektdaten und gegebenenfalls ein Aufmaß.",
    },
    {
      q: "Kann ich den Garten in Bauabschnitten umsetzen?",
      a: "Absolut. Wir planen ganzheitlich und realisieren modular, damit das Budget über mehrere Jahre verteilt werden kann.",
    },
  ],
  bewaesserungsanlagen: [
    {
      q: "Lohnt sich eine automatische Bewässerung?",
      a: "Eine passend eingestellte Anlage kann das Bewässern erleichtern. Ob sie sich eignet, hängt unter anderem von Pflanzen, Fläche und Wasseranschluss ab.",
    },
    {
      q: "Wie wird die Anlage gesteuert?",
      a: "Per Smart-Controller via App oder zeitgesteuert. Bodenfeuchtesensoren und Regenstopp sind optional integrierbar.",
    },
    {
      q: "Sind Tropf- oder Versenkregner besser?",
      a: "Beete und Hecken werden über Tropfschläuche bewässert, Rasenflächen über Versenkregner. Wir kombinieren beides nach Bedarf.",
    },
    {
      q: "Wie aufwendig ist der Einbau im Bestandsgarten?",
      a: "Das hängt von der Zugänglichkeit und vorhandenen Bepflanzung ab. Wir besprechen Leitungswege und notwendige Eingriffe vor der Umsetzung.",
    },
    {
      q: "Was passiert im Winter?",
      a: "Wir bieten saisonale Ein- und Auswinterung der Anlage inklusive Druckluft-Entleerung.",
    },
  ],
  rasenanlagen: [
    {
      q: "Rollrasen oder Saatrasen?",
      a: "Rollrasen liefert sofort grüne Fläche, Saatrasen ist günstiger und etabliert sich tiefer. Wir beraten je nach Nutzung und Standort.",
    },
    {
      q: "Wie lange muss ich neuen Rasen schonen?",
      a: "Bei Rollrasen 2–3 Wochen, bei Saatrasen 6–8 Wochen, bis die volle Belastbarkeit erreicht ist.",
    },
    {
      q: "Welche Vorbereitung ist nötig?",
      a: "Wir lockern den Boden, verbessern ihn mit Substrat, planieren und walzen sorgfältig – Basis für einen dichten, gesunden Rasen.",
    },
  ],
  zaunarbeiten: [
    {
      q: "Welche Zauntypen bauen Sie?",
      a: "Doppelstabmatten, Holzlamellen, Gabionen, Sichtschutz-WPC und individuell geplante Sonderlösungen aus Metall.",
    },
    {
      q: "Brauche ich für meinen Zaun eine Genehmigung?",
      a: "Das hängt von Standort, Ausführung, örtlichen Vorgaben und Nachbarrechten ab. Bitte klären Sie die konkreten Anforderungen mit der zuständigen Stelle, bevor der Zaun gebaut wird.",
    },
    {
      q: "Wie tief werden die Pfosten verankert?",
      a: "Fundament und Verankerung richten sich nach Zauntyp, Bodenverhältnissen und Belastung. Eine pauschale Tiefe ist dafür nicht ausreichend.",
    },
  ],
  erdarbeiten: [
    {
      q: "Welche Maschinen setzen Sie ein?",
      a: "Vom Minibagger (1 m Durchfahrt) bis zum 5-Tonnen-Bagger – wir wählen die passende Größe für Ihre Zufahrt.",
    },
    {
      q: "Wohin geht der Aushub?",
      a: "Wir klären, ob Material auf dem Grundstück bleiben kann oder abgefahren werden muss. Erforderliche Untersuchungen und Annahmebedingungen werden vor dem Abtransport abgestimmt.",
    },
  ],
  entwaesserung: [
    {
      q: "Wie verhindern Sie Staunässe?",
      a: "Wir bauen Drainagesysteme mit Filtervlies, Kiesbett und Sammelschacht – abgestimmt auf Bodenart und Versickerungsleistung.",
    },
    {
      q: "Was kostet eine Rigole?",
      a: "Die Kalkulation hängt von benötigtem Volumen, Boden, Zugänglichkeit und Erdarbeiten ab. Zunächst muss geklärt werden, ob eine Versickerung am Standort zulässig und geeignet ist.",
    },
  ],
};

export function ServiceFAQ({
  slug,
  title,
  customFaqs,
}: {
  slug: string;
  title: string;
  customFaqs?: { q: string; a: string }[];
}) {
  // Wenn der Benutzer eigene FAQs eingepflegt hat, zeigen wir AUSSCHLIESSLICH diese.
  // Andernfalls greift das System auf die standardmäßigen Gewerke- & Generic-FAQs zurück.
  const hasCustom = Array.isArray(customFaqs) && customFaqs.length > 0;
  const items = hasCustom
    ? (customFaqs as { q: string; a: string }[])
    : [...(SERVICE_FAQS[slug] ?? []), ...GENERIC].slice(0, 7);
  return (
    <div>
      <span className="eyebrow eyebrow-bracket text-accent">FAQ</span>
      <h2 className="display text-[clamp(1.75rem,3.5vw,2.75rem)] mt-4 text-brand leading-[1.05]">
        Häufige Fragen.
      </h2>
      <p className="mt-4 text-foreground/65 max-w-md text-sm">
        Was Sie hier nicht finden, beantworten wir gerne persönlich – zu {title} und allem darum
        herum.
      </p>
      <Accordion type="single" collapsible className="mt-10 w-full">
        {items.map((item, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-brand/10">
            <AccordionTrigger className="text-left text-base font-medium text-brand py-5 hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-foreground/75 leading-relaxed pb-6 text-[15px]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
