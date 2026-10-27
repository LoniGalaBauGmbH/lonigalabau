# Allgemeiner Holzterrassenbau – Umsetzung

Stand: 27.10.2026. Nutzer stellt ein ZIP mit eigenen Fotos und Videos bereit und beauftragt eine allgemeine Leistungsseite einschließlich ordentlicher Keywordrecherche. Neue URL: `/holzterrasse-bauen-lassen`; bestehende Ortsseite `/holzterrasse-bad-soden` bleibt eigenständig.

## Inhalte und Medien

Titel: „Holzterrassenbau – Holzterrasse bauen lassen | Loni GalaBau“. H1: „Holzterrasse bauen lassen.“ Neubau, Terrassendielen verlegen lassen, Erneuerung, Aufbau und Unterkonstruktion, Material-/Pflegeentscheidung, Kostenfaktoren, drei Umsetzungsschritte, acht FAQ und direkte Anfrage. Realer Firmensitz Hattersheim, Rhein-Main sowie weitere Orte nach Abstimmung. Keine erfundenen Preise, Bewertungen, Lieferfristen, Holzarten der Referenzen oder örtlichen Projektzuordnungen.

Sechs neue eigene Fotos auf der allgemeinen Seite (Hero, vier Galerieaufnahmen, Detailbild), dazu zwei kurze Projektvideos. Bad Soden erhält vier passende neue Fotos und einen der Clips, bei erhaltenen lokalen Inhalten und Metadaten. Fotos mit 640er WebP-Variante, Video H.264/MP4, ohne Ton und Autoplay, sichtbare Steuerung, `playsInline`, `preload="none"` sowie eigene Poster und textliche Beschreibung. Quelldaten/Rohmedien bleiben ignoriert. Details: `Holzterrassen-Medien-2026-10-27.md`.

Die allgemeine Seite ist aus Leistungsübersicht, Footer, bestehender Stein-/Pflasterterrassenseite und Bad Soden verlinkt. Gegenlink zur Ortsseite und passenden Gartenleistungen. Eigener Canonical, Service-Schema, Social-Metadaten, Sitemap, llms.txt und erlaubter Anfragepfad. Die Leistung „Holzterrassenbau“ war bereits vorhanden. Öffentliche MP4-Auslieferung wird auf die im Build enumerierten Dateien unter `/videos/` begrenzt; vorhandene Bereichs-/Cachevalidierungen bleiben erhalten.

## Recherche

DataForSEO/Google Ads, Deutschland/Deutsch, Monatsmittel Oktober 2025–September 2026. 114 automatisch gelieferte Ideen gesichtet, 16 Begriffe priorisiert. Drei erfolgreiche mobile Frankfurt-Suchproben, eine eindeutig fehlgeschlagene Suchprobe separat dokumentiert. Zusätzliche Kosten 0,098 USD. Vorhandene Tageswerte wiederverwendet. Hauptbegriffe: Holzterrasse bauen lassen 170, Holzterrassenbau 590 (gemischte Anbieter-/DIY-Suche), Holzterrasse bauen Firma 30, Terrassendielen verlegen lassen 30, bauen lassen Kosten 50. Werte nicht addieren oder als lokale Nachfrage ausgeben. Vollständige Einordnung und normalisierte Daten: `Keywordrecherche-Holzterrassenbau-2026-10-27.md`/`.json`.

## Prüfung und Veröffentlichung

238 Anwendungstests erfolgreich, einschließlich beider Holzterrassen-Anfragepfade bis zur simulierten Speicherung und PDF-Anhang. Öffentliche Medienprüfung testet MP4-MIME und Bereichsantworten ohne Weitergabe privater Header. Typprüfung, gezieltes ESLint und Diffprüfung erfolgreich.

Lokale Vorschau nach behebbarer Ausführungs-/Browserverbindung erreichbar. Beide Videos vollständig bis 15,43 bzw. 12,10 Sekunden ohne Wiedergabefehler abgespielt; vor Start keine vorgeladenen Videodaten. Allgemeine Seite bei 320/390/768/1440 px ohne horizontalen Überlauf, Bad Soden bei 390 px geprüft. FAQ aufgeklappt, Formular mit fiktiven Angaben und vorausgewähltem Holzterrassenbau bis Anhänge geprüft, nichts versendet. Interne Navigation zur Ortsseite erfolgreich. Medien vollständig dekodiert und Bildmetadaten kontrolliert (siehe Medienbericht).

