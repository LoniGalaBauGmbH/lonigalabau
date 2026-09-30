import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { projectPhotos } from "@/lib/project-photos";
import { ProjectImage } from "@/components/site/ProjectImage";
import { useSelectionIndicator } from "@/hooks/useSelectionIndicator";
import "./Motion.css";
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
    position: { left: "23%", top: "30%" },
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
  const { groupRef, indicatorRef } = useSelectionIndicator(active);
  return (
    <section className="px-6 py-24 md:px-10 md:py-32" aria-labelledby={id + "-heading"}>
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end md:mb-14">
          <div>
            <span className="eyebrow text-brand">Gartenideen</span>
            <h2
              id={id + "-heading"}
              className="display mt-5 text-[clamp(2.25rem,4.5vw,4rem)] text-brand"
            >
              Das Ganze steckt
              <br />
              <span className="font-light italic text-brand-muted">im Detail.</span>
            </h2>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-foreground/80">
            Entdecken Sie, wie WPC, Naturstein, Pflanzbeete, Rasen und Zaun in einem unserer Gärten
            zusammenspielen.
          </p>
        </div>
        <p className="mb-4 text-sm text-brand/75 lg:hidden">
          Tippen Sie auf die Plus-Punkte im Bild.
        </p>
        <div className="grid items-stretch gap-0 overflow-hidden rounded-[2rem] bg-brand lg:grid-cols-[1.25fr_1fr]">
          {/* Mobile uses the photo's full aspect ratio without container-query units. */}
          <div className="garden-scene relative aspect-[3/4] w-full min-w-0 overflow-hidden lg:aspect-auto lg:[container-type:size]">
            <div className="absolute inset-0 h-full w-full lg:inset-auto lg:left-1/2 lg:top-1/2 lg:h-[max(100cqh,133.333333cqw)] lg:w-[max(100cqw,75cqh)] lg:-translate-x-1/2 lg:-translate-y-1/2">
              <ProjectImage
                src={garden}
                alt="Terrassengarten mit WPC, Naturstein und Pflanzbeeten"
                width={1200}
                height={1600}
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                draggable={false}
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
                    "garden-hotspot absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 touch-manipulation place-items-center rounded-full shadow-lg ring-1 ring-black/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:size-12 " +
                    (active === i
                      ? "bg-accent text-brand"
                      : "bg-white/95 text-brand hover:bg-accent")
                  }
                >
                  <Plus className="size-5" aria-hidden="true" />
                </button>
              ))}
            </div>
            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-brand/90 px-3 py-2 text-sm text-white md:bottom-6 md:left-6">
              <span className="lg:hidden">{detail.title}</span>
              <span className="hidden lg:inline">Ein Garten von Loni</span>
            </span>
          </div>
          <div className="flex min-w-0 flex-col p-6 text-brand-foreground md:p-10 xl:p-14">
            <div
              ref={groupRef}
              className="garden-selections relative isolate flex flex-wrap gap-2"
              aria-label="Gartendetails auswählen"
            >
              <span ref={indicatorRef} className="garden-selection-indicator" aria-hidden="true" />
              {details.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls={id + "-detail"}
                  onClick={() => setActive(i)}
                  className={
                    "relative z-[1] rounded-full px-4 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
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
              <div>
                <div className="mb-7 aspect-[16/7] overflow-hidden rounded-2xl" aria-hidden="true">
                  <ProjectImage
                    src={garden}
                    alt=""
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="garden-detail-preview h-full w-full object-cover"
                    style={{
                      objectPosition: detail.origin,
                      transform: "scale(1.65)",
                      transformOrigin: detail.origin,
                    }}
                  />
                </div>
                <div className="grid">
                  {details.map((item, i) => (
                    <div
                      key={item.title}
                      className="garden-detail-copy col-start-1 row-start-1"
                      data-active={i === active}
                      aria-hidden={i !== active}
                    >
                      <p className="max-w-md font-serif text-3xl leading-tight text-white md:text-4xl">
                        {item.heading}
                      </p>
                      <p className="mt-5 max-w-md text-base leading-relaxed text-brand-foreground/75">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
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
