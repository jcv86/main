import 'server-only'
import { isDeepStrictEqual } from 'node:util'
import { z } from 'zod'
import {
  A2_SWARM_BUDGET_MS,
  A2_SWARM_MAX_INPUT_CHARACTERS,
  A2_SWARM_MAX_MODEL_JSON_CHARACTERS,
  A2_SWARM_OUTPUT_LIMITS,
  SWARM_AGENTS,
  SWARM_OUTPUT_SCHEMAS,
  SwarmCompletionError,
  type SwarmAgent,
  type SwarmComplete,
} from './contracts'

const ENDPOINT = 'https://api.openai.com/v1/chat/completions'
const MAX_RESPONSE_BYTES = 64_000

// Keep an internal copy: a caller cannot replace or relax the provider schema.
const providerSchemas = JSON.parse(JSON.stringify(SWARM_OUTPUT_SCHEMAS)) as typeof SWARM_OUTPUT_SCHEMAS
const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(A2_SWARM_MAX_INPUT_CHARACTERS)
    .refine(content => content.trim().length > 0),
}).strict()
const completionRequestSchema = z.object({
  agent: z.enum(SWARM_AGENTS),
  messages: z.array(messageSchema).min(2).max(16),
  outputSchema: z.object({ name: z.string(), schema: z.unknown() }).strict(),
  maxOutputTokens: z.number().int().min(1),
  signal: z.custom<AbortSignal>(value => value instanceof AbortSignal),
}).strict()

export interface OpenAISwarmOptions {
  fetch?: typeof fetch
  /** May shorten the fixed ceiling, never extend it. */
  timeoutMs?: number
}

function invalidOutput(): never {
  throw new SwarmCompletionError('invalid_output')
}

/** Best effort only: a stalled cancel must never hold the fallback open. */
function discardBody(response: Response): void {
  try { void response.body?.cancel().catch(() => {}) } catch { /* no provider details */ }
}

/** Also bounds transports/readers that ignore the supplied AbortSignal. */
function abortable<T>(signal: AbortSignal, work: () => Promise<T>, disposeLate?: (value: T) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false
    const cancel = () => {
      if (settled) return
      settled = true
      signal.removeEventListener('abort', cancel)
      reject(new SwarmCompletionError('provider_failed'))
    }
    if (signal.aborted) { cancel(); return }
    signal.addEventListener('abort', cancel, { once: true })
    Promise.resolve().then(() => {
      if (signal.aborted) throw new SwarmCompletionError('provider_failed')
      return work()
    }).then(value => {
      if (settled || signal.aborted) {
        try { disposeLate?.(value) } catch { /* a late transport cannot change the result */ }
        cancel()
        return
      }
      settled = true
      signal.removeEventListener('abort', cancel)
      resolve(value)
    }, error => {
      if (settled) return
      settled = true
      signal.removeEventListener('abort', cancel)
      reject(error)
    })
  })
}

