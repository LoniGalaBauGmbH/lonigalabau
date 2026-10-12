import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { guides, type GuideSummary } from "@/lib/guide-index";

const featuredGuides = [
  "garten-umgestalten-in-etappen",
  "pflasterarbeiten-kosten-einfahrt",
  "naturstein-terrasse-materialwahl",
]
  .map((slug) => guides.find((article) => article.slug === slug))
  .filter((article): article is GuideSummary => Boolean(article));

export function GuideEntryLinks() {
  return (
    <section aria-labelledby="home-guide-entry-heading" className="px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-bracket text-brand">Ratgeber</span>
            <h2
              id="home-guide-entry-heading"
              lang="de"
              className="display mt-5 break-words text-[clamp(2rem,4vw,3.5rem)] text-brand hyphens-auto"
            >
              Gute Entscheidungen vor dem ersten Spatenstich.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75">
              Den Garten schrittweise umgestalten, Pflasterangebote vergleichen oder Naturstein
              auswählen: Unsere Ratgeber helfen Ihnen, Ihr Vorhaben vorzubereiten und die richtigen
              Fragen für die Beratung zu stellen.
            </p>
          </div>
          <Link
            to="/ratgeber"
            className="inline-flex w-fit shrink-0 items-center gap-2 border-b border-brand/40 pb-1 text-sm font-semibold tracking-[0.15em] text-brand uppercase transition hover:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            Alle Ratgeber <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:mt-10 lg:grid-cols-3">
          {featuredGuides.map((article) => (
            <article key={article.slug} className="min-w-0">
              <Link
                to="/ratgeber/$slug"
                params={{ slug: article.slug }}
                className="group flex h-full flex-col rounded-2xl border border-brand/15 bg-surface p-6 transition-colors hover:border-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:p-8"
              >
                <p className="text-xs font-semibold tracking-wide text-brand-muted">
                  {article.category} · {article.readingMinutes} Min. Lesezeit
                </p>
                <h3 className="mt-4 font-display text-xl leading-snug font-bold text-brand md:text-2xl">
                  {article.title}
                </h3>
                <p className="mt-4 mb-6 text-sm leading-relaxed text-foreground/80">
                  {article.excerpt}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Ratgeber lesen
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-brand/15 bg-surface p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="eyebrow text-brand/75">Regenwasser nutzen</p>
            <h3 className="mt-3 font-display text-xl font-bold text-brand">
              Eine Zisterne für Ihren Garten?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              Erfahren Sie, worauf es bei Speicher, Einbau und Nachrüstung ankommt – und besprechen
              Sie Ihr Vorhaben direkt mit uns.
            </p>
          </div>
          <Link
            to="/zisterne-einbauen-lassen"
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
          >
            Zisternen-Einbau kennenlernen <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
