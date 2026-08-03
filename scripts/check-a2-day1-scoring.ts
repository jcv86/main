import assert from 'node:assert/strict'
import { analyzeA2Day1Submission } from '../lib/a2/day1-scoring'

const userId = '00000000-0000-0000-0000-000000000001'

const manipulated = analyzeA2Day1Submission(userId, {
  totalScore: 100,
  passStatus: 'pass',
})

assert.equal(
  manipulated.passed,
  false,
  'Client-provided passStatus must never approve an empty submission.',
)
assert.ok(
  manipulated.totalScore < 75,
  'An empty submission must remain below the approval threshold.',
)

const valid = analyzeA2Day1Submission(userId, {
  change30Days:
    'Durante los próximos treinta días documentaré resultados medibles, actualizaré mis materiales profesionales y comenzaré conversaciones con empresas objetivo mediante un plan semanal verificable.',
  targetRole:
    'Product Manager de nivel intermedio en una empresa B2B SaaS con responsabilidad sobre decisiones, métricas de activación y coordinación de equipos multifuncionales.',
  hypothesis:
    'Al convertir logros dispersos en evidencia cuantificada, una narrativa profesional consistente y materiales utilizables, aumentaré la calidad de mis conversaciones y procesos de selección.',
  gates: {
    identity:
      'Definiré una identidad profesional basada en responsabilidades reales, resultados demostrables y un posicionamiento claro frente al mercado objetivo.',
    evidence:
      'Consolidaré cinco historias con métricas, contexto, decisiones tomadas y resultados verificables para usarlas en CV, LinkedIn y entrevistas.',
    material:
      'Transformaré esa evidencia en un CV actualizado, un perfil de LinkedIn coherente y un portafolio breve que pueda compartir en conversaciones reales.',
  },
  roadmap:
    'Primero reuniré evidencia y métricas; después construiré los materiales; finalmente practicaré la narrativa, contactaré empresas seleccionadas y mediré respuestas para ajustar la ruta.',
})

assert.equal(valid.passed, true, 'A complete and coherent route must pass.')
assert.ok(valid.totalScore >= 75, 'A valid route must meet the threshold.')
assert.equal(valid.scores.clarity <= 25, true)
assert.equal(valid.scores.logic <= 25, true)
assert.equal(valid.scores.realism <= 25, true)
assert.equal(valid.scores.actionability <= 25, true)

console.log(
  JSON.stringify({
    manipulatedScore: manipulated.totalScore,
    validScore: valid.totalScore,
    threshold: 75,
  }),
)
