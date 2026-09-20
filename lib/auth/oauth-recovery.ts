export const OAUTH_STATE_EXPIRED_REASON = 'oauth_state_expired' as const

export function isStaleOAuthStateReturn(
  pathname: string,
  searchParams: URLSearchParams,
): boolean {
  if (pathname !== '/') return false

  return searchParams.get('error') === 'invalid_request'
    && searchParams.get('error_code') === 'bad_oauth_state'
}
