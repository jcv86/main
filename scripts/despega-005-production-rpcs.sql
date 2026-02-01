-- A1 PRODUCTION RPCs (Atomic + Security-Hardened)
-- =====================================================

-- RPC 1: Insert A1 Checkin (with full scoring in DB)
-- Features:
--   - Server-side validation of 20 answers
--   - Server-side scoring calculation
--   - Creates/reuses active cycle
--   - Atomic transaction (all-or-nothing)
--   - No client timestamp spoofing

create or replace function insert_a1_checkin_transaction(
  p_raw_answers jsonb,
  p_context_shift boolean,
  p_context_care boolean,
  p_context_neuro boolean,
  p_context_text text,
  p_context_consent boolean
)
returns table (cycle_id uuid, result_id uuid, overall_score int)
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_cycle_id uuid;
  v_result_id uuid;

  v_e int := 0;
  v_f int := 0;
  v_r int := 0;
  v_p int := 0;

  v_e_pct int;
  v_f_pct int;
  v_r_pct int;
  v_p_pct int;
  v_overall int;

  v_now timestamptz := now();
  v_expires_at timestamptz := now() + interval '90 days';

  v_arr int[];
begin
  if v_uid is null then
    raise exception 'Unauthorized';
  end if;

  -- VALIDATION: p_raw_answers must be array of 20 ints (1..10)
  if jsonb_typeof(p_raw_answers) <> 'array' then
    raise exception 'raw_answers must be a JSON array';
  end if;

  select array_agg((value)::int)
  into v_arr
  from jsonb_array_elements_text(p_raw_answers);

  if array_length(v_arr, 1) <> 20 then
    raise exception 'raw_answers must contain exactly 20 numeric values';
  end if;

  if exists (
    select 1 from unnest(v_arr) x
    where x < 1 or x > 10
  ) then
    raise exception 'raw_answers values must be in range 1..10';
  end if;

  -- CYCLE: get or create active A1 cycle
  select id into v_cycle_id
  from despega_cycles
  where user_id = v_uid and pilar = 'a1_cerebral' and status = 'active'
  limit 1;

  if v_cycle_id is null then
    insert into despega_cycles(user_id, pilar, cycle_length_days, started_at, ends_at, status)
    values (v_uid, 'a1_cerebral', 30, v_now, v_now + interval '30 days', 'active')
    returning id into v_cycle_id;
  end if;

  -- SCORING: 4 dimensions x 5 questions each
  -- Energía: Q1..5, Enfoque: Q6..10, Relaciones: Q11..15, Plan Ejecutivo: Q16..20
  v_e := v_arr[1] + v_arr[2] + v_arr[3] + v_arr[4] + v_arr[5];
  v_f := v_arr[6] + v_arr[7] + v_arr[8] + v_arr[9] + v_arr[10];
  v_r := v_arr[11] + v_arr[12] + v_arr[13] + v_arr[14] + v_arr[15];
  v_p := v_arr[16] + v_arr[17] + v_arr[18] + v_arr[19] + v_arr[20];

  -- Normalize to 0-100 scale: (raw / 50) * 100
  v_e_pct := round((v_e::numeric / 50::numeric) * 100)::int;
  v_f_pct := round((v_f::numeric / 50::numeric) * 100)::int;
  v_r_pct := round((v_r::numeric / 50::numeric) * 100)::int;
  v_p_pct := round((v_p::numeric / 50::numeric) * 100)::int;

  -- Overall: average of 4 dimensions
  v_overall := round(((v_e_pct + v_f_pct + v_r_pct + v_p_pct)::numeric / 4))::int;

  -- 1) Insert result with calculated scores
  insert into despega_a1_results(
    user_id, cycle_id,
    diagnostic_score_energia, diagnostic_score_enfoque,
    diagnostic_score_relaciones, diagnostic_score_plan_ejecutivo,
    diagnostic_score_overall,
    context_shift_worker, context_caregiving,
    context_neurodiversity, context_other_approved,
    created_at
  ) values (
    v_uid, v_cycle_id,
    v_e_pct, v_f_pct, v_r_pct, v_p_pct, v_overall,
    p_context_shift, p_context_care, p_context_neuro, p_context_consent,
    v_now
  )
  returning id into v_result_id;

  -- 2) Insert context vault (if consented)
  if p_context_consent and p_context_text is not null then
    insert into despega_context_vault(
      user_id, cycle_id, context_other_text,
      consent_given, retention_days, expires_at, created_at
    ) values (
      v_uid, v_cycle_id, p_context_text,
      true, 90, v_expires_at, v_now
    );
  end if;

  -- 3) Upsert pilar progress
  insert into despega_pilar_progress(
    user_id, pilar, cycle_id,
    diagnostic_score, points_accumulated,
    missions_completed, total_missions_in_cycle, progress_pct,
    paquete_activo, is_unlocked, created_at, updated_at
  ) values (
    v_uid, 'a1_cerebral', v_cycle_id,
    v_overall, 0,
    0, 5, 0,
    'plan_ejecutivo', true, v_now, v_now
  )
  on conflict (user_id, pilar, cycle_id) do update set
    diagnostic_score = excluded.diagnostic_score,
    updated_at = v_now;

  -- 4) Insert timeline event
  insert into despega_score_events(
    user_id, pilar, cycle_id, event_type,
    diagnostic_score_at_event, points_delta, points_total, progress_pct_at_event,
    context_flags, created_at
  ) values (
    v_uid, 'a1_cerebral', v_cycle_id, 'diagnostic',
    v_overall, 0, 0, 0,
    jsonb_build_object(
      'shift_worker', p_context_shift,
      'caregiving', p_context_care,
      'neurodiversity', p_context_neuro
    ),
    v_now
  );

  -- 5) Update user profile pointer
  update despega_user_profiles
  set a1_active_cycle_id = v_cycle_id
  where user_id = v_uid;

  return query select v_cycle_id, v_result_id, v_overall;

