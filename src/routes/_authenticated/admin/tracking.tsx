import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/tracking")({ component: Page });
function Page() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-3xl text-brand">Datenschutz & Analyse</h1>
      <section className="rounded-3xl bg-surface p-8 space-y-4">
        <ShieldCheck className="h-8 w-8 text-brand" />
        <h2 className="text-xl font-semibold">Besuch ohne Tracking</h2>
        <p>
          Die Website lädt keine Analyse- oder Marketing-Pixel. Schriftarten werden lokal
          ausgeliefert; die Wegbeschreibung öffnet sich erst über einen externen Link.
        </p>
        <p>
          Tracking und eigene Skripte sind serverseitig gesperrt. Eine spätere Aktivierung benötigt
          einen vollständig geprüften Einwilligungsprozess einschließlich Widerruf und
          aktualisierter Datenschutzhinweise.
        </p>
      </section>
    </div>
  );
}
