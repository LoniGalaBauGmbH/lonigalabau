/** Production delivery for known public images; external and private URLs stay untouched. */
export function publicImageUrl(src: string) {
  if (!import.meta.env.PROD) return src;
  const origin = "https://www.loni-galabau.de";
  const path = src.startsWith(origin + "/") ? src.slice(origin.length) : src;
  if (!/^\/(?:images|assets)\/[\w/.-]+\.(?:png|jpe?g|webp|avif|svg)$/.test(path)) return src;
  const corrected = "/__public-assets" + path;
  return src.startsWith(origin + "/") ? origin + corrected : corrected;
}
