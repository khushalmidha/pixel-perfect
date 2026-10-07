import { createFileRoute, Link } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionLink, Eyebrow, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote } from "@/components/app/education";
import { ReportedAnswers, StartingPointCard } from "@/components/app/StartingPointCard";
import { getLesson, storageFailureMessage } from "@/lib/mock-data";
import { useStartingPointProgress } from "@/lib/starting-point-progress";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Your Starting Point — Steady" },
      { name: "description", content: "Your answers and a useful learning path." },
    ],
  }),
  component: StartingPointPage,
});
function StartingPointPage() {
  const { startingPoint, hydrated, completedIds, storageAvailable } = useStartingPointProgress();
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Your answers, your pace"
        title="Your Starting Point"
        body="A learning path shaped by what you told us. You can change your answers or explore any topic."
      />
      <div className="flex flex-col gap-4 px-5">
        {!hydrated ? (
          <p role="status">Loading your starting point…</p>
        ) : startingPoint ? (
          <>
            <StartingPointCard from="/plan" />
            <ReportedAnswers />
            <Panel>
              <Eyebrow tone="warm">Two suggested lessons</Eyebrow>
              <ol className="mt-3 flex flex-col gap-4">
                {startingPoint.lessonIds.map((id) => {
                  const lesson = getLesson(id)!;
                  return (
                    <li key={id}>
                      <Link
                        to="/learn"
                        search={{ lesson: id, from: "/plan" }}
                        className="text-[14px] font-medium text-primary"
                      >
                        {lesson.title}
                      </Link>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        {completedIds.includes(id)
                          ? "Completed · revisit any time"
                          : "Not completed"}{" "}
                        · {lesson.minutes} min
                      </p>
                    </li>
                  );
                })}
              </ol>
            </Panel>
            <ActionLink to="/welcome" variant="ghost">
              Change answers
            </ActionLink>
          </>
        ) : (
          <>
            {!storageAvailable && (
              <p role="status" className="text-[12px] text-muted-foreground">
                {storageFailureMessage}
              </p>
            )}
            <Panel>
              <p className="text-[14px]">
                No Starting Point yet. Answer three questions to find a useful place to begin.
              </p>
              <ActionLink className="mt-4" to="/welcome">
                Find my starting point
              </ActionLink>
            </Panel>
          </>
        )}
        <AdviceNote />
      </div>
    </AppFrame>
  );
}
