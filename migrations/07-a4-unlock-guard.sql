-- Defense-in-depth guard for the canonical A3 -> A4 rule.
-- Any legacy writer that tries to unlock A4 before the verified A3 route closes
-- is normalized back to A2/A3. The final A3 RPC writes route_completed_at first,
-- so its journey/profile updates are allowed in the same transaction.

create or replace function public.enforce_a4_requires_a3_completion()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_a3_complete boolean;
begin
  select exists (
    select 1
    from public.a3_route_progression route
    where route.user_id = new.user_id
      and route.route_completed_at is not null
  ) into v_a3_complete;

  if v_a3_complete then
    return new;
  end if;

  if tg_table_name = 'despega_journey_state' then
    new.a4_unlocked_at := null;
    if new.current_module = 'A4' then
      new.current_module := case
        when new.a3_unlocked_at is not null then 'A3'
        else 'A2'
      end;
    end if;
  elsif tg_table_name = 'despega_user_profiles' then
    new.a4_unlocked := false;
    new.a4_unlocked_at := null;
    if new.current_stage = 'a4' then
      new.current_stage := case
        when coalesce(new.a3_unlocked, false) then 'a3'
        else 'a2'
      end;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_a4_requires_a3_completion()
from public, anon, authenticated;

drop trigger if exists enforce_a4_journey_completion
  on public.despega_journey_state;
create trigger enforce_a4_journey_completion
before insert or update of current_module, a4_unlocked_at
on public.despega_journey_state
for each row
execute function public.enforce_a4_requires_a3_completion();

drop trigger if exists enforce_a4_profile_completion
  on public.despega_user_profiles;
create trigger enforce_a4_profile_completion
before insert or update of a4_unlocked, a4_unlocked_at, current_stage
on public.despega_user_profiles
for each row
execute function public.enforce_a4_requires_a3_completion();
