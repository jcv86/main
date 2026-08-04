-- Transactional A3 module completion -> Career Identity dual-write.
-- The canonical application writer appends verified module IDs to
-- a3_user_progress.completed_module_ids. This trigger detects only newly added
-- modules and writes identity, evidence and audit in the same transaction.

create or replace function public.sync_a3_progress_to_career_identity()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_module_id text;
  v_identity_id uuid;
  v_identity_version integer;
  v_completed_count integer;
  v_correlation_id text;
  v_profile_patch jsonb;
  v_module_title text;
  v_evidence_type text;
begin
  if new.user_id is null then
    raise exception using errcode = '23502', message = 'A3 progress requires user_id';
  end if;

  v_completed_count := coalesce(array_length(new.completed_module_ids, 1), 0);

  for v_module_id in
    select module_id
    from unnest(coalesce(new.completed_module_ids, array[]::text[])) as module_id
    except
    select module_id
    from unnest(
      case when tg_op = 'UPDATE'
        then coalesce(old.completed_module_ids, array[]::text[])
        else array[]::text[]
      end
    ) as module_id
  loop
    select
      case v_module_id
        when 'career-mirror' then 'Espejo profesional'
        when 'value-mining-lab' then 'Laboratorio de valor profesional'
        when 'cv-builder-studio' then 'Construcción de CV'
        when 'job-decoder' then 'Decodificación de oportunidades'
        when 'answer-architecture' then 'Arquitectura de respuestas'
        when 'coach-practice-room' then 'Práctica guiada de entrevista'
        when 'communication-gym' then 'Comunicación profesional'
        when 'first-recruiter-simulation' then 'Simulación con reclutador'
        when 'risk-difficult-questions-lab' then 'Preguntas difíciles y riesgo'
        when 'basic-interview-mission' then 'Misión integral de entrevista'
        else v_module_id
      end,
      case v_module_id
        when 'cv-builder-studio' then 'cv_completion'
        when 'job-decoder' then 'job_analysis_completion'
        when 'communication-gym' then 'communication_completion'
        when 'first-recruiter-simulation' then 'interview_simulation_completion'
        when 'risk-difficult-questions-lab' then 'interview_simulation_completion'
        when 'basic-interview-mission' then 'interview_mission_completion'
        else 'training_module_completion'
      end
    into v_module_title, v_evidence_type;

    v_profile_patch := case v_module_id
      when 'career-mirror' then jsonb_build_object('careerMirrorCompleted', true)
      when 'value-mining-lab' then jsonb_build_object('valueMiningCompleted', true)
      when 'cv-builder-studio' then jsonb_build_object('cvBuilderCompleted', true)
      when 'job-decoder' then jsonb_build_object('jobDecoderCompleted', true)
      when 'answer-architecture' then jsonb_build_object('answerArchitectureCompleted', true)
      when 'coach-practice-room' then jsonb_build_object('coachPracticeCompleted', true)
      when 'communication-gym' then jsonb_build_object('communicationGymCompleted', true)
      when 'first-recruiter-simulation' then jsonb_build_object('firstRecruiterSimulationCompleted', true)
      when 'risk-difficult-questions-lab' then jsonb_build_object('difficultQuestionsLabCompleted', true)
      when 'basic-interview-mission' then jsonb_build_object('basicInterviewMissionCompleted', true)
      else jsonb_build_object('lastUnknownA3Module', v_module_id)
    end;

    v_correlation_id := gen_random_uuid()::text;

    insert into public.career_identities (
      user_id,
      interview_profile,
      communication_profile,
      learning_profile,
      metadata
    ) values (
      new.user_id,
      case when v_module_id in (
        'answer-architecture', 'coach-practice-room',
        'first-recruiter-simulation', 'risk-difficult-questions-lab',
        'basic-interview-mission'
      ) then v_profile_patch else '{}'::jsonb end,
      case when v_module_id = 'communication-gym'
        then v_profile_patch else '{}'::jsonb end,
      jsonb_build_object(
        'a3CompletedModules', v_completed_count,
        'a3LastCompletedModule', v_module_id,
        'a3LastCompletedAt', coalesce(new.updated_at, now())
      ) || case when v_module_id not in (
        'answer-architecture', 'coach-practice-room',
        'first-recruiter-simulation', 'risk-difficult-questions-lab',
        'basic-interview-mission', 'communication-gym'
      ) then v_profile_patch else '{}'::jsonb end,
      jsonb_build_object('a3Connected', true, 'a3ProgressId', new.id)
    )
    on conflict (user_id) do update set
      interview_profile = coalesce(public.career_identities.interview_profile, '{}'::jsonb)
        || excluded.interview_profile,
      communication_profile = coalesce(public.career_identities.communication_profile, '{}'::jsonb)
        || excluded.communication_profile,
      learning_profile = coalesce(public.career_identities.learning_profile, '{}'::jsonb)
        || excluded.learning_profile,
      metadata = coalesce(public.career_identities.metadata, '{}'::jsonb)
        || excluded.metadata,
      version = public.career_identities.version + 1,
      updated_at = now()
    returning id, version into v_identity_id, v_identity_version;

    insert into public.career_evidence (
      user_id, identity_id, source_module, source_type, source_ref,
      assertion, value, confidence, observed_at, metadata
    ) values (
      new.user_id,
      v_identity_id,
      'a3',
      v_evidence_type,
      'a3-module-' || v_module_id,
      format('A3 training module completed: %s', v_module_title),
      jsonb_build_object(
        'progressId', new.id,
        'moduleId', v_module_id,
        'moduleTitle', v_module_title,
        'completedModuleCount', v_completed_count,
        'moduleState', coalesce(new.module_states -> v_module_id, '"completed"'::jsonb)
      ),
      80,
      coalesce(new.updated_at, now()),
      jsonb_build_object(
        'identityVersion', v_identity_version,
        'correlationId', v_correlation_id
      )
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
      new.user_id,
      v_identity_id,
      'a3-completion-writer',
      '1.0.0',
      'a3',
      v_correlation_id,
      'complete_module_dual_write',
      'a3_user_progress',
      new.id,
      'accepted',
      jsonb_build_object(
        'moduleId', v_module_id,
        'moduleTitle', v_module_title,
        'completedModuleCount', v_completed_count,
        'identityVersion', v_identity_version
      )
    );
  end loop;

  return new;
end;
$$;

revoke all on function public.sync_a3_progress_to_career_identity() from public;
revoke all on function public.sync_a3_progress_to_career_identity() from anon;
revoke all on function public.sync_a3_progress_to_career_identity() from authenticated;

drop trigger if exists a3_progress_career_identity_sync
  on public.a3_user_progress;

create trigger a3_progress_career_identity_sync
after insert or update of completed_module_ids
on public.a3_user_progress
for each row
execute function public.sync_a3_progress_to_career_identity();
