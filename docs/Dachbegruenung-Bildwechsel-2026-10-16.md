# Dachbegrünung: eigene KI-Motive statt fremder Fotografien

Stand: 16.10.2026. Nutzerauftrag: keine fremden Bilder auf der Dachseite; eigens generieren oder Stockfotos verwenden. Umsetzung mit der integrierten Bildgenerierung (image_gen), ohne externe Fotovorlagen.

## Änderung

Vier neue KI-Motive ersetzen die vier Fremdfotos aus V76 vollständig. Je 480/800/1200 px in AVIF und WebP, insgesamt 24 neue Dateien unter `public/images/dachbegruenung/`. Die 24 bisherigen Varianten von OKOPOD, CHS, U.S. Air Force und UMBC sind aus dem aktuellen Quell-/Assetstand entfernt. Historische Lizenznachweise bleiben im Bericht zu V76 nachvollziehbar.

Das vorhandene KI-Hero und das eigene Loni-Teamfoto bleiben erhalten. Alle fünf Dach-/Pflanzenmotive sind nun KI-Visualisierungen. Sichtbare Hinweise und Alternativtexte nennen die Herkunft und stellen keine ausgeführten Kundenprojekte dar. Der Bildnachweisbereich enthält jetzt diese Erklärung und die weiterhin passenden fachlichen Grundlagen. Layout, Leistungsumfang und Anfrageablauf bleiben erhalten.

## Motive und Dateien

| Motiv | Ausgabedateien (AVIF/WebP, 480/800/1200) |
| --- | --- |
| Gartenhaus mit Sedumdach | `public/images/dachbegruenung/gartenhaus-visualisierung-*` |
| Begrüntes Flachdach | `public/images/dachbegruenung/flachdach-visualisierung-*` |
| Sedum-Nahaufnahme | `public/images/dachbegruenung/sedum-visualisierung-*` |
| Größere Dachfläche | `public/images/dachbegruenung/dachflaeche-visualisierung-*` |

Originalausgaben jeweils 1536 × 1024, aus der integrierten Generierung in die optimierten Projektassets übernommen. Vollauflösende Originale bleiben außerhalb Git. Keine Fremdfotos als Eingabe, keine Lizenzkosten für Stockbilder. Sichtprüfung: Dachränder, Pflanzen und Perspektive plausibel; natürliche Farbtöne und klare zentrale Motive für die bestehenden Bildausschnitte.

## Verwendete Prompts

### gartenhaus

Use case: photorealistic-natural. Asset type: website service photo, landscape 3:2. Create an original realistic architectural photograph of a small contemporary garden shed in a well cared for German suburban garden, simple warm natural timber cladding, one dark framed door, finished flat green roof covered with low sedum. Camera slightly elevated at a three-quarter front angle so the planted roof is prominent in the middle of the image. The roof has a clean dark metal edge and a modest gravel perimeter, structurally believable. Center the entire garden shed so it works in a portrait crop too. Soft late afternoon daylight, understated olive greens, natural wood and neutral stone, realistic imperfect plants and organic ground textures. Premium landscape gardening website visual, not a CGI render, not overly glossy, no extreme HDR. No people, logos, writing, signs, watermark, architectural landmark or existing branded building. Single scene, no collage.

### flachdach

Use case: photorealistic-natural. Asset type: website service photo, landscape 3:2. Generate an original natural architectural photograph of an extensive sedum green roof on a simple low modern residential annex in a leafy German neighbourhood. View from a moderately elevated nearby terrace looking across the broad rectangular roof, its silver-grey metal parapet and narrow clean gravel border visible, the surrounding timber and cream plaster architecture discreet in the far background. Low drought-tolerant sedum in a varied restrained green and burgundy carpet, tiny seasonal flowers, believable geometry and realistic scale. Roof fills foreground and central image; retain interest when center-cropped vertically. Diffused warm daylight, muted green colour grading with natural highlights, premium but authentic garden photography. No people, logos, typography, labels, solar panels or recognizable real building. Do not make it a rooftop garden with trees. Single scene, no montage.

### sedum

