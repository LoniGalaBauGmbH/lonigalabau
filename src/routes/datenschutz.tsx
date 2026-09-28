import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { Shield, Cookie, Mail, Database, UserCheck, FileLock2 } from "lucide-react";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – Loni Galabau GmbH" },
      { name: "description", content: "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO bei der Loni Galabau GmbH." },
    ],
  }),
  component: DatenschutzPage,
});

function openCookies() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("loni:open-cookies"));
  }
}

const TOC = [
  { id: "verantwortlich", icon: UserCheck, t: "Verantwortlicher" },
  { id: "daten", icon: Database, t: "Verarbeitete Daten" },
  { id: "kontakt", icon: Mail, t: "Kontaktformular" },
  { id: "cookies", icon: Cookie, t: "Cookies" },
  { id: "rechte", icon: Shield, t: "Ihre Rechte" },
  { id: "sicherheit", icon: FileLock2, t: "Datensicherheit" },
];

function DatenschutzPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Rechtliches"
        title={<>Datenschutz<span className="italic font-light">erklärung</span></>}
        lead="Transparenz darüber, welche Daten wir wie und warum verarbeiten – nach den Regeln der DSGVO."
      />

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
          {/* TOC */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 bg-surface border border-brand/10 rounded-3xl p-6">
              <p className="text-xs uppercase tracking-widest text-foreground/60 mb-4">Inhalt</p>
              <ul className="space-y-1">
                {TOC.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-brand/5 transition">
                      <s.icon className="w-4 h-4 text-accent" />
                      <span>{s.t}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                onClick={openCookies}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand text-brand-foreground text-sm hover:bg-brand/90 transition"
              >
                <Cookie className="w-4 h-4" /> Cookie-Einstellungen
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-8 space-y-10">
            <Section id="verantwortlich" title="Verantwortlicher">
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist die Loni Galabau GmbH, Auf der Roos 3, 65795 Hattersheim am Main.
                Bei Fragen zum Datenschutz erreichen Sie uns unter <a href="mailto:info@loni-galabau.de" className="underline decoration-accent">info@loni-galabau.de</a>.
              </p>
            </Section>

            <Section id="daten" title="Verarbeitete Daten und Zwecke">
              <p>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.</p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li>Server-Logfiles (IP, Datum, Browser) – berechtigtes Interesse an Sicherheit (Art. 6 Abs. 1 lit. f DSGVO)</li>
                <li>Kontaktanfragen – zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Bewerbungsdaten – zur Durchführung des Bewerbungsverfahrens (§ 26 BDSG)</li>
              </ul>
            </Section>

            <Section id="kontakt" title="Kontaktformular und Bewerbungen">
              <p>
                Über unser Kontaktformular übermittelte Angaben (Name, E-Mail, Telefon, Nachricht) verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage.
                Eine Weitergabe an Dritte erfolgt nicht. Die Daten werden gelöscht, sobald sie für den Verarbeitungszweck nicht mehr erforderlich sind.
              </p>
            </Section>

            <Section id="cookies" title="Cookies und Reichweitenmessung">
              <p>
                Wir setzen technisch notwendige Cookies ein, um Grundfunktionen der Website zu gewährleisten. Optionale Cookies (Statistik, Marketing)
                werden nur mit Ihrer ausdrücklichen Einwilligung über unseren Cookie-Banner aktiviert. Sie können Ihre Einwilligung jederzeit widerrufen.
              </p>
              <button
                onClick={openCookies}
                className="mt-4 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-brand/20 hover:bg-brand/5 transition"
              >
                <Cookie className="w-4 h-4 text-accent" /> Einstellungen öffnen
              </button>
            </Section>

            <Section id="rechte" title="Ihre Rechte">
              <p>Ihnen stehen folgende Rechte zu:</p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li>Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
              </ul>
            </Section>

            <Section id="sicherheit" title="Datensicherheit">
              <p>
                Diese Website nutzt eine SSL-/TLS-Verschlüsselung zum Schutz der Übertragung vertraulicher Inhalte. Wir treffen darüber hinaus
                technische und organisatorische Maßnahmen, um Ihre Daten gegen Manipulation, Verlust oder unberechtigten Zugriff zu sichern.
              </p>
            </Section>

            <p className="text-xs text-foreground/50 pt-4">Stand: {new Date().getFullYear()}</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <article id={id} className="scroll-mt-28">
      <h2 className="font-serif text-2xl md:text-3xl text-brand">{title}</h2>
      <div className="mt-4 text-foreground/80 leading-relaxed space-y-2">{children}</div>
    </article>
  );
}
