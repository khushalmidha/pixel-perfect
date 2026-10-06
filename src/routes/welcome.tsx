import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionButton, ActionLink, Eyebrow, Panel, ProgressLine } from "@/components/app/primitives";
import { AdviceNote, Explainer, RiskNote } from "@/components/app/education";
import {
  buildPlan,
  cushionOptions,
  feelingOptions,
  incomeOptions,
  leftoverOptions,
  type Answers,
  type Option,
} from "@/lib/starter-plan";
import { formatINR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Steady" },
      { name: "description", content: "Four gentle questions to find a comfortable first investing plan." },
      { property: "og:title", content: "Welcome — Steady" },
      { property: "og:description", content: "Find your starting point and a comfortable amount in under three minutes." },
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
    key: "income",
    prompt: "Roughly how much money comes in each month?",
    aside: "Salary, stipend, freelance, pocket money — a rough range is enough.",
    options: incomeOptions,
    why: "It helps us keep suggestions in proportion to your life. We never ask for payslips, and nothing is checked.",
  },
  {
    key: "leftover",
    prompt: "After rent, food and the usual, how much is usually left?",
    aside: "Think of an average month, not your best one.",
    options: leftoverOptions,
    why: "This matters more than income. You should only ever invest from money that's genuinely spare — never from what you need.",
  },
  {
    key: "cushion",
    prompt: "Do you have some money set aside for emergencies?",
    aside: "Like a phone breaking, a medical bill, or a gap between jobs.",
    options: cushionOptions,
    why: "Investments can be down at the exact moment you need cash. A cushion means you'll never be forced to take money out at a bad time.",
  },
  {
    key: "feeling",
    prompt: "If the money you invested went down for a while, how would you feel?",
    aside: "There's no right answer. Be honest — this is about you, not a test.",
    options: feelingOptions,
    why: "Almost every investment dips sometimes. Knowing how you'd react helps us pick something you can stay calm with.",
  },
];

