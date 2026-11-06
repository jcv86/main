-- DTC-AG-04: one reviewed, bounded action. The model cannot execute this RPC.
-- Requires AG03's private validation/admission helpers and the existing owner-RLS
-- dtc_documents table. No legacy command endpoint, completion or XP is changed.
begin;
set local lock_timeout = '5s';

do $$
begin
  if pg_catalog.to_regprocedure('dtc_private.a2_plan_require_pilot(uuid)') is null
    or pg_catalog.to_regprocedure('dtc_private.a2_plan_json_bytes(jsonb)') is null then
    raise exception 'AG03 must be installed before assistant action receipts';
  end if;
  if not exists (select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='dtc_documents' and c.relrowsecurity) then
    raise exception 'The existing owner-RLS document table is required';
  end if;
end;
$$;

create table if not exists dtc_private.a2_assistant_action_receipts (
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  command_hash bytea not null check (octet_length(command_hash)=32),
  document_id uuid not null unique,
  day_number integer not null check (day_number between 1 and 90),
  committed_at timestamptz not null,
  primary key (user_id,request_id)
);

-- Deliberately no FK to the effect document: deleting its content must not make
-- an old retry capable of recreating it. Receipts contain metadata/hash only.
alter table dtc_private.a2_assistant_action_receipts enable row level security;
alter table dtc_private.a2_assistant_action_receipts force row level security;
revoke all on dtc_private.a2_assistant_action_receipts from public,anon,authenticated,service_role;
grant select,insert on dtc_private.a2_assistant_action_receipts to service_role;

create or replace function dtc_private.a2_action_validate_command(p_command jsonb)
returns date language plpgsql immutable security invoker set search_path = ''
as $$
declare v_adjustment jsonb; v_key text; v_limit integer; v_date date;
begin
  if pg_catalog.jsonb_typeof(p_command) is distinct from 'object' then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  if dtc_private.a2_plan_json_bytes(p_command)>16000
    or p_command->>'version' is distinct from 'dtc-a2-action-command.v1'
    or p_command->>'tool' is distinct from 'save_practice_adjustment'
    or not (p_command ?& array['version','tool','requestId','dayNumber','expectedContextHash','adjustment'])
    or exists (select 1 from pg_catalog.jsonb_object_keys(p_command) k
      where k not in ('version','tool','requestId','dayNumber','expectedContextHash','adjustment'))
    or pg_catalog.jsonb_typeof(p_command->'requestId') is distinct from 'string'
    or (p_command->>'requestId') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    or pg_catalog.jsonb_typeof(p_command->'dayNumber') is distinct from 'number'
    or (p_command->>'dayNumber') !~ '^[1-9][0-9]?$'
    or pg_catalog.jsonb_typeof(p_command->'expectedContextHash') is distinct from 'string'
    or (p_command->>'expectedContextHash') !~ '^[0-9a-f]{64}$' then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  if (p_command->>'dayNumber')::integer>90 then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  v_adjustment := p_command->'adjustment';
  if pg_catalog.jsonb_typeof(v_adjustment) is distinct from 'object' then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  if not (v_adjustment ?& array['outcome','barrier','retainedWork','nextAction','reviewDate'])
    or exists (select 1 from pg_catalog.jsonb_object_keys(v_adjustment) k
      where k not in ('outcome','barrier','retainedWork','nextAction','reviewDate'))
    or coalesce(v_adjustment->>'outcome','') not in ('could_not','change')
    or coalesce(v_adjustment->>'barrier','') not in ('time','unclear','resources','energy','goal_changed','other') then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  foreach v_key in array array['retainedWork','nextAction'] loop
    v_limit := case v_key when 'retainedWork' then 4000 else 2000 end;
    if pg_catalog.jsonb_typeof(v_adjustment->v_key) is distinct from 'string'
      or v_adjustment->>v_key is distinct from dtc_private.a2_plan_trim(v_adjustment->>v_key)
      or dtc_private.a2_plan_text_length(v_adjustment->>v_key) not between 1 and v_limit then
      raise exception using errcode='22023', message='a2_action_invalid_payload';
    end if;
  end loop;
  if pg_catalog.jsonb_typeof(v_adjustment->'reviewDate') is distinct from 'string'
    or (v_adjustment->>'reviewDate') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    or (v_adjustment->>'reviewDate') like '0000-%' then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  begin v_date := (v_adjustment->>'reviewDate')::date;
  exception when data_exception then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end;
  if pg_catalog.to_char(v_date,'YYYY-MM-DD')<>v_adjustment->>'reviewDate' then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  return v_date;
end;
$$;

