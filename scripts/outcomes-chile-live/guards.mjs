import { createHash, randomUUID, X509Certificate } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { chmodSync, closeSync, constants, existsSync, fchmodSync, fstatSync, fsyncSync, mkdtempSync, openSync, readFileSync, realpathSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve, sep } from 'node:path'
import { homedir, tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { isAuthApiError, isAuthSessionMissingError } from '@supabase/supabase-js'

export const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const PROJECT_REF = 'dcfrbwxbejtbcouionna'
export const VERCEL_PROJECT_ID = 'prj_SvrOCS2CtFQunqirMeYidZRHZKpm'
const MANAGED_CA_PATH = '/usr/local/share/ca-certificates/nebula-dns.crt'
const MANAGED_CA_FINGERPRINT = 'c71b4d1e9d7775c538c688ab10cea9ce417d7312e89838f9d15ff73256cd7fc3'
export const API_PATH = '/api/outcomes/chile'
export const PAGE_PATH = '/despega/resultados-laborales'
export const HTTP_DIAGNOSTIC_PATHS = [API_PATH, PAGE_PATH, '/api/health/live', '/api/health/ready', '/api/auth/pilot-status', '/api/auth/signout', '/auth/signin']
export const OWNED_TABLES = [
  'dtc_job_search_events', 'dtc_employment_outcomes', 'dtc_salary_outcomes',
  'dtc_outcome_followups', 'dtc_outcome_verifications', 'dtc_outcome_write_requests',
]
export const CASCADE_TABLES = [...OWNED_TABLES, 'despega_journey_state', 'despega_user_profiles', 'pilot_memberships']
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

export class LiveFailure extends Error {
  constructor(code) { super(code); this.code = code }
}
export function check(condition, code) {
  if (!condition) throw new LiveFailure(code)
}
export function failureCode(error) {
  return error instanceof LiveFailure ? error.code : 'UNEXPECTED_RUNNER_FAILURE'
}
export function sdkData(result, code) {
  check(result && !result.error, code)
  return result.data
}

/** Auth v2.87 maps session_not_found to AuthSessionMissingError (400 without code). */
export function sessionRevocationDiagnostic(error) {
  if (!error) return { outcome: 'revoked', category: 'SUCCESS', status: null }
  const status = Number.isInteger(error.status) && error.status >= 100 && error.status <= 599 ? error.status : null
  if (isAuthSessionMissingError(error) || (isAuthApiError(error) && error.code === 'session_not_found')) {
    return { outcome: 'already_absent', category: 'SESSION_ALREADY_ABSENT', status }
  }
  const category = isAuthApiError(error) && error.code === 'not_admin' ? 'ADMIN_PERMISSION_DENIED'
    : isAuthApiError(error) && error.code === 'bad_jwt' ? 'INVALID_SESSION_TOKEN'
      : status === 429 ? 'RATE_LIMITED' : status === null ? 'TRANSPORT_OR_UNEXPECTED_ERROR' : 'AUTH_REQUEST_FAILED'
  return { outcome: 'failed', category, status }
}

/** Caller must verify the exact synthetic owner marker before entering this function. */
export async function revokeThenRemove({ tokens, revoke, remove, onRevocation }) {
  for (const token of tokens) {
    let error
    try {
      const result = await revoke(token)
      error = result && typeof result === 'object' && Object.hasOwn(result, 'error') ? result.error : new LiveFailure('INVALID_REVOCATION_RESPONSE')
    } catch (failure) { error = failure }
    onRevocation(sessionRevocationDiagnostic(error))
  }
  // Failed revocation stays in the report, but cannot strand an already-verified synthetic owner.
  await remove()
}

/** Use the configured HTTP proxy explicitly; Playwright does not inherit Node's env-proxy fetch. */
export function configuredBrowserProxy(environment = process.env) {
  const secure = environment.HTTPS_PROXY || environment.https_proxy
  const plain = environment.HTTP_PROXY || environment.http_proxy
  const configured = secure || plain
  if (!configured) {
    check(environment.NODE_USE_ENV_PROXY !== 'true' && !environment.ALL_PROXY && !environment.all_proxy, 'BROWSER_CONFIGURED_HTTP_PROXY_REQUIRED')
    return undefined
  }
  let proxy
  try { proxy = new URL(configured) } catch { throw new LiveFailure('BROWSER_CONFIGURED_PROXY_INVALID') }
  check(['http:', 'https:'].includes(proxy.protocol) && proxy.hostname && !proxy.username && !proxy.password
    && proxy.pathname === '/' && !proxy.search && !proxy.hash, 'BROWSER_CONFIGURED_PROXY_INVALID')
  return { server: proxy.origin }
}

/** Chromium >=146 supports a child-specific XDG database when no legacy NSS database exists. */
export function createNssTrustDirectory({ certificatePath, fingerprint }) {
  check(!existsSync(join(homedir(), '.pki', 'nssdb')), 'BROWSER_LEGACY_NSS_DATABASE_PRESENT')
  check(typeof fingerprint === 'string' && /^[a-f0-9]{64}$/.test(fingerprint), 'BROWSER_CA_FINGERPRINT_REQUIRED')
  let certificate
  try { certificate = new X509Certificate(readFileSync(certificatePath)) } catch { throw new LiveFailure('BROWSER_PUBLIC_CA_UNREADABLE') }
  check(certificate.ca && certificate.fingerprint256.replaceAll(':', '').toLowerCase() === fingerprint, 'BROWSER_CA_FINGERPRINT_MISMATCH')
  check(Date.parse(certificate.validFrom) <= Date.now() && Date.parse(certificate.validTo) > Date.now(), 'BROWSER_CA_OUTSIDE_VALIDITY')
  const root = mkdtempSync(join(tmpdir(), 'dtc-browser-trust-'))
  chmodSync(root, 0o700)
  writeFileSync(join(root, 'dtc-public-ca-only'), fingerprint, { mode: 0o600, flag: 'wx' })
  let removed = false
  const remove = () => {
    if (removed) return
    check(basename(root).startsWith('dtc-browser-trust-') && readFileSync(join(root, 'dtc-public-ca-only'), 'utf8') === fingerprint, 'BROWSER_TRUST_CLEANUP_MARKER_MISMATCH')
    rmSync(root, { recursive: true, force: false })
    check(!existsSync(root), 'BROWSER_TRUST_CLEANUP_FAILED')
    removed = true
  }
  try {
    const output = execFileSync('python3', [join(repository, 'scripts/outcomes-chile-live/nss-trust.py')], {
      input: JSON.stringify({ root, certificatePath, fingerprint }), encoding: 'utf8', timeout: 15_000, stdio: ['pipe', 'pipe', 'pipe'],
    })
    const result = JSON.parse(output)
    check(result.status === 'CREATED' && result.fingerprint === fingerprint && result.publicCertificatesImported === 1 && result.trust === 'C,,', 'BROWSER_TRUST_IMPORT_NOT_VERIFIED')
    return { environment: { ...process.env, XDG_DATA_HOME: root }, fingerprint, remove, get removed() { return removed } }
  } catch (error) {
    remove()
    if (error instanceof LiveFailure) throw error
    throw new LiveFailure('BROWSER_NSS_TRUST_SETUP_FAILED')
  }
}

/** Import only the existing, pinned managed CA already configured for Node. */
export function managedBrowserTrust() {
  if (!process.env.NODE_EXTRA_CA_CERTS) return undefined
  check(process.env.NODE_EXTRA_CA_CERTS === MANAGED_CA_PATH, 'BROWSER_MANAGED_CA_PATH_NOT_ALLOWLISTED')
  return createNssTrustDirectory({ certificatePath: MANAGED_CA_PATH, fingerprint: MANAGED_CA_FINGERPRINT })
}

/** Inspect errors only to choose a fixed category; never emit their messages, URLs, names or stacks. */
export function browserFailureCategory(error) {
  const message = typeof error?.message === 'string' ? error.message : ''
  if (/Invalid cookie fields|cookie.*(?:too large|must be|expected)/i.test(message)) return 'COOKIE_INVALID'
  if (/ERR_PROXY|ERR_TUNNEL|proxy.*(?:failed|unsupported|refused)/i.test(message)) return 'PROXY'
  if (/ERR_NAME_NOT_RESOLVED|ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(message)) return 'DNS'
  if (/ERR_NETWORK_ACCESS_DENIED|ERR_BLOCKED_BY_CLIENT|blockedbyclient|EACCES|EPERM|Operation not permitted/i.test(message)) return 'NETWORK_BLOCKED'
  if (/ERR_CONNECTION_REFUSED|ECONNREFUSED/i.test(message)) return 'CONNECTION_REFUSED'
  if (/ERR_CERT|certificate|\bTLS\b|\bSSL\b/i.test(message)) return 'TLS'
  if (error?.name === 'TimeoutError' || /timed?\s*out/i.test(message)) return 'TIMEOUT'
  if (/Target page, context or browser has been closed|browser has been closed/i.test(message)) return 'BROWSER_CLOSED'
  if (/Executable doesn't exist|ENOENT/i.test(message)) return 'EXECUTABLE_MISSING'
  return 'UNEXPECTED'
}

/** Record response structure only: arbitrary JSON keys can themselves contain personal data. */
export function httpDiagnostic({ path, method, status, contentType, retryAfter, data, jsonState = 'unread' }) {
  const knownKeys = new Set(['allowed', 'accessKind', 'error', 'message', 'retryAfter', 'resetAt', 'data', 'status', 'funnel', 'timeToJobDays', 'economic', 'verification', 'attribution', 'impact', 'workspace'])
  const bodyKind = jsonState !== 'parsed' ? (jsonState === 'invalid' ? 'invalid-json' : 'unread')
    : data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data === 'object' ? 'object' : 'primitive'
  const keys = bodyKind === 'object' ? Object.keys(data) : []
  const responseKeys = keys.filter((key) => knownKeys.has(key)).sort()
  const mime = typeof contentType === 'string' ? contentType.split(';', 1)[0].trim().toLowerCase() : ''
  const seconds = typeof retryAfter === 'string' && /^\d{1,6}$/.test(retryAfter) ? Number(retryAfter) : null
  return {
    path: HTTP_DIAGNOSTIC_PATHS.includes(path) ? path : 'OTHER_PATH',
    method: ['GET', 'POST', 'HEAD', 'OPTIONS'].includes(method) ? method : 'OTHER_METHOD',
    status: Number.isInteger(status) && status >= 100 && status <= 599 ? status : null,
    contentType: mime === 'application/json' ? 'json' : mime === 'text/html' ? 'html' : mime ? 'other' : 'missing',
    bodyKind, responseKeys, omittedResponseKeyCount: keys.length - responseKeys.length,
    retryAfterPresent: typeof retryAfter === 'string',
    retryAfterSeconds: seconds !== null && seconds <= 604_800 ? seconds : null,
  }
}

function verifyKey(key, kind) {
  check(typeof key === 'string' && key.length >= 24, `MISSING_${kind}_KEY`)
  if (key.startsWith(kind === 'PUBLIC' ? 'sb_publishable_' : 'sb_secret_')) return
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8'))
    check(payload.ref === PROJECT_REF, `${kind}_KEY_WRONG_PROJECT`)
    check(payload.role === (kind === 'PUBLIC' ? 'anon' : 'service_role'), `${kind}_KEY_WRONG_ROLE`)
  } catch (error) {
    if (error instanceof LiveFailure) throw error
    throw new LiveFailure(`INVALID_${kind}_KEY`)
  }
}

/** This is an operator-supplied, recent Vercel attestation, not a remote lookup. */
export function validateConfig(input, now = Date.now()) {
  check(input && typeof input === 'object' && !Array.isArray(input), 'INVALID_CONFIG')
  const { target, supabase } = input
  check(target && supabase, 'MISSING_TARGET_OR_SUPABASE')
  let origin
  let database
  try { origin = new URL(target.origin); database = new URL(supabase.url) } catch { throw new LiveFailure('INVALID_TARGET_URL') }
  check(origin.href === origin.origin + '/' && origin.protocol === 'https:' && !origin.port && !origin.username && !origin.password, 'EXACT_HTTPS_ORIGIN_REQUIRED')
  check(/^v0-fork-of-despega-tu-carrera-clone-[a-z0-9]{8,12}\.vercel\.app$/.test(origin.hostname), 'IMMUTABLE_DTC_PREVIEW_REQUIRED')
  check(target.environment === 'preview' && target.readyState === 'READY', 'READY_PREVIEW_ATTESTATION_REQUIRED')
  check(target.vercelProjectId === VERCEL_PROJECT_ID, 'WRONG_VERCEL_PROJECT')
  check(typeof target.deploymentId === 'string' && /^dpl_[A-Za-z0-9]+$/.test(target.deploymentId), 'INVALID_DEPLOYMENT_ID')
  check(target.supabaseProjectRef === PROJECT_REF, 'WRONG_SUPABASE_PROJECT')
  check(database.href === `https://${PROJECT_REF}.supabase.co/`, 'WRONG_SUPABASE_URL')
  const verifiedAt = Date.parse(target.verifiedAt)
  check(Number.isFinite(verifiedAt) && verifiedAt <= now + 120_000 && now - verifiedAt <= 30 * 60_000, 'STALE_DEPLOYMENT_ATTESTATION')
  const commitSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repository, encoding: 'utf8' }).trim()
  check(target.commitSha === commitSha && /^[a-f0-9]{40}$/.test(commitSha), 'DEPLOYMENT_HEAD_MISMATCH')
  verifyKey(supabase.publicKey, 'PUBLIC')
  verifyKey(supabase.serviceRoleKey, 'SERVICE')
  check(supabase.publicKey !== supabase.serviceRoleKey, 'KEY_ROLES_MUST_DIFFER')
  check(input.vercelProtectionBypass == null || typeof input.vercelProtectionBypass === 'string', 'INVALID_VERCEL_ACCESS')
  const protectionCookies = input.vercelProtectionCookies ?? []
  check(Array.isArray(protectionCookies) && protectionCookies.length <= 1, 'INVALID_VERCEL_PROTECTION_COOKIES')
  for (const cookie of protectionCookies) {
    check(cookie && cookie.name === '_vercel_jwt' && (cookie.host == null || cookie.host === origin.hostname)
      && Object.keys(cookie).every((key) => ['name', 'value', 'host'].includes(key))
      && typeof cookie.value === 'string' && cookie.value.length > 0 && cookie.value.length <= 16_384
      && /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/.test(cookie.value), 'INVALID_VERCEL_PROTECTION_COOKIE_SCOPE')
  }
  check(typeof input.evidenceDirectory === 'string' && input.evidenceDirectory.startsWith('/'), 'ABSOLUTE_EVIDENCE_DIRECTORY_REQUIRED')
  const evidenceDirectory = resolve(input.evidenceDirectory)
  check(evidenceDirectory !== repository && !evidenceDirectory.startsWith(repository + sep), 'EVIDENCE_MUST_BE_OUTSIDE_CHECKOUT')
  // The parent must exist, so a symlink cannot silently redirect the output into the repository.
  let evidenceParent
  try { evidenceParent = realpathSync(dirname(evidenceDirectory)) } catch { throw new LiveFailure('EVIDENCE_PARENT_MUST_EXIST') }
  check(evidenceParent !== repository && !evidenceParent.startsWith(repository + sep), 'EVIDENCE_PARENT_INSIDE_CHECKOUT')
  return {
    ...input, target: {
      origin: origin.origin, environment: target.environment, readyState: target.readyState,
      deploymentId: target.deploymentId, vercelProjectId: target.vercelProjectId,
      supabaseProjectRef: target.supabaseProjectRef, commitSha: target.commitSha,
      verifiedAt: target.verifiedAt,
    },
    supabase: { ...supabase, url: database.origin }, evidenceDirectory,
    vercelProtectionCookies: protectionCookies.map(({ name, value }) => ({ name, value, host: origin.hostname })),
    source: {
      commitSha,
      workingTreeDirty: Boolean(execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: repository, encoding: 'utf8' }).trim()),
      runnerSources: Object.fromEntries(['run.mjs', 'guards.mjs', 'browser.mjs', 'nss-trust.py'].map((name) => [name,
        createHash('sha256').update(readFileSync(resolve(repository, 'scripts/outcomes-chile-live', name))).digest('hex'),
      ])),
    },
  }
}

