# Website-Start: Umsetzung des Audits

Stand: 29.09.2026. Zieladresse: **https://www.loni-galabau.de**.
Die Projektadresse bleibt bis zum geprüften DNS-Wechsel erreichbar. Ein technischer
Test ersetzt weder die geschäftliche Freigabe von Aussagen noch die Prüfung der
tatsächlich abgeschlossenen Dienstleisterverträge.

## Inhalte und Gestaltung

- „Seit 2011 im Garten- und Landschaftsbau tätig“ ist bestätigte Branchenerfahrung,
  keine Behauptung über das Gründungsjahr der GmbH.
- Hersteller-/Siegelboxen einschließlich „Innung GaLaBau, Mitglied seit 2010“ ersetzt:
  Partner Creditreform, Mitglied SVLFG, Partner im Fachverband mit gelieferten SVGs.
- Unbelegte Bewertungen, Auszeichnungen, Beschäftigtenzahlen, Meister-/Studienabschlüsse,
  Jahreschronik und pauschale Garantie-/Preisversprechen entfernt oder neutralisiert.
- Hero-Motiv erhalten. Kontraste verbessert; Vergleichsregler per Tastatur bedienbar.
- Projektgalerien besitzen eigene SSR-Seiten, Breadcrumbs und Links zur passenden
  Leistung. Sie bleiben als Zusammenstellungen beschrieben. Für ausführliche
  Einzelreferenzen fehlen noch freigegebene Orts-, Bauzeit- und Leistungsangaben.

## Status der 25 Auditpunkte

| ID | Umsetzung / verbleibende Abhängigkeit |
| --- | --- |
| SEO-01 | Neun alte Framer-Pfade und Schrägstrichvarianten werden permanent weitergeleitet. www-Zieldomain im Hosting registriert; DNS und HTTPS-Apex-Weiterleitung noch ausstehend. |
| SEO-02 | Canonicals und Social-URLs auf www; Projektlink und geschützte Routen mit noindex. |
| SEO-03 | robots.txt und dynamische XML-Sitemap einschließlich aktiver Referenzgalerien. |
| SEO-04 | Unternehmensschema korrigiert; Service, BreadcrumbList und JobPosting ergänzt. |
| SEO-05 | Firmenmotiv für Social-Vorschau, echte Stellenbezeichnung und individuelle Metadaten. |
| SEO-06 | Technische DB-Ausfälle liefern 503; tatsächlich fehlende Inhalte 404. |
| GEO-01 | Crawlbare Referenzgalerien und fachlich bereinigte Antworten. Aussagekräftige Einzelprojektberichte benötigen bestätigte Projektdaten. Keine erfundenen Referenzorte oder Ergebnisse. |
| PERF-01 | Lokale variable WOFF2-Schriften, Font-Preload, priorisiertes Hero-Bild und serverseitige Bildkonfiguration. Messwerte nach Veröffentlichung separat prüfen. |
| PERF-02 | Cache-Regeln für Assets, Fonts und Bilder ergänzt. Tatsächliche Auslieferung des Hosting-Randes prüfen. |
| RENDER-01 | Kontaktinhalt schon im SSR sichtbar; öffentliche Bildkonfiguration und Query-Cache beim Hydrieren übernommen. |
| INHALT-01 | Unbelegte Testimonials, Siegel und pauschale Qualifikationen entfernt; vom Betreiber bestätigte Logos eingesetzt. Nutzungsrechte/Nachweise beim Betrieb ablegen. |
| INHALT-02 | 2011 als Branchenerfahrung vereinheitlicht, Ansprechpartnerbild berichtigt, unbelegte Versprechen neutralisiert. |
| DS-01 | Hinweise auf tatsächliche Hosting-, DB-, Mail-, Upload- und Entwurfsverarbeitung angepasst. Verträge, Transfergrundlagen und organisatorische Speicherfristen durch Betreiber prüfen. |
| DS-02 | Google-Fonts-Aufruf und automatisch geladene Karten entfernt; Wegbeschreibung ist ein externer Link. |
| DS-03 | Tracking einschließlich eigener Skripte vorerst vollständig deaktiviert und serverseitig gegen Aktivierung gesperrt. Spätere Einführung braucht getesteten Consent mit Widerruf. |
| DS-04 | Unvollständigen Newsletter deaktiviert. |
| DS-05 | Veraltete TMG/RStV/OS-Verweise bereinigt; ungeprüfte AGB durch neutrale Vertragsinformationen ersetzt. Verbraucherschlichtungsangabe und mögliche Pflichtangaben rechtlich bestätigen. |
| DS-06 | Adminnotizen serverseitig mit Versionsschutz; ausdrückliche Löschfunktion für Vorgang und private Anhänge. Betrieb muss zusätzlich Postfach, Exporte und Backups im Löschprozess berücksichtigen. |
| SEC-01 | Atomare DB-Quoten vor Formularspeicherung/Uploads, HMAC statt roher IP; CSRF-Schutz für Serverfunktionen. |
| SEC-02 | Gezielte Paketupdates und kompatible Overrides; npm-Audit ohne bekannte Meldungen. npm/package-lock.json ist die verbindliche Installation, veralteten bun.lock entfernt. |
| SEC-03 | Passwortwechsel und TOTP-Einrichtung im Adminbereich; aktivierte Faktoren auch serverseitig erzwungen. Jeder Kontoinhaber muss selbst aktivieren und sein Passwort setzen. Früher im Chat geteilten Resend-Key eindeutig identifizieren und widerrufen; nicht beliebig andere Integrationsschlüssel löschen. Leaked-Password-Schutz im Supabase-Konto prüfen/aktivieren, soweit der Tarif es erlaubt. |
| SEC-04 | CSP, nosniff, Frame-Schutz, Referrer-/Permissions-Policy, HSTS und private No-Store-Regeln. CSP lässt für Framework-Hydrierung Inline-Skripte zu; kein Anspruch auf vollständigen XSS-Schutz allein durch diesen Header. |
| OPS-01 | Signierte Resend-Zustellereignisse und erneuter Versand noch nicht angenommener Mails; Status im Adminbereich. Backup-/Restore-Probe und unabhängiger Betriebsalarm benötigen getrennte Betriebsfreigabe bzw. eine isolierte Wiederherstellungsumgebung. |
| UX-01 | Serviceformular mit Labels, Fehleransage und Autocomplete; Vergleichsregler mit Tastaturbedienung; wichtige Texte kontrastreicher. |
| UX-02 | Technische Verbesserungen umgesetzt. BFSG-Anwendbarkeit bleibt anhand des konkreten Geschäftsmodells und der Unternehmensgröße zu bestimmen. |

