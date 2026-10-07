import { QueryClient } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getFund,
  funds,
  getLesson,
  lessons,
  pathCompleteMessage,
  storageFailureMessage,
} from "@/lib/mock-data";
import { buildStartingPoint, type Answers } from "@/lib/starter-plan";
import { Route as RootRoute } from "@/routes/__root";
import { Route as HomeRoute } from "@/routes/index";
import { Route as PlanRoute } from "@/routes/plan";
import { Route as WelcomeRoute } from "@/routes/welcome";
import { Route as ExploreRoute } from "@/routes/explore.index";
import { Route as FundRoute } from "@/routes/explore.$fundId";
import { Route as JourneyRoute } from "@/routes/journey";
import { Route as LearnRoute } from "@/routes/learn";

// Use the real root component (including PlanProvider) and real screen
// components. Omit the document shell so jsdom needn't load external CSS.
function makeRouter(initialPath: string) {
  const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    component: RootRoute.options.component!,
  });
  const home = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomeRoute.options.component!,
  });
  const welcome = createRoute({
    getParentRoute: () => rootRoute,
    path: "welcome",
    component: WelcomeRoute.options.component!,
  });
  const plan = createRoute({
    getParentRoute: () => rootRoute,
    path: "plan",
    component: PlanRoute.options.component!,
  });
  const journey = createRoute({
    getParentRoute: () => rootRoute,
    path: "journey",
    component: JourneyRoute.options.component!,
  });
  const learn = createRoute({
    getParentRoute: () => rootRoute,
    path: "learn",
    component: LearnRoute.options.component!,
    validateSearch: LearnRoute.options.validateSearch!,
  });
  const explore = createRoute({
    getParentRoute: () => rootRoute,
    path: "explore",
    component: Outlet,
  });
  const catalog = createRoute({
    getParentRoute: () => explore,
    path: "/",
    component: ExploreRoute.options.component!,
  });
  const fund = createRoute({
    getParentRoute: () => explore,
    path: "$fundId",
    component: FundRoute.options.component!,
    loader: ({ params }) => ({ fund: getFund(params.fundId)! }),
  });
  return createRouter({
    routeTree: rootRoute.addChildren([
      home,
      welcome,
      plan,
      journey,
      learn,
      explore.addChildren([catalog, fund]),
    ]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    context: { queryClient: new QueryClient() },
  });
}

let container: HTMLDivElement;
let root: Root;
let router: ReturnType<typeof makeRouter>;

async function mount(path: string) {
  container = document.createElement("div");
  document.body.append(container);
  router = makeRouter(path);
  root = createRoot(container);
  await act(async () => {
    await router.load();
    root.render(<RouterProvider router={router} />);
  });
}

async function unmount() {
  await act(async () => root.unmount());
  router.options.context?.queryClient.clear();
  container.remove();
}

function text() {
  return container.textContent ?? "";
}

async function followLink(label: string) {
  const link = Array.from(container.querySelectorAll("a")).find((a) => a.textContent === label);
  expect(link, `Link: ${label}`).toBeDefined();
  await act(async () => {
    link!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    await router.load();
  });
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
});

afterEach(async () => {
  await unmount();
  vi.restoreAllMocks();
  localStorage.clear();
});

const base = { leftover: "medium", cushion: "solid", feeling: "calm" } as const;
const riskAnswers = { ...base, feeling: "uneasy" } as const;
function seed(answers: Required<Answers> = base) {
  const record = { schemaVersion: 2, answers, savedAt: 123 };
  localStorage.setItem("steady_plan_v1", JSON.stringify(record));
  return record;
}
function button(label: string) {
  const value = Array.from(container.querySelectorAll("button")).find(
    (node) => node.textContent === label,
  );
  expect(value, label).toBeDefined();
  return value!;
}
async function click(label: string) {
  await act(async () => button(label).click());
}
async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 280));
  });
}
async function answer(index: number) {
  await act(async () =>
    container.querySelectorAll<HTMLButtonElement>("[data-onboarding-answer]")[index]!.click(),
  );
  await settle();
}
async function go(to: "/" | "/plan" | "/welcome" | "/learn" | "/journey" | "/explore") {
  await act(async () => {
    await router.navigate({ to, search: {} });
  });
}
async function openLesson(id: string, from?: "/" | "/plan" | "/journey" | "/learn") {
  await act(async () => {
    await router.navigate({ to: "/learn", search: { lesson: id, ...(from ? { from } : {}) } });
  });
}
async function quiz(id: string, correct: boolean) {
  const choice = getLesson(id)!.check.options.find((option) => option.correct === correct)!;
  await act(async () =>
    container.querySelector<HTMLInputElement>(`input[value="${choice.id}"]`)!.click(),
  );
}
function persisted() {
  return JSON.parse(localStorage.getItem("steady_plan_v1")!);
}

