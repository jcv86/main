import { normalizeNextPath } from '@/lib/auth/pilot-access'

export interface AuthenticationRecovery {
  title: string
  message: string
  retryHref: string
}

export function getAuthenticationRecovery(
  reason: string | null,
  requestedNext: string | null,
): AuthenticationRecovery | null {
  if (reason !== 'authentication_unavailable' && reason !== 'authentication_verification_failed') {
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

  return {
    title: 'No pudimos verificar tu sesión',
    message: 'La sesión pudo haber vencido. Vuelve a ingresar para continuar desde el mismo punto.',
    retryHref,
  }
}
