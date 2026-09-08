import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import pg from 'pg'

// This fixture is deliberately unable to target an external or production database.
const url = new URL(process.env.A1_BOUNDARY_TEST_DATABASE_URL || 'postgres://postgres:dtc_fixture_only@127.0.0.1:5432/dtc_a1_boundary_test')
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname), 'Only a disposable loopback PostgreSQL is accepted')
assert.equal(url.pathname, '/dtc_a1_boundary_test', 'An explicitly named disposable database is required')
assert.equal(process.env.A1_BOUNDARY_DISPOSABLE, 'yes', 'Explicit ephemeral-test opt-in required')
const db = new pg.Client({ connectionString: url.toString() })
const tables = ['a1_cerebral_assessment', 'canon_conozcamonos_1_responses', 'canon_conozcamonos_2_responses']
const owner = randomUUID(), other = randomUUID()
let cases = 0
await db.connect()
try {
  assert.equal((await db.query('select current_database() name')).rows[0].name, 'dtc_a1_boundary_test')
  const existing = await db.query("select to_regclass('public.a1_cerebral_assessment') as relation")
  assert.equal(existing.rows[0].relation, null, 'Never overwrite a pre-existing dataset, even in the named test DB')
  await db.query(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
  `)
  for (const table of tables) {
    await db.query(`create table public.${table}(id uuid primary key, user_id uuid not null, responses jsonb not null default '{}', updated_at timestamptz);
      alter table public.${table} enable row level security;
      grant select, insert, update, delete on public.${table} to anon, authenticated, service_role;
      create policy owner_access on public.${table} for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);`)
    await db.query(`insert into public.${table}(id,user_id,responses) values ($1,$2,$3),($4,$5,$6)`,
      [randomUUID(), owner, { answer: 'owner fixture', original: true }, randomUUID(), other, { answer: 'other fixture', original: true }])
  }
  // A deliberately permissive synthetic policy tests that the guard cannot be bypassed by OR-combined policies.
  for (const table of tables) await db.query(`create policy fixture_broad_read on public.${table} for select to anon, authenticated using (true)`)
  const snapshot = async () => (await Promise.all(tables.map(async (table) => (await db.query(`select * from public.${table} order by id`)).rows)))
  const before = await snapshot()
  async function asRole(role, id, operation) {
    assert.ok(['anon', 'authenticated', 'service_role'].includes(role))
    await db.query('begin')
    try {
      await db.query(`set local role ${role}`)
      await db.query("select set_config('request.jwt.claim.sub', $1, true)", [id || ''])
      return await operation(db)
    } finally { await db.query('rollback') }
  }
  const baseline = await asRole('anon', null, (client) => client.query('select count(*)::int n from public.a1_cerebral_assessment'))
  assert.equal(baseline.rows[0].n, 2)
  cases++
  const migration = readFileSync('supabase/migrations/20260907204000_a1_owner_boundary.sql', 'utf8')
  await db.query('begin')
  try { await db.query(migration); await db.query('commit') } catch (error) { await db.query('rollback'); throw error }
  // Replay checks idempotence, not a second production mutation.
  await db.query('begin')
  try { await db.query(migration); await db.query('commit') } catch (error) { await db.query('rollback'); throw error }
  assert.deepEqual(await snapshot(), before, 'Migration must preserve every fixture row byte-for-byte')
  cases++
  for (const table of tables) {
    for (const [role, id, expected] of [['anon', null, 0], ['authenticated', null, 0], ['authenticated', owner, 1], ['authenticated', other, 1], ['service_role', null, 2]]) {
      const rows = await asRole(role, id, (client) => client.query(`select user_id from public.${table}`))
      assert.equal(rows.rowCount, expected, `${table}: ${role} ownership`)
      if (role === 'authenticated' && id) assert.ok(rows.rows.every((row) => row.user_id === id))
      cases++
    }
    await assert.rejects(asRole('authenticated', owner, (client) => client.query(`insert into public.${table}(id,user_id) values($1,$2)`, [randomUUID(), other])), { code: '42501' })
    await assert.rejects(asRole('authenticated', owner, (client) => client.query(`update public.${table} set user_id=$1 where user_id=$2`, [other, owner])), { code: '42501' })
    await assert.rejects(asRole('anon', null, (client) => client.query(`insert into public.${table}(id,user_id) values($1,$2)`, [randomUUID(), owner])), { code: '42501' })
    cases += 3
    const ownInsert = await asRole('authenticated', owner, (client) => client.query(`insert into public.${table}(id,user_id) values($1,$2) returning id`, [randomUUID(), owner]))
    assert.equal(ownInsert.rowCount, 1); cases++
    for (const operation of [`update public.${table} set responses='{}' where user_id=$1`, `delete from public.${table} where user_id=$1`]) {
      assert.equal((await asRole('authenticated', owner, (client) => client.query(operation, [other]))).rowCount, 0)
      cases++
    }
  }
  assert.deepEqual(await snapshot(), before, 'Rolled-back write tests must preserve all fixture records')
  cases++
  // Real database compare-and-swap: two clients read the same C2 revision before either writes.
  const first = new pg.Client({ connectionString: url.toString() }), second = new pg.Client({ connectionString: url.toString() })
  await Promise.all([first.connect(), second.connect()])
  try {
    for (const client of [first, second]) {
      await client.query('set role authenticated')
      await client.query("select set_config('request.jwt.claim.sub', $1, false)", [owner])
    }
    const [a, b] = await Promise.all([first.query('select * from public.canon_conozcamonos_2_responses'), second.query('select * from public.canon_conozcamonos_2_responses')])
    assert.deepEqual(a.rows, b.rows)
    const row = a.rows[0]
    const next = { ...row.responses, _a1_understanding_v1: { answers: { selections: {}, recognition: 'contextual' } } }
    const sql = 'update public.canon_conozcamonos_2_responses set responses=$1,updated_at=now() where user_id=$2 and id=$3 and responses=$4 and updated_at is not distinct from $5 returning id'
    const results = await Promise.all([first.query(sql, [next, owner, row.id, row.responses, row.updated_at]), second.query(sql, [next, owner, row.id, row.responses, row.updated_at])])
    assert.deepEqual(results.map((result) => result.rowCount).sort(), [0, 1]); cases++
    const final = (await first.query('select responses from public.canon_conozcamonos_2_responses')).rows[0].responses
    assert.equal(final.original, true); assert.equal(final.answer, 'owner fixture'); cases++
    assert.deepEqual((await db.query('select responses from public.canon_conozcamonos_2_responses where user_id=$1', [other])).rows[0].responses, { answer: 'other fixture', original: true }); cases++
  } finally { await Promise.all([first.end(), second.end()]) }
  console.log(`A1 PostgreSQL boundary: PASS (${cases} grouped checks; actual PostgreSQL policies and concurrent writers; synthetic auth.uid/fixtures, not Supabase Auth or production)`)
} finally { await db.end() }
