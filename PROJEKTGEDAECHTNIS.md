# Projektgedächtnis – Loni GalaBau

Stand: **01.10.2026**. Versioniertes Projektgedächtnis für die Website und ihre SEO-Werkzeuge.
Dieses Dokument trennt belegte Ergebnisse von laufenden Aufgaben. Es enthält keine Zugangsdaten.
Vor jeder Fortsetzung lesen; nach wesentlichen Änderungen belegte Ergebnisse und offene Punkte aktualisieren.

## Zweck und aktueller Auftrag

- Unternehmenswebsite für Garten- und Landschaftsbau: Leistungen erklären, eigene Arbeiten zeigen und passende Anfragen/Bewerbungen ermöglichen.
- **Verbindliche Nutzerkorrektur vom 01.10.2026:** Loni GalaBau arbeitet **deutschlandweit**. Firmensitz ist **Hattersheim am Main bei Frankfurt**. Standortangaben sind keine Begrenzung des Einsatzgebiets. Die frühere Rhein-Main-Ausrichtung der SEO-Texte war falsch; nicht erneut übernehmen. Echte Projektorte, Firmenadresse, Registergericht und Arbeitsplatzstandorte bleiben sachliche Ortsangaben.
- Nutzerwunsch: vollständige SEO-Bearbeitung aller öffentlichen Seiten, Anmeldung zur Google-Indexierung und dauerhaftes Projektgedächtnis.
- **Erledigt:** Google-OAuth-App „Loni OpenSEO“ steht nach ausdrücklicher Nutzerfreigabe auf **In production**. Die separate Google-App-Verifizierung ist damit nicht erteilt.
- **Live in Version 36:** Ratgeber mit sechs Beiträgen, Übersichtsseite, eigenen Bildern, Kontaktformularen und Autorenprofil Serhad Marasli. Gesamten öffentlichen Seitenbestand live geprüft.
- **Live in Version 41:** gegenüber Version 40 ausschließlich den Fontpreload entfernt, `font-display: optional` beibehalten. Zwei zeitlich getrennte mobile PSI-Läufe am 30.09.2026 um 18:07:30 und 18:09:05 MESZ: **91 und 100 Punkte, FCP 1,111–2,401 s, LCP 1,146–3,001 s, TBT 5 bzw. 30 ms, CLS jeweils 0**. Verbesserung live belegt, keine Garantie stabiler 100 Punkte. Version 40 lag zuvor bei **81–99 Punkten, LCP 2,101–3,976 s**, TBT/CLS 0. Die zwei identischen 99-Berichte sind möglicherweise wiederverwendete Ergebnisse, keine gesichert unabhängigen Läufe. Keine CrUX-Felddaten. Sämtliche Messungen in `docs/Mobile-Performance-2026-09-30.md`.
- **Unterseiten optimiert und live in Version 45:** 274 passende AVIF/WebP-Varianten für 46 Fotos, vier kleine Portraitvarianten, abgeschlossene Projektabfragen vor Cache-Übertragung, kleinerer Ratgeberindex und bessere Kontraste. Alle 41 öffentlichen Seiten sowie Cache und Deutschland-Schema aller acht Leistungen live geprüft. 92 Tests bestanden. Jüngste mobile Stichprobe: Gartengestaltung 100, Projektgalerie 100, Gartenplaner 100, Kontakt 98, Ratgeber 97, Über uns 95; Bf./BP/SEO jeweils 100. V43 erreichte Pflasterarbeiten 100 und Projektübersicht 95; vollständige vorherige Schwankungen einschließlich Kontakt 88 sind im Bericht erhalten. Keine stabilen 100 Punkte zugesichert.
- Dieses Gedächtnis liegt im Repository und wird über `AGENTS.md` bei späteren Arbeiten eingebunden.
- **Ratgeber vertieft, final live in Version 48 (01.10., 11:19 MESZ):** alle sechs Beiträge um konkrete Vergleiche, Kurzüberblicke und belegte Projektgalerie-Verweise ergänzt. Autorenrolle vom Nutzer bestätigt: **Serhad Marasli, Bau- & Operations Manager**. Nutzerkorrektur: **Name nur dezent nennen, Loni GalaBau gestalterisch in den Vordergrund stellen**; die Autorenansicht hat die Überschrift „Über unsere Ratgeber“ statt einer großen Namensüberschrift. 101 Tests, Typprüfung, gezieltes Linting und Build bestanden; finaler Live-Audit um 11:20 MESZ: acht Ratgeber-Seiten, 15 weitere interne Ziele und 42 Bildantworten ohne Befund. Details in `docs/Ratgeber-SEO-2026-10-01.md`.
- **WebP-Korrektur in Version 48:** Die in Ratgebern und `ProjectImage` verwendeten öffentlichen WebP-Bilder laufen produktiv über eine geprüfte Asset-Route mit korrektem `image/webp`, ETag/304 und einem Tag Cache. AVIF bleibt direkt statisch. Alte statische WebP-URLs behalten gegebenenfalls den falschen Provider-MIME-Typ; keine pauschale Behebung aller Hostingheader behaupten.
- **Indexierung am 01.10.2026:** letzter URL-Prüfstand: ein Ratgeber indexiert, fünf nicht indexiert. Neuer Antrag für Naturstein nach der Inhaltsveröffentlichung gegen 11:08 MESZ von Google wegen Tageskontingent abgelehnt; danach keine weiteren Versuche. Kein neuer Antrag angenommen, keine vollständige Indexierung behaupten.

## Adressen, Projekte und Ablagen

