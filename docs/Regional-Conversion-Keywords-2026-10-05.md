# Keywordrecherche für die zehn Ortsseiten

Keywordstand: **05.10.2026, 09:49 MESZ**; technischer Live-Audit: **05.10.2026, 10:12 MESZ**. Die Recherche wurde mit der vorhandenen lokalen **OpenSEO-Instanz und deren DataForSEO-MCP-Werkzeugen** durchgeführt. Sie umfasst alle zehn angeforderten Stadtseiten. An den Website-Inhalten wurden durch diese Recherche keine Änderungen vorgenommen.

## Quelle, Umfang und Grenzen

- OpenSEO-Projekt: **Loni GalaBau**, Domain `loni-galabau.de`; Projekt-ID `d2065474-40c3-4bde-a87c-7ff129ddaecd`.
- Markt: **Deutschland, Standortcode 2276, Sprache Deutsch**. Die Ortsnamen stehen in den Suchphrasen; es handelt sich nicht um eine GPS-genaue Rangmessung in den Städten.
- `list_projects` bestätigte den Projektmarkt. `list_saved_keywords` las 95 vorhandene Begriffe mit zwischengespeicherten Metriken aus.
- `get_keyword_metrics`, Abruf **09:45 MESZ**: eine gebündelte Anfrage für **70 konkrete Suchphrasen**, sieben pro Stadt. Gemessen wurden Gartenbau, Garten- und Landschaftsbau, GaLaBau, Gartengestaltung, Pflasterarbeiten, Zaunbau sowie eine zum jeweiligen Seitenfokus passende Zusatzphrase. Kein Clickstream-Zusatz; die monatlichen Zeitreihen wurden mit abgerufen.
- Ergebnis: **21 zurückgelieferte Datensätze**, davon **15 mit numerischem Suchvolumen** und **6 mit unbekanntem Suchvolumen**. Für **49 weitere angefragte Kombinationen** lieferte das Werkzeug keinen Datensatz. Unbekannt bedeutet nicht null Suchanfragen.
- `get_serp_results`, Abruf **09:45–09:46 MESZ**: eine Gartenbau-Suchphrase je Stadt, `depth: 10`; **zehn erfolgreiche Antworten mit insgesamt 100 Ergebniszeilen**. Diese Zeilen umfassen auch Local Pack und weitere Ergebnistypen, nicht ausschließlich organische Treffer.
- `save_keywords` speicherte die 21 zurückgelieferten Begriffe samt Metriken ohne neue Tags oder Änderungen der vorhandenen Tagstruktur. Ein anschließender kostenloser Abruf bestätigte alle 21 Begriffe. Der Bestand wuchs von **95 auf 115**, da „gartenbau hattersheim“ bereits vorhanden war.
- Die beobachtete DataForSEO-**Kontodifferenz beträgt 0,03452 USD**. Sie ist kontoweit und keine allgemeine Preiszusage. Keine Aufladung, wiederkehrende Abfrage, Anzeigenkampagne oder Lighthouse-Abfrage wurde eingerichtet.

Die Suchvolumina sind monatliche Deutschland-Schätzwerte des Datenanbieters. Sie sind keine Messung der Nachfrage nur innerhalb der genannten Kommune und keine Besucher-, Umsatz- oder Auftragsprognose. Ähnliche Varianten werden nicht zu einer Gesamtnachfrage addiert. KD bezeichnet organische Keyword-Schwierigkeit, Anzeigenwettbewerb eine andere Kennzahl. KD 0 garantiert keine einfache Platzierung. „—“ steht für nicht verfügbare Werte; ein tatsächlich zurückgelieferter Wert 0 bleibt 0.

Die aktuellen MCP-Metrikzeilen verwenden `search_volume`, `keyword_difficulty` und `main_intent`. Die gespeicherten OpenSEO-Zeilen verwenden dagegen `searchVolume`, `keywordDifficulty` und `intent`. Die folgende Tabelle wurde mit den Feldern der aktuellen Rohantwort geprüft.

## Tatsächlich zurückgelieferte Stadtmetriken

