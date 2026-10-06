// Realistic mock data for the case-study prototype. Not real market data.

export type RiskLevel = "low" | "moderate" | "high";

export interface Fund {
  id: string;
  name: string;
  kind: string;
  oneLiner: string;
  whatYouOwn: string;
  risk: RiskLevel;
  riskInWords: string;
  minMonthly: number;
  horizon: string;
  costNote: string;
}

export const user = {
  firstName: "Ankur",
  day: 1,
  monthlyIncome: 38000,
  comfortableMonthly: 500,
};

export const funds: Fund[] = [
  {
    id: "nifty-50-index",
    name: "Nifty 50 Index Fund",
    kind: "Index fund",
    oneLiner: "A tiny slice of India's 50 largest companies, in one fund.",
    whatYouOwn:
      "Banks, phone networks, fuel, IT services and more — you own a small piece of all of them at once.",
    risk: "moderate",
    riskInWords:
      "Some weeks this will dip. Over years it has tended to rise — but it never promises to. Only invest money you won't need for 3+ years.",
    minMonthly: 100,
    horizon: "3+ years",
    costNote: "Very low yearly fee, because no one is picking stocks.",
  },
  {
    id: "liquid-fund",
    name: "Liquid Fund",
    kind: "Debt fund",
    oneLiner: "A calm place to park money you may need in a few months.",
    whatYouOwn: "Short loans to the government and large companies, repaid within weeks.",
    risk: "low",
    riskInWords:
      "Moves very little day to day. Grows slowly — closer to a savings account than the stock market.",
    minMonthly: 100,
    horizon: "Few months+",
    costNote: "Low yearly fee. Usually withdrawable in one working day.",
  },
  {
    id: "flexi-cap",
    name: "Flexi Cap Fund",
    kind: "Active equity fund",
    oneLiner: "A fund manager picks companies of every size for you.",
    whatYouOwn: "A mix of large, mid and small Indian companies, chosen by a team.",
    risk: "high",
    riskInWords:
      "Can swing more than an index fund, both up and down. Best once you've lived through a dip or two.",
    minMonthly: 500,
    horizon: "5+ years",
    costNote: "Higher yearly fee, because people are actively choosing.",
  },
];

export const getFund = (id: string) => funds.find((f) => f.id === id);

export const starterPlan = {
  monthly: 500,
  fundId: "nifty-50-index",
  progress: 12,
  steps: [
    { label: "Tell us about your money", done: true },
    { label: "Find your comfortable amount", done: true },
    { label: "Understand your first fund", done: false },
    { label: "Start ₹500 auto-invest", done: false },
  ],
};

export const lessons = [
  { id: "what-is-a-fund", title: "What a fund actually is", minutes: 2 },
  { id: "why-dips-happen", title: "Why your money will dip sometimes", minutes: 3 },
  { id: "emergency-first", title: "Emergency money comes first", minutes: 2 },
  { id: "sip-explained", title: "Monthly investing, explained", minutes: 2 },
];

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