## E-Mail-Betrieb

Alle Formularmeldungen gehen an **webseite@loni-galabau.de**. Es gibt keine automatische
Kundenantwort und keinen KI-E-Mail-Bot; dieses separate Vorhaben bleibt zurückgestellt.

Resend-Webhooks liefern delivered, bounced, complained, failed und delivery_delayed.
Die Anwendung prüft Signatur und Zeitstempel am unveränderten Request-Body.
Gespeichert werden nur Mail-ID, Status und Ereigniszeit, keine Event-Kopie mit Adressen.
Spätere Verzögerungsereignisse überschreiben keinen endgültigen Zustellstatus.
„Von Resend angenommen“ ist getrennt von „zugestellt“; die Zustellung sagt nichts
darüber aus, ob ein Mensch die Nachricht gelesen hat oder der Spamfilter sie sortiert.

Der geschützte Wiederholungsendpunkt bearbeitet pro Aufruf maximal je einen Vorgang
aus Kontaktanfragen und Bewerbungen, der seit mindestens zwei Minuten wartet und
höchstens 23 Stunden alt ist. Der kurze Zeitraum bleibt innerhalb des
[Resend-Idempotenzfensters](https://resend.com/docs/dashboard/emails/idempotency-keys).
Ältere offene Vorgänge manuell prüfen; vor einem späteren Neuversand anhand der
Vorgangsnummer im Resend-Protokoll ausschließen, dass die Mail bereits angenommen wurde.
Bounce/Spam nicht blind erneut versenden.

Secrets stehen ausschließlich in ignorierten lokalen .env-Dateien bzw. Sites/Vault.
Der Cron-Bearer darf nur für diesen Endpunkt eingesetzt werden. Alle fünf Minuten
ruft pg_cron eine private Routine in website_ops auf. Diese liest das Secret aus
Vault und sendet es synchron mit der HTTP-Extension, ohne es in einer Request-Queue
zu speichern. Die Routine ist Browserrollen entzogen. Das vorübergehend vorbereitete
pg_net wurde wieder entfernt, weil dessen providerseitige Queue-Berechtigungen
nicht wirksam eingeschränkt werden konnten. Bei HTTP-Timeouts wird der Cronlauf
als fehlgeschlagen protokolliert; erneuter Versand bleibt idempotent.
RLS ohne Lesepolicy ist für interne
Tabellen absichtlich eine vollständige Zugriffssperre; keine öffentlichen Policies
ergänzen, um den entsprechenden Info-Hinweis „loszuwerden“.

## Domainwechsel – vorbereitet, noch nicht ausgeführt

Am DNS-Anbieter der Zone loni-galabau.de einzutragen:

| Typ | Vollständiger Name | Wert |
| --- | --- | --- |
| TXT | _openai-site-verification.www.loni-galabau.de | openai-site-verification=abXuxxCr0xcwWT2iY6FbbdBGfHxQPeGZS5pUh_De5jA |
| TXT | _cf-custom-hostname.www.loni-galabau.de | 0d0e0f0f-2d4d-4470-807d-c8b51468cb70 |
| CNAME | www.loni-galabau.de | custom-domains.chatgpt.site. |

Die TXT-Nachweise können vorab erfolgen. CNAME erst zum vereinbarten Wechselzeitpunkt
setzen, wenn die Zertifikatsbereitstellung geprüft ist. Vorhandene www-A/AAAA/CNAME-
Konflikte gezielt ersetzen. **MX, SPF, DKIM und DMARC erhalten**: Die Website-Umstellung
darf Microsoft-365-/Resend-E-Mail nicht verändern.

Die nackte Domain loni-galabau.de braucht weiterhin ein gültiges Zertifikat und eine
permanente Weiterleitung zu www; allein der www-CNAME stellt das nicht sicher.
Der neue Anwendungscode leitet den Apex-Host weiter, sofern dieser tatsächlich beim
neuen Hosting ankommt. Apex-Hosting/Weiterleitungsdienst gesondert konfigurieren.

Nach DNS-Wechsel: TLS und HTTP→HTTPS prüfen, neun alte Pfade ablaufen, Canonical und
Indexierbarkeit unter www prüfen, Sitemap in Google Search Console und Bing
Webmaster Tools einreichen. SITE_ADMIN_ORIGIN auf https://www.loni-galabau.de setzen
und erneut deployen; danach Webhook-/Cron-URL passend umstellen, Projektlink vorerst erhalten.

## Verantwortliche Schritte vor endgültiger Freigabe

1. Kontoinhaber: im Adminbereich eigenes Passwort und Authenticator einrichten.
   Verlorener zweiter Faktor wird nur über den berechtigten Supabase-Administrator
   zurückgesetzt; zweiten Adminzugang separat absichern.
2. Betreiber: geteilten Resend-Schlüssel widerrufen und nötigenfalls durch einen
   auf Versand der verifizierten Domain beschränkten Schlüssel ersetzen.
3. Betreiber/Datenschutzberatung: Dienstleisterverträge, Transfergrundlagen,
   rechtliche Pflichtangaben, BFSG und verbindliches Löschkonzept freigeben.
4. Betrieb: Supabase-Postgres-Patchstand prüfen. Vor einem Upgrade nachvollziehbare
   Sicherung von DB **und Storage-Dateien** erstellen und Wiederherstellung isoliert
   testen. Ein Git-Commit sichert weder Kundenanfragen noch hochgeladene Dateien.
5. Monatliche Löschprüfung: abgeschlossene Vorgänge anhand des Zwecks und verbindlicher
   Fristen prüfen; rechtlich aufzubewahrende Geschäftsunterlagen in geeigneter Ablage
   behalten. Website-Löschung im Admin ausdrücklich bestätigen, zugehörige E-Mails
   und Exporte ebenfalls prüfen. Backups nur nach ihrem gesonderten Ablauf bereinigen.
6. Betriebsalarm auf einer unabhängigen Strecke einrichten; ein ausgefallener Maildienst
   kann seinen eigenen Ausfall nicht zuverlässig per E-Mail melden. Bis dahin offene
   und fehlgeschlagene Zustellungen im Admin regelmäßig kontrollieren.

## Prüfnachweise

- Automatisierte Tests: Authentifizierung/Rollen, MFA, Upload-Signaturen und Größen,
  Formulardaten, strukturierte Mails, Quoten, Entwurfsdatenschutz, SEO/HTTP-Policy,
  Webhook-Signaturen und Replay-Abweisung.
- TypeScript, gezielter ESLint und Client-/Cloudflare-Server-Build.
- Separater ursprünglicher Auditbericht und neue Live-Prüfprotokolle liegen außerhalb
  des veröffentlichten Quellcodes im Ordner SEO-Audit-2026-09-29.

Weiterführend:
[Passwortschutz](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection),
[RLS-Infohinweis](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy),
[Postgres-Sicherheitsupdate](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes).
