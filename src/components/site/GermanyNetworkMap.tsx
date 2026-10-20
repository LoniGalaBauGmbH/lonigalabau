import { useId, type CSSProperties } from "react";
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
    name: "Hattersheim",
    longitude: 8.4854,
    latitude: 50.0696,
    labelOffsetX: 31,
    labelOffsetY: 23,
    anchor: "start",
    regional: true,
    home: true,
  },
  {
    id: "hamburg",
    name: "Hamburg",
    longitude: 9.9937,
    latitude: 53.5511,
    labelOffsetX: 12,
    labelOffsetY: -10,
    anchor: "start",
  },
  {
    id: "berlin",
    name: "Berlin",
    longitude: 13.405,
    latitude: 52.52,
    labelOffsetX: 12,
    labelOffsetY: -9,
    anchor: "start",
  },
  {
    id: "kassel",
    name: "Kassel",
    longitude: 9.4797,
    latitude: 51.3127,
    labelOffsetX: 12,
    labelOffsetY: -10,
    anchor: "start",
  },
  {
    id: "koeln",
    name: "Köln",
    longitude: 6.9603,
    latitude: 50.9375,
    labelOffsetX: -12,
    labelOffsetY: -10,
    anchor: "end",
  },
  {
    id: "koblenz",
    name: "Koblenz",
    longitude: 7.5889,
    latitude: 50.3569,
    labelOffsetX: -18,
    labelOffsetY: -8,
    anchor: "end",
    regional: true,
  },
  {
    id: "wiesbaden",
    name: "Wiesbaden",
    longitude: 8.2398,
    latitude: 50.0782,
    labelOffsetX: -26,
    labelOffsetY: -6,
    anchor: "end",
    regional: true,
  },
  {
    id: "mainz",
    name: "Mainz",
    longitude: 8.2473,
    latitude: 49.9929,
    labelOffsetX: -18,
    labelOffsetY: 24,
    anchor: "end",
    regional: true,
  },
  {
    id: "frankfurt",
    name: "Frankfurt",
    longitude: 8.6821,
    latitude: 50.1109,
    labelOffsetX: 34,
    labelOffsetY: -12,
    anchor: "start",
    regional: true,
  },
  {
    id: "dresden",
    name: "Dresden",
    longitude: 13.7373,
    latitude: 51.0504,
    labelOffsetX: 0,
    labelOffsetY: 24,
    anchor: "middle",
  },
  {
    id: "stuttgart",
    name: "Stuttgart",
    longitude: 9.1829,
    latitude: 48.7758,
    labelOffsetX: 0,
    labelOffsetY: 24,
    anchor: "middle",
  },
  {
    id: "muenchen",
    name: "München",
    longitude: 11.582,
    latitude: 48.1351,
    labelOffsetX: 12,
    labelOffsetY: 20,
    anchor: "start",
  },
].map((city) => {
  const point = project(city.longitude, city.latitude);
  return {
    ...city,
    ...point,
    labelX: point.x + city.labelOffsetX,
    labelY: point.y + city.labelOffsetY,
  };
});

const connections = [
  ["hattersheim", "hamburg", -38],
  ["hamburg", "berlin", -24],
  ["berlin", "dresden", 18],
  ["dresden", "muenchen", -25],
  ["muenchen", "stuttgart", 22],
  ["stuttgart", "hattersheim", -18],
  ["hattersheim", "kassel", 13],
  ["kassel", "hamburg", -12],
  ["kassel", "berlin", -18],
  ["kassel", "dresden", 18],
  ["hattersheim", "muenchen", -30],
  ["hattersheim", "koeln", -15],
  ["koeln", "koblenz", 12],
  ["koblenz", "wiesbaden", 8],
  ["wiesbaden", "mainz", 3],
  ["mainz", "hattersheim", 5],
  ["hattersheim", "frankfurt", -7],
] as const;

