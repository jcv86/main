import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getActiveA3Module } from '../lib/a3/active-module'
import {
  SAMPLE_FIRST_RECRUITER_DRAFT,
  extractFirstRecruiterContext,
} from '../lib/a3/first-recruiter-simulation'
import { validateFirstRecruiterSimulationSubmission } from '../lib/a3/first-recruiter-simulation-validation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const module = getActiveA3Module('first-recruiter-simulation')
assert.ok(module)
assert.equal(module.completionContract.enabled, true)
assert.equal(module.number, 8)
assert.equal(module.xp, 160)
assert.equal(module.checkpointDay, 68)
assert.equal(module.requiredPreviousModules.length, 7)

const minimum = {
  answers: {
    greeting: {
      text: 'Muy bien, gracias por recibirme. Estoy preparado para conversar sobre la oportunidad.',
      durationSeconds: 12,
      selfRating: 4,
    },
    introduction: {
      text: 'Soy profesional de operaciones con experiencia coordinando equipos comerciales y técnicos. Mi trabajo consiste en convertir información dispersa en planes claros, ordenar responsabilidades y sostener la continuidad de proyectos exigentes con comunicación directa.',
      durationSeconds: 39,
      selfRating: 4,
    },
    experience: {
      text: 'En mi experiencia más reciente coordiné responsables, riesgos y seguimiento semanal de proyectos transversales. Organicé un tablero de control, definí alertas tempranas y ayudé al equipo a recuperar visibilidad y continuidad en la ejecución.',
      durationSeconds: 46,
      selfRating: 4,
    },
    motivation: {
      text: 'Me interesa esta oportunidad porque combina coordinación transversal, seguimiento de indicadores y mejora continua. Esas responsabilidades se conectan con mi experiencia y con el tipo de impacto profesional que quiero seguir construyendo.',
      durationSeconds: 38,
      selfRating: 4,
    },
    strength: {
      text: 'Mi principal fortaleza es convertir información compleja en decisiones ejecutables. En un proyecto con varias áreas organicé responsables, prioridades y alertas, lo que permitió recuperar orden y mejorar la continuidad del trabajo.',
      durationSeconds: 42,
      selfRating: 4,
    },
    behavioral: {
      text: 'Situación: un proyecto crítico acumulaba atrasos y el equipo había perdido visibilidad. Tarea: recuperar control sin detener la operación. Acción: definí responsables, organicé hitos, instalé alertas semanales y facilité acuerdos entre las áreas. Resultado: el proyecto recuperó continuidad, la gerencia obtuvo información clara y el equipo pudo anticipar nuevos riesgos.',
      durationSeconds: 72,
      selfRating: 4,
    },
    candidateQuestion: {
      text: '¿Cuáles son los resultados más importantes que esperan de esta posición durante los primeros meses?',
      durationSeconds: 16,
      selfRating: 5,
    },
    closing: {
      text: 'Gracias por la conversación. El desafío me interesa y considero que mi experiencia en coordinación, seguimiento y mejora puede aportar desde el inicio.',
      durationSeconds: 19,
      selfRating: 4,
    },
  },
  strongestAnswer:
    'La respuesta conductual fue la más fuerte porque tuvo una estructura clara y mostró mi contribución personal.',
  weakestAnswer:
    'La motivación fue la más débil porque todavía puede incorporar una señal más específica de la empresa.',
  improvementAction:
    'Investigar una prioridad concreta de la organización y conectarla con una evidencia profesional antes de repetir la entrevista.',
  interviewReflection:
    'La entrevista mantuvo un hilo coherente entre experiencia, motivación y aporte. Las respuestas más sólidas explicaron acciones concretas; el próximo foco será hacer la motivación más específica y mantener cierres breves.',
}

const empty = validateFirstRecruiterSimulationSubmission(module, [], {})
assert.equal(empty.passed, false)
assert.equal(empty.score, 0)

const minimumResult = validateFirstRecruiterSimulationSubmission(module, [], minimum)
assert.equal(minimumResult.passed, true, minimumResult.errors.join('; '))
assert.equal(minimumResult.score, 75)

const context = extractFirstRecruiterContext(
  {
    fullName: 'Persona Demo',
    targetRole: 'Jefatura de Operaciones',
  },
  {
    jobTitle: 'Jefatura de Operaciones',
    company: 'Empresa Demo',
    priorityKeywords: 'operaciones, indicadores, coordinación, mejora continua',
    mustHaveRequirements:
      'Coordinación transversal\nSeguimiento de indicadores\nComunicación ejecutiva',
  },
  {
    selfIntroduction: SAMPLE_FIRST_RECRUITER_DRAFT.answers.introduction.text,
    motivation: SAMPLE_FIRST_RECRUITER_DRAFT.answers.motivation.text,
    strengthEvidence: SAMPLE_FIRST_RECRUITER_DRAFT.answers.strength.text,
    challengeStar: SAMPLE_FIRST_RECRUITER_DRAFT.answers.behavioral.text,
  },
)

