# Stadtseiten: Anfragen und Vertrauen – 05.10.2026

Umgesetzt für alle zehn bestehenden Stadtseiten, einschließlich Frankfurt-Höchst. Der Firmensitz bleibt Hattersheim am Main; deutschlandweiter Einsatz bleibt sichtbar.

- Großes Gartenmotiv über die ganze Breite, wie auf der Startseite. Drei-Schritt-Rückrufformular direkt im oberen Bereich; bestehende Anfrageverarbeitung unverändert.
- Hero-Buttons mit eigenem senkrechtem Container und Abstand. Auf mobilen Geräten folgen Formular und Aktionen auf die kurze Einführung.
- Je acht echte Projektfotos früh im Seitenverlauf, mit vorhandener Großansicht. Kein Foto wird einem unbelegten lokalen Kundenprojekt zugeschrieben.
- Echtes Teamfoto und Teamgeschichte in der Seitenmitte; Erfahrung und veröffentlichte Fachnachweise zum Nachlesen. Keine erfundenen Bewertungen.
- Klarer Ablauf von Kennenlernen über Angebotsgrundlage bis Umsetzung; wiederholte Rückruf- und Projektanfragewege.
- Ortsbezogene Texte, Serviceverlinkungen und FAQs erhalten; der ursprüngliche lange Hero-Absatz steht vollständig im Seiteninhalt. Maps werden weiterhin erst nach Klick geladen.

## Gartenmotiv

**Modus:** eingebaute Bildgenerierung (image_gen), keine CLI.
**Verwendung:** KI-generierte Gartenvisualisierung. Hinweis sichtbar im Hero und in primaryImageOfPage. Echte Team- und Projektfotos bleiben separat.
**Finales Website-Asset:** public/images/regionen/garten-hero-ki-2026-1920.webp, daneben AVIF und 960-Pixel-Varianten.
**Absoluter finaler Pfad:** C:/Users/Loni Galabau GmbH/Desktop/Loni Galabau Projekte/Webseite/Loni Webseite/seo-site/public/images/regionen/garten-hero-ki-2026-1920.webp
**Arbeitskopie des Originals:** C:/Users/Loni Galabau GmbH/Desktop/Loni Galabau Projekte/Webseite/Loni Webseite/tmp/garten-hero-ki-2026-master.png

### Verwendeter finaler Prompt

```text
Create one ultra-photorealistic landscape photograph for the full-bleed hero of a premium German garden and landscaping company's website, wide cinematic 16:9 composition.

Scene: a beautifully completed, believable private residential garden in central Germany on a warm early summer evening. A precise light warm-grey natural stone terrace in the foreground connects with a rich green lawn, gently layered perennial planting, ornamental grasses, white flowers, small multi-stem trees and a clipped mixed green hedge. A subtle modern understated home sits toward the far right edge. Tasteful real timber garden seating is integrated into the terrace. The garden is beautiful but realistically attainable, with grounded construction details, coherent paving joints and edges, natural leaf variation and fine stone texture. No swimming pool, no extravagant mansion.

Photography: real professional architectural landscape photography, eye-level wide lens around 28mm, crisp believable detail, physically correct warm low sunlight, soft natural shadows, authentic colours with lush greens and inviting golden light, no HDR look, no artificial excessive saturation, no CGI or illustration. The garden should feel calm, welcoming and expertly built.

Website composition: preserve a dark-green quiet area from planting across the left third to support large white website text overlaid later; let the main terrace and lawn scene breathe through the central band; keep the scene attractive when cropped for mobile. Do not draw any text or interface into the image. No people, no workers, no logos, no lettering, no watermarks. Output just the photograph, high resolution. This is an aspirational AI garden visualization, not documentation of an actual built customer project.
```

## SEO-Recherche

Die ergänzende Keywordrecherche über die vorhandene lokale OpenSEO-Instanz wird in [Regional-Conversion-Keywords-2026-10-05.md](Regional-Conversion-Keywords-2026-10-05.md) dokumentiert. Suchvolumen und Sichtbarkeit werden nur als belegt bezeichnet, wenn das Tool Daten liefert.

## Prüfung und Veröffentlichung

