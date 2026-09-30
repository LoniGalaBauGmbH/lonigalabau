import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getServices } from "@/lib/site.functions";
import { ServiceCarousel } from "@/components/site/ServiceCarousel";

const q = queryOptions({ queryKey: ["services"], queryFn: () => getServices() });

export const Route = createFileRoute("/leistungen/")({
  head: () => ({
    meta: [
      { title: "Leistungen – Loni Galabau GmbH" },
      {
        name: "description",
        content:
          "Unsere Leistungen: Natursteinarbeiten, Gartengestaltung, Pflasterarbeiten, Bewässerung, Zäune, Rasen, Erdarbeiten, Entwässerung.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: Page,
});

function Page() {
  const { data: services } = useSuspenseQuery(q);
  return (
    <PageShell>
      <PageIntro
        eyebrow="Leistungen"
        title={
          <>
            Gärten, Wege und <span className="italic">Außenanlagen.</span>
          </>
        }
        lead="Von Erdarbeiten und Entwässerung bis zu Terrasse, Pflanzen und Zaun: Hier finden Sie die Leistungen für Ihr Vorhaben in Hattersheim und im Rhein-Main-Gebiet."
      />
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <ServiceCarousel services={services} />
        </div>
      </section>
    </PageShell>
  );
}
