import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

function executableFiles(rootPath: string): string[] {
  const absoluteRoot = join(process.cwd(), rootPath)
  if (!existsSync(absoluteRoot)) return []

  const files: string[] = []
  for (const entry of readdirSync(absoluteRoot)) {
    const absolute = join(absoluteRoot, entry)
    const stats = statSync(absolute)
    if (stats.isDirectory()) {
      files.push(...executableFiles(relative(process.cwd(), absolute)))
      continue
    }
    if (['.ts', '.tsx', '.js', '.jsx'].includes(extname(entry))) {
      files.push(relative(process.cwd(), absolute))
    }
  }
  return files
}

const c1Legacy = source('app/api/conozcamonos/save-c1-responses/route.ts')
const c2Legacy = source('app/api/conozcamonos/save-c2-responses/route.ts')
const c1Page = source('app/despega/conozcamonos-1/page.tsx')
const c2Page = source('app/despega/conozcamonos-2/page.tsx')
const completeC2 = source('app/api/journey/complete-c2/route.ts')

assert.ok(c1Legacy.includes("code: 'LEGACY_C1_RESPONSE_ENDPOINT_RETIRED'"))
assert.ok(c1Legacy.includes("replacement: '/despega/conozcamonos-1'"))
assert.ok(c1Legacy.includes('status: 410'))
assert.ok(!c1Legacy.includes('request.json()'))
assert.ok(!c1Legacy.includes('user_id'))
assert.ok(!c1Legacy.includes('createClient'))
assert.ok(!c1Legacy.includes('executeCommand'))

assert.ok(c2Legacy.includes("code: 'LEGACY_C2_RESPONSE_ENDPOINT_RETIRED'"))
assert.ok(c2Legacy.includes("replacement: '/api/journey/complete-c2'"))
assert.ok(c2Legacy.includes('status: 410'))
assert.ok(!c2Legacy.includes('request.json()'))
assert.ok(!c2Legacy.includes('user_id'))
assert.ok(!c2Legacy.includes('createClient'))
assert.ok(!c2Legacy.includes('executeCommand'))
assert.ok(!c2Legacy.includes('buildDtcContext'))

assert.ok(c1Page.includes('supabase.auth.getUser()'))
assert.ok(c1Page.includes(".from('canon_conozcamonos_1_responses')"))
assert.ok(c1Page.includes('user_id: user.id'))
assert.ok(!c1Page.includes('/api/conozcamonos/save-c1-responses'))

assert.ok(c2Page.includes("fetch('/api/journey/complete-c2'"))
assert.ok(c2Page.includes("credentials: 'include'"))
assert.ok(c2Page.includes('JSON.stringify({ responses })'))
assert.ok(!c2Page.includes('/api/conozcamonos/save-c2-responses'))
assert.ok(!c2Page.includes('userId'))
assert.ok(!c2Page.includes('user_id'))

assert.ok(completeC2.includes('resolveServerUser()'))
assert.ok(completeC2.includes('const userId = currentUser.id'))
assert.ok(completeC2.includes(".from('canon_conozcamonos_2_responses')"))
assert.ok(completeC2.includes('validateResponses(body.responses)'))
assert.ok(!completeC2.includes('body.userId'))
assert.ok(!completeC2.includes('body.user_id'))

const activeFiles = [
  ...executableFiles('app'),
  ...executableFiles('components'),
  ...executableFiles('hooks'),
  ...executableFiles('lib'),
]
for (const path of activeFiles) {
  const content = source(path)
  assert.ok(
    !content.includes('/api/conozcamonos/save-c1-responses'),
    `${path} still calls the retired C1 endpoint.`,
  )
  assert.ok(
    !content.includes('/api/conozcamonos/save-c2-responses'),
    `${path} still calls the retired C2 endpoint.`,
  )
}

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    retiredLegacyEndpoints: 2,
    clientSuppliedUserIdAccepted: false,
    canonicalC1UsesAuthenticatedUser: true,
    canonicalC2UsesServerSession: true,
    activeLegacyCallers: 0,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
