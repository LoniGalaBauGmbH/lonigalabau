import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { projectPhotos } from "@/lib/project-photos";
import { ProjectImage } from "@/components/site/ProjectImage";
const garden = projectPhotos[34].src;

const details = [
  {
    title: "WPC-Terrasse",
    heading: "Ein Platz zum Ankommen.",
    text: "Warme Dielen, ein geschützter Sitzplatz und Grün direkt daneben. Bei einer WPC-Terrasse planen wir Unterkonstruktion, Gefälle und Fugen passend zu Material und Nutzung.",
    position: { left: "80%", top: "70%" },
    origin: "80% 70%",
    service: "gartengestaltung",
    link: "Gartengestaltung ansehen",
  },
  {
    title: "Bepflanzung",
    heading: "Grün mit Charakter.",
    text: "Pflanzbeete begleiten die Terrasse und verbinden die Gartenebenen. Blätter, Blüten und unterschiedliche Wuchshöhen bringen Abwechslung – abgestimmt auf Standort und Pflegeaufwand.",
    position: { left: "28%", top: "60%" },
    origin: "28% 60%",
    service: "gartengestaltung",
    link: "Gartengestaltung ansehen",
  },
  {
    title: "Naturstein",
    heading: "Stein gibt dem Garten Halt.",
    text: "Naturstein fasst die Beete ein und betont die unterschiedlichen Ebenen. Aufeinander abgestimmte Oberflächen und saubere Abschlüsse verbinden Mauern, Pflanzflächen und Terrasse.",
    position: { left: "18%", top: "43%" },
    origin: "18% 43%",
    service: "natursteinarbeiten",
    link: "Natursteinarbeiten ansehen",
  },
  {
    title: "Rasen",
    heading: "Grün, das Raum gibt.",
    text: "Eine kleine Rasenfläche auf der oberen Ebene setzt einen ruhigen grünen Akzent. Klar gefasste Kanten verbinden sie mit den Mauern und den angrenzenden Pflanzbereichen.",
    position: { left: "23%", top: "31.5%" },
    origin: "23% 31.5%",
    service: "rasenanlagen",
    link: "Rasenanlagen ansehen",
  },
  {
    title: "Zaun",
    heading: "Ein klarer Rahmen fürs Grün.",
    text: "Der dunkle Metallzaun fasst den Garten ein und bleibt zwischen den Pflanzen dezent im Hintergrund. Höhe, Verlauf und Befestigung stimmen wir auf das Gelände und Ihre Wünsche ab.",
    position: { left: "67%", top: "22%" },
    origin: "67% 22%",
    service: "zaunarbeiten",
    link: "Zaunarbeiten ansehen",
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
            Entdecken Sie, wie WPC, Naturstein, Pflanzbeete, Rasen und Zaun in einem unserer Gärten
            zusammenspielen.
          </p>
        </div>
        <div className="grid items-stretch gap-0 overflow-hidden rounded-[2rem] bg-brand lg:grid-cols-[1.25fr_1fr]">
          <div className="relative aspect-square min-w-0 overflow-hidden [container-type:size] lg:aspect-auto">
            <div className="absolute left-1/2 top-1/2 h-[max(100cqh,133.333333cqw)] w-[max(100cqw,75cqh)] -translate-x-1/2 -translate-y-1/2">
              <ProjectImage
                src={garden}
                alt="Terrassengarten mit WPC, Naturstein und Pflanzbeeten"
                width={1200}
                height={1600}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
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
                    (active === i
                      ? "bg-accent text-brand"
                      : "bg-white/95 text-brand hover:bg-accent")
                  }
                >
                  <Plus className="size-5" aria-hidden="true" />
                </button>
              ))}
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-brand/80 px-3 py-1.5 text-xs tracking-wide text-white md:bottom-6 md:left-6">
              Ein Garten von Loni
            </span>
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
                  <ProjectImage
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
