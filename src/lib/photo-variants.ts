import catalog from "@/content/photo-variants.json";
import { publicImageUrl } from "./public-image-url";

const storageOrigin = "https://fvctfguvupdcscthrxeb.supabase.co";
const storagePath = "/storage/v1/object/public/project-images/referenzen-2026/";

/** Only curated public photos have local derivatives; new uploads retain their URL. */
export function optimizedPhoto(src: string) {
  let url: URL;
  try {
    url = new URL(src, "https://www.loni-galabau.de");
  } catch {
    return;
  }
  const local =
    url.origin === "https://www.loni-galabau.de" && url.pathname.startsWith("/images/projekte/");
  const stored = url.origin === storageOrigin && url.pathname.startsWith(storagePath);
  if (!local && !stored) return;
  const name = url.pathname
    .split("/")
    .pop()
    ?.replace(/-small\.webp$/, ".webp");
  const item = name ? catalog[name as keyof typeof catalog] : undefined;
  if (!item || !name) return;
  const base = `/images/optimized-v1/${name.replace(/\.webp$/, "")}`;
  const srcSet = (format: "avif" | "webp") =>
    item.widths
      .map((width) => `${publicImageUrl(`${base}-${width}.${format}`)} ${width}w`)
      .join(", ");
  return {
    width: item.width,
    height: item.height,
    src: publicImageUrl(`${base}-640.webp`),
    avif: srcSet("avif"),
    webp: srcSet("webp"),
  };
}