describe("Starting Point continuity", () => {
  it.each([
    [{ leftover: "tiny", cushion: "solid", feeling: "calm" }, [0, 2, 2]],
    [riskAnswers, [2, 2, 1]],
    [base, [2, 2, 2]],
  ] satisfies [Required<Answers>, number[]][])(
    "keeps %j consistent through summary, Home, Start and refresh",
    async (answers, choices) => {
      await mount("/welcome");
      await click("Let's begin");
      for (const index of choices) await answer(index);
      const expected = buildStartingPoint(answers);
      expect(text()).toContain(expected.focus);
      expect(text()).toContain(expected.explanation);
      expect(text()).toContain("What you told us");
      expect(text()).not.toMatch(/₹[\d,]+\s*\/ month|Suggested monthly|selected fund/i);
      expect(persisted()).toEqual({ schemaVersion: 2, answers, savedAt: expect.any(Number) });
      const stored = localStorage.getItem("steady_plan_v1");
      await followLink("Go to Home");
      expect(text()).toContain(expected.focus);
      await followLink("Start");
      expect(text()).toContain("Your Starting Point");
      expect(text()).toContain(expected.focus);
      await unmount();
      await mount("/plan");
      expect(text()).toContain(expected.focus);
      expect(localStorage.getItem("steady_plan_v1")).toBe(stored);
    },
  );
  it("edits a draft, commits only at the end, and preserves lesson completion", async () => {
    const original = seed(riskAnswers);
    localStorage.setItem("steady_learning_v1", JSON.stringify(["investment-risk"]));
    await mount("/plan");
    await followLink("Change answers");
    expect(container.querySelectorAll("[data-onboarding-answer]")[2]).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await answer(0);
    expect(persisted()).toEqual(original);
    await click("Continue");
    await settle();
    await click("Continue");
    await settle();
    expect(persisted().answers).toEqual({ ...riskAnswers, leftover: "tiny" });
    expect(text()).toContain("Understand what is spare");
    expect(text()).toContain("1 of 2 suggested lessons completed");
    expect(localStorage.getItem("steady_learning_v1")).toBe('["investment-risk"]');
  });
  it("abandoning edits keeps the previous Starting Point", async () => {
    const original = seed();
    await mount("/welcome");
    await answer(0);
    await go("/");
    expect(persisted()).toEqual(original);
    expect(text()).toContain(buildStartingPoint(base).focus);
  });
});

describe("three-question onboarding reliability", () => {
  it("advances once on rapid clicks and shows real progress without income", async () => {
    await mount("/welcome");
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    await click("Let's begin");
    expect(text()).not.toMatch(/income|salary/i);
    for (let step = 1; step <= 3; step++) {
      expect(container.querySelector("h1")).toHaveFocus();
      expect(container.querySelector('[role="radio"]')).toBeNull();
      expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
        "aria-valuetext",
        `Question ${step} of 3`,
      );
      await act(async () => {
        const choices = container.querySelectorAll<HTMLButtonElement>("[data-onboarding-answer]");
        choices[0]!.click();
        choices[1]!.click();
        choices[0]!.click();
      });
      await settle();
    }
    expect(persisted().answers).toEqual({ leftover: "tiny", cushion: "none", feeling: "anxious" });
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    expect(container.querySelector("h1")).toHaveFocus();
    await settle();
    expect(text()).toContain("What you told us");
  });
  it("cancels a pending advance on Back and restores earlier answers", async () => {
    await mount("/welcome");
    await click("Let's begin");
    await answer(1);
    await act(async () => {
      container.querySelectorAll<HTMLButtonElement>("[data-onboarding-answer]")[0]!.click();
      container.querySelector<HTMLButtonElement>('button[aria-label="Previous question"]')!.click();
    });
    await settle();
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
      "aria-valuetext",
      "Question 1 of 3",
    );
    expect(container.querySelectorAll("[data-onboarding-answer]")[1]).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(localStorage.getItem("steady_plan_v1")).toBeNull();
  });
  it("cancels final-question work when navigating away", async () => {
    await mount("/welcome");
    await click("Let's begin");
    await answer(2);
    await answer(2);
    await act(async () => {
      container.querySelectorAll<HTMLButtonElement>("[data-onboarding-answer]")[2]!.click();
      await router.navigate({ to: "/" });
    });
    await settle();
    expect(localStorage.getItem("steady_plan_v1")).toBeNull();
  });
});

