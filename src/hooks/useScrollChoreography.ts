import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useScrollChoreography(ref: RefObject<HTMLElement | null>, route: string) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = ref.current;
    if (!root || reduced || !("IntersectionObserver" in window)) return;
    // Keep mobile content visible without measuring and preparing every offscreen reveal.
    if (window.matchMedia("(max-width: 767px), (pointer: coarse)").matches) return;
    const animations = new Map<HTMLElement, Animation>();
    const candidates = new Map<HTMLElement, number>();
    root
      .querySelectorAll<HTMLElement>("[data-reveal], section h2, section img")
      .forEach((element) => {
        if (element.tagName === "H2" && element.closest(".partner-page")) return;
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
    const finish = (element: HTMLElement) => {
      element.dataset.revealed = "true";
      const animation = animations.get(element);
      animations.delete(element);
      animation?.cancel();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const animation = animations.get(element);
          if (!animation) continue;
          element.dataset.revealed = "true";
          animation.play();
          animation.finished.then(
            () => finish(element),
            () => {},
          );
        }
      },
      { threshold: 0, rootMargin: "0px 0px 64px 0px" },
    );
    for (const element of candidates.keys()) {
      // Do not replay above the current scroll position, including restored history positions.
      if (
        element.dataset.revealed === "true" ||
        element.getBoundingClientRect().top < window.innerHeight + 64
      ) {
        element.dataset.revealed = "true";
        continue;
      }
      const image = element.tagName === "IMG";
      const style = getComputedStyle(element);
      // Prepare offscreen, before observation. Never hide text after it has entered the viewport.
      // End at its original style, including muted text opacity, so finishing cannot flash.
      const animation = element.animate(
        image
          ? [
              { opacity: 0, clipPath: "inset(5% 0 0 0)" },
              {
                opacity: style.opacity,
                clipPath: style.clipPath === "none" ? "inset(0% 0 0 0)" : style.clipPath,
              },
            ]
          : [
              { opacity: 0, translate: "0 12px" },
              { opacity: style.opacity, translate: style.translate },
            ],
        {
          duration: image ? 650 : 480,
          delay: Math.min(80, Number(element.dataset.revealDelay) || candidates.get(element) || 0),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );
      animation.pause();
      animation.currentTime = 0;
      animations.set(element, animation);
      observer.observe(element);
    }
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const element of animations.keys()) {
        if (element.contains(event.target)) {
          observer.unobserve(element);
          finish(element);
        }
      }
    };
    root.addEventListener("focusin", revealFocused);
    return () => {
      root.removeEventListener("focusin", revealFocused);
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [ref, route, reduced]);
}
