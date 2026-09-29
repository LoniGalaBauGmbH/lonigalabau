// Only successful, public static resources receive long-lived cache headers.
// Never cache HTML, API responses, missing files, or authenticated content here.
export function assetResponse(request, response) {
  const path = new URL(request.url).pathname;
  if (!["GET", "HEAD"].includes(request.method) || ![200, 304].includes(response.status))
    return response;
  let cache;
  if (/^\/assets\/[\w.-]+-[\w-]{8,}\.(?:js|css|png|jpe?g|webp|avif|svg|woff2)$/.test(path))
    cache = "public, max-age=31536000, immutable";
  else if (/^\/fonts\/[\w.-]+\.woff2$/.test(path)) cache = "public, max-age=86400";
  else if (/^\/images\/[\w/.-]+\.(?:png|jpe?g|webp|avif|svg)$/.test(path))
    cache = "public, max-age=86400";
  if (!cache) return response;
  const headers = new Headers(response.headers);
  if (headers.get("content-type")?.includes("text/html") || headers.has("set-cookie"))
    return response;
  headers.set("Cache-Control", cache);
  if (path.endsWith(".woff2")) headers.set("Content-Type", "font/woff2");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
