import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";
import { company } from "@/lib/company";

export function Footer() {
  const { images } = useSiteImages();
  return (
    <footer className="bg-brand text-brand-foreground pb-20 lg:pb-0">
      <div className="site-width py-14 md:py-20">
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-12 border-b border-white/20">
          <h2 className="text-white text-3xl md:text-4xl font-medium tracking-tight">
            Was haben Sie vor?
          </h2>
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-4 text-white text-lg underline underline-offset-8 decoration-white/40"
          >
            Sprechen wir darüber <ArrowUpRight size={22} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-12 text-sm leading-7">
          <div>
            <img
              src={images.logo_white}
              alt={company.name}
              width={210}
              height={54}
              className="w-52 h-auto brightness-0 invert mb-6"
            />
            <p className="text-white/70 max-w-xs">
              Garten- und Landschaftsbau
              <br />
              in Hattersheim und im Rhein-Main-Gebiet.
            </p>
          </div>
          <address className="not-italic">
            <p className="font-semibold mb-3">Kontakt</p>
            <p>
              {company.street}
              <br />
              {company.city}
            </p>
            <a className="block mt-3 hover:underline" href={company.phoneHref}>
              {company.phone}
            </a>
            <a className="hover:underline" href={`mailto:${company.email}`}>
              {company.email}
            </a>
            <p className="mt-3 text-white/70">{company.hours}</p>
          </address>
          <nav
            aria-label="Navigation im Fußbereich"
            className="grid grid-cols-2 gap-x-8 content-start"
          >
            <Link to="/leistungen">Leistungen</Link>
            <Link to="/ueber-uns">Über uns</Link>
            <Link to="/projekte">Projekte</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/konfigurator">Gartenplaner</Link>
            <Link to="/kontakt">Kontakt</Link>
          </nav>
        </div>
        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-5 text-xs text-white/65">
          <p>
            © {new Date().getFullYear()} {company.name}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutz</Link>
            <Link to="/agb">AGB</Link>
            <button onClick={() => window.dispatchEvent(new Event("loni:open-cookies"))}>
              Cookie-Einstellungen
            </button>
            <Link to="/login">Verwaltung</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
