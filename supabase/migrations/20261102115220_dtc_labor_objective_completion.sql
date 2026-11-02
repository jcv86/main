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
alter table public.career_search_intents alter column location_preference set default 'unspecified';
alter table public.career_search_intents alter column location_preference set not null;

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
