import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getActiveA3Module } from '../lib/a3/active-module'
import {
  BASIC_INTERVIEW_QUESTION_IDS,
  SAMPLE_BASIC_INTERVIEW_DRAFT,
  extractBasicInterviewContext,
} from '../lib/a3/basic-interview-mission'
import { validateBasicInterviewMissionSubmission } from '../lib/a3/basic-interview-mission-validation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const module = getActiveA3Module('basic-interview-mission')
assert.ok(module)
assert.equal(module.completionContract.enabled, true)
assert.equal(module.number, 10)
assert.equal(module.xp, 220)
assert.equal(module.checkpointDay, 88)
assert.equal(module.requiredPreviousModules.length, 9)

const minimum = {
  ...SAMPLE_BASIC_INTERVIEW_DRAFT,
  answers: Object.fromEntries(
    BASIC_INTERVIEW_QUESTION_IDS.map((id) => [
      id,
      {
        ...SAMPLE_BASIC_INTERVIEW_DRAFT.answers[id],
        text: SAMPLE_BASIC_INTERVIEW_DRAFT.answers[id].text.replace(/\d+%?/g, ''),
      },
    ]),
  ),
}

const empty = validateBasicInterviewMissionSubmission(module, [], {})
assert.equal(empty.passed, false)
assert.equal(empty.score, 0)

const minimumResult = validateBasicInterviewMissionSubmission(module, [], minimum)
assert.equal(minimumResult.passed, true, minimumResult.errors.join('; '))
assert.equal(minimumResult.score, 75)

const context = extractBasicInterviewContext(
  {
    fullName: 'Persona Demo',
    targetRole: 'Jefatura de Operaciones',
  },
  {
    jobTitle: 'Jefatura de Operaciones',
    company: 'Empresa Demo',
    priorityKeywords: 'coordinación transversal, indicadores, predictibilidad, mejora continua',
    mustHaveRequirements:
      'Coordinación de equipos\nSeguimiento de indicadores\nComunicación ejecutiva',
  },
  {
    selfIntroduction: SAMPLE_BASIC_INTERVIEW_DRAFT.answers.introduction.text,
    motivation: SAMPLE_BASIC_INTERVIEW_DRAFT.answers.motivation.text,
  },
  {
    weakestAnswer:
      'La trayectoria profesional todavía puede ser más breve y priorizar transiciones relevantes.',
    improvementAction:
      'Cerrar cada transición con la competencia que aporta a la jefatura de operaciones.',
  },
  {
    riskPlans: [
      {
        riskId: 'weakness',
        fullAnswer: SAMPLE_BASIC_INTERVIEW_DRAFT.answers.weakness.text,
      },
    ],
    remainingRisk:
      'Hacer la respuesta de salida más específica para la empresa y el rol objetivo.',
  },
)

const strong = validateBasicInterviewMissionSubmission(
  module,
  [],
  SAMPLE_BASIC_INTERVIEW_DRAFT,
  context,
)
assert.equal(strong.passed, true, strong.errors.join('; '))
assert.equal(strong.score, 100)
assert.ok(strong.strengths.some((item) => item.includes('señales verificadas')))
assert.ok(strong.strengths.some((item) => item.includes('evidencia cuantitativa')))

const invalidTiming = validateBasicInterviewMissionSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    introduction: { ...minimum.answers.introduction, durationSeconds: 90 },
  },
})
assert.equal(invalidTiming.passed, false)
assert.ok(invalidTiming.errors.some((item) => item.includes('rango de tiempo')))

const incompleteRatings = validateBasicInterviewMissionSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    closing: { ...minimum.answers.closing, selfRating: 0 },
  },
})
assert.equal(incompleteRatings.passed, false)
assert.ok(incompleteRatings.errors.some((item) => item.includes('Autoevalúa')))

const invalidStar = validateBasicInterviewMissionSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    achievement: {
      ...minimum.answers.achievement,
      text:
        'Participé en un proyecto importante con varias personas y aprendí mucho durante el proceso. Fue una experiencia interesante que me permitió conocer mejor el trabajo de otras áreas y mantener una buena disposición durante las reuniones.',
    },
  },
})
assert.equal(invalidStar.passed, false)
assert.ok(invalidStar.errors.some((item) => item.includes('situación, acción y resultado')))

