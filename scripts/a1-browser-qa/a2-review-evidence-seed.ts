import assert from 'node:assert/strict'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'
import { validateAndScoreDiscResponses } from '../../lib/a1/disc-scoring'
import { A3_MODULE_IDS } from '../../lib/a3/module-catalog'
import { captureObservation, parseOutcomeCapture } from '../../lib/outcomes/response-capture'
import { a2PlanToday } from '../../lib/a2/plan-contract'
import { closureLab, readClosureFixtures, safeFailure } from './closure-lab.mjs'
import { readAuthFixtures } from './auth-lab.mjs'

const migrationPaths = [
  'migrations/08-a4-signal-decision-log.sql',
  'migrations/10-a4-server-owned-write-hardening.sql',
  'supabase/migrations/20260914153833_a4_source_integrity.sql',
  'supabase/migrations/20260914154438_a4_source_integrity_backward_compatibility.sql',
  'supabase/migrations/20260914201532_restore_a4_source_integrity_coherence.sql',
  'supabase/migrations/20260920153000_a4_outcome_review.sql',
]
const secrets: string[] = []
const priorTables = ['public.despega_user_profiles', 'public.despega_journey_state', 'public.a2_user_task_completions',
  'public.a3_user_progress', 'public.a3_route_progression', 'public.user_gamification_profile', 'public.user_dtc_balance',
  'public.dtc_outcome_observations', 'public.dtc_documents', 'public.a2_reviewed_plans',
  'dtc_private.a2_plan_revisions', 'dtc_private.a2_plan_receipts', 'dtc_private.a2_assistant_action_receipts']