/** Signals request cancellation; only the awaited work path can enter cleanup. */
export function cooperativeCancellation() {
  let signal = null
  let phase = 'work'
  return {
    request(value) {
      if (phase !== 'work' || signal) return false
      signal = value === 'SIGINT' ? 'SIGINT' : 'SIGTERM'
      return true
    },
    check() {
      if (phase === 'draining') throw new LiveFailure('RUNNER_DRAINING')
      if (phase === 'work' && signal) throw new LiveFailure(`CANCELLED_BY_${signal}`)
    },
    beginDrain() { phase = 'draining' },
    beginCleanup() { phase = 'cleanup' },
    get requested() { return signal },
  }
}

/** Wait for all requests, including the losing member of a concurrent pair. */
export function requestTracker() {
  const pending = new Set()
  return {
    async track(operation) {
      const promise = Promise.resolve().then(operation)
      pending.add(promise)
      try { return await promise } finally { pending.delete(promise) }
    },
    async drain() { while (pending.size) await Promise.allSettled([...pending]) },
    get size() { return pending.size },
  }
}

export async function settledValues(promises) {
  const results = await Promise.allSettled(promises)
  const failed = results.find((result) => result.status === 'rejected')
  if (failed) throw failed.reason
  return results.map((result) => result.value)
}

