/** Production-only route for public WebP assets whose static host omits the image MIME type. */
export function publicImageUrl(src: string) {
  if (!import.meta.env.PROD) return src;
  const origin = "https://www.loni-galabau.de";
  const path = src.startsWith(origin + "/") ? src.slice(origin.length) : src;
  if (!/^\/(?:images|assets)\/[\w/.-]+\.webp$/.test(path)) return src;
  const corrected = "/__public-webp" + path;
  return src.startsWith(origin + "/") ? origin + corrected : corrected;
}
