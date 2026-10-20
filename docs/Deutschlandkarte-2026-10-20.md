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

Die Gestaltung wurde zunächst lokal abgeschlossen und auf GitHub unter `1e53aed4a56ee7da0feafad5b1b6450b087ad914` baumgleich gesichert. Die Veröffentlichung wartete bis zur ausdrücklichen Live-Freigabe.

## Glaskarte live in Version 85

Der Nutzer hat anschließend ausdrücklich **„stelle es live“** beauftragt. Die vorherige Ablehnung wegen fehlender Live-Zustimmung ist damit erledigt. **V85 wurde am 20.10.2026 um 09:42:03 MESZ erfolgreich veröffentlicht.**

- Quellcommit: `025b81c4a200285ff19d46a02659580318668e73`.
- Version-ID: `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_7346aa58cc288191b00af26226014c66`.
- Deployment: `appgdep_6ad71b34d5a88191bc72be0b20805627`, Status `succeeded`.
- Öffentliche Audience, Domain und Umgebung Revision 4 erhalten.
- Offizieller Source-Workflow hat den Quellstand erfolgreich übertragen und abgeglichen. Der Standard-Packager scheiterte anschließend am hier fehlenden Bash; das bereits geprüfte Windows-Verfahren mit unverändertem offiziellen Vorbereitungsskript erstellte das Archiv aus demselben erfolgreichen Build.
- Live-URL des Deployments: `https://loni-galabau.serhad1999.chatgpt.site`; eigene Domain: `https://www.loni-galabau.de/`.

Die eigene Domain nach Veröffentlichung bei 390 und 1440 px gegengeprüft: zwölf richtige Orte, elf Verbindungen, `blur(9px) saturate(0.35)` und grüner Hattersheim-Punkt sichtbar bestätigt. Keine horizontalen Überläufe oder Browserfehler; Seite vollständig interaktiv. Keine Anfrage versendet. Die Live-Desktopansicht ist lokal als Screenshot dokumentiert.

Diese Abschlussdokumentation verändert keinen veröffentlichten Programmcode. Abschließende GitHub-Sicherung im Chatabschluss.

## Vorheriger Stand: vier Zielstädte, Version 86

Neueste Nutzerkorrektur: „sind doch zuviele städte bitte nur köln stuttgart frankfurt münchen“. Die Ortsauswahl der V85 ist damit ersetzt: nur noch Köln, Stuttgart, Frankfurt und München sowie Hattersheim als zuvor ausdrücklich grün gewünschter Firmensitz. Die Fortsetzung der Live-Aktualisierung wurde im Kommentar angekündigt und unter der bestehenden Beauftragung ausgeführt.

Alle übrigen Stadtpunkte und zugehörigen Verbindungen entfernt. Vier gerade Strecken verbinden die ausgewählten Städte direkt mit Hattersheim. Köln steht wieder unmittelbar am Punkt; die bisherige linke Beschriftungsspalte wird nicht mehr benötigt. Der neutrale Glaseffekt, die weiße Kontur und der grüne Heimatpunkt bleiben erhalten.

Typprüfung, gezieltes ESLint, Formatierung und Diffprüfung erfolgreich. Lokale Browserprüfung bei 390 und 1440 px: genau fünf Punkte und vier Strecken, keine überlappenden Ortsnamen oder horizontalen Überläufe, keine Browserfehler. Client-/Serverbuild samt Postbuild erfolgreich. Offizieller Source-Workflow hat den geprüften Stand gespeichert und übertragen; nach dem bekannten fehlenden Bash wurde mit dem bewährten Windows-Packager das identische Build-Ergebnis verpackt. Keine Backendänderung, keine Testanfrage.

**V86 erfolgreich live seit 20.10.2026, 10:17:19 MESZ.** Quellcommit `f249e78bea12e7db0ac3972b16732c23d5c228ff`; Version-ID `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_2ed866ca9f0c81918becc6a461f145b5`; Deployment `appgdep_6ad723712dfc819197b331cd47291f3e`, Status succeeded. Öffentliche Audience und Umgebung Revision 4 erhalten.

