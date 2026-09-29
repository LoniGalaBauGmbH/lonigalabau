import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useScrollChoreography(ref: RefObject<HTMLElement | null>, route: string) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = ref.current;
    if (!root || reduced || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const candidates = new Map<HTMLElement, number>();
    root
      .querySelectorAll<HTMLElement>("[data-reveal], section h2, section img")
      .forEach((element) => {
        if (element.closest("form, .garden-scene, .garden-detail-preview, .service-carousel"))
          return;
        if (element.parentElement?.closest("[data-reveal]")) return;
        const section = element.closest("section");
        if (section?.querySelector("h1")) return;
        if (element.tagName === "IMG" && element.closest("button, a, [aria-hidden='true']")) return;
        if (element.tagName === "IMG" && element.getBoundingClientRect().height < 120) return;
        candidates.set(element, element.tagName === "H2" ? 55 : 0);
        if (element.tagName === "H2" && element.nextElementSibling?.tagName === "P") {
          candidates.set(element.nextElementSibling as HTMLElement, 115);
        }
      });
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          if (element.dataset.revealed === "true") continue;
          element.dataset.revealed = "true";
          const image = element.tagName === "IMG";
          const animation = element.animate(
            image
              ? [
                  { opacity: 0.45, clipPath: "inset(9% 0 0 0)" },
                  { opacity: 1, clipPath: "inset(0% 0 0 0)" },
                ]
              : [
                  { opacity: 0, translate: "0 18px" },
                  { opacity: 1, translate: "0 0" },
                ],
            {
              duration: image ? 800 : 620,
              delay: Math.min(
                180,
                Number(element.dataset.revealDelay) || candidates.get(element) || 0,
              ),
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            },
          );
          animations.add(animation);
          animation.finished.finally(() => animations.delete(animation)).catch(() => {});
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    for (const element of candidates.keys()) {
      // Do not replay above the current scroll position, including restored history positions.
      if (element.getBoundingClientRect().top < window.innerHeight - 24)
        element.dataset.revealed = "true";
      else observer.observe(element);
    }
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [ref, route, reduced]);
}
