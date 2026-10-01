import { Link } from "@tanstack/react-router";
import { ProjectImage } from "./ProjectImage";
import type { GuideSummary } from "@/lib/guide-index";

export function GuideCard({ article }: { article: GuideSummary }) {
  return (
    <article className="guide-card">
      <Link to="/ratgeber/$slug" params={{ slug: article.slug }} className="guide-card-link">
        <div className="guide-card-image">
          <ProjectImage
            src={article.image}
            alt={article.imageCaption}
            width={1200}
            height={900}
            loading="lazy"
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        </div>
        <div className="guide-meta">
          <span>{article.category}</span>
          <span>{article.readingMinutes} Min. Lesezeit</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <span className="guide-read">Ratgeber lesen</span>
      </Link>
    </article>
  );
}
