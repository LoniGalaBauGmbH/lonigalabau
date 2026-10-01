# KI-Assistent im Website-Admin

Stand 01.10.2026. Technische Umsetzung; keine pauschale Bestätigung rechtlicher Konformität.

## Bedienung

`/admin/assistent` verwaltet Kundenfälle, Verlauf, interne Notizen, Antwortentwürfe,
Besichtigungsvorbereitung, Export, Prüfdatum und Löschung. Website-Anfragen werden per
Fremdschlüssel verknüpft; Name und Ursprungsnachricht bleiben in `contact_requests`.
Zusätzliche E-Mails lassen sich manuell erfassen. Ein Assistentenfall zu löschen entfernt
nicht die ursprüngliche Website-Anfrage. Umgekehrt entfernt deren Löschung den verknüpften
Assistentenfall. Exporte sind lokale Dateien mit personenbezogenen Daten.

`/admin/wissensbank` verwaltet Textdokumente, Kategorien, Herkunft, Version und ausdrückliche
Freigabe. TXT/Markdown bis 200 KB lassen sich übernehmen. Keine Originaldateien werden
gespeichert; PDF-/Office-Extraktion und die Synchronisierung externer Ordner sind noch nicht
angebunden. Kundenakten gehören nicht in die allgemeine Wissensbank.
Neun Startdokumente aus acht öffentlichen Leistungsseiten und bestätigten Unternehmensangaben
wurden übernommen. Sie stehen zunächst als Entwurf zur fachlichen Prüfung bereit.

Die Suche nutzt deutsche PostgreSQL-Volltextsuche. Die KI kann bei einer Analyse bis zu
vier Suchschritte selbst wählen und verfeinern. Pro Suche werden maximal sechs passende,
begrenzte Textausschnitte übergeben. Es gibt kein behauptetes Training eines eigenen Modells
und keinen externen Vektorspeicher. KI-Zitate nennen Quelle und Version.

## Technische Schutzmaßnahmen

- Vor jedem neuen RPC: gültiger Auth-Servernachweis, aktuelle Adminrolle und zwingend AAL2.
  MFA wird im vorhandenen Dashboard unter Kontosicherheit eingerichtet. Die MFA-Pflicht
  für den Assistenten kann nicht durch einen Browserparameter umgangen werden.
- Private Tabellen mit RLS, ohne SELECT-/Schreibrechte für `anon`/`authenticated`.
  Auch Such- und Abschlussfunktionen sind ausschließlich serverseitig ausführbar.
- Service-/KI-Schlüssel liegen nur in Servervariablen. Keine Kundendaten in LocalStorage,
  öffentlichen Assets oder geteilten Inhaltscaches. Private Antworten haben `no-store`;
  keine Suchmaschinenindexierung, kein Framing, vorhandener CSRF-Schutz.
- Inhalte werden als Text dargestellt. Die KI kann weder HTML ausführen, Links öffnen,
  Anhänge lesen, andere Kundenfälle abfragen, Nachrichten versenden noch Termine buchen.
- Pflicht zur Inhaltsprüfung vor jedem KI-Lauf. SHA-256-Fingerprint bindet die Bestätigung
  an den angezeigten Kontakt, Verlauf und die Notizen. Kontaktänderung vor Übermittlung
  bricht ab; Änderung während der Analyse verhindert die Speicherung.
- Pro Fall maximal ein laufender Aufruf, mindestens 60 Sekunden Abstand, maximal fünf
  API-Anfragen mit je 45 Sekunden Zeitlimit. Datenmengen und strukturierte KI-Ausgabe begrenzt.
- Optimistische Versionssperren; KI-Abschluss prüft Fall und sämtliche gelesenen
  Quellenversionen/Freigaben atomar. Manuell bearbeitete Entwürfe bleiben erhalten.
  Alte Analysen/Entwürfe werden nicht als neuer KI-Kontext weitergereicht.
- Protokoll enthält nur Ereignis, Akteur, Entität und Zeitpunkt, keine Inhaltstexte.
  Löschung einer Entität entfernt deren Auditverweise. Quellen werden in Analysen
  nur referenziert, nicht noch einmal als Volltext gespeichert. Änderungen machen ältere
  Analysen sichtbar veraltet; vorhandene Entwürfe müssen anschließend geprüft werden.
