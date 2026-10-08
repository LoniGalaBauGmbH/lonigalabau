import { z } from "zod";
import { applicationDocumentSchema } from "./application-document";

export const PARTNER_TRADES = [
  "Gartengestaltung",
  "Pflasterarbeiten",
  "Natursteinarbeiten",
  "Bewässerungsanlagen",
  "Zaunarbeiten",
  "Rasenanlagen",
  "Erdarbeiten",
  "Entwässerung",
  "Sonstige",
] as const;
export const PARTNER_STATUSES = {
  new: "Neu",
  reviewing: "In Prüfung",
  documents_missing: "Unterlagen fehlen",
  shortlisted: "Vorgemerkt",
  rejected: "Abgelehnt",
} as const;
export type PartnerStatus = keyof typeof PARTNER_STATUSES;
export function berlinToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (key: string) => parts.find((p) => p.type === key)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function isCalendarDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
const text = (label: string, max = 200) =>
  z
    .string()
    .trim()
    .min(1, `${label} bitte ausfüllen.`)
    .max(max, `Bitte maximal ${max} Zeichen eingeben.`);
export const partnerCompanySchema = z.object({
  company_name: text("Firmenname"),
  legal_form: text("Rechtsform", 80),
  street: text("Straße und Hausnummer"),
  postal_code: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Bitte eine fünfstellige Postleitzahl eingeben."),
  city: text("Ort", 100),
  country: z.literal("DE"),
  name: text("Ansprechpartner"),
  email: z
    .string()
    .trim()
    .email("Bitte eine gültige E-Mail-Adresse eingeben.")
    .max(320)
    .transform((v) => v.toLowerCase()),
  phone: text("Telefon", 50).refine(
    (v) => /^[+\d\s()/.-]+$/.test(v) && v.replace(/\D/g, "").length >= 6,
    "Bitte eine gültige Telefonnummer eingeben.",
  ),
});
export const partnerWorkSchema = z.object({
  trades: z
    .array(z.enum(PARTNER_TRADES))
    .min(1, "Bitte mindestens eine Leistung wählen.")
    .max(9)
    .refine((v) => new Set(v).size === v.length, "Leistungen bitte nur einmal auswählen."),
  other_trade: z.string().trim().max(300),
  service_area: text("Einsatzgebiet", 300),
  workforce: z.enum(["solo", "employees"], { message: "Bitte die Betriebsstruktur wählen." }),
  team_size: z
    .number({ message: "Bitte die verfügbare Teamgröße angeben." })
    .int()
    .min(1, "Mindestens eine Person angeben.")
    .max(10000),
  availability: z.enum(["sofort", "nach_absprache", "ab_datum"], {
    message: "Bitte die Verfügbarkeit wählen.",
  }),
  available_from: z.string().max(10),
  uses_subcontractors: z.boolean(),
  message: z.string().trim().max(3000),
});
const validCertificateDate = z
  .string()
  .refine(isCalendarDate, "Bitte ein gültiges Datum angeben.")
  .refine(
    (v) => v >= berlinToday(),
    "Die Bescheinigung ist abgelaufen. Bitte eine gültige Bescheinigung einreichen.",
  );
export const partnerProofSchema = z.object({
  certificate_valid_until: validCertificateDate,
  vat_certificate_valid_until: validCertificateDate,
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Bitte bestätigen Sie die Datenschutzhinweise." }),
  }),
});
function workDetails(data: z.infer<typeof partnerWorkSchema>, ctx: z.RefinementCtx) {
  if (data.trades.includes("Sonstige") && !data.other_trade)
    ctx.addIssue({
      code: "custom",
      path: ["other_trade"],
      message: "Bitte die weiteren Leistungen beschreiben.",
    });
  if (data.workforce === "solo" && data.team_size !== 1)
    ctx.addIssue({
      code: "custom",
      path: ["team_size"],
      message: "Für ein Einzelunternehmen ohne Beschäftigte bitte eine Person angeben.",
    });
  if (
    data.availability === "ab_datum" &&
    (!isCalendarDate(data.available_from) || data.available_from < berlinToday())
  )
    ctx.addIssue({
      code: "custom",
      path: ["available_from"],
      message: "Bitte heute oder ein zukünftiges Datum wählen.",
    });
}
const partnerBase = partnerCompanySchema.merge(partnerWorkSchema).merge(partnerProofSchema);
export const partnerFormSchema = partnerBase.superRefine(workDetails);
export const partnerSubmissionSchema = partnerBase
  .extend({
    request_token: z.string().uuid(),
    website: z.literal(""),
    document: applicationDocumentSchema.refine(
      (d) => /\.pdf$/i.test(d.name),
      "Bitte eine PDF-Datei mit der Endung .pdf wählen.",
    ),
    vat_document: applicationDocumentSchema.refine(
      (d) => /\.pdf$/i.test(d.name),
      "Bitte den Nachweis nach § 13b UStG als PDF mit der Endung .pdf wählen.",
    ),
  })
  .strict()
  .superRefine(workDetails);
export type PartnerFormData = z.infer<typeof partnerBase>;
export type PartnerSubmission = z.infer<typeof partnerSubmissionSchema>;
export function validatePartnerStep(input: unknown, step: number) {
  return step === 0
    ? partnerCompanySchema.safeParse(input)
    : step === 1
      ? partnerWorkSchema.superRefine(workDetails).safeParse(input)
      : partnerFormSchema.safeParse(input);
}
export type PartnerRecord = Omit<PartnerFormData, "privacy" | "vat_certificate_valid_until"> & {
  id: string;
  created_at: string;
  ticket_number: number;
  ticket_format_version: number;
  status: PartnerStatus;
  certificate_path: string;
  certificate_name: string;
  vat_certificate_valid_until: string | null;
  vat_certificate_path: string | null;
  vat_certificate_name: string | null;
  request_token: string;
  request_hash: string;
  notes: string;
  notes_version: number;
  notification_sent_at: string | null;
  notification_email_id: string | null;
  customer_confirmation_requested_at: string | null;
  customer_confirmation_sent_at: string | null;
  customer_confirmation_email_id: string | null;
  customer_confirmation_payload: import("@/integrations/supabase/types").Json | null;
};
export function partnerAvailability(
  record: Pick<PartnerFormData, "availability" | "available_from">,
) {
  return record.availability === "sofort"
    ? "Ab sofort"
    : record.availability === "nach_absprache"
      ? "Nach Absprache"
      : `Ab ${record.available_from.split("-").reverse().join(".")}`;
}
