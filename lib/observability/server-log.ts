import 'server-only'

const SENSITIVE_KEY = /(authorization|cookie|token|secret|password|email|phone|rut|name|prompt|content|answer|response|body)/i
const SAFE_STRING_LIMIT = 180

type LogPrimitive = string | number | boolean | null | undefined

type OperationalLogInput = {
  event: string
  requestId: string
  route?: string
  status?: string | number
  metadata?: Record<string, LogPrimitive>
}

function safeMetadata(metadata: Record<string, LogPrimitive> | undefined) {
  if (!metadata) return undefined

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      if (SENSITIVE_KEY.test(key)) return [key, '[REDACTED]']
      if (typeof value === 'string') return [key, value.slice(0, SAFE_STRING_LIMIT)]
      return [key, value ?? null]
    }),
  )
}

function errorDescriptor(error: unknown) {
  if (!error || typeof error !== 'object') {
    return { name: 'UnknownError' }
  }

  const candidate = error as { name?: unknown; code?: unknown }
  return {
    name: typeof candidate.name === 'string' ? candidate.name.slice(0, 80) : 'Error',
    code:
      typeof candidate.code === 'string' || typeof candidate.code === 'number'
        ? String(candidate.code).slice(0, 80)
        : undefined,
  }
}

function basePayload(input: OperationalLogInput) {
  return {
    ts: new Date().toISOString(),
    event: input.event,
    request_id: input.requestId,
    route: input.route,
    status: input.status,
    metadata: safeMetadata(input.metadata),
  }
}

export function logOperationalEvent(input: OperationalLogInput) {
  console.info(JSON.stringify(basePayload(input)))
}

export function logOperationalError(
  input: OperationalLogInput & { error: unknown },
) {
  console.error(
    JSON.stringify({
      ...basePayload(input),
      error: errorDescriptor(input.error),
    }),
  )
}