| Bereich | Belegter Wert |
| --- | --- |
| Öffentliche Hauptdomain | `https://www.loni-galabau.de` |
| Apex-Domain | `loni-galabau.de`; soll auf die www-Hauptdomain führen |
| Sites-Projektadresse | `https://loni-galabau.serhad1999.chatgpt.site` |
| GitHub | `https://github.com/LoniGalaBauGmbH/lonigalabau`, Standardzweig `main` |
| Sites-Projekt-ID | `appgprj_6aba3b55b36c8191b73435ce2be73fe4` |
| Supabase | Projekt `LoniGalabau`, Referenz `fvctfguvupdcscthrxeb`, Region `eu-west-1` |
| Search-Console-Domain-Property | `sc-domain:loni-galabau.de` |
| OpenSEO-GSC-Verbindung | Erfolgreiche Antworten für Property `https://www.loni-galabau.de/` belegt |
| Lokales OpenSEO | `http://127.0.0.1:3001/projects`; MCP unter `/mcp` |
| OpenSEO-Projekt | `d2065474-40c3-4bde-a87c-7ff129ddaecd`, Name `Loni GalaBau` |
| OpenSEO-Markt | Deutschland `2276`, Sprache `de` |
| Website-Arbeitscheckout | Aktuelles, dem Sites-Projekt zugeordnetes Quellcheckout |
| Originale SEO-Anwendung | Separate lokale Installation aus dem bereitgestellten ZIP |
| Private Nachweise | Privater, unversionierter Aufgabenordner außerhalb des Website-Repositorys |

Mehrere Website-Kopien existieren; vor Änderungen Arbeitscheckout und Git-Stand eindeutig bestimmen.
Sites-IDs, Supabase-Projektreferenz und OpenSEO-Projekt-ID sind Zuordnungen, keine Zugangsschlüssel.

## Veröffentlichungsstand

- **Aktueller öffentlicher Seitenstand: Version 53**, am 01.10.2026 um 12:44 MESZ erfolgreich veröffentlicht. Die Erdarbeiten-Karte auf Startseite und Leistungsübersicht verwendet das vom Nutzer bereitgestellte Volvo-Baggerfoto; sechs responsive AVIF/WebP-Varianten in 320/640/941 px und motivbezogener Alt-Text. Detail-Hero, Menübild und Projektgalerien bleiben unverändert. Mobile Gartenideen scrollen nach Plus- oder Themenauswahl zum Detailbild, auch bei erneutem Tippen auf dieselbe Auswahl; unter 1024 px, mit Berücksichtigung reduzierter Bewegung und bestehendem Kopfzeilenabstand. Kein automatischer Scroll beim Laden. Mobile Chromium-Vorschau bei 390 px einschließlich Wiederholung und Bilddarstellung geprüft; Typprüfung, gezieltes ESLint, 12 relevante Inhalts-/Schutztests und Produktionsbuild erfolgreich. Sämtliche parallel veröffentlichten Änderungen aus Version 52 erhalten. Quellcommit `b3291da1deb0fcebb2098b6faf32d26410841d73`, Deployment `appgdep_6abe3959f36c81918089c0748d6641be`. Nachträgliche Dokumentation ändert den veröffentlichten Programmcode nicht.
- **Aktueller Sites-Stand: Version 52**, am 01.10.2026 um 11:56 MESZ veröffentlicht. KI-Assistent und Wissensbank mit zusätzlichem `no-store`/`noindex` auch für erfolgreiche GET-Aufrufe unter `/_serverFn/`. Quellcommit `2fb8a096f6335733c638c9d133940fb1b20d1b1e`, Deployment `appgdep_6abe2e2b145c8191bca2a72db177035e`. Live geprüft: Startseite HTTP 200; beide Adminrouten und Login ohne Cache/Indexierung; Assistentenstatus und Vorgangsliste liefern ohne Anmeldung ausschließlich den Anmeldefehler mit diesen Schutzheadern. Browser leitet zum Login. 152 Anwendungstests, Typprüfung, gezieltes ESLint und Produktionsbuild erfolgreich. Keine Geheimnisse oder Fixture-Zugangsdaten im Build gefunden. Nachträgliche Dokumentation ändert den veröffentlichten Programmcode nicht.
- KI-Assistent und private Wissensbank erstmals als **Version 51** am 01.10.2026 um 11:52 MESZ veröffentlicht. Quellcommit `5fcad977b93af07e71393396f6b28aac5477b9c7`, Deployment `appgdep_6abe2d3b05e0819194d5c7ec0feb9766`. Ein zusätzlicher Cache-Schutz für den tatsächlichen Serverfunktionspfad wird im anschließenden Sicherheitsupdate ergänzt.

