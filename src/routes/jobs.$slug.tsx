import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/site/PageShell";
import { getJobBySlug, createApplication, publicUploadFile } from "@/lib/site.functions";
import { applicationSchema } from "@/lib/validators";
import { supabase } from "@/integrations/supabase/client";

const jobQuery = (slug: string) =>
  queryOptions({ queryKey: ["job", slug], queryFn: () => getJobBySlug({ data: { slug } }) });

export const Route = createFileRoute("/jobs/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `Stelle: ${params.slug} – Loni Galabau GmbH` }],
  }),
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
        <Link to="/jobs" className="mt-6 inline-block text-accent">← Alle Stellen</Link>
      </div>
    </PageShell>
  ),
});

function Page() {
  const { slug } = Route.useParams();
  const { data: job } = useSuspenseQuery(jobQuery(slug));
  const apply = useServerFn(createApplication);
  const uploadFn = useServerFn(publicUploadFile);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "loading">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!job) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      let cvPath = "";
      if (file) {
        if (file.size > 10 * 1024 * 1024) throw new Error("Lebenslauf max. 10 MB");
        const ext = file.name.split(".").pop() || "pdf";
        const path = `${job.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        
        // Convert file to base64 safely
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Lesefehler"));
          reader.readAsDataURL(file);
        });

        const { path: uploadedPath } = await uploadFn({
          data: { bucket: "cvs", path, base64, contentType: file.type }
        });
        cvPath = uploadedPath;
      }
      const parsed = applicationSchema.parse({ job_id: job.id, ...form, cv_path: cvPath });
      await apply({ data: parsed });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", message: "" });
      setFile(null);
    } catch (err: unknown) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  }

  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-4xl mx-auto py-10">
          <Link to="/jobs" className="text-sm opacity-60 hover:opacity-100">← Alle Stellen</Link>
          <h1 className="font-serif text-5xl md:text-6xl mt-6">{job.title}</h1>
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

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto bg-surface rounded-[2rem] p-8 md:p-12 border border-brand/5 shadow-sm">
          <h2 className="font-serif text-3xl">Jetzt bewerben</h2>
          <p className="opacity-70 mt-2">Senden Sie uns Ihre Unterlagen direkt über das Formular.</p>

          {status === "ok" ? (
            <div className="mt-8 p-6 bg-accent/15 rounded-2xl">
              <p className="font-medium">Vielen Dank für Ihre Bewerbung! Wir melden uns zeitnah bei Ihnen.</p>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              <Field label="Name *">
                <input required maxLength={200} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="E-Mail *">
                  <input required type="email" maxLength={320} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
                </Field>
                <Field label="Telefon">
                  <input maxLength={50} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
                </Field>
              </div>
              <Field label="Nachricht">
                <textarea maxLength={5000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" />
              </Field>
              <Field label="Lebenslauf (PDF, max. 10 MB)">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
              </Field>
              {status === "err" && <p className="text-sm text-red-600">Fehler: {errorMsg}</p>}
              <button type="submit" disabled={status === "loading"} className="bg-brand text-brand-foreground px-7 py-3 rounded-full text-sm font-medium hover:bg-brand/90 disabled:opacity-50">
                {status === "loading" ? "Wird gesendet…" : "Bewerbung absenden"}
              </button>
            </form>
          )}
        </div>
      </section>

      <style>{`
        .input { width: 100%; background: white; border: 1px solid color-mix(in oklab, var(--brand) 10%, transparent); border-radius: 1rem; padding: 0.75rem 1rem; font-size: 0.95rem; }
        .input:focus { outline: none; border-color: var(--accent); }
      `}</style>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest opacity-60 mb-2">{label}</span>
      {children}
    </label>
  );
}
