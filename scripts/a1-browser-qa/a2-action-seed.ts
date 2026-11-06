import assert from 'node:assert/strict'
import { createHash, randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'
import { validateAndScoreDiscResponses } from '../../lib/a1/disc-scoring'
import { closureLab, readClosureFixtures, safeFailure } from './closure-lab.mjs'
import { readAuthFixtures } from './auth-lab.mjs'

const migration = '20261106221437_a2_assistant_action_receipts.sql'
const secrets: string[] = []
async function main() {
  const { root, status, repo, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'a2-action-prepared.json')))
  const fixturePath = join(root, 'a2-action-fixtures.private.json')
  assert.ok(!existsSync(fixturePath), 'Never reuse AG04 browser fixture identities')
  const previous = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
  const plan = JSON.parse(readFileSync(join(root, 'a2-plan-fixtures.private.json'), 'utf8'))
  assert.equal(plan.scope, 'disposable-local-a2-plan')
  const expected = [...previous.users, ...readClosureFixtures(root).users, ...readAuthFixtures(root).users, ...plan.users]
  assert.equal(expected.length, 13)
  const password = `A2Action-${randomBytes(24).toString('hex')}`
  secrets.push(password, status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY)
  const db = new Client({ connectionString: status.DB_URL })
  await db.connect()
  try {
    const existing = await db.query('select id,email from auth.users')
    assert.equal(existing.rowCount, expected.length, 'Unexpected users in the disposable AG04 stack')
    for (const user of expected) {
      assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
      assert.ok(existing.rows.some(row => row.id === user.id && row.email === user.email))
    }
    assert.equal((await db.query("select to_regclass('public.dtc_documents') as existing")).rows[0].existing, 'dtc_documents',
      'Reuse the explicitly documented AG03 document fixture, never create a substitute AG04 store')
    assert.equal((await db.query("select to_regclass('dtc_private.a2_assistant_action_receipts') as existing")).rows[0].existing, null)
    const sql = readFileSync(join(repo, 'supabase/migrations', migration), 'utf8')
    await db.query(sql)
    await db.query(sql)
    const admin = createClient(status.API_URL, status.SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } })
    const checked = validateAndScoreDiscResponses(previous.ordinary)
    assert.ok(checked.valid && checked.value, 'Use the actual scorer and existing synthetic A1 bank')
    const a1 = checked.value!
    const users: Array<{ label: string; id: string; email: string }> = []
    for (const label of ['a2-action-desktop', 'a2-action-mobile', 'a2-action-locked', 'a2-action-revoked']) {
      const email = `dtc-qa-${label}@example.invalid`
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true,
        user_metadata: { full_name: `QA sintético ${label}` } })
      assert.ok(!created.error && created.data.user, 'Failed to create a synthetic local action owner')
      const id = created.data.user!.id
      users.push({ label, id, email })
      await db.query('insert into public.users(id,email,full_name) values($1,$2,$3)', [id,email,`QA sintético ${label}`])
      await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered')", [id])
      const eligible = label !== 'a2-action-locked'
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
          [id,{'1':'Practicar un cambio pequeño y revisarlo','3':'Rol sintético','5':'Tres horas semanales'}])
      }
    }
    assert.equal((await db.query('select count(*)::integer as total from dtc_private.a2_assistant_action_receipts')).rows[0].total, 0)
    assert.equal((await db.query('select count(*)::integer as total from public.dtc_documents where user_id=any($1::uuid[])',
      [users.map(user => user.id)])).rows[0].total, 0)
    await db.query("notify pgrst, 'reload schema'")
    writeFileSync(fixturePath, JSON.stringify({ scope: 'disposable-local-a2-action', users, password }), { mode: 0o600 })
    writeFileSync(join(evidence, 'a2-action-seed.json'), JSON.stringify({ migration,
      migrationSha256: createHash('sha256').update(sql).digest('hex'), migrationAppliedTwice: true,
      syntheticAuthOwnersCreated: users.length, eligibleA2: 3, admittedWithoutA2: 1,
      pilotRevocation: 'One eligible owner is revoked only during the subsequent access test after genuine login.',
      initialActionReceipts: 0, initialOwnerDocuments: 0,
      contextFixture: 'Inherited minimal dtc_documents owner SELECT/INSERT from AG03; actual new receipt/RPC schema.',
      canonicalProgress: 'Seeded A2 entry prerequisites only; no practice completion or XP.',
      remoteOperations: 0, verdict: 'PASS' }, null, 2))
    console.log('AG04 setup: actual migration twice and four fresh local owners; no action documents or receipts.')
  } finally { await db.end() }
}
main().catch(error => { console.error('AG04 setup failed:', safeFailure(error, secrets)); process.exitCode = 1 })
