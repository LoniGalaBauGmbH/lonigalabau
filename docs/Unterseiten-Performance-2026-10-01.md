# Unterseiten: technischer Stand und mobile Performance – 1. Oktober 2026

Ausgangsmessung vor den Änderungen (Version 41): Der technische Live-Audit ist ohne Befund; die mobile Performance ist je nach Unterseite unterschiedlich. Vier von sieben geprüften Unterseiten erreichen 98–99 Punkte, die beiden Leistungsseiten und die Projektübersicht 81–88 Punkte. Daraus folgt keine vollständige Optimierung aller Unterseiten.

Die folgende Baseline wurde am Morgen des 01.10.2026 vor den Änderungen auf Version 41 erhoben. Die späteren Optimierungen und Veröffentlichungen bis Version 45 sind weiter unten dokumentiert. Die gemeinsamen Inline-Stile und die Schriftstrategie `font-display: optional` ohne Fontpreload gelten auch auf Unterseiten. Die verzögerte Aktivierung von Formular und Leistungs-Slider wurde dagegen nur auf der Startseite eingebaut.

## Mobile Stichproben

Offizielle PageSpeed-Insights-Oberfläche am 01.10.2026 zwischen 08:51:06 und 08:53:52 MESZ: Moto-G-Power-Emulation, langsames 4G, Lighthouse 13.5.0, erster Seitenaufbau. Je URL liegt **ein einzelner Lauf** vor, keine Vorher-/Nachher-Messreihe. Keine CrUX-Felddaten verfügbar. Die genauen Werte stammen aus den Berichten; gerundete UI-Anzeigen können abweichen. Bf. = Barrierefreiheit, BP = Best Practices.

