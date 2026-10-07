import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppFrame } from "@/components/app/AppFrame";
import {
  ActionButton,
  Eyebrow,
  Panel,
  ProgressLine,
  ScreenIntro,
} from "@/components/app/primitives";
import { AdviceNote, Explainer } from "@/components/app/education";
import { formatINR, getMockJourney, mockJourney } from "@/lib/mock-data";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Money Journey: An Example — Steady" },
      {
        name: "description",
        content: "A fictional example explaining contributions and current value.",
      },
    ],
  }),
  component: Journey,
});
function Journey() {
  const [preview, setPreview] = useState(false);
  const journey = getMockJourney();
  return (
    <AppFrame>
      <ScreenIntro
        eyebrow="A shared learning example"
        title="Money Journey: An Example"
        body="See the difference between money contributed and what an investment is worth. This fictional story is the same for everyone."
      />
      <div className="flex flex-col gap-4 px-5">
        <Panel variant="quiet">
          <Eyebrow tone="muted">Entirely simulated</Eyebrow>
          <p className="mt-2 text-[13px] leading-[1.5] text-muted-foreground">
            This example uses {formatINR(mockJourney.monthly)} a month for simple arithmetic. It is
            not your budget or future portfolio. No money moves.
          </p>
          <ActionButton
            variant="ghost"
            className="mt-4"
            onClick={() => setPreview((value) => !value)}
          >
            {preview ? "Hide the example" : "Show the example"}
          </ActionButton>
        </Panel>
        {preview && (
          <>
            <Panel variant="focus">
              <Eyebrow>12-contribution milestone · example</Eyebrow>
              <h2 className="mt-2 text-[18px] font-semibold">Three contributions, one example</h2>
              <p className="mt-3 text-[22px] font-semibold">
                {formatINR(journey.contributed)}{" "}
                <span className="text-[13px] font-normal text-muted-foreground">
                  of {formatINR(journey.milestoneAmount)}
                </span>
              </p>
              <div
                className="mt-3"
                role="progressbar"
                aria-label="Example contribution progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={journey.progressPercent}
              >
                <ProgressLine
                  value={journey.progressPercent}
                  caption="3 of 12 example contributions · 25%"
                />
              </div>
              <p className="mt-3 text-[12px] text-muted-foreground">
                An example milestone, not a goal you entered or a forecast. Progress counts
                contributions, not returns.
              </p>
            </Panel>
            <Panel>
              <Eyebrow tone="warm">Contributions and value</Eyebrow>
              <dl className="mt-3 flex flex-col gap-3 text-[14px]">
                <div className="flex flex-wrap justify-between gap-2">
                  <dt>Contributed in this example</dt>
                  <dd>{formatINR(journey.contributed)}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt>Fictional current value</dt>
                  <dd>{formatINR(journey.currentValue)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[13px] leading-[1.5] text-muted-foreground">
                The made-up value is lower to illustrate the difference. It could be higher or
                lower; this is not a prediction or a limit on losses.
              </p>
            </Panel>
            <Panel>
              <Eyebrow tone="warm">The fictional timeline</Eyebrow>
              <ol className="mt-3 flex flex-col gap-4">
                {journey.timeline.map((event) => (
                  <li key={event.month} className="border-l border-line pl-3">
                    <h3 className="text-[14px] font-medium">Month {event.month}</h3>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {formatINR(event.contribution)} contributed · {formatINR(event.contributed)}{" "}
                      contributed in total.
                    </p>
                  </li>
                ))}
              </ol>
            </Panel>
          </>
        )}
        <Explainer
          question="Why can value differ from contributions?"
          lessonId="investment-risk"
          returnTo="/journey"
        >
          Contributions are the money put in. Current value changes with the underlying investments
          and can fall below the amount contributed.
        </Explainer>
        <Explainer
          question="What does a monthly contribution mean?"
          lessonId="sip-explained"
          returnTo="/journey"
        >
          A SIP is a way of contributing regularly. It does not guarantee growth or remove
          investment risk.
        </Explainer>
        <AdviceNote>
          Education, not advice. All contributions and values here are fictional illustrations.
        </AdviceNote>
      </div>
    </AppFrame>
  );
}