describe("storage and legacy restoration", () => {
  it.each([123, null, "invalid", -1, 1e20])(
    "converts legacy data and strips every investment field (timestamp %j)",
    async (timestamp) => {
      localStorage.setItem(
        "steady_plan_v1",
        JSON.stringify({
          answers: { ...riskAnswers, income: "gt75" },
          savedAt: timestamp,
          monthly: 2000,
          fundId: "nifty-50-index",
          purpose: "old purpose",
          horizon: "years",
          risk: "high",
          reasons: ["old"],
        }),
      );
      await mount("/plan");
      expect(text()).toContain(buildStartingPoint(riskAnswers).focus);
      expect(text()).toContain("Your saved answers now guide a learning path");
      expect(persisted()).toEqual({
        schemaVersion: 2,
        answers: riskAnswers,
        savedAt: timestamp === 123 ? 123 : null,
      });
      expect(text()).not.toContain("old purpose");
    },
  );
  it.each([
    "not JSON",
    "null",
    "{}",
    JSON.stringify({ schemaVersion: 99, answers: base, savedAt: 0 }),
    JSON.stringify({ schemaVersion: 2, answers: { ...base, feeling: "unknown" }, savedAt: 0 }),
  ])("handles invalid stored records without crashing: %s", async (raw) => {
    localStorage.setItem("steady_plan_v1", raw);
    await mount("/plan");
    expect(text()).toContain("No Starting Point yet");
  });
  it.each([123, undefined, "invalid", -1, 1e20])(
    "preserves valid version-2 answers with timestamp %j",
    async (timestamp) => {
      localStorage.setItem(
        "steady_plan_v1",
        JSON.stringify({ schemaVersion: 2, answers: base, savedAt: timestamp }),
      );
      await mount("/plan");
      expect(text()).toContain(buildStartingPoint(base).focus);
      expect(persisted()).toEqual({
        schemaVersion: 2,
        answers: base,
        savedAt: timestamp === 123 ? 123 : null,
      });
      await unmount();
      await mount("/plan");
      expect(text()).toContain(buildStartingPoint(base).focus);
    },
  );
  it("keeps an updated Starting Point in memory when its write fails, while learning can save", async () => {
    seed();
    const originalSet = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      if (key === "steady_plan_v1") throw new Error("blocked");
      originalSet.call(this, key, value);
    });
    await mount("/welcome");
    await answer(0);
    await click("Continue");
    await settle();
    await click("Continue");
    await settle();
    expect(text()).toContain(storageFailureMessage);
    expect(text()).toContain("Understand what is spare");
    await openLesson("before-investing");
    await quiz("before-investing", true);
    await click("Finish this lesson");
    expect(localStorage.getItem("steady_learning_v1")).toContain("before-investing");
    await go("/");
    expect(text()).toContain("Understand what is spare");
    expect(persisted().answers).toEqual(base); // The warning must cover restoration of an older record.
  });
  it("keeps a migrated Starting Point in memory if migration cannot be written", async () => {
    localStorage.setItem(
      "steady_plan_v1",
      JSON.stringify({ answers: { ...base, income: "lt20" }, monthly: 500 }),
    );
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    await mount("/plan");
    expect(text()).toContain(buildStartingPoint(base).focus);
    expect(text()).toContain(storageFailureMessage);
    expect(text()).not.toContain("₹500");
  });
  it("handles storage-read failure while keeping educational screens usable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    await mount("/");
    expect(text()).toContain(storageFailureMessage);
    await go("/explore");
    expect(text()).toContain("Three fund categories");
    await go("/learn");
    expect(text()).toContain("What is an index fund?");
  });
});

