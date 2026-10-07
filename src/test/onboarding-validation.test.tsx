import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { PlanProvider, useStartingPoint, type StartingPointContextValue } from "@/lib/plan-context";
import { buildStartingPoint, isCompleteAnswers } from "@/lib/starter-plan";
const answers = { leftover: "small", cushion: "some", feeling: "uneasy" } as const;
describe("onboarding validation", () => {
  it.each([
    { cushion: "some", feeling: "uneasy" },
    { leftover: "small", feeling: "uneasy" },
    { leftover: "small", cushion: "some" },
  ] as const)("rejects incomplete answers: %j", (incomplete) => {
    expect(isCompleteAnswers(incomplete)).toBe(false);
    expect(() => buildStartingPoint(incomplete)).toThrow(/three questions/);
  });
  it("does not replace an active Starting Point with invalid answers", async () => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    localStorage.clear();
    let state!: StartingPointContextValue;
    function Probe() {
      state = useStartingPoint();
      return null;
    }
    const container = document.createElement("div");
    const root = createRoot(container);
    try {
      await act(async () =>
        root.render(
          <PlanProvider>
            <Probe />
          </PlanProvider>,
        ),
      );
      await act(async () => {
        expect(state.saveStartingPoint({ leftover: "small" })).toBeNull();
      });
      expect(state.startingPoint).toBeNull();
      await act(async () => {
        state.saveStartingPoint(answers);
      });
      const original = state.startingPoint;
      const saved = localStorage.getItem("steady_plan_v1");
      await act(async () => {
        expect(state.saveStartingPoint({})).toBeNull();
      });
      expect(state.startingPoint).toBe(original);
      expect(localStorage.getItem("steady_plan_v1")).toBe(saved);
      expect(JSON.parse(saved!)).toEqual({
        schemaVersion: 2,
        answers,
        savedAt: expect.any(Number),
      });
    } finally {
      await act(async () => root.unmount());
      localStorage.clear();
    }
  });
});
