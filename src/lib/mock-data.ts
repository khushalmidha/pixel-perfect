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
  horizon: string;
  costNote: string;
}

export const appIdentity = { name: "Steady", status: "No money moves" };
export const fundExampleNote =
  "These are illustrative fund categories, not specific investable schemes. Minimums, costs, withdrawal terms and official risk labels vary by scheme.";

export const funds: Fund[] = [
  {
    id: "nifty-50-index",
    name: "Nifty 50 Index Fund",
    kind: "Index fund",
    oneLiner:
      "An example of a fund tracking 50 large Indian companies; its value can fall sharply.",
    whatYouOwn:
      "Banks, phone networks, fuel, IT services and more — you own a small piece of all of them at once.",
    risk: "high",
    riskInWords:
      "Equity funds can fall sharply. You could lose a meaningful part of what you invest, and recovery is not guaranteed. Consider your own time horizon and check an actual scheme's risk label.",
    horizon: "If you can leave it invested for years",
    costNote:
      "Index funds charge fees. The amount and any exit costs depend on the actual scheme; check its current documents.",
  },
  {
    id: "liquid-fund",
    name: "Liquid Fund",
    kind: "Debt fund",
    oneLiner: "A short-term debt fund category; lower volatility does not mean risk-free.",
    whatYouOwn:
      "Examples can include short-term government and company debt. Holdings and repayment dates vary by scheme.",
    risk: "low",
    riskInWords:
      "Usually moves less than equity funds, but its value can still fall. Returns are not guaranteed, and withdrawals may take time.",
    horizon: "If withdrawal timing is flexible",
    costNote:
      "Fees and withdrawal timing depend on the actual scheme. It is not immediately available cash.",
  },
  {
    id: "flexi-cap",
    name: "Flexi Cap Fund",
    kind: "Active equity fund",
    oneLiner: "A fund manager picks companies of every size for you.",
    whatYouOwn: "A mix of large, mid and small Indian companies, chosen by a team.",
    risk: "high",
    riskInWords:
      "An equity fund can fall sharply. Its mix of companies and the manager's choices add uncertainty; losses can persist and recovery is not guaranteed.",
    horizon: "If you can leave it invested for years",
    costNote:
      "Actively managed funds charge fees. The amount and any exit costs depend on the actual scheme.",
  },
];

export const getFund = (id: string) => funds.find((f) => f.id === id);

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  description: string;
  meaning: string;
  why: string;
  example: string;
  takeaway: string;
  check: {
    question: string;
    options: { id: string; label: string; correct: boolean; feedback: string }[];
  };
}

