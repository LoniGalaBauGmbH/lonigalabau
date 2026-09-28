import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, ArrowUpRight } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { company } from "@/lib/company";

export function PageShell({
  children,
  transparentHeader = false,
}: {
  children: ReactNode;
  transparentHeader?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <a href="#inhalt" className="skip-link">
        Zum Inhalt
      </a>
      <Header transparent={transparentHeader} />
      <main id="inhalt" tabIndex={-1} className={transparentHeader ? "" : "pt-20 lg:pt-24"}>
        {children}
      </main>
      <Footer />
      <nav aria-label="Schneller Kontakt" className="mobile-contact lg:hidden">
        <a href={company.phoneHref}>
          <Phone size={18} /> Anrufen
        </a>
        <Link to="/kontakt" hash="formular">
          <span>Projekt anfragen</span>
          <ArrowUpRight size={18} />
        </Link>
      </nav>
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
    <section className="site-width pt-12 pb-12 md:pt-20 md:pb-16">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="home-heading mt-4 max-w-4xl">{title}</h1>
      {lead && <p className="mt-6 text-lg max-w-2xl text-foreground/75 leading-relaxed">{lead}</p>}
    </section>
  );
}
