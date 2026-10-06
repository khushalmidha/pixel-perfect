import { createFileRoute, Link } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { Eyebrow, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote } from "@/components/app/education";
import { funds } from "@/lib/mock-data";

export const Route = createFileRoute("/explore/")({
  head: () => ({
    meta: [
      { title: "Explore — Steady" },
      { name: "description", content: "A short, curated set of beginner-friendly funds, explained in plain words." },
      { property: "og:title", content: "Explore — Steady" },
      { property: "og:description", content: "Fewer choices, clearer words." },
    ],
  }),
  component: Explore,
});

function Explore() {
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Explore"
        title="A few good places to start."
        body="Not thousands of options — a short list, each explained the way a friend would."
      />
      <div className="flex flex-col gap-3 px-5">
        {funds.map((f) => (
          <Link key={f.id} to="/explore/$fundId" params={{ fundId: f.id }}>
            <Panel className="transition hover:border-primary/30">
              <Eyebrow tone="warm">{f.kind}</Eyebrow>
              <h2 className="mt-2 text-[17px] font-semibold tracking-tight">{f.name}</h2>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-muted-foreground">{f.oneLiner}</p>
            </Panel>
          </Link>
        ))}
        <AdviceNote />
      </div>
    </AppFrame>
  );
}
