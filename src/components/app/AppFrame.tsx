import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { user } from "@/lib/mock-data";

const tabs = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Plan" },
  { to: "/explore", label: "Explore" },
  { to: "/journey", label: "Journey" },
  { to: "/learn", label: "Learn" },
] as const;

function BottomNav() {
  return (
    <nav className="sticky bottom-5 z-10 mx-5 mb-5 mt-8 grid grid-cols-5 rounded-[16px] border border-line bg-surface/80 py-2.5 backdrop-blur-sm">
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          activeOptions={{ exact: t.to === "/" }}
          className="group flex flex-col items-center gap-1 text-muted-foreground data-[status=active]:text-primary"
        >
          <span className="size-1.5 rounded-full bg-muted-foreground/40 group-data-[status=active]:animate-breathe group-data-[status=active]:bg-primary" />
          <span className="text-[10px] font-medium">{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function TopBar({ back }: { back?: { to: string; label: string } | undefined }) {
  return (
    <header className="animate-rise relative z-10 flex items-center justify-between px-5 pb-4 pt-6">
      {back ? (
        <Link to={back.to} className="font-mono text-[11px] tracking-wider text-muted-foreground hover:text-foreground">
          ← {back.label}
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <span className="size-2.5 animate-breathe rounded-full bg-primary shadow-dot" />
          <span className="text-[13px] font-medium uppercase tracking-[0.18em]">{user.firstName}</span>
        </div>
      )}
      <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
        ₹0.00 · day {user.day}
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
  back?: { to: string; label: string } | undefined;
}) {
  return (
    <div className="flex min-h-screen justify-center bg-background sm:py-6">
      <div className="relative flex min-h-[780px] w-full max-w-[390px] flex-col overflow-hidden bg-background sm:rounded-[26px] sm:border sm:border-line">
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <TopBar back={back} />
        <main className="relative z-10 flex flex-1 flex-col">{children}</main>
        {nav && <BottomNav />}
      </div>
    </div>
  );
}
