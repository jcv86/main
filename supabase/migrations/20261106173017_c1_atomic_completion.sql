-- Candidate only: no remote execution from application startup.
-- One C1 completion transaction; historical response rows are never deduplicated
-- or overwritten. The caller is the verified server API, not a browser role.
begin;
set local lock_timeout = '5s';

alter table public.despega_user_profiles
  add column if not exists onboarding_conozcamonos_1_completed_at timestamp without time zone;

create schema if not exists dtc_private;
revoke all on schema dtc_private from public, anon, authenticated;
grant usage on schema dtc_private to service_role;

create table if not exists dtc_private.c1_completion_receipts (
  draft_id uuid primary key references public.assessment_drafts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  response_id uuid not null unique references public.canon_conozcamonos_1_responses(id),
  schema_version integer not null check (schema_version = 1),
  input_hash bytea not null check (octet_length(input_hash) = 32),
  response_hash bytea not null check (octet_length(response_hash) = 32),
  completed_at timestamptz not null,
  origin text not null default 'atomic' check (origin in ('atomic', 'legacy'))
);
create index if not exists c1_completion_receipts_user_idx
  on dtc_private.c1_completion_receipts(user_id);
alter table dtc_private.c1_completion_receipts enable row level security;
revoke all on dtc_private.c1_completion_receipts from public, anon, authenticated;
grant select, insert, update, delete on dtc_private.c1_completion_receipts to service_role;

create or replace function dtc_private.c1_snapshot_hash(p_value jsonb)
returns bytea language sql immutable strict security invoker set search_path = ''
as $$ select pg_catalog.sha256(pg_catalog.convert_to(p_value::text, 'UTF8')); $$;

-- Match JavaScript trim/textarea length, including non-BMP Unicode characters.
create or replace function dtc_private.c1_trim(p_value text)
returns text language sql immutable strict security invoker set search_path = ''
as $$
  select pg_catalog.btrim(p_value, E' \t\n\r\f' || pg_catalog.chr(11) || U&'\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF');
$$;

create or replace function dtc_private.c1_utf16_length(p_value text)
returns integer language sql immutable strict security invoker set search_path = ''
as $$
  select coalesce(sum(case when part = '' then 0 when pg_catalog.ascii(part) > 65535 then 2 else 1 end), 0)::integer
    from pg_catalog.regexp_split_to_table(p_value, '') as parts(part);
$$;

-- Frozen C1 v1 options. The SQL regression compares this writer with the actual
-- TypeScript bank and serializer, rather than trusting a client-made final JSON.
create or replace function dtc_private.c1_final_answers(p_answers jsonb)
returns jsonb language plpgsql immutable security invoker set search_path = ''
as $$
declare
  v_options constant jsonb := '{
    "1":["Empleado de tiempo completo","Empleado de tiempo parcial","Independiente/Freelancer","Desempleado","Estudiante","Otro"],
    "2":["Menos de 1 año","1-3 años","3-5 años","5-10 años","10+ años"],
    "5":["Solo/a","Con pareja","Con familia","Con amigos/compañeros","Otro"],
    "6":["Menos de 3 horas","3-5 horas","5-10 horas","10-15 horas","Más de 15 horas"],
    "7":["Contenido escrito","Videos","Conversaciones/mentoría","Práctica directa/ejercicios","Combinación de varios"]
  }'::jsonb;
  v_id text;
  v_answer jsonb;
  v_custom jsonb;
  v_detail text;
  v_final jsonb;
  v_distinct integer;
