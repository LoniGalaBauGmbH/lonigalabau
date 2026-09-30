import { useRef, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import "./Motion.css";
import { useScrollChoreography } from "@/hooks/useScrollChoreography";

export function PageShell({
  children,
  transparentHeader = false,
}: {
  children: ReactNode;
  transparentHeader?: boolean;
}) {
  const mainRef = useRef<HTMLElement>(null);
  const path = useLocation({ select: (location) => location.pathname });
  useScrollChoreography(mainRef, path);
  return (
    <div className="site-ui min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:text-brand focus:p-4 focus:rounded-lg"
      >
        Zum Inhalt springen
      </a>
      <Header transparent={transparentHeader} />
      <main
        id="main-content"
        tabIndex={-1}
        ref={mainRef}
        className={transparentHeader ? "" : "pt-24 md:pt-28"}
      >
        {children}
      </main>
      <Footer showContactCta={path !== "/kontakt"} />
      <WhatsAppButton />
    </div>
  );
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div data-reveal="block" data-reveal-delay={delay}>
      {children}
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
        <h1
          lang="de"
          className="display break-words hyphens-auto text-5xl md:text-7xl lg:text-8xl mt-6 max-w-5xl text-balance text-brand"
        >
          {title}
        </h1>
        {lead && (
          <p className="mt-8 text-lg md:text-xl max-w-2xl opacity-80 leading-relaxed font-serif italic font-light">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
