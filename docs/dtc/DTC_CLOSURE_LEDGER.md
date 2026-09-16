# DTC closure ledger — canonical

Last grounded: 2026-09-16 UTC

This is the **single canonical closure ledger** for Despega Tu Carrera. Historical detail remains available in Git history; this file keeps the current release state and only the evidence that still matters for closure decisions.

A status is `verified` only when there is observable evidence. Allowed states: `in_progress`, `verified`, `deferred_by_user`. A green CI run is evidence, but it is not treated as a substitute for a live check when the acceptance criterion explicitly requires one.

## Current release identity

- Repository: `jcv86/main`
- Canonical branch: `main`
- Current application-code baseline: PR #177 merge `6246497b96c22a1bba3ea1510ba4a9e27d14e98c`
- Production release with that application tree plus release documentation: `dpl_AGJHyBed66ioWT4bsfztXSM2yJvY`
- Production domains: `despegatucarrera.com`, `www.despegatucarrera.com`
- Supabase production project: DTCFINAL `dcfrbwxbejtbcouionna`
- Production smoke after the final public hotfix: FAQ 200 with access-aware Vera copy, `/api/health/live` 200 `ok`, `/api/health/ready` 200 `ready`, `/demo` 404, and no Vercel runtime error clusters in the final one-hour scan.

## Closure matrix

| ID | User outcome | Current evidence | Status | Release blocker |
|---|---|---|---|---|
| DTC-C01 | Production and canonical code contain the approved release | #176 and #177 merged; final Production deployment READY and serves the #177 Vera hotfix on the public domain | `verified` | yes |
| DTC-C02 | Signed-in users can save and resume C1/A1 | Approved authenticated production QA previously proved C1/A1 save-refresh-resume, all 28 A1 answers persisted, C2 saved 8 answers, integral report rendered and transition reached A2 | `verified` | yes |
| DTC-C03 | Pilot invitation / returning OAuth continuity remains reliable | Real production invitation was previously issued, claimed and verified single-use; current scanner-safe invitation browser gate passes against real local Auth/JWT/PostgREST; current production anonymous boundaries are correct. A fresh end-to-end Google/LinkedIn invitation + sign-out + browser-back rerun on the exact current production release has not been reproduced in this session | `in_progress` | yes |
| DTC-C04 | Browser/server data access is least-privilege and owner-bound | DTCFINAL now has 369 public tables with **0 RLS-disabled tables**; 20/20 public views use `security_invoker=true`; 0 `SECURITY DEFINER` functions are executable by `anon`; only intentional `complete_a2_mission(uuid,jsonb)` is executable by `authenticated`, checks `auth.uid()`, and has empty `search_path`; OAuth creation trigger remains active | `verified` | yes |
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

## Remaining release-quality gap

Only one product-flow release blocker remains evidence-incomplete: **DTC-C03**, a fresh end-to-end pilot/OAuth rerun on the exact current deployed release. Existing evidence already covers a real single-use invitation, authenticated production use, current local real-Auth scanner protection and current anonymous production boundaries; this ledger does not pretend those separate proofs are the same as one fresh current-release OAuth run.

## Administrative / platform follow-up

These do not represent a broken DTC user flow, but they should be closed for stronger operational maturity:

1. Enable a GitHub ruleset / branch protection on `main`: require pull requests, required critical checks, up-to-date branch, and block force pushes.
2. Enable Supabase leaked-password protection.
3. Schedule the available Supabase Postgres security upgrade through a maintenance window.
4. Review whether moving `vector` out of `public` is safe for the current extension usage before changing it.
5. Optionally revoke stale `anon`/`authenticated` grants from the four empty fail-closed legacy tables and continue reducing non-definer mutable `search_path` warnings.

## Score criterion

A practical **9.7** requires the current product blockers to be `verified` and the administrative controls above either completed or explicitly accepted/deferred by the owner. The ledger must not mark a missing live OAuth proof as complete simply to reach a target score.
