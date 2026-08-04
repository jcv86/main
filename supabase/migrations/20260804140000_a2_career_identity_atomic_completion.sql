-- Transactional A2 completion -> Career Identity dual-write.
-- The canonical route already validates the mission and writes a2_user_task_completions.
-- This trigger guarantees that identity, evidence and audit are committed or rolled back
-- with that canonical completion row.

create or replace function public.sync_a2_completion_to_career_identity()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_identity_id uuid;
  v_identity_version integer;
  v_total_completed integer;
  v_confidence numeric := 70;
  v_correlation_id text := gen_random_uuid()::text;
begin
  if new.user_id is null then
    raise exception using errcode = '23502', message = 'A2 completion requires user_id';
  end if;

  if new.day < 1 or new.day > 90 then
    raise exception using errcode = '22023', message = 'A2 completion day must be between 1 and 90';
  end if;

  if new.completed_at is null then
    return new;
  end if;

  begin
    if new.validation_result ? 'score' then
      v_confidence := greatest(
        0,
        least(100, (new.validation_result ->> 'score')::numeric)
      );
    end if;
  exception when invalid_text_representation then
    v_confidence := 70;
  end;

  select count(*)::integer
  into v_total_completed
  from public.a2_user_task_completions
  where user_id = new.user_id
    and completed_at is not null;

  insert into public.career_identities (user_id, learning_profile, metadata)
  values (
    new.user_id,
    jsonb_build_object(
      'a2LastCompletedDay', new.day,
      'a2CompletedDays', v_total_completed,
      'lastMissionType', new.mission_type,
      'lastValidationStatus', new.validation_status,
      'lastValidation', coalesce(new.validation_result, '{}'::jsonb),
      'lastCompletedAt', new.completed_at
    ),
    jsonb_build_object(
      'a2Connected', true,
      'a2LastCompletionId', new.id
    )
  )
  on conflict (user_id) do update set
    learning_profile = coalesce(public.career_identities.learning_profile, '{}'::jsonb)
      || excluded.learning_profile,
    metadata = coalesce(public.career_identities.metadata, '{}'::jsonb)
      || excluded.metadata,
    version = public.career_identities.version + 1,
    updated_at = now()
  returning id, version into v_identity_id, v_identity_version;

  insert into public.career_evidence (
    user_id,
    identity_id,
    source_module,
    source_type,
    source_ref,
    assertion,
    value,
    confidence,
    observed_at,
    metadata
  )
  values (
    new.user_id,
    v_identity_id,
    'a2',
    'mission_completion',
    'a2-day-' || new.day::text,
    format('A2 day %s mission completed with validated evidence', new.day),
    jsonb_build_object(
      'completionId', new.id,
      'day', new.day,
      'phase', new.phase,
      'taskTitle', new.task_title,
      'missionType', new.mission_type,
      'validationStatus', new.validation_status,
      'validation', coalesce(new.validation_result, '{}'::jsonb),
      'submission', coalesce(new.submission, '{}'::jsonb)
    ),
    v_confidence,
    new.completed_at,
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
    user_id,
    identity_id,
    agent_id,
    agent_version,
    source_module,
    correlation_id,
    operation,
    entity_type,
    entity_id,
    outcome,
    payload
  )
  values (
    new.user_id,
    v_identity_id,
    'a2-completion-writer',
    '1.0.0',
    'a2',
    v_correlation_id,
    case when tg_op = 'INSERT' then 'complete_day_dual_write' else 'refresh_day_dual_write' end,
    'a2_user_task_completions',
    new.id,
    'accepted',
    jsonb_build_object(
      'day', new.day,
      'phase', new.phase,
      'missionType', new.mission_type,
      'validationStatus', new.validation_status,
      'totalCompleted', v_total_completed,
      'identityVersion', v_identity_version
    )
  );

  return new;
end;
$$;

revoke all on function public.sync_a2_completion_to_career_identity() from public;
revoke all on function public.sync_a2_completion_to_career_identity() from anon;
revoke all on function public.sync_a2_completion_to_career_identity() from authenticated;

-- Recreate deterministically so repeated migration application cannot duplicate the trigger.
drop trigger if exists a2_completion_career_identity_sync
  on public.a2_user_task_completions;

create trigger a2_completion_career_identity_sync
after insert or update of completed_at, submission, validation_status, validation_result
on public.a2_user_task_completions
for each row
when (new.completed_at is not null)
execute function public.sync_a2_completion_to_career_identity();
