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
    const completionMigration = '20261106173017_c1_atomic_completion.sql'
    await db.query(readFileSync(join(repo, 'supabase/migrations', migration), 'utf8'))
    // Complete only the old lab's minimal supporting shape, using the types
    // observed in the read-only DTC catalog. The completion migration itself
    // adds the missing C1 timestamp contract; no remote schema is changed.
    await db.query(`
      alter table public.canon_conozcamonos_1_responses
        add column if not exists created_at timestamptz default now(),
        add column if not exists completed boolean default false;
      alter table public.despega_user_profiles
        add column if not exists a4_unlocked_at timestamp without time zone,
        add column if not exists current_stage varchar(50) default 'conozcamonos-1';
    `)
    const profileGuard = 'migrations/07-a4-unlock-guard.sql'
    await db.query(readFileSync(join(repo, profileGuard), 'utf8'))
    const completionSql = readFileSync(join(repo, 'supabase/migrations', completionMigration), 'utf8')
    await db.query(completionSql)
    await db.query(completionSql) // The candidate migration must be repeatable.
    const timestampType = await db.query(`select data_type from information_schema.columns
      where table_schema='public' and table_name='despega_user_profiles'
      and column_name='onboarding_conozcamonos_1_completed_at'`)
    assert.deepEqual(timestampType.rows, [{ data_type: 'timestamp without time zone' }])
    assert.equal((await db.query(`select count(*)::integer as total from pg_trigger
      where tgrelid='public.despega_user_profiles'::regclass and tgname='enforce_a4_profile_completion'
      and not tgisinternal`)).rows[0].total, 1)
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
    writeFileSync(join(evidence, 'c1-seed.json'), JSON.stringify({ migration, completionMigration,
      completionMigrationAppliedTwice: true, profileGuard, realInvitationOwnersReused: 2,
      authUsersCreated: 0, membershipsOrProfilesSeeded: 0,
      initialCompletedC1: 0, localProfileFixture: 'legacy A4 trigger columns; canonical C1 UTC timestamp without time zone',
      remoteOperations: 0, verdict: 'PASS' }, null, 2))
    console.log('C1 setup: real draft and atomic migrations, legacy profile guard, two admitted owners; zero C1 completions.')
  } finally { await db.end() }
}
main().catch(error => { console.error('C1 setup failed:', safeFailure(error, secrets)); process.exitCode = 1 })
