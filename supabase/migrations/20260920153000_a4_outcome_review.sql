alter table public.a4_decision_log
  add column if not exists review_classification text null,
  add column if not exists external_outcomes jsonb not null default '[]'::jsonb;

alter table public.a4_decision_log
  drop constraint if exists a4_decision_log_review_classification_valid;
alter table public.a4_decision_log
  add constraint a4_decision_log_review_classification_valid
  check (review_classification is null or review_classification in (
    'evidence_supported',
    'evidence_not_supported',
    'inconclusive',
    'decision_changed',
    'decision_abandoned'
  ));

alter table public.a4_decision_log
  drop constraint if exists a4_decision_log_external_outcomes_array;
alter table public.a4_decision_log
  add constraint a4_decision_log_external_outcomes_array
  check (jsonb_typeof(external_outcomes) = 'array');

comment on column public.a4_decision_log.review_classification is
  'Descriptive review of whether expected evidence materialized; not a career-success score.';
comment on column public.a4_decision_log.external_outcomes is
  'Observed external career events after the decision. These fields do not imply DTC causation.';
