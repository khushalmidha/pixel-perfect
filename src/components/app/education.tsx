import { useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { getLesson, type RiskLevel } from "@/lib/mock-data";
import { Panel } from "./primitives";

/** Inline, in-context explanation. Use wherever a term might cause hesitation. */
type LearningLinkProps = { lessonId?: string | undefined; returnTo?: string | undefined };

/** An optional deeper lesson; the decision-point explanation stays in place. */
function LessonLink({
  lessonId,
  returnTo,
  context,
}: LearningLinkProps & { context?: string | undefined }) {
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  if (!lesson) return null;
  return (
    <Link
      to="/learn"
      search={{
        lesson: lesson.id,
        ...(returnTo ? { from: returnTo } : {}),
        ...(context ? { context } : {}),
      }}
      className="mt-3 block text-[12px] font-medium text-primary hover:text-foreground"
    >
      Learn: {lesson.title}
    </Link>
  );
}

export function Explainer({
  question,
  children,
  lessonId,
  returnTo,
}: { question: string; children: ReactNode } & LearningLinkProps) {
  const anchor = lessonId ? `explain-${lessonId}` : undefined;
  const hash = useLocation({ select: (location) => location.hash });
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (anchor && hash === anchor && detailsRef.current) {
      detailsRef.current.open = true;
      detailsRef.current.scrollIntoView?.({ block: "center" });
    }
  }, [anchor, hash]);
  return (
    <details
      id={anchor}
      ref={detailsRef}
      className="group scroll-mt-6 overflow-hidden rounded-[12px] border border-line bg-background"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-primary transition hover:bg-primary/5">
        <span className="min-w-0 flex-1">{question}</span>
        <span className="ml-3 shrink-0 font-mono text-[11px] text-muted-foreground transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-line px-4 pb-4 pt-3 text-pretty text-[12px] leading-[1.6] text-muted-foreground">
        {children}
        <LessonLink lessonId={lessonId} returnTo={returnTo} context={anchor} />
      </div>
    </details>
  );
}

const riskLabel: Record<RiskLevel, string> = {
  low: "Value can still fall",
  moderate: "Losses are possible",
  high: "Can fall sharply",
};

/** Risk is always described in words first. */
export function RiskNote({
  level,
  children,
  lessonId,
  returnTo,
}: { level: RiskLevel; children: ReactNode } & LearningLinkProps) {
  const anchor = lessonId ? `risk-${lessonId}` : undefined;
  return (
    <div id={anchor} className="scroll-mt-6">
      <Panel variant="warm">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-[13px] font-medium text-warm">Risk, in plain words</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {riskLabel[level]}
          </span>
        </div>
        <p className="mt-1.5 text-pretty text-[12px] leading-[1.55] text-muted-foreground">
          {children}
        </p>
        <LessonLink lessonId={lessonId} returnTo={returnTo} context={anchor} />
      </Panel>
    </div>
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
          "Education, not advice. Fund details and examples are for learning. You decide whether and when to invest; no money moves here."}
      </p>
    </Panel>
  );
}
