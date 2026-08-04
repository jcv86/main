import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const webhook = source('app/api/webhooks/auto-detection/route.ts')
const a1Save = source('app/api/a1-cerebral-save/route.ts')
const jobMatching = source('app/api/a4/job-matching/route.ts')

assert.ok(webhook.includes("code: 'A4_AUTO_DETECTION_WEBHOOK_RETIRED'"))
assert.ok(webhook.includes("replacement: '/api/a4/job-matching'"))
assert.ok(webhook.includes('status: 410'))
assert.ok(webhook.includes("'Cache-Control': 'no-store'"))
assert.ok(webhook.includes('export async function POST()'))
assert.ok(webhook.includes('export async function GET()'))
assert.ok(!webhook.includes('request.text()'))
assert.ok(!webhook.includes('request.json()'))
assert.ok(!webhook.includes('verifyWebhookSignature'))
assert.ok(!webhook.includes('dev-mode'))
assert.ok(!webhook.includes('x-webhook-signature'))
assert.ok(!webhook.includes('userId'))
assert.ok(!webhook.includes('matchJobsForUser'))
assert.ok(!webhook.includes('saveJobMatch'))
assert.ok(!webhook.includes('createNotification'))

assert.ok(!a1Save.includes('/api/webhooks/auto-detection'))
assert.ok(!a1Save.includes('x-webhook-signature'))
assert.ok(!a1Save.includes("event: 'a1_completed'"))
assert.ok(a1Save.includes('supabase.auth.getUser()'))
assert.ok(a1Save.includes('user_id: user.id'))

assert.ok(jobMatching.includes('resolveServerUser()'))
assert.ok(jobMatching.includes('checkA4Access(currentUser.id'))
assert.ok(jobMatching.includes(".eq('user_id', currentUser.id)"))
assert.ok(!jobMatching.includes('searchParams.get(\'userId\')'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    publicWebhookRetired: true,
    manualGetTriggerRetired: true,
    weakSignatureAcceptanceRetired: true,
    a1PrematureJobMatchingRemoved: true,
    replacementAuthenticated: true,
    replacementA4Gated: true,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