create or replace function dtc_private.a2_action_receipt_json(
  p_receipt dtc_private.a2_assistant_action_receipts,p_replayed boolean)
returns jsonb language sql stable security invoker set search_path = ''
as $$
  select pg_catalog.jsonb_build_object('version','dtc-a2-action-receipt.v1',
    'requestId',p_receipt.request_id,'documentId',p_receipt.document_id,
    'dayNumber',p_receipt.day_number,'committedAt',p_receipt.committed_at,'replayed',p_replayed);
$$;

create or replace function public.read_a2_assistant_action_receipt(p_user_id uuid,p_command jsonb)
returns jsonb language plpgsql security invoker set search_path = '' set lock_timeout = '5s'
as $$
declare v_receipt dtc_private.a2_assistant_action_receipts; v_hash bytea;
begin
  perform dtc_private.a2_action_validate_command(p_command);
  if p_user_id is null then raise exception using errcode='22023', message='a2_action_invalid_payload'; end if;
  perform dtc_private.a2_plan_require_pilot(p_user_id);
  v_hash := pg_catalog.sha256(pg_catalog.convert_to(p_command::text,'UTF8'));
  select * into v_receipt from dtc_private.a2_assistant_action_receipts
    where user_id=p_user_id and request_id=(p_command->>'requestId')::uuid;
  if not found then return null; end if;
  if v_receipt.command_hash is distinct from v_hash then
    raise exception using errcode='P0001', message='a2_action_request_conflict';
  end if;
  return dtc_private.a2_action_receipt_json(v_receipt,true);
end;
$$;

create or replace function public.confirm_a2_assistant_action(
  p_user_id uuid,p_command jsonb,p_context_snapshot jsonb)
returns jsonb language plpgsql security invoker set search_path = '' set lock_timeout = '5s'
as $$
declare
  v_receipt dtc_private.a2_assistant_action_receipts;
  v_hash bytea;
  v_now timestamptz;
  v_today date;
  v_date date;
  v_captured_at timestamptz;
  v_projection jsonb;
  v_sources jsonb;
  v_day integer;
  v_adjustment jsonb;
  v_content jsonb;
  v_suggestion text;
  v_document_id uuid;
  v_document record;
  v_adjustment_source jsonb;
  v_prior_document record;
  v_prior_content jsonb;
  v_prior_created timestamptz;
  v_barrier_label text;
