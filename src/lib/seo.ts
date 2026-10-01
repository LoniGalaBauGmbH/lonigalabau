export const PUBLIC_ORIGIN = "https://www.loni-galabau.de";
export const canonicalUrl = (path: string) =>
  PUBLIC_ORIGIN + (path === "/" ? "/" : path.replace(/\/+$/, ""));
export const PRIVATE_PATH =
  /^\/(?:admin(?:\/|$)|login(?:\/|$)|_serverFn(?:\/|$)|_server(?:\/|$)|api(?:\/|$))/;
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/datenschtuz": "/datenschutz",
  "/kopie-von-gartengestaltung": "/leistungen/gartengestaltung",
  "/kopie-von-erdarbeiten-1": "/leistungen/erdarbeiten",
  "/pages-sitemap.xml": "/sitemap.xml",
  "/service-details/natursteinarbeiten": "/leistungen/natursteinarbeiten",
  "/service-details/gartengestaltung": "/leistungen/gartengestaltung",
  "/service-details/pflasterarbeiten": "/leistungen/pflasterarbeiten",
  "/service-details/bewässerungsanlagen": "/leistungen/bewaesserungsanlagen",
  "/service-details/zaun": "/leistungen/zaunarbeiten",
  "/service-details/rasenanlagen": "/leistungen/rasenanlagen",
  "/service-details/erdarbeiten": "/leistungen/erdarbeiten",
  "/service-details/entwässerung": "/leistungen/entwaesserung",
};
export const STATIC_PATHS = [
  "/",
  "/ueber-uns",
  "/leistungen",
  "/projekte",
  "/ratgeber",
  "/autoren/serhad-marasli",
  "/konfigurator",
  "/jobs",
  "/kontakt",
  "/downloads",
  "/impressum",
  "/datenschutz",
  "/agb",
];
export const xmlEscape = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!,
  );
export function sitemapXml(entries: { path: string; modified?: string | null }[]) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entries
      .map(
        (e) =>
          "<url><loc>" +
          xmlEscape(canonicalUrl(e.path)) +
          "</loc>" +
          (e.modified && Number.isFinite(Date.parse(e.modified))
            ? "<lastmod>" + new Date(e.modified).toISOString() + "</lastmod>"
            : "") +
          "</url>",
      )
      .join("") +
    "</urlset>"
  );
}
export const safeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

// Stable identifiers connect the same company, website and author across public pages.
export const ORGANIZATION_ID = canonicalUrl("/") + "#organization";
export const WEBSITE_ID = canonicalUrl("/") + "#website";
export const EDITORIAL_AUTHOR_ID = canonicalUrl("/autoren/serhad-marasli") + "#person";

export function organizationSchema() {
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": ORGANIZATION_ID,
    name: "Loni GalaBau GmbH",
    url: canonicalUrl("/"),
    logo: canonicalUrl("/images/partner/loni.svg"),
    image: canonicalUrl("/images/social-preview.jpg"),
    telephone: "+49-6190-9266134",
    email: "info@loni-galabau.de",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Auf der Roos 3",
      addressLocality: "Hattersheim am Main",
      postalCode: "65795",
      addressCountry: "DE",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
    ],
    areaServed: { "@type": "Country", name: "Deutschland" },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: canonicalUrl("/"),
    name: "Loni GalaBau",
    inLanguage: "de-DE",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function editorialAuthorSchema() {
  return {
    "@type": "Person",
    "@id": EDITORIAL_AUTHOR_ID,
    name: "Serhad Marasli",
    jobTitle: "Bau- & Operations Manager",
    worksFor: { "@id": ORGANIZATION_ID },
    url: canonicalUrl("/autoren/serhad-marasli"),
  };
}

export function publicPageSchema(
  path: string,
  name: string,
  type: "AboutPage" | "ContactPage" | "CollectionPage",
  items?: { path: string; name: string }[],
) {
  const url = canonicalUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      {
        "@type": type,
        "@id": url + "#webpage",
        url,
        name,
        inLanguage: "de-DE",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        about: { "@id": ORGANIZATION_ID },
        mainEntity: items
          ? {
              "@type": "ItemList",
              "@id": url + "#items",
              itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: canonicalUrl(item.path),
              })),
            }
          : { "@id": ORGANIZATION_ID },
      },
    ],
  };
}
