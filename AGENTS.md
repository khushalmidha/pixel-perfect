# Agent rules
- Every screen renders inside `AppFrame` (src/components/app) — keeps the phone-width shell, grid and bottom nav consistent.
- In-context education uses `Explainer`, `RiskNote`, `AdviceNote` from src/components/app/education.tsx — education lives at the decision point, never only in /learn.
- All data comes from src/lib/mock-data.ts — this is a case-study prototype with no real trading.
