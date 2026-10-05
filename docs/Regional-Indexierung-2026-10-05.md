# Stadtseiten: Google-Anmeldung und deutschlandweite Übersicht

Stand: 05.10.2026. Anträge und tatsächliche Google-Indexierung werden getrennt dokumentiert.

## Deutschlandweiter Einsatz auf der Übersicht

Die Übersicht `/einsatzgebiete` nennt den deutschlandweiten Garten- und Landschaftsbau jetzt direkt in der Hauptüberschrift, Einleitung und im Kontaktbereich. Der reale Firmensitz bleibt Hattersheim am Main. Die zehn Ortsseiten zeigen regionale Beispiele im Rhein-Main-Gebiet; auch Besucher aus jedem anderen Ort in Deutschland werden ausdrücklich zur Anfrage eingeladen. Ein neuer primärer Button führt zum vorhandenen Anfrageformular, der zweite Link zu den regionalen Beispielen. Titel, Beschreibung und CollectionPage-Schema wurden entsprechend angepasst; die bestehenden Stadtseiten und ihre URLs bleiben erhalten.

Als **Version 61 am 05.10.2026 um 10:44:38 MESZ** veröffentlicht:

- Quellcommit: `134d4400606ff360b203b5a647431cc5d58f1ad0`.
- Version: `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_6a3b6abd8ffc8191a7fc728edf92616c`.
- Deployment: `appgdep_6ac3635dd2bc8191a3018e0fa5156222`, Status `succeeded`.
- URL: https://www.loni-galabau.de/einsatzgebiete.
- Bereits veröffentlichte Dokumente aus Version 60 beim Quellabgleich erhalten; keine fremden Änderungen verworfen.

Prüfung: sieben vorhandene Regionaltests, TypeScript, gezieltes ESLint, Format- und Diffprüfung sowie Produktionsbuild erfolgreich. Desktop und Mobilbreiten 390/320 px ohne horizontalen Überlauf; beide Hero-Ziele vorhanden, keine Anfrage abgeschickt. Öffentliche Live-Prüfung um 10:48:40 MESZ: 13/13 Prüfungen bestanden, HTTP 200, korrekte H1/Metadata/Canonical und gültige Schemas, Anfrageanker und zehn Stadtlinks vorhanden. Sitemap hat 49 eindeutige URLs; echtes Änderungsdatum der Übersicht `2026-10-05T08:37:51.000Z`.

## Google-Indexstatus und Sitemap

Kostenfreie OpenSEO-Abfrage `inspect_urls`, 10:24:31–10:27:13 MESZ: alle zehn Ortsseiten sowie `/einsatzgebiete` erfolgreich gelesen. Die vorhandene OpenSEO-Verbindung verwendet die URL-Prefix-Property `https://www.loni-galabau.de/`; die MCP-Schnittstelle hat kein Property-Argument. Alle elf URLs meldeten zunächst `NEUTRAL` / „URL ist Google nicht bekannt“. Crawlzeit, Canonicals und Sitemapzuordnung fehlten, Sperr- und Fetchzustände waren nicht spezifiziert. Das belegt keine robots/noindex-Sperre.

Die aktuelle Sitemap `https://www.loni-galabau.de/sitemap.xml` wurde in der Domain-Property `sc-domain:loni-galabau.de` erneut eingereicht. Google bestätigte **„Sitemap submitted successfully“** und das Einreichdatum **05.10.2026**. Direkt danach zeigte die Konsole noch den historischen letzten Abruf 30.09.2026 mit 38 erkannten Seiten. Die öffentliche Datei enthält bereits 49 URLs inklusive aller zehn Ortsseiten; die neue Einreichung bedeutet keine bestätigte Indexierung dieser 49 Seiten.

Eine zusätzliche öffentliche HTTP-Prüfung um 10:31:12 MESZ bestand für alle zehn Stadtseiten: HTTP 200 ohne Weiterleitung, keine Meta-Robots- oder X-Robots-Sperre, genau ein passender Canonical, durch robots.txt erlaubt und über echte HTML-Links auf der Übersicht auffindbar. Kein tatsächlicher Googlebot-Zugriff wurde dabei gemessen.

