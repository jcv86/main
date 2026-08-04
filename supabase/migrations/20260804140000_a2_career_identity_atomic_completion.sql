-- Atomic A2 day completion + journey + Career Identity evidence.
create or replace function public.complete_a2_day_with_career_identity(
  p_day integer,
  p_phase integer,
  p_task_title text,
  p_mission_type text,
  p_submission jsonb,
  p_validation_status text,
  p_validation_result jsonb,
  p_next_day integer,
  p_highest_unlocked_day integer,
  p_active_horizon integer,
  p_extension_required boolean,
  p_next_horizon integer,
  p_current_module text,
  p_route_id uuid default null,
  p_route_code text default null,
  p_progress_percentage numeric default 0,
  p_total_completed integer default 0,
  p_correlation_id text default null
)
returns table (
  completion_id uuid,
  identity_id uuid,
  identity_version integer,
  already_completed boolean
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_now timestamptz := now();
  v_completion_id uuid;
  v_identity_id uuid;
  v_identity_version integer;
  v_existing_completion boolean := false;
  v_correlation_id text := coalesce(nullif(trim(p_correlation_id), ''), gen_random_uuid()::text);
  v_evidence_confidence numeric := greatest(0, least(100, coalesce((p_validation_result ->> 'score')::numeric, 70)));
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;
  if p_day < 1 or p_day > 90 then
    raise exception using errcode = '22023', message = 'day must be between 1 and 90';
  end if;
  if p_next_day < 1 or p_next_day > 90 then
    raise exception using errcode = '22023', message = 'next day must be between 1 and 90';
  end if;
  if p_highest_unlocked_day < 1 or p_highest_unlocked_day > 90 then
    raise exception using errcode = '22023', message = 'highest unlocked day must be between 1 and 90';
  end if;
  if p_active_horizon not in (30, 60, 90) then
    raise exception using errcode = '22023', message = 'active horizon must be 30, 60 or 90';
  end if;
  if coalesce(trim(p_task_title), '') = '' then
    raise exception using errcode = '22023', message = 'task title is required';
  end if;
  if p_validation_status not in ('specialized', 'checkpoint', 'structural') then
    raise exception using errcode = '22023', message = 'invalid validation status';
  end if;

  select exists(
    select 1
    from public.a2_user_task_completions
    where user_id = v_user_id
      and phase = p_phase
      and day = p_day
      and task_title = p_task_title
  ) into v_existing_completion;

  insert into public.a2_user_task_completions (
    user_id, phase, day, task_title, mission_type, submission,
    validation_status, validation_result, completed_at, created_at, updated_at
  ) values (
    v_user_id, p_phase, p_day, p_task_title, p_mission_type, coalesce(p_submission, '{}'::jsonb),
    p_validation_status, coalesce(p_validation_result, '{}'::jsonb), v_now, v_now, v_now
  )
  on conflict (user_id, phase, day, task_title) do update set
    mission_type = excluded.mission_type,
    submission = excluded.submission,
    validation_status = excluded.validation_status,
    validation_result = excluded.validation_result,
    completed_at = excluded.completed_at,
    updated_at = excluded.updated_at
  returning id into v_completion_id;

  insert into public.despega_journey_state (
    user_id, current_module, current_a2_day, highest_a2_day_unlocked,
    a2_started_at, a2_completed_at, a3_unlocked_at, a4_unlocked_at,
    version, metadata, created_at, updated_at
  ) values (
    v_user_id, p_current_module, p_next_day, p_highest_unlocked_day,
    v_now, case when p_day = 90 then v_now else null end,
    case when p_day >= 30 then v_now else null end,
    case when p_day >= 60 then v_now else null end,
    1,
    jsonb_build_object(
      'route_id', p_route_id,
      'route_code', p_route_code,
      'a2_horizon', p_active_horizon,
      'a2_extension_required', p_extension_required,
      'a2_next_horizon', p_next_horizon
    ),
    v_now, v_now
  )
  on conflict (user_id) do update set
    current_module = excluded.current_module,
    current_a2_day = excluded.current_a2_day,
    highest_a2_day_unlocked = greatest(public.despega_journey_state.highest_a2_day_unlocked, excluded.highest_a2_day_unlocked),
    a2_started_at = coalesce(public.despega_journey_state.a2_started_at, excluded.a2_started_at),
    a2_completed_at = coalesce(public.despega_journey_state.a2_completed_at, excluded.a2_completed_at),
    a3_unlocked_at = coalesce(public.despega_journey_state.a3_unlocked_at, excluded.a3_unlocked_at),
    a4_unlocked_at = coalesce(public.despega_journey_state.a4_unlocked_at, excluded.a4_unlocked_at),
    version = public.despega_journey_state.version + 1,
    metadata = coalesce(public.despega_journey_state.metadata, '{}'::jsonb) || excluded.metadata,
    updated_at = v_now;

  if p_route_id is not null then
    insert into public.a2_user_route_progress (
      user_id, route_id, estado, dia_actual, porcentaje_completado,
      fecha_inicio, fecha_fin, created_at, updated_at
    ) values (
      v_user_id, p_route_id,
      case when p_total_completed >= 90 then 'completado' else 'activo' end,
      p_next_day, p_progress_percentage, v_now,
      case when p_total_completed >= 90 then v_now else null end,
      v_now, v_now
    )
    on conflict (user_id, route_id) do update set
      estado = excluded.estado,
      dia_actual = excluded.dia_actual,
      porcentaje_completado = excluded.porcentaje_completado,
      fecha_inicio = coalesce(public.a2_user_route_progress.fecha_inicio, excluded.fecha_inicio),
      fecha_fin = coalesce(public.a2_user_route_progress.fecha_fin, excluded.fecha_fin),
      updated_at = v_now;
  end if;

  insert into public.career_identities (user_id, learning_profile, metadata)
  values (
    v_user_id,
    jsonb_build_object(
      'a2LastCompletedDay', p_day,
      'a2CompletedDays', p_total_completed,
      'a2ActiveHorizon', p_active_horizon,
      'lastMissionType', p_mission_type,
      'lastValidation', p_validation_result
    ),
    jsonb_build_object('a2Connected', true, 'a2LastCompletionId', v_completion_id)
  )
  on conflict (user_id) do update set
    learning_profile = coalesce(public.career_identities.learning_profile, '{}'::jsonb) || excluded.learning_profile,
    metadata = coalesce(public.career_identities.metadata, '{}'::jsonb) || excluded.metadata,
    version = public.career_identities.version + 1,
    updated_at = v_now
  returning id, version into v_identity_id, v_identity_version;

  insert into public.career_evidence (
    user_id, identity_id, source_module, source_type, source_ref,
    assertion, value, confidence, observed_at, metadata
  ) values (
    v_user_id, v_identity_id, 'a2', 'mission_completion',
    'a2-day-' || p_day::text,
    format('A2 day %s mission completed with validated evidence', p_day),
    jsonb_build_object(
      'day', p_day,
      'phase', p_phase,
      'taskTitle', p_task_title,
      'missionType', p_mission_type,
      'validationStatus', p_validation_status,
      'validation', p_validation_result,
      'submission', p_submission
    ),
    v_evidence_confidence, v_now,
    jsonb_build_object('completionId', v_completion_id, 'correlationId', v_correlation_id)
  )
  on conflict (user_id, source_module, source_type, source_ref)
    where source_ref is not null
  do update set
    identity_id = excluded.identity_id,
    assertion = excluded.assertion,
    value = excluded.value,
    confidence = excluded.confidence,
    observed_at = excluded.observed_at,
    metadata = excluded.metadata;

  insert into public.career_agent_events (
    user_id, identity_id, agent_id, agent_version, source_module,
    correlation_id, operation, entity_type, entity_id, outcome, payload
  ) values (
    v_user_id, v_identity_id, 'a2-completion-writer', '1.0.0', 'a2',
    v_correlation_id, 'complete_day_dual_write', 'a2_user_task_completions',
    v_completion_id, 'accepted',
    jsonb_build_object(
      'day', p_day,
      'alreadyCompleted', v_existing_completion,
      'nextDay', p_next_day,
      'highestUnlockedDay', p_highest_unlocked_day,
      'activeHorizon', p_active_horizon,
      'totalCompleted', p_total_completed
    )
  );

  return query select v_completion_id, v_identity_id, v_identity_version, v_existing_completion;
end;
$$;

revoke all on function public.complete_a2_day_with_career_identity(integer,integer,text,text,jsonb,text,jsonb,integer,integer,integer,boolean,integer,text,uuid,text,numeric,integer,text) from public;
revoke all on function public.complete_a2_day_with_career_identity(integer,integer,text,text,jsonb,text,jsonb,integer,integer,integer,boolean,integer,text,uuid,text,numeric,integer,text) from anon;
grant execute on function public.complete_a2_day_with_career_identity(integer,integer,text,text,jsonb,text,jsonb,integer,integer,integer,boolean,integer,text,uuid,text,numeric,integer,text) to authenticated;
