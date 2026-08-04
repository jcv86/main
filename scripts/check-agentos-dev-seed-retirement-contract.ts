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

const route = source('app/api/dtc-agentos/dev/seed/route.ts')

assert.ok(route.includes("code: 'AGENTOS_DEV_SEED_RETIRED'"))
assert.ok(route.includes('status: 410'))
assert.ok(route.includes('export async function POST()'))
assert.ok(route.includes('export async function GET()'))
assert.ok(route.includes("'Cache-Control': 'no-store'"))
assert.ok(!route.includes('request.json()'))
assert.ok(!route.includes('createClient'))
assert.ok(!route.includes('seedDemoData'))
assert.ok(!route.includes('inspectUserState'))
assert.ok(!route.includes('isDevModeUser'))
assert.ok(!route.includes('includeC1'))
assert.ok(!route.includes('includeA4Documents'))

assert.equal(
  existsSync(join(process.cwd(), 'lib/dtc-agentos/dev/dev-mode.ts')),
  false,
  'The production demo-seeding library must remain deleted.',
)

const activeFiles = [
  ...executableFiles('app'),
  ...executableFiles('components'),
  ...executableFiles('hooks'),
  ...executableFiles('lib'),
]

for (const path of activeFiles) {
  const content = source(path)
  if (path === 'app/api/dtc-agentos/dev/seed/route.ts') continue

  assert.ok(
    !content.includes("@/lib/dtc-agentos/dev/dev-mode"),
    `${path} imports the retired AgentOS seed library.`,
  )
  assert.ok(!content.includes('seedDemoData('), `${path} can seed demo data.`)
  assert.ok(!content.includes('isDevModeUser('), `${path} uses the retired dev allowlist.`)
  assert.ok(
    !content.includes("fetch('/api/dtc-agentos/dev/seed'"),
    `${path} calls the retired AgentOS seed endpoint.`,
  )
}

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    publicDevSeedRetired: true,
    devInspectionEndpointRetired: true,
    demoSeedingLibraryDeleted: true,
    fakeProgressWritesReachable: false,
    fakeMemoryWritesReachable: false,
    fakeDocumentWritesReachable: false,
    activeCallers: 0,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
