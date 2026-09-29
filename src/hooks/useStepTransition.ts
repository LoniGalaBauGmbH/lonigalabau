import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Animate a step replacement without mounting duplicate fields or losing form state. */
export function useStepTransition(step: string | number) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isMoving = useRef(false);
  const prepared = useRef<{ height: number; direction: number } | null>(null);
  const animations = useRef<Animation[]>([]);

  useLayoutEffect(() => {
    const before = prepared.current;
    const frame = frameRef.current;
    const panel = panelRef.current;
    if (!frame || !panel) return;
    if (!before) {
      frame.style.overflow = "";
      delete frame.dataset.stepMotion;
      isMoving.current = false;
      return;
    }
    prepared.current = null;
    animations.current.forEach((animation) => animation.cancel());
    const finish = () => {
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      frame.style.overflow = "";
      delete frame.dataset.stepMotion;
      isMoving.current = false;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    frame.dataset.stepMotion = "enter";
    isMoving.current = true;
    frame.style.overflow = "clip";
    const size = frame.animate(
      [{ height: `${before.height}px` }, { height: `${panel.offsetHeight}px` }],
      { duration: 300, easing, fill: "both" },
    );
    const content = panel.animate(
      [
        { opacity: 0, translate: `${before.direction * 12}px 0` },
        { opacity: 1, translate: "0 0" },
      ],
      { duration: 280, easing, fill: "both" },
    );
    animations.current = [size, content];
    size.finished.then(finish, () => {});
    return () => {
      size.cancel();
      content.cancel();
    };
  }, [step]);

  useEffect(() => {
    if (reduced) animations.current.forEach((animation) => animation.finish());
  }, [reduced]);

  useEffect(
    () => () => {
      animations.current.forEach((animation) => animation.cancel());
    },
    [],
  );

  function changeStep(commit: () => void, direction = 1) {
    if (isMoving.current) return;
    const frame = frameRef.current;
    const panel = panelRef.current;
    if (reduced || !frame || !panel) {
      commit();
      return;
    }
    isMoving.current = true;
    prepared.current = { height: frame.offsetHeight, direction };
    frame.dataset.stepMotion = "leave";
    const leave = panel.animate(
      [
        { opacity: 1, translate: "0 0" },
        { opacity: 0, translate: `${direction * -8}px 0` },
      ],
      { duration: 110, easing: "ease-in", fill: "both" },
    );
    animations.current = [leave];
    leave.finished.then(commit, () => {});
  }

  return { frameRef, panelRef, changeStep, isMoving, reduced };
}

export function scrollStepIntoView(element: HTMLElement | null, reduced: boolean) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  if (rect.top < 120 || rect.bottom > window.innerHeight - 32) {
    element.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" });
  }
}
