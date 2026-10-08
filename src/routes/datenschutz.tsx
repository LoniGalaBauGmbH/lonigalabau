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
    "partneranfragen",
    "Bewerbungen als Nachunternehmen",
    "Bei einer Partnerbewerbung verarbeiten wir Firmen- und Kontaktdaten, Leistungen, Einsatzgebiete, Kapazitäten, Verfügbarkeit, Angaben zum Einsatz weiterer Nachunternehmen sowie die Freistellungsbescheinigung nach § 48b EStG und den Nachweis nach § 13b UStG (USt 1 TG) mit ihren angegebenen Gültigkeitsdaten. Die Angaben dienen der Prüfung einer möglichen geschäftlichen Zusammenarbeit. Bei Einzelunternehmen erfolgt die vorvertragliche Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO; bei Ansprechpartnern anderer Unternehmen stützen wir uns auf unser berechtigtes Interesse an der Anbahnung und Organisation von Geschäftsbeziehungen (Art. 6 Abs. 1 lit. f DSGVO). Ohne die gekennzeichneten Pflichtangaben und die Nachweise kann diese Bewerbung nicht bearbeitet werden. Zugriff erhalten nur die zuständigen Personen bei Loni. Die Nachweise werden privat gespeichert und intern über geschützte, zeitlich begrenzte Downloadlinks geöffnet; sie werden nicht an die interne Benachrichtigungsmail angehängt. Sie erhalten eine Eingangsbestätigung mit einer Vorgangsnummer. Die Prüfung erfolgt persönlich. Es gibt keine automatische Auftragszusage und keine automatische Aufnahme in einen Werbeverteiler. Nach Abschluss der Prüfung werden nicht mehr erforderliche Daten und Dokumente unter Berücksichtigung gesetzlicher Aufbewahrungspflichten und berechtigter rechtlicher Interessen gelöscht. Für eine spätere Zusammenarbeit erforderliche weitere Nachweise fordern wir gesondert an.",
  ],
  [
    "verantwortlich",
    "Verantwortlicher",
    "Loni GalaBau GmbH, Auf der Roos 3, 65795 Hattersheim am Main, Deutschland. Vertreten durch den Geschäftsführer Valon Sinanaj. Bei Fragen zum Datenschutz erreichen Sie uns unter info@loni-galabau.de oder 06190 9266134.",
  ],
  [
    "hosting",
    "Bereitstellung der Website",
    "Beim Abruf werden insbesondere IP-Adresse, Zeitpunkt, aufgerufene Adresse, Browserinformationen und technische Fehlerdaten verarbeitet, um die Website auszuliefern und Angriffe abzuwehren. Die Veröffentlichung erfolgt über Sites von OpenAI unter Einsatz der Cloudflare-Infrastruktur. Zum Schutz vor automatisierten Zugriffen setzt die Hosting-Infrastruktur das Cookie __cf_bm ein. Es läuft laut Cloudflare nach 30 Minuten Inaktivität ab und dient nicht der Werbemessung. Grundlage ist unser berechtigtes Interesse an einer sicheren und funktionsfähigen Website (Art. 6 Abs. 1 lit. f DSGVO).",
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
    "Anfragen, Bewerbungen und Anhänge werden im zugriffsgeschützten Supabase-Projekt der Website gespeichert. Für dieses Projekt ist die Region EU-West (Irland) eingerichtet. Über Resend erhalten Sie eine automatische Eingangsbestätigung an die angegebene E-Mail-Adresse. Die Nachricht enthält eine Vorgangsnummer und Hinweise zur weiteren Bearbeitung. Wir speichern Empfängeradresse, vorbereiteten Bestätigungstext, Versandkennung und Zustellungsstatus, um den Versand nachvollziehen und bei Fehlern wiederholen zu können. Öffnungs- und Klicktracking sind deaktiviert; Logos und Bilder sind direkt in die E-Mail eingebettet. Interne Benachrichtigungen einschließlich der eingereichten Unterlagen (ausgenommen die privat gespeicherten Nachweise bei Partnerbewerbungen) werden ebenfalls über Resend an webseite@loni-galabau.de übermittelt. Die Bearbeitung im Postfach erfolgt über Microsoft 365. Öffentliche Website-Bilder werden teilweise ebenfalls aus unserem Supabase-Speicher geladen. Dabei erhält Supabase die für die Bildauslieferung erforderlichen Verbindungsdaten. Diese technischen Dienstleister erhalten die für ihre jeweilige Aufgabe erforderlichen Daten. Eine EU-Region schließt mögliche Zugriffe aus anderen Ländern, beispielsweise für Support, nicht grundsätzlich aus.",
  ],
  [
    "missbrauchsschutz",
    "Schutz der Formulare vor Missbrauch",
    "Zur Begrenzung automatisierter oder wiederholter Einsendungen verarbeiten wir vorübergehend Ihre IP-Adresse und die eingegebene E-Mail-Adresse. In der Datenbank werden daraus mit einem geheimen Schlüssel abgeleitete Kennwerte gespeichert, nicht die IP-Adresse im Klartext. Die Zähler gelten für 15 Minuten; abgelaufene Einträge werden beim nächsten Formularaufruf bereinigt. Sie dienen ausschließlich dem Schutz der Formulare und des E-Mail-Versands. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Es wird kein externer CAPTCHA-Dienst eingebunden.",
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
    "Die Anmeldung im Adminbereich verwendet technisch notwendige Sitzungsdaten. Auf ausdrücklichen Wunsch können Sie einen Gartenplaner-Entwurf auf Ihrem Gerät speichern. Er ist sieben Tage wiederherstellbar. Abgelaufene oder ungültige Entwürfe werden beim nächsten Aufruf des Gartenplaners entfernt. Name, E-Mail, Telefon, Anschrift, Freitext, Termindetails und Anhänge werden dabei nicht gespeichert. Sie können den Entwurf im Gartenplaner oder über die Browser-Einstellungen löschen. Der Zugriff auf notwendige Speicherdaten richtet sich nach § 25 Abs. 2 Nr. 2 TDDDG; für die ausdrücklich angeforderte Entwurfsfunktion erfolgt die Speicherung erst durch Ihren Klick.",
  ],
  [
    "google-maps",
    "Google-Maps-Karten auf den Ortsseiten",
    "Auf unseren Ortsseiten können Sie eine Google-Maps-Karte des jeweiligen Ortes anzeigen. Vor dem Klick auf „Google-Maps-Karte anzeigen“ wird keine Karte und keine Verbindung zu Google geladen. Mit dem Klick willigen Sie in das Laden der Karte ein. Dabei erhält Google unter anderem Ihre IP-Adresse und technische Browserinformationen; Google kann Cookies oder vergleichbare Speichertechniken verwenden. Anbieter für Nutzer im Europäischen Wirtschaftsraum ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Eine Verarbeitung durch Google-Unternehmen in anderen Ländern, auch den USA, ist möglich. Grundlage für das optionale Laden ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO sowie § 25 Abs. 1 TDDDG, soweit Speichertechniken eingesetzt werden). Die Freigabe gilt nur für die aktuell geöffnete Ortsseite und wird nicht dauerhaft gespeichert. Über „Karte ausblenden“ können Sie die Einbindung für die Zukunft beenden. Bereits an Google übermittelte Daten werden dadurch nicht zurückgerufen. Stattdessen können Sie den Ort auch über den Kartenlink öffnen.",
  ],
  [
    "externe",
    "Schriften, Kartenlinks und WhatsApp",
    "Die Schriftarten werden von dieser Website geladen. Bei externen Kartenlinks wird erst beim Öffnen eine Verbindung zu Google Maps beziehungsweise OpenStreetMap hergestellt. Der WhatsApp-Button ist ein externer Link; vor dem Anklicken wird darüber keine Verbindung zu WhatsApp aufgebaut. Bei der Nutzung gelten zusätzlich die Datenschutzinformationen des gewählten Anbieters. Alternativ können Sie Telefon, E-Mail und das Kontaktformular verwenden.",
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
      <section className="px-6 pb-16 md:pb-24">
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
                {id === "google-maps" && (
                  <p className="mt-4">
                    <a
                      href="https://policies.google.com/privacy?hl=de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 text-brand"
                    >
                      Datenschutzhinweise von Google
                    </a>
                  </p>
                )}
              </article>
            ))}
            <p className="text-sm text-foreground/75">Stand: 5. Oktober 2026</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
