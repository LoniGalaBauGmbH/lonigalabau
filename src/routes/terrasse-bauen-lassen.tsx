import { createFileRoute } from "@tanstack/react-router";
import { ProjectOfferPage } from "@/components/site/ProjectOfferPage";
import { terraceOffer, projectOfferHead } from "@/lib/project-offers";

export const Route = createFileRoute("/terrasse-bauen-lassen")({
  head: () => projectOfferHead(terraceOffer),
  component: () => <ProjectOfferPage content={terraceOffer} />,
});
