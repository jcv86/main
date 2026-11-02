import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'
import { missionForA2Path, resolveA2PracticePath } from '../lib/a2/practice-path'
import { validateA2MissionSubmission } from '../lib/a2/day-submission'
import { adjustmentRequestSchema, adjustmentContent, readAdjustmentContent, A2_BARRIERS } from '../lib/a2/practice-adjustment'
import { buildA2CycleReview } from '../lib/a2/cycle-review'
import { scoreDay1Submission } from '../lib/a2-dtc-scoring'
import { groundPracticeFeedback } from '../lib/a3/practice-feedback'
import { getA3Module } from '../lib/a3/module-catalog'
import { validateA3ModuleSubmission } from '../lib/a3/module-validation'
import { buildCvBuilderDeliverable, buildCvPlainText, CV_BUILDER_CRITICAL_ATS_IDS, EMPTY_CV_BUILDER_STATE, normalizeCvBuilderState } from '../lib/a3/cv-builder'

assert.equal(resolveA2PracticePath({ camino_foco: 'persona', disc: 'D', targetRole: 'Gerente' }), 'persona')
assert.equal(resolveA2PracticePath({ camino_foco: 'profesional', objective: 'Quiero organizar mi vida' }), 'profesional')
assert.equal(resolveA2PracticePath({ disc: 'S', targetRole: 'personal' }), 'ambos')
assert.equal(resolveA2PracticePath({ camino_persona_active: true, camino_profesional_active: false }), 'persona')
assert.equal(resolveA2PracticePath(null), 'ambos')

const evidence = { summary: 'Practiqué una pausa.', evidence: 'Anoté lo ocurrido.', reflection: 'Repetiré mañana.', metrics: 'Pude escuchar antes de responder.', artifactUrl: '', completedInstructions: [0, 1, 2] }
for (let day = 1; day <= 90; day++) {
  const base = A2_DAILY_MISSIONS[day]
  assert.ok(base)
  assert.equal(missionForA2Path(base, 'profesional'), base, 'Existing professional curriculum must remain the source.')
  const personal = missionForA2Path(base, 'persona')
  assert.equal(personal.practiceTrack, 'persona')
  assert.equal(personal.a3Checkpoint, undefined, `Personal day ${day} must not require CV/interview training.`)
  assert.deepEqual(personal.unlockRequirements.requiredCompletedA3Modules, undefined)
  assert.equal(personal.unlockRequirements.requiredPreviousDay, day === 1 ? undefined : day - 1)
  assert.equal(validateA2MissionSubmission(personal, evidence).passed, true)
  assert.equal(validateA2MissionSubmission(personal, {}).passed, false, 'Personal mode must still require a deliverable.')
  const longer = validateA2MissionSubmission(personal, { ...evidence, summary: evidence.summary.repeat(20), metrics: '999999' })
  assert.equal(longer.score, validateA2MissionSubmission(personal, evidence).score, 'Length and digits must not buy a higher assessment.')
}
assert.equal(validateA2MissionSubmission(missionForA2Path(A2_DAILY_MISSIONS[3], 'persona'), { ...evidence, completedInstructions: [] }).passed, false)
assert.equal(validateA2MissionSubmission(missionForA2Path(A2_DAILY_MISSIONS[3], 'persona'), { ...evidence, artifactUrl: 'javascript:alert(1)' }).passed, false)

const records = Array.from({ length: 30 }, (_, index) => ({ day: index + 1, missionType: 'builder', validationStatus: 'structural', score: 100, hasEvidence: true, completedAt: '2026-11-02T12:00:00Z' }))
const personalClosure = buildA2CycleReview(30, records, 'persona')
assert.equal(personalClosure.status, 'ready_to_extend')
assert.equal(personalClosure.checkpointsRequired, 0)
assert.equal(personalClosure.gaps.some((gap) => gap.includes('Entrenamiento')), false)
assert.equal([...personalClosure.strengths, ...personalClosure.gaps].some((item) => item.includes('/100')), false)

const day1 = { userId: 'owner', submissionId: '1', visionRole: 'Aprender', visionDesiredOutcome: 'Practicar', visionEnvironment: 'En casa', milestoneDay10: 'Revisar', milestoneDay20: 'Repetir', milestoneDay30: 'Comparar', actionPlan: { first: 'Leer' }, createdAt: new Date() }
assert.equal(scoreDay1Submission(day1).passed, true)
assert.equal(scoreDay1Submission({ ...day1, visionRole: day1.visionRole.repeat(30) }).totalScore, scoreDay1Submission(day1).totalScore)
assert.equal(scoreDay1Submission({ ...day1, actionPlan: { first: '', roadmap: null } }).passed, false)

