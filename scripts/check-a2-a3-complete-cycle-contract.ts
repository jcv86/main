import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'
import { A3_CHECKPOINT_MAP } from '../lib/a3-checkpoint-map'
import { A3_MODULES } from '../lib/a3/module-catalog'
import { getActiveA3Module } from '../lib/a3/active-module'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const checkpointDays = [7, 16, 27, 35, 43, 51, 58, 68, 78, 88]
assert.deepEqual(A3_MODULES.map((module) => module.checkpointDay), checkpointDays)

for (const module of A3_MODULES) {
  const checkpoint = A3_CHECKPOINT_MAP[module.checkpointDay]
  const mission = A2_DAILY_MISSIONS[module.checkpointDay]
  const active = getActiveA3Module(module.id)

  assert.ok(active, `${module.id}: active module`)
  assert.equal(active.completionContract.enabled, true, `${module.id}: completion enabled`)
  assert.equal(checkpoint.moduleId, module.id, `${module.id}: checkpoint identity`)
  assert.equal(checkpoint.route, module.route, `${module.id}: checkpoint route`)
  assert.equal(mission.missionType, 'a3_checkpoint', `${module.id}: A2 mission type`)
  assert.equal(mission.a3Checkpoint?.moduleId, module.id, `${module.id}: A2 module identity`)
  assert.deepEqual(
    mission.unlockRequirements.requiredCompletedA3Modules || [],
    module.requiredPreviousModules,
    `${module.id}: canonical prerequisites`,
  )

  const guardedRoute = module.id === 'career-mirror'
    ? '/despega/a3/career-mirror-coach'
    : module.id === 'value-mining-lab'
      ? '/despega/a3/value-mining-lab-coach'
      : module.route
  const pagePath = `app${guardedRoute}/page.tsx`
  assert.equal(existsSync(join(process.cwd(), pagePath)), true, `${module.id}: route exists`)
  const page = source(pagePath)
  assert.ok(page.includes('A3ModuleAccessGate'), `${module.id}: server access gate`)
  assert.ok(page.includes(`moduleId="${module.id}"`), `${module.id}: guarded identity`)
}

const completeDay = source('app/api/a2/complete-day/route.ts')
const dayState = source('app/api/a2/day-state/[day]/route.ts')
const completion = source('app/api/a3/module-completion/route.ts')
const clientCompletion = source('lib/a3/client-completion.ts')
const template = source('components/a2-day-page-template.tsx')
const overview = source('components/a3/a3-route-overview.tsx')
const verifiedCoach = source('components/a3/verified-coach-session.tsx')
const cvBuilder = source('components/a3/cv-builder-studio.tsx')
const answerArchitecture = source('components/a3/answer-architecture-studio.tsx')

assert.ok(completeDay.includes('mission.a3Checkpoint.moduleId'))
assert.ok(completeDay.includes('missingA3Modules'))
assert.ok(dayState.includes('completed: missingA3Modules.length === 0'))
assert.ok(completion.includes('checkA3ModuleAccess'))
assert.ok(completion.indexOf('checkA3ModuleAccess') < completion.indexOf("rpc(\n      'complete_a3_module_atomic'"))
assert.ok(completion.includes('validateA3ModuleSubmission'))
assert.ok(completion.includes('isAtomicCompletionResult'))
assert.ok(clientCompletion.includes("moduleId === 'risk-difficult-questions-lab'"))
assert.ok(clientCompletion.includes("moduleId === 'basic-interview-mission'"))

assert.ok(template.includes('${checkpoint.route}?from=/despega/a2/dia-${dayNumber}'))
assert.ok(template.includes('Ya lo completé: verificar'))
assert.ok(verifiedCoach.includes('/despega/a2/dia-${checkpointDay}'))
assert.ok(cvBuilder.includes('/despega/a2/dia-${module.checkpointDay}'))
assert.ok(answerArchitecture.includes('/despega/a2/dia-${MODULE.checkpointDay}'))
assert.ok(overview.includes('/despega/a2/dia-${completedModule.checkpointDay}'))

for (const moduleId of [
  'job-decoder',
  'coach-practice-room',
  'communication-gym',
  'first-recruiter-simulation',
  'risk-difficult-questions-lab',
  'basic-interview-mission',
]) {
  const studioName = moduleId === 'risk-difficult-questions-lab'
    ? 'difficult-questions'
    : moduleId
  const studio = source(`components/a3/${studioName}-studio.tsx`)
  assert.ok(studio.includes(`completed=${moduleId}`), `${moduleId}: completion notice redirect`)
}

console.log(JSON.stringify({
  evidenceLevel: 'source_and_runtime_module',
  checkpointDays,
  a2Checkpoints: checkpointDays.length,
  activeA3Modules: A3_MODULES.length,
  guardedA3Routes: A3_MODULES.length,
  atomicPersistenceBoundary: true,
  canonicalPrerequisites: true,
  checkpointReturnCoverage: A3_MODULES.length,
}))