/** Write, fsync and rename in the same private directory before the corresponding remote create. */
export function atomicPrivateJson(path, document) {
  const temporary = join(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`)
  let descriptor
  try {
    descriptor = openSync(temporary, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW, 0o600)
    fchmodSync(descriptor, 0o600)
    writeFileSync(descriptor, JSON.stringify(document, null, 2) + '\n')
    fsyncSync(descriptor)
    closeSync(descriptor)
    descriptor = undefined
    renameSync(temporary, path)
    const directory = openSync(dirname(path), constants.O_RDONLY)
    try { fsyncSync(directory) } finally { closeSync(directory) }
  } catch {
    if (descriptor !== undefined) closeSync(descriptor)
    try { unlinkSync(temporary) } catch { /* A completed rename has no temporary file. */ }
    throw new LiveFailure('PRIVATE_CHECKPOINT_WRITE_FAILED')
  }
}

/** Structural validation never substitutes for checking the same markers against remote rows. */
export function readRecoveryCheckpoint(path) {
  check(typeof path === 'string' && path.startsWith('/'), 'ABSOLUTE_RECOVERY_CHECKPOINT_REQUIRED')
  let descriptor
  let checkpoint
  try {
    descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    const stat = fstatSync(descriptor)
    check(stat.isFile() && stat.size <= 64 * 1024 && (stat.mode & 0o777) === 0o600 && stat.uid === process.getuid(), 'RECOVERY_FILE_MUST_BE_PRIVATE_OWNED_REGULAR')
    checkpoint = JSON.parse(readFileSync(descriptor, 'utf8'))
  } catch (error) {
    if (error instanceof LiveFailure) throw error
    throw new LiveFailure('RECOVERY_CHECKPOINT_UNREADABLE')
  } finally { if (descriptor !== undefined) closeSync(descriptor) }
  check(checkpoint.formatVersion === 2 && UUID.test(checkpoint.runReference)
    && checkpoint.projectRef === PROJECT_REF && checkpoint.vercelProjectId === VERCEL_PROJECT_ID, 'RECOVERY_CHECKPOINT_IDENTITY_INVALID')
  check(Array.isArray(checkpoint.users) && checkpoint.users.length <= 2
    && Array.isArray(checkpoint.invitations) && checkpoint.invitations.length <= 2, 'RECOVERY_RESOURCE_BOUND_EXCEEDED')
  const userIds = new Set()
  const labels = new Set()
  for (const user of checkpoint.users) {
    check(UUID.test(user.id) && ['A', 'B'].includes(user.label) && !userIds.has(user.id) && !labels.has(user.label), 'RECOVERY_USER_MANIFEST_INVALID')
    userIds.add(user.id); labels.add(user.label)
  }
  const invitationIds = new Set()
  const claimIds = new Set()
  for (const invitation of checkpoint.invitations) {
    check(UUID.test(invitation.id) && UUID.test(invitation.claimId) && /^[a-f0-9]{64}$/.test(invitation.tokenHash)
      && userIds.has(invitation.userId) && !invitationIds.has(invitation.id) && !claimIds.has(invitation.claimId), 'RECOVERY_INVITATION_MANIFEST_INVALID')
    invitationIds.add(invitation.id); claimIds.add(invitation.claimId)
  }
  return checkpoint
}

export function memoryCookies() {
  const values = new Map()
  return {
    getAll: () => [...values].map(([name, value]) => ({ name, value })),
    setAll(cookies) {
      for (const { name, value, options } of cookies) {
        if (options?.maxAge === 0 || !value) values.delete(name)
        else values.set(name, value)
      }
    },
    header: () => [...values].map(([name, value]) => `${name}=${value}`).join('; '),
    receive(response) {
      for (const raw of response.headers.getSetCookie()) {
        const cookie = raw.split(';', 1)[0]
        const split = cookie.indexOf('=')
        if (split < 1) continue
        const name = cookie.slice(0, split)
        if (!name.startsWith(`sb-${PROJECT_REF}-`)) continue
        const value = cookie.slice(split + 1)
        if (!value || /(?:^|;)\s*max-age=0(?:;|$)/i.test(raw)) values.delete(name)
        else values.set(name, value)
      }
    },
    clear: () => values.clear(),
  }
}

export function sameJson(a, b) { return JSON.stringify(a) === JSON.stringify(b) }
export function chileDate(daysAgo = 0, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const part = (type) => parts.find((entry) => entry.type === type).value
  const today = `${part('year')}-${part('month')}-${part('day')}`
  return new Date(Date.parse(today + 'T12:00:00Z') - daysAgo * 86_400_000).toISOString().slice(0, 10)
}
