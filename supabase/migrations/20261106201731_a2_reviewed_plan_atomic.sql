-- DTC-AG-03. Reviewed A2 plans are separate from chat, inferred memories and
-- canonical journey completion. This migration is applied only when scheduled;
-- no application startup code applies it and no remote database is required.
begin;
set local lock_timeout = '5s';

create schema if not exists dtc_private;
revoke all on schema dtc_private from public, anon, authenticated;
grant usage on schema dtc_private to service_role;

create table if not exists public.a2_reviewed_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id uuid not null unique default gen_random_uuid(),
  revision integer not null check (revision >= 1),
  status text not null check (status in ('active','paused','completed','cancelled','deleted')),
  content jsonb,
  context_snapshot jsonb,
  reviewed_at timestamptz not null,
  review_date date,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  unique (user_id, plan_id),
  check ((status = 'deleted' and content is null and context_snapshot is null
      and review_date is null and deleted_at is not null)
    or (status <> 'deleted' and content is not null and context_snapshot is not null
      and jsonb_typeof(content) = 'object'
      and (content->>'version') is not distinct from 'dtc-a2-plan.v1'
      and jsonb_typeof(context_snapshot) = 'object'
      and (context_snapshot->>'version') is not distinct from 'dtc-a2-plan-context.v1'
      and review_date is not null and deleted_at is null))
);

create table if not exists dtc_private.a2_plan_revisions (
  user_id uuid not null,
  plan_id uuid not null,
  revision integer not null check (revision >= 1),
  operation text not null check (operation in ('save','pause','resume','complete','cancel')),
  status text not null check (status in ('active','paused','completed','cancelled')),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  context_snapshot jsonb not null check (jsonb_typeof(context_snapshot) = 'object'),
  reviewed_at timestamptz not null,
  review_date date not null,
  committed_at timestamptz not null,
  primary key (user_id, revision),
  foreign key (user_id,plan_id) references public.a2_reviewed_plans(user_id,plan_id) on delete cascade
);

create table if not exists dtc_private.a2_plan_receipts (
  user_id uuid not null,
  request_id uuid not null,
  command_hash bytea not null check (octet_length(command_hash) = 32),
  plan_id uuid not null,
  result_revision integer not null check (result_revision >= 1),
  result_status text not null check (result_status in ('active','paused','completed','cancelled','deleted')),
  committed_at timestamptz not null,
  primary key (user_id,request_id),
  unique (user_id,result_revision),
  foreign key (user_id,plan_id) references public.a2_reviewed_plans(user_id,plan_id) on delete cascade
);

alter table public.a2_reviewed_plans enable row level security;
alter table public.a2_reviewed_plans force row level security;
alter table dtc_private.a2_plan_revisions enable row level security;
alter table dtc_private.a2_plan_revisions force row level security;
alter table dtc_private.a2_plan_receipts enable row level security;
alter table dtc_private.a2_plan_receipts force row level security;
drop policy if exists a2_reviewed_plans_owner_select on public.a2_reviewed_plans;
create policy a2_reviewed_plans_owner_select on public.a2_reviewed_plans
  for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.a2_reviewed_plans from public, anon, authenticated, service_role;
revoke all on dtc_private.a2_plan_revisions, dtc_private.a2_plan_receipts
  from public, anon, authenticated, service_role;
grant select on public.a2_reviewed_plans to authenticated;
grant select,insert,update,delete on public.a2_reviewed_plans to service_role;
grant select,insert,delete on dtc_private.a2_plan_revisions to service_role;
grant select,insert on dtc_private.a2_plan_receipts to service_role;

-- The API normalizes the command once. SQL checks the same text bounds without
-- silently normalizing a different payload into the same idempotency receipt.
create or replace function dtc_private.a2_plan_trim(p_value text)
returns text language sql immutable strict security invoker set search_path = ''
as $$
  select pg_catalog.btrim(p_value, E' \t\n\r\f' || pg_catalog.chr(11) || U&'\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF');
$$;

create or replace function dtc_private.a2_plan_text_length(p_value text)
returns integer language sql immutable strict security invoker set search_path = ''
as $$
  select coalesce(sum(case when part = '' then 0 when pg_catalog.ascii(part) > 65535 then 2 else 1 end), 0)::integer
    from pg_catalog.regexp_split_to_table(p_value, '') as parts(part);
$$;

