import summaries from "@/content/ratgeber-index.json";

export type GuideSummary = (typeof summaries)[number];
export const guides: GuideSummary[] = summaries;

export const relatedGuideSlugs: Readonly<Record<string, readonly string[]>> = {
  "pflasterarbeiten-kosten-einfahrt": [
    "terrasse-entwaesserung-planen",
    "naturstein-terrasse-materialwahl",
    "garten-umgestalten-in-etappen",
  ],
  "rollrasen-oder-einsaat": ["gartenbewaesserung-planen", "garten-umgestalten-in-etappen"],
  "garten-umgestalten-in-etappen": [
    "pflasterarbeiten-kosten-einfahrt",
    "rollrasen-oder-einsaat",
    "gartenbewaesserung-planen",
  ],
  "terrasse-entwaesserung-planen": [
    "pflasterarbeiten-kosten-einfahrt",
    "naturstein-terrasse-materialwahl",
    "garten-umgestalten-in-etappen",
  ],
  "gartenbewaesserung-planen": ["rollrasen-oder-einsaat", "garten-umgestalten-in-etappen"],
  "naturstein-terrasse-materialwahl": [
    "terrasse-entwaesserung-planen",
    "pflasterarbeiten-kosten-einfahrt",
    "garten-umgestalten-in-etappen",
  ],
};

const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));

export function getRelatedGuides(articleSlug: string): GuideSummary[] {
  const slugs = Object.hasOwn(relatedGuideSlugs, articleSlug) ? relatedGuideSlugs[articleSlug] : [];
  const seen = new Set([articleSlug]);
  return slugs.flatMap((slug) => {
    const guide = guideBySlug.get(slug);
    if (!guide || seen.has(slug)) return [];
    seen.add(slug);
    return [guide];
  });
}
