-- Transactional A4 strategic evidence -> Career Identity dual-write.
-- Canonical A4 writes are already validated server-side in a4_verified_signals
-- and a4_decision_log. These triggers keep identity, evidence and audit aligned
-- with the canonical rows in the same database transaction.

create or replace function public.sync_a4_signal_to_career_identity()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_identity_id uuid;
  v_identity_version integer;
  v_signal_count integer;
  v_confidence numeric;
  v_correlation_id text := gen_random_uuid()::text;
begin
  if new.user_id is null then
    raise exception using errcode = '23502', message = 'A4 signal requires user_id';
  end if;

  v_confidence := greatest(0, least(100, coalesce(new.confidence, 1)::numeric * 20));

  select count(*)::integer
  into v_signal_count
  from public.a4_verified_signals
  where user_id = new.user_id;

  insert into public.career_identities (user_id, learning_profile, metadata)
  values (
    new.user_id,
    jsonb_build_object(
      'a4VerifiedSignals', v_signal_count,
      'a4LastSignalId', new.id,
      'a4LastSignalCategory', new.category,
      'a4LastSignalClassification', new.classification,
      'a4LastSignalAt', coalesce(new.updated_at, new.created_at, now())
    ),
    jsonb_build_object(
      'a4Connected', true,
      'a4LastSignalSourceType', new.source_type
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
    user_id, identity_id, source_module, source_type, source_ref,
    assertion, value, confidence, observed_at, metadata
  ) values (
    new.user_id,
    v_identity_id,
    'a4',
    'verified_market_signal',
    'a4-signal-' || new.id::text,
    format('A4 verified strategic signal: %s', new.title),
    jsonb_build_object(
      'signalId', new.id,
      'title', new.title,
      'category', new.category,
      'classification', new.classification,
      'summary', new.summary,
      'relevance', new.relevance,
      'status', new.status,
      'sourceType', new.source_type,
      'sourceName', new.source_name,
      'sourceUrl', new.source_url,
      'sourceReference', new.source_reference,
      'sourceDate', new.source_date
    ),
    v_confidence,
    new.source_date::timestamptz,
    jsonb_build_object(
      'identityVersion', v_identity_version,
      'correlationId', v_correlation_id,
      'contextOnly', true
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
    'a4-strategic-evidence-writer',
    '1.0.0',
    'a4',
    v_correlation_id,
    case when tg_op = 'INSERT' then 'capture_verified_signal' else 'refresh_verified_signal' end,
    'a4_verified_signals',
    new.id,
    'accepted',
    jsonb_build_object(
      'classification', new.classification,
      'category', new.category,
      'confidence', v_confidence,
      'signalCount', v_signal_count,
      'identityVersion', v_identity_version
    )
  );

  return new;
end;
$$;

create or replace function public.sync_a4_decision_to_career_identity()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_identity_id uuid;
  v_identity_version integer;
  v_decision_count integer;
  v_reviewed_count integer;
  v_correlation_id text := gen_random_uuid()::text;
  v_observed_at timestamptz;
begin
  if new.user_id is null then
    raise exception using errcode = '23502', message = 'A4 decision requires user_id';
  end if;

  select
    count(*)::integer,
    count(*) filter (where status = 'reviewed')::integer
  into v_decision_count, v_reviewed_count
  from public.a4_decision_log
  where user_id = new.user_id;

  v_observed_at := coalesce(new.reviewed_at, new.updated_at, new.created_at, now());

  insert into public.career_identities (user_id, learning_profile, metadata)
  values (
    new.user_id,
    jsonb_build_object(
      'a4StrategicDecisions', v_decision_count,
      'a4ReviewedDecisions', v_reviewed_count,
      'a4LastDecisionId', new.id,
      'a4LastDecisionStatus', new.status,
      'a4LastDecisionAt', v_observed_at
    ),
    jsonb_build_object(
      'a4Connected', true,
      'a4LastSignalId', new.signal_id
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
    user_id, identity_id, source_module, source_type, source_ref,
    assertion, value, confidence, observed_at, metadata
  ) values (
    new.user_id,
    v_identity_id,
    'a4',
    'strategic_decision',
    'a4-decision-' || new.id::text,
    case when new.status = 'reviewed'
      then 'A4 strategic decision reviewed with an observed outcome'
      else 'A4 strategic decision registered for testing'
    end,
    jsonb_build_object(
      'decisionId', new.id,
      'signalId', new.signal_id,
      'decision', new.decision,
      'rationale', new.rationale,
      'expectedEvidence', new.expected_evidence,
      'status', new.status,
      'reviewOn', new.review_on,
      'outcome', new.outcome,
      'reviewedAt', new.reviewed_at
    ),
    case when new.status = 'reviewed' and nullif(btrim(coalesce(new.outcome, '')), '') is not null
      then 90 else 70 end,
    v_observed_at,
    jsonb_build_object(
      'identityVersion', v_identity_version,
      'correlationId', v_correlation_id,
      'reviewed', new.status = 'reviewed'
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
    'a4-strategic-evidence-writer',
    '1.0.0',
    'a4',
    v_correlation_id,
    case
      when tg_op = 'INSERT' then 'register_strategic_decision'
      when new.status = 'reviewed' and old.status is distinct from new.status then 'review_strategic_decision'
      else 'refresh_strategic_decision'
    end,
    'a4_decision_log',
    new.id,
    'accepted',
    jsonb_build_object(
      'status', new.status,
      'decisionCount', v_decision_count,
      'reviewedCount', v_reviewed_count,
      'identityVersion', v_identity_version
    )
  );

  return new;
end;
$$;

revoke all on function public.sync_a4_signal_to_career_identity() from public;
revoke all on function public.sync_a4_signal_to_career_identity() from anon;
revoke all on function public.sync_a4_signal_to_career_identity() from authenticated;
revoke all on function public.sync_a4_decision_to_career_identity() from public;
revoke all on function public.sync_a4_decision_to_career_identity() from anon;
revoke all on function public.sync_a4_decision_to_career_identity() from authenticated;

drop trigger if exists a4_signal_career_identity_sync on public.a4_verified_signals;
create trigger a4_signal_career_identity_sync
after insert or update of title, category, classification, summary, relevance,
  confidence, source_type, source_name, source_url, source_reference, source_date, status
on public.a4_verified_signals
for each row execute function public.sync_a4_signal_to_career_identity();

drop trigger if exists a4_decision_career_identity_sync on public.a4_decision_log;
create trigger a4_decision_career_identity_sync
after insert or update of decision, rationale, expected_evidence, status,
  review_on, outcome, reviewed_at
on public.a4_decision_log
for each row execute function public.sync_a4_decision_to_career_identity();
