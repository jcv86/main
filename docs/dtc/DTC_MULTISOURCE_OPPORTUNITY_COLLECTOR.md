# A4 — public employer vacancy collector

Date: 2026-10-07
Delivery item: DTC-A4-S01
State: initial ingestion, authenticated Radar access, PR #240 search/context publication and first native maintenance cycle observed; Coderio partial, remaining source coverage and catalog-quality candidate in_progress
Application baseline: `jcv86/main` at `7ce45b5c77f844081a97a3f023fbc346ee9350e7`.

## User outcome

Expand the Radar with current vacancies from employers recruiting in Chile. Keep the original publication, the company, the geographic restrictions and the verification time visible. Candidate searches read the verified catalog; they do not launch this employer collector.

## Initial reviewed registry

| Employer | Provider | Board token | Original board |
|---|---|---|---|
| Fintual | Lever | `fintual` | https://jobs.lever.co/fintual |
| Cabify | Greenhouse | `cabify` | https://job-boards.greenhouse.io/cabify |
| Checkr Chile | Greenhouse | `chile` | https://job-boards.greenhouse.io/chile |
| APPLY Digital | Lever | `applydigital` | https://jobs.lever.co/applydigital |
| Coderio | Lever | `coderio` | https://jobs.lever.co/coderio |
| PagerDuty | Greenhouse | `pagerduty` | https://job-boards.greenhouse.io/pagerduty |

The registry identifies public company boards, not partnerships or a general content redistribution license. Adding an employer requires code review of its identity and public access route. Neither request parameters nor provider payloads can select an arbitrary host. No login, application submission, CAPTCHA solving, proxy rotation or collection of candidate profiles is part of this collector.

## Acceptance criteria

1. IDs include the employer board and provider; original URLs must agree with that identity on read and write.
2. Chile eligibility uses explicit locations, including all published locations. A primary foreign country does not erase a listed Chile location. An unqualified remote label does not establish Chile eligibility.
3. Future/talent-pool calls and expired vacancies do not enter the current vacancy catalog. Uncertain work modality and publication date remain unknown.
4. Fetches have a fixed host registry, response-size and row limits, end-to-end deadlines, cancellation, host pacing, robots checks and bounded concurrency.
5. Retry-After is respected across scheduled executions; a source that is waiting does not receive new requests before its cooldown expires.
6. The six existing Chiletrabajos/Get on Board refresh targets retain their 18-hour cycle. Two company boards are reviewed per three-hour slot, completing the initial employer cycle in nine hours.
7. The employer batch runs alongside the main provider, within the existing 50-second work budget and 120-second lease. Lease loss or cancellation prevents further catalog writes.
8. Healthy results survive an independent provider failure. Partial failures are recorded as partial rather than complete success.
9. Absence closes a vacancy only after a complete, well-formed, untruncated snapshot of its own board. Failures cannot close a different employer's records or advance their verification time.
10. The current catalog continues to enforce its 24-hour freshness boundary, and authenticated A4 entry remains the access boundary.

Requests and body reads have an eight-second timeout inside the existing 18-second employer budget. A live cold request for Lever's robots policy took 7.34 seconds in the verification environment; the earlier six-second default was insufficient. This adjustment does not extend the cron's 50-second work budget.

## Data and display decisions

`source_id` uses `board:postingId` for employer sources. Stable identities prevent duplicate inserts while preserving distinct vacancies with similar titles. Text similarity is not authority to delete or merge separate requisitions.

Greenhouse's documented `first_published` is a publication timestamp. Lever's observed `createdAt` is retained only as provider creation metadata; it is not automatically displayed as a publication date. Verification time always comes from a successful current check. Salary fields are not added in this block: units, intervals and observed placeholder values need their own verified contract.

Employer payloads are reduced to the metadata needed for traceability. The user-facing routes explicitly select public fields, and never return raw provider data. Cards show the publication source and verification time in the Chile timezone.

The initial registry and per-board limits bound the scheduled inventory. Catalog coverage refers to the indexed results actually read, not to every vacancy in Chile or every posting on a provider.

## Supabase grounding

Read-only inspection of DTCFINAL (`dcfrbwxbejtbcouionna`) confirmed the existing `a4_verified_opportunities` table has text `source` and `source_id`, unique constraints on `(source, source_id)` and `original_url`, and the fields consumed by the index. No schema migration is needed to add Lever and Greenhouse.

The actual verification constraint accepts `verified_active`, `stale`, `unavailable` and `unknown`. Restricted verification is therefore stored as `unknown`; it cannot become a current recommendation or violate the database constraint. This block does not change grants, RLS, authentication, secrets or the lease RPC.

