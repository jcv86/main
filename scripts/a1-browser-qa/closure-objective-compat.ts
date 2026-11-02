import assert from 'node:assert/strict'
import type { Client } from 'pg'

/** Real SQL against the disposable stack. Every write is rolled back. */
export async function verifyObjectiveWriterCompatibility(db: Client, ownerId: string, otherOwnerId: string) {
  const passed: string[] = []
  const locations = (values: string[]) => JSON.stringify(values)
  const returning = 'returning id, locations, location_preference'
  const expectedRow = (row: any, preference: string, values: string[]) => {
    assert.equal(row.location_preference, preference)
    assert.deepEqual(row.locations, values)
  }
  const expectConstraint = async (label: string, query: string, values: unknown[]) => {
    await db.query('savepoint rejected_preference')
    let rejected: unknown
    try { await db.query(query, values) } catch (error) { rejected = error }
    await db.query('rollback to savepoint rejected_preference')
    await db.query('release savepoint rejected_preference')
    assert.ok(rejected, `${label}: inconsistent explicit preference was accepted`)
    assert.equal((rejected as { code?: string }).code, '23514', `${label}: expected CHECK rejection`)
    assert.equal((rejected as { constraint?: string }).constraint, 'career_search_intents_location_preference_check')
    passed.push(label)
  }

  await db.query('begin')
  try {
    // Exercise the unchanged real owner RLS as an authenticated owner. These are
    // existing synthetic Auth IDs verified by closure-seed, never production IDs.
    await db.query('set local role authenticated')
    await db.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ownerId, role: 'authenticated' })])
    assert.equal((await db.query('select auth.uid() as id')).rows[0].id, ownerId)

    const configuration = await db.query(`select p.prosecdef, p.proconfig,
      (select column_default from information_schema.columns
        where table_schema='public' and table_name='career_search_intents' and column_name='location_preference') as column_default
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='normalize_career_search_intent_location_preference'`)
    assert.equal(configuration.rowCount, 1)
    assert.equal(configuration.rows[0].prosecdef, false, 'Compatibility must run with caller privileges')
    assert.deepEqual(configuration.rows[0].proconfig, ['search_path=pg_catalog'])
    assert.equal(configuration.rows[0].column_default, null, 'Omission must reach the trigger as NULL')
    passed.push('invoker-only function, fixed search_path and no preference default')

    const legacyInsert = `insert into public.career_search_intents(user_id, target_roles, locations)
      values ($1, '["Rol sintético"]'::jsonb, $2::jsonb) ${returning}`
    const empty = (await db.query(legacyInsert, [ownerId, locations([])])).rows[0]
    expectedRow(empty, 'unspecified', [])
    passed.push('legacy INSERT empty locations')
    const selected = (await db.query(legacyInsert, [ownerId, locations(['Zona A sintética'])])).rows[0]
    expectedRow(selected, 'selected', ['Zona A sintética'])
    passed.push('legacy INSERT selected locations')

    const legacyUpdate = `update public.career_search_intents set locations=$2::jsonb where id=$1 ${returning}`
    expectedRow((await db.query(legacyUpdate, [empty.id, locations(['Zona B sintética'])])).rows[0], 'selected', ['Zona B sintética'])
    passed.push('legacy UPDATE empty to selected')
    expectedRow((await db.query(legacyUpdate, [empty.id, locations([])])).rows[0], 'unspecified', [])
    passed.push('legacy UPDATE selected to empty')
    expectedRow((await db.query(legacyUpdate, [selected.id, locations(['Zona B sintética'])])).rows[0], 'selected', ['Zona B sintética'])
    passed.push('legacy UPDATE selected to another selection')

    const modernInsert = `insert into public.career_search_intents(user_id, target_roles, locations, location_preference)
      values ($1, '["Rol sintético"]'::jsonb, $2::jsonb, $3) ${returning}`
    const any = (await db.query(modernInsert, [ownerId, locations([]), 'any'])).rows[0]
    expectedRow(any, 'any', [])
    passed.push('current INSERT explicit any remains any')
    expectedRow((await db.query(modernInsert, [ownerId, locations(['Zona A sintética']), 'selected'])).rows[0], 'selected', ['Zona A sintética'])
    passed.push('current INSERT explicit selected')
    expectedRow((await db.query(`update public.career_search_intents set name='Nombre sintético actualizado' where id=$1 ${returning}`, [any.id])).rows[0], 'any', [])
    passed.push('unrelated legacy UPDATE preserves explicit any')
    expectedRow((await db.query(legacyUpdate, [any.id, locations(['Zona A sintética'])])).rows[0], 'selected', ['Zona A sintética'])
    passed.push('legacy UPDATE any to selected locations remains coherent')

    const modernUpdate = `update public.career_search_intents set locations=$2::jsonb, location_preference=$3 where id=$1 ${returning}`
    expectedRow((await db.query(modernUpdate, [selected.id, locations([]), 'any'])).rows[0], 'any', [])
    passed.push('current UPDATE selected to explicit any')
    expectedRow((await db.query(modernUpdate, [selected.id, locations(['Zona A sintética']), 'selected'])).rows[0], 'selected', ['Zona A sintética'])
    passed.push('current UPDATE any to explicit selected')

    for (const [preference, values] of [
      ['any', ['Zona A sintética']], ['unspecified', ['Zona A sintética']], ['selected', []],
    ] as const) {
      await expectConstraint(`current INSERT rejects ${preference} with inconsistent locations`, modernInsert,
        [ownerId, locations([...values]), preference])
    }
    // Preference changes in each invalid UPDATE, so none may be repaired by the
    // legacy bridge. The entire statement must fail its original strict CHECK.
    await expectConstraint('current UPDATE rejects explicit any with locations', modernUpdate,
      [selected.id, locations(['Zona B sintética']), 'any'])
    await expectConstraint('current UPDATE rejects explicit unspecified with locations', modernUpdate,
      [selected.id, locations(['Zona B sintética']), 'unspecified'])
    await expectConstraint('current UPDATE rejects explicit selected without locations', modernUpdate,
      [empty.id, locations([]), 'selected'])

    // The function must not let its caller mutate another existing owner row.
    await db.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: otherOwnerId, role: 'authenticated' })])
    assert.equal((await db.query('select id from public.career_search_intents where id=$1', [selected.id])).rowCount, 0)
    assert.equal((await db.query(legacyUpdate, [selected.id, locations([])])).rowCount, 0)
    passed.push('other owner cannot read or mutate the row through the bridge')

    return { casesPassed: passed.length, cases: passed, writesRolledBack: true, verdict: 'PASS' }
  } finally {
    // Also resets SET LOCAL ROLE and JWT claims before the remaining seed steps.
    await db.query('rollback')
  }
}