const routes = connections.map(([from, to, bend]) => {
  const start = cities.find((city) => city.id === from)!;
  const end = cities.find((city) => city.id === to)!;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  const controlX = (start.x + end.x) / 2 - (dy / distance) * bend;
  const controlY = (start.y + end.y) / 2 + (dx / distance) * bend;
  return `M${start.x},${start.y} Q${controlX},${controlY} ${end.x},${end.y}`;
});

export function GermanyNetworkMap() {
  const id = useId();
  return (
    <figure className="germany-network">
      <svg
        className="germany-network-map"
        viewBox="0 0 520 560"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <title id={`${id}-title`}>Aus Hattersheim in ganz Deutschland vernetzt</title>
        <desc id={`${id}-description`}>
          Deutschlandkarte mit unserem Sitz in Hattersheim am Main und einer Auswahl unserer
          Einsatzorte: Koblenz, Frankfurt, Mainz, Wiesbaden, München, Hamburg, Kassel, Köln, Berlin,
          Dresden und Stuttgart. Leuchtende Linien verbinden die Städte.
        </desc>
        <defs>
          <linearGradient id={`${id}-land`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#203e30" stopOpacity=".55" />
            <stop offset="1" stopColor="#0b2015" stopOpacity=".8" />
          </linearGradient>
          <radialGradient id={`${id}-halo`}>
            <stop stopColor="#b6d88c" stopOpacity=".1" />
            <stop offset="1" stopColor="#b6d88c" stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r=".7" fill="#ffffff" fillOpacity=".12" />
          </pattern>
        </defs>

        <ellipse cx="270" cy="290" rx="250" ry="265" fill={`url(#${id}-halo)`} />
        <path
          className="germany-network-outline"
          d={germanyOutline}
          fill={`url(#${id}-land)`}
          vectorEffect="non-scaling-stroke"
        />
        <path d={germanyOutline} fill={`url(#${id}-dots)`} />

        <g fill="none" aria-hidden="true">
          {routes.map((route, index) => (
            <g key={index}>
              <path className="germany-network-route" d={route} />
              <path
                className="germany-network-light"
                d={route}
                pathLength="1"
                style={
                  {
                    "--travel-time": `${6 + (index % 5)}s`,
                    "--travel-delay": `${-index * 1.7}s`,
                  } as CSSProperties
                }
              />
            </g>
          ))}
        </g>

        <g aria-hidden="true">
          {cities.map((city, index) => (
            <g
              key={city.id}
              className={city.home ? "germany-network-city is-home" : "germany-network-city"}
              data-city={city.id}
            >
              {city.regional && (
                <path
                  className="germany-network-leader"
                  d={`M${city.x},${city.y} L${city.labelX + (city.anchor === "end" ? 10 : -10)},${city.labelY - 5} h${city.anchor === "end" ? -5 : 5}`}
                />
              )}
              {!city.regional && (
                <>
                  <circle className="germany-network-pin-halo" cx={city.x} cy={city.y} r="8" />
                  <circle
                    className="germany-network-pulse"
                    cx={city.x}
                    cy={city.y}
                    r="6"
                    style={{ animationDelay: `${-index * 0.6}s` }}
                  />
                </>
              )}
              {city.home && (
                <circle className="germany-network-home-ring" cx={city.x} cy={city.y} r="7.5" />
              )}
              <circle
                className="germany-network-pin"
                cx={city.x}
                cy={city.y}
                r={city.home ? 3.5 : city.regional ? 2.3 : 3}
              />
              <text
                className="germany-network-label"
                x={city.labelX}
                y={city.labelY}
                textAnchor={city.anchor as "start" | "end" | "middle"}
              >
                {city.name}
                {city.home && (
                  <tspan x={city.labelX} dy="17" className="germany-network-home-label">
                    UNSER SITZ
                  </tspan>
                )}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <figcaption className="germany-network-caption">
        <span className="germany-network-caption-dot" aria-hidden="true" />
        <span>Von Hattersheim aus. Deutschlandweit.</span>
      </figcaption>
    </figure>
  );
}
