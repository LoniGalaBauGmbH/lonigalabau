# SEO-Umsetzung vom 12.10.2026

Die Website wird auf hilfreiche Leistungsinhalte, erreichbare Anfragen und sauber
ausgelieferte öffentliche Dateien verbessert. Rankings oder eine tägliche
Anfragezahl werden nicht garantiert. Firmensitz Hattersheim und deutschlandweite
Tätigkeit bleiben erhalten. Zusätzliche Leistungen weiterhin auf Anfrage.

## Umgesetzter Inhalt

- Alle acht bestätigten Leistungen enthalten individuelle Kostenfaktoren und
  Checklisten für ein vergleichbares Angebot; keine erfundenen Pauschalpreise.
- Je Leistung passende Ratgeber statt einer überall gleichen Reihenfolge.
- Terrassenentwässerung: präzisere Überschrift, Angebotsumfang und ergänzte Fragen.
- Gartenumbau in Etappen: konkrete Anschluss-/Reihenfolgefragen und ergänzte FAQ.
- Kontextuelle interne Links werden über die vorhandene erlaubte Zielmenge gerendert.
- Tatsächliche redaktionelle Änderungen stehen in der Sitemap; spätere
  Datenbankänderungen an Leistungen/Stellen bleiben berücksichtigt.
- Googles belegter JobPosting-Fehler beim Arbeitgebertyp wurde korrigiert:
  `hiringOrganization` verwendet `Organization` mit derselben Unternehmens-ID.
  Kein Gehalt, Ablaufdatum oder weiterer Arbeitsort wird erfunden.

## Öffentliche Dateien und Darstellung

Vite erzeugt Asset-URLs unter `/__public-assets/`, während Seiten und
Serverfunktionen unter ihren bisherigen Root-Pfaden bleiben. Der Worker liefert
nur die beim Build aufgelisteten öffentlichen Bilder, Schriften und JS-/CSS-Dateien.
Keine privaten Dokumente oder frei wählbaren Netzwerkziele sind erlaubt.

Hash-Dateien erhalten ein Jahr Browsercache mit `immutable`; öffentliche Bilder
und Schriften ohne Hash einen Tag. ETag/Revalidierung bleiben möglich. WOFF2 wird
als `font/woff2` ausgeliefert. HTML, private Endpunkte und Fehler bekommen darüber
keinen öffentlichen Langzeitcache. Die bisherige WebP-Adresse bleibt kompatibel.

Footerbilder haben feste Maße. Einige zugängliche Link-/Buttonnamen entsprechen
jetzt vollständig ihrem sichtbaren Text. Die Projektanfrage verwendet native
Radiofelder: ihre sichtbaren Auswahlkarten reagieren dadurch zuverlässig auch
auf Maus/Touch, während Tastatursteuerung und Formulardaten erhalten bleiben.
Der vorhandene mobile Aufbau bleibt erhalten.

## Anfragen sinnvoll bewerten

Eine freiwillige Herkunftsauswahl in fünf Kundenformularen unterstützt die interne
Auswertung. Sie ist Selbstauskunft und kein gemessener Nachweis organischer Herkunft.
Es werden dafür keine Referrer, Suchbegriffe, Kennungen oder Analysepixel erhoben.
GA4/GTM bleiben inaktiv; Datenschutzhinweise wurden entsprechend ergänzt.

Im geschützten CRM werden passende, ungeprüfte und ausgeschlossene Anfragen
getrennt gezählt. Die Qualitätsbewertung ist persönlich, vor parallelem
Überschreiben geschützt und unabhängig von Bearbeitungsstatus/Notizen. Heute und
30 Berliner Kalendertage verwenden exakte Counts; Fehler ergeben keine falsche Null.
30 passende Anfragen in 30 Tagen belegen nicht einen Eingang an jedem einzelnen Tag.
Telefonanrufe außerhalb der Formulare sind nicht enthalten.

Die additive Migration `20261012084431 contact_lead_qualification` wurde am
12.10.2026 angewandt. Vier Spalten, zwei Indizes, keine neuen Browserrechte.
Zurückgerollte Live-Transaktion: alle 14 Prüfwerte erfolgreich; keine Testmail.
Ausführlich: [Anfragequalifizierung](Anfragequalifizierung-2026-10-12.md).

## Googleindex und weitere Aufgaben

Kostenlose OpenSEO-Prüfung aller 52 URLs am 12.10., 10:24–10:38 MESZ:
46 indexiert, keine Inspection-Fehler oder bestätigten Canonical-Abweichungen.
Alle zwölf Ortsseiten, acht Leistungsseiten, sechs Ratgeber und Ratgeberhub sind
indexiert. Offen sind Jobsübersicht, Partnerseite, AGB und drei Projektgalerien.
Eine Sitemap-Einreichung oder Anfrage ersetzt keine tatsächliche Googleaufnahme.
Heute wurde für diese Umsetzung kein neuer kostenpflichtiger Anbieteraufruf benötigt.

Offen bleiben verifizierte Unternehmensprofil-/Bewertungs-/Verweisarbeit und
Kontoprüfung des neuen Google-GEO-Berichts: die authentifizierten Browserflächen
sind in dieser Sitzung nicht verfügbar. Öffentliche Profilkandidaten ersetzen
keine Verifizierung; es wurden keine erfundenen Bewertungen oder `sameAs` ergänzt.
Synthetische Bot-Abrufe mit Status 200 beweisen keine Zugriffe echter Bot-IP-Adressen.

Die vom Nutzer auf später verschobenen drei bis fünf realen Fallstudien bleiben
TODO. Für Such- und Anfrageentwicklung sind spätere Vergleiche nötig; vorhandene
28-/56-/90-Tage-Prüfpunkte sind ein Arbeitsplan, keine eingerichtete Automation.

