import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Leaf, Maximize2 } from "lucide-react";
import { documentImage, qualificationDocuments } from "@/lib/documents";
import { DocumentPreview } from "./DocumentPreview";
import "./RegionalProof.css";

const proofDocuments = qualificationDocuments.filter((document) =>
  ["llh-ausbilderanerkennung", "fll-ztv-wegebau"].includes(document.id),
);

export function RegionalProof() {
  const titleId = useId();

  return (
    <section id="fachnachweise" className="regional-proof" aria-labelledby={titleId}>
      <div className="regional-proof-wrap">
        <div className="regional-proof-heading">
          <span className="regional-proof-kicker">Erfahrung & Fachnachweise</span>
          <h2 id={titleId}>Fachwissen für Ihren Garten.</h2>
          <p>
            Für Terrassen, Wege und Pflanzflächen zählt die passende Ausführung. Lernen Sie die
            Erfahrung und die fachliche Grundlage unserer Arbeit kennen.
          </p>
        </div>

        <div className="regional-proof-grid">
          <article className="regional-proof-card regional-proof-experience">
            <Leaf size={26} strokeWidth={1.5} aria-hidden="true" />
            <span className="regional-proof-year">Seit 2011</span>
            <h3>Im Garten- und Landschaftsbau tätig</h3>
            <p>
              Wir besprechen Nutzung, Materialien und Pflege – damit Ihre Außenanlage zu Ihrem
              Alltag passt.
            </p>
            <Link to="/ueber-uns" className="regional-proof-link">
              Unseren Betrieb kennenlernen <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </article>

          {proofDocuments.map((document) => (
            <article key={document.id} className="regional-proof-card">
              <span className="regional-proof-category">{document.category}</span>
              <h3>{document.shortTitle}</h3>
              <p className="regional-proof-meta">
                {document.issuer} · {document.date}
              </p>
              <p>{document.description}</p>
              <DocumentPreview document={document}>
                <button
                  type="button"
                  className="regional-proof-document"
                  aria-label={`${document.title} ansehen`}
                >
                  <img
                    src={documentImage(document.id, true)}
                    alt=""
                    width={66}
                    height={93}
                    loading="lazy"
                  />
                  <span>
                    Nachweis ansehen <Maximize2 size={16} aria-hidden="true" />
                  </span>
                </button>
              </DocumentPreview>
            </article>
          ))}
        </div>

        <div className="regional-proof-footer">
          <Link to="/downloads" className="regional-proof-link">
            Alle Fachnachweise ansehen <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
