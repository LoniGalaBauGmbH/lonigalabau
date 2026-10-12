export type ServicePreparationContent = {
  heading: string;
  lead: string;
  costFactors: string[];
  requestChecklist: string[];
  guideSlugs: string[];
};

export const servicePreparation: Record<string, ServicePreparationContent> = {
  gartengestaltung: {
    heading: "Was kostet es, einen Garten gestalten zu lassen?",
    lead: "Ein bestehender Gartenumbau und eine Neuanlage benötigen unterschiedliche Vorarbeiten. Für ein passendes Angebot grenzen wir zuerst ab, was bleiben soll und welche Flächen, Pflanzen und Anschlüsse sich verändern. Eine Flächengröße allein beschreibt diesen Umfang noch nicht.",
    costFactors: [
      "Rückbau vorhandener Beläge, benötigte Erdarbeiten und Umgang mit anfallendem Material.",
      "Aufteilung in Terrasse, Wege, Beete und Rasen sowie die jeweils gewählten Materialien.",
      "Erhalt vorhandener Pflanzen, neue Bepflanzung und vorbereitete Wasser- oder Leitungswege.",
      "Baustellenzugang, Materiallager und die gewünschte Ausführung in einem Zug oder in Etappen.",
    ],
    requestChecklist: [
      "Gesamtfotos, eine einfache Skizze und ungefähre Maße der zu verändernden Bereiche.",
      "Ihre wichtigsten Nutzungswünsche und Pflanzen oder Bauteile, die bleiben sollen.",
      "Zugangsbreite, vorhandene Stufen sowie bekannte Leitungen und Abläufe.",
      "Projektort, gewünschter Zeitraum und gegebenenfalls Prioritäten für den ersten Bauabschnitt.",
    ],
    guideSlugs: ["garten-umgestalten-in-etappen", "rollrasen-oder-einsaat"],
  },
  pflasterarbeiten: {
    heading: "Pflasterarbeiten: Welche Kosten gehören zum Angebot?",
    lead: "Wenn Sie eine Einfahrt pflastern lassen, entscheidet neben dem sichtbaren Stein auch der Aufbau darunter über den Arbeitsumfang. Ein belastbarer Vergleich berücksichtigt dieselbe Nutzung und dieselben Vorarbeiten. Deshalb klären wir Fahrflächen, Wege und Anschlüsse vor der Kalkulation.",
    costFactors: [
      "Aufnehmen alter Beläge, Aushub sowie vereinbarter Abtransport und Materialannahme.",
      "Vorhandener Untergrund und der für Gehwege oder befahrene Flächen benötigte Unterbau.",
      "Steinformat, Verlegemuster, Zuschnitte, Einfassungen und Anschlüsse an erhaltene Flächen.",
      "Gefälle, Entwässerung und der Aufwand für Zufahrt und Materialtransport.",
    ],
    requestChecklist: [
      "Fläche und gewünschte Nutzung nennen, einschließlich der vorgesehenen Fahrzeuge.",
      "Fotos von bestehendem Belag, Rändern, Hauseingang und Garage ergänzen.",
      "Bekannte Abläufe und Wasseransammlungen sowie gewünschte neue Anschlüsse zeigen.",
      "Zugang, vorhandene Ersatzsteine oder Wünsche zur Wiederverwendung und Projektort angeben.",
    ],
    guideSlugs: ["pflasterarbeiten-kosten-einfahrt", "terrasse-entwaesserung-planen"],
  },
  natursteinarbeiten: {
    heading: "Was beeinflusst die Kosten einer Natursteinterrasse?",
    lead: "Steinart und Fläche sind nur ein Teil des Angebots. Oberfläche, Format, Aufbau und Übergänge müssen zur Nutzung passen. Für Natursteinwege, Stufen oder Mauern klären wir den Umfang gesondert; der Preis einer Terrasse lässt sich darauf nicht einfach übertragen.",
    costFactors: [
      "Gewählter Naturstein, Oberflächenbearbeitung, Format und benötigte Zuschnitte.",
      "Rückbau, Untergrund und der zur Einbausituation passende Aufbau einschließlich Fugen.",
      "Anschlüsse an Türen, Stufen, Einfassungen und die vorgesehene Wasserführung.",
      "Zugänglichkeit, Transportwege sowie erforderliche zusätzliche Planung bei besonderen Bauteilen.",
    ],
    requestChecklist: [
      "Terrasse, Weg, Stufen oder Mauer mit ungefähren Maßen und gewünschter Nutzung beschreiben.",
      "Fotos der gesamten Fläche und der Anschlüsse an Haus oder erhaltene Bauteile beifügen.",
      "Materialwünsche oder vorhandene Steine nennen; Farbe allein bestimmt noch keinen geeigneten Stein.",
      "Zugang, bekannte Höhenunterschiede, Projektort und gewünschten Zeitraum angeben.",
    ],
    guideSlugs: ["naturstein-terrasse-materialwahl", "terrasse-entwaesserung-planen"],
  },
  bewaesserungsanlagen: {
    heading: "Gartenbewässerung installieren lassen: Wovon hängt der Aufwand ab?",
    lead: "Eine Bewässerungsanlage wird nach den zu versorgenden Flächen und dem verfügbaren Wasser geplant. Beete, Pflanzreihen und Rasen können unterschiedliche Lösungen benötigen. Im Bestand beeinflussen außerdem Leitungswege und die Wiederherstellung geöffneter Flächen das Angebot.",
    costFactors: [
      "Größe, Aufteilung und Wasserbedarf der Rasen- und Pflanzflächen.",
      "Verfügbarer Wasseranschluss, benötigte Versorgungszonen und die passende Steuerung.",
      "Länge und Zugänglichkeit der Leitungswege sowie Querungen vorhandener Wege oder Terrassen.",
      "Erforderliche Eingriffe in Beläge und Bepflanzung und die vereinbarte Wiederherstellung.",
    ],
    requestChecklist: [
      "Skizze mit Rasen, Beeten und Hecken sowie ungefähren Flächengrößen ergänzen.",
      "Lage und Art der vorhandenen Wasserquelle nennen; bekannte Anschlussdaten weitergeben.",
      "Fotos der Leitungswege und der Flächen zeigen, die möglichst erhalten bleiben sollen.",
      "Gewünschte Bedienung, eigene Pflegegewohnheiten, Projektort und Zeitraum beschreiben.",
    ],
    guideSlugs: ["gartenbewaesserung-planen", "rollrasen-oder-einsaat"],
  },
  zaunarbeiten: {
    heading: "Zaun bauen lassen: Was bestimmt die Kosten?",
    lead: "Zaunlänge und Höhe reichen für ein vollständiges Angebot nicht aus. Material, Tore und Befestigung müssen zum Verlauf und zur gewünschten Nutzung passen. Beschreiben Sie deshalb auch, wo Sichtschutz nötig ist und welche Durchgänge oder vorhandenen Bauteile berücksichtigt werden sollen.",
    costFactors: [
      "Zaunsystem, Material, Höhe und gewünschte offene oder geschlossene Abschnitte.",
      "Anzahl und Ausführung der Tore sowie Anschlüsse an Mauern oder erhaltene Zäune.",
      "Pfosten, Fundamente, Geländeunterschiede und bekannte Leitungen im Arbeitsbereich.",
      "Rückbau des bisherigen Zauns, Materialtransport und Wiederherstellung angrenzender Flächen.",
    ],
    requestChecklist: [
      "Verlauf und ungefähre Länge skizzieren, gewünschte Höhe und Sichtschutzbereiche nennen.",
      "Torpositionen, benötigte Durchgangsbreiten und Öffnungsrichtungen angeben.",
      "Bestehende Pfosten, Mauern und Höhenunterschiede fotografieren.",
      "Projektort, bekannten Grenzverlauf, Leitungsinformationen und bereits geklärte Vorgaben mitteilen.",
    ],
    guideSlugs: ["garten-umgestalten-in-etappen"],
  },
  rasenanlagen: {
    heading: "Rollrasen verlegen lassen: Welche Kostenfaktoren zählen?",
    lead: "Für eine neue Rasenfläche unterscheiden wir Material und Herstellung von der notwendigen Bodenvorbereitung. Eine Fläche mit altem Rasen oder unebenem Boden benötigt andere Arbeiten als eine bereits vorbereitete Fläche. Ob Rollrasen oder Einsaat besser passt, hängt auch von Zeitplan, Nutzung und Betreuung ab.",
    costFactors: [
      "Größe und Zuschnitt der Fläche sowie Rollrasen oder die gewählte Rasensaat.",
      "Entfernen vorhandenen Bewuchses, notwendige Bodenarbeiten und vereinbarter Materialabtransport.",
      "Vorhandene Höhen, Bodenaufbau und Anschlüsse an Wege, Beete oder Einfassungen.",
      "Zugang für Material und Maschinen sowie eine gegebenenfalls gemeinsam geplante Bewässerung.",
    ],
    requestChecklist: [
      "Ungefähre Fläche und Fotos des derzeitigen Bodens oder Rasens senden.",
      "Nutzung, Sonnen- und Schattenbereiche und gewünschte Fertigstellung beschreiben.",
      "Wasseranschluss und Ihre Möglichkeiten zum Bewässern nach der Herstellung nennen.",
      "Zufahrt, Stufen, zu erhaltende Pflanzen und den Projektort angeben.",
    ],
    guideSlugs: ["rollrasen-oder-einsaat", "gartenbewaesserung-planen"],
  },
  erdarbeiten: {
    heading: "Erdarbeiten im Garten: Wie wird der Aufwand eingegrenzt?",
    lead: "Für Baggerarbeiten zählen nicht nur Fläche und gewünschte Tiefe. Zugang, Boden, vorhandene Leitungen und der Umgang mit dem Aushub bestimmen den Ablauf mit. Beschreiben Sie das gewünschte Ergebnis: etwa die Vorbereitung einer Terrasse, eines Weges oder einer Rasenfläche.",
    costFactors: [
      "Abzutragende oder aufzutragende Mengen und der gewünschte Höhenverlauf.",
      "Bekannter Bodenbestand, nötige Untersuchungen und vereinbarte Wiederverwendung oder Abfuhr.",
      "Zufahrtsbreite, Höhe, Tragfähigkeit und Bewegungsraum für Maschinen und Transport.",
      "Leitungsinformationen, zu schützende Bereiche und der Anschluss an nachfolgende Arbeiten.",
    ],
    requestChecklist: [
      "Gewünschtes Ergebnis mit groben Flächen, Höhen und einer Skizze erläutern.",
      "Zufahrt, Durchgänge, Stufen und mögliche Lagerflächen fotografieren und messen.",
      "Vorhandene Leitungspläne und bekannte Informationen zum Boden mitteilen.",
      "Angeben, ob Material bleiben oder abgefahren werden soll, sowie Projektort und Folgearbeiten nennen.",
    ],
    guideSlugs: ["garten-umgestalten-in-etappen", "pflasterarbeiten-kosten-einfahrt"],
  },
  entwaesserung: {
    heading: "Terrassenentwässerung oder Garten entwässern: Was bestimmt den Umfang?",
    lead: "Stehendes Wasser, eine überlaufende Rinne und nasser Boden können unterschiedliche Ursachen haben. Das Angebot richtet sich nach dem Befund und dem geeigneten weiteren Wasserweg. Ein bestimmtes Bauteil oder eine pauschale Leitungslänge beschreibt die Lösung deshalb noch nicht.",
    costFactors: [
      "Herkunft des Wassers, betroffene Flächen und vorhandene Höhen oder Anschlüsse.",
      "Eignung und Umfang der geplanten Aufnahme, Ableitung oder Versickerung.",
      "Benötigte Erdarbeiten und Öffnung sowie Wiederherstellung von Belägen oder Grünflächen.",
      "Zugängliche Kontrollstellen und gegebenenfalls erforderliche Untersuchungen oder Abstimmungen.",
    ],
    requestChecklist: [
      "Beobachtung nach Regen beschreiben: Ort, Dauer und Veränderungen gegenüber früher.",
      "Gesamtfotos sowie Details von Pfützen, Rinnen und Gebäudeanschlüssen ergänzen.",
      "Vorhandene Leitungs- oder Entwässerungsunterlagen und bekannte Wasserwege weitergeben.",
      "Zu erhaltende Beläge, Baustellenzugang, Projektort und geplante weitere Umbauten nennen.",
    ],
    guideSlugs: ["terrasse-entwaesserung-planen", "pflasterarbeiten-kosten-einfahrt"],
  },
};
