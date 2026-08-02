import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  A3_MODULES,
  A3_MODULE_IDS,
  A3_TOTAL_XP,
  getA3Module,
  normalizeA3ModuleId,
} from '../lib/a3/module-catalog'
import { validateA3ModuleSubmission } from '../lib/a3/module-validation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

assert.equal(A3_MODULES.length, 10)
assert.equal(new Set(A3_MODULE_IDS).size, 10)
assert.equal(A3_TOTAL_XP, 1340)
assert.deepEqual(
  A3_MODULES.map((module) => module.number),
  Array.from({ length: 10 }, (_, index) => index + 1),
)
assert.deepEqual(
  A3_MODULES.map((module) => module.checkpointDay),
  [7, 16, 27, 35, 43, 51, 58, 68, 78, 88],
)
assert.equal(normalizeA3ModuleId('value-mining-lab-coach'), 'value-mining-lab')
assert.equal(normalizeA3ModuleId('module-1'), 'career-mirror')
assert.equal(normalizeA3ModuleId('unknown'), null)

for (const module of A3_MODULES) {
  assert.ok(module.title.length >= 5)
  assert.ok(module.xp > 0)
  assert.equal(module.requiredPreviousModules.length, module.number - 1)
  assert.ok(module.route.startsWith('/despega/a3/'))
}

const long = (label: string) =>
  `${label} con contexto profesional, una decisión concreta y evidencia observable para utilizar en entrevistas futuras.`

const activeCases = [
  {
    id: 'career-mirror',
    responses: [
      long('Dirección de carrera'),
      long('Identidad profesional'),
      long('Valores centrales'),
      long('Marca profesional'),
    ],
    deliverable: (responses: readonly string[]) => ({
      careerDirection: responses[0],
      professionalIdentity: responses[1],
      coreValues: responses[2],
      personalBrand: responses[3],
    }),
  },
  {
    id: 'value-mining-lab',
    responses: [
      long('Valor del proyecto'),
      long('Valor crítico'),
      long('Aplicación futura'),
      long('Siguiente acción'),
    ],
    deliverable: (responses: readonly string[]) => ({
      projectValue: responses[0],
      criticalValue: responses[1],
      futureApplication: responses[2],
      nextAction: responses[3],
    }),
  },
] as const

for (const testCase of activeCases) {
  const module = getA3Module(testCase.id)
  assert.ok(module)
  assert.equal(module.completionContract.enabled, true)
  assert.equal(module.trainingType, 'coach')

  const empty = validateA3ModuleSubmission(module, [], {})
  assert.equal(empty.passed, false)
  assert.equal(empty.score, 0)

  const valid = validateA3ModuleSubmission(
    module,
    [...testCase.responses],
    testCase.deliverable(testCase.responses),
  )
  assert.equal(valid.passed, true, valid.errors.join('; '))
  assert.equal(valid.score, 100)

  const mismatched = validateA3ModuleSubmission(
    module,
    [...testCase.responses],
    {
      ...testCase.deliverable(testCase.responses),
      [module.completionContract.requiredDeliverableKeys[0]]: long('Contenido distinto'),
    },
  )
  assert.equal(mismatched.passed, false)
  assert.ok(mismatched.errors.some((error) => error.includes('exactamente')))
}

for (const module of A3_MODULES.slice(2)) {
  assert.equal(module.completionContract.enabled, false)
  const result = validateA3ModuleSubmission(module, [long('Respuesta')], {})
  assert.equal(result.passed, false)
  assert.ok(result.errors.some((error) => error.includes('todavía')))
}

const checkpointMap = source('lib/a3-checkpoint-map.ts')
const completionRoute = source('app/api/a3/module-completion/route.ts')
const progressRoute = source('app/api/a3/user-progress/route.ts')
const clientHelper = source('lib/a3/client-completion.ts')
const coachSession = source('components/a3/verified-coach-session.tsx')
const careerPage = source('app/despega/a3/career-mirror-coach/page.tsx')
const valuePage = source('app/despega/a3/value-mining-lab-coach/page.tsx')

assert.ok(checkpointMap.includes('A3_MODULES.map'))
assert.ok(!checkpointMap.includes("moduleId: 'career-mirror'"))
assert.ok(completionRoute.includes('getA3Module(body.moduleId)'))
assert.ok(completionRoute.includes('validateA3ModuleSubmission'))
assert.ok(completionRoute.includes('score: validation.score'))
assert.ok(completionRoute.includes('bestScore'))
assert.ok(completionRoute.includes("code: 'A3_COMPLETION_CONTRACT_NOT_READY'"))
assert.ok(!completionRoute.includes('best_score: 100'))
assert.ok(!completionRoute.includes('score: 100'))
assert.ok(progressRoute.includes('A3_TOTAL_XP'))
assert.ok(progressRoute.includes('A3_MODULE_IDS'))
assert.ok(clientHelper.includes("credentials: 'include'"))
assert.ok(coachSession.includes('completeA3Module({'))
assert.ok(coachSession.includes("setError('Desarrolla tu respuesta con al menos 20 caracteres.')"))
assert.ok(coachSession.includes('if (completed)'))
assert.ok(careerPage.includes('moduleId="career-mirror"'))
assert.ok(careerPage.includes('moduleNumber={1}'))
assert.ok(valuePage.includes('moduleId="value-mining-lab"'))
assert.ok(valuePage.includes('moduleNumber={2}'))
assert.ok(!valuePage.includes('value-mining-lab-coach'))

console.log(
  JSON.stringify({
    modules: A3_MODULES.length,
    totalXp: A3_TOTAL_XP,
    verifiedActiveModules: activeCases.map((item) => item.id),
    fixedScoreRemoved: true,
    canonicalCatalog: true,
  }),
)
