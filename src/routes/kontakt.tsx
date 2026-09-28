import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { ProjectInquiryForm } from "@/components/site/ProjectInquiryForm";
import { company } from "@/lib/company";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt | Loni GalaBau in Hattersheim" },
      {
        name: "description",
        content:
          "Ihr Kontakt zu Loni GalaBau: 06190 9266134, info@loni-galabau.de. Montag bis Freitag von 7 bis 18 Uhr.",
      },
    ],
  }),
  component: ContactPage,
});
function ContactPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Kontakt"
        title={
          <>
            Erzählen Sie uns
            <br />
            von Ihrem Vorhaben.
          </>
        }
        lead="Rufen Sie uns an, schreiben Sie uns oder nutzen Sie das Anfrageformular."
      />
      <section className="site-width grid md:grid-cols-3 gap-8 border-y border-brand/20 py-9">
        <div>
          <h2 className="eyebrow mb-3">Telefon</h2>
          <a className="text-xl font-medium hover:underline" href={company.phoneHref}>
            {company.phone}
          </a>
          <p className="text-sm text-foreground/65 mt-2">{company.hours}</p>
        </div>
        <div>
          <h2 className="eyebrow mb-3">E-Mail</h2>
          <a
            className="text-lg font-medium break-all hover:underline"
            href={`mailto:${company.email}`}
          >
            {company.email}
          </a>
          <p className="text-sm text-foreground/65 mt-2">Für Anfragen und Unterlagen</p>
        </div>
        <div>
          <h2 className="eyebrow mb-3">Unser Standort</h2>
          <address className="not-italic">
            {company.street}
            <br />
            {company.city}
          </address>
          <a
            href="https://maps.google.com/?q=Auf+der+Roos+3,+65795+Hattersheim"
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-4 mt-2 inline-block"
          >
            Route in Google Maps öffnen
          </a>
        </div>
      </section>
      <section id="formular" className="site-width section-space scroll-mt-24">
        <ProjectInquiryForm />
      </section>
    </PageShell>
  );
}