- Version 50, veröffentlicht am 01.10.2026 um 11:36 MESZ. Mobiles Wunschdatum im Rückrufformular auf die verfügbare Feldbreite begrenzt und Datumsanzeige zentriert. CSS berücksichtigt die native WebKit-Datumsdarstellung; Kalenderauswahl und Formularlogik bleiben erhalten. Chromium-Vorschau bei 320 und 390 px sowie Produktionsbuild erfolgreich; kein echter Safari-Gerätetest. Quellcommit `f048bdf0dac18e4fce3f34d542ce770155e5ba67`, Deployment `appgdep_6abe29894e808191b12ceba5450bc8d6`. Änderungen aus Version 49 erhalten. Nachträgliche Dokumentation ändert den veröffentlichten Programmcode nicht.
- Version 49, veröffentlicht am 01.10.2026 um 11:32 MESZ. Startseitenangabe „8 Leistungen / Für Gärten und Außenanlagen“ durch „Vielseitig / Individuelle Lösungen für Ihr Vorhaben“ ersetzt; drei Übersichtslinks offener formuliert. Nutzer möchte die acht Bereiche nicht als abschließendes Gesamtangebot darstellen. Typprüfung, gezieltes ESLint, Produktionsbuild und visuelle Vorschau erfolgreich; reine Textkorrektur ohne Funktionsänderung. Quellcommit `f9355dcd0978a12246f4b5df2a9ccaf93a33c5ea`, Deployment `appgdep_6abe28a9e71c8191bf499a60267e61ba`. Ratgeber-/Bildverbesserungen aus Version 48 und Rückrufformular aus Version 46 erhalten. Nachträgliche Dokumentation ändert den veröffentlichten Programmcode nicht.
- Version 48, veröffentlicht am 01.10.2026 um 11:19 MESZ. Erweiterte Ratgeber, dezente Autorenangabe und korrigierte WebP-Auslieferung; Quellcommit `fe0101a9efd5d48af80cc08a0d846941c79aa23c`, Deployment `appgdep_6abe2589fa048191bdb7dcd1ffbfca7a`. Rückrufformular aus Version 46 erhalten.
- Version 45, veröffentlicht am 01.10.2026 um 10:06:50 MESZ. Quellcommit `08e12ac0b44aa37356891bf3ac8c48472fc0fcd8`, Deployment `appgdep_6abe1484300481918ead8bb330d18175`. Version 43 war der erste Optimierungs-/Deutschlandweit-Release; 42 und 44 wurden nur gespeichert. Spätere Dokumentationscommits ändern den Live-Programmcode nicht.
- Die Ausgangsmessung vom Morgen des 01.10.2026 betraf noch Version 41. Die daraus abgeleiteten Änderungen wurden anschließend mit Versionen 43 und 45 veröffentlicht; Verlauf und alle Messergebnisse in `docs/Unterseiten-Performance-2026-10-01.md`.
- Version 41: Quellcommit `e123304bc561f77e8becdf48a2925f6f844fe74b`, Deployment `appgdep_6abd339c4fd08191970a3703da19e5fe`. Einziger Programmcode-Unterschied gegenüber Version 40: Fontpreload entfernt; keine Cacheänderung. Nachträgliche Messdokumentation ändert den Live-Programmcode nicht.
- Version 40: Quellcommit `ba280c07df3a4c8c2439cb47c9a94b716d2cb9f0`, Deployment `appgdep_6abd30b377e88191a0809bb4e1ffc0bf`. Nachträgliche Messdokumentation ändert den Live-Programmcode nicht.
- Version 38: Quellcommit `038622931f4787576e7edd2c5df9bf62f587e601`, Deployment `appgdep_6abd27f27a04819192c01eae20c4fd9b`. Nachträgliche Messdokumentation ändert den Live-Programmcode nicht.
- Version 36: Quellcommit `d022c938ddba74603b9cbd9d5ed86a01fa0cfc6f`, Deployment `appgdep_6abd2034bbac819192b9c33934f276bd`. Nachträgliche Dokumentationskorrekturen ändern den Live-Programmcode nicht.
- Beim Öffnen des Performance-Arbeitsstands: Commit `326fb4ae0a48fb63ad01761bd3bbd0b7da985aa1`. Vor weiterer Veröffentlichung erneut prüfen.
- Der umfassende SEO-Release wurde bereits mit **Version 33** am 30.09.2026 um 12:11 Uhr MESZ veröffentlicht; GitHub-SEO-Commit `1d55a6dfcaeeed4cc627b3bedd1ee908bc0eb843`.
- Version 35: Quellcommit `96188f55a1d40b6e361b599855e44c1daf5232a0`, Deployment `appgdep_6abd1beeb76081919c5a532a71d68480`. 37 öffentliche Sitemap-Seiten live geprüft.
- Veröffentlichungsbelege liegen im privaten Aufgabenordner; eine erfolgreiche GitHub-Synchronisierung allein ist kein Deployment.
- Ältere Aussagen in `README.md`/`project_state.md`, wonach Hosting oder Domainwechsel noch ausstehen, sind teilweise überholt.

## Architektur und wichtige Zuständigkeiten

- **KI-Assistent im Admin veröffentlicht (01.10.2026, final Version 52):** `/admin/assistent` und `/admin/wissensbank`; gemeinsame private Supabase-Daten statt lokalem SQLite. Vorgänge verknüpfen Website-Anfragen oder erfassen manuelle Nachrichten. Verlauf, Notizen, Entwurf, Besichtigungsvorschlag, Quellenrevisionen, Textimport, Freigabe, Export, Prüfdatum und Löschung. Pflicht-MFA für jeden neuen Serveraufruf. Alle tatsächlich abgerufenen Wissensquellen und der bestätigte Kundenkontext werden auf Änderungen geprüft; manuelle Entwürfe geschützt.
- Cloud-Migration `assistant_private_workspace` angewandt; RLS/Grants und zurückgerollte service_role-Probe bestätigt. 22 lokale PostgreSQL-Prüfgruppen und 152 Anwendungstests sowie Typprüfung bestanden. KI-Anbieter/Outlook/OneDrive/Firmenserver bewusst noch nicht verbunden. Keine echten Kundendaten an die KI gesendet. Offene Datenschutzorganisation und bestehende Warnung für deaktivierten Leaked-Password-Schutz: `docs/KI-Assistent-Betrieb.md`. Keine pauschale DSGVO-Zertifizierung behaupten.
- Neun Startdokumente aus acht Leistungsseiten und Unternehmensgrundlagen wurden als **nicht freigegebene Entwürfe** in die private Wissensbank übernommen. Isolierte Browserprüfung mit ausschließlich synthetischen Daten: echte UI/Serverfunktionen gegen Loopback-Auth/REST-Fixture, Entwurf gespeichert und erneut geladen, freigegebene Wissenssuche, Quelleneditor, Freigabeentzug bei Änderung, Router-Rückfrage zum Erhalt ungespeicherter Texte, Mobilansicht 390 px ohne horizontalen Überlauf. Dies prüft Darstellung/Integration; produktive MFA-Anmeldung wurde nicht mit Benutzerzugängen getestet. Separate Modul- und echte PostgreSQL-Rechteprüfungen ergänzen den Test.

