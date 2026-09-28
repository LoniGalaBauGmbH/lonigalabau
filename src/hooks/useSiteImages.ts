import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteImages } from "@/lib/site.functions";

// Default local code imports as fallback assets
import logoDefault from "@/assets/logo-loni.svg";
import logoWhiteDefault from "@/assets/logo-loni-white.svg";
import heroDefault from "@/assets/hero-garden.jpg";
import beforeDefault from "@/assets/before-garden.png";
import afterDefault from "@/assets/after-garden.png";
import aboutDefault from "@/assets/about-site.jpg";

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
  const fetchFn = useServerFn(getSiteImages);

  const { data, isLoading } = useQuery({
    queryKey: ["site-images"],
    queryFn: () => fetchFn(),
    // Keep data fresh in memory, avoids aggressive refetching
    staleTime: 1000 * 60 * 5,
  });

  const images: SiteImages = {
    logo: data?.logo || logoDefault,
    logo_white: data?.logo_white || data?.logo || logoWhiteDefault,
    hero_bg: data?.hero_bg || heroDefault,
    before_garden: data?.before_garden || beforeDefault,
    after_garden: data?.after_garden || afterDefault,
    about_hero_bg: data?.about_hero_bg || aboutDefault,
    service_detail_bg: data?.service_detail_bg || heroDefault,
    contact_portrait: data?.contact_portrait || "",
  };

  return {
    images,
    customImages: data ?? {},
    isLoading,
  };
}
