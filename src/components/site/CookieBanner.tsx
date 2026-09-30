import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("loni:open-cookies", show);
    return () => window.removeEventListener("loni:open-cookies", show);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl">
        <DialogTitle>Datenschutz-Einstellungen</DialogTitle>
        <DialogDescription>
          Diese Website verwendet aktuell keine Analyse- oder Werbedienste. Eine Zustimmung zu
          solchen Diensten ist daher nicht erforderlich.
        </DialogDescription>
        <p className="text-sm leading-relaxed">
          Die Hosting-Infrastruktur nutzt das Sicherheits-Cookie __cf_bm zum Schutz vor
          automatisierten Zugriffen (30 Minuten Inaktivität). Eine Admin-Anmeldung benötigt
          Sitzungsdaten. Gartenplaner-Entwürfe werden nur gespeichert, wenn Sie selbst „Entwurf
          speichern“ wählen. Sie können diese im Gartenplaner wieder löschen.
        </p>
        <a href="/datenschutz" className="text-sm underline underline-offset-4">
          Datenschutzerklärung lesen
        </a>
      </DialogContent>
    </Dialog>
  );
}
