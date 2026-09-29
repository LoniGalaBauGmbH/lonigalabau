import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";
import { documentFile, documentImage, type QualificationDocument } from "@/lib/documents";

export function DocumentPreview({
  document,
  children,
}: {
  document: QualificationDocument;
  children: ReactNode;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState(false);
  const control =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <Dialog.Root
      onOpenChange={() => {
        setZoomed(false);
        setFailed(false);
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[210] bg-black/65 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-200 motion-reduce:animate-none" />
        <Dialog.Content className="site-ui fixed left-1/2 top-1/2 z-[211] flex max-h-[94dvh] w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-background text-brand shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-200 motion-reduce:animate-none">
          <div className="flex shrink-0 items-start justify-between gap-4 p-5 md:px-7">
            <div>
              <Dialog.Title className="text-lg font-semibold leading-snug md:text-xl">
                {document.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-brand/70">
                {document.issuer} · {document.date}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Dokument schließen"
              className={`${control} size-11 shrink-0 p-0 hover:bg-brand/10`}
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div
            tabIndex={0}
            aria-label="Dokumentvorschau, scrollbar"
            className="min-h-0 overflow-auto overscroll-contain bg-brand/10 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand md:p-6"
          >
            {failed ? (
              <p className="p-6">
                Die Vorschau konnte nicht geladen werden. Sie können die PDF unten herunterladen.
              </p>
            ) : (
              <img
                src={documentImage(document.id)}
                alt={`${document.title} – Dokumentenscan`}
                onError={() => setFailed(true)}
                className={
                  zoomed
                    ? "mx-auto w-[1100px] max-w-none bg-white shadow-sm"
                    : "mx-auto h-auto w-full max-w-2xl bg-white shadow-sm"
                }
              />
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 p-4 md:px-7">
            <button
              type="button"
              aria-pressed={zoomed}
              onClick={() => setZoomed(!zoomed)}
              className={`${control} hover:bg-brand/10`}
            >
              {zoomed ? (
                <ZoomOut className="size-4" aria-hidden="true" />
              ) : (
                <ZoomIn className="size-4" aria-hidden="true" />
              )}
              {zoomed ? "Einpassen" : "Vergrößern"}
            </button>
            <a
              href={documentFile(document.id)}
              download={`Loni-GalaBau-${document.id}.pdf`}
              className={`${control} bg-brand text-white hover:bg-brand/90`}
            >
              <Download className="size-4" aria-hidden="true" /> PDF herunterladen
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
