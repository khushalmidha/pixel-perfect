import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote } from "@/components/app/education";
import { lessons } from "@/lib/mock-data";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Steady" },
      { name: "description", content: "Two-minute explainers for the questions first-time investors actually have." },
      { property: "og:title", content: "Learn — Steady" },
      { property: "og:description", content: "Short, plain-language explainers. No jargon." },
    ],
  }),
  component: Learn,
});

function Learn() {
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Learn"
        title="Questions worth two minutes."
        body="Most answers appear right where you need them. This is the library, for when you're curious."
      />
      <div className="flex flex-col gap-2.5 px-5">
        {lessons.map((l) => (
          <Panel key={l.id} className="flex items-center justify-between py-4">
            <span className="text-[14px] font-medium">{l.title}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{l.minutes} min</span>
          </Panel>
        ))}
        <div className="mt-2">
          <AdviceNote />
        </div>
      </div>
    </AppFrame>
  );
}
