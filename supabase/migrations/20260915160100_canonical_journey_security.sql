-- Canonical journey RLS and server-only initializer.
-- Keeps the live RPC signature while removing client/Data API execution.

alter table public.despega_user_profiles enable row level security;
drop policy if exists despega_user_profiles_demo_read on public.despega_user_profiles;
drop policy if exists "Users can view own despega profile" on public.despega_user_profiles;
drop policy if exists "Users can insert own despega profile" on public.despega_user_profiles;
drop policy if exists "Users can update own despega profile" on public.despega_user_profiles;
drop policy if exists despega_user_profiles_owner_all on public.despega_user_profiles;
create policy despega_user_profiles_owner_all
  on public.despega_user_profiles
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter table public.despega_journey_state enable row level security;
drop policy if exists journey_state_select_own on public.despega_journey_state;
create policy journey_state_select_own
  on public.despega_journey_state
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.ensure_despega_journey_state(
  p_user_id uuid default auth.uid()
)
returns public.despega_journey_state
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_state public.despega_journey_state;
  v_profile public.despega_user_profiles;
  v_actor uuid := auth.uid();
begin
  if p_user_id is null or (v_actor is not null and p_user_id <> v_actor) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select profile.*
    into v_profile
    from public.despega_user_profiles as profile
   where profile.user_id = p_user_id
   limit 1;

  insert into public.despega_journey_state (
    user_id, current_module, a1_completed_at, a3_unlocked_at, a4_unlocked_at
  ) values (
    p_user_id,
    case
      when coalesce(v_profile.a4_unlocked, false) then 'A4'
      when coalesce(v_profile.a3_unlocked, false) then 'A3'
      when coalesce(v_profile.a2_route_generated, false) then 'A2'
      else 'A1'
    end,
    case when coalesce(v_profile.a1_cerebral_completed, false)
      then coalesce(v_profile.a1_test_completed_at, now()) end,
    case when coalesce(v_profile.a3_unlocked, false) then now() end,
    case when coalesce(v_profile.a4_unlocked, false) then now() end
  )
  on conflict (user_id) do nothing;

  select state.* into v_state
    from public.despega_journey_state as state
   where state.user_id = p_user_id;
  return v_state;
end;
$$;

revoke execute on function public.ensure_despega_journey_state(uuid) from public;
revoke execute on function public.ensure_despega_journey_state(uuid) from anon, authenticated;
grant execute on function public.ensure_despega_journey_state(uuid) to service_role;
