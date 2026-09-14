import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createA3DraftStorageKey } from '../lib/a3/draft-storage'

const root = process.cwd()
const hookSource = readFileSync(join(root, 'lib/a3/draft-storage.ts'), 'utf8')
const studios = [
  'job-decoder-studio.tsx',
  'cv-builder-studio.tsx',
  'communication-gym-studio.tsx',
  'coach-practice-room-studio.tsx',
  'first-recruiter-simulation-studio.tsx',
  'answer-architecture-studio.tsx',
  'difficult-questions-studio.tsx',
  'basic-interview-mission-studio.tsx',
]

assert.equal(
  createA3DraftStorageKey(' user/123 ', 'job-decoder'),
  'dtc:a3:user%2F123:module:job-decoder:draft',
)
assert.throws(() => createA3DraftStorageKey('   ', 'job-decoder'))
assert.match(hookSource, /createClient\(\)\.auth\.getUser\(\)/)
assert.match(hookSource, /window\.localStorage\.removeItem\(legacyKey\)/)
assert.match(hookSource, /if \(!active \|\| !user\) return/)
assert.match(hookSource, /if \(!ready \|\| !storageKey \|\| !enabled\) return/)

for (const studio of studios) {
  const studioSource = readFileSync(join(root, 'components/a3', studio), 'utf8')
  assert.match(studioSource, /useA3DraftStorage\(\{/)
  assert.match(studioSource, /legacyKey: [A-Z0-9_]+/)
  assert.match(studioSource, /clearDraft\(\)/)
  assert.doesNotMatch(studioSource, /window\.localStorage/)
}

console.log(JSON.stringify({
  authenticatedScope: true,
  legacyDraftsDiscarded: true,
  failClosedWithoutUser: true,
  protectedStudios: studios.length,
}))
