import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { A3_CHECKPOINT_MAP } from '../lib/a3-checkpoint-map'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'
import {
  requiresUniversalA2Submission,
  validateA2MissionSubmission,
} from '../lib/a2/day-submission'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const configuredDays = Object.keys(A2_DAILY_MISSIONS)
  .map(Number)
  .sort((left, right) => left - right)

assert.deepEqual(
  configuredDays,
  Array.from({ length: 90 }, (_, index) => index + 1),
  'A2 must define one mission for every day from 1 to 90',
)

const slugs = new Set<string>()
for (let day = 1; day <= 90; day += 1) {
  const mission = A2_DAILY_MISSIONS[day]
  assert.equal(mission.day, day)
  assert.equal(mission.slug, `dia-${day}`)
  assert.ok(mission.title.trim().length >= 5, `Day ${day} needs a title`)
  assert.ok(mission.subtitle.trim().length >= 5, `Day ${day} needs a subtitle`)
  assert.ok(mission.userGoal.trim().length >= 20, `Day ${day} needs a user goal`)
  assert.ok(mission.whyItMatters.trim().length >= 20, `Day ${day} needs rationale`)
  assert.ok(mission.instructions.length >= 3, `Day ${day} needs executable steps`)
  assert.ok(mission.deliverable.trim().length >= 10, `Day ${day} needs a deliverable`)
  assert.ok(mission.estimatedMinutes.min > 0)
  assert.ok(mission.estimatedMinutes.max >= mission.estimatedMinutes.min)
  assert.ok(!slugs.has(mission.slug), `Duplicate slug ${mission.slug}`)
  slugs.add(mission.slug)

  if (day > 1) {
    assert.equal(
      mission.unlockRequirements.requiredPreviousDay,
      day - 1,
      `Day ${day} must require the immediately previous day`,
    )
    assert.equal(mission.unlockRequirements.requiresDay1Passed, true)
  }

  const checkpoint = A3_CHECKPOINT_MAP[day]
  if (checkpoint) {
    assert.equal(mission.missionType, 'a3_checkpoint')
    assert.equal(mission.a3Checkpoint?.moduleId, checkpoint.moduleId)
    const validation = validateA2MissionSubmission(mission, {})
    assert.equal(validation.mode, 'checkpoint')
    assert.equal(validation.passed, true)
    assert.equal(requiresUniversalA2Submission(mission), false)
    continue
  }

  if (day >= 11) {
    assert.equal(requiresUniversalA2Submission(mission), true)

    const emptyValidation = validateA2MissionSubmission(mission, {})
    assert.equal(emptyValidation.passed, false, `Day ${day} must reject empty evidence`)
    assert.ok(emptyValidation.errors.length >= 3)

    const validValidation = validateA2MissionSubmission(mission, {
      summary:
        'Completé la misión siguiendo cada paso y organicé el resultado para que pueda reutilizarse en mi avance profesional. '.repeat(3),
      evidence:
        'La evidencia incluye decisiones, ejemplos, resultados observables y un entregable concreto conectado con el objetivo del día. '.repeat(3),
      reflection:
        'Aprendí qué debo mantener, qué debo corregir y cuál será el siguiente ajuste que aplicaré en la ruta. '.repeat(2),
      metrics:
        'Registré cantidad, resultado, respuesta obtenida y siguiente acción para medir el efecto real.',
      artifactUrl: 'https://example.com/a2-deliverable',
      completedInstructions: mission.instructions.map((_, index) => index),
    })

    assert.equal(
      validValidation.passed,
      true,
      `Day ${day} must accept complete structural evidence: ${validValidation.errors.join('; ')}`,
    )
    assert.ok(validValidation.score >= validValidation.passScore)
  }
}

assert.deepEqual(
  configuredDays.filter((day) => A2_DAILY_MISSIONS[day].missionType === 'a3_checkpoint'),
  Object.keys(A3_CHECKPOINT_MAP).map(Number).sort((left, right) => left - right),
  'A2 checkpoint days must match the canonical A3 map',
)

const completeDayRoute = source('app/api/a2/complete-day/route.ts')
const migration = source('migrations/03-a2-mission-evidence.sql')
const dayTemplate = source('components/a2-day-page-template.tsx')
const missionWorkspace = source('components/a2-generic-mission-workspace.tsx')
const clientCompletion = source('lib/a2/client-completion.ts')

assert.ok(completeDayRoute.includes("import { A2_DAILY_MISSIONS }"))
assert.ok(completeDayRoute.includes('requiredPreviousDay'))
assert.ok(completeDayRoute.includes('requiredCompletedA3Modules'))
assert.ok(completeDayRoute.includes('mission.a3Checkpoint.moduleId'))
assert.ok(completeDayRoute.includes('validateA2MissionSubmission(mission, submission)'))
assert.ok(completeDayRoute.includes("validation_status: validationStatus"))
assert.ok(completeDayRoute.includes("validation_result: persistedValidation"))
assert.ok(
  completeDayRoute.indexOf('validateA2MissionSubmission(mission, submission)') <
    completeDayRoute.indexOf(".from('a2_user_task_completions').insert"),
  'Mission evidence must be validated before completion is inserted',
)

for (const column of [
  'mission_type',
  'submission',
  'validation_status',
  'validation_result',
]) {
  assert.ok(migration.includes(column), `Migration must add ${column}`)
}

assert.ok(dayTemplate.includes('A2GenericMissionWorkspace'))
assert.ok(dayTemplate.includes('requiresUniversalA2Submission(mission)'))
assert.ok(dayTemplate.includes('validateA2MissionSubmission(mission, submission)'))
assert.ok(dayTemplate.includes('completeA2Day(dayNumber,'))
assert.ok(dayTemplate.includes('needsEvidence ? submission : undefined'))
assert.ok(dayTemplate.includes('completionDisabled'))
assert.ok(dayTemplate.includes('!liveValidation.passed'))
assert.ok(dayTemplate.includes('window.localStorage.setItem(draftKey'))
assert.ok(dayTemplate.includes('window.localStorage.removeItem(draftKey)'))
assert.ok(dayTemplate.includes('Validar checkpoint'))
assert.ok(!dayTemplate.includes('completeA2Day(dayNumber)'))

for (const requiredField of [
  'completedInstructions',
  'summary',
  'evidence',
  'reflection',
  'artifactUrl',
]) {
  assert.ok(
    missionWorkspace.includes(requiredField),
    `Workspace must expose ${requiredField}`,
  )
}
assert.ok(missionWorkspace.includes("mission.missionType === 'field_action'"))
assert.ok(missionWorkspace.includes('validation.criteria.map'))
assert.ok(clientCompletion.includes('submission?: unknown'))
assert.ok(clientCompletion.includes('submission: asObject(submission)'))

console.log(
  JSON.stringify({
    configuredDays: configuredDays.length,
    checkpointDays: Object.keys(A3_CHECKPOINT_MAP).map(Number),
    universalEvidenceDays: configuredDays.filter((day) =>
      requiresUniversalA2Submission(A2_DAILY_MISSIONS[day]),
    ).length,
    serverPrerequisiteGate: true,
    evidencePersistence: true,
    universalWorkspace: true,
    localDrafts: true,
  }),
)