## Einzelanträge

Einzelanträge erfolgen über die vorhandene www-Property. Bestätigt wird nur ein sichtbares „Indexing requested“ beziehungsweise die entsprechende Erfolgsanzeige; laufende oder fehlgeschlagene Versuche zählen nicht als angenommen.

| Seite | Einzelantrag am 05.10.2026 |
| --- | --- |
| `/gartenbau-hattersheim` | Bestätigt; erster Versuch in der Domain-Property mit allgemeinem Fehler, danach erfolgreich auf der www-Property. |
| `/gartenbau-kelsterbach` | Bestätigt auf der www-Property. |
| `/gartenbau-hofheim` | Bestätigt nach zwei vorübergehenden allgemeinen Google-Fehlern. |
| `/gartenbau-kriftel` | Bestätigt. |
| `/gartenbau-floersheim` | Bestätigt. |
| `/gartenbau-hochheim` | Bestätigt. |
| `/gartenbau-frankfurt-hoechst` | Bestätigt. |
| `/gartenbau-bad-soden` | Bestätigt. |
| `/gartenbau-sulzbach-taunus` | Bestätigt. |
| `/gartenbau-eschborn` | Bestätigt. |

Alle zehn Stadtanträge wurden am Vormittag sichtbar mit „Indexing requested“ angenommen. Beim anschließenden zusätzlichen Einzelantrag für `/einsatzgebiete` zeigte Google **„Quota Exceeded“** mit dem Hinweis auf das Tageslimit. Dieser elfte Einzelantrag ist nicht bestätigt; weitere Anträge wurden beendet. Die Übersicht ist über die erfolgreich eingereichte Sitemap angemeldet. Keine automatische Wiederholung eingerichtet.

Vor den Anträgen für Hochheim, Bad Soden und Hofheim sowie der Übersicht zeigte die Konsole bereits „Discovered – currently not indexed“ und die Sitemap als Quelle; zunächst fehlte diese Zuordnung. Das ist ein Fund durch Google, keine Aufnahme in den Index. Zeitweise allgemeine Antragsfehler und eine HTTP-503-Seite der Search Console wurden beobachtet; ihre Ursache ist nicht belegt. Das spätere bestätigte Tageslimit beim Übersicht-Antrag erklärt diese vorangegangenen allgemeinen Fehler nicht automatisch.

Die tatsächliche Aufnahme aller Stadtseiten in Google ist noch nicht belegt. Google entscheidet über Zeitpunkt und Aufnahme; mehrfaches Einreichen derselben URL beschleunigt den Crawl nicht. [Offizielle Google-Dokumentation](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

Private Rohantworten, HTTP-Protokolle und Screenshots verbleiben außerhalb des Website-Repositories. Keine kostenpflichtigen Keyword- oder SERP-Abfragen für diesen Indexierungsauftrag. Die Google-Anmeldung der zehn Stadtseiten ist abgeschlossen; die tatsächliche Aufnahme bleibt offen. Vollständiger veröffentlichter Stand einschließlich aller acht Dokumenten-Assets auf GitHub-main gesichert: [Commit c7d76444f00b1d1a35d8311a8e04190faabff4b7](https://github.com/LoniGalaBauGmbH/lonigalabau/commit/c7d76444f00b1d1a35d8311a8e04190faabff4b7). Alle acht neuen Binärblobs nativ übertragen und gegen ihre lokalen Git-Prüfsummen verifiziert. GitHub-Inhaltsbaum `79aa8d65bf7ca4fecda0dfd182f53cbd6c6ef4b9` identisch zu `bf21ab2b053028a3723148f3aaefd57c74a8af15`; Main nach dem Update erneut bestätigt und lokal zusammengeführt. Parallel vorbereitete Keyword-Arbeiten bei der lokalen Zusammenführung erhalten und durch diese Sicherung nicht zusätzlich veröffentlicht. Diese abschließende Protokolländerung betrifft keinen Live-Programmcode.
