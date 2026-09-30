# Mobile Performance – 30. September 2026

## Veröffentlicht

Aktuell Version 41, 30.09.2026 um 18:07 MESZ. Quellcommit `e123304bc561f77e8becdf48a2925f6f844fe74b`, Deployment `appgdep_6abd339c4fd08191970a3703da19e5fe`. Hauptdomain: https://www.loni-galabau.de/.

Version 40 wurde zuvor am 30.09.2026 um 17:54 MESZ veröffentlicht: Quellcommit `ba280c07df3a4c8c2439cb47c9a94b716d2cb9f0`, Deployment `appgdep_6abd30b377e88191a0809bb4e1ffc0bf`. Der einzige Programmcode-Unterschied von Version 40 zu 41 ist der entfernte Fontpreload; `font-display: optional` bleibt erhalten.

Version 38 wurde zuvor am 30.09.2026 um 17:17 MESZ veröffentlicht (Quellcommit `038622931f4787576e7edd2c5df9bf62f587e601`). Der erneute Nutzerlauf um 17:24 erzielte trotz unverändertem Stand nur 78 Punkte und LCP 4,126 s. Die frühere Einzelmessung von 88 ist daher kein dauerhaft garantierter Wert.

- Standard-Hero im AVIF-Format mit WebP-Fallback, unverändertes Motiv und 1920 × 1080 Pixel. Eigene Hero-Uploads aus der Administration behalten Vorrang.
- Großes Baustellenbild mit AVIF/WebP-Varianten in 600 und 941 Pixel Breite sowie passenden `sizes`. Originaldateien erhalten.
- Headerlogo aus dem tatsächlichen Loaderwert früh vorgeladen. Footerlogos laden später; das unsichtbare Logo der Navigationsanzeige wird erst bei einem Seitenwechsel eingesetzt.
- Mobile Einstiegsanimation und dauernde Hero-Zoomanimation deaktiviert; Text sofort sichtbar, Desktopgestaltung erhalten.
- Supabase-Browser-SDK aus dem zentralen JavaScript-Paket ausgelagert. Authentifizierung, MFA, Adminrollen, Tokenweitergabe und Abmeldung unverändert geprüft. Der globale Auth-Listener lädt das Modul nach dem Mount; keine Behauptung, es werde ausschließlich auf Adminseiten geladen.
- Zusätzliches Anfrage-Dialogformular erst bei Bedarf geladen. Das eingebettete Formular der Startseite bleibt serverseitig vorhanden.
- Version 39 liefert die benötigten globalen und routenspezifischen Stile über TanStacks natives `server.build.inlineCss` direkt im SSR-HTML. Der bisherige `?url`-Import wurde zum regulären CSS-Import; der manuelle Stylesheet-Link entfällt. Dadurch verschwinden die fünf initialen blockierenden Stylesheet-Anfragen.
- Mobile Geräte bzw. grobe Zeiger überspringen die rein dekorative Scroll-Choreografie. Inhalte bleiben sichtbar; unnötige initiale Layoutmessungen für entfernte Elemente entfallen. Messungen des Garten-Auswahlindikators sind vor den Styleänderungen gebündelt.
- Version 40 trennt das Inline-Anfrageformular und den Leistungs-Slider mit TanStacks nativer Deferred Hydration vom Start-JavaScript. Vollständiges SSR-HTML einschließlich Formular, Leistungstexten und Links bleibt erhalten. JavaScript wird ab 1.200 px Sichtnähe vorbereitet, die Bedienlogik ab 800 px aktiviert. Gartendetails, Navigation und Hero reagieren weiterhin sofort.
- Alle vier lokalen Schriftdefinitionen verwenden `font-display: optional`: Auf langsamen Erstbesuchen kann die Systemschrift für diesen Besuch stehen bleiben, anstatt später den Text umzubrechen. In Version 40 war die normale Hauptschrift zusätzlich vorgeladen; Version 41 entfernt diesen Fontpreload als isolierten Vergleichsschritt. Das Hero-Bild wird asynchron dekodiert.

## Dateigrößen

| Datei | Vorher | Neue bevorzugte Variante |
| --- | ---: | ---: |
| Hero, 1920 × 1080 | JPEG 222.190 B | AVIF 96.840 B; WebP 121.538 B |
| Baustellenbild, 941 × 1672 | WebP 244.266 B | AVIF 99.731 B; WebP 170.352 B |
| Baustellenbild, 600 Pixel breit | WebP 123.194 B | AVIF 50.563 B; WebP 88.210 B |
| Zentrales JS-Paket, minifiziert | 819.391 B | rund 509 KB |

