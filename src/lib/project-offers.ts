import { projectPhotos } from "./project-photos";
import { canonicalUrl } from "./seo";
import { publicImageUrl } from "./public-image-url";
import type { EXPRESS_SERVICES } from "./express-inquiry";

export function projectOfferHead(content: ProjectOffer) {
  const photo = projectPhotos[content.image];
  return {
    meta: [
      { title: content.metaTitle },
      { name: "description", content: content.description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: canonicalUrl(publicImageUrl(photo.src)) },
      { property: "og:image:alt", content: photo.alt },
      { name: "twitter:image", content: canonicalUrl(publicImageUrl(photo.src)) },
      { name: "twitter:image:alt", content: photo.alt },
    ],
  };
}

export type ProjectOffer = {
  path: "/terrasse-bauen-lassen" | "/einfahrt-pflastern-lassen" | "/l-steine-setzen-lassen";
  label: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  image: keyof typeof projectPhotos;
  heroCaption?: string;
  initialService?: (typeof EXPRESS_SERVICES)[number];
  kicker?: string;
  cases: { title: string; text: string }[];
  detail: {
    image: keyof typeof projectPhotos;
    caption?: string;
    title: string;
    text: string;
    points: string[];
  };
  choices: { title: string; text: string }[];
  choiceHeading: string;
  costIntro: string;
  costs: string[];
  steps: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  request: string;
  photos: string[];
  links: { href: string; label: string }[];
  sources?: { href: string; label: string }[];
};

