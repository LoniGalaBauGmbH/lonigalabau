import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { absoluteUrl } from "@/lib/company";
const escapeXml = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [services, jobs] = await Promise.all([
          supabaseAdmin.from("services").select("slug").eq("active", true),
          supabaseAdmin.from("jobs").select("slug").eq("active", true),
        ]);
        if (services.error || jobs.error)
          return new Response("Temporarily unavailable", { status: 503 });
        const paths = [
          "/",
          "/leistungen",
          "/projekte",
          "/ueber-uns",
          "/kontakt",
          "/konfigurator",
          "/jobs",
          "/impressum",
          "/datenschutz",
          "/agb",
          ...(services.data ?? []).map((s) => "/leistungen/" + encodeURIComponent(s.slug)),
          ...(jobs.data ?? []).map((j) => "/jobs/" + encodeURIComponent(j.slug)),
        ];
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
          paths
            .map((path) => "<url><loc>" + escapeXml(absoluteUrl(path)) + "</loc></url>")
            .join("") +
          "</urlset>";
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
