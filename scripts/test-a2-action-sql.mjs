/** Actual AG04 PostgreSQL transactions in the unlinked disposable CI stack.
 * These synthetic owners are separate from every browser fixture owner. */
import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { a2ActionCommandSchema, a2ActionReceiptSchema, a2ActionStoredContent } from '../lib/a2/assistant-action-contract.ts'
import { a2PlanContextSnapshotSchema, a2PlanToday } from '../lib/a2/plan-contract.ts'
import { A2_BARRIERS, readAdjustmentContent } from '../lib/a2/practice-adjustment.ts'
import { closureLab, safeFailure } from './a1-browser-qa/closure-lab.mjs'

const migration = '20261106221437_a2_assistant_action_receipts.sql'
const receiptTable = 'dtc_private.a2_assistant_action_receipts'
const secrets = [], users = Array.from({ length: 16 }, (_, index) => `a2040004-0000-4000-8000-${String(index + 1).padStart(12, '0')}`)
const canonicalTables = ['public.despega_user_profiles', 'public.despega_journey_state',
  'public.a1_cerebral_assessment', 'public.canon_conozcamonos_1_responses', 'public.canon_conozcamonos_2_responses',
  'public.a2_user_task_completions', 'public.a3_user_progress', 'public.a3_route_progression',
  'public.user_gamification_profile', 'public.user_dtc_balance']
const stable = value => value === null || typeof value !== 'object' ? JSON.stringify(value)
  : Array.isArray(value) ? `[${value.map(stable).join(',')}]`
    : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
const baseProjection = {
  practicePath: 'profesional', activeHorizon: 30,
  next: { href: '/despega/a2/dia-3', label: 'Practicar', title: 'Práctica sintética', description: 'Un paso revisado.' },
  completedDays: [1, 2], checkpointPending: false, radarAvailable: false, objective: null, adjustment: null,
  sources: [{ id: 'journey', status: 'available', label: 'Recorrido guardado' },
    { id: 'objective', status: 'missing', label: 'Objetivo no guardado' },
    { id: 'adjustment', status: 'missing', label: 'Ajuste no guardado' }], limitations: [],
}
const snapshot = (projection = baseProjection, overrides = {}) => a2PlanContextSnapshotSchema.parse({
  version: 'dtc-a2-plan-context.v1', capturedAt: new Date().toISOString(), available: true,
  hash: createHash('sha256').update(stable(projection)).digest('hex'), projection, ...overrides,
})
const plusDays = (date, count) => {
  const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + count)
  return value.toISOString().slice(0, 10)
}
const adjustment = (overrides = {}) => ({ outcome: 'could_not', barrier: 'time', retainedWork: 'Conservo mis notas sintéticas.',
  nextAction: 'Practicaré un ejemplo durante diez minutos.', reviewDate: plusDays(a2PlanToday(), 7), ...overrides })
const command = (overrides = {}) => a2ActionCommandSchema.parse({ version: 'dtc-a2-action-command.v1',
  tool: 'save_practice_adjustment', requestId: randomUUID(), dayNumber: 3, expectedContextHash: snapshot().hash,
  adjustment: adjustment(), ...overrides })
const dbError = (code, message) => error => {
  assert.equal(error.code, code); if (message) assert.equal(error.message, message); return true
}
async function inRole(db, role, actor, action, settings = {}) {
  assert.ok(['service_role', 'authenticated', 'anon'].includes(role))
  await db.query('begin')
  try {
    await db.query(`set local role ${role}`)
    await db.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ role, ...(actor ? { sub: actor } : {}) })])
    for (const [name, value] of Object.entries(settings)) {
      assert.ok(['dtc.a2_action_fail_at', 'dtc.a2_action_gate', 'TimeZone'].includes(name))
      await db.query('select set_config($1,$2,true)', [name, value])
    }
    const result = await action(db); await db.query('commit'); return result
  } catch (error) { await db.query('rollback'); throw error }
}

