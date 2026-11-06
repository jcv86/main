/**
 * DTC-AG-03: actual PostgreSQL 17 owner/RLS/CAS/receipt transactions.
 * Run after a2-plan-seed in the existing, unlinked disposable Supabase lab.
 * This script never reads a hosted endpoint or writes a browser fixture owner.
 */
import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { a2PlanCommandSchema, a2PlanContentSchema, a2PlanContextSnapshotSchema,
  a2PlanReceiptSchema, a2PlanToday } from '../lib/a2/plan-contract.ts'
import { closureLab, safeFailure } from './a1-browser-qa/closure-lab.mjs'

const migration = '20261106201731_a2_reviewed_plan_atomic.sql'
const secrets = []
const users = Array.from({ length: 20 }, (_, index) => `a2030003-0000-4000-8000-${String(index + 1).padStart(12, '0')}`)
const tables = ['public.a2_reviewed_plans', 'dtc_private.a2_plan_revisions', 'dtc_private.a2_plan_receipts']
const canonicalTables = ['public.despega_user_profiles', 'public.despega_journey_state',
  'public.a1_cerebral_assessment', 'public.canon_conozcamonos_1_responses', 'public.canon_conozcamonos_2_responses',
  'public.a2_user_task_completions', 'public.a3_user_progress', 'public.a3_route_progression',
  'public.user_gamification_profile', 'public.user_dtc_balance']
const projection = {
  practicePath: 'profesional', activeHorizon: 30,
  next: { href: '/despega/a2/dia-1', label: 'Practicar', title: 'Primera práctica', description: 'Un paso sintético.' },
  completedDays: [], checkpointPending: false, radarAvailable: false, objective: null, adjustment: null,
  sources: [{ id: 'journey', status: 'available', label: 'Recorrido guardado' },
    { id: 'objective', status: 'missing', label: 'Objetivo no guardado' },
    { id: 'adjustment', status: 'missing', label: 'Ajuste no guardado' }], limitations: [],
}
const hash = createHash('sha256').update(JSON.stringify(projection)).digest('hex')
const snapshot = (overrides = {}) => a2PlanContextSnapshotSchema.parse({ version: 'dtc-a2-plan-context.v1',
  capturedAt: new Date().toISOString(), available: true, hash, projection, ...overrides })
const plusDays = (date, count) => {
  const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + count)
  return value.toISOString().slice(0, 10)
}
const content = (overrides = {}) => a2PlanContentSchema.parse({ version: 'dtc-a2-plan.v1',
  purpose: 'Organizar una práctica sintética', constraints: 'Veinte minutos disponibles',
  reviewDate: plusDays(a2PlanToday(), 7),
  steps: [{ id: 'a2030100-0000-4000-8000-000000000001', title: 'Preparar ejemplo',
    action: 'Escribir un ejemplo breve y conservarlo.', status: 'pending' }], ...overrides })
const command = (operation = 'save', expectedRevision = 0, overrides = {}) => a2PlanCommandSchema.parse({
  version: 'dtc-a2-plan-command.v1', requestId: randomUUID(), operation, expectedRevision,
  ...(operation === 'save' ? { content: content(), expectedContextHash: hash } : {}),
  ...(operation === 'resume' ? { expectedContextHash: hash } : {}), ...overrides,
})
const dbError = (code, message) => error => {
  assert.equal(error.code, code)
  if (message) assert.equal(error.message, message)
  return true
}
async function inRole(db, role, actor, action, settings = {}) {
  assert.ok(['service_role', 'authenticated', 'anon'].includes(role))
  await db.query('begin')
  try {
    await db.query(`set local role ${role}`)
    await db.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ role, ...(actor ? { sub: actor } : {}) })])
    for (const [name, value] of Object.entries(settings)) {
      assert.ok(['dtc.a2_plan_fail_at', 'dtc.a2_plan_gate', 'TimeZone'].includes(name))
      await db.query('select set_config($1,$2,true)', [name, value])
    }
    const result = await action(db)
    await db.query('commit')
    return result
  } catch (error) { await db.query('rollback'); throw error }
}

