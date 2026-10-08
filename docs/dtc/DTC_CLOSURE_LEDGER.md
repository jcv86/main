# DTC closure ledger — canonical

Last full product closure: 2026-09-20 UTC. Latest scoped A4 production evidence: 2026-10-08 03:41:53 UTC.

This is the **single canonical closure ledger** for Despega Tu Carrera. Historical detail remains available in Git history; this file keeps the current release state and only the evidence that still matters for closure decisions.

A status is `verified` only when there is observable evidence. Allowed states: `in_progress`, `verified`, `deferred_by_user`. A green CI run is evidence, but it is not treated as a substitute for a live check when the acceptance criterion explicitly requires one.

## Last verified production checkpoint

Dated sections below preserve their historical status; this checkpoint and the final publication section state the current scoped result.

- Repository: `jcv86/main`
- Canonical branch: `main`
- Verified application code: [PR #242](https://github.com/jcv86/main/pull/242) merge `172a09b94e266084c9d79be235053893db5ef549`, exact reviewed/deployed tree `1e5a41e906216e33a121c89f0cf62cf2d2d6b086`, including PR #241 source-content and matching improvements
- Verified production deployment: `dpl_JDvrrvfSwMdmghUionzASdAsEyDU` (READY, 2026-10-08 03:35:24.835 UTC / 00:35:24.835 Chile); final authenticated canonical-domain observation at 03:41:53 UTC
- Production domains: `despegatucarrera.com`, `www.despegatucarrera.com`
- Supabase production project: DTCFINAL `dcfrbwxbejtbcouionna`
- Latest scoped production evidence: PR #242 final tree passed 542 focused synthetic regressions and 10/10 exact-head CI workflows; 10/10 anonymous checks completed at 03:37:04.913 UTC. The authorized 03:41:53 UTC journey rendered 93 unique all-region offers (47 Chiletrabajos / 26 Greenhouse / 20 Lever), correct filtered search reasons, complete available details and preserved pagination/saved-view state. Q01 is verified for content/matching/detail UI; the five personal sources were empty, so P01 remains in_progress without a positive CV/DTC/offer path. Read-only DTCFINAL at 03:22:24.699865 UTC had 153 stored (152 active + 1 stale) / 93 fresh. Its earlier slot 165873 produced 34 confirmed upserts and 1 invalidation, with 32 net-new stored rows since 121/59; none are attributed to this later publication. S01/S02 remain in_progress. The 03:35:24.835–03:42:20 UTC runtime aggregate returned 0 groups; 38 browser-extension console records were separately classified, with no DTC errors observed in that set. Independent scoped verdict: CONDITIONAL_GO. Historical evidence retains its original scope and dates.

## Closure matrix

| ID | User outcome | Current evidence | Status | Release blocker |
|---|---|---|---|---|
| DTC-C01 | Production and canonical code contain the approved release | Owner-authorized PR #241/#242 publication is observed: main `172a09b` has exact reviewed tree `1e5a41e`, production `dpl_JDvrrvfSwMdmghUionzASdAsEyDU` became READY at 03:35:24.835 UTC and the authenticated canonical-domain journey was observed at 03:41:53 UTC | `verified` | yes |
| DTC-C02 | Signed-in users can save and resume C1/A1 | Approved authenticated production QA previously proved C1/A1 save-refresh-resume, all 28 A1 answers persisted, C2 saved 8 answers, integral report rendered and transition reached A2 | `verified` | yes |
| DTC-C03 | Pilot invitation / returning OAuth continuity remains reliable | Live production evidence on 2026-09-20 verified scanner-safe GET, single-use claim semantics, Google OAuth on the exact current release, returning access without a new invitation, logout invalidation, browser-Back unable to restore protected content, stale-OAuth-state recovery, clean Google re-entry and canonical journey resume | `verified` | yes |
| DTC-C04 | Browser/server data access is least-privilege and owner-bound | DTCFINAL now has 369 public tables with **0 RLS-disabled tables**; 20/20 public views use `security_invoker=true`; 0 `SECURITY DEFINER` functions are executable by `anon`; only intentional `complete_a2_mission(uuid,jsonb)` is executable by `authenticated`, checks `auth.uid()`, and has empty `search_path`; OAuth creation trigger remains active | `verified` | yes |
| DTC-C05 | Production build is reproducible | The final PR #242 application tree passed 542 focused synthetic regressions, full quality gate/TypeScript/build and 10/10 exact-head CI workflows after synchronization; exact-tree production is READY. Historical PR #239 local font failures and later successful clean builds retain their own release records | `verified` | yes |
| DTC-C06 | Users see one coherent DTC product, not test/internal surfaces | Route-authentication contracts, laboratory-bypass retirement and public credibility gates pass; `/demo` is 404 in final production; sitemap/FAQ/public CTAs expose the intended product surfaces | `verified` | yes |
| DTC-C07 | Core journey is usable on desktop/mobile with recovery states | Authenticated production QA exists for C1/A1/A2/A3/A4 evidence paths; isolated browser gates use real Auth/JWT/PostgREST/RLS and exact 390×844 plus desktop coverage; cross-owner access is denied; Spanish 404 recovery is live | `verified` | yes |
| DTC-C08 | Scores, progress, limitations and next action are truthful | Report evidence contract passes 103 cases; A1 professional report contract passes populated/partial/invalid/empty/tied/legacy/provenance cases; A2/A3/A4 continuity and limitations are covered by evidence-aware gates | `verified` | yes |
| DTC-C09 | Public launch surfaces are credible and crawlable | #176/#177 cleaned unsupported pricing, ratings, guarantees, institutional claims, SLA, Schema.org, FAQ, manifest, sitemap and crawler/LLM context; live FAQ canonical + FAQPage JSON-LD verified; empty legacy library is noindex and absent from sitemap | `verified` | yes |
| DTC-C10 | Operators can diagnose failures without leaking assessment data | Request correlation/redacted-failure contracts pass. After PR #242 READY, the project runtime aggregate returned 0 error groups for 2026-10-08 03:35:24.835–03:42:20 UTC, including the authenticated journey. All 38 reviewed browser-console records originated from an extension content script, with 0 DTC application errors observed in that set; this is not a console-wide or ongoing zero-error claim. Earlier runtime windows retain their historical deployment scope | `verified` | no |
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
| DTC-A4-S01 | The Radar includes current public employer vacancies relevant to Chile, with reliable verification and isolated source failures | Native slots 165871–165873 cover all six registered employer boards. Slot 165873 completed success/ok with 34 upserts / 1 invalidation; the 03:22:24.699865 UTC baseline has 153 stored / 93 fresh, 32 net-new stored rows since 121/59. At 03:41:53 UTC the final published UI rendered all 93 unique cards: Chiletrabajos 47, Greenhouse 26, Lever 20. This is browser evidence for the existing inventory, not a new ingestion. Coderio remains partial with three rejections and only a first recorded failure code; the Get on Board natural primary visit remains unobserved at this cutoff. | `in_progress` |
| DTC-A4-A01 | An explicitly authorized pilot can open A4 consistently while keeping real A1–A3 progress | Existing temporary entitlement renewed for 30 days, without completion or assessment writes. PR #238 final candidate `c63e058` passed 25 permission + 14 availability regressions, full build and 14 CI workflows; merge `79ec6b6` is production READY. Authorized normal entry, report and catalog were verified at 21:45–21:46 UTC. Real A1–A3 progress and saved search remain unchanged; unavailable profile data is explicit. | `verified` |
| DTC-A4-S02 | Freshness maintenance, fair bounded employer coverage and truthful per-source persistence | Native slots 165872 and 165873 each selected/probed 3 maintenance candidates. Slot 165873 confirms primary upserts 11 / invalidations 1 and Fintual/Cabify upserts 12/11, with successful persistence and empty cooldown maps. All six employer boards have now had a natural visit; the current catalog retains 60 rows older than 24h, including 1 stale row whose verification date was not advanced. Get on Board, a real cooldown-trigger/recovery cycle and large-board rotation across visits remain unverified. The bounded maintenance policy does not promise every older row will be refreshed within 24h. | `in_progress` |
| DTC-A4-Q01 | Offers retain useful source content and explain why they appear without inventing qualifications or candidate affinity | PR #241/#242 final production tree `1e5a41e` is published. Authorized 03:41:53 UTC acceptance observed real useful complete available descriptions, correct exact-role/region/mode search reasons, offer details opened by click and preserved through pagination, Enter activation of the source-summary disclosure, 93 unique all-region cards and saved-view independence. Legacy requirements/skills may remain explicitly unidentified. This verifies the content/matcher/detail UI scope, not native histogram execution, retroactive structured-field coverage or new ingestion. | `verified` |
| DTC-A4-P01 | Every personal recommendation explains its relationship to DTC, the CV, current preferences and the actual offer, with evidence, uncertainty and a next action | PR #242 is published on exact tree `1e5a41e`; 96 personal checks and all 542 focused regressions, independent review, isolated UI and 10/10 exact-head CI passed. The real authorized session showed all five personal sources empty, no dates and zero support disclosures, with truthful search-only guidance. The CV action href was inspected but not followed. The positive real CV/DTC/offer path remains unobserved and requires a legitimate structured A3 CV plus relevant persisted DTC evidence; empty context is not full P01 acceptance. | `in_progress` |

### A4 publication checkpoint

- **Initial collector publication:** after user authorization on 2026-10-07, PR #236 merged and deployment `dpl_FFvpPvdufqrMyjUB3uWPahJbE2Vd` served the exact reviewed application tree `723643040e2fcbf7ed1d095d88c83e5b25c130c7` on the canonical domain. PR #238 subsequently repaired normal A4 access; the current PR #240 production identity is identified above.
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

### Search, result navigation and canonical context closure — 2026-10-07

| ID | Acceptance outcome | Evidence at this checkpoint | State |
|---|---|---|---|
| DTC-A4-A02 | Users can explore current offers without overwriting their saved search, navigate all matching pages within the consulted catalog and see truthful journey context | Published PR #240 main `8b776e9`, exact tree `073793e`, production READY at 23:06:27.882 UTC. 357 focused synthetic regressions, 10/10 CI and isolated 390px/1440px Chromium checks pass. Authorized production GET journey verified 18→32 Metropolitana and 18→36→44 all-region cards, unique URLs, saved-view independence, draft/applied filters and descriptive canonical context. No real QA save POST was made; explicit primary-save and concurrency behavior is scoped to synthetic/isolated tests. | `verified` |

This candidate also repairs pre-limit expiration/publication filtering in catalog and maintenance reads. Regressions establish that expired prefixes no longer hide the next valid candidate, and future Get on Board vacancies cannot enter the current catalog. The actual TEXT date columns are handled with Chile date semantics and conservative legacy parser fallback. A full 500-row read is explicitly a bounded consulted set.

The Radar no longer derives its active-page context from missing auxiliary profile tables. Existing completed records have owner-scoped, explicit provenance and independent availability. Its upper training indicators exclude absent or invalid scores and hide incomplete totals; `[null, '', 80]` yields 80/100 from one valid session, and `count=1001/data=1000` produces unavailable KPIs while retaining a usable Radar. Neither completion nor a declared target role becomes a readiness score or skill claim.

Read-only DTCFINAL at **22:51:53.179569 UTC** still shows **110 stored / 44 fresh** and the earlier completed slot `165871`; there are no additional stored rows attributable to this candidate. The six-employer rotation, Get on Board's upcoming primary visit and the new native maintenance/cooldown/persistence observations remain pending on their natural schedule. No manual cron, retry, lease, production data, account, schema, RLS, environment or credential mutation is part of this verification.

The new candidate's rollback baseline is verified PR #239 production `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN` / main `4c0322a929b51aa79dc9c3acce4225032d661b49`; existing rows and schema remain compatible. It does not re-score or re-certify unrelated DTC closure items.

### Post-publication verification — PR #240, 2026-10-07

The owner-authorized search/context closure is published. This follow-up records actual production observations; it does not initiate another application-code merge or production deployment.

| Identity | Verified value |
|---|---|
| Reviewed PR / head | [PR #240](https://github.com/jcv86/main/pull/240), `1461739c800dee09e00b6773413f7f0db3202387` |
| Reviewed and merged tree | `073793eb9500723a122de9519a29e5ec9b583c94` |
| Current main / squash merge | `8b776e9c171ec0c755fd3829b19bca804e8e74f8`, merged 2026-10-07 23:03:33 UTC |
| Production deployment | `dpl_957qm7APiGXMd1MguMWSZxoZSn14` |
| Production READY | **2026-10-07 23:06:27.882 UTC / 20:06:27 Chile** |
| Canonical domain | `https://www.despegatucarrera.com`; connector resolved the same deployment and commit at 23:06:53 UTC and reconfirmed the identity at 23:13 UTC |
| Rollback baseline | PR #239 main `4c0322a929b51aa79dc9c3acce4225032d661b49`, deployment `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN` |

**Release gates.** All **357 focused synthetic regressions** and full TypeScript passed. The exact final candidate passed **all 10 CI workflows**, including the [A4 engine / isolated PostgreSQL lease gate](https://github.com/jcv86/main/actions/runs/37699435032), [A4 review UX](https://github.com/jcv86/main/actions/runs/37699434988), [clean production build](https://github.com/jcv86/main/actions/runs/37699434992) and [A1 isolated Auth/browser gate](https://github.com/jcv86/main/actions/runs/37699435035). The earlier local build timing and the final transport-guard regression are preserved in the candidate record. Preview `dpl_4Xg2475vPh6iQYwLCow72zTZBo29` and the exact-tree production build both became READY. Final pre-merge reads confirmed the expected main, clean/mergeable PR, reviewed head/tree and completed checks. The merged tree was read back independently. No preview-protection bypass was used.

**Authenticated production journey.** The authorized session entered normal A4 and followed **Explorar oportunidades** to `https://www.despegatucarrera.com/despega/a4/job-matching`. The landing displayed descriptive existing journey records and honest unavailable scores. Its active context no longer depended on the missing auxiliary profile relation.

- Metropolitana exploration loaded **18 → 32 of 32** real cards: 12 Chiletrabajos, 14 Greenhouse and 6 Lever, with **32 distinct original URLs**.
- **Mi búsqueda guardada** independently showed its current no-matches state. Switching back preserved it; no real save POST was performed.
- **Limpiar filtros** changed the draft to all regions, while the displayed results retained the applied Metropolitana label and count until **Ver ofertas** was used.
- All-region exploration then loaded **18 → 36 → 44 of 44** real cards: **24 Chiletrabajos, 14 Greenhouse and 6 Lever**, with **44 distinct original URLs**. This is observed rendered production content, separately verified from SQL counts.
- The page was left open with the 44 results loaded. A production screenshot was delivered privately to the owner. Personal identifiers, criteria and journey values are omitted from this public record.

The live checks used ordinary navigation and GET exploration only. Explicit primary-save behavior and concurrency were verified with synthetic/isolated tests, not by changing a production search. Mobile/desktop recovery, focus, layout and accessibility scope remain as documented in the candidate evidence.

**Anonymous boundary and runtime.** Ten anonymous GET checks passed between **23:06:52.160 and 23:07:19.631 UTC**: home and live/ready health returned 200; four protected APIs returned 401; the three A4 APIs returned private/no-store; both A4 pages redirected to signin with the intended return path; the apex redirected to www. Vercel project `runtime_errors` returned no groups since this release's READY time. Exact-deployment production `runtime_logs`, filtered to warning/error/fatal with limit 20, returned no records for **23:06:27.882–23:13:52.088 UTC**. This is a bounded initial window, not a perpetual zero-error claim. Earlier PR #239 auxiliary-profile diagnostics retain their historical deployment identity.

**Read-only DTCFINAL evidence at 2026-10-07 23:10:13.712436 UTC / 20:10:13 Chile.**

| Source | Stored status | Stored rows | Verified within 24 hours |
|---|---|---:|---:|
| Chiletrabajos | `verified_active` | 90 | 24 |
| Greenhouse | `verified_active` | 14 | 14 |
| Lever | `verified_active` | 6 | 6 |
| Get on Board | No rows | 0 | 0 |
| **Total** | | **110** | **44** |

The aggregate covers every stored source/status. Freshness requires `observed_at - 24 hours <= last_verified_at <= observed_at`; no future verification is counted. The 66 older Chiletrabajos rows remain outside the current 24-hour catalog.

Only two A4 execution rows exist. Slot `165871` is still the latest: start **21:15:00.909321 UTC**, completion **21:15:07.636 UTC**, `success/ok`, 6,727 ms, **32 upserts / 0 invalidations / 0 index rejections**. Chiletrabajos-Valparaíso discovered 30 and probed/returned 12 active vacancies, without failure or exhausted budget. Checkr (`greenhouse:chile`) received/accepted/returned **14/14/14**, excluding/rejecting zero. APPLY Digital (`lever:applydigital`) received **23**, accepted/returned **6**, excluded **17** and rejected zero. Both employer snapshots were complete; source errors were absent and employer cooldowns empty.

The pre-run 78-row catalog increased to 110, supporting **32 net-new stored rows from that earlier native execution**. An upsert by itself can be an insert or update. No additional ingestion is attributed to PR #239 or PR #240, and the earlier 47-offer public smoke was not an insertion. New primary persistence/cooldown fields remain absent on this pre-improvement run. Slot `165870` remains the earlier consumed Santiago execution with 12 upserts.

**Remaining native acceptance.** `DTC-A4-A01` remains verified and `DTC-A4-A02` is verified for the published read-only exploration, navigation, saved-view separation and truthful context, with save behavior scoped to its synthetic tests. `DTC-A4-S01` and `DTC-A4-S02` remain **in_progress**. Expected next observations are:

| Native slot | Primary / employers | UTC target | Chile target |
|---|---|---|---|
| 165872 | Chiletrabajos-Concepción / Coderio and PagerDuty | Oct 8 00:15 | Oct 7 21:15 |
| 165873 | Chiletrabajos-Antofagasta / Fintual and Cabify | Oct 8 03:15 | Oct 8 00:15 |
| 165874 | Chiletrabajos-Puerto Montt / Checkr and APPLY Digital | Oct 8 06:15 | Oct 8 03:15 |
| 165875 | Get on Board programming / Coderio and PagerDuty | Oct 8 09:15 | Oct 8 06:15 |

These are scheduled targets, not successful-run claims. Native effects of maintenance, cooldown persistence, fair coverage and per-source write counters require their natural visits. The three-known-offer maintenance cap per region cannot promise to refresh all 66 older rows within 24 hours.

All Supabase operations in this check were read-only and restricted to DTCFINAL `dcfrbwxbejtbcouionna`; no profiles, evaluations, personal data or offer source payloads were retrieved through SQL. No manual cron, retries, lease/schedule/schema/RLS/environment/credential or account changes were made. This checkpoint does not re-score or re-certify unrelated DTC areas.

## Native ingestion follow-up — 2026-10-08, 01:23 UTC

The connector reconfirmed main `8b776e9c171ec0c755fd3829b19bca804e8e74f8`, tree `073793eb9500723a122de9519a29e5ec9b583c94`, and canonical production `dpl_957qm7APiGXMd1MguMWSZxoZSn14` READY. The scoped Vercel runtime-error query since **2026-10-08 00:14 UTC** returned no groups at this checkpoint. That query does not turn the following partial scheduler execution into a success.

**Native slot 165872** started **2026-10-08 00:15:01.081795 UTC / October 7 21:15 Chile** and completed **00:15:05.353 UTC**, in **4,272 ms**. Its durable state is **failure / partial**, success false: **15 confirmed upserts, 0 invalidations, 0 index rejections**.

| Source / board | Received or discovered | Probed or considered | Accepted / returned | Excluded | Source records rejected | Confirmed upserts | Result |
|---|---:|---:|---:|---:|---:|---:|---|
| Chiletrabajos — Concepción | 30 discovered | 12 probed | 12 / 12 | 0 irrelevant | 0 parse failures | 12 | ok |
| Lever — Coderio (`lever:coderio`) | 17 | 17 | 2 / 2 | 12 | 3 | 2 | partial, `missing_description`, incomplete snapshot |
| Greenhouse — PagerDuty (`greenhouse:pagerduty`) | 51 | 51 | 1 / 1 | 50 | 0 | 1 | ok, complete snapshot |

Employer considered counts in this historical run are reconstructed as accepted + excluded + rejected; the new versioned field is not yet deployed. The primary run recorded **maintenance_selected 3 / maintenance_probed 3 / maintenance_selection_status ok**. Primary persistence was `ok`, with 12 upserts; both employer persistence results were `ok`. Primary and employer cooldown maps were empty. Chiletrabajos reported no stale, unavailable, irrelevant or parse-failed probes and no exhausted budget. Coderio's three source-format rejections are distinct from the zero index-persistence rejections.

The production implementation recorded Coderio's generic source error as `PROVIDER_UNAVAILABLE`. Its more specific board diagnostic, `missing_description`, is the evidence for the partial result. One bounded, read-only public Lever check at **01:27:47 UTC** received 17 records and confirmed that some have all documented description/opening/body/additional fields and lists empty. Only field-presence/length diagnostics were retained. Salary-description fields are not a replacement for a job description, and empty records remain rejected. This check did not ingest any jobs.

**DTCFINAL aggregate at 2026-10-08 01:23:51.848222 UTC**, using only source/status/freshness aggregates:

| Source | Stored status | Stored rows | Verified within 24 hours |
|---|---|---:|---:|
| Chiletrabajos | verified_active | 98 | 36 |
| Greenhouse | verified_active | 15 | 15 |
| Lever | verified_active | 8 | 8 |
| Get on Board | no stored rows | 0 | 0 |
| **Total** | | **121** | **59** |

Fresh means `observed_at - 24 hours <= last_verified_at <= observed_at`. The previous 110 / 44 checkpoint increased to **121 / 59: 11 net-new stored rows and 15 additional fresh rows**. By source the net increases are Chiletrabajos +8, Greenhouse +1 and Lever +2. Fifteen upserts are not fifteen inserts. The 62 older Chiletrabajos rows remain outside the 24-hour catalog.

This is now native evidence of the three-offer maintenance selection/probe path and confirmed per-source persistence. It does not establish every cooldown branch or complete coverage of all sources. Checkr and APPLY Digital retain their earlier successful slot 165871 evidence (14 and 6 saved respectively). Coderio is partial; Fintual/Cabify and the Get on Board primary visit remain pending on their natural schedule: **October 8 03:15 UTC / 00:15 Chile**, and **09:15 UTC / 06:15 Chile**, respectively. DTC-A4-S01 and DTC-A4-S02 remain **in_progress**. No new browser rendering claim is derived from these SQL counts.

All live Supabase operations in this follow-up were read-only and restricted to DTCFINAL `dcfrbwxbejtbcouionna`. No profiles, evaluations, personal data or `source_payload` were retrieved through SQL. No manual cron, forced retry, lease, schedule, production data, account, schema, RLS, environment or credential mutation was performed.

### Stored-content baseline — 2026-10-08, 01:45 UTC

A second read-only aggregate at **01:45:52.143582 UTC** reconfirmed the same **121 stored / 59 fresh** catalog and the same latest slot 165872. It also measured existing structured fields, without retrieving their contents:

| Source | Fresh rows | With stored requirements | With stored skills | With stored work mode |
|---|---:|---:|---:|---:|
| Chiletrabajos | 36 | 0 | 0 | 7 |
| Greenhouse | 15 | 0 | 0 | 15 |
| Lever | 8 | 5 | 0 | 8 |
| **Total** | **59** | **5** | **0** | **30** |

This measures presence in existing columns, not whether the original description contains useful requirements. It motivates the candidate's source-backed enrichment. No improvement in these production aggregates is attributed to unmerged candidate code.

## Catalog quality candidate — 2026-10-08

The owner requested the next scraper improvement. Branch `codex/a4-catalog-quality-20261008` starts from published main `8b776e9c171ec0c755fd3829b19bca804e8e74f8` / tree `073793eb9500723a122de9519a29e5ec9b583c94`. Its exact commit, CI and preview evidence are recorded in its PR. This section describes candidate behavior and does not claim a new production deployment or native ingestion.

### Source-backed content

- A shared deterministic reader preserves visible paragraphs, list items and section boundaries, removes hidden/executable/ad content, and quotes explicit requirement clauses. It keeps recognized Spanish/English qualification sections separate from benefits and unrelated sections, including provider fields rendered as HTML.
- Skills come from source-declared skill fields or a reviewed literal vocabulary found in qualification clauses. Negated clauses are checked before splitting lists. Missing fields do not create qualifications or candidate-fit scores.
- Current work modes require explicit source fields or current statements. Conditional salary boilerplate, historical experience, temporary/unsupported modes, negations and contradictions remain unknown. Source normalizers align the legacy remote boolean with the resolved work mode.
- New writes use existing description/requirements/skills/work_mode columns. Catalog reads can enrich requirements and skills from existing visible text without writes or source-payload reads. An existing null work mode is preserved because it can represent a lost upstream contradiction; filling it requires a new source observation. A deployment alone does not refresh an offer.
- The text budget is 200,000 input characters, 40,000 visible characters, 500 nonempty lines, 2,000 clause delimiters and 2,000 HTML elements. Over-budget descriptions are never truncated through a negation. Employer/Get on Board format diagnostics identify oversized descriptions; an unreadable legacy description cannot retain newly certified modality evidence.
- Empty Coderio descriptions remain rejected. Documented opening/body/additional fields are supported, but salary text is not substituted for vacancy content.

### Matching and user-visible detail

The same evaluator determines inclusion, relevance order and the reasons displayed by the client. It supports 22 reviewed ES/EN role-equivalence groups and preserves qualifiers. Exact-title mode keeps its phrase constraint; translations apply to broader modes. Region and mode filters remain mandatory. Word boundaries avoid category collisions such as UX inside auxiliar and sales inside Salesforce.

Results rank direct title, equivalent, related role and selected/expanded area before the existing stable verification/source/id tie-break. The 18-row pagination snapshot includes the ordered public DTO, filters, view and consulted scope, so content or explanation changes invalidate the page even when verification time is unchanged. The consulted-inventory limit remains 500.

Each card shows server-issued reasons and a native expandable detail with the complete available description, requirements, skills, source fragments and original link. Unknown values remain explicit. The detail stays open when more cards are appended. A real mobile overflow found with a valid 200-character role was fixed with a minimal flex-width correction.

### Bounded operational diagnostics

Employer summaries now version their counters and record considered, not-considered and deferred eligible records, plus fixed-code exclusion/rejection histograms. The counts reconcile: considered = accepted + excluded + rejected; received = considered + not considered; accepted = returned + deferred eligible. The returned-content coverage counts requirements, skills and mode presence across Chiletrabajos, employers and Get on Board. It does not measure completeness, candidate affinity or persistence.

A partial board caused by known rejected source records reports SOURCE_DATA_PARTIAL; transport failures remain PROVIDER_UNAVAILABLE. Partial snapshots still cannot retire absent offers. Confirmed persistence remains separate from source acceptance. Request/page/record/time budgets, allowlisted boards, source rotation, freshness, cron, leases and cooldown semantics are unchanged.

### Validation scope

The candidate is exercised by the existing provider, matching, index, scheduler, access and search regressions and the new `test:a4-catalog-quality` suite, which is wired into the A4 CI workflow. Synthetic tests cover text provenance, negations/contradictions, section roundtrips, complexity limits, counted rejection reasons, unchanged persistence boundaries, public projection and full expandable detail.

The isolated browser renders the changed pages, shell, components, matcher, CSS and local fonts with synthetic authentication/API/Supabase adapters. At 390×844 and 1440×1000 it verifies 18→36→40 unique results, exact server labels, role equivalence, complete available text, requirement 9 and skill 13, native keyboard activation, 44px targets, focus and no horizontal overflow, including a 200-character role. Retry, inventory-change, expired-session, empty and partial-context states pass. No external request or page error was recorded. Axe reported zero violations in the reviewed scope, with aria-prohibited-attr and color-contrast incomplete; this is not a complete accessibility certification. The synthetic save check is not a production save.

An adversarial 500-row in-memory read with dense descriptions originally took 31,486 ms. The final independent check, including the preserved rejection signal and negative-mode assertions, took 1,161 ms; 500 typical synthetic descriptions had measured 656 ms. These are local measurements, not a production latency claim.

DTC-A4-Q01 remains in_progress until this candidate's publication and relevant live acceptance are observed. DTC-A4-S01/S02 retain the native limitations above. Salary/schema additions, more providers, a larger inventory query, cross-source deduplication and application-outcome tracking are outside this block. This candidate-preparation checkpoint does not merge to main or deploy production code.


**Integrated candidate gate:** all **441 focused regressions** passed (138 opportunity/provider/matching/refresh, 88 employer/index/refresh, 41 Get on Board/routes, 61 new quality checks, 74 journey/search, 25 A4 access, 14 profile-availability). Full TypeScript, critical contracts, both source-contract scripts, scoped ESLint and the production build passed. The build retained the existing Supabase Edge-import and outdated Browserslist warnings; no dependency or environment change was made to suppress them. The independent review closed its 22 focused reproductions with GO; the isolated UI gate also returned GO. Exact remote commit/CI evidence is maintained in the candidate PR.

## Personal orientation candidate — 2026-10-08

**Outcome DTC-A4-P01.** The owner confirmed that the Radar must explain recommendations using the person's DTC work and analysis, CV and current search preferences, tied to actual offer evidence. The acceptance contract is [DTC_A4_PERSONAL_ORIENTATION.md](DTC_A4_PERSONAL_ORIENTATION.md). Implementation owner: DTC application work; skills: `dtc-build-experience` and `dtc-supabase-backend`; verification owner: `dtc-quality-gate`. Dependency: source-content and matching candidate PR #241, head `f6259b72cdba808d5004c335895fd02855c995d7`, tree `d07436567787cab31fdd6be7fdbe50d8bb467991`.

The new branch `codex/a4-personal-orientation-20261008` is independent of other active work. Before publication of this candidate PR, connector reads reconfirmed PR #241 open, main `8b776e9c171ec0c755fd3829b19bca804e8e74f8` and canonical production `dpl_957qm7APiGXMd1MguMWSZxoZSn14` READY on that main SHA. Exact candidate commit/tree, CI and preview observations belong to its PR record. A preview is not a production release.

### Private context and personal evidence

Five bounded, owner-filtered reads use the authenticated SSR client, with `auth.getUser()` identity validation before personal access. Live SQL was limited to DTCFINAL `dcfrbwxbejtbcouionna` schema, RLS, SELECT grants and timezone metadata. The four existing relations are `career_identities`, `a1_cerebral_assessment`, `career_evidence` and `a3_module_completion`; all have owner-read policies and RLS enabled. No personal records were inspected through SQL.

The selected CV fields are the structured A3 skills, experience title and achievements. Target roles remain goals. A1 supplies canonical self-reported situational preferences for preparation, never aptitude or ranking scores. Validated A2 mission submissions remain recorded exercises. A3 Value Mining Lab descriptions of past work are explicitly declared experience. Generic module completion, DISC scores and aspirational text cannot become demonstrated skills.

The server retains bounded source clauses and dates, rejects invalid/future/expired records, and separates available, empty, partial and unavailable sources. The API returns only the summary and references actually used for visible guidance. No full CV, full response set, unrelated personal evidence or offer source payload is exported. Context is private/no-store and is not cached between requests.

### Search, explanation and recovery

Current filters continue to control inclusion and the primary relevance order. Visible, distinct supported topics may break ties within the same search relationship; repetition does not increase weight. Goals and A1 contribute no topic count. No fit or employability percentage is produced, and missing evidence does not remove offers or assert missing ability.

Each card shows reasons, requirements to confirm, a next step and a closed native disclosure with personal/source excerpts, their nature and Chile-time dates. Level, years, certification and conditions remain to confirm when only the topic is supported. Source links use exact reviewed DTC routes and retain destination access guards. A context refresh is a GET of the existing results API, not an ingestion or saved-search write.

The pagination snapshot includes owner, relevant personal revision, filters and ordered public results. A changed CV, evidence or source availability cannot append a page from an older context. Unavailable personal sources keep the verified catalog usable; session expiry removes personal support from the visible UI.

### Candidate evidence and remaining acceptance

**542 focused regressions passed:** 138 opportunity/provider/matching/refresh, 88 employer/index/refresh, 41 Get on Board/routes, 61 catalog-quality/detail, 79 journey/search/API, 25 access, 14 profile-availability and 96 personal-context/orientation/UI cases (38 + 42 + 16). The two existing A4 source-contract scripts and scoped ESLint also pass. The A4 CI workflow now includes `test:a4-personal-orientation`.

Independent cross review returned GO after fixing and repeating concrete negation, multiline-list, indirect-attribution, skill-boundary and requirement-level cases. A3's nature was corrected using the actual writer prompts; reader→engine tests prove its displayed declared-experience wording. A2 canonical-reference reservation is a defensive parser safeguard, not a reported production incident.

The final isolated visual pass used the real page, components, matching/orientation engine, shell, styles and fonts with synthetic profiles and I/O. At **390×844 and 1440×1000**, it confirmed distinct guidance for two profiles, correct CV/A1/A2/A3 attribution, six pertinent support records, **18→36→40** unique cards with both disclosures preserved, keyboard/focus/44px controls, long-text layout, partial/empty/unavailable states and 503/409/401 recovery. It made zero external requests and recorded zero page errors. Axe detected zero violations; `aria-prohibited-attr` and `color-contrast` checks remained incomplete and are not claimed as a complete accessibility certification.

Full `quality:gate` passed: TypeScript, critical contracts, report contracts and the production build. Existing Supabase Edge-import and outdated Browserslist warnings remain classified separately. Exact remote head-specific checks are maintained in the PR. **DTC-A4-P01 remains in_progress** until production publication and the authenticated journey on that version are verified. This first release reads the structured A3 CV; automatic interpretation of other uploaded PDF/documents is outside its implemented boundary. No account data, RLS, schema, variables, credentials, schedules or leases were changed, no cron/retry was invoked, and no other PR was merged. The ingestion and other A4 criteria retain their separate recorded acceptance states.


## Native ingestion baseline before PR #241/#242 publication — 2026-10-08, 03:22 UTC

This checkpoint records a completed natural scheduler execution and its catalog aggregates. Its observation time is **2026-10-08 03:22:24.699865 UTC / 00:22:24.699865 Chile**. The code semantics were read from main `8b776e9c171ec0c755fd3829b19bca804e8e74f8`, the PR #240 application baseline: `lib/opportunities/refresh-lease.ts`, `employer-refresh.ts`, `refresh-catalog.ts`, the reviewed employer registry/normalizers, `verified-index.ts` and `vercel.json`. This run predates publication of PR #241/#242; neither their new diagnostics nor their personal-orientation behavior is claimed from it. The recorded production identity and browser evidence above retain their own observation times.

The existing durable execution relation is `public.cron_job_executions`, filtered to `job_name = 'a4-opportunities'`. The catalog relation is `public.a4_verified_opportunities`. The existing schedule is `15 */3 * * *` UTC, with one attempt per three-hour slot, a 120-second lease and a 50-second work budget. The read used explicit fixed summary fields and source/status/freshness aggregates; it did not retrieve arbitrary offer text or complete source payloads.

### Completed slot 165873

| Execution field | Observed value |
|---|---|
| Natural target | 2026-10-08 03:15:00 UTC / 00:15 Chile |
| Slot / primary scope | `165873` / Chiletrabajos — Antofagasta |
| Started | `2026-10-08T03:15:00.897341+00:00` |
| Completed / checked | `2026-10-08T03:15:05.576+00:00` |
| Recorded duration | **4,679 ms** |
| Durable status / outcome / success | **`success` / `ok` / `true`** |
| Execution error | `null` |
| Confirmed upserts / invalidations / index rejections | **34 / 1 / 0** |
| Source errors / primary cooldowns / employer cooldowns | `{}` / `{}` / `{}` |

| Source / board | Discovered or received | Probed | Active or accepted | Returned | Excluded | Source rejections | Confirmed upserts | Confirmed invalidations | Result |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Chiletrabajos — Antofagasta | 30 discovered | 12 | 11 active | 11 | 0 irrelevant | 0 parse failures | 11 | 1 | `ok`; 1 stale probe |
| Lever — Fintual (`lever:fintual`) | 13 received | not a primary probe metric | 12 accepted | 12 | 1 | 0 | 12 | 0 | `ok`, complete snapshot |
| Greenhouse — Cabify (`greenhouse:cabify`) | 68 received | not a primary probe metric | 11 accepted | 11 | 57 | 0 | 11 | 0 | `ok`, complete snapshot |

Chiletrabajos recorded **maintenance_selected 3 / maintenance_probed 3 / maintenance_selection_status ok**, with no maintenance failure. Discovery was `ok`; `candidate_limit_reached` was true and `budget_exhausted` false. Stale probes were 1; unavailable, irrelevant and parse-failed probes were all 0. Its failure code and retry-after were null. The primary persistence result was `ok`, with 11 upserts, 1 invalidation and 0 rejected rows. The stale observation is evidence of invalidation, not a new current verification.

Both employer persistence results were `ok`, with 0 invalidations and 0 index rejections. Fintual and Cabify each had null failure/retry-after fields and a complete snapshot. Their confirmed writes establish native persistence for the two previously unobserved boards. Received/accepted/excluded are collection counters; confirmed upserts are separate database-write counters. This historical implementation did not emit the new versioned considered/deferred/content-coverage histograms, so none are inferred here.

### Catalog at the exact observation time

| Source | Stored status | Stored rows | Verified within 24 hours | Older than 24 hours | Future verification |
|---|---|---:|---:|---:|---:|
| Chiletrabajos | `verified_active` | 106 | 47 | 59 | 0 |
| Chiletrabajos | `stale` | 1 | 0 | 1 | 0 |
| Greenhouse | `verified_active` | 26 | 26 | 0 | 0 |
| Lever | `verified_active` | 20 | 20 | 0 | 0 |
| Get on Board | no stored rows | 0 | 0 | 0 | 0 |
| **Total** | **152 active + 1 stale** | **153** | **93** | **60** | **0** |

Freshness is measured as `observed_at - 24 hours <= last_verified_at <= observed_at`. The aggregate includes every stored source/status; all 93 fresh rows at this cutoff are `verified_active`. It does not assert that every such row matches the current user's filters or was rendered in the browser.

| Source / status | Earliest `last_verified_at` UTC | Latest `last_verified_at` UTC |
|---|---|---|
| Chiletrabajos / active | `2026-09-20T22:13:12.751Z` | `2026-10-08T03:15:04.161Z` |
| Chiletrabajos / stale | `2026-09-20T22:13:12.751Z` | `2026-09-20T22:13:12.751Z` |
| Greenhouse / active | `2026-10-07T21:15:01.240Z` | `2026-10-08T03:15:01.287Z` |
| Lever / active | `2026-10-07T21:15:06.106Z` | `2026-10-08T03:15:02.346Z` |

Invalidation intentionally preserves the previous `last_verified_at`. The stale Chiletrabajos row therefore retains its old successful-verification date; the current negative observation does not make it fresh.

Against the **2026-10-08 01:45:52.143582 UTC** baseline of **121 stored / 121 active / 59 fresh**, the inventory now has **32 net-new stored rows**, **31 net additional active rows** and **34 additional fresh rows**. Source totals increased from 98 to **107 Chiletrabajos rows (+9, including the now-stale row)**, from 15 to **26 Greenhouse (+11)**, and from 8 to **20 Lever (+12)**. Get on Board remains 0. The **34 confirmed upserts are not 34 inserts**: an upsert can insert or update. The 32-row figure is the net stored-inventory difference between the two observations. Neither number derives from the earlier non-persisting 47-offer smoke.

### Prior execution continuity and remaining acceptance

The same bounded read retained these earlier completed executions; their results are historical and are not reruns:

| Slot | Start UTC | Completion UTC | Duration | Durable status / outcome | Confirmed upserts / invalidations / index rejections | Scope and employer result |
|---|---|---|---:|---|---|---|
| 165872 | `2026-10-08T00:15:01.081795Z` | `2026-10-08T00:15:05.353Z` | 4,272 ms | `failure` / `partial` | 15 / 0 / 0 | Concepción 12, Coderio 2, PagerDuty 1 |
| 165871 | `2026-10-07T21:15:00.909321Z` | `2026-10-07T21:15:07.636Z` | 6,727 ms | `success` / `ok` | 32 / 0 / 0 | Valparaíso 12, Checkr 14, APPLY Digital 6; employer snapshots complete |
| 165870 | `2026-10-07T19:35:07.917139Z` | `2026-10-07T19:35:11.296Z` | 3,379 ms | `success` / outcome absent | 12 / 0 / 0 | Earlier consumed Santiago slot; no employer batch recorded |

Coderio's slot 165872 remains a partial snapshot: 17 received, 2 accepted/returned, 12 excluded and 3 source records rejected. Its first recorded failure code was `missing_description`, with the old generic source error `PROVIDER_UNAVAILABLE` and durable execution error `PARTIAL_REFRESH`. That single failure code is not a per-rejection histogram and does not establish the reason for each of the three rejections. PagerDuty received 51, accepted/returned 1, excluded 50 and rejected 0. Primary and both employer persistence outcomes were `ok`, and maintenance selected/probed 3/3. Historical per-source persistence fields are absent for slots 165871/165870; absent fields are not manufactured as confirmed counters. This does not change the earlier catalog-growth evidence for slot 165871.

All six registered employer boards now have a native visit with confirmed stored-inventory evidence across slots 165871–165873; Coderio still has an incomplete source snapshot. **DTC-A4-S01 and DTC-A4-S02 remain `in_progress`.** The Get on Board primary visit remains unobserved at this cutoff, with its natural target **2026-10-08 09:15 UTC / 06:15 Chile, slot 165875**. Slot 165874's Puerto Montt / Checkr / APPLY Digital target is **06:15 UTC / 03:15 Chile**. These future targets are not successful-run claims. No actual cooldown-trigger/recovery cycle or large-board rotation across multiple bounded visits is established by the empty cooldown maps and these small accepted snapshots. The three-known-offer maintenance cap does not guarantee refreshing every older row within 24 hours.

The full user-facing source criterion still needs its relevant live acceptance; SQL totals and deployment READY alone do not close it. **DTC-A4-Q01 and DTC-A4-P01 are unchanged by this baseline.** Catalog-quality publication, personal support, current account evidence availability and the authenticated journey on the new version require their own observations. The stored-content presence counts measured at 01:45 remain historical; this 03:22 read did not remeasure requirement/skill/work-mode presence.

All Supabase access for this checkpoint was read-only and restricted to DTCFINAL `dcfrbwxbejtbcouionna`. No profiles, evaluations, personal records, arbitrary offer text or `source_payload` were retrieved. No manual cron, retry, lease/schedule change, production data write, account change, schema/RLS change, environment change or credential change was performed by the verification. These documentary copies do not publish code or certify unrelated DTC areas.


## Publication progression after the native baseline — intermediate record, 2026-10-08

**Historical intermediate state:** the final READY and browser observations in the last section below supersede this section's BUILDING/pending status.

The following identities were confirmed by the active release verification after the 03:22 UTC ingestion observation. They do not attribute slot 165873 to the later code. This intermediate documentary cut preserves the distinction between the completed #241 release and the still-pending final #242 deployment acceptance.

| Step | Confirmed identity / observation | Scope at this cut |
|---|---|---|
| PR #241 source-content and matching merge | [PR #241](https://github.com/jcv86/main/pull/241), squash `a1f6e03243fc2d6f614796f8d17c6fddfee58dda`, tree `d07436567787cab31fdd6be7fdbe50d8bb467991` | Merged after slot 165873 |
| PR #241 production | `dpl_Cr59jPuVQwdm2GWTYzJuQP8CcBuA`, READY `2026-10-08T03:29:26.573Z` | Nine of nine anonymous checks passed; the authorized session rendered the first 18 of 54 Metropolitana results on this version. This is not a 54-card rendering or a #242 personal-orientation check |
| PR #242 final candidate | [PR #242](https://github.com/jcv86/main/pull/242), synchronized head `8e7f50814980f0db1dd44e4a7e08fcd2e6602f51`, tree `1e5a41e906216e33a121c89f0cf62cf2d2d6b086` | Ten of ten head-specific CI workflows passed after retargeting; synchronization retained the reviewed application tree |
| PR #242 canonical merge | main `172a09b94e266084c9d79be235053893db5ef549`, tree `1e5a41e906216e33a121c89f0cf62cf2d2d6b086` | Merged; final production acceptance pending |
| PR #242 deployment | `dpl_JDvrrvfSwMdmghUionzASdAsEyDU` | `BUILDING` at the supplied release observation; no READY or canonical-domain acceptance is asserted by this intermediate record |

At this intermediate cut, final deployment and browser observations were pending, and **DTC-A4-Q01 and DTC-A4-P01 were `in_progress`**. The final checkpoint below supersedes that state; the runtime-log window was also pending at that intermediate point. The #241 initial 18-card observation does not close the complete quality criterion; it cannot establish personal evidence availability or the personal-orientation path. No later database observation, native execution, private CV content or personal account data is inferred from these release identities.

The provisional #241 browser observation found a real employer card with a useful complete available description while Requirements and Skills were explicitly not identified. That row was ingested before the new normalizer and retained single-line content; deployment did not reingest it or establish retroactive structured-field coverage. No new cron run is inferred. Q01 may close only after the final version's real offer content, correct search reason, accessible detail and pagination are observed. P01 remains open if the live account yields only empty/search-only or goal context: a positive real CV/DTC/offer evidence path is still required. This acceptance does not open the A3 preparation destinations; inspecting their href is separate from executing those routes.


## Final production publication and scoped A4 acceptance — 2026-10-08, 03:41:53 UTC

This is the final application-publication and browser checkpoint for PR #241/#242. It supersedes the intermediate BUILDING/pending statements above. The natural slot 165873 and the database aggregate at 03:22 remain the separately dated pre-publication ingestion baseline; the following browser observation does not create or establish a newer ingestion.

| Release identity | Confirmed value |
|---|---|
| Repository / canonical branch | `jcv86/main` / `main` |
| PR #241 squash / reviewed tree | `a1f6e03243fc2d6f614796f8d17c6fddfee58dda` / `d07436567787cab31fdd6be7fdbe50d8bb467991` |
| PR #241 production | `dpl_Cr59jPuVQwdm2GWTYzJuQP8CcBuA`, READY `2026-10-08T03:29:26.573Z`; 9/9 anonymous checks completed `03:31:07.483Z` |
| PR #242 reviewed original candidate | `e7da081347237e1b3fa393fcf3dca6c6bbe95c52` |
| PR #242 synchronized final candidate | `8e7f50814980f0db1dd44e4a7e08fcd2e6602f51`; synchronization preserved the reviewed application tree |
| Current main / PR #242 merge | `172a09b94e266084c9d79be235053893db5ef549` |
| Exact reviewed / merged / deployed tree | `1e5a41e906216e33a121c89f0cf62cf2d2d6b086` |
| Final production deployment | `dpl_JDvrrvfSwMdmghUionzASdAsEyDU` |
| Final production READY | **`2026-10-08T03:35:24.835Z` / 00:35:24.835 Chile** |
| Canonical application | `https://www.despegatucarrera.com` |
| Anonymous acceptance | **10/10**, completed **`2026-10-08T03:37:04.913Z`** |
| Authenticated browser observation | **2026-10-08 03:41:53 UTC / 00:41:53 Chile**, `/despega/a4/job-matching` |
| Operational rollback baseline | PR #240 main `8b776e9c171ec0c755fd3829b19bca804e8e74f8`, deployment `dpl_957qm7APiGXMd1MguMWSZxoZSn14` |

No migration or new environment variable accompanies these releases. Existing data remains compatible with the recorded rollback application. The 542 focused synthetic regressions, full quality gate, independent review and isolated mobile/desktop evidence retain their earlier documented scope. The synchronized final candidate passed all ten head-specific CI workflows:

| Exact-head workflow | Observed final result |
|---|---|
| [A4 Opportunity Engine](https://github.com/jcv86/main/actions/runs/37722663791) | completed / success |
| [A4 Review UX](https://github.com/jcv86/main/actions/runs/37722663787) | completed / success |
| [Get on Board Source](https://github.com/jcv86/main/actions/runs/37722663828) | completed / success |
| [Career Identity validation](https://github.com/jcv86/main/actions/runs/37722664022) | completed / success |
| [A3 to A4 atomic transition lab](https://github.com/jcv86/main/actions/runs/37722663830) | completed / success |
| [Evidence-aware validation](https://github.com/jcv86/main/actions/runs/37722663844) | completed / success |
| [V1 analytics closure](https://github.com/jcv86/main/actions/runs/37722663786) | completed / success |
| [Pilot access](https://github.com/jcv86/main/actions/runs/37722663794) | completed / success |
| [Design enforcement](https://github.com/jcv86/main/actions/runs/37722663805) | completed / success |
| [A1 browser and local Auth](https://github.com/jcv86/main/actions/runs/37722663915) | completed / success |

### Authenticated exploration, matching and available source detail

The existing owner-authorized A4 session used the published page without changing an account, assessment, journey state or saved search. Only the scoped A4 exploration, reads and disclosure interactions are claimed here; this is not a claim that arbitrary GET navigation is free of side effects.

- Metropolitana exploration rendered **18 → 36 of 54** results, with **36 distinct original URLs** at that point.
- A controlled exact-role search with region and hybrid-mode filters rendered **1** matching offer. The displayed search reasons correctly reflected the applied constraints. The public record omits the individual filter text.
- All-region exploration rendered **18 → 36 → 54 → 72 → 90 → 93 of 93** real cards, with **93 distinct original URLs**. The load-more action disappeared at the end. The rendered sources were **47 Chiletrabajos, 26 Greenhouse and 20 Lever**.
- Real employer and Chiletrabajos details exposed useful complete available descriptions; the inspected detail text lengths were **4,459** and **1,758** characters respectively. Enter opened the **Qué datos usamos** source-summary disclosure. Offer details were opened by click and remained open after pagination; keyboard operation of offer details retains the earlier isolated/synthetic test scope. Only lengths and behavior are retained here, not quoted offer or personal text.
- Draft filters stayed separate from the applied result state. The existing saved-search view retained its no-matches result independently; no real save POST was made.

Some legacy ingested content remained single-line and its requirements/skills were explicitly not identified. Useful available description text does not establish that structured requirements or skills were extracted for that row. Publication does not reingest it, refresh its verification date or prove improved stored-field coverage. The 03:41 browser source totals agree with the earlier 93-fresh inventory, but agreement is not a new SQL observation or a new cron execution.

### Personal evidence and next action

The five personal source summaries — **CV, declared goal, A1, A2 and A3** — were all shown as **empty** in this authorized session. No source dates were displayed and **0 personal-support disclosures** were shown. The actual result was a truthful **search-only** explanation: no personal competence, date, support fragment or positive match was invented when personal evidence was absent. This observes the empty-context path and does not prove the positive personal-evidence path.

The offered **Revisar mi CV** next action had the inspected href **`/despega/a3/cv-builder-studio`**. It was **not followed**. No A3 preparation destination was opened. Code review found that A3 navigation can invoke `repairLegacyC2Completion` or `markA3JourneyVisited`; inspecting the link is therefore recorded separately from executing the destination. Neither an A3 journey write nor a completed preparation flow is claimed.

### Closure decision and limits

| Item | State after this observation | Basis and remaining limit |
|---|---|---|
| DTC-A4-Q01 | **`verified`** | Published exact tree plus real offer content, correct shared-matcher reasons, accessible details and complete 93-card pagination. This closes the scoped content/matching/detail UI criterion; it does not establish native execution of the new diagnostic histograms, retroactive structuring of legacy rows or a new ingestion |
| DTC-A4-P01 | **`in_progress`** | Publication and the honest empty-context/search-only path are observed. A legitimate structured A3 CV and relevant persisted DTC evidence must still support a positive real CV/DTC/offer explanation, with both sides visible. No synthetic personal evidence is inserted to close this gap |
| DTC-A4-S01 | **`in_progress`** | All six employer boards have native-visit evidence, and 93 current offers from three stored sources were rendered. Coderio remains partial and the Get on Board natural primary visit remains unobserved at this cutoff |
| DTC-A4-S02 | **`in_progress`** | Native maintenance 3/3, per-source persistence and one invalidation are observed. Actual cooldown-trigger/recovery and large-board rotation across visits are still pending; bounded maintenance does not guarantee every row becomes fresh within 24 hours |

No real saved-search POST, forced production failure, forced session expiry or A3 destination navigation was performed in this acceptance. Recovery and cross-profile positive guidance retain their synthetic/isolated evidence until corresponding live observations exist. Existing account and journey state were preserved; this public record omits account identifiers, personal filter values and private evidence fragments.

The verification made only read-only Supabase operations on DTCFINAL `dcfrbwxbejtbcouionna`, with no manual cron, retry or lease manipulation. The 34 upserts / 32 net-new stored rows belong to the earlier slot 165873; none are attributed to publication of PR #241/#242. The runtime and browser-console observation below records its bounded final window; it is not a perpetual zero-error claim. No unrelated DTC criterion is re-certified by this scoped acceptance.


### Final runtime observation and scoped verdict — 2026-10-08, 03:42:20 UTC

The canonical deployment and main identity were reconfirmed unchanged: `dpl_JDvrrvfSwMdmghUionzASdAsEyDU` / `172a09b94e266084c9d79be235053893db5ef549`. The Vercel project aggregate returned **0 grouped runtime errors** for the post-READY window **2026-10-08 03:35:24.835–03:42:20 UTC**, including the authenticated A4 browser journey. This is the observed project-aggregate window, not an exact-deployment log-exhaustiveness or ongoing zero-error claim.

The browser console review covered **38 captured records**, all classified as browser-extension metadata delivery failures originating from a `chrome-extension` content script; the last observed message was **03:41:17.550 UTC**. **0 DTC application errors were observed in that reviewed set.** The console was not error-free: the 38 extension records remain separate from DTC application/runtime findings.

Independent reviews agree on **CONDITIONAL_GO** for this scoped release: **Q01 verified; P01, S01 and S02 in_progress** for the specific evidence gaps above. The private production screenshot remains outside the public repository. No account identifier, email, CV fragment or private search content is included in this record.
