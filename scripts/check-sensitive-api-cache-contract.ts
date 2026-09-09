import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'

interface HeaderRule {
  source?: string
  headers?: Array<{ key?: string; value?: string }>
}

const config = JSON.parse(
  readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8'),
) as { headers?: HeaderRule[] }

const rules = config.headers ?? []
const sensitiveSources = [
  '/api/a1(.*)',
  '/api/a2(.*)',
  '/api/a3(.*)',
  '/api/a4(.*)',
  '/api/v1-analytics(.*)',
]
const dailyTaskRoute = readFileSync(
  path.join(process.cwd(), 'app/api/a2/daily-task/route.ts'),
  'utf8',
)

for (const source of sensitiveSources) {
  const rule = rules.find((candidate) => candidate.source === source)
  assert.ok(rule, `${source} must have an explicit private cache policy`)

  const headers = new Map(
    (rule.headers ?? []).map((header) => [
      header.key?.toLowerCase(),
      header.value?.toLowerCase() ?? '',
    ]),
  )
  const browserPolicy = headers.get('cache-control') ?? ''
  const cdnPolicy = headers.get('cdn-cache-control') ?? ''

  assert.match(browserPolicy, /(?:^|,\s*)private(?:,|$)/, `${source} must be private`)
  assert.match(browserPolicy, /(?:^|,\s*)no-store(?:,|$)/, `${source} must be no-store`)
  assert.equal(cdnPolicy, 'no-store', `${source} must not be stored by the CDN`)
  assert.doesNotMatch(browserPolicy, /(?:^|,\s*)public(?:,|$)/)
  assert.doesNotMatch(browserPolicy, /s-maxage/)
}

for (const rule of rules) {
  if (!rule.source || !/^\/api\/(?:a[1-4]|v1-analytics)/.test(rule.source)) continue
  for (const header of rule.headers ?? []) {
    if (!/cache-control/i.test(header.key ?? '')) continue
    assert.doesNotMatch(
      header.value ?? '',
      /(?:^|,\s*)public(?:,|$)|s-maxage/i,
      `${rule.source} must never enable shared caching`,
    )
  }
}

assert.match(dailyTaskRoute, /'Cache-Control', 'private, no-store, max-age=0'/)
assert.match(dailyTaskRoute, /'CDN-Cache-Control', 'no-store'/)
assert.doesNotMatch(dailyTaskRoute, /public,\s*s-maxage|CDN-Cache-Control':\s*'max-age/i)

console.log(
  JSON.stringify({
    sensitiveApiFamilies: sensitiveSources.length,
    browserCache: 'private, no-store',
    cdnCache: 'no-store',
    publicApiCacheRules: 0,
  }),
)
