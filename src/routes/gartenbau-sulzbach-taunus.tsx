import { createFileRoute } from "@tanstack/react-router";
import { RegionalLandingPage } from "@/components/site/RegionalLandingPage";
import { getRegion, regionImage, regionSchema } from "@/lib/regions";
import { canonicalUrl, safeJsonLd } from "@/lib/seo";

const page = getRegion("gartenbau-sulzbach-taunus");

export const Route = createFileRoute("/gartenbau-sulzbach-taunus")({
  head: () => ({
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: canonicalUrl(regionImage(page).src) },
      { property: "og:image:alt", content: page.imageAlt },
      { name: "twitter:image", content: canonicalUrl(regionImage(page).src) },
    ],
    scripts: [{ type: "application/ld+json", children: safeJsonLd(regionSchema(page)) }],
  }),
  component: () => <RegionalLandingPage page={page} />,
});
