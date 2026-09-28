import { z } from "zod";
import { contactSchema } from "./validators";

export const OPEN = "Noch unklar";
export type Question = {
  id: string;
  label: string;
  short: string;
  help?: string;
  options?: string[];
  unit?: string;
  max?: number;
  optional?: boolean;
  when?: { id: string; values: string[] };
};
export type Trade = {
  id: string;
  title: string;
  description: string;
  tip: string;
  questions: Question[];
};
const choice = (
  id: string,
  label: string,
  short: string,
  options: string[],
  help?: string,
): Question => ({ id, label, short, options: [...options, OPEN], help });
const measure = (
  id: string,
  label: string,
  short: string,
  unit: string,
  max = 100000,
): Question => ({ id, label, short, unit, max });
export const TRADES: Trade[] = [
  {
    id: "garten",
    title: "Gartengestaltung",
    description: "Einen Garten neu denken oder umgestalten.",
    tip: "Überlegen Sie, was im Alltag wichtig ist: Platz zum Essen, Spielen, Erholen oder Gärtnern. Lieblingsbilder helfen uns, Ihren Stil zu verstehen.",
    questions: [
      measure("area", "Wie groß ist der betroffene Gartenbereich?", "Fläche", "m²"),
      choice("state", "Was ist heute vorhanden?", "Bestand", [
        "Neubau / Rohboden",
        "Bestehender Garten",
        "Verwilderte Fläche",
      ]),
      choice("style", "Welcher Stil gefällt Ihnen?", "Stil", [
        "Klar & modern",
        "Natürlich & blütenreich",
        "Mediterran",
        "Stilmix",
      ]),
      choice("use", "Was soll im Mittelpunkt stehen?", "Nutzung", [
        "Ruhe & Erholung",
        "Familie & Spielen",
        "Essen & Gäste",
        "Obst & Gemüse",
        "Mehrere Nutzungen",
      ]),
      choice("care", "Wie viel Pflege passt zu Ihrem Alltag?", "Pflege", [
        "Möglichst wenig",
        "Regelmäßig etwas Zeit",
        "Gartenarbeit als Hobby",
      ]),
      choice(
        "keep",
        "Sollen bestehende Elemente bleiben?",
        "Erhalten",
        ["Bäume / Pflanzen", "Terrasse / Wege", "Mehrere Elemente", "Alles neu"],
        "Was unbedingt bleiben soll, können Sie bei den Wünschen genauer beschreiben.",
      ),
      choice("plants", "Welche Bepflanzung wünschen Sie sich?", "Pflanzen", [
        "Blüten & Stauden",
        "Immergrün & Sichtschutz",
        "Bäume & Schatten",
        "Gemüse & Kräuter",
        "Gemischte Bepflanzung",
      ]),
    ],
  },
  {
    id: "pflaster",
    title: "Pflaster & Terrasse",
    description: "Einfahrten, Sitzplätze und Gartenwege.",
    tip: "Die spätere Nutzung entscheidet über den Aufbau. Fotografieren Sie Übergänge zu Haus, Garage und Straße sowie vorhandene Abläufe.",
    questions: [
      measure("area", "Welche Fläche soll gestaltet werden?", "Fläche", "m²"),
      choice("use", "Wie wird die Fläche genutzt?", "Nutzung", [
        "Terrasse",
        "Gartenweg",
        "PKW-Einfahrt",
        "Schwere Fahrzeuge",
        "Mehrere Bereiche",
      ]),
      choice("material", "Welches Material gefällt Ihnen?", "Material", [
        "Betonpflaster",
        "Großformatige Platten",
        "Naturstein",
        "Keramik",
        "Wasserdurchlässiger Belag",
      ]),
      choice("state", "Wie sieht die Fläche aktuell aus?", "Bestand", [
        "Erde / Rasen",
        "Alter Belag",
        "Schotter / Unterbau",
        "Gemischter Bestand",
      ]),
      choice("edges", "Sind Einfassungen vorgesehen?", "Einfassungen", [
        "Neue Randsteine",
        "Vorhandene behalten",
        "Ohne sichtbare Einfassung",
      ]),
      choice("water", "Wo fließt Regenwasser heute hin?", "Regenwasser", [
        "Vorhandener Ablauf",
        "In angrenzende Grünfläche",
        "Wasser bleibt stehen",
        "Noch kein Ablauf",
      ]),
    ],
  },
  {
    id: "naturstein",
    title: "Naturstein & Mauern",
    description: "Mauern, Stufen und natürliche Beläge.",
    tip: "Für Mauern brauchen wir neben der Länge auch die Höhe. Eine Stützmauer am Hang stellt andere Anforderungen als eine freistehende Gartenmauer.",
    questions: [
      choice("type", "Was möchten Sie aus Naturstein gestalten?", "Bauteil", [
        "Terrasse / Weg",
        "Freistehende Mauer",
        "Stützmauer am Hang",
        "Treppe / Stufen",
      ]),
      measure("area", "Wie groß ist die Belags- oder sichtbare Mauerfläche?", "Fläche", "m²"),
      {
        ...measure("length", "Wie lang soll die Mauer werden?", "Mauerlänge", "m", 10000),
        when: { id: "type", values: ["Freistehende Mauer", "Stützmauer am Hang"] },
      },
      {
        ...measure("height", "Welche Höhe ist vorgesehen?", "Mauerhöhe", "m", 20),
        when: { id: "type", values: ["Freistehende Mauer", "Stützmauer am Hang"] },
      },
      {
        ...measure("steps", "Wie viele Stufen sind vorgesehen?", "Stufen", "Stück", 100),
        when: { id: "type", values: ["Treppe / Stufen"] },
      },
      choice("material", "Gibt es einen Materialwunsch?", "Material", [
        "Granit",
        "Sandstein",
        "Kalkstein",
        "Andere Steinart",
      ]),
      choice("state", "Muss ein vorhandenes Bauteil zurückgebaut werden?", "Rückbau", [
        "Ja",
        "Nein",
        "Teilweise",
      ]),
    ],
  },
  {
    id: "zaun",
    title: "Zaun & Sichtschutz",
    description: "Grenzen, Privatsphäre und passende Tore.",
    tip: "Messen Sie die einzelnen Zaunabschnitte und Toröffnungen getrennt. Höhenunterschiede und vorhandene Fundamente bitte fotografieren.",
    questions: [
      measure("length", "Wie lang soll der Zaun insgesamt werden?", "Länge", "m", 10000),
      measure("height", "Wie hoch soll der Zaun werden?", "Höhe", "m", 10),
      choice("material", "Welches Material wünschen Sie?", "Material", [
        "Doppelstabmatte",
        "Holz",
        "WPC",
        "Aluminium",
        "Andere Ausführung",
      ]),
      choice("privacy", "Wie viel Sichtschutz ist gewünscht?", "Sichtschutz", [
        "Offen",
        "Teilweise",
        "Möglichst blickdicht",
      ]),
      choice("gate", "Benötigen Sie ein Tor?", "Tor", [
        "Kein Tor",
        "Gartentor",
        "Einfahrtstor",
        "Beides",
      ]),
      {
        ...measure("gateWidth", "Wie breit soll die größte Toröffnung sein?", "Torbreite", "m", 20),
        when: { id: "gate", values: ["Gartentor", "Einfahrtstor", "Beides"] },
      },
      choice("color", "Welche Farbe passt zu Ihrem Haus?", "Farbe", [
        "Anthrazit",
        "Grün",
        "Natur / Holzton",
        "Silber",
        "Andere Farbe",
      ]),
      choice("remove", "Soll ein alter Zaun entfernt werden?", "Altzaun", [
        "Ja, samt Fundamenten",
        "Ja, nur Zaun",
        "Nein",
      ]),
    ],
  },
  {
    id: "rasen",
    title: "Rasenanlagen",
    description: "Rollrasen, Einsaat und Bodenvorbereitung.",
    tip: "Notieren Sie, wie viel Sonne die Fläche bekommt und wie stark sie genutzt wird. Ein Foto zeigt uns Lücken, Unebenheiten und den bestehenden Bewuchs.",
    questions: [
      measure("area", "Wie groß ist die Rasenfläche?", "Fläche", "m²"),
      choice("type", "Wie soll der neue Rasen entstehen?", "Ausführung", [
        "Rollrasen",
        "Einsaat",
        "Bestehenden Rasen sanieren",
      ]),
      choice("sun", "Wie liegt die Fläche im Tagesverlauf?", "Licht", [
        "Überwiegend sonnig",
        "Sonne & Schatten",
        "Überwiegend schattig",
      ]),
      choice("use", "Wie wird der Rasen genutzt?", "Nutzung", [
        "Spielen / Sport",
        "Zierfläche",
        "Familie / Haustiere",
      ]),
      choice("state", "Was ist aktuell auf der Fläche?", "Bestand", [
        "Alter Rasen",
        "Offener Boden",
        "Starker Wildwuchs",
        "Belag / Schotter",
      ]),
      choice("extras", "Welche Ergänzung ist wichtig?", "Ergänzung", [
        "Keine",
        "Mähkante",
        "Maulwurfschutz",
        "Beides",
      ]),
    ],
  },
  {
    id: "wasser",
    title: "Bewässerung",
    description: "Rasen, Beete und Hecken gezielt versorgen.",
    tip: "Wasserquelle, verfügbare Wassermenge und getrennte Pflanzbereiche helfen bei der Planung. Technische Werte nur eintragen, wenn sie bekannt sind.",
    questions: [
      measure("area", "Welche Fläche soll bewässert werden?", "Fläche", "m²"),
      choice("zones", "Welche Bereiche möchten Sie bewässern?", "Bereiche", [
        "Rasen",
        "Beete / Hecken",
        "Rasen und Beete",
        "Kübel / Hochbeete",
      ]),
      choice("source", "Woher kommt das Wasser?", "Quelle", [
        "Außenwasserhahn",
        "Zisterne mit Pumpe",
        "Brunnen mit Pumpe",
        "Anschluss noch nötig",
      ]),
      choice("control", "Wie möchten Sie steuern?", "Steuerung", [
        "Manuell",
        "Zeitsteuerung",
        "App / Sensoren",
      ]),
      choice("state", "Gibt es bereits eine Anlage?", "Bestand", [
        "Nein, Neuanlage",
        "Teilweise",
        "Erweitern / modernisieren",
        "Reparatur",
      ]),
      {
        ...measure("flow", "Verfügbare Wassermenge, falls bekannt", "Wassermenge", "l/min", 1000),
        optional: true,
      },
      {
        ...measure("pressure", "Wasserdruck, falls bekannt", "Wasserdruck", "bar", 30),
        optional: true,
      },
    ],
  },
  {
    id: "erde",
    title: "Erdarbeiten",
    description: "Aushub, Bodenauftrag und Geländemodellierung.",
    tip: "Eine grobe Menge hilft uns bei Maschinen und Transport. Bodenqualität, Leitungen und Entsorgungsweg werden vor der Ausführung geprüft.",
    questions: [
      choice("type", "Welche Arbeit ist geplant?", "Arbeit", [
        "Boden ausheben",
        "Boden auftragen",
        "Gelände modellieren",
        "Graben herstellen",
        "Mehrere Arbeiten",
      ]),
      measure("volume", "Welche Bodenmenge betrifft das ungefähr?", "Menge", "m³"),
      choice("material", "Welches Material ist vorhanden?", "Material", [
        "Mutterboden",
        "Lehm / Ton",
        "Sand / Kies",
        "Steine / Bauschutt",
        "Gemischtes Material",
      ]),
      choice("analysis", "Gibt es Informationen zur Bodenqualität?", "Bodenprüfung", [
        "Bodengutachten vorhanden",
        "Auffälligkeiten bekannt",
        "Keine Unterlagen",
      ]),
      choice("supply", "Wird zusätzlich Material benötigt?", "Anlieferung", [
        "Mutterboden",
        "Schotter / Kies",
        "Mehrere Materialien",
        "Nein",
      ]),
    ],
  },
  {
    id: "entwaesserung",
    title: "Entwässerung",
    description: "Regenwasser und nasse Außenflächen.",
    tip: "Fotos direkt nach Regen sind besonders hilfreich. Wohin Wasser abgeleitet werden darf und welche Lösung passt, klären wir für Ihr Grundstück.",
    questions: [
      choice("problem", "Wo tritt das Problem auf?", "Bereich", [
        "Terrasse / Einfahrt",
        "Garten / Rasen",
        "Am Haus",
        "Mehrere Stellen",
        "Neubauplanung",
      ]),
      measure("area", "Wie groß ist die betroffene Fläche?", "Fläche", "m²"),
      choice("when", "Wann fällt Ihnen das Wasser auf?", "Auftreten", [
        "Bei starkem Regen",
        "Auch bei leichtem Regen",
        "Dauerhaft feucht",
        "Vorsorgliche Planung",
      ]),
      choice("solution", "Gibt es bereits eine Wunschlösung?", "Wunschlösung", [
        "Entwässerungsrinne",
        "Drainage",
        "Versickerung",
        "Regenwasserspeicher",
      ]),
      choice("connection", "Gibt es einen bekannten Ablauf oder Anschlusspunkt?", "Anschluss", [
        "Ja",
        "Nein",
        "Bestandsplan vorhanden",
      ]),
    ],
  },
  {
    id: "pflege",
    title: "Gartenpflege",
    description: "Regelmäßige Pflege oder einmalig Ordnung schaffen.",
    tip: "Umfang und Rhythmus bestimmen den Pflegeaufwand. Für Hecken und größere Gehölze sind Höhe, Länge und aktuelle Fotos hilfreich.",
    questions: [
      measure("area", "Wie groß ist der zu pflegende Bereich?", "Fläche", "m²"),
      choice("work", "Welche Arbeiten stehen im Vordergrund?", "Arbeiten", [
        "Rasenpflege",
        "Hecken / Gehölze",
        "Beete / Unkraut",
        "Komplette Pflege",
        "Garten aufräumen",
      ]),
      choice("frequency", "Wie oft benötigen Sie Unterstützung?", "Rhythmus", [
        "Einmalig",
        "Wöchentlich",
        "Alle 2–4 Wochen",
        "Saisonal",
      ]),
      choice("state", "Wie ist der aktuelle Pflegezustand?", "Zustand", [
        "Regelmäßig gepflegt",
        "Etwas nachzuholen",
        "Stark verwachsen",
      ]),
      {
        ...measure("hedge", "Wie lang sind die Hecken insgesamt?", "Heckenlänge", "m", 10000),
        when: { id: "work", values: ["Hecken / Gehölze", "Komplette Pflege"] },
      },
      {
        ...measure("height", "Wie hoch sind die Hecken ungefähr?", "Heckenhöhe", "m", 30),
        when: { id: "work", values: ["Hecken / Gehölze", "Komplette Pflege"] },
      },
    ],
  },
];
export const SITE_QUESTIONS = [
  choice(
    "access",
    "Wie breit ist die engste Zufahrt?",
    "Zufahrt",
    ["Unter 1 m", "1–2 m", "Über 2 m"],
    "Gemeint ist der Weg von der Straße bis zur Arbeitsfläche – auch Gartentore zählen.",
  ),
  choice("route", "Wie erreichen wir die Arbeitsfläche?", "Zugang", [
    "Ebenerdig",
    "Über Stufen",
    "Durch das Gebäude",
    "Nur über Nachbargrundstück",
  ]),
  choice("slope", "Wie verläuft das Gelände?", "Gelände", [
    "Weitgehend eben",
    "Leicht geneigt",
    "Deutlicher Hang",
  ]),
  choice(
    "utilities",
    "Sind Leitungen im Arbeitsbereich bekannt?",
    "Leitungen",
    ["Ja, Lage bekannt", "Ja, Lage unklar", "Keine bekannt"],
    "Zum Beispiel Strom, Gas, Wasser oder vorhandene Bewässerung. Bitte keine eigenen Grabungen zur Prüfung.",
  ),
  choice("space", "Gibt es Platz für Material und Container?", "Lagerplatz", [
    "Auf dem Grundstück",
    "Nur an der Straße",
    "Kein Platz",
  ]),
];
export const FRAME_QUESTIONS = [
  choice(
    "budget",
    "Welcher Budgetrahmen ist vorgesehen?",
    "Budget",
    ["Unter 5.000 €", "5.000–15.000 €", "15.000–30.000 €", "30.000–60.000 €", "Über 60.000 €"],
    "Für das gesamte ausgewählte Vorhaben. Der Rahmen hilft bei passenden Materialien und Prioritäten.",
  ),
  choice("time", "Wann möchten Sie starten?", "Start", [
    "So bald wie möglich",
    "In 1–3 Monaten",
    "In 3–6 Monaten",
    "Später / flexibel",
  ]),
  choice("priority", "Was ist Ihnen besonders wichtig?", "Priorität", [
    "Pflegeleicht",
    "Gestaltung / Qualität",
    "Budget einhalten",
    "Schnell umsetzen",
    "Nachhaltigkeit",
    "Barrierearme Nutzung",
  ]),
  choice("disposal", "Was soll mit Altmaterial und Grünschnitt passieren?", "Abtransport", [
    "Durch Loni abfahren",
    "Auf Grundstück behalten",
    "Selbst organisieren",
    "Fällt nicht an",
  ]),
  choice("ownWork", "Möchten Sie Eigenleistungen übernehmen?", "Eigenleistung", [
    "Nein",
    "Rückbau / Vorbereitung",
    "Material beschaffen",
    "Nach Absprache",
  ]),
  choice("documents", "Wie weit ist die Planung?", "Planungsstand", [
    "Erste Ideen",
    "Skizze / Fotos vorhanden",
    "Plan / Leistungsverzeichnis",
    "Abgestimmte Planung",
  ]),
  choice(
    "permission",
    "Ist die Umsetzung mit den Verantwortlichen abgestimmt?",
    "Abstimmung",
    ["Eigenes Grundstück", "Zustimmung liegt vor", "Zustimmung steht aus"],
    "Zum Beispiel mit Eigentümer, Verwaltung oder weiteren Entscheidern.",
  ),
];
export type PlannerState = {
  services: string[];
  clientType: string;
  details: Record<string, Record<string, string>>;
  site: Record<string, string>;
  frame: Record<string, string>;
  zip: string;
  city: string;
  street: string;
  deadline: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  channel: string;
  consent: boolean;
};
export const INITIAL_PLANNER: PlannerState = {
  services: [],
  clientType: "",
  details: {},
  site: {},
  frame: {},
  zip: "",
  city: "",
  street: "",
  deadline: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
  channel: "E-Mail",
  consent: false,
};
export type PlannerStep = { id: string; title: string; intro: string };
export function plannerSteps(state: PlannerState): PlannerStep[] {
  return [
    {
      id: "project",
      title: "Was möchten Sie verändern?",
      intro:
        "Wählen Sie alle passenden Bereiche. Wir fragen anschließend nur nach Details, die für Ihr Vorhaben relevant sind.",
    },
    ...TRADES.filter((t) => state.services.includes(t.id)).map((t) => ({
      id: t.id,
      title: t.title,
      intro:
        "Ungefähre Angaben reichen für den Einstieg. Was noch offen ist, besprechen wir gemeinsam.",
    })),
    {
      id: "site",
      title: "Wie sieht es vor Ort aus?",
      intro: "Adresse, Zugang und Gelände helfen uns, den Aufwand realistisch einzuschätzen.",
    },
    {
      id: "frame",
      title: "Was ist Ihnen wichtig?",
      intro: "Mit Budget, Termin und Prioritäten können wir eine passende Lösung vorbereiten.",
    },
    {
      id: "photos",
      title: "Zeigen Sie uns Ihr Vorhaben.",
      intro:
        "Fotos, Pläne und Ihre eigenen Worte machen die Anfrage greifbar. Anhänge sind freiwillig.",
    },
    {
      id: "review",
      title: "Ihr Projekt auf einen Blick.",
      intro:
        "Prüfen Sie Ihre Angaben und ergänzen Sie Ihre Kontaktdaten. Sie stellen eine unverbindliche Anfrage.",
    },
  ];
}
export const visibleQuestions = (trade: Trade, answers: Record<string, string>) =>
  trade.questions.filter((q) => !q.when || q.when.values.includes(answers[q.when.id]));
