import { z } from "zod";

// Only public form routes are accepted. Never collect query strings, fragments,
// referrers, browser identifiers or a visitor's navigation history.
const publicFormPage =
  /^(?:\/(?:kontakt|konfigurator|einsatzgebiete|leistungen|projekte|ueber-uns|ratgeber|jobs|downloads|partner-werden|fachverband-mitgliedschaft|impressum|datenschutz|agb|terrasse-bauen-lassen|einfahrt-pflastern-lassen|l-steine-setzen-lassen|spielplatzbau|holzterrasse-bad-soden|zisterne-einbauen-lassen|dachbegruenung)?|\/leistungen\/(?:gartengestaltung|pflasterarbeiten|natursteinarbeiten|zaunarbeiten|rasenanlagen|bewaesserungsanlagen|erdarbeiten|entwaesserung)|\/gartenbau-(?:hattersheim|kelsterbach|kriftel|hofheim|bad-soden|eschborn|floersheim|hochheim|sulzbach-taunus|frankfurt|frankfurt-hoechst|frankfurt-unterliederbach|frankfurt-zeilsheim|wiesbaden|mainz|bad-homburg|darmstadt|hanau|offenbach|ruesselsheim|oberursel|neu-isenburg|kronberg|koenigstein|kelkheim|schwalbach-taunus|liederbach|friedrichsdorf|bad-vilbel|dreieich|langen|maintal|eltville|niedernhausen|taunusstein|idstein|raunheim))$/;

const publicDetailPage =
  /^(?:\/ratgeber\/(?:pflasterarbeiten-kosten-einfahrt|rollrasen-oder-einsaat|garten-umgestalten-in-etappen|terrasse-entwaesserung-planen|gartenbewaesserung-planen|naturstein-terrasse-materialwahl)|\/autoren\/serhad-marasli|\/projekte\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

export function normalizeInquiryPage(value: unknown): string | undefined {
  return typeof value === "string" &&
    value.length <= 100 &&
    (publicFormPage.test(value) || publicDetailPage.test(value))
    ? value
    : undefined;
}

// Invalid optional context must not prevent an otherwise valid inquiry.
export const inquiryPageSchema = z.unknown().transform(normalizeInquiryPage);

export function currentInquiryPage() {
  return typeof window === "undefined" ? undefined : normalizeInquiryPage(window.location.pathname);
}

export function withInquiryPage(message: string, page: unknown) {
  const path = normalizeInquiryPage(page);
  return path ? `Anfrageseite: https://www.loni-galabau.de${path}\n\n${message}` : message;
}
