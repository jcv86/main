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
import { CV_BUILDER_CRITICAL_ATS_IDS } from '../lib/a3/cv-builder'

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
assert.equal(normalizeA3ModuleId('module-3'), 'cv-builder-studio')
assert.equal(normalizeA3ModuleId('unknown'), null)

for (const module of A3_MODULES) {
  assert.ok(module.title.length >= 5)
  assert.ok(module.xp > 0)
  assert.equal(module.requiredPreviousModules.length, module.number - 1)
  assert.ok(module.route.startsWith('/despega/a3/'))
}

const long = (label: string) =>
  `${label} con contexto profesional, una decisión concreta y evidencia observable para utilizar en entrevistas futuras.`

const coachCases = [
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

for (const testCase of coachCases) {
  const module = getA3Module(testCase.id)
  assert.ok(module)
  assert.equal(module.completionContract.enabled, true)
  assert.equal(module.completionContract.validationMode, 'coach')

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

const cvModule = getA3Module('cv-builder-studio')
assert.ok(cvModule)
assert.equal(cvModule.completionContract.enabled, true)
assert.equal(cvModule.completionContract.validationMode, 'cv_builder')
assert.equal(cvModule.xp, 120)
assert.equal(cvModule.checkpointDay, 27)

const cvCore = {
  fullName: 'Camila Orellana',
  email: 'camila@example.cl',
  phone: '+56 9 5555 5555',
  location: 'Santiago, Chile',
  linkedin: '',
  targetRole: 'Arquitecta de Soluciones',
  targetKeywords: 'Kubernetes, Terraform, AWS',
  professionalSummary:
    'Profesional con experiencia articulando equipos, procesos y decisiones complejas. Ha construido soluciones claras y mantenibles para contextos de alta exigencia.',
  experienceTitle: 'Líder de Proyectos',
  experienceCompany: 'Empresa Demo',
  experienceDates: '2022–actualidad',
  achievement1:
    'Rediseñé el flujo operativo coordinando áreas comerciales y técnicas para mejorar la calidad de entrega.',
  achievement2:
    'Implementé una metodología de seguimiento que hizo visibles riesgos, responsables y próximos hitos.',
  achievement3:
    'Construí una base de conocimiento para reducir dependencias y facilitar la continuidad del equipo.',
  skills:
    'Comunicación ejecutiva, Gestión de proyectos, Liderazgo, Documentación, Facilitación, Análisis',
  education: 'Psicología, Universidad Demo, 2014',
  atsChecklist: CV_BUILDER_CRITICAL_ATS_IDS.join(', '),
}

const emptyCv = validateA3ModuleSubmission(cvModule, [], {})
assert.equal(emptyCv.passed, false)
assert.equal(emptyCv.score, 0)

const minimumCv = validateA3ModuleSubmission(cvModule, [], cvCore)
assert.equal(minimumCv.passed, true, minimumCv.errors.join('; '))
assert.equal(minimumCv.score, 75)

const strongCv = validateA3ModuleSubmission(cvModule, [], {
  ...cvCore,
  professionalSummary:
    'Arquitecta de Soluciones con experiencia articulando equipos y plataformas cloud. Especializada en AWS, Kubernetes y Terraform, con foco en soluciones mantenibles y resultados medibles.',
  achievement1:
    'Rediseñé el flujo operativo y reduje 22% el tiempo promedio de entrega entre áreas comerciales y técnicas.',
  skills:
    'AWS, Kubernetes, Terraform, Comunicación ejecutiva, Gestión de proyectos, Liderazgo',
})
assert.equal(strongCv.passed, true, strongCv.errors.join('; '))
assert.equal(strongCv.score, 100)
assert.ok(strongCv.strengths.some((strength) => strength.includes('cuantitativa')))

const missingAts = validateA3ModuleSubmission(cvModule, [], {
  ...cvCore,
  atsChecklist: 'format, fonts',
})
assert.equal(missingAts.passed, false)
assert.ok(missingAts.errors.some((error) => error.includes('ATS')))

const weakAchievements = validateA3ModuleSubmission(cvModule, [], {
  ...cvCore,
  achievement1: 'Gestioné tareas.',
  achievement2: 'Coordiné reuniones.',
  achievement3: 'Apoyé al equipo.',
})
assert.equal(weakAchievements.passed, false)
assert.ok(weakAchievements.errors.some((error) => error.includes('tres logros')))

for (const module of A3_MODULES.slice(3)) {
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
const cvPage = source('app/despega/a3/cv-builder-studio/page.tsx')
const cvStudio = source('components/a3/cv-builder-studio.tsx')
const atomicMigration = source('migrations/05-a3-atomic-module-completion.sql')

assert.ok(checkpointMap.includes('A3_MODULES.map'))
assert.ok(!checkpointMap.includes("moduleId: 'career-mirror'"))
assert.ok(completionRoute.includes('getA3Module(body.moduleId)'))
assert.ok(completionRoute.includes('validateA3ModuleSubmission'))
assert.ok(completionRoute.includes("rpc(\n      'complete_a3_module_atomic'"))
assert.ok(completionRoute.includes("code: 'A3_ATOMIC_COMPLETION_FAILED'"))
assert.ok(completionRoute.includes('isAtomicCompletionResult(data)'))
assert.ok(!completionRoute.includes(".from('a3_session_attempts')"))
assert.ok(!completionRoute.includes(".from('a3_module_completion')"))
assert.ok(!completionRoute.includes(".from('a3_route_progression')"))
assert.ok(!completionRoute.includes(".from('a3_user_progress')"))
assert.ok(!completionRoute.includes('best_score: 100'))
assert.ok(!completionRoute.includes('score: 100'))

assert.ok(atomicMigration.includes('create unique index if not exists a3_route_progression_user_id_key'))
assert.ok(atomicMigration.includes('create or replace function public.complete_a3_module_atomic'))
assert.ok(atomicMigration.includes('for update'))
assert.ok(atomicMigration.includes('on conflict (user_id, module_id) do update'))
assert.ok(atomicMigration.includes('on conflict (user_id) do update'))
assert.ok(atomicMigration.includes("v_xp_awarded := case when v_is_first"))
assert.ok(atomicMigration.includes('completed_at = public.a3_module_completion.completed_at'))
assert.ok(atomicMigration.includes('revoke all on function public.complete_a3_module_atomic'))
assert.ok(atomicMigration.includes('grant execute on function public.complete_a3_module_atomic'))

assert.ok(progressRoute.includes('A3_TOTAL_XP'))
assert.ok(progressRoute.includes('A3_MODULE_IDS'))
assert.ok(clientHelper.includes("credentials: 'include'"))
assert.ok(coachSession.includes('completeA3Module({'))
assert.ok(careerPage.includes('moduleId="career-mirror"'))
assert.ok(valuePage.includes('moduleId="value-mining-lab"'))
assert.ok(cvPage.includes("import { CvBuilderStudio }"))
assert.ok(cvStudio.includes("getA3Module('cv-builder-studio')"))
assert.ok(cvStudio.includes('validateA3ModuleSubmission'))
assert.ok(cvStudio.includes('completeA3Module({'))
assert.ok(cvStudio.includes('window.localStorage.setItem'))
assert.ok(cvStudio.includes('El borrador se guarda automáticamente'))
assert.ok(!cvStudio.includes('/api/a3/save-module-progress'))
assert.ok(!cvStudio.includes('xpEarned'))
assert.ok(!cvStudio.includes('Back to A3'))
assert.ok(!cvStudio.includes('Module 3 •'))

console.log(
  JSON.stringify({
    modules: A3_MODULES.length,
    totalXp: A3_TOTAL_XP,
    verifiedActiveModules: [...coachCases.map((item) => item.id), cvModule.id],
    cvMinimumScore: minimumCv.score,
    cvStrongScore: strongCv.score,
    fixedScoreRemoved: true,
    canonicalCatalog: true,
    atomicCompletion: true,
    partialWritesRemoved: true,
  }),
)