export function validMeasure(value: string, max = 100000) {
  return (
    /^\d{1,6}([.,]\d{1,2})?$/.test(value) &&
    Number(value.replace(",", ".")) > 0 &&
    Number(value.replace(",", ".")) <= max
  );
}
export function rectangleMeasure(length: string, width: string, depth?: string) {
  const parts = depth === undefined ? [length, width] : [length, width, depth];
  if (!parts.every((v) => validMeasure(v, 10000))) return null;
  const value = parts.reduce((a, v) => a * Number(v.replace(",", ".")), 1);
  return value > 0 && value <= 100000 ? Math.round(value * 100) / 100 : null;
}
export type PlannerErrors = Record<string, string>;
function questionErrors(questions: Question[], answers: Record<string, string>, prefix: string) {
  const errors: PlannerErrors = {};
  for (const q of questions) {
    const v = answers[q.id] || "";
    if (q.optional && !v) continue;
    if (q.options ? !q.options.includes(v) : v !== OPEN && !validMeasure(v, q.max))
      errors[prefix + "." + q.id] = q.options
        ? "Bitte auswählen – auch „Noch unklar“ ist möglich."
        : "Bitte ein positives Maß eingeben oder „Noch unklar“ wählen.";
    if (q.unit === "Stück" && v !== OPEN && v && !/^\d+$/.test(v))
      errors[prefix + "." + q.id] = "Bitte eine ganze Anzahl eingeben.";
  }
  return errors;
}
export function validatePlannerStep(s: PlannerState, step: string): PlannerErrors {
  let e: PlannerErrors = {};
  if (step === "project") {
    if (
      !s.services.length ||
      s.services.some((id) => id !== "beratung" && !TRADES.some((t) => t.id === id)) ||
      new Set(s.services).size !== s.services.length ||
      (s.services.includes("beratung") && s.services.length > 1)
    )
      e.services = "Wählen Sie mindestens einen Bereich oder „Ich brauche Orientierung“.";
    if (!["Privat", "Gewerbe", "Verwaltung / Gemeinschaft"].includes(s.clientType))
      e.clientType = "Bitte wählen Sie die Art des Projekts.";
  }
  const trade = TRADES.find((t) => t.id === step);
  if (trade)
    e = {
      ...e,
      ...questionErrors(
        visibleQuestions(trade, s.details[step] || {}),
        s.details[step] || {},
        step,
      ),
    };
  if (step === "site") {
    if (!/^\d{5}$/.test(s.zip.trim()))
      e.zip = "Bitte eine fünfstellige deutsche Postleitzahl eingeben.";
    if (!s.city.trim() || s.city.length > 60)
      e.city = "Bitte den Projektort angeben (max. 60 Zeichen).";
    if (s.street.length > 100) e.street = "Bitte höchstens 100 Zeichen verwenden.";
    e = { ...e, ...questionErrors(SITE_QUESTIONS, s.site, "site") };
  }
  if (step === "frame") {
    e = { ...e, ...questionErrors(FRAME_QUESTIONS, s.frame, "frame") };
    if (s.deadline.length > 80) e.deadline = "Bitte höchstens 80 Zeichen verwenden.";
  }
  if (step === "photos") {
    if (s.notes.length > 600) e.notes = "Bitte höchstens 600 Zeichen verwenden.";
    if (s.services.includes("beratung") && s.notes.trim().length < 10)
      e.notes = "Beschreiben Sie kurz, wobei Sie Unterstützung wünschen.";
  }
  if (step === "review") {
    if (!contactSchema.shape.name.safeParse(s.name).success)
      e.name = "Bitte Ihren Namen angeben (max. 200 Zeichen).";
    if (!contactSchema.shape.email.safeParse(s.email).success)
      e.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (s.phone.length > 50 || (s.phone && !/^[+()\d\s/.-]{6,50}$/.test(s.phone)))
      e.phone = "Bitte eine gültige Telefonnummer angeben.";
    if (!["E-Mail", "Telefon"].includes(s.channel)) e.channel = "Bitte einen Kontaktweg wählen.";
    if (s.channel === "Telefon" && s.phone.replace(/\D/g, "").length < 6)
      e.phone = "Für einen Rückruf benötigen wir Ihre Telefonnummer.";
    if (!s.consent) e.consent = "Bitte stimmen Sie der Bearbeitung Ihrer Anfrage zu.";
  }
  return e;
}
const answersSchema = z.record(z.string().max(40), z.string().max(100));
export const plannerDraftSchema = z.object({
  services: z.array(z.string().max(30)).max(TRADES.length),
  clientType: z.string().max(40),
  details: z.record(z.string().max(30), answersSchema),
  site: answersSchema,
  frame: answersSchema,
  zip: z.string().max(5),
  city: z.string().max(60),
  street: z.string().max(100),
  deadline: z.string().max(80),
  notes: z.string().max(600),
  name: z.string().max(200),
  email: z.string().max(320),
  phone: z.string().max(50),
  channel: z.string().max(20),
  consent: z.boolean(),
});
export const plannerStateSchema = plannerDraftSchema.superRefine((s, ctx) => {
  for (const step of plannerSteps(s))
    for (const [path, message] of Object.entries(validatePlannerStep(s, step.id)))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: path.split("."), message });
});
export type SummarySection = { id: string; title: string; rows: [string, string][] };
export function plannerSummary(s: PlannerState): SummarySection[] {
  const rows = (qs: Question[], answers: Record<string, string>): [string, string][] =>
    qs.map((q) => {
      const value = answers[q.id] || "";
      return [
        q.short,
        value
          ? q.unit && value !== OPEN
            ? "ca. " + value + " " + q.unit
            : value
          : "Nicht angegeben",
      ];
    });
  return [
    {
      id: "project",
      title: "Vorhaben",
      rows: [
        ["Projekt", s.clientType || "Noch offen"],
        [
          "Bereiche",
          s.services.includes("beratung")
            ? "Beratung / Orientierung"
            : TRADES.filter((t) => s.services.includes(t.id))
                .map((t) => t.title)
                .join(", ") || "Noch offen",
        ],
      ],
    },
    ...TRADES.filter((t) => s.services.includes(t.id)).map((t) => ({
      id: t.id,
      title: t.title,
      rows: rows(visibleQuestions(t, s.details[t.id] || {}), s.details[t.id] || {}),
    })),
    {
      id: "site",
      title: "Grundstück",
      rows: [
        [
          "Adresse",
          [s.street, [s.zip, s.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") ||
            "Noch offen",
        ],
        ...rows(SITE_QUESTIONS, s.site),
      ],
    },
    {
      id: "frame",
      title: "Rahmen",
      rows: [
        ...rows(FRAME_QUESTIONS, s.frame),
        ["Fixtermin", s.deadline.trim() || "Keiner angegeben"],
      ],
    },
    {
      id: "photos",
      title: "Wünsche & Hinweise",
      rows: [["Notizen", s.notes.trim() || "Keine Ergänzungen"]],
    },
  ];
}
export function plannerOpenPoints(s: PlannerState) {
  const points: string[] = [];
  for (const section of plannerSummary(s))
    for (const [label, value] of section.rows)
      if (value === OPEN || value === "Nicht angegeben" || value === "Noch offen")
        points.push(section.title + ": " + label);
  if (!s.street.trim()) points.push("Genaue Projektadresse");
  return points;
}
export function buildPlannerPayload(input: unknown) {
  const s = plannerStateSchema.parse(input);
  const sections = plannerSummary(s);
  const message = [
    "GARTENPLANER · Projektbriefing",
    "Maße sind Kundenangaben und vor Ausführung zu prüfen.",
    ...sections.map(
      (section) =>
        "\n" +
        section.title.toUpperCase() +
        "\n" +
        section.rows.map(([k, v]) => k + ": " + v).join("\n"),
    ),
    "\nKontaktweg: " + s.channel,
    "Datenschutzhinweise zur Bearbeitung bestätigt.",
  ].join("\n");
  return contactSchema.parse({
    name: s.name,
    email: s.email,
    phone: s.phone,
    subject:
      "Gartenplaner: " +
      (s.services.includes("beratung")
        ? "Beratung"
        : TRADES.filter((t) => s.services.includes(t.id))
            .map((t) => t.title)
            .join(", ")
      ).slice(0, 180),
    message,
  });
}
export function plannerText(s: PlannerState, files: string[] = []) {
  return [
    "LONI GALABAU · MEINE PROJEKTÜBERSICHT",
    "Unverbindliche Planungsgrundlage. Offene Punkte und Maße werden gemeinsam geklärt.",
    ...plannerSummary(s).map(
      (section) =>
        "\n" +
        section.title.toUpperCase() +
        "\n" +
        section.rows.map(([k, v]) => k + ": " + v).join("\n"),
    ),
    "\nANHÄNGE\n" + (files.join("\n") || "Keine"),
    "\nKONTAKT\n" + [s.name, s.email, s.phone, s.channel].filter(Boolean).join("\n"),
    "\nNÄCHSTER SCHRITT\nLoni prüft Umfang, Rückfragen und einen möglichen Vor-Ort-Termin. Ein verbindliches Angebot folgt nach Klärung der Ausführung.",
  ].join("\n");
}
