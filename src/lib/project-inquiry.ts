import { contactSchema } from "./validators";

export const INQUIRY_SERVICES = [
  "Gartengestaltung",
  "Pflasterarbeiten",
  "Natursteinarbeiten",
  "Rasenanlagen",
  "Zaunarbeiten",
  "Bewässerungsanlagen",
  "Erdarbeiten",
  "Entwässerung",
  "Gartenpflege",
  "Noch unsicher",
];
export const PROJECT_TYPES = ["Privatgarten", "Gewerbe", "Außenanlage", "Sanierung"];
export const TIMEFRAMES = ["So bald wie möglich", "1–3 Monate", "3–6 Monate", "Flexibel"];
export const BUDGETS = [
  "< 10.000 €",
  "10.000 – 25.000 €",
  "25.000 – 50.000 €",
  "50.000 € +",
  "Noch unklar",
];
export const CHANNELS = ["E-Mail", "Telefon", "WhatsApp"];
export type InquiryStep = 0 | 1 | 2;
export type InquiryForm = {
  service: string;
  projectType: string;
  area: string;
  timeframe: string;
  budget: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  zip: string;
  channel: string;
  consent: boolean;
};
export type InquiryErrors = Partial<Record<keyof InquiryForm, string>>;
export const INITIAL_INQUIRY: InquiryForm = {
  service: "",
  projectType: "Privatgarten",
  area: "",
  timeframe: "Flexibel",
  budget: "",
  description: "",
  name: "",
  email: "",
  phone: "",
  zip: "",
  channel: "E-Mail",
  consent: false,
};

export function validateInquiryStep(form: InquiryForm, step: InquiryStep): InquiryErrors {
  const errors: InquiryErrors = {};
  if (step === 0 && !INQUIRY_SERVICES.includes(form.service)) {
    errors.service = "Bitte wählen Sie einen Bereich. Auch „Noch unsicher“ ist möglich.";
  }
  if (step === 1) {
    if (!form.description.trim())
      errors.description = "Beschreiben Sie kurz, was Sie sich wünschen.";
    else if (form.description.length > 4000)
      errors.description = "Bitte verwenden Sie höchstens 4.000 Zeichen.";
    if (form.area && (!/^\d{1,10}$/.test(form.area) || Number(form.area) <= 0)) {
      errors.area = "Bitte geben Sie eine Fläche größer als 0 an oder lassen Sie das Feld frei.";
    }
  }
  if (step === 2) {
    if (!contactSchema.shape.name.safeParse(form.name).success)
      errors.name = "Bitte geben Sie Ihren Namen an (max. 200 Zeichen).";
    if (!contactSchema.shape.email.safeParse(form.email).success)
      errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (!contactSchema.shape.phone.safeParse(form.phone).success)
      errors.phone = "Bitte verwenden Sie höchstens 50 Zeichen.";
    else if (form.channel !== "E-Mail" && !/\d{3}/.test(form.phone.replace(/\D/g, ""))) {
      errors.phone = "Für diesen Kontaktweg benötigen wir Ihre Telefonnummer.";
    }
    if (!form.consent) errors.consent = "Bitte bestätigen Sie die Datenschutzhinweise.";
  }
  return errors;
}

export function buildInquiryPayload(form: InquiryForm) {
  return contactSchema.parse({
    name: form.name,
    email: form.email,
    phone: form.phone,
    subject: "Projektanfrage: " + form.service + " – " + form.projectType,
    message: [
      "Leistungsbereich: " + form.service,
      "Projekttyp: " + form.projectType,
      form.area && "Fläche: " + form.area + " m²",
      "Zeitraum: " + form.timeframe,
      form.budget && "Budget: " + form.budget,
      form.zip.trim() && "PLZ/Ort: " + form.zip.trim(),
      "Bevorzugter Kontakt: " + form.channel,
      "Beschreibung:",
      form.description.trim(),
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
