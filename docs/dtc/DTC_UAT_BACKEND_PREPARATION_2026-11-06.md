# DTC UAT backend preparation — 2026-11-06

## Current status

The owner authorized proceeding with a separate DTC-UAT environment in their account. The new Supabase project has **not been created**. The connector quoted **USD 10 per month** for a new project in the existing DespegaTuCarrera Pro organization. Acceptance of that recurring amount is still pending.

Prepared creation request:

| Field | Value |
| --- | --- |
| Name | `despegatucarrera-uat` |
| Organization | `DespegaTuCarrera` |
| Organization ID | `vercel_icfg_5mkHEEas6rh95cWNnpfJJzHu` |
| Region | `us-east-1` |
| Isolation | A new project, independent of DTCFINAL |
| Initial application origin | The stable URL of the separate DTC-UAT Vercel project; not yet recorded here |

The creation tool can present its cost confirmation flow. Do not fabricate a confirmation ID or call `confirm_cost` before the owner explicitly accepts the amount. No production mutations, new accounts, emails, schema changes or runtime UAT tests were performed during this preparation.

## Evidence collected through read-only metadata

DTCFINAL is `dcfrbwxbejtbcouionna`, region `us-east-1`, status `ACTIVE_HEALTHY`.

| Object | Count or observation |
| --- | --- |
| Public tables | 381; every table reports RLS enabled |
| Public sequences | 54 |
| Public views | 20 |
| Public routines | 140; 47 security definers |
| Public enums | 6 |
| Recorded migrations | 80 |
| Latest recorded migration | `20261102152815_dtc_labor_objective_completion` |
| Storage buckets | Empty inventory |
| Application trigger on Auth | `on_auth_user_created` calls `public.handle_oauth_user_creation` |

RLS-enabled metadata alone is not proof of correct authorization. The candidate still needs grant/policy checks and actual owner-isolation tests.

The repository at source commit `7f11f1763210fd87bcd4c2c372efa8705f42f468` contains 49 files under `supabase/migrations`, plus legacy schema scripts elsewhere. A complete clean-project replay is not demonstrated. The local acceptance laboratory deliberately uses minimal synthetic supporting schemas; its README excludes remote migrations and the full production environment.

## Schema preparation

Prepare a reviewed **schema-only baseline** of the active application structure, then reconcile it with the repository migrations. Preserve tables, constraints, indexes, enums, functions, triggers, grants, policies, view security options and the application Auth-user trigger. Capture object identity/digests and compare the resulting UAT structure with the source.

Use a fresh UAT project and verify its project reference differs from DTCFINAL before any write. Apply migrations through the appropriate migration tool only after the baseline and order are reviewed. Do not reinterpret the laboratory fixtures as a production-equivalent schema.

Reference data for UAT must be deliberately selected or synthetic. Production users, invitations, assessments, CVs, progress, documents, activity and Auth sessions are outside the clone scope. Native schedules, external webhooks and outbound jobs are not part of the initial fixture.

## Auth and access

The application has an existing password sign-in path:

- `/auth/email-login`
- `POST /api/auth/email-login`
- `supabase.auth.signInWithPassword` with real SSR cookies
- protected application routes subsequently call `resolve_pilot_access`

Synthetic accounts can therefore exercise real Auth, session persistence and application data access without adding a QA bypass. Provision them through the UAT Auth Admin API, with email already confirmed, and grant the intended UAT pilot entitlement. New-user, returning-user and owner-isolation cases must remain distinguishable in the evidence.

Set the UAT Site URL and exact allowed callback `<UAT_ORIGIN>/auth/callback` after the stable Vercel origin is known. Google/LinkedIn credentials and external callback exchange need their own UAT configuration and acceptance evidence; password-session smoke tests do not prove OAuth.

The existing email-login screen contains obsolete demo instructions and routes success to a fixed onboarding URL. These observations were passed to the application owner for the UAT branch.

The current Supabase connector exposes project creation, SQL/migrations, publishable-key retrieval and advisors. It does not expose Auth configuration, Auth Admin user creation or service-role-key retrieval. The root task owns the authorized dashboard/integration route for those remaining operations. The application requires its own UAT server credential; keys must stay in the deployment's secret configuration.

## Storage and external effects

No Supabase buckets were observed in DTCFINAL. Determine active file storage from the application source, including any Vercel Blob usage, before introducing a bucket. Each test-storage destination and policy must be specific to UAT.

For the initial UAT, keep scheduled ingestion, outgoing email and other background effects inactive. Add test integrations deliberately with bounded fixtures; record any provider-dependent journey that has not been exercised.

## Acceptance before declaring the environment ready

1. Verify the new Supabase reference, Vercel project and fixed source revision.
2. Verify required relations, functions, grants, RLS policies and Auth trigger.
3. Verify no production connection or production callback is configured.
4. Run the real password sign-in, first save, refresh and return flow.
5. Run a second synthetic owner and verify isolation.
6. Check recoverable session errors and unauthorized access.
7. Record which OAuth, file, AI and opportunity-provider cases remain untested.

## Current documentation consulted

- [Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)
- [Auth redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase changelog](https://supabase.com/changelog)

The November 2026 changelog announces CLI v3: database commands default to local, `--remote` selects a hosted target, and hosted mutations require confirmation. Check the actual installed CLI version and `--help`, pin the chosen version and follow the current flags instead of copying older deployment examples.

