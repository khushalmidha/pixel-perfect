import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { PlanProvider } from "@/lib/plan-context";
import { LearningProvider } from "@/lib/learning-context";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionButton, ActionLink, ScreenIntro } from "@/components/app/primitives";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Page not found"
        title="We couldn't find that page."
        body="You can return Home or choose a section below to continue."
      />
      <div className="px-5">
        <ActionLink to="/">Go home</ActionLink>
      </div>
    </AppFrame>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Let's try again"
        title="This page didn't load."
        body="You can try again or refresh the Home screen."
      />
      <div className="flex flex-col gap-3 px-5">
        <ActionButton
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </ActionButton>
        <a
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-[12px] border border-line px-4 py-3 text-center text-[15px] font-semibold"
        >
          Go home
        </a>
      </div>
    </AppFrame>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Steady — understand before you invest" },
      {
        name: "description",
        content: "Find a useful place to begin learning before investing.",
      },
      { name: "author", content: "Lovable" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* PlanProvider holds the saved Starting Point for every route. */}
      <PlanProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <LearningProvider>
          <Outlet />
        </LearningProvider>
      </PlanProvider>
    </QueryClientProvider>
  );
}
