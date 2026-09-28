import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const questions = [
  [
    "Was brauchen Sie für eine erste Anfrage?",
    "Eine kurze Beschreibung, den Ort des Grundstücks und eine Kontaktmöglichkeit. Wenn Sie bereits Maße oder Fotos haben, können Sie diese im Gartenplaner ergänzen.",
  ],
  [
    "Wie entsteht das Angebot?",
    "Der Preis hängt von Fläche, Material, Untergrund und Zugänglichkeit ab. Wir klären den Leistungsumfang mit Ihnen und erstellen darauf aufbauend ein Angebot.",
  ],
  [
    "Kann ich auch einzelne Arbeiten anfragen?",
    "Ja. Beschreiben Sie die gewünschte Arbeit, zum Beispiel eine neue Terrasse, eine Einfahrt oder eine Natursteinmauer. Wir besprechen mit Ihnen, was dafür notwendig ist.",
  ],
  [
    "Wann können die Arbeiten beginnen?",
    "Das hängt vom Umfang, der Materialverfügbarkeit und unserer Auslastung ab. Nennen Sie uns Ihren Wunschzeitraum, damit wir ihn bei der Abstimmung berücksichtigen können.",
  ],
];
export function FAQ() {
  return (
    <section className="bg-secondary section-space">
      <div className="site-width grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
        <div>
          <p className="eyebrow">Gut zu wissen</p>
          <h2 className="home-heading mt-4">Vor der ersten Anfrage.</h2>
          <Link to="/kontakt" className="text-link mt-6">
            Ihre Frage ist noch offen? Schreiben Sie uns.
          </Link>
        </div>
        <Accordion type="single" collapsible>
          {questions.map(([question, answer], index) => (
            <AccordionItem value={String(index)} key={question} className="border-brand/20">
              <AccordionTrigger className="text-left text-base font-medium py-6 hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/75 leading-relaxed pb-6">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
