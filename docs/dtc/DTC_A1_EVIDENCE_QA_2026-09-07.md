# DTC-C13 — evidence integrity and report quality candidate

Date: 2026-09-07. Repository: `jcv86/main`.
Base: `dc5423b73095486fa6beca130feb3abc1bbb964a`.
Branch: `agent/dtc-a1-evidence-quality-20260907`.
Production baseline: `dpl_BuEW4F7KjGbHSjEipCBGhrJz98DK` (READY, main).

## Scope and verdict

This is a DTC-C13 implementation and QA addendum to `DTC_CLOSURE_LEDGER.md`, not a production release or a declaration that the launch blockers are closed. **Production verdict: NO_GO until authenticated desktop/mobile and PDF verification pass on the exact candidate.** The existing ledger's historical grounded-release header predates the current baseline; the identity above was read live from GitHub and Vercel for this work.

Implemented: a pure score/date evidence boundary; absent/invalid score states; ambiguity-aware pattern resolution; A1/integral parity; separately labeled assessment/C1/C2 dates; source-limited provenance; responsive report semantics and print isolation; build-time report contracts and TypeScript gate.

No migrations, credentials, dependency versions, production aliases, authentication policy, user records, or main-branch ref were changed by this block. A read-only Supabase metadata query verified the selected timestamps and ownership columns in all three A1 source relations. This is schema evidence, not an authenticated user-data or RLS test.

## Data contract

- `a1_cerebral_assessment`: `disc_profile`, `dominant_pattern`, `secondary_pattern`, `completed_at`; selected for the authenticated user's `user_id`, newest completion first, limit one.
- C1/C2: `canon_conozcamonos_1_responses` and `canon_conozcamonos_2_responses`; `responses,completed_at`; same authenticated ownership, ordering, and limit.
- Preserve the four independent signed net scores. Valid inputs are finite integers within the questionnaire's actual question-count limit, including legacy decimal integer strings.
- Null, missing, empty, boolean, object, fractional and out-of-range data never become a neutral score or a plausible strength. A real net zero still converts to intensity 50.
- Existing distinct canonical patterns remain authoritative when all four scores are valid. Legacy derivation requires unique maxima; ties without a usable canonical pair do not receive an arbitrary combined profile. Suppress personal resource/tension hypotheses when interpretation is unavailable.
- Explicitly separate source records from interpretive hypotheses. No random data, API-generated personal narrative, or fabricated outcome is introduced.
- Display assessment/C1/C2 timestamps separately in America/Santiago. The latest dated source is not represented as a complete evidence cutoff when a source is undated. The integral report is not called a transactionally synchronized historical snapshot.
- A1 and the integral summary use the same model and availability flag. A2/A3/A4 aggregation/query logic remains unchanged; the integral view labels its cumulative 90-day balance while explaining that A2 starts at 30 days.

## Verification already executed locally

- Pure report evidence contract: PASS, 103 behavioral cases, on the actual new TypeScript module transpiled with the available TypeScript compiler and executed under Node 22.
- Strict isolated TypeScript check of `report-evidence.ts`: PASS.
- TS/TSX syntax transpilation of all ten changed/new TS/TSX files: PASS. **This is not full application type validation.**
- Exact baseline `package.json` blob reconstruction checked against GitHub SHA `0591a78f6cc16d95e1fa47f587634bbea2473a53`; the candidate changes scripts only, not dependencies.
- No network access was available in the local execution container, so a complete checkout/install/build and authenticated browser/PDF run were not performed there.

## Remote build gate

`npm run build` now runs `check:report-quality` before Next.js:

1. 103 behavioral score/date cases.
2. Full A1 model regression (populated, partial, invalid, empty, tied, legacy and provenance).
3. Existing cross-stage reporting source contract.
4. Full `tsc --noEmit`.
5. Existing Next.js production build; existing prebuild/document generation is preserved.

Record exact candidate commit, deployment ID, gate output and remaining warnings in the linked pull request after Vercel responds. Do not infer success from a deployment merely being queued or from an older production build.

## Required rendered acceptance — still pending

Use an approved QA identity, never copied credentials in git, and never fabricate or overwrite real assessment data to produce an empty-state fixture.

- Exact candidate at 390x844 and desktop: A1 and integral use the same profile, context and date semantics; no horizontal overflow, unreadable text or duplicate main landmark.
- Scores are readable and exposed as accessible meters only when present; missing values use a dash plus explicit explanation, not zero or 50.
- Long free-text answers remain intact. Generic pattern resources are identified as hypotheses, not measured behaviors.
- Print A4-sized PDF: sidebar, session email, breadcrumb, app chrome and interactive buttons absent; report header, selectable text, numbers, limits and provenance present; no clipping, blank terminal page, or truncated multi-page answer.
- Anonymous and expired sessions remain protected. Verify another user's rows cannot enter either report. No source inspection or metadata-only SQL counts as passing this check.
- Inspect runtime errors for this candidate after the rendered checks; an empty log window without exercising the routes is not functional proof.

## Follow-on blocks, not completed here

DTC-C06 route-surface inventory/retirement and the middleware preview bypass require an independently tested block. DTC-C07 full authenticated Golden Path and DTC-C09/C10 launch/observability remain open. Do not bundle an unreviewed authentication rewrite into this report patch.
