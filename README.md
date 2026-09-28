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
