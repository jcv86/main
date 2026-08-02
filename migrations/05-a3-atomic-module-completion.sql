-- Atomic A3 module completion.
-- Keeps session, completion, progression and canonical XP in one transaction.

create unique index if not exists a3_route_progression_user_id_key
  on public.a3_route_progression (user_id);

create or replace function public.complete_a3_module_atomic(
  p_user_id uuid,
  p_module_id text,
  p_module_number integer,
  p_module_xp integer,
  p_checkpoint_day integer,
  p_training_type text,
  p_score integer,
  p_pass_score integer,
  p_feedback jsonb,
  p_responses jsonb,
  p_deliverable jsonb,
  p_next_module_id text,
  p_next_module_number integer,
  p_total_modules integer,
  p_unlock_advanced boolean default false,
  p_complete_route boolean default false
) returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_now timestamp := clock_timestamp();
  v_user_key text := p_user_id::text;
  v_existing_completion public.a3_module_completion%rowtype;
  v_existing_progress public.a3_user_progress%rowtype;
  v_session public.a3_session_attempts%rowtype;
  v_completion public.a3_module_completion%rowtype;
  v_route public.a3_route_progression%rowtype;
  v_is_first boolean;
  v_completed_ids text[];
  v_module_states jsonb;
  v_best_score integer;
  v_attempts integer;
  v_xp_awarded integer;
  v_total_xp integer;
  v_session_type public.session_type;
  v_character public.character_type;
begin
  if p_score < p_pass_score then
    raise exception 'A3 score below pass threshold';
  end if;

  select * into v_existing_completion
  from public.a3_module_completion
  where user_id = p_user_id and module_id = p_module_id
  for update;

  select * into v_existing_progress
  from public.a3_user_progress
  where user_id = v_user_key
  for update;

  perform 1
  from public.a3_route_progression
  where user_id = p_user_id
  for update;

  v_completed_ids := coalesce(v_existing_progress.completed_module_ids, array[]::text[]);
  v_module_states := coalesce(v_existing_progress.module_states, '{}'::jsonb);
  v_is_first := v_existing_completion.id is null
    and not (p_module_id = any(v_completed_ids));
  v_best_score := greatest(coalesce(v_existing_completion.best_score, 0), p_score);
  v_attempts := coalesce(v_existing_completion.total_attempts, 0) + 1;
  v_xp_awarded := case when v_is_first then greatest(p_module_xp, 0) else 0 end;
  v_total_xp := coalesce(v_existing_progress.total_xp, 0) + v_xp_awarded;
  v_session_type := case when p_training_type = 'coach'
    then 'coach_training'::public.session_type
    else 'interviewer_simulation'::public.session_type end;
  v_character := case when p_training_type = 'coach'
    then 'coach'::public.character_type
    else 'interviewer'::public.character_type end;

  insert into public.a3_session_attempts (
    user_id, module_id, module_number, session_type, lead_character,
    difficulty, is_route_checkpoint, is_replay, related_a2_day,
    status, progress, score, feedback, transcript, deliverable,
    session_completed_at, updated_at
  ) values (
    p_user_id, p_module_id, p_module_number, v_session_type, v_character,
    'adaptive'::public.difficulty_level, true, not v_is_first, p_checkpoint_day,
    'completed', 100, p_score, coalesce(p_feedback, '{}'::jsonb)::text,
    jsonb_build_object('responses', coalesce(p_responses, '[]'::jsonb)),
    coalesce(p_deliverable, '{}'::jsonb), v_now, v_now
  ) returning * into v_session;

  insert into public.a3_module_completion (
    user_id, module_id, module_number, completed_at,
    total_attempts, best_score, deliverable
  ) values (
    p_user_id, p_module_id, p_module_number, v_now,
    v_attempts, v_best_score, coalesce(p_deliverable, '{}'::jsonb)
  )
  on conflict (user_id, module_id) do update set
    module_number = excluded.module_number,
    total_attempts = excluded.total_attempts,
    best_score = excluded.best_score,
    deliverable = excluded.deliverable,
    completed_at = public.a3_module_completion.completed_at
  returning * into v_completion;

  insert into public.a3_route_progression (
    user_id, current_module_number, total_completed,
    can_replay_modules_7_10, advanced_unlocked_at,
    pro_unlocked_at, route_completed_at, updated_at
  ) values (
    p_user_id,
    greatest(1, least(p_total_modules, p_next_module_number)),
    case when v_is_first then 1 else 0 end,
    p_unlock_advanced,
    case when p_unlock_advanced then v_now else null end,
    case when p_complete_route then v_now else null end,
    case when p_complete_route then v_now else null end,
    v_now
  )
  on conflict (user_id) do update set
    current_module_number = greatest(
      coalesce(public.a3_route_progression.current_module_number, 1),
      excluded.current_module_number
    ),
    total_completed = coalesce(public.a3_route_progression.total_completed, 0)
      + case when v_is_first then 1 else 0 end,
    can_replay_modules_7_10 = coalesce(public.a3_route_progression.can_replay_modules_7_10, false)
      or p_unlock_advanced,
    advanced_unlocked_at = case
      when p_unlock_advanced then coalesce(public.a3_route_progression.advanced_unlocked_at, v_now)
      else public.a3_route_progression.advanced_unlocked_at end,
    pro_unlocked_at = case
      when p_complete_route then coalesce(public.a3_route_progression.pro_unlocked_at, v_now)
      else public.a3_route_progression.pro_unlocked_at end,
    route_completed_at = case
      when p_complete_route then coalesce(public.a3_route_progression.route_completed_at, v_now)
      else public.a3_route_progression.route_completed_at end,
    updated_at = v_now
  returning * into v_route;

  if not (p_module_id = any(v_completed_ids)) then
    v_completed_ids := array_append(v_completed_ids, p_module_id);
  end if;
  v_module_states := jsonb_set(v_module_states, array[p_module_id], '"completed"'::jsonb, true);
  if p_next_module_id is not null and p_next_module_id <> p_module_id then
    if coalesce(v_module_states ->> p_next_module_id, 'locked') = 'locked' then
      v_module_states := jsonb_set(v_module_states, array[p_next_module_id], '"available"'::jsonb, true);
    end if;
  end if;

  insert into public.a3_user_progress (
    user_id, module_states, completed_module_ids, total_xp,
    current_module, created_at, updated_at
  ) values (
    v_user_key, v_module_states, v_completed_ids, v_total_xp,
    coalesce(p_next_module_id, p_module_id), now(), now()
  )
  on conflict (user_id) do update set
    module_states = excluded.module_states,
    completed_module_ids = excluded.completed_module_ids,
    total_xp = excluded.total_xp,
    current_module = excluded.current_module,
    updated_at = now();

  return jsonb_build_object(
    'isFirstCompletion', v_is_first,
    'xpAwarded', v_xp_awarded,
    'totalXp', v_total_xp,
    'bestScore', v_best_score,
    'totalAttempts', v_attempts,
    'session', to_jsonb(v_session),
    'completion', to_jsonb(v_completion),
    'progress', to_jsonb(v_route)
  );
end;
$$;

revoke all on function public.complete_a3_module_atomic(
  uuid, text, integer, integer, integer, text, integer, integer,
  jsonb, jsonb, jsonb, text, integer, integer, boolean, boolean
) from public, anon, authenticated;
grant execute on function public.complete_a3_module_atomic(
  uuid, text, integer, integer, integer, text, integer, integer,
  jsonb, jsonb, jsonb, text, integer, integer, boolean, boolean
) to service_role;
