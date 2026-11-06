# DTC UAT: isolated application preparation

Date: 2026-11-06. Branch: `uat/dtc-20261106`.
Base: `7f11f1763210fd87bcd4c2c372efa8705f42f468` (`main`, PR #246).

## Current decision: run on the UAT branch

The owner declined provisioning another Supabase project and requested work on
a separate branch. The active path is `uat/dtc-20261106` with the existing
disposable local-Supabase browser laboratory in GitHub Actions. No paid backend
provisioning or Supabase dashboard sign-in is required for this path.

`.github/workflows/a1-browser-qa.yml` now runs on pushes to this exact UAT branch.
Checkout, evidence names and the source manifest use the pushed SHA; the existing
pull-request trigger is preserved. The runner uses Node.js 22, creates its own
local Supabase/Docker stack and synthetic Auth users, and stops it at the end.
The source-isolation and rate-limit checks run before the browser suite. No
production secrets, remote migrations or deployments are part of the job.

The laboratory validates real local Auth, cookies, PostgREST, owner RLS,
persistence, reloads, selected journey boundaries, mobile and accessibility.
Its support schema and login surface are fixtures. Passing the job does not
validate hosted Vercel behavior, the full email-login page, external OAuth,
real AI/offers, human usability or all 54 acceptance cases. Record results by
the actual workflow run and SHA after completion; no new pass is claimed here.

Automatic Vercel deployment is disabled only for `uat/dtc-20261106` through
`git.deploymentEnabled`, following the
[Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).
The existing hosted isolation guards remain intact. The earlier Preview attempt
on SHA `367c573e13b15c4c12dbe8613e2d5d5dccb8bfd4` ended in ERROR; it is not a
participant UAT site. The empty separate Vercel project remains unused.

## Earlier hosted preparation (inactive proposal)

The initial preparation targeted a **separate UAT application and Supabase project**
for the acceptance matrix `DTC_UAT_2026-11-06.xlsx`. That hosted proposal is now
inactive. This branch is not a production release and must
not be merged into `main` or deployed on the existing production project.

Status: application isolation prepared; hosted backend provisioning and remote
acceptance pending. The previous release's 27 successful workflows are baseline
evidence, not results of the new environment. No participant acceptance, new
remote Auth run, database migration or full remote journey is claimed here.

The new project requires its own verified schema, Auth configuration, storage and
synthetic accounts. No production profiles, answers, CVs, objects, users or
credentials are copied. Creating a project does not by itself close this gate.

## Deployment contract

`vercel.json` has no cron schedules and calls `npm run build:uat`. Its first step
refuses the build before application compilation unless the UAT contract passes.
An automatic Preview on the original project must fail this step; it must never
be used to run acceptance with the production-connected configuration.
The regular `prebuild` hook applies the same requirement on Vercel, protecting
against an inherited project command that calls `npm run build` directly. Local
non-UAT source compilation can still use the existing synthetic CI fixtures.

The separate empty Vercel project has been created and read back as `dtc-uat`,
ID `prj_gPYDgxY36roxVZxPfGGtssDPxJzv`, Node.js 22, under the existing DTC team.
Its build command is `npm run build:uat`, its install command is the existing
legacy-peer-deps command, and Vercel Authentication is enabled. At preparation
time it has no deployment or Git link and only the non-secret UAT marker is set.
The domain `dtc-uat.vercel.app` is assigned and verified in Vercel. Use
`https://dtc-uat.vercel.app` as the canonical origin when the isolated backend is
ready. Assignment does not mean that an application has been deployed there.

| Variable | Required value / behavior |
|---|---|
| `DTC_ENVIRONMENT` | Exactly `uat`. Required by the UAT build. |
| `DTC_UAT_SUPABASE_REF` | The newly provisioned project's 20-letter reference. Production's reference is denied. |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<DTC_UAT_SUPABASE_REF>.supabase.co`, with no alternate path or credentials. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key obtained from that new project only. Legacy JWT keys are also checked for a conflicting project reference. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key obtained from that new project only. Never write its value to this repository, browser code, reports or screenshots. |
| `NEXT_PUBLIC_APP_URL` | Verified HTTPS canonical origin of the new UAT application. Production domains and the old Vercel project hostnames are denied. |
| `SUPABASE_URL` | Omit, or use exactly the same UAT backend. |
| `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `NEXTAUTH_URL` | Omit unless used, or set to the same UAT application origin. |
| `VERCEL_URL` | Platform-provided hostname of the actual deployment; allows inspection of that immutable UAT deployment in addition to the canonical alias. |
| `POSTGRES_*`, `DATABASE_URL` | Omit. This application uses the Supabase HTTP clients; inherited database connections are rejected. |
| `RESEND_API_KEY` | Omit. Application email delivery is disabled in UAT. |
| `NEXT_PUBLIC_OPENAI_API_KEY`, `NEXT_PUBLIC_CRON_SECRET`, public service-role aliases | Omit. A public credential alias is rejected. |

Provision any external provider separately when a case actually requires it.
Do not inherit the production project's environment variable set. A fake key,
synthetic fixture or fallback result cannot satisfy a real-provider UAT case.

The runtime middleware checks the environment and incoming origin **before**
refreshing sessions or reaching a database. With valid configuration it adds:

- `X-DTC-Environment: uat`;
- `X-DTC-UAT-Backend: <new project reference>`;
- `X-Robots-Tag: noindex, nofollow, noarchive` and private/no-store caching.

These headers identify the configured target; the remote smoke must additionally
observe actual Auth traffic and persistence on the new backend. A label alone
does not demonstrate isolation. Invalid configuration returns 503; an unexpected
origin returns 403. No credential is returned in these responses.

## External actions and UI

Cron routes, email API routes and the contact delivery route return a UAT-specific
403 before their handlers run. The shared server email helper also refuses UAT
delivery, including calls made outside an API handler. There are no scheduled
jobs in this branch. This does not change the source collector or weaken its
production checks.

The root page carries an environment notice and noindex metadata. Optional public
analytics widgets are disabled for UAT. The actual AppShell, pages, forms and
authorization checks remain in place.

## Authentication and returning users

The existing `/auth/email-login` and `/api/auth/email-login` use real Supabase
password authentication. This preparation removes inaccurate legacy demo copy,
adds form labels and returns successful login to the canonical journey or a
validated internal `next` path. It does not accept arbitrary passwords, mint
sessions, grant pilot access or add a QA login endpoint.

Preparation reproduced a returning-user risk in the existing rate limiter:
API, Auth and AI limiters shared one IP counter, so normal draft API activity
could exhaust the lower Auth threshold before a real returning login. The
counter now belongs to each limiter instance. `test-rate-limit-isolation.mjs`
failed before the change and passed afterward; it also verifies that the Auth
threshold still rejects excess attempts and that a separate IP has its own quota.
Thresholds and windows are unchanged. This correction is only on the UAT branch.

Provision synthetic accounts and pilot membership in the new backend through its
normal authorized administration path. A valid password is not sufficient to
bypass the existing `resolve_pilot_access` guard. Test a new member, a returning
member and a second owner with distinct data.

Google/LinkedIn buttons keep their existing behavior. To test them, configure the
new Supabase project's providers and exact callback/redirect origins. Password
acceptance does not pass the external OAuth case. Do not silently redirect an
unconfigured provider to production.

## Schema reconstruction prerequisite

The repository contains incremental and legacy SQL across `supabase/migrations`,
`migrations` and `scripts`. These are not asserted to be a complete bootstrap of
an empty hosted database. The local browser laboratory creates reduced fixture
tables; those fixture schemas must not be presented as a faithful full UAT schema.

The backend work must produce a schema-only baseline with required functions,
triggers, grants, RLS, views and extensions, compare it with the required application
boundary and apply it only to the identified new project. Seed only documented
synthetic data and public catalog fixtures. Never run an unreviewed reset or a
production data export to create the UAT environment.

Backend preparation is tracked separately in
`DTC_UAT_BACKEND_PREPARATION_2026-11-06.md`; the remote runner is under `scripts/uat`.
Do not remove the loopback guards from `scripts/a1-browser-qa` to target a remote
service.

## Verification and remaining gate

Focused checks: `npm run test:uat-isolation` checks valid configuration, missing
marker, production backend and domains, mismatched keys/origins, forbidden
inherited variables, request origin and disabled external-action paths using
synthetic values and no network access. The 16 configuration/build-boundary
checks and six real-middleware checks passed. TypeScript and the existing
production-laboratory retirement contract also passed. The remote runner has a
separate gate; its self-check is preparation evidence, not a remote product run.

The first local bundle attempt with the existing CI's synthetic credentials
generated 355/355 pages but exited 1 during final cleanup with `ENOTEMPTY` on
`.next/export`. Only generated `.next` output was removed. One clean retry on the
final application code, including the limiter correction, completed successfully
with exit 0 and 355/355 pages. This is a local source build on Node.js 24.22.1,
not a hosted UAT build or a connection to the new backend. The new Vercel project's
Node.js 22 build and remote acceptance remain pending. Sanitized source hashes
and results are recorded in `uat/preflight-20261106.json`.

Dependency observation: the pre-existing `package-lock.json` does not match the
current manifest and `npm ci` refuses it. The existing Vercel install command uses
`npm install --legacy-peer-deps --ignore-scripts --no-audit --no-fund --package-lock=false`.
No dependency version or lockfile is changed in this block. Exact dependency
parity with the November 2 deployment is not claimed; capture and freeze the
actual UAT resolution before treating its release candidate as reproducible.
`uat/dependencies-local-20261106.json` records the 90 direct dependencies and 939
installed packages used for local preparation. It was captured on Node.js 24.22.1;
the hosted project uses Node.js 22. It does not replace a hosted dependency lock
or claim that the two runtimes were already exercised identically.

Before starting acceptance, record the new Vercel project, deployment SHA and URL,
new Supabase reference, schema checks, Auth configuration and fixture identities.
Then execute new/returning login, write-refresh-resume, logout/back and cross-owner
denial. Record failures honestly and retain OAuth, external providers and the
remaining matrix cases as pending until they are actually observed.
