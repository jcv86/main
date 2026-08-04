import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const rootMiddleware = source('middleware.ts')
const authMiddleware = source('lib/supabase/middleware.ts')
const authHook = source('hooks/use-auth-redirect.ts')
const demoCompatibility = source('lib/auth/demo-user.ts')

assert.ok(rootMiddleware.includes("import { updateSession } from '@/lib/supabase/middleware'"))
assert.ok(rootMiddleware.includes('const response = await updateSession(request)'))
assert.ok(rootMiddleware.includes('response.cookies.set(DEMO_COOKIE_NAME'))

assert.ok(authMiddleware.includes("'/despega'"))
assert.ok(authMiddleware.includes("'/dashboard'"))
assert.ok(authMiddleware.includes("'/a4-dashboard'"))
assert.ok(authMiddleware.includes('const protectedPath = isProtectedPath(pathname)'))
assert.ok(authMiddleware.includes('if (protectedPath && !user)'))
assert.ok(authMiddleware.includes("redirectToSignIn(request, 'authentication_unavailable')"))
assert.ok(authMiddleware.includes("redirectToSignIn(request, 'authentication_verification_failed')"))
assert.ok(authMiddleware.includes('if (protectedPath)'))
assert.ok(authMiddleware.includes('await supabase.auth.getUser()'))
assert.ok(!authMiddleware.includes('isA3Route'))
assert.ok(!authMiddleware.includes('isInterview0Route'))
assert.ok(!authMiddleware.includes('DEMO/PREVIEW'))
assert.ok(!authMiddleware.includes('accessible without authentication'))
assert.ok(!authMiddleware.includes('dcfrbwxbejtbcouionna.supabase.co'))
assert.ok(!authMiddleware.includes('eyJhbGciOiJIUzI1Ni'))
assert.ok(!authMiddleware.includes("process.env.NODE_ENV === 'production'"))

assert.ok(authHook.includes('supabase.auth.getUser()'))
assert.ok(authHook.includes('supabase.auth.onAuthStateChange'))
assert.ok(authHook.includes('router.replace(SIGN_IN_PATH)'))
assert.ok(authHook.includes("window.localStorage.removeItem('demo_user')"))
assert.ok(!authHook.includes('readDemoUser'))
assert.ok(!authHook.includes("getItem('demo_user')"))
assert.ok(!authHook.includes('setUser(readDemoUser'))

assert.ok(demoCompatibility.includes('return null'))
assert.ok(demoCompatibility.includes('return false'))
assert.ok(demoCompatibility.includes('maxAge: 0'))
assert.ok(!demoCompatibility.includes('SignJWT'))
assert.ok(!demoCompatibility.includes('jwtVerify'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    protectedPrefixes: ['/despega', '/dashboard', '/a4-dashboard'],
    publicA3PreviewRemoved: true,
    authenticationFailureMode: 'fail_closed',
    hardcodedSupabaseCredentialsRemoved: true,
    clientDemoIdentityAcceptedBySharedHook: false,
    oldDemoStateCleaned: true,
    liveHttpCheckedInThisScript: false,
    liveAuthStateCheckedInThisScript: false,
  }),
)
