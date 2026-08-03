import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getActiveA3Module } from '../lib/a3/active-module'
import {
  SAMPLE_ANSWER_ARCHITECTURE,
  type AnswerArchitectureContext,
} from '../lib/a3/answer-architecture'
import { validateAnswerArchitectureSubmission } from '../lib/a3/answer-architecture-validation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

function words(label: string, count: number): string {
  return Array.from({ length: count }, () => label).join(' ')
}

const module = getActiveA3Module('answer-architecture')
assert.ok(module)
assert.equal(module.number, 5)
assert.equal(module.checkpointDay, 43)
assert.equal(module.xp, 120)
assert.equal(module.completionContract.enabled, true)
assert.equal(module.completionContract.passScore, 75)
assert.deepEqual(module.requiredPreviousModules, [
  'career-mirror',
  'value-mining-lab',
  'cv-builder-studio',
  'job-decoder',
])

const context: AnswerArchitectureContext = {
  jobTitle: 'Coordinador de Operaciones',
  company: 'TechNova',
  mustHaveRequirements: [
    'coordinación transversal',
    'seguimiento',
    'documentación',
  ],
  likelyQuestions: [
    '¿Cómo coordinas equipos con prioridades distintas?',
    'Cuéntame un desafío operacional complejo.',
  ],
  priorityKeywords: ['operaciones', 'riesgos', 'indicadores'],
  cvRole: 'Líder de Proyectos',
  cvKeywords: ['coordinación', 'procesos', 'documentación'],
  cvSkills: ['gestión de proyectos', 'seguimiento', 'liderazgo'],
  cvAchievements: [
    'Reduje atrasos mediante un sistema de seguimiento y responsables.',
  ],
  available: true,
}

const minimum = {
  selfIntroduction: words('experiencia', 35),
  motivation: words('motivación', 40),
  strengthEvidence: words('fortaleza', 45),
  challengeStar: `Situación ${words('contexto', 18)} Tarea ${words('responsabilidad', 18)} Acción ${words('ejecución', 20)} Resultado ${words('aprendizaje', 20)}`,
  whyHire: words('contribución', 35),
  timing30: words('mensaje', 25),
  timing45: words('mensaje', 45),
  timing60: words('mensaje', 65),
}

const empty = validateAnswerArchitectureSubmission(module, [], {}, context)
assert.equal(empty.passed, false)
assert.equal(empty.score, 0)

const minimumResult = validateAnswerArchitectureSubmission(module, [], minimum, context)
assert.equal(minimumResult.passed, true, minimumResult.errors.join('; '))
assert.equal(minimumResult.score, 75)

const strong = validateAnswerArchitectureSubmission(
  module,
  [],
  SAMPLE_ANSWER_ARCHITECTURE,
  context,
)
assert.equal(strong.passed, true, strong.errors.join('; '))
assert.equal(strong.score, 100)
assert.ok(strong.strengths.some((item) => item.includes('oferta verificada')))
assert.ok(strong.strengths.some((item) => item.includes('métricas')))

const weakStar = validateAnswerArchitectureSubmission(
  module,
  [],
  {
    ...minimum,
    challengeStar: words('relato', 80),
  },
  context,
)
assert.equal(weakStar.passed, false)
assert.ok(weakStar.errors.some((error) => error.includes('Situación')))

const invalidTiming = validateAnswerArchitectureSubmission(
  module,
  [],
  {
    ...minimum,
    timing30: words('mensaje', 45),
    timing45: words('mensaje', 45),
    timing60: words('mensaje', 45),
  },
  context,
)
assert.equal(invalidTiming.passed, false)
assert.ok(invalidTiming.errors.some((error) => error.includes('30, 45 y 60')))

const completionRoute = source('app/api/a3/module-completion/route.ts')
const contextRoute = source('app/api/a3/module-context/answer-architecture/route.ts')
const page = source('app/despega/a3/answer-architecture/page.tsx')
const studio = source('components/a3/answer-architecture-studio.tsx')
const activeModule = source('lib/a3/active-module.ts')

assert.ok(activeModule.includes("module.id === 'answer-architecture'"))
assert.ok(contextRoute.includes("checkA3ModuleAccess(\n    currentUser.id,\n    'answer-architecture'"))
assert.ok(contextRoute.includes(".in('module_id', ['cv-builder-studio', 'module-3'])"))
assert.ok(contextRoute.includes(".in('module_id', ['job-decoder', 'module-4'])"))
assert.ok(contextRoute.includes('extractAnswerArchitectureContext'))

const accessIndex = completionRoute.indexOf('checkA3ModuleAccess(')
const architectureIndex = completionRoute.indexOf("module.id === 'answer-architecture'")
const contextIndex = completionRoute.indexOf('extractAnswerArchitectureContext(')
const atomicIndex = completionRoute.indexOf("'complete_a3_module_atomic'")
assert.ok(accessIndex >= 0)
assert.ok(architectureIndex > accessIndex)
assert.ok(contextIndex > architectureIndex)
assert.ok(atomicIndex > contextIndex)
assert.ok(completionRoute.includes('validateAnswerArchitectureSubmission('))

assert.ok(page.includes("import { AnswerArchitectureStudio }"))
assert.ok(studio.includes("fetch('/api/a3/module-context/answer-architecture'"))
assert.ok(studio.includes('validateAnswerArchitectureSubmission'))
assert.ok(studio.includes("moduleId: 'answer-architecture'"))
assert.ok(studio.includes('window.localStorage.setItem'))
assert.ok(studio.includes('El borrador se guarda automáticamente'))
assert.ok(!studio.includes('/api/a3/save-module-progress'))
assert.ok(!studio.includes('xpEarned'))
assert.ok(!studio.includes('Back to A3'))
assert.ok(!studio.includes('Module 5 •'))

console.log(
  JSON.stringify({
    module: module.id,
    checkpointDay: module.checkpointDay,
    minimumScore: minimumResult.score,
    alignedScore: strong.score,
    verifiedCvAndOfferContext: true,
    starRequired: true,
    timingVariantsRequired: true,
    atomicCompletion: true,
    legacyWriterRemoved: true,
  }),
)
