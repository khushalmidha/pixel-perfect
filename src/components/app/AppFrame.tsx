import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { appIdentity } from "@/lib/mock-data";

const tabs = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Start" },
  { to: "/explore", label: "Explore" },
  { to: "/journey", label: "Journey" },
  { to: "/learn", label: "Learn" },
] as const;

function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-20 grid w-[calc(100%-2.5rem)] max-w-[350px] -translate-x-1/2 grid-cols-5 rounded-[16px] border border-line bg-surface/80 py-1.5 backdrop-blur-sm"
    >
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          search={{}}
          activeOptions={{ exact: t.to === "/" }}
          className="group flex min-h-11 flex-col items-center justify-center gap-1 text-muted-foreground data-[status=active]:text-primary"
        >
          <span className="size-1.5 rounded-full bg-muted-foreground/40 group-data-[status=active]:animate-breathe group-data-[status=active]:bg-primary" />
          <span className="text-[10px] font-medium">{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}

type BackLink = { to: string; label: string; hash?: string | undefined };

function TopBar({ back }: { back?: BackLink | undefined }) {
  return (
    <header className="animate-rise relative z-10 flex items-center justify-between px-5 pb-4 pt-6">
      {back ? (
        <Link
          to={back.to}
          search={{}}
          {...(back.hash ? { hash: back.hash } : {})}
          className="flex min-h-11 items-center font-mono text-[11px] tracking-wider text-muted-foreground hover:text-foreground"
        >
          ← {back.label}
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <span className="size-2.5 animate-breathe rounded-full bg-primary shadow-dot" />
          <span className="text-[13px] font-medium uppercase tracking-[0.18em]">
            {appIdentity.name}
          </span>
        </div>
      )}
      <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
        {appIdentity.status}
      </span>
    </header>
  );
}

/** Phone-width shell used by every screen. */
export function AppFrame({
  children,
  nav = true,
  back,
}: {
  children: ReactNode;
  nav?: boolean;
  back?: BackLink | undefined;
}) {
  return (
    <div className="flex min-h-screen justify-center bg-background sm:py-6">
      <div className="relative flex min-h-svh w-full min-w-0 max-w-[390px] flex-col overflow-hidden bg-background sm:min-h-[780px] sm:rounded-[26px] sm:border sm:border-line">
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <TopBar back={back} />
        <main
          className={`relative z-10 flex min-w-0 flex-1 flex-col ${nav ? "pb-[calc(6rem+env(safe-area-inset-bottom))]" : ""}`}
        >
          {children}
        </main>
        {nav && <BottomNav />}
      </div>
    </div>
  );
}
