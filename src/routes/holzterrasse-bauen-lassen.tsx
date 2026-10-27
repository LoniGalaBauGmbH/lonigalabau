import { createFileRoute } from "@tanstack/react-router";
import { ProjectOfferPage } from "@/components/site/ProjectOfferPage";
import { projectOfferHead } from "@/lib/project-offers";
import { generalWoodTerraceOffer } from "@/lib/general-wood-terrace-offer";

export const Route = createFileRoute("/holzterrasse-bauen-lassen")({
  head: () => projectOfferHead(generalWoodTerraceOffer),
  component: () => <ProjectOfferPage content={generalWoodTerraceOffer} />,
});
