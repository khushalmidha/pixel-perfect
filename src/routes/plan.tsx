import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ComingNext, Eyebrow, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote, Explainer } from "@/components/app/education";
import { formatINR, starterPlan, user } from "@/lib/mock-data";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Your starter plan — Steady" },
      { name: "description", content: "A personal, comfortable first investing plan built from your answers." },
      { property: "og:title", content: "Your starter plan — Steady" },
      { property: "og:description", content: "How much you can comfortably invest, and why." },
    ],
  }),
  component: Plan,
});

function Plan() {
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Starter plan"
        title={`${formatINR(starterPlan.monthly)} a month feels right for you.`}
        body={`That's about 1.3% of your ${formatINR(user.monthlyIncome)} income — small enough to forget, steady enough to grow.`}
      />
      <div className="flex flex-col gap-4 px-5">
        <Panel>
          <Eyebrow>Your path</Eyebrow>
          <ol className="mt-3 flex flex-col gap-2.5">
            {starterPlan.steps.map((s, i) => (
              <li key={s.label} className="flex items-center gap-3 text-[13px]">
                <span
                  className={
                    s.done
                      ? "grid size-5 place-items-center rounded-full bg-primary font-mono text-[10px] text-primary-foreground"
                      : "grid size-5 place-items-center rounded-full border border-line font-mono text-[10px] text-muted-foreground"
                  }
                >
                  {s.done ? "✓" : i + 1}
                </span>
                <span className={s.done ? "text-muted-foreground" : "text-foreground"}>{s.label}</span>
              </li>
            ))}
          </ol>
        </Panel>
        <Explainer question="Why not invest more?">
          Starting small lets you live through a dip without panic. You can raise the amount any time.
        </Explainer>
        <ComingNext>Amount slider with a "what if it dips 10%" preview, in rupees.</ComingNext>
        <AdviceNote />
      </div>
    </AppFrame>
  );
}
