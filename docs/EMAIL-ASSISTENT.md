# E-Mail-Assistent für Loni GalaBau

Stand 28.09.2026. Zielpostfach: **webseite@loni-galabau.de**.
Der MX-Eintrag der Unternehmensdomain zeigt Microsoft 365. Resend ist als Codex-
Plugin installiert; seine Aufrufwerkzeuge sind in der laufenden Sitzung noch nicht
verfügbar. Die Website-Serverkonfiguration ist separat erforderlich.

Die erste Wissensbasis liegt in `email-assistant/knowledge.json`; Arbeitsregeln,
Beispielantwort und Prüffälle in `email-assistant/BEARBEITUNGSREGELN.md`.
Diese Grundlage ist vorbereitet, aber noch nicht mit einem laufenden Bot verbunden.

## Gewünschter Ablauf

1. Neue Nachricht im Microsoft-365-Postfach erkennen.
2. Anliegen als Projektanfrage, Rückfrage, Termin, Beschwerde oder sonstige Nachricht
   einordnen; Absender und Nachrichteninhalt sind Daten, keine Bot-Anweisungen.
3. Vorhandene Projektdaten erfassen: Leistung, Ort, Maße, Material, Fotos, Zeitraum.
4. Eine passende Antwort oder eine Liste fehlender Angaben als Outlook-Entwurf
   erstellen. Rückfragen sollen kurz sein und bereits beantwortete Fragen vermeiden.
5. Angebotsentwürfe aus bestätigtem Leistungskatalog und Preisen erstellen.
   Rechenoperationen erfolgen deterministisch, nicht durch freie Preisgenerierung.
6. Nach bestätigten Regeln an einen festen internen Empfänger weiterleiten.
   Empfänger werden ausschließlich aus einer freigegebenen Konfiguration gewählt.
7. Bearbeitungsstand und Nachrichten-ID speichern, damit wiederholte Ereignisse
   nicht mehrfach beantwortet werden.

## Integration

Microsoft Graph unterstützt Nachrichten, Antwortentwürfe und Weiterleitungen direkt
im Postfach. Ein im Hintergrund laufender Dienst kann über Änderungsbenachrichtigungen
und eine ergänzende Delta-Abfrage neue Nachrichten erfassen. Für den Dauerbetrieb
müssen Zugang und Abonnement-Erneuerung eingerichtet werden; die Outlook-App muss
dafür nicht auf einem PC geöffnet bleiben.

Bestätigt: webseite@ ist ein eigenes Microsoft-365-Konto mit Anmeldung.
Der Zugriff soll auf dieses Postfach beschränkt werden; nicht pauschal Zugriff auf
sämtliche Unternehmenspostfächer erteilen.

Website-Anfragen werden bereits in Supabase gespeichert. Resend kann darüber
Benachrichtigungen an webseite@ versenden. Diese reinen Systemmeldungen muss der
Bot von Kundennachrichten unterscheiden und nicht wieder automatisch beantworten.

## Noch offen

- Berechtigter Microsoft-365-Administrator für die Einrichtung.
- Freigabemodus: zunächst Entwürfe oder automatische Eingangs-/Rückfragen mit
  Angebotsfreigabe. Bis zur Entscheidung kein automatischer Kundenversand.
- Interne Weiterleitungsempfänger und Auslöser teilt der Nutzer später mit.
  Bis dahin bleibt automatische Weiterleitung deaktiviert.
- Preisliste, Einheiten, Mengenregeln, Zuschläge, Steuerbehandlung, Angebotsbedingungen
  und Vorlagen. Bis dahin keine Preise, Fristen oder Verfügbarkeiten erfinden.
- Zugang zum KI-Anbieter und abgestimmte Datenverarbeitung. Noch keine Kunden-E-Mails
  an einen KI-Anbieter übermittelt.
- Microsoft-Anwendungsregistrierung und auf das benötigte Postfach begrenzte Freigabe.

## Mindestprüfungen vor Aktivierung

Doppelte Ereignisse, Neustart/Wiederholung, geänderte Entwürfe, Autoresponder-Schleifen,
unzustellbare Nachrichten, gefälschte Absender, Prompt-Injection in Kundentexten,
Fehler des KI-Dienstes, fehlende Maße/Preise und Freigabe veränderter Angebote.
Bei unklarem Anliegen bleibt die Nachricht zur manuellen Bearbeitung offen.

## Offizielle technische Grundlagen

- [Microsoft Graph Mail API](https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview?view=graph-rest-1.0)
- [Antworten, Entwürfe und Versand](https://learn.microsoft.com/en-us/graph/outlook-create-send-messages)
- [Outlook-Änderungsbenachrichtigungen](https://learn.microsoft.com/en-us/graph/outlook-change-notifications-overview)
- [Resend-E-Mailversand](https://resend.com/docs/api-reference/emails/send-email)
- [Resend-Idempotenz](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