Use case: photorealistic-natural. Asset type: landscape 3:2 website photo. Create an original detailed editorial macro photograph of living sedum on a planted roof, a diverse natural carpet of small succulent leaves in sage, olive and muted wine-red, a few fine pale-yellow star-shaped flowers. Low oblique viewpoint, texture across entire composition, central small green sedum rosettes sharp with soft natural depth-of-field into background. Fine substrate visible in a few small gaps, authentic plant proportions and growth, soft morning daylight. Lush but realistic and understated premium landscape gardening photography, no plastic uniform pattern, no oversaturation, no artificial dew, no people, writing, logos or watermark. Single image.

### dachflaeche

Use case: photorealistic-natural. Asset type: landscape 3:2 website image for a dark green benefits section, also used in a near-square crop. Create an original realistic architectural photograph looking diagonally over a finished low-rise green roof towards a peaceful German suburban garden with mature deciduous trees. An extensive sedum carpet in nuanced moss green, olive and small muted reddish patches occupies most of foreground and center; the roof edge is a crisp restrained anthracite metal fascia, a narrow pale gravel maintenance strip inside the perimeter. The scene should feel approachable for a professional garden and landscape company, soft golden late afternoon daylight without dramatic flare. Quiet warm timber and light stucco walls partly visible beyond the roof, authentic material textures, strong clear composition, generous green roof area. Not an aerial satellite view, no photorealism-breaking geometry, no roof furniture, no people, text, logo, watermark or recognizable real building. Single scene.

## Prüfungen und Veröffentlichung

Typprüfung, gezieltes ESLint und offizieller Client-/Serverbuild bestanden. Lokale Vorschau bei 320/390/1440 px ohne horizontalen Überlauf; alle vier neuen Motive geladen, Bildausschnitte und Kennzeichnung visuell geprüft, keine Browserfehler. Neuer Herkunftshinweis per nativem Details-Element geöffnet und geprüft. Der Austausch betrifft Bilder und Herkunftstexte, keine Backend-/Formularlogik; die 231 Bestandstests wurden für diese reine Bildänderung nicht erneut ausgeführt.

**Version 77 veröffentlicht am 16.10.2026 um 16:06:14 MESZ**, Status succeeded. Quellcommit `f2a7aded8b49733b8acf51e84f18f4771d8ee57a`, Deployment `appgdep_6ad22f3cd2d48191b6fa8a971aad5b4d`. Öffentliche Audience und Umgebung Revision 4 erhalten. Quellsynchronisierung über offiziellen Sites-Helfer; nach bekanntem Windows-Bash-Packagerfehler mit unverändertem offiziellen Vorbereitungsskript und Windows-tar verpackt. Archiv aus demselben Quellstand, 902 Dateien bei Sites.

- [Live-Dachseite](https://www.loni-galabau.de/dachbegruenung)
- [Sites-Veröffentlichung](https://loni-galabau.serhad1999.chatgpt.site)

Live-HTTP um 16:07:19 MESZ: Startseite, Leistungsübersicht, Dachseite und Sitemap HTTP 200; 55 eindeutige Sitemap-URLs. Alle 32 aktuellen Dachbildvarianten bytegleich zur lokalen Quelle und korrekte MIME-Typen. Je eine alte 1200px-WebP-URL für alle vier entfernten Fremdmotive liefert 404. Initiales HTML enthält alle neuen Motive/Herkunftstexte und keine alten Assetnamen oder Fremdbildnachweise. JSON-LD weiterhin gültig.

Live-Browser bei 320/390/1440 px ohne horizontalen Überlauf, alle vier neuen Motive vollständig geladen, keine Browserfehler. Beim Wechsel der Auflösung zunächst noch ein Bild im Ladevorgang; anschließende endgültige Prüfung erfolgreich. Mobile und Desktop-Bildausschnitte visuell geprüft. Keine Anfrage versendet. Abschlussdokumentation verändert keinen veröffentlichten Programmcode; GitHub-Abgleich im Abschlussbericht.

Auf die anschließende Nutzerfrage zur Keywordstärke wurden die bereits erhobenen DataForSEO-Werte vom 16.10. erläutert. Keine neue kostenpflichtige Recherche; kleine regionale Nachfrage und stärkere Anfrageabsicht von Angebot/Firma von breiter Informations-/Heimwerkernachfrage unterschieden. Anzeigenwettbewerb ist keine organische Ranking-Schwierigkeit; tatsächliche Rankings/Leads weiter unbelegt.

