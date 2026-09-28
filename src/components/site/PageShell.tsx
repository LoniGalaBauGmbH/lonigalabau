import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({
  children,
  transparentHeader = false,
}: {
  children: ReactNode;
  transparentHeader?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header transparent={transparentHeader} />
      <main className={transparentHeader ? "" : "pt-24 md:pt-28"}>{children}</main>
      <Footer />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="px-6">
      <div className="max-w-7xl mx-auto py-16 md:py-28">
        {eyebrow && <span className="eyebrow eyebrow-bracket text-accent">{eyebrow}</span>}
        <h1 className="display text-5xl md:text-7xl lg:text-8xl mt-6 max-w-5xl text-balance text-brand">
          {title}
        </h1>
        {lead && <p className="mt-8 text-lg md:text-xl max-w-2xl opacity-80 leading-relaxed font-serif italic font-light">{lead}</p>}
      </div>
    </section>
  );
}
