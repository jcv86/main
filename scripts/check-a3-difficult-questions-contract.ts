import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getActiveA3Module } from '../lib/a3/active-module'
import {
  REQUIRED_RED_FLAG_CHECKS,
  SAMPLE_DIFFICULT_QUESTIONS_DRAFT,
  extractDifficultQuestionsContext,
} from '../lib/a3/difficult-questions'
import { validateDifficultQuestionsSubmission } from '../lib/a3/difficult-questions-validation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const module = getActiveA3Module('risk-difficult-questions-lab')
assert.ok(module)
assert.equal(module.completionContract.enabled, true)
assert.equal(module.number, 9)
assert.equal(module.xp, 170)
assert.equal(module.checkpointDay, 78)
assert.equal(module.requiredPreviousModules.length, 8)

const minimum = {
  riskPlans: [
    {
      riskId: 'experience-gap',
      facts:
        'No he tenido el cargo formal de jefatura, aunque he coordinado equipos y proyectos con varias áreas durante mi trayectoria.',
      accountability:
        'Reconozco que todavía debo profundizar la gestión formal de desempeño y las conversaciones de desarrollo con colaboradores.',
      learning:
        'He aprendido a definir responsables, resolver bloqueos y mantener seguimiento frecuente sin concentrar todas las decisiones.',
      readyNow:
        'Estoy preparado para asumir mayor responsabilidad con estructura, apertura a retroalimentación y criterios claros de trabajo.',
      fullAnswer:
        'No he tenido formalmente el cargo de jefatura, aunque he coordinado equipos y proyectos transversales. Reconozco que todavía debo profundizar la gestión formal de desempeño. He aprendido a definir responsables, resolver bloqueos y mantener seguimiento frecuente. Hoy estoy preparado para asumir mayor responsabilidad con estructura, apertura a retroalimentación y criterios claros.',
    },
    {
      riskId: 'weakness',
      facts:
        'Antes revisaba en exceso algunos entregables importantes y eso podía retrasar decisiones que ya tenían información suficiente.',
      accountability:
        'Entendí que mi necesidad de control podía limitar la autonomía y consumir tiempo en detalles de menor impacto.',
      learning:
        'Ahora defino criterios de calidad antes de comenzar y concentro las revisiones en excepciones o riesgos relevantes.',
      readyNow:
        'El cambio me permite cuidar la calidad sin frenar la velocidad ni concentrar todas las decisiones en una persona.',
      fullAnswer:
        'Una debilidad real era revisar demasiado algunos entregables importantes. Entendí que eso podía limitar la autonomía y retrasar decisiones. Ahora defino criterios de calidad antes de comenzar y concentro las revisiones en excepciones. El cambio me permite cuidar la calidad sin frenar la velocidad ni concentrar todas las decisiones en una persona.',
    },
    {
      riskId: 'conflict',
      facts:
        'En un proyecto otra área priorizaba una entrega diferente y ambos equipos necesitábamos los mismos recursos durante la semana.',
      accountability:
        'Al principio defendí mi calendario sin comprender por completo las restricciones y compromisos externos de la otra área.',
      learning:
        'Pedí revisar los supuestos, identificamos dependencias compartidas y construimos una secuencia común de prioridades.',
      readyNow:
        'Desde entonces valido restricciones antes de escalar y documento acuerdos para evitar interpretaciones diferentes más adelante.',
      fullAnswer:
        'En un proyecto dos áreas necesitábamos los mismos recursos y al principio defendí mi calendario sin comprender todas las restricciones. Pedí revisar los supuestos, identificamos dependencias compartidas y construimos una secuencia común. Desde entonces valido restricciones antes de escalar y documento los acuerdos para evitar nuevas interpretaciones y conflictos innecesarios.',
    },
  ],
  redFlagChecks: [...REQUIRED_RED_FLAG_CHECKS],
  pressureAnswers: {
    differentiate: {
      text:
        'Puedo aportar coordinación transversal, análisis de indicadores y ejecución disciplinada. Mi experiencia convirtiendo información dispersa en planes claros responde a una operación que necesita mayor predictibilidad. También mantengo seguimiento de responsables y riesgos sin perder de vista el resultado del equipo.',
      durationSeconds: 48,
      selfRating: 4,
    },
    failure: {
      text:
        'En un proyecto subestimé el tiempo necesario para validar información y comuniqué una fecha demasiado optimista. Asumí el error, expliqué el impacto y reorganicé el trabajo con hitos intermedios. La entrega se retrasó, pero corregí el sistema de estimación y mejoró la precisión de los compromisos siguientes.',
      durationSeconds: 72,
      selfRating: 4,
    },
    departure: {
      text:
        'Busco una posición con mayor responsabilidad transversal y espacio para convertir información operativa en decisiones. Valoro lo aprendido en mi rol actual y esta oportunidad se alinea mejor con la siguiente etapa que quiero construir, especialmente en coordinación, indicadores y mejora continua.',
      durationSeconds: 51,
      selfRating: 4,
    },
  },
  strongestResponse:
    'La respuesta sobre el fracaso fue la más sólida porque asumió responsabilidad, explicó la corrección y mostró un cambio posterior verificable.',
  remainingRisk:
    'Todavía necesito hacer más específica la respuesta sobre la salida laboral para conectarla con una prioridad concreta de la organización.',
  improvementAction:
    'Revisar la oferta y agregar una señal específica de coordinación transversal antes de repetir la respuesta de salida con mayor precisión.',
  reflection:
    'Las respuestas difíciles fueron más creíbles cuando mantuve hechos breves, responsabilidad personal y aprendizaje. Evité culpar a terceros y cerré cada respuesta mostrando una conducta actual. El siguiente foco será responder con la misma claridad sin extenderme ni perder el vínculo con el rol.',
}

