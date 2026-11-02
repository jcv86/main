import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'
import { validateAndScoreDiscResponses } from '../../lib/a1/disc-scoring'
import { CAPTURE_INSTRUMENTS, OUTCOME_CAPTURE_VERSION } from '../../lib/outcomes/response-capture'
import { closureLab, safeFailure } from './closure-lab.mjs'

const canonicalMigrations = [
  '20260915160000_canonical_journey_foundation.sql',
  '20260915160100_canonical_journey_security.sql',
  '20260920135500_outcome_engine_s1_foundation.sql',
  '20260920141000_outcome_response_payload.sql',
  '20260920173000_career_search_intents.sql',
  '20261102115220_dtc_labor_objective_completion.sql',
]

async function main() {
  const { root, status, repo, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'closure-prepared.json')), 'Prepare real closure pages first')
  const fixturesPath = join(root, 'closure-fixtures.private.json')
  assert.ok(!existsSync(fixturesPath), 'Never reuse closure Auth fixtures')
  const previous = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
  const db = new Client({ connectionString: status.DB_URL })
  const password = `Closure-${randomBytes(24).toString('hex')}`
  await db.connect()
  try {
    // Prove this is the preceding test stack, not just another database on localhost.
    assert.equal(previous.users.length, 4)
    for (const user of previous.users) {
      assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
      const found = await db.query('select id from auth.users where id=$1 and email=$2', [user.id, user.email])
      assert.equal(found.rowCount, 1, 'Previous synthetic Auth sentinel missing')
    }
    const initial = await db.query("select to_regclass('public.dtc_outcome_observations') as present")
    assert.equal(initial.rows[0].present, null, 'Outcome acceptance must begin with a fresh table')
    for (const name of canonicalMigrations) {
      await db.query(readFileSync(join(repo, 'supabase/migrations', name), 'utf8'))
    }

    // The old suites intentionally use a minimal source fixture policy. Remove that
    // policy now; the real canonical journey initializer and SELECT policy take over.
    await db.query(`
      drop policy if exists lab_flow_owner on public.despega_journey_state;
      revoke insert,update,delete on public.despega_journey_state from authenticated;
      grant select on public.despega_journey_state to authenticated;
      grant select,insert,update,delete on public.despega_journey_state to service_role;
      grant select,insert,update,delete on public.despega_user_profiles to authenticated,service_role;

      alter table public.despega_user_profiles
        add column if not exists a1_cerebral_intro_seen_at timestamptz,
        add column if not exists a2_intro_seen_at timestamptz,
        add column if not exists camino_foco text default 'ambos',
        add column if not exists camino_persona_active boolean default false,
        add column if not exists camino_profesional_active boolean default false,
        add column if not exists a2_sprint_progress integer default 0;
      alter table public.a2_user_task_completions
        add column if not exists mission_type text,
        add column if not exists submission jsonb default '{}',
        add column if not exists validation_status text default 'legacy',
        add column if not exists validation_result jsonb default '{}',
        add column if not exists created_at timestamptz default now(),
        add column if not exists updated_at timestamptz default now();
      alter table public.a3_user_progress
        add column if not exists total_xp integer default 0,
        add column if not exists created_at timestamptz default now(),
        add column if not exists updated_at timestamptz default now();
      alter table public.a3_route_progression
        add column if not exists current_module_number integer default 1,
        add column if not exists total_completed integer default 0,
        add column if not exists can_replay_modules_7_10 boolean default false,
        add column if not exists advanced_unlocked_at timestamptz,
        add column if not exists pro_unlocked_at timestamptz,
        add column if not exists updated_at timestamptz default now();

      create table public.a1_tests_results(id uuid primary key default gen_random_uuid(),user_id uuid not null,profile_type text,resultado_texto text,created_at timestamptz default now(),completed_at timestamptz);
      create table public.a2_user_route_progress(id uuid primary key default gen_random_uuid(),user_id uuid not null,route_id uuid,dia_actual integer,fecha_inicio timestamptz,updated_at timestamptz default now());
      create table public.a2_route_recommendations(id uuid primary key default gen_random_uuid(),user_id uuid not null,route_id uuid,score_match numeric,generado_at timestamptz default now());
      create table public.a2_learning_routes(id uuid primary key default gen_random_uuid(),codigo text,nombre text,descripcion text,duracion_dias integer,activo boolean default true,created_at timestamptz default now());
      create table public.a2_user_bitacora(id uuid primary key default gen_random_uuid(),user_id uuid not null,mood integer,created_at timestamptz default now());
      create table public.a2_user_daily_actions(id uuid primary key default gen_random_uuid(),user_id uuid not null,completada boolean default false,fecha_accion timestamptz,created_at timestamptz default now());
      create table public.a2_day1_submissions(id uuid primary key default gen_random_uuid(),user_id uuid not null,analysis_score numeric,pass_fail_status text,analysis_result jsonb,created_at timestamptz default now());
      create table public.a3_module_completion(id uuid primary key default gen_random_uuid(),user_id uuid not null,module_id text,module_number integer,best_score numeric,total_attempts integer,completed_at timestamptz);
      create table public.a4_qa_entitlements(user_id uuid primary key,expires_at timestamptz);
      create table public.user_gamification_profile(user_id uuid primary key,current_level integer,total_xp integer,interview_streak integer,best_interview_streak integer,total_interviews_completed integer,total_tips_earned_free integer,total_tips_earned_premium integer,badges jsonb,achievements jsonb);
      create table public.a3_training_module_completions(id uuid primary key default gen_random_uuid(),user_id uuid not null,xp_amount integer,is_first_completion boolean);
      create table public.a4_module_progress(id uuid primary key default gen_random_uuid(),user_id uuid not null,completado boolean,progreso_porcentaje integer);
      create table public.user_dtc_balance(user_id uuid primary key,balance integer);
      create table public.v1_analytics(id uuid primary key default gen_random_uuid(),user_id uuid not null,event_type text,stage text,timestamp timestamptz,session_id text,metadata jsonb);
    `)
    // Supporting fixture sources have explicit access and RLS. These policies do
    // not replace or widen either canonical outcome policy or outcome table grants.
    for (const table of [
      'a1_tests_results', 'a2_user_route_progress', 'a2_route_recommendations',
      'a2_user_bitacora', 'a2_user_daily_actions', 'a2_day1_submissions', 'a3_module_completion',
      'a4_qa_entitlements', 'user_gamification_profile', 'a3_training_module_completions',
      'a4_module_progress', 'user_dtc_balance', 'v1_analytics',
    ]) {
      await db.query(`alter table public.${table} enable row level security;
        revoke all on public.${table} from anon,authenticated;
        grant select,insert,update,delete on public.${table} to service_role;
        grant select on public.${table} to authenticated;
        create policy closure_fixture_owner_select on public.${table} for select to authenticated using ((select auth.uid())=user_id);`)
    }
    await db.query(`
      grant insert on public.v1_analytics to authenticated;
      create policy closure_fixture_analytics_insert on public.v1_analytics for insert to authenticated with check ((select auth.uid())=user_id);
      alter table public.a2_learning_routes enable row level security;
      revoke all on public.a2_learning_routes from anon,authenticated;
      grant select,insert,update,delete on public.a2_learning_routes to service_role;
      grant select on public.a2_learning_routes to authenticated;
      create policy closure_fixture_catalog_select on public.a2_learning_routes for select to authenticated using (activo);
      insert into public.a2_learning_routes(codigo,nombre,descripcion,duracion_dias) values('QA_LOCAL','Ruta sintética de aceptación','Fixture local; no recomendación inferida de DISC',30);
    `)

    // Fail if a migration or local server default left the actual outcome boundary open.
    const policy = await db.query(`select cmd, roles::text, qual from pg_policies
      where schemaname='public' and tablename='dtc_outcome_observations'`)
    assert.equal(policy.rowCount, 1)
    assert.equal(policy.rows[0].cmd, 'SELECT')
    assert.equal(policy.rows[0].roles, '{authenticated}')
    assert.ok(policy.rows[0].qual.includes('auth.uid()') && policy.rows[0].qual.includes('user_id'))
    const privileges = await db.query(`select
      has_table_privilege('authenticated','public.dtc_outcome_observations','select') as owner_select,
      has_table_privilege('authenticated','public.dtc_outcome_observations','insert') as owner_insert,
      has_table_privilege('authenticated','public.dtc_outcome_observations','update') as owner_update,
      has_table_privilege('authenticated','public.dtc_outcome_observations','delete') as owner_delete,
      has_table_privilege('anon','public.dtc_outcome_observations','select') as anonymous_select,
      has_table_privilege('service_role','public.dtc_outcome_observations','insert') as server_insert,
      (select relrowsecurity and relforcerowsecurity from pg_class where oid='public.dtc_outcome_observations'::regclass) as forced_rls`)
    assert.deepEqual(privileges.rows[0], { owner_select: true, owner_insert: false, owner_update: false,
      owner_delete: false, anonymous_select: false, server_insert: true, forced_rls: true })

    const admin = createClient(status.API_URL, status.SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    const scoring = validateAndScoreDiscResponses(previous.ordinary)
    assert.ok(scoring.valid && scoring.value, 'Use the actual A1 validator for synthetic evidence')
    const a1 = scoring.value!
    const users: Array<{ label: string; id: string; email: string }> = []
    for (const label of ['closure-alpha', 'closure-beta']) {
      const email = `dtc-qa-${label}@example.invalid`
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true,
        user_metadata: { full_name: `QA sintético ${label}` } })
      assert.ok(!created.error && created.data.user, 'Unable to create a synthetic local Auth owner')
      const id = created.data.user!.id
      users.push({ label, id, email })
      await db.query('insert into public.users(id,email,full_name) values($1,$2,$3)', [id,email,`QA sintético ${label}`])
      await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered')", [id])
      await db.query(`insert into public.despega_user_profiles(user_id,onboarding_conozcamonos_1_completed,
        a1_cerebral_intro_seen,a1_cerebral_completed,a1_results_saved,a1_report_seen,conozcamonos_2_completed,
        a2_intro_seen,camino_foco,camino_persona_active,camino_profesional_active)
        values($1,true,true,true,true,true,true,false,$2,$3,$4)`,
      [id,label==='closure-beta'?'persona':'profesional',label==='closure-beta',label==='closure-alpha'])
      await db.query('select public.ensure_despega_journey_state($1)', [id])
      await db.query('insert into public.a3_user_progress(user_id) values($1)', [id])
      await db.query('insert into public.a3_route_progression(user_id) values($1)', [id])
      await db.query(`insert into public.a1_cerebral_assessment(user_id,questions,responses,disc_profile,dominant_pattern,secondary_pattern)
        values($1,$2,$3,$4,$5,$6)`, [id,JSON.stringify(a1.questions),a1.responses,a1.scores,a1.dominantPattern,a1.secondaryPattern])
      await db.query('insert into public.canon_conozcamonos_1_responses(user_id,responses,completed_at) values($1,$2,now())',
        [id,{'4':`Objetivo declarado sintético ${label}`,'6':['Tres horas semanales']}])
      await db.query('insert into public.canon_conozcamonos_2_responses(user_id,responses,completed_at) values($1,$2,now())',
        [id,{'1':`Organizar una práctica concreta y revisar sus resultados ${label}`,'3':'Rol sintético opcional','5':'Tres horas semanales'}])
    }
    await db.query("notify pgrst, 'reload schema'")
    const instruments = Object.entries(CAPTURE_INSTRUMENTS).map(([key, instrument]) => ({
      key, label: instrument.label, outcomeKey: instrument.outcomeKey, stage: instrument.stage,
      prompts: instrument.prompts.map(({key,label})=>({key,label})),
    }))
    writeFileSync(fixturesPath, JSON.stringify({ scope:'disposable-local-closure', users, password,
      instrumentVersion: OUTCOME_CAPTURE_VERSION, instruments }), { mode:0o600 })
    writeFileSync(join(evidence,'closure-seed.json'), JSON.stringify({
      canonicalMigrations, outcomePolicy: 'canonical owner SELECT, server INSERT; no fixture override',
      realAuthOwners: 2, outcomeRowsSeeded: 0, remoteOperations: 0, verdict:'PASS',
    }, null, 2))
    console.log('Closure seed: two synthetic local Auth owners; canonical outcome RLS and server-only writes verified.')
  } finally { await db.end() }
}

main().catch(error => {
  // Keep connection strings and private fixtures out of the Actions log.
  console.error('Closure setup failed:', safeFailure(error))
  process.exitCode = 1
})
