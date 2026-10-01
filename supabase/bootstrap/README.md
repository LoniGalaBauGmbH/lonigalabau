# Neue Supabase-Datenbank für Loni Galabau

Stand: 28.09.2026. Das neue Cloud-Projekt **LoniGalabau** in der Organisation
**LoniGalabauGmbH** ist eingerichtet: acht Tabellen mit RLS, vier Dateispeicher,
acht Leistungen, ein Projekt, eine Stellenanzeige und drei Website-Einstellungen.
Projekt-ID: `fvctfguvupdcscthrxeb`, Region: `eu-west-1`.
Die alte Datenbank wurde ausschließlich lesend verwendet. Die aktive lokale
`.env` ist nach erfolgreicher Schlüsselprüfung auf das neue Projekt umgestellt.
Die frühere Konfiguration liegt in der ebenfalls ignorierten Datei
`.env.before-new-supabase`. Zwei angeforderte Website-Admin-Konten sind über die
Supabase-Auth-Admin-API angelegt und über `user_roles` zugeordnet; beide Logins
wurden im Browser geprüft. Öffentliche Selbstregistrierung ist deaktiviert,
anonyme Anmeldung und manuelle Identitätsverknüpfung bleiben deaktiviert.

Die zufällig erzeugten Zugangsdaten stehen ausschließlich lokal in
`.env.admin-logins`; Server- und Browser-Konfiguration in `.env` sowie
`.env.supabase-new`. Alle diese Dateien sind von Git ausgeschlossen.
Administrator-Adressen und Zugangsdaten werden nicht hier veröffentlicht.
Passwörter später über einen sicheren Kanal an die jeweiligen Kontoinhaber übergeben.

## Bereits ausgeführte Cloud-Einrichtung

| Migration | Version |
| --- | --- |
| loni_initial_schema | 20260928094323 |
| loni_initial_storage | 20260928094332 |
| loni_restrict_internal_rls_trigger | 20260928094537 |

Der öffentliche Inhaltsimport wurde einmalig mit `04_content.sql` ausgeführt.
Die dritte Migration entzieht Browserrollen den Zugriff auf die von Supabase
vorinstallierte Event-Trigger-Funktion `public.rls_auto_enable()`. Der interne
Trigger bleibt aktiv. Derselbe Schutz ist für weitere neue Projekte in
`01_schema.sql` enthalten.

**Die Bootstrap-Skripte nicht erneut auf dieses bereits eingerichtete Projekt anwenden.**
Die folgende Anleitung dient der Einrichtung eines weiteren, leeren Projekts.

## Einrichtung eines weiteren leeren Projekts

1. Ein **neues, leeres Supabase-Projekt** anlegen. Organisation und Datenbankpasswort
   im Konto wählen; für den Standort bietet sich eine EU-Region an.
2. Im SQL Editor des **neuen Projekts** der Reihe nach ausführen:
   - `01_schema.sql`: acht Tabellen, Inhalts-/SEO-Felder, Beziehungen, Indizes,
     Standard-Einstellungen und Rechte.
   - `02_storage.sql`: zwei öffentliche Bildspeicher und zwei private Dateispeicher.
   - `04_content.sql`: gesicherte Website-Inhalte importieren.
3. In Authentication einen Benutzer für die Website-Verwaltung anlegen.
   Öffentliche Selbstregistrierung deaktivieren. Das Supabase-Dashboard-Konto und
   der Website-Admin sind getrennte Konten.
4. In `03_admin.sql` den Platzhalter durch die E-Mail dieses Auth-Benutzers ersetzen
   und im SQL Editor ausführen. Ein Login allein vergibt keine Adminrechte.
5. Werte aus dem neuen Projekt anhand von `.env.example` lokal und später beim
   Hosting setzen. `SUPABASE_SECRET_KEY` erhält den **Secret Key**; nur die
   Publishable-Werte gehören in `VITE_*`. Keine geheimen Werte in Quellcode oder Chat.
