-- Owner-scoped retries and follow-up completion for DTC Outcomes Chile.
-- Apply after foundation and atomic_capture, before serving the RPC capture path.
-- Request records are private, are retained with their owner, and are removed
-- automatically when that auth user is deleted. No client may read the payloads.

create table if not exists public.dtc_outcome_write_requests (
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  action text not null check (action in ('job_search_event','employment_outcome','salary_outcome','complete_followup')),
  request_payload jsonb not null check (jsonb_typeof(request_payload) = 'object'),
  saved_response jsonb null check (saved_response is null or jsonb_typeof(saved_response) = 'object'),
  created_at timestamptz not null default now(),
  primary key (user_id, request_id)
);

alter table public.dtc_outcome_write_requests enable row level security;
alter table public.dtc_outcome_write_requests force row level security;
revoke all on table public.dtc_outcome_write_requests from public, anon, authenticated;
grant select, insert, update on table public.dtc_outcome_write_requests to service_role;

create or replace function public.capture_dtc_chile_outcome(
  p_user_id uuid,
  p_request_id uuid,
  p_action text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog
as $$
declare
  v_request public.dtc_outcome_write_requests%rowtype;
  v_followup public.dtc_outcome_followups%rowtype;
  v_response jsonb;
  v_now timestamptz := statement_timestamp();
  v_today date := (v_now at time zone 'America/Santiago')::date;
  v_active boolean;
  v_same_role boolean;
begin
  if p_user_id is null or p_request_id is null then
    raise exception 'INVALID_REQUEST_ID' using errcode = 'PT422';
  end if;
  if p_action is null or p_action not in ('job_search_event','employment_outcome','salary_outcome','complete_followup')
    or p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'INVALID_INPUT' using errcode = 'PT422';
  end if;

  -- The unique owner/request key serializes concurrent retries. If another
  -- transaction owns this key, INSERT waits for its commit or rollback. The
  -- following statement then reads the committed response under READ COMMITTED.
  insert into public.dtc_outcome_write_requests (user_id, request_id, action, request_payload)
    values (p_user_id, p_request_id, p_action, p_payload)
    on conflict (user_id, request_id) do nothing;

  if not found then
    select * into v_request from public.dtc_outcome_write_requests
      where user_id = p_user_id and request_id = p_request_id for update;
    if not found then
      raise exception 'OUTCOME_REQUEST_RETRY' using errcode = '40001';
    end if;
    if v_request.action is distinct from p_action or v_request.request_payload is distinct from p_payload then
      raise exception 'IDEMPOTENCY_KEY_REUSED' using errcode = 'PT409';
    end if;
    if v_request.saved_response is null then
      raise exception 'OUTCOME_REQUEST_INCOMPLETE' using errcode = '55000';
    end if;
    return v_request.saved_response;
  end if;

  case p_action
    when 'job_search_event' then
      if (p_payload->>'occurred_at')::timestamptz > v_now then
        raise exception 'FUTURE_OCCURRED_AT' using errcode = 'PT422';
      end if;
      insert into public.dtc_job_search_events as saved (
        user_id, event_type, occurred_at, source_channel, target_role,
        occupation_code, region_code, verification_status, evidence_refs
      ) values (
        p_user_id, p_payload->>'event_type', (p_payload->>'occurred_at')::timestamptz,
        p_payload->>'source_channel', p_payload->>'target_role',
        p_payload->>'occupation_code', p_payload->>'region_code', 'self_reported', '[]'::jsonb
      ) returning jsonb_build_object(
        'id', saved.id, 'event_type', saved.event_type, 'occurred_at', saved.occurred_at,
        'verification_status', saved.verification_status
      ) into v_response;

    when 'employment_outcome' then
      if (p_payload->>'effective_date')::date > v_today then
        raise exception 'FUTURE_EFFECTIVE_DATE' using errcode = 'PT422';
      end if;
      -- The existing invoker trigger creates all three follow-ups in this same
      -- statement. Any failure also rolls back the reserved request key.
      insert into public.dtc_employment_outcomes as saved (
        user_id, outcome_type, effective_date, role_title, occupation_code,
        region_code, work_mode, employment_category, source_channel,
        verification_status, evidence_refs
      ) values (
        p_user_id, p_payload->>'outcome_type', (p_payload->>'effective_date')::date,
        p_payload->>'role_title', p_payload->>'occupation_code', p_payload->>'region_code',
        p_payload->>'work_mode', p_payload->>'employment_category', p_payload->>'source_channel',
        'self_reported', '[]'::jsonb
      ) returning jsonb_build_object(
        'id', saved.id, 'outcome_type', saved.outcome_type, 'effective_date', saved.effective_date,
        'verification_status', saved.verification_status
      ) into v_response;

    when 'salary_outcome' then
      if (p_payload->>'measured_at')::date > v_today then
        raise exception 'FUTURE_MEASURED_AT' using errcode = 'PT422';
      end if;
      if p_payload->>'employment_outcome_id' is not null and not exists (
        select 1 from public.dtc_employment_outcomes
        where id = (p_payload->>'employment_outcome_id')::uuid and user_id = p_user_id
      ) then
        -- Missing and other-owner links have exactly the same public response.
        raise exception 'INVALID_EMPLOYMENT_OUTCOME_ID' using errcode = 'PT422';
      end if;
      insert into public.dtc_salary_outcomes as saved (
        user_id, employment_outcome_id, measurement_role, monthly_net_clp,
        measured_at, verification_status, evidence_refs
      ) values (
        p_user_id, (p_payload->>'employment_outcome_id')::uuid, p_payload->>'measurement_role',
        (p_payload->>'monthly_net_clp')::integer, (p_payload->>'measured_at')::date,
        'self_reported', '[]'::jsonb
      ) returning jsonb_build_object(
        'id', saved.id, 'measurement_role', saved.measurement_role,
        'monthly_net_clp', saved.monthly_net_clp, 'measured_at', saved.measured_at,
        'verification_status', saved.verification_status
      ) into v_response;

    when 'complete_followup' then
      if jsonb_typeof(p_payload->'employment_active') is distinct from 'boolean' then
        raise exception 'INVALID_EMPLOYMENT_ACTIVE' using errcode = 'PT422';
      end if;
      if p_payload->'same_role' is not null and jsonb_typeof(p_payload->'same_role') not in ('null','boolean') then
        raise exception 'INVALID_SAME_ROLE' using errcode = 'PT422';
      end if;
      v_active := (p_payload->>'employment_active')::boolean;
      v_same_role := (p_payload->>'same_role')::boolean;
      if not v_active and v_same_role is not null then
        raise exception 'INVALID_SAME_ROLE' using errcode = 'PT422';
      end if;
      select * into v_followup from public.dtc_outcome_followups
        where id = (p_payload->>'followup_id')::uuid and user_id = p_user_id
        for update;
      if not found then
        raise exception 'FOLLOWUP_NOT_FOUND' using errcode = 'PT404';
      end if;
      if v_followup.verification_status <> 'self_reported' then
        raise exception 'FOLLOWUP_VERIFICATION_LOCKED' using errcode = 'PT409';
      end if;
      if v_followup.completed_at is not null then
        raise exception 'FOLLOWUP_ALREADY_COMPLETED' using errcode = 'PT409';
      end if;
      if v_followup.due_at > v_today then
        raise exception 'FOLLOWUP_NOT_DUE' using errcode = 'PT409';
      end if;
      update public.dtc_outcome_followups as saved
        set completed_at = v_now, employment_active = v_active, same_role = v_same_role,
          verification_status = 'self_reported'
        where saved.id = v_followup.id and saved.user_id = p_user_id
        returning jsonb_build_object(
          'id', saved.id, 'employment_outcome_id', saved.employment_outcome_id,
          'followup_day', saved.followup_day, 'due_at', saved.due_at,
          'completed_at', saved.completed_at, 'employment_active', saved.employment_active,
          'same_role', saved.same_role, 'verification_status', saved.verification_status
        ) into v_response;
  end case;

  update public.dtc_outcome_write_requests set saved_response = v_response
    where user_id = p_user_id and request_id = p_request_id;
  return v_response;
end
$$;

revoke all on function public.capture_dtc_chile_outcome(uuid, uuid, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.capture_dtc_chile_outcome(uuid, uuid, text, jsonb)
  to service_role;

comment on table public.dtc_outcome_write_requests is
  'Private owner-scoped request payloads and responses for retry-safe outcome capture; deleted with the auth user.';
comment on function public.capture_dtc_chile_outcome(uuid, uuid, text, jsonb) is
  'Service-only invoker mutation: owner-scoped idempotency, atomic capture, and locked due follow-up completion.';