Client-/Server-Produktionsbuild einschließlich Postbuild erfolgreich. **Live als Version 98 seit 27.10.2026, 09:10:11 MEZ:** [Holzterrassenbau](https://www.loni-galabau.de/holzterrasse-bauen-lassen) und [aktualisierte Bad-Soden-Seite](https://www.loni-galabau.de/holzterrasse-bad-soden). Quellcommit `de6d6a24f4bfd8119d5d2f1d60b0c987867350eb`, Deployment `appgdep_6ae05c47027c8191b87a4c2a859b2085`, Status `succeeded`. Audience public und Umgebung Revision 4 erhalten. Keine Datenbankänderung oder neue Website-Abhängigkeit.

Live-HTTP-Prüfung 09:12:07 MEZ: sieben Seiten-/Sitemap-/robots-Abrufe und alle 16 neuen Medien HTTP 200. Richtige Titel, jeweils eine H1, passende Canonicals und keine Indexierungssperre. Sitemap enthält **86 URLs** einschließlich neuer Leistungsseite. Die 14 WebP-Dateien haben korrekten Bildtyp/Signatur, beide MP4-Dateien korrekten Videotyp und sind bytegleich zu den optimierten Quelldateien. Die Hosting-Plattform beantwortet die Range-Anfrage für diese Clips mit einer vollständigen HTTP-200-Datei statt einer HTTP-206-Teilantwort; die vorhandene Durchleitung erhält Bereichsantworten, falls die Plattform sie liefert.

Live im Browser: beide Videos vollständig bis 15,43 bzw. 12,10 Sekunden ohne Wiedergabefehler abgespielt, alle sechs Fotos geladen, bedienbares Formular. Allgemeine Seite bei 390/1440 px, Bad Soden bei 390 px ohne horizontalen Überlauf. Gegenseitige Navigation erfolgreich. Screenshots und HTTP-/Medienbelege liegen im ignorierten lokalen Aufgabenordner. Der Browser ließ den alten lokalen Fehler-Tab nicht schließen; die neue funktionierende Live-Ansicht bleibt als Ergebnis geöffnet.

Keine Search-Console-Aktion und keine Google-Indexierung oder Klick-/Anfragenwirkung bestätigt. Abschlussdokumentation verändert den veröffentlichten Programmcode nicht. Vollständiger GitHub-Abgleich inklusive optimierter Medien gemäß Dauerauftrag im Chatabschluss.

## Galerie-Korrektur V99

Auf ausdrücklichen Nutzerwunsch liegt der Bildfokus der Gartenhausaufnahme jetzt unten (`object-position: center bottom`). Terrasse und Stufen werden im bestehenden 4:3-Ausschnitt sichtbar; andere Bilder behalten ihre bisherige Ausrichtung. Die Überschrift „Den Sitzplatz einfassen“ lautet jetzt „Sichtschutz aus Holz“. Originalbilder, Metadaten, URLs und übrige Seiteninhalte bleiben erhalten.

Typprüfung, gezieltes ESLint, Diffprüfung und Client-/Serverbuild samt Postbuild erfolgreich. Lokal und auf der öffentlichen Domain jeweils 390/1440 px ohne horizontalen Überlauf; neuer Wortlaut und berechneter Fokus `50% 100%` bestätigt. Alle vier Galeriebilder live geladen. Nach anfänglicher Navigationsverzögerung war die lokale Vorschau vollständig prüfbar. Live-Nachladen bestätigte den neuen Veröffentlichungsstand. Screenshot: `artifacts.local/holzterrassen-2026-10-27/gartenhaus-fokus-live-desktop.png` (ignoriert).

**Live als Version 99 seit 27.10.2026, 09:39:43 MEZ.** Quellcommit `f5e69b71d3eadca82942ef22fc40f64cf400c71d`, Version `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_8551777912a88191931fdf2dfeadb194`, Deployment `appgdep_6ae0633912288191ba438c880f5199fe`, Status `succeeded`. Audience public und Umgebung Revision 4 erhalten. Für diese reine Darstellungs-/Textkorrektur keine neuen Tests oder erneuter Volltestlauf. Keine Datenbank-/Indexierungsaktion.
