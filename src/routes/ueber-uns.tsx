import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageShell, PageIntro } from "@/components/site/PageShell";
import { useSiteImages } from "@/hooks/useSiteImages";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über unseren Betrieb | Loni GalaBau" },
      {
        name: "description",
        content:
          "Loni GalaBau GmbH aus Hattersheim. Lernen Sie unsere Leistungen und die Zusammenarbeit bei Ihrem Gartenprojekt kennen.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { customImages } = useSiteImages();
  return (
    <PageShell>
      <PageIntro
        eyebrow="Unser Betrieb"
        title={
          <>
            Loni GalaBau.
            <br />
            In Hattersheim zu Hause.
          </>
        }
        lead="Wir bauen und gestalten Gärten, Höfe und Außenanlagen im Rhein-Main-Gebiet."
      />
      <section className="site-width pb-20 grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-24">
        <div>
          <h2 className="text-3xl font-medium">
            Worauf es uns
            <br />
            bei Ihrer Außenanlage ankommt.
          </h2>
          {customImages.about_hero_bg && (
            <img
              src={customImages.about_hero_bg}
              alt="Einblick in den Betrieb Loni GalaBau"
              loading="lazy"
              className="w-full mt-8 object-cover aspect-[4/3]"
            />
          )}
        </div>
        <div className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold">Die Nutzung gibt die Richtung vor.</h3>
            <p className="mt-3 leading-relaxed text-foreground/75">
              Eine Einfahrt muss andere Lasten tragen als ein Gartenweg. Eine Terrasse braucht
              Platz, einen passenden Belag und eine funktionierende Entwässerung. Wir betrachten die
              Fläche als Ganzes.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Die Grundlage muss stimmen.</h3>
            <p className="mt-3 leading-relaxed text-foreground/75">
              Ein großer Teil der Arbeit liegt unter der sichtbaren Oberfläche. Boden, Unterbau und
              Wasserführung gehören deshalb von Anfang an zur Planung.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Absprachen gehören zum Handwerk.</h3>
            <p className="mt-3 leading-relaxed text-foreground/75">
              Vor Beginn besprechen wir den Umfang der Arbeiten, die Materialien und den Ablauf.
              Wenn sich auf der Baustelle Fragen ergeben, klären wir sie mit Ihnen.
            </p>
          </div>
          <Link to="/kontakt" className="primary-link">
            Ihr Vorhaben besprechen <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="bg-secondary py-16">
        <div className="site-width flex flex-col md:flex-row justify-between gap-8 md:items-center">
          <div>
            <p className="eyebrow">Von Naturstein bis Rollrasen</p>
            <h2 className="text-3xl font-medium mt-4">Welche Arbeiten stehen bei Ihnen an?</h2>
          </div>
          <Link to="/leistungen" className="text-link">
            Leistungen ansehen <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
