import { useStartingPointProgress } from "@/lib/starting-point-progress";
import { ActionLink, Eyebrow, Panel } from "./primitives";
import { storageFailureMessage, pathCompleteMessage } from "@/lib/mock-data";

export function StartingPointCard({
  from,
  catalogue = false,
}: {
  from: "/" | "/plan" | "/learn";
  catalogue?: boolean;
}) {
  const { startingPoint, hydrated, nextLesson, completedCount, storageAvailable, migrated } =
    useStartingPointProgress();
  if (!hydrated)
    return (
      <p role="status" className="text-[13px] text-muted-foreground">
        Loading your starting point…
      </p>
    );
  if (!startingPoint) return null;
  return (
    <>
      {!storageAvailable && (
        <p role="status" className="text-[12px] text-muted-foreground">
          {storageFailureMessage}
        </p>
      )}
      {migrated && (
        <p className="text-[12px] text-muted-foreground">
          Your saved answers now guide a learning path. Steady no longer calculates an investment
          amount.
        </p>
      )}
      <Panel variant="focus">
        <Eyebrow>A useful place to begin</Eyebrow>
        <h2 className="mt-2 text-[19px] font-semibold leading-snug">{startingPoint.focus}</h2>
        <p className="mt-3 text-[13px] leading-[1.5] text-muted-foreground">
          {startingPoint.explanation}
        </p>
        <p className="mt-3 text-[12px] text-muted-foreground">
          {completedCount} of 2 suggested lessons completed.
        </p>
        {nextLesson ? (
          <>
            <p className="mt-3 text-[12px] text-muted-foreground">
              {completedCount ? "Next in this path" : "Start with"} · {nextLesson.minutes} min
            </p>
            <ActionLink className="mt-2" to="/learn" search={{ lesson: nextLesson.id, from }}>
              Open {nextLesson.title}
            </ActionLink>
          </>
        ) : (
          <>
            <p role="status" className="mt-3 text-[13px] leading-[1.5]">
              {pathCompleteMessage}
            </p>
            <ActionLink
              className="mt-4"
              to="/learn"
              search={{}}
              {...(catalogue ? { hash: "lesson-catalogue" } : {})}
            >
              Explore other topics
            </ActionLink>
          </>
        )}
      </Panel>
    </>
  );
}
export function ReportedAnswers() {
  const { startingPoint } = useStartingPointProgress();
  if (!startingPoint) return null;
  return (
    <Panel>
      <Eyebrow tone="warm">What you told us</Eyebrow>
      <dl className="mt-3 flex flex-col gap-3">
        {startingPoint.reportedAnswers.map((answer) => (
          <div key={answer.key}>
            <dt className="text-[12px] text-muted-foreground">{answer.label}</dt>
            <dd className="mt-1 text-[14px]">
              {answer.answer}
              {answer.hint && (
                <span className="block text-[12px] text-muted-foreground">{answer.hint}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
