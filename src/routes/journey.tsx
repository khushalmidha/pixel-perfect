import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ComingNext, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote, Explainer } from "@/components/app/education";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Money journey — Steady" },
      { name: "description", content: "Your money's story over time, told in moments rather than charts." },
      { property: "og:title", content: "Money journey — Steady" },
      { property: "og:description", content: "Track what you put in and what it became, calmly." },
    ],
  }),
  component: Journey,
});

function Journey() {
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Money journey"
        title="Nothing here yet — and that's fine."
        body="Once your first ₹500 goes in, this becomes a simple story: what you put in, what it's worth, and what happened along the way."
      />
      <div className="flex flex-col gap-4 px-5">
        <ComingNext>Timeline of moments (first SIP, first dip, first year) instead of a price chart.</ComingNext>
        <Explainer question="What if the number goes down?">
          It will, sometimes. A dip only becomes a loss if you sell during it.
        </Explainer>
        <AdviceNote />
      </div>
    </AppFrame>
  );
}
