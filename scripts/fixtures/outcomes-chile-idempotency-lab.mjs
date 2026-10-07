import assert from 'node:assert/strict'

const rpcSql = 'select public.capture_dtc_chile_outcome($1::uuid,$2::uuid,$3::text,$4::jsonb) as result'
const args = (user, request, action, payload) => [user, request, action, JSON.stringify(payload)]
const uuid = n => `20000000-0000-4000-8000-${String(n).padStart(12, '0')}`

export async function checkOutcomeIdempotency({ query, execute, expectError, ownerA, ownerB }) {
  await query('reset role')
  const clock = (await query("select (statement_timestamp() at time zone 'America/Santiago')::date::text as today, ((statement_timestamp() at time zone 'America/Santiago')::date-200)::text as old, ((statement_timestamp() at time zone 'America/Santiago')::date+1)::text as tomorrow, (statement_timestamp()-interval '1 hour')::text as past_at, (statement_timestamp()+interval '1 day')::text as future_at")).rows[0]
  const functionAccess = (await query("select prosecdef,has_function_privilege('service_role',oid,'EXECUTE') as server,has_function_privilege('authenticated',oid,'EXECUTE') as authenticated,has_function_privilege('anon',oid,'EXECUTE') as anon from pg_catalog.pg_proc where oid='public.capture_dtc_chile_outcome(uuid,uuid,text,jsonb)'::regprocedure")).rows[0]
  assert.deepEqual(functionAccess, { prosecdef: false, server: true, authenticated: false, anon: false })

  await query('set role service_role')
  const rpc = async (user, request, action, payload) => (await query(rpcSql, args(user, request, action, payload))).rows[0].result
  const requestCount = async (user, request) => Number((await query('select count(*)::integer as count from public.dtc_outcome_write_requests where user_id=$1 and request_id=$2', [user, request])).rows[0].count)
  const reject = async (request, action, payload, code, message, user = ownerA) => {
    const error = await expectError(rpcSql, args(user, request, action, payload), code)
    assert.equal(error.message, message)
  }
  const event = { event_type: 'interview', occurred_at: clock.past_at, user_id: ownerB, verification_status: 'verified', evidence_refs: ['ignored'] }
  const employment = { outcome_type: 'job_started', effective_date: clock.old, role_title: 'Idempotency laboratory role' }
  const eventResult = await rpc(ownerA, uuid(1), 'job_search_event', event)
  assert.deepEqual(await rpc(ownerA, uuid(1), 'job_search_event', { ...event }), eventResult)
  assert.equal(await requestCount(ownerA, uuid(1)), 1)
  const storedEvent = (await query('select user_id,verification_status,evidence_refs from public.dtc_job_search_events where id=$1', [eventResult.id])).rows[0]
  assert.deepEqual(storedEvent, { user_id: ownerA, verification_status: 'self_reported', evidence_refs: [] })
  const otherOwnerResult = await rpc(ownerB, uuid(1), 'job_search_event', event)
  assert.notEqual(otherOwnerResult.id, eventResult.id, 'request keys must be scoped to the owner')
  await reject(uuid(1), 'job_search_event', { ...event, event_type: 'offer' }, 'PT409', 'IDEMPOTENCY_KEY_REUSED')
  await reject(uuid(1), 'employment_outcome', employment, 'PT409', 'IDEMPOTENCY_KEY_REUSED')

  const employmentResult = await rpc(ownerA, uuid(2), 'employment_outcome', employment)
  assert.deepEqual(await rpc(ownerA, uuid(2), 'employment_outcome', Object.fromEntries(Object.entries(employment).reverse())), employmentResult)
  const followups = (await query('select id,followup_day from public.dtc_outcome_followups where employment_outcome_id=$1 order by followup_day', [employmentResult.id])).rows
  assert.deepEqual(followups.map(row => row.followup_day), [30, 90, 180])
  const salary = { employment_outcome_id: employmentResult.id, measurement_role: 'new_role', monthly_net_clp: 850000, measured_at: clock.today }
  const salaryResult = await rpc(ownerA, uuid(3), 'salary_outcome', salary)
  assert.deepEqual(await rpc(ownerA, uuid(3), 'salary_outcome', salary), salaryResult)
  await reject(uuid(4), 'salary_outcome', salary, 'PT422', 'INVALID_EMPLOYMENT_OUTCOME_ID', ownerB)
  assert.equal(await requestCount(ownerB, uuid(4)), 0)

  const completion = { followup_id: followups[0].id, employment_active: true, same_role: null, completed_at: '1990-01-01', verification_status: 'verified', monthly_net_clp: 99999999 }
  const completed = await rpc(ownerA, uuid(5), 'complete_followup', completion)
  assert.equal(completed.id, followups[0].id)
  assert.equal(completed.verification_status, 'self_reported')
  assert.equal(completed.employment_active, true)
  assert.equal(completed.same_role, null)
  assert.notEqual(completed.completed_at.slice(0, 10), '1990-01-01')
  assert.deepEqual(await rpc(ownerA, uuid(5), 'complete_followup', completion), completed)
  assert.equal((await query('select monthly_net_clp from public.dtc_outcome_followups where id=$1', [completed.id])).rows[0].monthly_net_clp, null)
  await reject(uuid(6), 'complete_followup', completion, 'PT409', 'FOLLOWUP_ALREADY_COMPLETED')
  assert.equal(await requestCount(ownerA, uuid(6)), 0)
  await query("update public.dtc_outcome_followups set verification_status='verified' where id=$1", [completed.id])
  assert.deepEqual(await rpc(ownerA, uuid(5), 'complete_followup', completion), completed, 'a replay must not change after later verification')
  await reject(uuid(7), 'complete_followup', completion, 'PT409', 'FOLLOWUP_VERIFICATION_LOCKED')
  await reject(uuid(5), 'complete_followup', { ...completion, employment_active: false, same_role: null }, 'PT409', 'IDEMPOTENCY_KEY_REUSED')

  for (const [index, verification] of [[1, 'corroborated'], [2, 'verified']]) {
    await query('update public.dtc_outcome_followups set verification_status=$1 where id=$2', [verification, followups[index].id])
    await reject(uuid(10 + index), 'complete_followup', { followup_id: followups[index].id, employment_active: false, same_role: null }, 'PT409', 'FOLLOWUP_VERIFICATION_LOCKED')
    assert.equal((await query('select completed_at from public.dtc_outcome_followups where id=$1', [followups[index].id])).rows[0].completed_at, null)
  }
  await reject(uuid(13), 'complete_followup', completion, 'PT404', 'FOLLOWUP_NOT_FOUND', ownerB)
  await reject(uuid(14), 'complete_followup', { ...completion, followup_id: uuid(999) }, 'PT404', 'FOLLOWUP_NOT_FOUND')
  const newEmployment = await rpc(ownerA, uuid(15), 'employment_outcome', { ...employment, effective_date: clock.today })
  const notDue = (await query('select id from public.dtc_outcome_followups where employment_outcome_id=$1 and followup_day=30', [newEmployment.id])).rows[0].id
  await reject(uuid(16), 'complete_followup', { followup_id: notDue, employment_active: true, same_role: null }, 'PT409', 'FOLLOWUP_NOT_DUE')
  assert.equal(await requestCount(ownerA, uuid(16)), 0)
  await reject(uuid(17), 'complete_followup', { followup_id: notDue, employment_active: false, same_role: true }, 'PT422', 'INVALID_SAME_ROLE')

  for (const [id, action, payload, message] of [
    [20, 'job_search_event', { ...event, occurred_at: clock.future_at }, 'FUTURE_OCCURRED_AT'],
    [21, 'employment_outcome', { ...employment, effective_date: clock.tomorrow }, 'FUTURE_EFFECTIVE_DATE'],
    [22, 'salary_outcome', { ...salary, measured_at: clock.tomorrow }, 'FUTURE_MEASURED_AT'],
  ]) {
    await reject(uuid(id), action, payload, 'PT422', message)
    assert.equal(await requestCount(ownerA, uuid(id)), 0)
  }

  await query('reset role')
  await execute(`
    create function public.dtc_lab_idempotency_failure() returns trigger
      language plpgsql security invoker set search_path=pg_catalog as $$
    begin
      if current_setting('dtc.lab.fail_followup',true)='yes' and new.followup_day=90 then
        raise exception 'DTC_LAB_RESERVED_REQUEST_FAILURE' using errcode='23514';
      end if;
      return new;
    end $$;
    create trigger dtc_lab_idempotency_failure after insert on public.dtc_outcome_followups
      for each row execute function public.dtc_lab_idempotency_failure();
  `)
  await query('set role service_role')
  await query("select set_config('dtc.lab.fail_followup','yes',true)")
  const failedEmployment = { ...employment, role_title: 'Reserved-request failure laboratory' }
  await reject(uuid(30), 'employment_outcome', failedEmployment, '23514', 'DTC_LAB_RESERVED_REQUEST_FAILURE')
  assert.equal(await requestCount(ownerA, uuid(30)), 0)
  assert.equal((await query('select count(*)::integer as count from public.dtc_employment_outcomes where user_id=$1 and role_title=$2', [ownerA, failedEmployment.role_title])).rows[0].count, 0)
  await query("select set_config('dtc.lab.fail_followup','no',true)")
  const retried = await rpc(ownerA, uuid(30), 'employment_outcome', failedEmployment)
  assert.equal((await query('select count(*)::integer as count from public.dtc_outcome_followups where employment_outcome_id=$1', [retried.id])).rows[0].count, 3)
  assert.equal(await requestCount(ownerA, uuid(30)), 1)

  // A replay remains stable even if the optional employment link later goes.
  await query('delete from public.dtc_employment_outcomes where id=$1', [employmentResult.id])
  assert.deepEqual(await rpc(ownerA, uuid(3), 'salary_outcome', salary), salaryResult)
  for (const role of ['anon', 'authenticated']) {
    await query('reset role')
    await query(`set role ${role}`)
    await expectError(rpcSql, args(ownerA, uuid(40), 'job_search_event', event), '42501')
    for (const statement of ['select *', 'delete']) {
      await expectError(`${statement} from public.dtc_outcome_write_requests`, [], '42501')
    }
    await expectError('insert into public.dtc_outcome_write_requests default values', [], '42501')
    await expectError('update public.dtc_outcome_write_requests set action=action', [], '42501')
  }
  await query('reset role')
  return { actionsWithStableReplay: 4, ownerScopedKeys: true, differentPayloadAndActionConflict: true, requestReservationRollsBack: true, serverTimestampAndVerification: true, futureObservationRejections: 3, followupStateGuards: true, browserCannotReadRequestPayloads: true }
}