const strong = validateFirstRecruiterSimulationSubmission(
  module,
  [],
  SAMPLE_FIRST_RECRUITER_DRAFT,
  context,
)
assert.equal(strong.passed, true, strong.errors.join('; '))
assert.equal(strong.score, 100)
assert.ok(strong.strengths.some((item) => item.includes('contexto verificado')))
assert.ok(strong.strengths.some((item) => item.includes('cuantitativa')))

const invalidTiming = validateFirstRecruiterSimulationSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    introduction: { ...minimum.answers.introduction, durationSeconds: 90 },
  },
})
assert.equal(invalidTiming.passed, false)
assert.ok(invalidTiming.errors.some((item) => item.includes('rango de tiempo')))

const missingRating = validateFirstRecruiterSimulationSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    strength: { ...minimum.answers.strength, selfRating: 0 },
  },
})
assert.equal(missingRating.passed, false)
assert.ok(missingRating.errors.some((item) => item.includes('Autoevalúa')))

const invalidStar = validateFirstRecruiterSimulationSubmission(module, [], {
  ...minimum,
  answers: {
    ...minimum.answers,
    behavioral: {
      ...minimum.answers.behavioral,
      text: 'Participé en un proyecto complejo junto a varias áreas y aprendí mucho durante el proceso de coordinación y seguimiento.',
    },
  },
})
assert.equal(invalidStar.passed, false)
assert.ok(invalidStar.errors.some((item) => item.includes('situación')))

const incompleteDebrief = validateFirstRecruiterSimulationSubmission(module, [], {
  ...minimum,
  improvementAction: 'Practicar más.',
})
assert.equal(incompleteDebrief.passed, false)
assert.ok(incompleteDebrief.errors.some((item) => item.includes('reflexión final')))

const completionRoute = source('app/api/a3/module-completion/route.ts')
const contextRoute = source('app/api/a3/module-context/first-recruiter-simulation/route.ts')
const page = source('app/despega/a3/first-recruiter-simulation/page.tsx')
const studio = source('components/a3/first-recruiter-simulation-studio.tsx')
const activeModule = source('lib/a3/active-module.ts')
const workflow = source('.github/workflows/typecheck.yml')

assert.ok(activeModule.includes('FIRST_RECRUITER_SIMULATION_DELIVERABLE_KEYS'))
assert.ok(activeModule.includes("module.id === 'first-recruiter-simulation'"))
assert.ok(completionRoute.includes('validateFirstRecruiterSimulationSubmission'))
assert.ok(completionRoute.includes('extractFirstRecruiterContext'))
assert.ok(completionRoute.includes(".in('module_id', ['cv-builder-studio', 'module-3'])"))
assert.ok(completionRoute.includes(".in('module_id', ['job-decoder', 'module-4'])"))
assert.ok(completionRoute.includes(".in('module_id', ['answer-architecture', 'module-5'])"))
const accessIndex = completionRoute.indexOf('checkA3ModuleAccess(')
const validationIndex = completionRoute.indexOf('validateFirstRecruiterSimulationSubmission(')
const atomicIndex = completionRoute.indexOf("'complete_a3_module_atomic'")
assert.ok(accessIndex >= 0 && validationIndex > accessIndex)
assert.ok(atomicIndex > validationIndex)

assert.ok(contextRoute.includes("'first-recruiter-simulation'"))
assert.ok(contextRoute.includes(".from('a3_module_completion')"))
assert.ok(contextRoute.includes('extractFirstRecruiterContext'))
assert.ok(page.includes("import { FirstRecruiterSimulationStudio }"))
assert.ok(studio.includes("fetch('/api/a3/module-context/first-recruiter-simulation'"))
assert.ok(studio.includes('validateFirstRecruiterSimulationSubmission'))
assert.ok(studio.includes('completeA3Module({'))
assert.ok(studio.includes('FIRST_RECRUITER_DRAFT_KEY'))
assert.ok(studio.includes('No se guarda audio ni video'))
assert.ok(!studio.includes('/api/a3/save-module-progress'))
assert.ok(!studio.includes('xpEarned'))
assert.ok(!studio.includes('CameraMicrophoneTest'))
assert.ok(!studio.includes('Live Simulation'))
assert.ok(workflow.includes('check-a3-first-recruiter-simulation-contract.ts'))

console.log(
  JSON.stringify({
    module: module.id,
    checkpointDay: module.checkpointDay,
    minimumScore: minimumResult.score,
    alignedScore: strong.score,
    eightTimedAnswers: true,
    starRequired: true,
    debriefRequired: true,
    verifiedPriorContext: true,
    atomicCompletion: true,
    legacyWriterRemoved: true,
  }),
)
