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
  // A connected tree gives every city one clear route, without crossing arcs.
  ["hattersheim", "kassel", 10],
  ["kassel", "hamburg", -8],
  ["kassel", "berlin", -16],
  ["berlin", "dresden", 10],
  ["hattersheim", "stuttgart", 12],
  ["stuttgart", "muenchen", 14],
  ["hattersheim", "koblenz", 0],
  ["koblenz", "koeln", -5],
  ["hattersheim", "wiesbaden", 0],
  ["hattersheim", "mainz", 0],
  ["hattersheim", "frankfurt", 0],
] as const;

const routes = connections.map(([from, to, bend]) => {
  const start = cities.find((city) => city.id === from)!;
  const end = cities.find((city) => city.id === to)!;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  const controlX = (start.x + end.x) / 2 - (dy / distance) * bend;
  const controlY = (start.y + end.y) / 2 + (dx / distance) * bend;
  return {
    id: `${from}-${to}`,
    path: `M${start.x},${start.y} Q${controlX},${controlY} ${end.x},${end.y}`,
    animated: distance > 30,
  };
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
        <path
          className="germany-network-outline"
          d={germanyOutline}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />

        <g fill="none" aria-hidden="true">
          {routes.map((route, index) => (
            <g key={route.id} data-connection={route.id}>
              <path className="germany-network-route" d={route.path} />
              {route.animated && (
                <path
                  className="germany-network-light"
                  d={route.path}
                  pathLength="1"
                  style={
                    {
                      "--travel-time": `${7 + (index % 3)}s`,
                      "--travel-delay": `${-index * 1.7}s`,
                    } as CSSProperties
                  }
                />
              )}
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
                <>
                  <circle className="germany-network-home-ring" cx={city.x} cy={city.y} r="7.5" />
                  <rect
                    className="germany-network-home-card"
                    x={city.labelX - 10}
                    y={city.labelY - 21}
                    width="128"
                    height="46"
                    rx="10"
                  />
                </>
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
