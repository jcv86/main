import assert from 'node:assert/strict'
import {
  buildA1ProfessionalReport,
  discNetScoreToIntensity,
} from '../lib/reports/a1-professional-report'

assert.equal(discNetScoreToIntensity(-28), 0)
assert.equal(discNetScoreToIntensity(0), 50)
assert.equal(discNetScoreToIntensity(28), 100)
assert.equal(discNetScoreToIntensity(-999), 0)
assert.equal(discNetScoreToIntensity(999), 100)

const report = buildA1ProfessionalReport({
  rawScores: { D: 28, I: -28, S: 0, C: 0 },
  dominantPattern: 'D',
  secondaryPattern: 'S',
  completedAt: '2026-08-28T12:00:00.000Z',
  c1Responses: {
    '1': 'Empleado de tiempo completo',
    '3': 'Desafío observable',
    '4': 'Objetivo inicial',
  },
  c2Responses: {
    '1': 'Objetivo final a 90 días',
    '2': 'Finanzas',
    '3': 'Líder de riesgo',
    '4': ['Liderazgo', 'Comunicación'],
    '7': ['Falta de tiempo'],
  },
})

assert.equal(report.primary, 'D')
assert.equal(report.secondary, 'S')
assert.equal(report.intensities.D, 100)
assert.equal(report.intensities.I, 0)
assert.equal(report.intensities.S, 50)
assert.equal(report.intensities.C, 50)
assert.equal(report.context.objective90Days, 'Objetivo final a 90 días')
assert.deepEqual(report.context.targetSkills, ['Liderazgo', 'Comunicación'])
assert.deepEqual(report.context.barriers, ['Falta de tiempo'])
assert.equal(report.answeredContextItems, 8)
assert.equal(report.dimensions.length, 4)
assert.equal(report.strengths.length, 5)
assert.equal(report.tensions.length, 5)

console.log('DTC A1 professional report contract: PASS')
