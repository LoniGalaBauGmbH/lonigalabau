# Anfragequalität und freiwillige Herkunft

Stand: 12.10.2026. In Website-Version 68 seit 11:02:12 MESZ veröffentlicht;
die additive Datenbankänderung ist als Cloud-Migration
`20261012084431 contact_lead_qualification` angewandt und bestätigt. Hier wird kein
aktueller Kundenbestand, keine erreichte Anfragezahl und kein SEO-Erfolg behauptet.

## Verhalten

Kundenanfragen können im geschützten Adminbereich unabhängig von Neu/Bearbeitet/
Archiviert als ungeprüft, passend, nicht passend, Spam, doppelt oder Test bewertet
werden. „Passend“ setzt eine persönliche Prüfung eines echten, erreichbaren
Kundenprojekts für die angebotenen Leistungen voraus. Wiederholte Anfragen zum
selben Vorhaben sind als doppelt auszusondern; es gibt keine automatische oder
KI-basierte Qualifizierung. Historische Kontakte bleiben ungeprüft.

Eine eigene Versionsnummer verhindert, dass zwei Admins neuere Bewertungen
ungeprüft überschreiben. Notizen, ihr bestehender Versionsschutz und der
Bearbeitungsstatus bleiben getrennt. Qualitätsänderungen erfordern den vorhandenen
Admin-/MFA-Schutz; die öffentliche Formularvalidierung akzeptiert keine Qualität.

Das Dashboard zeigt Eingänge, passend geprüfte, ungeprüfte und ausgeschlossene
Kontakte für heute und 30 Kalendertage einschließlich heute in Europe/Berlin.
Der ursprüngliche Eingangstag bestimmt den Zeitraum, nicht das Bewertungsdatum.
Stellen- und Partnerbewerbungen haben eigene Tabellen und werden nicht addiert.
Die neuen Statistikabfragen laden ausschließlich exakte HEAD-Counts, keine
Kontaktzeilen. Acht feste Counts bilden beide Zeiträume; Summen und Teilmengen
werden geprüft. Bei widersprüchlichen Zahlen erfolgt ein vollständiger Retry,
danach eine sichtbare Fehlermeldung. Es gibt keinen gemeinsamen Datenbank-Snapshot
für die acht Abfragen und keine Nullersatzwerte bei Fehlern.

Das Ziel 30 passend geprüfte Anfragen in 30 Tagen ist eine Summe; es belegt nicht
mindestens einen Eingang an jedem einzelnen Tag. Telefonanrufe außerhalb der
Formulare sind darin nicht enthalten.

## Freiwillige Selbstauskunft

Die fünf aktiven Kundenformularwege (Express, Kontaktseite, Projektanfrage,
Leistungs-/Ratgeber-Miniformular, Gartenplaner) enthalten eine kurze optionale
Auswahl „Wie wurden Sie auf uns aufmerksam?“. Ohne Auswahl wird keine Herkunft
unterstellt. Google-Suche, Google Maps, persönliche Empfehlung, soziale Medien,
bereits Kunde und anderer Weg sind feste servervalidierte Werte.

Die Selbstauskunft wird getrennt von Nachricht und Qualität gespeichert und nur
im geschützten CRM angezeigt. Sie unterscheidet beispielsweise keine Google-Anzeige
von einem unbezahlten Suchtreffer. Es werden keine Referrer, UTM-Parameter,
Suchbegriffe, Browserkennungen oder zusätzlichen Cookies erhoben. GA4/GTM bleiben
inaktiv. Der Gartenplaner speichert diese Antwort nicht in seinem lokalen Entwurf.
Der vorhandene Rückruf-Serverweg unterstützt die optionale Angabe ebenfalls, ohne
zusätzliche öffentliche Oberfläche.

## Integration

`supabase/bootstrap/updates/contact_lead_qualification.sql` ist ein additiver
Bootstrap-Update. Die Integration bestätigte die Anwendung auf dem aktiven Projekt
als Cloud-Migration `20261012084431 contact_lead_qualification`. Vier Spalten und
zwei Indizes wurden rückgeprüft, RLS bleibt aktiv, Browserrollen besitzen weiterhin
keine Tabellenrechte. Kein erneutes Anwenden; keine neuen Tabellen, RPCs, Rechte,
RLS-Policies oder Speicherregeln. Der passende Worker ist in Version 68 veröffentlicht.

