import { Expand } from "lucide-react";
import { getRegionGallery } from "@/lib/region-gallery";
import { photoAlt } from "@/lib/project-photos";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectImage } from "./ProjectImage";
import "./RegionalProjectGallery.css";

const galleryDescription =
  "Gärten, Terrassen, Wege und Einfriedungen: ausgewählte Gestaltungsbeispiele aus Arbeiten von Loni GalaBau.";

export function RegionalProjectGallery({ slug }: { slug: string }) {
  const photos = getRegionGallery(slug);
  if (!photos.length) return null;

  const project = {
    title: "Einblicke in unsere Arbeiten",
    description: galleryDescription,
    images: photos.map((photo) => photo.src),
  };

  return (
    <section
      id="projektbilder"
      className="region-wrap region-project-gallery"
      aria-labelledby="projektbilder-title"
    >
      <div className="region-project-gallery-heading">
        <div>
          <span className="region-kicker">Ideen für Ihren Außenbereich</span>
          <h2 id="projektbilder-title">Einblicke in unsere Arbeiten</h2>
        </div>
        <p>{galleryDescription}</p>
      </div>
      <div className="region-project-gallery-grid">
        {photos.map((photo, index) => (
          <ProjectGallery key={photo.src} project={project} initialIndex={index}>
            <button
              type="button"
              className="region-project-photo"
              aria-label={`Bild ${index + 1} vergrößern: ${photoAlt(photo.src, photo.alt)}`}
            >
              <ProjectImage
                src={photo.src}
                alt={photo.alt}
                sizes="(max-width: 380px) calc(100vw - 36px), (max-width: 700px) calc((100vw - 48px) / 2), (max-width: 1050px) calc((100vw - 88px) / 3), (max-width: 1328px) calc((100vw - 108px) / 4), 305px"
                loading="lazy"
                draggable={false}
              />
              <span className="region-project-photo-label" aria-hidden="true">
                <span>{photo.label}</span>
                <Expand size={18} />
              </span>
            </button>
          </ProjectGallery>
        ))}
      </div>
    </section>
  );
}
