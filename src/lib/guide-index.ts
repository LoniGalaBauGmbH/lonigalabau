import summaries from "@/content/ratgeber-index.json";

export type GuideSummary = (typeof summaries)[number];
export const guides: GuideSummary[] = summaries;
