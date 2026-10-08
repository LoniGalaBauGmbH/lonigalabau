import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Check, MoveUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { PartnerApplicationForm } from "@/components/site/PartnerApplicationForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import founder from "@/assets/about-founder-valon.webp";
import { publicImageUrl } from "@/lib/public-image-url";
import "@/components/site/PartnerPage.css";

export const Route = createFileRoute("/partner-werden")({
  head: () => ({
    meta: [
      { title: "Als Nachunternehmen bewerben | Loni GalaBau" },
      {
        name: "description",
        content:
          "Gute Arbeit. Starke Partner. Stellen Sie Ihren Betrieb, Ihre Leistungen und freien Kapazitäten vor. Als Nachunternehmen bei Loni GalaBau bewerben.",
      },
    ],
  }),
  component: PartnerPage,
});

const expectations = [
  [
    "01",
    "Handwerk, das überzeugt.",
    "Saubere Anschlüsse, passende Materialien und eine fachgerechte Ausführung – bis in den Unterbau.",
  ],
  [
    "02",
    "Ein Wort, auf das man baut.",
    "Absprachen einhalten, Änderungen rechtzeitig ansprechen und Fragen klären, bevor daraus Probleme werden.",
  ],
  [
    "03",
    "Verantwortung vor Ort.",
    "Sorgfalt im Umgang mit Menschen, Material und Maschinen. Eine organisierte Baustelle gehört für uns dazu.",
  ],
];
const faqs = [
  [
    "Welche Betriebe können sich bewerben?",
    "Diese Bewerbung richtet sich an selbstständige Unternehmen mit Firmensitz in Deutschland. Einzelunternehmen und Betriebe mit eigenen Beschäftigten können ihre Leistungen und Kapazitäten vorstellen.",
  ],
  [
    "Welche Leistungen und Einsatzgebiete sind interessant?",
    "Loni GalaBau ist deutschlandweit tätig. Wählen Sie Ihre Leistungen im Formular aus und beschreiben Sie Ihr Einsatzgebiet. Über „Sonstige“ können Sie weitere Arbeiten nennen. Welche Zusammenarbeit infrage kommt, prüfen wir persönlich.",
  ],
  [
    "Welche Unterlagen brauche ich für die Bewerbung?",
    "Für die Bewerbung bei Loni benötigen wir zwei gültige Nachweise Ihres Betriebs: die Freistellungsbescheinigung nach § 48b EStG und die Bescheinigung nach § 13b UStG (USt 1 TG). Bitte laden Sie beide als PDF mit jeweils maximal 10 MB hoch und geben Sie die Gültigkeitsdaten an. Die steuerliche Behandlung des konkreten Auftrags klären wir vor der Beauftragung. Weitere erforderliche Nachweise fordern wir erst im Zusammenhang mit einer möglichen Beauftragung an.",
  ],
  [
    "Was passiert nach dem Absenden?",
    "Sie erhalten eine Eingangsbestätigung mit einer kurzen Vorgangsnummer. Wir prüfen Ihre Angaben und melden uns zur weiteren Abstimmung. Die Bewerbung und ihre Bestätigung sind noch keine Aufnahmezusage oder Beauftragung.",
  ],
];

