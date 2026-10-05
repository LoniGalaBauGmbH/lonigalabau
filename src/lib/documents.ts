export type QualificationDocument = {
  id: string;
  title: string;
  shortTitle: string;
  issuer: string;
  category: "Ausbildung" | "Fachliche Nachweise" | "Arbeitsschutz" | "Steuerliche Bescheinigungen";
  date: string;
  validUntil?: string;
  pageCount?: number;
  description: string;
  featured: boolean;
};

export const qualificationDocuments: QualificationDocument[] = [
  {
    id: "freistellungsbescheinigung-48b-estg",
    title: "Freistellungsbescheinigung nach § 48b EStG",
    shortTitle: "Freistellung § 48b EStG",
    issuer: "Finanzamt Wiesbaden",
    category: "Steuerliche Bescheinigungen",
    date: "25.09.2025",
    validUntil: "26.04.2027",
    pageCount: 2,
    description:
      "Bescheinigung zur Freistellung vom Steuerabzug bei Bauleistungen. Gültig vom 27.10.2025 bis 26.04.2027.",
    featured: true,
  },
  {
    id: "nachweis-13b-ustg",
    title: "Nachweis zur Steuerschuldnerschaft nach § 13b UStG",
    shortTitle: "Nachweis § 13b UStG",
    issuer: "Finanzamt Wiesbaden",
    category: "Steuerliche Bescheinigungen",
    date: "27.03.2025",
    validUntil: "24.03.2027",
    pageCount: 2,
    description:
      "Nachweis zur Steuerschuldnerschaft des Leistungsempfängers bei Bauleistungen. Gültig bis einschließlich 24.03.2027.",
    featured: true,
  },
  {
    id: "praequalifikation-bau",
    title: "Präqualifikation für Bauunternehmen",
    shortTitle: "Präqualifikation",
    issuer: "Zertifizierung Bau",
    category: "Fachliche Nachweise",
    date: "19.05.2026",
    description:
      "Bescheinigung für die Loni GalaBau GmbH, Registriernummer 010.121130. Die aktuelle Gültigkeit und die Leistungsbereiche ergeben sich aus dem amtlichen Präqualifikationsverzeichnis.",
    featured: true,
  },
  {
    id: "llh-ausbilderanerkennung",
    title: "Anerkennung als Ausbilder",
    shortTitle: "Ausbilderanerkennung",
    issuer: "LLH Hessen",
    category: "Ausbildung",
    date: "05.06.2023",
    description:
      "Anerkennung von Valon Sinanaj als Ausbilder für den Beruf Gärtner/Gärtnerin durch den Landesbetrieb Landwirtschaft Hessen.",
    featured: true,
  },
  {
    id: "ihk-ausbildereignung",
    title: "Ausbildereignung nach AEVO",
    shortTitle: "Ausbildereignung",
    issuer: "IHK Wiesbaden",
    category: "Ausbildung",
    date: "07.06.2016",
    description:
      "Zeugnis über die bestandene Prüfung von Valon Sinanaj nach der Ausbilder-Eignungsverordnung.",
    featured: true,
  },
  {
    id: "fll-ztv-wegebau",
    title: "Fachtagung ZTV-Wegebau 2022",
    shortTitle: "Weiterbildung Wegebau",
    issuer: "FLL",
    category: "Fachliche Nachweise",
    date: "22.02.2023",
    description:
      "Teilnahmebescheinigung für Valon Sinanaj zur FLL-Fachtagung über Baustoffe und Bauweisen im überarbeiteten Regelwerk ZTV-Wegebau 2022.",
    featured: true,
  },
  {
    id: "svlfg-arbeitsschutz",
    title: "Arbeitsschutzlehrgang",
    shortTitle: "Arbeitsschutz",
    issuer: "SVLFG",
    category: "Arbeitsschutz",
    date: "17.12.2015",
    description:
      "Teilnahmebescheinigung für Valon Sinanaj. Der Lehrgang wird als Grundlehrgang im Unternehmermodell oder als Einführungslehrgang zum Sicherheitsbeauftragten anerkannt.",
    featured: true,
  },
  {
    id: "svlfg-erlaeuterungen",
    title: "Erläuterungen zum Arbeitsschutzlehrgang",
    shortTitle: "Erläuterungen",
    issuer: "SVLFG",
    category: "Arbeitsschutz",
    date: "Ohne Datumsangabe",
    description:
      "Ergänzendes Informationsblatt der SVLFG zur Anerkennung und Verwendung des Teilnahmenachweises.",
    featured: false,
  },
];

import { publicImageUrl } from "./public-image-url";

export const documentFile = (id: string) => `/downloads/${id}.pdf`;
export const documentImage = (id: string, thumbnail = false) =>
  publicImageUrl(`/images/qualifikationen/${id}${thumbnail ? "-thumb" : ""}.webp`);
export const documentPageImage = (id: string, page: number) =>
  publicImageUrl(`/images/qualifikationen/${id}${page > 1 ? `-seite-${page}` : ""}.webp`);
