-- Reviewed operator recovery; inject only the validated private run manifest in memory.
-- No application/schema/configuration change. A missing or changed resource aborts all writes.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';
do $recovery$
declare
  manifest constant jsonb := '__RECOVERY_MANIFEST_JSON__'::jsonb;
  run_id constant text := 'b828f115-ccfb-451b-a988-db66d446080d';
  owner_record record;
  invitation_record record;
  actual_email text;
  actual_metadata jsonb;
  actual_hash text;
  actual_claim uuid;
  actual_owner uuid;
  absent_owner uuid;
  expected_invitation_owner uuid;
  expected_owners uuid[];
  table_name text;
  rows_found bigint;
  affected bigint;
  users_present integer := 0;
  invitations_removed integer := 0;
  users_removed integer := 0;
  cascade_checks integer := 0;
begin
  if manifest->>'runReference' is distinct from run_id
     or manifest->>'projectRef' is distinct from 'dcfrbwxbejtbcouionna'
     or jsonb_array_length(manifest->'users') <> 2
     or jsonb_array_length(manifest->'invitations') <> 2 then
    raise exception 'RECOVERY_MANIFEST_SCOPE_MISMATCH';
  end if;
  select array_agg(u.id order by u.id) into expected_owners
  from jsonb_to_recordset(manifest->'users') as u(id uuid, label text);
  if cardinality(expected_owners) <> 2 or expected_owners[1] = expected_owners[2] then
    raise exception 'RECOVERY_OWNER_SET_MISMATCH';
  end if;
  select u.id into absent_owner
  from jsonb_to_recordset(manifest->'users') as u(id uuid, label text) where u.label='A';
  if absent_owner is null then raise exception 'RECOVERY_ABSENT_OWNER_MISSING'; end if;

  -- Lock only the two reserved run identities; A must already be absent and B present.
  for owner_record in
    select * from jsonb_to_recordset(manifest->'users') as u(id uuid, label text) order by id
  loop
    select u.email, u.raw_app_meta_data into actual_email, actual_metadata
    from auth.users u where u.id = owner_record.id for update;
    if found then
      if owner_record.label is distinct from 'B'
         or actual_email is distinct from ('dtc-live-' || run_id || '-b@example.invalid')
         or actual_metadata->>'dtc_live_run' is distinct from run_id
         or actual_metadata->'synthetic' is distinct from 'true'::jsonb then
        raise exception 'RECOVERY_OWNER_MARKERS_CHANGED';
      end if;
      users_present := users_present + 1;
    elsif owner_record.label is distinct from 'A' then
      raise exception 'RECOVERY_EXPECTED_OWNER_MISSING';
    end if;
    if exists (select 1 from auth.sessions s where s.user_id = owner_record.id)
       or exists (select 1 from auth.refresh_tokens r where r.user_id = owner_record.id::text)
       or exists (select 1 from storage.objects o where o.owner = owner_record.id or o.owner_id = owner_record.id::text) then
      raise exception 'RECOVERY_SESSION_OR_STORAGE_STATE_CHANGED';
    end if;
  end loop;
  if users_present <> 1 then raise exception 'RECOVERY_OWNER_COUNT_CHANGED'; end if;

  -- Validate and lock both exact invitations before any deletion.
  for invitation_record in
    select * from jsonb_to_recordset(manifest->'invitations')
      as i(id uuid, "tokenHash" text, "claimId" uuid, "userId" uuid) order by id
  loop
    expected_invitation_owner := case when invitation_record."userId" = absent_owner
      then null::uuid else invitation_record."userId" end;
    select i.token_hash, i.claimed_by_claim_id, i.claimed_by_user_id
      into actual_hash, actual_claim, actual_owner
    from public.pilot_invitations i where i.id = invitation_record.id for update;
    if not found
       or actual_hash is distinct from invitation_record."tokenHash"
       or actual_claim is distinct from invitation_record."claimId"
       or actual_owner is distinct from expected_invitation_owner
       or not (invitation_record."userId" = any(expected_owners)) then
      raise exception 'RECOVERY_INVITATION_MARKERS_CHANGED';
    end if;
    if exists (
      select 1 from public.pilot_memberships m
      where m.invitation_id = invitation_record.id
        and (m.user_id is null or not m.user_id = any(expected_owners))
    ) then raise exception 'RECOVERY_FOREIGN_MEMBERSHIP_REFERENCE'; end if;
  end loop;

  -- Invitation deletion can SET NULL only on this run's own membership rows.
  for invitation_record in
    select * from jsonb_to_recordset(manifest->'invitations')
      as i(id uuid, "tokenHash" text, "claimId" uuid, "userId" uuid) order by id
  loop
    expected_invitation_owner := case when invitation_record."userId" = absent_owner
      then null::uuid else invitation_record."userId" end;
    delete from public.pilot_invitations i
    where i.id = invitation_record.id
      and i.token_hash = invitation_record."tokenHash"
      and i.claimed_by_claim_id is not distinct from invitation_record."claimId"
      and i.claimed_by_user_id is not distinct from expected_invitation_owner;
    get diagnostics affected = row_count;
    if affected <> 1 then raise exception 'RECOVERY_INVITATION_DELETE_COUNT'; end if;
    invitations_removed := invitations_removed + affected;
  end loop;

  for owner_record in
    select * from jsonb_to_recordset(manifest->'users') as u(id uuid, label text) where label = 'B'
  loop
    delete from auth.users u
    where u.id = owner_record.id
      and u.email = 'dtc-live-' || run_id || '-b@example.invalid'
      and u.raw_app_meta_data->>'dtc_live_run' = run_id
      and u.raw_app_meta_data->'synthetic' = 'true'::jsonb;
    get diagnostics affected = row_count;
    if affected <> 1 then raise exception 'RECOVERY_AUTH_DELETE_COUNT'; end if;
    users_removed := users_removed + affected;
  end loop;
  if users_removed <> 1 or invitations_removed <> 2 then
    raise exception 'RECOVERY_MUTATION_COUNTS_MISMATCH';
  end if;

  -- Exercise the real cascades; never manually delete outcome rows to hide a defect.
  for owner_record in
    select * from jsonb_to_recordset(manifest->'users') as u(id uuid, label text)
  loop
    if exists (select 1 from auth.users u where u.id = owner_record.id)
       or exists (select 1 from auth.identities i where i.user_id = owner_record.id)
       or exists (select 1 from auth.sessions s where s.user_id = owner_record.id)
       or exists (select 1 from auth.refresh_tokens r where r.user_id = owner_record.id::text)
       or exists (select 1 from storage.objects o where o.owner = owner_record.id or o.owner_id = owner_record.id::text) then
      raise exception 'RECOVERY_AUTH_OR_STORAGE_REMAINS';
    end if;
    foreach table_name in array array[
      'dtc_job_search_events','dtc_employment_outcomes','dtc_salary_outcomes',
      'dtc_outcome_followups','dtc_outcome_verifications','dtc_outcome_write_requests',
      'despega_journey_state','despega_user_profiles','pilot_memberships'
    ] loop
      execute format('select count(*) from public.%I where user_id=$1', table_name)
        into rows_found using owner_record.id;
      if rows_found <> 0 then raise exception 'RECOVERY_OWNED_ROWS_REMAIN'; end if;
      cascade_checks := cascade_checks + 1;
    end loop;
  end loop;
  if cascade_checks <> 18 then raise exception 'RECOVERY_CASCADE_COUNT_MISMATCH'; end if;
  if exists (
    select 1 from public.pilot_invitations i
    join jsonb_to_recordset(manifest->'invitations') as e(id uuid) on i.id=e.id
  ) then raise exception 'RECOVERY_INVITATION_REMAINS'; end if;
end;
$recovery$;
commit;
