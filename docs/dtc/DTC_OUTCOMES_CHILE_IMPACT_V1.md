# Outcomes Chile — Impact Engine v1

Development block: 2026-10-07. Repository: `jcv86/main`. PR: [#233](https://github.com/jcv86/main/pull/233).

## User outcome

Turn a person's recorded job-search, employment, salary and follow-up evidence into an interpretable result. Every salary comparison identifies the actual measurements and their verification. Official labor-market references retain their source, period, publication and scope. No result establishes a causal effect of DTC.

The initial block completed the calculation and API boundary. The subsequent [Mis resultados laborales experience](DTC_OUTCOMES_CHILE_EXPERIENCE.md) adds capture/review UI, safe retries and due follow-up completion in the same PR. Official benchmark ingestion and production schema activation remain pending.

## Grounded release identity

- Production: `main`, `7f56e2599d05edd04890901e17e6d64d7be0fdbb`, Vercel `dpl_Fm9pmGFsD1hXELa1cSQFNNSpQb6c`, `READY`.
- Vercel project: `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`, `v0-fork-of-despega-tu-carrera-clone`.
- Supabase: DTCFINAL `dcfrbwxbejtbcouionna`.
- Branch resumed: `agent/dtc-outcomes-chile-data-foundation` at `d4ab5f0fa9ccbbd906c5ad75434bc1a0f76346d5`.
- Read-only catalog inspection on 2026-10-07 confirmed that none of the six Outcomes Chile tables exists in production. A READY Preview does not demonstrate database functionality.

## Calculation contract

| Result | Rule | Missing or conflicting evidence |
|---|---|---|
| Current salary | Latest eligible non-baseline measurement by measurement date; stable recorded-time/ID tie break | Conflicting amounts or employment links on the same latest date produce no selected scalar and expose the conflicting record IDs |
| Salary baseline | Most recent baseline strictly before the selected latest measurement | Missing, later, same-day or conflicting baselines produce no change calculation |
| Monthly change | Latest monthly net CLP minus baseline monthly net CLP | `null` means unavailable; a declared numeric zero is preserved |
| Percentage change | Monthly change divided by a positive baseline, rounded to two decimals | A zero baseline has no percentage; decreases remain negative |
| Annualized change | Monthly change times twelve, assuming the difference persists for twelve months | Lives in `impact.projection`, with `realized: false`; it is not observed annual income |
| Job-search counts and ratios | Counts of recorded event types and their event-count ratios | They are not unique hiring-process conversion rates; repeated interview events can produce ratios above 100% |
| Employment interval | Santiago calendar days from first recorded application to the first subsequent `job_started` or `return_to_work` record | Earlier employment and promotions do not substitute for a later hiring event; the interval does not prove actual search start or process linkage |
| Retention | Scheduled/pending/overdue/completed counts at 30/90/180 days; active/inactive/unknown only from completed follow-ups | No completed follow-up means no demonstrated retention; early completion does not prove the future horizon |
| Verification | Minimum evidence level of the actual salary pair, or employment plus completed follow-up | Unrelated verified records cannot upgrade the result |

Invalid and future-dated observations are excluded and counted. The computation carries `chile-impact-v1`, a computation timestamp, source record IDs, measurement dates and verification states. It is a recomputed response, not an immutable stored historical snapshot.

### Example using synthetic values

A baseline of $900,000 CLP on 1 August and a later net salary of $1,200,000 CLP on 1 October yields a monthly observed change of $300,000 CLP and 33.33%. The conditional annualization is $3,600,000 CLP. Neither number proves that DTC caused the change or that twelve months of additional income have been earned.

## Benchmark contract

`benchmark-selector.ts` is a pure selector; `benchmark-resolver.ts` loads its candidate rows. The source order is region + occupation + education, region + occupation, occupation, region, national. Employment category and industry also require explicit matching when a row describes those subgroups. Missing dimensions are never inferred from an unrelated job.

Each resolved reference includes ID, original source period, parsed start/end and precision, publication date, source reference, reliability, sample size, dimensions, cutoff and resolver version. Publication and period end must be no later than the observation cutoff. Unparseable periods, missing publication dates, suppressed samples, invalid numeric values and incompatible units cannot become the chosen reference.

Accepted period forms are `YYYY`, `YYYY-MM`, `YYYY-MM-DD`, `YYYY-Qn`, `YYYY-Tn`, and explicit ranges separated by `/`. The importer must preserve original source labels separately if they are not in this contract.

The current database calls its official salary benchmarks `monthly_labor_income_mean` and `monthly_labor_income_median`. A person's captured amount is `monthly_net_clp`. Their definitions have not been harmonized. Therefore `impact.delta.versusBenchmark` is always non-comparable in v1 and never subtracts these amounts. The official figure is context with provenance; no official numeric value was added in this change.

## Authenticated API and persistence

`GET /api/outcomes/chile` retains the summary fields and adds `impact.observed`, `impact.benchmark`, `impact.delta`, `impact.projection`, `impact.verification`, `impact.specificity`, `impact.attribution` and `impact.evidenceCoverage`.

The legacy top-level `economic` object exposes an explicitly named `annualizedLiftClp`. The earlier, unlaunched `observedAnnualLiftClp` field is removed. Within `impact`, all projected amounts live exclusively in `projection`.

`POST` supports `job_search_event`, `employment_outcome`, `salary_outcome` and `complete_followup`. Every request requires a UUID `requestId`; the session supplies identity. The client cannot set verification or evidence references. Salary must be a JSON integer; dates must be real calendar dates; timestamps require an explicit zone. New observations cannot be future-dated. Optional employment links are checked by ID and owner inside the service-only atomic RPC, and are also constrained in PostgreSQL. The experience document describes the per-owner request ledger, replay and conflict rules.

All responses, including errors, are private and `no-store` for browser and CDN. Missing or unavailable summary storage returns HTTP 503 without personal data. Logs expose only bounded error codes.

An employment insert invokes a `SECURITY INVOKER` trigger which creates all three follow-ups in the same transaction. A follow-up insertion failure rolls back the employment and its partial follow-ups. Composite foreign keys prevent cross-owner salary/follow-up links. Removing an employment link preserves the owner's salary measurement. Explicit service-role grants avoid reliance on project default grants.

## Verification

Run `npm run check:outcomes-chile-all` for:

- Foundation schema source contract.
- Runtime financial/date metrics.
- Strict capture validation, actual SDK requests with in-memory transport, and HTTP handlers with substituted external services.
- Pure benchmark selection and actual SDK pagination with synthetic transport, including a candidate after row 1,000.
- Fourteen grouped impact scenarios, including ambiguous measurements, zero baseline, negative change, Chile calendar boundaries, early follow-ups and conservative verification.
- Owner-scoped summary queries, 1,201-row pagination, a lower server page cap, failed/incomplete/duplicate reads, and linked employment dimensions.
- Shared eligibility for the presentation view, Chile midnight boundaries, reviewed/early/future follow-ups, truthful zero amounts, and presentation caps that do not truncate aggregate evidence.

The separate SQL runner is `scripts/outcomes-chile-database-lab.mjs`. Local evidence uses PostgreSQL 18.3 in PGlite 0.5.8, with real transactions, roles, constraints and RLS. It proves automatic dates, rollback after an injected day-90 failure, cross-owner isolation, rejected client-role writes, explicit server-role privileges, salary-preserving deletion and migration repeatability. The second block adds request replay for all four actions, rollback of reserved keys, conflicts and protected follow-up completion. PGlite does not test multiple-connection concurrency; the native PostgreSQL path adds two-connection lock/contention scenarios. Neither SQL path exercises PostgREST or GoTrue.

`.github/workflows/outcomes-chile.yml` repeats the runtime checks and SQL lab against a disposable `postgres:17` service, matching the production major version. The workflow also checks repository types; the existing validation workflow and Vercel verify the full production build. Remote results belong to the exact commit shown in the PR checks.

## Release boundary and next block

Development evidence is distinct from release approval. Before activating Outcomes Chile:

1. Confirm the four ordered migrations in the intended environment: `20261007143246_dtc_outcomes_chile_foundation.sql`, `20261007143340_dtc_outcomes_chile_atomic_capture.sql`, `20261007143341_dtc_outcomes_chile_idempotent_capture.sql`, then `20261007143343_dtc_outcomes_chile_explicit_privileges.sql`. All four were installed in DTCFINAL on 2026-10-07; filenames match the remote migration history. The fourth normalizes inherited default grants without changing RLS or existing rows. See the [activation record](DTC_OUTCOMES_CHILE_ACTIVATION.md).
2. Verify live owner reads, server-only writes, schema access and atomic capture with synthetic accounts.
3. Verify the implemented capture/review UI, repeated-submission idempotency and follow-up completion against live synthetic accounts; complete the separate evidence-verification operations.
4. Import reviewed official benchmarks with documented definitions, dimensions, periods and immutable source versions.
5. Verify the complete user flow in a Preview, including 390×844 mobile, before production release.

Known calculation limits: reads have a fixed creation cutoff and explicit pagination/count/duplicate checks, but the four tables are not read in a single transactional snapshot; same-count concurrent updates can change evidence. A per-table 20,000-row safety cap fails explicitly instead of returning partial metrics. Net salary changes are nominal and are not normalized for hours, inflation or changed functions. A late follow-up records the person's state when answering and does not independently establish their state on the exact horizon date.

Production schema and public UI were not changed in this development block. The canonical ledger is `docs/dtc/DTC_CLOSURE_LEDGER.md`.
