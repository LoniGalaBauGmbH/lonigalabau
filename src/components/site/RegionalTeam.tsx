import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useSiteImages } from "@/hooks/useSiteImages";
import { TeamPhoto } from "./TeamPhoto";
import "./RegionalTeam.css";

export function RegionalTeam() {
  const titleId = useId();
  const { images } = useSiteImages();

  return (
    <section id="loni-team" className="regional-team" aria-labelledby={titleId}>
      <div className="regional-team-wrap">
        <figure className="regional-team-figure">
          <TeamPhoto
            src={images.about_hero_bg || "/images/projekte/loni-team-baustelle.webp"}
            sizes="(max-width: 800px) calc(100vw - 36px), (max-width: 1328px) 46vw, 600px"
            loading="lazy"
            className="regional-team-photo"
          />
        </figure>
        <div className="regional-team-copy">
          <span className="regional-team-kicker">Die Menschen hinter Loni GalaBau</span>
          <h2 id={titleId}>Menschen, die Ihr Vorhaben anpacken.</h2>
          <p>
            Sie haben eine Idee für Ihren Garten. Wir hören zu, fragen nach und besprechen, was auf
            Ihrem Grundstück sinnvoll ist. Gestaltung, Materialien und Leistungsumfang stimmen wir
            gemeinsam mit Ihnen ab.
          </p>
          <p>
            Auf der Baustelle setzt unser Team die besprochenen Arbeiten um. Im Büro laufen
            Koordination und Abstimmung zusammen. Seit 2011 sind wir im Garten- und Landschaftsbau
            tätig – heute für private, gewerbliche und öffentliche Auftraggeber in ganz Deutschland.
          </p>
          <div className="regional-team-location">
            <MapPin size={19} strokeWidth={1.6} aria-hidden="true" />
            <span>Unser Firmensitz: Hattersheim am Main bei Frankfurt.</span>
          </div>
          <div className="regional-team-actions">
            <a href="#rueckruf" className="regional-team-button">
              Rückruf anfragen <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <Link to="/ueber-uns" className="regional-team-link">
              Loni GalaBau kennenlernen <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
