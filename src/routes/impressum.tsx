import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { Building2, Phone, Mail, MapPin, Scale, FileText } from "lucide-react";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – Loni Galabau GmbH" },
      { name: "description", content: "Impressum und Pflichtangaben gemäß § 5 TMG der Loni Galabau GmbH, Hattersheim am Main." },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Rechtliches"
        title={<>Impressum</>}
        lead="Pflichtangaben gemäß § 5 TMG und § 55 RStV."
      />

      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          <Card icon={Building2} title="Anbieter">
            <p>Loni Galabau GmbH</p>
            <p>Auf der Roos 3</p>
            <p>65795 Hattersheim am Main</p>
          </Card>

          <Card icon={MapPin} title="Geschäftsführung">
            <p>Valon Sinanaj</p>
            <p className="text-sm text-foreground/60 mt-1">Vertretungsberechtigter Geschäftsführer</p>
          </Card>

          <Card icon={Phone} title="Kontakt">
            <p>
              Telefon: <a href="tel:+4961909266134" className="underline decoration-accent underline-offset-2">06190 9266134</a>
            </p>
            <p>
              E-Mail: <a href="mailto:info@loni-galabau.de" className="underline decoration-accent underline-offset-2">info@loni-galabau.de</a>
            </p>
          </Card>

          <Card icon={FileText} title="Registereintrag">
            <p>Eingetragen im Handelsregister</p>
            <p>Registergericht: Amtsgericht Frankfurt am Main</p>
            <p className="text-sm text-foreground/60 mt-1">Registernummer und USt-IdNr. werden auf Anfrage mitgeteilt.</p>
          </Card>

          <Card icon={Scale} title="Berufsbezeichnung" className="md:col-span-2">
            <p>Garten- und Landschaftsbau</p>
            <p>Mitglied im Fachverband Garten-, Landschafts- und Sportplatzbau Hessen-Thüringen e. V.</p>
          </Card>

          <Card icon={Mail} title="Verantwortlich i. S. d. § 55 Abs. 2 RStV" className="md:col-span-2">
            <p>Valon Sinanaj, Auf der Roos 3, 65795 Hattersheim am Main</p>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-10 space-y-6 text-sm text-foreground/70 leading-relaxed">
          <div>
            <h3 className="font-serif text-lg text-brand mb-2">Haftung für Inhalte</h3>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
              Nach §§ 8 bis 10 TMG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-brand mb-2">Haftung für Links</h3>
            <p>
              Unser Angebot enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-brand mb-2">Urheberrecht</h3>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung
              und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-brand mb-2">Streitschlichtung</h3>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="underline decoration-accent underline-offset-2">
                ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Card({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface border border-brand/10 rounded-3xl p-7 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-brand/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand" />
        </div>
        <h2 className="font-serif text-lg text-brand">{title}</h2>
      </div>
      <div className="text-foreground/80 leading-relaxed space-y-0.5">{children}</div>
    </div>
  );
}
