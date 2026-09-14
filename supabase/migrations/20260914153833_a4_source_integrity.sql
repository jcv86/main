alter table public.a4_verified_signals
  add column if not exists source_verification_status text not null default 'not_applicable',
  add column if not exists source_authority text not null default 'requires_corroboration',
  add column if not exists source_checked_at timestamptz,
  add column if not exists source_http_status smallint,
  add column if not exists source_final_url text,
  add column if not exists source_verification_note text;

update public.a4_verified_signals
set
  source_verification_status = case
    when source_type = 'external_url' then 'unavailable'
    else 'not_applicable'
  end,
  source_authority = case
    when source_type = 'external_url' then 'requires_corroboration'
    else 'documented_internal'
  end
where source_checked_at is null;

alter table public.a4_verified_signals
  drop constraint if exists a4_verified_signals_source_verification_status_valid,
  add constraint a4_verified_signals_source_verification_status_valid
    check (source_verification_status in ('verified', 'restricted', 'unavailable', 'not_applicable')),
  drop constraint if exists a4_verified_signals_source_authority_valid,
  add constraint a4_verified_signals_source_authority_valid
    check (source_authority in ('official', 'requires_corroboration', 'documented_internal')),
  drop constraint if exists a4_verified_signals_source_http_status_valid,
  add constraint a4_verified_signals_source_http_status_valid
    check (source_http_status is null or source_http_status between 100 and 599),
  drop constraint if exists a4_verified_signals_source_integrity_coherent,
  add constraint a4_verified_signals_source_integrity_coherent
    check (
      (source_type = 'external_url' and source_verification_status <> 'not_applicable')
      or
      (source_type <> 'external_url' and source_verification_status = 'not_applicable')
    );

comment on column public.a4_verified_signals.source_verification_status is
  'Last server-side availability result; separate from source authority.';
comment on column public.a4_verified_signals.source_authority is
  'Conservative provenance classification; availability does not imply trust.';
comment on column public.a4_verified_signals.source_checked_at is
  'UTC timestamp of the latest server-side source check.';