export const terraceOffer: ProjectOffer = {
  path: "/terrasse-bauen-lassen",
  label: "Terrassenbau",
  title: "Ihre Terrasse bauen lassen.",
  metaTitle: "Terrasse bauen lassen – Pflaster & Naturstein | Loni GalaBau",
  description:
    "Terrasse bauen lassen: Pflaster oder Naturstein, Unterbau, Höhen und Entwässerung gemeinsam planen. Loni GalaBau aus Hattersheim, deutschlandweit im Einsatz.",
  intro:
    "Ein Platz für den ersten Kaffee, lange Sommerabende und das Leben draußen. Wir bauen Ihre Terrasse aus Pflaster oder Naturstein und stimmen Belag, Aufbau und Übergänge auf Ihr Haus und Ihren Garten ab.",
  image: "26",
  cases: [
    {
      title: "Eine neue Terrasse",
      text: "Sitzbereich, Wege und Garten zusammen denken. Wir klären Größe, Nutzung, Material und die Höhen am Haus, bevor der Aufbau festgelegt wird.",
    },
    {
      title: "Die Terrasse erneuern",
      text: "Alten Belag aufnehmen oder geeignete Teile erhalten: Zustand, Aufbau und Anschlüsse entscheiden, welche Vorarbeiten sinnvoll sind.",
    },
    {
      title: "Übergänge verbessern",
      text: "Stufen, Beete und Rasen sollen gut erreichbar bleiben. Vorhandene Höhen und Türanschlüsse geben den Rahmen für die Gestaltung vor.",
    },
  ],
  detail: {
    image: "25",
    title: "Ein guter Anschluss gehört dazu.",
    text: "Die schönste Platte allein macht noch keine gute Terrasse. Wir betrachten den Weg vom Haus in den Garten: Tür, Belag, Rand und Wasserführung müssen zusammenpassen.",
    points: [
      "Bestehende Tür- und Sockelhöhen aufnehmen.",
      "Gefälle und geeigneten weiteren Wasserweg klären.",
      "Stufen, Ränder und Übergänge zu Rasen und Beeten abstimmen.",
      "Zugänge während der Bauphase gemeinsam organisieren.",
    ],
  },
  choiceHeading: "Welcher Belag passt zu Ihrem Alltag?",
  choices: [
    {
      title: "Pflaster",
      text: "Format, Farbe und Verlegemuster prägen die Fläche. Kleine Formate können sich gut an verwinkelte Bereiche anpassen; Fugen und Pflege gehören in die Auswahl.",
    },
    {
      title: "Naturstein",
      text: "Jeder Stein hat eigene Eigenschaften. Wir besprechen Oberfläche, Format und Nutzung sowie passende Reinigung und Pflege für das ausgewählte Material.",
    },
    {
      title: "Vorhandenes erhalten",
      text: "Gut erhaltene Steine lassen sich gegebenenfalls einbeziehen. Zustand, Menge, Aufbau und notwendige Ergänzungen prüfen wir vor einer Zusage.",
    },
  ],
  costIntro:
    "Was kostet es, eine Terrasse bauen zu lassen? Entscheidend ist der gesamte Aufbau. Eine neue Fläche auf vorbereitetem Boden braucht andere Arbeiten als die Erneuerung einer alten Terrasse mit angepassten Höhen.",
  costs: [
    "Bestandsaufnahme, Aufmaß und abgestimmte Planung",
    "Rückbau und vereinbarte Wiederverwendung oder Abfuhr",
    "Erdarbeiten, Unterbau und Bettung passend zum Belag",
    "Material, Verlegung, Zuschnitte und Fugen",
    "Einfassungen, Stufen, Tür- und Randanschlüsse",
    "Wasserführung und gegebenenfalls Entwässerung",
    "Baustellenzugang, Transport und Wiederherstellung",
  ],
  steps: [
    {
      title: "Wünsche & Bestand",
      text: "Sie zeigen uns Fläche, Hausanschluss und Gartenzugang. Wir besprechen Nutzung, Größe, Materialwünsche und den gewünschten Zeitraum.",
    },
    {
      title: "Aufbau & Angebot",
      text: "Nach Klärung der Höhen und Vorarbeiten halten wir den vereinbarten Umfang fest. Offene Material- und Anschlussfragen werden vor der Ausführung abgestimmt.",
    },
    {
      title: "Bau & Übergabe",
      text: "Wir koordinieren die vereinbarten Arbeiten und besprechen bei der Übergabe Nutzung und Pflege des gewählten Belags.",
    },
  ],
  faq: [
    {
      question: "Kann ich eine bestehende Terrasse erneuern lassen?",
      answer:
        "Ja. Wir prüfen gemeinsam, welche Teile erhalten bleiben können. Belag, Untergrund, Anschlusshöhen und Wasserführung entscheiden über die nötigen Arbeiten. Fotos von Fläche und Haustür helfen für das erste Gespräch.",
    },
    {
      question: "Bauen Sie Terrassen aus Pflaster und Naturstein?",
      answer:
        "Diese Seite beschreibt unsere Pflaster- und Natursteinarbeiten. Wir stimmen das konkrete Material, seine Eigenschaften und den passenden Aufbau mit Ihnen ab. Weitere Ausführungen können Sie individuell anfragen.",
    },
    {
      question: "Was kostet eine Terrasse pro Quadratmeter?",
      answer:
        "Ein verlässlicher Gesamtpreis setzt den vereinbarten Umfang voraus. Rückbau, Unterbau, Material, Zuschnitte, Ränder und Entwässerung beeinflussen ihn. Wir kalkulieren Ihr Vorhaben anhand der Ausgangslage statt einen pauschalen Quadratmeterpreis zu versprechen.",
    },
    {
      question: "Ist eine neue Terrasse ohne Stufe an der Tür möglich?",
      answer:
        "Das hängt von Bestand, Türsystem, Abdichtung und Wasserführung ab. Geringe Anschlusshöhen müssen für das konkrete Gebäude abgestimmt werden. Wir klären die Schnittstellen und gegebenenfalls erforderlichen Facharbeiten, bevor ein Aufbau zugesagt wird.",
    },
    {
      question: "Wie lange dauert der Terrassenbau?",
      answer:
        "Fläche, Vorarbeiten, Materiallieferung, Zugänglichkeit und Witterung bestimmen den Ablauf. Nach der Bestandsaufnahme stimmen wir einen passenden Bauzeitraum sowie die Nutzung von Zugängen und Garten ab.",
    },
    {
      question: "In welchem Gebiet kann ich meine Terrasse bauen lassen?",
      answer:
        "Loni GalaBau hat seinen Sitz in Hattersheim am Main und arbeitet deutschlandweit. Nennen Sie uns Ihren Ort oder Ihre Postleitzahl, die ungefähre Fläche und Ihre Wünsche. Wir besprechen die Ausführung für Ihr Projekt.",
    },
  ],
  request:
    "Ort/PLZ, ungefähre Fläche, Neubau oder Erneuerung, Materialwunsch und gewünschter Zeitraum für Ihre Terrasse …",
  photos: [
    "Die gesamte geplante Terrassenfläche",
    "Tür, Sockel und vorhandene Stufen",
    "Gartenzugang und Transportweg",
  ],
  links: [
    { href: "/leistungen/natursteinarbeiten", label: "Natursteinarbeiten" },
    { href: "/leistungen/pflasterarbeiten", label: "Pflasterarbeiten im Überblick" },
    {
      href: "/ratgeber/naturstein-terrasse-materialwahl",
      label: "Naturstein für die Terrasse auswählen",
    },
    { href: "/ratgeber/terrasse-entwaesserung-planen", label: "Terrassenentwässerung verstehen" },
    { href: "/einfahrt-pflastern-lassen", label: "Auch die Einfahrt erneuern" },
  ],
};

