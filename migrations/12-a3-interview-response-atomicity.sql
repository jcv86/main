begin;

alter table public.a3_respuestas_entrevista
  alter column sesion_id set not null,
  alter column pregunta_id set not null;

alter table public.a3_respuestas_entrevista
  add constraint a3_respuestas_entrevista_session_question_key
  unique (sesion_id, pregunta_id);

create or replace function public.complete_a3_interview_response(
  p_user_id uuid,
  p_session_id uuid,
  p_question_id uuid,
  p_response_text text,
  p_score integer,
  p_feedback text,
  p_improvements jsonb,
  p_strengths jsonb,
  p_duration integer,
  p_xp integer
)
returns table (
  response_id uuid,
  inserted boolean,
  stored_score integer,
  stored_feedback text,
  current_xp integer,
  total_xp integer,
  interview_streak integer,
  best_interview_streak integer,
  total_interviews_completed integer,
  current_level character varying
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_response public.a3_respuestas_entrevista%rowtype;
  v_profile public.user_gamification_profile%rowtype;
  v_inserted boolean := false;
  v_safe_score integer := greatest(0, least(100, coalesce(p_score, 0)));
  v_safe_duration integer := greatest(1, least(3600, coalesce(p_duration, 60)));
  v_safe_xp integer := greatest(0, least(500, coalesce(p_xp, 0)));
begin
  if p_user_id is null or p_session_id is null or p_question_id is null then
    raise exception 'Missing interview ownership identifiers';
  end if;

  if nullif(btrim(coalesce(p_response_text, '')), '') is null then
    raise exception 'Interview response cannot be empty';
  end if;

  if not exists (
    select 1
    from public.a3_entrevistas_sesiones session
    where session.id = p_session_id
      and session.user_id = p_user_id
  ) then
    raise exception 'Interview session does not belong to user';
  end if;

  insert into public.a3_respuestas_entrevista (
    sesion_id,
    pregunta_id,
    respuesta_usuario,
    score_calidad,
    feedback_ia,
    areas_mejora,
    puntos_fuertes,
    tiempo_respuesta,
    created_at
  )
  values (
    p_session_id,
    p_question_id,
    btrim(p_response_text),
    v_safe_score,
    coalesce(p_feedback, '{}'),
    coalesce(p_improvements, '[]'::jsonb),
    coalesce(p_strengths, '[]'::jsonb),
    v_safe_duration,
    now()
  )
  on conflict (sesion_id, pregunta_id) do nothing
  returning * into v_response;

  if found then
    v_inserted := true;

    insert into public.user_gamification_profile (
      user_id,
      current_level,
      current_xp,
      total_xp,
      interview_streak,
      best_interview_streak,
      total_interviews_completed,
      updated_at
    )
    values (
      p_user_id,
      case
        when v_safe_xp >= 10000 then 'Elite'
        when v_safe_xp >= 5000 then 'Gold'
        when v_safe_xp >= 2500 then 'Silver'
        else 'Bronze'
      end,
      v_safe_xp,
      v_safe_xp,
      1,
      1,
      1,
      now()
    )
    on conflict (user_id) do update
    set
      current_xp = coalesce(public.user_gamification_profile.current_xp, 0) + v_safe_xp,
      total_xp = coalesce(public.user_gamification_profile.total_xp, 0) + v_safe_xp,
      interview_streak = coalesce(public.user_gamification_profile.interview_streak, 0) + 1,
      best_interview_streak = greatest(
        coalesce(public.user_gamification_profile.best_interview_streak, 0),
        coalesce(public.user_gamification_profile.interview_streak, 0) + 1
      ),
      total_interviews_completed =
        coalesce(public.user_gamification_profile.total_interviews_completed, 0) + 1,
      current_level = case
        when coalesce(public.user_gamification_profile.total_xp, 0) + v_safe_xp >= 10000 then 'Elite'
        when coalesce(public.user_gamification_profile.total_xp, 0) + v_safe_xp >= 5000 then 'Gold'
        when coalesce(public.user_gamification_profile.total_xp, 0) + v_safe_xp >= 2500 then 'Silver'
        else 'Bronze'
      end,
      updated_at = now()
    returning * into v_profile;
  else
    select *
    into v_response
    from public.a3_respuestas_entrevista response
    where response.sesion_id = p_session_id
      and response.pregunta_id = p_question_id;

    select *
    into v_profile
    from public.user_gamification_profile profile
    where profile.user_id = p_user_id;
  end if;

  return query
  select
    v_response.id,
    v_inserted,
    coalesce(v_response.score_calidad, 0),
    coalesce(v_response.feedback_ia, '{}'),
    coalesce(v_profile.current_xp, 0),
    coalesce(v_profile.total_xp, 0),
    coalesce(v_profile.interview_streak, 0),
    coalesce(v_profile.best_interview_streak, 0),
    coalesce(v_profile.total_interviews_completed, 0),
    coalesce(v_profile.current_level, 'Bronze'::character varying);
end;
$$;

revoke all on function public.complete_a3_interview_response(
  uuid, uuid, uuid, text, integer, text, jsonb, jsonb, integer, integer
) from public, anon, authenticated;

grant execute on function public.complete_a3_interview_response(
  uuid, uuid, uuid, text, integer, text, jsonb, jsonb, integer, integer
) to service_role;

commit;