-- jsonb::text adds separator spaces. Count compact JSON bytes recursively so
-- the server's 12,000-byte content limit also admits a valid boundary payload.
create or replace function dtc_private.a2_plan_json_bytes(p_value jsonb)
returns integer language plpgsql immutable strict security invoker set search_path = ''
as $$
declare v_total integer := 2; v_count integer := 0; v_key text; v_child jsonb;
begin
  if pg_catalog.jsonb_typeof(p_value)='object' then
    for v_key,v_child in select key,value from pg_catalog.jsonb_each(p_value) loop
      v_total := v_total + pg_catalog.octet_length(pg_catalog.to_jsonb(v_key)::text) + 1
        + dtc_private.a2_plan_json_bytes(v_child);
      v_count := v_count + 1;
    end loop;
  elsif pg_catalog.jsonb_typeof(p_value)='array' then
    for v_child in select value from pg_catalog.jsonb_array_elements(p_value) loop
      v_total := v_total + dtc_private.a2_plan_json_bytes(v_child); v_count := v_count + 1;
    end loop;
  else return pg_catalog.octet_length(p_value::text);
  end if;
  return v_total + greatest(v_count-1,0);
end;
$$;

create or replace function dtc_private.a2_plan_validate_content(p_content jsonb)
returns date language plpgsql immutable security invoker set search_path = ''
as $$
declare
  v_step jsonb;
  v_key text;
  v_date date;
  v_seen uuid[] := '{}'::uuid[];
  v_id uuid;
  v_min integer;
  v_max integer;
begin
  if pg_catalog.jsonb_typeof(p_content) is distinct from 'object' then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  if dtc_private.a2_plan_json_bytes(p_content) > 12000
    or p_content->>'version' is distinct from 'dtc-a2-plan.v1'
    or not (p_content ?& array['version','purpose','constraints','reviewDate','steps'])
    or exists (select 1 from pg_catalog.jsonb_object_keys(p_content) k
      where k not in ('version','purpose','constraints','reviewDate','steps')) then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  foreach v_key in array array['purpose','constraints'] loop
    v_min := case v_key when 'purpose' then 1 else 0 end;
    v_max := case v_key when 'purpose' then 500 else 1000 end;
    if pg_catalog.jsonb_typeof(p_content->v_key) is distinct from 'string'
      or p_content->>v_key is distinct from dtc_private.a2_plan_trim(p_content->>v_key)
      or dtc_private.a2_plan_text_length(p_content->>v_key) not between v_min and v_max then
      raise exception using errcode='22023', message='a2_plan_invalid_payload';
    end if;
  end loop;
  if pg_catalog.jsonb_typeof(p_content->'reviewDate') is distinct from 'string'
    or (p_content->>'reviewDate') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  begin
    v_date := (p_content->>'reviewDate')::date;
  exception when data_exception then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end;
  if pg_catalog.to_char(v_date,'YYYY-MM-DD') <> p_content->>'reviewDate'
    or pg_catalog.jsonb_typeof(p_content->'steps') is distinct from 'array' then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  if pg_catalog.jsonb_array_length(p_content->'steps') not between 1 and 5 then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  for v_step in select value from pg_catalog.jsonb_array_elements(p_content->'steps') loop
    if pg_catalog.jsonb_typeof(v_step) is distinct from 'object' then
      raise exception using errcode='22023', message='a2_plan_invalid_payload';
    end if;
    if not (v_step ?& array['id','title','action','status'])
      or exists (select 1 from pg_catalog.jsonb_object_keys(v_step) k
        where k not in ('id','title','action','status','note'))
      or pg_catalog.jsonb_typeof(v_step->'id') is distinct from 'string'
      or (v_step->>'id') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      or coalesce(v_step->>'status','') not in ('pending','reported_done','skipped') then
      raise exception using errcode='22023', message='a2_plan_invalid_payload';
    end if;
    v_id := (v_step->>'id')::uuid;
    if v_id = any(v_seen) then
      raise exception using errcode='22023', message='a2_plan_invalid_payload';
    end if;
    v_seen := pg_catalog.array_append(v_seen,v_id);
    foreach v_key in array array['title','action','note'] loop
      if v_key = 'note' and not (v_step ? 'note') then continue; end if;
      v_min := case v_key when 'note' then 0 else 1 end;
      v_max := case v_key when 'title' then 120 when 'action' then 600 else 300 end;
      if pg_catalog.jsonb_typeof(v_step->v_key) is distinct from 'string'
        or v_step->>v_key is distinct from dtc_private.a2_plan_trim(v_step->>v_key)
        or dtc_private.a2_plan_text_length(v_step->>v_key) not between v_min and v_max then
        raise exception using errcode='22023', message='a2_plan_invalid_payload';
      end if;
    end loop;
  end loop;
  return v_date;
end;
$$;

