-- Run against the dedicated DTC UAT database before deploying the application.
-- Read-only catalogue check. Every row must report ready.
with relation_checks(area, object_name, object_oid, needs_rls) as (
  values
    ('Auth', 'public.pilot_memberships', to_regclass('public.pilot_memberships'), true),
    ('Auth', 'public.pilot_invitations', to_regclass('public.pilot_invitations'), true),
    ('C1', 'public.assessment_drafts', to_regclass('public.assessment_drafts'), true),
    ('C1', 'public.despega_user_profiles', to_regclass('public.despega_user_profiles'), true),
    ('C1', 'public.canon_conozcamonos_1_responses', to_regclass('public.canon_conozcamonos_1_responses'), true),
    ('C1', 'dtc_private.c1_completion_receipts', to_regclass('dtc_private.c1_completion_receipts'), false),
    ('A2', 'public.a2_reviewed_plans', to_regclass('public.a2_reviewed_plans'), true),
    ('A2', 'dtc_private.a2_plan_revisions', to_regclass('dtc_private.a2_plan_revisions'), false),
    ('A2', 'dtc_private.a2_plan_receipts', to_regclass('dtc_private.a2_plan_receipts'), false),
    ('A3', 'public.dtc_documents', to_regclass('public.dtc_documents'), true),
    ('A4', 'public.a4_verified_opportunities', to_regclass('public.a4_verified_opportunities'), true)
), rpc_checks(area, object_name, object_oid) as (
  values
    ('Auth', 'public.resolve_pilot_access(uuid,uuid)', to_regprocedure('public.resolve_pilot_access(uuid,uuid)')),
    ('C1', 'public.get_c1_completion_status(uuid)', to_regprocedure('public.get_c1_completion_status(uuid)')),
    ('C1', 'public.complete_c1_atomic(uuid,integer,jsonb,timestamptz)', to_regprocedure('public.complete_c1_atomic(uuid,integer,jsonb,timestamptz)'))
)
select r.area, r.object_name,
  case when r.object_oid is null then 'missing'
       when c.relkind not in ('r', 'p') then 'not_a_table'
       when r.needs_rls and not c.relrowsecurity then 'rls_disabled'
       when not r.needs_rls and (
         has_schema_privilege('anon', c.relnamespace, 'USAGE')
         or has_schema_privilege('authenticated', c.relnamespace, 'USAGE')
       ) then 'private_schema_accessible'
       else 'ready' end as status
from relation_checks r
left join pg_catalog.pg_class c on c.oid = r.object_oid
union all
select r.area, r.object_name,
  case when r.object_oid is null then 'missing'
       when not has_function_privilege('service_role', r.object_oid, 'EXECUTE') then 'service_role_denied'
       when has_function_privilege('anon', r.object_oid, 'EXECUTE')
         or has_function_privilege('authenticated', r.object_oid, 'EXECUTE') then 'client_execute'
       else 'ready' end as status
from rpc_checks r
order by 1, 2;
