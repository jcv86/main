import assert from 'node:assert/strict'
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs'
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

    if (['.ts', '.tsx', '.js', '.jsx', '.sql', '.sh'].includes(extname(entry))) {
      files.push(relative(process.cwd(), absolute))
    }
  }
  return files
}

const demoRoute = source('app/api/auth/demo/route.ts')
const demoUser = source('lib/auth/demo-user.ts')
const serverUser = source('lib/auth/server-user.ts')
const authMiddleware = source('lib/auth/middleware.ts')
const rootMiddleware = source('middleware.ts')

assert.ok(demoRoute.includes("code: 'DEMO_AUTH_RETIRED'"))
assert.ok(demoRoute.includes('{ status: 410 }'))
assert.ok(!demoRoute.includes('createDemoSessionToken()'))
assert.ok(!demoRoute.includes('getTravisDemoUser()'))

assert.ok(!demoUser.includes("from 'jose'"))
assert.ok(!demoUser.includes('SignJWT'))
assert.ok(!demoUser.includes('jwtVerify'))
assert.ok(!demoUser.includes('TRAVIS_USER_ID'))
assert.ok(!demoUser.includes('TRAVIS_EMAIL'))
assert.ok(demoUser.includes('return null'))
assert.ok(demoUser.includes('return false'))
assert.ok(demoUser.includes('maxAge: 0'))

assert.ok(serverUser.includes("ServerUserSource = 'supabase'"))
assert.ok(!serverUser.includes("| 'demo'"))
assert.ok(!serverUser.includes('verifyDemoSessionToken'))
assert.ok(!serverUser.includes('DEMO_COOKIE_NAME'))

assert.ok(!authMiddleware.includes('getDemoUserFromRequest'))
assert.ok(!authMiddleware.includes('isDemo: true'))
assert.ok(!authMiddleware.includes('isDemoUser: true'))
assert.ok(!rootMiddleware.includes('verifyDemoSessionToken'))
assert.ok(rootMiddleware.includes("response.cookies.set(DEMO_COOKIE_NAME, ''"))

assert.equal(
  existsSync(join(process.cwd(), 'components/auth-bypass.tsx')),
  false,
  'The credential-bearing auth bypass component must remain deleted.',
)
assert.equal(
  existsSync(join(process.cwd(), 'scripts/999-create-demo-users.sql')),
  false,
  'The credential-bearing demo-user creation script must remain deleted.',
)
assert.equal(
  existsSync(join(process.cwd(), 'test-a2-authenticated-flow.sh')),
  false,
  'The credential-bearing authenticated-flow script must remain deleted.',
)

const forbiddenPasswords = ['travis123', 'demo123', 'test123', 'admin123']
const scannedFiles = [
  ...executableFiles('app'),
  ...executableFiles('components'),
  ...executableFiles('hooks'),
  ...executableFiles('lib'),
  ...executableFiles('scripts'),
  'middleware.ts',
]

for (const path of scannedFiles) {
  const content = source(path)
  for (const password of forbiddenPasswords) {
    assert.ok(!content.includes(password), `${path} contains an exposed password.`)
  }
}

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    publicDemoSessionIssuance: false,
    demoIdentityAcceptedByServerResolver: false,
    oldDemoCookiesCleared: true,
    credentialBearingFilesRemoved: 3,
    executableFilesScanned: scannedFiles.length,
    exposedPasswordsFound: 0,
    liveHttpCheckedInThisScript: false,
    liveAuthStateCheckedInThisScript: false,
  }),
)
