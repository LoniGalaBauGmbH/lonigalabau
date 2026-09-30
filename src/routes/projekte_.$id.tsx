import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { ProjectImage } from "@/components/site/ProjectImage";
import { getProjectById } from "@/lib/site.functions";
import { canonicalUrl, safeJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/projekte_/$id")({
  staleTime: 60_000,
  preloadStaleTime: 60_000,
  loader: async ({ params }) => {
    if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw notFound();
    const project = await getProjectById({ data: { id: params.id } });
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title || "Referenzen"} – Loni GalaBau` },
      {
        name: "description",
        content:
          loaderData?.description || "Einblicke in unsere Arbeit im Garten- und Landschaftsbau.",
      },
      ...(loaderData?.images?.[0]
        ? [
            {
              property: "og:image",
              content: new URL(loaderData.images[0], canonicalUrl("/")).href,
            },
            {
              name: "twitter:image",
              content: new URL(loaderData.images[0], canonicalUrl("/")).href,
            },
          ]
        : []),
    ],
  }),
  component: Page,
});

function Page() {
  const project = Route.useLoaderData();
  const service = project.services?.active ? project.services : null;
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Startseite", item: canonicalUrl("/") },
              {
                "@type": "ListItem",
                position: 2,
                name: "Projekte",
                item: canonicalUrl("/projekte"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: project.title,
                item: canonicalUrl("/projekte/" + project.id),
              },
            ],
          }),
        }}
      />
      <PageIntro
        eyebrow="Einblicke in unsere Arbeit"
        title={project.title}
        lead={project.description}
      />
      <section className="px-6 md:px-10 pb-16 md:pb-24 max-w-[1480px] mx-auto">
        <div className="flex flex-wrap justify-between gap-4 mb-10 text-sm text-brand">
          <Link to="/projekte" className="underline underline-offset-4">
            ← Alle Projektgalerien
          </Link>
          {service && (
            <Link
              to="/leistungen/$slug"
              params={{ slug: service.slug }}
              className="underline underline-offset-4"
            >
              Zur Leistung: {service.title} →
            </Link>
          )}
        </div>
        {project.location && <p className="mb-6 text-brand">{project.location}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {project.images?.map((src, i) => (
            <figure key={src} className="min-w-0">
              <ProjectGallery project={project} initialIndex={i}>
                <button
                  type="button"
                  aria-label={`${project.title}: Aufnahme ${i + 1} vergrößern`}
                  className="block w-full overflow-hidden rounded-3xl bg-surface focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand"
                >
                  <ProjectImage
                    src={src}
                    alt={`${project.title} – Aufnahme ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              </ProjectGallery>
              <figcaption className="mt-3 text-sm text-brand/80">
                {project.title} · Aufnahme {i + 1}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-14 rounded-3xl bg-brand p-8 md:p-12 text-brand-foreground">
          <h2 className="font-serif text-3xl">Was passt zu Ihrem Garten?</h2>
          <p className="mt-4 max-w-2xl">
            Die Bilder zeigen Gestaltungen und Ausführungsdetails aus unseren Arbeiten. Für Ihr
            Angebot klären wir Maße, vorhandenen Aufbau, Materialien und Zugang zum Grundstück
            individuell.
          </p>
          <Link
            to="/konfigurator"
            className="inline-flex mt-6 rounded-full bg-accent px-6 py-3 text-brand font-semibold"
          >
            Eigenes Vorhaben planen →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
