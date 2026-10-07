# Steady

Steady is a beginner-first investing education prototype for Indian first-time investors aged approximately 20–26, including students, part-time workers and people receiving their first paycheck. The problem it addresses is uncertainty about what to understand before investing. This is a product hypothesis; its value has not yet been validated with target users.

The thesis: help beginners identify their next learning step. Onboarding creates a **Starting Point**, not an investment recommendation.

Three answers cover money left after essentials, emergency savings and feelings about losses. They choose one of three educational paths:

| Path            | When it appears                              | Existing lessons                      |
| --------------- | -------------------------------------------- | ------------------------------------- |
| Cash basics     | Almost nothing left, or no emergency cushion | Before investing → investment risk    |
| Risk and access | Otherwise, anxious or uneasy about losses    | Investment risk → why dips happen     |
| Fund basics     | Remaining answers                            | Index-fund example → before investing |

The Starting Point explains the learning priority and links to the next unfinished lesson. Completed lessons remain completed when answers change. These rules route educational content; they do not assess affordability, suitability or readiness to invest.

Explore explains three illustrative fund categories. Inline explanations can open a short lesson and return to the originating screen. Money Journey uses a shared fictional ₹500/month example to explain contributions versus current value; it is not a personal portfolio or forecast.

There are no personalized investment amounts, selected investments, payments, real market data, accounts or backend. Starting Point answers and lesson completion are stored independently in browser localStorage. Existing saved onboarding answers are converted to schema version 2 without retaining investment fields. Storage failures leave the app usable for the visit and display a warning.

## Main flow

Welcome → three onboarding answers → Starting Point → suggested lesson → knowledge check and completion → Home with the next unfinished lesson.

Users can review or edit their answers in Start, browse all five lessons in Learn, explore illustrative fund categories and open contextual lessons, or view the fictional Money Journey. Editing answers preserves completed lessons. Refresh restores valid saved answers and completion in the same browser. Explore, Learn and Journey also work without onboarding.

## Live demo and repository

**Live demo: pending — add the final public URL before submission.** No deployed URL has been verified. Once supplied, check reviewer access without a development account and confirm that the link runs the submitted version.

The configured GitHub remote is [khushalmidha/pixel-perfect](https://github.com/khushalmidha/pixel-perfect). The repository name comes from the earlier project; the current product is Steady. Remote access and the published revision have not been verified. Ensure the final submission includes the existing modified and untracked product files.

Submission documentation:

- [Development prompt stages](PROMPTS.md): concise chronological summaries of the actual available prompts.
- [Completed evaluation summary](docs/submission-evaluation.md): verification performed and its limits.
- [Planned five-person usability protocol](docs/usability-evaluation.md): not completed participant research.

The brief also requires a separate human-written 300–700-word rationale. This README does not replace that artifact.

## Run locally

Use Node.js 22.12 or later and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Start at `/welcome`; the other routes are `/`, `/plan` (Starting Point), `/explore`, `/explore/:fundId`, `/journey` and `/learn`.

## Checks

```sh
npm test
npx tsc --noEmit --incremental false
npm run lint
git diff --check
```

Tests use Vitest and jsdom to exercise content routing, onboarding reliability, persistence, migration, learning completion and navigation. They do not establish real-phone layout or deployed-browser behavior.

Latest local verification: 63 tests passed, TypeScript passed, and `git diff --check` passed. The targeted persistence pass had no changed-file lint errors and two Fast Refresh warnings; the final onboarding QA fix had no lint errors or warnings.

Browser QA used local headless Chrome at 320px, 360px, 390px and desktop widths. Onboarding, learning, editing, contextual return, two-tab synchronization and persistence through a full Chrome restart were exercised. This does not establish physical-phone, Safari or deployed-site behavior.

Repository-wide lint currently has unrelated existing Prettier/CRLF errors in template and infrastructure files. The focused changes are checked separately; provider/hook files also produce Fast Refresh warnings. Do not interpret this as a clean repository-wide lint result.

## Evaluation status

The [completed evaluation summary](docs/submission-evaluation.md) records the automated checks, local browser QA and trust/copy review. These establish implementation behavior within the tested environment, not user comprehension or product effectiveness.

The five-person [usability evaluation protocol](docs/usability-evaluation.md) is **planned, not completed**. No participant results, user quotes, onboarding completion times or measured confidence improvements are claimed.

## Known limitations

- Physical-phone, Safari, screen-reader and deployed-site behavior have not been verified.
- Answers and learning completion persist in one browser; there is no account or cross-device synchronization.
- English-only content, five short lessons and three broad learning paths limit the prototype's scope. Completion records an interaction, not mastery.
- Fund categories and Journey values are educational examples, not real schemes, transactions, returns or personal financial progress.
- Repository-wide lint is not clean; existing unrelated formatting errors and provider Fast Refresh warnings remain as described above.
- No participant study has established learning gains, confidence changes or demand for this experience.

Education, not financial advice. Finishing a lesson records completion, not investment readiness.