export const lessons: Lesson[] = [
  {
    id: "index-fund",
    title: "What is an index fund?",
    minutes: 2,
    description: "A basket of investments that follows a list.",
    meaning:
      "An index is a list of investments. An index fund follows that list instead of a manager choosing winners.",
    why: "It spreads your money across the list. That reduces dependence on one company, but the whole basket can still fall.",
    example:
      "A Nifty 50 Index Fund follows 50 large Indian companies. If one struggles, it is only part of the basket; if the wider market falls, the fund can fall too.",
    takeaway: "A wider basket is still an investment with risk, not a guaranteed return.",
    check: {
      question: "One company in an index fund falls in value. What determines the fund's value?",
      options: [
        {
          id: "can-fall",
          label: "Changes across the investments it holds",
          correct: true,
          feedback:
            "The fund holds a basket. One company's fall does not describe the whole basket, but many holdings can fall together.",
        },
        {
          id: "protected",
          label: "Only whether that one company recovers",
          correct: false,
          feedback:
            "That company is only part of the fund. Changes in its other holdings matter too.",
        },
      ],
    },
  },
  {
    id: "investment-risk",
    title: "What does investment risk mean?",
    minutes: 2,
    description: "Understand uncertainty in everyday rupees.",
    meaning:
      "Risk means an investment may not turn out as you expect. Its value can fall, you can lose money, or getting money out may take longer than you need.",
    why: "A low-risk label doesn't mean risk-free. Timing matters when you need the money for an essential expense.",
    example:
      "You contribute ₹1,000. If its current value is ₹900, it is worth ₹100 less at that moment. The original contribution and current value are different numbers.",
    takeaway: "Understand what can change and when you might need the money.",
    check: {
      question:
        "A fund has low fees, but the money may be needed next week. What still needs checking?",
      options: [
        {
          id: "past",
          label: "Whether last year's return was higher than the fees",
          correct: false,
          feedback:
            "Past results don't guarantee next week's value or how quickly money can be withdrawn.",
        },
        {
          id: "timing",
          label: "Whether it could fall or be unavailable when needed",
          correct: true,
          feedback:
            "That's the practical risk: a change in value or access can matter when an expense is due.",
        },
      ],
    },
  },
  {
    id: "why-dips-happen",
    title: "Why can an investment dip?",
    minutes: 2,
    description: "A lower value doesn't come with a recovery promise.",
    meaning:
      "Funds own investments whose prices change. News, business results and changing expectations can move their value down as well as up.",
    why: "A dip may be temporary, but recovery is uncertain. Waiting alone is not a guarantee that money will come back.",
    example:
      "A made-up investment worth ₹1,000 becomes worth ₹950. It could later rise, stay near ₹950 or fall further. That example is not a prediction.",
    takeaway:
      "Review what the money is for and its risks, rather than assuming every dip must reverse.",
    check: {
      question: "A fund's value fell this month. What does that change tell you?",
      options: [
        {
          id: "recovery",
          label: "It is cheaper now, so a recovery is the next step",
          correct: false,
          feedback:
            "Time doesn't promise recovery. A lower value may recover, remain lower or fall further.",
        },
        {
          id: "uncertain",
          label: "Its value is lower; what happens next is uncertain",
          correct: true,
          feedback: "That's right. A dip describes what happened, not what must happen next.",
        },
      ],
    },
  },
  {
    id: "sip-explained",
    title: "What does a SIP mean?",
    minutes: 2,
    description: "Monthly investing is a method, not a promise.",
    meaning:
      "A SIP, or Systematic Investment Plan, means putting a set amount into a mutual fund at regular intervals, such as each month.",
    why: "It makes contributions regular. The chosen fund still carries risk; a SIP doesn't guarantee growth or remove losses.",
    example:
      "Contributing ₹500 each month for three months puts in ₹1,500. The investment may be worth more or less than ₹1,500 afterward.",
    takeaway: "The schedule tells you how you contribute, not what return you will receive.",
    check: {
      question:
        "Three contributions of ₹500 were made. The value shown is ₹1,470. What do these numbers mean?",
      options: [
        {
          id: "variable",
          label: "₹1,500 was contributed; it is currently worth ₹1,470",
          correct: true,
          feedback: "Exactly. Contributions add up, while the fund's value can move up or down.",
        },
        {
          id: "fixed",
          label: "Only ₹1,470 was contributed; the rest is still to be paid",
          correct: false,
          feedback:
            "The three payments total ₹1,500. The lower current value reflects a change in value, not a missing contribution.",
        },
      ],
    },
  },
  {
    id: "before-investing",
    title: "What should I check before investing?",
    minutes: 3,
    description: "Understand spare money, cash access, risk and costs.",
    meaning:
      "Money left in your account today may already be needed for an upcoming bill. Understanding what is spare starts with essentials, upcoming expenses and access to emergency cash, before considering how a fund works.",
    why: "Also read the fund's risks, fees and withdrawal conditions. A popular fund or a completed lesson doesn't establish that it fits your situation.",
    example:
      "For example, ₹1,000 left today may be needed for a bill next week. A fund can fall in value or take time to withdraw, so it is different from cash you can access for that bill.",
    takeaway: "Understanding gives you better questions. It is not a signal to invest immediately.",
    check: {
      question: "You have ₹1,000 left, but an ₹800 bill is due next week. What does that tell you?",
      options: [
        {
          id: "review",
          label: "The whole ₹1,000 is not spare; upcoming expenses still matter",
          correct: true,
          feedback:
            "The upcoming bill already has a claim on that money. Even the remaining ₹200 does not establish an investment budget; other needs may still matter.",
        },
        {
          id: "ready",
          label: "The ₹1,000 is spare because this month's essentials are already paid",
          correct: false,
          feedback:
            "Paid expenses are only part of the picture. A bill due next week still matters when understanding what is spare.",
        },
      ],
    },
  },
];

export const getLesson = (id: string) => lessons.find((lesson) => lesson.id === id);

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

// Shared fictional example: independent of every visitor's answers.
export const mockJourney = {
  monthly: 500,
  contributionCount: 3,
  goalContributions: 12,
  currentValue: 1470,
};
export function getMockJourney() {
  const contributed = mockJourney.monthly * mockJourney.contributionCount;
  return {
    contributed,
    currentValue: mockJourney.currentValue,
    milestoneAmount: mockJourney.monthly * mockJourney.goalContributions,
    progressPercent: (mockJourney.contributionCount / mockJourney.goalContributions) * 100,
    timeline: Array.from({ length: mockJourney.contributionCount }, (_, index) => ({
      month: index + 1,
      contribution: mockJourney.monthly,
      contributed: mockJourney.monthly * (index + 1),
    })),
  };
}
export const learningPaths = {
  "cash-basics": {
    focus: "Understand what is spare and why accessible cash matters",
    explanation: "Start with understanding spare money and access to emergency cash.",
    lessonIds: ["before-investing", "investment-risk"],
  },
  "risk-and-access": {
    focus: "Understand losses and access to invested money",
    explanation:
      "You said a fall in value would worry you. Start with what investment risk means, including when money may be difficult to access.",
    lessonIds: ["investment-risk", "why-dips-happen"],
  },
  "fund-basics": {
    focus: "Understand how a fund works through an example",
    explanation:
      "A concrete example can make funds easier to understand. Start with how an index fund works, then review what to check.",
    lessonIds: ["index-fund", "before-investing"],
  },
} as const;
export const storageFailureMessage =
  "Your changes couldn't be saved in this browser. Refreshing may lose them or restore an earlier version.";
export const pathCompleteMessage =
  "You've completed these two lessons. Revisit them or explore other topics.";