async function readBoundedJson(
  response: Response,
  signal: AbortSignal,
  checkDeadline: () => void,
): Promise<unknown> {
  if (!response.headers || typeof response.headers.get !== 'function') invalidOutput()
  const contentType = response.headers.get('content-type')
  const contentLength = response.headers.get('content-length')
  if (typeof contentType !== 'string' || !/^application\/json(?:\s*;|$)/i.test(contentType)
    || (contentLength !== null && /^\d+$/.test(contentLength) && Number(contentLength) > MAX_RESPONSE_BYTES)
    || !response.body || typeof response.body.getReader !== 'function') {
    discardBody(response)
    invalidOutput()
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytes = 0, text = '', completed = false
  try {
    for (;;) {
      checkDeadline()
      const part = await abortable(signal, () => reader.read())
      checkDeadline()
      if (part.done) { completed = true; break }
      if (!(part.value instanceof Uint8Array)) invalidOutput()
      bytes += part.value.byteLength
      if (bytes > MAX_RESPONSE_BYTES) invalidOutput()
      try { text += decoder.decode(part.value, { stream: true }) } catch { invalidOutput() }
    }
    try { text += decoder.decode() } catch { invalidOutput() }
    checkDeadline()
    try { return JSON.parse(text) } catch { invalidOutput() }
  } finally {
    if (!completed) {
      try { void reader.cancel().catch(() => {}) } catch { /* no provider details */ }
    }
    try { reader.releaseLock() } catch { /* a pending non-cooperative read may still own the lock */ }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function parseCompletion(envelope: unknown): unknown {
  if (!isRecord(envelope) || (envelope.error !== undefined && envelope.error !== null)
    || !Array.isArray(envelope.choices) || envelope.choices.length !== 1) invalidOutput()
  const choice = envelope.choices[0]
  if (!isRecord(choice) || choice.index !== 0 || choice.finish_reason !== 'stop' || !isRecord(choice.message)) invalidOutput()
  const message = choice.message
  if (message.role !== 'assistant' || (message.refusal !== undefined && message.refusal !== null)
    || (message.function_call !== undefined && message.function_call !== null)
    || (message.tool_calls !== undefined && (!Array.isArray(message.tool_calls) || message.tool_calls.length !== 0))
    || typeof message.content !== 'string' || !message.content.trim()
    || message.content.length > A2_SWARM_MAX_MODEL_JSON_CHARACTERS) invalidOutput()
  let value: unknown
  try { value = JSON.parse(message.content) } catch { invalidOutput() }
  if (!isRecord(value)) invalidOutput()
  // Semantic validation, source availability and canonical navigation belong to
  // the coordinator's agent-specific Zod contracts; JSON alone is not acceptance.
  return value
}

/**
 * One fixed-provider request, no retries or tools. A successful HTTP response is
 * not enough: require complete, non-refused JSON before handing it to runtime.
 * Returned errors contain no provider details, credentials or source content.
 */
export function createOpenAISwarmCompletion(apiKey: string, options: OpenAISwarmOptions = {}): SwarmComplete {
  return async input => {
    let parsed: z.infer<typeof completionRequestSchema>
    let transport: typeof fetch
    let timeoutMs: number
    try {
      const request = completionRequestSchema.safeParse(input)
      if (!request.success) throw new Error()
      parsed = request.data
      if (parsed.maxOutputTokens > A2_SWARM_OUTPUT_LIMITS[parsed.agent as SwarmAgent]
        || parsed.messages[0].role !== 'system'
        || parsed.messages.slice(1).some(message => message.role === 'system')
        || parsed.messages.at(-1)?.role !== 'user'
        || parsed.messages.reduce((length, message) => length + message.content.length, 0) > A2_SWARM_MAX_INPUT_CHARACTERS
        || !isDeepStrictEqual(parsed.outputSchema, providerSchemas[parsed.agent])) throw new Error()
      if (!options || typeof options !== 'object' || Array.isArray(options)) throw new Error()
      transport = options.fetch ?? fetch
      timeoutMs = options.timeoutMs ?? A2_SWARM_BUDGET_MS
      if (typeof transport !== 'function' || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > A2_SWARM_BUDGET_MS) throw new Error()
    } catch { throw new SwarmCompletionError('invalid_input') }
    if (typeof apiKey !== 'string' || !/^[\x21-\x7E]{1,1024}$/.test(apiKey)) {
      throw new SwarmCompletionError('provider_unavailable')
    }
    if (parsed.signal.aborted) throw new SwarmCompletionError('provider_failed')

    const controller = new AbortController()
    const cancel = () => controller.abort()
    const deadline = performance.now() + timeoutMs
    const checkDeadline = () => {
      if (performance.now() >= deadline) controller.abort()
      if (controller.signal.aborted) throw new SwarmCompletionError('provider_failed')
    }
    parsed.signal.addEventListener('abort', cancel, { once: true })
    if (parsed.signal.aborted) controller.abort()
    const timer = setTimeout(cancel, timeoutMs)
    try {
      checkDeadline()
      const response = await abortable(controller.signal, () => transport(ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: parsed.messages,
          temperature: 0.2,
          max_tokens: parsed.maxOutputTokens,
          response_format: { type: 'json_schema', json_schema: { ...providerSchemas[parsed.agent], strict: true } },
          store: false,
          stream: false,
          n: 1,
        }),
        signal: controller.signal,
        cache: 'no-store',
        redirect: 'error',
      }), discardBody)
      checkDeadline()
      if (!response || typeof response.ok !== 'boolean') invalidOutput()
      if (!response.ok) {
        discardBody(response)
        throw new SwarmCompletionError('provider_failed')
      }
      const result = parseCompletion(await readBoundedJson(response, controller.signal, checkDeadline))
      checkDeadline()
      return result
    } catch (error) {
      if (error instanceof SwarmCompletionError) throw error
      throw new SwarmCompletionError('provider_failed')
    } finally {
      clearTimeout(timer)
      parsed.signal.removeEventListener('abort', cancel)
      controller.abort()
    }
  }
}
