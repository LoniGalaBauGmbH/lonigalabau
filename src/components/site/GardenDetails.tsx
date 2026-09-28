import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import garden from "@/assets/after-garden.png";

const details = [
  {
    title: "Terrasse",
    heading: "Ein Platz zum Ankommen.",
    text: "Große Platten und klare Übergänge verbinden Sitzplatz und Garten. Material, Verlegemuster und Unterbau stimmen wir auf die Nutzung ab.",
    position: { left: "23%", top: "76%" },
    origin: "23% 76%",
    service: "pflasterarbeiten",
    link: "Pflasterarbeiten ansehen",
  },
  {
    title: "Bepflanzung",
    heading: "Grün mit Charakter.",
    text: "Gräser, Sträucher und Gehölze geben dem Garten Struktur. Standort, Jahreszeiten und Pflegeaufwand bestimmen die passende Pflanzenauswahl.",
    position: { left: "75%", top: "51%" },
    origin: "75% 51%",
    service: "gartengestaltung",
    link: "Gartengestaltung ansehen",
  },
  {
    title: "Beleuchtung",
    heading: "Auch abends ein Lieblingsplatz.",
    text: "Licht entlang der Wege und einzelne Akzente in den Beeten machen den Garten am Abend erlebbar. Die Beleuchtung lässt sich früh in die Gartenplanung einbeziehen.",
    position: { left: "81%", top: "74%" },
    origin: "81% 74%",
    service: "gartengestaltung",
    link: "Gartenplanung ansehen",
  },
] as const;

export function GardenDetails() {
  const [active, setActive] = useState(0);
  const id = useId();
  const detail = details[active];
  return (
    <section className="px-6 py-24 md:px-10 md:py-32" aria-labelledby={id + "-heading"}>
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end md:mb-14">
          <div>
            <span className="eyebrow text-accent">Gartenideen</span>
            <h2
              id={id + "-heading"}
              className="display mt-5 text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05] text-brand"
            >
              Das Ganze steckt
              <br />
              <span className="font-light italic text-brand-muted">im Detail.</span>
            </h2>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-foreground/65">
            Entdecken Sie, wie Materialien, Pflanzen und Licht zusammenspielen.
          </p>
        </div>
        <div className="grid items-stretch gap-0 overflow-hidden rounded-[2rem] bg-brand lg:grid-cols-[1.25fr_1fr]">
          <div className="relative min-w-0 self-center">
            <img
              src={garden}
              alt="Gestaltungsbeispiel eines Gartens mit Terrasse, seitlichen Pflanzbeeten und Wegbeleuchtung"
              width={1024}
              height={1024}
              loading="lazy"
              className="block aspect-square w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-brand/80 px-3 py-1.5 text-xs tracking-wide text-white md:left-6 md:top-6">
              Gestaltungsbeispiel
            </span>
            {details.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={item.title + " im Garten entdecken"}
                aria-pressed={active === i}
                aria-controls={id + "-detail"}
                onClick={() => setActive(i)}
                style={item.position}
                className={
                  "absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:size-12 " +
                  (active === i ? "bg-accent text-brand" : "bg-white/95 text-brand hover:bg-accent")
                }
              >
                <Plus className="size-5" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="flex min-w-0 flex-col p-6 text-brand-foreground md:p-10 xl:p-14">
            <div className="flex flex-wrap gap-2" aria-label="Gartendetails auswählen">
              {details.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls={id + "-detail"}
                  onClick={() => setActive(i)}
                  className={
                    "rounded-full px-4 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
                    (active === i
                      ? "bg-accent text-brand"
                      : "bg-white/10 text-white hover:bg-white/20")
                  }
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div
              id={id + "-detail"}
              className="mt-8 flex flex-1 flex-col"
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                key={detail.title}
                className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300"
              >
                <div className="mb-7 aspect-[16/7] overflow-hidden rounded-2xl" aria-hidden="true">
                  <img
                    src={garden}
                    alt=""
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: detail.origin,
                      transform: "scale(1.65)",
                      transformOrigin: detail.origin,
                    }}
                  />
                </div>
                <h3 className="max-w-md font-serif text-3xl leading-tight text-white md:text-4xl">
                  {detail.heading}
                </h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-brand-foreground/75">
                  {detail.text}
                </p>
              </div>
              <Link
                to="/leistungen/$slug"
                params={{ slug: detail.service }}
                className="mt-8 inline-flex min-h-11 items-center gap-3 self-start text-sm font-semibold text-accent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {detail.link}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
