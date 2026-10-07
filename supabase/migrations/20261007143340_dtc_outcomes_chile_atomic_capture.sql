-- DTC Outcomes Chile: capture employment and its follow-ups in one transaction.
-- Apply after 20260930200000_dtc_outcomes_chile_foundation.sql and before
-- deploying the capture path that relies on this trigger. PostgreSQL 17+.
-- Existing records are not rewritten; inconsistent cross-owner links fail
-- constraint validation so they can be reviewed instead of silently reassigned.

do $$
begin
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.dtc_employment_outcomes'::regclass
      and conname = 'dtc_employment_outcomes_id_user_key'
  ) then
    alter table public.dtc_employment_outcomes
      add constraint dtc_employment_outcomes_id_user_key unique (id, user_id);
  end if;

  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.dtc_salary_outcomes'::regclass
      and conname = 'dtc_salary_outcomes_employment_owner_fkey'
  ) then
    alter table public.dtc_salary_outcomes
      add constraint dtc_salary_outcomes_employment_owner_fkey
      foreign key (employment_outcome_id, user_id)
      references public.dtc_employment_outcomes (id, user_id)
      on delete set null (employment_outcome_id);
  end if;

  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.dtc_outcome_followups'::regclass
      and conname = 'dtc_outcome_followups_employment_owner_fkey'
  ) then
    alter table public.dtc_outcome_followups
      add constraint dtc_outcome_followups_employment_owner_fkey
      foreign key (employment_outcome_id, user_id)
      references public.dtc_employment_outcomes (id, user_id)
      on delete cascade;
  end if;
end
$$;

-- The foundation's follow-up unique key already indexes user_id + outcome ID.
-- Salary measurements also need an index for the relationship and deletion path.
create index if not exists dtc_salary_outcomes_employment_owner_idx
  on public.dtc_salary_outcomes (employment_outcome_id, user_id)
  where employment_outcome_id is not null;

-- Do not rely on project-level default grants. BYPASSRLS does not grant table
-- privileges: the trusted server role needs these explicit privileges too.
grant usage on schema public to service_role;
grant select, insert, update, delete on table
  public.dtc_job_search_events,
  public.dtc_employment_outcomes,
  public.dtc_salary_outcomes,
  public.dtc_outcome_followups,
  public.dtc_chile_benchmarks,
  public.dtc_outcome_verifications
to service_role;

create or replace function public.dtc_schedule_employment_followups()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  insert into public.dtc_outcome_followups (
    user_id, employment_outcome_id, followup_day, due_at, verification_status
  )
  select new.user_id, new.id, horizon.day, new.effective_date + horizon.day,
    'self_reported'
  from (values (30), (90), (180)) as horizon(day);

  -- An insertion error propagates to the employment statement. Neither the
  -- employment record nor a partial follow-up schedule can be committed.
  return new;
end
$$;

-- This is an invoker trigger, not a client-callable privileged RPC.
revoke all on function public.dtc_schedule_employment_followups()
  from public, anon, authenticated;
grant execute on function public.dtc_schedule_employment_followups()
  to service_role;

drop trigger if exists dtc_schedule_employment_followups
  on public.dtc_employment_outcomes;
create trigger dtc_schedule_employment_followups
  after insert on public.dtc_employment_outcomes
  for each row execute function public.dtc_schedule_employment_followups();

comment on function public.dtc_schedule_employment_followups() is
  'Server-invoked capture: employment and its 30/90/180-day follow-ups commit or roll back together.';
