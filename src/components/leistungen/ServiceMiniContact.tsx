import { useState, useId } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { createContactRequest } from "@/lib/site.functions";
import { contactSchema } from "@/lib/validators";

export function ServiceMiniContact({ serviceTitle }: { serviceTitle: string }) {
  const messageId = useId();
  const submit = useServerFn(createContactRequest);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.consent) {
      setError("Bitte stimmen Sie der Datenverarbeitung zu.");
      return;
    }
    const parsed = contactSchema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: `Anfrage: ${serviceTitle}`,
      message: form.message,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Bitte Eingaben prüfen.");
      return;
    }
    try {
      setState("loading");
      await submit({ data: parsed.data });
      setState("ok");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Etwas ist schief gelaufen.");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-brand/10 bg-surface p-8 md:p-10">
        <div className="flex items-center gap-3 text-brand">
          <CheckCircle2 className="h-6 w-6 text-accent" strokeWidth={1.5} />
          <span className="eyebrow text-brand/60">Anfrage gesendet</span>
        </div>
        <h3 className="font-display font-bold text-2xl mt-4 text-brand">Vielen Dank!</h3>
        <p className="mt-3 text-foreground/70 leading-relaxed text-sm">
          Wir melden uns persönlich bei Ihnen. In dringenden Fällen erreichen Sie uns telefonisch.
        </p>
        <div className="mt-6 flex flex-col gap-2 text-sm">
          <a
            href="tel:+4961909266134"
            className="inline-flex items-center gap-2 text-brand hover:text-accent"
          >
            <Phone className="h-4 w-4" /> 06190 9266134
          </a>
          <a
            href="mailto:info@loni-galabau.de"
            className="inline-flex items-center gap-2 text-brand hover:text-accent"
          >
            <Mail className="h-4 w-4" /> info@loni-galabau.de
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-brand/10 bg-surface p-7 md:p-9 space-y-4"
    >
      <div>
        <span className="eyebrow text-accent">Direkt anfragen</span>
        <h3 className="font-display font-bold text-[clamp(1.25rem,2vw,1.625rem)] mt-3 text-brand leading-[1.15]">
          Ihr Projekt, unser Handwerk.
        </h3>
        <p className="mt-2 text-sm text-foreground/65">
          Schildern Sie uns Ihr Vorhaben – wir besprechen die nächsten Schritte.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Field
          label="Ihr Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <Field
          label="E-Mail"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <Field
          label="Telefon (optional)"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        />
        <div>
          <label
            htmlFor={messageId}
            className="block text-xs font-medium tracking-wider uppercase text-brand/70 mb-1.5"
          >
            Ihre Nachricht
          </label>
          <textarea
            id={messageId}
            minLength={10}
            maxLength={5000}
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder={`Worum geht es bei Ihrem ${serviceTitle}-Projekt?`}
            className="w-full rounded-lg border border-brand/15 bg-background px-3.5 py-2.5 text-sm placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-xs text-foreground/70 leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-brand/30 text-accent focus:ring-accent"
        />
        <span>
          Ich stimme der Verarbeitung meiner Daten gemäß{" "}
          <Link to="/datenschutz" className="underline hover:text-brand">
            Datenschutzerklärung
          </Link>{" "}
          zu.
        </span>
      </label>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 bg-brand text-brand-foreground py-3.5 rounded-full text-sm font-semibold hover:bg-brand/90 transition disabled:opacity-60"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Wird gesendet…
          </>
        ) : (
          "Anfrage senden"
        )}
      </button>

      <p className="flex items-center gap-2 text-[11px] text-foreground/55">
        <ShieldCheck className="h-3.5 w-3.5" />
        Ihre Daten werden vertraulich behandelt.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium tracking-wider uppercase text-brand/70 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "name"}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-brand/15 bg-background px-4 py-3 text-sm placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
      />
    </div>
  );
}