function PartnerPage() {
  return (
    <PageShell>
      <div className="partner-page">
        <section className="partner-hero partner-wrap" aria-labelledby="partner-title">
          <div className="partner-intro">
            <p className="partner-eyebrow">
              <span /> Nachunternehmen · Partner werden
            </p>
            <h1 id="partner-title">
              Gute Arbeit.
              <br />
              <em>Starke Partner.</em>
            </h1>
            <p className="partner-lead">
              Sie verstehen Ihr Handwerk. Wir möchten Ihren Betrieb kennenlernen.
            </p>
            <p className="partner-copy">
              Stellen Sie uns Ihre Leistungen und freien Kapazitäten vor. Für Projekte, bei denen
              die Qualität bis ins Detail stimmt.
            </p>
            <a className="partner-textlink" href="#unser-anspruch">
              Was uns verbindet <ArrowDown size={17} />
            </a>
          </div>
          <div className="partner-hero-form" id="partner-bewerbung">
            <PartnerApplicationForm />
          </div>
          <figure className="partner-team">
            <ProjectImage
              src="/images/projekte/loni-team-baustelle.webp"
              alt="Das Loni-Team auf einer Baustelle"
              width={1448}
              height={1086}
              loading="eager"
              sizes="(min-width: 1000px) 46vw, 100vw"
            />
            <figcaption>
              <span>Gemeinsam auf der Baustelle.</span>
              <span>
                Das Team von Loni <ArrowUpRight size={16} />
              </span>
            </figcaption>
          </figure>
        </section>
        <section
          id="unser-anspruch"
          className="partner-quality partner-wrap"
          aria-labelledby="quality-title"
        >
          <div className="partner-section-heading">
            <p className="partner-eyebrow">Unser Anspruch</p>
            <h2 id="quality-title">
              Qualität sieht man
              <br />
              <em>im Detail.</em>
            </h2>
            <p>
              Was am Ende gut aussieht, beginnt mit guter Arbeit. Darauf kommt es uns auch in der
              Zusammenarbeit an.
            </p>
          </div>
          <div className="partner-craft-grid">
            <figure className="partner-craft-main">
              <ProjectImage
                src="/images/projekte/natursteintreppe-in-der-bauphase.webp"
                alt="Natursteintreppe während der Bauphase"
                loading="lazy"
              />
              <figcaption>Vom Unterbau bis zum letzten Anschluss.</figcaption>
            </figure>
            <div className="partner-principles">
              {expectations.map(([number, title, copy]) => (
                <article key={number}>
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="partner-details">
            <figure>
              <ProjectImage
                src="/images/projekte/stauden-und-wege-im-stadtraum.webp"
                alt="Staudenbeete und Pflasterwege"
                loading="lazy"
              />
              <figcaption>Außenanlagen mit Struktur.</figcaption>
            </figure>
            <figure>
              <ProjectImage
                src="/images/projekte/holzterrasse-mit-sichtschutz.webp"
                alt="Holzterrasse mit Sichtschutz"
                loading="lazy"
              />
              <figcaption>Präzision in Material und Ausführung.</figcaption>
            </figure>
          </div>
        </section>
        <section className="partner-founder">
          <div className="partner-wrap partner-founder-grid">
            <div className="partner-portrait">
              <img
                src={publicImageUrl(founder)}
                width={830}
                height={1024}
                loading="lazy"
                decoding="async"
                alt="Valon Sinanaj, Geschäftsführer der Loni GalaBau GmbH"
              />
            </div>
            <div>
              <p className="partner-eyebrow">Die Menschen hinter Loni</p>
              <h2>
                Persönlich.
                <br />
                <em>Von Anfang an.</em>
              </h2>
              <p>
                Hinter Loni stehen Menschen, die Planung und Ausführung zusammenbringen. Seit 2011
                sind wir im Garten- und Landschaftsbau tätig – mit Firmensitz in Hattersheim am Main
                und Projekten in ganz Deutschland.
              </p>
              <p>
                Valon Sinanaj begleitet die Planung und Umsetzung. Gemeinsam klären wir, welche
                Arbeiten und Kapazitäten zu einer möglichen Zusammenarbeit passen.
              </p>
              <div className="partner-signature">
                <strong>Valon Sinanaj</strong>
                <span>Geschäftsführer · Loni GalaBau GmbH</span>
              </div>
              <a href="#partner-bewerbung" className="partner-founder-link">
                Ihren Betrieb vorstellen <MoveUpRight size={20} />
              </a>
            </div>
          </div>
        </section>
        <section className="partner-process partner-wrap">
          <div className="partner-section-heading">
            <p className="partner-eyebrow">Der nächste Schritt</p>
            <h2>
              Ein guter Anfang.
              <br />
              <em>Ein klarer Ablauf.</em>
            </h2>
          </div>
          <div className="partner-process-grid">
            {[
              [
                "01",
                "Betrieb vorstellen",
                "Sie nennen uns Ihre Leistungen, Kapazitäten und Ihr Einsatzgebiet. Ihre gültigen Nachweise nach § 48b EStG und § 13b UStG reichen Sie direkt mit ein.",
              ],
              [
                "02",
                "Angaben prüfen",
                "Wir sehen uns Ihre Bewerbung persönlich an. Falls für die weitere Prüfung etwas fehlt, melden wir uns bei Ihnen.",
              ],
              [
                "03",
                "Einsatz besprechen",
                "Wenn es passt, stimmen wir die nächsten Schritte ab. Weitere Nachweise und den konkreten Auftrag klären wir vor der Beauftragung.",
              ],
            ].map(([n, t, c]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{c}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="partner-finish">
          <div className="partner-wrap partner-finish-grid">
            <div>
              <p className="partner-eyebrow">Gut zu wissen</p>
              <h2>
                Alles klar?
                <br />
                <em>
                  Dann lernen wir
                  <br />
                  uns kennen.
                </em>
              </h2>
              <a href="#partner-bewerbung" className="partner-primary">
                Bewerbung starten <ArrowUpRight size={20} />
              </a>
              <p className="partner-finish-note">
                <Check size={16} /> Persönliche Prüfung. Klare nächste Schritte.
              </p>
            </div>
            <Accordion type="single" collapsible>
              {faqs.map(([q, a], i) => (
                <AccordionItem key={q} value={String(i)}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