async function waitForLock(query, pid, settled) {
  const deadline = Date.now() + 4000
  while (Date.now() < deadline) {
    const row = (await query('select wait_event_type from pg_catalog.pg_stat_activity where pid=$1', [pid])).rows[0]
    if (row?.wait_event_type === 'Lock') return
    assert.equal(settled(), false, 'the competing mutation must wait for the uncommitted owner')
    await new Promise(resolve => setTimeout(resolve, 40))
  }
  assert.fail('competing SQL mutation did not reach a lock within the bounded test window')
}

export async function checkOutcomeConcurrency({ query, connectNative, ownerA }) {
  assert.ok(connectNative, 'A native PostgreSQL connection is required for contention tests')
  await query('insert into auth.users (id) values ($1)', [ownerA])
  const old = (await query("select ((statement_timestamp() at time zone 'America/Santiago')::date-200)::text as date")).rows[0].date
  let first, second
  const begin = async client => { await client.query('begin isolation level read committed'); await client.query('set local role service_role') }
  try {
    first = await connectNative()
    second = await connectNative()
    const secondPid = (await second.query('select pg_backend_pid() as pid')).rows[0].pid
    const payload = { outcome_type: 'job_started', effective_date: old, role_title: 'Concurrent retry laboratory' }
    await begin(first)
    const inserted = (await first.query(rpcSql, args(ownerA, uuid(101), 'employment_outcome', payload))).rows[0].result
    await begin(second)
    let settled = false
    const pending = second.query(rpcSql, args(ownerA, uuid(101), 'employment_outcome', payload))
      .then(value => { settled = true; return { value } }, error => { settled = true; return { error } })
    await waitForLock(query, secondPid, () => settled)
    await first.query('commit')
    const replay = await pending
    assert.ifError(replay.error)
    assert.deepEqual(replay.value.rows[0].result, inserted)
    await second.query('commit')
    assert.equal((await query('select count(*)::integer as count from public.dtc_outcome_write_requests where user_id=$1 and request_id=$2', [ownerA, uuid(101)])).rows[0].count, 1)
    assert.equal((await query('select count(*)::integer as count from public.dtc_outcome_followups where employment_outcome_id=$1', [inserted.id])).rows[0].count, 3)

    const followupId = (await query('select id from public.dtc_outcome_followups where employment_outcome_id=$1 and followup_day=30', [inserted.id])).rows[0].id
    const completion = { followup_id: followupId, employment_active: true, same_role: true }
    await begin(first)
    const completed = (await first.query(rpcSql, args(ownerA, uuid(102), 'complete_followup', completion))).rows[0].result
    await begin(second)
    settled = false
    const competing = second.query(rpcSql, args(ownerA, uuid(103), 'complete_followup', { ...completion, employment_active: false, same_role: null }))
      .then(value => { settled = true; return { value } }, error => { settled = true; return { error } })
    await waitForLock(query, secondPid, () => settled)
    await first.query('commit')
    const rejected = await competing
    assert.equal(rejected.error?.code, 'PT409')
    assert.equal(rejected.error?.message, 'FOLLOWUP_ALREADY_COMPLETED')
    await second.query('rollback')
    const saved = (await query('select employment_active,same_role,completed_at::text from public.dtc_outcome_followups where id=$1', [followupId])).rows[0]
    assert.equal(saved.employment_active, true)
    assert.equal(saved.same_role, true)
    assert.equal(Date.parse(saved.completed_at), Date.parse(completed.completed_at))
    assert.equal((await query('select count(*)::integer as count from public.dtc_outcome_write_requests where user_id=$1 and request_id=$2', [ownerA, uuid(103)])).rows[0].count, 0)
    return { nativeConcurrentRetry: true, contendedFollowupCannotOverwrite: true, actualLockWaitsObserved: 2 }
  } finally {
    if (first) await first.query('rollback').catch(() => {})
    if (second) await second.query('rollback').catch(() => {})
    const closed = await Promise.allSettled([first?.end(), second?.end()])
    const failedClose = closed.find(result => result.status === 'rejected')
    if (failedClose) throw failedClose.reason
  }
}
