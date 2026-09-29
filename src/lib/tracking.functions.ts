import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/integrations/supabase/admin-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const trackingSchema = z.object({
  ga4: z
    .string()
    .trim()
    .max(50)
    .regex(/^(G-[A-Z0-9]+)?$/i, "Ungültige GA4-ID (G-XXXX)")
    .default(""),
  gtm: z
    .string()
    .trim()
    .max(50)
    .regex(/^(GTM-[A-Z0-9]+)?$/i, "Ungültige GTM-ID (GTM-XXXX)")
    .default(""),
  metaPixel: z
    .string()
    .trim()
    .max(50)
    .regex(/^\d*$/, "Pixel-ID darf nur Zahlen enthalten")
    .default(""),
  linkedinId: z.string().trim().max(50).regex(/^\d*$/, "Nur Zahlen").default(""),
  tiktokId: z
    .string()
    .trim()
    .max(50)
    .regex(/^[A-Z0-9]*$/i, "Ungültige TikTok-ID")
    .default(""),
  customHead: z.string().max(10000).default(""),
  anonymizeIp: z.boolean().default(true),
  consentVersion: z.number().int().min(1).max(9999).default(1),
  banner: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(800),
  }),
});

export type TrackingSettings = z.infer<typeof trackingSchema>;

const DEFAULTS: TrackingSettings = {
  ga4: "",
  gtm: "",
  metaPixel: "",
  linkedinId: "",
  tiktokId: "",
  customHead: "",
  anonymizeIp: true,
  consentVersion: 1,
  banner: {
    title: "Cookies & Privatsphäre",
    description:
      "Wir verwenden Cookies, um unsere Website zu betreiben und – mit Ihrer Zustimmung – Reichweite zu messen. Technisch notwendige Cookies sind immer aktiv.",
  },
};

export const getTrackingSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "tracking")
    .maybeSingle();
  if (error) throw new Error(error.message);
  const parsed = trackingSchema.safeParse(data?.value ?? {});
  return parsed.success ? parsed.data : DEFAULTS;
});

export const updateTrackingSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => trackingSchema.parse(d))
  .handler(async ({ data }) => {
    if (
      data.ga4 ||
      data.gtm ||
      data.metaPixel ||
      data.linkedinId ||
      data.tiktokId ||
      data.customHead
    )
      throw new Error(
        "Tracking ist zum Start deaktiviert. Vor der Aktivierung müssen Einwilligung und Datenschutzhinweise auf den konkreten Dienst abgestimmt werden.",
      );
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key: "tracking", value: data }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
