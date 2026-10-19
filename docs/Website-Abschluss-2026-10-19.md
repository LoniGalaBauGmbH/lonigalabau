# Website-Abschluss: regionale Inhalte und Anfragekontext

Auftrag vom 19.10.2026: zuerst die Website fertigstellen, danach das Unternehmensprofil. Grundlage ist die vorhandene Keywordrecherche vom selben Tag; keine neuen kostenpflichtigen Keywordabfragen.

## Umgesetzt

- Vier neue Ortsseiten: `/gartenbau-frankfurt`, `/gartenbau-wiesbaden`, `/gartenbau-mainz`, `/gartenbau-bad-homburg`.
- Unterschiedliche Planungsschwerpunkte: Baustellenzugang und Flächen in Frankfurt; Entsiegelung und Regenwasser in Wiesbaden; Sonne, Schatten und Gartenpflege in Mainz; Bestandserhalt und Bauabschnitte in Bad Homburg.
- Je drei Fachabschnitte, vier FAQ, Vorbereitungsliste, acht vorhandene eigene Galeriefotos, vorhandene Team-/Fachnachweise und zwei Anfragewege im etablierten Layout. Bilder als Gestaltungsbeispiele, keine erfundenen Ortsreferenzen oder Niederlassungen. Gemeinsames vorhandenes KI-Hero bleibt gekennzeichnet.
- Einbindung in Ortsübersicht, Sitemap, Metadaten, strukturierte Daten und `llms.txt`. Frankfurter Stadtteilseiten verlinken die neue Stadtübersicht. Zaunseite um konkrete Anfragevorbereitung für Frankfurt und Rückverweis ergänzt. Neue Ortsseiten verweisen auf Terrasse, Einfahrt und Rollrasen.
- Worttrennung in den großen Ortsseiten-Überschriften abgeschaltet; „Landschaftsbau“ bleibt zusammen.
- Kontakt-, Express-, Projekt- und Gartenplaneranfragen übermitteln die aktuelle öffentliche Formularseite. Serverseitige Positivliste verwirft unbekannte/private Pfade, vollständige fremde URLs, Parameter und Fragmente. Kein Referrer, Suchbegriff, Cookie, Besucherkennzeichen oder Verlauf. Ungültiger optionaler Kontext blockiert eine ansonsten gültige Anfrage nicht.
- Formularseite wird als Kontext in der bestehenden geschützten Nachricht gespeichert und in der internen E-Mail separat dargestellt. Strukturierte Express-/Planerinformationen bleiben erhalten. Keine Datenbankmigration oder Änderung an RLS, Rollen und E-Mail-Empfängern.
- Datenschutzinformation um dieses tatsächliche Verhalten ergänzt. Die Formularseite ist vom Browser übermittelter Kontext, keine beweiskräftige organische Attribution. Telefon-/WhatsApp-Kontakte bleiben ohne automatische Zuordnung; bestehende Selbstauskunft und persönliche Anfragebewertung bleiben erhalten.
- Beim Browsercheck beobachteter Frühklick vor vollständigem Laden konnte eine native GET-Navigation mit leeren Formularparametern auslösen. Alle sieben öffentlichen Formularbausteine verwenden jetzt POST und geben ihre Eingabe-/Sendesteuerung erst nach Anbindung der Browserlogik frei. Keine echte Anfrage oder E-Mail im Test versendet.

## Prüfung

234 Anwendungstests bestanden, darunter neue Prüfungen der Kontextvalidierung und der vollständigen Express-Verarbeitung bis zum internen E-Mail-Modell. Bestehende Orts-/Bild-/Schema-Prüfungen auf vier zusätzliche Seiten erweitert. Typprüfung und gezieltes ESLint erfolgreich.

Lokale Prüfung: vier neue Seiten und Ortsübersicht bei 320/390/1440 px ohne horizontale Überläufe, defekte lokale Anker oder sichtbare Bildfehler. Nach Umbruchkorrektur zusätzlich alle 16 Ortsseiten bei denselben Breiten geprüft: 48 Ansichten ohne Befund. Alle 16 neuen FAQ per Tastatur geöffnet und geschlossen. Express-Formular validiert leere Felder und fokussiert das erste; mit synthetischen Angaben bis Schritt 3 erfolgreich, ohne URL-Parameter oder Versand. Ein zunächst zu schneller Testklick während des bestehenden Schrittwechsels wurde nach Zustandsprüfung wiederholt.

Die erste Testausführung erkannte eine ungültige Bildalias-Verknüpfung für Wiesbaden sowie zwei Test-Lader, die das neue Hilfsmodul noch nicht kannten, und eine veraltete Auswahl der letzten zwei Ortsseiten als Stadtteile. Ursachen korrigiert; abschließende Suite vollständig bestanden.

**Live in Version 81 seit 19.10.2026, 15:34:22 MESZ.** Quellcommit `d2526f926a059b104162e069495dce634b773059`, Deployment `appgdep_6ad61c46f0088191a7e9fd9505cdaf23`, Status succeeded. Öffentliche Audience und Laufzeitkonfiguration Revision 4 erhalten. Client-/Serverbuild erfolgreich; offizieller Quellabgleich danach erneut geöffnet und Commit bestätigt. Der Windows-Host besitzt kein Bash für den abschließenden Packager; nach diesem bekannten Fehler mit unverändertem offiziellen Vorbereitungshelfer und Windows-tar verpackt. Hostingmanifest und etwaige Build-Attribution erhalten, Archiv auf erforderliche Dateien und Ausschluss privater Quellen geprüft.