const empty = validateDifficultQuestionsSubmission(module, [], {})
assert.equal(empty.passed, false)
assert.equal(empty.score, 0)

const minimumResult = validateDifficultQuestionsSubmission(module, [], minimum)
assert.equal(minimumResult.passed, true, minimumResult.errors.join('; '))
assert.equal(minimumResult.score, 75)

const context = extractDifficultQuestionsContext(
  {
    fullName: 'Persona Demo',
    targetRole: 'Jefatura de Operaciones',
  },
  {
    jobTitle: 'Jefatura de Operaciones',
    company: 'Empresa Demo',
    priorityKeywords: 'coordinación transversal, indicadores, predictibilidad',
    mustHaveRequirements: 'Mejora continua\nComunicación ejecutiva',
  },
  {
    weakestAnswer:
      'La motivación todavía necesita una señal específica de coordinación transversal e indicadores.',
    improvementAction:
      'Conectar la siguiente práctica con la predictibilidad requerida por la operación.',
    interviewReflection:
      'La evidencia fue clara y el siguiente foco será fortalecer la especificidad de la motivación.',
  },
)

const strong = validateDifficultQuestionsSubmission(
  module,
  [],
  SAMPLE_DIFFICULT_QUESTIONS_DRAFT,
  context,
)
assert.equal(strong.passed, true, strong.errors.join('; '))
assert.equal(strong.score, 100)
assert.ok(strong.strengths.some((item) => item.includes('contexto verificado')))
assert.ok(strong.strengths.some((item) => item.includes('cuantitativa')))

const duplicatedRisk = validateDifficultQuestionsSubmission(module, [], {
  ...minimum,
  riskPlans: minimum.riskPlans.map((plan) => ({ ...plan, riskId: 'weakness' })),
})
assert.equal(duplicatedRisk.passed, false)
assert.ok(duplicatedRisk.errors.some((item) => item.includes('tres riesgos distintos')))

const defensiveAnswer = validateDifficultQuestionsSubmission(module, [], {
  ...minimum,
  riskPlans: minimum.riskPlans.map((plan, index) =>
    index === 0
      ? {
          ...plan,
          fullAnswer: `${plan.fullAnswer} No fue mi culpa y mi jefe fue incompetente durante todo el proceso.`,
        }
      : plan,
  ),
})
assert.equal(defensiveAnswer.passed, false)
assert.ok(defensiveAnswer.errors.some((item) => item.includes('frases defensivas')))

