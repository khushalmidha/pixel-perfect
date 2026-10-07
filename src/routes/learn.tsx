import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionButton, ActionLink, Eyebrow, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote } from "@/components/app/education";
import { getFund, getLesson, lessons, storageFailureMessage, type Lesson } from "@/lib/mock-data";
import { useLearning } from "@/lib/learning-context";
import { useStartingPointProgress } from "@/lib/starting-point-progress";
import { StartingPointCard } from "@/components/app/StartingPointCard";
import { cn } from "@/lib/utils";

type LearnSearch = {
  lesson?: string | undefined;
  from?: string | undefined;
  context?: string | undefined;
};

export const Route = createFileRoute("/learn")({
  validateSearch: (search: Record<string, unknown>): LearnSearch => {
    const lesson = typeof search["lesson"] === "string" ? search["lesson"] : undefined;
    const from = search["from"];
    const validReturn =
      typeof from === "string" &&
      (["/", "/plan", "/explore", "/journey", "/learn"].includes(from) ||
        (from.startsWith("/explore/") && !!getFund(from.slice("/explore/".length))));
    const context = search["context"];
    const validContext =
      !!lesson &&
      !!getLesson(lesson) &&
      typeof context === "string" &&
      [`explain-${lesson}`, `risk-${lesson}`].includes(context);
    return {
      lesson,
      // Explicit undefined overrides invalid values retained by router search merging.
      from: validReturn ? from : undefined,
      context: validReturn && validContext ? context : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Learn — Steady" },
      {
        name: "description",
        content: "Short explanations and gentle checks for first-time investors.",
      },
      { property: "og:title", content: "Learn — Steady" },
      { property: "og:description", content: "Build understanding, one small question at a time." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { lesson: lessonId, from, context } = Route.useSearch();
  const progress = useLearning();
  const { startingPoint, hydrated, nextLesson } = useStartingPointProgress();

  if (lessonId) {
    const lesson = getLesson(lessonId);
    if (!lesson)
      return (
        <AppFrame back={{ to: "/learn", label: "Learn" }}>
          <ScreenIntro
            eyebrow="Learn"
            title="We couldn't find that lesson."
            body="You can choose another short lesson from Learn."
          />
          <div className="px-5">
            <ActionLink to="/learn" search={{}}>
              See all lessons
            </ActionLink>
          </div>
        </AppFrame>
      );
    return (
      <LessonView
        key={lesson.id}
        lesson={lesson}
        from={from}
        context={context}
        relevant={!!startingPoint?.lessonIds.some((id) => id === lesson.id)}
      />
    );
  }

  const ordered = nextLesson
    ? [nextLesson, ...lessons.filter((lesson) => lesson.id !== nextLesson.id)]
    : lessons;
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="Learn"
        title="A little understanding, at your pace."
        body="Five short lessons. Most explanations also appear where you need them in the app. Start with a question you're curious about."
      />
      <div className="flex flex-col gap-3 px-5">
        <Panel variant="quiet">
          <Eyebrow tone="muted">Your learning progress</Eyebrow>
          <p role="status" className="mt-2 text-[13px] text-muted-foreground">
            {progress.hydrated
              ? `${progress.completedIds.length} of ${lessons.length} lessons completed. Revisit any of them whenever you like.`
              : "Loading your lesson progress…"}
          </p>
          {!progress.storageAvailable && !startingPoint && (
            <p role="status" className="mt-2 text-[12px] text-muted-foreground">
              {storageFailureMessage}
            </p>
          )}
        </Panel>
        {!hydrated ? (
          <p role="status">Loading your starting point…</p>
        ) : (
          startingPoint && <StartingPointCard from="/learn" catalogue />
        )}
        <section
          id="lesson-catalogue"
          aria-label="All lesson topics"
          className="flex scroll-mt-6 flex-col gap-3"
        >
          {ordered.map((lesson) => (
            <Link
              key={lesson.id}
              to="/learn"
              search={{ lesson: lesson.id }}
              aria-label={`Open ${lesson.title}`}
            >
              <Panel className="transition hover:border-primary/30">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[15px] font-medium">{lesson.title}</h2>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {lesson.minutes} min
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-[1.5] text-muted-foreground">
                  {lesson.description}
                </p>
                {nextLesson?.id === lesson.id && (
                  <p className="mt-2 text-[11px] text-primary">Next in your learning path</p>
                )}
                {progress.hydrated && progress.completedIds.includes(lesson.id) && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Completed · revisit any time
                  </p>
                )}
              </Panel>
            </Link>
          ))}
        </section>
        <AdviceNote>
          Education, not advice. Learning helps you ask better questions; finishing these lessons
          doesn't mean an investment is right for you.
        </AdviceNote>
      </div>
    </AppFrame>
  );
}

function LessonView({
  lesson,
  from,
  context,
  relevant,
}: {
  lesson: Lesson;
  from?: string | undefined;
  context?: string | undefined;
  relevant: boolean;
}) {
  const { startingPoint } = useStartingPointProgress();
  const { completedIds, hydrated, storageAvailable, completeLesson } = useLearning();
  const [answer, setAnswer] = useState<string | null>(null);
  const feedback = lesson.check.options.find((option) => option.id === answer);
  const completed = completedIds.includes(lesson.id);
  const returnName =
    from === "/plan"
      ? "Starting Point"
      : from === "/"
        ? "Home"
        : from === "/explore"
          ? "Explore"
          : from === "/journey"
            ? "Journey"
            : from === "/learn"
              ? "Learn"
              : "this category";
  const returnLabel = `Return to ${returnName}`;

  return (
    <AppFrame
      back={{
        to: from ?? "/learn",
        label: from ? returnName : "Learn",
        hash: context,
      }}
    >
      <ScreenIntro
        eyebrow={`${lesson.minutes} minutes · one small idea`}
        title={lesson.title}
        body={lesson.description}
      />
      <div className="flex flex-col gap-4 px-5">
        {completed && (
          <Panel variant="quiet">
            <p className="text-[12px] text-muted-foreground">
              Completed · you can revisit this idea and try the check again.
            </p>
          </Panel>
        )}
        {startingPoint && relevant && (
          <Panel variant="quiet">
            <Eyebrow>In your learning path</Eyebrow>
            <p className="mt-2 text-[13px] leading-[1.5] text-muted-foreground">
              {startingPoint.focus}
            </p>
          </Panel>
        )}
        {[
          { title: "What it means", body: lesson.meaning },
          { title: "Why it matters", body: lesson.why },
          { title: "A simple example", body: lesson.example },
          { title: "One thing to remember", body: lesson.takeaway },
        ].map((section) => (
          <Panel
            key={section.title}
            variant={section.title === "One thing to remember" ? "focus" : "default"}
          >
            <h2 className="eyebrow text-warm">{section.title}</h2>
            <p className="mt-2 text-[14px] leading-[1.6] text-muted-foreground">{section.body}</p>
          </Panel>
        ))}
        <Panel>
          <Eyebrow>A quick check</Eyebrow>
          <p className="mt-2 text-[12px] text-muted-foreground">
            No score, no rush. You can try another answer.
          </p>
          <fieldset className="mt-4">
            <legend className="mb-3 text-[14px] font-medium">{lesson.check.question}</legend>
            <div className="flex flex-col gap-2.5">
              {lesson.check.options.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-[12px] border p-3 text-[13px] leading-[1.5] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
                    answer === option.id
                      ? "border-primary/60 bg-primary/10"
                      : "border-line bg-background",
                  )}
                >
                  <input
                    type="radio"
                    name={`check-${lesson.id}`}
                    value={option.id}
                    checked={answer === option.id}
                    onChange={() => setAnswer(option.id)}
                    className="mt-1 size-3.5 shrink-0 accent-primary"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {feedback && (
            <div role="status" aria-live="polite" className="mt-4 border-t border-line pt-3">
              <p className="text-[13px] font-medium text-primary">
                {feedback.correct ? "That's the idea." : "Let's look at it another way."}
              </p>
              <p className="mt-1 text-[12px] leading-[1.6] text-muted-foreground">
                {feedback.feedback}
              </p>
            </div>
          )}
          {!completed && (
            <ActionButton
              className="mt-4"
              disabled={!hydrated || !feedback?.correct}
              onClick={() => completeLesson(lesson.id)}
            >
              Finish this lesson
            </ActionButton>
          )}
          {completed && (
            <p role="status" className="mt-4 text-[13px] text-primary">
              Lesson completed. This records learning, not readiness to invest.
            </p>
          )}
          {!storageAvailable && (
            <p className="mt-2 text-[12px] text-muted-foreground">{storageFailureMessage}</p>
          )}
        </Panel>
        {from?.startsWith("/explore/") ? (
          <ActionLink
            to="/explore/$fundId"
            params={{ fundId: from.slice("/explore/".length) }}
            search={{}}
            {...(context ? { hash: context } : {})}
            variant="ghost"
          >
            {returnLabel}
          </ActionLink>
        ) : (
          (from === "/" ||
            from === "/plan" ||
            from === "/explore" ||
            from === "/journey" ||
            from === "/learn") && (
            <ActionLink
              to={from}
              search={{}}
              {...(context ? { hash: context } : {})}
              variant="ghost"
            >
              {returnLabel}
            </ActionLink>
          )
        )}
        {completed && startingPoint && <StartingPointCard from="/learn" />}
        <ActionLink to="/learn" search={{}} variant="ghost">
          All lessons
        </ActionLink>
        <AdviceNote>
          Education, not advice. Examples are illustrations, not return predictions. Completing a
          lesson doesn't establish that an investment fits your circumstances.
        </AdviceNote>
      </div>
    </AppFrame>
  );
}
