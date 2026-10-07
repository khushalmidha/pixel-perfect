# Steady: five-person usability evaluation

**Status: planned, NOT conducted. No participant results are reported.**

The original case study asks for evals. This protocol defines our proposed human evaluation of the final learning-first product. The three answers choose educational content, not an investment budget, suitable fund or readiness assessment. Completed implementation and browser checks are documented separately in [submission-evaluation.md](submission-evaluation.md).

## Participants and setup

Recruit five Indian participants aged 20–26, preferably first-time or very limited investors; aim for at least four who have not independently selected a mutual fund. Avoid people familiar with the build. Record investing experience without collecting personal financial details.

Allow 30–35 minutes per session. Use a phone first; record device, browser, URL and tested version. If a desktop simulation is necessary, label it. Use a fresh browser context with no saved answers or lesson completion for each person, then keep that context for refresh checks. Obtain permission for recording; notes alone are enough. Use P1–P5 and allow withdrawal.

Give a fictional profile before timing. Do not disclose its expected path:

| Participants | Profile                                                                                        | Moderator-only expected path |
| ------------ | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| P1, P4       | Almost nothing left; no emergency savings; would want to withdraw after a loss                 | Cash basics                  |
| P2, P5       | ₹5,000–₹15,000 left; around one month of emergency savings; uneasy about a loss but would wait | Risk and access              |
| P3           | ₹5,000–₹15,000 left; three or more months of emergency savings; feels able to handle a loss    | Fund basics                  |

These scenarios cover routing, not the participant's finances. Timing supplied answers does not measure reflection on real finances. Path samples of 2/2/1 cannot support comparisons between groups.

## Opening and baseline

Read: “We are testing the design, not you. Use this fictional profile; you do not need to share your finances. No real payment will happen. Please say what you are looking for or expecting. I will mostly watch. You can stop whenever you like.”

Before opening the app, ask:

- What experience do you have with choosing investments?
- How confident are you in understanding basic investment risks and knowing what to check? Use 1 = not confident to 5 = very confident.

Do not explain the intended paths or outcomes. The opening already mentions no payments, so later recognition of that fact is not unaided discovery.

## Tasks and success criteria

Read only the task column. Record the first explanation and action before follow-up prompts. Knowing the intended answer is a moderator check, not something to tell participants.

| #   | Task to read                                                                                                                                    | Success                                                                                                                                                              | Failure/confusion                                                                                         | Record                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | “Using your profile, begin here and continue until you reach a result.” Start at Welcome.                                                       | Three questions and summary completed independently in under 180 seconds.                                                                                            | Unclear options, accidental skipping, inability to correct an answer or required help.                    | Time from first interaction to summary, hesitation, corrections and help.              |
| 2   | “What is this page telling you? Why do you think it appeared? Show me what you would do next.”                                                  | Unaided explanation connects at least one answer to a learning focus; identifies a useful next lesson.                                                               | Assumes an instruction to invest, a budget, an assigned fund or financial approval; no clear next action. | First explanation, first action and any misconception, before directing anywhere.      |
| 3   | “Continue with the next step you chose. When you finish, show me what you would do next.”                                                       | Completes a lesson/check, understands feedback and finds the changed next lesson or completed-path action.                                                           | Cannot finish or find continuation; thinks completion means readiness; loses the return destination.      | First/final quiz answer, explanation of feedback, assistance and next action.          |
| 4   | “You are curious about different types of funds, but aren't sure what to understand before choosing anything. Show me what you would look at.”  | Finds category information; explains a difference and a remaining risk when comparing categories.                                                                    | Treats browsing as a personal recommendation or a less volatile category as guaranteed safe.              | Initial destination and reasoning; spontaneous versus prompted comparison; help.       |
| 5   | “Open a category you want to understand. What does it hold, what could go wrong, and what would you check? Use any help you want, then return.” | Explains holdings and at least one risk in own words; recognizes illustrative category information; can return from a contextual lesson to the category/explanation. | Treats it as a specific purchasable scheme, assumes guaranteed recovery/access or loses context.          | Unaided explanation first; risk, example distinction and contextual return separately. |
| 6   | “Open Journey. Tell me what this screen means, and show me what you can learn here.”                                                            | Understands it is a shared fictional example; distinguishes contributions from current value and the example milestone from a personal goal.                         | Believes it is their investment history, scheduled payment, forecast or limit on losses.                  | Initial explanation before probing; interpretation after opening the example.          |
| 7   | “Change your answers to this updated profile. Finish, return Home, then refresh and find the lesson you completed.”                             | Revised focus appears after finishing; completed lessons remain; refresh restores both.                                                                              | Expects a financial allocation change, loses completion, sees stale next action or needs help returning.  | Before/after focus, completion, refresh state, wrong turns and help.                   |
| 8   | “Return Home using the main navigation, then find another topic you might want to understand.”                                                  | Navigates independently and identifies an optional learning use.                                                                                                     | Cannot distinguish Home, Start and Learn or feels obliged to invest/continue.                             | Wrong turns, help, choice and reason, including no reason to return.                   |

