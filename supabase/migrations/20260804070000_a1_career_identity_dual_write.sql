-- Atomic A1 assessment + Career Identity dual-write.
-- The legacy assessment remains canonical for the existing A1 UI while the
-- longitudinal Career Identity receives explainable, idempotent evidence.

create unique index if not exists career_evidence_source_ref_uidx
  on public.career_evidence(user_id, source_module, source_type, source_ref)
  where source_ref is not null;

create or replace function public.save_a1_cerebral_with_career_identity(
  p_responses jsonb,
  p_questions jsonb,
  p_disc_profile jsonb,
  p_dominant_pattern text,
  p_secondary_pattern text default null,
  p_correlation_id text default null
)
returns table (
  assessment_id uuid,
  identity_id uuid,
  identity_version integer
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_assessment_id uuid;
  v_identity_id uuid;
  v_identity_version integer;
  v_correlation_id text := coalesce(nullif(trim(p_correlation_id), ''), gen_random_uuid()::text);
  v_now timestamptz := now();
  v_key text;
  v_score numeric(5,2);
  v_label text;
  v_skill_id uuid;
  v_strengths jsonb;
  v_growth_areas jsonb;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;

  if p_responses is null or jsonb_typeof(p_responses) not in ('array', 'object') then
    raise exception using errcode = '22023', message = 'responses must be JSON array or object';
  end if;
  if p_questions is null or jsonb_typeof(p_questions) not in ('array', 'object') then
    raise exception using errcode = '22023', message = 'questions must be JSON array or object';
  end if;
  if p_disc_profile is null or jsonb_typeof(p_disc_profile) <> 'object' then
    raise exception using errcode = '22023', message = 'disc_profile must be a JSON object';
  end if;
  if upper(coalesce(p_dominant_pattern, '')) not in ('D','I','S','C') then
    raise exception using errcode = '22023', message = 'dominant_pattern must be D, I, S or C';
  end if;

  insert into public.a1_cerebral_assessment (
    user_id,
    questions,
    responses,
    disc_profile,
    dominant_pattern,
    secondary_pattern,
    completed_at,
    created_at
  ) values (
    v_user_id,
    p_questions,
    p_responses,
    p_disc_profile,
    upper(p_dominant_pattern),
    nullif(upper(coalesce(p_secondary_pattern, '')), ''),
    v_now,
    v_now
  )
  returning id into v_assessment_id;

  insert into public.career_identities (
    user_id,
    communication_profile,
    metadata
  ) values (
    v_user_id,
    jsonb_build_object(
      'framework', 'DISC',
      'dominantPattern', upper(p_dominant_pattern),
      'secondaryPattern', nullif(upper(coalesce(p_secondary_pattern, '')), ''),
      'scores', p_disc_profile,
      'lastAssessmentId', v_assessment_id,
      'lastAssessedAt', v_now
    ),
    jsonb_build_object('a1Connected', true, 'a1LastAssessmentId', v_assessment_id)
  )
  on conflict (user_id) do update set
    communication_profile = excluded.communication_profile,
    metadata = coalesce(public.career_identities.metadata, '{}'::jsonb) || excluded.metadata,
    version = public.career_identities.version + 1,
    updated_at = v_now
  returning id, version into v_identity_id, v_identity_version;

  for v_key, v_label in
    select * from (values
      ('D', 'Dominancia'),
      ('I', 'Influencia'),
      ('S', 'Estabilidad'),
      ('C', 'Cumplimiento')
    ) as dimensions(key, label)
  loop
    begin
      v_score := greatest(0, least(100, coalesce((p_disc_profile ->> v_key)::numeric, 0)));
    exception when invalid_text_representation then
      raise exception using errcode = '22023', message = format('DISC score %s must be numeric', v_key);
    end;

    insert into public.career_skills (
      user_id,
      identity_id,
      skill_key,
      label,
      score,
      confidence,
      trend,
      evidence_count,
      last_evaluated_at,
      metadata
    ) values (
      v_user_id,
      v_identity_id,
      'disc.' || lower(v_key),
      v_label,
      v_score,
      70,
      'unknown',
      1,
      v_now,
      jsonb_build_object('framework', 'DISC', 'sourceAssessmentId', v_assessment_id)
    )
    on conflict (user_id, skill_key) do update set
      identity_id = excluded.identity_id,
      score = excluded.score,
      confidence = greatest(public.career_skills.confidence, excluded.confidence),
      evidence_count = public.career_skills.evidence_count + 1,
      last_evaluated_at = excluded.last_evaluated_at,
      metadata = coalesce(public.career_skills.metadata, '{}'::jsonb) || excluded.metadata,
      updated_at = v_now
    returning id into v_skill_id;

    insert into public.career_evidence (
      user_id,
      identity_id,
      skill_id,
      source_module,
      source_type,
      source_ref,
      assertion,
      value,
      confidence,
      observed_at,
      metadata
    ) values (
      v_user_id,
      v_identity_id,
      v_skill_id,
      'a1',
      'disc_dimension',
      v_assessment_id::text || ':' || lower(v_key),
      format('A1 DISC %s score observed', v_label),
      jsonb_build_object('dimension', v_key, 'score', v_score),
      70,
      v_now,
      jsonb_build_object('assessmentId', v_assessment_id, 'framework', 'DISC')
    )
    on conflict (user_id, source_module, source_type, source_ref)
      where source_ref is not null
    do nothing;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object('key', key, 'score', score) order by score desc), '[]'::jsonb)
    into v_strengths
  from (
    select key, greatest(0, least(100, coalesce((p_disc_profile ->> key)::numeric, 0))) as score
    from unnest(array['D','I','S','C']) as key
    order by score desc
    limit 2
  ) ranked;

  select coalesce(jsonb_agg(jsonb_build_object('key', key, 'score', score) order by score asc), '[]'::jsonb)
    into v_growth_areas
  from (
    select key, greatest(0, least(100, coalesce((p_disc_profile ->> key)::numeric, 0))) as score
    from unnest(array['D','I','S','C']) as key
    order by score asc
    limit 2
  ) ranked;

  update public.career_identities
  set strengths = v_strengths,
      growth_areas = v_growth_areas,
      updated_at = v_now
  where id = v_identity_id;

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
  ) values (
    v_user_id,
    v_identity_id,
    'a1-assessment-writer',
    '1.0.0',
    'a1',
    v_correlation_id,
    'save_assessment_dual_write',
    'a1_cerebral_assessment',
    v_assessment_id,
    'accepted',
    jsonb_build_object(
      'dominantPattern', upper(p_dominant_pattern),
      'secondaryPattern', nullif(upper(coalesce(p_secondary_pattern, '')), ''),
      'evidenceDimensions', 4
    )
  );

  return query select v_assessment_id, v_identity_id, v_identity_version;
end;
$$;

revoke all on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) from public;
grant execute on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) to authenticated;

comment on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text)
  is 'Atomically persists an authenticated A1 assessment and its Career Identity evidence.';
