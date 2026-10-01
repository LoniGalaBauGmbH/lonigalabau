# Unterseiten: technischer Stand und mobile Performance – 1. Oktober 2026

Der technische Live-Audit ist ohne Befund; die mobile Performance ist je nach Unterseite unterschiedlich. Vier von sieben geprüften Unterseiten erreichen 98–99 Punkte, die beiden Leistungsseiten und die Projektübersicht 81–88 Punkte. Daraus folgt keine vollständige Optimierung aller Unterseiten.

Diese Prüfung erfasst den bestehenden veröffentlichten Stand. Am 01.10.2026 wurden dafür keine Programmänderungen, Datenänderungen oder neue Veröffentlichung vorgenommen. Zuletzt bestätigter Release bleibt Version 41 vom 30.09.2026. Die gemeinsamen Inline-Stile und die Schriftstrategie `font-display: optional` ohne Fontpreload gelten auch auf Unterseiten. Die verzögerte Aktivierung von Formular und Leistungs-Slider wurde dagegen nur auf der Startseite eingebaut.

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

## Priorisierte nächste Schritte

1. **Projektabfrage bei Gartengestaltung zuverlässig übernehmen.** Im geöffneten PSI-Konsolenbefund ist ein 403 bei `getProjectsByService` belegt. Bei Pflasterarbeiten ist hier nur der Best-Practices-Score 96 gesichert, keine identische Fehlerursache. Die lesende Untersuchung findet den fertigen Projektabschnitt im SSR-Stream, aber die Projektabfrage noch nicht im übertragenen Query-Cache: Ein nicht abgewartetes `prefetchQuery` kann eine zusätzliche Clientabfrage verursachen. Die nachgestellte Anfrage ergibt mit passendem `Sec-Fetch-Site` oder `Origin` HTTP 200, ohne beide Header HTTP 403 durch den CSRF-Schutz. Die ursprünglichen PSI-Header sind unbekannt; ein Fehler für sämtliche Besucher ist damit nicht belegt. Künftig die Abfrage vor der Cache-Übertragung abschließen oder korrekt streamen und im Browser prüfen; den CSRF-Schutz beibehalten.
2. **Bilder auf Leistungs- und Projektseiten verkleinern.** PSI schätzt 393 KiB Bildpotenzial bei Gartengestaltung, 389 KiB bei Pflasterarbeiten, 1.124 KiB in der Projektübersicht und 869 KiB in der geprüften Projektgalerie. Passende Bildvarianten, `srcset`/`sizes` und Komprimierung sind die nächsten konkreten Ansatzpunkte. Das sind Audit-Schätzungen, keine zugesagten Einsparungen oder LCP-Gewinne. Die separat geprüften Gartenbildvarianten haben beide ein Verhältnis von 3:4; eine Verzerrung ist nicht belegt. Bestehende Motive und eigene Uploads erhalten.
3. **Kontrast in gemeinsamen Unterseiten-Komponenten verbessern.** Sechs der sieben Berichte nennen unzureichenden Kontrast. Bei Gartengestaltung sind unter anderem der Leistungs-Breadcrumb, kleine Akzentbeschriftungen und gedämpfte Begleittexte betroffen. Die jeweiligen Vorder-/Hintergrundkombinationen korrigieren und danach automatisiert sowie visuell prüfen; 96–97 Punkte sind keine vollständige Barrierefreiheit.
4. **Änderungen anschließend gezielt nachmessen.** Zuerst dieselben Leistungs- und Projektseiten erneut prüfen, danach weitere Leistungen, Ratgeber und Projektgalerien stichprobenartig abdecken. Kontakt und Konfigurator zeigen aktuell keinen vorrangigen Geschwindigkeitsengpass. Für eine Aussage über stabile Ladezeiten fehlen Wiederholungen und Felddaten. Die schon dokumentierten Hosting-/Cache-Potenziale bleiben separate offene Punkte.

## Nachweise und Abgrenzung

Die verlinkten PSI-Berichte, ihre privaten UI-Exporte und der private vollständige SSR-Audit bilden die Nachweise. Private Rohdateien und Analysehelfer bleiben außerhalb des Repositorys. Diese Dokumentation enthält keine behaupteten Fehlerbehebungen, zusätzlichen Code-Tests oder neue Veröffentlichung. Den bisherigen Startseiten-Verlauf enthält [Mobile Performance vom 30.09.2026](Mobile-Performance-2026-09-30.md).