- **Rückrufbereich live in Version 46 (01.10.2026):** kompakter Dreischritt Name → Kontakt → Wunschzeit direkt nach „Schön geplant. Bis in den Unterbau.“ auf der Startseite; Hero-Bild unverändert, Hero-CTA führt zu `/#rueckruf`. Vor-/Nachname, Telefon, optionale E-Mail, Wunschtag/-zeit und Datenschutzbestätigung. Sanfte Übergänge, Zurück mit Werterhalt, reduzierte Bewegung und mobile Feldanordnung.
- Backend für Rückrufwünsche verwendet `contact_requests` und bestehende private Admin-/Mailwege. Cloud-Migration `20261001074449_callback_requests` ausgeführt; E-Mail darf bei vorhandener Telefonnummer NULL sein. Kein Kundenmailversuch ohne E-Mail. Mit E-Mail bestehende gebrandete Bestätigung und kurze Ticketnummer. Mo–Fr 07:00–17:30, mindestens 60 Minuten Vorlauf in Europe/Berlin; ausdrücklich keine Terminbuchung. Browserablauf inkl. Zurück/Datumswerterhalt sowie Darstellung bei 320/390/1366 px geprüft. Gesamtsuite vor Multistep 95/95 bestanden; nach Multistep 19/19 betroffene Tests, Typprüfung und gezieltes ESLint erfolgreich. Isolierte und zurückgerollte Cloud-DB-Prüfung erfolgreich, keine echten Testmails versandt. Nach Zusammenführung des neueren Performance-Stands bestanden erneut die komplette Testsuite, TypeScript und Produktionsbuild. Veröffentlicht am 01.10.2026 um 10:31 MESZ als Version 46, Quellcommit `26fa51ade5020a8dc94a4dea0cb94eafe6eeb0af`, Deployment `appgdep_6abe1a33698481919d1c4c64678d76b5`.

- Website: React 19, TypeScript, TanStack Start/Router/Query, Vite 7, Tailwind CSS; serverseitig gerenderte öffentliche Seiten.
- Hosting: Sites mit Cloudflare Worker; Nitro-Preset `cloudflare-module` erzeugt `dist/server` und `dist/client`.
- `src/server.ts` und `src/lib/http-policy.server.ts`: SSR-/HTTP-Verhalten, Weiterleitungen, robots.txt, Sitemap, Sicherheits- und Indexierungsheader.
- `src/lib/seo.ts`: feste www-Hauptdomain, Canonicals, private Pfade und alte Framer-Weiterleitungen.
- Supabase: öffentliche Inhalte, Auth, Rollen und Storage; geschützte Kundendateien getrennt von öffentlichen Bildern.
- Neue Datenbank ist eingerichtet. Bootstrap und alte historische Migrationen nicht nochmals blind anwenden.
- Acht Leistungen liegen weiterhin in `public.services` und sind über die vorhandene Administration bearbeitbar.
- Projektgalerien haben eigene SSR-Detailseiten, Bilder und Links zur jeweiligen Leistung; aktive Galerien mit Bildern stehen in der Sitemap.
- Verifizierter Live-Baseline-Bestand vor dem Ratgeber: 30 öffentliche HTML-Seiten, zusätzlich Login; darunter acht Leistungsdetailseiten, zehn Projektgalerien und eine Stellenanzeige.
- Ratgeber: sechs Beiträge aus typisierten Inhalten in `src/content/ratgeber.json`, Übersicht `/ratgeber` und Detailroute `/ratgeber/$slug`.
- Eigene Originalbilder, SSR-Metadaten, `BlogPosting` und `BreadcrumbList`, Formulare über die bestehende Komponente `ServiceMiniContact`.
- Autorenprofil `/autoren/serhad-marasli` auf ausdrücklichen Nutzerwunsch, mit Person-/ProfilePage-Schema und verknüpften Artikeln. Keine unbelegten Qualifikationen oder Berufsbezeichnungen ergänzen.
- Der veröffentlichte Gesamtstand enthält 38 Sitemap-URLs: bisherige 30, Ratgeberübersicht, sechs Beiträge und Autorenprofil. Drei OpenSEO-App-Informationsseiten sind absichtlich `noindex,follow` und außerhalb der Sitemap.
- Zwei öffentliche Inhaltsabfragen nutzen einen Worker-lokalen 30-Sekunden-Cache. Keine Authentifizierung, Rollen, Anfragen oder Bewerbungen werden darin gespeichert; Fehler werden verworfen. Kein garantierter globaler CDN-Cache.
- Website-Admin, Supabase-Dashboard, Sites und lokale OpenSEO-Anmeldung sind unterschiedliche Zugänge.
- Lokales OpenSEO nutzt D1/SQLite unter `.wrangler/state`, Cloudflare-Laufzeitemulation und `AUTH_MODE=local_noauth` ausschließlich auf Loopback.
- Formularmeldungen gehen laut Betriebsdokumentation an `webseite@loni-galabau.de`; Zustellstatus wird getrennt von bloßer Versandannahme behandelt.
- Kein automatischer Kundenantwort-Bot oder KI-E-Mail-Bot als fertig eingerichtet voraussetzen.

## Arbeitsablauf auf diesem Windows-PC

