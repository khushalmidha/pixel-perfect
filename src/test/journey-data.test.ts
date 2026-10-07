import { describe, expect, it } from "vitest";
import { getMockJourney, mockJourney } from "@/lib/mock-data";
describe("shared fictional Journey", () => {
  it("counts contributions separately from made-up current value", () => {
    const example = getMockJourney();
    expect(mockJourney.monthly).toBe(500);
    expect(example.contributed).toBe(1500);
    expect(example.currentValue).toBe(1470);
    expect(example.milestoneAmount).toBe(6000);
    expect(example.progressPercent).toBe(25);
    expect(example.timeline.map((event) => event.month)).toEqual([1, 2, 3]);
    expect(example.timeline.map((event) => event.contributed)).toEqual([500, 1000, 1500]);
  });
  it("requires no saved answers, fund or date and creates no persistent data", () => {
    const first = getMockJourney();
    localStorage.setItem(
      "steady_plan_v1",
      JSON.stringify({ monthly: 9999, fundId: "flexi-cap", savedAt: 0 }),
    );
    expect(getMockJourney()).toEqual(first);
    expect(JSON.stringify(first)).not.toMatch(/fundId|savedAt|scheduled/);
    localStorage.clear();
  });
});
