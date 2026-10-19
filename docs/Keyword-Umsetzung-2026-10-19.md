# Keywordempfehlungen: Umsetzung vom 19.10.2026

Grundlage: [Keywordrecherche](Keywordpotenzial-2026-10-19.md) und [Unterseitenplan](Unterseiten-Plan-2026-10-13.md). Der Nutzer hat die Umsetzung ausdrücklich beauftragt. Keine erneuten kostenpflichtigen Keywordabfragen.

## Umgesetzter Umfang

- Neue eigenständige Angebotsseiten `/terrasse-bauen-lassen` und `/einfahrt-pflastern-lassen`: konkrete Ausgangslagen, Material-/Aufbauentscheidungen, Kostenpositionen, Ablauf, je sechs FAQ und projektbezogene Fotoanfrage. Je zwei vorhandene eigene Projektbilder; keine erfundenen Referenzorte, Preise oder zusätzlichen Leistungszusagen.
- Bestehende `/leistungen/rasenanlagen` auf **Rollrasen verlegen lassen** ausgerichtet. Individueller Ablauf und Angebotshilfe für 100 m² mit unterschiedlichen Ausgangszuständen. URL bleibt bestehen.
- Gartengestaltung um tatsächliche Ausführung, Neubau/Bestand und Bauetappen ergänzt; Zaunarbeiten um Verlauf, Rückbau, Montage und Tore. Je ein weiteres eigenes Bestandsbild und konkrete Anfrageangaben.
- Drei öffentliche Supabase-Leistungsdatensätze am 19.10.2026 um 14:31:07 MESZ aktualisiert: Titel/Kurztext/Metadaten und je fünf FAQ. Alle neuen Werte anschließend semantisch zurückgelesen und verglichen. Bestehende Langtexte, Bilder und Vorteile erhalten. Transaktion mit Schutz gegen zwischenzeitliche Änderungen in `supabase/content/keyword-services-2026-10-19.sql`; keine Schema-/RLS-Änderung.
- Neue Einstiege von Startseite, Leistungsübersicht, Footer, fünf passenden Leistungsseiten, drei passenden Ratgebern sowie den bestehenden Ortsseiten Hattersheim/Hofheim/Bad Soden. Rasen zusätzlich mit Zisternen-Thema verknüpft; Bewässerungs-/Dachinhalte im Bestand bleiben nutzbar.
- Eindeutige Metadaten, Canonicals, Unternehmens-/Service-/Breadcrumb-Schemas, Sitemap und `llms.txt` ergänzt. Tatsächliche Bearbeitungsdaten der betroffenen Inhalte aktualisiert.
- Bestehendes dreistufiges Anfrageformular verwendet; Pflasterarbeiten vorausgewählt, projektspezifische Eingabehilfe. Fotos bleiben freiwillig. Vorhandene Herkunftsangabe und manuelle Anfragequalifizierung werden weiterverwendet. Keine neue Trackinginstallation.

## Prüfung und Veröffentlichung

**Live in Version 80 seit 19.10.2026, 14:45:52 MESZ.** Quellcommit `2be67c15127fa0e3e050e49fe807c2695b5d4cd5`, Deployment `appgdep_6ad610e8dd888191b48b0277ef18c1ef`, Status succeeded. Öffentliche Audience und vorhandene Laufzeitkonfiguration (Revision 4) erhalten. Offizieller Quellabgleich/Build erfolgreich; nach dem unter Windows fehlenden Bash-Packager unveränderten offiziellen Vorbereitungshelfer und Windows-tar verwendet. Archiv enthält ausschließlich Build und Hostingmanifest, keine lokalen Zugangsdaten.

232 Anwendungstests einschließlich neuem Regressionstest für alle zwölf Ratgeber-Datumswerte bestanden; TypeScript, gezieltes ESLint, Diff-Prüfung und finaler Client-/Serverbuild erfolgreich. V79 hatte zunächst bei drei aktualisierten Ratgebern ein unpassendes Datumsformat. Der vollständige Live-Crawl hat dies erkannt; V80 korrigiert es. Der abschließende HTTP-Audit vom **19.10.2026, 14:46:17 MESZ** bestätigt 57/57 Seiten mit HTTP 200, jeweils einer H1, eindeutigen Titeln/Beschreibungen und korrekten Canonicals, gültigem JSON-LD und ohne noindex-Sperre. Login/Admin behalten no-store/noindex.

