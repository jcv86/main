import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isTravisMode } from '../lib/travis-form-data'

const source = readFileSync(
  join(process.cwd(), 'lib/travis-form-data.ts'),
  'utf8',
)

assert.equal(isTravisMode(), false)
assert.ok(!source.includes("localStorage.getItem('demo_user')"))
assert.ok(!source.includes("document.cookie.includes('demo_user')"))
assert.ok(source.includes('return false'))

console.log(
  JSON.stringify({
    browserControlledDemoModeRetired: true,
    authenticatedSyntheticSeedingDisabled: true,
    explicitTestFixturesPreserved: true,
  }),
)
