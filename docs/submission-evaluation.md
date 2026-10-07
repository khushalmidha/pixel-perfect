# Steady: submission evaluation

Steady uses three onboarding answers to select an educational path. It does not calculate a personal investment amount, assign a fund or assess readiness. Explore and the fictional Money Journey remain available without onboarding.

The original brief asks for the evals used to test the solution. The criteria below are our interpretation of how to evaluate this learning-first prototype, not a list of requirements quoted from the PDF.

## A. Automated/product verification — completed

| Check             | Result                               | Scope                                                                                                                                                                                |
| ----------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Automated tests   | **63 passed** across five test files | Vitest/jsdom behavior checks, not participant evidence.                                                                                                                              |
| TypeScript        | **Passed**                           | Static checking with `tsc --noEmit --incremental false`.                                                                                                                             |
| Changed-file lint | **Passed with no errors**            | The persistence pass had two Fast Refresh warnings; the final onboarding QA fix had no errors or warnings. Full-repository lint still has unrelated existing Prettier/CRLF failures. |
| Git diff check    | **Passed**                           | Whitespace/conflict-marker check.                                                                                                                                                    |

Coverage includes all 36 answer combinations and educational-path precedence; incomplete-answer rejection; rapid-click and Back behavior; editing and restored state; legacy migration; unknown timestamps; malformed records and storage failures; next-lesson consistency; all five knowledge checks; contextual return; no-onboarding access; cross-tab completion; and the independence of Explore and Journey from personal investment recommendations.

The tests are in [src/test](../src/test). The documentation revision reruns tests and TypeScript; browser QA and source-file lint results above refer to the earlier completed checks. Changed Markdown is checked separately for formatting and links because the repository ESLint configuration does not cover Markdown.

## B. Browser/manual QA — completed

Local QA exercised the running app in headless Chrome using browser clicks and keyboard events, an isolated profile, screenshots and layout measurements. This was developer QA, not a target-user study.

| Area                          | Completed observation                                                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Onboarding                    | All three paths, answer advancement, Back and rapid clicks worked. Incomplete/invalid answers did not persist an outcome.                                                                                                |
| Learning                      | Feedback, completion, next unfinished lesson and completed-path actions worked. Completion did not change answers or create an investment action.                                                                        |
| Editing/persistence           | A draft retained the old Starting Point until finished. Updated answers and completed lessons survived refresh, a new tab and a full Chrome restart in the same profile.                                                 |
| Cross-tab behavior            | Different lessons completed in two tabs were retained after refresh. Answer edits updated the other tab without deleting learning progress.                                                                              |
| Catalogue/contextual learning | “Explore other topics” scrolled to the existing catalogue. Lesson return reopened the category explanation; Journey return and category Back worked.                                                                     |
| Explore/detail and Journey    | Explore worked without onboarding. Detail remained educational. Journey was the same fictional example with and without onboarding.                                                                                      |
| Direct/error routes           | Main routes, valid/invalid lessons and categories, and unknown-route recovery rendered usable screens.                                                                                                                   |
| Mobile viewports              | 320px, 360px, 390px and 1280px checked: 48 route/width cases plus 12 narrow active-state cases showed no measured horizontal overflow. Screenshots reviewed wrapping, buttons, cards and access around fixed navigation. |
| Keyboard basics               | One onboarding focus-loss issue was found and fixed. Subsequent checks confirmed focus on the next question and summary, with keyboard-reachable controls.                                                               |
| Trust/copy                    | Source and rendered copy reviewed: no active personal amount/fund recommendation, suitability/readiness claim, guaranteed recovery or personal portfolio history found.                                                  |

No application JavaScript exceptions were recorded in the checked flows. HTTP 404s on deliberately invalid routes were expected.

**Live Vercel check — reported by the project owner:** [the final deployment](https://pixel-perfect-virid.vercel.app/) was manually opened and onboarding → Starting Point → lesson → completion was checked. This is a narrow deployment smoke check, not verification of every route or mobile device. The interactive check has not been independently repeated by the assistant.

**Public access check — completed in this documentation pass:** an unauthenticated HTTP request to the deployed Home page returned 200 and contained the Steady title and learning-first Home content. This establishes that the public page was reachable at the time of checking, not that client-side interactions or all deployed files match the local revision.

Local browser scripts, diagnostics and screenshots were recorded outside the repository and are not a bundled browser test suite. No physical-phone, Safari or screen-reader QA is claimed.

## C. Human usability study — planned, NOT conducted

The [five-person protocol](usability-evaluation.md) proposes phone-first, 30–35-minute sessions with Indian participants aged 20–26, preferably first-time or very limited investors. Each starts with fresh onboarding and a fictional profile.

The study would test:

- Independent onboarding in under three minutes and an unaided explanation of why the Starting Point appeared.
- Finding a useful next learning action and explaining a meaningful risk.
- Comparing categories without interpreting lower volatility as safety or personal suitability.
- Understanding holdings, illustrative information and Journey as an example rather than personal history.
- Returning from contextual learning, noticing completion changes and retaining context.
- Confidence alongside comprehension, trust and pressure to invest.

Tasks ask for interpretation before directing users or naming the intended answer. The protocol records assistance, hesitation and misunderstandings separately from successful navigation. Its 3/5 rule prioritizes repeated issues; it is not statistical validation.

**No participant sessions, results, quotes, usability percentages, confidence improvements or measured onboarding times are reported.**

## What this evaluation can and cannot prove

Automated tests verify specified implementation behavior. Browser QA catches interaction, layout and state issues in the tested environment. A five-person study could reveal usability and trust problems worth investigating.

None alone proves long-term understanding, improved financial behavior, investment outcomes or broad Gen-Z product-market fit. Lesson completion is not mastery, readiness or suitability. A copy review is not financial, regulatory or legal certification.

Remaining limits include English-only content, broad learning paths, browser-local persistence and fictional category/Journey data. Physical phones, Safari, assistive technology and broader deployed behavior remain unverified. The final URL is recorded above; confirm that the submitted revision is the one reviewers receive.
