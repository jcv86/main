export type EmployerFetch = (url: string, init: RequestInit) => Promise<Response>

export interface EmployerRequestOptions {
  signal?: AbortSignal
  budgetMs?: number
  timeoutMs?: number
  fetchImpl?: EmployerFetch
  now?: () => number
}

export class EmployerRequestError extends Error {
  constructor(
    public readonly outcome: 'unavailable' | 'parse_failed' | 'rate_limited',
    public readonly code: string,
    public readonly retryAfterUntil?: string,
  ) { super(code); this.name = 'EmployerRequestError' }
}

interface RobotsRule { allow: boolean; pattern: string }
interface RobotsPolicy { rules: RobotsRule[]; delayMs: number }
interface CachedRobots { policy: RobotsPolicy; expiresAt: number; wallExpiresAt: number }
interface TransportState {
  tails: Map<string, Promise<void>>
  lastStarted: Map<string, number>
  delayMs: Map<string, number>
  cooldowns: Map<string, string>
  robots: Map<string, CachedRobots>
  pendingRobots: Map<string, Promise<RobotsPolicy>>
}

export interface EmployerRequestContext {
  fetchImpl: EmployerFetch
  now: () => number
  remaining: () => number
  signal: AbortSignal
  timeoutMs: number
  state: TransportState
  dispose: () => void
}

const USER_AGENT = 'DespegaTuCarrera/1.0 (+https://www.despegatucarrera.com)'
const HOSTS = new Set(['api.lever.co', 'boards-api.greenhouse.io'])
const TRANSPORTS = new WeakMap<EmployerFetch, TransportState>()
const ROBOTS_TTL_MS = 5 * 60_000
const DEFAULT_COOLDOWN_MS = 3 * 60 * 60_000
const MAX_JSON_BYTES = 2 * 1024 * 1024
const MAX_ROBOTS_BYTES = 64 * 1024

function bounded(value: number | undefined, fallback: number, minimum: number, maximum: number): number {
  return Number.isFinite(value) ? Math.max(minimum, Math.min(Math.floor(value!), maximum)) : fallback
}

export function createEmployerRequestContext(options: EmployerRequestOptions): EmployerRequestContext {
  const fetchImpl = options.fetchImpl || fetch
  let state = TRANSPORTS.get(fetchImpl)
  if (!state) {
    state = { tails: new Map(), lastStarted: new Map(), delayMs: new Map(), cooldowns: new Map(), robots: new Map(), pendingRobots: new Map() }
    TRANSPORTS.set(fetchImpl, state)
  }
  const now = options.now || Date.now
  const budget = bounded(options.budgetMs, 18_000, 10, 18_000)
  const deadline = now() + budget
  const wallDeadline = performance.now() + budget
  const controller = new AbortController()
  const abortExternal = () => controller.abort(new EmployerRequestError('unavailable', 'aborted'))
  options.signal?.addEventListener('abort', abortExternal, { once: true })
  if (options.signal?.aborted) abortExternal()
  const timer = setTimeout(() => controller.abort(new EmployerRequestError('unavailable', 'budget_exhausted')), budget)
  return {
    fetchImpl, now, state, signal: controller.signal,
    timeoutMs: bounded(options.timeoutMs, 8_000, 10, 8_000),
    remaining: () => Math.max(0, Math.min(deadline - now(), wallDeadline - performance.now())),
    dispose: () => { clearTimeout(timer); options.signal?.removeEventListener('abort', abortExternal) },
  }
}

function aborted(signal: AbortSignal): EmployerRequestError {
  return signal.reason instanceof EmployerRequestError ? signal.reason : new EmployerRequestError('unavailable', 'aborted')
}

async function untilAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) { void promise.catch(() => {}); throw aborted(signal) }
  let listener: (() => void) | undefined
  const cancelled = new Promise<never>((_, reject) => {
    listener = () => reject(aborted(signal))
    signal.addEventListener('abort', listener, { once: true })
  })
  try { return await Promise.race([promise, cancelled]) }
  finally { if (listener) signal.removeEventListener('abort', listener) }
}

