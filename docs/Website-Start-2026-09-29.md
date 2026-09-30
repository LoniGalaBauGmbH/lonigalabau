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

## Datenschutz-Nachprüfung am 30. September 2026

Der Betreiber hat bestätigt, dass AVV/DPA und verbindliche Löschfristen noch nicht
geprüft beziehungsweise festgelegt sind. Die folgenden technischen Prüfungen sind
keine vollständige rechtliche Freigabe.

### Geprüft und verbessert

- Vier lokale WOFF2-Schriften, kein Google-Fonts-Abruf; Schriftquellen per CSP auf
  die eigene Website begrenzt. Tracking-Einstellungen in der aktiven Datenbank leer,
  keine aktiven Analyse-/Werbeskripte. Karten und WhatsApp sind externe Links ohne
  eingebettete Drittanbieter-Widgets. Der Hosting-Schutz setzt das Cookie `__cf_bm`
  mit 30 Minuten Laufzeit; Datenschutzseite und Cookieinformationen nennen es jetzt.
- Öffentliche Bilder sind auf eigene Pfade und die beiden öffentlichen Bild-Buckets
  des eigenen Supabase-Projekts begrenzt (Validierung und CSP). Externe Links erhalten
  durch `Referrer-Policy: no-referrer` keine Herkunfts-URL. Die untersuchten 135 lokalen
  Rasterbilder enthielten keine EXIF-, XMP- oder IPTC-Metadaten. Künftige JPG-/PNG-/WebP-
  Fotos werden beim normalen Admin-Upload neu kodiert; SVG/GIF und direkte API-Uploads
  sind von dieser Browser-Neukodierung nicht erfasst.
- RLS für alle zehn Tabellen aktiv; private Anfragen, Bewerbungen, Zustellstatus und
  Quoten per öffentlicher REST-Anfrage nicht lesbar (HTTP 401). Browserrollen dürfen
  diese Tabellen nicht verändern. Bewerbungs- und Anfrage-Buckets bleiben privat;
  Administratoren erhalten kurzlebige Downloadlinks. Öffentliche Registrierung ist aus.
- Gäste können keine schon vorhandenen privaten Dateipfade an eine neue Anfrage
  hängen. Es werden ausschließlich neu validierte Uploads dieses Vorgangs gespeichert.
  Allgemeine Server-Fehlerprotokolle enthalten keine vollständigen Fehlerobjekte mehr.
- Gartenplaner-Entwürfe enthalten keine Kontakt-/Freitextdaten. Manipulierte, ungültige
  oder abgelaufene Entwürfe werden beim nächsten Öffnen entfernt. Sieben Tage sind die
  Wiederherstellungsfrist, kein versprochenes Hintergrund-Löschintervall im Browser.
- Neue Zustellstatus-Daten sind ihrem Vorgang zugeordnet. Die additive Migration
  `supabase/bootstrap/updates/privacy_delivery_cleanup.sql` wurde angewandt. Eine
  ausdrücklich ausgeführte Vorgangslöschung entfernt auch zugehörige Zustellstatus;
  verspätete Webhooks erzeugen sie nicht erneut. Alte Statuszeilen werden anhand der
  gespeicherten Provider-IDs ebenfalls bei der Vorgangslöschung bereinigt. Verknüpfung,
  terminale Status, beide Löschwege, späte Ereignisse und Rollen wurden mit synthetischen
  Daten in einer vollständig zurückgerollten Transaktion geprüft. Keine Kundendaten
  wurden bei dieser Prüfung gelöscht, keine Testmails versendet.
- Resend-Domain verifiziert, Versandregion eu-west-1, Öffnungs- und Klicktracking
  deaktiviert. Die API hat verpflichtendes TLS (`enforced`) für die Domain angenommen.
  Empfänger ohne TLS können dadurch nicht beliefert werden. Kein erneuter echter
  Zustelltest in dieser Datenschutzprüfung. Logo/Bild bleiben in Bestätigungsmails
  eingebettet; neue Mails konzentrieren sich auf Eingang und Bearbeitung des Vorgangs.

