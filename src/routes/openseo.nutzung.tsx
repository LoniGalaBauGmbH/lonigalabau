import { createFileRoute } from "@tanstack/react-router";
import { OpenSeoInfo } from "@/components/site/OpenSeoInfo";
export const Route = createFileRoute("/openseo/nutzung")({
  head: () => ({
    meta: [
      { title: "Nutzungshinweise für Loni OpenSEO" },
      {
        name: "description",
        content:
          "Zweck, berechtigter Nutzerkreis und Grenzen der lokal betriebenen Anwendung Loni OpenSEO.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: () => (
    <OpenSeoInfo title="Nutzungshinweise für Loni OpenSEO">
      <h2>Zweck und Nutzerkreis</h2>
      <p>
        Loni OpenSEO wird von Loni Galabau GmbH lokal für die eigene Websiteanalyse betrieben. Die
        Nutzung ist auf den Betreiber und von ihm ausdrücklich berechtigte Personen beschränkt.
        Diese Informationswebsite bietet weder eine öffentliche Registrierung noch ein
        kostenpflichtiges OpenSEO-Abonnement an.
      </p>
      <h2>Google-Verbindung</h2>
      <p>
        Verbinden Sie nur ein Konto und Properties, zu deren Auswertung Sie berechtigt sind. Die
        Freigabe ist freiwillig und kann im Google-Konto widerrufen werden. Search-Console-Daten
        werden über diesen Connector ausschließlich gelesen. Die Nutzung von Google-Diensten richtet
        sich zusätzlich nach den dafür geltenden Bedingungen von Google.
      </p>
      <h2>Ergebnisse einordnen</h2>
      <p>
        Suchleistungsdaten können verzögert, gefiltert oder unvollständig sein. Keywordwerte sind
        Schätzungen. KI-generierte Auswertungen müssen fachlich geprüft werden. Die Anwendung gibt
        keine Zusage für Indexierung, bestimmte Rankings, Besucherzahlen oder Aufträge.
      </p>
      <h2>Verantwortungsvoller Betrieb</h2>
      <p>
        Zugangsdaten sind vertraulich zu behandeln. Die lokale Anwendung darf nicht ohne geeignete
        Zugriffskontrolle öffentlich erreichbar gemacht werden. Bei optionalen KI- oder
        MCP-Auswertungen sind Datenumfang und beteiligte Empfänger vor der Nutzung zu
        berücksichtigen.
      </p>
      <h2>Fragen und Beendigung</h2>
      <p>
        Bei Fragen oder wenn eine Verbindung beendet werden soll, wenden Sie sich an{" "}
        <a href="mailto:info@loni-galabau.de">info@loni-galabau.de</a>. Die App-Datenschutzhinweise
        erläutern den Unterschied zwischen dem Trennen einer Property, dem Entfernen des lokalen
        Kontos und dem Widerruf bei Google.
      </p>
    </OpenSeoInfo>
  ),
});
