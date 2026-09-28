import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getJobs } from "@/lib/site.functions";

const q = queryOptions({ queryKey: ["jobs"], queryFn: () => getJobs() });

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Jobs – Loni Galabau GmbH" },
      { name: "description", content: "Offene Stellen bei Loni Galabau GmbH in Hattersheim am Main." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: Page,
});

function Page() {
  const { data: jobs } = useSuspenseQuery(q);
  return (
    <PageShell>
      <PageIntro
        eyebrow="Karriere"
        title={<>Werden Sie Teil unseres <span className="italic">Teams</span>.</>}
        lead="Wir suchen Menschen, die Handwerk lieben und sich aktiv an der Gestaltung außergewöhnlicher Außenanlagen beteiligen wollen."
      />
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {jobs.length === 0 && <p className="opacity-60">Aktuell sind keine Stellen ausgeschrieben.</p>}
          {jobs.map((j) => (
            <Link
              key={j.id}
              to="/jobs/$slug"
              params={{ slug: j.slug }}
              className="group block bg-surface rounded-3xl p-8 shadow-sm hover:shadow-xl transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl">{j.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-widest text-foreground/60">
                    {j.location && <span>{j.location}</span>}
                    {j.employment_type && <span>· {j.employment_type}</span>}
                  </div>
                </div>
                <span className="text-sm font-medium text-brand group-hover:text-accent">Jetzt bewerben →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
