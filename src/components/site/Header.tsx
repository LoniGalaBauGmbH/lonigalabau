import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, Phone, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSiteImages } from "@/hooks/useSiteImages";
import "./Header.css";

const links = [
  { to: "/", label: "Startseite" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/leistungen", label: "Leistungen" },
  { to: "/projekte", label: "Projekte" },
  { to: "/konfigurator", label: "Gartenplaner" },
  { to: "/jobs", label: "Jobs" },
  { to: "/kontakt", label: "Kontakt" },
];

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { images } = useSiteImages();

  useEffect(() => {
    // Separate thresholds keep the header from flickering around one scroll position.
    let compact = false;
    const onScroll = () => {
      const next = compact ? window.scrollY > 24 : window.scrollY > 72;
      if (next !== compact) {
        compact = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  const onDark = transparent && !scrolled;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <header
        className="site-header"
        data-compact={scrolled}
        data-glass={!onDark || open}
        data-on-dark={onDark && !open}
      >
        <div className="site-header-glass" aria-hidden="true" />
        <div className="site-header-inner">
          <Link to="/" className="site-header-logo" aria-label="Loni Galabau – Startseite">
            <img src={images.logo} alt="Loni Galabau" width={140} height={40} />
          </Link>
          <nav className="site-desktop-nav" aria-label="Hauptnavigation">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="site-desktop-link"
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <DialogTrigger asChild>
            <button type="button" className="site-menu-trigger" aria-label="Menü öffnen">
              <span className="site-menu-glyph" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </DialogTrigger>
        </div>
      </header>

      <DialogPortal>
        <DialogOverlay className="site-menu-backdrop" />
        <DialogPrimitive.Content
          className="site-mobile-menu"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            closeButton.current?.focus();
          }}
        >
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <div className="site-mobile-menu-top">
            <Link to="/" onClick={() => setOpen(false)} aria-label="Loni Galabau – Startseite">
              <img src={images.logo} alt="Loni Galabau" width={140} height={40} />
            </Link>
            <DialogClose asChild>
              <button
                ref={closeButton}
                type="button"
                className="site-menu-close"
                aria-label="Menü schließen"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </DialogClose>
          </div>
          <div className="site-mobile-menu-body">
            <nav aria-label="Mobile Hauptnavigation" className="site-mobile-nav">
              {links.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="site-mobile-link"
                  style={{ "--link-order": index } as CSSProperties}
                  activeOptions={{ exact: link.to === "/" }}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight aria-hidden="true" className="site-mobile-link-arrow" />
                </Link>
              ))}
            </nav>
            <a className="site-mobile-contact" href="tel:+4961909266134">
              <span className="site-mobile-contact-icon">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-brand/60">Lieber kurz sprechen?</span>
                <span className="mt-1 block font-semibold">06190 9266134</span>
              </span>
            </a>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
