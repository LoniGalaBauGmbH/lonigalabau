// Small derivatives of the curated service photos; regenerate with scripts/generate-menu-images.mjs.
export const MENU_FEATURE_IMAGE = "/images/menu/gartenplaner.webp";

export function getMenuThumbnail(slug: string) {
  return `/images/menu/${slug}.webp`;
}
