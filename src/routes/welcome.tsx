import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppFrame } from "@/components/app/AppFrame";
import {
  ActionButton,
  ActionLink,
  Eyebrow,
  Panel,
  ProgressLine,
} from "@/components/app/primitives";
import { AdviceNote, Explainer } from "@/components/app/education";
import { StartingPointCard, ReportedAnswers } from "@/components/app/StartingPointCard";
import {
  cushionOptions,
  feelingOptions,
  isCompleteAnswers,
  isValidAnswer,
  leftoverOptions,
  type Answers,
  type Option,
} from "@/lib/starter-plan";
import { useStartingPoint } from "@/lib/plan-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Steady" },
      {
        name: "description",
        content: "Three questions to find a useful place to begin learning.",
      },
      { property: "og:title", content: "Welcome — Steady" },
      {
        property: "og:description",
        content: "Find a useful learning focus from three short answers.",
      },
    ],
  }),
  component: Welcome,
});

type Key = keyof Answers;

const questions: {
  key: Key;
  prompt: string;
  aside?: string;
  options: Option<string>[];
  why: string;
}[] = [
  {
    key: "leftover",
    prompt: "After rent, food and the usual, how much is usually left?",
    aside: "Think of an average month, including months when nothing is comfortably spare.",
    options: leftoverOptions,
    why: "This helps us choose whether to begin with understanding spare money. It does not set an investment budget.",
  },
  {
    key: "cushion",
    prompt: "Do you have some money set aside for emergencies?",
    aside: "Like a phone breaking, a medical bill, or a gap between jobs.",
    options: cushionOptions,
    why: "Investments can be down at the exact moment you need cash. A cushion can reduce the chance that an unexpected expense forces you to withdraw at a difficult time.",
  },
  {
    key: "feeling",
    prompt: "If the money you invested fell in value, how would you feel?",
    aside: "There's no right answer. Be honest — this is about you, not a test.",
    options: feelingOptions,
    why: "Funds can lose value, sometimes sharply. Your answer helps us choose a useful explanation about risk.",
  },
];

function Welcome() {
  const { startingPoint, hydrated, saveStartingPoint } = useStartingPoint();
  const [step, setStep] = useState(0); // 0 intro, 1-3 questions, 4 summary
  const [answers, setAnswers] = useState<Answers>({});
  const [initialized, setInitialized] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const pendingAdvance = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore once, after hydration. Provider updates must not overwrite a draft.
  useEffect(() => {
    if (!hydrated || initialized) return;
    setAnswers(startingPoint ? { ...startingPoint.answers } : {});
    setStep(startingPoint ? 1 : 0);
    setInitialized(true);
  }, [hydrated, initialized, startingPoint]);

  useEffect(
    () => () => {
      if (pendingAdvance.current !== null) clearTimeout(pendingAdvance.current);
    },
    [],
  );

  const cancelAdvance = () => {
    if (pendingAdvance.current !== null) clearTimeout(pendingAdvance.current);
    pendingAdvance.current = null;
    setAdvancing(false);
  };

  const choose = (key: Key, value: string) => {
    // The ref locks synchronously, even before React disables the buttons.
    if (pendingAdvance.current !== null || questions[step - 1]?.key !== key) return;
    if (!isValidAnswer(key, value)) {
      setMessage("Please choose one of the answers below.");
      return;
    }
    const updated: Answers = { ...answers, [key]: value };
    setAnswers(updated);
    setMessage(null);
    setAdvancing(true);
    pendingAdvance.current = setTimeout(() => {
      pendingAdvance.current = null;
      setAdvancing(false);
      if (step < questions.length) {
        setStep(step + 1);
        return;
      }
      if (!isCompleteAnswers(updated)) {
        const missing = questions.findIndex((q) => !isValidAnswer(q.key, updated[q.key]));
        setStep(missing + 1);
        setMessage("Please answer this question so we can finish your starting point.");
        return;
      }
      if (saveStartingPoint(updated)) setStep(questions.length + 1);
      else setMessage("Please review your answers before finishing your starting point.");
    }, 260);
  };

  const goBack = () => {
    cancelAdvance();
    setMessage(null);
    setStep(Math.max(0, step - 1));
  };

  const restart = () => {
    cancelAdvance();
    setAnswers(startingPoint ? { ...startingPoint.answers } : {});
    setMessage(null);
    setStep(1);
  };

  if (!hydrated || !initialized)
    return (
      <AppFrame nav={false}>
        <p role="status" className="px-5 text-[13px] text-muted-foreground">
          Loading your starting point…
        </p>
      </AppFrame>
    );

  return (
    <AppFrame nav={false}>
      {step === 0 && <Intro editing={!!startingPoint} onStart={() => setStep(1)} />}
      {step >= 1 && step <= questions.length && (
        <Question
          key={step}
          index={step}
          q={questions[step - 1]!}
          selected={answers[questions[step - 1]!.key]}
          advancing={advancing}
          editing={!!startingPoint}
          message={message}
          onChoose={choose}
          onBack={goBack}
        />
      )}
      {step === questions.length + 1 && startingPoint && <Summary onRestart={restart} />}
    </AppFrame>
  );
}

