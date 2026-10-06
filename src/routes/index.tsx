import { createFileRoute, Link } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionLink, Eyebrow, Panel, ProgressLine, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote, Explainer, RiskNote } from "@/components/app/education";
import { formatINR, getFund, starterPlan } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Steady — your first investment, one calm step" },
      { name: "description", content: "A calm investing companion for first-time investors in India." },
      { property: "og:title", content: "Steady — your first investment, one calm step" },
      { property: "og:description", content: "Start small, understand every rupee, and invest without the hesitation." },
    ],
  }),
  component: Home,
});

function Home() {
  const fund = getFund(starterPlan.fundId)!;
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Your one next step"
        title="Start with what you already have."
        body="You don't need a big amount. You need one small, patient habit. We'll walk through it together."
      />

      <section className="animate-rise px-5" style={{ animationDelay: "140ms" }}>
        <Panel variant="focus">
          <div className="flex items-start justify-between">
            <div>
              <Eyebrow>Starter plan</Eyebrow>
              <p className="mt-2 text-[22px] font-semibold tracking-tight">
                {formatINR(starterPlan.monthly)}
                <span className="text-[13px] font-normal text-muted-foreground"> / month</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground">into</p>
              <p className="text-[12px] font-medium text-warm">{fund.name.replace(" Fund", "")}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-line pt-3">
            <ProgressLine
              value={starterPlan.progress}
              caption="You've set your amount — you're already past the hardest part."
            />
          </div>
          <ActionLink to="/plan" className="mt-4">
            Review my ₹500 plan
          </ActionLink>
          <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
            Pause or change the amount any day. No lock-in.
          </p>
        </Panel>
      </section>

      <section className="animate-rise mt-6 px-5" style={{ animationDelay: "210ms" }}>
        <Panel>
          <Eyebrow tone="warm">What you're buying</Eyebrow>
          <Link to="/explore/$fundId" params={{ fundId: fund.id }}>
            <h2 className="mt-2 text-[17px] font-semibold tracking-tight hover:text-primary">{fund.name}</h2>
          </Link>
          <p className="mt-2 text-pretty text-[13px] leading-[1.55] text-muted-foreground">
            {fund.oneLiner} {fund.whatYouOwn}
          </p>
          <div className="mt-4">
            <RiskNote level={fund.risk}>{fund.riskInWords}</RiskNote>
          </div>
          <div className="mt-4">
            <Explainer question={`What does "index fund" mean?`}>
              An index fund copies a list of companies instead of a person picking winners. Because it
              just copies, it charges very little — and no one is guessing on your behalf.
            </Explainer>
          </div>
        </Panel>
      </section>

      <section className="animate-rise mt-5 px-5" style={{ animationDelay: "280ms" }}>
        <AdviceNote />
      </section>
    </AppFrame>
  );
}