Quelle für sämtliche Zeilen: `get_keyword_metrics`, 05.10.2026. CPC in **USD**, Anzeigenwettbewerb auf der Skala **0–1**. Intent ist die unveränderte Klassifikation des Werkzeugs.

| Suchphrase | Volumen/Monat DE | KD | CPC USD | Anzeigenwettbewerb | Tool-Intent |
| --- | ---: | ---: | ---: | ---: | --- |
| gartenbau hofheim | 90 | 0 | 0,50 | 0,13 | navigational |
| garten und landschaftsbau eschborn | 30 | — | 1,25 | 0,47 | navigational |
| garten und landschaftsbau hofheim am taunus | 30 | — | — | 0,45 | navigational |
| gartenbau bad soden | 30 | — | 1,02 | 0,72 | commercial |
| galabau hofheim | 20 | — | — | 0,55 | navigational |
| gartenbau eschborn | 20 | 15 | 1,88 | 0,61 | commercial |
| gartenbau flörsheim | 20 | — | — | 0,55 | navigational |
| gartenbau hattersheim | 20 | — | 1,31 | 0,77 | commercial |
| garten und landschaftsbau bad soden am taunus | 10 | — | — | 0 | commercial |
| garten und landschaftsbau kriftel | 10 | — | — | 0,57 | informational |
| gartenbau frankfurt höchst | 10 | 50 | — | 0,36 | commercial |
| gartenbau kriftel | 10 | 50 | — | 0,57 | transactional |
| gartengestaltung bad soden | 10 | — | — | 0,86 | commercial |
| gartengestaltung hofheim | 10 | — | — | 0,52 | navigational |
| zaunbau hofheim | 10 | — | 3,28 | 0,71 | navigational |
| galabau hattersheim | — | — | — | — | navigational |
| gartenbau hochheim | — | — | — | — | navigational |
| gartenbau sulzbach taunus | — | — | — | — | navigational |
| zaunbau eschborn | — | — | — | — | commercial |
| zaunbau flörsheim | — | — | — | — | navigational |
| zaunbau hochheim | — | — | — | — | navigational |

Für Kelsterbach liegt in dieser gezielten Metrikabfrage **kein zurückgelieferter Datensatz** vor. Auch „rollrasen verlegen lassen hattersheim“, „sichtschutz kelsterbach“, „terrassenbau hofheim“, „rollrasen verlegen lassen kriftel“, „einfahrt pflastern flörsheim“, „natursteinarbeiten hochheim“, „garten umgestalten frankfurt höchst“, „terrassenbau bad soden“, „einfahrt pflastern sulzbach taunus“ und „außenanlagenbau eschborn“ wurden angefragt, aber ohne Metrikdatensatz zurückgeliefert. Daraus folgt kein Nachweis fehlender Nachfrage und kein Grund, passende angebotene Leistungen aus den Seiten zu entfernen.

## Suchergebnisse und tatsächliche Anfrageabsicht

Die zehn SERP-Antworten enthalten lokale Anbieter sowie Verzeichnisse, Vermittlungsportale und teilweise andere Treffer. Das spricht redaktionell für die Suche nach einem passenden Dienstleister; es ist eine **Interpretation der Suchergebnisse**, keine nachträgliche Änderung des Tool-Intents.

| Suchphrase | Local-Pack-Zeilen | Organische Zeilen im Ausschnitt | Beobachtung |
| --- | ---: | ---: | --- |
| gartenbau hattersheim | 3 | 5 | Anbieter- und Verzeichnistreffer; Loni war in diesem einzelnen Local-Pack-Ausschnitt enthalten. |
| gartenbau kelsterbach | 3 | 6 | Lokale Anbieter und Unternehmensverzeichnisse trotz fehlendem Volumendatensatz. |
| gartenbau hofheim | 3 | 4 | Gemischte Ortszuordnung: ein Verzeichnistreffer betrifft Hofheim in Unterfranken. „Am Taunus“ bleibt zur Abgrenzung wichtig. |
| gartenbau kriftel | 3 | 5 | Dienstleister, Bewertungen und Anbieterlisten; passt zur konkreten Projektanfrage. |
| gartenbau flörsheim | 3 | 4 | Anbieterlisten und Haus-/Gartendienstleistungen mit Bezug auf Flörsheim am Main. |
| gartenbau hochheim | 6 | 3 | Gemischte Gartengestaltungs- und Gärtnereitreffer; Bauleistungen auf der Seite klar beschreiben. |
| gartenbau frankfurt höchst | 3 | 6 | Im organischen Ausschnitt auch Höchst im Odenwald; Frankfurt-Höchst und Frankfurt-West ausdrücklich benennen. |
| gartenbau bad soden | 3 | 5 | Im organischen Ausschnitt auch Bad Soden-Salmünster; den vollständigen Ort Bad Soden am Taunus erhalten. |
| gartenbau sulzbach taunus | 3 | 6 | Lokale Anbieter, Vermittlungsportale und eine Seite zu Gartenpflege/Pflasterarbeiten in Sulzbach. |
| gartenbau eschborn | 2 | 6 | Anbieter, regionale Verzeichnisse und Haus-/Gartendienstleistungen. |

