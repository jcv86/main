import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getActiveA3Module } from '../lib/a3/active-module'
import { validateJobDecoderSubmission } from '../lib/a3/job-decoder-validation'
import { extractCvContext } from '../lib/a3/job-decoder'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const module = getActiveA3Module('job-decoder')
assert.ok(module)
assert.equal(module.completionContract.enabled, true)
assert.equal(module.number, 4)
assert.equal(module.xp, 100)
assert.equal(module.checkpointDay, 35)
assert.deepEqual(module.requiredPreviousModules, [
  'career-mirror',
  'value-mining-lab',
  'cv-builder-studio',
])

const longPosting =
  'Buscamos una persona para liderar operaciones, coordinar equipos comerciales y técnicos, controlar indicadores y mejorar procesos. Se requiere experiencia en proyectos, dominio de Excel, comunicación ejecutiva y capacidad de documentar decisiones. Se valorará experiencia tecnológica, automatización y metodologías Lean en un entorno dinámico.'

const minimum = {
  jobTitle: 'Jefatura de Operaciones',
  company: 'Empresa Demo',
  jobPosting: longPosting,
  mustHaveRequirements:
    'Experiencia liderando operaciones complejas\nDominio avanzado de herramientas de análisis\nCapacidad para coordinar equipos transversales',
  niceToHaveRequirements:
    'Experiencia en empresas tecnológicas\nConocimiento de metodologías de mejora continua',
  hiddenSignals:
    'El entorno dinámico implica autonomía y capacidad para priorizar bajo presión',
  strongMatches:
    'Coordinación transversal: lideré comités semanales con equipos comerciales, técnicos y de riesgo\nIndicadores de gestión: construí tableros ejecutivos para controlar volumen, tiempos y excepciones',
  partialMatches:
    'Mejora continua: he documentado y ajustado procesos, aunque no cuento con certificación formal',
  gapPlan:
    'Automatización: prepararé una evidencia de los flujos que optimicé y reforzaré ejemplos antes de postular',
  likelyQuestions:
    'Cuéntame sobre una ocasión en que coordinaste equipos con prioridades diferentes\n¿Qué indicadores utilizarías para controlar una operación de alto volumen?\n¿Cómo priorizas mejoras cuando existen varias urgencias simultáneas?',
  applicationAdjustments:
    'Mover al inicio del CV los logros relacionados con coordinación transversal\nIncorporar análisis e indicadores en el resumen profesional\nPreparar dos historias sobre autonomía y manejo de ambigüedad',
  priorityKeywords:
    'operaciones, coordinación, análisis, indicadores, mejora continua',
}

const empty = validateJobDecoderSubmission(module, [], {})
assert.equal(empty.passed, false)
assert.equal(empty.score, 0)

const minimumResult = validateJobDecoderSubmission(module, [], minimum)
assert.equal(minimumResult.passed, true, minimumResult.errors.join('; '))
assert.equal(minimumResult.score, 75)

const cvContext = extractCvContext({
  targetRole: 'Jefatura de Operaciones',
  targetKeywords: 'operaciones, Excel, indicadores',
  skills: 'Excel, coordinación, análisis, liderazgo, documentación, Lean',
  achievement1: 'Reduje 25% los tiempos de respuesta de una operación crítica.',
  achievement2: 'Coordiné equipos comerciales y técnicos en un proceso transversal.',
  achievement3: 'Construí tableros de indicadores para la gerencia.',
})
assert.equal(cvContext.available, true)

const strong = validateJobDecoderSubmission(
  module,
  [],
  {
    ...minimum,
    strongMatches:
      'Coordinación transversal: lideré comités semanales con 8 áreas comerciales, técnicas y de riesgo\nIndicadores de gestión: reduje 25% los tiempos de respuesta usando tableros ejecutivos',
    priorityKeywords:
      'operaciones, Excel, indicadores, coordinación, mejora continua',
  },
  { cvBuilder: cvContext },
)
assert.equal(strong.passed, true, strong.errors.join('; '))
assert.equal(strong.score, 100)
assert.ok(strong.strengths.some((item) => item.includes('CV aprobado')))
assert.ok(strong.strengths.some((item) => item.includes('cuantitativa')))

const weakClassification = validateJobDecoderSubmission(module, [], {
  ...minimum,
  mustHaveRequirements: 'Solo un requisito',
})
assert.equal(weakClassification.passed, false)
assert.ok(weakClassification.errors.some((item) => item.includes('Clasifica')))

const weakEvidence = validateJobDecoderSubmission(module, [], {
  ...minimum,
  strongMatches: 'Tengo experiencia\nTambién lo he hecho',
})
assert.equal(weakEvidence.passed, false)
assert.ok(weakEvidence.errors.some((item) => item.includes('mapa')))

const completionRoute = source('app/api/a3/module-completion/route.ts')
const contextRoute = source('app/api/a3/module-context/job-decoder/route.ts')
const page = source('app/despega/a3/job-decoder/page.tsx')
const studio = source('components/a3/job-decoder-studio.tsx')
const activeModule = source('lib/a3/active-module.ts')

assert.ok(activeModule.includes("module.id === 'job-decoder'"))
assert.ok(activeModule.includes('JOB_DECODER_DELIVERABLE_KEYS'))
assert.ok(activeModule.includes('enabled: true'))
assert.ok(completionRoute.includes('getActiveA3Module(body.moduleId)'))
assert.ok(completionRoute.includes('validateJobDecoderSubmission'))
assert.ok(completionRoute.includes(".in('module_id', ['cv-builder-studio', 'module-3'])"))
assert.ok(completionRoute.includes('extractCvContext(cvCompletion?.deliverable)'))
const accessIndex = completionRoute.indexOf('checkA3ModuleAccess(')
const validationIndex = completionRoute.indexOf('validateJobDecoderSubmission(')
const atomicIndex = completionRoute.indexOf("'complete_a3_module_atomic'")
assert.ok(accessIndex >= 0 && validationIndex > accessIndex)
assert.ok(atomicIndex > validationIndex)

assert.ok(contextRoute.includes(".from('a3_module_completion')"))
assert.ok(contextRoute.includes('extractCvContext(data?.deliverable)'))
assert.ok(page.includes("import { JobDecoderStudio }"))
assert.ok(studio.includes("fetch('/api/a3/module-context/job-decoder'"))
assert.ok(studio.includes('validateJobDecoderSubmission'))
assert.ok(studio.includes('completeA3Module({'))
assert.ok(studio.includes('JOB_DECODER_DRAFT_KEY'))
assert.ok(!studio.includes('/api/a3/save-module-progress'))
assert.ok(!studio.includes("router.push('/despega/a3?completed=job-decoder')"))
assert.ok(!studio.includes('Back to A3'))
assert.ok(!studio.includes('Module 4'))

console.log(
  JSON.stringify({
    module: module.id,
    checkpointDay: module.checkpointDay,
    minimumScore: minimumResult.score,
    alignedScore: strong.score,
    verifiedCvContext: true,
    atomicCompletion: true,
    legacyWriterRemoved: true,
  }),
)
