import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const design = readFileSync('docs/dtc/DTC_A2_EXECUTION_CAPABILITY_DESIGN.md', 'utf8')
const types = readFileSync('lib/a2-mission.types.ts', 'utf8')

for (const phrase of [
  'Do **not** manufacture an A2 outcome from existing heterogeneous mission scores.',
  'a2_execution_checkpoint',
  'objective_specificity',
  'action_quality',
  'evidence_definition',
  'obstacle_planning',
  'review_discipline',
  'no daily mission average is displayed as improvement',
  'no A3 score is reused',
]) assert.ok(design.includes(phrase), `missing A2 outcome guardrail: ${phrase}`)

assert.ok(types.includes('visionClarity'))
assert.ok(types.includes('milestoneQuality'))
assert.ok(types.includes('realismCoherence'))
assert.ok(design.includes('Why not reuse Day 1 DTC score'))

console.log(JSON.stringify({
  heterogeneousMissionScoresRejected: true,
  a3ScoreReuseRejected: true,
  repeatedExecutionInstrumentSpecified: true,
  day1ConstructKeptSeparate: true,
}))
