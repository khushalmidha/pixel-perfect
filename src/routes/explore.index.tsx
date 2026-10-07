import { createFileRoute, Link } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { Eyebrow, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote } from "@/components/app/education";
import { fundExampleNote, funds } from "@/lib/mock-data";

export const Route = createFileRoute("/explore/")({
  head: () => ({
    meta: [
      { title: "Explore fund categories — Steady" },
      { name: "description", content: "Three fund categories, explained for learning." },
    ],
  }),
  component: Explore,
});
function Explore() {
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Explore"
        title="Three fund categories, in plain words."
        body="Discover what different funds hold and what could go wrong. Choose any category to learn more."
      />
      <div className="flex flex-col gap-3 px-5">
        <Panel variant="quiet">
          <p className="text-[12px] leading-[1.5] text-muted-foreground">{fundExampleNote}</p>
        </Panel>
        {funds.map((fund) => (
          <Link key={fund.id} to="/explore/$fundId" params={{ fundId: fund.id }}>
            <Panel className="transition hover:border-primary/30">
              <Eyebrow tone="warm">{fund.kind}</Eyebrow>
              <h2 className="mt-2 text-[17px] font-semibold tracking-tight">{fund.name}</h2>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-muted-foreground">
                {fund.oneLiner}
              </p>
              <p className="mt-2 text-[12px] text-muted-foreground">
                {fund.risk === "high" ? "Can fall sharply" : "Value can still fall"}
              </p>
            </Panel>
          </Link>
        ))}
        <AdviceNote />
      </div>
    </AppFrame>
  );
}