Die beiden großen AVIF-Dateien benötigen zusammen rund 58 % weniger Bytes als die bisherigen Dateien. Das zentrale JS-Paket wird rund 38 % kleiner; separat geladene Module sind weiterhin Teil der Anwendung. Dies sind Dateigrößen, keine pauschale Einsparung des gesamten Seitenaufrufs.

## Vergleichsmessung

Offizielle PageSpeed-Oberfläche, mobile Moto-G-Power-Emulation, langsames 4G, Lighthouse 13.5.0. Wiederholungen des finalen Standes werden einzeln dokumentiert; Schwankungen sind möglich. Keine CrUX-Felddaten vorhanden. Niedrigere Zwischenwerte bleiben dokumentiert.

| Stand | Performance | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Version 36, 16:57 MESZ | 81 | 2,851 s | 4,201 s | 50 ms | 0 | 2,851 s |
| Version 37, 17:10 MESZ | 79 | 2,851 s | 4,126 s | 35 ms | 0 | 4,758 s |
| Version 38, 17:17 MESZ | **88** | **2,701 s** | **3,301 s** | **40 ms** | **0** | **2,701 s** |
| Version 38, Nutzerlauf 17:24 MESZ | 78 | 2,851 s | 4,126 s | 91 ms | 0 | 4,840 s |
| Version 39, 17:36 MESZ | 83 | 2,701 s | 3,826 s | 49 ms | 0 | 3,523 s |
| Version 40, Lauf 1, 17:55 MESZ | **99** | **1,351 s** | **2,101 s** | **0 ms** | **0** | **2,114 s** |
| Version 40, erneuter Bericht 17:55:46 MESZ | 99 | 1,351 s | 2,101 s | 0 ms | 0 | 2,114 s |
| Version 40, Lauf 3, 17:56:56 MESZ | 81 | 2,559 s | 3,976 s | 0 ms | 0 | 4,580 s |
| Version 41, erster Lauf, 18:07:30 MESZ | 91 | 2,401 s | 3,001 s | 5 ms | 0 | 3,387 s |
| Version 41, zweiter Lauf, 18:09:05 MESZ | 100 | 1,111 s | 1,146 s | 30 ms | 0 | 1,881 s |

- [Baseline Version 36](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/qvvzkl1u5e?form_factor=mobile)
- [Zwischenschritt Version 37](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/2rs07x7q76?form_factor=mobile)
- [Ergebnis Version 38](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/izeibgm2pw?form_factor=mobile)
- [Erneuter Nutzerlauf Version 38](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/t3bbn8gk2b?form_factor=mobile)
- [Version 39](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/czdzy0hj67?form_factor=mobile)
- [Version 40, Lauf 1](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/qo4cs5ygci?form_factor=mobile)
- [Version 40, erneuter Bericht](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/yj79ouqz8a?form_factor=mobile)
- [Version 40, Lauf 3](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/fcwbdlp8mq?form_factor=mobile)
- [Version 41, erster Lauf](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/z52uchap65?form_factor=mobile)
- [Version 41, zweiter Lauf](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/a8wzf03wc7?form_factor=mobile)

Der erste mobile Lauf von Version 40 erreicht das LCP-Laborziel von höchstens 2,5 s, der dritte nicht. Die ersten beiden Berichte enthalten exakt dieselben Werte und dieselbe Erfassungsminute; eine Wiederverwendung des Datensatzes ist möglich. Deshalb nicht als zwei unabhängig bestätigte 99-Läufe ausgeben. Version 40 schwankt weiter zwischen 81 und 99 und ist noch kein Nachweis stabiler 99 Punkte. SEO, Barrierefreiheit und Best Practices ergeben jeweils 100; das ersetzt keine vollständige manuelle Prüfung. Der historische Desktoplauf von Version 38 ergab 99 Performancepunkte, FCP 0,561 s, LCP 0,881 s, TBT 21 ms und CLS 0.

Die beiden zeitlich getrennten mobilen Berichte von Version 41 erreichen **91 und 100 Punkte**, mit unterschiedlichen Erfassungszeiten und Messwerten: FCP **1,111–2,401 s**, LCP **1,146–3,001 s**, CLS jeweils 0. Im ersten Bericht beträgt die genaue TBT 5 ms, obwohl die Oberfläche gerundet 0 ms zeigt; TTI beträgt 3,446 s. Im zweiten Bericht beträgt TBT 30 ms und TTI 3,320 s. SEO, Barrierefreiheit und Best Practices ergeben in beiden Läufen jeweils 100. Der zweite Lauf erfüllt die Laborziele FCP bis 1,8 s und LCP bis 2,5 s, der erste nicht. Die Verbesserung des veröffentlichten Stands ist belegt; zwei Läufe sind weder eine Garantie dauerhaft hoher Scores noch ein Nachweis stabiler 100 Punkte. Die Wirkung des entfernten Fontpreloads lässt sich daraus nicht vollständig von Messschwankungen trennen. CrUX-Felddaten fehlen weiterhin.

