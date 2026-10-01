import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getServices } from "@/lib/site.functions";
import { ServiceCarousel } from "@/components/site/ServiceCarousel";

const q = queryOptions({ staleTime: 60_000, queryKey: ["services"], queryFn: () => getServices() });

export const Route = createFileRoute("/leistungen/")({
  head: () => ({
    meta: [
      { title: "Gartenbau-Leistungen deutschlandweit | Loni GalaBau" },
      {
        name: "description",
        content:
          "Gartengestaltung, Pflasterarbeiten, Naturstein, Zaunbau und Rollrasen: Entdecken Sie unsere Gartenbau-Leistungen in ganz Deutschland.",
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
            Gartenbau für Ihre <span className="italic">Außenanlage.</span>
          </>
        }
        lead="Von Erdarbeiten und Entwässerung bis zu Terrasse, Pflanzen und Zaun: Hier finden Sie die Leistungen für Ihr Vorhaben in ganz Deutschland."
      />
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <ServiceCarousel services={services} headingLevel="h2" />
        </div>
      </section>
    </PageShell>
  );
}
