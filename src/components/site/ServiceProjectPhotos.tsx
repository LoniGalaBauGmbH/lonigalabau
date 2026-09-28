import { ArrowUpRight } from "lucide-react";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { ProjectImage } from "@/components/site/ProjectImage";
import { photoAlt } from "@/lib/project-photos";

type Project = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  images?: string[] | null;
};

export function ServiceProjectPhotos({ projects }: { projects: Project[] }) {
  const seen = new Set<string>();
  const photos = projects
    .flatMap((project) => (project.images ?? []).map((src, index) => ({ src, index, project })))
    .filter((photo) => {
      if (!photo.src || seen.has(photo.src)) return false;
      seen.add(photo.src);
      return true;
    })
    .slice(0, 9);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-6 lg:grid-cols-3">
      {photos.map(({ src, index, project }) => (
        <figure key={src} className="min-w-0">
          <ProjectGallery project={project} initialIndex={index}>
            <button
              type="button"
              aria-label={photoAlt(src, project.title) + " – vergrößern"}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand/5 text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-accent md:rounded-3xl"
            >
              <ProjectImage
                src={src}
                alt={project.title}
                sizes="(max-width: 1023px) 46vw, 30vw"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-brand/80 text-white backdrop-blur-sm group-hover:bg-brand">
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </span>
            </button>
          </ProjectGallery>
          <figcaption className="mt-3 text-sm leading-relaxed text-brand/75">
            {photoAlt(src, project.title)}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
