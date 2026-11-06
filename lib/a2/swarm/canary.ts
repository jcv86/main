import { createHash } from 'node:crypto'

export type A2SwarmSelection = {
  variant: 'baseline' | 'swarm'
  reason: 'disabled' | 'killed' | 'invalid_configuration' | 'allowlist' | 'percentage' | 'control'
  rolloutId: string | null
  configRevision: string | null
}

const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const INTEGER_PERCENT = /^(?:0|[1-9][0-9]?|100)$/

function safeId(value: string | undefined): string | null {
  return typeof value === 'string' && SAFE_ID.test(value) ? value : null
}

function inactive(reason: A2SwarmSelection['reason']): A2SwarmSelection {
  return { variant: 'baseline', reason, rolloutId: null, configRevision: null }
}

/**
 * Server-side selection only. The route must verify the actor and pilot/module
 * access before calling this resolver. A cohort never grants authorization.
 * No request headers, cookies, query parameters or client flags are inputs here.
 *
 * Configuration is passed explicitly, not read or mutated by this pure resolver.
 * Environment changes on Vercel affect a new deployment; this is not a live
 * remote kill switch or an automatic global rollback mechanism.
 */
export function selectA2Swarm(
  actorId: string,
  env: Record<string, string | undefined>,
): A2SwarmSelection {
  if (!env || typeof env !== 'object' || Array.isArray(env)) return inactive('invalid_configuration')
  const mode = env.DTC_A2_SWARM_MODE
  if (mode === undefined || mode === 'off') return inactive('disabled')
  if (mode !== 'canary') return inactive('invalid_configuration')

  const rolloutId = safeId(env.DTC_A2_SWARM_ROLLOUT_ID)
  const configRevision = safeId(env.DTC_A2_SWARM_REVISION)
  const killSwitch = env.DTC_A2_SWARM_KILL_SWITCH
  // Admission requires an explicit false. Missing configuration stays closed.
  if (killSwitch === undefined || killSwitch === 'true') {
    return { variant: 'baseline', reason: 'killed', rolloutId, configRevision }
  }
  if (killSwitch !== 'false') return inactive('invalid_configuration')

  const percentText = env.DTC_A2_SWARM_PERCENT
  if (typeof actorId !== 'string' || !UUID.test(actorId)
    || !rolloutId || !configRevision
    || typeof percentText !== 'string' || !INTEGER_PERCENT.test(percentText)) {
    return inactive('invalid_configuration')
  }

  const configuredAllowlist = env.DTC_A2_SWARM_ALLOWLIST
  let allowlist: string[] = []
  if (configuredAllowlist !== undefined && configuredAllowlist !== '') {
    if (typeof configuredAllowlist !== 'string') return inactive('invalid_configuration')
    allowlist = configuredAllowlist.split(',').map(id => id.trim().toLowerCase())
    if (allowlist.length > 25 || allowlist.some(id => !UUID.test(id))
      || new Set(allowlist).size !== allowlist.length) {
      return inactive('invalid_configuration')
    }
  }

  const normalizedActor = actorId.toLowerCase()
  if (allowlist.includes(normalizedActor)) {
    return { variant: 'swarm', reason: 'allowlist', rolloutId, configRevision }
  }

  // Cohorts remain stable across revisions and monotonically expand as the
  // percentage increases. A deliberately new rollout ID starts a new cohort.
  const hash = createHash('sha256')
    .update(`dtc-a2-swarm-cohort.v1\0${rolloutId}\0${normalizedActor}`)
    .digest()
  const bucket = Math.floor((hash.readUInt32BE(0) / 0x1_0000_0000) * 10_000)
  const selected = bucket < Number(percentText) * 100
  return {
    variant: selected ? 'swarm' : 'baseline',
    reason: selected ? 'percentage' : 'control',
    rolloutId,
    configRevision,
  }
}
