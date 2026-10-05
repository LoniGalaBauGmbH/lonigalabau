import { useId, useState } from "react";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import "./RegionalMap.css";

/** Mount with key={city} when the location changes so activation stays page-specific. */
export function RegionalMap({ city }: { city: string }) {
  const id = useId();
  const [showMap, setShowMap] = useState(false);
  const query = encodeURIComponent(`${city}, Deutschland`);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://www.google.com/maps?q=${query}&z=13&output=embed&hl=de`;

  return (
    <section id="karte" className="regional-map" aria-labelledby={`${id}-title`}>
      <div className="regional-map-heading">
        <div>
          <span className="regional-map-kicker">Die Umgebung im Blick</span>
          <h2 id={`${id}-title`}>{city} auf der Karte</h2>
        </div>
        <p>
          Hier liegt Ihr Projektort. Unser Firmensitz ist Hattersheim am Main; wir gestalten
          Außenanlagen deutschlandweit.
        </p>
      </div>

      <div className="regional-map-frame" id={`${id}-frame`}>
        {showMap ? (
          <iframe
            src={embedUrl}
            title={`Google-Maps-Karte von ${city}, Deutschland`}
            width="100%"
            height="440"
            loading="lazy"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        ) : (
          <>
            <svg
              className="regional-map-pattern"
              viewBox="0 0 1200 440"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              focusable="false"
            >
              <rect width="1200" height="440" fill="var(--regional-map-land)" />
              <path
                d="M0 16 236 0 310 118 204 224 0 160ZM802 0H1200V147L1074 184 923 104ZM0 350 178 272 352 440H0ZM814 278 998 238 1200 348V440H918Z"
                fill="var(--regional-map-green)"
              />
              <path
                d="M0 206C152 178 229 356 394 340S654 93 807 137s193 161 393 78"
                fill="none"
                stroke="var(--regional-map-water)"
                strokeWidth="26"
              />
              <g fill="none" stroke="var(--regional-map-road)" strokeWidth="13">
                <path d="M112-30 406 470M399-30 674 470M821-30 1058 470" />
                <path d="M-40 103 1240 325M-40 366 1240 20" />
              </g>
              <g fill="none" stroke="var(--regional-map-road)" strokeWidth="5" opacity="0.85">
                <path d="M-20 20 1130 422M90 448 1000-15M290 0 534 440M700 0 905 440" />
                <path d="M0 283 1170 79M0 420 1170 192" />
              </g>
            </svg>
            <div className="regional-map-placeholder">
              <div className="regional-map-pin" aria-hidden="true">
                <MapPin size={28} strokeWidth={1.5} />
              </div>
              <span className="regional-map-city">{city}</span>
              <p>Entdecken Sie den Ort und seine Umgebung.</p>
              <button
                type="button"
                className="regional-map-load"
                aria-controls={`${id}-frame`}
                aria-describedby={`${id}-privacy`}
                onClick={() => setShowMap(true)}
              >
                Google-Maps-Karte anzeigen
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
              <p className="regional-map-privacy" id={`${id}-privacy`}>
                Mit dem Anzeigen stimmen Sie zu, dass Google Ihre IP-Adresse und Browserdaten erhält
                und Cookies verwenden kann.{" "}
                <Link to="/datenschutz" hash="google-maps">
                  Mehr zum Datenschutz
                </Link>
              </p>
            </div>
          </>
        )}
      </div>

      <div className="regional-map-footer">
        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          In Google Maps öffnen <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        {showMap && (
          <button type="button" onClick={() => setShowMap(false)}>
            <X size={15} aria-hidden="true" /> Karte ausblenden
          </button>
        )}
      </div>
    </section>
  );
}
