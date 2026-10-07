import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Client } from 'pg'
import { checkOutcomeConcurrency, checkOutcomeIdempotency, checkOutcomePrivileges } from './fixtures/outcomes-chile-idempotency-lab.mjs'

// This laboratory never reads app credentials. Native runs require an empty,
// explicitly named local database; PGlite always starts with a new in-memory DB.
// Sequential fixtures are rolled back. Native contention tests temporarily
// commit only laboratory fixtures, then explicitly remove those exact objects.
assert.equal(process.env.DTC_OUTCOMES_DATABASE_LAB, 'yes', 'Set DTC_OUTCOMES_DATABASE_LAB=yes for the disposable SQL laboratory')

let query, execute, close, connectNative
let engine = 'postgres'
const pgliteModule = process.env.DTC_OUTCOMES_PGLITE_MODULE
if (pgliteModule) {
  assert.ok(isAbsolute(pgliteModule), 'PGlite must be an explicit local module path')
  const { PGlite } = await import(pathToFileURL(pgliteModule).href)
  const db = new PGlite()
  query = (sql, parameters = []) => db.query(sql, parameters)
  execute = sql => db.exec(sql)
  close = () => db.close()
  engine = 'pglite'
} else {
  const raw = process.env.DTC_OUTCOMES_LAB_DATABASE_URL
  assert.ok(raw, 'Provide a disposable local DTC_OUTCOMES_LAB_DATABASE_URL')
  const target = new URL(raw)
  assert.ok(['postgres:', 'postgresql:'].includes(target.protocol), 'PostgreSQL URL required')
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(target.hostname), 'Remote databases are forbidden in this laboratory')
  assert.match(target.pathname.slice(1), /^dtc_outcomes_chile_lab(?:_[a-z0-9_]+)?$/, 'Use a dedicated dtc_outcomes_chile_lab database')
  // Keep every connection setting explicit; query-string host overrides could
  // otherwise replace the local hostname that was just checked.
  assert.equal(target.search, '', 'Connection-string query overrides are not allowed')
  const nativeConfig = {
    host: target.hostname === '[::1]' ? '::1' : target.hostname,
    port: target.port ? Number(target.port) : 5432,
    database: target.pathname.slice(1),
    user: decodeURIComponent(target.username),
    password: decodeURIComponent(target.password),
    ssl: false,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
  }
  const db = new Client(nativeConfig)
  await db.connect()
  query = (sql, parameters = []) => db.query(sql, parameters)
  execute = sql => db.query(sql)
  close = () => db.end()
  connectNative = async () => {
    const worker = new Client(nativeConfig)
    await worker.connect()
    return worker
  }
}

const migrations = new URL('../supabase/migrations/', import.meta.url)
const atomicFiles = readdirSync(migrations).filter(name => /^\d{14}_dtc_outcomes_chile_atomic_capture\.sql$/.test(name))
assert.equal(atomicFiles.length, 1, 'Expected exactly one atomic capture migration')
const foundation = readFileSync(new URL('20261007143246_dtc_outcomes_chile_foundation.sql', migrations), 'utf8')
const atomic = readFileSync(new URL(atomicFiles[0], migrations), 'utf8')
const retryFiles = readdirSync(migrations).filter(name => /^\d{14}_dtc_outcomes_chile_idempotent_capture\.sql$/.test(name))
assert.equal(retryFiles.length, 1, 'Expected exactly one idempotent capture migration')
const retryMigration = readFileSync(new URL(retryFiles[0], migrations), 'utf8')
const privilegeFiles = readdirSync(migrations).filter(name => /^\d{14}_dtc_outcomes_chile_explicit_privileges\.sql$/.test(name))
assert.equal(privilegeFiles.length, 1, 'Expected exactly one explicit privileges migration')
const privilegeMigration = readFileSync(new URL(privilegeFiles[0], migrations), 'utf8')

const ownerA = '00000000-0000-4000-8000-000000000001'
const ownerB = '00000000-0000-4000-8000-000000000002'
const employmentA = '00000000-0000-4000-8000-000000001001'
const employmentB = '00000000-0000-4000-8000-000000001002'
const failedEmployment = '00000000-0000-4000-8000-000000001003'
const salaryA = '00000000-0000-4000-8000-000000002001'
const ownerTables = ['dtc_job_search_events', 'dtc_employment_outcomes', 'dtc_salary_outcomes', 'dtc_outcome_followups', 'dtc_outcome_verifications']
const tables = [...ownerTables, 'dtc_chile_benchmarks']
let rejectedWrites = 0
let crossOwnerRejections = 0

