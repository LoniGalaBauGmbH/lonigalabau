import { useRef, useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, MapPin, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import projectFallback from "@/assets/project-villa.jpg";

type GalleryProject = {
  title: string;
  description: string;
  location?: string | null;
  images?: string[] | null;
};

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      className="grid h-full min-h-64 place-items-center p-8 text-center text-white/75"
      role="img"
      aria-label={alt}
    >
      Dieses Bild ist gerade nicht verfügbar.
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
      draggable={false}
    />
  );
}

export function ProjectGallery({
  project,
  children,
}: {
  project: GalleryProject;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const uploaded = [...new Set((project.images ?? []).filter((src) => src.trim()))];
  const images = uploaded.length ? uploaded : [projectFallback];
  const current = Math.min(index, images.length - 1);
  const move = (direction: number) =>
    setIndex((value) => (value + direction + images.length) % images.length);
  const control =
    "grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setIndex(0);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="z-[120] bg-black/80 backdrop-blur-sm motion-reduce:animate-none" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[121] flex max-h-[94dvh] w-[calc(100%-1.5rem)] max-w-7xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-3xl bg-brand text-brand-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-200 motion-reduce:animate-none"
          onKeyDown={(event) => {
            if (images.length < 2) return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              move(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          <div className="flex items-start justify-between gap-6 px-5 py-5 md:px-8">
            <div className="min-w-0">
              {project.location && (
                <p className="mb-2 flex items-center gap-2 text-sm text-brand-foreground/70">
                  <MapPin aria-hidden="true" className="size-4 shrink-0" />
                  {project.location}
                </p>
              )}
              <DialogTitle className="font-serif text-2xl leading-tight text-white md:text-3xl">
                {project.title}
              </DialogTitle>
            </div>
            <DialogClose className={control} aria-label="Galerie schließen">
              <X className="size-5" aria-hidden="true" />
            </DialogClose>
          </div>
          <div
            className="relative h-[min(50dvh,640px)] min-h-48 shrink-0 touch-pan-y bg-black/20 md:h-[min(65dvh,760px)]"
            onPointerDown={(event) => {
              if (event.pointerType === "touch") {
                pointerStart.current = { x: event.clientX, y: event.clientY };
                event.currentTarget.setPointerCapture(event.pointerId);
              }
            }}
            onPointerUp={(event) => {
              const start = pointerStart.current;
              pointerStart.current = null;
              if (!start || images.length < 2) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            <GalleryImage
              key={images[current]}
              src={images[current]}
              alt={project.title + " – Bild " + (current + 1)}
            />
            {!uploaded.length && (
              <span className="absolute bottom-4 left-5 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                Symbolbild
              </span>
            )}
          </div>
          <div className="px-5 py-5 md:px-8 md:py-6">
            {images.length > 1 && (
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex min-w-0 gap-2 overflow-x-auto py-1" aria-label="Bildauswahl">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      aria-label={"Bild " + (i + 1) + " anzeigen"}
                      aria-pressed={current === i}
                      onClick={() => setIndex(i)}
                      className={
                        "h-14 w-20 shrink-0 overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
                        (current === i
                          ? "ring-2 ring-accent ring-inset"
                          : "opacity-55 hover:opacity-100")
                      }
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover p-0.5"
                      />
                    </button>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    className={control}
                    aria-label="Vorheriges Bild"
                  >
                    <ArrowLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    className={control}
                    aria-label="Nächstes Bild"
                  >
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
            <p
              className="mb-3 text-sm text-brand-foreground/65"
              aria-live="polite"
              aria-atomic="true"
            >
              Bild {current + 1} von {images.length}
            </p>
            <DialogDescription className="max-w-4xl whitespace-pre-line text-base leading-relaxed text-brand-foreground/85">
              {project.description || "Ein Blick auf die Gestaltung dieser Außenanlage."}
            </DialogDescription>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
