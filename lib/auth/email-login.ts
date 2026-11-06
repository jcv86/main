import { normalizeNextPath } from '@/lib/auth/pilot-access'
import { getAuthenticationRecovery } from '@/lib/auth/signin-recovery'

export const EMAIL_LOGIN_ERRORS = {
  invalid_request: { status: 400, message: 'Ingresa un correo y una contraseña válidos.' },
  invalid_credentials: { status: 401, message: 'El correo o la contraseña no son correctos. Revisa tus datos e intenta nuevamente.' },
  email_not_confirmed: { status: 403, message: 'Confirma tu correo antes de ingresar. Revisa el mensaje de confirmación de tu cuenta.' },
  access_required: { status: 403, message: 'Esta cuenta todavía no tiene acceso al piloto. Solicita una invitación o ingresa con una cuenta habilitada.' },
  rate_limited: { status: 429, message: 'Alcanzaste el límite de intentos de acceso. Espera unos minutos antes de volver a intentar.' },
  authentication_unavailable: { status: 503, message: 'No pudimos conectarnos al servicio de acceso. Intenta nuevamente en unos instantes.' },
} as const

export type EmailLoginError = keyof typeof EMAIL_LOGIN_ERRORS

export function parseEmailLoginCredentials(value: unknown): { email: string; password: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const body = value as Record<string, unknown>
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  if (!email || !password || email.length > 254 || password.length > 256) return null
  return { email, password }
}

export function classifyPasswordLoginError(value: unknown): EmailLoginError {
  const error = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  if (error.status === 429 || error.code === 'over_request_rate_limit') return 'rate_limited'
  if (error.code === 'invalid_credentials') return 'invalid_credentials'
  if (error.code === 'email_not_confirmed') return 'email_not_confirmed'
  // A transport, configuration or unexpected provider failure is not proof of
  // incorrect credentials. Never forward the provider's raw diagnostic text.
  return 'authentication_unavailable'
}

export function emailLoginErrorMessage(status: number, value: unknown): string {
  const code = value && typeof value === 'object' ? (value as Record<string, unknown>).error : null
  if (status === 400) return EMAIL_LOGIN_ERRORS.invalid_request.message
  if (status === 401) return EMAIL_LOGIN_ERRORS.invalid_credentials.message
  if (status === 429) return EMAIL_LOGIN_ERRORS.rate_limited.message
  if (status === 403 && code === 'email_not_confirmed') return EMAIL_LOGIN_ERRORS.email_not_confirmed.message
  if (status === 403 && code === 'access_required') return EMAIL_LOGIN_ERRORS.access_required.message
  return EMAIL_LOGIN_ERRORS.authentication_unavailable.message
}

export function getEmailLoginContext(search: string) {
  const params = new URLSearchParams(search)
  const nextPath = normalizeNextPath(params.get('next') || '/despega/recorrido')
  const reason = params.get('reason')
  const recovery = getAuthenticationRecovery(reason, nextPath)
  const invited = params.get('invited') === '1'
  const backParams = new URLSearchParams({ next: nextPath })
  if (invited) backParams.set('invited', '1')
  if (recovery && reason) backParams.set('reason', reason)
  return { nextPath, invited, recovery, signInHref: `/auth/signin?${backParams.toString()}` }
}
