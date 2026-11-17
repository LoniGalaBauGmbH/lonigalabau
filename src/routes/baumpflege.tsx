import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ExpressInquiryForm } from "@/components/site/ExpressInquiryForm";
import { PageShell } from "@/components/site/PageShell";
import { ProjectImage } from "@/components/site/ProjectImage";
import { projectPhotos } from "@/lib/project-photos";
import { publicImageUrl } from "@/lib/public-image-url";
import { canonicalUrl, ORGANIZATION_ID, publicPageSchema, safeJsonLd } from "@/lib/seo";

const title = "Baumpflege in Hattersheim & Rhein-Main | Loni GalaBau";
const description =
  "Baumpflege mit eigener Hubarbeitsbühne in Hattersheim und im Rhein-Main-Gebiet. Senden Sie Fotos von Baum und Zufahrt für ein individuelles Angebot.";
const photo = projectPhotos["holz-baum"];
const pageSchema = publicPageSchema(
  "/baumpflege",
  "Baumpflege in Hattersheim und Rhein-Main",
  "WebPage",
);

export const Route = createFileRoute("/baumpflege")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:image", content: canonicalUrl(publicImageUrl(photo.src)) },
      { property: "og:image:alt", content: photo.alt },
    ],
  }),
  component: TreeCarePage,
});

function TreeCarePage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            ...pageSchema,
            "@graph": [
              ...pageSchema["@graph"],
              {
                "@type": "Service",
                "@id": canonicalUrl("/baumpflege") + "#service",
                name: "Baumpflege mit Hubarbeitsbühne",
                provider: { "@id": ORGANIZATION_ID },
                mainEntityOfPage: canonicalUrl("/baumpflege"),
                areaServed: ["Hattersheim am Main", "Rhein-Main-Gebiet"],
                description,
              },
            ],
          }),
        }}
      />
      <article className="mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
        <header className="grid items-center gap-8 py-10 md:grid-cols-[1.15fr_1fr] md:gap-14 md:py-16">
          <div>
            <p className="eyebrow eyebrow-bracket text-accent-ink">
              Hattersheim am Main · Rhein-Main
            </p>
            <h1 className="display mt-5 text-balance text-5xl text-brand lg:text-7xl">
              Baumpflege mit eigener Hubarbeitsbühne.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              Ragt eine Baumkrone über Ihr Dach, die Einfahrt oder den Sitzplatz? Zeigen Sie uns den
              Baum. Von unserem Betrieb in Hattersheim aus übernehmen wir Pflegearbeiten an Bäumen
              im Rhein-Main-Gebiet.
            </p>
            <a
              href="#baumanfrage"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white"
            >
              Baumpflege anfragen <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <figure>
            <ProjectImage
              src={photo.src}
              original
              alt={photo.alt}
              width={1200}
              height={1600}
              fetchPriority="high"
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/3] w-full rounded-3xl object-cover object-top"
            />
            <figcaption className="mt-2 text-sm text-brand/75">
              Ein bestehender Gartenbaum an einer Holzterrasse aus unseren Arbeiten.
            </figcaption>
          </figure>
        </header>
        <section
          className="grid gap-6 border-y border-brand/20 py-10 md:grid-cols-2 md:gap-14"
          aria-labelledby="baum-zugang"
        >
          <h2 id="baum-zugang" className="font-serif text-3xl text-brand md:text-4xl">
            Kommt die Bühne an meinen Baum?
          </h2>
          <div className="space-y-3 leading-relaxed">
            <p>
              Für den Einsatz zählen der Weg von der Straße zum Baum und die verfügbare Stellfläche.
              Ein schmales Gartentor, eine Stufe oder ein Vordach kann entscheidend sein. Ein Foto
              von der Straße in Richtung Baum hilft uns, das früh zu erkennen.
            </p>
            <p>
              Wir besprechen mit Ihnen, welche Äste oder Bereiche Ihnen Sorgen machen. Wenn sich
              Zugang oder Pflegeumfang anhand der Bilder noch nicht beurteilen lassen, vereinbaren
              wir einen Termin vor Ort.
            </p>
          </div>
        </section>
        <section
          id="baumanfrage"
          className="grid scroll-mt-28 items-start gap-8 pt-12 lg:grid-cols-2 lg:gap-14"
          aria-labelledby="baum-anfrage-titel"
        >
          <div>
            <h2 id="baum-anfrage-titel" className="font-serif text-3xl text-brand md:text-4xl">
              Fotos für Ihr Angebot
            </h2>
            <p className="mt-4 leading-relaxed">
              Nennen Sie den Einsatzort und beschreiben Sie kurz Ihren Pflegewunsch. Diese drei
              Ansichten helfen uns bei der Einschätzung:
            </p>
            <ul className="mt-5 list-disc space-y-3 pl-5">
              <li>Der ganze Baum mit Stamm und Krone.</li>
              <li>Der betroffene Bereich mit dem Abstand zu Haus, Weg oder Terrasse.</li>
              <li>Die Zufahrt und der mögliche Stellplatz für die Bühne.</li>
            </ul>
            <p className="mt-6">
              Lieber telefonisch besprechen?{" "}
              <a
                className="font-semibold text-brand underline underline-offset-4"
                href="tel:+4961909266134"
              >
                06190 9266134
              </a>
            </p>
          </div>
          <ExpressInquiryForm
            variant="compact"
            heading="Baumpflege anfragen"
            initialService="Baumpflege"
            descriptionPlaceholder="Wo steht der Baum, welche Pflege wünschen Sie und wie ist die Zufahrt?"
          />
        </section>
      </article>
    </PageShell>
  );
}