Auf `https://www.loni-galabau.de/` nach Veröffentlichung bei 390/1440 px die fünf richtigen Ortsnamen, vier Verbindungen, `blur(9px) saturate(0.35)` und grüner Hattersheim-Punkt bestätigt. Keine Überläufe oder Browserfehler; Seite vollständig interaktiv. Live-Desktopansicht als lokaler Screenshot dokumentiert. Abschlussdokumentation ändert keinen Live-Code; abschließender GitHub-Abgleich im Chatabschluss.

## Aktueller Stand: größere Punkte ohne Namen und Linien, Version 88

Der Nutzer ersetzt die bisherige Auswahl durch Heidelberg, Mannheim, Hanau, Friedrichsdorf, Bad Homburg, Koblenz, Stuttgart und München und verlangt ausdrücklich nur Punkte ohne Namen und Linien. Hattersheim bleibt gemäß früherem Wunsch als grüner Heimatpunkt erhalten. Alle sichtbaren Ortslabels, Beschriftungskarten, Zuordnungslinien und Verbindungen einschließlich Lichtanimation wurden entfernt. Die Bildbeschreibung für Screenreader nennt weiterhin die Orte. Unter der Karte steht neutral „Deutschlandweit für Sie im Einsatz.“; weiße Deutschlandkontur und neutraler Hintergrundblur bleiben erhalten.

Die erste reine Punktkarte wurde als **V87 am 20.10.2026 um 11:05:21 MESZ** veröffentlicht:

- Quellcommit `6ba650060faa52e3ff9b6cf11921510b42563bab`.
- Version-ID `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_1ab0983175248191839d8bc53de1256b`.
- Deployment `appgdep_6ad72eb0d68081919e722429d7d9d726`, Status succeeded.

Während des Abschlusses verlangte der Nutzer deutlich größere Punkte. **V88 ist seit 20.10.2026, 11:10:34 MESZ live:**

- Weiße Standardpunkte: Radius 4,5 statt 2,5 SVG-Einheiten, also 80 % größerer Durchmesser. Hattersheim: Radius 5,5 statt 3,5.
- Friedrichsdorf und Bad Homburg: Radius 3,25 statt 0,9; zur Trennung auf der Übersichtskarte je 1,5 Einheiten horizontal und 2 Einheiten vertikal in entgegengesetzte Richtungen versetzt. Diese beiden Marker sind damit bewusst leicht schematisch positioniert. Den äußeren Hattersheim-Ring entfernt, damit er den benachbarten Punkt nicht überlagert.
- Quellcommit `7e3ceaf1863e788054398f4f770613bc20d6b280`.
- Version-ID `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_0658912a836c8191899f34a8b2182184`.
- Deployment `appgdep_6ad72ff3c0208191bb6ef1b85a092516`, Status succeeded.
- Öffentliche Audience, Domain und Umgebung Revision 4 in beiden Veröffentlichungen erhalten.

Typprüfung, gezieltes ESLint, Formatierung, Diffprüfung und Client-/Serverbuild samt Postbuild für beide Fassungen erfolgreich. Offizieller Source-Workflow hat die jeweiligen Stände vor der Veröffentlichung gespeichert und übertragen; wegen des bekannten fehlenden Bash wurde jeweils das erfolgreiche Build-Ergebnis mit dem vorhandenen Windows-Packager und unverändertem offiziellen Vorbereitungsskript verpackt.

Lokal und auf `https://www.loni-galabau.de/` bei 390/1440 px neun richtige Stadtpunkte, keine SVG-Ortslabels oder Verbindungslinien, kein horizontaler Überlauf, neutraler `blur(9px) saturate(0.35)` und grüner Heimatpunkt bestätigt. Größere Radien in der veröffentlichten V88 zurückgelesen. Keine neuen Abhängigkeiten, Backend-/Datenbankänderungen oder versandten Testanfragen. Die abschließende Dokumentation ändert keinen Live-Code; GitHub-Abgleich im Chatabschluss.