- Aufbewahrungs-Prüfdatum und manuelle Löschung statt ungeklärter automatischer Fristen.
  Backups, Providerlogs und bereits exportierte Dateien benötigen getrennte Löschregeln.

## Letzter Einrichtungsschritt – derzeit offen

Outlook, OneDrive und Firmenserver sind nicht verbunden. Auch produktive KI-Verarbeitung
bleibt bis zur Einrichtung deaktiviert. Keine echten Kundeninhalte wurden zu Testzwecken
an ein Sprachmodell gesendet; die KI-Tests ersetzen den späteren Anbieterfunktionstest nicht.

Für die spätere Freigabe serverseitig setzen:

| Variable | Zweck |
| --- | --- |
| `LONI_AI_ENABLED=true` | technische Aktivierung |
| `LONI_AI_PROCESSING_APPROVED=true` | dokumentierte betriebliche Verarbeitungserlaubnis |
| `LONI_AI_REGION=eu` oder `global` | fest erlaubter API-Endpunkt, keine freie URL |
| `OPENAI_API_KEY` | eigener Projektzugang, ausschließlich Serversecret |
| `OPENAI_MODEL` | im Projekt verfügbares, geprüftes Responses-Modell |

Die Freigabevariablen ersetzen keine tatsächliche Datenschutzentscheidung. Vor Aktivierung
Verantwortliche und berechtigte Mitarbeiter bestimmen, Rechtsgrundlage/Zwecke dokumentieren,
Auftragsverarbeitungsvereinbarungen und Unterauftragnehmer für Datenbank/Hosting/KI prüfen,
Informationspflichten aktualisieren, notwendige Datenübermittlungen bewerten und Lösch- sowie
Backupfristen festlegen. EU-Datenregion muss im Anbieterprojekt passend eingerichtet und
für Modell/Endpunkt unterstützt sein; ein EU-Hostname allein beweist keine EU-Verarbeitung.

An die KI gehen Betreff, relevanter Nachrichtenverlauf, Notizen und freigegebene Wissensauszüge.
Separate Kontaktfelder/Anhänge sind ausgeschlossen; Freitext kann weiterhin Namen und andere
personenbezogene Angaben enthalten. Es gibt keine Zusicherung automatischer Anonymisierung.
Die Responses-API verwendet `store:false`, keine gespeicherten Conversations, keine
Remote-Tools und keine Dokumentuploads. Das ist keine Zusicherung von Zero Data Retention:
Anbieterlogs und sonstige Datenkontrollen sind separat zu prüfen.
[Aktuelle OpenAI-Datenkontrollen](https://developers.openai.com/api/docs/guides/your-data).

Grundlagen: [DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj),
[Supabase MFA](https://supabase.com/docs/guides/auth/auth-mfa),
[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Migration und Prüfungen

Inkrementelle Migration `assistant_private_workspace`, Quelldatei
`supabase/bootstrap/updates/assistant_workspace.sql`; im aktiven EU-Projekt am 01.10.2026
angewandt. Bootstrap und historische Migrationen nicht erneut ausführen.

`node --test tests/*.test.mjs`: echte Anwendungsmodule mit simulierten Auth-/DB-/KI-Grenzen.
`node scripts/check-assistant-workspace.mjs PFAD_ZU_PGLITE_DIST_INDEX_JS`:
22 PostgreSQL-Prüfgruppen ohne Netzwerk, darunter echte Rechte und Transaktionen.
Cloud-Grants/RLS und service_role-Schreibwege zusätzlich mit zurückgerollten synthetischen
Daten geprüft. Browser-/Veröffentlichungsnachweise stehen im Projektgedächtnis.

Security Advisor am 01.10.2026: keine Tabellen-/RPC-Freigabe an Browserrollen;
„RLS enabled, no policy“ ist für die serverseitigen privaten Tabellen beabsichtigt.
Offene bestehende Anbieterwarnung: **Leaked Password Protection Disabled**.
Die zusätzliche Prüfung kompromittierter Passwörter muss in den Auth-Einstellungen
konfiguriert werden und ist laut Anbieter ab Pro verfügbar. Kein Tarifwechsel vorgenommen.
MFA ist für sämtliche Assistentenfunktionen trotzdem zwingend.
[Supabase Passwortschutz](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
