import { publicImageUrl } from "./public-image-url";

// Small derivatives of the curated service photos; regenerate with scripts/generate-menu-images.mjs.
export const MENU_FEATURE_IMAGE = publicImageUrl("/images/menu/gartenplaner.webp");

export function getMenuThumbnail(slug: string) {
  return publicImageUrl(`/images/menu/${slug}.webp`);
}
