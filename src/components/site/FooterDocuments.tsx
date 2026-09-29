import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { DocumentPreview } from "./DocumentPreview";
import { documentImage, qualificationDocuments } from "@/lib/documents";

export function FooterDocuments() {
  return (
    <section aria-labelledby="footer-documents-title" className="mx-auto max-w-7xl px-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-8">
        <h2 id="footer-documents-title" className="text-sm font-semibold">
          Qualifikation zum Nachlesen.
        </h2>
        <Link
          to="/downloads"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-brand-foreground/80 transition-colors hover:text-accent"
        >
          Alle Downloads <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {qualificationDocuments
          .filter((doc) => doc.featured)
          .map((doc) => (
            <DocumentPreview document={doc} key={doc.id}>
              <button
                type="button"
                aria-label={`${doc.title} ansehen`}
                className="group flex min-w-0 items-center gap-3 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <img
                  src={documentImage(doc.id, true)}
                  alt=""
                  width={48}
                  height={68}
                  loading="lazy"
                  className="h-[68px] w-12 shrink-0 rounded-sm bg-white object-contain shadow-sm transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transform-none"
                />
                <span className="min-w-0 hyphens-auto [overflow-wrap:anywhere]">
                  <span className="block text-xs font-semibold leading-relaxed transition-colors group-hover:text-accent">
                    {doc.issuer}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-brand-foreground/65">
                    {doc.shortTitle}
                  </span>
                </span>
              </button>
            </DocumentPreview>
          ))}
      </div>
    </section>
  );
}
