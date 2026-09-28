# Projektstand

Aktueller Stand und nächste Einrichtungsschritte:

- [README](README.md): Technik, Start und GitHub-Synchronisierung
- [Projektanalyse](PROJEKTANALYSE.md): ursprüngliche Prüfung und Nachtrag
- [Neue Datenbank](supabase/bootstrap/README.md): Schema, Inhaltsimport und Zugriffsregeln
- [Arbeitsregeln](AGENTS.md): fortlaufende Synchronisierung mit GitHub

Der Adminschutz und die Uploadvalidierung sind implementiert. Die neue
Supabase-Datenbank einschließlich privater Kundendateispeicher ist eingerichtet
und mit den öffentlichen Website-Inhalten befüllt. Der Secret Key, die beiden
angeforderten Admin-Konten und echte Login-/Uploadtests stehen noch aus.
Die aktive lokale Umgebung verweist bis zum geprüften Anschluss auf das alte Projekt.
Die bisherigen Angaben zu Demo-Modus, Schriftarten und öffentlichem Server-Key
waren veraltet und wurden durch diese Verweise ersetzt. Zugangsdaten gehören
in die lokale bzw. serverseitige Umgebung; als Vorlage dient [.env.example](.env.example).