Die Zahlen zählen die tatsächlich gelieferten Zeilen, keine vollständige erste Google-Seite und keine eindeutig unterschiedlichen Unternehmen. Ergebnisse können sich nach Nutzerstandort, Gerät und Zeitpunkt unterscheiden. Daraus wird weder eine flächendeckende Loni-Platzierung noch ein Google-Unternehmensprofil-Audit abgeleitet. Ein Hattersheimer Verzeichnisausschnitt nennt zudem eine abweichende historische Adresse; der tatsächliche Firmenstandort der Website bleibt **Auf der Roos 3, Hattersheim am Main**. Fremde Verzeichniseinträge wurden nicht geändert.

## Abgrenzung zur vorhandenen Recherche vom 30.09.2026

Die folgenden Begriffe wurden am 05.10.2026 **nur aus dem vorhandenen OpenSEO-Speicher gelesen**, nicht neu bei DataForSEO gemessen. Ihre Herkunft ist die Recherche vom 30.09.2026, dokumentiert in [seo-2026-09-30.md](seo-2026-09-30.md). Sie stützen die allgemeine Leistungsabsicht, erlauben aber keine Übertragung ihres Volumens auf einzelne Städte.

| Gespeicherter Begriff ohne Ortszusatz | Volumen/Monat DE, älterer Stand | Gespeicherter Intent |
| --- | ---: | --- |
| garten gestalten lassen | 390 | commercial |
| garten anlegen lassen | 30 | commercial |
| pflasterarbeiten | 3.600 | commercial |
| einfahrt pflastern lassen | 70 | informational |
| zaun bauen lassen | 390 | commercial |
| rollrasen verlegen lassen | 320 | commercial |
| bewässerungsanlage installieren lassen | 20 | transactional |
| natursteinmauer bauen lassen | 10 | transactional |
| erdarbeiten garten | 30 | commercial |

Die ebenfalls gespeicherte Phrase **„garten und landschaftsbau hattersheim“ mit 70/Monat** ist vom aktuellen Begriff **„gartenbau hattersheim“ mit 20/Monat** zu unterscheiden. Das sind unterschiedliche Suchphrasen; der Vergleich belegt keinen zeitlichen Rückgang. Die neu angefragte Langform „garten und landschaftsbau hattersheim am main“ erhielt keinen Datensatz.

## Prüfung von Titel, Beschreibung und Zwischenüberschriften

Abgleich mit `src/content/regions.json` am 05.10.2026. **Die Daten rechtfertigen aktuell keine verpflichtende Änderung der vorhandenen Titles, Descriptions oder H2.** Die Seiten treffen bereits den Orts- und Dienstleisterbezug. Unbekannte lokale Leistungsvolumina werden weder als Begründung für neue Versprechen noch für das Streichen relevanter Leistungen verwendet.

