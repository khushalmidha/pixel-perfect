import { describe, expect, it } from "vitest";
import {
  buildStartingPoint,
  isCompleteAnswers,
  isValidTimestamp,
  type Answers,
} from "@/lib/starter-plan";
import { getPathProgress } from "@/lib/starting-point-progress";
import { getLesson } from "@/lib/mock-data";

const base = { leftover: "medium", cushion: "solid", feeling: "calm" } as const;
describe("Starting Point content routing", () => {
  it("routes every combination with cash concerns taking precedence over feelings", () => {
    for (const leftover of ["tiny", "small", "medium", "large"] as const)
      for (const cushion of ["none", "some", "solid"] as const)
        for (const feeling of ["anxious", "uneasy", "calm"] as const) {
          const point = buildStartingPoint({ leftover, cushion, feeling });
          const expected =
            leftover === "tiny" || cushion === "none"
              ? "cash-basics"
              : feeling !== "calm"
                ? "risk-and-access"
                : "fund-basics";
          expect(point.pathId).toBe(expected);
          expect(point.reportedAnswers).toHaveLength(3);
          expect(point.lessonIds).toHaveLength(2);
          point.lessonIds.forEach((id) => expect(getLesson(id)).toBeDefined());
          expect(Object.keys(point).sort()).toEqual(
            ["answers", "explanation", "focus", "lessonIds", "pathId", "reportedAnswers"].sort(),
          );
          expect(Object.keys(point.answers).sort()).toEqual(["cushion", "feeling", "leftover"]);
        }
  });
  it.each([
    [
      { ...base, leftover: "tiny" },
      "cash-basics",
      ["before-investing", "investment-risk"],
      "almost nothing",
    ],
    [
      { ...base, cushion: "none" },
      "cash-basics",
      ["before-investing", "investment-risk"],
      "surprise expense",
    ],
    [
      { ...base, feeling: "uneasy" },
      "risk-and-access",
      ["investment-risk", "why-dips-happen"],
      "worry you",
    ],
    [base, "fund-basics", ["index-fund", "before-investing"], "concrete example"],
  ] as const)(
    "uses the specified path and answer-based explanation for %j",
    (answers, path, ids, reason) => {
      const point = buildStartingPoint(answers);
      expect(point.pathId).toBe(path);
      expect(point.lessonIds).toEqual(ids);
      expect(point.explanation).toContain(reason);
    },
  );
  it("strips investment fields and income from external answers", () => {
    const contaminated = { ...base, income: "gt75", monthly: 3000, fundId: "nifty-50-index" };
    const point = buildStartingPoint(contaminated);
    expect(point.answers).toEqual(base);
    for (const key of ["monthly", "fundId", "purpose", "horizon", "risk", "readiness", "income"]) {
      expect(point).not.toHaveProperty(key);
      expect(point.answers).not.toHaveProperty(key);
    }
  });
  it("requires three real answers and no income answer", () => {
    expect(isCompleteAnswers(base)).toBe(true);
    for (const input of [
      null,
      {},
      { ...base, feeling: "unknown" },
      { ...base, cushion: null },
      { ...base, leftover: "unknown" },
    ])
      expect(isCompleteAnswers(input)).toBe(false);
    expect(() => buildStartingPoint({ leftover: "tiny" })).toThrow(/three questions/);
  });
  it("validates finite, representable timestamps", () => {
    expect(isValidTimestamp(0)).toBe(true);
    expect(isValidTimestamp(Date.now())).toBe(true);
    for (const date of [undefined, null, "today", -1, Infinity, NaN, 1e20])
      expect(isValidTimestamp(date)).toBe(false);
  });
});
describe("next learning action", () => {
  const point = buildStartingPoint({ ...base, feeling: "anxious" });
  it("advances only when a path lesson is completed", () => {
    expect(getPathProgress(point, []).nextLesson?.id).toBe("investment-risk");
    expect(getPathProgress(point, ["sip-explained"]).nextLesson?.id).toBe("investment-risk");
    expect(getPathProgress(point, ["investment-risk"]).nextLesson?.id).toBe("why-dips-happen");
    expect(getPathProgress(point, ["why-dips-happen"]).nextLesson?.id).toBe("investment-risk");
    expect(getPathProgress(point, [...point.lessonIds, ...point.lessonIds])).toMatchObject({
      complete: true,
      completedCount: 2,
      nextLesson: undefined,
    });
  });
  it("does not invent a path without onboarding", () => {
    expect(getPathProgress(null, ["index-fund"])).toEqual({
      complete: false,
      completedCount: 0,
      nextLesson: undefined,
    });
  });
});
