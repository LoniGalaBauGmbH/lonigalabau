import { createFileRoute } from "@tanstack/react-router";
import { RegionsOverviewPage } from "@/components/site/RegionalLandingPage";
import { getRegion, regionImage, regionsOverviewSchema } from "@/lib/regions";
import { canonicalUrl, safeJsonLd } from "@/lib/seo";

const overviewImage = regionImage(getRegion("gartenbau-hattersheim"));

export const Route = createFileRoute("/einsatzgebiete")({
  head: () => ({
    meta: [
      { title: "Einsatzgebiete: Gartenbau deutschlandweit | Loni GalaBau" },
      {
        name: "description",
        content:
          "Garten- und Landschaftsbau deutschlandweit: Loni GalaBau aus Hattersheim freut sich auf Ihr Projekt. Zehn Ortsseiten zeigen regionale Beispiele im Rhein-Main-Gebiet.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: canonicalUrl(overviewImage.src) },
      {
        property: "og:image:alt",
        content: getRegion("gartenbau-hattersheim").imageAlt,
      },
      { name: "twitter:image", content: canonicalUrl(overviewImage.src) },
    ],
    scripts: [{ type: "application/ld+json", children: safeJsonLd(regionsOverviewSchema()) }],
  }),
  component: RegionsOverviewPage,
});
