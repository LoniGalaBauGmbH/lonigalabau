# Mehr Kontaktanhänge – 12.10.2026

## Umsetzung

Nutzerwunsch: mehr als drei Dateien an die neue Express-Anfrage anhängen.
Gemeinsame Uploadkomponente für Express, Kontakt, Projekt und Gartenplaner auf
zehn Dateien erweitert: JPG, PNG, WebP oder PDF; 5 MiB je Datei, 20 MiB insgesamt.
Die Auswahl zeigt Anzahl und Gesamtgröße. Bei zehn Dateien bleibt die Liste
scrollbar, damit die Bestätigung erreichbar bleibt. Entfernen schafft wieder Platz.

Gemeinsames Array-Schema begrenzt die Base64-Nutzdaten vor der Dekodierung.
Der Server prüft tatsächliche Größen und Dateisignaturen vor dem ersten Schreibzugriff.
Bei unvollständigen Uploads bleibt die vorhandene Bereinigung aktiv.
Private Ablage, Adminabruf und E-Mail-Routen werden wiederverwendet.
Keine Änderungen an Dokumentregeln für Stellen- oder Partnerbewerbungen.

## Datenbank

Mit Supabase CLI erzeugt: `20261012072829_contact_ten_attachments.sql`.
Native Migration `contact_ten_attachments` live angewandt, Check erlaubt <= 10.
Zurückgerollte echte Datenbankprüfung: zehn Pfade akzeptiert, elf abgelehnt.
Bootstrap-Schema entsprechend angepasst; vollständigen Bootstrap nicht erneut ausführen.

## Prüfungen vor Veröffentlichung

- 185 automatisierte Tests, Typprüfung und gezieltes ESLint erfolgreich.
- Exakt zehn Dateien mit zusammen 20 MiB akzeptiert. Elf Dateien oder ein Byte
  oberhalb der Gesamtgrenze werden vor Schreibzugriff abgelehnt.
- Chromium bei 320, 390 und 1440 px: Anzahl, Einzelgröße, kumulierte Größe,
  Entfernen/Ersetzen, Zurück/Weiter mit Werterhalt und fehlender horizontaler Überlauf geprüft.
- Lokaler vollständiger Formularversand mit echter Datenbank: A-1020,
  zehn unterschiedliche Dateien à 2 MiB. Alle privaten Dateien bytegleich heruntergeladen,
  anonymer Daten- und Dateizugriff verweigert. Doppelklick löste einen POST aus.
  Interne Nachricht und Kundenbestätigung an die eigene Testadresse wurden zugestellt.
  Eigener Testvorgang und Dateien anschließend entfernt.

Nach Übernahme des parallel veröffentlichten SEO-Stands (Version 65) erneut 210 Tests, Typprüfung und Produktionsbuild erfolgreich. Die bereits veröffentlichten Änderungen bleiben erhalten. Live-Prüfung erfolgreich (siehe unten). Testdaten/Rohberichte liegen außerhalb des Repositorys.

## Veröffentlichung und Live-Prüfung

Version 66 am 12.10.2026 um 09:47:06 MESZ erfolgreich veröffentlicht.
Quellcommit `cdf81ed5da4b33688a1fc1bf748ec3608ea258ae`,
Deployment `appgdep_6acc9060dda08191a1b3c708d922ae13`.
Der offizielle Buildhelfer benötigt hier nicht verfügbares npm; die identischen
Prebuild-/Build-/Postbuild-Schritte liefen direkt über vorhandenes Node erfolgreich.
Nach erfolgreichem Source-Push scheiterte der Pakethelfer an fehlendem Bash unter Windows.
Das Paket wurde mit dem offiziellen prepare-site-build.cjs und Windows-tar erzeugt.

Live auf https://www.loni-galabau.de: A-1021 mit zehn unterschiedlichen Dateien
à 2 MiB (insgesamt 20 MiB), ein POST beim Doppelklick und genau ein Vorgang.
Alle Dateien privat gespeichert und bytegleich heruntergeladen; anonyme Daten-/Dateizugriffe
verweigert. Interne Nachricht und Kundenbestätigung beide als delivered bestätigt.
Eigener Testvorgang und sämtliche Anhänge anschließend gelöscht.

Parallel veröffentlichte SEO-Änderungen aus V65 und deren abschließende GitHub-Dokumentation
übernommen. Dieser Dokumentationsnachtrag ändert den veröffentlichten Programmcode nicht.
