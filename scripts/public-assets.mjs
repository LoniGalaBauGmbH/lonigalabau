const prefix = "/__public-assets";
const validators = ["range", "if-range", "if-none-match", "if-modified-since"];
const failure = (status, method) => new Response(null, {
  status,
  headers: {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...(method === "OTHER" ? { Allow: "GET, HEAD" } : {}),
  },
});

/** Only the public files enumerated by this build; never a network or private-file proxy. */
export async function publicAssetResponse(request, env, allowedPaths) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(prefix + "/")) return null;
  if (!["GET", "HEAD"].includes(request.method)) return failure(405, "OTHER");
  const path = url.pathname.slice(prefix.length);
  const expectedType = allowedPaths.get(path);
  if (!expectedType || url.search) return failure(404);
  if (typeof env?.ASSETS?.fetch !== "function") return failure(503);
  const headers = new Headers();
  for (const name of validators) {
    const value = request.headers.get(name);
    if (value !== null) headers.set(name, value);
  }
  let response;
  try {
    response = await env.ASSETS.fetch(new Request(new URL(path, "https://assets.local"), {
      method: request.method,
      headers,
    }));
  } catch {
    return failure(502);
  }
  if (![200, 206, 304].includes(response.status))
    return failure(response.status >= 400 ? response.status : 502);
  const type = response.headers.get("content-type")?.split(";")[0].trim();
  const scriptType = expectedType === "text/javascript" &&
    ["application/javascript", "application/x-javascript"].includes(type);
  if (response.headers.has("set-cookie") ||
      (type && type !== expectedType && type !== "application/octet-stream" && !scriptType))
    return failure(502);
  const result = new Headers(response.headers);
  result.set("Content-Type", expectedType);
  result.set("X-Content-Type-Options", "nosniff");
  result.set("Cache-Control", /^\/assets\/[\w.-]+-[\w-]{8,}\.[\w]+$/.test(path)
    ? "public, max-age=31536000, immutable"
    : "public, max-age=86400");
  return new Response(request.method === "HEAD" || response.status === 304 ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: result,
  });
}
