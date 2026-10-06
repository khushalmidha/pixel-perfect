import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppFrame } from "@/components/app/AppFrame";
import { ActionLink, Eyebrow, Panel, ScreenIntro } from "@/components/app/primitives";
import { AdviceNote, Explainer, RiskNote } from "@/components/app/education";
import { formatINR, getFund } from "@/lib/mock-data";

export const Route = createFileRoute("/explore/$fundId")({
  loader: ({ params }) => {
    const fund = getFund(params.fundId);
    if (!fund) throw notFound();
    return { fund };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
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
      <ScreenIntro eyebrow={fund.kind} title={fund.name} body={fund.oneLiner} />
      <div className="flex flex-col gap-4 px-5">
        <Panel>
          <Eyebrow tone="warm">What you'd own</Eyebrow>
          <p className="mt-2 text-[13px] leading-[1.55] text-muted-foreground">{fund.whatYouOwn}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-[12px]">
            <div>
              <dt className="text-muted-foreground">Start from</dt>
              <dd className="mt-0.5 font-medium">{formatINR(fund.minMonthly)} / month</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Good for</dt>
              <dd className="mt-0.5 font-medium">{fund.horizon}</dd>
            </div>
          </dl>
        </Panel>
        <RiskNote level={fund.risk}>{fund.riskInWords}</RiskNote>
        <Explainer question="What does it cost me?">{fund.costNote}</Explainer>
        <AdviceNote />
        <ActionLink to="/plan" variant="ghost">
          See how this fits my plan
        </ActionLink>
      </div>
    </AppFrame>
  );
}
