import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const logPath = process.argv[2]
assert.ok(logPath, 'Usage: check-build-warning-contract.ts <build.log>')

const log = readFileSync(resolve(logPath), 'utf8')

for (const fatal of [
  'Failed to compile',
  'Build error occurred',
  'Type error:',
  'ELIFECYCLE',
]) {
  assert.ok(!log.includes(fatal), `Build log contains fatal marker: ${fatal}`)
}
assert.ok(log.includes('Route (app)'), 'Build output must include the generated route table.')
assert.ok(
  log.includes('Generating static pages'),
  'Build output must confirm static page generation.',
)

const warningLines = log
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(
    (line) =>
      line.includes('⚠') ||
      line.includes('[v0] Warning:') ||
      line.includes('[Upstash Redis]') ||
      line.includes('A Node.js API is used'),
  )

const categories = new Set<string>()
const unknownWarnings: string[] = []

for (const line of warningLines) {
  if (line.includes('No build cache found')) {
    categories.add('build_cache_missing')
  } else if (line.includes('Compiled with warnings')) {
    categories.add('compiled_with_warnings')
  } else if (line.includes('A Node.js API is used')) {
    categories.add('edge_runtime_compatibility')
  } else if (line.includes('OPENAI_API_KEY not set')) {
    categories.add('optional_openai_key_missing')
  } else if (line.includes('[Upstash Redis]')) {
    categories.add('optional_upstash_config_missing')
  } else {
    unknownWarnings.push(line)
  }
}

assert.deepEqual(
  unknownWarnings,
  [],
  `Unclassified build warnings must be reviewed: ${unknownWarnings.join(' | ')}`,
)

console.log(
  JSON.stringify({
    buildStatus: categories.size === 0 ? 'clean_success' : 'success_with_known_warnings',
    cleanBuild: categories.size === 0,
    warningCategories: [...categories].sort(),
    warningMarkerLines: warningLines.length,
    liveRuntimeStarted: false,
    interpretation:
      'The production bundle compiled and routes were generated. This is not a live server or browser test.',
  }),
)
