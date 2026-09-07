import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildA1ProfessionalReport, discNetScoreToIntensity } from '../lib/reports/a1-professional-report'

assert.equal(discNetScoreToIntensity(-28), 0)
assert.equal(discNetScoreToIntensity(0), 50)
assert.equal(discNetScoreToIntensity(28), 100)
assert.equal(discNetScoreToIntensity(-999), 0)
assert.equal(discNetScoreToIntensity(999), 100)
assert.equal(discNetScoreToIntensity(null), null)
assert.equal(discNetScoreToIntensity(NaN), null)

const report = buildA1ProfessionalReport({
  rawScores: { D: 14, I: -14, S: 1, C: -1 }, dominantPattern: 'D', secondaryPattern: 'S',
  completedAt: '2026-08-28T12:00:00.000Z', generatedAt: '2026-08-29T13:00:00.000Z',
  c1CompletedAt: '2026-08-27T12:00:00.000Z', c2CompletedAt: '2026-08-29T12:00:00.000Z',
  c1Responses: { '1': 'Empleado de tiempo completo', '3': 'Desafío observable', '4': 'Objetivo inicial' },
  c2Responses: { '1': 'Objetivo final a 90 días', '2': 'Finanzas', '3': 'Líder de riesgo', '4': ['Liderazgo', 'Comunicación'], '7': ['Falta de tiempo'] },
})
assert.equal(report.primary, 'D')
assert.equal(report.secondary, 'S')
assert.equal(report.generatedAt, '2026-08-29T13:00:00.000Z')
assert.deepEqual(report.intensities, { D: 75, I: 25, S: 52, C: 48 })
assert.equal(report.context.objective90Days, 'Objetivo final a 90 días')
assert.deepEqual(report.context.targetSkills, ['Liderazgo', 'Comunicación'])
assert.deepEqual(report.context.barriers, ['Falta de tiempo'])
assert.equal(report.answeredContextItems, 8)
assert.equal(report.dimensions.length, 4)
assert.equal(report.strengths.length, 5)
assert.equal(report.tensions.length, 5)
assert.equal(report.interpretationAvailable, true)
assert.equal(report.reviewable, true)
assert.equal(report.patternSource, 'canonical')
assert.equal(report.questionCount, 28)
assert.equal(report.provenance.latestDatedSource, '2026-08-29T12:00:00.000Z')
assert.equal(report.provenance.hasUndatedSources, false)

for (const rawScores of [{}, { D: null, I: false, S: '', C: [] }, { D: 12, I: 3, S: -7 }, { D: 100, I: 3, S: -7, C: -8 }]) {
  const incomplete = buildA1ProfessionalReport({ rawScores, dominantPattern: 'D', secondaryPattern: 'I', completedAt: 'invalid', c1Responses: { '3': 'Contexto que no se debe perder' } })
  assert.equal(incomplete.primary, null)
  assert.equal(incomplete.secondary, null)
  assert.equal(incomplete.interpretationAvailable, false)
  assert.equal(incomplete.reviewable, false)
  assert.deepEqual(incomplete.strengths, [])
  assert.deepEqual(incomplete.tensions, [])
  assert.equal(incomplete.assessmentDate, null)
  assert.equal(incomplete.provenance.hasUndatedSources, true)
  assert.equal(incomplete.context.currentChallenge, 'Contexto que no se debe perder')
  for (const dimension of incomplete.dimensions) if (incomplete.rawScores[dimension.key] === null) assert.equal(dimension.score, null)
}
// V2 deliberately does not inherit the old stable-sort tie-break aliases as psychological evidence.
const tied = buildA1ProfessionalReport({ rawScores: { D: 0, I: 0, S: 0, C: 0 }, dominantPattern: 'D', secondaryPattern: 'I' })
assert.equal(tied.scoreEvidence.status, 'complete')
assert.equal(tied.interpretationAvailable, false)
assert.equal(tied.reviewable, true)
assert.equal(tied.primary, null)
assert.equal(tied.secondary, null)
assert.deepEqual(tied.intensities, { D: 50, I: 50, S: 50, C: 50 })
assert.deepEqual(tied.strengths, [])
const legacy = buildA1ProfessionalReport({ rawScores: { D: '18', I: '5', S: '-8', C: '-15' } })
assert.equal(legacy.interpretationAvailable, true)
assert.equal(legacy.patternSource, 'derived')
assert.equal(legacy.primary, 'D')
assert.equal(legacy.secondary, 'I')

const source = readFileSync(join(process.cwd(), 'app/despega/a1-report/layout.tsx'), 'utf8')
assert.match(source, /if \(report\.reviewable\) \{\s+await recordJourneyTransition\(journey\.user\.id, 'a1_report'\)/)
assert.ok(source.includes('<A1CanonicalReport report={report} />'))
console.log('DTC A1 professional report contract: PASS (populated, partial, invalid, empty, tied, legacy, provenance; v2 reviewability)')
