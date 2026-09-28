import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getProjects } from "@/lib/site.functions";
const q = queryOptions({ queryKey: ["projects"], queryFn: () => getProjects() });
export const Route = createFileRoute("/projekte")({
  head: () => ({
    meta: [
      { title: "Projekte | Loni GalaBau GmbH" },
      {
        name: "description",
        content: "Einblicke in Garten- und Landschaftsbauprojekte von Loni GalaBau.",
      },
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
        eyebrow="Projekte"
        title="Gärten und Außenanlagen."
        lead="Hier stellen wir ausgewählte Vorhaben und die dazugehörigen Arbeiten vor."
      />
      <section className="site-width pb-24 grid md:grid-cols-2 gap-12 items-start">
        {projects.length === 0 && <p>Weitere Einblicke in unsere Arbeit folgen.</p>}
        {projects.map((project) => (
          <article key={project.id} className="border-t border-brand/20 pt-6">
            {project.images?.[0] && (
              <a
                href={project.images[0]}
                target="_blank"
                rel="noreferrer"
                aria-label={`Projektfoto von ${project.title} vergrößern`}
              >
                <img
                  src={project.images[0]}
                  alt={project.title}
                  loading="lazy"
                  width={768}
                  height={576}
                  className="w-full aspect-[4/3] object-cover mb-6"
                />
              </a>
            )}
            {project.location && <p className="eyebrow">{project.location}</p>}
            <h2 className="text-2xl mt-3">{project.title}</h2>
            <p className="mt-4 leading-relaxed text-foreground/75">{project.description}</p>
            {project.images?.length > 1 && (
              <details className="mt-6">
                <summary className="text-link cursor-pointer">Weitere Projektfotos</summary>
                <div className="grid grid-cols-2 gap-4 mt-5">
                  {project.images.slice(1).map((src, index) => (
                    <a key={src} href={src} target="_blank" rel="noreferrer">
                      <img
                        src={src}
                        alt={`${project.title} – Ansicht ${index + 2}`}
                        loading="lazy"
                        className="w-full aspect-square object-cover"
                      />
                    </a>
                  ))}
                </div>
              </details>
            )}
          </article>
        ))}
      </section>
    </PageShell>
  );
}
