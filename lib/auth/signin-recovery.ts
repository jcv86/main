import { normalizeNextPath } from '@/lib/auth/pilot-access'
import { OAUTH_STATE_EXPIRED_REASON } from '@/lib/auth/oauth-recovery'

export interface AuthenticationRecovery {
  title: string
  message: string
  retryHref: string
}

export function getAuthenticationRecovery(
  reason: string | null,
  requestedNext: string | null,
): AuthenticationRecovery | null {
  if (reason !== 'authentication_unavailable'
    && reason !== 'authentication_verification_failed'
    && reason !== OAUTH_STATE_EXPIRED_REASON) {
    return null
  }

  const nextPath = normalizeNextPath(requestedNext)
  const retryHref = `/auth/signin?${new URLSearchParams({ next: nextPath }).toString()}`

  if (reason === 'authentication_unavailable') {
    return {
      title: 'Acceso temporalmente no disponible',
      message: 'No pudimos conectarnos al servicio de acceso. Tu avance está protegido; intenta nuevamente en unos instantes.',
      retryHref,
    }
  }

  if (reason === OAUTH_STATE_EXPIRED_REASON) {
    return {
      title: 'El inicio de sesión anterior expiró',
      message: 'Volviste a un paso anterior del acceso. Por seguridad ese intento ya no se puede reutilizar; inicia sesión nuevamente.',
      retryHref,
    }
  }

  return {
    title: 'No pudimos verificar tu sesión',
    message: 'La sesión pudo haber vencido. Vuelve a ingresar para continuar desde el mismo punto.',
    retryHref,
  }
}