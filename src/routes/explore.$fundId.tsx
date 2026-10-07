import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionLink, Eyebrow, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote, Explainer, RiskNote } from "@/components/app/education";
import { fundExampleNote, getFund, getLesson } from "@/lib/mock-data";

export const Route = createFileRoute("/explore/$fundId")({
  loader: ({ params }) => {
    const fund = getFund(params.fundId);
    if (!fund) throw notFound();
    return { fund };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.fund.name} — Steady`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.fund.oneLiner },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.fund.oneLiner },
      ],
    };
  },
  notFoundComponent: () => (
    <AppFrame back={{ to: "/explore", label: "Explore" }}>
      <ScreenIntro eyebrow="Hmm" title="We couldn't find that fund." />
    </AppFrame>
  ),
  component: FundDetail,
});

function FundDetail() {
  const { fund } = Route.useLoaderData();
  return (
    <AppFrame back={{ to: "/explore", label: "Explore" }}>
      <ScreenIntro eyebrow={`${fund.kind} example`} title={fund.name} body={fund.oneLiner} />
      <div className="flex flex-col gap-4 px-5">
        <Panel variant="quiet">
          <p className="text-[12px] leading-[1.5] text-muted-foreground">{fundExampleNote}</p>
        </Panel>
        <Panel>
          <Eyebrow tone="warm">What you'd own</Eyebrow>
          <p className="mt-2 text-[13px] leading-[1.55] text-muted-foreground">{fund.whatYouOwn}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-[12px]">
            <div>
              <dt className="text-muted-foreground">Minimum contribution</dt>
              <dd className="mt-0.5 font-medium">Check the actual scheme</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Time to consider</dt>
              <dd className="mt-0.5 font-medium">{fund.horizon}</dd>
            </div>
          </dl>
        </Panel>
        {fund.kind === "Index fund" && (
          <Explainer
            question="What is an index fund?"
            lessonId="index-fund"
            returnTo={`/explore/${fund.id}`}
          >
            {getLesson("index-fund")!.meaning}
          </Explainer>
        )}
        <RiskNote level={fund.risk} lessonId="investment-risk" returnTo={`/explore/${fund.id}`}>
          {fund.riskInWords}
        </RiskNote>
        <Explainer
          question="What does it cost me?"
          lessonId="before-investing"
          returnTo={`/explore/${fund.id}`}
        >
          {fund.costNote}
        </Explainer>
        <AdviceNote />
        <ActionLink to="/explore" variant="ghost">
          Back to Explore
        </ActionLink>
      </div>
    </AppFrame>
  );
}