Zusätzliche Unterseiten-Stichprobe [Ratgeber, 17:19 MESZ](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-ratgeber/efcuab19ep?form_factor=mobile): mobil 94 Performancepunkte, FCP 2,1 s, LCP 2,7 s, TBT 0 ms, angezeigter CLS 0,005, SEO und Best Practices 100. Barrierefreiheit 97 wegen eines Kontrasthinweises; gesondert prüfen. Ohne vorherigen Ratgeberlauf ist dies ein aktueller Stand, kein belegter Vorher-/Nachher-Gewinn. Weitere Bildkompression der Artikelvorschauen bleibt möglich.

Im früheren Bericht von Version 38: renderblockierende Stylesheets (geschätztes Potenzial 300 ms) und LCP zwischen 3,3 und 4,1 s. Die CSS-Anfragekette ist beseitigt. Version 40 nennt weiterhin etwa 102 KiB ungenutztes JavaScript, 47 KiB Bildpotenzial und einzelne Dimensionshinweise; diese bedeuten nicht, dass alle Ressourcen den ersten Bildaufbau blockieren.

## CSS-Auslieferung in Version 39

Live-GET-Prüfung von Startseite, Ratgeber und Gartengestaltung: HTTP 200, jeweils genau ein `style[data-tsr-inline-css]`, keine initialen `link[rel=stylesheet]`, globale Stile und H1 vorhanden. Die Startseite umfasst inklusive CSS 316.325 B HTML; lokal gzip-komprimiert 53.781 B. Das ist ein lokaler Kompressionsvergleich, kein gemessener HTTP-Transferwert.

Die integrierte Frameworkoption ist als experimentell dokumentiert und erhöht das HTML-Volumen. Sie erhält den Styleblock während der Hydration; CSS-Dateien bleiben für spätere Navigation verfügbar. Produktionsbuild lokal in der Worker-Laufzeit geprüft, einschließlich Navigation Startseite → Ratgeber → Startseite und mobiler Darstellung; keine Browserwarnungen oder -fehler in der geprüften Sitzung. Die vorhandene CSP musste nicht geändert werden.

Version 36 identifizierte das Headerlogo als LCP-Element, Version 37 den Einstiegstext. Die gemessenen LCP-Werte beziehen sich daher auf das jeweils vom Browser ermittelte größte sichtbare Element. Ein einzelner Score ist keine Ranking- oder dauerhafte Ladezeitgarantie.

## Start-JavaScript in Version 40

Live-GET um 17:55 MESZ: 21 initiale Modul-Preloads einschließlich des zentralen Pakets, zusammen 614.792 B statt rund 742.752 B vor der Aufteilung. Rund 128 KB beziehungsweise 17 % weniger minifiziertes Start-JavaScript; lokal gzip-komprimiert insgesamt 202.377 B. Die unverändert separat gestartete Auth-Synchronisierung ist nicht in dieser Preloadsumme enthalten. Formular, Validatoren und Slider fehlen im initialen Preloadbaum.

Die Startseite liefert weiter HTTP 200, genau einen Inline-CSS-Block, keine initialen Stylesheet-Links sowie vollständiges Formular und Leistungsinhalte. 315.486 B HTML, lokal gzip-komprimiert 53.508 B. Lokale Kompressionswerte nicht als tatsächliche Netzwerk-Transferwerte ausgeben.

Deferred Hydration ist eine experimentelle Frameworkfunktion. Das kleine Gartendetail-Widget bleibt bewusst sofort aktiv, da eine erste Tastaturaktion bei verzögerter Aktivierung im lokalen Test nicht übernommen wurde. Formularauswahl, Schrittwechsel, Ankersprung und Slider wurden im korrigierten Produktionsbuild geprüft. Ein einmaliger React-Recoveryfehler im vorherigen lokalen Zwischenstand ließ sich bei den anschließenden Dev-/Produktionsprüfungen nicht reproduzieren. Schnelle Ankersprünge bei kaltem Cache sind bei künftigen Frameworkupdates erneut zu prüfen.

## Auslieferung in Version 41