Zwei Angebotsseiten, drei Leistungsseiten, drei Ortsseiten, Startseite, Leistungsübersicht und drei Ratgeber in insgesamt 39 Live-Ansichten bei 320/390/1440 px ohne horizontalen Überlauf geprüft. Drei Ratgeber zeigen korrekt den 19. Oktober 2026. Alle vier Bilder der neuen Seiten geladen; je sechs FAQ per Tastatur geöffnet/geschlossen. Live-Formularpflichtfelder und Fokus geprüft; lokale Einfahrtsanfrage bis zum Anhängeschritt einschließlich Vorauswahl und Eingabehilfe getestet. Keine Anfrage und keine E-Mail versendet. Mobile Formularüberschrift und Kostenüberschrift nach visueller Prüfung korrigiert.

Lokale dynamische Leistungsdaten waren mangels Servergeheimnissen nicht verfügbar; vollständige Prüfung dieser Seiten erfolgte live mit der vorhandenen Produktionskonfiguration. Vorläufige Fehler-/Ladeansichten zählen nicht als bestandene Prüfung. Private Rohbelege und Screenshots verbleiben im ignorierten Arbeitsordner. Nachträgliche Abschlussdokumentation verändert den veröffentlichten Programmcode nicht.

## Wirkungsmessung

Veröffentlichungstag ist der Beginn der Auswertung, kein Nachweis zusätzlicher Anfragen. Je Zielseite GSC-Klicks, Impressionen, Suchanfragen und CTR vergleichen; neue Piloten haben noch keine Vorher-Leistung auf ihren URLs. Für vorhandene Leistungs- und Ortsseiten gleich lange 28-Tage-Zeiträume betrachten, zusätzlich Saisonalität berücksichtigen. Erste Nachbetrachtung frühestens nach 28 vollständigen Tagen mit verfügbaren GSC-Daten; nach 56 und 90 Tagen erneut einordnen. Diese Zeitpunkte sind ein Prüfplan, keine eingerichtete Automation.

Qualifizierte Kontakte anhand der vorhandenen manuellen Bewertung und freiwilligen Herkunftsangabe vergleichen. „Google-Suche“ ist eine Selbstauskunft, keine bewiesene organische Klickzuordnung. Telefon-/WhatsApp-Kontakte und konkrete Zielseiten werden dadurch nicht automatisch vollständig erfasst. Keine Anfragenzahl aus Suchvolumen ableiten.

## Google-Unternehmensprofil: lesend geprüft

Nach ausdrücklicher Nutzerfreigabe wurden das angemeldete Loni-Profil und die Google-Detailansicht am 19.10.2026 gelesen. Zwei anfängliche automatische Zugriffssperren wurden durch die jeweiligen Nutzerfreigaben geklärt. Es wurden keine Profilwerte, Beiträge oder Bewertungen geändert.

- Profil **LONI Galabau GmbH** im Profilmanager **Verified**. Firmensitz **Auf der Roos 3, 65795 Hattersheim**, Telefon **06190 9266134** und WhatsApp-Ziel stimmen mit der Website überein.
- Website im Profil noch als `http://www.loni-galabau.de/` eingetragen; Hauptadresse der Website ist HTTPS.
- Profilzeiten Montag–Freitag **07:00–17:00**, Samstag/Sonntag geschlossen; Website nennt **Erreichbarkeit 07:00–18:00**. Ob Öffnungs- und Telefonzeiten bewusst voneinander abweichen, muss vor einer Änderung geklärt werden.
- Im Feld Einsatzgebiet steht **Add**: dort ist aktuell kein Einsatzgebiet hinterlegt. Keine automatische Änderung aus der deutschlandweiten Website-Angabe abgeleitet.
- Hauptkategorie in der englischen Oberfläche **Landscape designer**, kurze Beschreibung nennt Neuanlagen, Terrassen-/Pflasterbau und Natursteinmauern.
- Profilmanager meldet **1 Google update**. In der gelesenen Detailansicht keine eindeutige Vorher-/Nachher-Zuordnung identifiziert; keine Aktualisierung bestätigt oder verworfen.

Profilprüfung abgeschlossen; die oben genannten Abstimmungen bleiben offen. Reale Fallstudien bleiben entsprechend dem früheren Nutzerwunsch auf später verschoben. Neue Google-Indexaufnahme, Rankings oder zusätzliche Anfragen werden nicht behauptet.
