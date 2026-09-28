import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/company";
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /_serverFn/\nSitemap: " +
            absoluteUrl("/sitemap.xml") +
            "\n",
          { headers: { "Content-Type": "text/plain; charset=utf-8" } },
        ),
    },
  },
});
