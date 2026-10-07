import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import pg from 'pg'

const dsn = process.env.DTC_TEST_DATABASE_URL
if (!dsn) throw new Error('DTC_TEST_DATABASE_URL is required for the isolated PostgreSQL test')
let parsed
try { parsed = new URL(dsn) } catch { throw new Error('Invalid isolated PostgreSQL test URL') }
if (!['postgres:', 'postgresql:'].includes(parsed.protocol)
    || !['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
    || parsed.pathname !== '/dtc_opportunity_tests'
    || parsed.search || parsed.hash) {
  throw new Error('Refusing database tests: only a local dtc_opportunity_tests database is allowed')
}

const { Client } = pg
const admin = new Client({ connectionString: dsn, connectionTimeoutMillis: 5000 })
const workerA = new Client({ connectionString: dsn, connectionTimeoutMillis: 5000 })
const workerB = new Client({ connectionString: dsn, connectionTimeoutMillis: 5000 })
const createdRoles = []
let fixtureCreated = false
let adminConnected = false
let workerAConnected = false
let workerBConnected = false
const passed = []
const migration = await readFile(
  new URL('../supabase/migrations/20261007180000_a4_opportunity_refresh_lease.sql', import.meta.url),
  'utf8',
)

const SLOT_MS = 3 * 60 * 60 * 1000

async function acquire(client) {
  // MATERIALIZED evaluates the volatile acquisition before the database clock
  // observation; no assertion below depends on the runner's local clock.
  const result = await client.query(
    'with acquisition as materialized (' +
    'select public.acquire_a4_opportunity_refresh() as lease) ' +
    'select lease, pg_catalog.clock_timestamp() as observed_at from acquisition',
  )
  return {
    ...result.rows[0].lease,
    database_observed_at: result.rows[0].observed_at.toISOString(),
  }
}

function assertLeaseClock(lease) {
  assert.equal(lease.status, 'acquired')
  assert.match(lease.execution_id, /^[0-9a-f-]{36}$/i)
  const startedMs = Date.parse(lease.started_at)
  const observedMs = Date.parse(lease.database_observed_at)
  assert.ok(Number.isFinite(startedMs) && Number.isFinite(observedMs))
  assert.equal(lease.slot, Math.floor(startedMs / SLOT_MS))
  assert.equal(Date.parse(lease.lease_expires_at) - startedMs, 120000)
  assert.ok(observedMs >= startedMs)
}

async function assertCompletedAttemptConsumesSlot(client, initialLease, completionStatus) {
  let currentLease = initialLease
  // A UTC slot may change between completion and the next acquisition. A new
  // slot is valid; complete only that new fixture row and repeat this assertion
  // in its window. No schema reset, provider request or global fixture reload.
  for (let transitions = 0; transitions < 3; transitions += 1) {
    const completed = await admin.query(
      'update public.cron_job_executions set status = $2, ' +
      'completed_at = pg_catalog.clock_timestamp() where id = $1',
      [currentLease.execution_id, completionStatus],
    )
    assert.equal(completed.rowCount, 1)
    const next = await acquire(client)
    if (next.status === 'already_attempted') return currentLease
    assertLeaseClock(next)
    assert.ok(next.slot > currentLease.slot,
      'A completed attempt must never permit reacquisition in its own slot')
    currentLease = next
  }
  assert.fail('The isolated scenario crossed three distinct three-hour windows')
}

try {
  await admin.connect()
  adminConnected = true
  await admin.query("set statement_timeout = '5s'")
  const identity = await admin.query('select current_database() as name')
  assert.equal(identity.rows[0].name, 'dtc_opportunity_tests')
  const existing = await admin.query(
    "select to_regclass('public.cron_job_executions') as ledger, to_regprocedure('public.acquire_a4_opportunity_refresh()') as rpc",
  )
  if (existing.rows[0].ledger || existing.rows[0].rpc) {
    throw new Error('Refusing to replace an existing test ledger or refresh function')
  }
  for (const role of ['anon', 'authenticated', 'service_role']) {
    const found = await admin.query('select 1 from pg_roles where rolname = $1', [role])
    if (!found.rowCount) {
      // Role names are a fixed local fixture, never caller-controlled identifiers.
      await admin.query('create role ' + role + ' nologin' + (role === 'service_role' ? ' bypassrls' : ''))
      createdRoles.push(role)
    }
  }
  await admin.query(
    "create table public.cron_job_executions (" +
    "id uuid primary key default gen_random_uuid(), " +
    "job_name text not null, job_path text not null, " +
    "status text not null check (status in ('success','failure','running')), " +
    "started_at timestamptz not null default now(), completed_at timestamptz, " +
    "duration_ms integer, error_message text, error_stack text, execution_summary jsonb, " +
    "created_at timestamptz default now())",
  )
  fixtureCreated = true
  await admin.query('alter table public.cron_job_executions enable row level security')
  await admin.query('revoke all on public.cron_job_executions from public, anon, authenticated')
  await admin.query('grant select, insert, update, delete on public.cron_job_executions to service_role')
  await admin.query('grant usage on schema public to anon, authenticated, service_role')
  await admin.query(migration)

  const grants = await admin.query(
    "select has_function_privilege('anon', 'public.acquire_a4_opportunity_refresh()', 'execute') as anon, " +
    "has_function_privilege('authenticated', 'public.acquire_a4_opportunity_refresh()', 'execute') as authenticated, " +
    "has_function_privilege('service_role', 'public.acquire_a4_opportunity_refresh()', 'execute') as service",
  )
  assert.deepEqual(grants.rows[0], { anon: false, authenticated: false, service: true })
  const functionSettings = await admin.query(
    "select prosecdef, proconfig from pg_proc where oid = 'public.acquire_a4_opportunity_refresh()'::regprocedure",
  )
  assert.equal(functionSettings.rows[0].prosecdef, false)
  assert.ok(functionSettings.rows[0].proconfig.some((value) => value.startsWith('search_path=') && !value.includes('public')))
  for (const role of ['anon', 'authenticated']) {
    await admin.query('set role ' + role)
    try {
      await assert.rejects(acquire(admin), { code: '42501' })
    } finally {
      await admin.query('reset role')
    }
  }
  passed.push('Only service_role can execute the fixed, empty-search-path RPC')

  const connections = await Promise.allSettled([
    workerA.connect().then(() => { workerAConnected = true }),
    workerB.connect().then(() => { workerBConnected = true }),
  ])
  if (connections.some((result) => result.status === 'rejected')) throw new Error('Unable to connect isolated test workers')
  await Promise.all([workerA.query("set statement_timeout = '5s'"), workerB.query("set statement_timeout = '5s'")])
  await Promise.all([workerA.query('set role service_role'), workerB.query('set role service_role')])
  await workerA.query('begin')
  const first = await acquire(workerA)
  assertLeaseClock(first)
  // The first transaction remains open: the other connection must fail the
  // advisory-lock acquisition without seeing or creating a duplicate row.
  const simultaneous = await acquire(workerB)
  assert.equal(simultaneous.status, 'overlap')
  await workerA.query('commit')
  const ledgerCount = await admin.query(
    "select count(*)::integer as count from public.cron_job_executions where job_name = 'a4-opportunities'",
  )
  assert.equal(ledgerCount.rows[0].count, 1)
  passed.push('Concurrent acquisition on independent connections creates exactly one lease')

  assert.equal((await acquire(workerB)).status, 'overlap')
  let scenarioLease = await assertCompletedAttemptConsumesSlot(workerB, first, 'failure')
  passed.push('A running lease blocks overlap; a failed attempt still consumes its slot')

  scenarioLease = await assertCompletedAttemptConsumesSlot(workerB, scenarioLease, 'success')
  passed.push('Successful completion also prevents a duplicate attempt in the slot')

  // Move only this scenario's row to the previous window measured by the DB.
  // It is expired whether or not the next statement crosses another boundary.
  const beforeRecovery = await admin.query(
    "select count(*)::integer as count from public.cron_job_executions where job_name = 'a4-opportunities'",
  )
  await admin.query(
    "update public.cron_job_executions set status = 'running', completed_at = null, " +
    "started_at = to_timestamp((floor(date_part('epoch', clock_timestamp()) / 10800) - 1) * 10800) " +
    "+ interval '1 minute' where id = $1",
    [scenarioLease.execution_id],
  )
  const recovered = await acquire(workerB)
  assertLeaseClock(recovered)
  assert.notEqual(recovered.execution_id, scenarioLease.execution_id)
  const finalCount = await admin.query(
    "select count(*)::integer as count from public.cron_job_executions where job_name = 'a4-opportunities'",
  )
  assert.equal(finalCount.rows[0].count, beforeRecovery.rows[0].count + 1)
  const expiredWorker = await admin.query(
    'select status, error_message, execution_summary from public.cron_job_executions where id = $1',
    [scenarioLease.execution_id],
  )
  assert.equal(expiredWorker.rows[0].status, 'failure')
  assert.equal(expiredWorker.rows[0].error_message, 'LEASE_EXPIRED')
  assert.equal(expiredWorker.rows[0].execution_summary.error, 'LEASE_EXPIRED')
  passed.push('An expired previous-slot worker is recoverable without new infrastructure')

  console.log(JSON.stringify({
    suite: 'opportunity-refresh-postgresql',
    database: 'isolated local PostgreSQL',
    passed: passed.length,
    cases: passed,
    productionConnectionAllowed: false,
    providerRequests: 0,
  }))
} finally {
  await Promise.allSettled([
    ...(workerAConnected ? [workerA.query('rollback')] : []),
    ...(workerBConnected ? [workerB.query('rollback')] : []),
  ])
  await Promise.allSettled([
    ...(workerAConnected ? [workerA.end()] : []),
    ...(workerBConnected ? [workerB.end()] : []),
  ])
  if (fixtureCreated) {
    await admin.query('drop function if exists public.acquire_a4_opportunity_refresh()')
    await admin.query('drop table public.cron_job_executions')
  }
  for (const role of createdRoles.reverse()) {
    await admin.query('revoke all on schema public from ' + role)
    await admin.query('drop role ' + role)
  }
  if (adminConnected) await admin.end()
}
