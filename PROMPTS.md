# Steady development prompt history

These are concise paraphrases of the actual user prompts available in the development conversation and its attached requests, organized in chronological order. They are not verbatim transcripts. Repeated audits are grouped where they served the same purpose. An earlier UI/scaffold existed before the first inspection below; its original creation prompt is not available in this record and has not been reconstructed.

Stages 1–9 describe the earlier investment-plan prototype. Those requirements are historical: the final product generates neither a personal investment amount nor a selected fund.

## 1. Inspect the existing investment-plan flow

Inspect onboarding, answers, `buildPlan()`, persistence, refresh, Home, Plan, Explore, fund detail, routing, reusable components, fallbacks and tests. Trace Welcome through the summary and fund into Home/Plan after refresh; report what is connected, hardcoded or broken without changing files.

## 2. Make personalized state consistent

Use the existing PlanProvider and plan builder as the source of truth across Home, Plan, Explore and fund detail. Make explanations match the actual capped or anxiety-adjusted result, preserve honest no-plan fallbacks, and verify with tests and TypeScript without redesigning the app.

## 3. Make onboarding reliable

Prevent repeated clicks from queuing advances, restore saved answers when editing, show accurate question progress and validate complete answers before generating a result. Keep draft edits separate until finishing and add focused reliability tests.

## 4. Build Money Journey

Use the existing components and mock data to show goal progress, a small summary, milestones, activity and a calm next action. Clearly disclose simulation, handle no-plan state, keep the screen mobile-first and avoid a trading dashboard.

## 5. Build Learn and contextual education

Create five short beginner lessons with meaning, relevance, an example, a takeaway and a brief knowledge check with immediate feedback. Connect existing inline explanations to lessons, persist completion locally, keep Learn usable without onboarding and avoid readiness claims or gamification.

## 6. Perform a focused UX consistency pass

Remove misleading header/demo values, preserve useful context when returning from lessons, check first-time, returning, editing and no-plan flows, and fix visible mobile or copy problems. Make targeted fixes only and run the existing verification checks.

## 7. Review product quality and financial trust

Critically assess differentiation, Gen-Z relevance, confusion, risk communication, case-study coverage and demo weaknesses. Then make the smallest trust fixes: handle little/no spare money without forcing investing, distinguish reported answers from inference, make horizons conditional and label the Journey milestone as illustrative.

## 8. Plan a five-person evaluation

Define concrete tasks, success/failure signals, recording metrics, a practical script and iteration thresholds for five mostly new Indian investors aged 20–26. Include confidence, comprehension and pressure questions; do not invent results or treat the prototype as a suitability assessment.

## 9. Challenge the amount recommendation

Read the amount rule and onboarding implementation as a product strategist and financial UX reviewer. Compare keeping it with better framing, minimally changing it, and replacing precise investment recommendations with a different first step; choose one without changing code.

## 10. Design the learning-first Starting Point

Choose Option C: personalize what the user should understand next. Inspect all consumers before proposing the smallest coherent data model, three learning paths, screen behavior, completion/editing/refresh transitions, storage failure handling and tests. Remove inferred personal amounts and fund selections.

## 11. Implement Option C

Persist schema version 2 with only the three answers—leftover money, emergency cushion and feelings about losses—and a timestamp. Replace `buildPlan()` with `buildStartingPoint()` and derive educational content:

- Tiny leftover or no cushion → cash basics: before-investing, then investment risk.
- Otherwise anxious or uneasy → risk and access: investment risk, then why dips happen.
- Remaining answers → fund basics: index-fund example, then before-investing.

Remove income and investment-derived fields, retain onboarding reliability and the existing persistence architecture, share the next unfinished lesson across Home/Start/Learn, migrate valid old answers and keep completion independent. Separate Explore from personalization and make Journey a shared fictional ₹500 contribution example. Verify all consumers and tests without adding features.

## 12. Audit the refactor adversarially

Inspect the actual repository for old-model dependencies, every answer combination, state consistency, migration, malformed storage, financial claims, routes, mobile demo risks and meaningful test gaps. Distinguish confirmed defects from unverified browser concerns and report the smallest safe fixes without modifying files during the audits.

## 13. Apply only the targeted audit fixes

Preserve valid answers when version-2 or legacy timestamps are missing/invalid, target the existing Learn catalogue after path completion, improve the five existing checks and replace the stale README introduction. Merge validated learning completion across tabs if a small safe fix is possible. Keep compatibility filenames/routes and avoid unrelated formatting changes.

## 14. Exercise the actual browser

Test local desktop and 320px, 360px and 390px views: all three paths, learning, editing, refresh/restart, two tabs, catalogue, contextual returns, Explore, fictional Journey, keyboard interaction and direct/error routes. Fix only verified problems, report PASS/FAIL/unverified honestly, and rerun tests, TypeScript, changed-file lint and diff checks after fixes.

## 15. Review against the original hiring brief

Assess the frozen product as a strict hiring panel: problem value, defensible personalization, coherence, trust, design intent, evaluation credibility and every original PDF deliverable. Do not modify files, invent participant evidence or recommend additional scope without a blocker.

## 16. Prepare submission documentation

Freeze all product code. Document the actual prompt stages, thesis, flow, configured repository, pending live link, completed local evaluation and planned study. Create no user-study results and run only documentation-related checks.
