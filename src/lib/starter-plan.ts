import { learningPaths } from "./mock-data";

export type Option<V extends string> = { value: V; label: string; hint?: string };
export const leftoverOptions: Option<"tiny" | "small" | "medium" | "large">[] = [
  { value: "tiny", label: "Almost nothing", hint: "Under ₹2,000, including zero" },
  { value: "small", label: "₹2,000 – ₹5,000" },
  { value: "medium", label: "₹5,000 – ₹15,000" },
  { value: "large", label: "More than ₹15,000" },
];
export const cushionOptions: Option<"none" | "some" | "solid">[] = [
  { value: "none", label: "Not really", hint: "I'd struggle with a surprise bill" },
  { value: "some", label: "A little", hint: "Enough for a month or so" },
  { value: "solid", label: "Three months or more", hint: "Of expenses set aside" },
];
export const feelingOptions: Option<"anxious" | "uneasy" | "calm">[] = [
  { value: "anxious", label: "I'd want to take it out", hint: "Seeing it drop would stress me" },
  { value: "uneasy", label: "Uneasy, but I'd wait", hint: "I'd check often, but stay" },
  { value: "calm", label: "I could handle a dip", hint: "I know values can fall" },
];
export type Answers = {
  leftover?: (typeof leftoverOptions)[number]["value"];
  cushion?: (typeof cushionOptions)[number]["value"];
  feeling?: (typeof feelingOptions)[number]["value"];
};
const answerOptions = {
  leftover: leftoverOptions,
  cushion: cushionOptions,
  feeling: feelingOptions,
};
export function isValidAnswer<K extends keyof Answers>(
  key: K,
  value: unknown,
): value is NonNullable<Answers[K]> {
  return answerOptions[key].some((option) => option.value === value);
}
export function isCompleteAnswers(value: unknown): value is Required<Answers> {
  return (
    typeof value === "object" &&
    value !== null &&
    "leftover" in value &&
    isValidAnswer("leftover", value.leftover) &&
    "cushion" in value &&
    isValidAnswer("cushion", value.cushion) &&
    "feeling" in value &&
    isValidAnswer("feeling", value.feeling)
  );
}
/** Explicit projection also strips unrelated fields from legacy/browser input. */
export function cleanAnswers(answers: Required<Answers>): Required<Answers> {
  return { leftover: answers.leftover, cushion: answers.cushion, feeling: answers.feeling };
}
export type StartingPointRecord = {
  schemaVersion: 2;
  answers: Required<Answers>;
  savedAt: number | null;
};
export function isValidTimestamp(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    !Number.isNaN(new Date(value).getTime())
  );
}
/** Content routing only. Never infers a budget, investment selection or readiness. */
export function buildStartingPoint(answers: Answers) {
  if (!isCompleteAnswers(answers))
    throw new Error("Complete all three questions before finishing your starting point.");
  const pathId =
    answers.leftover === "tiny" || answers.cushion === "none"
      ? "cash-basics"
      : answers.feeling === "anxious" || answers.feeling === "uneasy"
        ? "risk-and-access"
        : "fund-basics";
  const path = learningPaths[pathId];
  const explanation =
    pathId === "cash-basics"
      ? answers.leftover === "tiny"
        ? "You said almost nothing is usually left after essentials. Start with understanding what is actually spare. There is no need to choose an investment now."
        : "You said a surprise expense would be difficult. Start with why access to cash matters before considering investments."
      : path.explanation;
  const labels = {
    leftover: "After essentials",
    cushion: "Emergency savings",
    feeling: "Feelings about a loss",
  };
  return {
    answers: cleanAnswers(answers),
    pathId,
    focus: path.focus,
    explanation,
    lessonIds: path.lessonIds,
    reportedAnswers: (Object.keys(answerOptions) as (keyof Answers)[]).map((key) => {
      const option = answerOptions[key].find((option) => option.value === answers[key])!;
      return { key, label: labels[key], answer: option.label, hint: option.hint };
    }),
  };
}
export type StartingPoint = ReturnType<typeof buildStartingPoint> & { savedAt: number | null };