create or replace function dtc_private.a2_plan_validate_command(p_command jsonb)
returns void language plpgsql immutable security invoker set search_path = ''
as $$
declare v_operation text;
begin
  if pg_catalog.jsonb_typeof(p_command) is distinct from 'object' then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  if dtc_private.a2_plan_json_bytes(p_command) > 14000
    or p_command->>'version' is distinct from 'dtc-a2-plan-command.v1'
    or not (p_command ?& array['version','requestId','expectedRevision','operation'])
    or pg_catalog.jsonb_typeof(p_command->'requestId') is distinct from 'string'
    or (p_command->>'requestId') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    or pg_catalog.jsonb_typeof(p_command->'expectedRevision') is distinct from 'number'
    or (p_command->>'expectedRevision') !~ '^(0|[1-9][0-9]{0,9})$' then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  if (p_command->>'expectedRevision')::numeric > 2147483647 then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  v_operation := p_command->>'operation';
  if v_operation is null or v_operation not in ('save','pause','resume','complete','cancel','delete')
    or exists (select 1 from pg_catalog.jsonb_object_keys(p_command) k
      where k not in ('version','requestId','expectedRevision','operation','content','expectedContextHash'))
    or (v_operation = 'save') is distinct from (p_command ? 'content')
    or (v_operation in ('save','resume')) is distinct from (p_command ? 'expectedContextHash') then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  if v_operation in ('save','resume') and (
    pg_catalog.jsonb_typeof(p_command->'expectedContextHash') is distinct from 'string'
    or (p_command->>'expectedContextHash') !~ '^[0-9a-f]{64}$') then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  if v_operation = 'save' then perform dtc_private.a2_plan_validate_content(p_command->'content'); end if;
end;
$$;

create or replace function dtc_private.a2_plan_require_pilot(p_user_id uuid)
returns void language plpgsql security invoker set search_path = ''
as $$
declare v_membership_id uuid; v_access record;
begin
  if p_user_id is null then
    raise exception using errcode='22023', message='a2_plan_invalid_payload';
  end if;
  -- Lock an existing admission before calling the canonical resolver. Unlike a
  -- general access lookup this helper cannot create a grandfathered membership.
  select id into v_membership_id from public.pilot_memberships
    where user_id=p_user_id for share;
  if not found then raise exception using errcode='42501', message='a2_plan_access_required'; end if;
  select * into v_access from public.resolve_pilot_access(p_user_id,null);
  if not found or v_access.allowed is distinct from true or v_access.membership_id is distinct from v_membership_id then
    raise exception using errcode='42501', message='a2_plan_access_required';
  end if;
end;
$$;

create or replace function dtc_private.a2_plan_receipt_json(
  p_receipt dtc_private.a2_plan_receipts, p_replayed boolean)
returns jsonb language sql stable security invoker set search_path = ''
as $$
  select pg_catalog.jsonb_build_object('requestId',p_receipt.request_id,'planId',p_receipt.plan_id,
    'revision',p_receipt.result_revision,'state',p_receipt.result_status,
    'committedAt',p_receipt.committed_at,'replayed',p_replayed);
$$;

create or replace function public.read_a2_plan_receipt(p_user_id uuid,p_command jsonb)
returns jsonb language plpgsql security invoker set search_path = '' set lock_timeout = '5s'
as $$
declare v_receipt dtc_private.a2_plan_receipts; v_hash bytea;
begin
  perform dtc_private.a2_plan_validate_command(p_command);
  perform dtc_private.a2_plan_require_pilot(p_user_id);
  v_hash := pg_catalog.sha256(pg_catalog.convert_to(p_command::text,'UTF8'));
  select * into v_receipt from dtc_private.a2_plan_receipts
    where user_id=p_user_id and request_id=(p_command->>'requestId')::uuid;
  if not found then return null; end if;
  if v_receipt.command_hash is distinct from v_hash then
    raise exception using errcode='P0001', message='a2_plan_request_conflict';
  end if;
  return dtc_private.a2_plan_receipt_json(v_receipt,true);
end;
$$;

create or replace function public.mutate_a2_reviewed_plan(
  p_user_id uuid,p_command jsonb,p_context_snapshot jsonb default null)
returns jsonb language plpgsql security invoker set search_path = '' set lock_timeout = '5s'
as $$
declare
  v_plan public.a2_reviewed_plans;
  v_receipt dtc_private.a2_plan_receipts;
  v_hash bytea;
  v_operation text;
  v_status text;
  v_revision integer;
  v_now timestamptz;
  v_today date;
  v_date date;
  v_captured_at timestamptz;
  v_content jsonb;
  v_context jsonb;
  v_reviewed_at timestamptz;