- Vor Änderungen vorhandene Benutzerarbeit, Branch, HEAD und Remotes prüfen; parallele Arbeiten nicht überschreiben.
- Dauerauftrag seit 28.09.2026: abgeschlossene geprüfte Website-Änderungen mit GitHub synchronisieren; kein Force-Push gegen fremde Arbeit.
- Git-Synchronisierung, Datenbankänderung und Live-Veröffentlichung bleiben getrennte Vorgänge mit jeweils passendem Auftrag und Nachweis.
- Website verwendet `package-lock.json`/npm. Regulär: `npm ci`, `npm test`, `npx tsc --noEmit`, `npm run build`; ESLint gezielt auf geänderte Dateien.
- Vorhandenes Codex-Node.js: `%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`; eingesetzt wurde Node 24.19.0.
- Bei fehlendem npm im Suchpfad vorhandene CLI-Dateien direkt mit Node starten; dafür keine unnötige Neuinstallation.

```powershell
$node = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
# Im Website-Checkout ausführen:
& $node node_modules/typescript/bin/tsc --noEmit
& $node --max-old-space-size=4096 node_modules/vite/bin/vite.js build
& $node scripts/finalize-site-worker.mjs
```

- Beim direkten Vite-Build muss der Website-Postbuild `finalize-site-worker.mjs` zusätzlich laufen; `npm run build` erledigt den Lifecycle regulär.
- Das Deployment benötigt `.openai/hosting.json` sowie die vollständigen gebauten Client-/Worker-Dateien, keine `.env`, `.git` oder privaten Exporte.
- Fehlt Bash für das Sites-Packaging, existiert ein privater Windows-Helfer: offizielles `prepare-site-build.cjs`, geprüftes Staging und Windows-`tar.exe`.
- Dieser Helfer verweist auf die damals installierte Sites-Skill-Version. Vor Wiederverwendung Pfade und aktuelle Vorgaben prüfen, nicht blind veraltete Archive veröffentlichen.
- Erst den exakten Quellstand im zugehörigen Sites-Quellrepository sichern, Version speichern, veröffentlichen und Deploymentstatus/Live-Ergebnis prüfen.
- Falls lokaler Git-Transport blockiert ist, wurde ein gezielter GitHub-Tree/API-Abgleich verwendet; anschließend Inhaltsbaum und Historie abgleichen. Kein Anlass für einen Force-Push.
- Die lokale Website-SSR-Prüfung lief auf Port `3010`. Der Port gehört nicht zum dauerhaften Produktionssetup.
- OpenSEO: `Start-OpenSEO.cmd` / `Stop-OpenSEO.cmd`; Standardstart `/projects` vermeidet automatisch angestoßene Dashboard-Datenabfragen.
- OpenSEO-Vorschau übernimmt Einstellungen aus dem Build: nach Änderungen der lokalen Konfiguration neu bauen. Die separate Installation enthält eine deutsche Startanleitung.
- OpenSEO fordert pnpm 10.30.1; hier wurden Abhängigkeiten mit pnpm 11.19 als Ersatz eingerichtet. Direkte Node-CLIs vermeiden erneute Paketmanager-Uminstallation.

## Fachliche Fakten und gewünschter Stil

- Firma: Loni GalaBau GmbH; Sitz Hattersheim am Main bei Frankfurt; **deutschlandweit tätig** (ausdrückliche Nutzerkorrektur 01.10.2026). Frühere Rhein-Main-Beschränkung nicht wiederverwenden.
- „Seit 2011 im Garten- und Landschaftsbau tätig“ bezeichnet Branchenerfahrung, nicht das Gründungsjahr der GmbH.
- Acht Leistungen: Gartengestaltung, Pflasterarbeiten, Natursteinarbeiten, Bewässerungsanlagen, Zaunarbeiten, Rasenanlagen, Erdarbeiten, Entwässerung.
- **Nutzerkorrektur vom 01.10.2026:** Die acht dargestellten Leistungsbereiche sind keine abschließende Begrenzung des tatsächlichen Angebots. Keine pauschale Aussage „8 Leistungen“ als Gesamtumfang verwenden. Startseitenformulierung: „Vielseitig – Individuelle Lösungen für Ihr Vorhaben“. Neue konkrete Leistungsarten erst nach Bestätigung aufnehmen.
- Sachlich, verständlich, fachlich konkret schreiben: Leistung, Ablauf, Auswahlfragen und Angebotsfaktoren erläutern.
- Keine erfundenen Niederlassungen, Projektorte, Bewertungen, Auszeichnungen, Qualifikationen, Personalzahlen oder pauschalen Preis-/Garantieversprechen.
- Serhad Marasli ist laut eigener Bestätigung Bau- & Operations Manager. Name und Rolle nur als sachliche, kleine Autorenangabe verwenden; keine prominente Namensüberschrift. Konkrete Qualifikationen, Aufgaben und Erfahrungsjahre darüber hinaus sind nicht bestätigt.
- Projektgalerien sind teils Zusammenstellungen mehrerer Arbeiten. Für echte Einzelreferenzen fehlen noch freigegebene Orts-, Zeit- und Leistungsangaben.
- Bestehendes Erscheinungsbild und Hero-Motiv erhalten, sofern ein neuer Auftrag nichts anderes vorsieht; SEO braucht keinen zusätzlichen Fülltext.
- Eigene Fotos und ihre hinterlegten Beschreibungen verwenden. `ProjectImage`/`photoAlt()` liefert bereits motivbezogene Alt-Texte; dekorative Bilder dürfen `alt=""` haben. Keine pauschalen Keyword-Alt-Texte ergänzen.
- Keine beliebigen Stadtseiten, fremden Marken oder DIY-Themen als angebotene Leistungen ausgeben.
- Rechtliche Inhalte, Verträge und Datenschutzorganisation nicht als abschließend rechtlich freigegeben darstellen.

## SEO und Recherche: erledigt

