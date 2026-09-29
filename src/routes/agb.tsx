import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/site/PageShell";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "Vertragsinformationen – Loni GalaBau GmbH" },
      {
        name: "description",
        content: "Informationen zu Anfrage, Angebot und Zusammenarbeit mit Loni GalaBau.",
      },
    ],
  }),
  component: AGBPage,
});

const SECTIONS = [
  {
    h: "Ihre Anfrage",
    p: "Eine Nachricht über unsere Website oder den Gartenplaner dient der ersten Abstimmung. Sie ist noch keine Beauftragung einer Bau- oder Pflegeleistung.",
  },
  {
    h: "Angebot und Leistungsumfang",
    p: "Nach der Klärung des Vorhabens erhalten Sie ein individuelles Angebot. Umfang, Materialien, Preise und Termine werden darin beziehungsweise im Vertrag konkret vereinbart. Angaben aus dem Gartenplaner müssen vor der Ausführung geprüft werden.",
  },
  {
    h: "Vertragliche Grundlagen",
    p: "Für eine Beauftragung gelten die jeweils getroffenen vertraglichen Vereinbarungen und die gesetzlichen Bestimmungen. Diese Seite legt keine zusätzlichen Allgemeinen Geschäftsbedingungen fest.",
  },
];

function AGBPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Rechtliches"
        title={
          <>
            Informationen zur <span className="italic font-light">Zusammenarbeit</span>
          </>
        }
        lead="Von der ersten Anfrage zum abgestimmten Angebot."
      />
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto grid gap-6">
          {SECTIONS.map((s, i) => (
            <article key={s.h} className="bg-surface rounded-3xl p-7 md:p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-xl md:text-2xl text-brand">{s.h}</h2>
              </div>
              <p className="mt-4 text-foreground/75 leading-relaxed">{s.p}</p>
            </article>
          ))}
          <p className="text-xs text-foreground/50 text-center pt-4">Stand: 29. September 2026</p>
        </div>
      </section>
    </PageShell>
  );
}
