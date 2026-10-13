# Bildorientierter Aufbau der Zisternenseite – 13.10.2026

## Nutzerauftrag und Umsetzung

Der Nutzer wünscht kleine, schlichte Herstellerlogos unmittelbar unter dem Hero und eine stärker mit Bildern gestaltete Seite. Große Herstellerkarten und ihre Beschreibungen entfallen zugunsten einer kompakten Logo-Linkzeile. Originalfarben und Proportionen von GRAF, REWATEC und Mall bleiben erhalten; bestätigte Nutzungsfreigaben vom heutigen Vorgang gelten weiter.

Drei bereits veröffentlichte, katalogisierte Nutzerfotos werden in bestehende Inhalte eingebunden, keine zusätzliche Referenzgalerie und keine neu behaupteten Zisternenprojekte:

- `garten-mit-rasen-und-bepflanzung.webp` (IMG_8590.HEIC): fertiger Garten, Kontext Regenwassernutzung.
- `tropfbewaesserung-im-pflanzbeet.webp` (IMG_6587.jpg): Tropfschlauch im Beet, Kontext Bewässerung.
- `terrassenunterkonstruktion.webp` (IMG_8434.HEIC): tatsächliche Bauphase einer Terrasse, Kontext Vorarbeiten/Nachrüstung.

Herkunft: `docs/bildkatalog.md`. Alle Motive visuell vor Verwendung geprüft. Vorhandene `ProjectImage`-Komponente mit AVIF/WebP-Varianten, Größenangaben, zentralen Alternativtexten und verzögertem Laden. Keine neuen Originaldateien oder kostenpflichtigen Keyword-Aufrufe. Das korrigierte KI-Schnittbild v2 bleibt unverändert und vollständig sichtbar.

Sichtbare Texte werden gekürzt und über Bild-/Textbereiche verteilt. Fachliche Details zu Bettung, Tiefe, Grundwasser, Belastung, Überlauf und Rückstauschutz bleiben in klar benannten, bedienbaren Aufklappbereichen erreichbar. Einbau-/Nachrüst-/Kostenintention, sechs FAQ, Meta-/Schema-Daten, Anfrageformular und deutschlandweiter Einsatz mit Sitz Hattersheim bleiben erhalten.

## Prüf- und Veröffentlichungsstand

231 Anwendungstests, finale Typprüfung, gezieltes ESLint und Produktionsbuild bestanden. Lokaler HTTP-Nachweis: Seite HTTP 200, unverändert 54 Sitemap-URLs, beide nativen technischen Details samt Text bereits im initialen HTML und 29 verwendete Bildvarianten/Logos bytegleich mit korrektem MIME, Tagescache, HEAD und ETag-304. Die drei Fotos nutzen bereits vorhandene Dateien; keine zusätzlichen Bilddownloads oder Original-Uploads erforderlich.

Finale lokale Browserprüfung am 13.10.2026 um 08:33:20 MESZ bestanden: 320/390/1440 Pixel, keine horizontalen Überläufe, JS-/Netzwerk-/Assetfehler oder Mutationsversuche. Alle drei kleinen Logos unmittelbar nach dem Hero, drei verteilte responsive Fotos mit passenden Beschriftungen, unverändertes v2-Schnittbild vollständig, zwei native Technikdetails und sechs FAQ per Tastatur, beide Anker und Formularstruktur geprüft. Kein Versand. Screenshots tatsächlich visuell geprüft.

Die erste Screenshot-Sichtprüfung erkannte eine Überdeckung des am rechten Rand stehenden Mall-Logos durch WhatsApp auf Desktop sowie umbrochene Systemnummern bei 320 px. Logo-Gruppe deshalb mittig platziert und Nummern gegen Umbrechen geschützt; finale Wiederprüfung bestätigt beide Korrekturen. Zwischenbericht privat separat erhalten.

**Live in Version 72 am 13.10.2026 um 08:36:25 MESZ.** Quellcommit `08e4d4fcd274c2011074a52d82f7e063351a711a`, Deployment `appgdep_6acdd15293bc8191b209da7230303f38`, gespeicherte Version `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_5e77829cfa7881918d8e3eb8bd850101`. Audience weiterhin öffentlich. Bekannter Windows-Bash-Startfehler des offiziellen Helfers erst nach erfolgreichem Quellpush; gebautes Archiv anschließend mit bisherigem Windows-Verfahren gepackt, Worker-Einstieg/Manifest/Private-Dateigrenzen geprüft. Kein Remote-Build-Fallback.

Live-HTTP-Prüfung 08:37:03 MESZ: normale Hauptdomain, HTTP 200, 54 Sitemap-URLs, zwei native Fachdetails inklusive initialer Texte und alle 29 verwendeten Bildvarianten/Logos bytegleich sowie MIME/Cache/HEAD/ETag-304 korrekt. Finale Live-Browserprüfung 08:37:30 MESZ ohne Cachebuster: 320/390/1440, keine Befunde; kleine Logozeile an korrekter Position, drei Fotos mit passenden Beschriftungen und Größen, unverändertes vollständiges KI-Bild, korrekte Metadaten, Details/FAQ/Anker/Formularstruktur. Logo-/Foto-/Hero-Screenshots tatsächlich angesehen. Kein Formularversand oder App-Schreibzugriff; drei automatische Cloudflare-Challenge-POSTs ebenfalls blockiert und als Infrastrukturversuche separat dokumentiert. Finale private Berichte `live-http-qa.json` und `live-browser-qa.json`, Zwischenbelege separat erhalten.

Keine neue Keywordrecherche, kein API-Verbrauch und keine neue Google-Indexierungs-/Rankingbehauptung. Abschlussdokumentation verändert den Live-Programmcode nicht. GitHub-Synchronisierung auf `main` anschließend ohne Force-Push und mit Remote-/Inhaltsbaum-Abgleich; Ergebnis im Abschlussbericht.

Grobe Quelltextauswertung des Page-Agenten: initial sichtbare Prosa ungefähr um ein Viertel gekürzt; dies ist eine Näherung aus dem Syntaxbaum, keine exakte Browser-Wortzählung und keine SEO-Erfolgsmetrik.