- DataForSEO-Recherche über lokales OpenSEO: 956 Vorschläge, 951 unterschiedliche Rohbegriffe; 154 gezielte Kandidaten, 130 Metrikzeilen, 24 ohne Datensatz.
- 12 ortsbezogene Suchproben, drei Wettbewerber und eine historische Loni-Domain-Stichprobe; 95 ausgewählte Keywords in OpenSEO gespeichert und organisiert.
- Nutzerbudget für diese einmalige Recherche: **20 USD**. Delegierter Recherchelauf intern auf 5 USD begrenzt; dokumentierte Kontodifferenz rund **0,36316 USD**.
- Kontodifferenz ist kontoweit, kein pauschaler künftiger Preis. Keine Aufladung, kein wiederkehrender Abruf und keine neue Dauerfreigabe daraus ableiten.
- Volumina sind Deutschland-Schätzwerte, keine lokal gemessenen Besucher- oder Auftragszahlen. Unbekannte Werte nicht als Null behandeln; ähnliche Varianten nicht addieren.
- Individuelle Titel/Beschreibungen für Startseite, Leistungsübersicht, acht Leistungen sowie verbesserte Metadaten für Projekte, Jobs, Kontakt, Team und Gartenplaner.
- Acht Leistungstexte mit Umfang, Vorgehen, Auswahlfragen und Angebotsfaktoren; je drei Bausteine/FAQs; passende interne Querverweise.
- Überschriftenhierarchie korrigiert; JobPosting enthält Aufgaben und Anforderungen; Projektbilder in OG/Twitter vereinheitlicht.
- Einmaliges Inhaltsupdate dokumentiert unter `supabase/content/seo-services-2026-09-30.sql`; vorheriger Inhalt privat gesichert, keine Schemaänderung.
- Qualitätssicherung des veröffentlichten SEO-Stands: 79 Tests, Typprüfung, gezieltes Linting und Build bestanden; Desktop/mobile Stichproben geprüft.
- Erweiterter Ratgeber-/Autorenstand: **87 Tests, Typprüfung, gezieltes Linting und Produktionsbuild bestanden**. Lokaler und abschließender Live-SSR-Audit: 38 Sitemap-Seiten plus drei App-Informationsseiten ohne Befund, unbekannte Artikel korrekt 404. Live-Prüfung am 30.09.2026 um 16:44 MESZ.
- Version 35 live: alle 37 Sitemap-Seiten, 141 Bildvarianten und sechs PDFs erreichbar; keine defekten internen Links/Zielanker. Neun alte Pfade leiten per 301 zu funktionierenden Zielen.
- Seobility-Nachprüfung: 50 Bilder, keine fehlenden Alt-Attribute, 15 bewusst leere dekorative Alt-Texte; JSON-LD gültig. Fünf rein gestalterische Überschriften in `GardenDetails` semantisch zu Absätzen geändert.
- Lokale vollständige SSR-Prüfung: 30/30 öffentliche URLs HTTP 200, eindeutige Titel/Beschreibungen, www-Canonicals, je eine H1, keine Überschriftensprünge, Alt-Attribute, gültiges JSON-LD und konsistente Social-Metadaten.
- Live-Prüfung vom 30.09.2026 um 12:49 MESZ: 30/30 Sitemap-URLs HTTP 200, passende Canonicals, Googlebot zugelassen, keine `noindex`-Blockade.
- `/login`, geschützte Pfade und lokale/alternative Vorschauhosts bleiben absichtlich von der Indexierung ausgeschlossen.
- Eigener OpenSEO-Audit ohne Lighthouse: 37 URLs einschließlich Login und sechs PDFs, keine kritischen Befunde; keine kostenpflichtigen API-Aufrufe.
- DataForSEO-Daten und optionales Lighthouse können Kosten auslösen. Kostenloser technischer Audit: `run_site_audit` mit `runLighthouse=false`.
- Neuer Live-SSR-Audit am 01.10.2026 um 08:52:12 MESZ: **41/41 HTML-Seiten HTTP 200**, 38 Sitemap-Seiten plus drei bewusst mit `noindex` versehene App-Informationsseiten; kein Befund bei vorhandenen Titeln/Beschreibungen, Canonicals, H1, Alt-Attributen und Indexierungsanweisungen. Eindeutige Titel; vorhandenes JSON-LD syntaktisch parsebar, keine vollständige Rich-Results-Validierung. Unbekannter Ratgeberartikel HTTP 404. Auf allen 41 Seiten keine initialen externen Stylesheet-Links. Kein neuer Google-Indexstatus damit belegt.

## Google Search Console und Indexierung

