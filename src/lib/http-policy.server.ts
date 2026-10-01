import { PUBLIC_ORIGIN, PRIVATE_PATH, LEGACY_REDIRECTS, STATIC_PATHS, sitemapXml } from "./seo";
import guideContent from "../content/ratgeber.json";
import { projectGalleryLastModified } from "./project-gallery-editorial";

// These pages received substantive copy changes in the 01.10.2026 SEO release.
const STATIC_CONTENT_MODIFIED: Record<string, string> = {
  "/": "2026-10-01T14:39:01Z",
  "/leistungen": "2026-10-01T14:39:01Z",
  "/projekte": "2026-10-01T14:39:01Z",
};

export async function publicUtilityResponse(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  let path: string;
  try {
    path = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";
  } catch {
    return new Response("Ungültige Adresse", { status: 400 });
  }
  const target = LEGACY_REDIRECTS[path];
  if (
    (target || (url.pathname !== path && path !== "/") || url.hostname === "loni-galabau.de") &&
    ["GET", "HEAD"].includes(request.method)
  ) {
    const origin = url.hostname === "loni-galabau.de" ? PUBLIC_ORIGIN : url.origin;
    return new Response(null, {
      status: 301,
      headers: { Location: origin + (target || path) + url.search },
    });
  }
  if (path === "/robots.txt")
    return new Response(
      "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /_server\nDisallow: /api/\n\nSitemap: " +
        PUBLIC_ORIGIN +
        "/sitemap.xml\n",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  if (path === "/sitemap_index.xml")
    return new Response(null, { status: 301, headers: { Location: url.origin + "/sitemap.xml" } });
  if (path !== "/sitemap.xml") return null;
  try {
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const results = await Promise.all(
      ["services", "jobs"].map((table) =>
        supabaseAdmin
          .from(table as "services" | "jobs")
          .select("slug,updated_at")
          .eq("active", true),
      ),
    );
    if (results.some((r) => r.error)) throw new Error("Sitemap source unavailable");
    const entries = STATIC_PATHS.map((path) => ({
      path,
      modified: STATIC_CONTENT_MODIFIED[path] as string | undefined,
    }));
    guideContent.forEach((article) =>
      entries.push({ path: `/ratgeber/${article.slug}`, modified: article.updatedAt }),
    );
    results.forEach((r, i) =>
      r.data?.forEach((row) =>
        entries.push({
          path: (i === 0 ? "/leistungen/" : "/jobs/") + encodeURIComponent(row.slug),
          modified: row.updated_at,
        }),
      ),
    );
    const projects = await supabaseAdmin
      .from("projects")
      .select("id,updated_at,images")
      .eq("active", true);
    if (projects.error) throw new Error("Project sitemap unavailable");
    projects.data
      ?.filter((project) => project.images?.length)
      .forEach((project) =>
        entries.push({
          path: "/projekte/" + project.id,
          modified: projectGalleryLastModified(project.id, project.images, project.updated_at),
        }),
      );
    return new Response(sitemapXml(entries), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Sitemap vorübergehend nicht verfügbar", {
      status: 503,
      headers: { "Retry-After": "300" },
    });
  }
}

export function secureResponse(request: Request, response: Response) {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  const local = ["localhost", "127.0.0.1"].includes(url.hostname);
  if (!local) {
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://fvctfguvupdcscthrxeb.supabase.co; font-src 'self'; connect-src 'self' https://fvctfguvupdcscthrxeb.supabase.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
    );
    headers.set("Strict-Transport-Security", "max-age=15552000");
  }
  if (
    url.hostname !== "www.loni-galabau.de" ||
    PRIVATE_PATH.test(url.pathname) ||
    response.status >= 400
  )
    headers.set("X-Robots-Tag", "noindex, nofollow");
  if (PRIVATE_PATH.test(url.pathname) || request.method !== "GET" || response.status >= 400)
    headers.set("Cache-Control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
