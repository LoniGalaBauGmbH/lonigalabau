// Keep related services useful for the work described on each page.
export const serviceTopics: Record<string, { heading: string; related: string[] }> = {
  gartengestaltung: {
    heading: "Garten neu anlegen oder umgestalten",
    related: ["pflasterarbeiten", "rasenanlagen", "bewaesserungsanlagen"],
  },
  natursteinarbeiten: {
    heading: "Naturstein für Terrassen, Gartenwege und Mauern",
    related: ["pflasterarbeiten", "gartengestaltung", "erdarbeiten"],
  },
  pflasterarbeiten: {
    heading: "Einfahrt, Terrasse und Wege pflastern lassen",
    related: ["entwaesserung", "natursteinarbeiten", "erdarbeiten"],
  },
  bewaesserungsanlagen: {
    heading: "Gartenbewässerung passend zu Rasen und Beeten",
    related: ["rasenanlagen", "gartengestaltung", "erdarbeiten"],
  },
  zaunarbeiten: {
    heading: "Zaunbau und Sichtschutz für Ihr Grundstück",
    related: ["gartengestaltung", "erdarbeiten", "natursteinarbeiten"],
  },
  rasenanlagen: {
    heading: "Rasen anlegen: Rollrasen oder Rasensaat",
    related: ["bewaesserungsanlagen", "erdarbeiten", "gartengestaltung"],
  },
  erdarbeiten: {
    heading: "Baggerarbeiten und Bodenaufbau für den Garten",
    related: ["pflasterarbeiten", "entwaesserung", "gartengestaltung"],
  },
  entwaesserung: {
    heading: "Regenwasser von Einfahrt, Terrasse und Garten ableiten",
    related: ["pflasterarbeiten", "erdarbeiten", "gartengestaltung"],
  },
};
