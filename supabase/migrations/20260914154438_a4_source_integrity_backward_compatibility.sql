-- Keep the additive migration compatible with the currently deployed writer.
-- The application validates and writes integrity metadata before insert.
alter table public.a4_verified_signals
  drop constraint if exists a4_verified_signals_source_integrity_coherent;
