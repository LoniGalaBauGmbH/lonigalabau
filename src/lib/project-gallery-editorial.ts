/**
 * Context for reviewed thematic galleries, based on content/project-gallery.json
 * and docs/bildkatalog.md. These selections are not individual case studies.
 */
type GalleryEditorial = {
  description: string;
  heading: string;
  paragraph: string;
  planningQuestions: string[];
  requiredPhotos: string[];
  services: { slug: string; title: string }[];
  guide: { slug: string; title: string };
};

const galleries: Record<string, GalleryEditorial> = {
  "c6a3dbe3-8883-4785-b7b5-422cd4e9cef6": {
    description:
      "Gartenbau in Bildern: Rasenflächen, Terrassen, Pflanzbeete und Gartenebenen aus unseren Arbeiten. Entdecken Sie Übergänge und Ideen für Ihre Planung.",
    heading: "Rasen, Terrasse und Beete gemeinsam betrachten",
    paragraph:
      "Gärten mit Rasen, Hecken und Pflanzkübeln, eine Plattenterrasse und ein Stufenübergang zur Rasenfläche zeigen unterschiedliche Verbindungen zwischen Grün und Aufenthaltsbereichen. Im Hanggarten kommen WPC, Naturstein und Pflanzbeete zusammen. Für Ihr Vorhaben besprechen wir die Nutzung der einzelnen Bereiche, vorhandene Höhen und die Wege dazwischen. Die Bildauswahl gibt Anregungen; die konkrete Gestaltung entsteht aus Ihrem Grundstück und Ihren Wünschen.",
    planningQuestions: [
      "Welche Bereiche möchten Sie zum Sitzen, Spielen oder Gärtnern nutzen?",
      "Welche Wege und Höhenübergänge sind zu verbinden?",
      "Welche vorhandenen Pflanzen und Gartenbereiche sollen erhalten bleiben?",
    ],
    requiredPhotos: [
      "garten-mit-rasen-und-bepflanzung.webp",
      "rasengarten-mit-plattenterrasse.webp",
      "terrasse-mit-rasenanschluss.webp",
      "hanggarten-mit-holzterrasse.webp",
    ],
    services: [
      { slug: "gartengestaltung", title: "Gartengestaltung" },
      { slug: "pflasterarbeiten", title: "Pflaster- und Plattenarbeiten" },
    ],
    guide: { slug: "garten-umgestalten-in-etappen", title: "Den Garten in Etappen umgestalten" },
  },
  "97a28801-fad8-4b91-8ce1-cb3ade36ea5a": {
    description:
      "Natursteinarbeiten aus unseren Außenanlagen: Mauern, Stufen und eingefasste Beete. Eigene Fotos zeigen Materialien, Höhenübergänge und Ausführungsdetails.",
    heading: "Naturstein an Mauern, Stufen und Pflanzflächen",
    paragraph:
      "Natursteinmauern neben Treppen und Plattenbelägen, gestaffelte bepflanzte Mauern und ein erhöhtes Pflanzbeet zeigen unterschiedliche Einsatzbereiche. Die Stufendetails machen sichtbar, wie Stein und angrenzende Flächen aufeinandertreffen. Für Ihr Vorhaben klären wir Nutzung, Höhen und Materialwünsche gemeinsam. Farbe und Oberfläche sind ein Teil der Auswahl; der geeignete Aufbau hängt von den Bedingungen des Grundstücks ab und ist aus den fertigen Fotos allein nicht ablesbar.",
    planningQuestions: [
      "Soll Naturstein einen Belag, Stufen, ein Beet oder eine Mauer bilden?",
      "Welche Höhen und angrenzenden Beläge sind vorhanden?",
      "Welche Oberfläche und welcher Pflegeaufwand passen zu Ihnen?",
    ],
    requiredPhotos: [
      "natursteinmauer-mit-plattenbelag.webp",
      "natursteinstufen-im-detail.webp",
      "natursteinmauer-mit-aussentreppe.webp",
      "hangbeet-mit-naturstein.webp",
      "bepflanzte-natursteinmauern.webp",
      "natursteinbeet-an-rasenflaeche.webp",
    ],
    services: [
      { slug: "natursteinarbeiten", title: "Natursteinarbeiten" },
      { slug: "gartengestaltung", title: "Gartengestaltung" },
    ],
    guide: {
      slug: "naturstein-terrasse-materialwahl",
      title: "Naturstein für die Terrasse auswählen",
    },
  },
  "186ed51f-a3a3-4961-b5e4-9b88a08470a2": {
    description:
      "Eigene Fotos von Pflasterwegen, Terrassenplatten und Hauseingängen: Entdecken Sie Beläge, Stufen und Anschlüsse aus unseren Pflasterarbeiten.",
    heading: "Beläge und Anschlüsse für Wege und Terrassen",
    paragraph:
      "Der schmale Pflasterweg neben blühenden Beeten, großformatige Terrassenplatten und ein gepflasterter Hauseingang zeigen verschiedene Flächennutzungen. Blockstufen und ein Gartenweg mit Treppenübergang ergänzen die Auswahl. Für eine neue Fläche besprechen wir Nutzung, Belastung, Einfassungen und Wasserführung. Rückbau und Unterbau gehören ebenfalls in den Angebotsvergleich: Die sichtbare Oberfläche eines fertigen Projekts erklärt diese Vorarbeiten und deren Aufwand nicht vollständig.",
    planningQuestions: [
      "Wird die Fläche begangen oder auch mit Fahrzeugen befahren?",
      "Welche Türschwellen, Stufen und vorhandenen Flächen sind anzuschließen?",
      "Was ist über den bisherigen Belag und Aufbau bekannt?",
    ],
    requiredPhotos: [
      "gartenweg-mit-bluehenden-beeten.webp",
      "gepflasterter-hauseingang.webp",
      "grossformatige-terrassenplatten.webp",
      "blockstufen-am-hauseingang.webp",
      "gartenweg-mit-treppe.webp",
    ],
    services: [
      { slug: "pflasterarbeiten", title: "Pflasterarbeiten" },
      { slug: "entwaesserung", title: "Entwässerung befestigter Flächen" },
    ],
    guide: {
      slug: "pflasterarbeiten-kosten-einfahrt",
      title: "Pflasterangebote und Kostenfaktoren vergleichen",
    },
  },
  "5cfc040c-1c20-4d4c-8f8c-2b791e4bf406": {
    description:
      "Zäune, Sichtschutz und Gartentore aus unseren Arbeiten: Holz in Metallrahmen, anthrazitfarbene Elemente und Doppelstabmatten im Bild.",
    heading: "Sichtschutz, Grundstücksgrenze und Zugang",
    paragraph:
      "Holzflächen in Metallrahmen, anthrazitfarbener Sichtschutz, ein Doppelstabmattenzaun und ein Gartentor zeigen unterschiedliche Arten der Einfriedung. Eine Holzterrasse mit dunklem Sichtschutz ergänzt die Auswahl. Für Ihr Vorhaben steht zuerst die Funktion fest: Grenzen markieren, Einblicke reduzieren oder einen Zugang schaffen. Verlauf, Höhe und Torbreite stimmen wir mit den vorhandenen Wegen und Ihrer Nutzung ab; Grundstücksgrenzen und örtliche Vorgaben werden für den konkreten Standort geklärt.",
    planningQuestions: [
      "Wo benötigen Sie Sichtschutz und wo soll der Blick offen bleiben?",
      "Welche Zugänge brauchen Personen, Geräte oder Fahrzeuge?",
      "Welche Grenzen und Höhen sind bereits festgelegt?",
    ],
    requiredPhotos: [
      "sichtschutz-holz-und-metall.webp",
      "sichtschutz-anthrazit.webp",
      "doppelstabmattenzaun.webp",
      "gartentor-anthrazit.webp",
      "holzterrasse-mit-sichtschutz.webp",
    ],
    services: [
      { slug: "zaunarbeiten", title: "Zaunarbeiten und Sichtschutz" },
      { slug: "gartengestaltung", title: "Gartengestaltung" },
    ],
    guide: {
      slug: "garten-umgestalten-in-etappen",
      title: "Zugänge und Bauabschnitte bei einer Gartenumgestaltung",
    },
  },
  "79d2d6c8-a737-4c4d-a223-73215ae94074": {
    description:
      "Rasenflächen aus unseren Arbeiten: Gartenrasen mit Hecken und Beetkanten, eine erhöhte Gartenebene und Begrünung im Gleisbereich.",
    heading: "Rasenflächen und ihre angrenzenden Bereiche",
    paragraph:
      "Rasen mit Hecke und rundem Sitzplatz, eine geschwungene Beetkante und eine grüne Gartenebene oberhalb einer Stützwand zeigen verschiedene Übergänge. Eine weitere Aufnahme zeigt einen begrünten Gleisbereich. Für einen Gartenrasen betrachten wir Boden, Licht, Nutzung und mögliche Pflege. Erst daraus ergibt sich die Entscheidung zwischen Rollrasen und Einsaat. Die Fotos zeigen die Gestaltung; eine bestimmte Rasensorte oder Methode der Anlage lässt sich daraus nicht ableiten.",
    planningQuestions: [
      "Wie intensiv soll die Rasenfläche genutzt werden?",
      "Welche Lichtverhältnisse und welcher Boden liegen vor?",
      "Wie viel Zeit können Sie für Bewässerung und Pflege einplanen?",
    ],
    requiredPhotos: [
      "rasenflaeche-mit-hecke.webp",
      "rasen-mit-geschwungener-beetkante.webp",
      "rasen-auf-gartenebene.webp",
      "begruenung-im-gleisbereich.webp",
    ],
    services: [
      { slug: "rasenanlagen", title: "Rasenflächen anlegen" },
      { slug: "bewaesserungsanlagen", title: "Bewässerung mitplanen" },
    ],
    guide: { slug: "rollrasen-oder-einsaat", title: "Rollrasen oder Einsaat vergleichen" },
  },
  "696cfc1a-4f27-48c0-a593-ff5ceffa0f73": {
    description:
      "Tropfbewässerung im Pflanzbeet und bepflanzte Außenanlagen aus unseren Arbeiten. Eigene Aufnahmen und Fragen für die Planung der Wasserversorgung.",
    heading: "Bewässerung auf Pflanzflächen abstimmen",
    paragraph:
      "Die Detailaufnahme zeigt einen Tropfschlauch in einem Pflanzbeet. Ein frisch angelegtes Beet am geschwungenen Weg und Bepflanzung entlang eines Holzdecks verdeutlichen weitere Flächen, die bei der Bewässerungsplanung betrachtet werden. Vor der Auswahl von Leitungen und Steuerung erfassen wir Gartenbereiche und Wasseranschluss. Die Pflanzfotos allein belegen keine bestimmte installierte Anlage; die Technik wird auf die tatsächlichen Voraussetzungen und die zu versorgenden Bereiche abgestimmt.",
    planningQuestions: [
      "Welche Rasen- und Pflanzbereiche sollen bewässert werden?",
      "Welche Angaben zum Wasseranschluss sind verfügbar?",
      "Geht es um eine neue Anlage oder eine Ergänzung im Bestand?",
    ],
    requiredPhotos: [
      "tropfbewaesserung-im-pflanzbeet.webp",
      "pflanzbeet-am-geschwungenen-weg.webp",
      "bepflanzung-am-holzdeck.webp",
    ],
    services: [
      { slug: "bewaesserungsanlagen", title: "Bewässerungsanlagen" },
      { slug: "gartengestaltung", title: "Gartengestaltung" },
    ],
    guide: { slug: "gartenbewaesserung-planen", title: "Gartenbewässerung planen" },
  },
  "86e3d235-2950-493d-b2ac-e7f9d86e01fb": {
    description:
      "Einblicke in die Bauphase unserer Außenanlagen: Terrassenunterkonstruktion sowie Natursteintreppe und Mauern vor Fertigstellung.",
    heading: "Vorarbeiten für Terrasse, Stufen und Außenanlage",
    paragraph:
      "Die Terrassenunterkonstruktion vor der Deckverlegung und Natursteinstufen mit Mauern während der Bauphase geben Einblicke in unterschiedliche Arbeiten. Einige Bauteile sind nach der Fertigstellung verdeckt. Für den Bauablauf betrachten wir vorhandene Höhen, Zugang und die Reihenfolge der Gewerke. Bei Erdarbeiten klären wir zusätzlich Boden, Aushub und weitere Flächennutzung. Die passenden Leistungen ergeben sich aus der Bestandsaufnahme und den geplanten nächsten Schritten.",
    planningQuestions: [
      "Welche bestehenden Flächen und Höhen sollen verändert werden?",
      "Wie erreichen Material und Maschinen das Grundstück?",
      "Welche Leitungen und späteren Bauabschnitte sind abzustimmen?",
    ],
    requiredPhotos: ["terrassenunterkonstruktion.webp", "natursteintreppe-in-der-bauphase.webp"],
    services: [
      { slug: "erdarbeiten", title: "Erdarbeiten und Vorbereitung" },
      { slug: "natursteinarbeiten", title: "Natursteinarbeiten und Stufen" },
    ],
    guide: {
      slug: "garten-umgestalten-in-etappen",
      title: "Vorarbeiten und spätere Gartenetappen verbinden",
    },
  },
  "9cce7291-71ea-43c7-86a0-8543691b9323": {
    description:
      "Entwässerungsrinnen an Terrasse, Garage und Pflasterfläche: Eigene Projektfotos zeigen Übergänge und Anschlüsse befestigter Außenflächen.",
    heading: "Wasserführung an befestigten Flächen",
    paragraph:
      "Eine Rinne vor einer Garage, eine lange Entwässerungsrinne an einer Terrasse und der Anschluss einer Pflasterfläche zur Straße zeigen unterschiedliche Positionen der Wasseraufnahme. Bei Ihrem Vorhaben klären wir, wo Regenwasser anfällt, wie es zur Aufnahme geführt wird und wohin es anschließend gelangen darf. Eine sichtbare Rinne allein beschreibt noch kein vollständiges Konzept; Höhen, Anschlussmöglichkeiten und vorhandene Verhältnisse werden zusammen betrachtet.",
    planningQuestions: [
      "Wo bleibt Wasser stehen oder fließt zur falschen Seite?",
      "Welche Gebäudeanschlüsse und vorhandenen Abläufe gibt es?",
      "Welche Flächen und Höhen sollen geändert werden?",
    ],
    requiredPhotos: [
      "entwaesserungsrinne-vor-garage.webp",
      "terrasse-mit-entwaesserungsrinne.webp",
      "entwaesserungsrinne-am-pflasterweg.webp",
    ],
    services: [
      { slug: "entwaesserung", title: "Entwässerung" },
      { slug: "pflasterarbeiten", title: "Pflasterflächen und Anschlüsse" },
    ],
    guide: { slug: "terrasse-entwaesserung-planen", title: "Terrassenentwässerung planen" },
  },
  "9a819fcf-5b1c-4170-a114-9f7570aea902": {
    description:
      "Eigene Fotos von Poolgärten, Terrassen und Sitzplätzen: Holzdecks, Naturstein, Rasen und bepflanzte Übergänge aus unseren Außenanlagen.",
    heading: "Terrassen, Sitzplätze und angrenzendes Grün",
    paragraph:
      "Poolgärten mit Rasen und Plattenterrasse, eine Natursteinmauer neben einem abgedeckten Pool sowie Holzdeck und Bepflanzung zeigen unterschiedliche Außenbereiche. Ein Natursteinweg unter einer Pergola und eine Holzterrasse mit angrenzender Natursteintreppe ergänzen die Auswahl. Für Ihre Garten- und Terrassenplanung besprechen wir Wege, Höhen, Nutzung und Material. Die Galerie beschreibt sichtbare Gestaltungsdetails verschiedener Anlagen, keine vollständige Pooltechnik oder einen einheitlichen Bauauftrag.",
    planningQuestions: [
      "Wie möchten Sie Sitzplätze, Garten und vorhandene Wasserbereiche nutzen?",
      "Welche Wege und Höhen verbinden die Bereiche?",
      "Welche Anforderungen stellen Sie an Oberfläche, Pflege und Material?",
    ],
    requiredPhotos: [
      "poolgarten-mit-terrasse.webp",
      "pool-mit-natursteinmauer.webp",
      "pool-und-sonnenterrasse.webp",
      "natursteinweg-unter-pergola.webp",
      "holzterrasse-mit-natursteintreppe.webp",
    ],
    services: [
      { slug: "gartengestaltung", title: "Gärten und Außenanlagen gestalten" },
      { slug: "natursteinarbeiten", title: "Natursteinarbeiten" },
    ],
    guide: {
      slug: "naturstein-terrasse-materialwahl",
      title: "Material für eine Natursteinterrasse auswählen",
    },
  },
  "113f2d5e-f00c-4894-aa2a-dfd6c6f32274": {
    description:
      "Gestaltete Freiräume aus unseren Arbeiten: naturnahe Spielfläche, bepflanzte Wege und Holzdecks. Eigene Fotos zeigen Grün und Aufenthaltsbereiche.",
    heading: "Freiräume mit Wegen, Bepflanzung und Sitzbereichen",
    paragraph:
      "Ein naturnaher Spielbereich mit Sitzkreis und Bauwagen, Staudenbeete an einem Stadtweg und ein Plattenweg entlang einer Gräserpflanzung zeigen unterschiedliche Freiräume. Bepflanzung am Holzdeck und ein Deck mit Aussparung für einen Baum ergänzen die Auswahl. Bei neuen Außenanlagen besprechen wir Nutzer, Aufenthalt, Wege und Pflege gemeinsam. Vorhandene Bäume und angrenzende Bereiche gehören früh in die Planung; die Fotos geben dafür konkrete Gestaltungsanregungen.",
    planningQuestions: [
      "Wer nutzt den Freiraum und welche Bereiche werden benötigt?",
      "Welche Wege, Bäume und Pflanzflächen sind einzubeziehen?",
      "Wie lassen sich gewünschte Nutzung und spätere Pflege verbinden?",
    ],
    requiredPhotos: [
      "naturnahe-spielflaeche.webp",
      "stauden-und-wege-im-stadtraum.webp",
      "pflasterweg-mit-graesern.webp",
      "bepflanzung-am-holzdeck.webp",
      "holzdeck-mit-baumausschnitt.webp",
    ],
    services: [
      { slug: "gartengestaltung", title: "Gartengestaltung und Freiräume" },
      { slug: "pflasterarbeiten", title: "Wege und befestigte Flächen" },
    ],
    guide: { slug: "garten-umgestalten-in-etappen", title: "Außenanlagen in Etappen gestalten" },
  },
};

