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

Das Schema, private Dateispeicher und der vorbereitete Import der bestehenden
Website-Inhalte befinden sich in [supabase/bootstrap](supabase/bootstrap/README.md).
Die Einrichtung des neuen Cloud-Projekts und Tests mit echten Zugängen stehen
noch aus. Der Quellcode allein enthält keine einsatzbereiten Zugangsdaten.

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
