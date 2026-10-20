# Animierte Deutschlandkarte im Startseiten-Hero

Auftrag vom 20.10.2026: neben dem Text eine Deutschlandkarte mit angepinnten Städten und sanften Lichtverbindungen ergänzen, um den überregionalen Einsatz sichtbar zu machen.

## Umsetzung

- Eigenständige SVG-Karte rechts neben dem Hero-Text ab 1024 px, darunter bei kleineren Bildschirmbreiten. Gartenmotiv, zweizeilige Überschrift, Beschreibung und beide Anfrage-/Leistungslinks erhalten.
- Zwölf Lichtpunkte: Hattersheim am Main als hervorgehobener Sitz; Koblenz, Frankfurt, Mainz, Wiesbaden, München, Hamburg, Kassel sowie Köln, Berlin, Dresden und Stuttgart als Auswahl der Einsatzorte. Keine zusätzlichen Niederlassungen oder konkreten Referenzprojekte behauptet.
- Siebzehn geschwungene Verbindungen mit langsam wandernden Lichtimpulsen, dezente Leuchtringe und ein gepunkteter Deutschlandumriss. Projektion für Umriss und Stadtkoordinaten identisch.
- Auf Nutzerkorrektur stärkere weiße Kontur mit konstant 1,8 px Strichstärke, ruhige dunkle Kartenfüllung, weiße Punkte und klare Beschriftungen. Ortsnamen werden relativ zum geografischen Punkt platziert; kurze helle Zuordnungslinien im dicht besetzten Rhein-Main-Gebiet. Hattersheim sitzt nicht mehr optisch zwischen Mainz und Stuttgart. Große überlagerte Leuchtringe der dortigen Punkte entfernt.
- Sichtbaren Play-/Pausenknopf auf ausdrücklichen Nutzerwunsch entfernt. Bei reduzierter Bewegung statische Darstellung ohne laufende Animation. SVG-Titel und Beschreibung für assistive Technik.
- Kein Kartenanbieter, keine Karten-API, keine neue Laufzeitabhängigkeit, keine Datenbankänderung. Der vereinfachte Umriss benötigt rund 4,1 kB Quelldaten.

## Kartengrundlage

Natural Earth, Admin-0 Countries im Maßstab 1:50m, Deutschland, vereinfacht mit 0,75 SVG-Einheiten Toleranz. Koordinatenprojektion: `x = 68 + (longitude - 5.87) * 43`, `y = 24 + (55.05 - latitude) * 68`.

