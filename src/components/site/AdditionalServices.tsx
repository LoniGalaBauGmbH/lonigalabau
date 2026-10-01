import { Link } from "@tanstack/react-router";

export function AdditionalServices() {
  return (
    <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-brand/15 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
      <div className="max-w-2xl">
        <h3 className="font-display text-xl font-bold text-brand">
          Weitere Leistungen auf Anfrage
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          Die gezeigten Leistungen sind ein Einblick in unser Angebot. Ihr Vorhaben ist nicht dabei?
          Beschreiben Sie uns die gewünschten Arbeiten und den Projektort. Wir klären mit Ihnen,
          welche Leistungen wir übernehmen können – deutschlandweit.
        </p>
      </div>
      <Link
        to="/kontakt"
        className="shrink-0 rounded-full bg-brand px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        Weitere Arbeiten anfragen
      </Link>
    </div>
  );
}
