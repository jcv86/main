export type PilotAuthState = 'signed_out' | 'invalid_session' | 'authenticated'
export type PilotOAuthProvider = 'google' | 'linkedin_oidc'

const DEFAULT_NEXT_PATH = '/despega'

export function normalizeNextPath(value: string | null): string {
  if (!value) return DEFAULT_NEXT_PATH

  const candidate = value.trim()
  if (
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(candidate)
  ) {
    return DEFAULT_NEXT_PATH
  }

  return candidate
}

export function classifyAuthState(input: {
  hasUser: boolean
  authErrorCode?: string
}): PilotAuthState {
  if (input.hasUser) return 'authenticated'
  if (input.authErrorCode === 'session_not_found') return 'signed_out'
  return input.authErrorCode ? 'invalid_session' : 'signed_out'
}

export function providerRedirect(
  provider: PilotOAuthProvider,
  origin: string,
  nextPath: string,
): {
  provider: PilotOAuthProvider
  options: { redirectTo: string }
} {
  const callback = new URL('/auth/callback', new URL(origin).origin)
  callback.searchParams.set('next', normalizeNextPath(nextPath))

  return {
    provider,
    options: { redirectTo: callback.toString() },
  }
}