begin
  if pg_catalog.jsonb_typeof(p_answers) is distinct from 'object'
     or pg_catalog.octet_length(p_answers::text) > 65536 then
    raise exception using errcode = '22023', message = 'c1_invalid_payload';
  end if;
  if exists (select 1 from pg_catalog.jsonb_object_keys(p_answers) as keys(key)
      where key not in ('1','2','3','4','5','6','7','_customResponses')) then
    raise exception using errcode = '22023', message = 'c1_invalid_payload';
  end if;
  for v_id in select pg_catalog.generate_series(1,7)::text loop
    v_answer := p_answers -> v_id;
    if v_id in ('3','4') then
      if pg_catalog.jsonb_typeof(v_answer) is distinct from 'string'
         or dtc_private.c1_trim(p_answers ->> v_id) = ''
         or dtc_private.c1_utf16_length(p_answers ->> v_id) > 500 then
        raise exception using errcode = '22023', message = 'c1_invalid_payload';
      end if;
    else
      if pg_catalog.jsonb_typeof(v_answer) is distinct from 'array' then
        raise exception using errcode = '22023', message = 'c1_invalid_payload';
      end if;
      if pg_catalog.jsonb_array_length(v_answer) = 0
         or pg_catalog.jsonb_array_length(v_answer) > pg_catalog.jsonb_array_length(v_options -> v_id)
         or exists (select 1 from pg_catalog.jsonb_array_elements(v_answer) as entries(value)
           where pg_catalog.jsonb_typeof(value) is distinct from 'string'
              or not ((v_options -> v_id) ? (value #>> '{}'))) then
        raise exception using errcode = '22023', message = 'c1_invalid_payload';
      end if;
      select count(distinct value)::integer into v_distinct
        from pg_catalog.jsonb_array_elements(v_answer) as entries(value);
      if v_distinct <> pg_catalog.jsonb_array_length(v_answer) then
        raise exception using errcode = '22023', message = 'c1_invalid_payload';
      end if;
    end if;
  end loop;

  v_custom := coalesce(p_answers -> '_customResponses', '{}'::jsonb);
  if pg_catalog.jsonb_typeof(v_custom) is distinct from 'object' then
    raise exception using errcode = '22023', message = 'c1_invalid_payload';
  end if;
  for v_id, v_answer in select key, value from pg_catalog.jsonb_each(v_custom) loop
    if v_id not in ('1','5') or not ((p_answers -> v_id) ? 'Otro')
       or pg_catalog.jsonb_typeof(v_answer) is distinct from 'string'
       or dtc_private.c1_utf16_length(v_custom ->> v_id) > 500 then
      raise exception using errcode = '22023', message = 'c1_invalid_payload';
    end if;
  end loop;

  v_final := p_answers - '_customResponses';
  foreach v_id in array array['1','5'] loop
    v_detail := dtc_private.c1_trim(v_custom ->> v_id);
    if v_detail is not null and v_detail <> '' then
      select pg_catalog.jsonb_agg(case when value = '"Otro"'::jsonb
          then pg_catalog.to_jsonb('Otro: ' || v_detail) else value end order by position)
        into v_answer
        from pg_catalog.jsonb_array_elements(p_answers -> v_id) with ordinality as entries(value, position);
      v_final := pg_catalog.jsonb_set(v_final, array[v_id], v_answer);
    end if;
  end loop;
  return v_final;
end;
$$;

create or replace function dtc_private.c1_require_pilot(p_user_id uuid)
returns void language plpgsql security invoker set search_path = ''
as $$
declare v_access record;
begin
  if p_user_id is null then
    raise exception using errcode = '22023', message = 'c1_invalid_payload';
  end if;
  select * into v_access from public.resolve_pilot_access(p_user_id, null);
  if not found or v_access.allowed is distinct from true or v_access.membership_id is null then
    raise exception using errcode = '42501', message = 'c1_access_required';
  end if;
  -- Admission cannot disappear between verification and this transaction's writes.
  perform 1 from public.pilot_memberships
    where id = v_access.membership_id and user_id = p_user_id for share;
  if not found then
    raise exception using errcode = '42501', message = 'c1_access_required';
  end if;
end;
$$;

create or replace function dtc_private.c1_draft_json(p_draft public.assessment_drafts)
returns jsonb language sql stable security invoker set search_path = ''
as $$
  select pg_catalog.jsonb_build_object(
    'assessmentType','c1','schemaVersion',p_draft.schema_version,
    'currentQuestion',p_draft.current_question,'answers',p_draft.answers,
    'timings',p_draft.timings,'updatedAt',p_draft.updated_at,'completedAt',p_draft.completed_at);
$$;

create or replace function dtc_private.c1_finish_profile(p_user_id uuid, p_completed_at timestamptz)
returns void language plpgsql security invoker set search_path = ''
as $$
begin
  if exists (select 1 from public.despega_user_profiles where user_id = p_user_id
      and onboarding_conozcamonos_1_completed is true
      and onboarding_conozcamonos_1_completed_at = p_completed_at at time zone 'UTC') then
    return;
  end if;
  -- Avoid the unrelated A4 INSERT trigger on the common existing-profile path.
  update public.despega_user_profiles set
    onboarding_conozcamonos_1_completed = true,
    onboarding_conozcamonos_1_completed_at = p_completed_at at time zone 'UTC',
    updated_at = pg_catalog.now()
  where user_id = p_user_id;
  if not found then
    insert into public.despega_user_profiles (
      user_id,onboarding_conozcamonos_1_completed,onboarding_conozcamonos_1_completed_at
    ) values (p_user_id,true,p_completed_at at time zone 'UTC')
    on conflict (user_id) do update set
      onboarding_conozcamonos_1_completed = true,
      onboarding_conozcamonos_1_completed_at = excluded.onboarding_conozcamonos_1_completed_at,
      updated_at = pg_catalog.now();
  end if;
end;
$$;

create or replace function public.complete_c1_atomic(
  p_user_id uuid,
  p_schema_version integer,
  p_answers jsonb,
  p_expected_draft_updated_at timestamptz default null
)
returns jsonb language plpgsql security invoker
set search_path = '' set lock_timeout = '5s'
as $$
declare
  v_draft public.assessment_drafts;
  v_receipt dtc_private.c1_completion_receipts;
  v_response public.canon_conozcamonos_1_responses;
  v_profile public.despega_user_profiles;
  v_final jsonb;
  v_input_hash bytea;
  v_completed_at timestamptz;
  v_response_id uuid;
  v_origin text := 'atomic';
begin
  if p_schema_version is distinct from 1 then
    raise exception using errcode = '22023', message = 'c1_unsupported_version';
  end if;
  v_final := dtc_private.c1_final_answers(p_answers);
  v_input_hash := dtc_private.c1_snapshot_hash(p_answers);
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('dtc:c1:' || p_user_id::text, 0));
  perform dtc_private.c1_require_pilot(p_user_id);

  select * into v_draft from public.assessment_drafts
    where user_id = p_user_id and assessment_type = 'c1' for update;
  if found then
    select * into v_receipt from dtc_private.c1_completion_receipts
      where draft_id = v_draft.id;
    if found then
      if v_receipt.user_id is distinct from p_user_id
         or v_receipt.input_hash is distinct from dtc_private.c1_snapshot_hash(v_draft.answers) then
        raise exception using errcode = 'P0001', message = 'c1_completion_inconsistent';
      end if;
      select * into v_response from public.canon_conozcamonos_1_responses
        where id = v_receipt.response_id and user_id = p_user_id for share;
      if not found or v_receipt.response_hash is distinct from dtc_private.c1_snapshot_hash(v_response.responses)
         or v_response.completed_at is distinct from v_receipt.completed_at then
        raise exception using errcode = 'P0001', message = 'c1_completion_inconsistent';
      end if;
      if v_receipt.input_hash is distinct from v_input_hash then
        raise exception using errcode = 'P0001', message = 'c1_already_completed_with_different_answers';
      end if;
      -- A replay recognizes the committed snapshot before checking the old CAS
      -- token. Repair a later profile-only regression without replacing answers.
      perform dtc_private.c1_finish_profile(p_user_id, v_receipt.completed_at);
      if v_draft.completed_at is distinct from v_receipt.completed_at then
        update public.assessment_drafts set completed_at = v_receipt.completed_at,
          updated_at = pg_catalog.now() where id = v_draft.id and user_id = p_user_id;
      end if;
      return pg_catalog.jsonb_build_object('state','completed','origin',v_receipt.origin,
        'responseId',v_receipt.response_id,'draftId',v_draft.id,'completedAt',v_receipt.completed_at,
        'replayed',true,'nextPath','/despega/a1-cerebral-intro');
    end if;
    if v_draft.schema_version <> 1 then
      raise exception using errcode = '22023', message = 'c1_unsupported_version';
    end if;
    if v_draft.updated_at is distinct from p_expected_draft_updated_at then
      raise exception using errcode = 'P0001', message = 'c1_draft_changed';
    end if;
  else
    if p_expected_draft_updated_at is not null then
      raise exception using errcode = 'P0001', message = 'c1_draft_changed';
    end if;
    insert into public.assessment_drafts(user_id,assessment_type,schema_version,current_question,answers,timings)
      values(p_user_id,'c1',1,6,p_answers,'[]'::jsonb)
      on conflict (user_id,assessment_type) do nothing
      returning * into v_draft;
    if not found then
      -- An ordinary draft PUT does not take this RPC's advisory lock. If it
      -- created the row after our absent-row read, keep its work and expose a
      -- recoverable CAS conflict instead of replacing it or leaking 23505.
      perform 1 from public.assessment_drafts
        where user_id = p_user_id and assessment_type = 'c1' for update;
      raise exception using errcode = 'P0001', message = 'c1_draft_changed';
    end if;
  end if;

  select * into v_response from public.canon_conozcamonos_1_responses
    where user_id = p_user_id
    order by completed_at desc nulls last, created_at desc nulls last, id desc limit 1 for share;
  select * into v_profile from public.despega_user_profiles where user_id = p_user_id;

  if v_response.id is not null and v_response.completed_at is not null and v_response.responses = v_final then
    -- Recover the old insert-then-failure path without inserting an identical row.
    v_response_id := v_response.id;
    v_completed_at := v_response.completed_at;
    v_origin := 'legacy';
  else
    if v_draft.completed_at is not null
       or (v_response.id is not null and (coalesce(v_profile.onboarding_conozcamonos_1_completed,false)
         or coalesce(v_profile.onboarding_completed,false))) then
      raise exception using errcode = 'P0001', message = 'c1_legacy_completion_conflict';
    end if;
    v_completed_at := pg_catalog.now();
    insert into public.canon_conozcamonos_1_responses(user_id,responses,completed_at,completed)
      values(p_user_id,v_final,v_completed_at,true) returning id into v_response_id;
  end if;

  perform dtc_private.c1_finish_profile(p_user_id, v_completed_at);
  update public.assessment_drafts set schema_version = 1,current_question = 6,
    answers = p_answers,timings = '[]'::jsonb,completed_at = v_completed_at,updated_at = pg_catalog.now()
    where id = v_draft.id and user_id = p_user_id;
  if not found then
    raise exception using errcode = 'P0001', message = 'c1_completion_inconsistent';
  end if;
  insert into dtc_private.c1_completion_receipts(
    draft_id,user_id,response_id,schema_version,input_hash,response_hash,completed_at,origin
  ) values(v_draft.id,p_user_id,v_response_id,1,v_input_hash,dtc_private.c1_snapshot_hash(v_final),v_completed_at,v_origin);
  return pg_catalog.jsonb_build_object('state','completed','origin',v_origin,
    'responseId',v_response_id,'draftId',v_draft.id,'completedAt',v_completed_at,
    'replayed',false,'nextPath','/despega/a1-cerebral-intro');
end;
$$;

create or replace function public.get_c1_completion_status(p_user_id uuid)
returns jsonb language plpgsql security invoker
set search_path = '' set lock_timeout = '5s'
as $$
declare
  v_draft public.assessment_drafts;
  v_receipt dtc_private.c1_completion_receipts;
  v_response public.canon_conozcamonos_1_responses;
  v_profile public.despega_user_profiles;
  v_has_draft boolean;
  v_state text;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('dtc:c1:' || p_user_id::text, 0));
  perform dtc_private.c1_require_pilot(p_user_id);
  select * into v_draft from public.assessment_drafts where user_id = p_user_id and assessment_type = 'c1';
  v_has_draft := found;
  select * into v_profile from public.despega_user_profiles where user_id = p_user_id;
  if v_has_draft then
    select * into v_receipt from dtc_private.c1_completion_receipts where draft_id = v_draft.id;
    if found then
      select * into v_response from public.canon_conozcamonos_1_responses
        where id = v_receipt.response_id and user_id = p_user_id;
      if not found or v_receipt.user_id is distinct from p_user_id
         or v_receipt.input_hash is distinct from dtc_private.c1_snapshot_hash(v_draft.answers)
         or v_receipt.response_hash is distinct from dtc_private.c1_snapshot_hash(v_response.responses)
         or v_response.completed_at is distinct from v_receipt.completed_at then
        raise exception using errcode = 'P0001', message = 'c1_completion_inconsistent';
      end if;
      v_state := case when v_profile.onboarding_conozcamonos_1_completed is true
          and v_draft.completed_at = v_receipt.completed_at then 'completed' else 'recovery_required' end;
      return pg_catalog.jsonb_build_object('state',v_state,'origin',v_receipt.origin,
        'responseId',v_receipt.response_id,'draftId',v_draft.id,'completedAt',v_receipt.completed_at,
        'nextPath','/despega/a1-cerebral-intro',
        'draft',case when v_state = 'completed' then null else dtc_private.c1_draft_json(v_draft) end);
    end if;
  end if;

  select * into v_response from public.canon_conozcamonos_1_responses where user_id = p_user_id
    order by completed_at desc nulls last, created_at desc nulls last, id desc limit 1;
  if v_response.id is not null and v_response.completed_at is not null
     and (coalesce(v_profile.onboarding_conozcamonos_1_completed,false) or coalesce(v_profile.onboarding_completed,false)) then
    return pg_catalog.jsonb_build_object('state','completed','origin','legacy',
      'responseId',v_response.id,'draftId',v_draft.id,'completedAt',v_response.completed_at,
      'nextPath','/despega/a1-cerebral-intro','draft',null);
  end if;
  v_state := case
    when v_response.id is not null or v_draft.completed_at is not null
      or coalesce(v_profile.onboarding_conozcamonos_1_completed,false)
      or coalesce(v_profile.onboarding_completed,false) then 'recovery_required'
    when v_has_draft then 'in_progress'
    else 'not_started' end;
  return pg_catalog.jsonb_build_object('state',v_state,'origin','legacy','draftId',v_draft.id,
    'responseId',v_response.id,'completedAt',v_response.completed_at,
    'draft',case when v_has_draft then dtc_private.c1_draft_json(v_draft) else null end);
end;
$$;

revoke all on function dtc_private.c1_snapshot_hash(jsonb), dtc_private.c1_trim(text),
  dtc_private.c1_utf16_length(text), dtc_private.c1_final_answers(jsonb),
  dtc_private.c1_require_pilot(uuid), dtc_private.c1_draft_json(public.assessment_drafts),
  dtc_private.c1_finish_profile(uuid,timestamptz) from public, anon, authenticated;
grant execute on function dtc_private.c1_snapshot_hash(jsonb), dtc_private.c1_trim(text),
  dtc_private.c1_utf16_length(text), dtc_private.c1_final_answers(jsonb),
  dtc_private.c1_require_pilot(uuid), dtc_private.c1_draft_json(public.assessment_drafts),
  dtc_private.c1_finish_profile(uuid,timestamptz) to service_role;
revoke all on function public.complete_c1_atomic(uuid,integer,jsonb,timestamptz),
  public.get_c1_completion_status(uuid) from public, anon, authenticated;
grant execute on function public.complete_c1_atomic(uuid,integer,jsonb,timestamptz),
  public.get_c1_completion_status(uuid) to service_role;

comment on function public.complete_c1_atomic(uuid,integer,jsonb,timestamptz)
  is 'C1 v1 atomic finalization. Service-only invoker; verified server actor, pilot admission, CAS, private durable receipt and replay. No public owner parameter or remote startup migration.';
comment on table dtc_private.c1_completion_receipts
  is 'Server-owned C1 commit confirmations. No public/owner Data API access; draft identity is durable and historical C1 responses are retained.';
commit;
