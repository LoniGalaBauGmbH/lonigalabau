# Partner werden – Umsetzung und Prüfung

Stand: 08.10.2026. Version 63 veröffentlicht; zusätzlicher GitHub-Abgleich folgt nach dieser Dokumentation.

## Umfang

`/partner-werden`: eigenständige Landingpage mit authentischem Teamfoto, drei Projektmotiven, Originalportrait von Valon Sinanaj, Qualitätsanforderungen, Ablauf und vier FAQ. Ein Formular, drei Schritte, Werterhalt beim Zurückgehen, direkte Feldfehler und Fokusführung. Bestehende Markenfarben, Bildvarianten und Bewegungspräferenzen werden übernommen. Footer und Über-uns-Seite verlinken die neue Seite; öffentliche Inhalte werden serverseitig gerendert, Canonical und Sitemap sind integriert.

Der Nutzer hat den ursprünglichen Ein-Dokument-Plan ausdrücklich erweitert: **Beide Nachweise sind Pflicht**, jeweils PDF bis 10 MiB und mit eigenem gültigen Ablaufdatum:

- Freistellungsbescheinigung nach § 48b EStG.
- Bescheinigung nach § 13b UStG (USt 1 TG) des sich bewerbenden Betriebs.

Dies ist Loni-Bewerbungsvoraussetzung, keine automatische rechtliche Freigabe oder Aussage, dass jeder Auftrag netto abgerechnet werden darf. Die Buchhaltung prüft den konkreten Auftrag und die Rolle des Leistungsempfängers gesondert. Rechtsgrundlage zur Einordnung: https://www.gesetze-im-internet.de/ustg_1980/__13b.html. Keine erfundenen Zitate, Aufträge oder Zusagen.

## Speicherung und Rechte

Eigene Tabelle `partner_applications`, kurze fortlaufende P-Nummern, eigener privater Speicher `partner-documents`. Zwei additive Migrationen wurden in `fvctfguvupdcscthrxeb` angewandt und nachgeprüft. Browserrollen haben keine Tabellenrechte; beide PDFs sind ausschließlich über berechtigte Serverfunktionen und zehn Minuten gültige Links abrufbar. Zweite Nachweisspalten bleiben für historische Datensätze gemeinsam nullable; neue öffentliche Bewerbungen erfordern beide Nachweise serverseitig.

PDF-Endung, MIME, Dateisignatur, Größe und Angaben werden serverseitig geprüft. Beide Dateien werden vor dem ersten Upload validiert. Ein unveränderlicher Request-Token und Inhaltsfingerabdruck einschließlich beider Dateien verhindern doppelte Datensätze; verlorene INSERT-Antworten dürfen gespeicherte Dokumente nicht entfernen. Upload-/INSERT-Fehler bereinigen die eindeutig zugeordneten temporären Dateien; unklare Zustände erhalten potenziell gespeicherte Dateien. Keine automatische PDF-Schadsoftwareprüfung implementiert.

`/admin/partner`: Suche, Statusfilter, fünf Bearbeitungsstatus, Notizen mit Versionsprüfung, beide Nachweisgültigkeiten, getrennte private Downloads, Versandstatus und bestehende Löschfunktion einschließlich beider Dateien. Verwaltungsseiten sind geschützt und nicht indexierbar.

## E-Mails und Datenschutz

Interne strukturierte Nachricht an `webseite@loni-galabau.de`, persönliche gebrandete Eingangsbestätigung mit Teamfoto und P-Nummer. Logos/Fotos eingebettet, keine privaten PDF-Anhänge in E-Mails. Speicherung erfolgt vor Versand; Versandfehler bleiben sichtbar und innerhalb des bestehenden sicheren Wiederholungsfensters erneut versuchbar. Nach Ablauf des Provider-Deduplizierungsfensters ist eine persönliche Versandprüfung nötig, um mögliche Doppelzustellungen zu vermeiden. Datenschutzabschnitt und Hinweis auf manuelle Löschung erweitert. Kein Werbeverteiler.

## Belegte Prüfungen