async function main() {
  const { root, status, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'a2-plan-prepared.json')), 'Prepare the actual plan surface first')
  const fixtures = JSON.parse(readFileSync(join(root, 'a2-plan-fixtures.private.json'), 'utf8'))
  assert.equal(fixtures.scope, 'disposable-local-a2-plan')
  assert.equal(fixtures.users.length, 3)
  for (const user of fixtures.users) {
    assert.ok(['a2-plan-desktop', 'a2-plan-mobile', 'a2-plan-locked'].includes(user.label))
    assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
  }
  secrets.push(status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY, fixtures.password)
  const db = new Client({ connectionString: status.DB_URL })
  await db.connect()
  const connections = [], createdUsers = [], cases = []
  let triggersInstalled = false, passed = false, cleanupPassed = false
  const connect = async () => {
    const client = new Client({ connectionString: status.DB_URL }); await client.connect()
    connections.push(client); return client
  }
  const mutate = async (userId, input = command(), context = snapshot(), options = {}) => {
    const result = await inRole(options.db || db, 'service_role', null, async client =>
      (await client.query('select public.mutate_a2_reviewed_plan($1,$2,$3) as result',
        [userId, JSON.stringify(input), context === null ? null : JSON.stringify(context)])).rows[0].result, options.settings)
    assert.equal(a2PlanReceiptSchema.safeParse(result).success, true, 'SQL receipt must satisfy the real client contract')
    return result
  }
  const receipt = async (userId, input, options = {}) => inRole(options.db || db, 'service_role', null,
    async client => (await client.query('select public.read_a2_plan_receipt($1,$2) as result',
      [userId, JSON.stringify(input)])).rows[0].result)
  const saved = async userId => {
    const result = {}
    for (const table of tables) result[table] = (await db.query(
      `select to_jsonb(t) as row from ${table} t where user_id=$1 order by to_jsonb(t)::text`, [userId])).rows.map(row => row.row)
    return result
  }
  const canonical = async ownerIds => {
    const result = {}
    for (const table of canonicalTables) result[table] = (await db.query(
      `select to_jsonb(t) as row from ${table} t where user_id::text=any($1::text[]) order by to_jsonb(t)::text`, [ownerIds])).rows.map(row => row.row)
    return result
  }
  const assertOneRevision = async (userId, revision, receiptCount = revision) => {
    const state = await saved(userId)
    assert.equal(state[tables[0]].length, 1)
    assert.equal(state[tables[0]][0].revision, revision)
    assert.equal(state[tables[2]].length, receiptCount)
    return state
  }
  const assertEmpty = async userId => {
    for (const rows of Object.values(await saved(userId))) assert.equal(rows.length, 0)
  }
  const run = async (name, action) => {
    try { await action(); cases.push({ name, verdict: 'PASS' }); console.log(`PASS ${name}`) }
    catch (error) {
      cases.push({ name, verdict: 'FAIL', error: safeFailure(error, secrets) })
      error.message = `${name}: ${error.message}`; throw error
    }
  }
  let browserBefore = null
  let ownCanonicalBefore
  const ensureBrowserUntouched = async () => {
    assert.deepEqual(await canonical(fixtures.users.map(user => user.id)), browserBefore)
    for (const user of fixtures.users) {
      assert.equal((await db.query('select id from auth.users where id=$1 and email=$2', [user.id,user.email])).rowCount, 1)
      await assertEmpty(user.id)
    }
  }
  async function blocked(pid, blocker) {
    for (let attempt = 0; attempt < 150; attempt++) {
      const result = await db.query('select $2::integer = any(pg_blocking_pids($1::integer)) as blocked', [pid, blocker])
      if (result.rows[0].blocked) return
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    assert.fail('Expected actual PostgreSQL lock contention was not observed')
  }
  async function race(userId, first, second, independentOwner = null) {
    const control = await connect(), a = await connect(), b = await connect()
    const controllerPid = (await control.query('select pg_backend_pid() as pid')).rows[0].pid
    const aPid = (await a.query('select pg_backend_pid() as pid')).rows[0].pid
    const bPid = (await b.query('select pg_backend_pid() as pid')).rows[0].pid
    const settle = promise => promise.then(value => ({ value }), error => ({ error }))
    let one, two
    await control.query('select pg_advisory_lock(20261106,203)')
    try {
      one = settle(mutate(userId, first, snapshot(), { db: a, settings: { 'dtc.a2_plan_gate': 'on' } }))
      await blocked(aPid, controllerPid)
      two = settle(mutate(userId, second, snapshot(), { db: b }))
      await blocked(bPid, aPid)
      if (independentOwner) {
        const independent = await mutate(independentOwner, command(), snapshot())
        assert.equal(independent.revision, 1, 'Another owner must not share this owner lock')
      }
    } finally {
      await control.query('select pg_advisory_unlock(20261106,203)')
    }
    return Promise.all([one, two])
  }

  try {
    browserBefore = await canonical(fixtures.users.map(user => user.id))
    assert.ok(Number((await db.query('show server_version_num')).rows[0].server_version_num) >= 170000)
    assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])', [users])).rowCount, 0)
    await ensureBrowserUntouched()
    await run('service-only invoker functions, explicit grants and forced owner RLS', async () => {
      const signatures = ['public.read_a2_plan_receipt(uuid,jsonb)', 'public.mutate_a2_reviewed_plan(uuid,jsonb,jsonb)']
      for (const signature of signatures) {
        const fn = (await db.query(`select p.prosecdef,p.proconfig,
          has_function_privilege('anon',p.oid,'execute') as anon,
          has_function_privilege('authenticated',p.oid,'execute') as authenticated,
          has_function_privilege('service_role',p.oid,'execute') as service
          from pg_proc p where p.oid=$1::regprocedure`, [signature])).rows[0]
        assert.equal(fn.prosecdef, false); assert.ok(fn.proconfig.includes('search_path=""'))
        assert.equal(fn.anon, false); assert.equal(fn.authenticated, false); assert.equal(fn.service, true)
      }
      const rights = (await db.query(`select
        has_table_privilege('authenticated','public.a2_reviewed_plans','select') as owner_select,
        has_table_privilege('authenticated','public.a2_reviewed_plans','insert,update,delete') as client_write,
        has_table_privilege('anon','public.a2_reviewed_plans','select') as anon_select,
        has_schema_privilege('authenticated','dtc_private','usage') as private_usage,
        has_table_privilege('service_role','dtc_private.a2_plan_revisions','update') as history_update,
        has_table_privilege('service_role','dtc_private.a2_plan_receipts','update,delete') as receipt_mutation`)).rows[0]
      assert.deepEqual(rights, { owner_select: true, client_write: false, anon_select: false,
        private_usage: false, history_update: false, receipt_mutation: false })
      const rls = await db.query('select relrowsecurity,relforcerowsecurity from pg_class where oid=any($1::regclass[])', [tables])
      assert.equal(rls.rowCount, 3)
      assert.ok(rls.rows.every(row => row.relrowsecurity && row.relforcerowsecurity))
      const policies = await db.query("select cmd,roles::text,qual from pg_policies where tablename='a2_reviewed_plans' and schemaname='public'")
      assert.equal(policies.rowCount, 1); assert.equal(policies.rows[0].cmd, 'SELECT')
      assert.equal(policies.rows[0].roles, '{authenticated}')
      assert.ok(policies.rows[0].qual.includes('auth.uid()') && policies.rows[0].qual.includes('user_id'))
    })
    for (const [index, userId] of users.entries()) {
      await db.query(`insert into auth.users(id,aud,role,email,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
        values($1,'authenticated','authenticated',$2,now(),'{}','{}',now(),now())`, [userId,`dtc-qa-a2-plan-sql-${index + 1}@example.invalid`])
      createdUsers.push(userId)
      if (index !== users.length - 1) await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered')", [userId])
    }
    await db.query('insert into public.despega_user_profiles(user_id,a2_sprint_progress) values($1,3)', [users[0]])
    await db.query('select public.ensure_despega_journey_state($1)', [users[0]])
    await db.query('insert into public.a3_user_progress(user_id,total_xp) values($1,97)', [users[0]])
    await db.query('insert into public.a2_user_task_completions(user_id,day,completed_at) values($1,1,now())', [users[0]])
    ownCanonicalBefore = await canonical(users)
    assert.equal((await db.query("select to_regprocedure('dtc_private.a2_plan_sql_fault()') as name")).rows[0].name, null)
    await db.query(`create function dtc_private.a2_plan_sql_fault() returns trigger language plpgsql
      security invoker set search_path='' as $$
      declare v_user_id uuid;
      begin
        if tg_op='DELETE' then v_user_id:=old.user_id; else v_user_id:=new.user_id; end if;
        if v_user_id::text not like 'a2030003-0000-4000-8000-%' then
          if tg_op='DELETE' then return old; else return new; end if;
        end if;
        if tg_table_name='a2_reviewed_plans' and current_setting('dtc.a2_plan_gate',true)='on' then
          perform pg_advisory_xact_lock(20261106,203);
        end if;
        if (tg_table_name='a2_reviewed_plans' and current_setting('dtc.a2_plan_fail_at',true)='current')
          or (tg_table_name='a2_plan_revisions' and tg_op='INSERT' and current_setting('dtc.a2_plan_fail_at',true)='history')
          or (tg_table_name='a2_plan_revisions' and tg_op='DELETE' and current_setting('dtc.a2_plan_fail_at',true)='history_delete')
          or (tg_table_name='a2_plan_receipts' and current_setting('dtc.a2_plan_fail_at',true)='receipt') then
          raise exception using errcode='P0001',message='SYNTHETIC_A2_PLAN_WRITE_FAILURE';
        end if;
        if tg_op='DELETE' then return old; else return new; end if;
      end; $$;
      revoke all on function dtc_private.a2_plan_sql_fault() from public,anon,authenticated;
      grant execute on function dtc_private.a2_plan_sql_fault() to service_role;
      create trigger zz_a2_plan_sql_current before insert or update on public.a2_reviewed_plans
        for each row execute function dtc_private.a2_plan_sql_fault();
      create trigger zz_a2_plan_sql_history before insert or delete on dtc_private.a2_plan_revisions
        for each row execute function dtc_private.a2_plan_sql_fault();
      create trigger zz_a2_plan_sql_receipt before insert on dtc_private.a2_plan_receipts
        for each row execute function dtc_private.a2_plan_sql_fault();`)
    triggersInstalled = true

    await run('new plan commits one stable slot, history and metadata receipt with one timestamp', async () => {
      const input = command(), result = await mutate(users[0], input, snapshot(), { settings: { TimeZone: 'Pacific/Honolulu' } })
      assert.equal(result.replayed, false); assert.equal(result.revision, 1); assert.equal(result.state, 'active')
      const state = await assertOneRevision(users[0], 1), plan = state[tables[0]][0]
      assert.equal(state[tables[1]].length, 1)
      assert.deepEqual(plan.content, input.content)
      assert.equal(plan.plan_id, result.planId)
      assert.equal(plan.review_date, input.content.reviewDate)
      for (const value of [plan.reviewed_at,plan.created_at,plan.updated_at,state[tables[1]][0].committed_at]) {
        assert.equal(Date.parse(value), Date.parse(result.committedAt))
      }
      assert.deepEqual(Object.keys(state[tables[2]][0]).sort(),
        ['user_id','request_id','command_hash','plan_id','result_revision','result_status','committed_at'].sort())
      const before = await saved(users[0])
      const replay = await mutate(users[0], input, null)
      assert.equal(replay.replayed, true); assert.equal(replay.planId, result.planId)
      assert.deepEqual(await saved(users[0]), before)
      assert.equal((await receipt(users[0], input)).replayed, true)
    })
    await run('real owner SELECT isolation, no anonymous read and denied direct client mutations/RPCs', async () => {
      const own = await inRole(db, 'authenticated', users[0], client => client.query('select user_id from public.a2_reviewed_plans'))
      assert.deepEqual(own.rows, [{ user_id: users[0] }])
      const other = await inRole(db, 'authenticated', users[1], client => client.query('select user_id from public.a2_reviewed_plans'))
      assert.equal(other.rowCount, 0)
      for (const role of ['authenticated', 'anon']) {
        for (const sql of ['insert into public.a2_reviewed_plans default values', 'update public.a2_reviewed_plans set status=\'cancelled\'',
          'delete from public.a2_reviewed_plans', 'select * from dtc_private.a2_plan_receipts',
          'select * from dtc_private.a2_plan_revisions', 'select public.read_a2_plan_receipt($1,$2)',
          'select public.mutate_a2_reviewed_plan($1,$2,null)']) {
          await assert.rejects(inRole(db, role, users[0], client => client.query(sql,
            sql.includes('$1') ? [users[0],JSON.stringify(command())] : [])), dbError('42501'))
        }
      }
      await assert.rejects(inRole(db, 'anon', null, client => client.query('select * from public.a2_reviewed_plans')), dbError('42501'))
      for (const sql of ['update dtc_private.a2_plan_revisions set status=\'cancelled\'',
        'delete from dtc_private.a2_plan_receipts']) {
        await assert.rejects(inRole(db, 'service_role', null, client => client.query(sql)), dbError('42501'))
      }
      await assert.rejects(inRole(db, 'service_role', null, client => client.query(
        'update public.a2_reviewed_plans set content=null where user_id=$1', [users[0]])), dbError('23514'))
    })
    await run('same request ID is bound to owner and stable command; reordered JSON replays', async () => {
      const input = command(), first = await mutate(users[1], input)
      const reordered = Object.fromEntries(Object.entries(input).reverse())
      assert.equal((await mutate(users[1], reordered, { unavailable: true })).replayed, true)
      const secondOwner = await mutate(users[2], input)
      assert.notEqual(secondOwner.planId, first.planId)
      const conflicting = { ...input, content: { ...input.content, purpose: 'Otro propósito' } }
      await assert.rejects(receipt(users[1], conflicting), dbError('P0001', 'a2_plan_request_conflict'))
      await assert.rejects(mutate(users[1], conflicting), dbError('P0001', 'a2_plan_request_conflict'))
      assert.equal(await receipt(users[3], input), null)
    })
    await run('stale CAS preserves both saved history and new unsaved command receipt absence', async () => {
      const before = await saved(users[0]), stale = command('save', 0)
      await assert.rejects(mutate(users[0], stale), dbError('P0001', 'a2_plan_conflict'))
      assert.equal(await receipt(users[0], stale), null)
      assert.deepEqual(await saved(users[0]), before)
    })
    await run('two real concurrent writers serialize per owner, one CAS winner, another owner stays independent', async () => {
      const [a,b] = await race(users[3], command(), command(), users[4])
      assert.ok(a.value); assert.equal(a.value.revision, 1)
      assert.ok(b.error); dbError('P0001','a2_plan_conflict')(b.error)
      await assertOneRevision(users[3], 1)
    })
    await run('two real concurrent identical commands commit once and return a replay', async () => {
      const input = command(), [a,b] = await race(users[5], input, input)
      assert.ok(a.value && b.value)
      assert.equal(a.value.replayed, false); assert.equal(b.value.replayed, true)
      assert.equal(a.value.planId, b.value.planId); assert.equal(a.value.revision, b.value.revision)
      await assertOneRevision(users[5], 1)
    })
    await run('pause/resume preserve confirmed content and reject invalid terminal transitions', async () => {
      const userId = users[6], first = await mutate(userId), initial = (await saved(userId))[tables[0]][0]
      const paused = await mutate(userId, command('pause', 1), null)
      assert.equal(paused.state, 'paused')
      await assert.rejects(mutate(userId, command('pause', 2), null), dbError('P0001','a2_plan_transition_invalid'))
      const resumed = await mutate(userId, command('resume', 2), snapshot())
      assert.equal(resumed.state, 'active')
      const latest = (await saved(userId))[tables[0]][0]
      assert.equal(latest.plan_id, first.planId); assert.equal(latest.reviewed_at, initial.reviewed_at)
      assert.deepEqual(latest.content, initial.content); assert.deepEqual(latest.context_snapshot, initial.context_snapshot)
      assert.equal((await mutate(userId, command('cancel', 3), null)).state, 'cancelled')
      for (const op of ['pause','resume','complete','cancel']) {
        await assert.rejects(mutate(userId, command(op, 4)), dbError('P0001','a2_plan_transition_invalid'))
      }
      assert.equal((await mutate(userId, command('save', 4))).state, 'active')
    })
    await run('completion requires declared finished steps and never modifies canonical completion or XP', async () => {
      const userId = users[0]
      await assert.rejects(mutate(userId, command('complete', 1), null), dbError('P0001','a2_plan_transition_invalid'))
      const allSkipped = content({ steps: content().steps.map(step => ({ ...step, status: 'skipped' })) })
      await mutate(userId, command('save', 1, { content: allSkipped }))
      await assert.rejects(mutate(userId, command('complete', 2), null), dbError('P0001','a2_plan_transition_invalid'))
      const declared = content({ steps: content().steps.map(step => ({ ...step, status: 'reported_done', note: 'Declaración sintética' })) })
      await mutate(userId, command('save', 2, { content: declared }))
      assert.equal((await mutate(userId, command('complete', 3), null)).state, 'completed')
      assert.deepEqual(await canonical(users), ownCanonicalBefore)
    })
    for (const [index,target] of ['current','history','receipt'].entries()) {
      await run(`real failure at ${target} rolls back current/history/receipt and same command can retry`, async () => {
        const userId = users[7 + index], input = command()
        await assert.rejects(mutate(userId, input, snapshot(), { settings: { 'dtc.a2_plan_fail_at': target } }),
          dbError('P0001','SYNTHETIC_A2_PLAN_WRITE_FAILURE'))
        await assertEmpty(userId); assert.equal(await receipt(userId, input), null)
        assert.equal((await mutate(userId, input)).revision, 1)
      })
    }
    await run('failed deletion restores content and complete history at purge and receipt boundaries', async () => {
      const userId = users[10]
      await mutate(userId); await mutate(userId, command('save', 1))
      const before = await saved(userId), input = command('delete', 2)
      for (const target of ['history_delete','receipt']) {
        await assert.rejects(mutate(userId, input, null, { settings: { 'dtc.a2_plan_fail_at': target } }),
          dbError('P0001','SYNTHETIC_A2_PLAN_WRITE_FAILURE'))
        assert.deepEqual(await saved(userId), before)
        assert.equal(await receipt(userId, input), null)
      }
    })
    await run('delete purges all snapshots, old lost-ACK retries never resurrect, explicit fresh CAS may create again', async () => {
      const userId = users[11], original = command(), first = await mutate(userId, original)
      await mutate(userId, command('save', 1))
      const deletion = command('delete', 2), removed = await mutate(userId, deletion, null)
      assert.equal(removed.state, 'deleted'); assert.equal(removed.revision, 3)
      const before = await assertOneRevision(userId, 3), tombstone = before[tables[0]][0]
      assert.equal(before[tables[1]].length, 0)
      for (const field of ['content','context_snapshot','review_date']) assert.equal(tombstone[field], null)
      assert.ok(tombstone.deleted_at)
      assert.equal((await mutate(userId, original, null)).revision, 1)
      assert.equal((await receipt(userId, original)).revision, 1)
      assert.equal((await mutate(userId, deletion, null)).replayed, true)
      assert.deepEqual(await saved(userId), before)
      await assert.rejects(mutate(userId, command('save', 0)), dbError('P0001','a2_plan_conflict'))
      await assert.rejects(mutate(userId, command('delete', 3), null), dbError('P0001','a2_plan_transition_invalid'))
      const revived = await mutate(userId, command('save', 3))
      assert.equal(revived.planId, first.planId); assert.equal(revived.revision, 4)
      assert.equal((await saved(userId))[tables[1]].length, 1)
      assert.equal((await saved(userId))[tables[0]][0].deleted_at, null)
    })
    await run('source mismatch, unavailable or stale snapshot cannot create a plan', async () => {
      const userId = users[12], input = command()
      await assert.rejects(mutate(userId, input, null), dbError('55000','a2_plan_context_unavailable'))
      await assert.rejects(mutate(userId, input, snapshot({ available: false })), dbError('55000','a2_plan_context_unavailable'))
      await assert.rejects(mutate(userId, input, snapshot({ hash: 'f'.repeat(64) })), dbError('P0001','a2_plan_context_changed'))
      for (const capturedAt of [new Date(Date.now()-360_000).toISOString(),new Date(Date.now()+120_000).toISOString()]) {
        await assert.rejects(mutate(userId, input, snapshot({ capturedAt })), dbError('55000','a2_plan_context_unavailable'))
      }
      await assertEmpty(userId)
    })
    await run('resume rejects a changed context even when the new command hash matches that changed context', async () => {
      const userId = users[12]
      await mutate(userId); await mutate(userId, command('pause', 1), null)
      const before = await saved(userId), changed = 'e'.repeat(64)
      await assert.rejects(mutate(userId, command('resume', 2, { expectedContextHash: changed }), snapshot({ hash: changed })),
        dbError('P0001','a2_plan_context_changed'))
      assert.deepEqual(await saved(userId), before)
    })
    await run('Santiago today and day+30 are inclusive; past/day+31 and aged resume are refused', async () => {
      const today = (await db.query("select to_char(clock_timestamp() at time zone 'America/Santiago','YYYY-MM-DD') as today")).rows[0].today
      const userId = users[13]
      for (const date of [plusDays(today,-1),plusDays(today,31)]) {
        await assert.rejects(mutate(userId, command('save', 0, { content: content({ reviewDate: date }) })), dbError('P0001','a2_plan_expired'))
      }
      await mutate(userId, command('save', 0, { content: content({ reviewDate: today }) }))
      await mutate(userId, command('save', 1, { content: content({ reviewDate: plusDays(today,30) }) }))
      await mutate(userId, command('pause', 2), null)
      // A synthetic backdated persisted row represents a later visit. Production
      // time is not mocked; the actual RPC compares against its current DB clock.
      await db.query(`update public.a2_reviewed_plans set review_date=$2,
        content=jsonb_set(content,'{reviewDate}',to_jsonb($2::text)) where user_id=$1`, [userId,plusDays(today,-1)])
      await assert.rejects(mutate(userId, command('resume', 3)), dbError('P0001','a2_plan_expired'))
    })
    await run('SQL validates actual calendar dates, strict fields, bounded strings and unique step IDs', async () => {
      const valid = command(), malformed = [null,[],{},
        { ...valid, version:'v0' }, { ...valid, requestId:'not-uuid' }, { ...valid, expectedRevision:-1 },
        { ...valid, expectedRevision:1.5 }, { ...valid, expectedRevision:2147483648 }, { ...valid, userId:users[0] },
        { ...valid, expectedContextHash:'F'.repeat(64) }, { ...valid, content:{ ...valid.content, reviewDate:'2026-02-30' } },
        { ...valid, content:{ ...valid.content, purpose:'x'.repeat(501) } },
        { ...valid, content:{ ...valid.content, purpose:'😀'.repeat(251) } },
        { ...valid, content:{ ...valid.content, constraints:'x'.repeat(1001) } },
        { ...valid, content:{ ...valid.content, steps:[] } },
        { ...valid, content:{ ...valid.content, steps:[valid.content.steps[0],valid.content.steps[0]] } },
        { ...valid, content:{ ...valid.content, steps:[{ ...valid.content.steps[0], href:'/admin' }] } },
        { ...valid, content:{ ...valid.content, steps:[{ ...valid.content.steps[0], status:'verified' }] } },
        { ...command('pause', 0), content:valid.content }, { ...command('resume',0), expectedContextHash:undefined },
      ]
      for (const input of malformed) {
        await assert.rejects(mutate(users[14], input), dbError('22023','a2_plan_invalid_payload'))
      }
      await assertEmpty(users[14])
      const parsed = content({ purpose:'😀'.repeat(250) })
      assert.equal((await mutate(users[14], command('save', 0, { content: parsed }))).revision, 1)
    })
    await run('compact JSON byte accounting agrees with the actual TypeScript contract at the 12000-byte edge', async () => {
      const sample = { ...content(), purpose:'界'.repeat(500), constraints:'界'.repeat(1000),
        steps:Array.from({ length:5 }, (_,index) => ({ id:randomUUID(), title:'界'.repeat(120), action:'界'.repeat(400), status:'pending', note:'' })) }
      // Tune a legal action up to exactly the byte boundary; ASCII permits each byte.
      let current = Buffer.byteLength(JSON.stringify(sample))
      while (current > 12000) { sample.steps[4].action=sample.steps[4].action.slice(0,-1); current=Buffer.byteLength(JSON.stringify(sample)) }
      sample.steps[4].action += 'x'.repeat(12000-current)
      assert.equal(Buffer.byteLength(JSON.stringify(sample)), 12000)
      assert.equal(a2PlanContentSchema.safeParse(sample).success, true)
      const sqlSize = (await db.query('select dtc_private.a2_plan_json_bytes($1) as bytes', [JSON.stringify(sample)])).rows[0].bytes
      assert.equal(sqlSize, 12000)
      await mutate(users[15], command('save', 0, { content: sample }))
      const oversized = { ...sample, constraints:sample.constraints, steps:sample.steps.map((step,index) => index===4?{...step,action:step.action+'x'}:step) }
      assert.equal(a2PlanContentSchema.safeParse(oversized).success, false)
      await assert.rejects(mutate(users[16], { ...command(),content:oversized }), dbError('22023','a2_plan_invalid_payload'))
    })
    await run('pilot admission is checked inside both RPCs and receipt lookup never creates admission', async () => {
      const userId = users.at(-1), input = command()
      await assert.rejects(receipt(userId, input), dbError('42501','a2_plan_access_required'))
      await assert.rejects(mutate(userId, input), dbError('42501','a2_plan_access_required'))
      await assertEmpty(userId)
      assert.equal((await db.query('select id from public.pilot_memberships where user_id=$1',[userId])).rowCount, 0)
      const admitted = users[17], savedCommand = command()
      await mutate(admitted,savedCommand)
      await db.query('delete from public.pilot_memberships where user_id=$1',[admitted])
      await assert.rejects(receipt(admitted,savedCommand),dbError('42501','a2_plan_access_required'))
      await assert.rejects(mutate(admitted,savedCommand,null),dbError('42501','a2_plan_access_required'))
      assert.equal((await saved(admitted))[tables[0]][0].revision,1)
    })
    await run('pilot membership remains locked through the plan commit during a real concurrent revocation', async () => {
      const userId=users[18], input=command(), control=await connect(), writer=await connect(), revoker=await connect()
      const controlPid=(await control.query('select pg_backend_pid() as pid')).rows[0].pid
      const writerPid=(await writer.query('select pg_backend_pid() as pid')).rows[0].pid
      const revokerPid=(await revoker.query('select pg_backend_pid() as pid')).rows[0].pid
      const settle=promise=>promise.then(value=>({value}),error=>({error}))
      let write, revoke
      await control.query('select pg_advisory_lock(20261106,203)')
      try {
        write=settle(mutate(userId,input,snapshot(),{db:writer,settings:{'dtc.a2_plan_gate':'on'}}))
        await blocked(writerPid,controlPid)
        revoke=settle(revoker.query('delete from public.pilot_memberships where user_id=$1',[userId]))
        await blocked(revokerPid,writerPid)
      } finally { await control.query('select pg_advisory_unlock(20261106,203)') }
      const [committed,revoked]=await Promise.all([write,revoke])
      assert.ok(committed.value && revoked.value)
      assert.equal(committed.value.revision,1); assert.equal(revoked.value.rowCount,1)
      await assert.rejects(receipt(userId,input),dbError('42501','a2_plan_access_required'))
      await assertOneRevision(userId,1)
    })
    await run('all plan operations preserve seeded canonical milestones, task rows, XP and browser owners', async () => {
      assert.deepEqual(await canonical(users), ownCanonicalBefore)
      await ensureBrowserUntouched()
    })
    passed = true
  } finally {
    await Promise.allSettled(connections.map(client => client.end()))
    try {
      if (triggersInstalled) await db.query(`drop trigger zz_a2_plan_sql_current on public.a2_reviewed_plans;
        drop trigger zz_a2_plan_sql_history on dtc_private.a2_plan_revisions;
        drop trigger zz_a2_plan_sql_receipt on dtc_private.a2_plan_receipts;
        drop function dtc_private.a2_plan_sql_fault();`)
      if (createdUsers.length) {
        await db.query('begin')
        await db.query('delete from public.a2_reviewed_plans where user_id=any($1::uuid[])',[createdUsers])
        for (const table of canonicalTables) await db.query(`delete from ${table} where user_id::text=any($1::text[])`,[createdUsers])
        await db.query('delete from public.pilot_memberships where user_id=any($1::uuid[])',[createdUsers])
        await db.query('delete from auth.users where id=any($1::uuid[])',[createdUsers])
        await db.query('commit')
      }
      await ensureBrowserUntouched()
      assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])',[users])).rowCount,0)
      cleanupPassed=true
    } finally {
      writeFileSync(join(evidence,'a2-plan-sql.json'),JSON.stringify({ scope:'disposable-local-postgresql',migration,
        cases,syntheticOwnersCreated:createdUsers.length,syntheticOwnersRemoved:cleanupPassed,
        browserOwnersUnchanged:cleanupPassed,remoteOperations:0,verdict:passed&&cleanupPassed?'PASS':'FAIL' },null,2))
      await db.end()
    }
  }
  assert.equal(passed&&cleanupPassed,true)
  console.log(`A2 plan SQL: ${cases.length} cases passed; synthetic owners and fault triggers removed.`)
}
main().catch(error=>{ console.error('A2 plan SQL failed:',safeFailure(error,secrets));process.exitCode=1 })