function Intro({ editing, onStart }: { editing: boolean; onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col px-5">
      <section className="animate-rise pt-2">
        <Eyebrow className="mb-3">Before anything else</Eyebrow>
        <h1 className="text-balance text-[30px] font-bold leading-[1.06] tracking-tight">
          {editing
            ? "Let's review your starting point."
            : "Not sure where to begin with investing? That's normal."}
        </h1>
        <p className="mt-3 max-w-[34ch] text-pretty text-[14px] leading-[1.5] text-muted-foreground">
          {editing
            ? "Review the three questions, keep or change each answer, and we’ll update your Starting Point when you finish."
            : "Three short questions help us choose what you could understand before investing. No investment amount or fund is chosen for you."}
        </p>
      </section>

      <ul className="animate-rise mt-8 flex flex-col gap-3" style={{ animationDelay: "120ms" }}>
        {["No money moves", "No account or documents", "Change any answer later"].map((t) => (
          <li key={t} className="flex items-center gap-3 text-[13px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {t}
          </li>
        ))}
      </ul>

      <div
        className="animate-rise mt-auto flex flex-col gap-3 pb-6 pt-10"
        style={{ animationDelay: "200ms" }}
      >
        <ActionButton onClick={onStart}>
          {editing ? "Review my answers" : "Let's begin"}
        </ActionButton>
        <Link
          to="/"
          className="text-center text-[12px] text-muted-foreground hover:text-foreground"
        >
          I'll look around first
        </Link>
      </div>
    </div>
  );
}

function Question({
  index,
  q,
  selected,
  advancing,
  editing,
  message,
  onChoose,
  onBack,
}: {
  index: number;
  q: (typeof questions)[number];
  selected?: string | undefined;
  advancing: boolean;
  editing: boolean;
  message: string | null;
  onChoose: (k: Key, v: string) => void;
  onBack: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <div className="flex flex-1 flex-col px-5">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="grid min-h-11 min-w-11 place-items-center font-mono text-[11px] tracking-wider text-muted-foreground hover:text-foreground"
          aria-label="Previous question"
        >
          ←
        </button>
        <div
          className="flex-1"
          role="progressbar"
          aria-label="Onboarding progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={((index - 1 + Number(advancing)) / questions.length) * 100}
          aria-valuetext={`Question ${index} of ${questions.length}`}
        >
          <ProgressLine value={((index - 1 + Number(advancing)) / questions.length) * 100} />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground" aria-live="polite">
          {index}/{questions.length}
        </span>
      </div>

      <section className="animate-rise pt-8">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-balance text-[26px] font-bold leading-[1.1] tracking-tight"
        >
          {q.prompt}
        </h1>
        {q.aside && (
          <p className="mt-2.5 text-pretty text-[13px] leading-[1.5] text-muted-foreground">
            {q.aside}
          </p>
        )}
      </section>

      <div
        aria-label={q.prompt}
        role="group"
        className="animate-rise mt-6 flex flex-col gap-2.5"
        style={{ animationDelay: "80ms" }}
      >
        {q.options.map((o) => {
          const on = selected === o.value;
          return (
            <button
              key={o.value}
              data-onboarding-answer={o.value}
              aria-pressed={on}
              disabled={advancing}
              onClick={() => onChoose(q.key, o.value)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3.5 text-left transition",
                on
                  ? "border-primary/60 bg-primary/10 shadow-glow"
                  : "border-line bg-surface hover:border-primary/30",
              )}
            >
              <span>
                <span className="block text-[15px] font-medium">{o.label}</span>
                {o.hint && (
                  <span className="mt-0.5 block text-[12px] text-muted-foreground">{o.hint}</span>
                )}
              </span>
              <span
                className={cn(
                  "size-4 shrink-0 rounded-full border",
                  on ? "border-primary bg-primary" : "border-line",
                )}
              />
            </button>
          );
        })}
      </div>

      {editing && selected && isValidAnswer(q.key, selected) && (
        <ActionButton
          className="mt-4"
          disabled={advancing}
          onClick={() => onChoose(q.key, selected)}
        >
          Continue
        </ActionButton>
      )}
      {message && (
        <p role="alert" className="mt-4 text-[13px] text-muted-foreground">
          {message}
        </p>
      )}

      <div className="mt-5 pb-6">
        <Explainer question="Why are we asking this?">{q.why}</Explainer>
      </div>
    </div>
  );
}

function Summary({ onRestart }: { onRestart: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <div className="flex flex-col gap-4 px-5 pb-6">
      <h1 ref={headingRef} tabIndex={-1} className="sr-only">
        Your Starting Point
      </h1>
      <StartingPointCard from="/plan" />
      <ReportedAnswers />
      <ActionLink to="/" variant="ghost">
        Go to Home
      </ActionLink>
      <ActionButton variant="ghost" onClick={onRestart}>
        Change answers
      </ActionButton>
      <AdviceNote />
    </div>
  );
}
