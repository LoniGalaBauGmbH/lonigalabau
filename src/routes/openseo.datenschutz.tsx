import { createFileRoute, Link } from "@tanstack/react-router";
import { OpenSeoInfo } from "@/components/site/OpenSeoInfo";
export const Route = createFileRoute("/openseo/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzhinweise für Loni OpenSEO" },
      {
        name: "description",
        content:
          "Datenzugriff, lokale Speicherung, freiwillige Auswertungen und Widerruf der Google-Verbindung in Loni OpenSEO.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: () => (
    <OpenSeoInfo title="Datenschutzhinweise für Loni OpenSEO">
      <p>
        Diese Hinweise betreffen ausschließlich die lokale, von Loni Galabau GmbH betriebene
        OpenSEO-Installation. Sie beschreiben nicht den Betrieb eines gehosteten Angebots des
        ursprünglichen Softwareanbieters. Für den Besuch dieser Informationswebsite gilt ergänzend
        unsere <Link to="/datenschutz">Website-Datenschutzerklärung</Link>.
      </p>
      <h2>Verantwortlicher und Zweck</h2>
      <p>
        Verantwortlich ist Loni Galabau GmbH, Auf der Roos 3, 65795 Hattersheim am Main. Kontakt:{" "}
        <a href="mailto:info@loni-galabau.de">info@loni-galabau.de</a>. Wir verwenden die Anwendung
        zur Analyse der Sichtbarkeit unserer Unternehmenswebsite und zur Vorbereitung von
        Verbesserungen ihrer Inhalte und Technik.
      </p>
      <h2>Welche Google-Daten verwendet werden</h2>
      <p>
        Die Verbindung erfolgt nur nach Anmeldung und Freigabe durch den Kontoinhaber. Angefordert
        werden grundlegende Profilinformationen, die E-Mail-Adresse und lesender Zugriff auf Google
        Search Console. Verarbeitet werden die Google-Konto-ID, Konto-E-Mail, zugängliche
        Website-Properties sowie Daten zu Klicks, Impressionen, Klickrate, durchschnittlicher
        Position, Suchanfragen, Seiten, Ländern, Geräten und URL-Indexprüfungen.
      </p>
      <p>
        Die Google-Berechtigung dient dieser freiwillig freigegebenen Auswertung. Die Anwendung
        erhält über diese Verbindung keinen Zugriff auf Gmail-Inhalte oder Schreibrechte in der
        Search Console.
      </p>
      <h2>Speicherung und Schutz</h2>
      <p>
        In der lokalen Anwendungsdatenbank werden Konto-ID, E-Mail-Adresse, Property-Zuordnung,
        Verknüpfungen mit dem OpenSEO-Projekt und Zeitstempel gespeichert. OAuth-Zugangs-,
        Erneuerungs- und ID-Token werden verschlüsselt abgelegt. Daraus folgt keine Verschlüsselung
        der gesamten Datenbank.
      </p>
      <p>
        Der Search-Console-Connector ruft Leistungs- und Indexdaten bei Google ab, verarbeitet sie
        und zeigt sie an. Im Connector ist dafür keine dauerhafte Ergebnisspeicherung vorgesehen.
        Gesondert gespeicherte Berichte, Exporte oder Chatverläufe können jedoch Kopien der
        abgerufenen Informationen enthalten.
      </p>
      <h2>Optionale Auswertungen und Empfänger</h2>
      <p>
        Für die Google-Verbindung kommuniziert die Anwendung mit Google. Der
        Search-Console-Connector übermittelt seine Ergebnisse nicht automatisch an DataForSEO. Die
        separate Keywordrecherche über DataForSEO ist eine andere Funktion.
      </p>
      <p>
        Wenn ein berechtigter Nutzer den optionalen KI-Assistenten mit Search-Console-Werkzeugen
        verwendet, können angeforderte Ergebnisse über OpenRouter an das jeweils konfigurierte
        Sprachmodell übermittelt und im Chatverlauf gespeichert werden. Ausdrücklich autorisierte
        externe MCP-Clients können ebenfalls angeforderte Ergebnisse erhalten. Solche Auswertungen
        sind vom Nutzer bewusst auszulösen; für beteiligte externe Dienste gelten deren jeweilige
        Datenschutz- und Speichereinstellungen. Eine pauschale Zusage, dass externe Anbieter keine
        Daten speichern, wird nicht gemacht.
      </p>
      <h2>Verbindung trennen und Freigabe widerrufen</h2>
      <ul>
        <li>„Disconnect“ trennt die Zuordnung einer Property zum OpenSEO-Projekt.</li>
        <li>
          „Remove Google account“ entfernt das lokale Google-OAuth-Konto mit seinen gespeicherten
          Token und Zuordnungen.
        </li>
        <li>
          Um auch die Google-Berechtigung zu widerrufen, entfernen Sie Loni OpenSEO zusätzlich unter
          den{" "}
          <a href="https://myaccount.google.com/connections">Verbindungen Ihres Google-Kontos</a>.
        </li>
        <li>
          Bereits angelegte Berichte, Exporte und Chatverläufe sind gesonderte Kopien und müssen
          separat gelöscht werden.
        </li>
      </ul>
      <p>
        Die Kontoverknüpfung wird für ihre eingerichtete Nutzungsdauer gespeichert. Nach ihrer
        Entfernung kann die lokale Anwendung diese gespeicherten Zugangstoken nicht weiter nutzen.
        Fragen zu vorhandenen Kopien oder zur Löschung richten Sie bitte an den oben genannten
        Kontakt.
      </p>
      <h2>Ihre Anliegen</h2>
      <p>
        Sie können sich wegen Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung
        sowie mit Fragen zu Widerspruch, Datenübertragbarkeit und dem Widerruf einer Einwilligung an
        uns wenden. Die jeweiligen gesetzlichen Voraussetzungen bleiben maßgeblich. Außerdem besteht
        das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
      </p>
    </OpenSeoInfo>
  ),
});
