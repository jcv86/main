# Mis resultados laborales — Outcomes Chile experience

Development block: 2026-10-07. Repository: `jcv86/main`. PR: [#233](https://github.com/jcv86/main/pull/233).

## Intended experience

`/despega/resultados-laborales` gives an authenticated person a place to record job-search events, employment changes and dated monthly net income; review the observed evolution; and answer due employment follow-ups. It is accessible from **Tu espacio → Resultados laborales** and inherits the canonical server-side `/despega` journey guard. The page is private, excluded from indexing and permits browser zoom.

The interface uses the existing DTC shell, page primitives and visual tokens. Loading, no records, service unavailability, expired sessions, validation failures and unconfirmed writes each have a recovery path. Form drafts and request keys remain in component memory while the screen stays mounted. They are not written to localStorage or sessionStorage, and are not restored after closing or navigating away from the screen.

The three capture forms distinguish what happened, the date of the observation and its context. Events use an explicitly labelled device-local date/time, converted to a zoned timestamp. Employment and income dates use the Chile calendar. The initial income must precede the later income for a baseline comparison. Numeric zero is valid; missing evidence is not displayed as zero. A recorded decrease stays negative.

## Read contract

`GET /api/outcomes/chile` keeps the existing summary and `impact` fields and adds `workspace`. The read model uses the same eligibility rules and creation cutoff as the impact engine. Future observations, invalid salary values and follow-ups without an eligible employment record cannot become current history or selectable jobs.

| Field | Meaning and limit |
|---|---|
| `asOfDate` | Calendar date in `America/Santiago` at computation time |
| `employmentOptions` | Up to 100 most recent eligible jobs, with their title, date and verification |
| `followups` | Up to 60 follow-ups; those that can be answered take priority, with completed rows later |
| `history` | Up to 30 most recent observed events, employment changes, salary measurements and valid completed follow-ups |
| Counts and `*Truncated` flags | Explicitly state when a presentation list is bounded |

These presentation limits do not limit aggregate calculations. The underlying service continues to paginate owner-scoped data, checks exact row counts and duplicate IDs, and fails explicitly above its 20,000-row per-table safety cap. Its bounded reads are not a transactional snapshot across tables.

The UI eligibility flag is advisory. The server independently checks the authenticated owner, due date, completion and verification status when writing. An early, invalid or future completion timestamp is labelled as requiring review; it is not represented as a valid completed follow-up. Corroborated and verified records cannot be overwritten through personal capture.

Official Chile labor-income references, when available, remain source-labelled context with a dated cutoff. Their definition has not been harmonized with monthly net income, so the interface does not calculate a personal-versus-market salary delta. Annualization is a conditional projection, and neither a salary increase nor a completed follow-up establishes a causal effect of DTC. A late follow-up records the person's state when answering, not independent proof of their state on the exact scheduled date.

## Atomic writes and retries

Every supported POST requires a UUID `requestId`. The session provides `user_id`. The server normalizes the allowed payload and ignores client attempts to assign verification, evidence references, identity or completion timestamps.

| Action | Required business fields | Success |
|---|---|---|
| `job_search_event` | `eventType`, `occurredAt` | 201 with `{ data: savedRecord }` |
| `employment_outcome` | `outcomeType`, `effectiveDate`, `roleTitle` | 201; the employment and all three follow-ups commit together |
| `salary_outcome` | `measurementRole`, integer `monthlyNetClp`, `measuredAt` | 201; an optional employment link must belong to the same person |
| `complete_followup` | `followupId`, boolean `employmentActive`, boolean or null `sameRole` | 200; inactive employment requires `sameRole: null` |

The service-only `SECURITY INVOKER` function `capture_dtc_chile_outcome` reserves a unique `(user_id, request_id)` key in a private ledger, checks the request and relevant record state, makes the mutation and saves its response in one transaction. The same normalized request returns that saved response on retry, including its original record ID and completion time. Reusing a key for a different action or payload returns 409. Failed writes roll back their reservation as well as any inserted evidence.

Two browser submissions in the same form share a synchronous lock. A form also remembers which normalized drafts have been confirmed, and preserves the same key after a lost response, timeout or temporary failure. An explicit new-record action resets that form's request history. The database key, rather than the UI lock, protects concurrent requests.

The request ledger contains private submitted payloads and responses. Browser roles cannot select or mutate it; records are retained with the owner and removed when that auth user is deleted. This block does not introduce a scheduled retention policy.

### Failure responses

All responses are private and `no-store`, including CDN responses. Session absence returns 401. Input validation returns 422; malformed or unsupported requests return 400. Known conflicts return 409 with `IDEMPOTENCY_KEY_REUSED`, `FOLLOWUP_NOT_DUE`, `FOLLOWUP_ALREADY_COMPLETED` or `FOLLOWUP_VERIFICATION_LOCKED`. A missing or other-owner follow-up has the same 404 response. Database details and personal payloads do not appear in client errors or application error logs.

## Verification and release boundary

Runtime commands and evidence live with the source:

- `npm run check:outcomes-chile-all`: financial calculations, strict capture validation, SDK/HTTP transport with synthetic dependencies, benchmarks, full owner-scoped summary pagination, and workspace eligibility/limits.
- `scripts/outcomes-chile-database-lab.mjs`: ordered migrations, actual SQL transactions and RLS, retry replay, owner isolation, follow-up guards, and rollback behavior in a dedicated disposable database.
- `scripts/outcomes-chile-ui-lab/`: the actual React experience rendered in Chromium with synthetic API responses, canonical CSS, responsive and accessibility checks, and retry/double-submit scenarios. The browser lab does not exercise real Auth, PostgREST or a live Supabase database.
- Existing repository authentication, shell, design, TypeScript and production-build gates continue to apply.

The dedicated workflow is `.github/workflows/outcomes-chile.yml`. Remote check results must be assessed on the current PR head, and the Vercel Preview must identify that same source commit. A READY deployment alone does not prove a working database or an authenticated end-to-end journey.

### Local development evidence, 2026-10-07

The rendered browser gate finished **GO, 15/15 scenarios**, using Chromium 153.0.8010.0, Playwright 1.62.1, axe-core 4.14.0 and the actual local Next build's Montserrat files. It produced 11 screenshots; 390×844 mobile and 1440×960 desktop had no horizontal overflow, and both axe audits reported zero violations. Visual review checked the layout as well. The report records source hashes and whether the working tree differs from its base commit; an uncommitted local run is not represented as the base commit's UI.

The cases cover keyboard navigation/focus, a present source-labelled benchmark, loading and unavailable reads, empty history, zero/negative/ambiguous income, required fields, one committed synthetic write after a lost response and retry, synchronous double click, draft preservation across tabs and failed refresh, expired sessions, follow-up completion, optional unspecified role, future dates, and starting another record without submitting it. The audit exposed and verified fixes for insufficient button contrast and a reused button's unintended form submission. Conflicting income now says **Por revisar** or **Por seleccionar**, rather than falsely claiming no record exists.

The eight runtime groups, repository types, existing critical/authentication and shell contracts, and the production build passed. The build retains the already classified Supabase Edge compatibility warning. SQL/PGlite verified the sequential mutation and isolation scenarios; the native PostgreSQL 17 CI path is the required evidence for the two actual lock-contention cases. Browser fixtures exercise the real UI with synthetic transport; the SQL and API checks provide separate evidence at their respective boundaries. They do not replace live authenticated integration after schema activation.

The CI browser runner uses the same pinned isolated tools. When no Next font output is present, it records an explicit Arial fallback; the local Montserrat review remains separately identified. The release verdict for this development block is **CONDITIONAL_GO**: code and isolated behavior are verified, with production activation still governed by C18.

### Supabase activation — 2026-10-07

The user authorized continuation into integration and activation after reviewing the development block. Four ordered migrations are now installed in DTCFINAL: `20261007143246_dtc_outcomes_chile_foundation.sql`, `20261007143340_dtc_outcomes_chile_atomic_capture.sql`, `20261007143341_dtc_outcomes_chile_idempotent_capture.sql`, then `20261007143343_dtc_outcomes_chile_explicit_privileges.sql`. Local filenames match the versions assigned by the migration service; the three original SQL bodies retain their reviewed SHA-256 hashes.

The fourth migration removes privileges inherited from Supabase defaults, then grants only the intended operations. Remote checks confirmed seven RLS-enabled and forced tables, 168 correct effective privilege assertions, six SELECT policies, two service-only invoker functions, the owner-bound constraints and the employment trigger. No existing application rows were rewritten.

The national INE ESI 2025 mean and median are installed with their publication date and exact source reference. The [reviewed manifest and import contract](DTC_OUTCOMES_CHILE_OFFICIAL_IMPORT.md) retain the source definitions and limitations; the personal income gap remains unavailable until definitions are harmonized.

The real Auth → Next → PostgREST → database → browser test is maintained in `scripts/outcomes-chile-live/`. Its fourth execution on application `f3f2110c5f67416bc0973d098d1391d8a438d6c8`, Preview `6ukwtlrn7`, passed **14/14 functional cases**, including four browser subcases with actual mobile capture, reload/retry, due follow-up persistence, desktop owner isolation and real signout. The protected page returned through its 307 to signin 200, and the signed-out API returned 401. The two screenshots received independent visual review. Source hashes and the tool/documentation-only local differences are identified in the [activation record](DTC_OUTCOMES_CHILE_ACTIVATION.md).

The [original V4 report](evidence/outcomes-chile-2026-10-07/integration-v4.json) remains **NO_GO** because cleanup lost access before completing. A separately reviewed transaction through the Supabase connector removed the one remaining synthetic Auth owner and both invitations. Independent reads confirmed both users absent, zero identities/sessions/refresh tokens/Storage objects, both invitations absent, and all 18 owner/relation cascade counts at zero. The [RECOVERED report](evidence/outcomes-chile-2026-10-07/recovery-v4.json) links the unmodified original report and reviewed SQL by hash. This recovery did not repeat Auth Admin HTTP 404 checks or requests with discarded tokens.

The live browser recorded zero unhandled page exceptions, but **15 mobile and 4 desktop console error events** whose causes were not captured. Those counts precede signout; the expected later 401 does not explain them. They must be classified before production approval. The combined block is **CONDITIONAL_GO for release preparation**, with functional evidence and resource recovery separately verified; application publication and console classification remain under DTC-C18. The separate [operator review procedure](DTC_OUTCOMES_CHILE_OPERATOR_REVIEW.md) is retained as DTC-C20 in the [canonical closure ledger](DTC_CLOSURE_LEDGER.md): capture remains `self_reported`, and corroboration, verification, rejection and correction require that future operation.