begin
  perform dtc_private.a2_plan_validate_command(p_command);
  if p_user_id is null then raise exception using errcode='22023', message='a2_plan_invalid_payload'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('dtc:a2-plan:' || p_user_id::text,0));
  perform dtc_private.a2_plan_require_pilot(p_user_id);
  v_hash := pg_catalog.sha256(pg_catalog.convert_to(p_command::text,'UTF8'));
  select * into v_receipt from dtc_private.a2_plan_receipts
    where user_id=p_user_id and request_id=(p_command->>'requestId')::uuid;
  if found then
    if v_receipt.command_hash is distinct from v_hash then
      raise exception using errcode='P0001', message='a2_plan_request_conflict';
    end if;
    -- A committed retry is acknowledged before date, source or CAS checks.
    -- Return metadata only; the API reads CURRENT state separately.
    return dtc_private.a2_plan_receipt_json(v_receipt,true);
  end if;
  select * into v_plan from public.a2_reviewed_plans where user_id=p_user_id for update;
  if coalesce(v_plan.revision,0) <> (p_command->>'expectedRevision')::integer then
    raise exception using errcode='P0001', message='a2_plan_conflict';
  end if;
  if v_plan.revision = 2147483647 then
    raise exception using errcode='P0001', message='a2_plan_conflict';
  end if;
  v_revision := coalesce(v_plan.revision,0) + 1;
  v_operation := p_command->>'operation';
  -- Read wall clock after waiting for owner/admission locks, not at BEGIN.
  v_now := pg_catalog.clock_timestamp();
  v_today := (v_now at time zone 'America/Santiago')::date;
  v_content := v_plan.content;
  v_context := v_plan.context_snapshot;
  v_date := v_plan.review_date;
  v_reviewed_at := v_plan.reviewed_at;
  if v_operation <> 'save' and (v_plan.user_id is null or v_plan.status = 'deleted') then
    raise exception using errcode='P0001', message='a2_plan_transition_invalid';
  end if;

  if v_operation in ('save','resume') then
    if pg_catalog.jsonb_typeof(p_context_snapshot) is distinct from 'object'
      or p_context_snapshot->'available' is distinct from 'true'::jsonb then
      raise exception using errcode='55000', message='a2_plan_context_unavailable';
    end if;
    if pg_catalog.octet_length(p_context_snapshot::text) > 256000
      or p_context_snapshot->>'version' is distinct from 'dtc-a2-plan-context.v1'
      or not (p_context_snapshot ?& array['version','capturedAt','hash','available','projection'])
      or exists (select 1 from pg_catalog.jsonb_object_keys(p_context_snapshot) k
        where k not in ('version','capturedAt','hash','available','projection'))
      or pg_catalog.jsonb_typeof(p_context_snapshot->'projection') is distinct from 'object'
      or pg_catalog.jsonb_typeof(p_context_snapshot->'hash') is distinct from 'string'
      or (p_context_snapshot->>'hash') !~ '^[0-9a-f]{64}$'
      or pg_catalog.jsonb_typeof(p_context_snapshot->'capturedAt') is distinct from 'string'
      or (p_context_snapshot->>'capturedAt') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,6})?(Z|[+-][0-9]{2}:[0-9]{2})$' then
      raise exception using errcode='22023', message='a2_plan_invalid_payload';
    end if;
    begin
      v_captured_at := (p_context_snapshot->>'capturedAt')::timestamptz;
    exception when data_exception then
      raise exception using errcode='22023', message='a2_plan_invalid_payload';
    end;
    -- This is a dated server read, not a transaction over all context sources.
    if not pg_catalog.isfinite(v_captured_at) or v_captured_at > v_now + interval '1 minute'
      or v_captured_at < v_now - interval '5 minutes' then
      raise exception using errcode='55000', message='a2_plan_context_unavailable';
    end if;
    if p_context_snapshot->>'hash' is distinct from p_command->>'expectedContextHash'
      or (v_operation='resume' and v_plan.context_snapshot->>'hash' is distinct from p_context_snapshot->>'hash') then
      raise exception using errcode='P0001', message='a2_plan_context_changed';
    end if;
  end if;

  case v_operation
    when 'save' then
      v_content := p_command->'content';
      v_date := dtc_private.a2_plan_validate_content(v_content);
      if v_date < v_today or v_date > v_today + 30 then
        raise exception using errcode='P0001', message='a2_plan_expired';
      end if;
      v_status := 'active'; v_context := p_context_snapshot; v_reviewed_at := v_now;
    when 'pause' then
      if v_plan.status <> 'active' then raise exception using errcode='P0001', message='a2_plan_transition_invalid'; end if;
      v_status := 'paused';
    when 'resume' then
      if v_plan.status <> 'paused' then raise exception using errcode='P0001', message='a2_plan_transition_invalid'; end if;
      if v_date < v_today or v_date > v_today + 30 then raise exception using errcode='P0001', message='a2_plan_expired'; end if;
      v_status := 'active';
    when 'complete' then
      if v_plan.status not in ('active','paused')
        or exists (select 1 from pg_catalog.jsonb_array_elements(v_content->'steps') s where s->>'status'='pending')
        or not exists (select 1 from pg_catalog.jsonb_array_elements(v_content->'steps') s where s->>'status'='reported_done') then
        raise exception using errcode='P0001', message='a2_plan_transition_invalid';
      end if;
      v_status := 'completed';
    when 'cancel' then
      if v_plan.status not in ('active','paused') then raise exception using errcode='P0001', message='a2_plan_transition_invalid'; end if;
      v_status := 'cancelled';
    when 'delete' then
      v_status := 'deleted'; v_content := null; v_context := null; v_date := null;
  end case;
  if v_plan.user_id is null then
    insert into public.a2_reviewed_plans(user_id,revision,status,content,context_snapshot,
      reviewed_at,review_date,created_at,updated_at)
    values(p_user_id,v_revision,v_status,v_content,v_context,v_reviewed_at,v_date,v_now,v_now)
    returning * into v_plan;
  else
    update public.a2_reviewed_plans set revision=v_revision,status=v_status,content=v_content,
      context_snapshot=v_context,reviewed_at=v_reviewed_at,review_date=v_date,updated_at=v_now,
      deleted_at=case when v_status='deleted' then v_now else null end
      where user_id=p_user_id and plan_id=v_plan.plan_id returning * into v_plan;
  end if;
  if v_status='deleted' then
    delete from dtc_private.a2_plan_revisions where user_id=p_user_id and plan_id=v_plan.plan_id;
  else
    insert into dtc_private.a2_plan_revisions(user_id,plan_id,revision,operation,status,content,
      context_snapshot,reviewed_at,review_date,committed_at)
    values(p_user_id,v_plan.plan_id,v_revision,v_operation,v_status,v_content,v_context,v_reviewed_at,v_date,v_now);
  end if;
  insert into dtc_private.a2_plan_receipts(user_id,request_id,command_hash,plan_id,result_revision,result_status,committed_at)
  values(p_user_id,(p_command->>'requestId')::uuid,v_hash,v_plan.plan_id,v_revision,v_status,v_now)
  returning * into v_receipt;
  return dtc_private.a2_plan_receipt_json(v_receipt,false);
