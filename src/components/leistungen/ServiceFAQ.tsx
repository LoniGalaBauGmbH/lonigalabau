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
    a: "Nach Ihrer Anfrage melden wir uns innerhalb von 24 Stunden, vereinbaren einen kostenlosen Vor-Ort-Termin, erstellen ein Festpreisangebot und starten nach Ihrer Freigabe mit der Umsetzung.",
  },
  {
    q: "Erhalte ich einen verbindlichen Festpreis?",
    a: "Ja. Nach dem Aufmaß vor Ort erhalten Sie ein transparentes Festpreisangebot ohne versteckte Kosten.",
  },
  {
    q: "In welchem Umkreis sind Sie tätig?",
    a: "Wir arbeiten im gesamten Rhein-Main-Gebiet – Hattersheim, Frankfurt, Kelkheim, Hofheim und im Main-Taunus-Kreis.",
  },
  {
    q: "Welche Garantie geben Sie auf Ihre Arbeit?",
    a: "Sie erhalten die gesetzliche Gewährleistung auf alle handwerklichen Leistungen. Auf Pflanzen geben wir bei vereinbarter Pflege zusätzlich Anwuchsgarantie.",
  },
  {
    q: "Wie schnell können Sie starten?",
    a: "Je nach Saison und Projektgröße zwischen 2 und 8 Wochen nach Auftragsbestätigung. Bei dringenden Anliegen finden wir gemeinsam eine Lösung.",
  },
];

