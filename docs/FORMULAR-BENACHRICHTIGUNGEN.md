# Formular-Benachrichtigungen

Kontaktseite, Projektanfrage und Gartenplaner speichern Anfragen in `contact_requests`.
Bewerbungen werden in `applications` gespeichert. Anschließend versendet der Server
eine Benachrichtigung an **webseite@loni-galabau.de**, einschließlich aller eingegebenen
Felder und der zugehörigen Anhänge. Antworten auf die Nachricht gehen durch `reply_to`
an die im Formular angegebene Adresse. Es werden keine automatischen Kundenantworten
oder Angebote verschickt; der E-Mail-Assistent bleibt ein separates Vorhaben.

Alle vier Formularwege verwenden dieselbe strukturierte E-Mail-Gestaltung:
Kontaktkopf, separate Themenabschnitte, zweispaltige Datenzeilen, Nachricht,
Anhangsliste und Adminlink. Gartenplaner und Startseiten-Anfrage zerlegen ihre
Projektbriefings in passende Abschnitte; Bewerbungen zeigen die Stelle im Kopf.
Inline-Formatierung, klassische HTML-Tabellen und explizite `<br>`-Umbrüche halten
die Inhalte auch in Mailprogrammen lesbar, die CSS-Whitespace-Regeln ignorieren.
Eine gegliederte Textversion ist ebenfalls enthalten.

## Konfiguration

- `RESEND_API_KEY`: ausschließlich als geheime Servervariable hinterlegen.
- `RESEND_FROM`: Absenderadresse aus einer bei Resend verifizierten Domain.
- Der interne Empfänger ist im Servercode festgelegt und kann nicht durch Formulardaten verändert werden.
- Lokal liegt die Konfiguration in der ignorierten `.env.resend`; den Entwicklungsserver mit dieser Datei zusätzlich zu `.env` starten.
- Bei Sites müssen die Variablen in der Laufzeitumgebung eingerichtet und durch eine Veröffentlichung aktiviert werden.

## Uploads und Fehlerbehandlung

Bewerbungen unterstützen eine optionale PDF bis 10 MB. Kontaktformulare unterstützen
bis zu drei JPG-, PNG-, WebP- oder PDF-Dateien mit je maximal 5 MB. Dateiinhalte werden
serverseitig geprüft. Die Dateien bleiben in privaten Supabase-Buckets. Eine
fehlgeschlagene Speicherung räumt bereits für diesen Vorgang hochgeladene Dateien auf.

Ein Mailfehler verwirft keine gespeicherte Anfrage. Im Adminbereich zeigt der Vorgang
den ausstehenden Versand und bietet einen geschützten Knopf zum erneuten Senden.
Ein automatischer Hintergrund-Retry ist nicht eingerichtet. Erfolgreiche Annahme
durch Resend setzt `notification_sent_at`; das ist **keine Zustellbestätigung**.
Den Zustellstatus zeigt Resend am jeweiligen E-Mail-Vorgang (`last_event`).
Eine stabile Idempotency-ID verhindert doppelte Versandaufträge bei kurzfristigen
Wiederholungen; bereits als versendet markierte Vorgänge werden übersprungen.

## Adminzugang

`/admin` führt bei fehlender Anmeldung zu `/login`. Berechtigte Konten sind
`a.sinanaj@loni-galabau.de` und `webseite@loni-galabau.de`.
Die initial eingerichteten Zugangsdaten liegen ausschließlich lokal in der ignorierten
Datei `.env.admin-logins`. Passwörter gehören weder in dieses Dokument noch ins Repository.

## Prüfungen

`node --test tests/*.test.mjs` prüft Formulardaten, Dateivalidierung, Zuordnung,
Aufräumen bei Speicherfehlern, Benachrichtigungsinhalt, feste Empfänger,
Wiederholungsschutz, Mailfehler und Adminschutz. Reale Zustellung separat mit eindeutig
als SYSTEMTEST markierten Formularen und anschließender Resend-Statusprüfung kontrollieren.