async function main() {
  const { root, status, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'a2-action-prepared.json')), 'Prepare the actual AG04 surface first')
  const fixtures = JSON.parse(readFileSync(join(root, 'a2-action-fixtures.private.json'), 'utf8'))
  assert.equal(fixtures.scope, 'disposable-local-a2-action'); assert.equal(fixtures.users.length, 4)
  for (const user of fixtures.users) {
    assert.ok(['a2-action-desktop', 'a2-action-mobile', 'a2-action-locked', 'a2-action-revoked'].includes(user.label))
    assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
  }
  secrets.push(status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY, fixtures.password)
  const db = new Client({ connectionString: status.DB_URL }); await db.connect()
  const connections = [], createdUsers = [], cases = []
  let triggersInstalled = false, passed = false, cleanupPassed = false, browserBefore, ownCanonicalBefore
  const connect = async () => {
    const client = new Client({ connectionString: status.DB_URL }); await client.connect(); connections.push(client); return client
  }
  const confirm = async (userId, input = command(), context = snapshot(), options = {}) => {
    const result = await inRole(options.db || db, 'service_role', null, async client =>
      (await client.query('select public.confirm_a2_assistant_action($1,$2,$3) as result',
        [userId, JSON.stringify(input), context === null ? null : JSON.stringify(context)])).rows[0].result, options.settings)
    assert.equal(a2ActionReceiptSchema.safeParse(result).success, true, 'Real SQL receipt must satisfy the shared contract')
    return result
  }
  const receipt = async (userId, input, options = {}) => inRole(options.db || db, 'service_role', null, async client =>
    (await client.query('select public.read_a2_assistant_action_receipt($1,$2) as result',
      [userId, JSON.stringify(input)])).rows[0].result)
  const records = async (tables, ownerIds) => {
    const result = {}
    for (const table of tables) result[table] = (await db.query(
      `select to_jsonb(t) as row from ${table} t where user_id::text=any($1::text[]) order by to_jsonb(t)::text`, [ownerIds])).rows.map(row => row.row)
    return result
  }
  const saved = userId => records(['public.dtc_documents', receiptTable], [userId])
  const assertEmpty = async userId => { for (const rows of Object.values(await saved(userId))) assert.equal(rows.length, 0) }
  const assertOne = async userId => {
    const result = await saved(userId); assert.equal(result['public.dtc_documents'].length, 1); assert.equal(result[receiptTable].length, 1); return result
  }
  const contextFor = async userId => {
    const latest = (await db.query(`select id,content,to_jsonb(d)->>'created_at' as created_at from public.dtc_documents d
      where user_id=$1 and type='a2_practice_adjustment' and related_day=3 order by created_at desc,id desc limit 1`, [userId])).rows[0]
    if (!latest) return snapshot()
    const content = readAdjustmentContent(latest.content); assert.ok(content)
    const projection = structuredClone(baseProjection)
    projection.adjustment = { dayNumber: 3, nextAction: content.nextAction, retainedWork: content.retainedWork,
      barrierLabel: A2_BARRIERS[content.barrier].label, reviewDate: content.reviewDate }
    projection.sources[2] = { id: 'adjustment', status: 'available', label: 'Ajuste conservado', recordId: latest.id, recordedAt: latest.created_at }
    return snapshot(projection)
  }
  const run = async (name, action) => {
    try { await action(); cases.push({ name, verdict: 'PASS' }); console.log(`PASS ${name}`) }
    catch (error) { cases.push({ name, verdict: 'FAIL', error: safeFailure(error, secrets) }); error.message = `${name}: ${error.message}`; throw error }
  }
  const preserveBrowser = async () => {
    assert.deepEqual(await records([...canonicalTables, 'public.dtc_documents', receiptTable], fixtures.users.map(user => user.id)), browserBefore)
    for (const user of fixtures.users) assert.equal((await db.query('select id from auth.users where id=$1 and email=$2', [user.id, user.email])).rowCount, 1)
  }
  async function blocked(pid, blocker) {
    for (let attempt = 0; attempt < 150; attempt++) {
      if ((await db.query('select $2::integer=any(pg_blocking_pids($1::integer)) as blocked', [pid, blocker])).rows[0].blocked) return
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    assert.fail('Actual PostgreSQL lock contention was not observed')
  }
  async function race(userId, first, second, independentOwner = null) {
    const control = await connect(), one = await connect(), two = await connect()
    const controlPid = (await control.query('select pg_backend_pid() as pid')).rows[0].pid
    const onePid = (await one.query('select pg_backend_pid() as pid')).rows[0].pid
    const twoPid = (await two.query('select pg_backend_pid() as pid')).rows[0].pid
    const settle = promise => promise.then(value => ({ value }), error => ({ error }))
    let firstPending, secondPending
    await control.query('select pg_advisory_lock(20261106,204)')
    try {
      firstPending = settle(confirm(userId, first, snapshot(), { db: one, settings: { 'dtc.a2_action_gate': 'on' } }))
      await blocked(onePid, controlPid)
      secondPending = settle(confirm(userId, second, snapshot(), { db: two }))
      await blocked(twoPid, onePid)
      if (independentOwner) assert.equal((await confirm(independentOwner)).replayed, false)
    } finally { await control.query('select pg_advisory_unlock(20261106,204)') }
    return Promise.all([firstPending, secondPending])
  }

  try {
    browserBefore = await records([...canonicalTables, 'public.dtc_documents', receiptTable], fixtures.users.map(user => user.id))
    assert.ok(Number((await db.query('show server_version_num')).rows[0].server_version_num) >= 170000)
    assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])', [users])).rowCount, 0)
    await preserveBrowser()
    await run('Only service can invoke the empty-search-path invoker RPCs or read immutable private receipts', async () => {
      for (const signature of ['public.read_a2_assistant_action_receipt(uuid,jsonb)', 'public.confirm_a2_assistant_action(uuid,jsonb,jsonb)']) {
        const fn = (await db.query(`select p.prosecdef,p.proconfig,
          has_function_privilege('anon',p.oid,'execute') as anon,
          has_function_privilege('authenticated',p.oid,'execute') as authenticated,
          has_function_privilege('service_role',p.oid,'execute') as service
          from pg_proc p where p.oid=$1::regprocedure`, [signature])).rows[0]
        assert.equal(fn.prosecdef, false); assert.ok(fn.proconfig.includes('search_path=""'))
        assert.equal(fn.anon, false); assert.equal(fn.authenticated, false); assert.equal(fn.service, true)
      }
      const rights = (await db.query(`select
        has_schema_privilege('authenticated','dtc_private','usage') as private_usage,
        has_table_privilege('authenticated','${receiptTable}','select,insert,update,delete') as client,
        has_table_privilege('anon','${receiptTable}','select,insert,update,delete') as anon,
        has_table_privilege('service_role','${receiptTable}','select,insert') as service,
        has_table_privilege('service_role','${receiptTable}','update,delete') as mutation`)).rows[0]
      assert.deepEqual(rights, { private_usage: false, client: false, anon: false, service: true, mutation: false })
      const rls = (await db.query('select relrowsecurity,relforcerowsecurity from pg_class where oid=$1::regclass', [receiptTable])).rows[0]
      assert.equal(rls.relrowsecurity, true); assert.equal(rls.relforcerowsecurity, true)
      const columns = (await db.query("select column_name from information_schema.columns where table_schema='dtc_private' and table_name='a2_assistant_action_receipts' order by ordinal_position")).rows.map(row => row.column_name)
      assert.deepEqual(columns, ['user_id', 'request_id', 'command_hash', 'document_id', 'day_number', 'committed_at'])
    })
    for (const [index, userId] of users.entries()) {
      await db.query(`insert into auth.users(id,aud,role,email,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
        values($1,'authenticated','authenticated',$2,now(),'{}','{}',now(),now())`, [userId, `dtc-qa-a2-action-sql-${index + 1}@example.invalid`])
      createdUsers.push(userId)
      if (index < users.length - 1) await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered')", [userId])
    }
    await db.query('insert into public.despega_user_profiles(user_id,a2_sprint_progress) values($1,2)', [users[0]])
    await db.query('select public.ensure_despega_journey_state($1)', [users[0]])
    await db.query('insert into public.a2_user_task_completions(user_id,day,completed_at) values($1,1,now()),($1,2,now())', [users[0]])
    await db.query('insert into public.a3_user_progress(user_id,total_xp) values($1,97)', [users[0]])
    ownCanonicalBefore = await records(canonicalTables, users)
    assert.equal((await db.query("select to_regprocedure('dtc_private.a2_action_sql_fault()') as existing")).rows[0].existing, null)
    await db.query(`create function dtc_private.a2_action_sql_fault() returns trigger language plpgsql
      security invoker set search_path='' as $$
      begin
        if new.user_id::text not like 'a2040004-0000-4000-8000-%' then return new; end if;
        if tg_table_name='dtc_documents' and current_setting('dtc.a2_action_gate',true)='on' then
          perform pg_advisory_xact_lock(20261106,204);
        end if;
        if current_setting('dtc.a2_action_fail_at',true)=tg_table_name then
          raise exception using errcode='P0001',message='synthetic_action_write_failure';
        end if;
        return new;
      end; $$;
      revoke all on function dtc_private.a2_action_sql_fault() from public,anon,authenticated;
      create trigger zz_a2_action_sql_document before insert on public.dtc_documents for each row execute function dtc_private.a2_action_sql_fault();
      create trigger zz_a2_action_sql_receipt before insert on ${receiptTable} for each row execute function dtc_private.a2_action_sql_fault();`)
    triggersInstalled = true
    await run('A confirmed adjustment and its receipt commit once using the existing v1 document envelope', async () => {
      const input = command(), proof = await confirm(users[0], input), state = await assertOne(users[0])
      const document = state['public.dtc_documents'][0]
      assert.equal(proof.requestId, input.requestId); assert.equal(proof.documentId, document.id)
      assert.equal(proof.replayed, false); assert.equal(document.source, 'user'); assert.equal(document.status, 'draft')
      assert.deepEqual(JSON.parse(document.content), a2ActionStoredContent(input))
      assert.equal(Date.parse(proof.committedAt), Date.parse(document.created_at))
      assert.equal((await receipt(users[0], input)).replayed, true)
      const replay = await confirm(users[0], input, null)
      assert.equal(replay.documentId, proof.documentId); assert.equal(replay.replayed, true); await assertOne(users[0])
    })
    await run('Owner RLS permits only the committed owner document and denies other owners/anon', async () => {
      const ownerRows = await inRole(db, 'authenticated', users[0], client => client.query('select id,content from public.dtc_documents where user_id=$1', [users[0]]))
      assert.equal(ownerRows.rowCount, 1)
      const foreign = await inRole(db, 'authenticated', users[1], client => client.query('select id,content from public.dtc_documents where user_id=$1', [users[0]]))
      assert.equal(foreign.rowCount, 0)
      await assert.rejects(inRole(db, 'anon', null, client => client.query('select id from public.dtc_documents where user_id=$1', [users[0]])), dbError('42501'))
      await assert.rejects(inRole(db, 'authenticated', users[0], client => client.query('select public.confirm_a2_assistant_action($1,$2,$3)', [users[0], JSON.stringify(command()), JSON.stringify(snapshot())])), dbError('42501'))
    })
    for (const table of ['dtc_documents', 'a2_assistant_action_receipts']) await run(`A ${table} fault rolls back both the effect and receipt`, async () => {
      await assert.rejects(confirm(users[1], command(), snapshot(), { settings: { 'dtc.a2_action_fail_at': table } }), dbError('P0001', 'synthetic_action_write_failure'))
      await assertEmpty(users[1])
    })
    await run('Concurrent identical confirmations return one commit and a replay', async () => {
      const input = command(), [first, second] = await race(users[2], input, input, users[3])
      assert.ok(first.value && second.value); assert.equal(first.value.documentId, second.value.documentId)
      assert.equal(first.value.replayed, false); assert.equal(second.value.replayed, true); await assertOne(users[2]); await assertOne(users[3])
    })
    await run('Concurrent different confirmations from the same context require re-review of the first result', async () => {
      const [first, second] = await race(users[4], command(), command({ adjustment: adjustment({ nextAction: 'Otra acción revisable.' }) }))
      assert.ok(first.value); assert.equal(second.error?.message, 'a2_action_context_changed'); await assertOne(users[4])
    })
    await run('A request identifier cannot be reused for different confirmed content', async () => {
      const input = command(), changed = { ...input, adjustment: adjustment({ nextAction: 'Cambió la intención.' }) }
      await confirm(users[5], input)
      await assert.rejects(receipt(users[5], changed), dbError('P0001', 'a2_action_request_conflict'))
      await assert.rejects(confirm(users[5], changed, null), dbError('P0001', 'a2_action_request_conflict')); await assertOne(users[5])
    })
    await run('Deleting the effect keeps its receipt and an old replay never recreates content', async () => {
      const input = command(), proof = await confirm(users[6], input)
      await db.query('delete from public.dtc_documents where user_id=$1 and id=$2', [users[6], proof.documentId])
      const replay = await confirm(users[6], input, null)
      assert.equal(replay.documentId, proof.documentId); assert.equal(replay.replayed, true)
      const state = await saved(users[6]); assert.equal(state['public.dtc_documents'].length, 0); assert.equal(state[receiptTable].length, 1)
      assert.ok(await receipt(users[6], input))
    })
    await run('Editing an existing effect cannot be overwritten by replay', async () => {
      const input = command(), proof = await confirm(users[7], input)
      const changed = JSON.stringify({ ...a2ActionStoredContent(input), nextAction: 'Intención posterior guardada por la persona.' })
      await db.query('update public.dtc_documents set content=$3 where user_id=$1 and id=$2', [users[7], proof.documentId, changed])
      await confirm(users[7], input, null)
      assert.equal((await assertOne(users[7]))['public.dtc_documents'][0].content, changed)
    })
    await run('A refreshed exact adjustment reference allows a subsequent different confirmation', async () => {
      const current = await contextFor(users[0]), input = command({ expectedContextHash: current.hash })
      await confirm(users[0], input, current)
      const state = await saved(users[0]); assert.equal(state['public.dtc_documents'].length, 2); assert.equal(state[receiptTable].length, 2)
    })
    await run('Observed legacy insertion, mutation or deletion invalidates a stale adjustment snapshot', async () => {
      const current = await contextFor(users[0]), input = command({ expectedContextHash: current.hash })
      const before = await saved(users[0]), latest = current.projection.sources.find(source => source.id === 'adjustment')
      await db.query('update public.dtc_documents set content=$3 where user_id=$1 and id=$2', [users[0], latest.recordId,
        JSON.stringify({ ...a2ActionStoredContent(input), nextAction: 'Cambio observado antes de confirmar.' })])
      await assert.rejects(confirm(users[0], input, current), dbError('P0001', 'a2_action_context_changed'))
      assert.equal((await saved(users[0]))[receiptTable].length, before[receiptTable].length)
      await db.query('delete from public.dtc_documents where user_id=$1 and id=$2', [users[0], latest.recordId])
      await assert.rejects(confirm(users[0], input, current), dbError('P0001', 'a2_action_context_changed'))
      await assert.rejects(confirm(users[0], command(), snapshot()), dbError('P0001', 'a2_action_context_changed'))
    })
    await run('Source fingerprint mismatch, unavailable/old/future snapshots cannot create an effect', async () => {
      const input = command()
      await assert.rejects(confirm(users[8], { ...input, expectedContextHash: 'f'.repeat(64) }), dbError('P0001', 'a2_action_context_changed'))
      for (const value of [null, snapshot(baseProjection, { available: false }),
        snapshot(baseProjection, { capturedAt: new Date(Date.now() - 600_000).toISOString() }),
        snapshot(baseProjection, { capturedAt: new Date(Date.now() + 120_000).toISOString() })]) {
        await assert.rejects(confirm(users[8], command(), value), dbError('55000', 'a2_action_context_unavailable'))
      }
      await assertEmpty(users[8])
    })
    await run('An adjustment may target only the pending practice day in the server projection', async () => {
      for (const change of [
        { next: { ...baseProjection.next, href: '/despega/a2/dia-4' } },
        { completedDays: [1, 2, 3] }, { checkpointPending: true },
      ]) {
        const current = snapshot({ ...baseProjection, ...change }), input = command({ expectedContextHash: current.hash })
        await assert.rejects(confirm(users[8], input, current), dbError('P0001', 'a2_action_day_changed'))
      }
      await assertEmpty(users[8])
    })
    await run('Santiago dates include today/day+30 but reject yesterday/day+31 independently of SQL session timezone', async () => {
      const today = (await db.query("select to_char(clock_timestamp() at time zone 'America/Santiago','YYYY-MM-DD') as today")).rows[0].today
      for (const date of [plusDays(today, -1), plusDays(today, 31)]) {
        await assert.rejects(confirm(users[9], command({ adjustment: adjustment({ reviewDate: date }) })), dbError('P0001', 'a2_action_review_date_invalid'))
      }
      for (const [index, date] of [today, plusDays(today, 30)].entries()) {
        await confirm(users[9 + index], command({ adjustment: adjustment({ reviewDate: date }) }), snapshot(), { settings: { TimeZone: 'Pacific/Kiritimati' } })
      }
    })
    await run('Strict payload, calendar, UTF-16 length and storable-text boundaries reject malformed writes', async () => {
      const valid = command(), malformed = [null, [], {}, { ...valid, userId: users[0] }, { ...valid, tool: 'execute' },
        { ...valid, requestId: 'invalid' }, { ...valid, dayNumber: 0 }, { ...valid, dayNumber: 91 }, { ...valid, dayNumber: 1.5 },
        { ...valid, adjustment: { ...valid.adjustment, reviewDate: '2026-02-30' } },
        { ...valid, adjustment: { ...valid.adjustment, retainedWork: ' ' } },
        { ...valid, adjustment: { ...valid.adjustment, nextAction: ' x ' } },
        { ...valid, adjustment: { ...valid.adjustment, retainedWork: '😀'.repeat(2001) } },
        { ...valid, adjustment: { ...valid.adjustment, nextAction: 'x'.repeat(2001) } },
        { ...valid, adjustment: { ...valid.adjustment, draft: {} } },
      ]
      for (const input of malformed) await assert.rejects(confirm(users[11], input), dbError('22023', 'a2_action_invalid_payload'))
      await assertEmpty(users[11])
      await confirm(users[11], command({ adjustment: adjustment({ retainedWork: '😀'.repeat(2000) }) }))
    })
    await run('Missing pilot admission cannot be grandfathered by either RPC', async () => {
      const userId = users.at(-1), input = command()
      await assert.rejects(receipt(userId, input), dbError('42501', 'a2_plan_access_required'))
      await assert.rejects(confirm(userId, input), dbError('42501', 'a2_plan_access_required')); await assertEmpty(userId)
      assert.equal((await db.query('select id from public.pilot_memberships where user_id=$1', [userId])).rowCount, 0)
    })
    await run('Revoked pilot admission also denies lookup/replay of a previously committed action', async () => {
      const userId = users[12], input = command(); await confirm(userId, input)
      await db.query('delete from public.pilot_memberships where user_id=$1', [userId])
      await assert.rejects(receipt(userId, input), dbError('42501', 'a2_plan_access_required'))
      await assert.rejects(confirm(userId, input, null), dbError('42501', 'a2_plan_access_required')); await assertOne(userId)
    })
    await run('The same request UUID is private to each owner and produces separate effect ids', async () => {
      const input = command(), first = await confirm(users[13], input), second = await confirm(users[14], input)
      assert.notEqual(first.documentId, second.documentId); await assertOne(users[13]); await assertOne(users[14])
      assert.equal((await receipt(users[13], input)).documentId, first.documentId)
      assert.equal((await receipt(users[14], input)).documentId, second.documentId)
    })
    await run('Actions preserve all seeded canonical milestones, completed days, XP and browser fixtures', async () => {
      assert.deepEqual(await records(canonicalTables, users), ownCanonicalBefore); await preserveBrowser()
    })
    passed = true
  } finally {
    await Promise.allSettled(connections.map(client => client.end()))
    try {
      if (triggersInstalled) await db.query(`drop trigger zz_a2_action_sql_document on public.dtc_documents;
        drop trigger zz_a2_action_sql_receipt on ${receiptTable}; drop function dtc_private.a2_action_sql_fault();`)
      if (createdUsers.length) {
        await db.query('begin')
        await db.query('delete from public.dtc_documents where user_id=any($1::uuid[])', [createdUsers])
        for (const table of canonicalTables) await db.query(`delete from ${table} where user_id::text=any($1::text[])`, [createdUsers])
        await db.query('delete from public.pilot_memberships where user_id=any($1::uuid[])', [createdUsers])
        await db.query('delete from auth.users where id=any($1::uuid[])', [createdUsers])
        await db.query('commit')
      }
      await preserveBrowser()
      assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])', [users])).rowCount, 0)
      assert.equal((await db.query(`select user_id from ${receiptTable} where user_id=any($1::uuid[])`, [users])).rowCount, 0)
      cleanupPassed = true
    } finally {
      writeFileSync(join(evidence, 'a2-action-sql.json'), JSON.stringify({ scope: 'disposable-local-postgresql-a2-action', migration,
        cases, syntheticOwnersCreated: createdUsers.length, syntheticOwnersRemoved: cleanupPassed,
        browserOwnersUnchanged: cleanupPassed, context: 'Dated server projection; action writes serialize their consumed adjustment, without a global legacy/source fence.',
        remoteOperations: 0, verdict: passed && cleanupPassed ? 'PASS' : 'FAIL' }, null, 2))
      await db.end()
    }
  }
}
main().catch(error => { console.error('AG04 SQL failed:', safeFailure(error, secrets)); process.exitCode = 1 })
