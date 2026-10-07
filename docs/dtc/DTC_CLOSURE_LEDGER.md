# DTC closure ledger — canonical

Last grounded: 2026-10-07 UTC (release identity and Outcomes Chile block; earlier journey evidence retains its original date)

This is the **single canonical closure ledger** for Despega Tu Carrera. Historical detail remains available in Git history; this file keeps the current release state and only the evidence that still matters for closure decisions.

A status is `verified` only when there is observable evidence. Allowed states: `not_started`, `in_progress`, `blocked`, `verified`, `deferred_by_user`. A green CI run is evidence, but it is not treated as a substitute for a live check when the acceptance criterion explicitly requires one.

## Current release identity

- Repository: `jcv86/main`
- Canonical branch: `main`
- Current application-code baseline: PR #232 merge `7f56e2599d05edd04890901e17e6d64d7be0fdbb`
- Current production deployment: `dpl_Fm9pmGFsD1hXELa1cSQFNNSpQb6c` (READY, `main`, verified by both exact deployment and public domain on 2026-10-07)
- Work in progress: PR #233, `agent/dtc-outcomes-chile-data-foundation`; the Outcomes Chile application remains in Preview. Its Supabase schema and two national official references were installed on 2026-10-07. Real integration passed 14 functional cases; interrupted runner cleanup and verified separate recovery retain their own reports. Console classification and production publication remain under C18.
- Production domains: `despegatucarrera.com`, `www.despegatucarrera.com`
- Supabase production project: DTCFINAL `dcfrbwxbejtbcouionna`
- Production smoke after the final public hotfix: FAQ 200 with access-aware Vera copy, `/api/health/live` 200 `ok`, `/api/health/ready` 200 `ready`, `/demo` 404, and no Vercel runtime error clusters in the final one-hour scan.

## Outcomes Chile development block — 2026-10-07

| ID | User outcome and acceptance criteria | Evidence / boundary | Owner | Dependency | Status | Release blocker |
|---|---|---|---|---|---|---|
| DTC-C17 | Interpret observed labor/economic results with dated evidence, conservative benchmark selection, explicit verification, and no causal or realized-annual-income claim | Runtime/capture/query tests PASS, 1,201-row pagination checks PASS, independent review fixes verified, full types/build PASS with known Edge warning; local SQL atomicity/RLS PASS. Reproducible evidence and limitations: [Impact Engine v1](DTC_OUTCOMES_CHILE_IMPACT_V1.md); dedicated PostgreSQL 17 CI in PR #233 | `dtc-build-experience` / `dtc-supabase-backend` / `dtc-quality-gate` | Implementation verified; production activation depends on C18 and the ordered Outcomes Chile migrations | `verified` | yes, for Outcomes Chile |
| DTC-C18 | Use self-reported Outcomes Chile end to end with installed schema, owner isolation, atomic employment/followups, real versioned benchmark sources and personal capture/history UI | Four migrations installed in DTCFINAL, seven tables with forced RLS, 168 effective privilege assertions PASS; two reviewed INE ESI 2025 national references inserted and read back. V4 on application f3 passed 14/14 functional cases and 4/4 browser subcases; its NO_GO from interrupted cleanup remains intact. Separate RECOVERED evidence verifies both Auth users/invitations absent and 18 cascade counts at zero. [Activation record and source identity](DTC_OUTCOMES_CHILE_ACTIVATION.md). Combined verdict CONDITIONAL_GO | `dtc-supabase-backend` / `dtc-quality-gate` / `dtc-release-production` | Classify 15 mobile/4 desktop console error events before release; verify current-head CI/Preview and production application identity. Third-party verification is separately retained in C20 | `in_progress` | yes, for Outcomes Chile |
| DTC-C19 | Register and review personal job-search, employment and salary evidence in Spanish; safely retry without duplicates; complete owner-bound due follow-ups on mobile and desktop | Implemented `/despega/resultados-laborales`. Local browser lab GO, 15/15 scenarios, 390×844 and 1440×960, actual Montserrat, no axe violations; unintended new-record submission and ambiguous-income copy fixed. Runtime groups, SQL/PGlite, full types/build and independent review PASS. Real V4 capture/reload/retry/follow-up/owner-isolation/signout passed with independent screenshot review. [Experience contract and evidence](DTC_OUTCOMES_CHILE_EXPERIENCE.md); PostgreSQL 17 contention and current-head Preview remain enforced remote gates in PR #233 | `dtc-build-experience` / `dtc-supabase-backend` / `dtc-quality-gate` | Development implementation, remote schema and functional Preview journey verified; console classification and application release remain under C18 | `verified` | yes, for Outcomes Chile |
| DTC-C20 | Authorized operators can corroborate, verify, reject and correct personal evidence with a traceable, owner-bound decision | [Operator review procedure and concrete gaps](DTC_OUTCOMES_CHILE_OPERATOR_REVIEW.md) documented. No review operation is implemented: actor/subject ownership, atomic transition and audit, immutable history, and rejection/correction semantics remain open | `dtc-supabase-backend` / `dtc-build-experience` / `dtc-quality-gate` | Authenticated operator authorization, private evidence handling, transactional idempotent review and effects on summaries | `not_started` | yes, for operator review and verified/rejected claims; self-reported capture keeps its declared scope |