export const drivewayOffer: ProjectOffer = {
  path: "/einfahrt-pflastern-lassen",
  label: "Einfahrten & Höfe",
  title: "Ihre Einfahrt pflastern lassen.",
  metaTitle: "Einfahrt pflastern lassen | Loni GalaBau",
  description:
    "Einfahrt neu pflastern oder erneuern: Unterbau, Belastung, Einfassung und Entwässerung passend planen. Loni GalaBau aus Hattersheim – deutschlandweit anfragen.",
  intro:
    "Der Weg nach Hause beginnt vor der Tür. Wir pflastern Ihre Einfahrt und stimmen Nutzung, Unterbau, Randanschlüsse und Wasserführung auf Ihr Grundstück ab – bei einer Neuanlage ebenso wie bei einer Erneuerung.",
  image: "85",
  cases: [
    {
      title: "Neu anlegen",
      text: "Stellplätze, Garage und Hauseingang verbinden. Wir berücksichtigen die vorgesehenen Fahrzeuge und den vorhandenen Zugang zum Grundstück.",
    },
    {
      title: "Vorhandenes erneuern",
      text: "Bei abgesackten Steinen, unpassenden Höhen oder stehendem Wasser betrachten wir zuerst die Ursache und den bestehenden Aufbau.",
    },
    {
      title: "Hof & Wege verbinden",
      text: "Befahrene und begangene Bereiche brauchen eine gemeinsame Gestaltung, aber nicht automatisch denselben Aufbau. Nutzung und Anschlüsse werden einzeln geklärt.",
    },
  ],
  detail: {
    image: "87",
    title: "Vom Garagentor bis zum Straßenrand.",
    text: "Damit Ihre Einfahrt im Alltag funktioniert, schauen wir auf die gesamte Fläche. Der Aufbau unter den Steinen, stabile Ränder und der weitere Weg des Regenwassers gehören zusammen.",
    points: [
      "Fahrzeugnutzung und Belastung festlegen.",
      "Höhen an Garage, Hauseingang und Grundstücksgrenze aufnehmen.",
      "Untergrund, Bettung und Einfassungen passend abstimmen.",
      "Regenwasser aufnehmen und den geeigneten weiteren Wasserweg klären.",
    ],
  },
  choiceHeading: "Die richtigen Entscheidungen vor dem Pflastern.",
  choices: [
    {
      title: "Nutzung & Belastung",
      text: "PKW-Stellplatz, Zufahrt oder gelegentliche Anlieferung? Geben Sie die vorgesehenen Fahrzeuge an. Daraus ergeben sich Anforderungen an Belag und Aufbau.",
    },
    {
      title: "Belag & Gestaltung",
      text: "Beton- oder Natursteinpflaster, Format und Fuge werden mit Nutzung und Pflege abgestimmt. Der sichtbare Stein ist ein Teil der gesamten Konstruktion.",
    },
    {
      title: "Wasser & Anschlüsse",
      text: "Eine wasserdurchlässige Oberfläche allein belegt keine geeignete Versickerung. Boden, Aufbau, Wasserweg und örtliche Voraussetzungen müssen zusammenpassen.",
    },
  ],
  costIntro:
    "Was kostet es, eine Einfahrt pflastern zu lassen? Material und Quadratmeterzahl reichen für den Vergleich nicht aus. Eine unbebaute Fläche und eine alte Einfahrt mit Rückbau können bei gleicher Größe einen sehr unterschiedlichen Arbeitsumfang haben.",
  costs: [
    "Aufmaß, Nutzung und abgestimmte Ausführung",
    "Aufnahme des Altbelags und vereinbarter Materialumgang",
    "Aushub, Untergrundvorbereitung und Unterbau",
    "Einfassungen und Anschlüsse an erhaltene Flächen",
    "Pflastermaterial, Verlegung, Zuschnitte und Fugen",
    "Gefälle, Rinnen und geeignete weitere Wasserführung",
    "Transport, Zugänglichkeit und vereinbarte Wiederherstellung",
  ],
  steps: [
    {
      title: "Fläche kennenlernen",
      text: "Sie nennen Ort, ungefähre Größe, Zustand und Fahrzeugnutzung. Fotos zeigen uns den Zugang sowie Garage und Randbereiche.",
    },
    {
      title: "Umfang festlegen",
      text: "Wir klären notwendige Vorarbeiten, gewünschtes Pflaster und Anschlüsse. Das Angebot hält fest, welche Positionen zu Ihrer Einfahrt gehören.",
    },
    {
      title: "Ausführen & übergeben",
      text: "Wir stimmen Zufahrt und Bauablauf ab. Wann die Fläche wieder befahren werden kann und wie sie gepflegt wird, besprechen wir für den gewählten Aufbau.",
    },
  ],
  faq: [
    {
      question: "Können Sie eine alte Einfahrt neu pflastern?",
      answer:
        "Ja. Vor einer Erneuerung betrachten wir den Zustand von Steinen, Unterbau, Rändern und Entwässerung. So lässt sich eingrenzen, was erhalten bleiben kann und welche Vorarbeiten notwendig sind.",
    },
    {
      question: "Welche Angaben brauchen Sie für ein Angebot?",
      answer:
        "Hilfreich sind Projektort, ungefähre Fläche, gewünschter Belag und die vorgesehenen Fahrzeuge. Fotos von Gesamtfläche, Garagen- oder Hausanschluss und Zufahrt ergänzen die Beschreibung. Ein erforderliches Aufmaß stimmen wir anschließend ab.",
    },
    {
      question: "Wie viel kostet eine Einfahrt pro Quadratmeter?",
      answer:
        "Der Preis hängt unter anderem von Rückbau, Aushub, Unterbau, Pflaster, Einfassungen und Wasserführung ab. Wir vergleichen den gesamten vereinbarten Umfang. Ein Materialpreis allein ist kein Preis für die fertige Einfahrt.",
    },
    {
      question: "Lässt sich vorhandenes Pflaster wiederverwenden?",
      answer:
        "Das hängt von Zustand, Menge, Format und geplanter Nutzung ab. Wir klären auch Sortierung, Reinigung, Ergänzungen und Zwischenlagerung. Eine Wiederverwendung ist nicht automatisch günstiger als neues Material.",
    },
    {
      question: "Wohin fließt das Regenwasser?",
      answer:
        "Gefälle, Rinnen, Anschlüsse und mögliche Versickerung werden für das Grundstück gemeinsam betrachtet. Eine Rinne nimmt Wasser auf, ersetzt aber keinen geeigneten weiteren Wasserweg. Bestehende Pläne und Informationen zu früheren Wasserproblemen helfen bei der Planung.",
    },
    {
      question: "Pflastern Sie auch Einfahrten außerhalb von Hattersheim?",
      answer:
        "Ja. Unser Firmensitz ist in Hattersheim am Main, wir sind deutschlandweit tätig. Senden Sie uns den Projektort, die Flächengröße und eine kurze Beschreibung. Ausführung und Baustellenlogistik stimmen wir individuell ab.",
    },
  ],
  request:
    "Ort/PLZ, ungefähre Fläche, heutiger Zustand, vorgesehene Fahrzeuge, Zugang und Wunschzeitraum für Ihre Einfahrt …",
  photos: [
    "Die gesamte Einfahrt oder Hoffläche",
    "Garagentor, Hauseingang und Randanschlüsse",
    "Zufahrt, Rinnen und bekannte Wasserprobleme",
  ],
  links: [
    { href: "/leistungen/pflasterarbeiten", label: "Pflasterarbeiten im Überblick" },
    { href: "/leistungen/erdarbeiten", label: "Erdarbeiten und Vorbereitung" },
    { href: "/leistungen/entwaesserung", label: "Entwässerung der Außenanlage" },
    { href: "/ratgeber/pflasterarbeiten-kosten-einfahrt", label: "Pflasterangebote vergleichen" },
    { href: "/terrasse-bauen-lassen", label: "Auch eine Terrasse planen" },
  ],
};
