import naturstein from "@/assets/svc-naturstein.jpg";
import gartengestaltung from "@/assets/svc-gartengestaltung.jpg";
import pflaster from "@/assets/svc-pflaster.jpg";
import bewaesserung from "@/assets/svc-bewaesserung.jpg";
import zaun from "@/assets/svc-zaun.jpg";
import rasen from "@/assets/svc-rasen.jpg";
import erdarbeiten from "@/assets/svc-erdarbeiten.jpg";
import entwaesserung from "@/assets/svc-entwaesserung.jpg";

export const serviceImageBySlug: Record<string, string> = {
  natursteinarbeiten: naturstein,
  gartengestaltung,
  pflasterarbeiten: pflaster,
  bewaesserungsanlagen: bewaesserung,
  zaunarbeiten: zaun,
  rasenanlagen: rasen,
  erdarbeiten,
  entwaesserung,
};

export function getServiceImage(slug: string, override?: string | null) {
  if (override) return override;
  return serviceImageBySlug[slug] ?? naturstein;
}
