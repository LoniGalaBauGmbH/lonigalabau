import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";

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
  const { images } = useSiteImages();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = transparent && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-brand/10"
          : transparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur border-b border-brand/10"
      }`}
    >
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 flex items-center justify-between py-5 md:py-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={images.logo}
            alt="Loni Galabau"
            width={140}
            height={40}
            className={`h-9 md:h-10 w-auto transition ${onDark ? "brightness-0 invert" : ""}`}
          />
        </Link>

        <nav
          className={`hidden lg:flex items-center gap-9 text-[0.78rem] tracking-[0.18em] uppercase font-semibold ${
            onDark ? "text-white/85" : "text-foreground/80"
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative pb-1 hover:opacity-100 transition-opacity"
              activeProps={{
                className: `relative pb-1 ${onDark ? "text-white" : "text-brand"} after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-current`,
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden p-2 -mr-2 ${onDark ? "text-white" : "text-brand"}`}
          aria-label="Menü"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-brand/10 px-6 py-6 flex flex-col gap-4 text-sm uppercase tracking-[0.18em] font-semibold">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-1 text-foreground/80 hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
