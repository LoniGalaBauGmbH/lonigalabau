import { useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteImages } from "@/lib/site.functions";

// Default local code imports as fallback assets
import logoDefault from "@/assets/logo-loni.svg";
import logoWhiteDefault from "@/assets/logo-loni-white.svg";
import heroDefault from "@/assets/hero-garden.jpg";
import { projectPhotos } from "@/lib/project-photos";
import contactPortraitDefault from "@/assets/about-founder-valon.webp";

export type SiteImages = {
  logo: string;
  logo_white: string;
  hero_bg: string;
  before_garden: string;
  after_garden: string;
  about_hero_bg: string;
  service_detail_bg: string;
  contact_portrait: string;
};

export function useSiteImages() {
  const initialImages = useRouterState({
    select: (s) =>
      (
        s.matches.find((m) => m.routeId === "__root__")?.loaderData as
          | { images?: Record<string, string> }
          | undefined
      )?.images,
  });
  const fetchFn = useServerFn(getSiteImages);

  const { data, isLoading } = useQuery({
    queryKey: ["site-images"],
    initialData: initialImages,
    queryFn: () => fetchFn(),
    // Keep data fresh in memory, avoids aggressive refetching
    staleTime: 1000 * 60 * 5,
  });

  const images: SiteImages = {
    logo: data?.logo || logoDefault,
    logo_white: data?.logo || logoWhiteDefault, // Logo can also be used as white logo fallback or directly
    hero_bg: data?.hero_bg || heroDefault,
    before_garden: data?.before_garden || projectPhotos[96].src,
    after_garden: data?.after_garden || projectPhotos[97].src,
    about_hero_bg: data?.about_hero_bg || projectPhotos[99].src,
    service_detail_bg: data?.service_detail_bg || heroDefault,
    contact_portrait: data?.contact_portrait || contactPortraitDefault,
  };

  return {
    images,
    isLoading,
  };
}