async function pause(ms: number, signal: AbortSignal): Promise<void> {
  if (ms <= 0) return
  let timer: ReturnType<typeof setTimeout> | undefined
  try { await untilAbort(new Promise<void>(resolve => { timer = setTimeout(resolve, ms) }), signal) }
  finally { if (timer) clearTimeout(timer) }
}

function requestHost(url: string): string {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:' || !HOSTS.has(parsed.hostname) || parsed.username || parsed.password || parsed.port || parsed.hash) {
    throw new EmployerRequestError('parse_failed', 'request_url')
  }
  return parsed.hostname
}

function retryAfter(value: string | null, now: number): string | undefined {
  if (!value) return undefined
  const target = /^\d+$/.test(value.trim()) ? now + Number(value.trim()) * 1000 : Date.parse(value)
  if (!Number.isFinite(target) || target <= now || target > 253402300799999) return undefined
  return new Date(target).toISOString()
}

function assertHostAvailable(ctx: EmployerRequestContext, host: string): void {
  const until = ctx.state.cooldowns.get(host)
  if (until && Date.parse(until) > ctx.now()) throw new EmployerRequestError('rate_limited', 'host_cooldown', until)
  if (until) ctx.state.cooldowns.delete(host)
}

function cancel(response: Response): void {
  void response.body?.cancel().catch(() => {})
}

async function readLimited(response: Response, limit: number, signal: AbortSignal): Promise<string> {
  const length = response.headers.get('content-length')
  if (length && Number(length) > limit) { cancel(response); throw new EmployerRequestError('parse_failed', 'payload_too_large') }
  if (!response.body) return ''
  const reader = response.body.getReader()
  const cancelReader = () => { void reader.cancel().catch(() => {}) }
  signal.addEventListener('abort', cancelReader, { once: true })
  const decoder = new TextDecoder('utf-8', { fatal: true })
  const decode = (value?: Uint8Array, stream = false) => {
    try { return decoder.decode(value, { stream }) }
    catch { throw new EmployerRequestError('parse_failed', 'invalid_utf8') }
  }
  let bytes = 0
  let text = ''
  try {
    for (;;) {
      const chunk = await untilAbort(reader.read(), signal)
      if (signal.aborted) throw aborted(signal)
      if (chunk.done) break
      bytes += chunk.value.byteLength
      if (bytes > limit) { cancelReader(); throw new EmployerRequestError('parse_failed', 'payload_too_large') }
      text += decode(chunk.value, true)
    }
    return text + decode()
  } catch (error) {
    cancelReader()
    throw error
  } finally {
    signal.removeEventListener('abort', cancelReader)
    try { reader.releaseLock() } catch { /* A cancelled stream may still have a pending read. */ }
  }
}

