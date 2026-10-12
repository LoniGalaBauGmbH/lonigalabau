# Zisternen-Einbau: Recherche und Themenseite

Stand 12.10.2026. Auftrag: fundierte Keywordrecherche, eine eigenständige schöne
Unterseite zum Einbauen/Nachrüsten von Zisternen und ein passendes KI-Schnittbild.
Neue Route `/zisterne-einbauen-lassen`, ausdrücklich keine neunte Datenbank-Leistung
und keine zusätzliche Karte in der achtteiligen Leistungsübersicht.

## Recherche und Inhalt

Recherche im vorhandenen OpenSEO-Projekt: 274 Ideenzeilen, 93 gezielte Kandidaten,
71 numerische Metrikzeilen, 22 ohne Datensatz; sechs erfolgreiche SERP-Suchproben.
38 passende Keywords gespeichert und erneut abgeglichen; vorhandene 190 erhalten,
Gesamtbestand 228. Beobachtete neue Kontodifferenz 0,08940 USD, kein Nachladen.
Volumina sind Deutschland-Schätzungen ohne Clickstream, jüngster Trendmonat August
2026. Keine Echtzeit-Oktober-, Klick-, Anfrage- oder Rankingprognose; nahe Varianten
nicht addieren, unbekannt nicht als null behandeln.

Primärziel „zisterne einbauen lassen“ (50 geschätzte monatliche Suchen), unterstützt
von „zisterne einbauen“ (320), „zisterne einbauen kosten“ (140), Nachrüsten (40),
Gartenbewässerung (110) und Beton/Kunststoff (110). Vollständige Methodik und
Zuordnung: [Keywordrecherche](Keyword-Recherche-Zisternen-2026-10-12.md),
[93 Kandidaten als CSV](Keyword-Zisternen-2026-10-12.csv).

Landingpage: Einbauangebot, Planungsfragen, Nachrüstung im Bestand, Kostenfaktoren,
fünf Umsetzungsschritte, sechs FAQ und vorhandenes Anfrageformular. Projektort,
Nutzungswunsch, Dachfläche, Zugang und Bilder/Pläne werden als hilfreiche Angaben
erklärt. Für Fotos/PDFs führt ein Link zum bestehenden Kontaktformular.
Deutschlandweite Tätigkeit und Firmensitz Hattersheim bei Frankfurt erhalten.
Keine erfundenen Preise, Referenzprojekte, Herstellerpartnerschaften oder
SHK-/Elektro-Zulassungen ergänzt.

## Technische Grundlage und Bild

Baugrund, Grund-/Schichtenwasser, Auftrieb, spätere Belastung, Herstellerangaben,
Zugang und Wartung bestimmen den Einbau. Keine universelle Einbautiefe oder dicke
Kiesschicht vorgeben. Überlaufziel, Kanalart, Rückstauebene und Anschlussbedingungen
bestimmen das Rückstaukonzept; keine pauschale Klappen-/Hebeanlagenlösung.
Hausnutzung/Nachspeisung und Trinkwasserschutz werden getrennt eingeordnet,
erforderliche Arbeiten mit den zuständigen Fachbetrieben abgestimmt.

Primärquellen, am 12.10.2026 geprüft:

- [UBA: Regenwassernutzung](https://www.umweltbundesamt.de/umwelttipps-fuer-den-alltag/tipps-fuer-eine-nachhaltige-regenwassernutzung)
- [Rewatec: Zisternen und systemabhängige Einbaubedingungen](https://www.premiertechaqua.com/de-de/lagertanks/zisterne)
- [Mall-Ratgeber Regenwasser 2026, Teil 2](https://www.mall.ch/fileadmin/user_upload/produkte/fachbuchreihe-oekologie-aktuell/ratgeber-regenwasser-auflage-11-2026-teil-2-von-3.pdf),
  gedruckte Seiten 20–21: aktuelle Einordnung von Regenspeichern und Rückstausicherheit.

Mit integriertem Bildgenerierungswerkzeug erstellte Garten-/Zisternen-Schnittansicht,
als KI-Visualisierung sichtbar gekennzeichnet. Fachlich visuell geprüft als
schematisches Beispiel; keine Ausführungsplanung oder echtes Referenzfoto.
AVIF/WebP in vier Breiten 480/800/1200/1586, responsive und vollständig sichtbar,
feste Bildmaße gegen Layoutsprünge, Hero eager/high priority. Kein Zuschnitt der
Technik und keine im Bild eingebrannten Maßangaben. AVIF-Bildgrößen rund
27/70/135/203 kB statt des 3,43-MB-Original-PNGs.

Bilddateien: `public/images/zisternen/zisterne-garten-schnitt-ki-*.avif` und `.webp`.
[Vollständiger Bildprompt und Einordnung](Zisternen-Bildprompt-2026-10-12.md).
Das Original-PNG und private Recherche-/Kontonachweise bleiben außerhalb Git.

## Einbindung und Prüfstand

Einstiege über den Startseiten-Themenbereich, Footer und die drei passenden
Leistungsseiten Erdarbeiten, Entwässerung und Bewässerungsanlagen. Ein weiterer
Kontextlink steht im Ratgeber zur Gartenbewässerung; dessen Inhaltsdatum und der
generierte Ratgeberindex sind entsprechend aktualisiert.
Eigene Metadaten/OG/Twitter, Canonical, AboutPage und BreadcrumbList; Sitemap und
llms.txt ergänzt. Keine erfundenen Preise, Produktangebote oder Bewertungen im Schema.

Lokale Prüfungen abgeschlossen: 231 Anwendungstests, TypeScript, gezieltes ESLint
und Produktionsbuild erfolgreich. Unabhängiger HTTP-Crawl: alle 54 Sitemap-Seiten
HTTP 200, eindeutige Titel/Descriptions, je eine H1, richtige Canonicals, keine
fehlenden Alt-Attribute oder ungültigen JSON-LD-Blöcke. 27/27 geprüfte neue Bildziele
erreichbar; private Login-/Adminheader erhalten.

Browser: 18 Seitenansichten und 18 echte Clientnavigationen bei 320/390/1440 Pixeln,
sechs CTA-/FAQ-/Formularprüfungen ohne Versand. Keine Überläufe, JavaScript-/Asset-
Fehler oder Bildbeschnitte. KI-Kennzeichnung sichtbar, responsive Varianten und
hohe Ladepriorität geprüft. Guide-Kontextlink nach Ergänzung separat nachgeprüft.
Die erste Prüferwartung zum Text eines geschlossenen FAQ wurde korrigiert; der
betroffene Inhalt ist beim Öffnen tatsächlich vorhanden, kein Websitefehler.

**Veröffentlicht in Version 70 am 12.10.2026, 16:27:14 MESZ.** Quellcommit
`3e76163f43da994da65f2d2fb8a569fb46d25c97`, Deployment
`appgdep_6accee227d4c8191aca2c01c93c2ab2a`. Bestehende Seiten, acht Leistungskarten,
private Anfrage-/Uploadwege und Verbandsseite erhalten.

Live-HTTP-Crawl 16:28:28–16:28:35 MESZ: 54/54 Seiten HTTP 200, eindeutige Metadaten,
je eine H1, passende Canonicals, keine Alt-/JSON-LD-Fehler; 27/27 Bildziele erreichbar,
private Header erhalten. Acht neue Bildvarianten separat geprüft: korrekter MIME,
86400 Sekunden Cache, nosniff, Bytegleichheit zum lokalen Bild, HEAD 200 und ETag-304.
Unmittelbar nach Veröffentlichung wurde noch teils V69 ausgeliefert; die späteren
normalen Abrufe von neuer Seite, Startseite und Sitemap bestätigen V70. Erste
Prüfrunde privat archiviert, keine Cachebuster als Abschlussbeleg verwendet.
Live-Browserprüfung abgeschlossen um 16:30:11 MESZ: 18 Ansichten bei 320/390/1440
Pixeln, 18 Clientnavigationen einschließlich neuem Ratgeberlink und sechs CTA-/
Formular-/FAQ-Prüfungen ohne Befund oder Versand. Alle sechs FAQ mit Tastatur
bedienbar; vollständiges Hero-Motiv, KI-Caption und freiwillige Herkunftsauswahl
bestätigt. Die Abschlussdokumentation ändert den Live-Programmcode nicht.
Technische Indexierbarkeit ist kein Nachweis einer tatsächlichen Googleaufnahme.