| Stadtseite | Konkrete Empfehlung zu Title und Description | Empfehlung zu bestehenden H2 / Begründung |
| --- | --- | --- |
| Hattersheim | „Gartenbau Hattersheim“ und die konkrete Beschreibung mit Okriftel/Eddersheim beibehalten. | „Hauszugang und Garten gemeinsam denken“ und „Rasen und Sichtschutz passend zur Nutzung“ erhalten. Der aktuelle Hauptbegriff ist commercial; keine belastbare neue Priorisierung der einzelnen lokalen Gewerke. |
| Kelsterbach | Title mit Sichtschutz/Pflasterarbeiten und die ortsbezogene Description erhalten. Ohne Volumendatensatz keine zahlenbasierte Verschiebung behaupten. | „Sichtschutz dort vorsehen, wo er gebraucht wird“ erhalten. Die SERP zeigt Dienstleister, belegt aber keinen pauschalen lokalen Schallschutzbedarf. |
| Hofheim | Vollständiges „Hofheim am Taunus“ im Title/H1 erhalten; Description mit Terrassen, Naturstein und Höhenunterschieden bleibt passend. | „Terrasse und Naturstein mit passenden Anschlüssen“ erhalten. Für Terrassenbau fehlt ein Metrikdatensatz; 90/Monat der Kurzphrase werden wegen Ortsmehrdeutigkeit nicht allein Hofheim am Taunus zugerechnet. |
| Kriftel | Gartenbau, Rollrasen, Wege und Pflaster im bestehenden Title/Description beibehalten. | „Rollrasen mit einem realistischen Start planen“ und „Bewässerung nach Zonen statt nach Gesamtfläche“ erhalten. Die Hauptphrase ist transactional; KD 50 ist keine Erfolgsaussage für die neue Seite. |
| Flörsheim | Hofpflasterung/Gartengestaltung im Title und Wicker/Weilbach in der Description erhalten. | „Den Hof nach Fahr- und Gehwegen aufteilen“ erhalten. Die aktuelle Kurzphrase ist navigational; kein gemessenes lokales Einfahrtsvolumen begründet eine Umbenennung. |
| Hochheim | „Hochheim am Main“ im Title und Massenheim in der Description erhalten. | „Eine Terrasse vom gewünschten Aufenthalt her planen“ erhalten. Die Trennung von Gartenbauleistungen und Pflanzenverkauf ist durch die vorhandene Beschreibung bereits verständlich. |
| Frankfurt-Höchst | Frankfurt-Höchst/Frankfurt-West im Title und die vier Stadtteile in der Description erhalten. | „Hofpflaster mit dem vorhandenen Gebäude verbinden“ erhalten. Expliziter Frankfurter Bezug verhindert Verwechslung mit Höchst im Odenwald; der gemessene Hauptbegriff ist commercial. |
| Bad Soden | Gartenbau/Gartengestaltung im bestehenden Title und Neuenhain/Altenhain in der Description erhalten; voller Ort bleibt in H1/Schema vorhanden. | „Beläge anhand von Oberfläche und Nutzung vergleichen“ erhalten. Gartenbau 30 und Gartengestaltung 10/Monat sind commercial, rechtfertigen jedoch keine exklusiven Qualitäts- oder Preisversprechen. |
| Sulzbach | Sulzbach Taunus im Title sowie „Sulzbach (Taunus)“ in Description/H1 erhalten. | „Zu Fuß zur Haustür, auch wenn ein Auto parkt“ erhalten. Kein bekanntes Volumen; praktische Vorgarten-/Einfahrtsfragen passen zum bestehenden Angebot. |
| Eschborn | Gewerbe-/Privatgärten im Title und Eschborn/Niederhöchstadt in der Description erhalten. | „Besucherwege, Stellplätze und Lieferflächen trennen“ erhalten. Gartenbau Eschborn ist commercial; die Recherche belegt keine mengenmäßige Verteilung privater und gewerblicher Nachfrage. |

Die allgemeine Hero-H1 mit Garten- und Landschaftsbau plus Ort bleibt geeignet. Für die sichtbare Kurzbeschreibung sind **Terrassen, Wege und Grünflächen** nachvollziehbare Leistungsbegriffe. Die vorhandenen ausführlichen Orts- und Planungstexte können darunter bleiben. Ein kleiner Rückrufbereich mit dem bestehenden Dreischritt, reale Projektbilder und die belegte Teamvorstellung geben Besuchern einen konkreten nächsten Schritt. Das ist eine redaktionelle Empfehlung für die Anfrageführung; eine höhere Conversion wurde noch nicht gemessen.

## Nachvollziehbarkeit und nächster Prüfpunkt

