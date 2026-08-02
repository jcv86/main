begin;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conrelid = 'public.a3_route_progression'::regclass
       and conname = 'a3_route_progression_user_id_key'
  ) then
    alter table public.a3_route_progression
      add constraint a3_route_progression_user_id_key unique (user_id);
  end if;
end;
$$;

create or replace function public.complete_a3_module_atomic(
  p_user_id uuid,
  p_module_id text,
  p_module_number integer,
  p_next_module_id text,
  p_checkpoint_day integer,
  p_session_type text,
  p_lead_character text,
  p_score integer,
  p_xp integer,
  p_responses jsonb,
  p_deliverable jsonb,
  p_feedback jsonb,
  p_completed_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_now timestamptz := coalesce(p_completed_at, now());
  v_completion public.a3_module_completion%rowtype;
  v_is_first boolean;
  v_xp_awarded integer := 0;
  v_best_score integer := 0;
  v_total_attempts integer := 0;
  v_total_xp integer := 0;
  v_completed_ids jsonb := '[]'::jsonb;
  v_module_states jsonb := '{}'::jsonb;
  v_session_id uuid;
  v_completion_id uuid;
  v_progression_id uuid;
begin
  if p_user_id is null then
    raise exception 'user id is required';
  end if;

  if nullif(btrim(p_module_id), '') is null then
    raise exception 'module id is required';
  end if;

  if p_module_number < 1 or p_module_number > 10 then
    raise exception 'invalid module number';
  end if;

  if p_checkpoint_day < 1 or p_checkpoint_day > 90 then
    raise exception 'invalid checkpoint day';
  end if;

  if p_score < 0 or p_score > 100 then
    raise exception 'invalid module score';
  end if;

  if p_xp < 0 then
    raise exception 'invalid XP amount';
  end if;

  if p_session_type not in ('coach_training', 'interviewer_simulation') then
    raise exception 'invalid session type';
  end if;

  if p_lead_character not in ('coach', 'sofia', 'elena', 'bruno') then
    raise exception 'invalid lead character';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_user_id::text || ':' || p_module_id, 0)
  );

  select *
    into v_completion
    from public.a3_module_completion
   where user_id = p_user_id
     and module_id = p_module_id
   for update;

  v_is_first := not found;
  v_xp_awarded := case when v_is_first then p_xp else 0 end;

  insert into public.a3_session_attempts (
    user_id,
    module_id,
    module_number,
    session_type,
    lead_character,
    difficulty,
    is_route_checkpoint,
    is_replay,
    related_a2_day,
    status,
    progress,
    score,
    feedback,
    transcript,
    deliverable,
    session_completed_at,
    updated_at
  ) values (
    p_user_id,
    p_module_id,
    p_module_number,
    p_session_type::public.session_type,
    p_lead_character::public.character_type,
    'adaptive'::public.difficulty_level,
    true,
    not v_is_first,
    p_checkpoint_day,
    'completed',
    100,
    p_score,
    coalesce(p_feedback, '{}'::jsonb)::text,
    jsonb_build_object('responses', coalesce(p_responses, '[]'::jsonb)),
    coalesce(p_deliverable, '{}'::jsonb),
    v_now,
    v_now
  )
  returning id into v_session_id;

  if v_is_first then
    insert into public.a3_module_completion (
      user_id,
      module_id,
      module_number,
      completed_at,
      total_attempts,
      best_score,
      deliverable,
      created_at,
      updated_at
    ) values (
      p_user_id,
      p_module_id,
      p_module_number,
      v_now,
      1,
      p_score,
      coalesce(p_deliverable, '{}'::jsonb),
      v_now,
      v_now
    )
    returning id, best_score, total_attempts
      into v_completion_id, v_best_score, v_total_attempts;
  else
    update public.a3_module_completion
       set total_attempts = coalesce(total_attempts, 0) + 1,
           best_score = greatest(coalesce(best_score, 0), p_score),
           deliverable = coalesce(p_deliverable, '{}'::jsonb),
           updated_at = v_now
     where id = v_completion.id
    returning id, best_score, total_attempts
      into v_completion_id, v_best_score, v_total_attempts;
  end if;

  insert into public.a3_route_progression (
    user_id,
    current_module_number,
    total_completed,
    can_replay_modules_7_10,
    advanced_unlocked_at,
    pro_unlocked_at,
    route_completed_at,
    created_at,
    updated_at
  ) values (
    p_user_id,
    least(10, p_module_number + 1),
    case when v_is_first then 1 else 0 end,
    p_module_number >= 6,
    case when p_module_number >= 6 then v_now else null end,
    case when p_module_number = 10 then v_now else null end,
    case when p_module_number = 10 then v_now else null end,
    v_now,
    v_now
  )
  on conflict (user_id) do update
    set current_module_number = greatest(
          public.a3_route_progression.current_module_number,
          excluded.current_module_number
        ),
        total_completed = public.a3_route_progression.total_completed
          + case when v_is_first then 1 else 0 end,
        can_replay_modules_7_10 = public.a3_route_progression.can_replay_modules_7_10
          or excluded.can_replay_modules_7_10,
        advanced_unlocked_at = coalesce(
          public.a3_route_progression.advanced_unlocked_at,
          excluded.advanced_unlocked_at
        ),
        pro_unlocked_at = coalesce(
          public.a3_route_progression.pro_unlocked_at,
          excluded.pro_unlocked_at
        ),
        route_completed_at = coalesce(
          public.a3_route_progression.route_completed_at,
          excluded.route_completed_at
        ),
        updated_at = v_now
  returning id into v_progression_id;

  select
    coalesce(completed_module_ids, '[]'::jsonb),
    coalesce(module_states, '{}'::jsonb),
    coalesce(total_xp, 0)
    into v_completed_ids, v_module_states, v_total_xp
    from public.a3_user_progress
   where user_id = p_user_id::text
   for update;

  if not found then
    v_completed_ids := '[]'::jsonb;
    v_module_states := '{}'::jsonb;
    v_total_xp := 0;
  end if;

  if v_is_first and not (v_completed_ids ? p_module_id) then
    v_completed_ids := v_completed_ids || jsonb_build_array(p_module_id);
  end if;

  v_module_states := v_module_states || jsonb_build_object(p_module_id, 'completed');
  if nullif(btrim(coalesce(p_next_module_id, '')), '') is not null then
    if coalesce(v_module_states ->> p_next_module_id, 'locked') = 'locked' then
      v_module_states := v_module_states
        || jsonb_build_object(p_next_module_id, 'available');
    end if;
  end if;

  v_total_xp := v_total_xp + v_xp_awarded;

  insert into public.a3_user_progress (
    user_id,
    module_states,
    completed_module_ids,
    total_xp,
    current_module,
    created_at,
    updated_at
  ) values (
    p_user_id::text,
    v_module_states,
    v_completed_ids,
    v_total_xp,
    coalesce(nullif(btrim(coalesce(p_next_module_id, '')), ''), p_module_id),
    v_now,
    v_now
  )
  on conflict (user_id) do update
    set module_states = excluded.module_states,
        completed_module_ids = excluded.completed_module_ids,
        total_xp = excluded.total_xp,
        current_module = excluded.current_module,
        updated_at = v_now;

  return jsonb_build_object(
    'sessionId', v_session_id,
    'completionId', v_completion_id,
    'progressionId', v_progression_id,
    'isFirstCompletion', v_is_first,
    'xpAwarded', v_xp_awarded,
    'totalXp', v_total_xp,
    'bestScore', v_best_score,
    'totalAttempts', v_total_attempts,
    'nextModuleNumber', least(10, p_module_number + 1)
  );
end;
$$;

revoke all on function public.complete_a3_module_atomic(
  uuid, text, integer, text, integer, text, text, integer, integer,
  jsonb, jsonb, jsonb, timestamptz
) from public, anon, authenticated;

grant execute on function public.complete_a3_module_atomic(
  uuid, text, integer, text, integer, text, text, integer, integer,
  jsonb, jsonb, jsonb, timestamptz
) to service_role;

commit;