/** All calls, including robots and body reads, share one lane per fixed host (at most two). */
async function requestText(ctx: EmployerRequestContext, url: string, robots: boolean): Promise<string> {
  const host = requestHost(url)
  if (ctx.signal.aborted) throw aborted(ctx.signal)
  if (ctx.remaining() <= 0) throw new EmployerRequestError('unavailable', 'budget_exhausted')
  assertHostAvailable(ctx, host)
  const controller = new AbortController()
  const abortExternal = () => controller.abort(aborted(ctx.signal))
  ctx.signal.addEventListener('abort', abortExternal, { once: true })
  const remaining = ctx.remaining()
  const timer = setTimeout(() => controller.abort(new EmployerRequestError('unavailable', remaining <= ctx.timeoutMs ? 'budget_exhausted' : 'timeout')), Math.ceil(Math.min(ctx.timeoutMs, remaining)))
  const previous = ctx.state.tails.get(host) || Promise.resolve()
  let release!: () => void
  const done = new Promise<void>(resolve => { release = resolve })
  const tail = previous.then(() => done)
  ctx.state.tails.set(host, tail)
  try {
    await untilAbort(previous, controller.signal)
    assertHostAvailable(ctx, host)
    const delay = Math.max(host === 'api.lever.co' ? 1000 : 0, ctx.state.delayMs.get(host) || 0)
    const last = ctx.state.lastStarted.get(host)
    if (last !== undefined) {
      const waitMs = Math.max(0, Math.ceil(delay - (performance.now() - last)))
      if (waitMs >= ctx.remaining()) throw new EmployerRequestError('unavailable', 'crawl_delay_budget')
      await pause(waitMs, controller.signal)
    }
    if (ctx.remaining() <= 0) throw new EmployerRequestError('unavailable', 'budget_exhausted')
    ctx.state.lastStarted.set(host, performance.now())
    const pendingResponse = ctx.fetchImpl(url, {
      method: 'GET', credentials: 'omit', cache: 'no-store', redirect: 'error', signal: controller.signal,
      headers: { Accept: robots ? 'text/plain' : 'application/json', 'User-Agent': USER_AGENT },
    })
    void pendingResponse.then(response => { if (controller.signal.aborted) cancel(response) }, () => {})
    const response = await untilAbort(pendingResponse, controller.signal)
    if (response.redirected || (response.url && response.url !== url)) {
      cancel(response); throw new EmployerRequestError('parse_failed', 'redirect_identity')
    }
    const resumeAt = retryAfter(response.headers.get('retry-after'), ctx.now())
    if (response.status === 429 || (response.status === 503 && resumeAt)) {
      cancel(response)
      const until = resumeAt || new Date(ctx.now() + DEFAULT_COOLDOWN_MS).toISOString()
      ctx.state.cooldowns.set(host, until)
      throw new EmployerRequestError('rate_limited', `http_${response.status}`, until)
    }
    if (response.status !== 200) { cancel(response); throw new EmployerRequestError('unavailable', `http_${response.status}`) }
    const contentType = response.headers.get('content-type') || ''
    if (contentType && !(robots ? /^text\/plain\b/i : /^application\/(?:json|[a-z0-9.+-]+\+json)\b/i).test(contentType)) {
      cancel(response); throw new EmployerRequestError('parse_failed', 'content_type')
    }
    return await readLimited(response, robots ? MAX_ROBOTS_BYTES : MAX_JSON_BYTES, controller.signal)
  } catch (error) {
    if (error instanceof EmployerRequestError) throw error
    if (controller.signal.aborted) throw aborted(controller.signal)
    throw new EmployerRequestError('unavailable', 'network_error')
  } finally {
    clearTimeout(timer)
    ctx.signal.removeEventListener('abort', abortExternal)
    release()
    void tail.then(() => { if (ctx.state.tails.get(host) === tail) ctx.state.tails.delete(host) })
  }
}

