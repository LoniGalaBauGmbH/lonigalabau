import { useLayoutEffect, useRef } from "react";

/** Measures the actual button, including wrapped rows and resized type. */
export function useSelectionIndicator(active: number) {
  const groupRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const group = groupRef.current;
    const indicator = indicatorRef.current;
    if (!group || !indicator) return;
    const update = () => {
      const selected = group.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!selected) return;
      // Finish all layout reads before changing styles.
      const width = selected.offsetWidth;
      const height = selected.offsetHeight;
      const left = selected.offsetLeft;
      const top = selected.offsetTop;
      indicator.style.width = width + "px";
      indicator.style.height = height + "px";
      indicator.style.translate = left + "px " + top + "px";
      group.dataset.indicatorReady = "true";
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(group);
    for (const button of group.querySelectorAll("button")) observer.observe(button);
    return () => observer.disconnect();
  }, [active]);
  return { groupRef, indicatorRef };
}