begin
  v_date := dtc_private.a2_action_validate_command(p_command);
  if p_user_id is null then raise exception using errcode='22023', message='a2_action_invalid_payload'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('dtc:a2-action:' || p_user_id::text,0));
  perform dtc_private.a2_plan_require_pilot(p_user_id);
  v_hash := pg_catalog.sha256(pg_catalog.convert_to(p_command::text,'UTF8'));
  select * into v_receipt from dtc_private.a2_assistant_action_receipts
    where user_id=p_user_id and request_id=(p_command->>'requestId')::uuid;
  if found then
    if v_receipt.command_hash is distinct from v_hash then
      raise exception using errcode='P0001', message='a2_action_request_conflict';
    end if;
    -- A replay only returns metadata. In particular it never restores a document
    -- deleted or edited after this original transaction committed.
    return dtc_private.a2_action_receipt_json(v_receipt,true);
  end if;

  -- Clock is read after the owner/admission locks, so midnight cannot make a
  -- queued request silently accept a date that has already expired in Chile.
  v_now := pg_catalog.clock_timestamp();
  v_today := (v_now at time zone 'America/Santiago')::date;
  if v_date<v_today or v_date>v_today+30 then
    raise exception using errcode='P0001', message='a2_action_review_date_invalid';
  end if;
  if pg_catalog.jsonb_typeof(p_context_snapshot) is distinct from 'object'
    or p_context_snapshot->'available' is distinct from 'true'::jsonb then
    raise exception using errcode='55000', message='a2_action_context_unavailable';
  end if;
  if pg_catalog.octet_length(p_context_snapshot::text)>256000
    or p_context_snapshot->>'version' is distinct from 'dtc-a2-plan-context.v1'
    or not (p_context_snapshot ?& array['version','capturedAt','hash','available','projection'])
    or exists (select 1 from pg_catalog.jsonb_object_keys(p_context_snapshot) k
      where k not in ('version','capturedAt','hash','available','projection'))
    or pg_catalog.jsonb_typeof(p_context_snapshot->'hash') is distinct from 'string'
    or (p_context_snapshot->>'hash') !~ '^[0-9a-f]{64}$'
    or pg_catalog.jsonb_typeof(p_context_snapshot->'capturedAt') is distinct from 'string'
    or (p_context_snapshot->>'capturedAt') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,6})?(Z|[+-][0-9]{2}:[0-9]{2})$'
    or pg_catalog.jsonb_typeof(p_context_snapshot->'projection') is distinct from 'object' then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  begin v_captured_at := (p_context_snapshot->>'capturedAt')::timestamptz;
  exception when data_exception then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end;
  if not pg_catalog.isfinite(v_captured_at) or v_captured_at>v_now+interval '1 minute'
    or v_captured_at<v_now-interval '5 minutes' then
    raise exception using errcode='55000', message='a2_action_context_unavailable';
  end if;
  if p_context_snapshot->>'hash' is distinct from p_command->>'expectedContextHash' then
    raise exception using errcode='P0001', message='a2_action_context_changed';
  end if;

  -- The API supplies a validated, hashed, fresh server projection and derives its
  -- day from guidedPracticeDay. This check does not claim a global source lock:
  -- objective/journey/adjustment sources may still change after their reads.
  v_day := (p_command->>'dayNumber')::integer;
  v_projection := p_context_snapshot->'projection';
  v_sources := v_projection->'sources';
  if pg_catalog.jsonb_typeof(v_projection->'completedDays') is distinct from 'array'
    or pg_catalog.jsonb_typeof(v_projection->'activeHorizon') is distinct from 'number'
    or coalesce(v_projection->>'activeHorizon','') not in ('30','60','90')
    or pg_catalog.jsonb_typeof(v_sources) is distinct from 'array'
    or coalesce(v_projection->>'practicePath','') not in ('persona','profesional','ambos') then
    raise exception using errcode='22023', message='a2_action_invalid_payload';
  end if;
  if v_projection->'next'->>'href' is distinct from '/despega/a2/dia-' || v_day::text
    or v_projection->'completedDays' @> pg_catalog.jsonb_build_array(v_day)
    or v_day>(v_projection->>'activeHorizon')::integer
    or v_projection->'checkpointPending' is distinct from 'false'::jsonb then
    raise exception using errcode='P0001', message='a2_action_day_changed';
  end if;
  if exists (select 1 from pg_catalog.jsonb_array_elements(v_sources) s where s->>'status'='unavailable')
    or not exists (select 1 from pg_catalog.jsonb_array_elements(v_sources) s where s->>'id'='journey' and s->>'status'='available')
    or not exists (select 1 from pg_catalog.jsonb_array_elements(v_sources) s where s->>'id'='adjustment' and s->>'status' in ('available','missing'))
    or (v_projection->>'practicePath'<>'persona' and not exists
      (select 1 from pg_catalog.jsonb_array_elements(v_sources) s where s->>'id'='objective' and s->>'status' in ('available','missing'))) then
    raise exception using errcode='55000', message='a2_action_context_unavailable';
  end if;

  -- Serialize the effects of this RPC against the exact adjustment consumed by
  -- the reviewed context. Different concurrent confirmations must re-review the
  -- first result instead of silently making a new latest adjustment from old data.
  -- A legacy writer does not share this lock; only its observed writes are checked.
  select value into v_adjustment_source from pg_catalog.jsonb_array_elements(v_sources)
    where value->>'id'='adjustment';
  select id,created_at,content into v_prior_document from public.dtc_documents
    where user_id=p_user_id and type='a2_practice_adjustment' and related_day=v_day
    order by created_at desc,id desc limit 1;
  if not found then
    if v_adjustment_source->>'status' is distinct from 'missing' then
      raise exception using errcode='P0001', message='a2_action_context_changed';
    end if;
  else
    if v_adjustment_source->>'status' is distinct from 'available'
      or v_adjustment_source->>'recordId' is distinct from v_prior_document.id::text then
      raise exception using errcode='P0001', message='a2_action_context_changed';
    end if;
    begin
      v_prior_created := (v_adjustment_source->>'recordedAt')::timestamptz;
      v_prior_content := v_prior_document.content::jsonb;
    exception when data_exception then
      raise exception using errcode='P0001', message='a2_action_context_changed';
    end;
    v_barrier_label := case v_prior_content->>'barrier'
      when 'time' then 'Me faltó tiempo'
      when 'unclear' then 'No estaba claro qué hacer'
      when 'resources' then 'Me faltó un recurso o apoyo'
      when 'energy' then 'No tenía energía disponible'
      when 'goal_changed' then 'La acción ya no encaja con mi objetivo'
      when 'other' then 'Otra barrera' end;
    if v_prior_created is distinct from v_prior_document.created_at
      or pg_catalog.jsonb_typeof(v_prior_content) is distinct from 'object'
      or v_prior_content->'version' is distinct from '1'::jsonb
      or v_prior_content->'dayNumber' is distinct from pg_catalog.to_jsonb(v_day)
      or v_projection->'adjustment'->'dayNumber' is distinct from pg_catalog.to_jsonb(v_day)
      or v_barrier_label is null
      or v_projection->'adjustment'->>'barrierLabel' is distinct from v_barrier_label
      or v_projection->'adjustment'->>'retainedWork' is distinct from v_prior_content->>'retainedWork'
      or v_projection->'adjustment'->>'nextAction' is distinct from v_prior_content->>'nextAction'
      or v_projection->'adjustment'->>'reviewDate' is distinct from v_prior_content->>'reviewDate' then
      raise exception using errcode='P0001', message='a2_action_context_changed';
    end if;
  end if;

  v_adjustment := p_command->'adjustment';
  v_suggestion := case v_adjustment->>'barrier'
    when 'time' then 'Reduce la acción a un paso de 10 minutos y reserva un momento concreto.'
    when 'unclear' then 'Escribe qué resultado necesitas y pide un ejemplo o una aclaración antes de repetir.'
    when 'resources' then 'Identifica el recurso mínimo o una persona a quien puedas pedir ayuda; conserva lo que ya tienes.'
    when 'energy' then 'Reduce el alcance o cambia el momento de la práctica según tu disponibilidad.'
    when 'goal_changed' then 'Elige otra acción que apoye tu objetivo actual y especifica qué evidencia conservarás.'
    else 'Describe la barrera y cambia una condición para que el siguiente intento sea viable.' end;
  v_content := pg_catalog.jsonb_build_object('version',1,'dayNumber',v_day,
    'outcome',v_adjustment->>'outcome','barrier',v_adjustment->>'barrier',
    'retainedWork',v_adjustment->>'retainedWork','nextAction',v_adjustment->>'nextAction',
    'reviewDate',v_adjustment->>'reviewDate','suggestion',v_suggestion);
  v_document_id := pg_catalog.gen_random_uuid();
  insert into public.dtc_documents(id,user_id,title,type,source_module,related_day,source,status,content,created_at)
    values(v_document_id,p_user_id,'Ajuste de práctica · Día ' || v_day::text,
      'a2_practice_adjustment','a2',v_day,'user','draft',v_content::text,v_now)
    returning id,user_id,title,type,source_module,related_day,source,status,content,created_at into v_document;
  if v_document.id is distinct from v_document_id or v_document.user_id is distinct from p_user_id
    or v_document.title is distinct from 'Ajuste de práctica · Día ' || v_day::text
    or v_document.type is distinct from 'a2_practice_adjustment' or v_document.source_module is distinct from 'a2'
    or v_document.related_day is distinct from v_day or v_document.source is distinct from 'user'
    or v_document.status is distinct from 'draft' or v_document.content is distinct from v_content::text
    or v_document.created_at is distinct from v_now then
    raise exception using errcode='55000', message='a2_action_effect_unconfirmed';
  end if;
  insert into dtc_private.a2_assistant_action_receipts(user_id,request_id,command_hash,document_id,day_number,committed_at)
    values(p_user_id,(p_command->>'requestId')::uuid,v_hash,v_document_id,v_day,v_now)
    returning * into v_receipt;
  return dtc_private.a2_action_receipt_json(v_receipt,false);
end;
$$;

revoke all on function dtc_private.a2_action_validate_command(jsonb),
  dtc_private.a2_action_receipt_json(dtc_private.a2_assistant_action_receipts,boolean),
  public.read_a2_assistant_action_receipt(uuid,jsonb), public.confirm_a2_assistant_action(uuid,jsonb,jsonb)
  from public,anon,authenticated;
grant execute on function dtc_private.a2_action_validate_command(jsonb),
  dtc_private.a2_action_receipt_json(dtc_private.a2_assistant_action_receipts,boolean),
  public.read_a2_assistant_action_receipt(uuid,jsonb), public.confirm_a2_assistant_action(uuid,jsonb,jsonb)
  to service_role;

comment on table dtc_private.a2_assistant_action_receipts is
  'Immutable command hash and commit metadata only. Separate from the deletable user-reviewed document so retries never restore removed content.';
comment on function public.confirm_a2_assistant_action(uuid,jsonb,jsonb) is
  'Service-only invoker. Reviewed adjustment plus private receipt commit atomically; locked pilot admission, dated canonical server context, explicit owner and no journey/XP mutation. Sources are not globally locked.';
commit;
