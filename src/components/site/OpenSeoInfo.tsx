import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell, PageIntro } from "./PageShell";

export function OpenSeoInfo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageShell>
      <PageIntro eyebrow="Loni OpenSEO" title={title} />
      <div className="max-w-3xl mx-auto px-6 pb-24 text-base leading-relaxed [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:my-4 [&_a]:underline [&_a]:underline-offset-4 [&_li]:my-2 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
        <nav
          aria-label="OpenSEO Informationen"
          className="mt-12 border-t border-brand/15 pt-6 flex flex-wrap gap-5"
        >
          <Link to="/openseo">App-Informationen</Link>
          <Link to="/openseo/datenschutz">App-Datenschutz</Link>
          <Link to="/openseo/nutzung">Nutzungshinweise</Link>
          <Link to="/impressum">Impressum</Link>
        </nav>
        <p className="text-sm text-foreground/60">Stand: 30. September 2026</p>
      </div>
    </PageShell>
  );
}