## Validation commands

```sh
pnpm run test:a4-employers
pnpm run test:a4-opportunities
pnpm run test:getonboard
pnpm run test:a4-closure
pnpm exec tsc --noEmit
pnpm run build
```

The explicit provider smoke is read-only and uses the registered public endpoints:

```sh
pnpm run smoke:a4-employers
```

It reports received/accepted/rejected/returned counts, completeness, source failures and a small set of original publication links. It never creates a database client or writes catalog rows. Automated regression tests use synthetic data and fake HTTP rather than repeatedly contacting providers.

## Primary provider documentation

- Greenhouse Job Board API: https://docs.greenhouse.io/job-board.html
- Lever Postings API: https://github.com/lever/postings-api
- Robots are checked on the API host before collecting jobs: https://api.lever.co/robots.txt and https://boards-api.greenhouse.io/robots.txt

## Public-provider evidence

Read-only smoke on 2026-10-07 at **20:16:27 UTC / 17:16:27 Chile**. All six boards returned their public job collections. The three two-board batches took 18.51 seconds in total in this manual smoke; this is separate from the scheduled nine-hour production rotation.

| Board | Received | Accepted for Chile | Excluded | Rejected | Snapshot |
|---|---:|---:|---:|---:|---|
| Fintual | 13 | 12 | 1 | 0 | complete |
| Cabify | 69 | 12 | 57 | 0 | complete |
| Checkr Chile | 14 | 14 | 0 | 0 | complete |
| APPLY Digital | 23 | 6 | 17 | 0 | complete |
| Coderio | 17 | 2 | 12 | 3 | partial |
| PagerDuty | 51 | 1 | 50 | 0 | complete |
| **Total** | **187** | **47** | **137** | **3** | **5 complete, 1 partial** |

The smoke deliberately exits nonzero for Coderio's partial collection. The three rejected postings have no text in any documented description field, including opening, body, closing content and lists. A separate read-only diagnostic confirmed that omission in the provider response. Their IDs are `7f1fa427-29fc-4996-acf0-0a44f0881fd6`, `a96826e6-9613-4907-a4cd-6f8fa0cead91` and `2281c62e-59b4-4ddc-a24a-075dac6ae4ac`. The collector preserves Coderio's two valid jobs, reports the data-quality limitation, and prevents absence reconciliation for that incomplete board. It does not fabricate descriptions or count the rejected rows as recommendations.

The verification environment used Node 24's standard `--use-env-proxy` option to honor its configured network route. The application uses normal server-side fetch on Vercel Node 22. No provider credentials, login, CAPTCHA, proxy rotation or access bypass were involved. The initial cold network failures and the partial Coderio result are not hidden by retries or a success-only report. No catalog rows were written by either public diagnostic.

## Verification and release state

- Existing regressions: Chiletrabajos 21/21, opportunity matching 22/22, refresh 16/16, Get on Board provider 21/21 and Get on Board routes 13/13.
- Employer provider regressions: 35/35, including the documented split-description fallback, pacing, robots, cooldowns, payload limits and fetch/body cancellation. Total focused regressions across the eight suites: **168/168**.
- Employer catalog integration: 22/22, with a constraint-enforcing PostgREST test double and independent review of normalizer → index → matching.
- Employer refresh orchestration: 18/18, including per-provider failures, persistent host cooldowns, lease loss and hard cancellation deadlines.
- TypeScript and the complete Next.js production build pass; the build generated 357 static pages. Build checks include the existing report-quality contracts. Local build credentials are intentionally absent, so this does not substitute for an authenticated production journey.
- Independent review closed snapshot consistency, Chile exclusion, work-mode interpretation, response-stream cleanup and robots matching findings. The confirmed Coderio provider omission is an observation handled by the partial-result contract.

The actual results component was rendered with its real UI primitives, Tailwind configuration, styles and Montserrat font at 390×844 and 1440×1000. Source and verification text remain visible without horizontal overflow; Chile time formatting correctly handles a UTC date crossing to the previous local day. Keyboard focus and 44px action targets were checked. The browser used synthetic responses in an isolated local harness and made no authenticated requests or provider calls. Loading, empty inventory, no matches and network error states were also rendered.