## Prüf- und Veröffentlichungsstand

231 Anwendungstests bestanden, TypeScript und gezieltes ESLint fehlerfrei.
Produktionsbuild erfolgreich. Lokaler Crawl: 52/52 HTTP 200, eindeutige Titel und
Descriptions, je eine H1, korrekte Canonicals, keine fehlenden Alt-Attribute oder
ungültigen JSON-LD-Blöcke; 96/96 geprüfte Bildvarianten erreichbar.

**Version 68 ist seit 12.10.2026, 11:02:12 MESZ veröffentlicht.**
Quellcommit `913ffb70939184886068c2232569873b41913b21`, Deployment
`appgdep_6acca1fa0a54819180a42fe3d546cac9`. Der vorangehende gespeicherte
Entwurf V67 wurde nicht veröffentlicht. Die zehn privaten Kontaktanhänge und
bestehenden Mail-/Bewerbungswege aus V66 bleiben erhalten.

Live-Crawl 11:02:26–11:02:35 MESZ: 52/52 Seiten HTTP 200 und technisch indexierbar,
eindeutige Metadaten, jeweils eine H1, korrekte Canonicals, keine fehlenden
Alt-Attribute oder ungültigen JSON-LD-Blöcke; 96/96 Bildvarianten erreichbar.
Der Stellenarbeitgeber wird tatsächlich als `Organization` ausgeliefert; Googles
zuvor gespeichertes Inspection-Ergebnis bestätigt noch nicht den neuen Markupstand.

Lokale und Live-Browserprüfung: jeweils 14 repräsentative Seiten bei 320, 390 und
1440 Pixeln, insgesamt 42 Ansichten pro Umgebung ohne Überlauf, JavaScriptfehler
oder fehlende Assets. Zusätzlich neun lokale Abläufe über alle fünf Kundenformulare
einschließlich Rücknavigation und freiwilliger Herkunft; keine Anfrage versandt.
Die Projekt-Auswahlkarten wurden mit Maus/Touch und Tastatur separat geprüft.

Live-Assetprüfung für JS, CSS, WOFF2, AVIF, WebP und SVG: korrekter MIME-Typ,
bytegleiche Inhalte, beabsichtigter Cache, leeres HEAD und ETag-304 bestätigt.
Private/unbekannte Ziele sowie Queryvarianten bleiben mit 404/no-store gesperrt.
Der geschützte Statistikabruf weist anonyme Anfragen mit 403/noindex/no-store ab.
Die acht echten Backendabfragen lieferten ausschließlich Counts. Eine angemeldete
Live-Adminbedienung wurde ohne verfügbare authentifizierte Browserfläche nicht
behauptet; Rechte/CAS sind zusätzlich durch Anwendungstests und die zurückgerollte
Live-Datenbanktransaktion geprüft.

Mobile Lighthouse-Labormessungen auf der echten Domain, identische simulierte
Mobilkonfiguration, jeweils ein Vorherlauf und zwei Nachherläufe:

| Seite | Performance vorher | Nachher 1 | Nachher 2 | LCP nachher (s) |
| --- | ---: | ---: | ---: | ---: |
| Startseite | 90 | 86 | 81 | 1,88 / 3,56 |
| Pflasterarbeiten | 97 | 92 | 92 | 2,80 / 2,80 |
| Hattersheim | 98 | 88 | 95 | 3,30 / 1,91 |
| Terrassenratgeber | 89 | 98 | 91 | 2,20 / 3,30 |

Die Laborwerte belegen keine durchgängige Beschleunigung. Die Serverantwortzeiten
schwanken weiterhin; der korrigierte Browsercache ist separat technisch belegt
und verbessert wiederholte Abrufe. Keine aktuellen CrUX-/INP-Felddaten und keine
garantierten stabilen 100 Punkte. Barrierefreiheit und technische Lighthouse-SEO-
Prüfung jeweils 100; das ist keine vollständige SEO-Bewertung oder Rankingprognose.
Best Practices auf drei Unterseiten 100, Startseite 81 wegen des vom Hosting
eingefügten Cloudflare-Skripts. Diese Providerkonfiguration wurde nicht geändert.

Weitere Performancearbeit benötigt eine gesondert belegte Untersuchung der
schwankenden Server-/Hostingantwort. Ein öffentlicher HTML-Cache wurde nicht als
Abkürzung eingeführt; private Antworten und globaler Auth-/MFA-Schutz bleiben erhalten.

Abschließender kostenloser OpenSEO-Audit `4a8488cf-48e9-45d8-91ae-2d52bea88156`,
12.10.2026, 11:10:51–11:11:55 MESZ: completed, 61/61 Abrufe HTTP 200/ok,
darunter exakt alle 52/52 Sitemap-Seiten, zusätzlich acht PDFs und Login.
**0 critical, 0 warning, 4 info:** Login absichtlich noindex, zwei Titel-Längenhinweise
(Etappenratgeber 66, Stelle 67 Zeichen) und ein einzelner PDF-Abruf mit 2.556 ms.
Keine neuen materiellen Fehler. Lighthouse war ausdrücklich ausgeschaltet;
keine kostenpflichtigen Anbieteraufrufe. Der Crawl bestätigt technische
Indexierbarkeit, keinen neuen Google-Aufnahmestand; dafür bleibt 46/52 maßgeblich.

Technische Grundlagen:
[Google AI-Optimierung](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide),
[Google JobPosting](https://developers.google.com/search/docs/appearance/structured-data/job-posting),
[Vite Asset-Basis](https://vite.dev/guide/build.html),
[TanStack Asset-URLs](https://tanstack.com/start/latest/docs/framework/react/guide/cdn-asset-urls).