6. Anwendung neu starten bzw. neu bauen. Login, alle Verwaltungsaktionen,
   Kontakt-/Bewerbungsformulare sowie private Downloads gegen das neue Projekt testen.
   Erst anschließend die veröffentlichte Website umstellen.
7. `05_verify.sql` prüft Server-Schreibrechte, Zeitstempel und Browser-Zugriffssperren
   in einer Transaktion. Sämtliche dabei erzeugten Testdaten werden zurückgerollt.

**Für dieses neue Projekt ausschließlich diesen Bootstrap verwenden.** Die alten
Dateien `SETUP_KOMPLETT.sql`, `STORAGE_SETUP_SECURITY.sql` und die bisherigen
Migrationen sind historischer Bestand mit abweichenden Zugriffsregeln.
Kein unkontrolliertes `supabase db push` auf die alte oder die neue Datenbank.
Die ersten beiden Skripte brechen bei vorhandenen Loni-Tabellen bzw. Buckets ab;
der Inhaltsimport bricht bei vorhandenen Website-Inhalten ab. Jedes Skript läuft
in einer Transaktion. Es werden keine bestehenden Tabellen gelöscht.

## Übernahme

`content.snapshot.json` und `04_content.sql` enthalten die am 28.09.2026 mit
öffentlichem Zugriff gelesenen Inhalte:

- 8 aktive Leistungen
- 1 aktives Projekt
- 1 aktive Stellenanzeige
- Tracking-/Cookie-Einstellung

Kundenanfragen, Bewerbungen, Newsletter-Adressen, Auth-Benutzer und Adminrollen
sind **nicht** enthalten. Nicht öffentliche oder inaktive Inhalte lassen sich mit
diesem Export nicht erfassen. Für Bilder/Partner war kein öffentlich lesbarer
Datensatz vorhanden; die lokalen Website-Assets bleiben im Projekt.
Die exportierten Leistungen besitzen keine `hero_image`-URLs und das Projekt hat
keine gespeicherten Bild-URLs. Für diese Datensätze sind daher keine alten
Storage-Dateien zu kopieren. Weitere Dateien im bisherigen Bucket wurden nicht
inventarisiert.

Der Export lässt sich vor der Umstellung mit
`node scripts/export-public-content.mjs PFAD_ZUR_ALTEN_ENV` aktualisieren.
Dabei werden die beiden lokalen Exportdateien ersetzt; keine Datenbank wird geändert.

## Zugriffskonzept

Alle acht Tabellen haben Row Level Security. Öffentliche API-Zugriffe können nur
aktive Leistungen, Projekte, Stellen und ausdrücklich freigegebene Einstellungen
lesen. Angemeldete Benutzer dürfen ihre eigene Rolle lesen, sie aber nicht verändern.
Browserrollen erhalten keine Schreibrechte auf die Anwendungstabellen und keinen
Lesezugriff auf Kunden-/Bewerberdaten.

Die Website nimmt Formulare über validierende Serverfunktionen entgegen.
Verwaltungsfunktionen prüfen davor das Zugriffstoken beim Auth-Server und die
Adminrolle in `user_roles`. Fehler bei diesen Prüfungen verweigern den Zugriff.
Der Serverclient unterstützt `SUPABASE_SECRET_KEY` und als Kompatibilität
`SUPABASE_SERVICE_ROLE_KEY`; öffentliche Schlüssel werden dafür abgewiesen.

| Bucket | Zugriff | Verwendung |
| --- | --- | --- |
| service-images | Öffentlich | Leistungen, Logo, Partner und Website-Bilder |
| project-images | Öffentlich | Veröffentlichte Projektbilder |
| configurator-images | Privat | Kundenfotos/PDF-Anhänge, maximal 10 MB pro Datei; Kontaktformulare begrenzen auf 5 MB |
| cvs | Privat | Lebensläufe, maximal 10 MB pro Datei |

