import { Award, Hammer, Sprout, Timer } from "lucide-react";

const STATS = [
  {
    v: "2011",
    suffix: "",
    l: "Seit 2011 tätig",
    sub: "Im Garten- und Landschaftsbau",
    Icon: Sprout,
  },
  { v: "8", suffix: "", l: "Leistungsbereiche", sub: "Für Ihre Außenanlagen", Icon: Hammer },
  {
    v: "Rhein",
    suffix: "-Main",
    l: "Regional für Sie da",
    sub: "Aus Hattersheim am Main",
    Icon: Award,
  },
  {
    v: "Direkt",
    suffix: "",
    l: "Persönlicher Kontakt",
    sub: "Von der Anfrage bis zur Umsetzung",
    Icon: Timer,
  },
];

export function StatsBand() {
  return (
    <section className="relative bg-brand text-brand-foreground overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(70% 90% at 20% 0%, oklch(0.74 0.20 135 / 0.10), transparent 60%), radial-gradient(60% 80% at 90% 100%, oklch(0.74 0.20 135 / 0.08), transparent 65%)",
        }}
      />

      <div className="relative max-w-[1480px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-accent font-display font-semibold">
              <span className="size-1.5 rounded-full bg-accent" />
              Loni auf einen Blick
            </span>
            <h2 className="display mt-5 text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] max-w-xl text-brand-foreground">
              Erfahrung, die
              <br />
              Ihren Garten weiterbringt.
            </h2>
          </div>
          <p className="text-sm text-brand-foreground/80 max-w-sm leading-relaxed">
            Seit 2011 sind wir im Garten- und Landschaftsbau tätig. Wir verbinden diese Erfahrung
            mit einem persönlichen Blick auf Ihr Vorhaben.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden">
          {STATS.map(({ v, suffix, l, sub, Icon }) => (
            <div
              key={l}
              className="group relative bg-brand px-8 py-10 md:py-12 hover:bg-brand-foreground/[0.03] transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                <span className="text-[10px] tracking-[0.24em] uppercase text-brand-foreground/80 font-display font-semibold">
                  / 0{STATS.indexOf(STATS.find((s) => s.l === l)!) + 1}
                </span>
              </div>

              <div className="flex items-baseline gap-0.5">
                <span className="display text-[clamp(2rem,3.5vw,3.5rem)] leading-none tracking-tight text-brand-foreground tabular-nums font-black">
                  {v}
                </span>
                <span className="text-[clamp(1.5rem,2vw,2rem)] text-accent font-display font-bold leading-none">
                  {suffix}
                </span>
              </div>

              <div className="mt-8 text-sm font-display font-bold uppercase tracking-[0.16em] text-brand-foreground">
                {l}
              </div>
              <div className="mt-2 text-[13px] text-brand-foreground/80 leading-relaxed">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
