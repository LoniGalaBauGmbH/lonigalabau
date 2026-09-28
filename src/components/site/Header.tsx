import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";

const links = [
  { to: "/leistungen", label: "Leistungen" },
  { to: "/projekte", label: "Projekte" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/konfigurator", label: "Gartenplaner" },
  { to: "/jobs", label: "Jobs" },
  { to: "/kontakt", label: "Kontakt" },
];
export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const { images } = useSiteImages();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const onDark = transparent && !scrolled && !open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${onDark ? "bg-transparent border-white/20 text-white" : "bg-background border-brand/15 text-brand"}`}
    >
      <div className="site-width flex items-center justify-between h-20 lg:h-24 gap-6">
        <Link to="/" aria-label="Loni GalaBau – Startseite" onClick={() => setOpen(false)}>
          <img
            src={images.logo}
            alt="Loni GalaBau GmbH"
            width={200}
            height={39}
            className={`w-40 lg:w-48 h-auto ${onDark ? "brightness-0 invert" : ""}`}
          />
        </Link>
        <nav
          aria-label="Hauptnavigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-3 hover:underline underline-offset-8"
              activeProps={{ className: "underline underline-offset-8" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden p-3 -mr-3"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile Navigation"
          className="lg:hidden site-width border-t border-brand/15 py-5 flex flex-col max-h-[calc(100dvh-9rem)] overflow-auto"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="py-3 text-lg"
              activeProps={{ className: "underline underline-offset-4" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
