import content from "@/content/ratgeber.json";
import { canonicalUrl } from "./seo";
import { publicImageUrl } from "./public-image-url";

type GuideSection = {
  heading: string;
  paragraphs: string[];
  checklist?: string[];
  comparison?: { caption: string; columns: string[]; rows: string[][] };
  references?: { label: string; url: string }[];
};
export type Guide = Omit<(typeof content)[number], "sections"> & {
  sections: GuideSection[];
  takeaways?: string[];
  projectExample?: { projectId: string; title: string; description: string; linkLabel: string };
};
export const guides: Guide[] = content;
export const serviceNames: Record<string, string> = {
  pflasterarbeiten: "Pflasterarbeiten",
  gartengestaltung: "Gartengestaltung",
  natursteinarbeiten: "Natursteinarbeiten",
  rasenanlagen: "Rasenanlagen",
  erdarbeiten: "Erdarbeiten",
  entwaesserung: "Entwässerung",
  bewaesserungsanlagen: "Bewässerungsanlagen",
};
export const guideDate = (date: string) =>
  new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "Europe/Berlin" }).format(
    new Date(`${date}T12:00:00+02:00`),
  );
export function guideSchema(article: Guide) {
  const url = canonicalUrl(`/ratgeber/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#artikel`,
        mainEntityOfPage: url,
        headline: article.title,
        description: article.metaDescription,
        image: canonicalUrl(publicImageUrl(article.image)),
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        inLanguage: "de-DE",
        articleSection: article.category,
        author: {
          "@type": "Person",
          "@id": canonicalUrl("/autoren/serhad-marasli") + "#person",
          name: "Serhad Marasli",
          jobTitle: "Bau- & Operations Manager",
          worksFor: { "@type": "Organization", name: "Loni Galabau GmbH", url: canonicalUrl("/") },
          url: canonicalUrl("/autoren/serhad-marasli"),
        },
        publisher: { "@type": "Organization", name: "Loni Galabau GmbH", url: canonicalUrl("/") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Ratgeber", item: canonicalUrl("/ratgeber") },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };
}
