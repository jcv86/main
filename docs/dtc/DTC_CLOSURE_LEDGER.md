# DTC closure ledger — canonical

Last full product closure: 2026-09-20 UTC. Latest scoped A4 release evidence: 2026-10-07 UTC.

This is the **single canonical closure ledger** for Despega Tu Carrera. Historical detail remains available in Git history; this file keeps the current release state and only the evidence that still matters for closure decisions.

A status is `verified` only when there is observable evidence. Allowed states: `in_progress`, `verified`, `deferred_by_user`. A green CI run is evidence, but it is not treated as a substitute for a live check when the acceptance criterion explicitly requires one.

## Last verified production checkpoint

- Repository: `jcv86/main`
- Canonical branch: `main`
- Verified application code: [PR #239](https://github.com/jcv86/main/pull/239) merge `4c0322a929b51aa79dc9c3acce4225032d661b49`, exact reviewed tree `7181105474831cf823745fa971b6ef1a95b55582`
- Verified production deployment: `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN` (READY, 2026-10-07 22:17:29.612 UTC / 19:17:29 Chile); canonical-domain connector read confirmed this identity at 22:18 UTC
- Production domains: `despegatucarrera.com`, `www.despegatucarrera.com`
- Supabase production project: DTCFINAL `dcfrbwxbejtbcouionna`
- Latest scoped production evidence: PR #239 final regressions 273/273 and CI 10/10; clean CI/Vercel builds; seven anonymous checks pass at 22:18:56 UTC. The authorized production session opened normal A4 and followed the new `Explorar oportunidades` link to job matching, whose Metropolitana draft-filter catalog shows 32 opportunities. The saved-search no-matches state remains unchanged. Two sanitized auxiliary-profile `schema_unavailable` diagnostics were observed in the exact new deployment at 22:19:00.436 and 22:21:26.061 UTC; its unavailability is explicit in the usable UI. A DTCFINAL read at 22:18:52 UTC reconfirmed 110 stored rows / 44 fresh, with slot 165871 still the last execution. New native maintenance effects remain unobserved. Historical full-product evidence below retains its original scope and dates.

## Closure matrix

| ID | User outcome | Current evidence | Status | Release blocker |
|---|---|---|---|---|
| DTC-C01 | Production and canonical code contain the approved release | Latest verified checkpoint: PR #239 merged after owner authorization; main `4c0322a` has exact reviewed tree `7181105` and the canonical domain resolves to READY deployment `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN` | `verified` | yes |
| DTC-C02 | Signed-in users can save and resume C1/A1 | Approved authenticated production QA previously proved C1/A1 save-refresh-resume, all 28 A1 answers persisted, C2 saved 8 answers, integral report rendered and transition reached A2 | `verified` | yes |
| DTC-C03 | Pilot invitation / returning OAuth continuity remains reliable | Live production evidence on 2026-09-20 verified scanner-safe GET, single-use claim semantics, Google OAuth on the exact current release, returning access without a new invitation, logout invalidation, browser-Back unable to restore protected content, stale-OAuth-state recovery, clean Google re-entry and canonical journey resume | `verified` | yes |
| DTC-C04 | Browser/server data access is least-privilege and owner-bound | DTCFINAL now has 369 public tables with **0 RLS-disabled tables**; 20/20 public views use `security_invoker=true`; 0 `SECURITY DEFINER` functions are executable by `anon`; only intentional `complete_a2_mission(uuid,jsonb)` is executable by `authenticated`, checks `auth.uid()`, and has empty `search_path`; OAuth creation trigger remains active | `verified` | yes |
| DTC-C05 | Production build is reproducible | PR #239 final candidate passed 273 regressions, TypeScript and all 10 workflows, including a clean production build; its Vercel preview and exact-tree production merge both built and are READY. Local font-loader build failures are retained in PR #239 rather than reported as local success | `verified` | yes |
| DTC-C06 | Users see one coherent DTC product, not test/internal surfaces | Route-authentication contracts, laboratory-bypass retirement and public credibility gates pass; `/demo` is 404 in final production; sitemap/FAQ/public CTAs expose the intended product surfaces | `verified` | yes |
| DTC-C07 | Core journey is usable on desktop/mobile with recovery states | Authenticated production QA exists for C1/A1/A2/A3/A4 evidence paths; isolated browser gates use real Auth/JWT/PostgREST/RLS and exact 390×844 plus desktop coverage; cross-owner access is denied; Spanish 404 recovery is live | `verified` | yes |
| DTC-C08 | Scores, progress, limitations and next action are truthful | Report evidence contract passes 103 cases; A1 professional report contract passes populated/partial/invalid/empty/tied/legacy/provenance cases; A2/A3/A4 continuity and limitations are covered by evidence-aware gates | `verified` | yes |
| DTC-C09 | Public launch surfaces are credible and crawlable | #176/#177 cleaned unsupported pricing, ratings, guarantees, institutional claims, SLA, Schema.org, FAQ, manifest, sitemap and crawler/LLM context; live FAQ canonical + FAQPage JSON-LD verified; empty legacy library is noindex and absent from sitemap | `verified` | yes |
| DTC-C10 | Operators can diagnose failures without leaking assessment data | `x-dtc-request-id` browser→middleware→API correlation is tested; controlled failure logs are redacted; live/ready health endpoints work; earlier closure evidence recorded a clean runtime scan; the current PR #239 scoped checkpoint reports two sanitized auxiliary-profile availability diagnostics in the exact deployment (22:19:00.436 and 22:21:26.061 UTC) | `verified` | no |
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

All product-flow release blockers DTC-C01 through DTC-C15 are now `verified`. DTC-C16 remains `in_progress`, but it is explicitly non-blocking for the current product release. Remaining work is administrative/platform hardening rather than a known broken user flow.

## Administrative / platform follow-up

These do not represent a broken DTC user flow, but they should be closed for stronger operational maturity:

1. Enable a GitHub ruleset / branch protection on `main`: require pull requests, required critical checks, up-to-date branch, and block force pushes.
2. Enable Supabase leaked-password protection.
3. Schedule the available Supabase Postgres security upgrade through a maintenance window.
4. Review whether moving `vector` out of `public` is safe for the current extension usage before changing it.
5. Optionally revoke stale `anon`/`authenticated` grants from the four empty fail-closed legacy tables and continue reducing non-definer mutable `search_path` warnings.

## Score criterion

A practical **9.7** now has its product-flow blocker condition satisfied: DTC-C01 through DTC-C15 are `verified`. The remaining requirement is to complete the administrative controls above or explicitly accept/defer them as owner decisions. DTC-C16 is non-blocking.

## A4 source expansion — 2026-10-07

| ID | User outcome | Evidence and acceptance contract | Status |
|---|---|---|---|
| DTC-A4-S01 | The Radar includes current public employer vacancies relevant to Chile, with reliable verification and isolated source failures | `docs/dtc/DTC_MULTISOURCE_OPPORTUNITY_COLLECTOR.md`; PR #236 is published. Native slot `165871` completed successfully: 32 upserts, no invalidations/rejections, Checkr 14 and APPLY Digital 6 accepted and persisted. Inventory has 110 rows, 44 verified within 24 hours. The updated catalog shows 32 Metropolitana opportunities; PR #238 normal entry and report are verified in the authorized session. Four other employers' production cycles are unverified. | `in_progress` |
| DTC-A4-A01 | An explicitly authorized pilot can open A4 consistently while keeping real A1–A3 progress | Existing temporary entitlement renewed for 30 days, without completion or assessment writes. PR #238 final candidate `c63e058` passed 25 permission + 14 availability regressions, full build and 14 CI workflows; merge `79ec6b6` is production READY. Authorized normal entry, report and catalog were verified at 21:45–21:46 UTC. Real A1–A3 progress and saved search remain unchanged; unavailable profile data is explicit. | `verified` |
| DTC-A4-S02 | Freshness maintenance, fair bounded employer coverage and truthful per-source persistence | Current improvement adds up to three known Chiletrabajos candidates within the existing 12 probes, durable primary cooldowns, fair rotation among received eligible employer jobs under the 50-return cap, confirmed-write counters and a visible catalog entry. PR #239 is published on main `4c0322a`, exact reviewed tree `7181105`, production READY at 22:17:29.612 UTC. Final regressions 273/273, TypeScript, 10/10 CI, clean CI/Vercel builds and live catalog-link navigation pass. The 22:18:52 UTC SQL read still shows slot 165871; native maintenance/cooldown/counter effects remain unobserved. | `in_progress` |

### A4 publication checkpoint

- **Initial collector publication:** after user authorization on 2026-10-07, PR #236 merged and deployment `dpl_FFvpPvdufqrMyjUB3uWPahJbE2Vd` served the exact reviewed application tree `723643040e2fcbf7ed1d095d88c83e5b25c130c7` on the canonical domain. PR #238 subsequently repaired normal A4 access; the current PR #239 production identity is identified above.
- **Observed catalog baseline:** 78 Chiletrabajos rows, 12 verified within 24 hours, no Lever/Greenhouse rows before the new scheduled run. The 47 accepted public-smoke jobs were not inserted by that diagnostic.
- **Native scheduler and execution:** the Vercel Cron Jobs UI confirms Enabled. Slot `165871` started 2026-10-07 21:15:00.909321 UTC and completed 21:15:07.636 UTC with `success/ok`: 32 upserts, 0 invalidations/rejections. Checkr accepted 14/14 and APPLY Digital 6/23, excluding 17; both snapshots were complete, without cooldown or failure codes. A 21:16:08 UTC read confirmed 90 Chiletrabajos (24 fresh), 14 Greenhouse (all fresh), 6 Lever (all fresh), 0 Get on Board: 110 total, 44 fresh.
- **Authentication/access evidence:** public HTTPS navigation, sign-out and user-selected returning Google login were observed. The owner explicitly requested A4 for the existing pilot; its server-only temporary entitlement was renewed until 2026-11-06 21:00:13 UTC. After PR #238, normal A4 landing, report and job search open; the draft-filter catalog shows 32 current Metropolitana opportunities. The saved-search no-matches state was preserved. No answers or progress were changed to grant access. PR #238 is published and the landing/report/navigation consistency is verified in the authorized production session.
- **Remaining evidence and owners:** scheduled execution and persistence are now verified. PR #238 exact-commit publication, authenticated normal entry/report and the updated catalog are verified; all 14 workflows on its final reviewed SHA passed. PR #239 bounded maintenance is published with exact-tree, CI/build, live catalog-link and anonymous-boundary evidence. Its new maintenance/cooldown/persistence counters still need native-effect evidence. The four remaining employers' native cycles are not yet observed. SQL counts alone do not close the user-facing acceptance criteria.
- **Rollback:** `dpl_HGrjKkC4HxGeYj8AZ915ZWMdHCTD`, main `7ce45b5c77f844081a97a3f023fbc346ee9350e7`; no database migration or new environment variable is required by this release.
- **Scoped verdict:** `CONDITIONAL_GO` for the publication checkpoint; DTC-A4-S01 remains `in_progress`. This update does not re-score or re-certify the rest of the product.


### Bounded scraper improvement checkpoint

Development continues from the verified PR #238 deployment after the owner's request. The existing cron, lease, 12-probe/35-second primary budget, 18-second employer budget and 50-second global budget are preserved. Read-only maintenance selection does not advance freshness. Primary Retry-After state and confirmed per-source persistence counters use the existing execution-summary field. The normal landing gains an accessible catalog entry; the actual component passed isolated mobile/desktop overflow, focus, target-size and keyboard-activation checks. [PR #239](https://github.com/jcv86/main/pull/239) is the final exact-commit CI/publication record: reviewed head `e85294fd753ff6a4c510755b4687380e0ce6201d`, reviewed tree `7181105474831cf823745fa971b6ef1a95b55582`, squash merge `4c0322a929b51aa79dc9c3acce4225032d661b49`, production `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN` READY at 22:17:29.612 UTC. All 10 workflows and clean CI/Vercel builds passed. The new link was used in the authorized production session and reached the 32-opportunity Metropolitana catalog. Seven anonymous checks passed at 22:18:56 UTC. The unavailable auxiliary profile produced two sanitized diagnostics; no zero-error claim is made. Until its next natural executions are observed, DTC-A4-S02 remains in_progress.

Operational fallback for this improvement is the verified PR #238 deployment `dpl_46FMoqfXDGfcgnSCGmunbQYx3H3m` / main `79ec6b6111a501d5feef8ee71663121efeb4d517`. Existing rows and additive execution-summary metadata remain readable by that application. This work does not re-score or re-certify unrelated product areas.

### Post-publication inventory confirmation — 2026-10-07, 22:18:52 UTC

Read-only DTCFINAL aggregates reconfirm 90 Chiletrabajos rows / 24 fresh, 14 Greenhouse / 14 fresh, 6 Lever / 6 fresh and 0 Get on Board: **110 stored / 44 verified within 24 hours**. Slot `165871` remains the latest completed execution, with 32 upserts and zero invalidations/rejections; the catalog increased from the pre-run baseline of 78 to 110, supporting **32 net-new stored rows from that earlier run**. No additional native execution is attributed to PR #239. Expected next native observations are Coderio/PagerDuty at **2026-10-08 00:15 UTC / October 7 21:15 Chile** and Fintual/Cabify at **October 8 03:15 UTC / 00:15 Chile**. These are scheduled targets, not completed-run claims. This documentary update does not run or retry cron, change leases, alter production data, or merge/deploy another code release.

### Search, result navigation and canonical context closure candidate — 2026-10-07

| ID | Acceptance outcome | Evidence at this checkpoint | State |
|---|---|---|---|
| DTC-A4-A02 | Users can explore current offers without overwriting their saved search, navigate all matching pages within the consulted catalog and see truthful journey context | Candidate `codex/a4-final-closure-20261007` from main `4c0322a`: explicit GET exploration, independent saved view, applied-filter labels, 18-item pagination with inventory fingerprint, recoverable errors, atomic owner-scoped primary saves and canonical descriptive A1/A2/A3 context. 357 focused synthetic regressions and isolated 390px/1440px Chromium checks pass; the local complete build passed before the final one-case A3 transport guard. Exact candidate CI, publication and real authorized read-only navigation remain the release gate. | `in_progress` |

This candidate also repairs pre-limit expiration/publication filtering in catalog and maintenance reads. Regressions establish that expired prefixes no longer hide the next valid candidate, and future Get on Board vacancies cannot enter the current catalog. The actual TEXT date columns are handled with Chile date semantics and conservative legacy parser fallback. A full 500-row read is explicitly a bounded consulted set.

The Radar no longer derives its active-page context from missing auxiliary profile tables. Existing completed records have owner-scoped, explicit provenance and independent availability. Its upper training indicators exclude absent or invalid scores and hide incomplete totals; `[null, '', 80]` yields 80/100 from one valid session, and `count=1001/data=1000` produces unavailable KPIs while retaining a usable Radar. Neither completion nor a declared target role becomes a readiness score or skill claim.

Read-only DTCFINAL at **22:51:53.179569 UTC** still shows **110 stored / 44 fresh** and the earlier completed slot `165871`; there are no additional stored rows attributable to this candidate. The six-employer rotation, Get on Board's upcoming primary visit and the new native maintenance/cooldown/persistence observations remain pending on their natural schedule. No manual cron, retry, lease, production data, account, schema, RLS, environment or credential mutation is part of this verification.

The new candidate's rollback baseline is verified PR #239 production `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN` / main `4c0322a929b51aa79dc9c3acce4225032d661b49`; existing rows and schema remain compatible. It does not re-score or re-certify unrelated DTC closure items.
