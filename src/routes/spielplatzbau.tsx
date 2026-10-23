import { createFileRoute } from "@tanstack/react-router";
import { ProjectOfferPage } from "@/components/site/ProjectOfferPage";
import { playgroundOffer } from "@/lib/playground-offer";
import { projectOfferHead } from "@/lib/project-offers";

export const Route = createFileRoute("/spielplatzbau")({
  head: () => projectOfferHead(playgroundOffer),
  component: () => <ProjectOfferPage content={playgroundOffer} />,
});
