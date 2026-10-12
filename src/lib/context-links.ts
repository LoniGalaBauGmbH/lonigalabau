import { guides } from "./guide-index";

export type ContextPart =
  | { kind: "text"; text: string }
  | { kind: "link"; label: string; section: "leistungen" | "ratgeber"; slug: string };

const serviceSlugs = new Set([
  "gartengestaltung",
  "pflasterarbeiten",
  "natursteinarbeiten",
  "zaunarbeiten",
  "rasenanlagen",
  "bewaesserungsanlagen",
  "erdarbeiten",
  "entwaesserung",
]);
const guideSlugs = new Set(guides.map((guide) => guide.slug));

export function parseContextLinks(text: string): ContextPart[] {
  const parts: ContextPart[] = [];
  let cursor = 0;
  const pattern = /\[([^[\]\r\n]+)\]\(\/(leistungen|ratgeber)\/([a-z-]+)\)/g;
  for (const match of text.matchAll(pattern)) {
    const [source, label, section, slug] = match;
    const allowed = section === "leistungen" ? serviceSlugs.has(slug) : guideSlugs.has(slug);
    if (!allowed || !label.trim()) continue;
    const index = match.index ?? 0;
    if (cursor < index) parts.push({ kind: "text", text: text.slice(cursor, index) });
    parts.push({
      kind: "link",
      label,
      section: section as "leistungen" | "ratgeber",
      slug,
    });
    cursor = index + source.length;
  }
  if (cursor < text.length || parts.length === 0) {
    parts.push({ kind: "text", text: text.slice(cursor) });
  }
  return parts;
}
