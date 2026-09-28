import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

import { supabase } from "@/integrations/supabase/client";
import { CookieBanner } from "@/components/site/CookieBanner";
import { InquiryModal } from "@/components/site/InquiryModal";
import { TrackingScripts } from "@/components/site/TrackingScripts";
import { absoluteUrl } from "@/lib/company";
import shareImage from "@/assets/svc-pflaster.jpg";
import favicon from "@/assets/logo-loni.svg";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-8xl text-brand">404</h1>
        <p className="mt-4 text-lg text-foreground/70">Diese Seite konnten wir nicht finden.</p>
        <a
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          Zur Startseite
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl text-brand">Etwas ist schiefgelaufen</h1>
        <p className="mt-4 text-sm text-foreground/70">
          Die Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-brand px-5 py-2 text-sm text-brand-foreground"
          >
            Erneut versuchen
          </button>
          <a href="/" className="rounded-full border border-brand/20 px-5 py-2 text-sm">
            Zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Loni GalaBau GmbH – Garten- und Landschaftsbau Hattersheim" },
      {
        name: "description",
        content:
          "Loni GalaBau GmbH gestaltet hochwertige Außenanlagen im Rhein-Main-Gebiet: Natursteinarbeiten, Gartengestaltung, Pflasterarbeiten, Bewässerung und mehr.",
      },
      { name: "author", content: "Loni GalaBau GmbH" },
      {
        property: "og:title",
        content: "Loni GalaBau GmbH – Garten- und Landschaftsbau Hattersheim",
      },
      {
        property: "og:description",
        content:
          "Loni GalaBau GmbH gestaltet hochwertige Außenanlagen im Rhein-Main-Gebiet: Natursteinarbeiten, Gartengestaltung, Pflasterarbeiten, Bewässerung und mehr.",
      },
      { property: "og:type", content: "website" },
      {
        name: "twitter:title",
        content: "Loni GalaBau GmbH – Garten- und Landschaftsbau Hattersheim",
      },
      {
        name: "twitter:description",
        content:
          "Loni GalaBau GmbH gestaltet hochwertige Außenanlagen im Rhein-Main-Gebiet: Natursteinarbeiten, Gartengestaltung, Pflasterarbeiten, Bewässerung und mehr.",
      },
      {
        property: "og:image",
        content: absoluteUrl(shareImage),
      },
      {
        name: "twitter:image",
        content: absoluteUrl(shareImage),
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: favicon },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function SeoLinks() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const privatePage = pathname.startsWith("/admin") || pathname === "/login";
  return privatePage ? (
    <meta name="robots" content="noindex, nofollow" />
  ) : (
    <link
      rel="canonical"
      href={absoluteUrl(pathname === "/" ? "/" : pathname.replace(/\/$/, ""))}
    />
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
        <SeoLinks />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthSync() {
  const router = useRouter();
  const qc = useQueryClient();
  useEffect(() => {
    let pending: ReturnType<typeof setTimeout> | undefined;
    let userId: string | null = null;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUserId = session?.user.id ?? null;
      const identityChanged = userId !== nextUserId;
      userId = nextUserId;
      if (event === "INITIAL_SESSION") return;

      if (identityChanged || event === "SIGNED_OUT") {
        // Remove the previous account's data, including in-flight queries.
        qc.clear();
        router.clearCache();
      }
      // Run outside the Auth callback's lock: beforeLoad reads the session.
      clearTimeout(pending);
      pending = setTimeout(() => {
        void router.invalidate();
      }, 0);
    });
    return () => {
      clearTimeout(pending);
      subscription.unsubscribe();
    };
  }, [router, qc]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync />
      <Outlet />
      <CookieBanner />
      <InquiryModal />
      <TrackingScripts />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
