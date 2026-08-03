import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getActiveA3Module } from '../lib/a3/active-module'
import {
  SAMPLE_COACH_PRACTICE,
  extractCoachPracticeContext,
} from '../lib/a3/coach-practice'
import { validateCoachPracticeSubmission } from '../lib/a3/coach-practice-validation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const module = getActiveA3Module('coach-practice-room')
assert.ok(module)
assert.equal(module.completionContract.enabled, true)
assert.equal(module.number, 6)
assert.equal(module.xp, 130)
assert.equal(module.checkpointDay, 51)
assert.equal(module.requiredPreviousModules.length, 5)

const minimum = {
  introOriginal:
    'Soy profesional de operaciones y he coordinado equipos diversos en proyectos exigentes. Me interesa seguir desarrollando procesos claros, mejorar la comunicación entre áreas y aportar una mirada estructurada a los desafíos del rol.',
  introImproved:
    'Soy profesional de operaciones con experiencia coordinando equipos comerciales y técnicos. Mi fortaleza es ordenar procesos complejos, anticipar riesgos y convertir decisiones en planes ejecutables. Busco aportar esa capacidad en un rol con mayor responsabilidad transversal.',
  introLearning:
    'La revisión abre con una identidad más precisa, elimina frases genéricas y cierra conectando mi experiencia con el tipo de responsabilidad que busco.',
  motivationOriginal:
    'Me interesa esta oportunidad porque quiero asumir nuevos desafíos, trabajar con equipos diversos y aprender de una organización que está creciendo. Creo que mi experiencia puede ser útil y también veo espacio para seguir desarrollándome.',
  motivationImproved:
    'Me interesa la oportunidad porque combina coordinación transversal, seguimiento de indicadores y mejora de procesos. Esa combinación se conecta con mi experiencia organizando proyectos complejos y puedo aportar estructura, documentación y continuidad desde el inicio.',
  motivationLearning:
    'La segunda versión reemplaza motivaciones generales por una conexión concreta entre las necesidades del rol y la contribución que puedo realizar desde mi experiencia.',
  challengeOriginal:
    'En un proyecto importante aparecieron atrasos y varias áreas tenían prioridades distintas. Mi responsabilidad fue ayudar a ordenar el trabajo. Coordiné reuniones, registré acuerdos y acompañé al equipo hasta recuperar el calendario. Finalmente logramos continuar y mejorar la comunicación.',
  challengeImproved:
    'Situación: un proyecto crítico acumulaba atrasos y las áreas no compartían una visión de las dependencias. Tarea: debía recuperar el control sin detener la operación. Acción: levanté riesgos, asigné responsables, definí hitos semanales y establecí una revisión ejecutiva breve. Resultado: el equipo recuperó el calendario y dejó un sistema reutilizable. Aprendizaje: hacer visibles las dependencias permite decidir antes y coordinar mejor.',
  challengeLearning:
    'La revisión separa situación, tarea, acciones propias, resultado y aprendizaje, transformando una historia general en una respuesta que permite evaluar mi contribución.',
}

const empty = validateCoachPracticeSubmission(module, [], {})
assert.equal(empty.passed, false)
assert.equal(empty.score, 0)

const minimumResult = validateCoachPracticeSubmission(module, [], minimum)
assert.equal(minimumResult.passed, true, minimumResult.errors.join('; '))
assert.equal(minimumResult.score, 75)

const context = extractCoachPracticeContext(
  {
    targetRole: 'Jefatura de Operaciones',
    targetKeywords: 'operaciones, indicadores, coordinación',
    skills: 'coordinación, análisis, liderazgo, documentación, mejora continua, comunicación',
    achievement1: 'Reduje 22% los atrasos mediante un sistema de seguimiento.',
    achievement2: 'Coordiné equipos comerciales y técnicos.',
    achievement3: 'Construí tableros de indicadores para la gerencia.',
  },
  {
    jobTitle: 'Jefatura de Operaciones',
    company: 'Empresa Demo',
    mustHaveRequirements:
      'Coordinación transversal\nSeguimiento de indicadores\nMejora de procesos',
    likelyQuestions:
      'Cuéntame sobre una coordinación compleja\n¿Cómo manejas prioridades distintas?',
    priorityKeywords: 'operaciones, indicadores, coordinación, mejora continua',
  },
  {
    selfIntroduction: SAMPLE_COACH_PRACTICE.introImproved,
    motivation: SAMPLE_COACH_PRACTICE.motivationImproved,
    challengeStar: SAMPLE_COACH_PRACTICE.challengeImproved,
  },
)