168 Anwendungstests, TypeScript und gezieltes ESLint bestanden. Lokale Browserprüfung bei 1366, 390 und 320 Pixeln ohne horizontalen Überlauf: Hero-Bild, weiße Überschrift, gestapelte Buttons und drei Formularschritte geprüft. Fehler im Namensschritt werden angezeigt und fokussiert. Die Karte darf mit zusätzlichen Hinweisen wachsen. Wunschtermin- und Datenschutzfelder sind bedienbar, ohne eine Anfrage abzusenden.

Auf Nutzerwunsch hat ausschließlich die kompakte Hero-Karte einen 90% weißen Hintergrund mit 14px Blur, feine Eingabefelder und eine 5px-Schwebeanimation in sieben Sekunden. Bei Hover oder Fokus pausiert sie; bei reduzierter Bewegung ist sie abgeschaltet. Das bestehende Startseitenformular behält seine Darstellung.

Auf weitere Nutzerkorrektur erhalten auch die beiden unteren Inhaltsabschnitte je ein echtes Projektfoto und ein wechselndes Text-/Bildlayout. Mobil folgt auf die Überschrift zuerst das Bild und danach der Text. Vorbereitung und FAQ bilden einen eigenständigen Bereich: zwei Spalten am Desktop, untereinander mobil. Die Originaltexte und Fragen bleiben erhalten. Desktopspalten und 320-Pixel-Layout im Browser geprüft: 269 Pixel breite Blöcke, kein horizontaler Überlauf, Projektbild geladen. Der Fachnachweis öffnet seine bestehende Dokumentvorschau.

168 Anwendungstests, abschließende Typprüfung, gezieltes ESLint und der aktualisierte Produktionsbuild bestanden. Lokaler HTML-/Asset-Audit: elf Regional-/Übersichtsseiten, 265 Bildziele, 32 interne Ziele und 49 Sitemap-URLs ohne Befund. Jede Stadtseite hat genau ein Rückrufformular, zwei weitere Detailfotos und die Team-/Nachweisbereiche; Karten-Iframes werden weiterhin erst nach Freigabe geladen.

Nach Fertigstellung der weiteren Layoutkorrekturen erteilte der Nutzer am 05.10.2026 ausdrücklich die Freigabe **„Ja, jetzt veröffentlichen und sichern“** für alle zehn Stadtseiten. Die automatische Freigabeprüfung ließ den Workflow nach der direkten Nutzerfreigabe zu. Die Veröffentlichung und Sicherung des Programmstands sind abgeschlossen; der abschließende Stand ist unten dokumentiert.


## Finaler Live-Stand

**Version 59**: erfolgreich öffentlich veröffentlicht am **05.10.2026, 10:10:27 MESZ**, Deploymentstatus succeeded. Quellcommit 2a5064cce64f51da8aa942fe7b7577f655edc470; Deployment appgdep_6ac35b5b3d148191b3abd7d499d79f09.

- Live-Browser Hattersheim: neues Hero-Bild geladen, Glashintergrund und Blur vorhanden, Buttons untereinander mit Abstand.
- Live-Audit 2026-10-05T08:12:23.293Z: **elf Regional-/Übersichtsseiten, 265 Bildziele, 32 interne Ziele und alle 49 Sitemap-Seiten ohne Befund** in den ausgeführten HTML-/Asset-/Linkprüfungen. Jede Stadtseite: genau ein Rückrufformular, acht frühe Galeriefotos, zwei Detailfotos, Team/Fachnachweise und weiterhin keine Karten-Iframes vor Aktivierung.
- Kostenloser OpenSEO-Audit am 05.10.2026: 56 Ziele einschließlich aller 49 Sitemap-Seiten, **alle zehn Ortsseiten ohne Issues**. Gesamtsite: 0 critical, 1 warning (/jobs thin-content) und 6 info; genaue URLs und Einordnung im Keywordbericht. Kein Lighthouse und keine zusätzliche bezahlte Keywordabfrage.
- [Programmstand auf GitHub main](https://github.com/LoniGalaBauGmbH/lonigalabau/commit/8fab327362c65418aae6850e378bba08c0aee940): Quellbaum exakt mit dem geprüften lokalen Stand abgeglichen, ohne Force-Update. Die nachträgliche Statusdokumentation verändert keinen veröffentlichten Programmcode.
- Keine Live-Testanfrage abgeschickt. Die technische Prüfung belegt keine Google-Indexierung, Rankingsteigerung oder höhere Anfragenquote.