describe("learning progress and contextual return", () => {
  it("accepts the intended answers in all five existing checks, in varied positions", async () => {
    await mount("/learn");
    const expectedAnswers = [
      ["index-fund", "can-fall"],
      ["investment-risk", "timing"],
      ["why-dips-happen", "uncertain"],
      ["sip-explained", "variable"],
      ["before-investing", "review"],
    ] as const;
    const positions = new Set<number>();
    for (const [lessonId, answerId] of expectedAnswers) {
      const lesson = getLesson(lessonId)!;
      expect(lesson.check.options).toHaveLength(2);
      expect(
        lesson.check.options.filter((option) => option.correct).map((option) => option.id),
      ).toEqual([answerId]);
      positions.add(lesson.check.options.findIndex((option) => option.id === answerId));
      await openLesson(lessonId);
      await quiz(lessonId, false);
      expect(button("Finish this lesson")).toBeDisabled();
      await act(async () =>
        container.querySelector<HTMLInputElement>(`input[value="${answerId}"]`)!.click(),
      );
      expect(text()).toContain("That's the idea.");
      expect(button("Finish this lesson")).toBeEnabled();
      await click("Finish this lesson");
    }
    expect(positions.size).toBe(2);
    expect(getLesson("before-investing")!.check.question).toMatch(/₹1,000.*₹800.*next week/);
    expect(JSON.parse(localStorage.getItem("steady_learning_v1")!)).toHaveLength(5);
    expect(localStorage.getItem("steady_plan_v1")).toBeNull();
  });
  it("targets the catalogue from completed Learn home and keeps lesson-detail navigation", async () => {
    seed(riskAnswers);
    localStorage.setItem(
      "steady_learning_v1",
      JSON.stringify(["investment-risk", "why-dips-happen"]),
    );
    await mount("/learn");
    const catalogueLink = Array.from(container.querySelectorAll("a")).find(
      (link) => link.textContent === "Explore other topics",
    )!;
    expect(catalogueLink).toHaveAttribute("href", "/learn#lesson-catalogue");
    await followLink("Explore other topics");
    expect(router.state.location.hash).toBe("lesson-catalogue");
    expect(
      container.querySelector("#lesson-catalogue")?.querySelectorAll('a[aria-label^="Open "]'),
    ).toHaveLength(5);
    await openLesson("investment-risk");
    await followLink("Explore other topics");
    expect(router.state.location.search).not.toHaveProperty("lesson", "investment-risk");
    expect(container.querySelectorAll('a[aria-label^="Open "]')).toHaveLength(5);
  });
  it("changes next actions everywhere without changing answers or redirecting", async () => {
    const original = seed(riskAnswers);
    await mount("/");
    await followLink("Open What does investment risk mean?");
    expect(router.state.location.pathname).toBe("/learn");
    await quiz("investment-risk", false);
    expect(text()).toContain("Let's look at it another way.");
    expect(button("Finish this lesson")).toBeDisabled();
    await quiz("investment-risk", true);
    expect(text()).toContain("That's the idea.");
    await click("Finish this lesson");
    expect(router.state.location.pathname).toBe("/learn");
    expect(text()).toContain("Open Why can an investment dip?");
    expect(persisted()).toEqual(original);
    await followLink("Return to Home");
    expect(text()).toContain("1 of 2 suggested lessons completed");
    expect(text()).toContain("Open Why can an investment dip?");
    await go("/plan");
    expect(text()).toContain("Open Why can an investment dip?");
    await go("/learn");
    expect(container.querySelector('a[aria-label^="Open "]')).toHaveAttribute(
      "aria-label",
      "Open Why can an investment dip?",
    );
    await openLesson("why-dips-happen");
    await quiz("why-dips-happen", true);
    await click("Finish this lesson");
    expect(text()).toContain(pathCompleteMessage);
    await go("/");
    expect(text()).toContain(pathCompleteMessage);
    await unmount();
    await mount("/");
    expect(text()).toContain(pathCompleteMessage);
    expect(persisted()).toEqual(original);
  });
  it("unrelated lessons do not advance the path, and a new path respects past completion", async () => {
    seed(riskAnswers);
    localStorage.setItem("steady_learning_v1", JSON.stringify(["sip-explained", "index-fund"]));
    await mount("/");
    expect(text()).toContain("0 of 2 suggested lessons completed");
    expect(text()).toContain("Open What does investment risk mean?");
    await go("/welcome");
    await click("Continue");
    await settle();
    await click("Continue");
    await settle();
    await answer(2);
    expect(text()).toContain("1 of 2 suggested lessons completed");
    expect(text()).toContain("Open What should I check before investing?");
  });
  it("returns to a category and reopens its inline explanation", async () => {
    seed();
    await mount("/explore/nifty-50-index");
    const details = container.querySelector<HTMLDetailsElement>("#explain-index-fund")!;
    details.open = true;
    await followLink("Learn: What is an index fund?");
    await quiz("index-fund", true);
    await click("Finish this lesson");
    await followLink("Return to this category");
    expect(router.state.location.pathname).toBe("/explore/nifty-50-index");
    expect(container.querySelector("#explain-index-fund")).toHaveAttribute("open");
  });
  it.each([
    ["/plan", "Starting Point"],
    ["/journey", "Journey"],
    ["/learn", "Learn"],
  ] as const)("returns to %s", async (from, label) => {
    seed();
    await mount(from);
    await openLesson("investment-risk", from);
    await followLink(`Return to ${label}`);
    expect(router.state.location.pathname).toBe(from);
    if (from === "/learn")
      expect(container.querySelectorAll('a[aria-label^="Open "]')).toHaveLength(5);
  });
  it("persists lessons without creating a Starting Point and keeps quizzes independent", async () => {
    await mount("/learn");
    expect(container.querySelectorAll('a[aria-label^="Open "]')).toHaveLength(5);
    await openLesson("index-fund");
    await quiz("index-fund", true);
    await click("Finish this lesson");
    expect(localStorage.getItem("steady_plan_v1")).toBeNull();
    await openLesson("sip-explained");
    expect(container.querySelector("input:checked")).toBeNull();
    expect(button("Finish this lesson")).toBeDisabled();
    await go("/welcome");
    await click("Let's begin");
    await answer(2);
    await answer(2);
    await answer(2);
    expect(text()).toContain("1 of 2 suggested lessons completed");
    expect(text()).toContain("Open What should I check before investing?");
  });
  it("keeps completion in memory when its write fails, independently of Starting Point", async () => {
    seed(riskAnswers);
    const originalSet = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      if (key === "steady_learning_v1") throw new Error("blocked");
      originalSet.call(this, key, value);
    });
    await mount("/learn?lesson=investment-risk");
    await quiz("investment-risk", true);
    await click("Finish this lesson");
    expect(text()).toContain(storageFailureMessage);
    await go("/");
    expect(text()).toContain("1 of 2 suggested lessons completed");
    expect(text()).toContain("Open Why can an investment dip?");
    expect(localStorage.getItem("steady_learning_v1")).toBeNull();
  });
  it("handles invalid completion, unknown lessons and unsafe return destinations", async () => {
    localStorage.setItem(
      "steady_learning_v1",
      JSON.stringify(["index-fund", "index-fund", "unknown", 2]),
    );
    await mount("/learn");
    expect(text()).toContain("1 of 5 lessons completed");
    await openLesson("unknown");
    expect(text()).toContain("We couldn't find that lesson");
    await act(async () => {
      await router.navigate({
        to: "/learn",
        search: { lesson: "index-fund", from: "https://example.com", context: "bad" },
      });
    });
    expect(container.querySelector('a[href^="https://example.com"]')).toBeNull();
    expect(container.querySelector("header a")).toHaveAttribute("href", "/learn");
  });
});