Live-HTML: 315.372 B, lokal gzip-komprimiert 53.460 B. Weiterhin 21 initiale Modul-Preloads einschließlich des zentralen Pakets, zusammen 614.683 B beziehungsweise lokal gzip-komprimiert 202.324 B; keine initialen Stylesheet-Links und genau ein Inline-CSS-Block. Formular und Leistungsinhalte bleiben im SSR-HTML vorhanden. Die lokale Kompressionssumme ist kein gemessener HTTP-Transferwert; die separat gestartete Auth-Synchronisierung gehört weiterhin nicht zur Preloadsumme.

Bei den ergänzenden HTTP-Stichproben schwankte die Serverantwort: rund 2,6 s TTFB beim kalten Aufruf gegenüber 200–233 ms bei warmen Aufrufen. Der Hero folgte in der geprüften Streaming-Antwort etwa 11 ms nach den Responseheaders. Keine versteckte oder wartende SSR-Grenze blockierte dabei den Hero. Diese Einzelbeobachtungen sind keine Felddatenverteilung und beweisen die Ursache der PSI-Schwankung nicht. In Version 41 wurde kein Cache verändert.

## Cache und Hosting: korrigierter Befund

Die frühere HEAD-Prüfung war für eine pauschale Cache-Aussage ungeeignet. Beim geprüften Supabase-Bild liefert GET `public, max-age=31536000`, `image/webp` und `CF-Cache-Status: HIT`, HEAD dagegen `no-cache`. Nicht ungeprüft auf jedes Storageobjekt übertragen.

Sites-Assets liefern in der GET-Stichprobe bereits CDN-Hits und ETags, aber `public, max-age=0, must-revalidate`. Ein bedingter Hero-GET ergibt 304: Browser-Revalidierung bedeutet hier keinen vollständigen erneuten Bilddownload. Lokales WebP und WOFF2 werden mit `application/octet-stream` ausgeliefert. Die appseitigen MIME-/TTL-Regeln ändern diese vorgeschalteten Antworten derzeit nicht.

Der erste HTTP→HTTPS-Schritt liefert weiterhin 302 auf Hostingebene. Die App-Weiterleitungen sind 301. Offene Providerpunkte: permanente Erstumleitung, passende MIME-Typen und längere Browser-TTL für versionierte Assets. Keine erfundenen Hostingmanifest-Felder, kein pauschaler HTML-/Privatdaten-Cache.

## Prüfung

87 bestehende Tests plus drei neue Tests zur verzögerten Tokenweitergabe bestanden. Typprüfung, gezieltes ESLint und Produktionsbuild bestanden. Unangemeldeter Adminaufruf führt im Browser zur Anmeldung. Mobile Startseite, Bildauswahl und Menü geprüft. Keine künstlichen Kundenanfragen abgeschickt.

Live-Audit von Version 40 um 17:55 MESZ: 38 Sitemap-URLs und drei App-Informationsseiten, keine Befunde bei den geprüften Status-, Metadaten-, Canonical-, H1-, Alt- und JSON-LD-Kriterien; unbekannte Artikel liefern 404. Alle 90 Tests, Typprüfung, gezieltes ESLint und Produktionsbuild erneut bestanden.

Live-Audit von Version 41 um 18:08:58 MESZ: erneut 38 Sitemap-URLs und drei App-Informationsseiten ohne Befund in den geprüften Kriterien, unbekannter Artikel HTTP 404. Ein erster Prüfaufruf mit überzähligem Schrägstrich erzeugte `//`-Adressen und entsprechende 308-Weiterleitungen; die normalisierte Wiederholung prüfte die richtigen URLs. Dies war ein Fehler des Prüfaufrufs, kein belegter Fehler der kanonischen Seiten. Gezieltes ESLint für Version 41 bestanden. Im Live-Browser Ankersprung zu `#projektanfrage`, Auswahl „Gartengestaltung“ per Leertaste und „Weiter“ geprüft: Schritt 2 erreicht, keine Anfrage abgeschickt.

## Quellen

- [Google/web.dev: LCP optimieren](https://web.dev/articles/optimize-lcp)
- [TanStack: Inline Route CSS in Production](https://tanstack.com/start/latest/docs/framework/react/guide/css-styling)
- [TanStack: Deferred Hydration](https://tanstack.com/start/latest/docs/framework/react/guide/deferred-hydration)
- [Google/web.dev: Webfonts optimieren](https://web.dev/learn/performance/optimize-web-fonts)
- [Cloudflare: statische Asset-Header](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Supabase: Auth-State-Listener](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