Gäste können über die Serverfunktion nur erlaubte Dateitypen mit passender
Dateisignatur hochladen. Dateinamen erzeugt der Server; vorhandene Dateien werden
nicht überschrieben. Dateisignaturen ersetzen keinen Schadsoftware-Scanner.
Konfiguratorfotos werden als stabile Pfade in `contact_requests.image_paths`
gespeichert. Vorschauen gelten eine Stunde, Admin-Downloadlinks zehn Minuten.
Im Adminbereich lässt sich ein Foto erneut öffnen, um einen neuen Link zu erhalten.
Die Kontaktformulare auf Startseite, im Anfragefenster und auf `/kontakt` erlauben
bis zu drei JPG-, PNG-, WebP- oder PDF-Dateien mit jeweils maximal 5 MB. Die Auswahl
bleibt bis zum Absenden lokal im Browser. Der Server prüft sämtliche Dateisignaturen
vor dem ersten Upload, speichert Originalnamen in privaten Objektmetadaten und
verknüpft die Pfade mit der Anfrage. Bei einem Upload-/Speicherfehler werden nur
die im laufenden Versuch erfolgreich hochgeladenen Dateien wieder entfernt.
PDFs stehen Administratoren als befristete Downloads zur Verfügung.
Die Erweiterung der MIME-Typen im bestehenden privaten Bucket ist unter
`updates/contact_attachments_storage.sql` dokumentiert und wurde am 28.09.2026
im neuen Projekt angewandt; Sichtbarkeit, Rechte und Dateigröße blieben erhalten.
Es gibt keine öffentlichen Storage-Listen und keine direkten Browser-Uploads.

## Prüfung und noch ausstehende Schritte

Lokal geprüft:

- 25 automatisierte Tests für Adminzugriff, Routenschutz und Uploadvalidierung.
- 36 PostgreSQL-Prüfungen mit PGlite 0.5.8: Schema, Inhaltsimport, Rollen,
  Lesesperren, Schreibsperren, Constraints und Schutz vor erneutem Bootstrap.
  Supabase-Auth- und Storage-Systemtabellen wurden dafür minimal nachgebildet.
- TypeScript ohne Fehler; Vite erstellt Client- und Server-Bundles unter Windows.
- Windows-Binärpakete wurden passend zu den bereits installierten Versionen
  ergänzt. Es wurden keine Paketversionen angehoben.

Tests: `node --test tests/*.test.mjs`. Der SQL-Test läuft mit
`node scripts/check-database-schema.mjs PFAD_ZU_PGLITE_DIST_INDEX_JS`, alternativ
mit lokal installiertem `@electric-sql/pglite` ohne Pfadargument.

Im neuen Cloud-Projekt zusätzlich geprüft:

- RLS auf allen acht Tabellen; Browserrollen ohne Schreibrechte und ohne Lesezugriff
  auf Anfragen, Bewerbungen oder Newsletter-Adressen.
- `05_verify.sql`: echte Server-Schreibvorgänge und Trigger sowie Zugriffsprüfungen
  als `anon` und `authenticated`; sämtliche Teständerungen zurückgerollt.
- REST-API mit dem Publishable Key: Inhalte lesbar, vier geschützte Tabellen
  einschließlich `user_roles` mit Berechtigungsfehler gesperrt.
- Secret Key: privilegierter Serverzugriff bestätigt. Auth-API bestätigt
  `disable_signup: true`; die beiden Konten konnten sich anmelden und ihre
  jeweilige Adminrolle lesen.
- Browser: anonymer Aufruf von `/admin` leitet zu `/login`; beide Admin-Konten
  erreichen das Dashboard mit acht Leistungen, einem Projekt und einer Stelle.
  Die Abmeldung führt zurück zum Login.
- Eine synthetische Testbewerbung mit PDF wurde über das öffentliche
  Bewerbungsformular gespeichert und im Adminbereich angezeigt. Der signierte
  PDF-Abruf lieferte die Originaldatei; der öffentliche Abruf wurde verweigert.
  Die Statusänderung im Adminbereich wurde in der Datenbank bestätigt.
  Anschließend wurden ausschließlich der eigene Testdatensatz und seine PDF
  entfernt; Anfragen, Bewerbungen und Dateispeicher sind wieder leer.
