export const PUBLIC_ORIGIN = "https://www.loni-galabau.de";
export const canonicalUrl = (path: string) =>
  PUBLIC_ORIGIN + (path === "/" ? "/" : path.replace(/\/+$/, ""));
export const PRIVATE_PATH =
  /^\/(?:admin(?:\/|$)|login(?:\/|$)|_serverFn(?:\/|$)|_server(?:\/|$)|api(?:\/|$))/;
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/datenschtuz": "/datenschutz",
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
