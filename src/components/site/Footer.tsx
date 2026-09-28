import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/site.functions";
import { useSiteImages } from "@/hooks/useSiteImages";
import logoVerband from "@/assets/logo-gartenverband.svg";

const services: [string, string][] = [
  ["natursteinarbeiten", "Natursteinarbeiten"],
  ["gartengestaltung", "Gartengestaltung"],
  ["pflasterarbeiten", "Pflasterarbeiten"],
  ["bewaesserungsanlagen", "Bewässerungsanlagen"],
  ["zaunarbeiten", "Zaunarbeiten"],
  ["rasenanlagen", "Rasenanlagen"],
  ["erdarbeiten", "Erdarbeiten"],
  ["entwaesserung", "Entwässerung"],
];

const navLinks: [string, string][] = [
  ["/", "Startseite"],
  ["/ueber-uns", "Über uns"],
  ["/leistungen", "Leistungen"],
  ["/projekte", "Projekte"],
  ["/konfigurator", "Gartenplaner"],
  ["/jobs", "Jobs"],
  ["/kontakt", "Kontakt"],
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const subscribe = useServerFn(subscribeNewsletter);
  const { images } = useSiteImages();

  return (
    <footer className="bg-brand text-brand-foreground mt-24">
      {/* Top CTA bar */}
      <div className="border-b border-brand-foreground/10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="eyebrow opacity-60">Kontakt</span>
            <h3 className="font-display uppercase tracking-tight text-2xl md:text-3xl mt-2">
              Bereit für Ihr Gartenprojekt?
            </h3>
          </div>
          <Link
            to="/kontakt"
            onClick={(e) => {
              if (typeof window !== "undefined") {
                e.preventDefault();
                window.dispatchEvent(new Event("loni:open-inquiry"));
              }
            }}
            className="group inline-flex items-center gap-3 bg-accent text-brand px-7 py-3.5 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-brand-foreground transition-colors"
          >
            Anfrage stellen
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-4 space-y-8">
            <img src={images.logo_white} alt="Loni Galabau GmbH" className="h-14 w-auto" />
            <p className="text-sm leading-relaxed opacity-70 max-w-sm">
              Garten- und Landschaftsbau aus Hattersheim. Seit Jahren stehen wir für
              Präzision, ehrliches Handwerk und Gärten, die Bestand haben.
            </p>
            <address className="not-italic text-sm space-y-1 opacity-80">
              <p>Loni Galabau GmbH</p>
              <p>Auf der Roos 3</p>
              <p>65795 Hattersheim am Main</p>
              <div className="pt-2 space-y-1">
                <a href="tel:+4961909266134" className="block hover:text-accent transition-colors">
                  T &nbsp;06190 9266134
                </a>
                <a href="mailto:info@loni-galabau.de" className="block hover:text-accent transition-colors">
                  E &nbsp;info@loni-galabau.de
                </a>
              </div>
            </address>
          </div>

          {/* Sitemap */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="uppercase tracking-[0.2em] text-[11px] opacity-50 font-semibold">
              Navigation
            </h5>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="uppercase tracking-[0.2em] text-[11px] opacity-50 font-semibold">
              Leistungen
            </h5>
            <ul className="space-y-2.5 text-sm">
              {services.map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    to="/leistungen/$slug"
                    params={{ slug }}
                    className="opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + verband */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h5 className="uppercase tracking-[0.2em] text-[11px] opacity-50 font-semibold mb-4">
                Newsletter
              </h5>
              <p className="text-xs opacity-70 mb-3 leading-relaxed">
                Aktuelle Projekte und saisonale Tipps direkt in Ihr Postfach.
              </p>
              <form
                className="flex flex-col gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setStatus("idle");
                  try {
                    await subscribe({ data: { email } });
                    setStatus("ok");
                    setEmail("");
                  } catch {
                    setStatus("err");
                  }
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                  className="bg-transparent border-b border-brand-foreground/30 px-0 py-2.5 text-sm placeholder:opacity-40 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="self-start mt-2 text-[11px] uppercase tracking-[0.2em] font-semibold border-b border-accent pb-1 text-accent hover:text-brand-foreground hover:border-brand-foreground transition-colors"
                >
                  Abonnieren →
                </button>
              </form>
              {status === "ok" && <p className="text-xs text-accent mt-2">Danke für Ihre Anmeldung.</p>}
              {status === "err" && <p className="text-xs text-red-300 mt-2">Anmeldung fehlgeschlagen.</p>}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-brand-foreground/10">
              <div className="bg-brand-foreground rounded-md p-1.5 shrink-0">
                <img src={logoVerband} alt="Fachverband Garten-, Landschafts- und Sportplatzbau" className="h-10 w-auto" />
              </div>
              <p className="text-[11px] opacity-60 leading-snug">
                Mitglied im Fachverband<br />
                Garten-, Landschafts- und<br />
                Sportplatzbau Hessen-Thüringen
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom legal bar */}
      <div className="border-t border-brand-foreground/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-[11px] uppercase tracking-[0.2em] opacity-50">
          <p>© {new Date().getFullYear()} Loni Galabau GmbH · Alle Rechte vorbehalten</p>
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
            <Link to="/impressum" className="hover:opacity-100 hover:text-accent transition">Impressum</Link>
            <Link to="/datenschutz" className="hover:opacity-100 hover:text-accent transition">Datenschutz</Link>
            <Link to="/agb" className="hover:opacity-100 hover:text-accent transition">AGB</Link>
            <button
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new Event("loni:open-cookies"))}
              className="hover:opacity-100 hover:text-accent transition uppercase tracking-[0.2em]"
            >
              Cookies
            </button>
            <Link to="/login" className="hover:opacity-100 hover:text-accent transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
