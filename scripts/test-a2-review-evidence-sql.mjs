/** AG05 source boundaries in the real unlinked PostgreSQL stack. All attempted
 * client mutations are rolled back; no new owner or production object is made. */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { closureLab, safeFailure } from './a1-browser-qa/closure-lab.mjs'

const { root, status, evidence } = closureLab()
assert.ok(existsSync(join(root, 'a2-review-evidence-prepared.json')))
const fixtures = JSON.parse(readFileSync(join(root, 'a2-review-evidence-fixtures.private.json'), 'utf8'))
assert.equal(fixtures.scope, 'disposable-local-a2-review-evidence')
assert.equal(fixtures.users.length, 4)
for (const user of fixtures.users) {
  assert.ok(['desktop', 'mobile', 'persona', 'locked'].some(kind => user.label === `a2-review-evidence-${kind}`))
  assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
}
const secrets = [status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY, fixtures.password]
const sourceTables = ['dtc_outcome_observations', 'a4_verified_signals', 'a4_decision_log']
const protectedTables = ['public.despega_user_profiles', 'public.despega_journey_state', 'public.a2_user_task_completions',
  'public.a3_user_progress', 'public.a3_route_progression', 'public.user_gamification_profile', 'public.user_dtc_balance',
  'public.dtc_documents', 'public.a2_reviewed_plans', 'dtc_private.a2_plan_revisions', 'dtc_private.a2_plan_receipts',
  'dtc_private.a2_assistant_action_receipts', ...sourceTables.map(table => `public.${table}`)]
const db = new Client({ connectionString: status.DB_URL }), cases = []
let failure = null, preserved = false, baseline
const record = async (name, action) => {
  await action(); cases.push({ name, verdict: 'PASS' }); console.log(`AG05 SQL: ${name}: PASS`)
}
async function snapshot() {
  const result = {}
  for (const table of protectedTables) result[table] = (await db.query(
    `select to_jsonb(t) as row from ${table} t order by to_jsonb(t)::text`)).rows.map(item => item.row)
  return result
}
async function inRole(role, owner, action) {
  assert.ok(['authenticated', 'anon'].includes(role))
  await db.query('begin')
  try {
    await db.query(`set local role ${role}`)
    await db.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ role, ...(owner ? { sub: owner } : {}) })])
    return await action()
  } finally { await db.query('rollback') }
}
const denied = error => { assert.equal(error.code, '42501'); return true }
try {
  await db.connect()
  assert.ok(Number((await db.query('show server_version_num')).rows[0].server_version_num) >= 170000)
  for (const user of [...fixtures.previousOwners, ...fixtures.users]) {
    assert.equal((await db.query('select id from auth.users where id=$1 and email=$2', [user.id,user.email])).rowCount, 1)
  }
  baseline = await snapshot()
  await record('Actual source schemas enable owner RLS and expose SELECT only to authenticated clients', async () => {
    for (const table of sourceTables) {
      const row = (await db.query(`select relrowsecurity as rls,
        has_table_privilege('authenticated',oid,'select') as owner_select,
        has_table_privilege('authenticated',oid,'insert,update,delete') as owner_write,
        has_table_privilege('anon',oid,'select,insert,update,delete') as anonymous,
        has_table_privilege('service_role',oid,'insert') as server_write
        from pg_class where oid=$1::regclass`, [`public.${table}`])).rows[0]
      assert.deepEqual(row, { rls: true, owner_select: true, owner_write: false, anonymous: false, server_write: true })
      const policies = (await db.query(`select cmd,roles::text,qual from pg_policies
        where schemaname='public' and tablename=$1`, [table])).rows
      assert.equal(policies.length, 1); assert.equal(policies[0].cmd, 'SELECT')
      assert.equal(policies[0].roles, '{authenticated}')
      assert.ok(policies[0].qual.includes('auth.uid()') && policies[0].qual.includes('user_id'))
    }
  })
  await record('Each real owner reads only their source rows; cross-owner IDs return no payload', async () => {
    for (const [index, user] of fixtures.users.entries()) {
      const foreign = fixtures.users[(index + 1) % fixtures.users.length]
      await inRole('authenticated', user.id, async () => {
        for (const table of sourceTables) {
          const own = await db.query(`select user_id from public.${table} where user_id=$1`, [user.id])
          assert.equal(own.rowCount, table === 'dtc_outcome_observations' ? 3 : table === 'a4_decision_log' ? 2 : 1)
          assert.ok(own.rows.every(row => row.user_id === user.id))
          assert.equal((await db.query(`select * from public.${table} where user_id=$1`, [foreign.id])).rowCount, 0)
          assert.ok((await db.query(`select user_id from public.${table}`)).rows.every(row => row.user_id === user.id),
            'RLS remains effective even if the caller omits its owner filter')
        }
      })
    }
  })
  await record('Anonymous reads cannot disclose A3 response text or A4 decisions and signal provenance', async () => {
    for (const table of sourceTables) await assert.rejects(
      inRole('anon', null, () => db.query(`select * from public.${table} limit 1`)), denied)
  })
  await record('Authenticated source INSERT, UPDATE and DELETE remain denied even for the current owner', async () => {
    for (const table of sourceTables) {
      const user = fixtures.users[0]
      for (const sql of [
        `insert into public.${table} default values`,
        `update public.${table} set user_id=user_id where user_id=$1`,
        `delete from public.${table} where user_id=$1`,
      ]) await assert.rejects(inRole('authenticated', user.id,
        () => db.query(sql, sql.includes('$1') ? [user.id] : [])), denied)
    }
  })
  assert.deepEqual(await snapshot(), baseline, 'Read-boundary tests preserve all source, canonical, plan and receipt rows')
  preserved = true
} catch (error) { failure = safeFailure(error, secrets); process.exitCode = 1; console.error('AG05 SQL failed:', failure) }
finally {
  if (baseline && !preserved) {
    try { assert.deepEqual(await snapshot(), baseline); preserved = true }
    catch (error) { failure ||= safeFailure(error, secrets); process.exitCode = 1 }
  }
  await db.end().catch(() => {})
  writeFileSync(join(evidence, 'a2-review-evidence-sql.json'), JSON.stringify({
    commit: process.env.A1_SOURCE_COMMIT, scope: fixtures.scope, verdict: failure ? 'FAIL' : 'PASS',
    cases, passed: cases.length, sourceTables, allExistingRowsPreserved: preserved,
    priorOwnersChecked: fixtures.previousOwners.length, newOwnersCreatedByThisSuite: 0,
    candidatePlanSqlRegression: 'Existing unchanged AG03 CAS/history/receipt SQL suite runs earlier; it is not duplicated here.',
    remoteOperations: 0, failure,
  }, null, 2))
}
