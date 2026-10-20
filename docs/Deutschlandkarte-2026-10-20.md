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

## Grafische Weiterentwicklung – Zwischenstand

Weiterer Auftrag vom 20.10.2026: Die Karte wirkt zu langweilig; anschließend ausdrücklich die Verbindungen sauberer und klar zusammenhängend gestalten.

Der erste Zwischenstand entfernte auf Nutzerwunsch die grüne Fläche und vereinfachte das Netz auf elf Strecken. Typprüfung, ESLint, Build und lokale Browserprüfungen erfolgreich; auf GitHub unter `41c91ce47e8d493ca4137f836091792328a194da` inhaltsgleich gesichert. Dieser Stand wurde durch die nachfolgende Glaskarte ersetzt.

Die erste isolierte Vorschau hatte beim Wechsel des lokalen Abhängigkeitscaches einen Browser-Ladefehler. Nach Neustart auf einer frischen lokalen Adresse vollständige Darstellung und Hydrierung ohne Browserfehler bestätigt. Dies betraf ausschließlich die Vorschau, nicht die Produktionskonfiguration.

Die automatische Freigabeprüfung hat den Aufruf des Sites-Veröffentlichungsablaufs wegen fehlender ausdrücklicher Zustimmung zur Produktionsveröffentlichung abgelehnt. Die abgelehnte Eingabe wurde nicht ausgeführt, der wartende Helfer abgebrochen. Kein Umweg zur Veröffentlichung; die neue Gestaltung bleibt lokal, öffentlich weiterhin V84.

## Aktuelle Glaskarte mit ausgewählten Großstädten

Neuester Nutzerauftrag: die Linien weiter ordnen, dicht stehende Orte entfernen, einige wichtige deutsche Städte verwenden und das Karteninnere weichzeichnen. Anschließend ausdrücklich Frankfurt, Düsseldorf, Leipzig, Dortmund und Essen aufnehmen und den Hattersheim-Punkt grün markieren.

- Zwölf geografisch verortete Punkte: Hattersheim, Hamburg, Berlin, Köln, Düsseldorf, Essen, Dortmund, Frankfurt, Leipzig, Dresden, Stuttgart und München. Mainz, Wiesbaden, Koblenz und Kassel entfernt. Die später ausdrücklich gewünschten benachbarten Großstädte bleiben mit versetzten Namen lesbar.
- Elf gerade Strecken bilden ein zusammenhängendes Netz ohne zusätzliche Kreuzverbindungen. Von Hattersheim führen Verbindungen nach Hamburg, Berlin, Köln, Frankfurt, Stuttgart und München. Westlicher Anschluss über Köln–Düsseldorf–Essen–Dortmund; östlicher Anschluss über Frankfurt–Leipzig–Dresden.
- Vier westliche Ortsnamen stehen geordnet links mit eindeutigen Zuordnungslinien. Frankfurt erhält einen eigenen geografischen Punkt und einen nach rechts versetzten Namen; der kurze Anschluss an Hattersheim bleibt sichtbar. Leipzig ist so beschriftet, dass keine Berlin-Verbindung durch den Namen läuft.
- Das Gartenfoto wird ausschließlich innerhalb des Deutschlandumrisses mit `backdrop-filter: blur(9px) saturate(0.35)` weichgezeichnet und entsättigt. Eine neutrale weiße Fläche mit 7 % Deckkraft ergänzt den Glaseindruck. HTML-Fläche und SVG verwenden denselben Umriss über einen responsiven `objectBoundingBox`-Clip; Pins, Linien und Namen liegen scharf darüber. Ohne Hintergrundfilter-Unterstützung bleibt die transparente, neutral getönte Fläche als Rückfall erhalten.
- Weiße Kontur mit 1,8 px Strichstärke, weiße Städte und ruhige Lichtimpulse nur auf längeren Strecken. Alle wiederkehrenden Leuchtring-Animationen entfernt. Hattersheims Punkt ist auf Wunsch hellgrün, die Kartenfläche enthält keine grüne Füllung. Kein Play-/Pausenknopf; reduzierte Bewegung blendet Lichtimpulse aus.
- Keine zusätzlichen Assets, Abhängigkeiten, Kartenanbieter, Backend- oder Datenbankänderungen.

Die abschließende lokale Browserprüfung bei **320, 390, 768, 1024, 1440 und 1920 px** bestätigt zwölf Orte und elf Strecken, die neutrale Blurfläche und den grünen Heimatpunkt. Keine horizontalen Überläufe und keine sich überschneidenden Ortsnamen. Liniengeometrie aus dem gerenderten SVG kontrolliert: sämtliche Start-/Endkoordinaten an den zugehörigen Punkten innerhalb numerischer Rundungstoleranz; keine Strecke durch einen Ortsnamen. Desktop- und Mobilansicht visuell geprüft, keine Browserfehler. Keine Anfrage versendet.

Typprüfung, gezieltes ESLint, Formatierung und Diffprüfung erfolgreich. Der erste Build scheiterte lokal an fehlendem Schreibzugriff auf ein bestehendes Ausgabe-Unterverzeichnis; der Wiederholungslauf mit passendem Dateizugriff war einschließlich Client-/Serverbuild und Postbuild erfolgreich. Dieser Build veröffentlicht nichts. Die vollständige Backendtestsuite wurde wegen der rein visuellen Änderung nicht erneut ausgeführt.

Aktuelle Gestaltung lokal abgeschlossen; abschließende GitHub-Sicherung im Chatabschluss. **Weiterhin nicht live:** Die frühere automatische Ablehnung des Veröffentlichungsablaufs bleibt maßgeblich, der Nutzer hat danach gestalterische Korrekturen, aber keine ausdrückliche Live-Freigabe erteilt. Öffentlich bleibt V84.
