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
      { name: "description", content: "Unsere Leistungen: Natursteinarbeiten, Gartengestaltung, Pflasterarbeiten, Bewässerung, Zäune, Rasen, Erdarbeiten, Entwässerung." },
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
        title={<>Wir sind in jeder Hinsicht <span className="italic">anders</span>.</>}
        lead="Vom Naturstein bis zur smarten Bewässerung – wir gestalten den perfekten Gartenraum, individuell angepasst an Ihren Lebensstil."
      />
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <ServiceCarousel services={services} />
        </div>
      </section>
    </PageShell>
  );
}
