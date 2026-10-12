import { z } from "zod";

export const LEAD_QUALIFICATIONS = [
  "unreviewed",
  "qualified",
  "unqualified",
  "spam",
  "duplicate",
  "test",
] as const;
export type LeadQualification = (typeof LEAD_QUALIFICATIONS)[number];
export const LEAD_QUALIFICATION_LABELS: Record<LeadQualification, string> = {
  unreviewed: "Noch ungeprüft",
  qualified: "Passende Kundenanfrage",
  unqualified: "Nicht passend",
  spam: "Spam",
  duplicate: "Doppelte Anfrage",
  test: "Testanfrage",
};
export const EXCLUDED_LEAD_QUALIFICATIONS = ["unqualified", "spam", "duplicate", "test"] as const;
export const DISCOVERY_SOURCES = [
  "google_search",
  "google_maps",
  "recommendation",
  "social_media",
  "returning_customer",
  "other",
] as const;
export type DiscoverySource = (typeof DISCOVERY_SOURCES)[number];
export const DISCOVERY_SOURCE_LABELS: Record<DiscoverySource, string> = {
  google_search: "Google-Suche",
  google_maps: "Google Maps",
  recommendation: "Persönliche Empfehlung",
  social_media: "Soziale Medien",
  returning_customer: "Bereits Kunde",
  other: "Anderer Weg",
};
// An omitted/empty answer stays unknown; it is never inferred from browser data.
export const discoverySourceSchema = z
  .enum(DISCOVERY_SOURCES)
  .or(z.literal(""))
  .optional()
  .transform((value) => value || undefined);
export const leadQualificationUpdateSchema = z
  .object({
    id: z.string().uuid(),
    qualification: z.enum(LEAD_QUALIFICATIONS),
    version: z.number().int().min(0).max(2_147_483_646),
  })
  .strict();