const SERVICE_FAQS: Record<string, QA[]> = {
  natursteinarbeiten: [
    { q: "Welche Natursteine empfehlen Sie für meine Region?", a: "Wir setzen vorwiegend auf wetterfeste Hartgesteine wie Basalt, Granit und Travertin – langlebig, frostsicher und optisch zeitlos im Rhein-Main-Klima." },
    { q: "Sind Natursteinarbeiten pflegeintensiv?", a: "Nein. Hochwertige Natursteine altern in Würde. Eine jährliche Reinigung und gelegentliche Imprägnierung reichen meist aus." },
    { q: "Wie verhindern Sie unschönes Fugenkraut?", a: "Wir setzen auf wasserdurchlässige Spezialfugenmörtel oder gebundene Verlegung. Diese stoppen Wildkraut langfristig und bleiben optisch sauber." },
    { q: "Kann Naturstein auch im Innen- und Außenbereich kombiniert werden?", a: "Ja, sehr beliebt. Wir planen fließende Übergänge zwischen Terrasse, Eingang und Innenraum mit demselben Steinbild." },
    { q: "Wie lange dauert eine typische Natursteinterrasse?", a: "Für eine Terrasse zwischen 25–50 m² rechnen Sie mit 5–10 Arbeitstagen inklusive Unterbau, Drainage und Fugenarbeit." },
  ],
  pflasterarbeiten: [
    { q: "Welche Pflasterarten sind besonders langlebig?", a: "Beton- und Natursteinpflaster mit korrekt verdichtetem Unterbau halten Jahrzehnte. Entscheidend sind Schichtdicken, Gefälle und Randeinfassung." },
    { q: "Sind Ihre Pflasterflächen befahrbar?", a: "Wir bauen Einfahrten und Hofflächen normgerecht für PKW- bis LKW-Belastung – mit Schotterträgerschicht und mindestens 8 cm Pflasterstärke." },
    { q: "Wie wird das Regenwasser abgeführt?", a: "Standard ist ein leichtes Gefälle (mind. 2 %) zur Versickerungsfläche oder Rinne. Auf Wunsch verlegen wir versickerungsfähige Öko-Pflaster." },
    { q: "Wie lange dauert eine neue Einfahrt?", a: "Eine durchschnittliche Einfahrt von 40–60 m² ist in 1–2 Wochen einschließlich Aushub, Unterbau und Pflasterung fertig." },
    { q: "Können Sie altes Pflaster wiederverwenden?", a: "In vielen Fällen ja – wir reinigen, sortieren und verlegen es neu. Das spart Kosten und erhält Charakter." },
  ],
  gartengestaltung: [
    { q: "Wie individuell ist Ihre Planung?", a: "Jeder Garten ist ein Unikat. Wir analysieren Lichtverhältnisse, Boden, Architektur und Ihre Lebensgewohnheiten – und entwickeln daraus ein maßgeschneidertes Konzept." },
    { q: "Erstellen Sie auch 3D-Visualisierungen?", a: "Ja, auf Wunsch zeigen wir Ihren neuen Garten als 3D-Modell, damit Sie das Ergebnis vor Baubeginn erleben können." },
    { q: "Welche Pflanzen wählen Sie aus?", a: "Wir setzen auf standortgerechte, pflegeleichte und vorzugsweise heimische Pflanzen – ökologisch sinnvoll und langfristig schön." },
    { q: "Wie viel kostet eine komplette Gartenneugestaltung?", a: "Realistisch sind 150–400 €/m² je nach Materialien, Bepflanzung und Sonderelementen. Nach Aufmaß erhalten Sie ein verbindliches Festpreisangebot." },
    { q: "Kann ich den Garten in Bauabschnitten umsetzen?", a: "Absolut. Wir planen ganzheitlich und realisieren modular, damit das Budget über mehrere Jahre verteilt werden kann." },
  ],
  bewaesserungsanlagen: [
    { q: "Lohnt sich eine automatische Bewässerung?", a: "Ja, sie spart bis zu 50 % Wasser gegenüber Schlauch-Bewässerung und schützt Pflanzen vor Trockenstress – besonders im Sommer im Rhein-Main-Gebiet." },
    { q: "Wie wird die Anlage gesteuert?", a: "Per Smart-Controller via App oder zeitgesteuert. Bodenfeuchtesensoren und Regenstopp sind optional integrierbar." },
    { q: "Sind Tropf- oder Versenkregner besser?", a: "Beete und Hecken werden über Tropfschläuche bewässert, Rasenflächen über Versenkregner. Wir kombinieren beides nach Bedarf." },
    { q: "Wie aufwendig ist der Einbau im Bestandsgarten?", a: "Wir arbeiten mit kabellosen Versenkbaggern und schmaler Verlegetechnik. Der Rasen ist nach 2–3 Wochen wieder geschlossen." },
    { q: "Was passiert im Winter?", a: "Wir bieten saisonale Ein- und Auswinterung der Anlage inklusive Druckluft-Entleerung." },
  ],
  rasenanlagen: [
    { q: "Rollrasen oder Saatrasen?", a: "Rollrasen liefert sofort grüne Fläche, Saatrasen ist günstiger und etabliert sich tiefer. Wir beraten je nach Nutzung und Standort." },
    { q: "Wie lange muss ich neuen Rasen schonen?", a: "Bei Rollrasen 2–3 Wochen, bei Saatrasen 6–8 Wochen, bis die volle Belastbarkeit erreicht ist." },
    { q: "Welche Vorbereitung ist nötig?", a: "Wir lockern den Boden, verbessern ihn mit Substrat, planieren und walzen sorgfältig – Basis für einen dichten, gesunden Rasen." },
  ],
  zaunarbeiten: [
    { q: "Welche Zauntypen bauen Sie?", a: "Doppelstabmatten, Holzlamellen, Gabionen, Sichtschutz-WPC und individuell geplante Sonderlösungen aus Metall." },
    { q: "Brauche ich für meinen Zaun eine Genehmigung?", a: "Bis 1,80 m Höhe ist im Rhein-Main-Gebiet meist keine Genehmigung nötig. Wir prüfen den Einzelfall mit Ihnen." },
    { q: "Wie tief werden die Pfosten verankert?", a: "Standardmäßig 80 cm tief in Punktfundamenten – frostsicher und stabil über Jahrzehnte." },
  ],
  erdarbeiten: [
    { q: "Welche Maschinen setzen Sie ein?", a: "Vom Minibagger (1 m Durchfahrt) bis zum 5-Tonnen-Bagger – wir wählen die passende Größe für Ihre Zufahrt." },
    { q: "Wohin geht der Aushub?", a: "Wir koordinieren Abtransport und Entsorgung nach LAGA-Klassen – sauber dokumentiert und umweltgerecht." },
  ],
  entwaesserung: [
    { q: "Wie verhindern Sie Staunässe?", a: "Wir bauen Drainagesysteme mit Filtervlies, Kiesbett und Sammelschacht – abgestimmt auf Bodenart und Versickerungsleistung." },
    { q: "Was kostet eine Rigole?", a: "Versickerungsrigolen liegen je nach Größe zwischen 2.000 € und 8.000 €. Förderungen sind in einigen Kommunen möglich." },
  ],
};

export function ServiceFAQ({ 
  slug, 
  title, 
  customFaqs 
}: { 
  slug: string; 
  title: string; 
  customFaqs?: { q: string; a: string }[] 
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
        Was Sie hier nicht finden, beantworten wir gerne persönlich – zu {title} und allem darum herum.
      </p>
      <Accordion type="single" collapsible className="mt-10 w-full">
        {items.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border-b border-brand/10"
          >
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