The release evidence below describes earlier product journeys, not the unlaunched Outcomes Chile feature. A READY Preview alone does not verify its database or user flow.

## Closure matrix (earlier product-flow evidence)

| ID | User outcome | Current evidence | Status | Release blocker |
|---|---|---|---|---|
| DTC-C01 | Production and canonical code contain the approved release | #176 and #177 merged; final Production deployment READY and serves the #177 Vera hotfix on the public domain | `verified` | yes |
| DTC-C02 | Signed-in users can save and resume C1/A1 | Approved authenticated production QA previously proved C1/A1 save-refresh-resume, all 28 A1 answers persisted, C2 saved 8 answers, integral report rendered and transition reached A2 | `verified` | yes |
| DTC-C03 | Pilot invitation / returning OAuth continuity remains reliable | Live production evidence on 2026-09-20 verified scanner-safe GET, single-use claim semantics, Google OAuth on the exact current release, returning access without a new invitation, logout invalidation, browser-Back unable to restore protected content, stale-OAuth-state recovery, clean Google re-entry and canonical journey resume | `verified` | yes |
| DTC-C04 | Browser/server data access is least-privilege and owner-bound | The 2026-09-16 DTCFINAL audit recorded 369 public tables with **0 RLS-disabled tables**; 20/20 public views used `security_invoker=true`; 0 `SECURITY DEFINER` functions were executable by `anon`; only intentional `complete_a2_mission(uuid,jsonb)` was executable by `authenticated`, checked `auth.uid()`, and had empty `search_path`; the OAuth creation trigger was active. This is the dated core-release snapshot; Outcomes Chile additions are verified separately under C18 | `verified` | yes |
| DTC-C05 | Production build is reproducible | #177 passed Production public QA, TypeScript and full build; exact Preview READY; final Production build completed successfully and is READY | `verified` | yes |
| DTC-C06 | Users see one coherent DTC product, not test/internal surfaces | Route-authentication contracts, laboratory-bypass retirement and public credibility gates pass; `/demo` is 404 in final production; sitemap/FAQ/public CTAs expose the intended product surfaces | `verified` | yes |
| DTC-C07 | Core journey is usable on desktop/mobile with recovery states | Authenticated production QA exists for C1/A1/A2/A3/A4 evidence paths; isolated browser gates use real Auth/JWT/PostgREST/RLS and exact 390×844 plus desktop coverage; cross-owner access is denied; Spanish 404 recovery is live | `verified` | yes |
| DTC-C08 | Scores, progress, limitations and next action are truthful | Report evidence contract passes 103 cases; A1 professional report contract passes populated/partial/invalid/empty/tied/legacy/provenance cases; A2/A3/A4 continuity and limitations are covered by evidence-aware gates | `verified` | yes |
| DTC-C09 | Public launch surfaces are credible and crawlable | #176/#177 cleaned unsupported pricing, ratings, guarantees, institutional claims, SLA, Schema.org, FAQ, manifest, sitemap and crawler/LLM context; live FAQ canonical + FAQPage JSON-LD verified; empty legacy library is noindex and absent from sitemap | `verified` | yes |
| DTC-C10 | Operators can diagnose failures without leaking assessment data | `x-dtc-request-id` browser→middleware→API correlation is tested; controlled failure logs are redacted; live/ready health endpoints work; final runtime error scan is clean | `verified` | no |
| DTC-C11 | A2 is coherent Spanish-language work across 90 days | 90 missions reviewed and covered by focused Spanish/content contracts including unsupported-claim rejection | `verified` | yes |
| DTC-C12 | Signed-in users can review real A2/A3/A4 evidence and one A1–A4 report | Authenticated production evidence shows A2 90/90, A3 10/10 with 95/100 average, truthful empty A4, coherent integral report/PDF action and zero cross-user documents | `verified` | yes |
| DTC-C13 | Despega Cerebral is the professional interpretive core | A1 dossier/report contracts, DISC correction, C1/C2 context integration, methodology/limitations, print/mobile browser gate and integral-report consistency all pass; later public-only releases did not change the private report path | `verified` | yes |
| DTC-C14 | Public promises and private progress stay credible | Public/B2B claims are evidence-led; preferences save/reload/restore passed authenticated production QA; exact 390×844 isolated browser gate passed real Auth/RLS | `verified` | yes |
| DTC-C15 | Personal APIs, operator surfaces and legacy flows fail closed | Global route-authentication, retired admin/demo/lab surfaces, private cache behavior, legacy endpoint retirement and privileged RPC contracts all pass in the current evidence-aware validation stack | `verified` | yes |
| DTC-C16 | Pilot analytics measure the funnel without arbitrary PII | Analytics design exists, but production retention/expiry and current end-to-end persistence are not part of the core release closure evidence | `in_progress` | no |

