import { z } from "zod";

export const CALLBACK_TIMES = Array.from(
  { length: 22 },
  (_, i) => `${String(7 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
);

export function berlinClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (key: string) => parts.find((part) => part.type === key)!.value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function callbackDateError(date: string, now = new Date()): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Bitte wählen Sie ein Datum.";
  const day = new Date(`${date}T12:00:00Z`);
  if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== date)
    return "Bitte wählen Sie ein gültiges Datum.";
  if (date < berlinClock(now).date) return "Bitte wählen Sie einen zukünftigen Tag.";
  if ([0, 6].includes(day.getUTCDay())) return "Wir rufen montags bis freitags zurück.";
}

export function callbackTimeError(
  date: string,
  time: string,
  now = new Date(),
): string | undefined {
  if (!CALLBACK_TIMES.includes(time)) return "Bitte wählen Sie eine Uhrzeit zwischen 7 und 18 Uhr.";
  const clock = berlinClock(now);
  const requested = Date.parse(`${date}T${time}:00Z`);
  const earliest =
    Date.parse(`${clock.date}T${clock.time}:00Z`) +
    now.getUTCSeconds() * 1000 +
    now.getUTCMilliseconds() +
    60 * 60 * 1000;
  if (!Number.isFinite(requested) || requested < earliest)
    return "Bitte geben Sie uns mindestens eine Stunde Vorlauf.";
}

export const callbackSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Bitte geben Sie Ihren Vornamen ein.")
      .max(90)
      .regex(/^[^\r\n]+$/),
    lastName: z
      .string()
      .trim()
      .min(1, "Bitte geben Sie Ihren Nachnamen ein.")
      .max(90)
      .regex(/^[^\r\n]+$/),
    phone: z
      .string()
      .trim()
      .min(1, "Bitte geben Sie Ihre Telefonnummer ein.")
      .max(50)
      .regex(/^\+?[\d\s()/.-]+$/, "Bitte prüfen Sie Ihre Telefonnummer.")
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      }, "Bitte geben Sie eine vollständige Telefonnummer ein."),
    email: z
      .string()
      .trim()
      .max(320)
      .email("Bitte prüfen Sie Ihre E-Mail-Adresse.")
      .or(z.literal(""))
      .default(""),
    date: z.string().min(1, "Bitte wählen Sie ein Datum.").max(10),
    time: z.string().min(1, "Bitte wählen Sie eine Uhrzeit.").max(5),
    privacy: z.literal(true, {
      errorMap: () => ({ message: "Bitte bestätigen Sie die Datenschutzhinweise." }),
    }),
    website: z.string().max(0, "Die Anfrage konnte nicht verarbeitet werden.").default(""),
  })
  .strict();

export type CallbackInput = z.infer<typeof callbackSchema>;

export function validateCallbackStep(input: unknown, step: number) {
  if (step === 0)
    return callbackSchema.pick({ firstName: true, lastName: true }).strip().safeParse(input);
  if (step === 1) return callbackSchema.pick({ phone: true, email: true }).strip().safeParse(input);
  return validateCallback(input);
}

export function validateCallback(input: unknown, now = new Date()) {
  return callbackSchema
    .superRefine((data, context) => {
      const dateError = callbackDateError(data.date, now);
      const timeError = callbackTimeError(data.date, data.time, now);
      if (dateError) context.addIssue({ code: "custom", path: ["date"], message: dateError });
      if (timeError) context.addIssue({ code: "custom", path: ["time"], message: timeError });
    })
    .safeParse(input);
}

export function formatCallbackDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function buildCallbackRecord(data: CallbackInput) {
  return {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email || null,
    phone: data.phone,
    subject: "Rückrufwunsch: " + formatCallbackDate(data.date) + " · " + data.time + " Uhr",
    message: [
      "RÜCKRUF · Wunschzeitpunkt",
      `Vorname: ${data.firstName}`,
      `Nachname: ${data.lastName}`,
      `Wunschdatum: ${formatCallbackDate(data.date)}`,
      `Wunschuhrzeit: ${data.time} Uhr (Europe/Berlin)`,
      "Der Wunschzeitpunkt ist keine verbindliche Terminbuchung.",
      "Datenschutzhinweise zur Bearbeitung bestätigt.",
    ].join("\n"),
    image_paths: [],
    ticket_format_version: 2,
    ...(!data.email ? { customer_confirmation_requested_at: null } : {}),
  };
}