describe("cross-tab persistence", () => {
  async function notify(key: string, newValue: string | null) {
    await act(async () =>
      window.dispatchEvent(
        new StorageEvent("storage", { key, newValue, storageArea: window.localStorage }),
      ),
    );
  }
  it("merges validated persisted completions when a stale tab finishes a lesson", async () => {
    seed(riskAnswers);
    await mount("/learn?lesson=investment-risk");
    // Another tab finishes a lesson before this tab has received its storage event.
    localStorage.setItem("steady_learning_v1", JSON.stringify(["why-dips-happen", "unknown", 7]));
    await quiz("investment-risk", true);
    await click("Finish this lesson");
    expect(JSON.parse(localStorage.getItem("steady_learning_v1")!).sort()).toEqual([
      "investment-risk",
      "why-dips-happen",
    ]);
    expect(text()).toContain(pathCompleteMessage);
  });
  it("receives completion changes and reconciles overlapping writes without losing local completion", async () => {
    seed(riskAnswers);
    await mount("/learn?lesson=investment-risk");
    await quiz("investment-risk", true);
    await click("Finish this lesson");
    await go("/");
    const remote = JSON.stringify(["why-dips-happen"]);
    localStorage.setItem("steady_learning_v1", remote);
    await notify("steady_learning_v1", remote);
    expect(text()).toContain(pathCompleteMessage);
    expect(JSON.parse(localStorage.getItem("steady_learning_v1")!).sort()).toEqual([
      "investment-risk",
      "why-dips-happen",
    ]);
    localStorage.removeItem("steady_learning_v1");
    await notify("steady_learning_v1", null);
    expect(text()).toContain("0 of 2 suggested lessons completed");
  });
  it("restores the latest Starting Point from storage events without overwriting an edit draft", async () => {
    seed();
    await mount("/welcome");
    await answer(1); // Draft has small leftover, now on the cushion question.
    const remote = { schemaVersion: 2, answers: { ...base, leftover: "tiny" }, savedAt: 456 };
    localStorage.setItem("steady_plan_v1", JSON.stringify(remote));
    // An older queued event must not restore its old payload over the latest record.
    await notify(
      "steady_plan_v1",
      JSON.stringify({ schemaVersion: 2, answers: riskAnswers, savedAt: 123 }),
    );
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
      "aria-valuetext",
      "Question 2 of 3",
    );
    await click("Continue");
    await settle();
    await click("Continue");
    await settle();
    expect(persisted().answers).toEqual({ ...base, leftover: "small" });
    await go("/");
    localStorage.setItem("steady_plan_v1", JSON.stringify(remote));
    await notify("steady_plan_v1", JSON.stringify(remote));
    expect(text()).toContain(buildStartingPoint(remote.answers as Required<Answers>).focus);
    localStorage.removeItem("steady_plan_v1");
    await notify("steady_plan_v1", null);
    expect(text()).toContain("Find my starting point");
  });
});

