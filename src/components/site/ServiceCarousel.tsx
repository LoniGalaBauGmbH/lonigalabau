import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getServiceImage } from "@/lib/service-images";

type Service = {
  id: string;
  slug: string;
  title: string;
  short_text: string;
  category?: string | null;
  hero_image?: string | null;
};

export function ServiceCarousel({ services }: { services: Service[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => api.reInit({ duration: motion.matches ? 0 : 25 });
    api.on("select", update);
    api.on("reInit", update);
    motion.addEventListener("change", applyMotion);
    applyMotion();
    update();
    return () => {
      api.off("select", update);
      api.off("reInit", update);
      motion.removeEventListener("change", applyMotion);
    };
  }, [api]);

  if (!services.length)
    return <p className="text-foreground/65">Aktuell sind keine Leistungen hinterlegt.</p>;

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", loop: services.length > 2 }}
      aria-label="Unsere Gewerke"
      aria-roledescription="Karussell"
      className="min-w-0"
    >
      <CarouselContent className="-ml-5 touch-pan-y">
        {services.map((service, i) => (
          <CarouselItem
            key={service.id}
            className="basis-[88%] pl-5 sm:basis-[58%] lg:basis-[38%]"
            aria-label={service.title + ", " + (i + 1) + " von " + services.length}
            aria-roledescription="Karte"
          >
            <Link
              to="/leistungen/$slug"
              params={{ slug: service.slug }}
              draggable={false}
              className="group relative isolate block aspect-[3/4] overflow-hidden rounded-[2rem] bg-brand text-brand-foreground focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-accent"
            >
              <img
                src={getServiceImage(service.slug, service.hero_image ?? null)}
                alt={service.title}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.05] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/30 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 text-brand-foreground md:p-6">
                <span className="font-display text-xs tracking-[0.2em] opacity-80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {service.category && (
                  <span className="rounded-full bg-brand-foreground/15 px-3 py-1.5 text-right text-xs backdrop-blur-md">
                    {service.category}
                  </span>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 pt-14 md:p-7">
                <h3
                  lang="de"
                  className="break-words hyphens-auto font-display text-xl font-extrabold leading-tight text-brand-foreground lg:text-2xl"
                >
                  {service.title}
                </h3>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/85">
                  {service.short_text}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white/85 group-hover:text-accent">
                    Mehr erfahren
                  </span>
                  <span className="grid size-10 place-items-center rounded-full transition-colors group-hover:bg-accent group-hover:text-brand">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-brand/60">
          <span
            aria-live="polite"
            aria-atomic="true"
            className="font-display tabular-nums text-brand"
          >
            <span className="sr-only">Karte </span>
            {String(selected + 1).padStart(2, "0")}
            <span className="px-2 text-brand/35">/</span>
            {String(services.length).padStart(2, "0")}
          </span>
          <span className="hidden sm:inline">Ziehen oder weiterblättern</span>
          <span className="sm:hidden">Wischen & entdecken</span>
        </div>
        <div className="flex gap-3">
          <CarouselPrevious
            aria-label="Vorherige Leistung"
            className="static size-12 translate-y-0 rounded-full border-0 bg-brand text-white hover:bg-brand/90 hover:text-white focus-visible:ring-accent"
          />
          <CarouselNext
            aria-label="Nächste Leistung"
            className="static size-12 translate-y-0 rounded-full border-0 bg-brand text-white hover:bg-brand/90 hover:text-white focus-visible:ring-accent"
          />
        </div>
      </div>
    </Carousel>
  );
}
