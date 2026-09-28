import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "AGB – Loni Galabau GmbH" },
      { name: "description", content: "Allgemeine Geschäftsbedingungen der Loni Galabau GmbH für Garten- und Landschaftsbauleistungen." },
    ],
  }),
  component: AGBPage,
});

const SECTIONS = [
  {
    h: "§ 1 Geltungsbereich",
    p: "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für sämtliche Verträge, Lieferungen und sonstigen Leistungen der Loni Galabau GmbH (nachfolgend „Auftragnehmer“). Abweichende Bedingungen des Auftraggebers werden nur durch ausdrückliche schriftliche Bestätigung Vertragsbestandteil.",
  },
  {
    h: "§ 2 Angebot und Vertragsschluss",
    p: "Angebote des Auftragnehmers sind freibleibend und unverbindlich. Ein Vertrag kommt erst mit schriftlicher Auftragsbestätigung oder Beginn der Leistungsausführung zustande. Maßgeblich für Inhalt und Umfang der Leistungen ist die Auftragsbestätigung.",
  },
  {
    h: "§ 3 Leistungsausführung",
    p: "Die Ausführung erfolgt nach den anerkannten Regeln der Technik sowie den einschlägigen DIN-Normen und Richtlinien des Garten-, Landschafts- und Sportplatzbaus. Termine sind verbindlich, wenn sie schriftlich als solche bestätigt wurden. Witterungsbedingte Verzögerungen berechtigen nicht zu Schadensersatzansprüchen.",
  },
  {
    h: "§ 4 Preise und Zahlungsbedingungen",
    p: "Alle Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer. Rechnungen sind innerhalb von 14 Tagen nach Zugang ohne Abzug zahlbar. Bei Großaufträgen sind Teilrechnungen entsprechend dem Baufortschritt zulässig.",
  },
  {
    h: "§ 5 Abnahme",
    p: "Die Abnahme der Leistung erfolgt unmittelbar nach Fertigstellung. Erfolgt keine ausdrückliche Abnahme innerhalb von 12 Werktagen nach Anzeige der Fertigstellung, gilt die Leistung als abgenommen.",
  },
  {
    h: "§ 6 Gewährleistung",
    p: "Die Gewährleistungsfrist beträgt für Bauleistungen vier Jahre, für Pflegeleistungen ein Jahr. Bei berechtigten Mängelrügen leistet der Auftragnehmer nach eigener Wahl Nachbesserung oder Ersatzlieferung. Für eingebrachte Pflanzen wird eine Anwuchsgarantie nur bei beauftragter Fertigstellungspflege übernommen.",
  },
  {
    h: "§ 7 Haftung",
    p: "Der Auftragnehmer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit. Im Übrigen ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.",
  },
  {
    h: "§ 8 Eigentumsvorbehalt",
    p: "Gelieferte Materialien bleiben bis zur vollständigen Bezahlung Eigentum des Auftragnehmers.",
  },
  {
    h: "§ 9 Schlussbestimmungen",
    p: "Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort und Gerichtsstand ist – soweit gesetzlich zulässig – Hattersheim am Main. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
  },
];

function AGBPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Rechtliches"
        title={<>Allgemeine <span className="italic font-light">Geschäfts­bedingungen</span></>}
        lead="Verbindliche Grundlage für unsere Zusammenarbeit – transparent und nachvollziehbar formuliert."
      />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto grid gap-6">
          {SECTIONS.map((s, i) => (
            <article key={s.h} className="bg-surface rounded-3xl p-7 md:p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-serif text-xl md:text-2xl text-brand">{s.h}</h2>
              </div>
              <p className="mt-4 text-foreground/75 leading-relaxed">{s.p}</p>
            </article>
          ))}
          <p className="text-xs text-foreground/50 text-center pt-4">Stand: {new Date().getFullYear()}</p>
        </div>
      </section>
    </PageShell>
  );
}
