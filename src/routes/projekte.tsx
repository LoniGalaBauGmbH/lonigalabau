import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getProjects } from "@/lib/site.functions";
import projectFallback from "@/assets/project-villa.jpg";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { ArrowUpRight } from "lucide-react";
import { ProjectImage } from "@/components/site/ProjectImage";

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
        title={<>Unsere Arbeit. <span className="italic">In Bildern.</span></>}
        lead="Eigene Aufnahmen aus unseren Projekten – nach Leistungen zusammengestellt. Entdecken Sie fertige Anlagen, Materialien und Einblicke in die Ausführung."
      />
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {projects.length === 0 && <p className="opacity-60">Aktuell sind keine Projekte hinterlegt.</p>}
          {projects.map((p) => (
            <article key={p.id} className="bg-surface rounded-[2rem] overflow-hidden shadow-sm">
              <ProjectGallery project={p}>
                <button type="button" aria-label={p.title + " – Bilder ansehen"} className="group relative block aspect-[4/3] w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-accent">
                  <ProjectImage src={p.images?.[0] || projectFallback} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none" />
                  <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-brand/90 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm group-hover:bg-brand">Galerie ansehen <ArrowUpRight className="size-4" aria-hidden="true" /></span>
                </button>
              </ProjectGallery>
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
