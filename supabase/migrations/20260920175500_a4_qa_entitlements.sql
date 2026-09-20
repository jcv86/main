create table if not exists public.a4_qa_entitlements (
 user_id uuid primary key references auth.users(id) on delete cascade,
 reason text not null check (length(trim(reason)) > 0),
 expires_at timestamptz not null,
 created_at timestamptz not null default now(),
 created_by text not null default 'admin_qa'
);
alter table public.a4_qa_entitlements enable row level security;
revoke all on public.a4_qa_entitlements from anon, authenticated;
comment on table public.a4_qa_entitlements is 'Service-only, time-limited QA bypass for A4 access checks. Never mutates canonical journey completion.';
