import { Link, type LinkProps } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Eyebrow ---------- */
export function Eyebrow({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "warm" | "muted";
  className?: string;
}) {
  const t = { accent: "text-primary", warm: "text-warm", muted: "text-muted-foreground" }[tone];
  return <p className={cn("eyebrow", t, className)}>{children}</p>;
}

/* ---------- Panel (card) ---------- */
const panelVariants = cva("rounded-[18px] border p-5", {
  variants: {
    variant: {
      default: "border-line bg-surface",
      focus: "border-primary/25 bg-surface shadow-glow",
      warm: "border-warm/25 bg-warm/5 rounded-[12px] p-4",
      quiet: "border-dashed border-line rounded-[12px] px-4 py-3",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Panel({
  variant,
  className,
  children,
}: VariantProps<typeof panelVariants> & { className?: string; children: ReactNode }) {
  return <div className={cn(panelVariants({ variant }), className)}>{children}</div>;
}

/* ---------- Action button / link ---------- */
const actionVariants = cva(
  "inline-flex w-full items-center justify-center gap-2 rounded-[12px] py-3 text-[15px] font-semibold tracking-tight transition",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:brightness-110",
        ghost: "border border-line text-foreground hover:bg-secondary",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ActionProps = VariantProps<typeof actionVariants> & {
  children: ReactNode;
  className?: string;
};

export function ActionLink({ variant, className, children, ...link }: ActionProps & LinkProps) {
  return (
    <Link {...link} className={cn(actionVariants({ variant }), className)}>
      {children}
    </Link>
  );
}

export function ActionButton({
  variant,
  className,
  children,
  ...rest
}: ActionProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={cn(actionVariants({ variant }), className)}>
      {children}
    </button>
  );
}

/* ---------- Screen intro ---------- */
export function ScreenIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <section className="animate-rise px-5 pb-6 pt-2">
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h1 className="text-balance text-[30px] font-bold leading-[1.06] tracking-tight">{title}</h1>
      {body && (
        <p className="mt-3 max-w-[34ch] text-pretty text-[14px] leading-[1.5] text-muted-foreground">
          {body}
        </p>
      )}
    </section>
  );
}

/* ---------- Progress line ---------- */
export function ProgressLine({ value, caption }: { value: number; caption?: string }) {
  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      {caption && <p className="mt-1.5 text-[11px] text-muted-foreground">{caption}</p>}
    </div>
  );
}

/* ---------- Placeholder for screens not built yet ---------- */
export function ComingNext({ children }: { children: ReactNode }) {
  return (
    <Panel variant="quiet">
      <Eyebrow tone="muted">Coming next</Eyebrow>
      <p className="mt-1.5 text-[12px] leading-[1.5] text-muted-foreground">{children}</p>
    </Panel>
  );
}
