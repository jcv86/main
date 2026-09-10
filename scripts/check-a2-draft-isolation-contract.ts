import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const keySource = readFileSync(join(root, 'lib/a2/draft-storage-key.ts'), 'utf8')
const persistence = readFileSync(join(root, 'lib/a2-progress-persistence.ts'), 'utf8')

assert.match(keySource, /encodeURIComponent\(normalizedUserId\)/, 'The key must include an encoded user scope.')
assert.match(keySource, /day:\$\{dayNumber\}:draft/, 'The key must isolate every A2 day.')
assert.match(keySource, /if \(!normalizedUserId\) throw/, 'An empty user scope must fail closed.')
assert.match(keySource, /dayNumber > 90/, 'Draft keys must reject days outside A2.')
assert.match(persistence, /loadFromLocalStorage\(userId, dayNumber\)/, 'Draft loading must use the authenticated user scope.')
assert.match(persistence, /removeItem\(createLegacyA2DraftStorageKey\(dayNumber\)\)/, 'Unowned legacy drafts must be discarded.')
assert.doesNotMatch(persistence, /const AUTOSAVE_KEY_PREFIX/, 'The unscoped storage prefix must not return.')

console.log('A2 user-scoped draft isolation contract passed.')
