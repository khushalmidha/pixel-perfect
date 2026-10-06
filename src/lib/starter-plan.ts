// Turns onboarding answers into a suggested starter plan, with the reasoning shown to the user.
import { formatINR } from "./mock-data";

export type Option<V extends string> = { value: V; label: string; hint?: string };

export const incomeOptions: Option<"lt20" | "20to40" | "40to75" | "gt75">[] = [
  { value: "lt20", label: "Under ₹20,000" },
  { value: "20to40", label: "₹20,000 – ₹40,000" },
  { value: "40to75", label: "₹40,000 – ₹75,000" },
  { value: "gt75", label: "More than ₹75,000" },
];

export const leftoverOptions: Option<"tiny" | "small" | "medium" | "large">[] = [
  { value: "tiny", label: "Almost nothing", hint: "Under ₹2,000" },
  { value: "small", label: "A little", hint: "₹2,000 – ₹5,000" },
  { value: "medium", label: "A decent amount", hint: "₹5,000 – ₹15,000" },
  { value: "large", label: "Quite a bit", hint: "More than ₹15,000" },
];

export const cushionOptions: Option<"none" | "some" | "solid">[] = [
  { value: "none", label: "Not really", hint: "I'd struggle with a surprise bill" },
  { value: "some", label: "A little", hint: "Enough for a month or so" },
  { value: "solid", label: "Yes, I'm covered", hint: "3+ months of expenses set aside" },
];

export const feelingOptions: Option<"anxious" | "uneasy" | "calm">[] = [
  { value: "anxious", label: "I'd want to take it out", hint: "Seeing it drop would stress me" },
  { value: "uneasy", label: "Uneasy, but I'd wait", hint: "I'd check often, but stay" },
  { value: "calm", label: "Fine — it's long term", hint: "Dips are part of it" },
];

export type Answers = {
  income?: (typeof incomeOptions)[number]["value"];
  leftover?: (typeof leftoverOptions)[number]["value"];
  cushion?: (typeof cushionOptions)[number]["value"];
  feeling?: (typeof feelingOptions)[number]["value"];
};

const leftoverMid = { tiny: 1000, small: 3500, medium: 10000, large: 20000 } as const;

export function buildPlan(a: Required<Answers>) {
  const left = leftoverMid[a.leftover];
  const share = a.cushion === "none" ? 0.1 : 0.2;
  let monthly = Math.round((left * share) / 100) * 100;
  monthly = Math.min(Math.max(monthly, 200), 3000);
  if (a.feeling === "anxious") monthly = Math.max(200, Math.round(monthly * 0.6 / 100) * 100);

  const buildCushion = a.cushion !== "solid";
  const calmFund = a.cushion === "none" || a.feeling === "anxious";

  const reasons: string[] = [
    `After expenses you usually keep around ${formatINR(left)}. We took ${Math.round(share * 100)}% of that, so most of it stays free for everyday life.`,
  ];
  if (a.cushion === "none")
    reasons.push("You don't have a safety cushion yet, so we kept the amount smaller and put it somewhere you can withdraw in a day.");
  else if (a.cushion === "some")
    reasons.push("Your cushion is a good start. Keep adding to it alongside this — both matter.");
  else reasons.push("You already have a safety cushion, so this money can be left alone to grow.");
  if (a.feeling === "anxious")
    reasons.push("You said a dip would worry you, so we lowered the amount and picked a calmer option. Small amounts make dips easier to sit through.");
  else if (a.feeling === "uneasy")
    reasons.push("You'd feel uneasy but stay — a broad, steady fund suits that well.");
  else reasons.push("You're comfortable with dips, which suits money meant for the long run.");

  return {
    monthly,
    fundId: calmFund ? "liquid-fund" : "nifty-50-index",
    fundName: calmFund ? "Liquid Fund" : "Nifty 50 Index Fund",
    purpose: calmFund
      ? "Building a safety cushion first — money you can reach quickly if life surprises you."
      : buildCushion
        ? "Slow, long-term growth over 3+ years, while you keep topping up your safety cushion."
        : "Slow, long-term growth over 3+ years. Money you won't need soon.",
    risk: (calmFund ? "low" : "moderate") as "low" | "moderate",
    riskText: calmFund
      ? "This barely moves day to day. It grows slowly — a bit better than a savings account, and you can usually withdraw in one working day."
      : `Some months it will dip — on ${formatINR(monthly * 12)} invested over a year, a rough patch could mean seeing a few hundred to a couple of thousand rupees less for a while. Over years it has tended to recover and rise, but it never promises to.`,
    reasons,
  };
}
