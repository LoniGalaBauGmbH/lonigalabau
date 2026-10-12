# Express-Anfrage · 12.10.2026

## Umsetzung

Der bisherige Rückrufbereich auf der Startseite und in den zehn gemeinsamen Ortsseiten-Instanzen ist jetzt eine kompakte Express-Anfrage. Drei Schritte: Kontaktdaten (Vorname, Nachname, Telefon, E-Mail), Projekt (Leistung, Beschreibung, optionale Adresse), optionale Anhänge und Prüfung der Angaben. Keine Datum-/Uhrzeitwahl. Bei mehreren benötigten Leistungen gibt es die Auswahl „Mehrere Leistungen / Beratung“ und die freie Beschreibung.

Neuer Anker `#express-anfrage`; alte Links auf `#rueckruf` funktionieren weiterhin. Vor-/Zurückwechsel erhalten Daten und Anhänge. Sanfte Überblendung und Höhenanpassung, Fokusführung, direkte Feldfehler und Unterstützung reduzierter Bewegung. Auf 320 px zusätzlich eine überbreite Startseiten-Überschrift und Referenz-Innenabstände korrigiert.

Eigene serverseitige Express-Validierung, vorhandener Missbrauchsschutz anhand E-Mail und Telefon sowie bestehende private Kontaktspeicherung. JPG, PNG, WebP und PDF: bis zu drei Dateien, jeweils maximal 5 MiB. Format-/Signatur- und Größenprüfung vor dem ersten Schreibzugriff. Kein fremder Dateipfad kann übernommen werden. Keine neue Datenbanktabelle oder Migration erforderlich.

Interne E-Mail nach `webseite@loni-galabau.de` mit getrennten Kontakt-, Projekt- und Beschreibungsblöcken. Kundenbestätigung mit vorhandenem Logo/Bild, Express-Betreff und kurzer A-Ticketnummer. Alte Rückrufdatensätze und ihre E-Mail-Varianten bleiben kompatibel. Datenschutzhinweise beschreiben Express-Daten und Telefonquotierung. Der parallel auf GitHub ergänzte SEO-Audit vom 08.10. wurde übernommen, nicht überschrieben.

## Belegte Prüfungen vor Veröffentlichung

- 183 automatisierte Tests bestanden, darunter sechs neue Express-Fälle und ergänzte Kundenbestätigungs-/Handlerprüfung. Exakt drei 5-MiB-Dateien akzeptiert; 5 MiB + 1 Byte trotz identischer Base64-Länge abgewiesen. Manipulierte Signaturen verursachen keine Uploads.
- TypeScript, gezieltes ESLint, Diffprüfung und Produktionsbuild erfolgreich. Die Windows-Umgebung besitzt kein npm; die bestehenden Prebuild-, Vite-Build- und Postbuild-Skripte wurden direkt mit Node ausgeführt.
- Browser: Startseite und Hattersheim mit allen drei Schritten bei 320, 390, 768, 1366 × 640 und 1440 px; keine horizontalen Überläufe oder JavaScript-Fehler. Zusätzlicher schmaler 720 × 450 Layouttest als Reflow-Prüfung, kein separat gemessener nativer Browserzoom.
- Pflichtfelder, fehlende optionale Adresse, ungültige Dateiauswahl, Vor-/Zurück, Dateierhalt, Fehlerzustand, Fokus und reduzierte Bewegung geprüft. Doppelklick erzeugt während des laufenden Versands einen POST.
- Lokaler realer Testvorgang A-1016 mit synthetischer PDF und Bild, Speicherung und exakte Dateiinhalte geprüft. Anonymer Datensatz-/Downloadzugriff gesperrt. Interne E-Mail und Kundenbestätigung laut Versanddienst beide zugestellt. Beide Testmails bewusst an die eigene Adresse; Testvorgang und private Uploads anschließend gelöscht.

## Bestehende technische Grenze

Die bestehende Kontaktspeicherung bietet keine vorgangsübergreifende Netzwerk-Deduplizierung. Ein neuer Versuch nach einer unklar verlorenen erfolgreichen Serverantwort kann wie bei den bisherigen Kontaktformularen einen zweiten Vorgang erzeugen. Die UI verhindert paralleles Absenden. Die getrennte Partnerbewerbung behält ihre eigene weitergehende Deduplizierung unverändert.

## Veröffentlichung

Live in **Version 64** seit **12.10.2026, 09:15:26 MESZ**. Sites-Quellcommit `50681ac49ca4526015635adc5790884f3cca1dcf`, Deployment `appgdep_6acc88f679848191a5c4537183fb6371`. Der Sites-Pakethelfer konnte mangels Bash unter Windows nicht starten; nach erfolgreichem Quell-Push wurde derselbe Worker-Build mit dem offiziellen `prepare-site-build.cjs` und Windows-tar identisch verpackt. Archiv gespeichert und Deployment erfolgreich.

Live geprüft: Startseite und alle zehn Ortsseiten liefern HTTP 200 mit serverseitig gerenderter Express-Anfrage. Echter mobiler Livevorgang **A-1017** mit drei verschiedenen Dateien (zwei PDFs, ein PNG), jeweils exakt **5.242.880 Bytes**, erfolgreich abgesendet. Alle privaten Downloads bytegenau geprüft, anonymer Daten-/Dateizugriff gesperrt, ein POST bei Doppelklick. Interne Nachricht und Kundenbestätigung laut Resend beide **delivered**. Sämtliche Testvorgänge und Uploads gelöscht; nur die ausdrücklich gekennzeichneten Testmails liegen im eigenen Postfach.
