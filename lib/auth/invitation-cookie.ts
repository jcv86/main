import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const PILOT_CLAIM_COOKIE = 'dtc_pilot_claim'
export const PILOT_CLAIM_MAX_AGE = 15 * 60

const SECRET_CONTEXT = 'dtc-pilot-invitation-cookie-v1'

export function resolveInvitationCookieSecret(
  env: Partial<Pick<NodeJS.ProcessEnv, 'PILOT_INVITATION_COOKIE_SECRET' | 'SUPABASE_SERVICE_ROLE_KEY'>> = process.env,
): string {
  const configured = env.PILOT_INVITATION_COOKIE_SECRET?.trim() ?? ''
  if (configured.length >= 32) return configured

  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? ''
  if (serviceRoleKey.length < 32) return ''

  return createHash('sha256')
    .update(`${SECRET_CONTEXT}\0${serviceRoleKey}`)
    .digest('hex')
}

function signature(claimId: string, secret: string): string {
  return createHmac('sha256', secret).update(claimId).digest('base64url')
}

export function createInvitationCookieValue(claimId: string, secret: string): string {
  return `${claimId}.${signature(claimId, secret)}`
}

export function verifyInvitationCookieValue(value: string | undefined, secret: string): string | null {
  if (!value || !secret) return null
  const separator = value.lastIndexOf('.')
  if (separator < 1) return null

  const claimId = value.slice(0, separator)
  const supplied = Buffer.from(value.slice(separator + 1))
  const expected = Buffer.from(signature(claimId, secret))
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(claimId)) return null
  return claimId
}
