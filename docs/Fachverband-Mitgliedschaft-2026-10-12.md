# Mitgliedschaft im Fachverband

## Bestätigte Grundlage

Der Nutzer hat am 12.10.2026 ausdrücklich bestätigt, dass die Loni GalaBau GmbH
ordentliches Mitglied im Fachverband Garten-, Landschafts- und Sportplatzbau
Hessen-Thüringen e. V. ist und das Verbandszeichen verwenden darf. Das gelieferte
`Gartenverband.svg` ist bytegleich mit beiden bereits vorhandenen Website-Dateien
(`public/images/partner/gartenverband.svg` und `src/assets/logo-gartenverband.svg`).
Das Original wird weder umgefärbt noch beschnitten oder in seinen Proportionen
verändert. Die bisherige weiße CSS-Umfärbung im Footer entfällt; dort bekommt das
grüne Original einen weißen Hintergrund.

Diese Nutzerbestätigung belegt keinen persönlichen Meister-/Technikerabschluss,
keine Mitgliedsnummer, kein Aufnahmedatum und keinen konkreten öffentlichen
Verzeichniseintrag. Solche Angaben werden nicht ergänzt. Die zuvor widersprüchliche
Rinn-Angabe „Mitglied im Fachverband: nein“ wurde nicht extern geändert.

## Seite und Einbindung

Neue Route `/fachverband-mitgliedschaft`: eigene Darstellung der ordentlichen
Mitgliedschaft, kundengerechte Einordnung der Aufnahmebedingungen, allgemeines
Aufnahmeverfahren, konkrete Loni-Arbeitsweise und Projektanfrage. Das Landesverbands-
gebiet begrenzt nicht das Einsatzgebiet: Firmensitz Hattersheim am Main bei Frankfurt,
deutschlandweite Tätigkeit.

Einstiege über vorhandene Startseitenkachel, Footer, Über-uns-Seite und alle acht
Leistungsseiten. Die Nachunternehmerseite `/partner-werden` bleibt ein anderer
Anwendungsfall. Eigener Titel, Description, Canonical und AboutPage-Schema;
Unternehmensschema mit `memberOf` zur offiziellen Verbandswebsite. Keine erfundene
Zertifizierung, Bewertung oder Linkgleichsetzung per `sameAs`. Sitemap und `llms.txt`
enthalten den neuen Inhalt.

## Offizielle Quellen, am 12.10.2026 geprüft

- [FGL Hessen-Thüringen: Mitgliedschaft](https://www.galabau-ht.de/mitgliedschaft-ht):
  fachliche Voraussetzungen, qualitätsbewusste Arbeit und allgemeines
  Aufnahmeverfahren; ein Baustellenbesuch ist dort als ideal, nicht zwingend genannt.
- [Offizieller Aufnahmeantrag und Signum-Regeln](https://www.galabau-ht.de/aufnahmeantrag-fgl-hessen-thueringen.pdfx):
  Nutzung durch ordentliche Mitglieder beziehungsweise die einschlägige Abteilung,
  keine formalen Änderungen, GaLaBau-Bezug, Ende der Berechtigung bei Mitgliedschaftsende.
- [BGL: Logo und Leitbild](https://www.galabau.de/logoundleitbild): Einordnung des
  geschützten Erkennungszeichens der Landschaftsgärtner.

Die Seite unterscheidet allgemeine Verbandsanforderungen, verfügbare
Verbandsangebote und eigene Arbeitsweise. Eine obligatorische Baustellenkontrolle,
ständige unabhängige Überwachung, automatische Garantie, absolvierte Seminare oder
eine individuelle Zertifizierung werden daraus nicht abgeleitet.

## Prüfung und Veröffentlichung

Lokale Prüfung abgeschlossen: 231 Anwendungstests, TypeScript und gezieltes ESLint
bestanden; Produktionsbuild und Worker-Nachbereitung erfolgreich. Unabhängiger
HTTP-Crawl: alle 53 Sitemap-Seiten HTTP 200, eindeutige Titel/Descriptions, je eine
H1, korrekte Canonicals, keine fehlenden Alt-Attribute oder ungültigen JSON-LD-Blöcke.
Sieben Bildvarianten der neuen Seite erreichbar. Bestehende privaten Login-/Admin-
Header erhalten.

Browserprüfung: zwölf Ansichten und zwölf tatsächliche Clientnavigationen über
Startseite, Über uns, eine Leistung und neue Mitgliedschaftsseite bei 320, 390 und
1440 Pixeln. Keine Überläufe, JavaScriptfehler, fehlenden Assets oder verzerrten
Verbandszeichen. Drei CTA-/Formularinteraktionen ohne Versand erfolgreich. Logo,
Aufnahmebedingungen, Verfahren und Anfragebereich zusätzlich visuell geprüft.
**Veröffentlicht in Version 69 am 12.10.2026, 12:03:35 MESZ.** Quellcommit
`a55b59d52b9b5e6dbe9bb142c1ba4c06b44d812f`, erfolgreicher Deploymentlauf
`appgdep_6accb05ff21081919f4dee003bbbc87a`. Der erste Hostinglauf
`appgdep_6accafe6374c8191b453126e30f9ecd3` meldete einen generischen
Veröffentlichungsfehler; die bisherige Seite blieb erreichbar. Der erneute Lauf
derselben gespeicherten Version mit unverändertem Archiv war erfolgreich.

Live-HTTP-Crawl 12:03:43–12:03:51 MESZ: alle 53 Sitemap-Seiten HTTP 200,
eindeutige Metadaten, je eine H1, richtige Canonicals, keine fehlenden
Alt-Attribute oder ungültigen JSON-LD-Blöcke. Neue Mitgliedschaftsseite und sieben
Bildziele erreichbar; offizielle Quellen und interne Einstiege enthalten,
private Login-/Adminheader erhalten. Auch live zwölf Browseransichten, zwölf
Clientnavigationen und drei CTA-/Formularinteraktionen bei 320/390/1440 Pixeln
erfolgreich, kein Versand. Original-SVG ohne Umfärbung oder Verzerrung, helle
Hero-Überschrift und alle wesentlichen Seitenbereiche visuell bestätigt.
Die Abschlussdokumentation ändert den veröffentlichten Programmcode nicht.
Neue Google-Indexierung oder ein neuer eingehender Backlink ist durch das Anlegen
dieser eigenen Seite nicht belegt.
