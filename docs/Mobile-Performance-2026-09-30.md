# Mobile Performance – 30. September 2026

## Veröffentlicht

Version 38, 30.09.2026 um 17:17 MESZ. Quellcommit `038622931f4787576e7edd2c5df9bf62f587e601`, Deployment `appgdep_6abd27f27a04819192c01eae20c4fd9b`. Hauptdomain: https://www.loni-galabau.de/.

- Standard-Hero im AVIF-Format mit WebP-Fallback, unverändertes Motiv und 1920 × 1080 Pixel. Eigene Hero-Uploads aus der Administration behalten Vorrang.
- Großes Baustellenbild mit AVIF/WebP-Varianten in 600 und 941 Pixel Breite sowie passenden `sizes`. Originaldateien erhalten.
- Headerlogo aus dem tatsächlichen Loaderwert früh vorgeladen. Footerlogos laden später; das unsichtbare Logo der Navigationsanzeige wird erst bei einem Seitenwechsel eingesetzt.
- Mobile Einstiegsanimation und dauernde Hero-Zoomanimation deaktiviert; Text sofort sichtbar, Desktopgestaltung erhalten.
- Supabase-Browser-SDK aus dem zentralen JavaScript-Paket ausgelagert. Authentifizierung, MFA, Adminrollen, Tokenweitergabe und Abmeldung unverändert geprüft. Der globale Auth-Listener lädt das Modul nach dem Mount; keine Behauptung, es werde ausschließlich auf Adminseiten geladen.
- Zusätzliches Anfrage-Dialogformular erst bei Bedarf geladen. Das eingebettete Formular der Startseite bleibt serverseitig vorhanden.

## Dateigrößen

| Datei | Vorher | Neue bevorzugte Variante |
| --- | ---: | ---: |
| Hero, 1920 × 1080 | JPEG 222.190 B | AVIF 96.840 B; WebP 121.538 B |
| Baustellenbild, 941 × 1672 | WebP 244.266 B | AVIF 99.731 B; WebP 170.352 B |
| Baustellenbild, 600 Pixel breit | WebP 123.194 B | AVIF 50.563 B; WebP 88.210 B |
| Zentrales JS-Paket, minifiziert | 819.391 B | rund 509 KB |

Die beiden großen AVIF-Dateien benötigen zusammen rund 58 % weniger Bytes als die bisherigen Dateien. Das zentrale JS-Paket wird rund 38 % kleiner; separat geladene Module sind weiterhin Teil der Anwendung. Dies sind Dateigrößen, keine pauschale Einsparung des gesamten Seitenaufrufs.

## Vergleichsmessung

Offizielle PageSpeed-Oberfläche, mobile Moto-G-Power-Emulation, langsames 4G, Lighthouse 13.5.0. Ein Lauf pro geprüftem Quellstand; Schwankungen sind möglich. Keine CrUX-Felddaten vorhanden. Der zwischenzeitlich niedrigere Laborwert bleibt dokumentiert.

| Stand | Performance | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Version 36, 16:57 MESZ | 81 | 2,851 s | 4,201 s | 50 ms | 0 | 2,851 s |
| Version 37, 17:10 MESZ | 79 | 2,851 s | 4,126 s | 35 ms | 0 | 4,758 s |
| Version 38, 17:17 MESZ | **88** | **2,701 s** | **3,301 s** | **40 ms** | **0** | **2,701 s** |

- [Baseline Version 36](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/qvvzkl1u5e?form_factor=mobile)
- [Zwischenschritt Version 37](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/2rs07x7q76?form_factor=mobile)
- [Ergebnis Version 38](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de/izeibgm2pw?form_factor=mobile)

Der abschließende mobile LCP liegt rund 21 % unter der Baseline. Der Desktoplauf desselben Berichts ergibt 99 Performancepunkte, FCP 0,561 s, LCP 0,881 s, TBT 21 ms und CLS 0. Die automatisierten Kategorien SEO, Barrierefreiheit und Best Practices ergeben jeweils 100; das ersetzt keine vollständige manuelle Prüfung.

Zusätzliche Unterseiten-Stichprobe [Ratgeber, 17:19 MESZ](https://pagespeed.web.dev/analysis/https-www-loni-galabau-de-ratgeber/efcuab19ep?form_factor=mobile): mobil 94 Performancepunkte, FCP 2,1 s, LCP 2,7 s, TBT 0 ms, angezeigter CLS 0,005, SEO und Best Practices 100. Barrierefreiheit 97 wegen eines Kontrasthinweises; gesondert prüfen. Ohne vorherigen Ratgeberlauf ist dies ein aktueller Stand, kein belegter Vorher-/Nachher-Gewinn. Weitere Bildkompression der Artikelvorschauen bleibt möglich.

Offene Optimierungsmöglichkeiten im mobilen Bericht: renderblockierende Stylesheets (geschätztes Potenzial 300 ms), weitere JavaScript-Aufteilung (geschätzt 102 KiB ungenutzt), einzelne Bild-/Dimensionshinweise (47 KiB Bildpotenzial). LCP 3,3 s ist verbessert, liegt jedoch noch nicht im guten Zielbereich bis 2,5 s. Kein 100-Punkte-Ergebnis behaupten.

Version 36 identifizierte das Headerlogo als LCP-Element, Version 37 den Einstiegstext. Die gemessenen LCP-Werte beziehen sich daher auf das jeweils vom Browser ermittelte größte sichtbare Element. Ein einzelner Score ist keine Ranking- oder dauerhafte Ladezeitgarantie.

## Cache und Hosting: korrigierter Befund

Die frühere HEAD-Prüfung war für eine pauschale Cache-Aussage ungeeignet. Beim geprüften Supabase-Bild liefert GET `public, max-age=31536000`, `image/webp` und `CF-Cache-Status: HIT`, HEAD dagegen `no-cache`. Nicht ungeprüft auf jedes Storageobjekt übertragen.

Sites-Assets liefern in der GET-Stichprobe bereits CDN-Hits und ETags, aber `public, max-age=0, must-revalidate`. Ein bedingter Hero-GET ergibt 304: Browser-Revalidierung bedeutet hier keinen vollständigen erneuten Bilddownload. Lokales WebP und WOFF2 werden mit `application/octet-stream` ausgeliefert. Die appseitigen MIME-/TTL-Regeln ändern diese vorgeschalteten Antworten derzeit nicht.

Der erste HTTP→HTTPS-Schritt liefert weiterhin 302 auf Hostingebene. Die App-Weiterleitungen sind 301. Offene Providerpunkte: permanente Erstumleitung, passende MIME-Typen und längere Browser-TTL für versionierte Assets. Keine erfundenen Hostingmanifest-Felder, kein pauschaler HTML-/Privatdaten-Cache.

## Prüfung

87 bestehende Tests plus drei neue Tests zur verzögerten Tokenweitergabe bestanden. Typprüfung, gezieltes ESLint und Produktionsbuild bestanden. Unangemeldeter Adminaufruf führt im Browser zur Anmeldung. Mobile Startseite, Bildauswahl und Menü geprüft. Keine künstlichen Kundenanfragen abgeschickt.

Live-Audit von Version 38 um 17:18 MESZ: 38 Sitemap-URLs und drei App-Informationsseiten, keine Befunde bei den geprüften Status-, Metadaten-, Canonical-, H1-, Alt- und JSON-LD-Kriterien; unbekannte Artikel liefern 404.

## Quellen

- [Google/web.dev: LCP optimieren](https://web.dev/articles/optimize-lcp)
- [Cloudflare: statische Asset-Header](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Supabase: Auth-State-Listener](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
