create table if not exists public.assessment_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_type text not null check (assessment_type in ('c1', 'a1')),
  schema_version integer not null default 1 check (schema_version > 0),
  current_question integer not null default 0 check (current_question >= 0),
  answers jsonb not null default '{}'::jsonb,
  timings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, assessment_type),
  check (jsonb_typeof(answers) = 'object'),
  check (jsonb_typeof(timings) = 'array'),
  check (pg_column_size(answers) + pg_column_size(timings) <= 65536)
);

alter table public.assessment_drafts enable row level security;

revoke all on table public.assessment_drafts from public, anon, authenticated;
grant select, insert, update on table public.assessment_drafts to authenticated;
grant select, insert, update, delete on table public.assessment_drafts to service_role;

create policy assessment_drafts_select_own on public.assessment_drafts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy assessment_drafts_insert_own on public.assessment_drafts
  for insert to authenticated with check ((select auth.uid()) = user_id and completed_at is null);
create policy assessment_drafts_update_own on public.assessment_drafts
  for update to authenticated using ((select auth.uid()) = user_id and completed_at is null)
  with check ((select auth.uid()) = user_id);

create index if not exists assessment_drafts_updated_at_idx
  on public.assessment_drafts (user_id, updated_at desc);
