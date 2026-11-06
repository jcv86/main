import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { closureLab, readClosureFixtures, safeFailure } from './closure-lab.mjs'
import { readAuthFixtures, AUTH_VIEWPORTS } from './auth-lab.mjs'

const secrets: string[] = []
async function main() {
  const { root, status, repo, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'c1-prepared.json')))
  const fixturePath = join(root, 'c1-fixtures.private.json')
  assert.ok(!existsSync(fixturePath), 'Never reuse C1 synthetic owners')
  const previous = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
  const authFixture = readAuthFixtures(root)
  const expected = [...previous.users, ...readClosureFixtures(root).users, ...authFixture.users]
  assert.equal(expected.length, 10)
  const password = authFixture.password
  secrets.push(password, status.ANON_KEY, status.SERVICE_ROLE_KEY, status.DB_URL)
  const db = new Client({ connectionString: status.DB_URL })
  await db.connect()
  try {
    const existing = await db.query('select id,email from auth.users')
    assert.equal(existing.rowCount, expected.length, 'Unexpected Auth users in local C1 stack')
    for (const user of expected) {
      assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
      assert.ok(existing.rows.some(row => row.id === user.id && row.email === user.email))
    }
    assert.equal((await db.query("select to_regclass('public.assessment_drafts') as table_name")).rows[0].table_name, null)
    const migration = '20260826010000_assessment_drafts.sql'
    await db.query(readFileSync(join(repo, 'supabase/migrations', migration), 'utf8'))
    // The old laboratory has a minimal supporting profile. Match the existing
    // real page's timestamp field explicitly; this is not a production migration.
    await db.query('alter table public.despega_user_profiles add column if not exists onboarding_conozcamonos_1_completed_at timestamptz')
    const users: Array<{ label: string; id: string; email: string }> = []
    for (const viewport of AUTH_VIEWPORTS) {
      const label = `auth-invited-${viewport.name}`
      const invited = authFixture.users.find(user => user.label === label)
      assert.ok(invited, 'Use only the synthetic owner admitted by the preceding real invitation flow')
      const { id, email } = invited
      assert.equal(email, `dtc-qa-${label}@example.invalid`)
      const admitted = await db.query(`select m.access_kind,i.status from public.pilot_memberships m
        join public.pilot_invitations i on i.id=m.invitation_id where m.user_id=$1 and i.claimed_by_user_id=$1`, [id])
      assert.deepEqual(admitted.rows, [{ access_kind: 'invited', status: 'redeemed' }])
      users.push({ label, email, id })
      assert.equal((await db.query('select count(*)::integer as total from public.canon_conozcamonos_1_responses where user_id=$1', [id])).rows[0].total, 0)
    }
    await db.query("notify pgrst, 'reload schema'")
    writeFileSync(fixturePath, JSON.stringify({ scope: 'disposable-local-c1', users, password }), { mode: 0o600 })
    writeFileSync(join(evidence, 'c1-seed.json'), JSON.stringify({ migration, realInvitationOwnersReused: 2,
      authUsersCreated: 0, membershipsOrProfilesSeeded: 0,
      initialCompletedC1: 0, localProfileFixture: 'existing completion timestamp column', remoteOperations: 0, verdict: 'PASS' }, null, 2))
    console.log('C1 setup: canonical draft migration and two owners admitted by the preceding real invitation flow; zero C1 completions.')
  } finally { await db.end() }
}
main().catch(error => { console.error('C1 setup failed:', safeFailure(error, secrets)); process.exitCode = 1 })
