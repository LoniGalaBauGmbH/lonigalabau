import { useState } from "react";
import { useSiteImages } from "@/hooks/useSiteImages";
import { ProjectImage } from "@/components/site/ProjectImage";

export function BeforeAfterSlider() {
  const { images } = useSiteImages();
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <section className="px-6 md:px-10 py-24 md:py-36 bg-surface border-y border-brand/10 overflow-hidden">
      <div className="max-w-[1480px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="eyebrow eyebrow-bracket text-brand/70">Vorher & Nachher</span>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,4rem)] text-brand leading-[1.05]">
              Von der Baustelle
              <br />
              <span className="italic font-light text-brand-muted">zur fertigen Terrasse.</span>
            </h2>
          </div>
          <p className="text-sm text-foreground/65 max-w-sm leading-relaxed">
            Ziehen Sie den Regler und vergleichen Sie die Bauphase mit der fertigen Terrasse – mit
            Plattenbelag und Sichtschutz. Die Vergleichsbilder sind bearbeitete Darstellungen.
          </p>
        </div>

        <div className="relative aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden rounded-3xl select-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-ew-resize focus-within:ring-4 focus-within:ring-accent focus-within:ring-offset-4">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            aria-label="Vorher-Nachher-Vergleich"
            aria-valuetext={
              Math.round(sliderPosition) +
              "% Vorher, " +
              Math.round(100 - sliderPosition) +
              "% Nachher"
            }
            className="absolute inset-0 z-30 h-full w-full opacity-0 cursor-ew-resize touch-pan-y"
          />
          {/* After image (background) */}
          <ProjectImage
            src={images.after_garden}
            alt="Terrasse mit großformatigem Plattenbelag und anthrazitfarbenem Sichtschutz"
            loading="lazy"
            sizes="90vw"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute right-6 top-6 bg-brand/80 backdrop-blur-md text-white font-display text-[10px] tracking-[0.24em] uppercase px-4 py-2 rounded-full font-bold shadow-lg">
            Nachher
          </div>

          {/* Before image (clipped overlay) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <ProjectImage
              src={images.before_garden}
              alt="Terrassenfläche in der Bauphase mit Bodenarbeiten und Baumaterial"
              loading="lazy"
              sizes="90vw"
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              draggable={false}
            />
            <div className="absolute left-6 top-6 bg-accent/80 backdrop-blur-md text-accent-foreground font-display text-[10px] tracking-[0.24em] uppercase px-4 py-2 rounded-full font-bold shadow-lg">
              Vorher
            </div>
          </div>

          {/* Slider bar & handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 group"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border border-brand/20 shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex items-center justify-center transition-transform duration-200 group-hover:scale-110 active:scale-95">
              {/* slider arrows */}
              <div className="flex gap-1.5 text-brand">
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 1L1 5L5 9" />
                </svg>
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1L5 5L1 9" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