function Welcome() {
  const [step, setStep] = useState(0); // 0 intro, 1-4 questions, 5 summary
  const [answers, setAnswers] = useState<Answers>({});

  const choose = (key: Key, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(() => setStep((s) => s + 1), 260);
  };

  return (
    <AppFrame nav={false}>
      {step === 0 && <Intro onStart={() => setStep(1)} />}
      {step >= 1 && step <= 4 && (
        <Question
          key={step}
          index={step}
          q={questions[step - 1]!}
          selected={answers[questions[step - 1]!.key]}
          onChoose={choose}
          onBack={() => setStep((s) => s - 1)}
        />
      )}
      {step === 5 && (
        <Summary answers={answers as Required<Answers>} onRestart={() => setStep(1)} />
      )}
    </AppFrame>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col px-5">
      <section className="animate-rise pt-2">
        <Eyebrow className="mb-3">Before anything else</Eyebrow>
        <h1 className="text-balance text-[30px] font-bold leading-[1.06] tracking-tight">
          Nervous about your first investment? That's normal.
        </h1>
        <p className="mt-3 max-w-[34ch] text-pretty text-[14px] leading-[1.5] text-muted-foreground">
          Let's talk for two minutes. Four simple questions, then we'll suggest a starting point — and
          show you exactly why.
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

      <div className="animate-rise mt-auto flex flex-col gap-3 pb-6 pt-10" style={{ animationDelay: "200ms" }}>
        <ActionButton onClick={onStart}>Let's begin</ActionButton>
        <Link to="/" className="text-center text-[12px] text-muted-foreground hover:text-foreground">
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
  onChoose,
  onBack,
}: {
  index: number;
  q: (typeof questions)[number];
  selected?: string;
  onChoose: (k: Key, v: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col px-5">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="font-mono text-[11px] tracking-wider text-muted-foreground hover:text-foreground"
          aria-label="Previous question"
        >
          ←
        </button>
        <div className="flex-1">
          <ProgressLine value={(index / 4) * 100} />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">{index}/4</span>
      </div>

      <section className="animate-rise pt-8">
        <h1 className="text-balance text-[26px] font-bold leading-[1.1] tracking-tight">{q.prompt}</h1>
        {q.aside && (
          <p className="mt-2.5 text-pretty text-[13px] leading-[1.5] text-muted-foreground">{q.aside}</p>
        )}
      </section>

      <div role="radiogroup" className="animate-rise mt-6 flex flex-col gap-2.5" style={{ animationDelay: "80ms" }}>
        {q.options.map((o) => {
          const on = selected === o.value;
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={on}
              onClick={() => onChoose(q.key, o.value)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3.5 text-left transition",
                on ? "border-primary/60 bg-primary/10 shadow-glow" : "border-line bg-surface hover:border-primary/30",
              )}
            >
              <span>
                <span className="block text-[15px] font-medium">{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-[12px] text-muted-foreground">{o.hint}</span>}
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

      <div className="mt-5 pb-6">
        <Explainer question="Why are we asking this?">{q.why}</Explainer>
      </div>
    </div>
  );
}

function Summary({ answers, onRestart }: { answers: Required<Answers>; onRestart: () => void }) {
  const plan = buildPlan(answers);
  return (
    <div className="flex flex-col gap-4 px-5 pb-6">
      <section className="animate-rise pt-2">
        <Eyebrow className="mb-3">Your starting point</Eyebrow>
        <h1 className="text-balance text-[28px] font-bold leading-[1.08] tracking-tight">
          Here's a plan that fits where you are today.
        </h1>
      </section>

      <div className="animate-rise" style={{ animationDelay: "80ms" }}>
        <Panel variant="focus">
          <Eyebrow>Suggested monthly amount</Eyebrow>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight">
            {formatINR(plan.monthly)}
            <span className="text-[14px] font-normal text-muted-foreground"> / month</span>
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            into <span className="font-medium text-warm">{plan.fundName}</span> · pause or change any time
          </p>
        </Panel>
      </div>

      <div className="animate-rise" style={{ animationDelay: "140ms" }}>
        <Panel>
          <Eyebrow tone="warm">How we got here</Eyebrow>
          <ol className="mt-3 flex flex-col gap-3">
            {plan.reasons.map((r, i) => (
              <li key={i} className="flex gap-3 text-pretty text-[13px] leading-[1.5] text-muted-foreground">
                <span className="mt-0.5 font-mono text-[11px] text-primary">0{i + 1}</span>
                {r}
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="animate-rise" style={{ animationDelay: "200ms" }}>
        <Panel>
          <Eyebrow tone="muted">What this money is for</Eyebrow>
          <p className="mt-2 text-pretty text-[14px] leading-[1.5]">{plan.purpose}</p>
        </Panel>
      </div>

      <div className="animate-rise" style={{ animationDelay: "240ms" }}>
        <RiskNote level={plan.risk}>{plan.riskText}</RiskNote>
      </div>

      <Explainer question="Isn't this too small to matter?">
        Starting small is the point. The first few months are about getting used to seeing your money
        move. Once it feels normal, you can raise the amount in a tap.
      </Explainer>

      <Panel>
        <Eyebrow tone="muted">What happens next</Eyebrow>
        <ul className="mt-3 flex flex-col gap-2 text-[13px] text-muted-foreground">
          <li>1. Read about {plan.fundName} in plain words — about two minutes.</li>
          <li>2. Adjust the amount if it doesn't feel right.</li>
          <li>3. Decide when you're ready. There's no rush.</li>
        </ul>
      </Panel>

      <AdviceNote>
        This is a starting suggestion based on your four answers — education, not financial advice.
        You decide whether and when to invest.
      </AdviceNote>

      <div className="flex flex-col gap-3 pt-2">
        <ActionLink to="/explore/$fundId" params={{ fundId: plan.fundId }}>
          Understand my first fund
        </ActionLink>
        <ActionButton variant="ghost" onClick={onRestart}>
          Change my answers
        </ActionButton>
      </div>
    </div>
  );
}
