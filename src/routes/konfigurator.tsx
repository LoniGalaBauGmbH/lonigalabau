import { createFileRoute } from "@tanstack/react-router";
import { GardenPlanner } from "@/components/site/GardenPlanner";

export const Route = createFileRoute("/konfigurator")({
  head: () => ({
    meta: [
      { title: "Gartenprojekt planen & anfragen | Loni GalaBau" },
      {
        name: "description",
        content:
          "Gartenprojekt Schritt für Schritt vorbereiten: Leistungen, Maße, Materialien und Fotos zusammenstellen. Mit Flächenrechner und persönlicher Projektübersicht.",
      },
    ],
  }),
  component: GardenPlanner,
});
