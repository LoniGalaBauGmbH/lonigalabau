import { createFileRoute } from "@tanstack/react-router";
import { ProjectOfferPage } from "@/components/site/ProjectOfferPage";
import { projectOfferHead } from "@/lib/project-offers";
import { woodTerraceOffer } from "@/lib/wood-terrace-offer";

export const Route = createFileRoute("/holzterrasse-bad-soden")({
  head: () => projectOfferHead(woodTerraceOffer),
  component: () => <ProjectOfferPage content={woodTerraceOffer} />,
});
