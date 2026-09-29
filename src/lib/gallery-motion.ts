export type ImageFrame = {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
  src: string;
  aspect: number;
};

export function imageFrame(
  container: HTMLElement | null,
  contain = false,
  fallback?: ImageFrame | null,
): ImageFrame | null {
  const image = container?.querySelector("img");
  if (!image || !container || (!image.naturalWidth && !fallback)) return null;
  const aspect = image.naturalWidth ? image.naturalWidth / image.naturalHeight : fallback!.aspect;
  const bounds = container.getBoundingClientRect();
  let { left, top, width, height } = bounds;
  if (width <= 0 || height <= 0 || bounds.bottom <= 0 || top >= innerHeight) return null;
  if (contain) {
    const fittedWidth = Math.min(width, height * aspect);
    const fittedHeight = fittedWidth / aspect;
    left += (width - fittedWidth) / 2;
    top += (height - fittedHeight) / 2;
    width = fittedWidth;
    height = fittedHeight;
  }
  return {
    left,
    top,
    width,
    height,
    radius: contain ? 0 : parseFloat(getComputedStyle(container).borderRadius) || 0,
    src: image.naturalWidth ? image.currentSrc || image.src : fallback!.src,
    aspect,
  };
}

/** A temporary, noninteractive image bridges the source and the focused Radix dialog. */
export function flyImage(from: ImageFrame, to: ImageFrame, complete: () => void) {
  const ghost = document.createElement("img");
  ghost.src = from.src;
  ghost.alt = "";
  ghost.setAttribute("aria-hidden", "true");
  ghost.className = "gallery-flight";
  Object.assign(ghost.style, {
    left: to.left + "px",
    top: to.top + "px",
    width: to.width + "px",
    height: to.height + "px",
    borderRadius: to.radius + "px",
  });
  document.body.append(ghost);
  const frame = ({ left, top, width, height, radius }: ImageFrame) => ({
    left: left + "px",
    top: top + "px",
    width: width + "px",
    height: height + "px",
    borderRadius: radius + "px",
  });
  const animation = ghost.animate([frame(from), frame(to)], {
    duration: 460,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "both",
  });
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    animation.cancel();
    ghost.remove();
    window.removeEventListener("resize", finish);
    preference.removeEventListener("change", finish);
    complete();
  };
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", finish);
  window.addEventListener("resize", finish, { once: true });
  animation.finished.then(finish, finish);
  return finish;
}