Die Kontaktseite wurde auf eine klare Kontaktspalte und ein Formular reduziert.
Anhänge, Pflichtfeldprüfung und Versand bleiben erhalten; zusätzliche Kontaktkarten,
die dekorative Kartenfläche und die doppelte Abschluss-Aufforderung entfallen.

### Noch vom Betreiber zu erledigen

1. **Verträge und Transfers:** Tatsächliche Vertragspartner und AVV/DPA für Sites/OpenAI,
   Supabase, Resend und Microsoft 365 dokumentieren; Unterauftragnehmer, Regionen,
   Drittlandtransfers und passende Garantien prüfen. Eine EU-Versandregion allein
   bedeutet nicht, dass sämtliche Verarbeitung ausschließlich in der EU erfolgt.
2. **Löschkonzept:** Zweckende, Fristen, Zuständigkeit und Ausnahmen für Anfragen,
   Bewerbungen, E-Mails, Anhänge, Exporte und Backups verbindlich festlegen. Als
   Arbeitsvorschlag: erledigte Anfragen ohne Auftrag nach sechs Monaten prüfen;
   abgelehnte Bewerbungen regelmäßig sechs Monate nach Abschluss löschen, soweit
   keine dokumentierte andere Rechtsgrundlage oder Rechtsverfolgung entgegensteht.
   Das ist keine pauschale gesetzliche Frist. Vertrags-/Buchhaltungsunterlagen getrennt
   nach den tatsächlich geltenden Aufbewahrungspflichten behandeln. Noch keine
   automatische Kundenlöschung aktiviert. Provider-Protokolle/Postfächer separat erfassen.
3. **Zugänge:** Beide Administratoren haben derzeit keinen verifizierten zweiten Faktor.
   Authenticator im Adminbereich einrichten. Supabase meldet weiterhin fehlenden
   Schutz gegen geleakte Passwörter; Verfügbarkeit im gebuchten Tarif prüfen und
   aktivieren. Rotation des früher geteilten Resend-Schlüssels ist nicht nachgewiesen.
4. **Patch und Wiederherstellung:** Live-Datenbankstand 17.6.1.166; Sicherheitsupdate
   auf den angebotenen aktuellen Stand nach DB-/Storage-Sicherung und Restore-Test
   planen. Das Upgrade wurde in diesem Arbeitsschritt nicht ausgeführt.
5. **Organisation:** Verarbeitungsverzeichnis, Betroffenenanfragen, Zugriffsrechte in
   Microsoft 365 und Nachweise zur Veröffentlichung von Mitarbeiter-/Projektfotos
   prüfen. Öffentlich angebotene Urkunden nochmals auf erforderliche Personenangaben
   prüfen; nicht alle Namen, geschäftlichen Kontaktdaten und Unterschriften sind geschwärzt.

### Hosting und Performance

Sites liefert die aktuelle Website über Cloudflare aus. Sechs einfache HTTP-Abrufe
aus der lokalen Verbindung ergaben für `/kontakt` 158–186 ms, `/datenschutz` 133–186 ms
und `/` 306 ms beim zweiten beziehungsweise 2.469 ms beim ersten Abruf bis zum ersten
Antwortbyte. Das ist eine kleine Momentaufnahme, keine Core-Web-Vitals-Messung und
kein belastbarer Anbieter-Vergleich. Verbindungsaufbau, Cache und Anwendung können
den ersten Abruf beeinflussen. Vercel und Netlify unterstützen TanStack Start; für
den dauerhaften Firmenbetrieb ist ein eigenes Hostingkonto organisatorisch sinnvoll.
Ein Wechsel garantiert keine bessere LCP/INP. DNS und Hosting wurden nicht geändert.

Quellen:
[Lokale Google-Fonts-Einbindung](https://datenschutz.hessen.de/datenschutz/internet-und-medien/google-fonts-abmahnungen),
[Cloudflare-Cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/),
[Resend TLS](https://resend.com/docs/dashboard/domains/tls),
[Resend DPA](https://resend.com/legal/dpa),
[Resend Tracking](https://resend.com/docs/dashboard/domains/tracking),
[Vercel TanStack Start](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel),
[Netlify TanStack Start](https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/).