end;
$$;

revoke all on function dtc_private.a2_plan_trim(text), dtc_private.a2_plan_text_length(text),
  dtc_private.a2_plan_json_bytes(jsonb),
  dtc_private.a2_plan_validate_content(jsonb), dtc_private.a2_plan_validate_command(jsonb),
  dtc_private.a2_plan_require_pilot(uuid), dtc_private.a2_plan_receipt_json(dtc_private.a2_plan_receipts,boolean),
  public.read_a2_plan_receipt(uuid,jsonb), public.mutate_a2_reviewed_plan(uuid,jsonb,jsonb)
  from public,anon,authenticated;
grant execute on function dtc_private.a2_plan_trim(text), dtc_private.a2_plan_text_length(text),
  dtc_private.a2_plan_json_bytes(jsonb),
  dtc_private.a2_plan_validate_content(jsonb), dtc_private.a2_plan_validate_command(jsonb),
  dtc_private.a2_plan_require_pilot(uuid), dtc_private.a2_plan_receipt_json(dtc_private.a2_plan_receipts,boolean),
  public.read_a2_plan_receipt(uuid,jsonb), public.mutate_a2_reviewed_plan(uuid,jsonb,jsonb)
  to service_role;

comment on table public.a2_reviewed_plans is
  'One owner-bound reviewed plan slot. A dated context snapshot, not canonical journey progress. Deleted slots retain only anti-resurrection metadata.';
comment on table dtc_private.a2_plan_revisions is
  'Immutable full revisions through the plan RPC; deletion purges every content snapshot for that owner slot.';
comment on table dtc_private.a2_plan_receipts is
  'Private idempotency metadata only. Contains no plan, context, chat or canonical assessment content. Retained after plan deletion for safe retries.';
comment on function public.mutate_a2_reviewed_plan(uuid,jsonb,jsonb) is
  'Service-only invoker; server-verified actor, locked pilot admission, owner CAS, command receipt and history in one transaction. No source-write fence and no journey/XP changes.';
commit;