describe("independent discovery and simulation", () => {
  it.each([null, base, riskAnswers, { ...base, leftover: "tiny" }])(
    "shows no personal fund recommendation for %j",
    async (answers) => {
      if (answers) seed(answers as Required<Answers>);
      const stored = localStorage.getItem("steady_plan_v1");
      await mount("/explore");
      expect(text()).not.toMatch(/recommended|suggested to explore|your fund|prototype amount/i);
      for (const fund of funds) {
        await act(async () => {
          await router.navigate({ to: "/explore/$fundId", params: { fundId: fund.id } });
        });
        expect(text()).toContain(fund.riskInWords);
        expect(text()).not.toMatch(/your suggestion|fits you|personal plan|\/ month|₹/i);
      }
      expect(localStorage.getItem("steady_plan_v1")).toBe(stored);
    },
  );
  it("shows the identical Journey example before and after onboarding", async () => {
    await mount("/journey");
    expect(text()).toContain("Money Journey: An Example");
    expect(text()).not.toContain("₹1,500");
    await click("Show the example");
    const example = text();
    expect(example).toContain("₹1,500");
    expect(example).toContain("₹1,470");
    expect(example).toContain("Month 1");
    expect(example).toContain("Month 3");
    expect(example).toContain("not a goal you entered or a forecast");
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute("aria-valuenow", "25");
    seed(riskAnswers);
    await unmount();
    await mount("/journey");
    await click("Show the example");
    expect(text()).toBe(example);
    expect(text()).not.toMatch(/Nifty|Liquid Fund|scheduled|savedAt/);
    await followLink("Learn: What does a SIP mean?");
    await followLink("Return to Journey");
    expect(text()).toContain("Money Journey: An Example");
  });
  it("keeps no-onboarding navigation open without fake personalization", async () => {
    await mount("/");
    expect(text()).toContain("Find my starting point");
    for (const label of ["Explore", "Journey", "Learn", "Start", "Home"]) await followLink(label);
    expect(localStorage.getItem("steady_plan_v1")).toBeNull();
  });
});
