import { useId, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { createContactRequest } from "@/lib/site.functions";
import { contactSchema } from "@/lib/validators";
import { company } from "@/lib/company";

const initial = { name: "", email: "", phone: "", subject: "", message: "", website: "" };
export function ProjectInquiryForm({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: () => void;
}) {
  const id = useId();
  const send = useServerFn(createContactRequest);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok">("idle");
  const update = (field: keyof typeof initial, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "", form: "" }));
  };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ||= issue.message;
      setErrors(next);
      document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setStatus("loading");
    setErrors({});
    try {
      await send({ data: parsed.data });
      setStatus("ok");
      setForm(initial);
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
      });
      setStatus("idle");
    }
  }

  if (status === "ok")
    return (
      <div role="status" className="py-14 px-6 text-center">
        <CheckCircle2 className="mx-auto text-brand mb-5" size={32} />
        <h2 className="text-3xl font-medium">Ihre Anfrage ist angekommen.</h2>
        <p className="mt-4 text-foreground/75">Wir lesen Ihre Angaben und melden uns bei Ihnen.</p>
        <button
          type="button"
          className="text-link mt-8"
          onClick={() => {
            setStatus("idle");
            onClose?.();
          }}
        >
          {isModal ? "Schließen" : "Weitere Anfrage stellen"}
        </button>
      </div>
    );

  return (
    <div className={isModal ? "p-6 md:p-10" : "grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20"}>
      <div className={isModal ? "mb-8" : ""}>
        <p className="eyebrow">Projektanfrage</p>
        <h2 className="home-heading mt-4">
          Was möchten Sie
          <br />
          verändern?
        </h2>
        <p className="mt-5 max-w-sm leading-relaxed text-foreground/75">
          Ein paar Sätze zu Ihrem Vorhaben reichen für den Anfang. Umfang, Materialien und Termine
          besprechen wir anschließend.
        </p>
        {!isModal && (
          <div className="mt-8 text-sm leading-7">
            <p>Lieber direkt sprechen?</p>
            <a href={company.phoneHref} className="text-xl text-brand font-medium">
              {company.phone}
            </a>
            <p className="text-foreground/65 mt-2">{company.hours}</p>
          </div>
        )}
      </div>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {(["name", "email"] as const).map((field) => (
            <div key={field}>
              <label htmlFor={`${id}-${field}`} className="form-label">
                {field === "name" ? "Ihr Name" : "E-Mail"} <span aria-hidden="true">*</span>
              </label>
              <input
                id={`${id}-${field}`}
                name={field}
                type={field === "email" ? "email" : "text"}
                autoComplete={field === "name" ? "name" : "email"}
                required
                maxLength={field === "name" ? 200 : 320}
                value={form[field]}
                onChange={(e) => update(field, e.target.value)}
                className="form-input"
                aria-invalid={!!errors[field]}
                aria-describedby={errors[field] ? `${id}-${field}-error` : undefined}
              />
              {errors[field] && (
                <p id={`${id}-${field}-error`} className="form-error">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${id}-phone`} className="form-label">
              Telefon <span className="font-normal text-foreground/60">(optional)</span>
            </label>
            <input
              id={`${id}-phone`}
              type="tel"
              autoComplete="tel"
              maxLength={50}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor={`${id}-subject`} className="form-label">
              Worum geht es?
            </label>
            <select
              id={`${id}-subject`}
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              className="form-input"
            >
              <option value="">Bitte wählen (optional)</option>
              {[
                "Gartengestaltung",
                "Pflasterarbeiten",
                "Natursteinarbeiten",
                "Bewässerung",
                "Zaunbau",
                "Rasenanlagen",
                "Erdarbeiten",
                "Entwässerung",
                "Sonstiges",
              ].map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-message`} className="form-label">
            Ihr Vorhaben <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${id}-message`}
            required
            maxLength={5000}
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Welche Arbeiten stehen an? Wo liegt das Grundstück?"
            className="form-input resize-y"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
          />
          {errors.message && (
            <p id={`${id}-message-error`} className="form-error">
              {errors.message}
            </p>
          )}
        </div>
        <div className="form-trap" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>
        <p className="text-xs leading-relaxed text-foreground/65">
          Wir verwenden Ihre Angaben, um Ihre Anfrage zu bearbeiten. Weitere Informationen finden
          Sie in der{" "}
          <Link to="/datenschutz" className="underline">
            Datenschutzerklärung
          </Link>
          . Mit * markierte Felder sind erforderlich.
        </p>
        {errors.form && (
          <p role="alert" className="form-error">
            {errors.form}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="primary-link disabled:opacity-60"
        >
          {status === "loading" ? "Wird gesendet…" : "Anfrage senden"} <ArrowUpRight size={18} />
        </button>
      </form>
    </div>
  );
}
