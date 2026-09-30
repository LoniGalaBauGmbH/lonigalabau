import { createFileRoute } from "@tanstack/react-router";
import { OpenSeoInfo } from "@/components/site/OpenSeoInfo";
export const Route = createFileRoute("/openseo/")({
  head: () => ({
    meta: [
      { title: "Loni OpenSEO – Informationen zur lokalen Anwendung" },
      {
        name: "description",
        content:
          "Informationen zur lokal betriebenen SEO-Anwendung Loni OpenSEO und ihrer lesenden Google-Search-Console-Verbindung.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: () => (
    <OpenSeoInfo title="Loni OpenSEO">
      <p>
        Loni OpenSEO ist die von der Loni Galabau GmbH selbst betriebene lokale Installation von
        OpenSEO. Sie unterstützt die Analyse und Verbesserung unserer Unternehmenswebsite. Diese
        Seite informiert über die Anwendung; sie ist kein öffentlicher Zugang zum SEO-Tool.
      </p>
      <h2>Was die Google-Verbindung macht</h2>
      <p>
        Nach ausdrücklicher Anmeldung und Freigabe durch den Kontoinhaber liest die Anwendung Daten
        der verbundenen Google-Search-Console-Property. Dazu gehören Suchanfragen, Seiten, Klicks,
        Impressionen, durchschnittliche Positionen sowie Ergebnisse von URL-Indexprüfungen.
      </p>
      <p>
        Die Google-Verbindung verwendet Profil- und E-Mail-Angaben zur Zuordnung des verbundenen
        Kontos. Die Search-Console-Berechtigung ist auf Lesen beschränkt. Sie erlaubt keine
        Änderungen an Search-Console-Einstellungen und stellt keine Indexierungsanträge.
      </p>
      <h2>Lokaler Betrieb</h2>
      <p>
        Die Installation dient dem eigenen Unternehmensgebrauch. Es gibt über diese Website keine
        öffentliche Registrierung für Loni OpenSEO. Optionale KI-Assistenten oder ausdrücklich
        verwendete MCP-Verbindungen können Auswertungsdaten erhalten; Einzelheiten stehen in den
        App-Datenschutzhinweisen.
      </p>
      <h2>Betreiber und Kontakt</h2>
      <p>
        Loni Galabau GmbH
        <br />
        Auf der Roos 3<br />
        65795 Hattersheim am Main
      </p>
      <p>
        Fragen zur Anwendung und zur Google-Freigabe:{" "}
        <a href="mailto:info@loni-galabau.de">info@loni-galabau.de</a>, Telefon{" "}
        <a href="tel:+4961909266134">06190 9266134</a>.
      </p>
    </OpenSeoInfo>
  ),
});
