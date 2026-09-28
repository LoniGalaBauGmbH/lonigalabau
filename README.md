# Loni Galabau – Website

Website mit Leistungsseiten, Projekten, Gartenplaner, Bewerbungen und geschützter
Inhaltsverwaltung. React, TypeScript, TanStack Start, Tailwind CSS und Supabase.

## Lokal starten

Node.js 22 oder neuer und npm verwenden:

```sh
npm ci
```

`.env.example` als `.env` kopieren und die Werte des eigenen Supabase-Projekts
eintragen. Der Secret Key wird ausschließlich auf dem Server verwendet.
Danach:

```sh
npm run dev
```

## Prüfen

```sh
npm test
npx tsc --noEmit
npm run build
```

`npm run lint` prüft das gesamte Projekt. Im ursprünglichen Bestand sind noch
Lintfehler vorhanden; Einzelheiten stehen in [PROJEKTANALYSE.md](PROJEKTANALYSE.md).

## Neue Datenbank

Das neue Cloud-Projekt `LoniGalabau` ist mit acht Tabellen, vier Dateispeichern
und den bestehenden öffentlichen Website-Inhalten eingerichtet. SQL- und
öffentliche API-Zugriffe wurden geprüft. Schema und Prüfskripte stehen in
[supabase/bootstrap](supabase/bootstrap/README.md).
Die lokale Website ist mit dem neuen Projekt verbunden. Zwei Admin-Konten sind
eingerichtet, öffentliche Selbstregistrierung ist deaktiviert. Beide Logins
wurden im Browser geprüft; eine Testbewerbung mit privatem PDF-Upload wurde
erfolgreich über die Website verarbeitet. Der Quellcode enthält keine
einsatzbereiten Zugangsdaten. Die vollständige Website-Abnahme steht noch aus.

## Live-Projektlink

