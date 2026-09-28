import React, { useState, useRef, useEffect } from "react";
import { useSiteImages } from "@/hooks/useSiteImages";
import { ProjectImage } from "@/components/site/ProjectImage";

export function BeforeAfterSlider() {
  const { images } = useSiteImages();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="px-6 md:px-10 py-24 md:py-36 bg-surface border-y border-brand/10 overflow-hidden">
      <div className="max-w-[1480px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="eyebrow eyebrow-bracket text-brand/70">Einblick ins Handwerk</span>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,4rem)] text-brand leading-[1.05]">
              Qualität beginnt<br />
              <span className="italic font-light text-brand-muted">unter der Oberfläche.</span>
            </h2>
          </div>
          <p className="text-sm text-foreground/65 max-w-sm leading-relaxed">
            Bewegen Sie den Regler: links eine Terrassenunterkonstruktion, rechts ein fertiger Holzbelag. Zwei Aufnahmen aus unterschiedlichen Projekten zeigen, worauf es bei der Ausführung ankommt.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl select-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-ew-resize"
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* After image (background) */}
          <ProjectImage
            src={images.after_garden}
            alt="Fertige Holzterrasse mit dunklem Sichtschutz"
            loading="lazy"
            sizes="90vw"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute right-6 top-6 bg-brand/80 backdrop-blur-md text-white font-display text-[10px] tracking-[0.24em] uppercase px-4 py-2 rounded-full font-bold shadow-lg">
            Fertiger Belag
          </div>

          {/* Before image (clipped overlay) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <ProjectImage
              src={images.before_garden}
              alt="Terrassenunterkonstruktion vor dem Verlegen des Belags"
              loading="lazy"
              sizes="90vw"
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              draggable={false}
            />
            <div className="absolute left-6 top-6 bg-accent/80 backdrop-blur-md text-accent-foreground font-display text-[10px] tracking-[0.24em] uppercase px-4 py-2 rounded-full font-bold shadow-lg">
              Unterkonstruktion
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
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 1L1 5L5 9" />
                </svg>
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
