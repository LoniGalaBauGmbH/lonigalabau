import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/site/PageShell";
import { getJobBySlug, createApplication } from "@/lib/site.functions";
import { applicationSchema } from "@/lib/validators";
import { validateApplicationDocument } from "@/lib/application-document";
import { canonicalUrl, safeJsonLd } from "@/lib/seo";
import { ApplicationUpload } from "@/components/site/ApplicationUpload";

const jobQuery = (slug: string) =>
  queryOptions({
    staleTime: 60_000,
    queryKey: ["job", slug],
    queryFn: () => getJobBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/jobs/$slug")({
  head: ({ loaderData: loaded }) => {
    const loaderData = loaded as { title: string; location: string | null } | undefined;
    return {
      meta: [
        { title: `${loaderData?.title || "Stellenangebot"} – Loni GalaBau GmbH` },
        {
          name: "description",
          content: loaderData
            ? `${loaderData.title} in ${loaderData.location || "Hattersheim am Main"}. Aufgaben und Anforderungen ansehen und bei Loni GalaBau bewerben.`
            : "Aktuelle Stellenangebote bei Loni GalaBau.",
        },
      ],
    };
  },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(jobQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  component: Page,
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-5xl">Stelle nicht gefunden</h1>
        <Link to="/jobs" className="mt-6 inline-block text-accent">
          ← Alle Stellen
        </Link>
      </div>
    </PageShell>
  ),
});

function Page() {
  const { slug } = Route.useParams();
  const { data: job } = useSuspenseQuery(jobQuery(slug));
  const apply = useServerFn(createApplication);
  const submitting = useRef(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "loading">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!job) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job || submitting.current) return;
    submitting.current = true;
    setStatus("loading");
    setErrorMsg("");
    try {
      const parsed = applicationSchema.omit({ cv_path: true }).parse({ job_id: job.id, ...form });
      let document;
      if (file) {
        const problem = validateApplicationDocument(file);
        if (problem) throw new Error(problem);
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = () =>
            reject(
              new Error("Die PDF konnte nicht gelesen werden. Bitte wählen Sie sie erneut aus."),
            );
          reader.onabort = () => reject(new Error("Das Lesen der PDF wurde abgebrochen."));
          reader.readAsDataURL(file);
        });
        document = { name: file.name, base64, contentType: "application/pdf" as const };
      }
      await apply({ data: { ...parsed, document } });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "" });
      setFile(null);
    } catch (err: unknown) {
      setStatus("err");
      setErrorMsg(
        err instanceof Error && !err.message.startsWith("[")
          ? err.message
          : "Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.",
      );
    } finally {
      submitting.current = false;
    }
  }

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.description,
            datePosted: job.created_at,
            employmentType: job.employment_type === "Vollzeit" ? "FULL_TIME" : undefined,
            hiringOrganization: {
              "@type": "Organization",
              name: "Loni GalaBau GmbH",
              sameAs: "https://www.loni-galabau.de",
              logo: "https://www.loni-galabau.de/images/partner/loni.svg",
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: job.location || "Hattersheim am Main",
                addressCountry: "DE",
              },
            },
            url: canonicalUrl("/jobs/" + slug),
          }),
        }}
      />
      <section className="px-6">
        <div className="max-w-4xl mx-auto py-10">
          <Link to="/jobs" className="text-sm opacity-60 hover:opacity-100">
            ← Alle Stellen
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl mt-6 break-words hyphens-auto">
            {job.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-widest opacity-60">
            {job.location && <span>{job.location}</span>}
            {job.employment_type && <span>· {job.employment_type}</span>}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="font-serif text-2xl mb-3">Aufgaben</h2>
              <p className="opacity-80 whitespace-pre-line leading-relaxed">{job.description}</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl mb-3">Anforderungen</h2>
              <p className="opacity-80 whitespace-pre-line leading-relaxed">{job.requirements}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto bg-surface rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-sm">
          <h2 className="font-serif text-3xl">Jetzt bewerben</h2>
          <p className="opacity-70 mt-2">
            Stellen Sie sich kurz vor. Ihren Lebenslauf oder weitere Unterlagen können Sie als PDF
            ergänzen.
          </p>

          {status === "ok" ? (
            <div role="status" className="mt-8 p-6 bg-accent/15 rounded-2xl">
              <p className="font-medium">
                Vielen Dank für Ihre Bewerbung! Wir melden uns zeitnah bei Ihnen.
              </p>
            </div>
          ) : (
            <form
              className="mt-8"
              onSubmit={onSubmit}
              aria-label="Bewerbungsformular"
              aria-busy={status === "loading"}
            >
              <fieldset disabled={status === "loading"} className="min-w-0 space-y-6">
                <legend className="sr-only">Ihre Bewerbung</legend>
                <Field label="Name *">
                  <input
                    required
                    autoComplete="name"
                    maxLength={200}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                  />
                </Field>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="E-Mail *">
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      maxLength={320}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="Telefon">
                    <input
                      type="tel"
                      autoComplete="tel"
                      maxLength={50}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input"
                    />
                  </Field>
                </div>
                <Field label="Nachricht">
                  <textarea
                    maxLength={5000}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input resize-none"
                  />
                </Field>
                <ApplicationUpload file={file} onChange={setFile} disabled={status === "loading"} />
                <p className="text-sm leading-relaxed text-brand/65">
                  Ihre Angaben verwenden wir zur Bearbeitung Ihrer Bewerbung. Mehr dazu in unseren{" "}
                  <Link
                    to="/datenschutz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    Datenschutzhinweisen (neuer Tab)
                  </Link>
                  .
                </p>
                {status === "err" && (
                  <p role="alert" className="text-sm text-red-700">
                    {errorMsg} Ihre Eingaben bleiben erhalten.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 bg-brand text-brand-foreground px-7 py-3 rounded-full text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin motion-reduce:animate-none"
                        aria-hidden="true"
                      />
                      Bewerbung wird gesendet …
                    </>
                  ) : (
                    "Bewerbung absenden"
                  )}
                </button>
              </fieldset>
            </form>
          )}
        </div>
      </section>

      <style>{`
        .input { width: 100%; min-width: 0; background: white; border: 1px solid color-mix(in oklab, var(--brand) 10%, transparent); border-radius: 1rem; padding: 0.75rem 1rem; font-size: 1rem; }
        .input:focus { outline: none; border-color: var(--accent); }
      `}</style>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-brand mb-2">{label}</span>
      {children}
    </label>
  );
}
