import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ProjectImage } from "@/components/site/ProjectImage";
import { projectPhotos } from "@/lib/project-photos";

const content: Record<
  string,
  {
    image: keyof typeof projectPhotos;
    heading: string;
    intro: string;
    steps: { title: string; text: string }[];
    detailTitle: string;
    detailIntro: string;
    details: { title: string; text: string }[];
    checklist: string[];
  }
> = {
  rasenanlagen: {
    image: "45",
    heading: "Vom vorhandenen Boden zur neuen Rasenfläche.",
    intro:
      "Wenn Sie Rollrasen verlegen lassen, stimmen wir Vorbereitung, Lieferung und Verlegung zusammen ab. Damit die Fläche anwachsen kann, gehört auch die Betreuung nach der Herstellung in die Planung.",
    steps: [
      {
        title: "Altbestand klären",
        text: "Bewuchs, Boden, vorhandene Höhen und Wasseransammlungen ansehen. Festlegen, was entfernt werden muss und welche Bereiche bleiben.",
      },
      {
        title: "Boden vorbereiten",
        text: "Den vereinbarten Bodenaufbau und die Anschlüsse an Wege, Beete und Terrasse herstellen. Geplante Bewässerungsleitungen vorher berücksichtigen.",
      },
      {
        title: "Liefern & verlegen",
        text: "Rollrasenlieferung und Verlegung aufeinander abstimmen. Zuschnitte, Ränder und die erste Bewässerung gehören zum vereinbarten Ablauf.",
      },
      {
        title: "Übergeben & pflegen",
        text: "Wasserbedarf, erste Pflege und Nutzung besprechen. Die Fläche ist nach dem Verlegen grün, aber noch nicht vollständig belastbar.",
      },
    ],
    detailTitle: "100 m² Rollrasen verlegen lassen: Was gehört zu den Kosten?",
    detailIntro:
      "Zwei gleich große Gärten können sehr unterschiedliche Vorarbeiten benötigen. Deshalb betrachten wir für ein Angebot die gesamte Herstellung und nicht nur den Preis der Rasenrollen.",
    details: [
      {
        title: "Die Fläche ist bereits vorbereitet",
        text: "Wir prüfen, ob Boden, Höhen und Übergänge für die geplante Anlage passen. Erst daraus ergeben sich Lieferung, Verlegung und gegebenenfalls weitere Bodenarbeiten.",
      },
      {
        title: "Alter Rasen muss ersetzt werden",
        text: "Rasenabtrag, vereinbarte Abfuhr, Bodenaufbereitung und Korrekturen am Gelände können hinzukommen. Diese Positionen gehören gesondert in die Abstimmung.",
      },
    ],
    checklist: [
      "Welche Vorarbeiten und Bodenverbesserungen sind enthalten?",
      "Sind Lieferung, Zuschnitt und Verlegung berücksichtigt?",
      "Was passiert mit altem Bewuchs und überschüssigem Boden?",
      "Wer übernimmt Bewässerung und Anwuchspflege nach der Übergabe?",
    ],
  },
  gartengestaltung: {
    image: "81",
    heading: "Ihren Garten gestalten lassen – bis zur Umsetzung.",
    intro:
      "Wir begleiten das konkrete Bauvorhaben: von Ihren Wünschen und der abgestimmten Planung bis zu den vereinbarten Gartenarbeiten. Für weitergehende Planungsaufgaben beziehen wir bei Bedarf unseren Planungspartner ein.",
    steps: [
      {
        title: "Neubau oder Gartenumbau?",
        text: "Beim Neubau stimmen wir Gelände, Zugänge und neue Flächen ab. Im Bestand markieren wir zuerst Pflanzen, Beläge und Bauteile, die erhalten bleiben sollen.",
      },
      {
        title: "Unter der Oberfläche",
        text: "Erdarbeiten, Wasserwege und geplante Leitungen vor neuen Belägen oder Rasen einordnen. So greifen die Gewerke sinnvoll ineinander.",
      },
      {
        title: "Flächen & Grün",
        text: "Terrasse, Wege, Einfassungen, Rasen und Bepflanzung entsprechend dem vereinbarten Umfang herstellen und aufeinander abstimmen.",
      },
      {
        title: "In einem Zug oder in Etappen",
        text: "Bei mehreren Bauabschnitten Zugänge, Lagerflächen und spätere Anschlüsse mitdenken. Reihenfolge und Umfang werden gemeinsam festgelegt.",
      },
    ],
    detailTitle: "Was soll bleiben, was darf sich verändern?",
    detailIntro:
      "Markieren Sie auf einer einfachen Skizze Ihre wichtigsten Wünsche und die erhaltenswerten Bereiche. Das hilft uns, aus einer Gestaltungsidee einen konkreten Arbeitsumfang zu entwickeln.",
    details: [
      {
        title: "Den Alltag beschreiben",
        text: "Sitzplätze, häufig genutzte Wege, Spielflächen und gewünschter Pflegeaufwand geben der Planung eine Richtung.",
      },
      {
        title: "Den Bestand einbeziehen",
        text: "Fotos von Pflanzen, Stufen, Mauern und Anschlüssen zeigen, welche Übergänge und Schutzmaßnahmen geklärt werden müssen.",
      },
    ],
    checklist: [
      "Welche Bereiche sollen zuerst nutzbar sein?",
      "Welche Pflanzen und Materialien möchten Sie erhalten?",
      "Welche Leitungen und Wasserwege sind bekannt?",
      "Welche Planung und welche Bauleistungen sollen wir übernehmen?",
    ],
  },
  zaunarbeiten: {
    image: "40",
    heading: "Zaun bauen lassen: Verlauf, Montage und Zugang gemeinsam klären.",
    intro:
      "Ein passender Zaun beginnt mit dem Grundstück. Wir betrachten den Verlauf, vorhandene Mauern, Höhenunterschiede und die Nutzung der Tore, bevor Material und Montage festgelegt werden.",
    steps: [
      {
        title: "Verlauf & Bestand",
        text: "Länge, Ecken, Gelände und bekannte Leitungen aufnehmen. Grundstücksgrenzen und erforderliche Abstimmungen vor Beginn klären.",
      },
      {
        title: "Höhe & Sichtschutz",
        text: "Offene und geschlossene Bereiche sowie Materialwirkung und Pflege miteinander abwägen. Das gewählte System muss zum Standort passen.",
      },
      {
        title: "Tore & Durchgänge",
        text: "Benötigte Breiten und Öffnungsrichtungen festlegen. Gartenmaschinen, Fahrräder oder andere vorgesehene Nutzungen berücksichtigen.",
      },
      {
        title: "Rückbau & Montage",
        text: "Alte Elemente, Pfosten und Fundamente im Angebot erfassen. Neue Befestigungen und Wiederherstellung angrenzender Flächen abstimmen.",
      },
    ],
    detailTitle: "Ein Angebot für den fertigen Zaun.",
    detailIntro:
      "Ein Preis pro Zaunfeld beschreibt nicht die fertige Anlage. Vergleichen Sie Material und Montage für denselben Verlauf und dieselben Vorarbeiten.",
    details: [
      {
        title: "Gerader Verlauf",
        text: "Auch auf einer ebenen Strecke müssen Pfostenstandorte, Untergrund und Zugänglichkeit geklärt sein. Die Länge ist nur eine von mehreren Angebotsgrundlagen.",
      },
      {
        title: "Gefälle, Ecken und Tore",
        text: "Übergänge, besondere Anschlüsse und Torfundamente können zusätzliche Arbeiten erfordern. Fotos und grobe Maße helfen, diese früh zu erkennen.",
      },
    ],
    checklist: [
      "Sind Pfosten, Fundamente und Befestigungen enthalten?",
      "Sind Tore, Durchgänge und Anschlüsse eingeplant?",
      "Ist der Rückbau des bisherigen Zauns vereinbart?",
      "Welche Flächen werden nach der Montage wiederhergestellt?",
    ],
  },
};

