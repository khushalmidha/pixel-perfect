import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionLink, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote } from "@/components/app/education";
import { StartingPointCard } from "@/components/app/StartingPointCard";
import { useStartingPoint } from "@/lib/plan-context";
import { storageFailureMessage } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Steady — understand before you invest" },
      { name: "description", content: "Find a useful place to begin learning about investing." },
    ],
  }),
  component: Home,
});
function Home() {
  const { startingPoint, hydrated, storageAvailable } = useStartingPoint();
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="One useful next step"
        title="What can I understand next?"
        body="Understand investing at your pace, starting with what matters to you."
      />
      <div className="flex flex-col gap-4 px-5">
        {!hydrated ? (
          <p role="status">Loading your starting point…</p>
        ) : startingPoint ? (
          <>
            <StartingPointCard from="/" />
            <ActionLink to="/plan" variant="ghost">
              Review my Starting Point
            </ActionLink>
          </>
        ) : (
          <>
            {!storageAvailable && (
              <p role="status" className="text-[12px] text-muted-foreground">
                {storageFailureMessage}
              </p>
            )}
            <Panel variant="focus">
              <p className="text-[14px] leading-[1.5]">
                Three short questions help us choose a useful place for you to learn. You can also
                explore without answering.
              </p>
              <ActionLink to="/welcome" className="mt-4">
                Find my starting point
              </ActionLink>
            </Panel>
            <ActionLink to="/learn" search={{}} variant="ghost">
              Browse lessons
            </ActionLink>
          </>
        )}
        <AdviceNote />
      </div>
    </AppFrame>
  );
}
