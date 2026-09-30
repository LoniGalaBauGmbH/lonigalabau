# Projektgedächtnis – Loni GalaBau

Stand: **30.09.2026**. Versioniertes Projektgedächtnis für die Website und ihre SEO-Werkzeuge.
Dieses Dokument trennt belegte Ergebnisse von laufenden Aufgaben. Es enthält keine Zugangsdaten.
Vor jeder Fortsetzung lesen; nach wesentlichen Änderungen belegte Ergebnisse und offene Punkte aktualisieren.

## Zweck und aktueller Auftrag

- Unternehmenswebsite für Garten- und Landschaftsbau: Leistungen erklären, eigene Arbeiten zeigen und passende Anfragen/Bewerbungen ermöglichen.
- Nutzerwunsch: vollständige SEO-Bearbeitung aller öffentlichen Seiten, Anmeldung zur Google-Indexierung und dauerhaftes Projektgedächtnis.
- **Erledigt:** Google-OAuth-App „Loni OpenSEO“ steht nach ausdrücklicher Nutzerfreigabe auf **In production**. Die separate Google-App-Verifizierung ist damit nicht erteilt.
- **Live in Version 36:** Ratgeber mit sechs Beiträgen, Übersichtsseite, eigenen Bildern, Kontaktformularen und Autorenprofil Serhad Marasli. Gesamten öffentlichen Seitenbestand live geprüft.
- **Live in Version 38:** mobile Performance verbessert: PageSpeed 81 → 88, LCP 4,201 → 3,301 s; Desktop 99. Messung vom 30.09.2026, 17:17 MESZ, keine CrUX-Felddaten. Details in `docs/Mobile-Performance-2026-09-30.md`.
- Dieses Gedächtnis liegt im Repository und wird über `AGENTS.md` bei späteren Arbeiten eingebunden.

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

- Bestätigter Sites-Stand: **Version 38**, veröffentlicht am 30.09.2026 um 17:17 MESZ; Ratgeber, Autorenprofil sowie vorherige Ticket-/Favicon-Änderungen erhalten.
- Version 38: Quellcommit `038622931f4787576e7edd2c5df9bf62f587e601`, Deployment `appgdep_6abd27f27a04819192c01eae20c4fd9b`. Nachträgliche Messdokumentation ändert den Live-Programmcode nicht.
- Version 36: Quellcommit `d022c938ddba74603b9cbd9d5ed86a01fa0cfc6f`, Deployment `appgdep_6abd2034bbac819192b9c33934f276bd`. Nachträgliche Dokumentationskorrekturen ändern den Live-Programmcode nicht.
- Beim Öffnen des Performance-Arbeitsstands: Commit `326fb4ae0a48fb63ad01761bd3bbd0b7da985aa1`. Vor weiterer Veröffentlichung erneut prüfen.
- Der umfassende SEO-Release wurde bereits mit **Version 33** am 30.09.2026 um 12:11 Uhr MESZ veröffentlicht; GitHub-SEO-Commit `1d55a6dfcaeeed4cc627b3bedd1ee908bc0eb843`.
- Version 35: Quellcommit `96188f55a1d40b6e361b599855e44c1daf5232a0`, Deployment `appgdep_6abd1beeb76081919c5a532a71d68480`. 37 öffentliche Sitemap-Seiten live geprüft.
- Veröffentlichungsbelege liegen im privaten Aufgabenordner; eine erfolgreiche GitHub-Synchronisierung allein ist kein Deployment.
- Ältere Aussagen in `README.md`/`project_state.md`, wonach Hosting oder Domainwechsel noch ausstehen, sind teilweise überholt.

## Architektur und wichtige Zuständigkeiten

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

- Firma: Loni GalaBau GmbH, Sitz Hattersheim am Main; Tätigkeitsgebiet Rhein-Main mit Frankfurt und weiteren belegten Einsatzorten.
- „Seit 2011 im Garten- und Landschaftsbau tätig“ bezeichnet Branchenerfahrung, nicht das Gründungsjahr der GmbH.
- Acht Leistungen: Gartengestaltung, Pflasterarbeiten, Natursteinarbeiten, Bewässerungsanlagen, Zaunarbeiten, Rasenanlagen, Erdarbeiten, Entwässerung.
- Sachlich, verständlich, fachlich konkret schreiben: Leistung, Ablauf, Auswahlfragen und Angebotsfaktoren erläutern.
- Keine erfundenen Niederlassungen, Projektorte, Bewertungen, Auszeichnungen, Qualifikationen, Personalzahlen oder pauschalen Preis-/Garantieversprechen.
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

- Programmstand Version 38 ist veröffentlicht und geprüft. GitHub-Commit-Nachweis im Abschluss bzw. privaten Veröffentlichungsbeleg führen.
- Mobile Performance am 30.09.2026 erfolgreich über die offizielle PageSpeed-Oberfläche gemessen: **88/100, LCP 3,3 s**, vorher 81/100 und 4,2 s. Der Zwischenstand Version 37 erzielte 79/100; alle Läufe im Performance-Bericht dokumentiert. Kein aktueller CrUX-Felddatensatz vorhanden. LCP-Ziel bis 2,5 s noch nicht erreicht; verbleibend insbesondere CSS-Ladekette und weitere JS-Aufteilung.
- Ratgeber-Stichprobe um 17:19 MESZ: mobil **94/100**, LCP 2,7 s, TBT 0 ms, CLS 0,005; Barrierefreiheit 97 mit offenem Kontrasthinweis. Kein Vorhervergleich für diese URL vorhanden. Artikelvorschau-Bilder bieten weiteres Kompressionspotenzial.
- Standardhero und großes Baustellenbild mit AVIF/WebP, zusammen rund 58 % weniger Bytes für die großen AVIF-Varianten. Zentrales JS-Paket rund 38 % kleiner; SDK separat geladen, Auth-/MFA-Prüfungen erhalten. Mobile Animationen am Seitenanfang entfernt, frühe unsichtbare Logo-Downloads vermieden. 87 bestehende plus drei zusätzliche Auth-RPC-Tests, Typprüfung, gezieltes Linting und Build bestanden. Live-SSR-Audit von 41 HTML-Seiten um 17:18 MESZ ohne Befund.
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

Im privaten, unversionierten Aufgabenordner liegen Recherche-/Kostenbelege, Veröffentlichungsnachweise, SSR-/Live-Audits und GSC-Ergebnisse einschließlich Sitemap, Einzelanträgen und Quota. Diese privaten Dateien werden nicht im öffentlichen Repository verlinkt oder veröffentlicht.

Bei Widersprüchen: aktuelle verifizierte Live-/API-Nachweise und jüngste Nutzerkorrekturen vor historischen README-Aussagen verwenden.
