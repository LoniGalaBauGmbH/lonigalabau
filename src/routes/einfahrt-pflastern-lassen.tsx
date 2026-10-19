import { createFileRoute } from "@tanstack/react-router";
import { ProjectOfferPage } from "@/components/site/ProjectOfferPage";
import { drivewayOffer, projectOfferHead } from "@/lib/project-offers";

export const Route = createFileRoute("/einfahrt-pflastern-lassen")({
  head: () => projectOfferHead(drivewayOffer),
  component: () => <ProjectOfferPage content={drivewayOffer} />,
});