const invalidTiming = validateDifficultQuestionsSubmission(module, [], {
  ...minimum,
  pressureAnswers: {
    ...minimum.pressureAnswers,
    differentiate: {
      ...minimum.pressureAnswers.differentiate,
      durationSeconds: 12,
    },
  },
})
assert.equal(invalidTiming.passed, false)
assert.ok(invalidTiming.errors.some((item) => item.includes('rango de tiempo')))

const shallowFailure = validateDifficultQuestionsSubmission(module, [], {
  ...minimum,
  pressureAnswers: {
    ...minimum.pressureAnswers,
    failure: {
      ...minimum.pressureAnswers.failure,
      text:
        'Una vez las cosas no salieron como esperaba y fue una experiencia complicada. Después seguí trabajando con el equipo y tratamos de terminar el proyecto. Prefiero concentrarme en lo positivo y no entrar en detalles sobre ese momento.',
    },
  },
})
assert.equal(shallowFailure.passed, false)
assert.ok(shallowFailure.errors.some((item) => item.includes('error, corrección y resultado')))

const incompleteDebrief = validateDifficultQuestionsSubmission(module, [], {
  ...minimum,
  reflection: 'Necesito mejorar.',
})
assert.equal(incompleteDebrief.passed, false)
assert.ok(incompleteDebrief.errors.some((item) => item.includes('reflexión final')))

const activeModule = source('lib/a3/active-module.ts')
const client = source('lib/a3/client-completion.ts')
const completionRoute = source(
  'app/api/a3/module-completion/risk-difficult-questions-lab/route.ts',
)
const contextRoute = source(
  'app/api/a3/module-context/risk-difficult-questions-lab/route.ts',
)
const page = source('app/despega/a3/risk-difficult-questions-lab/page.tsx')
const studio = source('components/a3/difficult-questions-studio.tsx')

assert.ok(activeModule.includes('DIFFICULT_QUESTIONS_DELIVERABLE_KEYS'))
assert.ok(activeModule.includes("module.id === 'risk-difficult-questions-lab'"))
assert.ok(client.includes("'/api/a3/module-completion/risk-difficult-questions-lab'"))
assert.ok(completionRoute.includes('validateDifficultQuestionsSubmission'))
assert.ok(completionRoute.includes('extractDifficultQuestionsContext'))
assert.ok(completionRoute.includes(".in('module_id', ['first-recruiter-simulation', 'module-8'])"))
const accessIndex = completionRoute.indexOf('checkA3ModuleAccess(')
const contextIndex = completionRoute.indexOf(".from('a3_module_completion')")
const validationIndex = completionRoute.indexOf('validateDifficultQuestionsSubmission(')
const atomicIndex = completionRoute.indexOf("'complete_a3_module_atomic'")
assert.ok(accessIndex >= 0 && contextIndex > accessIndex)
assert.ok(validationIndex > contextIndex)
assert.ok(atomicIndex > validationIndex)

assert.ok(contextRoute.includes("'risk-difficult-questions-lab'"))
assert.ok(contextRoute.includes('extractDifficultQuestionsContext'))
assert.ok(page.includes("import { DifficultQuestionsStudio }"))
assert.ok(studio.includes("fetch('/api/a3/module-context/risk-difficult-questions-lab'"))
assert.ok(studio.includes('validateDifficultQuestionsSubmission'))
assert.ok(studio.includes('completeA3Module({'))
assert.ok(studio.includes('DIFFICULT_QUESTIONS_DRAFT_KEY'))
assert.ok(studio.includes('No se guarda audio ni video'))
assert.ok(!studio.includes('/api/a3/save-module-progress'))
assert.ok(!studio.includes('xpEarned'))
assert.ok(!studio.includes('Back to A3'))
assert.ok(!studio.includes('Module 9'))
assert.ok(!studio.includes('180 XP'))

console.log(
  JSON.stringify({
    module: module.id,
    checkpointDay: module.checkpointDay,
    xp: module.xp,
    minimumScore: minimumResult.score,
    alignedScore: strong.score,
    uniqueRisksRequired: true,
    defensiveLanguageBlocked: true,
    pressureTimingRequired: true,
    verifiedPriorContext: true,
    atomicCompletion: true,
    legacyWriterRemoved: true,
  }),
)
