import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const route = source('app/api/a3/interview-feedback/[userId]/route.ts')
const migration = source('migrations/12-a3-interview-response-atomicity.sql')

assert.ok(route.includes("'complete_a3_interview_response'"))
assert.ok(route.includes('p_session_id: sessionId'))
assert.ok(route.includes('p_question_id: questionId'))
assert.ok(route.includes('p_xp: calculatedXp'))
assert.ok(route.includes('if (!atomicResult.inserted)'))
assert.ok(route.includes('xpAwarded: 0'))
assert.ok(route.includes('xpAwarded: calculatedXp'))
assert.ok(route.includes('parseStoredFeedback(atomicResult.stored_feedback)'))

assert.ok(!route.includes(".from('a3_respuestas_entrevista')\n      .insert"))
assert.ok(!route.includes(".from('user_gamification_profile')\n      .select"))
assert.ok(!route.includes('levelLabel('))
assert.ok(!route.includes('newCurrentXp'))

assert.ok(
  migration.includes(
    'add constraint a3_respuestas_entrevista_session_question_key',
  ),
)
assert.ok(migration.includes('unique (sesion_id, pregunta_id)'))
assert.ok(migration.includes('create or replace function public.complete_a3_interview_response'))
assert.ok(migration.includes('security definer'))
assert.ok(migration.includes('set search_path = public, pg_temp'))
assert.ok(migration.includes('on conflict (sesion_id, pregunta_id) do nothing'))
assert.ok(migration.includes('on conflict (user_id) do update'))
assert.ok(migration.includes('v_inserted := true'))
assert.ok(migration.includes('coalesce(existing_profile.total_xp, 0) + v_safe_xp'))
assert.ok(migration.includes('from public, anon, authenticated'))
assert.ok(migration.includes('to service_role'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    uniqueResponsePerSessionQuestion: true,
    responseAndXpSameDatabaseTransaction: true,
    concurrentDuplicateAwardsXp: false,
    profileIncrementUsesAtomicUpsert: true,
    serviceRoleOnlyRpc: true,
    liveConcurrencyCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
