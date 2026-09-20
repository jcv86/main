# V1 analytics storage

`/api/v1-analytics` authenticates every request and derives event ownership from
the server-side Supabase session. The endpoint accepts only enumerated events,
stages and metadata fields; free-form responses are not analytics data.

## Write boundary

The browser sends only:

- an enumerated event name;
- the stage;
- a generated session identifier;
- allowlisted metadata: question index, bounded duration/time-on-page, categorical
  error type, device class and bounded retry count.

The browser does **not** send user ownership or an event timestamp. The API
derives `user_id` from `supabase.auth.getUser()` and owns the timestamp. The
strict Zod schema rejects unknown fields, mismatched event/stage pairs and
free-form metadata.

Writes use the authenticated Supabase client so owner RLS is enforced. Analytics
is best-effort: storage failure returns HTTP 202 with `stored: false` and never
blocks the DTC journey.

## Read boundary

The GET endpoint requires an authenticated `superadmin` role. Reads are limited
to a 1–90 day observation window and at most 10,000 rows. Returned metrics are
aggregated counts/rates; raw assessment answers are not part of the analytics
schema.

## Raw-event retention

The base `secure_v1_analytics` migration sets `expires_at` to at most 90 days
after `created_at`, forces RLS and hides expired rows from owner reads.

The DTC-C16 closure migration
`20260920132000_close_v1_analytics_retention.sql` additionally:

- reconciles legacy grants so `authenticated` has only `SELECT` and `INSERT`
  on the table plus the minimum sequence privileges;
- revokes anonymous table/sequence access;
- removes already-expired rows when the migration is applied;
- enables Supabase Cron / `pg_cron`;
- schedules `dtc-v1-analytics-retention-daily` at 04:17 UTC;
- physically deletes only rows where `expires_at <= now()`.

This migration must pass the DTC-C16 CI gate before any remote application. The
repository does not treat query-window minimization as equivalent to physical
retention.
