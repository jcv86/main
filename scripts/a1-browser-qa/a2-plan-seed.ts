import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'
import { validateAndScoreDiscResponses } from '../../lib/a1/disc-scoring'
import { closureLab, readClosureFixtures, safeFailure } from './closure-lab.mjs'
import { readAuthFixtures } from './auth-lab.mjs'

const migration = '20261106201731_a2_reviewed_plan_atomic.sql'
const secrets: string[] = []
async function main() {
  const { root, status, repo, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'a2-plan-prepared.json')))
  const fixturePath = join(root, 'a2-plan-fixtures.private.json')
  assert.ok(!existsSync(fixturePath), 'Never reuse A2 plan fixture identities')
  const previous = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
  const expected = [...previous.users, ...readClosureFixtures(root).users, ...readAuthFixtures(root).users]
  assert.equal(expected.length, 10)
  const password = `A2Plan-${randomBytes(24).toString('hex')}`
  secrets.push(password, status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY)
  const db = new Client({ connectionString: status.DB_URL })
  await db.connect()
  try {
    const existing = await db.query('select id,email from auth.users')
    assert.equal(existing.rowCount, expected.length, 'Unexpected users in the disposable A2 plan stack')
    for (const user of expected) {
      assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
      assert.ok(existing.rows.some(row => row.id === user.id && row.email === user.email))
    }
    assert.equal((await db.query("select to_regclass('public.a2_reviewed_plans') as existing")).rows[0].existing, null)
    const sql = readFileSync(join(repo, 'supabase/migrations', migration), 'utf8')
    await db.query(sql)
    await db.query(sql)
    // The historical document table has no creation migration in this repository.
    // Reproduce only its observed reader/writer shape as an explicit fixture; this
    // does not stand in for the candidate plan table, its RLS or either RPC.
    assert.equal((await db.query("select to_regclass('public.dtc_documents') as existing")).rows[0].existing, null)
    await db.query(`create table public.dtc_documents (
      id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
      title text, type text, source_module text, related_day integer, source text, status text,
      content text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
      alter table public.dtc_documents enable row level security;
      revoke all on public.dtc_documents from public,anon,authenticated;
      grant select,insert on public.dtc_documents to authenticated;
      grant select,insert,update,delete on public.dtc_documents to service_role;
      create policy a2_plan_fixture_document_select on public.dtc_documents for select to authenticated using ((select auth.uid())=user_id);
      create policy a2_plan_fixture_document_insert on public.dtc_documents for insert to authenticated with check ((select auth.uid())=user_id);`)
    const admin = createClient(status.API_URL, status.SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } })
    const checked = validateAndScoreDiscResponses(previous.ordinary)
    assert.ok(checked.valid && checked.value, 'Use the existing synthetic A1 bank and actual scorer')
    const a1 = checked.value!
    const users: Array<{ label: string; id: string; email: string }> = []
    for (const label of ['a2-plan-desktop', 'a2-plan-mobile', 'a2-plan-locked']) {
      const email = `dtc-qa-${label}@example.invalid`
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true,
        user_metadata: { full_name: `QA sintético ${label}` } })
      assert.ok(!created.error && created.data.user, 'Failed to create a synthetic local plan owner')
      const id = created.data.user!.id
      users.push({ label, id, email })
      await db.query('insert into public.users(id,email,full_name) values($1,$2,$3)', [id,email,`QA sintético ${label}`])
      await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered')", [id])
      const eligible = label !== 'a2-plan-locked'
      await db.query(`insert into public.despega_user_profiles(user_id,onboarding_conozcamonos_1_completed,
        a1_cerebral_intro_seen,a1_cerebral_completed,a1_results_saved,a1_report_seen,conozcamonos_2_completed,
        a2_intro_seen,camino_foco,camino_persona_active,camino_profesional_active)
        values($1,$2,$2,$2,$2,$2,$2,$2,'profesional',false,true)`, [id,eligible])
      await db.query('select public.ensure_despega_journey_state($1)', [id])
      await db.query('insert into public.a3_user_progress(user_id) values($1)', [id])
      await db.query('insert into public.a3_route_progression(user_id) values($1)', [id])
      if (eligible) {
        await db.query(`insert into public.a1_cerebral_assessment(user_id,questions,responses,disc_profile,dominant_pattern,secondary_pattern)
          values($1,$2,$3,$4,$5,$6)`, [id,JSON.stringify(a1.questions),a1.responses,a1.scores,a1.dominantPattern,a1.secondaryPattern])
        await db.query('insert into public.canon_conozcamonos_1_responses(user_id,responses,completed_at) values($1,$2,now())',
          [id,{'4':`Objetivo sintético ${label}`,'6':['Tres horas semanales']}])
        await db.query('insert into public.canon_conozcamonos_2_responses(user_id,responses,completed_at) values($1,$2,now())',
          [id,{'1':'Organizar una práctica y conservar lo aprendido','3':'Rol sintético','5':'Tres horas semanales'}])
      }
    }
    for (const table of ['public.a2_reviewed_plans','dtc_private.a2_plan_revisions','dtc_private.a2_plan_receipts']) {
      assert.equal((await db.query(`select count(*)::integer as total from ${table}`)).rows[0].total, 0)
    }
    await db.query("notify pgrst, 'reload schema'")
    writeFileSync(fixturePath, JSON.stringify({ scope: 'disposable-local-a2-plan', users, password }), { mode: 0o600 })
    writeFileSync(join(evidence, 'a2-plan-seed.json'), JSON.stringify({ migration, migrationAppliedTwice: true,
      syntheticAuthOwnersCreated: users.length, eligibleA2: 2, admittedWithoutA2: 1,
      initialPlanRows: 0, contextFixture: 'minimal dtc_documents owner SELECT/INSERT; no content seeded',
      canonicalProgress: 'synthetic A2 entry prerequisites only; no task completion or XP',
      remoteOperations: 0, verdict: 'PASS' }, null, 2))
    console.log('A2 plan setup: actual migration twice, two eligible owners and one A2-locked owner; no saved plans.')
  } finally { await db.end() }
}
main().catch(error => { console.error('A2 plan setup failed:', safeFailure(error, secrets)); process.exitCode = 1 })
