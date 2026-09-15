export const DTC_REQUEST_ID_HEADER = 'x-dtc-request-id'

const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/

export function normalizeRequestId(value: string | null | undefined): string | null {
  const candidate = value?.trim()
  if (!candidate || !REQUEST_ID_PATTERN.test(candidate)) return null
  return candidate
}

export function createRequestId(): string {
  const uuid = globalThis.crypto?.randomUUID?.()
  if (uuid) return `dtc-${uuid}`

  // randomUUID is available in supported browser, Node and Edge runtimes. This
  // fallback is intentionally non-secret and exists only for correlation.
  return `dtc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`
}

export function resolveRequestId(headers: Headers): string {
  return (
    normalizeRequestId(headers.get(DTC_REQUEST_ID_HEADER)) ||
    normalizeRequestId(headers.get('x-request-id')) ||
    createRequestId()
  )
}
