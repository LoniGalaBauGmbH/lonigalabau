import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";
export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – Loni GalaBau GmbH" },
      {
        name: "description",
        content:
          "Informationen zu Kontaktformularen, Bewerbungen, Gartenplaner, Hosting und Ihren Datenschutzrechten.",
      },
    ],
  }),
  component: DatenschutzPage,
});
const SECTIONS = [
  [
    "verantwortlich",
    "Verantwortlicher",
    "Loni GalaBau GmbH, Auf der Roos 3, 65795 Hattersheim am Main, Deutschland. Vertreten durch den Geschäftsführer Valon Sinanaj. Bei Fragen zum Datenschutz erreichen Sie uns unter info@loni-galabau.de oder 06190 9266134.",
  ],
  [
    "hosting",
    "Bereitstellung der Website",
    "Beim Abruf werden insbesondere IP-Adresse, Zeitpunkt, aufgerufene Adresse, Browserinformationen und technische Fehlerdaten verarbeitet, um die Website auszuliefern und Angriffe abzuwehren. Die Veröffentlichung erfolgt über Sites von OpenAI unter Einsatz der Cloudflare-Infrastruktur. Grundlage ist unser berechtigtes Interesse an einer sicheren und funktionsfähigen Website (Art. 6 Abs. 1 lit. f DSGVO).",
  ],
  [
    "anfragen",
    "Kontaktformulare und Gartenplaner",
    "Wir verarbeiten Ihre Kontakt- und Projektdaten, Nachrichten sowie freiwillig hochgeladene Fotos und Dokumente zur Bearbeitung Ihrer Anfrage. Dazu gehören im Gartenplaner beispielsweise Grundstück, Maße, Ausstattung und Budgetrahmen. Rechtsgrundlage für vertragsbezogene Anfragen ist Art. 6 Abs. 1 lit. b DSGVO, für andere Anliegen unser berechtigtes Interesse an deren Beantwortung nach Art. 6 Abs. 1 lit. f DSGVO. Pflichtfelder sind gekennzeichnet; ohne diese Angaben können wir eine Anfrage gegebenenfalls nicht bearbeiten. Bitte laden Sie nur für das Vorhaben erforderliche Unterlagen hoch.",
  ],
  [
    "bewerbungen",
    "Bewerbungen",
    "Bewerberdaten und freiwillige Bewerbungsunterlagen werden zur Entscheidung über ein Beschäftigungsverhältnis nach § 26 Abs. 1 BDSG verarbeitet. Zugriff erhalten die mit dem Bewerbungsverfahren befassten Personen. Eine Aufnahme in einen Bewerberpool erfolgt nicht automatisch. Nach Abschluss des Verfahrens werden Unterlagen gelöscht, sobald sie nicht mehr für die Entscheidung oder zur Wahrung berechtigter rechtlicher Interessen erforderlich sind.",
  ],
  [
    "dienstleister",
    "Datenbank und E-Mail-Dienste",
    "Anfragen, Bewerbungen und Anhänge werden im zugriffsgeschützten Supabase-Projekt der Website gespeichert. Für dieses Projekt ist die Region EU-West (Irland) eingerichtet. Benachrichtigungen einschließlich der eingereichten Unterlagen werden über Resend an unser internes Postfach webseite@loni-galabau.de übermittelt. Die Bearbeitung im Postfach erfolgt über Microsoft 365. Diese technischen Dienstleister erhalten die für ihre jeweilige Aufgabe erforderlichen Daten. Eine EU-Region schließt mögliche Zugriffe aus anderen Ländern, beispielsweise für Support, nicht grundsätzlich aus.",
  ],
  [
    "ausland",
    "Verarbeitung außerhalb der EU/des EWR",
    "Bei international tätigen technischen Dienstleistern kann eine Verarbeitung außerhalb der EU beziehungsweise des EWR stattfinden. Dafür gelten die Anforderungen der Art. 44 ff. DSGVO, insbesondere ein anwendbarer Angemessenheitsbeschluss oder geeignete Garantien wie Standardvertragsklauseln. Informationen zu den für Ihre Daten eingesetzten Dienstleistern und Transfergrundlagen können Sie über die oben genannte Kontaktadresse anfordern.",
  ],
  [
    "speicherung",
    "Speicherdauer und Schutz",
    "Wir speichern personenbezogene Daten, solange sie für die genannten Zwecke erforderlich sind. Gesetzliche Aufbewahrungspflichten, etwa für Vertrags- und Rechnungsunterlagen, oder die Geltendmachung beziehungsweise Abwehr von Ansprüchen können eine längere Aufbewahrung erfordern. Nicht mehr benötigte Daten sind zu löschen. Private Anhänge werden nicht öffentlich verlinkt; berechtigte Administratoren erhalten zeitlich begrenzte Downloadlinks. Kopien in unserem E-Mail-Postfach unterliegen ebenfalls der zweckgebundenen Aufbewahrung.",
  ],
  [
    "browser",
    "Lokale Speicherung im Browser",
    "Die Anmeldung im Adminbereich verwendet technisch notwendige Sitzungsdaten. Auf ausdrücklichen Wunsch können Sie einen Gartenplaner-Entwurf für bis zu sieben Tage auf Ihrem Gerät speichern. Name, E-Mail, Telefon, Anschrift, Freitext, Termindetails und Anhänge werden dabei nicht gespeichert. Sie können den Entwurf im Gartenplaner oder über die Browser-Einstellungen löschen. Der Zugriff auf notwendige Speicherdaten richtet sich nach § 25 Abs. 2 TDDDG; für die ausdrücklich angeforderte Entwurfsfunktion erfolgt die Speicherung erst durch Ihren Klick.",
  ],
  [
    "externe",
    "Schriften, Karten und WhatsApp",
    "Die Schriftarten werden von dieser Website geladen. Karten werden nicht automatisch eingebettet. Erst beim Öffnen eines Kartenlinks wird eine Verbindung zu Google Maps beziehungsweise OpenStreetMap hergestellt. Der WhatsApp-Button ist ein externer Link; vor dem Anklicken wird darüber keine Verbindung zu WhatsApp aufgebaut. Bei der Nutzung gelten zusätzlich die Datenschutzinformationen des gewählten Anbieters. Alternativ können Sie Telefon, E-Mail und das Kontaktformular verwenden.",
  ],
  [
    "tracking",
    "Reichweitenmessung und Newsletter",
    "Auf dieser Fassung der Website werden keine Analyse- oder Werbepixel ausgeführt. Eine Newsletter-Anmeldung wird derzeit nicht angeboten. Es findet keine automatisierte Entscheidung über Ihre Anfrage oder Bewerbung und kein entsprechendes Profiling statt.",
  ],
  [
    "rechte",
    "Ihre Rechte",
    "Sie können nach Maßgabe der DSGVO Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit verlangen. Erteilte Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen; die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt. Soweit eine Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO beruht, können Sie aus Gründen Ihrer besonderen Situation widersprechen. Gegen Direktwerbung ist ein Widerspruch jederzeit möglich. Wenden Sie sich dazu an info@loni-galabau.de.",
  ],
  [
    "beschwerde",
    "Beschwerderecht",
    "Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren. Für Hessen ist dies der Hessische Beauftragte für Datenschutz und Informationsfreiheit, Gustav-Stresemann-Ring 1, 65189 Wiesbaden. Kontaktmöglichkeiten finden Sie unter datenschutz.hessen.de.",
  ],
];
function DatenschutzPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Rechtliches"
        title={<>Datenschutz</>}
        lead="Welche Daten wir verarbeiten und welche Rechte Sie haben."
      />
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
          <nav aria-label="Inhalt der Datenschutzerklärung" className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 rounded-3xl bg-surface p-6">
              <ul className="space-y-3 text-sm">
                {SECTIONS.map(([id, title]) => (
                  <li key={id}>
                    <a href={"#" + id} className="underline underline-offset-4 text-brand">
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="lg:col-span-8 space-y-10">
            {SECTIONS.map(([id, title, text]) => (
              <article key={id} id={id} className="scroll-mt-28">
                <h2 className="text-2xl font-semibold text-brand">{title}</h2>
                <p className="mt-4 leading-relaxed text-foreground/85">{text}</p>
              </article>
            ))}
            <p className="text-sm text-foreground/75">Stand: 29. September 2026</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
