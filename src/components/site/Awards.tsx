import { Award, ShieldCheck, Leaf, Hammer, BadgeCheck, Sprout } from "lucide-react";

const AWARDS = [
  { Icon: Hammer, t: "Meisterbetrieb", s: "Geprüfte Handwerksqualität" },
  { Icon: ShieldCheck, t: "Innung GaLaBau", s: "Mitglied seit 2010" },
  { Icon: Leaf, t: "BGL zertifiziert", s: "Bundesverband Garten-, Landschafts- und Sportplatzbau" },
  { Icon: Award, t: "TÜV geprüft", s: "Maschinen & Sicherheit" },
  { Icon: BadgeCheck, t: "Hersteller-Partner", s: "Husqvarna · Gardena · Rinn" },
  { Icon: Sprout, t: "Nachhaltig zertifiziert", s: "Regionale Pflanzen & Materialien" },
];

export function Awards() {
  return (
    <section className="bg-surface border-y border-brand/10">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="text-center mb-12">
          <span className="eyebrow eyebrow-bracket text-brand/70">Qualität & Zugehörigkeit</span>
          <h2 className="display text-[clamp(1.75rem,3.5vw,2.75rem)] mt-5 text-brand">
            Geprüft. Zertifiziert. Vertraut.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {AWARDS.map(({ Icon, t, s }) => (
            <div
              key={t}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-brand/10 hover:border-brand/30 hover:-translate-y-0.5 transition"
            >
              <div className="size-12 rounded-full border border-brand/20 grid place-items-center mb-4">
                <Icon className="h-5 w-5 text-brand" strokeWidth={1.6} />
              </div>
              <div className="text-sm font-display font-extrabold text-brand leading-tight">{t}</div>
              <div className="mt-2 text-[11px] text-foreground/60 leading-snug">{s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