exception when others then
  raise exception 'A1 checkin failed: %', sqlerrm;
end;
$$;

-- =====================================================

-- RPC 2: Complete A1 Mission (atomic + idempotent)
-- Features:
--   - Prevents double-completion (idempotent)
--   - Updates progress correctly (missions_completed, progress_pct)
--   - Logs event for timeline
--   - All-or-nothing transaction

create or replace function complete_a1_mission_transaction(
  p_mission_key text,
  p_user_notes text
)
returns table (status text, points_total int, progress_pct int)
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_uid uuid := auth.uid();
  v_cycle_id uuid;
  v_points int;
  v_total int;
  v_done int;
  v_points_total int;
  v_diag int;
  v_progress int;
  v_now timestamptz := now();
begin
  if v_uid is null then
    raise exception 'Unauthorized';
  end if;

  -- Get active cycle
  select a1_active_cycle_id into v_cycle_id
  from despega_user_profiles
  where user_id = v_uid;

  if v_cycle_id is null then
    raise exception 'No active A1 cycle';
  end if;

  -- Mark mission as completed (only if not already done = idempotent)
  update despega_user_misiones
  set completed = true,
      completed_at = v_now,
      user_notes = p_user_notes,
      puntos_earned = coalesce(puntos_earned, points)
  where user_id = v_uid
    and cycle_id = v_cycle_id
    and mission_key = p_mission_key
    and completed = false
  returning coalesce(puntos_earned, points) into v_points;

  if not found then
    -- Already completed or doesn't exist
    select points_accumulated, progress_pct
      into v_points_total, v_progress
    from despega_pilar_progress
    where user_id = v_uid and pilar = 'a1_cerebral' and cycle_id = v_cycle_id;

    return query select 'ALREADY_COMPLETED'::text, coalesce(v_points_total, 0), coalesce(v_progress, 0);
    return;
  end if;

  -- Lock and read progress row
  select diagnostic_score, total_missions_in_cycle, missions_completed, points_accumulated
    into v_diag, v_total, v_done, v_points_total
  from despega_pilar_progress
  where user_id = v_uid and pilar = 'a1_cerebral' and cycle_id = v_cycle_id
  for update;

  -- Increment counters
  v_done := coalesce(v_done, 0) + 1;
  v_points_total := coalesce(v_points_total, 0) + coalesce(v_points, 0);

  -- Recalculate progress percentage
  v_progress := case
    when coalesce(v_total, 0) = 0 then 0
    else round((v_done::numeric / v_total::numeric) * 100)::int
  end;

  -- Update progress
  update despega_pilar_progress
  set missions_completed = v_done,
      points_accumulated = v_points_total,
      progress_pct = v_progress,
      updated_at = v_now
  where user_id = v_uid and pilar = 'a1_cerebral' and cycle_id = v_cycle_id;

  -- Log event for timeline
  insert into despega_score_events(
    user_id, pilar, cycle_id, event_type,
    diagnostic_score_at_event, points_delta, points_total, progress_pct_at_event,
    context_flags, created_at
  ) values (
    v_uid, 'a1_cerebral', v_cycle_id, 'mission_completed',
    coalesce(v_diag, 0), coalesce(v_points, 0), v_points_total, v_progress,
    '{}'::jsonb, v_now
  );

  return query select 'SUCCESS'::text, v_points_total, v_progress;

exception when others then
  raise exception 'Mission completion failed: %', sqlerrm;
end;
$$;