## Live Supabase security position

Remote migrations confirmed present in DTCFINAL include:

- `harden_legacy_auth_and_privileged_rpc_p0`
- `harden_inactive_and_unambiguous_relations_wave2`
- `harden_remaining_active_relations_wave3`
- `canonical_journey_foundation`
- `canonical_journey_security`
- `retire_legacy_progress_rpc_access`
- `harden_residual_privileged_rpc_surface`
- `harden_security_definer_views`
- `harden_service_only_definer_search_path`

Read-only production audit on 2026-09-16:

- public tables: 369
- public tables with RLS disabled: **0**
- public views: 20; views without `security_invoker=true`: **0**
- `SECURITY DEFINER` functions callable by `anon`: **0**
- `SECURITY DEFINER` functions callable by `authenticated`: **1**, the intentional owner-bound `complete_a2_mission`
- `SECURITY DEFINER` functions missing an explicit `search_path`: **0**
- Auth trigger `on_auth_user_created` → `handle_oauth_user_creation` remains enabled

The advisor still reports lower-priority platform hygiene:

- 106 RLS-enabled tables with no policy. Most are intentionally client-closed; only four empty legacy tables still retain browser-role grants while RLS-with-no-policy keeps them fail-closed.
- 78 mutable-search-path warnings on non-`SECURITY DEFINER` functions.
- `vector` extension installed in `public`.
- Supabase leaked-password protection disabled.
- Postgres security patches available.

These are tracked as hardening/administration work; they are not equivalent to the earlier high-risk RLS-disabled / public privileged-RPC findings, which are now closed.

## Earlier core release-quality position (2026-09-20)

The earlier evidence marked product-flow blockers DTC-C01 through DTC-C15 `verified`. DTC-C16 remains `in_progress` and was non-blocking for that release. Outcomes Chile has its own current development and activation conditions in C17/C18 above; this historical position does not certify that new feature.

## Administrative / platform follow-up

These do not represent a broken DTC user flow, but they should be closed for stronger operational maturity:

1. Enable a GitHub ruleset / branch protection on `main`: require pull requests, required critical checks, up-to-date branch, and block force pushes.
2. Enable Supabase leaked-password protection.
3. Schedule the available Supabase Postgres security upgrade through a maintenance window.
4. Review whether moving `vector` out of `public` is safe for the current extension usage before changing it.
5. Optionally revoke stale `anon`/`authenticated` grants from the four empty fail-closed legacy tables and continue reducing non-definer mutable `search_path` warnings.

## Score criterion

The earlier core release's **9.7** criterion had its product-flow blocker condition satisfied by the dated C01–C15 evidence above, with administrative controls still to complete or explicitly defer and C16 non-blocking. This historical score does not rate the unlaunched Outcomes Chile feature; C18 still governs its production activation.