Die vollständigen aktuellen Anfragen, Rohantworten und das Kostenprotokoll liegen privat im lokalen Aufgabenordner **`SEO-Recherche-2026-10-05`**, außerhalb des Website-Repositorys. Dort dokumentieren `02-regional-metrics.json`, `03-regional-serps.json`, `04-saved-regional.json` und `05-saved-after.json` Abrufzeit, Originaldaten und Speicherung. Zugangsdaten oder private Rohexporte wurden nicht in diesen Bericht übernommen.

## Kostenloser OpenSEO-Live-Audit nach Veröffentlichung von V59

Der technische Audit wurde **erst nach der bestätigten Veröffentlichung von V59** gestartet. Bezug der Veröffentlichung: Deploymentstatus `succeeded`, Aktualisierung **05.10.2026, 08:10:27,016892 UTC**, Sites-Quellstand **`2a5064cce64f51da8aa942fe7b7577f655edc470`**. Diese Veröffentlichungsdaten stammen aus der bestätigten Deploymentantwort; die nachfolgend genannten Crawl-Ergebnisse stammen aus OpenSEO.

- Werkzeug: `run_site_audit`, Projekt `d2065474-40c3-4bde-a87c-7ff129ddaecd`, Start-URL `https://www.loni-galabau.de`, Crawl-Obergrenze **100**, ausdrücklich **`runLighthouse: false`**. Die Obergrenze verhindert, dass zusätzlich gefundene Downloads die 49 Sitemap-Seiten abschneiden; sie ist keine Anzahl geprüfter HTML-Seiten.
- Audit-ID: **`a96a97e5-d983-449f-86b1-142c798ade9b`**. [Audit in der vorhandenen lokalen OpenSEO-Instanz öffnen](http://127.0.0.1:3001/p/d2065474-40c3-4bde-a87c-7ff129ddaecd/audit?auditId=a96a97e5-d983-449f-86b1-142c798ade9b).
- `get_audit_status` bestätigte **`completed`**, Phase `completed`, **56/56** gecrawlte Ziele, keinen Fehlercode. Start **10:11:06 MESZ**, Abschluss **10:12:03,055 MESZ**. Alle drei Lighthouse-Zähler sind **0**.
- `get_audit_issues` lieferte **7 vollständige Befundzeilen**: **0 critical**, **1 warning**, **6 info**. Es wurde mit derselben Audit-ID und `limit: 1000` gelesen; das Ergebnis ist nicht abgeschnitten.
- `get_audit_pages` lieferte **56 vollständige Seiten-/Dateizeilen**, Gesamtzahl ebenfalls 56, mit derselben Audit-ID und `limit: 1000`.
- Die öffentlich abgerufene [Sitemap](https://www.loni-galabau.de/sitemap.xml) antwortete mit **HTTP 200** und enthält **49 URLs**. Der URL-Abgleich mit `get_audit_pages` ist vollständig: **49/49 enthalten**, **0 fehlend**, alle **HTTP 200**, `fetchClass: ok` und `isIndexable: true` laut Werkzeug.
- Die übrigen **7 Ziele** sind sechs verlinkte PDF-Downloads und `/login`, ebenfalls HTTP 200 und ohne Zugriffssperre. Sie gehören nicht zu den 49 Sitemap-HTML-Seiten. Der Login ist absichtlich nicht indexierbar; die PDF-Zeilen besitzen keine HTML-Metadaten.

Status, Befundliste und Einzelseiten wurden getrennt gelesen und abgeglichen. Ein abgeschlossener Crawl allein wurde nicht als Beweis für fehlerfreie Seiten verwendet.

### Nachweis der zehn Ortsseiten

Alle zehn URLs stehen in der Live-Sitemap und wurden im selben Audit gelesen. Titel und Beschreibungen sind jeweils vorhanden und unter diesen zehn Seiten eindeutig. Für diese URLs enthält die vollständige Issue-Antwort **keinen Befund**.

| Ortsseite | HTTP | Abrufklasse | Indexierbar laut OpenSEO | Befunde für diese URL |
| --- | ---: | --- | --- | ---: |
| [Hattersheim](https://www.loni-galabau.de/gartenbau-hattersheim) | 200 | ok | ja | 0 |
| [Kelsterbach](https://www.loni-galabau.de/gartenbau-kelsterbach) | 200 | ok | ja | 0 |
| [Hofheim am Taunus](https://www.loni-galabau.de/gartenbau-hofheim) | 200 | ok | ja | 0 |
| [Kriftel](https://www.loni-galabau.de/gartenbau-kriftel) | 200 | ok | ja | 0 |
| [Flörsheim am Main](https://www.loni-galabau.de/gartenbau-floersheim) | 200 | ok | ja | 0 |
| [Hochheim am Main](https://www.loni-galabau.de/gartenbau-hochheim) | 200 | ok | ja | 0 |
| [Frankfurt-Höchst](https://www.loni-galabau.de/gartenbau-frankfurt-hoechst) | 200 | ok | ja | 0 |
| [Bad Soden am Taunus](https://www.loni-galabau.de/gartenbau-bad-soden) | 200 | ok | ja | 0 |
| [Sulzbach (Taunus)](https://www.loni-galabau.de/gartenbau-sulzbach-taunus) | 200 | ok | ja | 0 |
| [Eschborn](https://www.loni-galabau.de/gartenbau-eschborn) | 200 | ok | ja | 0 |

### Befunde auf der übrigen Website und Einordnung

| Schweregrad / Typ | Betroffene URL | Tatsächlicher Messwert | Einordnung / nächster sinnvoller Schritt |
| --- | --- | --- | --- |
| warning / `thin-content` | `/jobs` | 145 Wörter laut Crawl | Bei nächster Pflege auf hilfreiche Informationen für Bewerber prüfen. Die pauschale Wortgrenze ist kein Beleg für schlechte Rankings; keine Texte nur für eine Wortzahl ergänzen. |
| info / `noindex-page` | `/login` | Meta `noindex,nofollow`, Header `noindex, nofollow` | Beabsichtigter Schutz des Admin-Einstiegs; beibehalten. |
| info / `slow-response` | `/ratgeber/pflasterarbeiten-kosten-einfahrt` | 1.634 ms | Einzelne Crawl-Antwort; bei wiederholt langsamen Antworten gezielt Server-/Cache-Verhalten prüfen. |
| info / `slow-response` | `/agb` | 1.906 ms | Einzelne Crawl-Antwort; kein Lighthouse- oder Core-Web-Vitals-Wert. |
| info / `slow-response` | `/downloads/fll-ztv-wegebau.pdf` | 1.526 ms | Antwort eines PDF-Downloads, keine HTML-Seite; separat von den Ortsseiten bewerten. |
| info / `title-too-long` | `/einsatzgebiete` | 62 Zeichen | OpenSEO-Zeichengrenze überschritten. Bei nächster Titelpflege Lesbarkeit prüfen; 62 Zeichen beweisen keine tatsächliche Abschneidung in jeder Google-Darstellung. |
| info / `title-too-long` | `/jobs/landschaftsgaertner-m-w-d` | 67 Zeichen | Bei nächster Titelpflege eine kürzere, weiterhin verständliche Fassung prüfen. |

Die Tool-Wortzahlen beziehen sich auf den gecrawlten Seiteninhalt einschließlich wiederkehrender Seitenelemente. Aus den Einzelantwortzeiten entsteht keine allgemeine Performancebewertung. Der Audit verursachte keine weitere Keywordabfrage und verwendete kein Lighthouse. Er bestätigte technische Abrufbarkeit und die gemeldete Indexierbarkeit; eine tatsächliche Google-Indexierung, Rankings, Anfragewirkung und vollständige visuelle oder Formularprüfung sind damit nicht gemessen.

Die Audit-Rohantworten liegen privat außerhalb des Website-Repositorys im selben lokalen Aufgabenordner: `06-audit-start.json`, `07-audit-status.json`, `08-audit-issues.json`, `09-audit-pages.json`. `live-sitemap.xml` dokumentiert den tatsächlichen Sitemap-Abruf; `10-audit-verification.json` enthält den URL-Abgleich. Es wurde keine Automation eingerichtet und keine weitere Website-Datei für diesen Audit geändert.