For task 7, give cash-basics participants the fund-basics profile; give the others the cash-basics profile.

### Follow-ups without hiding assistance

- Task 2 is an unaided comprehension question before directing anyone to Learn or Explore. Record it before correcting anything.
- If task 3 did not lead to a lesson, record that first; provide lesson setup so later checks remain possible, marking them assisted.
- If task 4 does not reach Explore, record the initial choice, then ask “Please look at Explore.” For comparison, ask “What differences do you notice between these categories?” Only afterward, if needed, ask which appears to move less and what could still go wrong. A prompted comparison does not count as unaided discovery.
- In task 5, first record what the participant volunteers. Then ask whether all the displayed information refers to a specific real scheme. If a full lesson was not opened, request it to test return navigation; mark that step prompted.
- In task 6, first record interpretation without saying “fictional.” Later ask “Where do these numbers come from?” and “What does the progress measure?”

## Moderation and recording

Use neutral prompts: “What are you looking for?” and “What did you expect?” Do not praise correct answers, name the expected category or correct misconceptions before recording them. Record every hint. Clarify consequential misconceptions afterward without giving financial advice.

Allow about two minutes per common task and four minutes for a lesson. At 180 seconds, record the onboarding target missed; allow up to four minutes to finish. If one task blocks later tasks, preserve the failure and mark facilitator setup.

For each task record independent success, assisted success, unsuccessful or not checked. Keep navigation and understanding separate. Capture time where relevant, hesitation (pause, repeated reading or backtracking), wrong turns, assistance and the participant's explanation. Record quotes only from actual sessions.

## Post-test questions

1. Repeat the same 1–5 confidence question. What explains any change?
2. How did Steady choose where you began? What did it decide, and what did it leave to you?
3. How pressured did you feel to invest? Use 1 = none to 5 = strong. Which words caused it?
4. In your own words, what could go wrong with the category you explored?
5. What does completing a lesson mean? What were the Journey numbers?
6. What was confusing or unnecessary? Ask for a specific example.
7. What, if anything, would you return for?

Finish with a new scenario: “An investment has fallen and the money might be needed soon. What would you want to understand before deciding what to do?” Record reasoning, not an investment decision. The session may itself teach; confidence or this answer alone cannot establish learning gains.

## How to prioritize findings

- Any belief that Steady assigned a personal fund/budget, certified readiness, guaranteed recovery or tracked actual financial progress: investigate its trigger immediately and prioritize a trust fix.
- **3/5 struggling with the same issue:** prioritize it. This is an issue-detection heuristic, not statistical validation or proof of product-market fit.
- **2/5:** investigate severity, assistance and consequences before deciding.
- For path-specific findings, use the actual denominator (2/2 or 1/1), not 2/5.
- Fewer than 4/5 independently completing onboarding under three minutes or a common task: investigate the cause. This is a chosen prototype target, not a population estimate.
- Higher confidence with mistaken explanations, or pressure at 4–5/5: investigate as a trust concern.
- Isolated visual preferences: record without expanding scope.

Where feasible, retest changed steps with two new people; otherwise label changes “implemented, not user-validated.” After actual sessions, report counts with assistance, individual times, misunderstandings, supporting observations and retest status. Until then, this remains a plan.

## What this evaluation can and cannot prove

Automated tests verify specified behavior; browser QA catches interaction/layout problems. This five-person study could reveal comprehension, navigation and trust problems worth investigating.

None alone proves long-term financial behavior, investment outcomes, financial readiness or broad Gen-Z product-market fit. Supplied profiles, English-only content, moderator prompts and a small sample limit conclusions. Completion is not mastery. No usability percentages, participant quotes or confidence improvements are claimed before sessions occur.
