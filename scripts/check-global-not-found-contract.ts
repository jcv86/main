import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(join(process.cwd(), 'app/not-found.tsx'), 'utf8')

assert.match(source, /<main\b/, 'The global not-found page must expose a main landmark.')
assert.match(source, /<h1\b/, 'The global not-found page must expose one primary heading.')
assert.match(source, /No encontramos esta página/, 'The recovery message must be in Spanish.')
assert.match(source, /href="\/"/, 'The page must offer a safe route back home.')
assert.match(source, /href="\/comenzar"/, 'The page must offer a route into the diagnostic journey.')
assert.doesNotMatch(
  source,
  /This page could not be found/i,
  'The default English not-found message must not return.',
)

console.log('Global Spanish not-found recovery contract passed.')