export function ServiceExecution({ slug }: { slug: string }) {
  const section = content[slug];
  if (!section) return null;
  const photo = projectPhotos[section.image];
  return (
    <section className="px-6 pb-20 md:px-10 md:pb-28" aria-labelledby="service-execution-title">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <span className="eyebrow eyebrow-bracket text-brand">
              Von der Planung zur Ausführung
            </span>
            <h2
              id="service-execution-title"
              className="display mt-5 text-3xl leading-tight text-brand md:text-4xl"
            >
              {section.heading}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/80">{section.intro}</p>
            <a
              href="#anfrage"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand underline underline-offset-4"
            >
              Vorhaben besprechen <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <figure>
            <ProjectImage
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover"
            />
            <figcaption className="mt-3 text-xs text-foreground/70">
              {photo.alt} · Einblick in unsere Arbeiten
            </figcaption>
          </figure>
        </div>
        <ol className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {section.steps.map((step, index) => (
            <li key={step.title} className="min-w-0 border-t border-brand/20 pt-5">
              <span className="text-xs font-semibold text-brand">0{index + 1}</span>
              <h3 className="mt-4 font-display text-lg font-bold text-brand">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 rounded-3xl bg-surface p-6 md:p-10">
          <h3 className="font-display text-2xl font-bold leading-tight text-brand md:text-3xl">
            {section.detailTitle}
          </h3>
          <p className="mt-4 max-w-4xl leading-relaxed text-foreground/80">{section.detailIntro}</p>
          <div className="mt-7 grid gap-7 md:grid-cols-2">
            {section.details.map((item) => (
              <div key={item.title}>
                <h4 className="font-display text-lg font-bold text-brand">{item.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{item.text}</p>
              </div>
            ))}
          </div>
          <ul className="mt-7 grid gap-4 md:grid-cols-2">
            {section.checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/kontakt"
            className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-brand underline underline-offset-4"
          >
            Projekt mit Fotos anfragen <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
