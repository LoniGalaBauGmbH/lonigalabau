import { publicImageUrl } from "@/lib/public-image-url";

const widths = [480, 800, 1200, 1586];
const imagePath = (width: number, format: "avif" | "webp") =>
  publicImageUrl(`/images/zisternen/zisterne-garten-schnitt-ki-v2-${width}.${format}`);
const imageSet = (format: "avif" | "webp") =>
  widths.map((width) => `${imagePath(width, format)} ${width}w`).join(", ");

export function CisternIllustration({
  className = "h-auto w-full",
  priority = false,
  sizes = "(min-width: 1536px) 760px, (min-width: 1024px) 55vw, calc(100vw - 48px)",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <picture className="block">
      <source type="image/avif" srcSet={imageSet("avif")} sizes={sizes} />
      <img
        src={imagePath(1200, "webp")}
        srcSet={imageSet("webp")}
        sizes={sizes}
        alt="KI-Schnittillustration: Regenwasserzisterne mit Filter, beruhigtem Zulauf und Tauchpumpe, deren Druckleitung einen Gartenhahn mit Bewässerungsschlauch versorgt"
        width={1586}
        height={992}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
