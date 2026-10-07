-- Normalize DTC Outcomes Chile privileges after all three schema migrations.
-- Supabase projects can grant ALL to API roles through default privileges.
-- GRANT alone does not remove those existing rights. Reset only these seven
-- new tables; preserve their RLS policies and all other application objects.

revoke all on table
  public.dtc_job_search_events,
  public.dtc_employment_outcomes,
  public.dtc_salary_outcomes,
  public.dtc_outcome_followups,
  public.dtc_chile_benchmarks,
  public.dtc_outcome_verifications,
  public.dtc_outcome_write_requests
from public, anon, authenticated, service_role;

-- Users retain the existing owner-filtered SELECT policies. Official benchmark
-- SELECT remains available to authenticated users. No browser role may write.
grant select on table
  public.dtc_job_search_events,
  public.dtc_employment_outcomes,
  public.dtc_salary_outcomes,
  public.dtc_outcome_followups,
  public.dtc_chile_benchmarks,
  public.dtc_outcome_verifications
to authenticated;

-- The trusted application boundary needs CRUD on evidence and benchmarks;
-- schema maintenance, trigger creation, REFERENCES and TRUNCATE are unnecessary.
grant select, insert, update, delete on table
  public.dtc_job_search_events,
  public.dtc_employment_outcomes,
  public.dtc_salary_outcomes,
  public.dtc_outcome_followups,
  public.dtc_chile_benchmarks,
  public.dtc_outcome_verifications
to service_role;

-- Request history is private and survives normal server operations. Its
-- auth.users foreign key still removes it when the owner is deleted.
grant select, insert, update on table public.dtc_outcome_write_requests
to service_role;
