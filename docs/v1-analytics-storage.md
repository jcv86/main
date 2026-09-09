# V1 analytics storage

`/api/v1-analytics` authenticates every request and derives event ownership from
the server-side Supabase session. The endpoint accepts only enumerated events,
stages and metadata fields; free-form responses are not analytics data.

The existing `public.v1_analytics` table is used through the server-only admin
client because its historical RLS script does not define a safe authenticated
insert policy. If the table is absent or unavailable, event collection returns
HTTP 202 with `stored: false`; product journeys continue and the limitation is
visible to the caller instead of producing a missing-route 404.

Admin reads are limited to a 1–90 day observation window and 10,000 rows. This
is query-window minimization, not physical deletion. Database retention remains
pending until a reviewed migration or scheduled deletion policy is explicitly
authorized. No remote migration is part of this change.
