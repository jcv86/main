import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateA2SpecializedDaySubmission } from '../lib/a2/specialized-day-validation'

const long = (label: string) => `${label} con contexto, decisión, resultado observable y evidencia reutilizable para el recorrido profesional.`

const validSubmissions: Record<number, Record<string, unknown>> = {
  2: {
    dayNumber: 2,
    vaultData: {
      vaultType: 'notion',
      fragments: Array.from({ length: 5 }, (_, index) => ({
        text: long(`Fragmento ${index + 1}`),
        category: index < 3 ? 'achievement' : 'process',
      })),
      goldPieces: Array.from({ length: 3 }, (_, index) => ({ text: long(`Pieza ${index + 1}`) })),
    },
  },
  3: {
    dayNumber: 3,
    marketSignals: Array.from({ length: 3 }, (_, index) => ({
      job_title: `Cargo ${index + 1}`,
      company_name: `Empresa ${index + 1}`,
    })),
    extractedSignals: ['liderazgo', 'datos', 'comunicación'],
  },
  4: {
    dayNumber: 4,
    candidateBoard: {
      column_1_quien_soy: long('Quién soy'),
      column_2_que_quiere: long('Qué quiere el mercado'),
      column_3_que_prueba: long('Qué tengo probado'),
      column_4_que_falta: long('Qué falta'),
      candidate_hypothesis: long('Hipótesis de candidato'),
      candidate_archetype: 'Líder estratégico',
    },
  },
  5: {
    dayNumber: 5,
    testIntroduction: {
      version_a: long('Versión casual'),
      version_b: long('Versión recruiter'),
      version_c: long('Versión mejorada'),
      test_type: 'voz',
      test_feedback: long('Feedback recibido'),
    },
  },
  6: {
    dayNumber: 6,
    professionalIdentity: {
      candidate_archetype: 'Especialista técnico',
      version_simple: long('Versión simple'),
      version_recruiter: long('Versión recruiter'),
      version_interview: long('Versión entrevista'),
      stress_test_result: long('Prueba de estrés completada'),
      is_validated: true,
    },
  },
  7: {
    dayNumber: 7,
    careerMirror: {
      a2_data_snapshot: { days: [1, 2, 3, 4, 5, 6] },
      mirror_card_title: 'Mi espejo profesional',
      mirror_card_content: { identity: long('Identidad'), evidence: long('Evidencia') },
      coach_feedback: long('Feedback del Coach'),
      coach_tags: ['claridad'],
      is_validated: true,
      validation_score: 85,
    },
  },
  8: {
    dayNumber: 8,
    workMemories: Array.from({ length: 5 }, (_, index) => ({
      memory_text: long(`Memoria ${index + 1}`),
      memory_where: 'Equipo de producto',
      memory_why_remember: 'Generó un resultado observable',
      coach_tags: index < 3 ? ['impacto'] : [],
    })),
    selectedMemories: ['1', '2', '3'],
  },
  9: {
    dayNumber: 9,
    tasks: [long('Task 1'), long('Task 2'), long('Task 3')],
    memoryCount: 3,
  },
  10: {
    dayNumber: 10,
    valueSeeds: Array.from({ length: 3 }, (_, index) => ({
      value: `Valor ${index + 1}`,
      impact: long(`Impacto ${index + 1}`),
    })),
    taskCount: 3,
  },
}

for (let day = 2; day <= 10; day += 1) {
  const empty = validateA2SpecializedDaySubmission(day, { dayNumber: day })
  assert.equal(empty.passed, false, `Day ${day} must reject an empty submission`)
  assert.ok(empty.score < empty.passScore)
  assert.ok(empty.errors.length > 0)

  const wrongDay = validateA2SpecializedDaySubmission(day, {
    ...validSubmissions[day],
    dayNumber: day === 10 ? 9 : day + 1,
  })
  assert.equal(wrongDay.passed, false, `Day ${day} must reject another day's payload`)
  assert.ok(wrongDay.errors.some((error) => error.includes('no el Día')))

  const valid = validateA2SpecializedDaySubmission(day, validSubmissions[day])
  assert.equal(valid.passed, true, `Day ${day} valid submission failed: ${valid.errors.join('; ')}`)
  assert.ok(valid.score >= valid.passScore)
  assert.equal(valid.mode, 'specialized_day')
  assert.equal(valid.day, day)
  assert.ok(valid.criteria.length >= 3)
}

const route = readFileSync(
  join(process.cwd(), 'app/api/a2/complete-day/route.ts'),
  'utf8',
)
assert.ok(route.includes('validateA2SpecializedDaySubmission(day, submission)'))
assert.ok(route.includes("error: 'La experiencia especializada necesita ajustes antes de avanzar.'"))
assert.ok(route.includes('{ status: 422 }'))
assert.ok(route.includes('specializedValidation ||'))
assert.ok(route.indexOf('validateA2SpecializedDaySubmission(day, submission)') < route.indexOf(".from('a2_user_task_completions')"))
assert.ok(!route.includes("score: 100,\n            passScore: 100,\n            mode: 'specialized_experience'"))

console.log(JSON.stringify({ validatedDays: 9, passScore: 75, crossDayPayloadBlocked: true }))
