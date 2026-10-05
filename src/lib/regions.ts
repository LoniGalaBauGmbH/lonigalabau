import content from "@/content/regions.json";
import {
  canonicalUrl,
  ORGANIZATION_ID,
  WEBSITE_ID,
  organizationSchema,
  publicPageSchema,
  websiteSchema,
} from "./seo";
import { publicImageUrl } from "./public-image-url";

export interface RegionPage {
  slug: string;
  city: string;
  shortName: string;
  title: string;
  description: string;
  h1: string;
  kicker: string;
  intro: string[];
  districts: string[];
  focus: string;
  sections: { heading: string; paragraphs: string[] }[];
  checklist: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  imageAlt: string;
  imageCaption: string;
  updatedAt: string;
}

export const regions: RegionPage[] = content;

export function getRegion(slug: string): RegionPage {
  const page = regions.find((region) => region.slug === slug);
  if (!page) throw new Error("Unbekannte Ortsseite");
  return page;
}

// Existing Loni photos illustrate a type of work, not an unverified project location.
export function regionImage(page: RegionPage) {
  const base = `/images/regionen/${page.slug}-loni-galabau`;
  return {
    src: publicImageUrl(`${base}-960.webp`),
    avif: `${base}-640.avif 640w, ${base}-960.avif 960w`,
    webp: `${publicImageUrl(`${base}-640.webp`)} 640w, ${publicImageUrl(`${base}-960.webp`)} 960w`,
    width: 960,
    height: [
      "gartenbau-hattersheim",
      "gartenbau-kelsterbach",
      "gartenbau-kriftel",
      "gartenbau-frankfurt-hoechst",
      "gartenbau-eschborn",
    ].includes(page.slug)
      ? 720
      : 1280,
  };
}

export function regionSchema(page: RegionPage) {
  const url = canonicalUrl(`/${page.slug}`);
  const serviceId = url + "#service";
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      {
        "@type": "WebPage",
        "@id": url + "#webpage",
        url,
        name: page.h1,
        description: page.description,
        inLanguage: "de-DE",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        about: { "@id": serviceId },
        mainEntity: { "@id": serviceId },
        breadcrumb: { "@id": url + "#breadcrumb" },
        dateModified: page.updatedAt,
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: canonicalUrl(regionImage(page).src),
          caption: page.imageCaption,
        },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: page.h1,
        serviceType: "Garten- und Landschaftsbau",
        url,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: {
          "@type": page.slug === "gartenbau-frankfurt-hoechst" ? "Place" : "City",
          name: page.city,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: canonicalUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Einsatzgebiete",
            item: canonicalUrl("/einsatzgebiete"),
          },
          { "@type": "ListItem", position: 3, name: page.city, item: url },
        ],
      },
    ],
  };
}

export function regionsOverviewSchema() {
  return publicPageSchema(
    "/einsatzgebiete",
    "Gartenbau vor Ort – Main-Taunus-Kreis und Frankfurt-West",
    "CollectionPage",
    regions.map((page) => ({ path: `/${page.slug}`, name: page.city })),
  );
}
