import { createFileRoute } from "@tanstack/react-router";
import { ProjectOfferPage } from "@/components/site/ProjectOfferPage";
import { projectOfferHead } from "@/lib/project-offers";
import { lStoneOffer } from "@/lib/l-stone-offer";

export const Route = createFileRoute("/l-steine-setzen-lassen")({
  head: () => projectOfferHead(lStoneOffer),
  component: () => <ProjectOfferPage content={lStoneOffer} />,
});
