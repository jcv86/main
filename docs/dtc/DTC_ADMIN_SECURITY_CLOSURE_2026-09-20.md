# DTC administrative security closure — 2026-09-20

## Applied controls

### V1 analytics retention

Production migration `close_v1_analytics_retention` is applied in DTCFINAL.

Verified live:

- `authenticated`: SELECT + INSERT only on `public.v1_analytics`;
- no UPDATE / DELETE / TRUNCATE;
- `anon`: no table read and no sequence usage;
- `pg_cron` 1.6 installed;
- one active job `dtc-v1-analytics-retention-daily`;
- schedule: 04:17 UTC daily;
- purge condition: `expires_at <= now()`;
- expired rows at verification: 0.

### pgvector extension schema

Supabase security advisor previously reported `vector` installed in `public`.

Preflight used a transaction + rollback and verified:

- pgvector 0.8.0 is relocatable;
- existing vector columns remain bound to the same type after relocation;
- vector distance operations still execute after relocation.

Production migration `move_vector_extension_out_of_public` moved the extension to
`extensions`. A fresh advisor run no longer reports `extension_in_public`.
Seven existing vector-backed columns/index attributes remain present.

## Intentional SECURITY DEFINER exception

Supabase continues to warn that
`public.complete_a2_mission(uuid,jsonb)` is executable by `authenticated`.

This is an intentional authenticated RPC, not an unreviewed grant:

- the current server route invokes it with the user's JWT;
- the function derives ownership from `auth.uid()`;
- unauthenticated callers fail;
- it enforces the unlocked-day boundary;
- all writes bind to the authenticated user;
- `search_path` is explicitly empty;
- `PUBLIC` and `anon` do not have EXECUTE;
- `authenticated` and `service_role` are the intentional executable roles.

The advisor is therefore retained as a documented exception unless the architecture
is later changed to move this operation behind a service-role-only API.

## Remaining platform controls

These are still open because the currently connected management surface does not
expose safe mutation actions for them:

1. Supabase Auth leaked-password protection is disabled.
2. Supabase reports security patches available for
   `supabase-postgres-17.4.1.054`.
3. GitHub repository rulesets list is empty; the connected GitHub surface can read
   rulesets but does not expose a create/update ruleset action.

These controls must not be marked complete until changed through their respective
management surfaces and re-verified.
