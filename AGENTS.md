# Arbeitsregeln für dieses Projekt

## GitHub-Synchronisierung

Der Nutzer hat am 28.09.2026 dauerhaft beauftragt, abgeschlossene Projektänderungen
mit https://github.com/LoniGalaBauGmbH/lonigalabau zu synchronisieren.

- Nach eigenen abgeschlossenen Änderungen die passenden Prüfungen ausführen,
  Änderungen prüfen und committen sowie auf GitHub übertragen. Dafür nicht erneut
  um Erlaubnis fragen, solange der Auftrag oder spätere Nutzeranweisungen nichts
  anderes vorsehen.
- Standardzweig ist `main`. Vor dem Übertragen den aktuellen Remote-Stand prüfen.
  Änderungen anderer Mitwirkender erhalten; niemals einen Force-Push zum
  Überschreiben fremder Änderungen verwenden.
- Quellcode, Assets, Lockdateien, Tests, Dokumentation und Datenbankskripte gehören
  in die Synchronisierung. `.env`, Zugangsdaten, private Datenexporte,
  `node_modules`, Builds und lokale Caches bleiben ausgeschlossen.
- Fremde, noch laufende lokale Arbeiten nicht ungeprüft mit veröffentlichen.
- Synchronisierung bedeutet Git-Änderungen nach abgeschlossenen Arbeiten.
  Datenbankmigrationen, Live-Veröffentlichungen und fortlaufende Hintergrundläufe
  sind eigenständige Aktionen; hierfür den jeweiligen Nutzerauftrag beachten.
- Nach erfolgreicher Übertragung Remote-Commit und lokalen Stand abgleichen.
  Im Abschluss den Commit verlinken oder eine konkrete Blockade benennen.

## Datenbank

Der neue Supabase-Aufbau liegt in `supabase/bootstrap/`. Vor Einrichtung oder
Migration die dortige `README.md` lesen. Die historischen Setup-Dateien und
Migrationen nicht zusätzlich auf die neue Datenbank anwenden.

## Prüfungen

- `npm test`: Adminrechte, Routenschutz und Uploadvalidierung
- `npx tsc --noEmit`: Typprüfung
- `npm run build`: Client- und Server-Build
- ESLint gezielt für geänderte Dateien; im historischen Bestand bestehen noch
  bekannte Lintfehler (siehe Projektanalyse).

Falls npm lokal fehlt, lassen sich die vorhandenen Werkzeuge über Node aus
`node_modules` starten. Änderungen nur soweit prüfen, wie es ihr Umfang erfordert.
