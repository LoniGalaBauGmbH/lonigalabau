import { Maximize2 } from "lucide-react";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { ProjectImage } from "@/components/site/ProjectImage";

export function TeamPhoto({
  src,
  sizes,
  className = "",
  loading = "lazy",
}: {
  src: string;
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  return (
    <ProjectGallery
      project={{
        title: "Das Loni-Team",
        description: "Gemeinsam auf der Baustelle – ein Einblick in unseren Arbeitsalltag.",
        images: [src],
      }}
    >
      <button
        type="button"
        aria-label="Teambild vergrößern"
        className={
          "group relative block aspect-[4/3] shrink-0 cursor-zoom-in overflow-hidden bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent " +
          className
        }
      >
        <ProjectImage
          src={src}
          alt="Das Loni-Team gemeinsam auf der Baustelle"
          width={1448}
          height={1086}
          sizes={sizes}
          loading={loading}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:transform-none"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-brand/85 text-white shadow-sm transition-colors group-hover:bg-brand"
        >
          <Maximize2 className="size-4" />
        </span>
      </button>
    </ProjectGallery>
  );
}
