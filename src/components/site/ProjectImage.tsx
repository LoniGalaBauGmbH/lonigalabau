import type { ComponentProps } from "react";
import { photoAlt, photoSrcSet } from "@/lib/project-photos";
import { optimizedPhoto } from "@/lib/photo-variants";

export function ProjectImage({
  src,
  alt,
  sizes = "(max-width: 767px) calc(100vw - 48px), 50vw",
  original = false,
  ...props
}: ComponentProps<"img"> & { src: string; alt: string; original?: boolean }) {
  const photo = original ? undefined : optimizedPhoto(src);
  const img = (
    <img
      {...props}
      width={props.width ?? photo?.width}
      height={props.height ?? photo?.height}
      src={photo?.src ?? src}
      alt={photoAlt(src, alt)}
      srcSet={photo?.webp ?? photoSrcSet(src)}
      sizes={sizes}
      decoding="async"
    />
  );
  return photo ? (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={photo.avif} sizes={sizes} />
      {img}
    </picture>
  ) : (
    img
  );
}
