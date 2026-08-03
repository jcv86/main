import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const balanceRoute = source('app/api/gamification/dtc-balance/route.ts')
const profileRoute = source('app/api/gamification/profile/route.ts')
const purchaseRoute = source('app/api/gamification/dtc-purchase/route.ts')
const legacyTrackRoute = source('app/api/gamification/track-interview/route.ts')
const shopPage = source('app/despega/a3/dtc-shop/page.tsx')
const profilePage = source('app/despega/a3/gamification/page.tsx')
const shop = source('components/dtc-shop.tsx')
const summary = source('lib/gamification/server-summary.ts')
const migration = source('migrations/11-gamification-server-owned-hardening.sql')

for (const route of [balanceRoute, profileRoute, purchaseRoute, legacyTrackRoute]) {
  assert.ok(route.includes("from '@/lib/auth/server-user'"))
  assert.ok(route.includes('resolveServerUser()'))
  assert.ok(!route.includes("searchParams.get('userId')"))
  assert.ok(!route.includes('request.json()'))
}

assert.ok(balanceRoute.includes(".eq('user_id', currentUser.id)"))
assert.ok(balanceRoute.includes("code: 'SERVER_OWNED_BALANCE'"))
assert.ok(balanceRoute.includes('status: 405'))
assert.ok(!balanceRoute.includes(".insert("))
assert.ok(!balanceRoute.includes(".update("))

assert.ok(profileRoute.includes('getGamificationSummary(currentUser.id)'))
assert.ok(profileRoute.includes('summary,'))
assert.ok(!profileRoute.includes("createClient(supabaseUrl"))

assert.ok(purchaseRoute.includes("code: 'PAYMENTS_NOT_CONFIGURED'"))
assert.ok(purchaseRoute.includes('status: 503'))
assert.ok(!purchaseRoute.includes("createClient("))
assert.ok(!purchaseRoute.includes(".insert("))
assert.ok(!purchaseRoute.includes('stripe_'))

assert.ok(
  legacyTrackRoute.includes("code: 'LEGACY_GAMIFICATION_ENDPOINT_RETIRED'"),
)
assert.ok(legacyTrackRoute.includes('status: 410'))
assert.ok(!legacyTrackRoute.includes("createClient("))
assert.ok(!legacyTrackRoute.includes(".insert("))
assert.ok(!legacyTrackRoute.includes('xpEarned'))

assert.ok(shopPage.includes("fetch('/api/gamification/dtc-balance')"))
assert.ok(!shopPage.includes('userId='))
assert.ok(profilePage.includes("fetch('/api/gamification/profile')"))
assert.ok(profilePage.includes('data.summary'))
assert.ok(!profilePage.includes('userId='))
assert.ok(!shop.includes("fetch('/api/gamification/dtc-purchase'"))
assert.ok(shop.includes('Las compras todavía no están habilitadas'))
assert.ok(shop.toLowerCase().includes('no se realizará ningún cobro'))

assert.ok(summary.includes('bestStreak: number'))
assert.ok(summary.includes('totalTipsEarned: number'))
assert.ok(summary.includes('best_interview_streak'))
assert.ok(summary.includes('total_tips_earned_free'))
assert.ok(summary.includes('total_tips_earned_premium'))

for (const table of [
  'public.user_dtc_balance',
  'public.dtc_transactions',
  'public.dtc_purchases',
  'public.interview_session_gamification',
  'public.user_gamification_profile',
]) {
  assert.ok(migration.includes(table))
}
assert.ok(migration.includes('from anon, authenticated'))
assert.ok(migration.includes('to authenticated'))
assert.ok(migration.includes('to service_role'))
assert.ok(migration.includes('grant select on table'))
assert.ok(migration.includes('grant all privileges on table'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    protectedFacts: ['DTC balances', 'DTC purchases', 'interview XP', 'profile reads'],
    serverOwnedWrites: true,
    clientUserIdsRejectedByDesign: true,
    simulatedPurchasesDisabled: true,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
