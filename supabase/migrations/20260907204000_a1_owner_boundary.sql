-- Candidate only. Apply through a reviewed migration window, never from application startup.
-- No user records are changed; existing owner permissions remain the permissive baseline.
-- Restrictive guards also protect against a future accidental broad permissive policy.
set lock_timeout = '5s';

alter table public.a1_cerebral_assessment enable row level security;
alter table public.canon_conozcamonos_1_responses enable row level security;
alter table public.canon_conozcamonos_2_responses enable row level security;

drop policy if exists a1_cerebral_assessment_demo_read on public.a1_cerebral_assessment;

drop policy if exists a1_strict_owner_boundary on public.a1_cerebral_assessment;
create policy a1_strict_owner_boundary on public.a1_cerebral_assessment
  as restrictive for all to anon, authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists c1_strict_owner_boundary on public.canon_conozcamonos_1_responses;
create policy c1_strict_owner_boundary on public.canon_conozcamonos_1_responses
  as restrictive for all to anon, authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists c2_strict_owner_boundary on public.canon_conozcamonos_2_responses;
create policy c2_strict_owner_boundary on public.canon_conozcamonos_2_responses
  as restrictive for all to anon, authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

reset lock_timeout;
