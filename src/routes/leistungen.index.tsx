import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getServices } from "@/lib/site.functions";
import { getServiceImage } from "@/lib/service-images";

const q = queryOptions({ queryKey: ["services"], queryFn: () => getServices() });
export const Route = createFileRoute("/leistungen/")({
  head: () => ({
    meta: [
      { title: "Leistungen | Loni GalaBau GmbH" },
      {
        name: "description",
        content:
          "Pflaster, Naturstein, Gärten, Bewässerung, Zäune, Rasen, Erdarbeiten und Entwässerung in Hattersheim und Umgebung.",
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
        title="Arbeiten rund ums Grundstück."
        lead="Eine neue Terrasse, ein befestigter Hof oder ein Garten, der besser zu Ihnen passt. Hier finden Sie unsere Leistungen."
      />
      <section className="site-width pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {services.map((service) => (
          <Link
            key={service.id}
            to="/leistungen/$slug"
            params={{ slug: service.slug }}
            className="service-preview group"
          >
            <img
              src={getServiceImage(service.slug, service.hero_image)}
              alt={service.title}
              loading="lazy"
              width={768}
              height={576}
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="flex justify-between gap-4 mt-5">
              <h2 className="text-xl font-semibold">{service.title}</h2>
              <ArrowUpRight size={20} className="shrink-0 mt-1" />
            </div>
            <p>{service.short_text}</p>
            <span className="text-link mt-5">Leistung ansehen</span>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
