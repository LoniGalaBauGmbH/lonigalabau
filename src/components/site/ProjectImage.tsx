import type { ComponentProps } from "react";
import { photoAlt, photoSrcSet } from "@/lib/project-photos";

export function ProjectImage({
  src,
  alt,
  sizes = "(max-width: 767px) 100vw, 50vw",
  ...props
}: ComponentProps<"img"> & { src: string; alt: string }) {
  return (
    <img
      {...props}
      src={src}
      alt={photoAlt(src, alt)}
      srcSet={photoSrcSet(src)}
      sizes={sizes}
      decoding="async"
    />
  );
}
