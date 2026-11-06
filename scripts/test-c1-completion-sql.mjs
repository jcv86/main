/**
 * DTC-C1-02: execute the candidate RPCs against the disposable PostgreSQL lab.
 * Run AFTER c1-seed and BEFORE c1-browser:
 *   node --import tsx scripts/test-c1-completion-sql.mjs
 * No remote endpoint, linked project, existing participant or browser fixture is
 * written. Fault triggers and reserved synthetic owners are removed in finally.
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { CONOZCAMONOS_1_QUESTIONS } from '../lib/canon-conozcamonos-1-questions.ts'
import { restoreC1DraftAnswers, serializeC1DraftAnswers, serializeC1FinalAnswers,
  validateC1CompletionAnswers } from '../lib/c1-responses.ts'
import { closureLab, safeFailure } from './a1-browser-qa/closure-lab.mjs'

const secrets = []
const users = Array.from({ length: 24 }, (_, index) =>
  `c1000002-0000-4000-8000-${String(index + 1).padStart(12, '0')}`)
const baseResponses = Object.fromEntries(CONOZCAMONOS_1_QUESTIONS.map(question =>
  [question.id, question.type === 'text' ? `Respuesta sintética ${question.id}` : [question.options[0]]]))
const raw = (overrides = {}, custom = {}) => serializeC1DraftAnswers({ ...baseResponses, ...overrides }, custom)
const expectedFinal = answers => {
  const { responses, customResponses } = restoreC1DraftAnswers(answers)
  return serializeC1FinalAnswers(responses, customResponses)
}
const failure = (code, message) => error => {
  assert.equal(error.code, code)
  if (message) assert.equal(error.message, message)
  return true
}

async function inRole(db, role, actor, action, settings = {}) {
  assert.ok(['service_role', 'authenticated', 'anon'].includes(role))
  await db.query('begin')
  try {
    await db.query(`set local role ${role}`)
    await db.query("select set_config('request.jwt.claims',$1,true)",
      [JSON.stringify({ role, ...(actor ? { sub: actor } : {}) })])
    for (const [key, value] of Object.entries(settings)) {
      assert.ok(['dtc.c1_fail_at', 'dtc.c1_gate_draft', 'TimeZone'].includes(key))
      await db.query('select set_config($1,$2,true)', [key, value])
    }
    const value = await action(db)
    await db.query('commit')
    return value
  } catch (error) {
    await db.query('rollback')
    throw error
  }
}

async function main() {
  const { root, status, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'c1-prepared.json')), 'Prepare the actual C1 surface first')
  const fixtures = JSON.parse(readFileSync(join(root, 'c1-fixtures.private.json'), 'utf8'))
  assert.equal(fixtures.scope, 'disposable-local-c1')
  assert.equal(fixtures.users.length, 2)
  for (const user of fixtures.users) {
    assert.ok(['auth-invited-desktop', 'auth-invited-mobile'].includes(user.label))
    assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
  }
  secrets.push(status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY, fixtures.password)
  const db = new Client({ connectionString: status.DB_URL })
  await db.connect()
  const connections = [], createdUsers = [], cases = []
  let faultTriggersInstalled = false, passed = false, cleanupPassed = false
  const connect = async () => {
    const client = new Client({ connectionString: status.DB_URL })
    await client.connect()
    connections.push(client)
    return client
  }
  const completed = async (userId, answers = raw(), token = null, options = {}) =>
    inRole(options.db || db, 'service_role', null, async client =>
      (await client.query('select public.complete_c1_atomic($1,$2,$3,$4) as result',
        [userId, options.version ?? 1, JSON.stringify(answers), token])).rows[0].result,
    options.settings)
  const getStatus = async userId => inRole(db, 'service_role', null, async client =>
    (await client.query('select public.get_c1_completion_status($1) as result', [userId])).rows[0].result)
  const draft = async (userId, answers = raw(), closedAt = null) =>
    (await db.query(`insert into public.assessment_drafts
      (user_id,assessment_type,schema_version,current_question,answers,timings,completed_at)
      values($1,'c1',1,6,$2,'[]',$3)
      returning dtc_private.c1_draft_json(assessment_drafts) as result`,
    [userId, JSON.stringify(answers), closedAt])).rows[0].result
  const legacyResponse = async (userId, answers, timestamp = '2026-10-01T12:34:56.123456Z') =>
    (await db.query(`insert into public.canon_conozcamonos_1_responses(user_id,responses,completed_at,completed)
      values($1,$2,$3,true) returning jsonb_build_object('id',id,'completedAt',completed_at) as result`,
    [userId, JSON.stringify(answers), timestamp])).rows[0].result
  const snapshot = async userId => (await db.query(`select jsonb_build_object(
      'responses',coalesce((select jsonb_agg(to_jsonb(r) order by r.id)
        from public.canon_conozcamonos_1_responses r where user_id=$1),'[]'::jsonb),
      'drafts',coalesce((select jsonb_agg(to_jsonb(d) order by d.id)
        from public.assessment_drafts d where user_id=$1),'[]'::jsonb),
      'profiles',coalesce((select jsonb_agg(to_jsonb(p) order by p.user_id)
        from public.despega_user_profiles p where user_id=$1),'[]'::jsonb),
      'receipts',coalesce((select jsonb_agg(to_jsonb(c) order by c.draft_id)
        from dtc_private.c1_completion_receipts c where user_id=$1),'[]'::jsonb)
    ) as result`, [userId])).rows[0].result
  const verifyOneCommit = async (userId, answers, result) => {
    const saved = await snapshot(userId)
    assert.equal(result.state, 'completed')
    assert.equal(saved.responses.length, 1)
    assert.equal(saved.receipts.length, 1)
    assert.equal(saved.drafts.length, 1)
    assert.equal(saved.profiles.length, 1)
    assert.equal(saved.responses[0].id, result.responseId)
    assert.equal(saved.responses[0].user_id, userId)
    assert.deepEqual(saved.responses[0].responses, expectedFinal(answers))
    assert.equal(saved.drafts[0].id, result.draftId)
    assert.deepEqual(saved.drafts[0].answers, answers)
    assert.equal(Date.parse(saved.drafts[0].completed_at), Date.parse(result.completedAt))
    assert.equal(saved.receipts[0].response_id, result.responseId)
    assert.equal(saved.receipts[0].draft_id, result.draftId)
    assert.equal(saved.receipts[0].user_id, userId)
    assert.equal(saved.profiles[0].onboarding_conozcamonos_1_completed, true)
    assert.equal(saved.profiles[0].a4_unlocked, false)
    const utc = await db.query(`select p.onboarding_conozcamonos_1_completed_at = c.completed_at at time zone 'UTC' as matches,
        d.completed_at=c.completed_at and r.completed_at=c.completed_at as same_commit_time
      from public.despega_user_profiles p join dtc_private.c1_completion_receipts c using(user_id)
      join public.assessment_drafts d on d.id=c.draft_id
      join public.canon_conozcamonos_1_responses r on r.id=c.response_id where p.user_id=$1`, [userId])
    assert.deepEqual(utc.rows[0], { matches: true, same_commit_time: true })
    return saved
  }
  const run = async (name, action) => {
    try {
      await action()
      cases.push({ name, verdict: 'PASS' })
      console.log(`PASS ${name}`)
    } catch (error) {
      cases.push({ name, verdict: 'FAIL', error: safeFailure(error, secrets) })
      error.message = `${name}: ${error.message}`
      throw error
    }
  }
  const browserOwnersUnchanged = async () => {
    for (const user of fixtures.users) {
      assert.equal((await db.query('select id from auth.users where id=$1 and email=$2', [user.id, user.email])).rowCount, 1)
      const saved = await snapshot(user.id)
      assert.equal(saved.responses.length, 0, 'SQL tests must leave browser participants uncompleted')
      assert.equal(saved.receipts.length, 0)
      assert.equal(saved.drafts.length, 0)
    }
  }

  try {
    await browserOwnersUnchanged()
    assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])', [users])).rowCount, 0,
      'Never reuse a synthetic owner, even in the disposable lab')
    const postgresVersion = (await db.query('show server_version_num')).rows[0].server_version_num
    assert.ok(Number(postgresVersion) >= 170000, 'Run the real PostgreSQL 17 lab gate')
    await run('service-only invoker, private receipts and the real legacy A4 trigger', async () => {
      const functions = await db.query(`select proname,prosecdef,proconfig from pg_proc
        where oid in ('public.complete_c1_atomic(uuid,integer,jsonb,timestamptz)'::regprocedure,
        'public.get_c1_completion_status(uuid)'::regprocedure) order by proname`)
      assert.equal(functions.rowCount, 2)
      for (const fn of functions.rows) {
        assert.equal(fn.prosecdef, false)
        assert.ok(fn.proconfig.some(setting => setting === 'search_path=""'))
      }
      for (const signature of ['public.complete_c1_atomic(uuid,integer,jsonb,timestamptz)', 'public.get_c1_completion_status(uuid)']) {
        const rights = await db.query(`select has_function_privilege('anon',$1,'execute') as anon,
          has_function_privilege('authenticated',$1,'execute') as authenticated,
          has_function_privilege('service_role',$1,'execute') as service`, [signature])
        assert.deepEqual(rights.rows[0], { anon: false, authenticated: false, service: true })
      }
      const privateRights = await db.query(`select
        has_schema_privilege('anon','dtc_private','usage') as anon,
        has_schema_privilege('authenticated','dtc_private','usage') as authenticated,
        has_table_privilege('authenticated','dtc_private.c1_completion_receipts','insert') as client_insert,
        has_table_privilege('authenticated','dtc_private.c1_completion_receipts','update') as client_update,
        has_table_privilege('service_role','dtc_private.c1_completion_receipts','insert') as server_insert,
        (select relrowsecurity from pg_class where oid='dtc_private.c1_completion_receipts'::regclass) as rls`)
      assert.deepEqual(privateRights.rows[0], { anon: false, authenticated: false, client_insert: false,
        client_update: false, server_insert: true, rls: true })
      const guard = await db.query(`select t.tgname,p.proname,pg_get_functiondef(p.oid) as definition
        from pg_trigger t join pg_proc p on p.oid=t.tgfoid
        where t.tgrelid='public.despega_user_profiles'::regclass and t.tgname='enforce_a4_profile_completion'`)
      assert.equal(guard.rowCount, 1)
      assert.equal(guard.rows[0].proname, 'enforce_a4_requires_a3_completion')
      assert.ok(guard.rows[0].definition.includes('a3_route_progression'))
      const type = await db.query(`select data_type from information_schema.columns where table_schema='public'
        and table_name='despega_user_profiles' and column_name='onboarding_conozcamonos_1_completed_at'`)
      assert.deepEqual(type.rows, [{ data_type: 'timestamp without time zone' }])
    })

    for (const [index, userId] of users.entries()) {
      await db.query(`insert into auth.users(id,aud,role,email,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
        values($1,'authenticated','authenticated',$2,now(),'{}','{}','2026-11-06T00:00:00Z',now())`,
      [userId, `dtc-qa-c1-sql-${index + 1}@example.invalid`])
      createdUsers.push(userId)
      if (index !== 23) await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered')", [userId])
    }
    // The trigger bodies affect only the reserved local fixtures and only when
    // an explicit per-transaction GUC is set. They never change the product RPC.
    assert.equal((await db.query("select to_regprocedure('dtc_private.c1_sql_test_fault()') as existing")).rows[0].existing, null)
    await db.query(`
      create function dtc_private.c1_sql_test_fault() returns trigger language plpgsql
      security invoker set search_path='' as $$
      begin
        if new.user_id::text not like 'c1000002-0000-4000-8000-%' then return new; end if;
        if tg_table_name='assessment_drafts' and tg_op='INSERT'
          and current_setting('dtc.c1_gate_draft',true)='on' then
          perform pg_advisory_xact_lock(20261106,102);
        end if;
        if tg_table_name='despega_user_profiles' and current_setting('dtc.c1_fail_at',true)='profile' then
          raise exception using errcode='P0001',message='SYNTHETIC_C1_PROFILE_FAILURE';
        elsif tg_table_name='assessment_drafts' then
          if tg_op='UPDATE' and new.completed_at is not null and current_setting('dtc.c1_fail_at',true)='draft' then
            raise exception using errcode='P0001',message='SYNTHETIC_C1_DRAFT_FAILURE';
          end if;
        elsif tg_table_name='c1_completion_receipts' and current_setting('dtc.c1_fail_at',true)='receipt' then
          raise exception using errcode='P0001',message='SYNTHETIC_C1_RECEIPT_FAILURE';
        end if;
        return new;
      end; $$;
      revoke all on function dtc_private.c1_sql_test_fault() from public,anon,authenticated;
      grant execute on function dtc_private.c1_sql_test_fault() to service_role;
      create trigger zz_c1_sql_test_profile before insert or update on public.despega_user_profiles
        for each row execute function dtc_private.c1_sql_test_fault();
      create trigger zz_c1_sql_test_draft before insert or update on public.assessment_drafts
        for each row execute function dtc_private.c1_sql_test_fault();
      create trigger zz_c1_sql_test_receipt before insert on dtc_private.c1_completion_receipts
        for each row execute function dtc_private.c1_sql_test_fault();
    `)
    faultTriggersInstalled = true

    await run('fresh completion, UTC legacy timestamp and lost-response replay preserve one commit', async () => {
      const userId = users[0], answers = raw({ 1: ['Otro'], 5: ['Otro'] }, { 1: '  Trabajo temporal  ', 5: '\u00a0Residencia\uFEFF' })
      assert.equal((await getStatus(userId)).state, 'not_started')
      const first = await completed(userId, answers, null, { settings: { TimeZone: 'Pacific/Honolulu' } })
      assert.equal(first.replayed, false)
      const saved = await verifyOneCommit(userId, answers, first)
      const replay = await completed(userId, answers)
      assert.equal(replay.replayed, true)
      assert.equal(replay.responseId, first.responseId)
      assert.equal(replay.draftId, first.draftId)
      // JSON timestamps may display a different offset between transactions.
      assert.equal(Date.parse(replay.completedAt), Date.parse(first.completedAt))
      assert.deepEqual(await snapshot(userId), saved, 'An already consistent replay must not rewrite timestamps')
      const recovered = await getStatus(userId)
      assert.equal(recovered.state, 'completed')
      assert.equal(recovered.responseId, first.responseId)
      assert.equal(recovered.draft, null)
      await assert.rejects(completed(userId, raw()), failure('P0001', 'c1_already_completed_with_different_answers'))
    })

    await run('SQL option bank, final serializer, Unicode trim and UTF-16 limit match TypeScript', async () => {
      const examples = [raw(), raw({ 1: ['Otro'], 5: ['Otro'] }, { 1: ' \t\v\u00a0\uFEFFDev\u2028 ', 5: '' }),
        raw({ 3: '😀'.repeat(250), 4: '\uFEFFTexto\uFEFF' }), raw({ 1: ['Otro'] }, { 1: '😀'.repeat(250) })]
      for (const question of CONOZCAMONOS_1_QUESTIONS.filter(question => question.type === 'select')) {
        examples.push(raw({ [question.id]: [...question.options] }))
        for (const option of question.options) examples.push(raw({ [question.id]: [option] }))
      }
      for (const answers of examples) {
        assert.equal(validateC1CompletionAnswers(answers), true)
        const result = await inRole(db, 'service_role', null, async client =>
          (await client.query('select dtc_private.c1_final_answers($1) as result', [JSON.stringify(answers)])).rows[0].result)
        assert.deepEqual(result, expectedFinal(answers))
      }
    })

    await run('invalid completion payloads and versions leave all four stores unchanged', async () => {
      const userId = users[1], before = await snapshot(userId)
      const missing = raw(); delete missing['7']
      const invalid = [null, [], missing, { ...raw(), extra: true }, raw({ 3: '  \t\uFEFF' }),
        raw({ 3: 'x'.repeat(501) }), raw({ 4: '😀'.repeat(251) }), { ...raw(), 1: [] },
        { ...raw(), 1: ['Empleado de tiempo completo', 'Empleado de tiempo completo'] },
        { ...raw(), 7: ['Inventado'] }, { ...raw(), 2: 1 }, { ...raw(), _customResponses: null },
        { ...raw(), _customResponses: { 3: 'No corresponde' } },
        { ...raw(), _customResponses: { 1: 'Otro no seleccionado' } },
        raw({ 1: ['Otro'] }, { 1: '😀'.repeat(251) })]
      for (const answers of invalid) {
        assert.equal(validateC1CompletionAnswers(answers), false)
        await assert.rejects(completed(userId, answers), failure('22023', 'c1_invalid_payload'))
      }
      await assert.rejects(completed(userId, raw(), null, { version: 2 }), failure('22023', 'c1_unsupported_version'))
      assert.deepEqual(await snapshot(userId), before)
    })

    await run('stale draft CAS preserves the latest saved answers before a valid retry', async () => {
      const userId = users[2], initial = await draft(userId, raw({ 3: 'Primera versión' }))
      const latest = (await db.query(`update public.assessment_drafts set answers=$2,
        updated_at=updated_at + interval '1 second' where user_id=$1
        returning dtc_private.c1_draft_json(assessment_drafts) as result`,
      [userId, JSON.stringify(raw({ 3: 'Versión de otra pestaña' }))])).rows[0].result
      assert.equal((await getStatus(userId)).state, 'in_progress')
      assert.deepEqual((await getStatus(userId)).draft, latest)
      const before = await snapshot(userId)
      await assert.rejects(completed(userId, raw(), initial.updatedAt), failure('P0001', 'c1_draft_changed'))
      assert.deepEqual(await snapshot(userId), before)
      await verifyOneCommit(userId, latest.answers, await completed(userId, latest.answers, latest.updatedAt))
    })

    for (const [offset, point] of ['profile', 'draft', 'receipt'].entries()) {
      await run(`failure at ${point} rolls back the response, profile, draft and receipt together`, async () => {
        const userId = users[3 + offset], savedDraft = await draft(userId)
        const before = await snapshot(userId)
        await assert.rejects(completed(userId, raw(), savedDraft.updatedAt, { settings: { 'dtc.c1_fail_at': point } }),
          failure('P0001', `SYNTHETIC_C1_${point.toUpperCase()}_FAILURE`))
        assert.deepEqual(await snapshot(userId), before)
        assert.deepEqual((await getStatus(userId)).draft, savedDraft)
        await verifyOneCommit(userId, raw(), await completed(userId, raw(), savedDraft.updatedAt))
      })
    }

    await run('concurrent identical completions return one fresh commit and one durable replay', async () => {
      const first = await connect(), second = await connect(), userId = users[6]
      const results = await Promise.all([completed(userId, raw(), null, { db: first }), completed(userId, raw(), null, { db: second })])
      assert.deepEqual(results.map(value => value.replayed).sort(), [false, true])
      assert.equal(results[0].responseId, results[1].responseId)
      assert.equal(results[0].completedAt, results[1].completedAt)
      await verifyOneCommit(userId, raw(), results[0])
    })

    await run('concurrent differing snapshots cannot replace the winning completion', async () => {
      const first = await connect(), second = await connect(), userId = users[7]
      const inputs = [raw({ 4: 'Objetivo A' }), raw({ 4: 'Objetivo B' })]
      const results = await Promise.allSettled(inputs.map((answers, index) =>
        completed(userId, answers, null, { db: index === 0 ? first : second })))
      const winner = results.findIndex(value => value.status === 'fulfilled')
      assert.ok(winner >= 0)
      assert.equal(results.filter(value => value.status === 'fulfilled').length, 1)
      failure('P0001', 'c1_already_completed_with_different_answers')(results[1 - winner].reason)
      await verifyOneCommit(userId, inputs[winner], results[winner].value)
    })

    await run('ordinary draft INSERT winning the absent-row race becomes recoverable CAS conflict', async () => {
      const blocker = await connect(), finalizer = await connect(), saver = await connect(), userId = users[8]
      const pid = (await finalizer.query('select pg_backend_pid() as pid')).rows[0].pid
      await blocker.query('select pg_advisory_lock(20261106,102)')
      const pending = completed(userId, raw(), null, { db: finalizer, settings: { 'dtc.c1_gate_draft': 'on' } })
        .then(value => ({ value }), error => ({ error }))
      try {
        const deadline = Date.now() + 3500
        let waiting = false
        while (Date.now() < deadline) {
          const locks = await db.query(`select 1 from pg_locks where pid=$1 and locktype='advisory'
            and classid=20261106 and objid=102 and not granted`, [pid])
          if (locks.rowCount > 0) { waiting = true; break }
          await new Promise(resolve => setTimeout(resolve, 20))
        }
        assert.equal(waiting, true, 'Finalizer must reach the deterministic post-SELECT INSERT barrier')
        await inRole(saver, 'authenticated', userId, client => client.query(`insert into public.assessment_drafts
          (user_id,assessment_type,answers,current_question) values($1,'c1',$2,5)`,
        [userId, JSON.stringify(raw({ 4: 'Guardado concurrente' }))]))
      } finally {
        await blocker.query('select pg_advisory_unlock(20261106,102)')
      }
      const result = await pending
      assert.ok(result.error)
      failure('P0001', 'c1_draft_changed')(result.error)
      const saved = await snapshot(userId)
      assert.equal(saved.responses.length, 0)
      assert.equal(saved.receipts.length, 0)
      assert.equal(saved.profiles.length, 0)
      assert.equal(saved.drafts.length, 1)
      assert.equal(saved.drafts[0].answers['4'], 'Guardado concurrente')
      assert.equal(saved.drafts[0].current_question, 5)
    })

    await run('legacy inserted response is adopted once after an open-draft failure', async () => {
      const userId = users[9], answers = raw({ 1: ['Otro'] }, { 1: 'Consultoría' })
      const savedDraft = await draft(userId, answers)
      const response = await legacyResponse(userId, expectedFinal(answers))
      const recovery = await getStatus(userId)
      assert.equal(recovery.state, 'recovery_required')
      assert.deepEqual(recovery.draft, savedDraft)
      const result = await completed(userId, answers, savedDraft.updatedAt)
      assert.equal(result.origin, 'legacy')
      assert.equal(result.responseId, response.id)
      assert.equal(result.completedAt, response.completedAt)
      await verifyOneCommit(userId, answers, result)
    })

    await run('legacy closed draft with a failed profile is recovered without a second response', async () => {
      const userId = users[10], response = await legacyResponse(userId, expectedFinal(raw()))
      const savedDraft = await draft(userId, raw(), response.completedAt)
      const recovery = await getStatus(userId)
      assert.equal(recovery.state, 'recovery_required')
      assert.deepEqual(recovery.draft, savedDraft)
      const result = await completed(userId, raw(), savedDraft.updatedAt)
      assert.equal(result.responseId, response.id)
      await verifyOneCommit(userId, raw(), result)
    })

    await run('legacy completed users retain a confirmed receipt-free status and historical rows', async () => {
      const userId = users[11]
      await legacyResponse(userId, expectedFinal(raw({ 4: 'Historia anterior' })), '2026-09-01T00:00:00Z')
      const latest = await legacyResponse(userId, expectedFinal(raw()))
      await db.query(`insert into public.despega_user_profiles(user_id,onboarding_conozcamonos_1_completed)
        values($1,true)`, [userId])
      const confirmed = await getStatus(userId)
      assert.equal(confirmed.state, 'completed')
      assert.equal(confirmed.origin, 'legacy')
      assert.equal(confirmed.responseId, latest.id)
      assert.equal(confirmed.completedAt, latest.completedAt)
      assert.equal(confirmed.draftId, null)
      const before = await snapshot(userId)
      await assert.rejects(completed(userId, raw({ 4: 'Sobrescritura' })), failure('P0001', 'c1_legacy_completion_conflict'))
      assert.deepEqual(await snapshot(userId), before)
      const result = await completed(userId)
      assert.equal(result.responseId, latest.id)
      assert.equal((await snapshot(userId)).responses.length, 2)
      assert.equal((await snapshot(userId)).receipts.length, 1)
    })

    await run('closed legacy mismatch and flag-only completion never invent a successful status', async () => {
      const userId = users[12], savedDraft = await draft(userId, raw(), '2026-10-01T12:00:00Z')
      await legacyResponse(userId, expectedFinal(raw({ 4: 'Respuesta diferente' })))
      const before = await snapshot(userId)
      await assert.rejects(completed(userId, raw(), savedDraft.updatedAt), failure('P0001', 'c1_legacy_completion_conflict'))
      assert.deepEqual(await snapshot(userId), before)
      assert.equal((await getStatus(userId)).state, 'recovery_required')
      const flagOnly = users[13]
      await db.query('insert into public.despega_user_profiles(user_id,onboarding_conozcamonos_1_completed) values($1,true)', [flagOnly])
      const recovery = await getStatus(flagOnly)
      assert.equal(recovery.state, 'recovery_required')
      assert.equal(recovery.draft, null)
      assert.equal(recovery.responseId, null)
      const noTimestamp = users[14]
      await legacyResponse(noTimestamp, expectedFinal(raw()), null)
      await db.query('insert into public.despega_user_profiles(user_id,onboarding_conozcamonos_1_completed) values($1,true)', [noTimestamp])
      assert.equal((await getStatus(noTimestamp)).state, 'recovery_required')
    })

    await run('private receipt and completion RPCs reject anonymous and authenticated direct calls', async () => {
      for (const role of ['anon', 'authenticated']) {
        for (const actor of [users[0], users[1]]) {
          await assert.rejects(inRole(db, role, actor, client =>
            client.query('select public.complete_c1_atomic($1,1,$2,null)', [users[0], JSON.stringify(raw())])), failure('42501'))
          await assert.rejects(inRole(db, role, actor, client =>
            client.query('select public.get_c1_completion_status($1)', [users[0]])), failure('42501'))
          await assert.rejects(inRole(db, role, actor, client =>
            client.query('select * from dtc_private.c1_completion_receipts where user_id=$1', [users[0]])), failure('42501'))
          await assert.rejects(inRole(db, role, actor, client =>
            client.query("update dtc_private.c1_completion_receipts set origin='legacy' where user_id=$1", [users[0]])), failure('42501'))
        }
      }
    })

    await run('receipt detects a later edited canonical response instead of confirming false success', async () => {
      const userId = users[15], result = await completed(userId)
      await db.query('update public.canon_conozcamonos_1_responses set responses=$2 where id=$1',
        [result.responseId, JSON.stringify(expectedFinal(raw({ 3: 'Edición posterior' })))])
      const before = await snapshot(userId)
      await assert.rejects(getStatus(userId), failure('P0001', 'c1_completion_inconsistent'))
      await assert.rejects(completed(userId), failure('P0001', 'c1_completion_inconsistent'))
      assert.deepEqual(await snapshot(userId), before)
    })

    await run('receipt detects a changed raw draft snapshot and repairs only profile regression', async () => {
      const userId = users[16], result = await completed(userId)
      await db.query('update public.despega_user_profiles set onboarding_conozcamonos_1_completed=false where user_id=$1', [userId])
      const recovery = await getStatus(userId)
      assert.equal(recovery.state, 'recovery_required')
      assert.deepEqual(recovery.draft.answers, raw())
      const repaired = await completed(userId)
      assert.equal(repaired.replayed, true)
      assert.equal(repaired.responseId, result.responseId)
      await verifyOneCommit(userId, raw(), repaired)
      await db.query('update public.assessment_drafts set answers=$2 where user_id=$1', [userId, JSON.stringify(raw({ 4: 'Cambio ajeno' }))])
      await assert.rejects(getStatus(userId), failure('P0001', 'c1_completion_inconsistent'))
      await assert.rejects(completed(userId), failure('P0001', 'c1_completion_inconsistent'))
    })

    await run('unadmitted actor fails inside the transaction without any completion write', async () => {
      const userId = users[23], before = await snapshot(userId)
      await assert.rejects(getStatus(userId), failure('42501', 'c1_access_required'))
      await assert.rejects(completed(userId), failure('42501', 'c1_access_required'))
      assert.deepEqual(await snapshot(userId), before)
      assert.equal((await db.query('select 1 from public.pilot_memberships where user_id=$1', [userId])).rowCount, 0)
    })
    passed = true
  } finally {
    await Promise.allSettled(connections.map(client => client.end()))
    try {
      if (faultTriggersInstalled) {
        await db.query(`drop trigger zz_c1_sql_test_profile on public.despega_user_profiles;
          drop trigger zz_c1_sql_test_draft on public.assessment_drafts;
          drop trigger zz_c1_sql_test_receipt on dtc_private.c1_completion_receipts;
          drop function dtc_private.c1_sql_test_fault();`)
      }
      if (createdUsers.length > 0) {
        await db.query('begin')
        for (const table of ['dtc_private.c1_completion_receipts', 'public.canon_conozcamonos_1_responses',
          'public.assessment_drafts', 'public.despega_user_profiles', 'public.pilot_memberships']) {
          await db.query(`delete from ${table} where user_id=any($1::uuid[])`, [createdUsers])
        }
        await db.query('delete from auth.users where id=any($1::uuid[])', [createdUsers])
        await db.query('commit')
      }
      await browserOwnersUnchanged()
      assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])', [users])).rowCount, 0)
      cleanupPassed = true
    } finally {
      writeFileSync(join(evidence, 'c1-atomic-sql.json'), JSON.stringify({
        scope: 'disposable-local-postgresql', migration: '20261106173017_c1_atomic_completion.sql',
        cases, syntheticOwnersCreated: createdUsers.length, syntheticOwnersRemoved: cleanupPassed,
        browserOwnersUncompleted: cleanupPassed, remoteOperations: 0,
        verdict: passed && cleanupPassed ? 'PASS' : 'FAIL',
      }, null, 2))
      await db.end()
    }
  }
  assert.equal(passed && cleanupPassed, true)
  console.log(`C1 atomic SQL: ${cases.length} cases passed; temporary owners and fault triggers removed.`)
}

main().catch(error => {
  console.error('C1 atomic SQL failed:', safeFailure(error, secrets))
  process.exitCode = 1
})
