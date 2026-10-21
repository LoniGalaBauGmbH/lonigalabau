# Ratgeberübersicht – Gestaltung vom 21.10.2026

## Auftrag und Umsetzung

Die Ratgeberübersicht sollte geordneter wirken und einen großen Hero mit einem anderen Bild erhalten.

- Großer Bildeinstieg mit vorhandener Originalaufnahme „Rasengarten mit Plattenterrasse“, gut lesbarer Überschrift, kurzer Einführung und Sprunglink zu allen sechs Ratgebern.
- Für den Hero die vorhandenen WebP-Originalvarianten mit 800/1600 Pixeln statt der auf 960 Pixel begrenzten allgemeinen AVIF-Auswahl verwendet; feste Bildfläche und intrinsische Maße erhalten.
- Empfohlener Ratgeber mit Text links und neuem Bild eines fertigen Hausgartens rechts; mobil Bild oberhalb des Textes. Keine neue Fotografie oder KI-Projektaufnahme angefertigt.
- Ursache des großen Leerraums im bisherigen Layout live im DOM bestätigt: Das `source`-Element des `picture` mit `display: contents` wurde als eigener Grid-Eintrag dargestellt. Ein expliziter Bildcontainer hält Bild und Text jetzt in den vorgesehenen zwei Spalten.
- Einheitliches Bildformat und ruhigere Typografie der Artikelübersicht. Sichtbarer Tastaturfokus auf dunklen Flächen.
- Artikeltexte, URLs, Metadaten, strukturierte Daten, Formularlogik und übrige Seiten erhalten. Keine Datenbankänderung, keine Formulare abgesendet.

## Prüfung

- TypeScript, gezieltes ESLint, Prettier und `git diff --check` erfolgreich.
- Zwei Client-/Server-Produktionsbuilds einschließlich Postbuild erfolgreich, beide Pakete über den offiziellen Sites-Workflow 1.1.0 erstellt.
- Lokale Browserprüfung nicht verfügbar: Der vorher geöffnete lokale Tab zeigte eine Verbindungsfehlerseite mit gesperrtem `data:`-Protokoll. Keine Umgehung; Prüfung anschließend an der öffentlichen HTTPS-Seite.
- V93 live bei 320, 390, 768, 1024 und 1440 Pixeln: kein horizontaler Überlauf, passendes ein-/zwei-/dreispaltiges Artikelraster, Featurebild und Text auf Desktop in derselben Zeile, mobil untereinander. Desktop- und mobile Übersicht visuell geprüft.
- Sprunglink erreicht die Artikelliste mit sechs Einträgen; Feature-Link öffnet den richtigen Artikel. Artikel-DOM bei 390 Pixeln ohne Überlauf, genau eine H1 und korrekte Canonical. Formular nach Hydrierung aktiv; keine Browserfehler im geprüften Protokoll.
- V94 ändert ausschließlich die Hero-Bildauflösung. Finale Sichtprüfung und Bildabruf im Chat dokumentiert; Screenshots nur lokal unter `.tools.local/guide-redesign/`.

## Veröffentlichung

- V93: Layout, erfolgreich am 21.10.2026 um 13:50:39 MESZ; Quellcommit `8406eb26d7fe33afb3648effe032203d86733caf`.
- V94: finale Hero-Auflösung, erfolgreich am 21.10.2026 um 13:54:56 MESZ; Quellcommit `8da062713ac4245876fe5c897e339870673190c2`.
- Finale Version: `appgprj_6aba3b55b36c8191b73435ce2be73fe4~appgver_fec74721f7c08191bbcc3b65f359c88b`.
- Deployment: `appgdep_6ad8a7f91408819193b1f9887d60d5b0`, `succeeded`, öffentliche Audience und Umgebung Revision 4 erhalten.
- Seite: https://www.loni-galabau.de/ratgeber

Der zwischenzeitliche Frankfurt-Recherchecommit wurde vor Beginn übernommen und unverändert erhalten. GitHub-Synchronisierung gemäß Dauerauftrag; abschließender Commit und Inhaltsabgleich im Chatabschluss.
