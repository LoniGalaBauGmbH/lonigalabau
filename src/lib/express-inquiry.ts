import { z } from "zod";
import { contactAttachmentsSchema } from "./contact-attachments";
import { discoverySourceSchema } from "./lead-qualification";
import { inquiryPageSchema } from "./inquiry-page";

export const EXPRESS_SERVICES = [
  "Gartengestaltung",
  "Pflasterarbeiten",
  "Natursteinarbeiten",
  "Bewässerungsanlagen",
  "Zaunbau & Sichtschutz",
  "Rasenanlagen",
  "Erdarbeiten",
  "Spielplatzbau",
  "Entwässerung",
  "Mehrere Leistungen / Beratung",
  "Sonstiges",
] as const;

const contact = z.object({
  firstName: z.string().trim().min(1, "Bitte geben Sie Ihren Vornamen ein.").max(90),
  lastName: z.string().trim().min(1, "Bitte geben Sie Ihren Nachnamen ein.").max(90),
  phone: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie Ihre Telefonnummer ein.")
    .max(50)
    .refine(
      (value) =>
        /^\+?[\d\s()/.-]+$/.test(value) &&
        value.replace(/\D/g, "").length >= 7 &&
        value.replace(/\D/g, "").length <= 15,
      "Bitte geben Sie eine gültige Telefonnummer ein.",
    ),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein.").max(320),
});
const project = z.object({
  service: z.enum(EXPRESS_SERVICES, {
    errorMap: () => ({ message: "Bitte wählen Sie eine Leistung aus." }),
  }),
  address: z
    .string()
    .trim()
    .max(300, "Die Adresse darf höchstens 300 Zeichen enthalten.")
    .default(""),
  description: z
    .string()
    .trim()
    .min(10, "Beschreiben Sie Ihr Vorhaben bitte mit mindestens 10 Zeichen.")
    .max(3000, "Bitte beschränken Sie die Beschreibung auf 3.000 Zeichen."),
});
const consent = z.object({
  discoverySource: discoverySourceSchema,
  privacy: z.boolean().refine(Boolean, "Bitte bestätigen Sie die Datenschutzhinweise."),
  website: z.string().max(0, "Die Anfrage konnte nicht angenommen werden.").default(""),
});
export const expressInquirySchema = contact.merge(project).merge(consent);
export const expressSubmissionSchema = expressInquirySchema
  .extend({
    inquiryPage: inquiryPageSchema,
    attachments: contactAttachmentsSchema.default([]),
  })
  .strict();

export function validateExpressStep(input: unknown, step: number) {
  return [contact, project, consent][step].safeParse(input);
}

/** Only validated, server-generated metadata precedes the visitor's free text. */
export function buildExpressPayload(input: unknown) {
  const data = expressSubmissionSchema.parse(input);
  return {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: data.phone,
    subject: `Express-Anfrage: ${data.service}`,
    message: [
      "EXPRESS-ANFRAGE · Projektübersicht",
      `Gewünschte Leistung: ${data.service}`,
      `Projektadresse: ${data.address.replace(/[\r\n]+/g, ", ") || "Noch nicht angegeben"}`,
      "",
      "Beschreibung:",
      data.description,
    ].join("\n"),
    attachments: data.attachments,
    discoverySource: data.discoverySource,
    inquiryPage: data.inquiryPage,
  };
}
