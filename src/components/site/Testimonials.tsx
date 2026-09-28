import { Star, CheckCircle2 } from "lucide-react";

const TESTIMONIALS = [
  {
    q: "Loni und sein Team haben unseren Garten in eine echte Wohlfühloase verwandelt. Vom ersten Beratungstermin bis zur Fertigstellung war alles bestens organisiert.",
    n: "Familie Schäfer",
    o: "Hattersheim am Main",
    p: "Gartengestaltung & Bewässerung",
    i: "S",
    d: "Vor 2 Wochen",
  },
  {
    q: "Pünktlich, sauber, fair kalkuliert. Die Pflasterarbeiten in unserer Hofeinfahrt sind erstklassig und auch nach zwei Jahren noch wie am ersten Tag.",
    n: "Dr. Markus Wagner",
    o: "Frankfurt am Main",
    p: "Pflasterarbeiten",
    i: "W",
    d: "Vor 1 Monat",
  },
  {
    q: "Wir hatten klare Vorstellungen – das Team hat zugehört, mitgedacht und am Ende mehr geliefert als wir erwartet haben. Absolute Empfehlung.",
    n: "Sandra & Tobias Krüger",
    o: "Kelkheim",
    p: "Natursteinmauer & Terrasse",
    i: "K",
    d: "Vor 3 Wochen",
  },
];

export function Testimonials() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 bg-background">
      <div className="max-w-[1480px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-8">
            <span className="eyebrow eyebrow-bracket text-brand/70">Kundenstimmen</span>
            <h2 className="display text-[clamp(2.25rem,5vw,4.5rem)] mt-4 text-brand">
              Erfahrungen unserer Kunden
            </h2>
            <p className="mt-3 text-foreground/70 max-w-xl text-base">
              Echte Rückmeldungen von Hausbesitzern und gewerblichen Kunden aus dem Rhein-Main-Gebiet.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <div className="inline-flex items-center gap-3 bg-surface border border-brand/10 px-5 py-3 rounded-2xl shadow-sm">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-brand">5.0 von 5.0 Sternen</div>
                <div className="text-xs text-foreground/60">Über 120 Google-Bewertungen</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.n}
              className="relative p-8 rounded-3xl border border-brand/10 bg-surface flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verifiziert
                  </span>
                </div>
                <blockquote className="text-base text-foreground/85 leading-relaxed font-sans">
                  „{t.q}“
                </blockquote>
              </div>

              <figcaption className="mt-8 pt-6 border-t border-brand/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-brand/10 text-brand font-semibold text-sm flex items-center justify-center shrink-0">
                  {t.i}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-brand truncate">{t.n}</div>
                  <div className="text-xs text-foreground/60 truncate">{t.o} · {t.p}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
