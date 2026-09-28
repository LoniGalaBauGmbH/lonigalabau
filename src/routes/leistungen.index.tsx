import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { getServices } from "@/lib/site.functions";
import { getServiceImage } from "@/lib/service-images";

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
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const img = getServiceImage(s.slug, s.hero_image);
            const num = String(i + 1).padStart(2, "0");
            return (
              <Link
                key={s.id}
                to="/leistungen/$slug"
                params={{ slug: s.slug }}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[2rem] bg-brand text-brand-foreground isolate"
              >
                {/* Background image with zoom on hover */}
                <img
                  src={img}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                {/* Permanent bottom-up gradient for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/30 to-transparent" />

                {/* Top meta row */}
                <div className="absolute top-0 inset-x-0 p-6 flex items-start justify-between text-brand-foreground">
                  <span className="font-display text-xs tracking-[0.25em] opacity-80">— {num}</span>
                  {s.category && (
                    <span className="text-[10px] uppercase tracking-[0.25em] bg-brand-foreground/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-foreground/20">
                      {s.category}
                    </span>
                  )}
                </div>

                {/* Sliding content panel */}
                <div className="absolute inset-x-0 bottom-0 p-7 pt-14">
                  {/* Title — slides up slightly on hover */}
                  <h3 className="display md:text-xs leading-[0.95] text-brand-foreground transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 line-clamp-2 text-sm">
                    {s.title}
                  </h3>

                  {/* Reveal panel — slides up from below on hover */}
                  <div className="overflow-hidden">
                    <div className="max-h-0 opacity-0 translate-y-4 group-hover:max-h-36 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <p className="text-sm leading-relaxed opacity-90 mt-4 line-clamp-2">
                        {s.short_text}
                      </p>
                    </div>
                  </div>

                  {/* CTA arrow row */}
                  <div className="mt-5 flex items-center justify-between border-t border-brand-foreground/20 pt-4">
                    <span className="text-[11px] uppercase tracking-[0.25em] font-semibold opacity-80 group-hover:text-accent transition-colors">
                      Mehr erfahren
                    </span>
                    <span className="relative w-10 h-10 rounded-full border border-brand-foreground/30 flex items-center justify-center overflow-hidden">
                      <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      <span className="relative text-brand-foreground group-hover:text-brand transition-colors duration-500">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