- 25 Anwendungstests, TypeScript und Client-/Server-Build nach der Umstellung
  erfolgreich; 84 erzeugte Browserdateien ohne enthaltenen Secret Key geprüft.
- Security Advisor nach Korrektur der internen Trigger-Rechte: keine Warnungen
  oder Fehler. Die drei [Informationshinweise zu Tabellen ohne Browser-Policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)
  sind für die ausschließlich serverseitig verwendeten privaten Tabellen beabsichtigt.
- Performance Advisor: nur [Hinweise auf noch ungenutzte Indizes](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)
  in der frisch eingerichteten Datenbank.

Noch offen sind die vollständige Prüfung aller Website-Abläufe,
Hosting-Konfiguration und Veröffentlichung.
Öffentliche Formulare/Uploads
benötigen vor dem produktiven Start zusätzlich einen abgestimmten Spam-/Bot-Schutz
und Betriebsregeln für ungenutzte Uploads, Aufbewahrung und Backups.
Die weiteren Punkte aus der Projektanalyse, etwa Tracking-Widerruf und lokale
CRM-Notizen, sind durch diesen Datenbankwechsel noch nicht erledigt.

Grundlagen: [Supabase API-Schlüssel](https://supabase.com/docs/guides/getting-started/api-keys),
[Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security),
[öffentliche und private Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals).

## Kurze Vorgangsnummern (30.09.2026)

`updates/short_submission_tickets.sql` wurde als Cloud-Migration
`20260930102447_short_submission_tickets` im neuen Projekt ausgeführt.
Anfragen und Bewerbungen erhalten jeweils eine eindeutige, dauerhaft gespeicherte
Identitätsnummer ab 1000. Der Server setzt für neue Vorgänge `ticket_format_version: 2`;
Mail und Adminbereich zeigen damit beispielsweise `A-1042` beziehungsweise `B-1042`.
Die Sequenzen niemals zurücksetzen. UUIDs bleiben interne IDs.

Bestehende Datensätze und Inserts älterer Worker behalten Formatversion 1. Dadurch
bleiben wiederholte Versandversuche und gespeicherte Bestätigungspayloads identisch.
Die Admin-Suche unterstützt auch die bisherigen Base32-/LG-Referenzen und UUIDs.
RLS und private Tabellen-/Sequenzrechte bleiben erhalten.

Prüfung: `node scripts/check-submission-tickets.mjs PFAD_ZU_PGLITE_DIST_INDEX_JS`
prüft Altbestand, Eindeutigkeit, alte/neue Worker, Nummern nach Löschung, Constraints
und Sequenzrechte. Zusätzlich wurden echte Inserts als `service_role` in einer
zurückgerollten Cloud-Transaktion geprüft; keine E-Mails wurden dabei versandt.

## Rückrufanfragen (01.10.2026)

`updates/callback_requests.sql` wurde als `20261001074449_callback_requests`
im Projekt `fvctfguvupdcscthrxeb` angewandt. `contact_requests.email` darf für
Rückrufwünsche NULL sein; ein zusätzlicher CHECK verlangt dann eine Telefonnummer.
RLS und Grants bleiben unverändert. Bestehende Kontakt-/Bewerbungsformulare
verlangen weiterhin eine E-Mail-Adresse.

Der eigene Server-Endpunkt prüft Namen, Telefonnummer, optionale E-Mail,
Werktag (Mo–Fr), halbstündige Uhrzeiten 07:00–17:30 und mindestens eine Stunde
Vorlauf in Europe/Berlin. Anfragen landen im vorhandenen Adminbereich und in der
internen Benachrichtigung. Ohne E-Mail wird keine Kundenbestätigung eingereiht;
mit E-Mail nutzt sie den bestehenden Versand mit kurzer Ticketnummer.
Wunschzeiten sind ausdrücklich keine bestätigten Termine.

Prüfungen: isolierte Migration mit bestehendem Datensatz, NULL-/Telefon-CHECKs,
zurückgerollter echter Service-Role-Insert sowie automatisierte Tests für
Validierung, Speicherung, Mailweitergabe und Quoten. Keine Testmail versandt.
