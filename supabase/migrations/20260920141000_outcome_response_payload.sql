alter table public.dtc_outcome_observations
  add column if not exists response_payload jsonb null;

alter table public.dtc_outcome_observations
  drop constraint if exists dtc_outcome_response_payload_object;

alter table public.dtc_outcome_observations
  add constraint dtc_outcome_response_payload_object
  check (response_payload is null or jsonb_typeof(response_payload) = 'object');

comment on column public.dtc_outcome_observations.response_payload is
  'Private owner-bound instrument response payload used for comparable scoring evidence. Never exposed in aggregate analytics.';
