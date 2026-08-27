import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const day3Analysis = source('components/a2-day3-coach-analysis.tsx')
const day4Builder = source('components/a2-day4-board-builder.tsx')
const day5Builder = source('components/a2-day5-version-builder.tsx')
const day5Coach = source('components/a2-day5-coach-feedback.tsx')
const day5Test = source('components/a2-day5-test-selector.tsx')
const day6Forge = source('components/a2-day6-identity-forge.tsx')
const day6Stress = source('components/a2-day6-stress-test.tsx')
const day6Experience = source('components/a2-day6-experience.tsx')

assert.ok(day3Analysis.includes('No determina qué camino debes seguir'))
assert.ok(day3Analysis.includes('No prueban que una habilidad sea una fortaleza o brecha personal'))
for (const fabricatedClaim of ['Python, gestión de proyectos', 'AWS Solutions Architect', 'ByteByteGo', 'aparecen en 70%']) {
  assert.ok(!day3Analysis.includes(fabricatedClaim))
}

assert.ok(day4Builder.includes('candidate-archetype'))
assert.ok(day4Builder.includes('formData.candidate_archetype.trim().length < 3'))
assert.ok(day4Builder.includes('formData.candidate_hypothesis.trim().length < 20'))
assert.ok(!day4Builder.includes('onNext()'))

assert.match(day5Builder, /useState\(["']{2}\)/)
assert.ok(!day5Builder.includes('Product Manager con 5+ años'))
assert.ok(!day5Builder.includes('onNext()'))
assert.ok(!day5Coach.includes('improvedVersion ||'))
assert.ok(!day5Coach.includes('onNext()'))
assert.ok(day5Test.includes('const testSaved'))
assert.ok(day5Test.includes('disabled={!testSaved'))

assert.match(day6Forge, /useState\(["']{2}\)/)
assert.ok(!day6Forge.includes('Aporto [expertise]'))
assert.ok(!day6Forge.includes('onNext()'))
assert.ok(day6Stress.includes('type="checkbox"'))
assert.ok(day6Stress.includes('allResponsesComplete'))
assert.ok(!day6Stress.includes("handleResponseRecord('')"))
assert.ok(day6Experience.includes('prof.is_validated && prof.stress_test_result'))

console.log(JSON.stringify({
  evidenceLevel: 'source_only',
  day3ClaimsBoundToEvidence: true,
  day4ValidatorFieldsReachable: true,
  day5SyntheticProfileRemoved: true,
  day5SaveBeforeComplete: true,
  day6SyntheticIdentityRemoved: true,
  day6StressTestReachable: true,
  resumeStepsDerivedFromPersistence: true,
}))