function robotsPolicy(text: string): RobotsPolicy {
  if (/<(?:!doctype|html|head|body)\b/i.test(text) || text.includes('\u0000')) throw new EmployerRequestError('parse_failed', 'robots_format')
  const groups: Array<{ agents: string[]; rules: RobotsRule[]; delayMs: number }> = []
  let group = { agents: [] as string[], rules: [] as RobotsRule[], delayMs: 0 }
  let directives = false
  const finish = () => { if (group.agents.length) groups.push(group); group = { agents: [], rules: [], delayMs: 0 }; directives = false }
  const lines = text.split(/\r?\n/)
  if (lines.length > 2000) throw new EmployerRequestError('parse_failed', 'robots_too_large')
  for (const raw of lines) {
    const line = raw.replace(/#.*/, '').trim()
    if (!line) continue
    const separator = line.indexOf(':')
    if (separator < 0) throw new EmployerRequestError('parse_failed', 'robots_format')
    const key = line.slice(0, separator).trim().toLowerCase()
    const value = line.slice(separator + 1).trim()
    if (key === 'user-agent') {
      if (directives) finish()
      if (!value) throw new EmployerRequestError('parse_failed', 'robots_format')
      group.agents.push(value.toLowerCase())
    } else if (key === 'allow' || key === 'disallow' || key === 'crawl-delay') {
      if (!group.agents.length) throw new EmployerRequestError('parse_failed', 'robots_format')
      directives = true
      if (key === 'crawl-delay') {
        if (!/^\d+(?:\.\d+)?$/.test(value) || !Number.isFinite(Number(value))) throw new EmployerRequestError('parse_failed', 'robots_delay')
        group.delayMs = Math.max(group.delayMs, Math.ceil(Number(value) * 1000))
      } else if (value) {
        if (!value.startsWith('/') || value.length > 2000) throw new EmployerRequestError('parse_failed', 'robots_format')
        group.rules.push({ allow: key === 'allow', pattern: value })
      }
    }
  }
  finish()
  const product = 'despegatucarrera'
  const score = (agents: string[]) => Math.max(-1, ...agents.map(agent => agent === '*' ? 0 : product.includes(agent) ? agent.length : -1))
  const specificity = Math.max(-1, ...groups.map(entry => score(entry.agents)))
  const applicable = groups.filter(entry => specificity >= 0 && score(entry.agents) === specificity)
  return { rules: applicable.flatMap(entry => entry.rules), delayMs: Math.max(0, ...applicable.map(entry => entry.delayMs)) }
}

function robotsAllows(policy: RobotsPolicy, path: string): boolean {
  // RFC 9309: unreserved percent-encoded octets compare with their decoded form.
  const normalize = (value: string) => value.replace(/%([a-f0-9]{2})/gi, (encoded, hex) => {
    const character = String.fromCharCode(parseInt(hex, 16))
    return /[a-z0-9._~-]/i.test(character) ? character : encoded.toUpperCase()
  })
  const target = normalize(path)
  let matched = -1
  let allowed = true
  for (const rule of policy.rules) {
    const normalized = normalize(rule.pattern)
    const end = normalized.endsWith('$')
    const pattern = end ? normalized.slice(0, -1) : normalized
    const expression = '^' + pattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + (end ? '$' : '')
    if (!new RegExp(expression).test(target)) continue
    const length = pattern.replace(/\*/g, '').length
    if (length > matched || (length === matched && rule.allow)) { matched = length; allowed = rule.allow }
  }
  return allowed
}

async function assertRobots(ctx: EmployerRequestContext, url: string): Promise<void> {
  const host = requestHost(url)
  assertHostAvailable(ctx, host)
  const cached = ctx.state.robots.get(host)
  let policy: RobotsPolicy
  if (cached && cached.expiresAt > ctx.now() && cached.wallExpiresAt > performance.now()) policy = cached.policy
  else {
    let pending = ctx.state.pendingRobots.get(host)
    if (!pending) {
      pending = requestText(ctx, `https://${host}/robots.txt`, true).then(text => {
        const fetched = robotsPolicy(text)
        ctx.state.robots.set(host, { policy: fetched, expiresAt: ctx.now() + ROBOTS_TTL_MS, wallExpiresAt: performance.now() + ROBOTS_TTL_MS })
        ctx.state.delayMs.set(host, fetched.delayMs)
        return fetched
      })
      ctx.state.pendingRobots.set(host, pending)
    }
    try { policy = await untilAbort(pending, ctx.signal) }
    finally { if (ctx.state.pendingRobots.get(host) === pending) ctx.state.pendingRobots.delete(host) }
  }
  const parsed = new URL(url)
  if (!robotsAllows(policy, parsed.pathname + parsed.search)) throw new EmployerRequestError('unavailable', 'robots_disallowed')
}

export async function fetchEmployerJson(ctx: EmployerRequestContext, url: string): Promise<unknown> {
  await assertRobots(ctx, url)
  const text = await requestText(ctx, url, false)
  try { return JSON.parse(text) as unknown }
  catch { throw new EmployerRequestError('parse_failed', 'invalid_json') }
}