- Google-Verbindung in OpenSEO erfolgreich: Performance- und URL-Inspection-Antworten liegen vor. OAuth-Projekt `loni-openseo`, App „Loni OpenSEO“, **In production** am 30.09.2026 sichtbar bestätigt.
- Branding mit Homepage `/openseo`, Datenschutz `/openseo/datenschutz`, Nutzungsinformation `/openseo/nutzung` unter der www-Hauptdomain gespeichert; autorisierte Domain `loni-galabau.de`.
- Zugriff bleibt auf Profil/E-Mail und `webmasters.readonly` begrenzt. Produktionsstatus beseitigt die Testing-Beschränkung; er bedeutet weder Google-Verifizierung noch unverfallbare Tokens. Erneute Google-Anmeldung nach der Umstellung erfolgreich abgeschlossen; OpenSEO zeigt die bisherige Property weiter als Connected.
- In OpenSEO zeigte die Property für den Zeitraum 30.08.–27.09.2026 insgesamt 41 Klicks und 1.274 Impressionen. Diese Werte stammen überwiegend aus der Zeit vor dem neuen SEO-Stand und belegen dessen Wirkung nicht.
- Performance-Stichprobe: Zeitraum 30.08.–27.09.2026, zehn zurückgegebene Query-Zeilen mit sieben Klicks und 123 Impressionen; **keine Gesamtsumme der Property**.
- Index-Baseline vor/parallel zu den Anträgen: fünf indexiert, elf gefunden/nicht indexiert, 13 Google unbekannt, eine historische 404 (`/datenschutz`, Crawl vom Juni).
- Aktuelle Datenschutzseite liefert HTTP 200; der historische Google-Befund ist nicht mit einem aktuellen Live-Fehler gleichzusetzen.
- Aktualisierte Sitemap mit **38 URLs** nach Version 36 erneut eingereicht; Google bestätigt „Sitemap submitted successfully“. Die letzte im UI angezeigte Erkennung lag noch bei 30 Seiten; neue Verarbeitung ist zeitversetzt, nicht als 38 indexierte Seiten ausgeben.
- **Elf Einzelanträge bestätigt:** acht Leistungsseiten, `/datenschutz`, `/projekte`, `/konfigurator`.
- Beim Antrag für `/jobs` meldete Google **Quota Exceeded**. Weitere Einzelanträge wurden gestoppt; Limit nicht umgehen.
- Die zehn Projektgalerien erhielten in diesem Lauf keine eigenen bestätigten Einzelanträge. Sie sind über die Sitemap angemeldet.
- Sitemap-Erkennung und „Indexing requested“ sind keine Zusage tatsächlicher Indexierung; Entscheidung und Zeitpunkt liegen bei Google.
- Vor erneuten Anträgen vorhandenen Indexstatus prüfen. Keine mehrfachen Anträge für bereits indexierte URLs ohne sachlichen Anlass.
- Private lokale MCP-Prüfhelfer ermöglichen lesende Performance- und Indexstatus-Abfragen ohne kostenpflichtige Provider-Aufrufe.

## Offene Punkte und Pflege

