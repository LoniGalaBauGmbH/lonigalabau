# Steuerliche Unterlagen – 05.10.2026

Auf ausdrücklichen Nutzerwunsch sind beide bereitgestellten PDFs ungeschwärzt für die öffentliche Website vorgesehen. Die Originaldateien werden unverändert ausgeliefert; die WebP-Bilder dienen ausschließlich der Vorschau.

| Unterlage | Ausgestellt | Gültigkeit | Umfang |
| --- | --- | --- | --- |
| Freistellungsbescheinigung nach § 48b EStG | 25.09.2025 | 27.10.2025 bis 26.04.2027 | 2 Seiten |
| Nachweis zur Steuerschuldnerschaft nach § 13b UStG | 27.03.2025 | Bis einschließlich 24.03.2027 | 2 Seiten |

Das zweite Dokument betrifft Bauleistungen, keine Gebäudereinigungsleistungen. Es wird entsprechend dem Original als Nachweis und nicht als Freistellungsbescheinigung bezeichnet.

## Einbindung

- Eigene Kategorie „Steuerliche Bescheinigungen“ auf `/downloads`, mit Aussteller, Ausstellungsdatum, Gültigkeit und PDF-Download.
- Beide Unterlagen auch in der Fußzeile, über die bestehende Dokumentvorschau erreichbar.
- Mehrseitige Vorschau mit Seitenzähler, Vor-/Zurückschaltflächen, Zoom, Tastaturbedienung und vollständigem PDF-Download.
- Bestehende Qualifikationskopien bleiben unverändert; der Hinweis zu Schwärzungen unterscheidet nun korrekt zwischen diesen und den beiden Original-PDFs.
- Lange Titel umbrechen auch bei 320 px; Downloadaktionen erhalten auf kleinen Displays die ganze Zeilenbreite.

## Prüfung

Alle vier Originalseiten visuell geprüft. Beide veröffentlichten PDF-Dateien sind per SHA-256 bytegenau identisch zu den gelieferten Originalen:

- § 48b EStG: `4b22ac7a17574ec68b9c2d1beb669bda18f638c34cac91784206d9061857322f`
- § 13b UStG: `7af32f2b304f45f0d255adb8e78191d10882b2b7655cb23fe6d150eae69e329f`

168 vorhandene Anwendungstests, TypeScript, gezieltes ESLint und finaler Produktionsbuild erfolgreich. Desktopvorschau und 320-px-Ansicht einschließlich beider Dokumentseiten geprüft. Beide lokalen PDF-Antworten lieferten HTTP 200, `application/pdf` und bytegenau die Originaldatei. Keine Anfrage oder E-Mail versandt.

Der Nutzer bestätigte zusätzlich ausdrücklich die gemeinsame Veröffentlichung des vorbereiteten Ortsseiten-Designs. Dessen Umfang und vorangegangene Prüfungen stehen in `docs/Regional-Conversion-2026-10-05.md`.

## Veröffentlichung

Version **60** am 05.10.2026 um **10:28:45 MESZ** erfolgreich veröffentlicht. Native Deploymentantwort: `succeeded`; Quellcommit `1b59ffd4bbce2a0d6d7728fa21f41ef46a84e01b`, Deployment `appgdep_6ac35fa32d5881918a813f5731432d3a`. Die bereits zwischenzeitlich als V59 veröffentlichten Ortsseiten-Designänderungen sind enthalten. Nachträgliche Dokumentationsabgleiche ändern keinen veröffentlichten Programmcode.

## Noch offener GitHub-Abgleich

Website und Sites-Quellstand sind vollständig veröffentlicht. Der zusätzliche GitHub-Abgleich ist blockiert: Beide großen PDF-Blob-Aufrufe lieferten auch nach mehr als elf Minuten keine Antwort; die wartende Operation wurde beendet. Alle sechs WebP-Blobs wurden anschließend einzeln erfolgreich hochgeladen und gegen die lokalen Git-SHAs geprüft. Der abschließende GitHub-Tree-Aufruf bestätigt weiterhin einen fehlenden PDF-Blob (`nachweis-13b-ustg.pdf`); daher wurde kein unvollständiger Commit auf `main` veröffentlicht. Der GitHub-Stand `1314e7413eae9e01eaab3ad46a2bcb611c1c00bc` wurde lokal einschließlich aller neueren Dokumentation erhalten. Regulärer Git-Push findet keine Anmeldung; der Browser ist ebenfalls bei GitHub abgemeldet. Für eine Fortsetzung entweder die PDF-Verbindung erneut prüfen oder einen angemeldeten GitHub-Uploadweg verwenden. Keine Zugangsdaten in diesem Bericht.
