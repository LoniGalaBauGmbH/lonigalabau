import { useRouterState } from "@tanstack/react-router";
import logo from "@/assets/logo-loni-white.svg";
import "./NavigationFeedback.css";

/** Only page changes, never prefetches, form submissions or in-page anchors. */
export function NavigationFeedback() {
  const pending = useRouterState({
    select: (state) =>
      state.status === "pending" &&
      !!state.resolvedLocation &&
      state.location.pathname !== state.resolvedLocation.pathname,
  });

  return (
    <>
      <div className="navigation-progress" data-pending={pending} aria-hidden="true" />
      <div className="navigation-feedback" data-pending={pending} aria-hidden="true">
        <div className="navigation-feedback-brand">
          <img src={logo} alt="" width={270} height={52} />
          <span className="navigation-feedback-track" />
          <span className="navigation-feedback-label">Einen Augenblick …</span>
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {pending ? "Die nächste Seite wird geladen." : ""}
      </span>
    </>
  );
}