Die Projektwebsite ist unter
[loni-galabau.serhad1999.chatgpt.site](https://loni-galabau.serhad1999.chatgpt.site)
für jeden mit dem Link erreichbar. Die Verwaltung bleibt über
[/login](https://loni-galabau.serhad1999.chatgpt.site/login) geschützt.
Die Unternehmensdomain ist damit noch nicht umgestellt.

Hosting erfolgt über Sites als Cloudflare Worker. `npm run build` erzeugt mit
Nitro `dist/server/index.mjs`, die Worker-Konfiguration und `dist/client`.
`.openai/hosting.json` enthält die feste Projektzuordnung. Ein Deployment-Archiv
enthält diese Datei sowie `dist/server` und `dist/client`; lokale `.env`-Dateien
und Admin-Passwörter gehören niemals hinein. Vor jeder Veröffentlichung muss
der genaue Quellcode-Commit in das zugehörige Sites-Quellrepository übertragen
und als Version gespeichert werden. Die Unternehmens-GitHub-Synchronisierung
allein veröffentlicht keine neue Live-Version.

Die öffentlichen `VITE_SUPABASE_*`-Werte werden beim Build eingebunden.
`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` und der als Secret markierte
`SUPABASE_SECRET_KEY` liegen zusätzlich als Server-Variablen im Sites-Hosting.
Änderungen dieser Server-Variablen benötigen eine erneute Veröffentlichung.

Am 28.09.2026 geprüft: öffentlicher HTTPS-Aufruf, Weiterleitung unberechtigter
Admin-Aufrufe zum Login, Admin-Anmeldung, Dashboard mit acht Leistungen, einem
Projekt und einer Stelle sowie Kontaktformular bis zur Speicherung in Supabase.
Der synthetische Kontakt-Testeintrag wurde danach entfernt. Der Build enthält
keinen Supabase-Secret-Key. Dies ersetzt noch nicht die vollständige fachliche
und redaktionelle Freigabe der Website.

## Synchronisierung

Dieses Projekt wird nach abgeschlossenen, geprüften Änderungen mit
[LoniGalaBauGmbH/lonigalabau](https://github.com/LoniGalaBauGmbH/lonigalabau)
auf `main` synchronisiert. Die Arbeitsregel steht in [AGENTS.md](AGENTS.md).
GitHub speichert den Projektcode; Datenbank und Hosting werden separat eingerichtet.

## Projektstand

[PROJEKTANALYSE.md](PROJEKTANALYSE.md) enthält die ursprüngliche Bestandsaufnahme
mit Nachtrag zu den bereits behobenen Punkten. Der aktuelle Datenbankstand ist in
der Bootstrap-Anleitung dokumentiert. Die Gestaltungshinweise in `.lovable/`
beschreiben einen früheren Auftrag.

## Überarbeitung am 28.09.2026

Startseite, Leistungen, Kontakt, Über uns und Fußbereich verwenden eine ruhigere
Gestaltung und konkrete Texte. Unbestätigte Bewertungen, Kennzahlen, Auszeichnungen
und Personenporträts werden dort nicht mehr eingeblendet. Bestehende Datensätze sind
erhalten; die acht importierten Leistungstexte wurden über
`supabase/bootstrap/update_service_copy.sql` aktualisiert. Projektfotos benötigen
jetzt echte hinterlegte URLs statt eines automatisch zugeordneten Villenbildes.
Vorher/Nachher-Bilder erscheinen erst nach Einpflege beider Aufnahmen.

Bestätigte Firmenangaben stehen in `src/lib/company.ts`. Öffnungszeiten:
**Montag bis Freitag, 7–18 Uhr**. Keine Samstagszeiten. Impressum: HRB 125735,
Amtsgericht Frankfurt am Main, Geschäftsführer Valon Sinanaj, SVLFG.

- Mobile Anruf-/Anfrageleiste, sichtbare Feldfehler, zugängliche Formularbeschriftungen.
- Gartenplaner: getrennte Namensfelder, positive Maße, E-Mail-Prüfung.
- Gemeinsame interne Notizen mit Versionsprüfung gegen versehentliches Überschreiben.
- Serverseitige, atomare Formularbegrenzung: 6 Kontakte/Bewerbungen bzw. 20 Uploads
  je abgeleiteter IP-Kennung und 15 Minuten. Der HMAC-Schlüssel verlässt den Server
  nicht. Auf Cloudflare wird ausschließlich dessen Client-IP-Header verwendet.
  Ohne diesen Header teilen sich Anfragen eine vorsichtige Ersatzquote.
- CSRF-Middleware für Serverfunktionen; Cookie-Widerruf lädt die Seite ohne optionale
  Skripte neu. Ohne konfigurierte optionale Dienste erscheint kein Startbanner.
- Abgleich des Query-Caches zwischen Server und Browser; Sitemap, Robots-Datei,
  Canonical-URLs und ein lokales Logo als Favicon. Keine externen Google-Font-Aufrufe.

### E-Mail-Meldungen

Empfänger ist **webseite@loni-galabau.de**, bei Bedarf explizit über
`NOTIFICATION_TO_EMAIL` konfigurierbar. Benachrichtigungen enthalten nur Vorgangs-ID
und Admin-Link. Kundentexte und Anhänge verbleiben in Supabase.

Resend benötigt im Server-Hosting `RESEND_API_KEY` (Secret) und
`RESEND_FROM_EMAIL` mit bestätigter Absenderdomain. Die Codex-Plugin-Verbindung
überträgt diese Werte nicht automatisch in den Website-Server. Ohne diese
Konfiguration werden Eingänge gespeichert, aber keine E-Mails versandt.
Das Dashboard zeigt ausstehende Meldungen und erlaubt deren erneuten Versand.
Erst nach erfolgreicher Resend-Annahme wird `notification_sent_at` gesetzt.
Das bedeutet Provider-Annahme, keine bestätigte Zustellung im Zielpostfach.
Resend-Idempotenz schützt Wiederholungen innerhalb des vom Anbieter unterstützten
Zeitfensters; es läuft noch kein automatischer Wiederholungsdienst.

Die beiden SQL-Erweiterungen unter `supabase/bootstrap/updates/` sind bereits im
neuen Cloud-Projekt angewendet. Historische Migrationen nicht zusätzlich ausführen.
`supabase/bootstrap/verify_workflows.sql` prüft Rechte, Quote, Ablauf und Notizkonflikte
und rollt alle Teständerungen zurück.

### Noch benötigte Inhalte / Konfiguration

Eigene Baustellen- und Teamfotos; gegebenenfalls vorhandene USt-/Wirtschafts-ID;
abschließende betriebliche Prüfung der Rechtstexte und Aufbewahrungsregeln;
Resend-Schlüssel und Domainbestätigung; gesonderte Verbindung der Unternehmensdomain.
Der geplante Outlook-Assistent ist in `docs/EMAIL-ASSISTENT.md` beschrieben und
noch nicht aktiv. Preise und Weiterleitungsregeln sind nicht hinterlegt.

### Prüfungen dieses Standes

33 automatisierte Tests, TypeScript, gezieltes ESLint und Client-/Server-Build sind
erfolgreich. 70 erzeugte Browserdateien enthalten keinen Server-Schlüssel. Kontakt,
Robots und Sitemap liefern HTTP 200. Desktop und mobile Kontaktseite sind im Browser
geprüft; sichtbare Formularfehler und erfolgreiche Übermittlung bestätigt. Die neue
gemeinsame Notiz wurde mit dem ersten Admin-Konto gespeichert und mit dem zweiten
gelesen. Beide synthetischen Testanfragen wurden anschließend wieder entfernt.
