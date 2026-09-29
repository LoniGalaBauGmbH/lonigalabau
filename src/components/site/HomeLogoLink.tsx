import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** A real home link, with a smooth return to the top when already on the homepage. */
export function HomeLogoLink({
  children,
  className,
  onNavigate,
}: {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <Link
      to="/"
      resetScroll
      className={className}
      aria-label="Loni Galabau – Startseite"
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        onNavigate?.();
        if (pathname !== "/") return;
        event.preventDefault();
        // Clear section hashes without the router jumping ahead of the smooth scroll.
        void router.navigate({ to: "/", replace: true, resetScroll: false }).then(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
          });
        });
      }}
    >
      {children}
    </Link>
  );
}