const strong = validateCoachPracticeSubmission(
  module,
  [],
  SAMPLE_COACH_PRACTICE,
  context,
)
assert.equal(strong.passed, true, strong.errors.join('; '))
assert.equal(strong.score, 100)
assert.ok(strong.strengths.some((item) => item.includes('contexto verificado')))
assert.ok(strong.strengths.some((item) => item.includes('cuantitativa')))

const shallowRevision = validateCoachPracticeSubmission(module, [], {
  ...minimum,
  introImproved: minimum.introOriginal,
})
assert.equal(shallowRevision.passed, false)
assert.ok(shallowRevision.errors.some((item) => item.includes('sustantiva')))

const weakStar = validateCoachPracticeSubmission(module, [], {
  ...minimum,
  challengeImproved:
    'El proyecto tenía atrasos, organicé reuniones y el equipo consiguió continuar. Después entendí que era importante conversar más y ordenar las tareas con anticipación para evitar nuevos problemas.',
})
assert.equal(weakStar.passed, false)
assert.ok(weakStar.errors.some((item) => item.includes('situación')))

const completionRoute = source('app/api/a3/module-completion/route.ts')
const contextRoute = source('app/api/a3/module-context/coach-practice-room/route.ts')
const page = source('app/despega/a3/coach-practice-room/page.tsx')
const studio = source('components/a3/coach-practice-room-studio.tsx')
const activeModule = source('lib/a3/active-module.ts')

assert.ok(activeModule.includes('COACH_PRACTICE_DELIVERABLE_KEYS'))
assert.ok(activeModule.includes("module.id === 'coach-practice-room'"))
assert.ok(completionRoute.includes('validateCoachPracticeSubmission'))
assert.ok(completionRoute.includes('extractCoachPracticeContext'))
assert.ok(completionRoute.includes(".in('module_id', ['answer-architecture', 'module-5'])"))
const accessIndex = completionRoute.indexOf('checkA3ModuleAccess(')
const validationIndex = completionRoute.indexOf('validateCoachPracticeSubmission(')
const atomicIndex = completionRoute.indexOf("'complete_a3_module_atomic'")
assert.ok(accessIndex >= 0 && validationIndex > accessIndex)
assert.ok(atomicIndex > validationIndex)

assert.ok(contextRoute.includes("'coach-practice-room'"))
assert.ok(contextRoute.includes(".from('a3_module_completion')"))
assert.ok(contextRoute.includes('extractCoachPracticeContext'))
assert.ok(page.includes("import { CoachPracticeRoomStudio }"))
assert.ok(studio.includes('useCoaching()'))
assert.ok(studio.includes("fetch('/api/a3/module-context/coach-practice-room'"))
assert.ok(studio.includes('validateCoachPracticeSubmission'))
assert.ok(studio.includes('completeA3Module({'))
assert.ok(studio.includes('formatCoachingFeedback'))
assert.ok(studio.includes('COACH_PRACTICE_DRAFT_KEY'))
assert.ok(studio.includes('El borrador se guarda automáticamente'))
assert.ok(!studio.includes('/api/a3/save-module-progress'))
assert.ok(!studio.includes('xpEarned'))
assert.ok(!studio.includes('Back to A3'))
assert.ok(!studio.includes('Module 6'))

console.log(
  JSON.stringify({
    module: module.id,
    checkpointDay: module.checkpointDay,
    minimumScore: minimumResult.score,
    alignedScore: strong.score,
    llmFeedbackOptional: true,
    verifiedPriorContext: true,
    atomicCompletion: true,
    legacyWriterRemoved: true,
  }),
)
