# Ratgeber-Überarbeitung vom 01.10.2026

## Inhalt und Autorenangabe

Alle sechs bestehenden Ratgeber wurden konkretisiert. Jeder Beitrag enthält einen Kurzüberblick, eine thematisch passende Vergleichstabelle, Hinweise zur Vorbereitung einer Anfrage und einen nachvollziehbaren Verweis auf das eigene Bildarchiv. Die vorhandenen Formulare, Leistungslinks und weiterführenden Ratgeber bleiben eingebunden.

| Beitrag | Wesentliche Ergänzung |
| --- | --- |
| Pflasterarbeiten | Kostenbestandteile und Angebotsumfang vergleichen; Titel auf Kostenfaktoren präzisiert. Keine erfundenen Quadratmeterpreise oder Projektkosten. |
| Rollrasen oder Einsaat | Anwachsen, Entwicklung, Nutzung und Pflege gegenübergestellt; Zeiträume sind bedingte Orientierung, keine Terminzusage. |
| Garten in Etappen | Bauabschnitte mit Voraussetzungen und Übergaben strukturiert. |
| Terrassenentwässerung | Beobachtungen vor Ort und die daraus folgenden Planungsfragen gegenübergestellt. |
| Gartenbewässerung | Unterschiedliche Gartenbereiche und ihre Anforderungen eingeordnet. |
| Naturstein | Vier konkrete Materialbeispiele, Oberflächen, Frostnachweis, Rutschhemmung und Pflege erläutert. Verfügbarkeit und Ausführung werden projektbezogen abgestimmt. |

Die Galerien sind teilweise Zusammenstellungen. Aus Bildern wurden keine nicht belegten Bauabläufe, Kosten, Materiallieferungen oder Rasenverfahren abgeleitet. Hersteller- und Fachquellen sind im jeweiligen Artikel verlinkt. Veröffentlichungs- und Aktualisierungsdatum sind sichtbar und stimmen mit dem BlogPosting-Schema überein.

Serhad Marasli hat seine Rolle als **Bau- & Operations Manager** bestätigt. Diese steht sichtbar im Autorenprofil und in den strukturierten Person-Daten. Auf seinen ausdrücklichen Wunsch steht die Firma gestalterisch im Vordergrund: Der Profilkopf lautet **„Über unsere Ratgeber“**, der Name erscheint als kleine Autorenzeile. Keine große Namensüberschrift und keine persönliche Inszenierung ergänzen. Keine zusätzlichen Qualifikationen oder Erfahrungsjahre erfinden.

Die Firma arbeitet deutschlandweit; Hattersheim am Main bei Frankfurt bezeichnet den Firmensitz.

## Bildauslieferung

Der statische Hostingpfad lieferte in der Ratgeber-Prüfung 24 gültige WebP-Dateien mit `application/octet-stream`. Der neue, ausschließlich für vorhandene öffentliche Build-Bilder freigegebene Pfad `/__public-webp/…` setzt `image/webp`, `nosniff` und einen Tag Browser-Cache. Cookies und Autorisierungsheader werden nicht an die Asset-Bindung weitergereicht. Unbekannte Dateien werden mit 404, unzulässige Methoden mit 405 und `no-store` beantwortet.

Live-Test der Route in Version 47: GET/HEAD 200, gültige WebP-Signatur, ETag und bedingte Anfrage mit 304 bestätigt. Der Hostinganbieter beantwortet Range-Anfragen im geprüften Fall mit der vollständigen Datei (200); eine Teilantwort wird nicht behauptet. AVIF-Dateien behalten ihre direkte statische Auslieferung. Alte statische WebP-Adressen bleiben erreichbar; ihre vom Hostinganbieter gesetzten Header werden dadurch nicht rückwirkend geändert.

Produktive Projektbilder, responsive WebP-Varianten sowie Artikel-Schema und Social-Vorschaubilder verwenden seit Version 48 die korrigierte Route. In der lokalen Entwicklung bleiben direkte Bildpfade aktiv.

## Prüfungen und Veröffentlichung

- Version 47 veröffentlicht: 01.10.2026, 11:02 MESZ; Quellstand `910b425e2b8877061924a245d372f375d57bd369`.
- Alle 101 Tests bestanden. Nach der Bildumstellung die fünf betroffenen Inhalts-/Bildtests erneut bestanden. Typprüfung, gezieltes ESLint und Produktionsbuild erfolgreich.
- Version-47-Liveprüfung: sechs Artikel, Übersicht und Autorenprofil jeweils 200; eindeutige Metadaten, eine H1, passende Canonicals, keine Indexsperre, Autorenrolle, Tabellen und Projektlinks vorhanden. Acht passende Sitemap-Einträge und 15 zusätzliche interne Ziele geprüft. 42 Bildantworten geprüft; ausschließlich die 24 beschriebenen WebP-MIME-Abweichungen festgestellt.
- Mobile Darstellung bei 390 Pixeln geprüft: kein horizontaler Seitenüberlauf; breite Tabellen scrollen innerhalb des Artikels. Desktop- und Autorenansicht visuell geprüft.
- **Finale Version 48 veröffentlicht:** 01.10.2026, 11:19 MESZ; Quellstand `fe0101a9efd5d48af80cc08a0d846941c79aa23c`. Enthält Bildkorrektur und die vom Nutzer gewünschte dezente Autorenansicht. Deploymentstatus `succeeded`.
- Abschließender Live-Audit um 11:20 MESZ: **alle acht Ratgeber-Seiten, 15 zusätzliche interne Ziele und 42 Bildantworten ohne Befund oder Warnung**. Die 24 WebP-MIME-Abweichungen der verwendeten Bildadressen sind behoben. Die neue Autorenüberschrift und kleine Namenszeile auf der Live-Seite visuell bestätigt.

## Google-Indexierung

Die URL-Prüfung am 01.10.2026 vor der Überarbeitung zeigte **einen indexierten und fünf nicht indexierte Ratgeber**:

| Ratgeber | Letzter bestätigter Google-Status |
| --- | --- |
| Terrassenentwässerung | Indexiert |
| Pflasterarbeiten | Gecrawlt, derzeit nicht indexiert |
| Rollrasen oder Einsaat | Gecrawlt, derzeit nicht indexiert |
| Garten in Etappen | Gecrawlt, derzeit nicht indexiert |
| Gartenbewässerung | Gecrawlt, derzeit nicht indexiert |
| Naturstein | Gefunden, derzeit nicht indexiert; Live-Test: indexierbar |

Nach Veröffentlichung der neuen Inhalte wurde die Indexierung des Naturstein-Ratgebers beantragt. Google lehnte den Antrag am 01.10.2026 gegen 11:08 MESZ mit **„Quota Exceeded“** ab. In diesem Arbeitslauf wurde somit kein neuer Einzelantrag angenommen. Nach der Kontingentmeldung wurden keine weiteren Anträge wiederholt und keine Umgehung versucht.

Alle Artikel bleiben über die eingereichte Sitemap mit aktualisiertem `lastmod` auffindbar. Die fünf ausstehenden Einzelanträge können nach Freigabe des Tageskontingents erneut gestellt werden. Eine automatische Nachkontrolle wurde nicht eingerichtet. Weder Sitemap noch Live-Test oder ein angenommener Antrag garantieren die tatsächliche Indexierung oder ein Ranking.

Private Rohbelege, vollständige Google-Prüfungen und Bildschirmnachweise liegen außerhalb des öffentlichen Repositorys.