function daysAgo(count: number) { return new Date(Date.now() - count * 86_400_000).toISOString() }
function calendarOffset(offset: number) {
  const day = new Date(`${a2PlanToday()}T12:00:00Z`); day.setUTCDate(day.getUTCDate() + offset)
  return day.toISOString().slice(0, 10)
}
async function main() {
  const { root, status, repo, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'a2-review-evidence-prepared.json')))
  const fixturePath = join(root, 'a2-review-evidence-fixtures.private.json')
  assert.ok(!existsSync(fixturePath), 'Never reuse AG05 browser fixture identities')
  const previous = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
  const plans = JSON.parse(readFileSync(join(root, 'a2-plan-fixtures.private.json'), 'utf8'))
  const actions = JSON.parse(readFileSync(join(root, 'a2-action-fixtures.private.json'), 'utf8'))
  assert.equal(plans.scope, 'disposable-local-a2-plan'); assert.equal(actions.scope, 'disposable-local-a2-action')
  const expected = [...previous.users, ...readClosureFixtures(root).users, ...readAuthFixtures(root).users, ...plans.users, ...actions.users]
  assert.equal(new Set(expected.map(user => user.id)).size, expected.length)
  const password = `A2ReviewEvidence-${randomBytes(24).toString('hex')}`
  secrets.push(password, status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY)
  const db = new Client({ connectionString: status.DB_URL }); await db.connect()
  try {
    const existing = await db.query('select id,email from auth.users')
    assert.equal(existing.rowCount, expected.length, 'Unexpected users in the disposable AG05 stack')
    for (const user of expected) {
      assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
      assert.ok(existing.rows.some(row => row.id === user.id && row.email === user.email))
    }
    const priorRows = async () => {
      const result: Record<string, unknown> = {}
      for (const table of priorTables) result[table] = (await db.query(
        `select to_jsonb(t) as row from ${table} t where user_id::text=any($1::text[]) order by to_jsonb(t)::text`,
        [expected.map(user => user.id)])).rows.map(row => row.row)
      return result
    }
    const prior = await priorRows()
    assert.equal((await db.query("select to_regclass('public.dtc_outcome_observations') as existing")).rows[0].existing, 'dtc_outcome_observations')
    for (const table of ['a4_verified_signals', 'a4_decision_log']) {
      assert.equal((await db.query('select to_regclass($1) as existing', [`public.${table}`])).rows[0].existing, null)
    }
    const migrations = migrationPaths.map(path => ({ path, sql: readFileSync(join(repo, path), 'utf8') }))
    for (let pass = 0; pass < 2; pass++) for (const item of migrations) await db.query(item.sql)
    const admin = createClient(status.API_URL, status.SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } })
    const checked = validateAndScoreDiscResponses(previous.ordinary)
    assert.ok(checked.valid && checked.value, 'Use the actual scorer and existing synthetic A1 bank')
    const a1 = checked.value!
    const users: Array<{ label: string; id: string; email: string; baselineId: string; followUpId: string;
      legacyId: string; signalId: string; openDecisionId: string; closedDecisionId: string }> = []
    for (const label of ['a2-review-evidence-desktop', 'a2-review-evidence-mobile', 'a2-review-evidence-persona', 'a2-review-evidence-locked']) {
      const email = `dtc-qa-${label}@example.invalid`
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true,
        user_metadata: { full_name: `QA sintético ${label}` } })
      assert.ok(!created.error && created.data.user, 'Failed to create a synthetic local evidence owner')
      const id = created.data.user!.id, fullHistory = !label.endsWith('-locked'), personal = label.endsWith('-persona')
      const refs = { baselineId: randomUUID(), followUpId: randomUUID(), legacyId: randomUUID(),
        signalId: randomUUID(), openDecisionId: randomUUID(), closedDecisionId: randomUUID() }
      users.push({ label, id, email, ...refs })
      await db.query('insert into public.users(id,email,full_name) values($1,$2,$3)', [id,email,`QA sintético ${label}`])
      await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered')", [id])
      await db.query(`insert into public.despega_user_profiles(user_id,onboarding_conozcamonos_1_completed,
        a1_cerebral_intro_seen,a1_cerebral_completed,a1_results_saved,a1_report_seen,conozcamonos_2_completed,
        a2_intro_seen,camino_foco,camino_persona_active,camino_profesional_active,a3_unlocked,a4_unlocked)
        values($1,true,true,true,true,true,true,true,$2,$3,$4,$5,$5)`,
        [id, personal ? 'persona' : 'profesional', personal, !personal, fullHistory])
      await db.query('select public.ensure_despega_journey_state($1)', [id])
      await db.query(`update public.despega_journey_state set current_module=$2,current_a2_day=$3,highest_a2_day_unlocked=$3,
        a1_completed_at=$4,a2_started_at=$5,a2_completed_at=$6,a3_unlocked_at=$7,a4_unlocked_at=$6,
        metadata=$8 where user_id=$1`, [id, fullHistory ? personal ? 'A2' : 'A4' : 'A2', fullHistory ? 90 : 1,
        daysAgo(110), daysAgo(105), fullHistory ? daysAgo(5) : null, fullHistory ? daysAgo(98) : null,
        { a2_horizon: fullHistory ? 90 : 30 }])
      await db.query('insert into public.a3_user_progress(user_id,completed_module_ids,total_xp) values($1,$2,0)',
        [id, fullHistory ? [...A3_MODULE_IDS] : []])
      await db.query(`insert into public.a3_route_progression(user_id,route_completed_at,current_module_number,total_completed)
        values($1,$2,$3,$4)`, [id, fullHistory ? daysAgo(5) : null, fullHistory ? 10 : 1, fullHistory ? 10 : 0])
      if (fullHistory) {
        await db.query(`insert into public.a2_user_task_completions(user_id,day,completed_at)
          select $1,day,$2::timestamptz from generate_series(1,90) day`, [id,daysAgo(6)])
        for (let index = 0; index < A3_MODULE_IDS.length; index++) await db.query(
          'insert into public.a3_module_completion(user_id,module_id,module_number,total_attempts,completed_at) values($1,$2,$3,1,$4)',
          [id,A3_MODULE_IDS[index],index+1,daysAgo(5)])
      }
      await db.query(`insert into public.a1_cerebral_assessment(user_id,questions,responses,disc_profile,dominant_pattern,secondary_pattern)
        values($1,$2,$3,$4,$5,$6)`, [id,JSON.stringify(a1.questions),a1.responses,a1.scores,a1.dominantPattern,a1.secondaryPattern])
      await db.query('insert into public.canon_conozcamonos_1_responses(user_id,responses,completed_at) values($1,$2,$3)',
        [id,{'4':`Objetivo sintético ${label}`,'6':['Tres horas semanales']},daysAgo(110)])
      await db.query('insert into public.canon_conozcamonos_2_responses(user_id,responses,completed_at) values($1,$2,$3)',
        [id,{'1':'Revisar una práctica con evidencias y decidir el siguiente intento','3':'Rol sintético','5':'Tres horas semanales'},daysAgo(105)])
      for (const role of ['baseline', 'follow_up'] as const) {
        const observationId = role === 'baseline' ? refs.baselineId : refs.followUpId
        const capture = parseOutcomeCapture({ observationId, instrumentKey: 'a3_structured_interview',
          instrumentVersion: '2-capture', outcomeKey: 'interview_capability', measurementRole: role,
          responsePayload: {
            behavioral: `Registro ${label} ${role}: describí una situación sintética y mi acción, pero falta comprobar el resultado.`,
            value_fit: `Registro ${label} ${role}: relacioné mi experiencia sintética con una necesidad y conservé una duda pendiente.`,
            challenge: `Registro ${label} ${role}: necesito practicar cómo explicar mi aporte con un ejemplo verificable y breve.`,
          } })
        const row = captureObservation(capture, id, daysAgo(role === 'baseline' ? 4 : 2))
        await db.query(`insert into public.dtc_outcome_observations(id,user_id,outcome_key,stage,measurement_role,
          instrument_key,instrument_version,score,score_scale_min,score_scale_max,dimensions,confidence,evidence_refs,response_payload,observed_at)
          values($1,$2,$3,$4,$5,$6,$7,null,null,null,'{}',null,$8,$9,$10)`,
          [row.id,row.user_id,row.outcome_key,row.stage,row.measurement_role,row.instrument_key,row.instrument_version,
            JSON.stringify(row.evidence_refs),row.response_payload,row.observed_at])
      }
      await db.query(`insert into public.dtc_outcome_observations(id,user_id,outcome_key,stage,measurement_role,instrument_key,
        instrument_version,score,score_scale_min,score_scale_max,dimensions,confidence,response_payload,observed_at)
        values($1,$2,'interview_capability','a3','follow_up','a3_structured_interview','1',100,0,100,
          '{"legacy_numeric_decoy":100}',1,'{"legacy":"NUMERIC_V1_DECOY_MUST_NOT_ENTER_AG05"}',$3)`, [refs.legacyId,id,daysAgo(1)])
      await db.query(`insert into public.a4_verified_signals(id,user_id,title,category,classification,summary,relevance,confidence,
        source_type,source_name,source_reference,source_date,source_verification_status,source_authority,created_at,updated_at)
        values($1,$2,'Señal sintética de práctica','personal_execution','hypothesis',
          'Observación sintética declarada para revisar una práctica; no acredita eficacia.',
          'Permite decidir qué revisar en el próximo intento sintético.',2,'direct_observation',
          'Bitácora sintética local','Registro declarado de laboratorio',$3,'not_applicable','documented_internal',$4,$4)`,
        [refs.signalId,id,calendarOffset(-4),daysAgo(4)])
      await db.query(`insert into public.a4_decision_log(id,user_id,signal_id,decision,rationale,expected_evidence,status,review_on,
        outcome,reviewed_at,review_classification,external_outcomes,created_at,updated_at)
        values($1,$2,$3,$4,'La prueba sintética requiere contrastar lo declarado con una observación posterior.',
          'Conservar una respuesta y una duda para revisar el siguiente intento.','reviewed',$5,
          'Observé una duda pendiente; todavía no tengo evidencia para concluir que la práctica ayudó.',$6,
          'inconclusive','["no_external_change"]',$7,$6)`,
        [refs.closedDecisionId,id,refs.signalId,`Revisar la práctica sintética de ${label}`,calendarOffset(-2),daysAgo(1),daysAgo(4)])
      await db.query(`insert into public.a4_decision_log(id,user_id,signal_id,decision,rationale,expected_evidence,status,review_on,
        created_at,updated_at) values($1,$2,$3,$4,'Una nueva revisión ayudará a decidir si conservar o cambiar la práctica.',
          'Registrar una observación concreta sin atribuirle una mejora de capacidad.','testing',$5,$6,$6)`,
        [refs.openDecisionId,id,refs.signalId,`Comprobar el próximo intento sintético de ${label}`,calendarOffset(0),daysAgo(2)])
    }
    for (const table of ['public.a2_reviewed_plans','dtc_private.a2_plan_revisions','dtc_private.a2_plan_receipts']) {
      assert.equal((await db.query(`select count(*)::integer as total from ${table} where user_id=any($1::uuid[])`,
        [users.map(user => user.id)])).rows[0].total, 0)
    }
    assert.deepEqual(await priorRows(), prior, 'AG05 setup preserves every prior owner source, progress, plan and receipt')
    await db.query("notify pgrst, 'reload schema'")
    writeFileSync(fixturePath, JSON.stringify({ scope: 'disposable-local-a2-review-evidence', users, password,
      previousOwners: expected.map(user => ({ id: user.id, email: user.email, label: user.label })) }), { mode: 0o600 })
    writeFileSync(join(evidence, 'a2-review-evidence-seed.json'), JSON.stringify({
      migrations: migrations.map(({path,sql}) => ({ path, sha256: createHash('sha256').update(sql).digest('hex') })),
      migrationSequenceAppliedTwice: true, newMigration: false, inheritedOutcomeVersion: '2-capture',
      syntheticAuthOwnersCreated: users.length, previousOwnersPreserved: expected.length,
      fullHistoryOwners: 3, syntheticA2DaysPerFullHistoryOwner: 90, syntheticA3ModulesPerFullHistoryOwner: A3_MODULE_IDS.length,
      eligibleProfessionalOwners: 2, personalHistoryOwner: 1, admittedA2WithoutA3A4: 1, qaEntitlements: 0,
      sourceRowsPerOwner: { a3UnscoredCaptures: 2, ignoredNumericV1: 1, a4Signals: 1, a4OpenDecisions: 1, a4ClosedDecisions: 1 },
      canonicalProgress: 'Synthetic full progression is access setup only, not a participant completion or ability result. All seven canonical tables are snapshotted afterwards.',
      initialPlans: 0, initialPlanReceipts: 0, remoteOperations: 0, verdict: 'PASS',
    }, null, 2))
    console.log('AG05 setup: existing A4 migrations twice, four fresh owners, dated raw evidence and explicit access fixtures; prior owners preserved.')
  } finally { await db.end() }
}
main().catch(error => { console.error('AG05 setup failed:', safeFailure(error, secrets)); process.exitCode = 1 })
