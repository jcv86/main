import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const day8 = source('components/a2-day8-experience.tsx')
const capture = source('components/a2-day8-memory-capture-form.tsx')
const tagger = source('components/a2-day8-coach-memory-tagger.tsx')
const review = source('components/a2-day8-memory-map-review.tsx')
const day9 = source('components/a2-day9-experience.tsx')
const day10 = source('components/a2-day10-experience.tsx')

assert.ok(day8.includes('getWorkMemories(userId, 8)'))
assert.ok(day8.includes('existingIds.has(i + 1)'))
assert.ok(day8.includes('completedCount >= 5'))
assert.ok(day8.includes('taggedCount >= 3'))
assert.ok(day8.includes('selectedCount >= 3'))
assert.ok(capture.includes('firstIncomplete'))
assert.ok(capture.includes('where.trim().length < 3'))
assert.ok(capture.includes('why.trim().length < 5'))
assert.ok(tagger.includes('tagsByMemory'))
assert.ok(!tagger.includes('idx === current ? selectedTags'))
assert.ok(review.includes('selectionSaved'))
assert.ok(review.includes('selected.length < 3 || !selectionSaved'))

assert.ok(day9.includes('Edita el borrador'))
assert.ok(day9.includes('no agregues resultados que no puedas sostener'))
assert.ok(!day9.includes("from('a2_candidate_boards').insert"))
assert.ok(!day9.includes('resultando en'))

assert.ok(day10.includes("from('a2_user_task_completions')"))
assert.ok(day10.includes(".eq('day', 9)"))
assert.ok(day10.includes("field: 'value' | 'impact'"))
assert.ok(day10.includes('completeSeeds.length < 3'))
for (const syntheticValue of ['Liderazgo colaborativo', 'Ejecución bajo presión', 'Creación de valor', 'competencia clave que el empleador busca']) {
  assert.ok(!day10.includes(syntheticValue))
}

console.log(JSON.stringify({
  evidenceLevel: 'source_only',
  day8IdempotentSlots: true,
  day8AllTagsPersisted: true,
  day8SelectionSavedBeforeComplete: true,
  day9UserEditableTasks: true,
  legacyCandidateBoardTransportRemoved: true,
  day10LoadsCanonicalDay9Submission: true,
  day10UserOwnedValueSeeds: true,
}))
