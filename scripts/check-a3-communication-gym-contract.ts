import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getActiveA3Module } from '../lib/a3/active-module'
import {
  SAMPLE_COMMUNICATION_GYM,
  extractCommunicationGymContext,
} from '../lib/a3/communication-gym'
import { validateCommunicationGymSubmission } from '../lib/a3/communication-gym-validation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const module = getActiveA3Module('communication-gym')
assert.ok(module)
assert.equal(module.completionContract.enabled, true)
assert.equal(module.number, 7)
assert.equal(module.xp, 140)
assert.equal(module.checkpointDay, 58)
assert.equal(module.requiredPreviousModules.length, 6)

const minimum = {
  introScript:
    'Soy profesional de operaciones con experiencia coordinando equipos comerciales y técnicos. Mi fortaleza es ordenar información compleja, anticipar riesgos y convertir decisiones en planes claros para equipos que necesitan continuidad y foco.',
  introDurationSeconds: 35,
  motivationScript:
    'Me interesa esta oportunidad porque combina coordinación transversal, seguimiento de indicadores y mejora de procesos. Esa combinación se conecta con mi experiencia organizando proyectos exigentes y puedo aportar estructura, documentación y continuidad desde el inicio.',
  motivationDurationSeconds: 48,
  pauseDurations: [2, 3, 4],
  paceAssessment: 'estable',
  clarityAssessment: 'comprensible',
  fillerAssessment: 'algunos',
  confidenceAssessment: 'media',
  endingAssessment: 'adecuado',
  improvementFocus:
    'Cerrar la respuesta con una contribución concreta y mantener un ritmo estable sin apresurar las ideas principales.',
  improvedScript:
    'Soy profesional de operaciones y convierto procesos complejos en planes claros. He coordinado equipos transversales, ordenado responsables y mejorado la continuidad de proyectos exigentes. Quiero aportar esa capacidad en un rol que necesita ejecución predecible y comunicación clara.',
  improvedDurationSeconds: 42,
  reflection:
    'La segunda entrega tuvo un cierre más concreto, pausas antes de las ideas principales y una velocidad más estable que facilitó comprender el mensaje completo.',
}

const empty = validateCommunicationGymSubmission(module, [], {})
assert.equal(empty.passed, false)
assert.equal(empty.score, 0)

const minimumResult = validateCommunicationGymSubmission(module, [], minimum)
assert.equal(minimumResult.passed, true, minimumResult.errors.join('; '))
assert.equal(minimumResult.score, 75)

const context = extractCommunicationGymContext(
  {
    introImproved: SAMPLE_COMMUNICATION_GYM.introScript,
    motivationImproved: SAMPLE_COMMUNICATION_GYM.motivationScript,
    challengeImproved:
      'Situación: un proyecto acumulaba atrasos. Acción: ordené responsables. Resultado: redujimos 22% los atrasos.',
  },
  {
    jobTitle: 'Jefatura de Operaciones',
    company: 'Empresa Demo',
    priorityKeywords: 'operaciones, indicadores, coordinación, mejora continua',
    mustHaveRequirements:
      'Coordinación transversal\nSeguimiento de indicadores\nComunicación ejecutiva',
  },
)

const strong = validateCommunicationGymSubmission(
  module,
  [],
  SAMPLE_COMMUNICATION_GYM,
  context,
)
assert.equal(strong.passed, true, strong.errors.join('; '))
assert.equal(strong.score, 100)
assert.ok(strong.strengths.some((item) => item.includes('contexto verificado')))
assert.ok(strong.strengths.some((item) => item.includes('cuantitativa')))

const invalidPauses = validateCommunicationGymSubmission(module, [], {
  ...minimum,
  pauseDurations: [1, 7, 3],
})
assert.equal(invalidPauses.passed, false)
assert.ok(invalidPauses.errors.some((item) => item.includes('pausas')))

const incompleteAssessment = validateCommunicationGymSubmission(module, [], {
  ...minimum,
  confidenceAssessment: '',
})
assert.equal(incompleteAssessment.passed, false)
assert.ok(incompleteAssessment.errors.some((item) => item.includes('ritmo')))

const invalidTiming = validateCommunicationGymSubmission(module, [], {
  ...minimum,
  introDurationSeconds: 70,
})
assert.equal(invalidTiming.passed, false)
assert.ok(invalidTiming.errors.some((item) => item.includes('20 y 45')))

const completionRoute = source('app/api/a3/module-completion/route.ts')
const contextRoute = source('app/api/a3/module-context/communication-gym/route.ts')
const page = source('app/despega/a3/communication-gym/page.tsx')
const studio = source('components/a3/communication-gym-studio.tsx')
const activeModule = source('lib/a3/active-module.ts')

assert.ok(activeModule.includes('COMMUNICATION_GYM_DELIVERABLE_KEYS'))
assert.ok(activeModule.includes("module.id === 'communication-gym'"))
assert.ok(completionRoute.includes('validateCommunicationGymSubmission'))
assert.ok(completionRoute.includes('extractCommunicationGymContext'))
assert.ok(completionRoute.includes(".in('module_id', ['coach-practice-room', 'module-6'])"))
const accessIndex = completionRoute.indexOf('checkA3ModuleAccess(')
const validationIndex = completionRoute.indexOf('validateCommunicationGymSubmission(')
const atomicIndex = completionRoute.indexOf("'complete_a3_module_atomic'")
assert.ok(accessIndex >= 0 && validationIndex > accessIndex)
assert.ok(atomicIndex > validationIndex)

assert.ok(contextRoute.includes("'communication-gym'"))
assert.ok(contextRoute.includes(".from('a3_module_completion')"))
assert.ok(contextRoute.includes('extractCommunicationGymContext'))
assert.ok(page.includes("import { CommunicationGymStudio }"))
assert.ok(studio.includes("fetch('/api/a3/module-context/communication-gym'"))
assert.ok(studio.includes('validateCommunicationGymSubmission'))
assert.ok(studio.includes('completeA3Module({'))
assert.ok(studio.includes('COMMUNICATION_GYM_DRAFT_KEY'))
assert.ok(studio.includes('No se guarda audio en este módulo'))
assert.ok(!studio.includes('/api/a3/save-module-progress'))
assert.ok(!studio.includes('xpEarned'))
assert.ok(!studio.includes('Back to A3'))
assert.ok(!studio.includes('Module 7'))

console.log(
  JSON.stringify({
    module: module.id,
    checkpointDay: module.checkpointDay,
    minimumScore: minimumResult.score,
    alignedScore: strong.score,
    honestTimedPractice: true,
    pauseDrillRequired: true,
    verifiedPriorContext: true,
    atomicCompletion: true,
    legacyWriterRemoved: true,
  }),
)