function reviewedPhotoName(src: string) {
  try {
    const pathname = new URL(src, "https://www.loni-galabau.de").pathname;
    const hostname = new URL(src, "https://www.loni-galabau.de").hostname;
    if (
      !["www.loni-galabau.de", "loni-galabau.de", "fvctfguvupdcscthrxeb.supabase.co"].includes(
        hostname,
      )
    )
      return undefined;
    if (
      !pathname.startsWith("/images/projekte/") &&
      !pathname.includes("/object/public/project-images/referenzen-2026/")
    )
      return undefined;
    return pathname.split("/").pop();
  } catch {
    return undefined;
  }
}

/** Hide commentary if an administrator replaces the reviewed photo set. */
export function projectGalleryEditorial(id: string, images: string[] | null | undefined) {
  const editorial = galleries[id];
  if (!editorial) return undefined;
  const photos = new Set((images ?? []).map(reviewedPhotoName).filter(Boolean));
  return editorial.requiredPhotos.every((name) => photos.has(name)) ? editorial : undefined;
}

// First publication of this reviewed context; never replace it with the crawl time.
export const GALLERY_CONTEXT_MODIFIED_AT = "2026-10-01T14:39:01Z";

export function projectGalleryLastModified(
  id: string,
  images: string[] | null | undefined,
  storedModified: string,
) {
  if (!projectGalleryEditorial(id, images)) return storedModified;
  return Date.parse(storedModified) > Date.parse(GALLERY_CONTEXT_MODIFIED_AT)
    ? storedModified
    : GALLERY_CONTEXT_MODIFIED_AT;
}
