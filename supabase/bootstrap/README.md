# Neue Supabase-Datenbank für Loni Galabau

Stand: 28.09.2026. Lokal vorbereitet; noch kein neues Cloud-Projekt angelegt oder
verbunden. Die vorhandene Datenbank wurde nur lesend abgefragt. Die lokale
`.env` verweist bis zum Anschluss weiterhin auf das bisherige Projekt.

## Einrichtung nach Verbindung des neuen Kontos

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
| configurator-images | Privat | Kundenfotos, maximal 10 MB pro Datei |
| cvs | Privat | Lebensläufe, maximal 10 MB pro Datei |

Gäste können über die Serverfunktion nur erlaubte Dateitypen mit passender
Dateisignatur hochladen. Dateinamen erzeugt der Server; vorhandene Dateien werden
nicht überschrieben. Dateisignaturen ersetzen keinen Schadsoftware-Scanner.
Konfiguratorfotos werden als stabile Pfade in `contact_requests.image_paths`
gespeichert. Vorschauen gelten eine Stunde, Admin-Downloadlinks zehn Minuten.
Im Adminbereich lässt sich ein Foto erneut öffnen, um einen neuen Link zu erhalten.
Es gibt keine öffentlichen Storage-Listen und keine direkten Browser-Uploads.

## Prüfung und noch ausstehende Schritte

Lokal geprüft:

- 25 automatisierte Tests für Adminzugriff, Routenschutz und Uploadvalidierung.
- 33 PostgreSQL-Prüfungen mit PGlite 0.5.8: Schema, Inhaltsimport, Rollen,
  Lesesperren, Schreibsperren, Constraints und Schutz vor erneutem Bootstrap.
  Supabase-Auth- und Storage-Systemtabellen wurden dafür minimal nachgebildet.
- TypeScript ohne Fehler; Vite erstellt Client- und Server-Bundles unter Windows.
- Windows-Binärpakete wurden passend zu den bereits installierten Versionen
  ergänzt. Es wurden keine Paketversionen angehoben.

Tests: `node --test tests/*.test.mjs`. Der SQL-Test läuft mit
`node scripts/check-database-schema.mjs PFAD_ZU_PGLITE_DIST_INDEX_JS`, alternativ
mit lokal installiertem `@electric-sql/pglite` ohne Pfadargument.

Noch offen sind die Cloud-Einrichtung, echte Anmeldung, Schreib-/Uploadtests,
Hosting-Konfiguration und Veröffentlichung. Öffentliche Formulare/Uploads
benötigen vor dem produktiven Start zusätzlich einen abgestimmten Spam-/Bot-Schutz
und Betriebsregeln für ungenutzte Uploads, Aufbewahrung und Backups.
Die weiteren Punkte aus der Projektanalyse, etwa Tracking-Widerruf und lokale
CRM-Notizen, sind durch diesen Datenbankwechsel noch nicht erledigt.

Grundlagen: [Supabase API-Schlüssel](https://supabase.com/docs/guides/getting-started/api-keys),
[Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security),
[öffentliche und private Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals).
