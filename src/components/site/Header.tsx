import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowRight, ArrowUpRight, ChevronDown, Phone, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSiteImages } from "@/hooks/useSiteImages";
import { getServiceImage } from "@/lib/service-images";
import { ProjectImage } from "./ProjectImage";
import { HomeLogoLink } from "./HomeLogoLink";
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

const services = [
  {
    slug: "gartengestaltung",
    title: "Gartengestaltung",
    detail: "Vom ersten Plan zum Lieblingsplatz",
  },
  { slug: "natursteinarbeiten", title: "Natursteinarbeiten", detail: "Mauern, Stufen & Charakter" },
  { slug: "pflasterarbeiten", title: "Pflasterarbeiten", detail: "Wege, Einfahrten & Terrassen" },
  { slug: "rasenanlagen", title: "Rasenanlagen", detail: "Platz zum Leben im Grünen" },
  { slug: "zaunarbeiten", title: "Zaunarbeiten", detail: "Sichtschutz & klare Grenzen" },
  {
    slug: "bewaesserungsanlagen",
    title: "Bewässerungsanlagen",
    detail: "Wasser genau dort, wo es fehlt",
  },
  { slug: "erdarbeiten", title: "Erdarbeiten", detail: "Die Basis für Ihr Vorhaben" },
  { slug: "entwaesserung", title: "Entwässerung", detail: "Regenwasser sinnvoll ableiten" },
];

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState("");
  const [mobileServices, setMobileServices] = useState(false);
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

  useEffect(() => {
    setOpen(false);
    setDesktopMenu("");
    setMobileServices(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
      else setDesktopMenu("");
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
        data-glass={!onDark || open || !!desktopMenu}
        data-on-dark={onDark && !open && !desktopMenu}
      >
        <div className="site-header-glass" aria-hidden="true" />
        <div className="site-header-inner">
          <HomeLogoLink
            className="site-header-logo"
            onNavigate={() => {
              setOpen(false);
              setDesktopMenu("");
            }}
          >
            <img
              src={images.logo}
              alt="Loni Galabau"
              width={140}
              height={40}
              fetchPriority="high"
            />
          </HomeLogoLink>
          <NavigationMenu.Root
            className="site-desktop-nav"
            aria-label="Hauptnavigation"
            value={desktopMenu}
            onValueChange={setDesktopMenu}
            delayDuration={160}
          >
            <NavigationMenu.List className="site-desktop-list">
              {links.map((link) =>
                link.to === "/leistungen" ? (
                  <NavigationMenu.Item key={link.to} value="services">
                    <NavigationMenu.Trigger
                      className="site-desktop-link site-services-trigger"
                      data-active={pathname.startsWith("/leistungen")}
                    >
                      Leistungen <ChevronDown className="size-3.5" aria-hidden="true" />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="site-mega-menu">
                      <div className="site-mega-layout">
                        <NavigationMenu.Link asChild>
                          <Link to="/konfigurator" className="site-mega-feature">
                            <ProjectImage
                              src={getServiceImage("gartengestaltung")}
                              alt="Garten mit Rasen und Terrassen"
                              sizes="320px"
                            />
                            <span className="site-mega-feature-copy">
                              <span className="site-mega-eyebrow">Gemeinsam draußen gestalten</span>
                              <strong>
                                Ihr Garten.
                                <br />
                                Viele Möglichkeiten.
                              </strong>
                              <span className="site-mega-feature-cta">
                                Projekt planen <ArrowUpRight size={18} aria-hidden="true" />
                              </span>
                            </span>
                          </Link>
                        </NavigationMenu.Link>
                        <div className="site-mega-services">
                          <div className="site-mega-topline">
                            <span className="site-mega-eyebrow">Unsere Leistungen</span>
                            <NavigationMenu.Link asChild>
                              <Link to="/leistungen">
                                Alle ansehen <ArrowRight size={15} aria-hidden="true" />
                              </Link>
                            </NavigationMenu.Link>
                          </div>
                          <div className="site-mega-grid">
                            {services.map((service) => (
                              <NavigationMenu.Link asChild key={service.slug}>
                                <Link
                                  to="/leistungen/$slug"
                                  params={{ slug: service.slug }}
                                  className="site-mega-service"
                                  activeOptions={{ exact: true }}
                                >
                                  <ProjectImage
                                    src={getServiceImage(service.slug)}
                                    alt=""
                                    sizes="64px"
                                    loading="lazy"
                                  />
                                  <span>
                                    <strong>{service.title}</strong>
                                    <small>{service.detail}</small>
                                  </span>
                                  <ArrowUpRight size={16} aria-hidden="true" />
                                </Link>
                              </NavigationMenu.Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="site-mega-footer">
                        <span>Noch nicht sicher, was Ihr Garten braucht?</span>
                        <NavigationMenu.Link asChild>
                          <Link to="/kontakt">
                            Wir beraten Sie persönlich <ArrowUpRight size={16} aria-hidden="true" />
                          </Link>
                        </NavigationMenu.Link>
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : (
                  <NavigationMenu.Item key={link.to}>
                    <NavigationMenu.Link asChild>
                      <Link
                        to={link.to}
                        className={
                          "site-desktop-link" + (link.to === "/kontakt" ? " site-nav-contact" : "")
                        }
                        activeOptions={{ exact: link.to === "/" }}
                      >
                        {link.label}
                        {link.to === "/kontakt" && <ArrowUpRight size={14} aria-hidden="true" />}
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ),
              )}
            </NavigationMenu.List>
          </NavigationMenu.Root>
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
            <HomeLogoLink onNavigate={() => setOpen(false)}>
              <img
                src={images.logo}
                alt="Loni Galabau"
                width={140}
                height={40}
                fetchPriority="high"
              />
            </HomeLogoLink>
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
              {links.map((link, index) =>
                link.to === "/leistungen" ? (
                  <div key={link.to}>
                    <button
                      type="button"
                      className="site-mobile-link site-mobile-services-toggle"
                      style={{ "--link-order": index } as CSSProperties}
                      aria-expanded={mobileServices}
                      aria-controls="mobile-service-links"
                      onClick={() => setMobileServices((value) => !value)}
                    >
                      <span>Leistungen</span>
                      <ChevronDown size={22} aria-hidden="true" />
                    </button>
                    <div
                      id="mobile-service-links"
                      className="site-mobile-services"
                      data-open={mobileServices}
                      aria-hidden={!mobileServices}
                      inert={!mobileServices}
                    >
                      <div>
                        <div className="site-mobile-services-inner">
                          {services.map((service) => (
                            <Link
                              key={service.slug}
                              to="/leistungen/$slug"
                              params={{ slug: service.slug }}
                              onClick={() => setOpen(false)}
                            >
                              <ProjectImage
                                src={getServiceImage(service.slug)}
                                alt=""
                                sizes="40px"
                                loading="lazy"
                              />
                              <span>{service.title}</span>
                              <ArrowUpRight size={15} aria-hidden="true" />
                            </Link>
                          ))}
                          <Link
                            to="/leistungen"
                            onClick={() => setOpen(false)}
                            className="site-mobile-all"
                          >
                            Alle Leistungen ansehen <ArrowRight size={16} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
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
                ),
              )}
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
