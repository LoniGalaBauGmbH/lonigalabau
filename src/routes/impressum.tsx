import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { company } from "@/lib/company";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum | Loni GalaBau GmbH" },
      {
        name: "description",
        content: "Anbieterangaben der Loni GalaBau GmbH, Hattersheim am Main.",
      },
    ],
  }),
  component: Page,
});
function Page() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Rechtliches"
        title="Impressum"
        lead="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)."
      />
      <section className="site-width pb-24">
        <div className="max-w-3xl space-y-9 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold mb-3">{company.name}</h2>
            <p>
              {company.street}
              <br />
              {company.city}
              <br />
              Deutschland
            </p>
            <p className="mt-3">Vertreten durch den Geschäftsführer: {company.director}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
            <p>
              Telefon:{" "}
              <a className="underline underline-offset-4" href={company.phoneHref}>
                {company.phone}
              </a>
              <br />
              E-Mail:{" "}
              <a className="underline underline-offset-4" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Handelsregister</h2>
            <p>
              Registernummer: {company.register}
              <br />
              Registergericht: {company.court}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Berufsangaben</h2>
            <p>Berufsbezeichnung: Garten- und Landschaftsbau</p>
            <p className="mt-3">
              Zuständige Berufsgenossenschaft:
              <br />
              Sozialversicherung für Landwirtschaft, Forsten und Gartenbau (SVLFG)
              <br />
              Weißensteinstraße 70–72
              <br />
              34131 Kassel
              <br />
              Deutschland
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
