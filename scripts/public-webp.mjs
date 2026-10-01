const prefix = "/__public-webp";
const conditionalHeaders = ["range", "if-range", "if-none-match", "if-modified-since"];
const failure = (status, method = "GET") =>
  new Response(null, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(method === "OTHER" ? { Allow: "GET, HEAD" } : {}),
    },
  });

/** Public build assets only. No arbitrary targets, credentials, or upstream network fetch. */
export async function publicWebpResponse(request, env, allowedPaths) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(prefix + "/")) return null;
  if (!["GET", "HEAD"].includes(request.method)) return failure(405, "OTHER");
  const assetPath = url.pathname.slice(prefix.length);
  if (!allowedPaths.has(assetPath) || url.search) return failure(404);
  if (typeof env?.ASSETS?.fetch !== "function") return failure(503);
  const forwarded = new Headers();
  for (const name of conditionalHeaders) {
    const value = request.headers.get(name);
    if (value !== null) forwarded.set(name, value);
  }
  let response;
  try {
    response = await env.ASSETS.fetch(
      new Request(new URL(assetPath, "https://assets.local"), {
        method: request.method,
        headers: forwarded,
      }),
    );
  } catch {
    return failure(502);
  }
  if (![200, 206, 304].includes(response.status))
    return failure(response.status >= 400 ? response.status : 502);
  const contentType = response.headers.get("content-type")?.split(";")[0].trim();
  if (
    response.headers.has("set-cookie") ||
    (contentType && !["image/webp", "application/octet-stream"].includes(contentType))
  )
    return failure(502);
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "image/webp");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set(
    "Cache-Control",
    /^\/assets\/[\w.-]+-[\w-]{8,}\.webp$/.test(assetPath)
      ? "public, max-age=31536000, immutable"
      : "public, max-age=86400",
  );
  return new Response(request.method === "HEAD" || response.status === 304 ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
