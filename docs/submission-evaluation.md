# Steady: completed submission evaluation

This summarizes verification already performed on the current learning-first Starting Point prototype. The documentation pass did not rerun application tests or browser QA. Results below describe the recorded local checks; they do not establish target-user usability or the behavior of a deployed app.

## Completed automated and static checks

| Check                                  | Recorded result                                                                                                                        | What it establishes / limitation                                                                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                             | **63 tests passed** across five test files                                                                                             | Vitest/jsdom coverage of educational routing, onboarding, persistence, migration, progress and navigation. Not real-browser layout or user comprehension. |
| `npx tsc --noEmit --incremental false` | **Passed**                                                                                                                             | Static TypeScript consistency; not a guarantee against runtime failures.                                                                                  |
| Changed-file ESLint                    | **No errors** in the targeted persistence pass, with **two Fast Refresh warnings**; final onboarding QA fix: **no errors or warnings** | Focused checks on changed source files. Repository-wide lint still has existing unrelated Prettier/CRLF failures; no clean full-lint result is claimed.   |
| `git diff --check`                     | **Passed** after the implementation/QA changes                                                                                         | Whitespace/conflict-marker check; not deployment or behavior validation.                                                                                  |

The automated coverage includes:

- All 36 combinations of the three onboarding inputs, including cash-concern precedence and the exact two lessons for each path.
- Complete-answer validation, rapid-click protection, Back cancellation and cleanup when leaving onboarding.
- Consistent Starting Point content through summary, Home, Start and restoration; draft editing commits only when finished and retains completed lessons.
- Valid version-2 records, missing/invalid timestamps normalized to unknown, legacy answer migration and removal of old investment fields.
- Malformed JSON, missing/invalid answer values, unsupported schemas and storage read/write failures with usable in-memory state and an accurate warning.
- Next unfinished lesson, unrelated completion, completed paths, Learn catalogue action, all five checks, contextual return and invalid/unsafe lesson destinations.
- Cross-tab completion merging, independent no-onboarding learning, Explore without personal recommendations and Journey independent of onboarding.

The test files are in [`src/test`](../src/test). Assertions protect the learning-first state model; passing them does not prove that learners understood or retained the explanations.

## Completed local browser QA

QA exercised the actual locally running app in headless Chrome through browser clicks and keyboard events, using an isolated browser profile. Screenshots and layout measurements were inspected. This was browser interaction testing performed during development, not sessions with recruited participants.

| Area                        | Observed result                                                                                                                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First-time onboarding       | All three paths exercised. Answer selection and Back worked; rapid physical clicks advanced once; incomplete/invalid answers did not persist an outcome. Summary and lesson destination matched the path.                             |
| Learning                    | Feedback, explicit completion, return navigation, next-lesson updates and the completed-path state worked. Completion did not create an investment action or change answers.                                                          |
| Editing and refresh         | Previous Starting Point remained during a draft. Finishing changed the path while retaining completion; refresh restored it.                                                                                                          |
| New tab and browser restart | A new tab restored valid answers/completion. A full Chrome close and restart with the same profile preserved both stored records and the derived outcome.                                                                             |
| Cross-tab behavior          | Completing different lessons in two tabs retained both completions after refresh. Editing answers in one tab updated the other without deleting learning progress.                                                                    |
| Learn catalogue             | “Explore other topics” scrolled to the existing catalogue on Learn; all five topics remained available. Direct and unknown lesson URLs had usable outcomes.                                                                           |
| Contextual education        | Returning from an index-fund lesson reopened the originating category explanation. Category Back and Journey lesson-return navigation worked.                                                                                         |
| Explore/category detail     | Worked without onboarding. No personal recommendation appeared. Valid categories and invalid-category fallback were checked.                                                                                                          |
| Money Journey               | The displayed example was identical with and without onboarding. Fictional contributions, current value and the example milestone remained clearly labeled.                                                                           |
| Main/direct routes          | Home, Welcome, Start, Explore, Journey, Learn and valid/invalid lesson/category routes rendered usable screens. Unknown routes displayed recovery navigation.                                                                         |
| Keyboard basics             | Onboarding controls were keyboard reachable. A focus-loss issue after answer advancement was found and corrected; subsequent checks confirmed focus on the next question heading and summary. This is not a full accessibility audit. |

Browser diagnostics recorded no application JavaScript exceptions in the checked flows. Expected HTTP 404 responses for intentionally invalid routes were retained as expected behavior, not counted as application crashes.

### Mobile viewport checks

Widths **320px, 360px, 390px and 1280px** were checked. The recorded layout sweep covered 48 route/width combinations, with 12 additional active-state combinations for Home, Start, Learn and Welcome at the three narrow widths. Those measurements found no horizontal page overflow or measured main-content elements extending beyond the viewport.

Screenshots and interactions were also reviewed for wrapping, lesson/card readability, button containment, catalogue scrolling and access to content around the fixed navigation. These checks establish narrow-browser behavior only; they do not simulate physical touch, device safe areas or every mobile browser.

### Trust and copy review

Source and rendered copy were reviewed for personal investment amounts, assigned funds, suitability/readiness claims, guaranteed recovery and personal financial progress. No active old investment recommendation behavior was found. Historical fields in migration tests and educational arithmetic were distinguished from active personalization.

The current outcome chooses educational content only. Explore presents illustrative categories rather than specific investable schemes. Risk explanations allow losses and uncertain recovery. Journey is a shared fictional story. Lesson completion records an interaction, not investment readiness or demonstrated mastery.

This is a product-language review, not professional financial, regulatory or legal certification. It does not establish how real users interpret the wording.

## Planned evaluation — not completed

The [five-person usability protocol](usability-evaluation.md) is **planned** for Indian participants aged approximately 20–26 who are mostly new to investing. It covers onboarding, understanding the Starting Point, learning, contextual return, category discovery, fictional Journey, editing, persistence and navigation.

It proposes recording task success/assistance, onboarding time, misconceptions, pressure and confidence alongside comprehension. No participant sessions, results, quotes, completion rates, confidence gains or iteration findings are reported. The under-three-minute onboarding goal has not been established with target users.

## Verification limits and submission access

- No final live URL has been supplied or verified. Local QA is not evidence that the deployed version is accessible, current or working.
- Physical-phone, Safari and screen-reader behavior remain unverified; keyboard checks were limited.
- Tests and browser QA do not establish demand, learning gains, retention, investment behavior or Gen-Z preferences.
- The product uses local browser storage, English-only lessons and fictional category/Journey content. There is no account, cross-device persistence, real transaction system or real market data.
- Browser QA scripts, diagnostics and screenshots were recorded outside the repository during development; they are not bundled here as a portable browser test suite.

Before submission, provide the final app URL and verify anonymous reviewer access to the same product revision. Keep the separate human-written case-study rationale and actual prompt history alongside this evaluation summary.
