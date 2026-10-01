import { readFileSync, writeFileSync } from "node:fs";
export const guideSummaryFields = [
  "slug",
  "title",
  "excerpt",
  "category",
  "readingMinutes",
  "image",
  "imageCaption",
  "relatedServiceSlugs",
  "updatedAt",
];
export function summarizeGuides(guides) {
  return guides.map((guide) =>
    Object.fromEntries(guideSummaryFields.map((key) => [key, guide[key]])),
  );
}
if (process.argv[1]?.endsWith("generate-guide-index.mjs")) {
  const guides = JSON.parse(readFileSync("src/content/ratgeber.json", "utf8"));
  writeFileSync(
    "src/content/ratgeber-index.json",
    JSON.stringify(summarizeGuides(guides), null, 2) + "\n",
  );
}
