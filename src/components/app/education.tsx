import type { ReactNode } from "react";
import type { RiskLevel } from "@/lib/mock-data";
import { Panel } from "./primitives";

/** Inline, in-context explanation. Use wherever a term might cause hesitation. */
export function Explainer({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group overflow-hidden rounded-[12px] border border-line bg-background">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-primary transition hover:bg-primary/5">
        <span>{question}</span>
        <span className="font-mono text-[11px] text-muted-foreground transition group-open:rotate-45">+</span>
      </summary>
      <div className="border-t border-line px-4 pb-4 pt-3 text-pretty text-[12px] leading-[1.6] text-muted-foreground">
        {children}
      </div>
    </details>
  );
}

const riskLabel: Record<RiskLevel, string> = {
  low: "Calm",
  moderate: "Some ups and downs",
  high: "Bigger swings",
};

/** Risk is always described in words first. */
export function RiskNote({ level, children }: { level: RiskLevel; children: ReactNode }) {
  return (
    <Panel variant="warm">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-medium text-warm">The risk, in words</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {riskLabel[level]}
        </span>
      </div>
      <p className="mt-1.5 text-pretty text-[12px] leading-[1.55] text-muted-foreground">{children}</p>
    </Panel>
  );
}

/** Separates education from financial advice. Show on every decision surface. */
export function AdviceNote({ children }: { children?: ReactNode }) {
  return (
    <Panel variant="quiet" className="flex gap-3">
      <div className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-primary/40 font-mono text-[10px] text-primary">
        i
      </div>
      <p className="text-pretty text-[11px] leading-[1.5] text-muted-foreground">
        {children ??
          "Education, not advice. We explain the concepts — we never tell you what to buy. Your money, your call."}
      </p>
    </Panel>
  );
}
