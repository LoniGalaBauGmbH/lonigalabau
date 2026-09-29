import { createFileRoute } from "@tanstack/react-router";
import { Download, Maximize2 } from "lucide-react";
import { PageIntro, PageShell } from "@/components/site/PageShell";
import { DocumentPreview } from "@/components/site/DocumentPreview";
import { documentFile, documentImage, qualificationDocuments } from "@/lib/documents";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads & Qualifikationen – Loni GalaBau GmbH" },
      {
        name: "description",
        content:
          "Ausbilderanerkennung, Präqualifikation und Weiterbildungsnachweise von Loni GalaBau: Dokumente ansehen und als PDF herunterladen.",
      },
    ],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const categories = ["Ausbildung", "Fachliche Nachweise", "Arbeitsschutz"] as const;
  return (
    <PageShell>
      <PageIntro
        eyebrow="Dokumente & Nachweise"
        title={
          <span className="block text-[clamp(2rem,8vw,3rem)] md:text-[inherit]">
            Qualifikation.
            <br />
            <span className="font-light italic">Schwarz auf weiß.</span>
          </span>
        }
        lead="Hier finden Sie unsere Bescheinigungen und Weiterbildungsnachweise. Direkt ansehen oder als PDF für Ihre Unterlagen herunterladen."
      />
      <div className="mx-auto max-w-7xl px-6 pb-8">
        <nav aria-label="Dokumentkategorien" className="mb-12 flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <a
              key={category}
              href={`#dokumente-${index}`}
              className="rounded-full bg-brand/5 px-5 py-3 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white"
            >
              {category}
            </a>
          ))}
        </nav>
        <div className="space-y-16">
          {categories.map((category, index) => (
            <section
              key={category}
              id={`dokumente-${index}`}
              aria-labelledby={`dokumenttitel-${index}`}
              className="scroll-mt-32"
            >
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm text-brand/45" aria-hidden="true">
                  0{index + 1}
                </span>
                <h2
                  id={`dokumenttitel-${index}`}
                  className="text-2xl font-semibold tracking-tight text-brand md:text-3xl"
                >
                  {category}
                </h2>
              </div>
              <div className="divide-y divide-brand/10">
                {qualificationDocuments
                  .filter((doc) => doc.category === category)
                  .map((doc) => (
                    <article
                      key={doc.id}
                      className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-x-5 gap-y-4 py-7 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-x-7 lg:grid-cols-[88px_minmax(0,1fr)_auto] lg:items-center"
                    >
                      <DocumentPreview document={doc}>
                        <button
                          type="button"
                          aria-label={`${doc.title} als Vorschau öffnen`}
                          className="group relative rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                        >
                          <img
                            src={documentImage(doc.id, true)}
                            alt=""
                            width={88}
                            height={124}
                            loading="lazy"
                            className="aspect-[210/297] w-full rounded-sm bg-white object-contain shadow-md transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transform-none"
                          />
                          <span className="absolute -bottom-2 -right-2 grid size-7 place-items-center rounded-full bg-brand text-white">
                            <Maximize2 className="size-3" aria-hidden="true" />
                          </span>
                        </button>
                      </DocumentPreview>
                      <div>
                        <p className="mb-2 text-xs font-medium text-brand/60">
                          {doc.issuer} · {doc.date}
                        </p>
                        <h3 className="text-lg font-semibold leading-snug text-brand md:text-xl">
                          {doc.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand/75">
                          {doc.description}
                        </p>
                      </div>
                      <div className="col-start-2 flex flex-wrap items-center gap-3 lg:col-start-3 lg:ml-5 lg:flex-col lg:items-stretch">
                        <a
                          href={documentFile(doc.id)}
                          download={`Loni-GalaBau-${doc.id}.pdf`}
                          aria-label={`${doc.title} als PDF herunterladen`}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand/90"
                        >
                          <Download className="size-4" aria-hidden="true" /> PDF herunterladen
                        </a>
                        <DocumentPreview document={doc}>
                          <button
                            type="button"
                            aria-label={`${doc.title} ansehen`}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-brand transition-colors hover:bg-brand/5"
                          >
                            Ansehen <Maximize2 className="size-3.5" aria-hidden="true" />
                          </button>
                        </DocumentPreview>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 max-w-3xl text-sm leading-relaxed text-brand/60">
          Die Unterlagen zeigen den jeweils angegebenen Ausstellungsstand. Persönliche Angaben, die
          für den Nachweis nicht erforderlich sind, wurden in den öffentlichen Kopien geschwärzt.
        </p>
      </div>
    </PageShell>
  );
}
