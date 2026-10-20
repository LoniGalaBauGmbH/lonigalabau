# Anmeldung aller öffentlichen Seiten bei Google – 20.10.2026

## Bestätigtes Ergebnis

Die aktuelle Sitemap wurde in der Google Search Console für die Property
`https://www.loni-galabau.de/` erneut eingereicht. Google zeigte die Bestätigung
„Sitemap submitted successfully“. Das Einreichungsdatum in der Tabelle wechselte
auf **20.10.2026**.

Der direkte öffentliche Abruf von
[sitemap.xml](https://www.loni-galabau.de/sitemap.xml) um **12:59:49 MESZ**
lieferte HTTP 200 und **83 unterschiedliche URLs**. Darin enthalten sind
sämtliche 37 Ortsseiten und die neue Seite `/l-steine-setzen-lassen`.
Damit sind alle 83 öffentlichen Sitemap-Seiten über diesen gemeinsamen Weg
zur Entdeckung und Verarbeitung angemeldet.

**Das bestätigt keine tatsächliche Indexierung aller 83 Seiten.** Direkt nach
der Einreichung zeigte Google noch die ältere Sitemap-Verarbeitung vom
05.10.2026 mit 49 erkannten Seiten. Dieser historische Zähler ist weder die
aktuelle Größe der Sitemap noch die Zahl der indexierten Seiten.

## Gelesener Indexstatus und zusätzliche Einzelanträge

- Die Übersicht der Search Console zeigte 46 indexierte und 16 nicht indexierte
  Seiten. Dieser zeitversetzte Bericht wurde nicht URL für URL mit dem heutigen
  Bestand abgeglichen; insbesondere ist daraus keine Quote von 46/83 abzuleiten.
- Als erste neue Zielseite wurde `/gartenbau-darmstadt` geprüft. Google meldete
  „URL is unknown to Google“, ohne Crawl- oder Canonical-Daten.
- Der zusätzliche Einzelantrag scheiterte mit „Oops! Something went wrong“.
  Dazu erschien die Meldung, dass die Verbindung zum reCAPTCHA-Dienst nicht
  hergestellt werden konnte.
- Nach Neuladen scheiterte auch der begrenzte zweite Versuch mit derselben
  Google-/reCAPTCHA-Verbindungsmeldung. Weitere Einzelversuche wurden beendet.
  Es wurde keine CAPTCHA-Aufgabe gelöst und kein Kontingent oder Schutzmechanismus
  umgangen.

Die Sitemap-Einreichung bleibt unabhängig davon bestätigt. **Kein neuer
Einzelantrag und keine neue tatsächliche Indexaufnahme werden als Erfolg gezählt.**

## Prüfungen und Grenzen

- Website unverändert auf V90; der unmittelbar vorausgehende Veröffentlichungscheck
  bestätigte alle 83 Sitemap-Seiten mit HTTP 200 und ohne technische Indexsperre.
  Details: [Ortsausbau](Ortsausbau-2026-10-20.md).
- In diesem Auftrag wurde die aktuelle Sitemap erneut abgerufen und gezählt.
  Keine neue vollständige URL-Inspection aller 83 Seiten behauptet.
- Der lokale OpenSEO-Dienst war nicht erreichbar; Anmeldung und Beobachtungen
  erfolgten direkt in der angemeldeten Search Console.
- Keine bezahlten SEO-Abfragen, Websiteveröffentlichung, Datenbankänderung,
  Konto-/Berechtigungsänderung oder Hintergrundautomation.
- Lokale Belegscreenshots und rohe UI-Ausgaben bleiben im ignorierten
  Artefaktordner; keine Zugangsdaten oder privaten Kontoexporte im Repository.
- Nur Dokumentation geändert; deshalb Diff-/Inhaltsprüfung statt Anwendungstests.

Für viele URLs empfiehlt Google die Sitemap. Einzelanträge unterliegen einem
Kontingent; wiederholte Anträge beschleunigen die Verarbeitung nicht. Crawling
kann Tage bis Wochen dauern, Aufnahme und Zeitpunkt bleiben bei Google:
[Google Search Central: erneutes Crawling anfordern](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

Offen bleiben die tatsächliche Verarbeitung des neuen Sitemap-Bestands und die
Indexaufnahme der neuen Seiten. Für noch fehlende wichtige URLs können später,
nach erneuter Statusprüfung und bei funktionierender Google-Sicherheitsprüfung,
zusätzliche Einzelanträge gestellt werden.
