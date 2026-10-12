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
    q: "In welchem Gebiet sind Sie tätig?",
    a: "Wir arbeiten deutschlandweit. Unser Firmensitz ist in Hattersheim am Main bei Frankfurt. Beschreiben Sie uns Ihr Vorhaben und den Projektort – wir stimmen die nächsten Schritte persönlich mit Ihnen ab.",
  },
  {
    q: "Kann ich weitere Leistungen anfragen?",
    a: "Die gezeigten Leistungen sind ein Einblick in unser Angebot. Beschreiben Sie die gewünschten Arbeiten und den Projektort. Wir klären, welche Leistungen wir für Ihr Vorhaben übernehmen können.",
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
      a: "Pflege und Reinigung hängen von Steinart, Oberfläche, Fugen und Nutzung ab. Wir besprechen die Hinweise für das ausgewählte Material. Nicht jedes Reinigungsmittel oder jede Imprägnierung passt zu jedem Naturstein.",
    },
    {
      q: "Wie verhindern Sie unschönes Fugenkraut?",
      a: "Wir setzen auf wasserdurchlässige Spezialfugenmörtel oder gebundene Verlegung. Die passende Fuge hängt vom Aufbau und der Nutzung ab; regelmäßige Pflege bleibt erforderlich.",
    },
    {
      q: "Kann Naturstein an eine bestehende Terrasse anschließen?",
      a: "Das wird anhand von Höhen, Aufbau und Zustand der erhaltenen Fläche beurteilt. Fotos helfen bei der ersten Einordnung; Material und Anschlüsse werden für das konkrete Vorhaben abgestimmt.",
    },
    {
      q: "Wie lange dauert eine typische Natursteinterrasse?",
      a: "Die Dauer hängt von Bestand, Aufbau, Material, Zugang und Arbeitsumfang ab. Wir stimmen den Ablauf nach Klärung dieser Punkte ab; die Flächengröße allein ergibt noch keinen verlässlichen Bauzeitenplan.",
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
      a: "Rückbau, Unterbau, Anschlüsse, Material und Zugänglichkeit bestimmen die Bauzeit mit. Welche Arbeiten erforderlich sind und wann die Fläche wieder genutzt werden kann, stimmen wir für Ihr Projekt ab.",
    },
    {
      q: "Können Sie altes Pflaster wiederverwenden?",
      a: "Eine Wiederverwendung lässt sich anhand von Zustand, Menge und gewünschter Nutzung prüfen. Sortierung, Ergänzungen und Neuverlegung werden im Umfang berücksichtigt. Ein Preisvorteil lässt sich daraus nicht pauschal ableiten.",
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
      a: "Der Frostschutz richtet sich nach dem eingesetzten System und den Herstellerhinweisen. Besprechen Sie vorab, welche Vorbereitung erforderlich ist, welche Bauteile zugänglich bleiben und wer die Arbeiten übernimmt.",
    },
  ],
  rasenanlagen: [
    {
      q: "Rollrasen oder Saatrasen?",
      a: "Rollrasen liefert schneller eine geschlossene Fläche; Einsaat entwickelt sich erst nach der Aussaat. Bodenvorbereitung, Standort, gewünschte Nutzung und anschließende Betreuung gehören bei beiden Varianten in die Entscheidung.",
    },
    {
      q: "Wie lange muss ich neuen Rasen schonen?",
      a: "Die erste Nutzung richtet sich nach Anwachsen, Wetter und Belastung. Verlegter Rollrasen ist nicht sofort vollständig belastbar. Wir besprechen, woran Sie einen geeigneten Nutzungszeitpunkt erkennen und welche Pflege vorgesehen ist.",
    },
    {
      q: "Welche Vorbereitung ist nötig?",
      a: "Wir lockern den Boden, verbessern ihn mit Substrat, planieren und walzen sorgfältig – Basis für einen dichten, gesunden Rasen.",
    },
  ],
  zaunarbeiten: [
    {
      q: "Welche Zauntypen bauen Sie?",
      a: "Beschreiben Sie das gewünschte Material, den Verlauf und ob offene Begrenzung oder Sichtschutz gebraucht wird. Wir klären, welches System für Ihr Vorhaben passend und verfügbar ist.",
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
      a: "Die Auswahl richtet sich nach Aufgabe, Zufahrtsbreite und -höhe, Tragfähigkeit und Bewegungsraum. Senden Sie Fotos und Maße; eine geeignete Maschine lässt sich nicht allein aus einer pauschalen Durchfahrtsbreite bestimmen.",
    },
    {
      q: "Wohin geht der Aushub?",
      a: "Wir klären, ob Material auf dem Grundstück bleiben kann oder abgefahren werden muss. Erforderliche Untersuchungen und Annahmebedingungen werden vor dem Abtransport abgestimmt.",
    },
  ],
  entwaesserung: [
    {
      q: "Wie verhindern Sie Staunässe?",
      a: "Zuerst werden Ursache, Boden und möglicher weiterer Wasserweg geklärt. Je nach Befund kommen unterschiedliche Maßnahmen infrage. Eine Drainage ist nicht auf jedem Grundstück geeignet und wird nicht ohne diese Prüfung zugesagt.",
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
      <span className="eyebrow eyebrow-bracket text-accent-ink">FAQ</span>
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