| Unterseite / Bericht | Performance | FCP | LCP | TBT | CLS | Bf. | BP | SEO |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| [Gartengestaltung](https://www.loni-galabau.de/leistungen/gartengestaltung) · [PSI](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-leistungen-gartengestaltung/colmzrch7a?form_factor=mobile) | 82 | 2,270 s | 4,514 s | 0 ms | 0 | 97 | 96 | 100 |
| [Pflasterarbeiten](https://www.loni-galabau.de/leistungen/pflasterarbeiten) · [PSI](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-leistungen-pflasterarbeiten/ju3mgfxvg9?form_factor=mobile) | 81 | 2,292 s | 4,681 s | 28 ms | 0 | 97 | 96 | 100 |
| [Projektübersicht](https://www.loni-galabau.de/projekte) · [PSI](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-projekte/9ej4ezo1h2?form_factor=mobile) | 88 | 1,501 s | 3,807 s | 0 ms | 0 | 96 | 100 | 100 |
| [Projektgalerie Gärten](https://www.loni-galabau.de/projekte/c6a3dbe3-8883-4785-b7b5-422cd4e9cef6) · [PSI](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-projekte-c6a3dbe3-8883-4785-b7b5-422cd4e9cef6/fbuc51ardp?form_factor=mobile) | 98 | 1,820 s | 1,820 s | 0 ms | 0 | 96 | 100 | 100 |
| [Ratgeber Pflasterkosten](https://www.loni-galabau.de/ratgeber/pflasterarbeiten-kosten-einfahrt) · [PSI](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-ratgeber-pflasterarbeiten-kosten-einfahrt/wz1fnn6sb2?form_factor=mobile) | 98 | 1,072 s | 2,251 s | 0 ms | 0 | 97 | 100 | 100 |
| [Kontakt](https://www.loni-galabau.de/kontakt) · [PSI](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-kontakt/p5bwiqwrw9?form_factor=mobile) | 99 | 1,501 s | 2,101 s | 2 ms | 0 | 100 | 100 | 100 |
| [Konfigurator](https://www.loni-galabau.de/konfigurator) · [PSI](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-konfigurator/ndu9uohrdl?form_factor=mobile) | 99 | 0,944 s | 1,298 s | 0 ms | 0 | 96 | 100 | 100 |

Alle sieben Berichte erreichen 100 im automatischen SEO-Test. Das ist keine Rankingzusage und ersetzt weder die Prüfung aller Seitentypen noch manuelle Barrierefreiheitstests. Insbesondere die LCP-Werte der beiden Leistungsseiten und der Projektübersicht zeigen weiteren Handlungsbedarf. Einzelmessungen können schwanken.

## Gesamter technischer Seitenbestand

Live-SSR-Audit am 01.10.2026 um **08:52:12 MESZ**: **41 von 41 HTML-Seiten HTTP 200**, darunter alle 38 Sitemap-Seiten und drei bewusst nicht indexierbare OpenSEO-Informationsseiten. Keine Befunde bei vorhandenen Titeln und Beschreibungen, www-Canonicals, jeweils einer H1, vorhandenen Alt-Attributen und Indexierungsanweisungen; keine doppelten Titel. Vorhandene JSON-LD-Blöcke sind syntaktisch parsebar, eine vollständige Rich-Results-Validierung ist damit nicht belegt. Unbekannter Ratgeberartikel liefert HTTP 404.

Keine der 41 Antworten enthält einen initialen externen Stylesheet-Link; die benötigten Stile sind im HTML vorhanden. Dieser vollständige technische Audit ist von den sieben mobilen Performance-Stichproben zu unterscheiden. Er ist kein neuer Nachweis einer tatsächlichen Google-Indexierung.

## Befunde der Ausgangsmessung

1. **Projektabfrage bei Gartengestaltung zuverlässig übernehmen.** Im geöffneten PSI-Konsolenbefund ist ein 403 bei `getProjectsByService` belegt. Bei Pflasterarbeiten ist hier nur der Best-Practices-Score 96 gesichert, keine identische Fehlerursache. Die lesende Untersuchung findet den fertigen Projektabschnitt im SSR-Stream, aber die Projektabfrage noch nicht im übertragenen Query-Cache: Ein nicht abgewartetes `prefetchQuery` kann eine zusätzliche Clientabfrage verursachen. Die nachgestellte Anfrage ergibt mit passendem `Sec-Fetch-Site` oder `Origin` HTTP 200, ohne beide Header HTTP 403 durch den CSRF-Schutz. Die ursprünglichen PSI-Header sind unbekannt; ein Fehler für sämtliche Besucher ist damit nicht belegt. Künftig die Abfrage vor der Cache-Übertragung abschließen oder korrekt streamen und im Browser prüfen; den CSRF-Schutz beibehalten.
2. **Bilder auf Leistungs- und Projektseiten verkleinern.** PSI schätzt 393 KiB Bildpotenzial bei Gartengestaltung, 389 KiB bei Pflasterarbeiten, 1.124 KiB in der Projektübersicht und 869 KiB in der geprüften Projektgalerie. Passende Bildvarianten, `srcset`/`sizes` und Komprimierung sind die nächsten konkreten Ansatzpunkte. Das sind Audit-Schätzungen, keine zugesagten Einsparungen oder LCP-Gewinne. Die separat geprüften Gartenbildvarianten haben beide ein Verhältnis von 3:4; eine Verzerrung ist nicht belegt. Bestehende Motive und eigene Uploads erhalten.
3. **Kontrast in gemeinsamen Unterseiten-Komponenten verbessern.** Sechs der sieben Berichte nennen unzureichenden Kontrast. Bei Gartengestaltung sind unter anderem der Leistungs-Breadcrumb, kleine Akzentbeschriftungen und gedämpfte Begleittexte betroffen. Die jeweiligen Vorder-/Hintergrundkombinationen korrigieren und danach automatisiert sowie visuell prüfen; 96–97 Punkte sind keine vollständige Barrierefreiheit.
4. **Änderungen anschließend gezielt nachmessen.** Zuerst dieselben Leistungs- und Projektseiten erneut prüfen, danach weitere Leistungen, Ratgeber und Projektgalerien stichprobenartig abdecken. Kontakt und Konfigurator zeigen aktuell keinen vorrangigen Geschwindigkeitsengpass. Für eine Aussage über stabile Ladezeiten fehlen Wiederholungen und Felddaten. Die schon dokumentierten Hosting-/Cache-Potenziale bleiben separate offene Punkte.

## Nachweise und Abgrenzung

Die verlinkten PSI-Berichte, ihre privaten UI-Exporte und der private vollständige SSR-Audit bilden die Nachweise. Private Rohdateien und Analysehelfer bleiben außerhalb des Repositorys. Der vorstehende Ausgangsaudit allein belegt noch keine Fehlerbehebung; die Umsetzung und Nachmessungen folgen im nächsten Abschnitt. Den bisherigen Startseiten-Verlauf enthält [Mobile Performance vom 30.09.2026](Mobile-Performance-2026-09-30.md).


## Veröffentlichung und Nachprüfung am 01.10.2026

V43 wurde um 09:54 MESZ veröffentlicht, mit Quellstand `2da38fe0476b6e3d9b6edf8f85e1b162dc22c993` und Deployment `appgdep_6abe117f29f88191a9a14a71b7414100`. V42 war lediglich gespeichert und wurde nicht veröffentlicht.

Die Unterseiten verwenden nun responsive AVIF-/WebP-Varianten aus 46 vorhandenen Fotos; dafür wurden insgesamt 274 Bilddateien erzeugt. Die Projektabfragen der Leistungsseiten werden vor der Übergabe des serverseitigen Query-Caches abgeschlossen. Die Live-Prüfung um 09:54:48 MESZ fand die erfolgreichen Projektabfragen bei allen acht Leistungsseiten tatsächlich im ausgelieferten Cache. Der zuvor beschriebene fehlende Cache-Eintrag ist damit behoben; der CSRF-Schutz wurde nicht gelockert. Gemeinsame Kontrastkorrekturen betreffen unter anderem Texte, Formulare, Konfigurator und Ratgeber.

Das Leistungsgebiet wurde nach ausdrücklicher Korrektur des Unternehmens auf **Deutschland** aktualisiert. Loni GalaBau arbeitet deutschlandweit; der Firmensitz bleibt Hattersheim am Main bei Frankfurt. Die öffentlichen Texte und aktuellen Leistungsdaten wurden entsprechend angepasst und geprüft. Alle acht live geprüften `Service`-Schemas enthalten jetzt `areaServed` vom Typ `Country` mit dem Namen `Deutschland`. Frühere SEO-Empfehlungen, die das Leistungsgebiet auf Hattersheim, Frankfurt oder Rhein-Main begrenzten, sind überholt. Firmensitz, Anschrift und tatsächliche Projektorte bleiben sachliche Ortsangaben.

Der erneute Live-HTML-Audit um 09:54:50 MESZ prüfte **41 öffentlich erreichbare Seiten**, darunter **38 Sitemap-URLs und drei bewusst nicht indexierbare OpenSEO-Informationsseiten**, ohne Befund in den implementierten Prüfungen. Der unbekannte Ratgeber-Slug antwortet weiterhin mit HTTP 404. Der Audit umfasst unter anderem HTTP-Status, Canonical, H1, Beschreibungen und Bild-Alt-Attribute; JSON-LD wird syntaktisch geprüft, nicht vollständig durch einen Rich-Results-Test validiert. Die Freigabeprüfungen bestanden: **92 Tests, TypeScript, ESLint und Produktionsbuild**.

## Mobile PageSpeed-Nachmessung von V43

Je URL liegt ein neuer Laborlauf mit Lighthouse 13.5.0, emuliertem Moto G Power und langsamer 4G-Verbindung vor. Die Werte stammen vom 01.10.2026, 09:54–09:56 MESZ; FCP/LCP sind in Sekunden, TBT in Millisekunden angegeben. Die Baseline bleibt unverändert dokumentiert.

| Seite / verlinkter V43-Bericht | Performance vorher → V43 | FCP | LCP | TBT | CLS | Barrierefreiheit | Best Practices / SEO |
|---|---:|---:|---:|---:|---:|---:|---:|
| [Gartengestaltung](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-leistungen-gartengestaltung/swcgb4cxqu?form_factor=mobile) | 82 → 96 | 2,298 | 2,298 | 47 | 0 | 97 | 100 / 100 |
| [Pflasterarbeiten](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-leistungen-pflasterarbeiten/fcuu70x6dw?form_factor=mobile) | 81 → 100 | 1,501 | 1,501 | 0 | 0 | 97 | 100 / 100 |
| [Projektübersicht](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-projekte/84fnuru2v3?form_factor=mobile) | 88 → 95 | 2,101 | 2,551 | 11 | 0 | 100 | 100 / 100 |
| [Projektgalerie Gärten](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-projekte-c6a3dbe3-8883-4785-b7b5-422cd4e9cef6/hjqno0npbc?form_factor=mobile) | 98 → 94 | 2,251 | 2,701 | 5 | 0 | 100 | 100 / 100 |
| [Ratgeber Pflasterkosten](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-ratgeber-pflasterarbeiten-kosten-einfahrt/r8f8k8d5tf?form_factor=mobile) | 98 → 93 | 2,251 | 2,851 | 10 | 0 | 100 | 100 / 100 |
| [Kontakt](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-kontakt/kj7cp5pnlw?form_factor=mobile) | 99 → 88 | 2,551 | 3,301 | 31 | 0 | 100 | 100 / 100 |
| [Konfigurator](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-konfigurator/y4y8cfchgu?form_factor=mobile) | 99 → 96 | 2,251 | 2,251 | 0 | 0 | 100 | 100 / 100 |

Die zuvor schwächeren Leistungsseiten und die Projektübersicht schneiden im neuen Lauf deutlich besser ab. Nicht jeder Einzelwert verbessert sich: insbesondere der Kontaktlauf liegt unter der Baseline. Ein Vorher-/Nachher-Einzellauf trennt Messschwankungen und mögliche Regressionen nicht zuverlässig. Es liegen weiterhin keine CrUX-Felddaten vor; weder dauerhafte 100 Punkte noch vollständige Barrierefreiheit sind damit belegt.

Die zwei Leistungsberichte fanden in Version 43 noch eine zu helle FAQ-Beschriftung. Diese ist im nachfolgend dokumentierten Abschlussstand korrigiert. Der Kontaktbefund wurde erneut untersucht; das kleine Ansprechpartnerfoto erhielt passende Bildvarianten.

Private Nachweise: `SEO-Recherche-2026-10-01/psi-after-v43.json`, `subpages-release-live.json` und `service-cache-live.json`. Die Rohdaten bleiben außerhalb des öffentlichen Website-Repositorys.

## Abschlussstand Version 45

Version 45 ist am 01.10.2026 um 10:06:50 MESZ veröffentlicht: Quellcommit `08e12ac0b44aa37356891bf3ac8c48472fc0fcd8`, Deployment `appgdep_6abe1484300481918ead8bb330d18175`. Versionen 42 und 44 wurden nur gespeichert, nicht veröffentlicht. V45 enthält zusätzlich zur V43-Optimierung die dunklere FAQ-Beschriftung auf hellen Flächen, den korrekten hellgrünen Text im dunklen Teamabschnitt sowie vier Portraitvarianten (160/320 Pixel, AVIF/WebP). Das Kontaktbild lädt bei der geprüften kleinen Darstellung 3.002 statt 109.074 Bytes. Individuell hochgeladene Ersatzbilder behalten ihren bestehenden Auslieferungsweg.

Der kleinere Ratgeberindex für Übersichts-, Autoren- und Leistungsseiten benötigt im Build rund 3,45 kB beziehungsweise 1,39 kB gzip; vollständige Artikeltexte bleiben bei den Artikeln. Ein Generator und Paritätstest verhindern veraltete Zusammenfassungen. 274 responsive Projektbildvarianten plus vier Portraitvarianten sind enthalten; Originaldateien bleiben erhalten.

Der finale Live-Audit um 10:07:54 MESZ bestätigt erneut alle 41 öffentlichen HTML-Seiten und 38 Sitemap-Einträge ohne Befund, einschließlich der deutschlandweiten Ausrichtung. Die Cache-/Country-Prüfung um 10:08:09 MESZ besteht auf allen acht Leistungsseiten. Nach den letzten kleinen Anpassungen bestanden erneut TypeScript, gezieltes ESLint und Produktionsbuild; zuvor bestanden sämtliche 92 automatisierten Tests. Browserprüfung: Desktop und Mobil, keine seitliche Überbreite in den geprüften Ansichten, AVIF-Auswahl bestätigt, Galerie geöffnet/weitergeschaltet/geschlossen. Keine Testanfrage an das Unternehmen abgeschickt.

Mobile V45-Nachmessung am 01.10.2026 um 10:07:28–10:07:30 MESZ, gleiche Laborbedingungen:

| Seite / Bericht | Performance | FCP (s) | LCP (s) | TBT (ms) | CLS | Bf. / BP / SEO |
|---|---:|---:|---:|---:|---:|---:|
| [Gartengestaltung](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-leistungen-gartengestaltung/19iuw257re?form_factor=mobile) | 100 | 1,178 | 1,233 | 12 | 0 | 100 / 100 / 100 |
| [Kontakt](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-kontakt/j4i7j98q4u?form_factor=mobile) | 98 | 1,968 | 2,026 | 0 | 0 | 100 / 100 / 100 |
| [Ratgeber Pflasterkosten](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-ratgeber-pflasterarbeiten-kosten-einfahrt/w6pfn9qa1d?form_factor=mobile) | 97 | 1,351 | 2,551 | 26 | 0 | 100 / 100 / 100 |
| [Projektgalerie Gärten](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-projekte-c6a3dbe3-8883-4785-b7b5-422cd4e9cef6/0ryc5in3zt?form_factor=mobile) | 100 | 0,939 | 0,939 | 0 | 0 | 100 / 100 / 100 |
| [Gartenplaner](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-konfigurator/evcv1gbj2r?form_factor=mobile) | 100 | 0,955 | 0,967 | 2 | 0 | 100 / 100 / 100 |
| [Über uns](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-ueber-uns/kzgilt407k?form_factor=mobile) | 95 | 2,101 | 2,551 | 39 | 0 | 100 / 100 / 100 |

Die V43-Einzelläufe bleiben oben vollständig erhalten, einschließlich Kontakt mit 88 Punkten. Nicht alle ursprünglichen Messwerte wurden übertroffen; insbesondere schwanken FCP und Serverantwortzeiten. Die jüngste Stichprobe erreicht 95–100 Performancepunkte. Die vollständige technische URL-Prüfung ist von diesen repräsentativen mobilen Leistungsmessungen zu unterscheiden. Keine Garantie stabiler 100 Punkte, vollständiger Barrierefreiheit, Google-Indexierung oder Rankings. Verbleibende mögliche Arbeiten betreffen unter anderem JavaScript-Menge, kleine Vorschaubilder und die Hosting-/Cache-Strategie; Änderungen daran sollten auf reproduzierbaren Messungen beruhen.

Die Datenkorrektur der acht vorhandenen Leistungsdatensätze ist in [service-area-correction-2026-10-01.sql](service-area-correction-2026-10-01.sql) dokumentiert und bereits ausgeführt. Nicht erneut als Migration anwenden. Anschriften, Registergericht, Jobstandort und tatsächliche Projektorte wurden nicht durch fiktive deutschlandweite Standorte ersetzt.
