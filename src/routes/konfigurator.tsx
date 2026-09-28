import { createFileRoute } from "@tanstack/react-router";
import { GardenPlanner } from "@/components/site/GardenPlanner";

export const Route = createFileRoute("/konfigurator")({
  head: () => ({
    meta: [
      { title: "Gartenplaner – Ihr Projekt Schritt für Schritt | Loni Galabau" },
      {
        name: "description",
        content:
          "Planen Sie Ihr Gartenprojekt mit passenden Fragen zu Gewerken, Maßen, Materialien, Grundstück und Budget. Mit Fotos, Flächenrechner und persönlicher Projektübersicht.",
      },
    ],
  }),
  component: GardenPlanner,
});
