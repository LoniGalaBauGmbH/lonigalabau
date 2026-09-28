import { projectPhotos } from "@/lib/project-photos";

export const serviceImageBySlug: Record<string, string> = {
  natursteinarbeiten: projectPhotos[77].src,
  gartengestaltung: projectPhotos[81].src,
  pflasterarbeiten: projectPhotos[30].src,
  bewaesserungsanlagen: projectPhotos[66].src,
  zaunarbeiten: projectPhotos[40].src,
  rasenanlagen: projectPhotos[48].src,
  erdarbeiten: projectPhotos[76].src,
  entwaesserung: projectPhotos[85].src,
};

export function getServiceImage(slug: string, override?: string | null) {
  if (override) return override;
  return serviceImageBySlug[slug] ?? projectPhotos[77].src;
}
