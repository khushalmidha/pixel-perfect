import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionLink, ComingNext, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote } from "@/components/app/education";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Steady" },
      { name: "description", content: "Four gentle questions to find where you should start investing." },
      { property: "og:title", content: "Welcome — Steady" },
      { property: "og:description", content: "Find your starting point and a comfortable amount in two minutes." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <AppFrame nav={false}>
      <ScreenIntro
        eyebrow="Before anything else"
        title="Nervous about your first investment? That's normal."
        body="Four short questions. No money moves, no account needed — just a clear starting point."
      />
      <div className="flex flex-col gap-4 px-5">
        <ComingNext>
          Steps: what you earn and spend → your safety buffer → a comfortable monthly amount → how
          you'd feel if it dipped.
        </ComingNext>
        <AdviceNote />
        <ActionLink to="/">Show me where to start</ActionLink>
      </div>
    </AppFrame>
  );
}