Security Advisor: nur bekannte Informationshinweise zu serverseitigen Tabellen
und die bestehende Warnung zum deaktivierten Schutz vor kompromittierten
Passwörtern. Performance Advisor ohne neue relevante Warnung; die neuen Indizes
sind anfangs noch unbenutzt. Diese Befunde ersetzen keine Live-Oberflächenprüfung.

Die allgemeinen Datenschutzinformationen wurden um die freiwillige Selbstauskunft
und interne Einordnung ergänzt und sachlich gegen die technische Umsetzung geprüft.
Browserprüfung, Produktionsbuild und Live-Verifikation sind abgeschlossen, mit
den unten beschriebenen Grenzen. Keine Kundendaten oder Zugangsdaten gehören
in Prüfdokumente oder Git.

## Lokale Prüfung

- Fokusprüfungen für optionale Quelle, unerlaubte öffentliche Qualitätsfelder,
  eigene CAS-Version, Konflikte, sichere Fehler, Rücksetzen auf ungeprüft,
  acht HEAD-Counts, echtes Nullergebnis, Plausibilitäts-Retry und Fehleranzeige.
- Berliner Tagesgrenzen einschließlich Sommer-/Winterzeit und Jahreswechsel.
- Vorhandene Kontakt-/Express-/Projekt-/Planer-/Rückruf-/Uploadprüfungen und
  Auth-/Rollen-/MFA-Abweisung der neuen geschützten Funktionen.
- SQL-Prüfung mit vorhandenem PGlite: Defaults für Altbestand, zulässige Quellen,
  Constraints, CAS, unveränderte Status-/Notizwerte, RLS, Browserrechte und Indizes.
- 83 relevante Anwendungstests, TypeScript und gezieltes ESLint bestanden. Kein Build, Git- oder Deploymentlauf
  durch diesen Teilauftrag; keine produktiven Kontaktzeilen abgefragt.

## Integrations- und Live-Prüfung

- Gesamte integrierte Anwendung: 231 Tests, TypeScript, gezieltes ESLint und
  Produktionsbuild erfolgreich. Veröffentlichung V68, Quellcommit
  `913ffb70939184886068c2232569873b41913b21`.
- Neun lokale Browserabläufe über alle fünf öffentlichen Formularwege bei
  320/390/1440 Pixeln: freiwillige Auswahl, Eingaben und Rücknavigation geprüft;
  Herkunft/Kontaktdaten/Freitext landen nicht im lokalen Gartenplanerentwurf.
  Native Projekt-Radiofelder reagieren auf sichtbare Karten sowie Tastatur.
- 42 Live-Seitenansichten ohne Darstellungs-/JavaScript-/Assetfehler. Neuer
  anonymer Statistikabruf 403 mit noindex/no-store, keine Kontaktdaten ausgegeben.
- Acht echte Backend-HEAD-Counts erfolgreich; keine produktiven Kontaktzeilen
  geladen. Zurückgerollte Live-Datenbanktransaktion: alle 14 Prüfaussagen zu
  Defaults, Quelle, CAS, Constraints, RLS und Rechten erfolgreich, keine Testmail.
- Die angemeldete Live-Adminoberfläche konnte mangels authentifizierter
  Browserfläche nicht erneut bedient werden. Es wurde auch keine neue
  Kundenanfrage mit Mailversand ausgelöst; der bestehende vollständige
  Upload-/Versandbeleg von V66 wird dadurch nicht ersetzt.

Veröffentlichungs- und Gesamtprüfbericht: [SEO-Umsetzung](SEO-Umsetzung-2026-10-12.md).

Die Schrittbuttons der Projektanfrage beziehen ihren zugänglichen Namen jetzt
vollständig aus dem sichtbaren Text einschließlich Schrittnummer. Das bisherige
verkürzende `aria-label` wurde entfernt. Die Gartenplaner-Schrittbuttons besaßen
bereits keine solche Überschreibung.

Primärdokumentation am 12.10.2026 erneut geprüft:
[Supabase Changelog](https://supabase.com/changelog.md),
[exakter Count ohne Zeilen](https://supabase.com/docs/reference/javascript/select),
[Update mit Filtern](https://supabase.com/docs/reference/javascript/update).
