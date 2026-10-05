import { projectPhotos } from "./project-photos";

export type RegionalProjectPhoto = {
  src: string;
  alt: string;
  label: string;
};

function galleryPhoto(photoId: keyof typeof projectPhotos, label: string): RegionalProjectPhoto {
  const { src, alt } = projectPhotos[photoId];
  return { src, alt, label };
}

// Documented original photos from docs/bildkatalog.md, grouped by visible work.
const galleryPhotos = {
  stoneWall: galleryPhoto("13", "Natursteinmauer & Außentreppe"),
  terraceDrain: galleryPhoto("14", "Terrasse & Entwässerung"),
  stoneStairsConstruction: galleryPhoto("18", "Naturstein in der Bauphase"),
  stoneStairs: galleryPhoto("19", "Natursteinstufen im Detail"),
  anthraciteScreen: galleryPhoto("21", "Sichtschutz in Anthrazit"),
  pavedEntrance: galleryPhoto("24", "Pflaster am Hauseingang"),
  terraceLawn: galleryPhoto("25", "Terrasse & Rasenanschluss"),
  terraceSlabs: galleryPhoto("26", "Großformatige Terrassenplatten"),
  treeDeck: galleryPhoto("28", "Holzdeck mit Baumausschnitt"),
  flowerPath: galleryPhoto("30", "Gartenweg & Blütenbeete"),
  elevatedLawn: galleryPhoto("35", "Rasen auf einer Gartenebene"),
  deckStoneStairs: galleryPhoto("36", "Holzterrasse & Natursteintreppe"),
  woodMetalScreen: galleryPhoto("40", "Sichtschutz aus Holz & Metall"),
  curvedLawn: galleryPhoto("45", "Rasen & geschwungene Beetkante"),
  lawnTerrace: galleryPhoto("47", "Rasengarten & Plattenterrasse"),
  lawnSeating: galleryPhoto("48", "Rasen & runder Sitzplatz"),
  stoneBeet: galleryPhoto("52", "Pflanzbeet aus Naturstein"),
  entranceStairs: galleryPhoto("56", "Breite Eingangstreppe"),
  deckPlanting: galleryPhoto("63", "Bepflanzung am Holzdeck"),
  meshFence: galleryPhoto("64", "Doppelstabmattenzaun"),
  dripIrrigation: galleryPhoto("66", "Tropfbewässerung im Beet"),
  curvedBeet: galleryPhoto("67", "Pflanzbeet am geschwungenen Weg"),
  screenedTerrace: galleryPhoto("69", "Holzterrasse & Sichtschutz"),
  grassesPath: galleryPhoto("71", "Plattenweg & Gräser"),
  slopeBeet: galleryPhoto("72", "Hangbeet mit Mauern & Stufen"),
  entranceBlockStairs: galleryPhoto("75", "Blockstufen am Hauseingang"),
  terraceSubstructure: galleryPhoto("76", "Terrassenunterkonstruktion"),
  stoneWallSlabs: galleryPhoto("77", "Natursteinmauer & Plattenbelag"),
  pergolaPath: galleryPhoto("79", "Natursteinweg & Pergola"),
  plantedGarden: galleryPhoto("81", "Rasen, Hecken & Pflanzkübel"),
  gardenGate: galleryPhoto("84", "Gartentor in Anthrazit"),
  garageDrain: galleryPhoto("85", "Entwässerung vor der Garage"),
  pathDrain: galleryPhoto("87", "Entwässerung am Pflaster"),
} as const;

type GalleryPhotoKey = keyof typeof galleryPhotos;

// Each selection adds eight different photos to the region's existing hero.
// Selections reflect planning topics and do not attribute projects to a city.
const galleriesByRegion = new Map<string, readonly GalleryPhotoKey[]>([
  [
    "gartenbau-hattersheim",
    [
      "pavedEntrance",
      "terraceLawn",
      "lawnSeating",
      "meshFence",
      "dripIrrigation",
      "garageDrain",
      "stoneBeet",
      "flowerPath",
    ],
  ],
  [
    "gartenbau-kelsterbach",
    [
      "woodMetalScreen",
      "screenedTerrace",
      "gardenGate",
      "pavedEntrance",
      "terraceSlabs",
      "lawnTerrace",
      "flowerPath",
      "pathDrain",
    ],
  ],
  [
    "gartenbau-hofheim",
    [
      "stoneStairs",
      "slopeBeet",
      "elevatedLawn",
      "deckStoneStairs",
      "stoneWallSlabs",
      "terraceDrain",
      "meshFence",
      "stoneStairsConstruction",
    ],
  ],
  [
    "gartenbau-kriftel",
    [
      "lawnTerrace",
      "curvedLawn",
      "treeDeck",
      "stoneBeet",
      "dripIrrigation",
      "flowerPath",
      "terraceLawn",
      "meshFence",
    ],
  ],
  [
    "gartenbau-floersheim",
    [
      "entranceBlockStairs",
      "garageDrain",
      "gardenGate",
      "stoneWallSlabs",
      "lawnTerrace",
      "curvedBeet",
      "meshFence",
      "pathDrain",
    ],
  ],
  [
    "gartenbau-hochheim",
    [
      "stoneWall",
      "stoneStairs",
      "pergolaPath",
      "stoneWallSlabs",
      "terraceSlabs",
      "terraceDrain",
      "stoneBeet",
      "lawnSeating",
    ],
  ],
  [
    "gartenbau-frankfurt-hoechst",
    [
      "anthraciteScreen",
      "screenedTerrace",
      "gardenGate",
      "pavedEntrance",
      "flowerPath",
      "pathDrain",
      "terraceSubstructure",
      "plantedGarden",
    ],
  ],
  [
    "gartenbau-bad-soden",
    [
      "treeDeck",
      "deckPlanting",
      "curvedLawn",
      "pergolaPath",
      "curvedBeet",
      "dripIrrigation",
      "terraceDrain",
      "deckStoneStairs",
    ],
  ],
  [
    "gartenbau-sulzbach-taunus",
    [
      "pavedEntrance",
      "entranceBlockStairs",
      "garageDrain",
      "gardenGate",
      "meshFence",
      "curvedLawn",
      "curvedBeet",
      "pathDrain",
    ],
  ],
  [
    "gartenbau-eschborn",
    [
      "grassesPath",
      "meshFence",
      "gardenGate",
      "pathDrain",
      "dripIrrigation",
      "curvedBeet",
      "entranceStairs",
      "plantedGarden",
    ],
  ],
]);

export function getRegionGallery(slug: string): RegionalProjectPhoto[] {
  return (galleriesByRegion.get(slug) ?? []).map((key) => ({
    ...galleryPhotos[key],
  }));
}