- [Datensatz](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson)
- [Public-Domain-Nutzungsbedingungen](https://www.naturalearthdata.com/about/terms-of-use/)

## Prüfung und Stand

Typprüfung, gezieltes ESLint und Diffprüfung nach der Nutzerkorrektur bestanden. Lokale Browserprüfung bei 320, 390, 768, 1024, 1440 und 1920 px: keine horizontalen Überläufe, keine sich überschneidenden Ortsnamen, vollständige zweizeilige Überschrift und passende Kartenposition. Alle zwölf Punkte liegen innerhalb des Deutschlandumrisses; West-Ost- und Nord-Süd-Reihenfolge von Koblenz, Wiesbaden, Hattersheim, Frankfurt und Mainz geometrisch kontrolliert. Weiße 1,8-px-Kontur, fehlender Kartenknopf, tatsächliche Bewegung der Lichtimpulse, reduzierte Bewegung und Sprung zur Express-Anfrage geprüft; keine Browserfehler.

Die lokale Vorschau verwendet ausschließlich öffentliche Supabase-Leseabfragen über einen privaten Vorschauhelfer; die produktive Serverkonfiguration wurde nicht geändert. Die erste Vorschau ohne Serverzugang lieferte 500; die vollständige Darstellungsprüfung erfolgte anschließend mit dem öffentlichen Lesemodul. Keine Anfrage versendet und keine privaten Daten abgerufen.

Die erste Fassung wurde als **V83 am 20.10.2026 um 08:44:43 MESZ** veröffentlicht und live bei sechs Breiten geprüft. Quellcommit `f29fbfa0dbb2ed39864fd49e6bee771a172138ec`, Deployment `appgdep_6ad70dbf90508191a53c98a676c7259d`, öffentliche Audience und Umgebung Revision 4 erhalten. Diese Fassung wurde anschließend vom Nutzer gestalterisch korrigiert; sie ist nicht die abschließende Umsetzung. Der offizielle Build und Quellabgleich waren erfolgreich; der bekannte fehlende Bash-Packager wurde mit dem unveränderten offiziellen Vorbereitungsskript und dem vorhandenen geprüften Windows-Packager ersetzt.

**Überarbeitete Fassung live als V84 am 20.10.2026 um 08:53:43 MESZ.** Quellcommit `db0f9d4387783ee9408626ff0296e63cb3ddaea6`, Deployment `appgdep_6ad70fdceb7881918bef7ffba448b2f8`, Status succeeded. Öffentliche Audience und Laufzeitkonfiguration Revision 4 erhalten. Client-/Serverbuild und Postbuild erfolgreich; Quellstand vor Veröffentlichung im Sites-Repository gesichert. Derselbe geprüfte Windows-Paketierungsweg wie bei V83 verwendet.

Abschließende Prüfung auf `https://www.loni-galabau.de/` um **08:54:15 MESZ**: HTTP 200; alle sechs Bildschirmgrößen ohne Überlauf, überlappende Ortsnamen oder geteilte Überschrift. Alle zwölf Pins innerhalb der Landesfläche und regionale Himmelsrichtungsreihenfolge korrekt, Kontur weiß mit 1,8 px, kein Kartenknopf, laufende Lichtimpulse und statische Darstellung bei reduzierter Bewegung bestätigt. Express-Anker funktioniert, keine Browserfehler und kein Formularversand.

Die Kartenumsetzung einschließlich Nutzerkorrektur ist abgeschlossen. Keine Änderungen an Backend, Datenbank, Formularverarbeitung oder Unternehmensangaben; deshalb keine erneute vollständige Backendtestsuite. Lokale Screenshots und Prüfwerte bleiben in ignorierter Ablage. Diese Nachdokumentation verändert den veröffentlichten Programmcode nicht; abschließender GitHub-Abgleich im Chatabschluss.

## Grafische Weiterentwicklung und klare Verbindungen

Weiterer Auftrag vom 20.10.2026: Die Karte wirkt zu langweilig; anschließend ausdrücklich die Verbindungen sauberer und klar zusammenhängend gestalten.

- Letzte Nutzerkorrektur: die grüne Innenfläche vollständig entfernen. Finale Karte ohne Füllung, Farbverlauf, Flächenraster oder gefärbte Unterkante; weißer Umriss direkt über dem Gartenfoto. Heller Standortmarker für Hattersheim, stärkere Ortsbeschriftungen und eine leicht größere Karte.
- Elf Strecken bilden ein zusammenhängendes Netz mit zwölf Städten. Die kreuzenden Diagonalen entfallen; Nord-/Ostverbindungen führen über Kassel/Berlin, Südverbindungen über Stuttgart und die westliche Verbindung über Koblenz. Die drei kurzen Anschlüsse nach Wiesbaden, Mainz und Frankfurt sind geradlinig.
- Gleichmäßige Linien mit runden Enden und kleine, langsame Lichtpunkte auf längeren Strecken. Keine zusätzlichen dekorativen Kreislinien. Die geografischen Pins, nahe zugeordnete Ortsnamen, weiße Kontur und der entfernte Play-Knopf aus V84 bleiben erhalten; reduzierte Bewegung weiterhin berücksichtigt.
- Keine zusätzlichen Assets, Abhängigkeiten, Kartenanbieter oder Backendänderungen.

Typprüfung, gezieltes ESLint und Diffprüfung erfolgreich. Finale lokale Browseransichten bei 320/390/768/1024/1440/1920 px ohne Überlauf oder überlappende Ortsnamen. Aus dem gerenderten SVG geprüft: genau elf Strecken, alle zwölf Städte von Hattersheim erreichbar, sämtliche Start-/Endkoordinaten exakt auf den zugehörigen Pins. Express-Anker geprüft, keine Anfrage gesendet.

Die erste isolierte Vorschau hatte beim Wechsel des lokalen Abhängigkeitscaches einen Browser-Ladefehler. Nach Neustart auf einer frischen lokalen Adresse vollständige Darstellung und Hydrierung ohne Browserfehler bestätigt. Dies betraf ausschließlich die Vorschau, nicht die Produktionskonfiguration.

Die automatische Freigabeprüfung hat den Aufruf des Sites-Veröffentlichungsablaufs wegen fehlender ausdrücklicher Zustimmung zur Produktionsveröffentlichung abgelehnt. Die abgelehnte Eingabe wurde nicht ausgeführt, der wartende Helfer abgebrochen. Kein Umweg zur Veröffentlichung; die neue Gestaltung bleibt lokal, öffentlich weiterhin V84.

Der separat ausgeführte lokale Client-/Serverbuild einschließlich Postbuild ist erfolgreich; dieser Schritt hat keinen Veröffentlichungszugang. Abschließende Typprüfung, ESLint und Formatprüfung bestanden. Die transparente Endfassung bei allen sechs Bildschirmgrößen erneut ohne Überlauf und ohne überlappende Namen bestätigt; zwölf Pins, elf Strecken und `fill="none"` in jeder Ansicht. Keine Backendänderung, deshalb keine erneute vollständige Backendtestsuite. Abschließende GitHub-Sicherung im Chatabschluss; Live-Freigabe weiterhin erforderlich.
