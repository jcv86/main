import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const a2Route = source('app/api/a2/coach-assist/route.ts')
const a3Route = source('app/api/a3/coach-suggestion/route.ts')
const a2Client = source('components/a2-enhanced-input.tsx')

for (const [path, content] of [
  ['app/api/a2/coach-assist/route.ts', a2Route],
  ['app/api/a3/coach-suggestion/route.ts', a3Route],
] as const) {
  assert.ok(content.includes('resolveServerUser()'), `${path} must verify the Supabase session.`)
  assert.ok(content.includes('requestSchema.safeParse(payload)'), `${path} must validate its payload.`)
  assert.ok(content.includes("code: 'authentication_required'"), `${path} must reject anonymous access.`)
  assert.ok(content.includes("'Cache-Control': 'private, no-store'"), `${path} must prevent caching private coaching output.`)
  assert.ok(content.includes("model: 'gpt-4o-mini'"), `${path} must use the supported low-cost model.`)
  assert.ok(content.includes('store: false'), `${path} must disable response storage.`)
  assert.ok(!content.includes('SUPABASE_SERVICE_ROLE_KEY'), `${path} must not use service_role.`)
  assert.ok(!content.includes("from '@supabase/supabase-js'"), `${path} must not construct a privileged global client.`)
  assert.ok(!content.includes("request.headers.get('authorization')"), `${path} must not trust header presence as authentication.`)
}

assert.ok(a2Route.includes("from '@/lib/supabase/server'"))
assert.ok(a2Route.includes(".eq('user_id', resolvedUser.id)"))
assert.ok(a2Route.includes('.maybeSingle()'))
assert.ok(!a2Route.includes('const { question, currentAnswer, userId }'))
assert.ok(!a2Route.includes('.eq(\'user_id\', userId)'))
assert.ok(!a2Route.includes('userId: z.'))
assert.ok(!a2Client.includes('userId: userId'))
assert.ok(!a2Client.includes('userId,\n        })'))

assert.ok(!a3Route.includes('coaching_interactions'))
assert.ok(!a3Route.includes(".insert("))
assert.ok(!a3Route.includes('gpt-4-turbo-preview'))
assert.ok(a3Route.includes('answer: z.string().trim().min(1).max(8_000)'))
assert.ok(a3Route.includes('context: z.string().trim().max(4_000)'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    coachingRoutesChecked: 2,
    sessionVerifiedBySupabase: true,
    clientControlledUserIdAccepted: false,
    serviceRoleUsedByCoaching: false,
    inputBoundsEnforced: true,
    model: 'gpt-4o-mini',
    responseStorageDisabled: true,
    liveHttpCheckedInThisScript: false,
    liveOpenAiCheckedInThisScript: false,
  }),
)
