import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  useRouterState,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import { CookieBanner } from "@/components/site/CookieBanner";
import { InquiryModal } from "@/components/site/InquiryModal";
import { TrackingScripts } from "@/components/site/TrackingScripts";
import { getSiteImages } from "@/lib/site.functions";
import { canonicalUrl, PRIVATE_PATH } from "@/lib/seo";
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
          Die Seite ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.
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
  loader: async ({ context }) => {
    const images = await context.queryClient.ensureQueryData({
      queryKey: ["site-images"],
      queryFn: () => getSiteImages(),
      staleTime: 300000,
    });
    return { images };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Loni Galabau GmbH – Garten- und Landschaftsbau Hattersheim" },
      {
        name: "description",
        content:
          "Loni Galabau GmbH gestaltet hochwertige Außenanlagen im Rhein-Main-Gebiet: Natursteinarbeiten, Gartengestaltung, Pflasterarbeiten, Bewässerung und mehr.",
      },
      { name: "author", content: "Loni Galabau GmbH" },

      { property: "og:type", content: "website" },

      {
        property: "og:image",
        content: "https://www.loni-galabau.de/images/social-preview.jpg",
      },
      {
        name: "twitter:image",
        content: "https://www.loni-galabau.de/images/social-preview.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/images/partner/loni.svg" },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/jakarta-normal-latin.woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const { path, meta } = useRouterState({
    select: (s) => ({ path: s.location.pathname, meta: s.matches.flatMap((m) => m.meta || []) }),
  });
  const title = [...meta].reverse().find((m) => m && "title" in m)?.title || "Loni GalaBau GmbH";
  const desc = [...meta].reverse().find((m) => m && "name" in m && m.name === "description");
  const description =
    desc && "content" in desc
      ? String(desc.content)
      : "Garten- und Landschaftsbau aus Hattersheim am Main.";
  return (
    <html lang="de">
      <head>
        <HeadContent />
        <link rel="canonical" href={canonicalUrl(path)} />
        <meta property="og:url" content={canonicalUrl(path)} />
        <meta property="og:locale" content="de_DE" />
        <meta property="og:title" content={String(title)} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={String(title)} />
        <meta name="twitter:description" content={description} />
        {PRIVATE_PATH.test(path) && <meta name="robots" content="noindex,nofollow" />}
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
    </QueryClientProvider>
  );
}