const unsafeWeakness = validateBasicInterviewMissionSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    weakness: {
      ...minimum.answers.weakness,
      text:
        'No tengo debilidades relevantes para este cargo porque siempre cumplo con todo lo solicitado y no he recibido observaciones que indiquen un problema en mi desempeño profesional.',
    },
  },
})
assert.equal(unsafeWeakness.passed, false)
assert.ok(unsafeWeakness.errors.some((item) => item.includes('debilidad con progreso')))

const oneCandidateQuestion = validateBasicInterviewMissionSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    candidateQuestions: {
      ...minimum.answers.candidateQuestions,
      text:
        '¿Cuál es el principal resultado esperado para esta posición durante los primeros meses y cómo se medirá dentro del equipo?',
    },
  },
})
assert.equal(oneCandidateQuestion.passed, false)
assert.ok(oneCandidateQuestion.errors.some((item) => item.includes('dos preguntas')))

const incompleteReport = validateBasicInterviewMissionSubmission(module, [], {
  ...minimum,
  readinessState: '',
})
assert.equal(incompleteReport.passed, false)
assert.ok(incompleteReport.errors.some((item) => item.includes('estado de preparación')))

const completionRoute = source(
  'app/api/a3/module-completion/basic-interview-mission/route.ts',
)
const contextRoute = source(
  'app/api/a3/module-context/basic-interview-mission/route.ts',
)
const page = source('app/despega/a3/basic-interview-mission/page.tsx')
const studio = source('components/a3/basic-interview-mission-studio.tsx')
const activeModule = source('lib/a3/active-module.ts')
const clientCompletion = source('lib/a3/client-completion.ts')

assert.ok(activeModule.includes('BASIC_INTERVIEW_MISSION_DELIVERABLE_KEYS'))
assert.ok(activeModule.includes("module.id === 'basic-interview-mission'"))
assert.ok(clientCompletion.includes("moduleId === 'basic-interview-mission'"))
assert.ok(
  clientCompletion.includes("'/api/a3/module-completion/basic-interview-mission'"),
)
assert.ok(completionRoute.includes('validateBasicInterviewMissionSubmission'))
assert.ok(completionRoute.includes('extractBasicInterviewContext'))
assert.ok(completionRoute.includes(".in('module_id', ['risk-difficult-questions-lab', 'module-9'])"))
assert.ok(completionRoute.includes('p_complete_route: true'))
assert.ok(completionRoute.includes('routeCompleted: true'))
assert.ok(completionRoute.includes('proUnlocked: true'))
const accessIndex = completionRoute.indexOf('checkA3ModuleAccess(')
const contextIndex = completionRoute.indexOf(".from('a3_module_completion')")
const validationIndex = completionRoute.indexOf('validateBasicInterviewMissionSubmission(')
const atomicIndex = completionRoute.indexOf("'complete_a3_module_atomic'")
assert.ok(accessIndex >= 0 && contextIndex > accessIndex)
assert.ok(validationIndex > contextIndex)
assert.ok(atomicIndex > validationIndex)

assert.ok(contextRoute.includes("'basic-interview-mission'"))
assert.ok(contextRoute.includes('extractBasicInterviewContext'))
assert.ok(page.includes("import { BasicInterviewMissionStudio }"))
assert.ok(studio.includes("fetch('/api/a3/module-context/basic-interview-mission'"))
assert.ok(studio.includes('validateBasicInterviewMissionSubmission'))
assert.ok(studio.includes('completeA3Module({'))
assert.ok(studio.includes('BASIC_INTERVIEW_DRAFT_KEY'))
assert.ok(studio.includes('No se graba audio ni video'))
assert.ok(studio.includes('cerrar ruta básica'))
assert.ok(!studio.includes('/api/a3/save-module-progress'))
assert.ok(!studio.includes('xpEarned'))
assert.ok(!studio.includes('Back to A3'))
assert.ok(!studio.includes('Final Mission'))

console.log(
  JSON.stringify({
    module: module.id,
    checkpointDay: module.checkpointDay,
    minimumScore: minimumResult.score,
    alignedScore: strong.score,
    completeInterviewRequired: true,
    twoStarAnswersRequired: true,
    finalReportRequired: true,
    atomicRouteCompletion: true,
    proUnlockVerified: true,
    legacyWriterRemoved: true,
  }),
)
