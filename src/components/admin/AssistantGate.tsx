import { useEffect, useState, type ReactNode } from "react";
import { Link, useBlocker } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import "./assistant.css";

export function AssistantGate({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    void import("@/integrations/supabase/client")
      .then(async ({ supabase }) => {
        if (!active) return;
        const check = async () => {
          const result = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
          if (active) setAllowed(!result.error && result.data.currentLevel === "aal2");
        };
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
          if (event === "TOKEN_REFRESHED") return;
          // Unmount private component state on sign-out/account changes, not only Query caches.
          setAllowed(false);
          clearTimeout(timer);
          timer = setTimeout(() => {
            void check().catch(() => {
              if (active) setAllowed(false);
            });
          }, 0);
        });
        unsubscribe = () => subscription.unsubscribe();
        await check();
      })
      .catch(() => {
        if (active) setAllowed(false);
      });
    return () => {
      active = false;
      clearTimeout(timer);
      unsubscribe?.();
    };
  }, []);
  if (allowed === null) return <p className="p-8">Sicherheitsstatus wird geprüft …</p>;
  if (!allowed)
    return (
      <section className="assistant-workspace">
        <div className="assistant-panel assistant-lock">
          <ShieldCheck size={36} />
          <h1>Geschützter Arbeitsbereich</h1>
          <p>
            Für Kundenverläufe und die interne Wissensbank ist eine Zwei-Faktor-Anmeldung
            erforderlich.
          </p>
          <p>
            Richten Sie im Dashboard unter „Kontosicherheit“ Ihre Authenticator-App ein. Melden Sie
            sich danach erneut mit dem Sicherheitscode an.
          </p>
          <Link className="assistant-primary" to="/admin">
            Zur Kontosicherheit
          </Link>
        </div>
      </section>
    );
  return <div className="assistant-workspace">{children}</div>;
}
export function AssistantError({ message }: { message: string }) {
  return message ? (
    <p role="alert" className="assistant-error">
      {message}
    </p>
  ) : null;
}
export function AssistantUnsavedChanges({ dirty }: { dirty: boolean }) {
  const blocker = useBlocker({
    shouldBlockFn: ({ next }) => next.pathname !== "/login" && dirty,
    enableBeforeUnload: dirty,
    withResolver: true,
  });
  if (blocker.status !== "blocked") return null;
  return (
    <div className="assistant-dialog-backdrop">
      <section
        className="assistant-panel assistant-stack"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="assistant-unsaved-title"
        aria-describedby="assistant-unsaved-description"
      >
        <h2 id="assistant-unsaved-title">Ungespeicherte Änderungen</h2>
        <p id="assistant-unsaved-description">
          Ihre Eingaben wurden noch nicht gespeichert. Möchten Sie weiter bearbeiten oder die
          Änderungen verwerfen?
        </p>
        <div className="assistant-actions">
          <button autoFocus className="assistant-primary" onClick={() => blocker.reset()}>
            Weiter bearbeiten
          </button>
          <button className="assistant-danger" onClick={() => blocker.proceed()}>
            Änderungen verwerfen
          </button>
        </div>
      </section>
    </div>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Die Aktion ist fehlgeschlagen. Bitte erneut versuchen.";
