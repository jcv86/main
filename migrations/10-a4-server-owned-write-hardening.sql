begin;

-- A4 writes are validated and authorized by server routes using service_role.
-- Authenticated clients keep owner-scoped read access but cannot bypass those routes.
revoke all on public.a4_verified_signals from anon, authenticated;
revoke all on public.a4_decision_log from anon, authenticated;

grant select on public.a4_verified_signals to authenticated;
grant select on public.a4_decision_log to authenticated;
grant all on public.a4_verified_signals to service_role;
grant all on public.a4_decision_log to service_role;

drop policy if exists "Users create own verified signals"
  on public.a4_verified_signals;
drop policy if exists "Users update own verified signals"
  on public.a4_verified_signals;
drop policy if exists "Users delete own verified signals"
  on public.a4_verified_signals;

drop policy if exists "Users create own decisions"
  on public.a4_decision_log;
drop policy if exists "Users update own decisions"
  on public.a4_decision_log;
drop policy if exists "Users delete own decisions"
  on public.a4_decision_log;

-- Trigger functions do not need to be directly executable through the Data API.
revoke all on function public.set_a4_canonical_updated_at()
  from public, anon, authenticated;
grant execute on function public.set_a4_canonical_updated_at()
  to service_role;

comment on table public.a4_verified_signals is
  'Canonical A4 evidence log. Owner-readable; all writes are server-owned and pass canonical validation.';
comment on table public.a4_decision_log is
  'Canonical A4 decision register. Owner-readable; all writes are server-owned and pass canonical validation.';

commit;
