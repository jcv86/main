begin;

-- Existing owner RLS, active-primary unique index and updated_at trigger remain.
alter table public.career_search_intents
  add column if not exists functional_areas jsonb not null default '[]'::jsonb,
  add column if not exists objective_stage text not null default 'specific',
  add column if not exists unknown_industry_policy text not null default 'exclude',
  add column if not exists location_preference text;

-- Empty historical locations did not record an explicit "all regions" choice.
update public.career_search_intents
set location_preference = case when jsonb_array_length(locations) > 0 then 'selected' else 'unspecified' end
where location_preference is null;
-- A missing value must reach the BEFORE trigger as NULL. The previous server
-- does not write this column, including when it inserts a nonempty locations set.
alter table public.career_search_intents alter column location_preference drop default;
alter table public.career_search_intents alter column location_preference set not null;

-- Keep this compatibility bridge while the previous server is a rollback
-- candidate. It reads only NEW/OLD and never changes owner policies or grants.
create or replace function public.normalize_career_search_intent_location_preference()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
declare
  has_locations boolean := jsonb_array_length(new.locations) > 0;
begin
  if tg_op = 'INSERT' and new.location_preference is null then
    new.location_preference := case when has_locations then 'selected' else 'unspecified' end;
  elsif tg_op = 'UPDATE'
    and new.locations is distinct from old.locations
    and new.location_preference is not distinct from old.location_preference
    and ((new.location_preference = 'selected') is distinct from has_locations)
  then
    -- A legacy writer changed locations but left the preference untouched.
    -- An explicitly changed preference is never repaired: CHECK below validates
    -- it. An explicit unchanged value is indistinguishable here from omission;
    -- current APIs validate the requested combination before writing it.
    new.location_preference := case when has_locations then 'selected' else 'unspecified' end;
  end if;
  return new;
end;
$$;

create trigger normalize_career_search_intent_location_preference
before insert or update of locations, location_preference on public.career_search_intents
for each row execute function public.normalize_career_search_intent_location_preference();

comment on function public.normalize_career_search_intent_location_preference() is 'Temporary invoker-only compatibility bridge for previous-server location writes. Keep while that server is a rollback candidate; current APIs validate explicit preferences. CHECK and owner RLS remain authoritative.';

alter table public.career_search_intents drop constraint if exists career_search_intents_target_roles_check;
alter table public.career_search_intents
  add constraint career_search_intents_target_roles_check check (jsonb_typeof(target_roles) = 'array' and jsonb_array_length(target_roles) <= 8),
  add constraint career_search_intents_functional_areas_check check (jsonb_typeof(functional_areas) = 'array' and jsonb_array_length(functional_areas) <= 8),
  add constraint career_search_intents_objective_stage_check check (objective_stage in ('specific', 'exploring')),
  add constraint career_search_intents_specific_direction_check check (objective_stage = 'exploring' or jsonb_array_length(target_roles) > 0 or jsonb_array_length(functional_areas) > 0),
  add constraint career_search_intents_unknown_industry_check check (unknown_industry_policy in ('include', 'exclude')),
  add constraint career_search_intents_location_preference_check check (location_preference in ('unspecified', 'any', 'selected') and ((location_preference = 'selected') = (jsonb_array_length(locations) > 0)));

comment on column public.career_search_intents.functional_areas is 'User-confirmed functional areas, distinct from job titles and the employer industry. Legacy roles are not rewritten.';
comment on column public.career_search_intents.objective_stage is 'Exploring may have no role or area. Specific requires at least one direction; search breadth is independent.';
comment on column public.career_search_intents.unknown_industry_policy is 'Explicit inclusion or exclusion of vacancies whose employer industry lacks current reviewed evidence. Does not classify employers.';
comment on column public.career_search_intents.location_preference is 'Distinguishes unspecified geography, explicitly any region, and a selected set.';

commit;
