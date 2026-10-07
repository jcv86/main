# A4 — public employer vacancy collector

Date: 2026-10-07
Delivery item: DTC-A4-S01
State: implemented; production activation in_progress
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

Reviewed branch: `codex/a4-multisource-scraper`, based on the main commit above. The pull request records the immutable reviewed commit and exact CI runs. Passing these checks does not mean the new sources have been published or ingested into production.

Release preparation rechecked production as `dpl_HGrjKkC4HxGeYj8AZ915ZWMdHCTD`, main `7ce45b5c77f844081a97a3f023fbc346ee9350e7`, project `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`, team `team_VvIPBATpeoA0eQw8fIx4rhan`. That deployment remains the rollback baseline. Required Supabase variable names and CRON_SECRET exist in production and preview; the current private production CRON_SECRET is sensitive. This change adds no environment variable or database migration. Activation requires the reviewed commit to be released, followed by evidence from a scheduled production run and the authenticated Radar.
