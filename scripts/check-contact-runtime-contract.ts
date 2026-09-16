import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const route = source('app/api/contact/route.ts')
const sender = source('lib/emails/send-email.ts')

assert.ok(
  route.includes('await sendEmail({'),
  'Contact submissions must use the server-owned email sender directly.',
)
assert.ok(
  !route.includes('/api/emails/send'),
  'Contact submissions must not depend on the retired/nonexistent /api/emails/send endpoint.',
)
assert.ok(
  route.includes('to: SUPPORT_EMAIL') && route.includes('replyTo: form.email'),
  'The support copy must be delivered to the fixed support inbox with the visitor only as Reply-To.',
)
assert.ok(
  route.includes('return jsonMessage(') && route.includes('Support delivery failed'),
  'A failed support delivery must fail the request instead of reporting false success.',
)
assert.ok(
  route.includes('Confirmation delivery failed') && route.includes('Message accepted'),
  'Confirmation delivery may degrade without making the user create a duplicate support request.',
)
assert.ok(
  route.includes('createHash("sha256")') && route.includes('ratelimit.limit(rateLimitKey(address))'),
  'Rate limiting must avoid storing the raw client address as the limiter key.',
)
assert.ok(
  route.includes('escapeHtml(form.message)') && route.includes('escapeHtml(form.subject)'),
  'User-controlled contact content must be escaped before interpolation into HTML email.',
)
assert.ok(
  route.includes('.refine((value) => !/[\\r\\n]/.test(value)'),
  'Contact subjects must reject CR/LF injection.',
)
assert.ok(
  route.includes('.strict()'),
  'Contact payload validation must reject unexpected fields.',
)

for (const forbidden of [
  'console.log("[v0] Contact form submitted',
  'console.error("[v0] Contact API error:',
  'ip: ip',
  'email: formData.email',
  'name: formData.name',
]) {
  assert.ok(!route.includes(forbidden), `Contact route must not log or forward legacy PII pattern: ${forbidden}`)
}

assert.ok(sender.includes('replyTo?: string'), 'Email sender must support an explicit Reply-To address.')
assert.ok(sender.includes('replyTo: replyTo || from'), 'Email sender must apply the explicit Reply-To when supplied.')
assert.ok(
  sender.includes("console.error('[email] Delivery failed', { errorType: errorType(error) })"),
  'Email delivery logs must expose only the error type, not provider payloads or message content.',
)
assert.ok(
  sender.includes("throw new Error('Email delivery failed')"),
  'Provider failures must be normalized before they propagate to callers.',
)

console.log(
  JSON.stringify({
    evidenceLevel: 'source_contract',
    directServerDelivery: true,
    retiredInternalEmailEndpointDependency: false,
    supportFailureCanReturnFalseSuccess: false,
    rawClientAddressUsedAsLimiterKey: false,
    visitorContentEscapedForHtml: true,
    contactPiiLogged: false,
    explicitReplyToSupported: true,
    providerErrorsRedacted: true,
  }),
)
