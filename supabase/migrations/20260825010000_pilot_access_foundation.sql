-- Controlled pilot access. Invitation secrets are stored only as SHA-256 hashes.

create table if not exists public.pilot_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  access_kind text not null check (access_kind in ('invited', 'grandfathered')),
  invitation_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.pilot_invitations (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  status text not null default 'issued'
    check (status in ('issued', 'claimed', 'redeemed', 'revoked', 'expired')),
  expires_at timestamptz not null,
  claimed_at timestamptz,
  claimed_by_claim_id uuid unique,
  claimed_by_user_id uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pilot_memberships
  add constraint pilot_memberships_invitation_id_fkey
  foreign key (invitation_id) references public.pilot_invitations(id) on delete set null;

alter table public.pilot_memberships enable row level security;
alter table public.pilot_invitations enable row level security;

create or replace function public.claim_pilot_invitation(
  p_token_hash text,
  p_claim_id uuid
)
returns table (
  allowed boolean,
  claim_id uuid,
  invitation_id uuid,
  reason text
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_invitation public.pilot_invitations%rowtype;
begin
  if p_token_hash is null or length(p_token_hash) <> 64 or p_claim_id is null then
    return query select false, p_claim_id, null::uuid, 'invalid_claim'::text;
    return;
  end if;

  select invitation.*
    into v_invitation
    from public.pilot_invitations invitation
   where invitation.token_hash = lower(p_token_hash)
   for update;

  if not found then
    return query select false, p_claim_id, null::uuid, 'invalid_invitation'::text;
    return;
  end if;

  if v_invitation.status = 'claimed'
     and v_invitation.claimed_by_claim_id = p_claim_id
     and v_invitation.expires_at > now() then
    return query select true, p_claim_id, v_invitation.id, 'claimed'::text;
    return;
  end if;

  if v_invitation.expires_at <= now() then
    if v_invitation.status in ('issued', 'claimed') then
      update public.pilot_invitations
         set status = 'expired', updated_at = now()
       where id = v_invitation.id;
    end if;
    return query select false, p_claim_id, v_invitation.id, 'expired'::text;
    return;
  end if;

  if v_invitation.status <> 'issued' then
    return query select false, p_claim_id, v_invitation.id, v_invitation.status;
    return;
  end if;

  update public.pilot_invitations
     set status = 'claimed',
         claimed_at = now(),
         claimed_by_claim_id = p_claim_id,
         updated_at = now()
   where id = v_invitation.id;

  return query select true, p_claim_id, v_invitation.id, 'claimed'::text;
end;
$$;

create or replace function public.resolve_pilot_access(
  p_user_id uuid,
  p_claim_id uuid default null
)
returns table (
  allowed boolean,
  access_kind text,
  membership_id uuid
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_membership public.pilot_memberships%rowtype;
  v_invitation public.pilot_invitations%rowtype;
  v_is_legacy boolean := false;
  v_rollout_cutoff constant timestamptz := '2026-08-25 00:00:00+00'::timestamptz;
begin
  if p_user_id is null then
    return query select false, null::text, null::uuid;
    return;
  end if;

  select membership.*
    into v_membership
    from public.pilot_memberships membership
   where membership.user_id = p_user_id;

  if found then
    return query select true, v_membership.access_kind, v_membership.id;
    return;
  end if;

  select exists (
    select 1
      from auth.users auth_user
     where auth_user.id = p_user_id
       and auth_user.email_confirmed_at is not null
       and auth_user.created_at < v_rollout_cutoff
       and (
         exists (select 1 from public.despega_user_profiles profile where profile.user_id = p_user_id)
         or exists (select 1 from public.canon_conozcamonos_1_responses c1 where c1.user_id = p_user_id)
         or exists (select 1 from public.a1_cerebral_assessment a1 where a1.user_id = p_user_id)
       )
  ) into v_is_legacy;

  if v_is_legacy then
    insert into public.pilot_memberships (user_id, access_kind)
    values (p_user_id, 'grandfathered')
    on conflict (user_id) do update set updated_at = public.pilot_memberships.updated_at
    returning * into v_membership;

    return query select true, v_membership.access_kind, v_membership.id;
    return;
  end if;

  if p_claim_id is null then
    return query select false, null::text, null::uuid;
    return;
  end if;

  select invitation.*
    into v_invitation
    from public.pilot_invitations invitation
   where invitation.claimed_by_claim_id = p_claim_id
   for update;

  if not found
     or v_invitation.status <> 'claimed'
     or v_invitation.expires_at <= now() then
    return query select false, null::text, null::uuid;
    return;
  end if;

  -- Serialize capacity checks and invited membership creation.
  perform pg_advisory_xact_lock(20260825, 100);

  if (select count(*) from public.pilot_memberships membership where membership.access_kind = 'invited') >= 100 then
    return query select false, null::text, null::uuid;
    return;
  end if;

  insert into public.pilot_memberships (user_id, access_kind, invitation_id)
  values (p_user_id, 'invited', v_invitation.id)
  on conflict (user_id) do update set updated_at = public.pilot_memberships.updated_at
  returning * into v_membership;

  update public.pilot_invitations
     set status = 'redeemed',
         claimed_by_user_id = p_user_id,
         redeemed_at = now(),
         updated_at = now()
   where id = v_invitation.id
     and status = 'claimed';

  return query select true, v_membership.access_kind, v_membership.id;
end;
$$;

revoke all on table public.pilot_memberships from public, anon, authenticated;
revoke all on table public.pilot_invitations from public, anon, authenticated;

revoke all on function public.claim_pilot_invitation(text, uuid) from public;
revoke all on function public.claim_pilot_invitation(text, uuid) from anon, authenticated;
grant execute on function public.claim_pilot_invitation(text, uuid) to service_role;

revoke all on function public.resolve_pilot_access(uuid, uuid) from public;
revoke all on function public.resolve_pilot_access(uuid, uuid) from anon, authenticated;
grant execute on function public.resolve_pilot_access(uuid, uuid) to service_role;
