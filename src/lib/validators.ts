import { z } from "zod";

export const contactSchema = z.object({
  website: z.string().max(0, "Die Anfrage konnte nicht verarbeitet werden.").optional(),
  name: z.string().trim().min(1, "Name erforderlich").max(200),
  email: z.string().trim().email("Ungültige E-Mail").max(320),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Nachricht erforderlich").max(5000),
  image_paths: z
    .array(z.string().regex(/^[0-9a-f-]{36}\.(jpg|png|webp)$/))
    .max(3)
    .default([]),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  website: z.string().max(0, "Die Bewerbung konnte nicht verarbeitet werden.").optional(),
  job_id: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  cv_path: z.string().max(500).optional().or(z.literal("")),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(320),
});

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Nur Kleinbuchstaben, Ziffern und Bindestrich"),
  title: z.string().trim().min(1).max(200),
  category: z.string().trim().max(120).optional().or(z.literal("")),
  short_text: z.string().trim().max(500).default(""),
  long_text: z.string().trim().max(10000).default(""),
  hero_image: z.string().max(500).nullable().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
  meta_title: z.string().trim().max(200).optional().or(z.literal("")),
  meta_description: z.string().trim().max(500).optional().or(z.literal("")),
  geo_focus: z.string().trim().max(200).optional().or(z.literal("")),
  custom_benefits: z
    .array(
      z.object({
        t: z.string().trim().min(1, "Vorteil-Titel erforderlich"),
        d: z.string().trim().min(1, "Vorteil-Beschreibung erforderlich"),
      }),
    )
    .optional()
    .default([]),
  custom_faqs: z
    .array(
      z.object({
        q: z.string().trim().min(1, "Frage erforderlich"),
        a: z.string().trim().min(1, "Antwort erforderlich"),
      }),
    )
    .optional()
    .default([]),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const jobSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10000).default(""),
  requirements: z.string().trim().max(10000).default(""),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  employment_type: z.string().trim().max(100).optional().or(z.literal("")),
  active: z.boolean().default(true),
});
export type JobInput = z.infer<typeof jobSchema>;

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  service_id: z.string().uuid().optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().max(10000).default(""),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const imageSettingsSchema = z.object({
  logo: z.string().trim().max(1000).optional().or(z.literal("")),
  hero_bg: z.string().trim().max(1000).optional().or(z.literal("")),
  before_garden: z.string().trim().max(1000).optional().or(z.literal("")),
  after_garden: z.string().trim().max(1000).optional().or(z.literal("")),
  about_hero_bg: z.string().trim().max(1000).optional().or(z.literal("")),
  service_detail_bg: z.string().trim().max(1000).optional().or(z.literal("")),
});
export type ImageSettingsInput = z.infer<typeof imageSettingsSchema>;
