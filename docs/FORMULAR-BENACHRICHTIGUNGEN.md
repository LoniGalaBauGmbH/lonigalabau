# Formular-Benachrichtigungen

Kontaktseite, Projektanfrage und Gartenplaner speichern Anfragen in `contact_requests`.
Bewerbungen werden in `applications` gespeichert. Anschließend versendet der Server
eine Benachrichtigung an **webseite@loni-galabau.de**, einschließlich aller eingegebenen
Felder und der zugehörigen Anhänge. Antworten auf die Nachricht gehen durch `reply_to`
an die im Formular angegebene Adresse. Zusätzlich erhält die absendende Person eine
automatische Eingangsbestätigung. Individuelle KI-Antworten und Angebote bleiben
ein separates Vorhaben.

Alle vier Formularwege verwenden dieselbe strukturierte E-Mail-Gestaltung:
Kontaktkopf, separate Themenabschnitte, zweispaltige Datenzeilen, Nachricht,
Anhangsliste und Adminlink. Gartenplaner und Startseiten-Anfrage zerlegen ihre
Projektbriefings in passende Abschnitte; Bewerbungen zeigen die Stelle im Kopf.
Inline-Formatierung, klassische HTML-Tabellen und explizite `<br>`-Umbrüche halten
die Inhalte auch in Mailprogrammen lesbar, die CSS-Whitespace-Regeln ignorieren.
Eine gegliederte Textversion ist ebenfalls enthalten.

Das Loni-Logo und Verbandslogo stammen aus den Original-SVGs in `src/assets`.
`scripts/generate-email-logos.mjs` erzeugt weiße PNG-Fassungen für die dunklen
Kopf- und Fußbereiche. Sie werden als CID-Bilder direkt in jede Nachricht eingebettet
und nicht zur Anzahl der Kundenanhänge gezählt. Die SVGs bleiben die Website-Assets.

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
Der bestehende geschützte Cron-Aufruf versucht ausstehende interne Nachrichten und
Kundenbestätigungen alle fünf Minuten erneut. Erfolgreiche Annahme
durch Resend setzt `notification_sent_at`; das ist **keine Zustellbestätigung**.
Den Zustellstatus zeigt Resend am jeweiligen E-Mail-Vorgang (`last_event`).
Eine stabile Idempotency-ID verhindert doppelte Versandaufträge bei kurzfristigen
Wiederholungen; bereits als versendet markierte Vorgänge werden übersprungen.

## Automatische Kundenbestätigungen

Nach erfolgreicher Speicherung senden alle öffentlichen Kontaktwege, die Projektanfrage,
der Gartenplaner und die Bewerbung eine eigene Bestätigung an die Formularadresse.
Der Ablauf steht in `customer-confirmation.server.ts`. Die interne Benachrichtigung
und die Kundenbestätigung werden unabhängig voneinander versucht.

- Vier passende Textvarianten; Bewerbungen mit Teambild, Kundenanfragen mit Gartenfoto.
- Loni- und Verbandslogo sowie Fotos als eingebettete CID-Bilder, ohne externe Bildabrufe.
- Stabile Ticketnummer im Betreff, Inhalt, interner Nachricht und Adminbereich; dort suchbar.
- Antworten auf die Bestätigung gehen an `webseite@loni-galabau.de`.
- Keine Wiederholung von freiem Kundentext oder privaten Anhängen in der automatischen Antwort.
- Keine nachträglichen Bestätigungen an Datensätze von vor der Einführung.

Die Migration `20260929141932_customer_confirmations.sql` ergänzt getrennte
Versandfelder. Ein unveränderlicher Resend-Payload wird vor dem Versand privat am
Vorgang gespeichert. Parallele Aufrufe verwenden denselben Snapshot und den Schlüssel
`customer-confirmation/<table>/<id>`. Das schützt auch dann gegen doppelte Bestätigungen,
wenn der Provider die E-Mail angenommen hat, aber die Speicherung des Status scheitert.
Die Snapshot-Daten werden mit dem Vorgang gelöscht und niemals an die Admin-Liste übertragen.

Resend behält [Idempotency-Schlüssel 24 Stunden](https://resend.com/docs/dashboard/emails/idempotency-keys).
Deshalb enden automatische Wiederholungen nach 23 Stunden; ein unklarer alter Versand
wird nicht blind wiederholt. Das Adminfenster kennzeichnet solche Fälle zur persönlichen
Prüfung. Signierte Zustellereignisse zeigen die Annahme durch den Empfänger-Mailserver
sowie Rückläufer und Verzögerungen für beide Nachrichten getrennt an.

`SITE_ADMIN_ORIGIN` bestimmt die Links zu Projekten, Team und Datenschutz. Beim Wechsel
auf die endgültige Domain auch diese Servervariable aktualisieren und veröffentlichen.
`scripts/generate-customer-email-assets.mjs` erzeugt die Bildanhänge aus den freigegebenen
Website-Fotos; `customer-confirmation-email.ts` enthält HTML und Textfassung.

Am 29.09.2026 wurden Kontakt, Projektanfrage, Gartenplaner und Bewerbung mit synthetischen
SYSTEMTEST-Datensätzen an das eigene Website-Postfach geprüft: alle vier Bestätigungen
und vier internen Meldungen wurden von Resend als `delivered` gemeldet. Wiederholte
Aufrufe der bestätigten Vorgänge lösten keinen weiteren Versand aus.

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