Live-Crawl am 19.10.2026 um **15:34:48 MESZ**: **61/61 öffentliche Sitemap-Seiten** HTTP 200, eindeutige Titel/Beschreibungen, eine H1, passende Canonicals, gültiges JSON-LD und keine noindex-Sperren. Login/Admin behalten no-store/noindex. 21 Live-Ansichten der vier neuen Seiten, Ortsübersicht, Zaun- und Kontaktseite bei 320/390/1440 px ohne Überläufe oder sichtbare Bildfehler. Separat sieben serverseitig gerenderte Formulare auf sechs Seiten einschließlich Partner- und Stellenbewerbung geprüft: alle POST und Sendesteuerung im initialen HTML deaktiviert. Live-Expressformular nach Laden aktiv, vier leere Pflichtfelder korrekt markiert und erstes Feld fokussiert, URL bleibt ohne Formularparameter. Wiesbadener Galerie geöffnet, auf Bild 2 gewechselt und per Escape geschlossen. Keine echte Anfrage oder E-Mail versendet.

Website-Umsetzung und technische Prüfung abgeschlossen. Google-Indexierung, neue Rankings und zusätzliche Anfragen sind damit nicht nachgewiesen; weitere Erfolgsmessung bleibt laufende SEO-Arbeit. Reale Fallstudien bleiben gemäß früherem Nutzerwunsch zurückgestellt. Diese Abschlussdokumentation verändert den Live-Programmcode nicht. GitHub-Abgleich im Abschlussbericht.

## Kommunale Quellen

Am 19.10.2026 als Primärquellen geprüft; die Texte geben Vorbereitungshinweise, keine Grundstücksfreigaben, Förder- oder Genehmigungszusagen.

- Frankfurt: [Sondernutzungen](https://frankfurt.de/service-und-rathaus/verwaltung/aemter-und-institutionen/amt-fuer-strassenbau-und-erschliessung/sondernutzung/sondernutzungen), [Starkregengefahrenkarten](https://frankfurt.de/themen/umwelt-und-gruen/umwelt-und-gruen-a-z/wasser/starkregen/starkregengefahrenkarten).
- Wiesbaden: [Starkregenbroschüre](https://www.wiesbaden.de/medien/downloads/leben-in-wiesbaden/umwelt-naturschutz/Broschuere-Wie-wir-uns-vor-Starkregen-schuetzen.pdf), [Beratung zur Versickerung](https://www.wiesbaden.de/vv/produkte/36/Versickerung-von-Regenwasser-Beratung-und-Antrag-auf-wasserrechtliche-Erlaubnis).
- Mainz: [Themenkarten](https://www.mainz.de/microsite/klimaneutral/anpassungen-an-den-klimawandel/themenkarten), [Stadtplan](https://internet.mainz.de/stadtplan).
- Bad Homburg: [Baumschutz](https://bad-homburg.de/de/stadt/umwelt-und-klima/natur-und-landschaft/baumschutzsatzung), [Stadtentwässerung](https://bad-homburg.de/de/stadt/planen-und-bauen/stadtentwaesserung).

## Anschließend: Unternehmensprofil

Am 19.10.2026 anschließend bearbeitet: HTTPS-Website-Link, ausführliche sachliche Unternehmensbeschreibung, 13 Einsatzorte und Vor-Ort-Leistungen gespeichert und zurückgelesen. Sieben zusätzliche Dienstleistungen und zehn Beschreibungen gespeichert; diese Leistungsänderungen stehen noch unter Google-Prüfung. Nutzer bestätigt Betrieb Montag–Freitag 07–17 Uhr, telefonisch bis 18 Uhr sowie persönliche Besuche nur nach Termin. Details in `docs/Unternehmensprofil-2026-10-19.md`.

## Bestätigte Zeiten: Folgeversion 82

Durch die Nutzerklärung wurde zusätzlich der bisherige Schemawert 18 Uhr als Betriebsschluss korrigiert. Footer jetzt ausdrücklich „Telefonisch erreichbar“ (07–18 Uhr), Kontaktseite mit separaten Betriebszeiten 07–17 Uhr und Terminvorbehalt; gemeinsames Unternehmensschema `closes: 17:00`.

Typprüfung, gezieltes ESLint und Client-/Serverbuild erfolgreich. Kontaktseite lokal und nach Veröffentlichung jeweils bei 320/390/1440 px geprüft: keine horizontalen Überläufe, Telefon-/Betriebs-/Terminhinweise und korrekter Schemawert vorhanden. Reine Text-/Faktenkorrektur; keine erneute vollständige Anwendungstestsuite oder neue Testanfrage. Die 234 Tests und der 61-Seiten-Crawl des unmittelbar vorherigen V81-Releases bleiben getrennt ausgewiesen.

**V82 veröffentlicht am 19.10.2026 um 15:57:03 MESZ**, Quellcommit `4ed521c1735f5667159c15f2cf3869f7f93c5ec1`, Deployment `appgdep_6ad62192649081918427e2fc3b673afc`, Status succeeded. Audience public und Laufzeitkonfiguration Revision 4 erhalten. Bekannter Bash-Packagerfehler nach erfolgreichem Build mit geprüftem Windows-Paketierungsweg aufgelöst, Quellenstand anschließend erneut verifiziert. Private Screenshots/Prüfwerte außerhalb Git. V81 zuvor mit GitHub-Commit `c336a33e7c9d22147a630fd4b282481d355b559c` inhaltsgleich synchronisiert; finaler Folgeabgleich im Abschlussbericht.