async function expectError(sql, parameters, code, message) {
  await query('savepoint expected_failure')
  let observed
  try {
    await query(sql, parameters)
  } catch (error) {
    observed = error
  }
  await query('rollback to savepoint expected_failure')
  await query('release savepoint expected_failure')
  assert.ok(observed, message ?? `Expected SQLSTATE ${code}`)
  assert.equal(observed.code, code, message)
  return observed
}

const count = async (table, column, id) => Number((await query(`select count(*)::integer as count from public.${table} where ${column}=$1`, [id])).rows[0].count)
const employmentInsert = 'insert into public.dtc_employment_outcomes (id,user_id,outcome_type,effective_date,role_title) values ($1,$2,\'job_started\',$3,\'Laboratory role\') returning id'

let transactionOpen = false
let fixtureCommitted = false
try {
  await query('begin')
  transactionOpen = true
  const version = (await query('select version() as version')).rows[0].version
  const superuser = (await query('select rolsuper from pg_catalog.pg_roles where rolname=current_user')).rows[0].rolsuper
  assert.equal(superuser, true, 'Fixture setup needs a disposable local superuser')
  const existingTables = (await query("select count(*)::integer as count from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace where n.nspname in ('public','auth') and c.relkind in ('r','p')")).rows[0].count
  assert.equal(existingTables, 0, 'Refusing to use a database containing application tables')
  assert.equal((await query("select count(*)::integer as count from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace where n.nspname in ('public','auth')")).rows[0].count, 0, 'Refusing to replace existing application functions')
  assert.equal((await query("select count(*)::integer as count from pg_catalog.pg_namespace where nspname='auth'")).rows[0].count, 0, 'Fixture auth schema must not already exist')
  const existingRoles = (await query("select rolname from pg_catalog.pg_roles where rolname in ('anon','authenticated','service_role')")).rows
  assert.deepEqual(existingRoles, [], 'Use a fresh local cluster: laboratory roles must not already exist')

  await execute(`
    create role anon nologin nosuperuser nobypassrls;
    create role authenticated nologin nosuperuser nobypassrls;
    create role service_role nologin nosuperuser bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable security invoker
      set search_path=pg_catalog
      as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public,auth to anon,authenticated,service_role;
    grant execute on function auth.uid() to anon,authenticated,service_role;
  `)
  // First retain the stricter-default assertion: BYPASSRLS alone does not
  // grant INSERT. Then rebuild inside the same disposable setup using the
  // actual legacy Supabase defaults observed during the activation preflight.
  await query('savepoint without_default_grants')
  await execute(foundation)
  await query('set role service_role')
  await expectError(employmentInsert, [employmentA, ownerA, '2026-09-01'], '42501')
  await query('reset role')
  await query('rollback to savepoint without_default_grants')
  await query('release savepoint without_default_grants')
  await execute(`
    alter default privileges in schema public
      grant all on tables to anon,authenticated,service_role;
    alter default privileges in schema public
      grant execute on functions to anon,authenticated,service_role;
  `)
  await execute(foundation)
  await execute(atomic)
  await execute(retryMigration)
  const inheritedLedgerRights = (await query("select has_table_privilege('service_role','public.dtc_outcome_write_requests','DELETE') as can_delete,has_table_privilege('service_role','public.dtc_outcome_write_requests','TRUNCATE') as can_truncate")).rows[0]
  assert.deepEqual(inheritedLedgerRights, { can_delete: true, can_truncate: true }, 'Reproduce the real Supabase default-ACL gap before its correction')
  await execute(privilegeMigration)
  const privilegeEvidence = await checkOutcomePrivileges({ query, tables })
  const serviceRole = (await query("select rolsuper,rolbypassrls from pg_catalog.pg_roles where rolname='service_role'")).rows[0]
  assert.deepEqual(serviceRole, { rolsuper: false, rolbypassrls: true })

  const fn = (await query("select prosecdef,proconfig,has_function_privilege('anon',oid,'EXECUTE') as anon_execute,has_function_privilege('authenticated',oid,'EXECUTE') as authenticated_execute from pg_catalog.pg_proc where oid='public.dtc_schedule_employment_followups()'::regprocedure")).rows[0]
  assert.equal(fn.prosecdef, false)
  assert.deepEqual(fn.proconfig, ['search_path=pg_catalog'])
  assert.equal(fn.anon_execute, false)
  assert.equal(fn.authenticated_execute, false)

  if (connectNative) {
    // Other connections must be able to see the schema for genuine lock
    // contention. The empty-DB/role checks above bound the explicit cleanup.
    await query('commit')
    transactionOpen = false
    fixtureCommitted = true
    await query('begin')
    transactionOpen = true
  }

  await query('insert into auth.users (id) values ($1),($2)', [ownerA, ownerB])
  await query('set role service_role')
  await query(employmentInsert, [employmentA, ownerA, '2026-09-01'])
  await query(employmentInsert, [employmentB, ownerB, '2028-01-31'])
  const schedule = (await query('select user_id,followup_day,due_at::text,verification_status from public.dtc_outcome_followups where employment_outcome_id=$1 order by followup_day', [employmentA])).rows
  assert.deepEqual(schedule, [
    { user_id: ownerA, followup_day: 30, due_at: '2026-10-01', verification_status: 'self_reported' },
    { user_id: ownerA, followup_day: 90, due_at: '2026-11-30', verification_status: 'self_reported' },
    { user_id: ownerA, followup_day: 180, due_at: '2027-02-28', verification_status: 'self_reported' },
  ])
  assert.equal((await query('select due_at::text from public.dtc_outcome_followups where employment_outcome_id=$1 and followup_day=30', [employmentB])).rows[0].due_at, '2028-03-01')
  await expectError('insert into public.dtc_outcome_followups (user_id,employment_outcome_id,followup_day,due_at) values ($1,$2,30,\'2026-10-01\')', [ownerA, employmentA], '23505')
  assert.equal(await count('dtc_outcome_followups', 'employment_outcome_id', employmentA), 3)

  // An AFTER INSERT fault fires after a child row has actually been inserted.
  // PostgreSQL must roll back both the parent and every child in that statement.
  await query('reset role')
  await execute(`
    create function public.dtc_lab_followup_failure() returns trigger
      language plpgsql security invoker set search_path=pg_catalog as $$
    begin
      if new.employment_outcome_id='${failedEmployment}'::uuid and new.followup_day=90 then
        raise exception 'DTC_LAB_FORCED_FOLLOWUP_FAILURE' using errcode='23514';
      end if;
      return new;
    end $$;
    create trigger dtc_lab_followup_failure after insert on public.dtc_outcome_followups
      for each row execute function public.dtc_lab_followup_failure();
  `)
  await query('set role service_role')
  const forced = await expectError(employmentInsert, [failedEmployment, ownerA, '2026-09-02'], '23514')
  assert.match(forced.message, /DTC_LAB_FORCED_FOLLOWUP_FAILURE/)
  assert.equal(await count('dtc_employment_outcomes', 'id', failedEmployment), 0)
  assert.equal(await count('dtc_outcome_followups', 'employment_outcome_id', failedEmployment), 0)

  await expectError('insert into public.dtc_salary_outcomes (user_id,employment_outcome_id,measurement_role,monthly_net_clp,measured_at) values ($1,$2,\'new_role\',850000,\'2026-09-01\')', [ownerB, employmentA], '23503')
  crossOwnerRejections++
  await query('insert into public.dtc_salary_outcomes (id,user_id,employment_outcome_id,measurement_role,monthly_net_clp,measured_at) values ($1,$2,$3,\'new_role\',850000,\'2026-09-01\')', [salaryA, ownerA, employmentA])
  await query('insert into public.dtc_salary_outcomes (user_id,measurement_role,monthly_net_clp,measured_at) values ($1,\'baseline\',700000,\'2026-08-01\'),($2,\'baseline\',900000,\'2026-08-01\')', [ownerA, ownerB])
  for (const [sql, parameters] of [
    ['update public.dtc_salary_outcomes set employment_outcome_id=$1 where id=$2', [employmentB, salaryA]],
    ['update public.dtc_salary_outcomes set user_id=$1 where id=$2', [ownerB, salaryA]],
    ['insert into public.dtc_outcome_followups (user_id,employment_outcome_id,followup_day,due_at) values ($1,$2,30,\'2026-10-01\')', [ownerB, employmentA]],
    ['update public.dtc_outcome_followups set user_id=$1 where employment_outcome_id=$2 and followup_day=30', [ownerB, employmentA]],
    ['update public.dtc_employment_outcomes set user_id=$1 where id=$2', [ownerB, employmentA]],
  ]) {
    await expectError(sql, parameters, '23503')
    crossOwnerRejections++
  }

  await query('insert into public.dtc_job_search_events (user_id,event_type,occurred_at) values ($1,\'application\',\'2026-09-01T12:00:00Z\'),($2,\'application\',\'2026-09-01T12:00:00Z\')', [ownerA, ownerB])
  await query('insert into public.dtc_outcome_verifications (user_id,subject_type,subject_id,method,status) values ($1,\'employment_outcome\',$2,\'self_report\',\'pending\'),($3,\'employment_outcome\',$4,\'self_report\',\'pending\')', [ownerA, employmentA, ownerB, employmentB])
  await query("insert into public.dtc_chile_benchmarks (source_key,source_period,metric_key,value_numeric,unit,source_ref) values ('other_official','lab-2026','monthly_labor_income_median',700000,'clp_month','laboratory fixture, not a real benchmark')")

  for (const owner of [ownerA, ownerB]) {
    await query('reset role')
    await query('set role authenticated')
    await query("select set_config('request.jwt.claim.sub',$1,true)", [owner])
    for (const table of ownerTables) {
      const rows = (await query(`select user_id from public.${table}`)).rows
      assert.ok(rows.length > 0, `${table}: owner fixture must be visible`)
      assert.ok(rows.every(row => row.user_id === owner), `${table}: cross-owner row leaked`)
    }
    assert.equal((await query('select count(*)::integer as count from public.dtc_chile_benchmarks')).rows[0].count, 1)
  }

  for (const role of ['authenticated', 'anon']) {
    await query('reset role')
    await query(`set role ${role}`)
    for (const table of tables) {
      for (const sql of [
        `insert into public.${table} default values`,
        `update public.${table} set id=id`,
        `delete from public.${table}`,
      ]) {
        await expectError(sql, [], '42501')
        rejectedWrites++
      }
      if (role === 'anon') await expectError(`select * from public.${table}`, [], '42501')
    }
  }

  await query('reset role')
  await execute(atomic)
  await execute(retryMigration)
  await execute(privilegeMigration)
  await checkOutcomePrivileges({ query, tables })
  assert.equal((await query("select count(*)::integer as count from pg_catalog.pg_trigger where tgname='dtc_schedule_employment_followups' and tgrelid='public.dtc_employment_outcomes'::regclass")).rows[0].count, 1)
  assert.equal(await count('dtc_outcome_followups', 'employment_outcome_id', employmentA), 3)
  await query('set role service_role')
  await query('delete from public.dtc_employment_outcomes where id=$1', [employmentA])
  assert.equal(await count('dtc_outcome_followups', 'employment_outcome_id', employmentA), 0)
  const retainedSalary = (await query('select user_id,employment_outcome_id,monthly_net_clp from public.dtc_salary_outcomes where id=$1', [salaryA])).rows[0]
  assert.deepEqual(retainedSalary, { user_id: ownerA, employment_outcome_id: null, monthly_net_clp: 850000 })
  assert.equal((await query("select count(*)::integer as count from public.dtc_salary_outcomes where user_id=$1 and measurement_role='baseline' and employment_outcome_id is null", [ownerA])).rows[0].count, 1)
  assert.equal(await count('dtc_outcome_followups', 'employment_outcome_id', employmentB), 3)

  const retryEvidence = await checkOutcomeIdempotency({ query, execute, expectError, ownerA, ownerB })
  await query('rollback')
  transactionOpen = false
  const contentionEvidence = connectNative
    ? await checkOutcomeConcurrency({ query, connectNative, ownerA })
    : { nativeConcurrentRetry: false, contendedFollowupCannotOverwrite: false, reason: 'PGlite has one connection; native PostgreSQL CI runs the contention cases' }

  console.log(JSON.stringify({
    outcomesChileDatabase: 'PASS', engine, version,
    migration: atomicFiles[0], followups: [30, 90, 180], calendarArithmetic: true,
    employmentAndFollowupsRollbackTogether: true, crossOwnerRejections,
    ownerIsolatedTables: ownerTables.length, browserWritesRejected: rejectedWrites,
    explicitServiceGrants: tables.length, invokerTrigger: true,
    privilegeMigration: privilegeFiles[0],
    privileges: { ...privilegeEvidence, supabaseLegacyDefaultsReproduced: true, inheritedLedgerDeleteAndTruncateRemoved: true },
    salaryOwnerPreservedOnEmploymentDelete: true, repeatableMigration: true,
    idempotency: retryEvidence, concurrency: contentionEvidence,
    runtimeBoundary: engine === 'pglite' ? 'SQL engine only; no PostgREST, GoTrue, or concurrent connections' : 'Local PostgreSQL SQL boundary; no PostgREST or GoTrue',
  }, null, 2))
} finally {
  try {
    if (transactionOpen) await query('rollback')
    if (fixtureCommitted) {
      await execute(`
        reset role;
        begin;
        drop function if exists public.capture_dtc_chile_outcome(uuid,uuid,text,jsonb);
        drop function if exists public.dtc_schedule_employment_followups() cascade;
        drop table public.dtc_outcome_write_requests,public.dtc_outcome_verifications,
          public.dtc_outcome_followups,public.dtc_salary_outcomes,
          public.dtc_employment_outcomes,public.dtc_job_search_events,public.dtc_chile_benchmarks cascade;
        drop schema auth cascade;
        drop owned by anon,authenticated,service_role;
        drop role anon,authenticated,service_role;
        commit;
      `)
    }
  } finally {
    await close()
  }
}