- Unterseiten-Baseline vom 01.10.2026: Gartengestaltung **82/LCP 4,514 s**, Pflasterarbeiten **81/4,681 s**, Projektübersicht **88/3,807 s**, Projektgalerie Gärten **98/1,820 s**, Ratgeber Pflasterkosten **98/2,251 s**, Kontakt **99/2,101 s**, Konfigurator **99/1,298 s**. Jeweils ein mobiler PSI-Lauf, überall SEO 100 und CLS 0; keine CrUX-Felddaten, keine pauschale Aussage über sämtliche Unterseiten. Gemeinsame Inline-Stile/Schriftstrategie wirken seitenübergreifend; Deferred Hydration von Formular/Slider betrifft nur die Startseite.
- Unterseiten-Maßnahmen umgesetzt: Query-Hydrationslücke auf 8/8 Leistungsseiten live geschlossen, vorhandene Projektbilder responsiv komprimiert, gemeinsame Kontraste und Kontaktportrait optimiert. SEO-Titel, Beschreibungen, Haupttexte, FAQs, Ratgeber, `areaServed` und `llms.txt` stellen das Einsatzgebiet deutschlandweit dar. Acht Leistungsdatensätze wurden mit Konfliktschutz aktualisiert und rückgelesen; SQL-Beleg bereits ausgeführt, nicht erneut anwenden.
- Gartengestaltung: 403 bei `getProjectsByService` im PSI-Bericht. Lesender Befund: Projektabschnitt im SSR-Stream vorhanden, Projektabfrage fehlt im übertragenen Query-Cache; nicht abgewartetes Prefetch kann eine zusätzliche Clientabfrage auslösen. Nachgestellte Abfrage mit passendem `Sec-Fetch-Site` oder `Origin` HTTP 200, ohne beide Header HTTP 403 durch CSRF-Schutz. Ursprüngliche PSI-Header unbekannt; keine pauschale Besucherbetroffenheit behaupten. Abfrage künftig vor Cache-Übertragung abschließen oder korrekt streamen, CSRF nicht lockern. Keine neue Codeänderung oder Veröffentlichung erfolgt.
- Aktueller Programmstand Version 45 ist veröffentlicht; finaler Live-Audit und mobile Nachmessungen sind dokumentiert. GitHub-Abgleich erst nach vollständiger Übertragung der Binärassets als abgeschlossen melden.
- Mobile Performance am 30.09.2026 über die offizielle PageSpeed-Oberfläche: Version 38 schwankte zwischen 78 und 88; Version 39 erreichte 83. Version 40 lag bei **81–99/100, LCP 2,101–3,976 s**. Version 41 erreicht im ersten Lauf **91/100, FCP 2,401 s, LCP 3,001 s, TBT 5 ms** (UI gerundet 0), CLS 0, Speed Index 3,387 s und TTI 3,446 s. Zweiter Lauf mit separater Erfassungszeit und anderen Messwerten: **100/100, FCP 1,111 s, LCP 1,146 s, TBT 30 ms**, CLS 0, Speed Index 1,881 s und TTI 3,320 s. SEO, Barrierefreiheit und Best Practices in beiden Läufen jeweils 100. Live-Verbesserung belegt, stabile 100 Punkte nicht garantiert; das LCP-Laborziel bis 2,5 s wird noch nicht durchgehend erreicht. Keine CrUX-Felddaten; Berichte und genaue Werte im Performance-Dokument. Kein dauerhafter Score oder Ranking zugesichert.
- Version 39: alle benötigten Stile nativ im SSR-HTML; fünf blockierende CSS-Anfragen entfallen. Dekorative Scrollmessungen auf Mobilgeräten entfallen. Version 40: Formular und Slider bleiben im SSR, ihre Bedienlogik startet in Sichtnähe. Initiale Modul-Preloads rund 128 KB/17 % kleiner, Auth-Listener weiterhin unverändert separat. Schriftstrategie `optional` vermeidet späten Schriftwechsel, kann bei langsamen Erstbesuchen die Systemschrift verwenden. Gartendetails bleiben für unmittelbare Tastaturbedienung sofort aktiv.
- Version 41: Fontpreload als isolierten Vergleichsschritt entfernt. Live-HTML 315.372 B, lokal gzip-komprimiert 53.460 B; 21 initiale Modul-Preloads mit 614.683 B beziehungsweise lokal gzip-komprimiert 202.324 B. Keine initialen CSS-Links, ein Inline-CSS-Block, SSR-Formular und Leistungsinhalte vorhanden. HTTP-Stichproben: kalte TTFB rund 2,6 s, warme 200–233 ms; Hero in der geprüften Streaming-Antwort etwa 11 ms nach den Responseheaders, keine versteckte SSR-Blockade. Keine Cacheänderung; Ursache der PSI-Schwankung damit nicht abschließend belegt.
- Ratgeber-Stichprobe um 17:19 MESZ: mobil **94/100**, LCP 2,7 s, TBT 0 ms, CLS 0,005; Barrierefreiheit 97 mit offenem Kontrasthinweis. Kein Vorhervergleich für diese URL vorhanden. Artikelvorschau-Bilder bieten weiteres Kompressionspotenzial.
- Standardhero und großes Baustellenbild mit AVIF/WebP, zusammen rund 58 % weniger Bytes für die großen AVIF-Varianten. Zentrales JS-Paket rund 38 % kleiner; SDK separat geladen, Auth-/MFA-Prüfungen erhalten. Mobile Animationen am Seitenanfang entfernt, frühe unsichtbare Logo-Downloads vermieden. Alle 90 Tests, Typprüfung, gezieltes Linting und Build bestanden. Live-SSR-Audit von 41 HTML-Seiten in Version 40 um 17:55 MESZ ohne Befund.
- Version 41 um 18:08:58 MESZ: Live-Audit von 38 Sitemap-Seiten plus drei App-Informationsseiten ohne Befund, unbekannter Artikel korrekt 404. Gezieltes ESLint bestanden. Live-Browser: Ankersprung zu `#projektanfrage`, „Gartengestaltung“ per Leertaste ausgewählt, „Weiter“ erreicht Schritt 2; keine Anfrage abgeschickt. Ein vorheriger Auditaufruf mit `//`-Adressen war ein Prüfaufruffehler und wurde normalisiert wiederholt.
- Hostinggrenzen: erster HTTP→HTTPS-Schritt weiterhin 302. GET-Stichprobe korrigiert die frühere HEAD-Auswertung: geprüftes Supabase-Bild hat ein Jahr Browser-TTL und CDN-HIT; Sites-Assets CDN-HIT plus ETag/304, aber Browser-Revalidierung und teilweise unpassender MIME-Typ. Vorgeschaltete Providerantworten lassen sich nicht durch wirkungslose lokale Headerdateien korrigieren. Details in `docs/Mobile-Performance-2026-09-30.md`.
- Fehlende pauschale `title`-Attribute, eine Textquote unter 25 %, dekoratives `alt=""`, fehlendes hreflang ohne Sprachvarianten und fehlende Agenten-Commerce-Schnittstellen sind keine pauschalen SEO-Mängel. Kein universelles „100/100“ oder Ranking versprechen.
- Indexentwicklung und neue Suchanfragen später anhand aktueller GSC-Daten prüfen; Ranking-/Anfragenwirkung der SEO-Änderungen noch nicht gemessen.
- Google-Unternehmensprofil: Optimierungs-/Verifikationsstand hier **ungeprüft**. Einzelner Local-Pack-Treffer ersetzt keine Profilprüfung.
- Conversion-Tracking: tatsächliche Einrichtung/Funktion hier **ungeprüft**; ältere Betriebsdokumentation beschreibt bewusst deaktiviertes Tracking. Vor Einführung Consent und Messdefinition prüfen.
- Keine Nachkontroll-Automation aus diesem Gedächtnis ableiten; eine solche wurde für die SEO-Nachmessung nicht eingerichtet.
- Nach wesentlichen Änderungen Datum, veröffentlichte Version, Prüfungen und offene Punkte fortschreiben; veraltete Angaben ersetzen statt widersprüchliche Zustände anhäufen.
- Gedächtnis und `AGENTS.md` gemeinsam erhalten; private Belege/Schlüssel nicht mit einchecken.

## Belege und Lesereihenfolge

Repository-Belege, relativ zum Repository-Hauptverzeichnis:

- [Arbeitsregeln](AGENTS.md), [SEO-Umsetzung](docs/seo-2026-09-30.md), [Architektur/Start](README.md).
- [Betriebs- und Faktenstand 29.09.](docs/Website-Start-2026-09-29.md), [Supabase-Aufbau](supabase/bootstrap/README.md).
- [HTTP-Policy](src/lib/http-policy.server.ts), [SEO-Helfer](src/lib/seo.ts), [Worker-Postbuild](scripts/finalize-site-worker.mjs).
- [Leistungsinhalte](supabase/content/seo-services-2026-09-30.sql), [Ratgeber-Inhalte](src/content/ratgeber.json), [aktueller SEO-Audit](docs/SEO-Audit-2026-09-30.md).
- [Unterseiten-Audit vom 01.10.2026](docs/Unterseiten-Performance-2026-10-01.md), [Startseiten-Performance vom 30.09.2026](docs/Mobile-Performance-2026-09-30.md).

Im privaten, unversionierten Aufgabenordner liegen Recherche-/Kostenbelege, Veröffentlichungsnachweise, SSR-/Live-Audits und GSC-Ergebnisse einschließlich Sitemap, Einzelanträgen und Quota. Diese privaten Dateien werden nicht im öffentlichen Repository verlinkt oder veröffentlicht.

Bei Widersprüchen: aktuelle verifizierte Live-/API-Nachweise und jüngste Nutzerkorrekturen vor historischen README-Aussagen verwenden.
