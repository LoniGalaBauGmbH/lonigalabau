import { useId } from "react";
import { germanyOutline } from "./germany-outline";
import "./GermanyNetworkMap.css";

// A shared, north-up projection keeps pins aligned with the simplified outline.
const project = (longitude: number, latitude: number) => ({
  x: 68 + (longitude - 5.87) * 43,
  y: 24 + (55.05 - latitude) * 68,
});

const cities = [
  {
    id: "hattersheim",
    longitude: 8.4854,
    latitude: 50.0696,
    home: true,
  },
  {
    id: "heidelberg",
    longitude: 8.6724,
    latitude: 49.3988,
  },
  {
    id: "mannheim",
    longitude: 8.466,
    latitude: 49.4875,
  },
  {
    id: "hanau",
    longitude: 8.9167,
    latitude: 50.1264,
  },
  {
    id: "friedrichsdorf",
    longitude: 8.6437,
    latitude: 50.2542,
    compact: true,
    offsetX: 1.5,
    offsetY: -2,
  },
  {
    id: "bad-homburg",
    longitude: 8.6178,
    latitude: 50.2268,
    compact: true,
    offsetX: -1.5,
    offsetY: 2,
  },
  {
    id: "koblenz",
    longitude: 7.5889,
    latitude: 50.3569,
  },
  {
    id: "stuttgart",
    longitude: 9.1829,
    latitude: 48.7758,
  },
  {
    id: "muenchen",
    longitude: 11.582,
    latitude: 48.1351,
  },
].map((city) => {
  const point = project(city.longitude, city.latitude);
  return {
    ...city,
    // Separate the two nearby Taunus markers slightly at this map scale.
    x: point.x + (city.offsetX ?? 0),
    y: point.y + (city.offsetY ?? 0),
  };
});

export function GermanyNetworkMap() {
  const id = useId();
  return (
    <figure
      className="germany-network"
      onPointerMove={(event) => {
        if (
          event.pointerType === "touch" ||
          !window.matchMedia(
            "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          ).matches
        ) {
          return;
        }
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        event.currentTarget.style.setProperty("--map-rotate-x", `${(0.5 - y) * 8}deg`);
        event.currentTarget.style.setProperty("--map-rotate-y", `${(x - 0.5) * 12}deg`);
        event.currentTarget.style.setProperty("--map-pointer-x", `${x * 100}%`);
        event.currentTarget.style.setProperty("--map-pointer-y", `${y * 100}%`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--map-rotate-x", "0deg");
        event.currentTarget.style.setProperty("--map-rotate-y", "0deg");
      }}
    >
      <div className="germany-network-stage">
        <div
          className="germany-network-glass"
          style={{ clipPath: `url(#${id}-silhouette)` }}
          aria-hidden="true"
        />
        <svg
          className="germany-network-map"
          viewBox="0 0 520 560"
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
        >
          <title id={`${id}-title`}>Aus Hattersheim in ganz Deutschland vernetzt</title>
          <desc id={`${id}-description`}>
            Deutschlandkarte mit unserem Sitz in Hattersheim am Main und einer Auswahl unserer
            Einsatzorte: Heidelberg, Mannheim, Hanau, Friedrichsdorf, Bad Homburg, Koblenz,
            Stuttgart und München. Die Orte sind als weiße Punkte markiert, unser Sitz als grüner
            Punkt.
          </desc>
          <defs>
            <clipPath id={`${id}-silhouette`} clipPathUnits="objectBoundingBox">
              <path d={germanyOutline} transform={`scale(${1 / 520} ${1 / 560})`} />
            </clipPath>
          </defs>
          <path
            className="germany-network-outline"
            d={germanyOutline}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          <g aria-hidden="true">
            {cities.map((city) => (
              <g
                key={city.id}
                className={city.home ? "germany-network-city is-home" : "germany-network-city"}
                data-city={city.id}
              >
                <circle
                  className="germany-network-pin"
                  cx={city.x}
                  cy={city.y}
                  r={city.home ? 5.5 : city.compact ? 3.25 : 4.5}
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
      <figcaption className="germany-network-caption">
        <span className="germany-network-caption-dot" aria-hidden="true" />
        <span>Deutschlandweit für Sie im Einsatz.</span>
      </figcaption>
    </figure>
  );
}