const adjustment = { requestId: '52ed39eb-7a08-47cb-91ec-54ec65da098e', dayNumber: 3, outcome: 'could_not' as const, barrier: 'time' as const, retainedWork: 'Conservo la observación de ayer.', nextAction: 'Observaré una situación durante diez minutos.', reviewDate: '2026-11-03', draft: evidence }
assert.equal(adjustmentRequestSchema.safeParse(adjustment).success, true)
assert.equal(adjustmentRequestSchema.safeParse({ ...adjustment, user_id: 'another-owner' }).success, false)
assert.equal(adjustmentRequestSchema.safeParse({ ...adjustment, outcome: 'done' }).success, false, 'Only complete-day may mark a task complete.')
assert.equal(adjustmentRequestSchema.safeParse({ ...adjustment, nextAction: '' }).success, false)
assert.equal(adjustmentRequestSchema.safeParse({ ...adjustment, reviewDate: '2026-02-30' }).success, false)
const preserved = adjustmentContent(adjustment)
assert.deepEqual(preserved.draft, evidence)
assert.equal(preserved.suggestion, A2_BARRIERS.time.suggestion)
assert.deepEqual(readAdjustmentContent(JSON.stringify(preserved)), preserved)
assert.equal(readAdjustmentContent('{bad JSON'), null)

const cv = normalizeCvBuilderState({ ...EMPTY_CV_BUILDER_STATE, fullName: 'Ana Pérez', email: 'ana@example.test', targetRole: 'Área de análisis', professionalSummary: 'Estoy aprendiendo análisis con proyectos de mi curso.', evidenceKind: 'education', skills: 'Hojas de cálculo', education: 'Curso de análisis, Aula local, 2026', atsChecklist: CV_BUILDER_CRITICAL_ATS_IDS, factsConfirmed: true, pendingFacts: 'Confirmar fecha exacta del siguiente curso.' })
const cvModule = getA3Module('cv-builder-studio')!
const validation = validateA3ModuleSubmission(cvModule, [], buildCvBuilderDeliverable(cv))
assert.equal(validation.passed, true, validation.errors.join('; '))
assert.equal(validateA3ModuleSubmission(cvModule, [], buildCvBuilderDeliverable({ ...cv, factsConfirmed: false })).passed, false)
assert.equal(validateA3ModuleSubmission(cvModule, [], buildCvBuilderDeliverable({ ...cv, experienceTitle: 'Gerente' })).passed, false, 'A partial invented-looking role must remain pending; education mode cannot hide incomplete experience fields.')
assert.throws(() => buildCvPlainText({ ...cv, factsConfirmed: false }))
const exported = buildCvPlainText(cv)
assert.ok(exported.includes(cv.education))
assert.ok(exported.includes(cv.professionalSummary))
assert.ok(!exported.includes(cv.pendingFacts))
assert.ok(!exported.includes('Empresa'))
assert.ok(!exported.includes('Logro'))
assert.equal(validateA3ModuleSubmission(cvModule, [], buildCvBuilderDeliverable({ ...cv, professionalSummary: cv.professionalSummary.repeat(15), skills: 'Hojas de cálculo, Liderazgo, SQL, Ventas, Python, Inglés' })).score, validation.score, 'Extra words and skills must not increase a quality score.')

const answer = 'En mi curso organicé las tareas de un proyecto. No medimos el resultado.'
const grounded = groundPracticeFeedback({ criterion: 'evidence', quote: 'No medimos el resultado.' }, answer)
assert.ok(grounded)
assert.equal(grounded.source, 'user_answer')
assert.equal(grounded.assessmentKind, 'practice_guidance')
assert.ok(grounded.action.includes('no inventes'))
assert.equal(groundPracticeFeedback({ criterion: 'evidence', quote: 'Reduje los retrasos 22%.' }, answer), null)
assert.equal(groundPracticeFeedback({ criterion: 'evidence', quote: 'En mi curso', rewrite: 'Fui gerente durante diez años' }, answer), null)
assert.equal(groundPracticeFeedback({ criterion: 'personality', quote: 'En mi curso' }, answer), null)
assert.equal(groundPracticeFeedback({ criterion: 'clarity', quote: '' }, answer), null)

const adjustmentRoute = readFileSync('app/api/a2/practice-adjustments/route.ts', 'utf8')
assert.ok(adjustmentRoute.includes('user_id: user.id'))
assert.ok(adjustmentRoute.includes(".eq('user_id', user.id)"))
assert.ok(adjustmentRoute.includes('createClient()'))
assert.ok(!adjustmentRoute.includes('createAdminClient'))
assert.ok(!adjustmentRoute.includes('.update('))
assert.ok(!adjustmentRoute.includes('.upsert('))
assert.ok(!adjustmentRoute.includes(".from('a2_user_task_completions')"))
assert.ok(adjustmentRoute.includes('readBoundedJson'))
assert.ok(!readFileSync('app/api/a3/gamification/route.ts', 'utf8').includes('Experto'))
assert.ok(!readFileSync('components/a3/answer-architecture-studio.tsx', 'utf8').includes('setDraft(SAMPLE_ANSWER_ARCHITECTURE)'))

console.log(JSON.stringify({ evidenceLevel: 'runtime_pure_contracts_and_source_boundaries', personalDaysChecked: 90, evidenceRequired: true, noLengthOrMetricReward: true, exactUserQuoteRequired: true, fabricatedCoachQuoteRejected: true, cvExportPreservesUserFacts: true, incompleteFactsStayPending: true, adjustmentPreservesDraft: true, liveDatabaseAndProviderCalls: false }))