Reviewed branch: `codex/a4-multisource-scraper`, based on the main commit above. [PR #236](https://github.com/jcv86/main/pull/236) records reviewed commit `a9600bc6f5a0b8d878aeee761a97bb22891bbe8f` and all ten successful CI workflows. The authorized squash merge is `27941276ebf92f29c2bf08b94687261078a60da8`; its tree `723643040e2fcbf7ed1d095d88c83e5b25c130c7` exactly matches the reviewed tree.

Release preparation rechecked production as `dpl_HGrjKkC4HxGeYj8AZ915ZWMdHCTD`, main `7ce45b5c77f844081a97a3f023fbc346ee9350e7`, project `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`, team `team_VvIPBATpeoA0eQw8fIx4rhan`. That deployment remains the rollback baseline. Required Supabase variable names and CRON_SECRET exist in production and preview. This change adds no environment variable or database migration. Existing catalog rows remain compatible with the rollback application.

## Authorized production release — 2026-10-07

The user explicitly authorized production publication at 20:30:41 UTC / 17:30:41 Chile. Git integration built the approved main merge without a separate manual deployment.

- Production deployment: `dpl_FFvpPvdufqrMyjUB3uWPahJbE2Vd`, **READY** at 20:36:01 UTC / 17:36:01 Chile.
- Main commit: `27941276ebf92f29c2bf08b94687261078a60da8`.
- Deployment URL: https://v0-fork-of-despega-tu-carrera-clone-2drojjvv1.vercel.app
- At this initial publication checkpoint, both `www.despegatucarrera.com` and `despegatucarrera.com` resolved through Vercel to this deployment; the apex redirected to the canonical www domain. Later PR #238 and #239 production identities are recorded below.
- Vercel reported no runtime error clusters in the immediate post-release query beginning at 20:36:01 UTC. This is a short observation window, not a claim about future executions.

Anonymous GET checks ran from 20:36:37 to 20:37:36 UTC. They sent no cookies or authorization and did not follow redirects.

| Route | Observed response | Result |
|---|---|---|
| `https://www.despegatucarrera.com/` | 200, expected DTC HTML and title | pass |
| `/api/health/live` | 200, `{"status":"ok"}` | pass |
| `/api/health/ready` | 200, `{"status":"ready"}` | pass |
| `/api/a4/opportunities/catalog` | 401, `{"error":"No autenticado"}` | pass |
| `/api/a4/opportunities/for-me` | 401, `{"error":"No autenticado"}` | pass |
| `/despega/a4` | 307 to `/auth/signin?next=%2Fdespega%2Fa4` | pass |
| `https://despegatucarrera.com/` | 307 to `https://www.despegatucarrera.com/` | pass |

Health responses were `no-store`; both private APIs were `private, no-store` with CDN caching disabled. These checks verify public availability and the anonymous authentication boundary. They do not prove an authenticated Radar journey.

During the initial publication check, the existing cloud-browser tab was an error page and browser policy rejected inspection of its internal `chrome-error:` protocol. A subsequent visit to the public HTTPS application succeeded. The follow-up evidence below supersedes the initial browser limitation. Prior isolated component and real local Auth/PostgREST CI evidence retains its original scope.

### Follow-up before the first cron — 2026-10-07, 20:45–20:55 UTC

The Vercel API reconfirmed the same production deployment and main SHA. The one-time verification task remained enabled for 21:18:18 UTC.

The project connector did not expose cron enablement. Read-only inspection of the actual [Vercel Cron Jobs settings](https://vercel.com/despega-tu-carrera/v0-fork-of-despega-tu-carrera-clone/settings/cron-jobs) resolved that gap: the feature is **Enabled**, the checkbox is checked, and `/api/cron/a4-opportunities` is listed as running at 15 minutes past the hour, every three hours. The page explicitly states UTC. No Run button or configuration switch was used.

The public HTTPS browser journey reached a signed-in DTC session. Opening A4 redirected to `/despega/a1-cerebral`, and the navigation marked A4 as blocked. Opening the workspace returned to `/despega/conozcamonos-1`. This account has not established the prerequisite journey state needed for the positive Radar check. No assessment answers or progress were changed to unlock it.

Sign-out was observed returning to `/auth/signin`. The user selected Google through the secure authentication capability, and a later fresh DTC page showed the signed-in application again. Returning Google authentication therefore worked for the observed account; at this pre-activation checkpoint the account still had A4 blocked. A direct browser navigation to the catalog API returned `ERR_BLOCKED_BY_CLIENT`, so that browser attempt supplies no authenticated API response evidence.

### Owner-authorized temporary A4 access — 2026-10-07, 21:00 UTC

The owner then explicitly requested A4 access for the existing pilot. A read-only identity check resolved exactly one account, an existing pilot membership and a previously expired row in the server-only `a4_qa_entitlements` table. A guarded update renewed only that existing permission for 30 days, until **2026-11-06 21:00:13 UTC / 18:00:13 Chile**. The original creation metadata was retained. No answers, scores, completion records, memberships, roles, grants or schema were changed. A subsequent read confirmed the permission is active. No account identifier is included in this public record.

The authenticated production page `/despega/a4/job-matching` then opened successfully and its draft-filter catalog showed **12 current opportunities for Metropolitana**. The saved-search results panel showed a truthful no-matches state; the saved preferences were not changed to manufacture a positive match. A catalog count is not evidence that 12 result cards were displayed.

The same permission was still being discarded by the landing/results/navigation interpretation of the journey. [PR #238](https://github.com/jcv86/main/pull/238) fixes that inconsistency with a shared server-side check and an effective A4 access source separate from real progress. Local evidence: 25 permission regressions, 28 continuity checks, 10 transition-evidence cases, focused guard/cache/auth contracts, TypeScript and a full 357-page build passed. Independent review returned GO. Isolated mobile/desktop checks verified A4 navigation and truthful temporary-access copy. All 14 CI workflows passed for the first candidate `3d3e706f68c4adc487f8c6eeaee1d4bf15a8d024`.

### Profile availability found during live verification

A later runtime scan of the original production deployment identified the absent auxiliary `dtc_profile_signals` relation (`42P01`): 18 signal-query and 3 weakness-query errors at 21:01:14 UTC. The helpers converted those errors to empty arrays, then calculated baseline readiness values; the live job-search page also showed those unsupported values. This was a pre-existing profile presentation defect, independent of the collector and the report's verified-signal data.

The final PR #238 candidate `c63e058313b7d98a52b04010f8f837feab1f6078`, tree `a632e3e5f5fb84eac126bf340e400cff40b70d86`, corrects that behavior. Unavailable reads propagate a fixed-code, sanitized error. One bounded active-signal check precedes further profile reads; missing data or any later read failure returns an unavailable profile. Landing and job matching keep the Radar/search usable and explicitly show that availability state. No historical migration, schema or role change was used. The source remains unavailable; the correction makes that fact visible.

Fourteen additional availability regressions passed, covering initial and later errors, successful empty reads, owner/active filters, valid calculations, sanitized logging, context consumers and both pages. The 25 access regressions and full TypeScript/357-page build passed again on the final candidate. All 14 workflows for the final candidate completed successfully before the authorized squash merge. The exact-tree production and authenticated checks are recorded below.

### First scheduled ingestion — verified 2026-10-07

Read-only DTCFINAL counts before the new scheduler ran: 78 Chiletrabajos rows marked `verified_active`, of which 12 had a verification within 24 hours; zero Get on Board, Lever or Greenhouse rows. The previous successful A4 execution began at 19:35:07 UTC, recorded slot `165870` and upserted 12 Chiletrabajos rows. That three-hour slot was already consumed before the new deployment.

The existing Vercel cron is `15 */3 * * *` UTC. The native run for slot `165871` started at **2026-10-07 21:15:00.909321 UTC / 18:15:00 Chile** and completed at **21:15:07.636 UTC**, with status `success`, outcome `ok` and a recorded duration of 6.727 seconds. It reported **32 upserts, 0 invalidations and 0 index rejections**, with no recorded error codes.

| Source and scope | Received | Accepted / returned | Excluded | Rejected | Result |
|---|---:|---:|---:|---:|---|
| Chiletrabajos / Valparaíso | Not separately asserted | 12 | Not separately asserted | Not separately asserted | Successful primary refresh |
| Greenhouse / `chile` / Checkr | 14 | 14 | 0 | 0 | `ok`, complete snapshot |
| Lever / `applydigital` / APPLY Digital | 23 | 6 | 17 | 0 | `ok`, complete snapshot |

Both employer boards recorded no failure code or retry-after cooldown. A read-only database observation at **21:16:08.841850 UTC** confirmed these persisted counts:

| Source | Stored `verified_active` rows | Verified within 24 hours |
|---|---:|---:|
| Chiletrabajos | 90 | 24 |
| Greenhouse | 14 | 14 |
| Lever | 6 | 6 |
| Get on Board | 0 | 0 |
| **Total** | **110** | **44** |

The other 66 Chiletrabajos rows retain their stored active status but are older than the 24-hour verification window; they were not counted as fresh. The **14 Checkr and 6 APPLY Digital jobs are actually persisted**. This is distinct from the 47 accepted postings in the earlier non-persisting smoke.

At the subsequent authenticated job-search reload on the original production deployment, the Metropolitana draft-filter catalog increased from **12 to 32 opportunities** and displayed the updated category counts. This is direct application evidence that the expanded inventory reaches the catalog UI. The saved-search panel still showed no matches; no search intent was changed and no result-card rendering for those saved filters is claimed.

The following employer pairs remain scheduled but unverified in production: Coderio/PagerDuty at 21:15 Chile and Fintual/Cabify at 00:15 Chile on October 8. No manual cron attempt, lease reset, schedule change or direct catalog insertion was used. The follow-up made only read-only execution and inventory checks, without profiles, assessments, personal data or source payloads.

**Scoped release verdict: CONDITIONAL_GO.** The reviewed collector is published and its first native employer ingestion is verified. Returning Google authentication and the existing authenticated job-search catalog were observed. PR #238 subsequently verified normal authenticated Radar entry, report and the updated catalog, as recorded below. SQL counts alone do not close `DTC-A4-S01`. A successful first run proves only the two employer boards it processed, not all six boards' production cycles.


### Authenticated access publication completed — 2026-10-07, 21:44–21:50 UTC

PR #238 was squash-merged as `79ec6b6111a501d5feef8ee71663121efeb4d517`. Its tree `a632e3e5f5fb84eac126bf340e400cff40b70d86` exactly equals the reviewed candidate. All 14 workflows passed for that final candidate. Vercel deployment `dpl_46FMoqfXDGfcgnSCGmunbQYx3H3m` became production READY at **21:44:04.225 UTC / 18:44:04 Chile**; the connector subsequently resolved the canonical domain to the same deployment and commit.

The existing authorized pilot session then opened `/despega/a4`, `/despega/a4/resultados` and `/despega/a4/job-matching`. The normal A4 navigation is available, the temporary-access notice is visible, and the real A1–A3 states remain unchanged. The job-search draft-filter catalog shows **32 Metropolitana opportunities**. The saved-search panel remains without matches; these checks did not save preferences, assessments, progress or signals. Unavailable auxiliary profile evidence is presented honestly, without the former unsupported default readiness scores.

Seven anonymous checks completed at **21:49:51 UTC**: both health endpoints returned 200, A4 access/context/catalog returned 401, and landing/report redirected to sign-in. A4 access and catalog use private/no-store; that header is not asserted for the context error. Runtime inspection since publication reported two sanitized `schema_unavailable` diagnostics from the unavailable auxiliary profile source. The pages remained usable. This is not a zero-error claim or a schema repair.

`DTC-A4-A01` is verified for the authorized temporary-access acceptance criterion. `DTC-A4-S01` remains in_progress because four employer boards have no observed native production cycle yet. This access release's rollback baseline is `dpl_FFvpPvdufqrMyjUB3uWPahJbE2Vd` / main `27941276ebf92f29c2bf08b94687261078a60da8`.

## Bounded freshness and coverage improvement — 2026-10-07

The owner requested further scraper development after the first native ingestion. The observed inventory had 66 older Chiletrabajos rows outside the 24-hour freshness window, while a large employer board could repeatedly return the same first 50 eligible vacancies. This block addresses those coverage gaps and makes partial persistence measurable.

- **Chiletrabajos maintenance:** the existing cron's 12-probe / 35-second batch interleaves three discovered IDs and one known ID, with at most three known candidates. The read-only selector uses the existing verified index, the target region, recoverable states and a verification age of at least 18 hours. Oldest attempted rows lead the queue. Selecting a row does not refresh its verification timestamp; only a successful current provider observation can do that. Unused maintenance capacity remains available to discovery. Generic on-demand callers retain their previous limits of 20 results and 30 candidates.
- **Primary-source backoff:** Chiletrabajos and Get on Board persist valid Retry-After dates in `cron_job_executions.execution_summary.primary_cooldowns`. A 429 without a usable date waits three hours; a 503 requires a valid header. The last completed state survives visits to the other source. A failed state read prevents that primary request while independent employer work can continue; no missing state is overwritten with an invented empty map. State and maintenance reads have a three-second deadline inside the existing global budget.
- **Employer coverage:** eligible vacancies already received in a bounded response rotate across the 50-return limit using the existing scheduled slot. A 75-vacancy fixture is fully covered over two board visits, with 50 returned per visit and the same number of requests. No new pages or provider calls are added. Truncated results remain partial and cannot trigger absence reconciliation. A malformed duplicate no longer hides a later valid copy, while the rejected observation remains visible in diagnostics.
- **Persistence evidence:** `primary_persistence` and each `employer_boards[].persistence` report confirmed upserts, invalidations, rejected rows and outcome. Upserts include inserts and updates; they are not a count of newly discovered jobs. An internal observer records each confirmed statement immediately; later errors cannot erase it or count it twice. The observer closes when the operation finishes or is cancelled, so late replies cannot change the completed ledger. Unknown write outcomes are not estimated.
- **Catalog read and entry:** catalog reads select only the 18 public fields used by matching/display, excluding raw source payloads and write bookkeeping. The normal A4 landing provides an `Explorar oportunidades` link to the existing authenticated search.

No new provider, dependency, migration, RLS rule, environment variable, credential or cron schedule is introduced. The primary-city cycle remains 18 hours and each employer board's visit cycle remains nine hours. The 50-second global work budget and lease protections remain in force. No manual cron or production data write is part of development verification.

### Validation checkpoint

The final focused regression run passed **273/273 cases across 12 suites**: Chiletrabajos 33, Get on Board provider/routes 24+13, matching 22, maintenance selection 17, primary state and persistence 27, primary refresh 16, employer sources/index/refresh 40+24+18, A4 access 25 and profile availability 14. Critical contracts and TypeScript pass. Independent review returned GO after reproducing and closing loss of earlier confirmed counts during statement failure and hard cancellation. The improvement PR records the final build and publication checks. The actual A4 landing and shell were rendered at **390×844 and 1440×1000**, using synthetic data and real styles/fonts: no horizontal overflow, a 44px catalog link, visible keyboard focus and successful Enter activation. Axe found zero violations within the changed link in both viewports; this does not certify unchanged shell widgets. No provider or production requests were made by these tests.

PR #239 publication has now resolved the canonical domain to the exact reviewed application tree, preserved the anonymous authentication boundaries and verified the new link in the authorized production session, as recorded below. The next native execution remains the evidence needed for the new maintenance/cooldown statistics. A READY deployment or synthetic fixture result does not establish new production ingestion.

### Remaining scoped work

- Observe native Coderio/PagerDuty and Fintual/Cabify cycles; the earlier non-persisting smoke is not evidence of their stored inventory.
- Observe maintenance selection/probe and persistence counters in the next natural primary-source cycles. Fresh inventory growth cannot be promised from code changes alone.
- Keep the auxiliary action-profile source visibly unavailable until a separately scoped backend decision repairs it.
- Results still cap displayed matches at 18 without pagination. The catalog selects a bounded set before its in-memory expiry filter; a synthetic large-inventory case exposes that limitation, but no current loss was demonstrated with 110 stored rows and a 500-row catalog read. Stable catalog tie ordering is also separate follow-up work. No approximate cross-source deduplication was added without evidence of real duplicates.

### Bounded improvement published — PR #239, 2026-10-07

[PR #239](https://github.com/jcv86/main/pull/239) was squash-merged after the final authorization and identity gate. The final read confirmed an open, mergeable/clean PR, the exact reviewed head/tree, main still at the verified PR #238 baseline, all 10 CI workflows successful and the reviewed Vercel preview READY. No preview-protection bypass was used.

| Release identity | Verified value |
|---|---|
| Reviewed candidate | `e85294fd753ff6a4c510755b4687380e0ce6201d` |
| Exact reviewed / merged tree | `7181105474831cf823745fa971b6ef1a95b55582` |
| Main squash merge | `4c0322a929b51aa79dc9c3acce4225032d661b49` |
| Parent / prior production baseline | `79ec6b6111a501d5feef8ee71663121efeb4d517` |
| Preview deployment | `dpl_HmRBDnWnm4Jh3U4tAdCRPZXgaQUL`, READY 22:13:07.013 UTC |
| Production deployment | `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN`, READY **22:17:29.612 UTC / 19:17:29 Chile** |
| Canonical domain | https://www.despegatucarrera.com, resolved by the connector to the same production deployment and main SHA at 22:18 UTC |
| Rollback for this improvement | `dpl_46FMoqfXDGfcgnSCGmunbQYx3H3m` / main `79ec6b6111a501d5feef8ee71663121efeb4d517` |

All **10 CI workflows** for the exact final candidate passed; the [A4 engine workflow](https://github.com/jcv86/main/actions/runs/37694298011) includes contract/regression, TypeScript and isolated PostgreSQL lease/concurrency verification. [Design enforcement](https://github.com/jcv86/main/actions/runs/37694298004) completed a clean production build. Vercel preview logs independently confirmed `Build Completed in /vercel/output [4m]` and `Deployment completed`; the exact-tree production build also became READY. The final local build attempts had font-loader errors (`next/font` extension-regex null and a later `undefined.length` failure), whose external cause was not proven. They are preserved as local failures in PR #239. Successful clean CI/Vercel builds establish the release build gate without changing fonts, dependencies, environment or security controls.

**Live application evidence:** after production was READY, the authorized session opened the normal A4 landing and followed its new **Explorar oportunidades** link to `https://www.despegatucarrera.com/despega/a4/job-matching`. At 22:21 UTC the Metropolitana draft-filter catalog showed **32 available opportunities** and updated category counts. The saved-search results still showed no matches. A catalog availability count is not evidence of 32 rendered result cards. No search intent, assessments, profile data, signals or progress were saved during this check. A4 remains available while real A1–A3 state is retained. The auxiliary action profile remains unavailable and is explicitly described that way.

**Anonymous boundary evidence:** seven checks completed at **22:18:56.076 UTC**: live/ready returned 200; module access, journey context and catalog returned 401; normal A4 and report returned 307 to sign-in. Module access and catalog were private/no-store; this cache claim is not made for the context error. These requests carried no session and made no cron or provider calls.

**Runtime evidence:** the exact production deployment's log query covered **22:17:29.612–22:22:16.700 UTC**, filtered to warning/error/fatal, limit 20. It returned two sanitized `[A4 Snapshot]` / `schema_unavailable` diagnostics: **22:19:00.436** on `GET /despega/a4` and **22:21:26.061** on `GET /despega/a4/job-matching`. Both use the existing controlled unavailable-profile path. No other diagnostic was returned in that bounded response, and no zero-error or schema-repair claim is made. The aggregated error-group first-seen timestamp predated PR #239, so the exact deployment-filtered log timestamps are the evidence used here.

**Read-only inventory evidence:** DTCFINAL at **22:18:52.262055 UTC** still has **110 stored verified-active rows / 44 verified within 24 hours**: Chiletrabajos 90/24, Greenhouse 14/14, Lever 6/6, Get on Board 0/0. Slot `165871` remains the latest execution, with the original start/completion, 32 upserts, zero invalidations/rejections, complete Checkr 14/14 and APPLY Digital 6/23 snapshots (17 excluded). The baseline-to-inventory increase from 78 to 110 supports 32 net-new rows from that earlier native run. No new ingestion is attributed to PR #239 and its new per-source persistence fields have not yet been observed on a native execution.

**Next native evidence:** Coderio/PagerDuty are expected in slot `165872` at **2026-10-08 00:15 UTC / October 7 21:15 Chile**; Fintual/Cabify in slot `165873` at **October 8 03:15 UTC / 00:15 Chile**. Primary maintenance and cooldown behavior require their corresponding natural source/region visits. `DTC-A4-A01` stays verified; `DTC-A4-S01` and `DTC-A4-S02` stay in_progress. This two-document follow-up records publication evidence without another application-code merge or deployment.

## Search and context closure candidate — 2026-10-07

The owner's subsequent request to finish the Radar authorizes this scoped implementation after PR #239. The candidate branch is `codex/a4-final-closure-20261007`, based on main `4c0322a929b51aa79dc9c3acce4225032d661b49`. The rollback baseline is its verified production deployment `dpl_2paWuyve2aB6y2GYdrj2WyYZmeLN`. Publication identity and post-release observations belong in the candidate PR's preserved release record; this section records the pre-publication work.

### Verified catalog reads and maintenance selection

The actual DTCFINAL metadata identifies `expires_at` and `published_at` as TEXT, and `last_verified_at` as a timestamp. The new shared temporal filter therefore handles normalized date-only values using the Chilean calendar and normalized UTC timestamps using the actual instant. It applies expiration and publication bounds before the database row limit. A second parser check remains after reading. Legacy offset or noncanonical date text is retained for that real parser rather than rejected by an incorrect lexical comparison; this compatibility path is not a guarantee of exhaustive selection for arbitrary legacy text.

Regressions reproduce and resolve two starvation cases: thirty expired maintenance rows hiding the next valid candidate, and five hundred expired catalog rows hiding the next current vacancy. Future Get on Board publication dates are rejected before persistence. Maintenance remains SELECT-only until a normal provider verification; no lease, cron schedule, probe limit or source budget changes.

The public reader retains its explicit 18-field projection, deterministic verification/source/ID ordering and 24-hour freshness boundary. It returns a scope marker when the bounded 500-row read fills. All counts and filters then describe that consulted set; no broader national coverage is implied.

### Exploration, saved search and complete result navigation

- The initial view explores current Metropolitana vacancies across all roles and modalities. The user can switch to their actual saved primary search without changing it.
- Draft inputs and applied filters are separate. The API returns the filters actually used, and changing a draft does not silently relabel the displayed results. An unadded role survives switching views.
- **Ver ofertas** and **Limpiar filtros** only lead to catalog/index GET reads. **Guardar como mi búsqueda** is the explicit owner-authorized save action.
- Results paginate in groups of 18. A fingerprint binds later pages to the filters and current matching inventory. If either changes, the route rejects the stale page and the UI restarts the first page with the same filters. Old asynchronous responses cannot replace a newer view.
- A failed later page preserves existing cards and offers retry. An expired session or unavailable A4 access offers the appropriate recovery. An empty catalog remains distinct from zero matches for a saved search.
- Saving an existing primary now updates that same owner-scoped row in one compare-and-set statement. It no longer demotes the old primary before a potentially failing insert. The existing unique primary index arbitrates concurrent first saves; a competing update returns a clear conflict. Optional advanced preferences omitted by the form are preserved. No automatic save retry occurs after a lost acknowledgment.
- Both search-intent methods require verified authentication and effective A4 access, select explicit fields and return private/no-store responses. User input cannot choose an owner, source or existing row ID.

### Context grounded in the existing journey

The two active A4 pages now describe existing career identity, completed A1, A2 task days and A3 sessions. Reads are bounded, owner-scoped and explicitly projected. Independent source failures preserve successful sections and display the unavailable section. The job-search context starts collapsed for optional detail.

No missing legacy profile tables are created or migrated. The active pages no longer depend on `dtc_profile_signals` or calculate readiness from absent data. A declared target role is described as a declaration, not as proof of competence. Completion counts are descriptive and do not establish a match to job requirements.

The Radar's upper A3 indicators share the same completeness validation as the context, including the exact owner count, known module IDs and valid completion dates. Partial reads cannot appear as verified totals. Scores that are absent, malformed, non-finite or outside 0–100 are excluded; a genuine zero remains valid. The regression `[null, '', 80]` yields 80/100 from one valid completed session, while a 1,001-row count with only 1,000 returned rows yields unavailable KPIs and keeps the Radar and opportunity entry usable.

### Candidate evidence and native-cycle limits

The focused synthetic suites pass **357/357 cases**: primary provider/matching/maintenance/refresh 124; employer sources/index/refresh 82; Get on Board 38; access 25; legacy profile availability 14; canonical context and Radar indicators 29; atomic search-intent saves 21; paginated search experience 24. They perform no provider requests or real database writes. All relevant new scripts and the shared PostgREST fixture are wired into CI. Critical security, auth, journey and reporting contracts also pass. A rejected A3 transport promise is converted to a sanitized unavailable result; it cannot reject the whole Radar page.

The actual changed pages, shell, styles and local Montserrat fonts passed isolated Chromium checks at **390×844 and 1440×1000**, with no external requests or page errors. Both viewports had no horizontal overflow and passed keyboard-focus/44px-action checks. Exploration preserved the stored synthetic search, an unadded role survived a view round trip, pagination advanced 18→36→40 without duplicates, and later-page failure/retry, changed-inventory restart, expired-session recovery, empty inventory and partial context were checked. The only POST was an explicit save against synthetic in-memory IO. Automated axe checks found no violations in the changed page scope; two incomplete rule categories (`aria-prohibited-attr` and `color-contrast`) are retained as tool limits rather than claimed complete automated certification. Visual inspection resolved the active-button contrast and checkbox-width defects.

The local complete Next.js build passed with 356 static pages, report-quality contracts and TypeScript, before the final narrowly scoped A3 rejected-promise guard; the guard's additional regression passed afterward. Existing local missing-credential and middleware SDK/Edge warnings are not authenticated-runtime proof. The exact final candidate must also pass clean CI/build gates before publication. Synthetic tests and build success are not production ingestion evidence.

A read-only DTCFINAL query at **2026-10-07 22:51:53.179569 UTC / 19:51:53 Chile** reconfirmed **110 stored verified-active rows and 44 verified within 24 hours**: Chiletrabajos 90/24, Greenhouse 14/14, Lever 6/6 and Get on Board 0/0. Slot `165871` is still the latest completed native run: success/ok, 32 upserts, zero invalidations/rejections; Checkr accepted and returned 14/14, APPLY Digital 6/23 with 17 excluded, both complete. Its new primary persistence/cooldown fields are absent because that run preceded PR #239. No additional rows or native effects are attributed to this candidate.

Remaining natural observations retain their real schedule: Coderio/PagerDuty at **2026-10-08 00:15 UTC / October 7 21:15 Chile**, Fintual/Cabify at **03:15 UTC / 00:15 Chile**, and the Get on Board primary visit at **09:15 UTC / 06:15 Chile**. The bounded three-known-offer maintenance per region does not promise to refresh all 66 older Chiletrabajos records within 24 hours. `DTC-A4-S01` and `DTC-A4-S02` remain in progress until their actual native evidence is observed. This implementation changes no production account, evaluation, entitlement, schema, RLS, credential, environment variable, schedule or lease.

## Post-publication verification — PR #240, 2026-10-07

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
