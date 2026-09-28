import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getProjects } from "@/lib/site.functions";
import projectFallback from "@/assets/project-villa.jpg";

const q = queryOptions({ queryKey: ["projects"], queryFn: () => getProjects() });

export const Route = createFileRoute("/projekte")({
  head: () => ({
    meta: [
      { title: "Projekte – Loni Galabau GmbH" },
      { name: "description", content: "Eine Auswahl realisierter Gärten und Außenanlagen." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: Page,
});

function Page() {
  const { data: projects } = useSuspenseQuery(q);
  return (
    <PageShell>
      <PageIntro
        eyebrow="Referenzen"
        title={<>Unsere neuesten <span className="italic">Projekte</span>.</>}
        lead="Ein Einblick in unsere tägliche Arbeit – von privaten Rückzugsorten bis hin zu repräsentativen Gewerbeobjekten."
      />
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {projects.length === 0 && <p className="opacity-60">Aktuell sind keine Projekte hinterlegt.</p>}
          {projects.map((p) => (
            <article key={p.id} className="bg-surface rounded-[2rem] overflow-hidden border border-brand/5 shadow-sm">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.images?.[0] || projectFallback} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                {p.location && <span className="text-xs uppercase tracking-widest text-accent font-bold">{p.location}</span>}
                <h3 className="font-serif text-3xl mt-2">{p.title}</h3>
                <p className="mt-3 opacity-80 leading-relaxed">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
