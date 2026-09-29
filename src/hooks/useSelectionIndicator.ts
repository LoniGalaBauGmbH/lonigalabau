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
      indicator.style.width = selected.offsetWidth + "px";
      indicator.style.height = selected.offsetHeight + "px";
      indicator.style.translate = selected.offsetLeft + "px " + selected.offsetTop + "px";
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
