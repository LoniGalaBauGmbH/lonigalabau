import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function ProjectOfferLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact ? "mt-7 border-t border-brand/15 pt-6" : "mt-10 rounded-3xl bg-surface p-6 md:p-9"
      }
    >
      <h3 className="font-display text-xl font-bold text-brand">Eine konkrete Fläche im Blick?</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
        Neue Terrasse oder Einfahrt: Hier finden Sie die passenden Entscheidungen, den Ablauf und
        eine direkte Anfrage für Ihr Vorhaben.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
        <Link
          to="/terrasse-bauen-lassen"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
        >
          Terrasse bauen lassen <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <Link
          to="/einfahrt-pflastern-lassen"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
        >
          Einfahrt pflastern lassen <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
