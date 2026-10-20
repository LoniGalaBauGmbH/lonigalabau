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
    labelOffsetX: -22,
    labelOffsetY: 36,
    anchor: "end",
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
    id: "koeln",
    name: "Köln",
    longitude: 6.9603,
    latitude: 50.9375,
    labelOffsetX: 0,
    labelOffsetY: 21,
    anchor: "end",
    westColumn: true,
  },
  {
    id: "duesseldorf",
    name: "Düsseldorf",
    longitude: 6.7735,
    latitude: 51.2277,
    labelOffsetX: 0,
    labelOffsetY: 6,
    anchor: "end",
    westColumn: true,
  },
  {
    id: "essen",
    name: "Essen",
    longitude: 7.0116,
    latitude: 51.4556,
    labelOffsetX: 0,
    labelOffsetY: -13,
    anchor: "end",
    westColumn: true,
  },
  {
    id: "dortmund",
    name: "Dortmund",
    longitude: 7.4653,
    latitude: 51.5136,
    labelOffsetX: 0,
    labelOffsetY: -42,
    anchor: "end",
    westColumn: true,
  },
  {
    id: "frankfurt",
    name: "Frankfurt",
    longitude: 8.6821,
    latitude: 50.1109,
    labelOffsetX: 34,
    labelOffsetY: 29,
    anchor: "start",
    nearHome: true,
  },
  {
    id: "leipzig",
    name: "Leipzig",
    longitude: 12.3731,
    latitude: 51.3397,
    labelOffsetX: 12,
    labelOffsetY: -12,
    anchor: "start",
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
    labelX: city.westColumn ? 96 : point.x + city.labelOffsetX,
    labelY: point.y + city.labelOffsetY,
  };
});

// Nearby cities share a branch instead of stacking almost identical spokes.
const connections = [
  ["hattersheim", "hamburg"],
  ["hattersheim", "berlin"],
  ["hattersheim", "koeln"],
  ["koeln", "duesseldorf"],
  ["duesseldorf", "essen"],
  ["essen", "dortmund"],
  ["hattersheim", "frankfurt"],
  ["frankfurt", "leipzig"],
  ["leipzig", "dresden"],
  ["hattersheim", "stuttgart"],
  ["hattersheim", "muenchen"],
] as const;

const routes = connections.map(([from, to]) => {
  const start = cities.find((city) => city.id === from)!;
  const end = cities.find((city) => city.id === to)!;
  return {
    id: `${from}-${to}`,
    path: `M${start.x},${start.y} L${end.x},${end.y}`,
    animated: Math.hypot(end.x - start.x, end.y - start.y) > 45,
  };
});

export function GermanyNetworkMap() {
  const id = useId();
  return (
    <figure className="germany-network">
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
            Einsatzorte: Hamburg, Berlin, Köln, Düsseldorf, Essen, Dortmund, Frankfurt am Main,
            Leipzig, Dresden, Stuttgart und München. Unser Sitz ist grün markiert. Klare Linien
            verbinden alle Städte; nahe Orte teilen sich eine Verbindung.
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
                        "--travel-time": "10s",
                        "--travel-delay": `${-index * 1.6}s`,
                      } as CSSProperties
                    }
                  />
                )}
              </g>
            ))}
          </g>

          <g aria-hidden="true">
            {cities.map((city) => (
              <g
                key={city.id}
                className={city.home ? "germany-network-city is-home" : "germany-network-city"}
                data-city={city.id}
              >
                {city.home && (
                  <path
                    className="germany-network-leader"
                    d={`M${city.x},${city.y} v27 H${city.labelX + 12}`}
                  />
                )}
                {city.nearHome && (
                  <path
                    className="germany-network-leader"
                    d={`M${city.x},${city.y} L${city.labelX - 12},${city.labelY - 7} h6`}
                  />
                )}
                {city.westColumn && (
                  <path
                    className="germany-network-leader"
                    d={`M${city.x},${city.y} L${city.labelX + 6},${city.labelY - 6}`}
                  />
                )}
                {!city.home && !city.nearHome && (
                  <circle
                    className="germany-network-pin-halo"
                    cx={city.x}
                    cy={city.y}
                    r={city.westColumn ? 5 : 8}
                  />
                )}
                {city.home && (
                  <>
                    <circle className="germany-network-home-ring" cx={city.x} cy={city.y} r="5.5" />
                    <rect
                      className="germany-network-home-card"
                      x={city.labelX - 116}
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
                  r={city.home ? 3.5 : city.nearHome ? 2.5 : 3}
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
      </div>
      <figcaption className="germany-network-caption">
        <span className="germany-network-caption-dot" aria-hidden="true" />
        <span>Von Hattersheim aus. Deutschlandweit.</span>
      </figcaption>
    </figure>
  );
}