- 176 Anwendungstests der Gesamtsuite und anschließend neun Partner-Tests inklusive eines zusätzlichen Konfliktfalls erfolgreich (177 Tests insgesamt). Abgedeckt: beide Pflicht-PDFs, falsche/abgelaufene Daten, gefälschte Dateitypen, 10-MiB-Grenzen, Uploadfehler des zweiten Dokuments, INSERT-Fehler, konkurrierende Wiederholungen mit gleichen und unterschiedlichen Inhalten, verlorene Antworten, Mail-Snapshots sowie bestehende A-/B-Ticketnummern.
- TypeScript und gezieltes ESLint erfolgreich.
- Chromium/Edge bei 320, 390, 768, 1440 px und niedrigem Laptop-Viewport 1366 × 640: keine horizontalen Überläufe, alle Bilder geladen, genau eine Formularinstanz und ein Canonical. 720-px-Reflow entspricht der verfügbaren CSS-Breite eines 1440-px-Displays bei 200 % Zoom; kein echter Safari-Gerätetest.
- Formularvor/-zurück, Werterhalt, fehlende Felder, Fokusführung, fehlerhafte Dateien und reduzierte Bewegung geprüft. Keine Browserfehler im finalen Durchlauf; anonyme Adminnavigation führt zum Login.
- Echte Testbewerbung über die lokale UI gegen die produktive Datenbank mit **zwei unterschiedlichen 10-MiB-Test-PDFs**. Beide Dateien bytegenau über berechtigte Downloadlinks geprüft. Anonyme sowie angemeldete Nicht-Admin-Zugriffe abgewiesen. Status und Notizen über die echte Adminoberfläche bearbeitet.
- Wiederholung derselben HTTP-Anfrage: ein Datensatz, identische Versandkennungen. Interne Mail und Kundenbestätigung für `P-1003` an das eigene Testpostfach vom Empfänger-Mailserver angenommen (`delivered`). Nur synthetische Testdaten und ausdrücklich als SYSTEMTEST gekennzeichnete Unterlagen verwendet.
- Löschen über die echte Adminoberfläche: Datensatz, beide PDFs und Zustellinformationen entfernt. Temporärer Testbenutzer und seine Rolle anschließend entfernt. Testmails verbleiben als SYSTEMTEST im eigenen Postfach; Test-P-Nummern werden nicht erneut vergeben.

## Veröffentlichung und Liveprüfung

Finale Typprüfung und Produktionsbuild erfolgreich. Sites-Workflow hat Quellstand `2669f089f80a30e53c187497b610a9b3a0afdc12` veröffentlicht. Der mitgelieferte Shell-Packager konnte mangels Bash unter Windows nicht starten; dasselbe `prepare-site-build.cjs` und Windows-tar erstellten und prüften anschließend das passende Workerarchiv (827 Dateien, ohne Umgebungsdateien oder Git-Verzeichnis).

**Version 63**, Deployment `appgdep_6ac7588995988191bd4f6d0724e7522c`, am 08.10.2026 um **10:47:29 MESZ** erfolgreich live. Öffentliche URL: https://www.loni-galabau.de/partner-werden. Nachträgliche Dokumentation ändert den veröffentlichten Programmcode nicht.

Live ohne JavaScript geprüft: sichtbare Inhalte und genau ein korrekter Canonical. Sitemap enthält die neue URL. Startseite, Kontakt, Jobdetail, Über uns, Datenschutz und Adminroute liefern erwartete Antworten; Adminroute ist `noindex`. Mobile Ansicht, Tastatur-Tab-Reihenfolge, Fokusführung, normal animierter Vor-/Zurückwechsel und schnelle Doppelklicks ohne Schrittüberspringen geprüft. Keine Browserfehler.

Zusätzlich über die **echte Produktionsoberfläche** zwei unterschiedliche PDFs à 10 MiB eingereicht: `P-1004`, beide Dokumente bytegenau gespeichert, Wiederholung ohne neuen Datensatz oder neue E-Mails. Beide E-Mails `delivered`. Private Downloads anonym gesperrt. Testdatensatz und beide Dateien anschließend gelöscht; null verbliebene Live-Testvorgänge bestätigt.

Bestehende organisatorische Datenschutzpunkte (AVV/DPA und betriebliche Löschfristen) sind nicht durch diese technische Erweiterung erledigt. GitHub-Abgleich wird separat protokolliert.
