# Vereinbarte Gestaltungsrichtung

Am 28.09.2026 hat der Nutzer die umfassende Umgestaltung aus Commit `b64e55c`
abgelehnt. Die ursprüngliche Website aus `1ef936b` ist die gewünschte Grundlage.
Ihre veröffentlichte Version 1 wurde zuerst wiederhergestellt.

Der anschließende Auftrag erlaubt gezielte Detailkorrekturen: weniger dekorative
Konturen, gestrichelte Raster und wiederkehrende Schmuckklammern. Aufbau, Bilder,
Farben, Schrift und Inhalte bleiben erhalten. Keine erneute grundlegende
Umgestaltung aus einer allgemeinen Bitte um „weniger KI-typisch“ ableiten.

Die erste kleine Korrektur betrifft `index.tsx`, `StatsBand`, `Awards`, `Testimonials`
und die dekorativen Label-Pseudoelemente in `styles.css`. Formularrahmen,
Fokusmarkierungen und funktionale Bedienelemente bleiben erhalten.
Die Kundenstimmen bekommen eine explizite einspaltige Mobilansicht, damit lange
Orts-/Leistungsangaben die Seite nicht seitlich verbreitern.

Auf ausdrücklichen Folgeauftrag werden dieselben Details auch auf den öffentlichen
Unterseiten angepasst: Über uns, Leistungsübersicht und alle Leistungsdetails,
Projekte, Kontakt, Stellenübersicht und Stellenangebote sowie die rechtlichen
Seiten. Beim Gartenplaner und Login entfällt nur ein zusätzlicher Außenrahmen.
Entfernt werden dekorative Textlinien, doppelte Bildrahmen und redundante
Kartenkonturen. Die gemeinsame Anfrageansicht und die Kontaktüberschrift im
Footer folgen derselben Gestaltung. Zeitachsen, Eingabefelder, Auswahlzustände,
Fokusmarkierungen und funktionale Trennlinien bleiben erhalten.
Die Datenschutz- und Stellenüberschriften erhalten Umbruchmöglichkeiten und der Datei-Upload bei
Bewerbungen eine begrenzte Breite, damit beide Seiten auf dem Handy nicht
horizontal überlaufen.

Die bereits bestätigten Firmenangaben werden in der ursprünglichen Gestaltung
beibehalten: Auf der Roos 3, Montag–Freitag 7–18 Uhr ohne Samstagseintrag,
HRB 125735 sowie SVLFG. Dafür sind einzelne Textkorrekturen auf Kontakt,
Impressum und im Metadatensatz der Startseite erforderlich.

Grundlage: [Nielsen Norman Group – Common Region](https://www.nngroup.com/articles/common-region/)
und [Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/).
Rahmen sind kein Nachweis für KI-Erstellung; hier geht es um den subjektiven
Eindruck wiederkehrender Dekoration und um visuelle Unruhe.

## Technischer Stand nach der Rücknahme

Auch der Anwendungscode wurde auf den Stand vor der großen Überarbeitung
zurückgeführt. Die zusätzlich angelegten Datenbankspalten und die private
Quotentabelle bleiben ohne Datenverlust bestehen; der zurückgesetzte Code nutzt
sie noch nicht. Ihre Migrationsdateien bleiben als Historie erhalten.
Die acht Leistungstexte wurden bedingt auf die vorigen Werte zurückgesetzt;
`supabase/bootstrap/restore_service_copy.sql` überschreibt nur unveränderte Texte
aus der abgelehnten Überarbeitung.

E-Mail-Bot, Resend-Versand im Hosting, gemeinsame Admin-Notizen und die weiteren
technischen Verbesserungen bleiben gesonderte To-dos. Die vorbereitete Bot-
Wissensbasis liegt weiterhin unter `email-assistant/`; kein Bot ist aktiv.
