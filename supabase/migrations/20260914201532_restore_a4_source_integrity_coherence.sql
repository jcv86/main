update public.a4_verified_signals
set
  source_verification_status = case
    when source_type = 'external_url' and source_verification_status = 'not_applicable'
      then 'unavailable'
    when source_type <> 'external_url'
      then 'not_applicable'
    else source_verification_status
  end,
  source_authority = case
    when source_type <> 'external_url' then 'documented_internal'
    when source_authority = 'documented_internal' then 'requires_corroboration'
    else source_authority
  end,
  source_final_url = case
    when source_type <> 'external_url'
      or source_verification_status in ('unavailable', 'not_applicable') then null
    else source_final_url
  end;

alter table public.a4_verified_signals
  drop constraint if exists a4_verified_signals_source_integrity_coherent,
  add constraint a4_verified_signals_source_integrity_coherent
    check (
      (
        source_type = 'external_url'
        and source_verification_status <> 'not_applicable'
        and source_authority <> 'documented_internal'
      )
      or
      (
        source_type <> 'external_url'
        and source_verification_status = 'not_applicable'
        and source_authority = 'documented_internal'
        and source_http_status is null
        and source_final_url is null
      )
    );
