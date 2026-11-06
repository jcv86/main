/**
 * Actual pure cohort selection, evidence evaluation and read-only CLI.
 * All inputs (including source:live branches) are synthetic fixtures. This
 * suite proves code behavior, never live telemetry, provenance or activation.
 * Run: node --import tsx scripts/test-a2-swarm-canary.mjs
 */
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { selectA2Swarm } from '../lib/a2/swarm/canary.ts'
import {
  A2_SWARM_CANARY_EVIDENCE_VERSION,
  A2_SWARM_CANARY_POLICY_VERSION,
  A2_SWARM_CANARY_POLICY,
  evaluateA2SwarmCanaryEvidence,
} from '../lib/a2/swarm/canary-evidence.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const cases = []
const test = (name, run) => cases.push({ name, run })
const ACTOR = '00000000-0000-4000-8000-000000000701'
const OTHER = '00000000-0000-4000-8000-000000000702'
const NOW = Date.parse('2026-11-06T12:00:00Z')
const PRIVATE = 'PRIVATE_SYNTHETIC_SENTINEL'
const iso = value => new Date(value).toISOString()
const actor = n => `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`
const identity = {
  candidateSha: 'a'.repeat(40), deploymentId: 'dpl_SYNTHETIC12345678',
  rolloutId: 'synthetic-qa-cohort', configRevision: 'r1',
}
function config(patch = {}) {
  return { DTC_A2_SWARM_MODE: 'canary', DTC_A2_SWARM_KILL_SWITCH: 'false',
    DTC_A2_SWARM_ROLLOUT_ID: identity.rolloutId, DTC_A2_SWARM_REVISION: identity.configRevision,
    DTC_A2_SWARM_PERCENT: '0', ...patch }
}
function fixture(now = NOW) {
  return {
    version: A2_SWARM_CANARY_EVIDENCE_VERSION, source: 'live', identity: { ...identity },
    window: { startedAt: iso(now - 60 * 60_000), endedAt: iso(now - 5 * 60_000) },
    baseline: { requests: 100, distinctActors: 10, failures: 0, fallbacks: 0,
      p95LatencyMs: 4_000, modelCalls: 100, maximumCallsPerRequest: 1 },
    swarm: { requests: 100, distinctActors: 10, failures: 0, fallbacks: 0,
      p95LatencyMs: 6_000, modelCalls: 300, maximumCallsPerRequest: 3 },
    critical: { authBoundary: 0, crossUserContext: 0, unconfirmedWrite: 0,
      canonicalAction: 0, dataLoss: 0, callBudget: 0 },
  }
}
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value)) freeze(child)
  }
  return value
}
function evaluate(value = fixture(), expected = identity, now = NOW) {
  return evaluateA2SwarmCanaryEvidence(value, expected, now)
}
function expectDecision(value, decision, reason, expected = identity, now = NOW) {
  const result = evaluate(value, expected, now)
  assert.equal(result.decision, decision)
  if (reason) assert.ok(result.reasons.includes(reason), JSON.stringify(result.reasons))
  assert.equal(result.policyVersion, A2_SWARM_CANARY_POLICY_VERSION)
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SYNTHETIC_SENTINEL|00000000-/)
  return result
}
function invalidMetrics(variant, patch) {
  const value = fixture()
  Object.assign(value[variant], patch)
  expectDecision(value, 'hold', 'invalid_evidence')
}
function emptyMetrics() {
  return { requests: 0, distinctActors: 0, failures: 0, fallbacks: 0,
    p95LatencyMs: 0, modelCalls: 0, maximumCallsPerRequest: 0 }
}

test('Unconfigured and explicitly disabled modes always retain baseline', () => {
  assert.deepEqual(selectA2Swarm(ACTOR, {}), { variant: 'baseline', reason: 'disabled', rolloutId: null, configRevision: null })
  const result = selectA2Swarm(ACTOR, config({ DTC_A2_SWARM_MODE: 'off', DTC_A2_SWARM_PERCENT: '100', DTC_A2_SWARM_ALLOWLIST: ACTOR }))
  assert.equal(result.variant, 'baseline'); assert.equal(result.reason, 'disabled')
})
test('Malformed configuration containers and unsupported modes fail closed', () => {
  for (const value of [null, [], 'canary', true]) assert.equal(selectA2Swarm(ACTOR, value).reason, 'invalid_configuration')
  for (const mode of ['', 'CANARY', 'on', true, null]) assert.equal(selectA2Swarm(ACTOR, config({ DTC_A2_SWARM_MODE: mode })).reason, 'invalid_configuration')
})
test('Missing or true kill switch overrides allowlist and 100 percent', () => {
  for (const value of [undefined, 'true']) {
    const result = selectA2Swarm(ACTOR, config({ DTC_A2_SWARM_KILL_SWITCH: value, DTC_A2_SWARM_PERCENT: '100', DTC_A2_SWARM_ALLOWLIST: ACTOR }))
    assert.equal(result.variant, 'baseline'); assert.equal(result.reason, 'killed')
  }
})
test('Only an explicit lowercase false opens the kill-switch gate', () => {
  for (const value of ['', 'FALSE', '0', ' false ', false, null]) {
    assert.equal(selectA2Swarm(ACTOR, config({ DTC_A2_SWARM_KILL_SWITCH: value })).reason, 'invalid_configuration')
  }
})
test('Malformed actors cannot enter even an all-user cohort', () => {
  for (const id of ['', 'not-an-id', ' ' + ACTOR, null, 42, ACTOR.replace('4000', '0000'), ACTOR.replace('8000', '0000')]) {
    assert.equal(selectA2Swarm(id, config({ DTC_A2_SWARM_PERCENT: '100' })).reason, 'invalid_configuration')
  }
})
test('Rollout and revision identifiers are required and bounded', () => {
  for (const key of ['DTC_A2_SWARM_ROLLOUT_ID', 'DTC_A2_SWARM_REVISION']) {
    for (const value of [undefined, '', 'x'.repeat(65), 'private\n' + PRIVATE, 'cohort/other', '-first', 3]) {
      const result = selectA2Swarm(ACTOR, config({ [key]: value, DTC_A2_SWARM_PERCENT: '100' }))
      assert.deepEqual(result, { variant: 'baseline', reason: 'invalid_configuration', rolloutId: null, configRevision: null })
    }
  }
})
test('Percent requires an integer string from zero through one hundred', () => {
  for (const value of [undefined, '', '01', '1.5', '100.0', '-1', '101', ' 10', '10 ', '1e2', '0x64', 100, NaN]) {
    assert.equal(selectA2Swarm(ACTOR, config({ DTC_A2_SWARM_PERCENT: value })).reason, 'invalid_configuration')
  }
})
test('Zero and one hundred percent honor both endpoints for every sampled actor', () => {
  for (let i = 1; i <= 256; i++) {
    assert.equal(selectA2Swarm(actor(i), config()).reason, 'control')
    assert.equal(selectA2Swarm(actor(i), config({ DTC_A2_SWARM_PERCENT: '100' })).reason, 'percentage')
  }
})
test('Allowlist selects only listed owners at zero percent and normalizes case', () => {
  const named = 'abcdefab-abcd-4abc-8abc-abcdefabcdef'
  const env = config({ DTC_A2_SWARM_ALLOWLIST: ` ${ACTOR}, ${named.toUpperCase()} ` })
  assert.equal(selectA2Swarm(ACTOR, env).reason, 'allowlist')
  assert.equal(selectA2Swarm(named, env).reason, 'allowlist')
  assert.equal(selectA2Swarm(named.toUpperCase(), env).reason, 'allowlist')
  assert.equal(selectA2Swarm(OTHER, env).reason, 'control')
})
test('Malformed, duplicate and excessive allowlists never partially admit an actor', () => {
  const named = 'abcdefab-abcd-4abc-8abc-abcdefabcdef'
  for (const list of [ACTOR + ',', ',' + ACTOR, ' ', ACTOR + ',bad', ACTOR + ',' + ACTOR,
    named + ',' + named.toUpperCase(), '*', [ACTOR], Array.from({ length: 26 }, (_, i) => actor(i + 1)).join(',')]) {
    assert.equal(selectA2Swarm(ACTOR, config({ DTC_A2_SWARM_ALLOWLIST: list, DTC_A2_SWARM_PERCENT: '100' })).reason, 'invalid_configuration')
  }
  const ids = Array.from({ length: 25 }, (_, i) => actor(i + 1))
  assert.equal(selectA2Swarm(ids[24], config({ DTC_A2_SWARM_ALLOWLIST: ids.join(',') })).reason, 'allowlist')
})
test('Cohorts are deterministic across requests, revision changes and UUID case', () => {
  for (let i = 1; i <= 256; i++) {
    const id = actor(i), env = config({ DTC_A2_SWARM_PERCENT: '37' })
    const first = selectA2Swarm(id, env)
    assert.deepEqual(selectA2Swarm(id, env), first)
    assert.equal(selectA2Swarm(id.toUpperCase(), { ...env, DTC_A2_SWARM_REVISION: 'r2' }).variant, first.variant)
  }
})
test('Increasing percentage preserves all previously selected actors', () => {
  let previous = new Set()
  for (const percent of ['0', '1', '5', '10', '25', '50', '100']) {
    const selected = new Set(Array.from({ length: 256 }, (_, i) => actor(i + 1))
      .filter(id => selectA2Swarm(id, config({ DTC_A2_SWARM_PERCENT: percent })).variant === 'swarm'))
    for (const id of previous) assert.ok(selected.has(id))
    previous = selected
  }
  assert.equal(previous.size, 256)
})
test('A deliberate new rollout identifier produces a distinct stable cohort', () => {
  const env = config({ DTC_A2_SWARM_PERCENT: '50' })
  const changed = { ...env, DTC_A2_SWARM_ROLLOUT_ID: 'synthetic-new-cohort' }
  assert.ok(Array.from({ length: 256 }, (_, i) => actor(i + 1))
    .some(id => selectA2Swarm(id, env).variant !== selectA2Swarm(id, changed).variant))
})
test('Selection uses its supplied server config and never mutates it or exposes actor IDs', () => {
  const env = freeze(config({ DTC_A2_SWARM_ALLOWLIST: ACTOR }))
  const before = JSON.stringify(env)
  const result = selectA2Swarm(ACTOR, env)
  assert.equal(JSON.stringify(env), before)
  assert.doesNotMatch(JSON.stringify(result), /00000000-/)
  assert.deepEqual(Object.keys(result).sort(), ['configRevision', 'reason', 'rolloutId', 'variant'])
})

test('Complete healthy fixture yields review eligibility, never approval', () => {
  const result = expectDecision(fixture(), 'eligible_for_review', 'technical_gates_met_human_review_required')
  assert.deepEqual(result.identity, identity)
  assert.deepEqual(Object.keys(result).sort(), ['decision', 'identity', 'policyVersion', 'reasons'])
})
test('Synthetic evidence remains hold even with critical counters', () => {
  const value = fixture(); value.source = 'synthetic'; value.critical.authBoundary = 1
  expectDecision(value, 'hold', 'synthetic_evidence')
})
for (const [field, replacement, reason] of [
  ['candidateSha', 'b'.repeat(40), 'candidate_sha_mismatch'],
  ['deploymentId', 'dpl_OTHER12345678', 'deployment_mismatch'],
  ['rolloutId', 'different-cohort', 'rollout_mismatch'],
  ['configRevision', 'r2', 'revision_mismatch'],
]) test(`Evidence must match the exact ${field}`, () => {
  const value = fixture(); value.identity[field] = replacement; value.critical.dataLoss = 1
  expectDecision(value, 'hold', reason)
})
test('Malformed expected identities fail closed without reflecting their input', () => {
  for (const expected of [null, {}, { ...identity, candidateSha: 'A'.repeat(40) }, { ...identity, prompt: PRIVATE }]) {
    const result = expectDecision(fixture(), 'hold', 'invalid_expected_identity', expected)
    assert.equal(result.identity, null)
  }
})
test('Unknown evidence properties and arbitrary source claims are rejected', () => {
  for (const value of [null, {}, { ...fixture(), source: 'trusted' }, { ...fixture(), prompt: PRIVATE },
    { ...fixture(), version: 'future-version' }]) expectDecision(value, 'hold', 'invalid_evidence')
})
test('Clock and observation boundaries are checked before interpreting incidents', () => {
  for (const clock of [NaN, Infinity, -Infinity]) expectDecision(fixture(), 'hold', 'invalid_clock', identity, clock)
  for (const window of [
    { startedAt: iso(NOW), endedAt: iso(NOW - 60_000) },
    { startedAt: iso(NOW - 60 * 60_000), endedAt: iso(NOW + 60_001) },
  ]) {
    const value = fixture(); value.window = window; value.critical.dataLoss = 1
    expectDecision(value, 'hold', 'invalid_observation_window')
  }
})
test('Short, stale and undersampled windows stay on hold', () => {
  const short = fixture(); short.window.startedAt = iso(NOW - 6 * 60_000)
  expectDecision(short, 'hold', 'insufficient_observation_time')
  const stale = fixture(NOW - A2_SWARM_CANARY_POLICY.maximumEvidenceAgeMs)
  expectDecision(stale, 'hold', 'stale_evidence')
  for (const variant of ['baseline', 'swarm']) {
    const samples = fixture(); samples[variant].requests = 19; samples[variant].distinctActors = 2
    samples[variant].modelCalls = 19 * samples[variant].maximumCallsPerRequest
    expectDecision(samples, 'hold', `insufficient_${variant}_requests`)
    const actors = fixture(); actors[variant].distinctActors = 1
    expectDecision(actors, 'hold', `insufficient_${variant}_actors`)
  }
})
test('Observation duration and freshness accept their exact documented boundaries', () => {
  const value = fixture()
  value.window.endedAt = iso(NOW - A2_SWARM_CANARY_POLICY.maximumEvidenceAgeMs)
  value.window.startedAt = iso(Date.parse(value.window.endedAt) - A2_SWARM_CANARY_POLICY.minimumWindowMs)
  expectDecision(value, 'eligible_for_review')
})
test('UTC offsets describe the same window without changing its result', () => {
  const value = fixture(); value.window = { startedAt: '2026-11-06T08:00:00-03:00', endedAt: '2026-11-06T08:55:00-03:00' }
  assert.deepEqual(evaluate(value), evaluate(fixture()))
})
test('Counters cannot exceed requests or contain fractional and nonfinite data', () => {
  for (const variant of ['baseline', 'swarm']) {
    for (const field of ['distinctActors', 'failures', 'fallbacks']) invalidMetrics(variant, { [field]: 101 })
    for (const field of ['requests', 'distinctActors', 'failures', 'fallbacks', 'modelCalls', 'maximumCallsPerRequest']) {
      invalidMetrics(variant, { [field]: -1 }); invalidMetrics(variant, { [field]: 0.5 })
    }
    invalidMetrics(variant, { p95LatencyMs: Infinity }); invalidMetrics(variant, { p95LatencyMs: NaN })
  }
})
test('Nonempty cohorts require observed actors and latency', () => {
  for (const variant of ['baseline', 'swarm']) {
    invalidMetrics(variant, { distinctActors: 0 }); invalidMetrics(variant, { p95LatencyMs: 0 })
  }
})
test('Empty cohorts are valid insufficient samples, never invented latency or model usage', () => {
  const value = fixture(); value.baseline = emptyMetrics(); value.swarm = emptyMetrics()
  expectDecision(value, 'hold', 'insufficient_baseline_requests')
  for (const field of ['modelCalls', 'maximumCallsPerRequest', 'p95LatencyMs']) {
    const bad = structuredClone(value); bad.swarm[field] = 1
    expectDecision(bad, 'hold', 'invalid_evidence')
  }
})
test('Observed maximum is mandatory and cannot contradict the call total', () => {
  const absent = fixture(); delete absent.swarm.maximumCallsPerRequest
  expectDecision(absent, 'hold', 'invalid_evidence')
  invalidMetrics('swarm', { maximumCallsPerRequest: 301 })
  invalidMetrics('swarm', { maximumCallsPerRequest: 2 })
  invalidMetrics('baseline', { maximumCallsPerRequest: 0 })
})
test('Successful answers with zero provider calls cannot earn eligibility', () => {
  for (const variant of ['baseline', 'swarm']) invalidMetrics(variant, { modelCalls: 0, maximumCallsPerRequest: 0 })
})
test('Baseline has no fallback path and swarm success requires all three agents', () => {
  invalidMetrics('baseline', { fallbacks: 1 })
  invalidMetrics('swarm', { modelCalls: 200, maximumCallsPerRequest: 3 })
})
test('Failed requests may legitimately stop before making any provider call', () => {
  const value = fixture()
  for (const variant of ['baseline', 'swarm']) Object.assign(value[variant], { failures: 100, modelCalls: 0, maximumCallsPerRequest: 0 })
  const result = expectDecision(value, 'rollback', 'swarm_failure_rate')
  assert.ok(!result.reasons.includes('invalid_evidence'))
})
test('Started fallbacks count their attempted baseline calls even when all fail', () => {
  const value = fixture()
  Object.assign(value.swarm, { failures: 100, fallbacks: 100, modelCalls: 100, maximumCallsPerRequest: 1 })
  expectDecision(value, 'rollback', 'swarm_fallback_rate')
  value.swarm.modelCalls = 99
  expectDecision(value, 'hold', 'invalid_evidence')
})
test('Failure, regression, fallback and latency thresholds are inclusive at the boundary', () => {
  const value = fixture(); value.baseline.failures = 3
  Object.assign(value.swarm, { failures: 5, fallbacks: 10, modelCalls: 310, maximumCallsPerRequest: 4 })
  expectDecision(value, 'eligible_for_review')
  value.baseline.p95LatencyMs = 20_000; value.swarm.p95LatencyMs = 20_000
  expectDecision(value, 'eligible_for_review')
})
test('Absolute failure rate independently requests rollback', () => {
  const value = fixture(); value.baseline.failures = 6; value.swarm.failures = 6
  expectDecision(value, 'rollback', 'swarm_failure_rate')
})
test('A small absolute failure rate still rolls back when regression exceeds the limit', () => {
  const value = fixture(); value.swarm.failures = 3
  expectDecision(value, 'rollback', 'failure_rate_regression')
})
test('Fallback rate belongs to the assigned swarm cohort', () => {
  const value = fixture(); value.swarm.fallbacks = 11; value.swarm.modelCalls = 311; value.swarm.maximumCallsPerRequest = 4
  const result = expectDecision(value, 'rollback', 'swarm_fallback_rate')
  assert.ok(!result.reasons.includes('swarm_call_budget'))
})
test('Both absolute and comparative p95 latency limits enforce rollback', () => {
  const absolute = fixture(); absolute.baseline.p95LatencyMs = 20_000; absolute.swarm.p95LatencyMs = 20_001
  expectDecision(absolute, 'rollback', 'swarm_latency_limit')
  const relative = fixture(); relative.swarm.p95LatencyMs = 6_001
  expectDecision(relative, 'rollback', 'latency_regression')
})
for (const key of Object.keys(fixture().critical)) test(`One ${key} incident requires rollback without a minimum sample`, () => {
  const value = fixture(); value.critical[key] = 1
  for (const variant of ['baseline', 'swarm']) {
    value[variant].requests = 1; value[variant].distinctActors = 1
    value[variant].modelCalls = value[variant].maximumCallsPerRequest
  }
  expectDecision(value, 'rollback', `critical_${key}`)
})
test('A valid but old critical incident remains a conservative rollback recommendation', () => {
  const value = fixture(NOW - 2 * A2_SWARM_CANARY_POLICY.maximumEvidenceAgeMs); value.critical.crossUserContext = 1
  expectDecision(value, 'rollback', 'critical_crossUserContext')
})
test('Per-request baseline excess cannot hide behind an acceptable average', () => {
  const value = fixture(); value.baseline.failures = 1; value.baseline.maximumCallsPerRequest = 2
  expectDecision(value, 'rollback', 'baseline_call_budget')
})
test('Swarm maximum catches a fifth call even when aggregate usage stays low', () => {
  const value = fixture(); value.swarm.failures = 1; value.swarm.fallbacks = 1; value.swarm.maximumCallsPerRequest = 5
  expectDecision(value, 'rollback', 'swarm_call_budget')
})
test('A fourth call without any fallback cannot pass the aggregate gate', () => {
  const value = fixture(); value.swarm.maximumCallsPerRequest = 4
  expectDecision(value, 'rollback', 'swarm_call_budget')
})
test('Each additional aggregate call needs an actual started fallback', () => {
  const value = fixture(); Object.assign(value.swarm, { fallbacks: 1, modelCalls: 302, maximumCallsPerRequest: 4 })
  expectDecision(value, 'rollback', 'swarm_call_budget')
  value.swarm.modelCalls = 301
  expectDecision(value, 'eligible_for_review')
})
test('Evidence and expected identity remain unchanged and raw metrics are not reflected', () => {
  const value = freeze(fixture()), expected = freeze({ ...identity })
  const before = JSON.stringify(value)
  expectDecision(value, 'eligible_for_review', undefined, expected)
  assert.equal(JSON.stringify(value), before)
})

const temporary = mkdtempSync(join(tmpdir(), 'dtc-swarm-canary-'))
const expectedPath = join(temporary, 'expected.json')
const evidencePath = join(temporary, 'evidence.json')
let cliRuns = 0
function cli(args, content = fixture(Date.now())) {
  writeFileSync(expectedPath, JSON.stringify(identity))
  if (content !== null) writeFileSync(evidencePath, typeof content === 'string' ? content : JSON.stringify(content))
  cliRuns++
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/check-a2-swarm-canary.mjs', ...args], {
    cwd: root, env: { PATH: process.env.PATH }, encoding: 'utf8', timeout: 10_000, maxBuffer: 64_000,
  })
  assert.equal(result.signal, null)
  assert.equal(result.stderr, '')
  assert.doesNotMatch(result.stdout, /PRIVATE_SYNTHETIC_SENTINEL/)
  return result
}
const normalArgs = () => ['--evidence', evidencePath, '--expected', expectedPath]
test('CLI returns read-only eligibility with exit zero and preserves input files', () => {
  const value = fixture(Date.now()), result = cli(normalArgs(), value)
  assert.equal(result.status, 0); assert.equal(JSON.parse(result.stdout).decision, 'eligible_for_review')
  assert.deepEqual(JSON.parse(readFileSync(evidencePath, 'utf8')), value)
  assert.deepEqual(JSON.parse(readFileSync(expectedPath, 'utf8')), identity)
})
test('CLI uses exit one for rollback and exit two for synthetic hold', () => {
  const incident = fixture(Date.now()); incident.critical.dataLoss = 1
  const rollback = cli(normalArgs(), incident)
  assert.equal(rollback.status, 1); assert.equal(JSON.parse(rollback.stdout).decision, 'rollback')
  const synthetic = fixture(Date.now()); synthetic.source = 'synthetic'
  const held = cli(normalArgs(), synthetic)
  assert.equal(held.status, 2); assert.equal(JSON.parse(held.stdout).decision, 'hold')
})
test('CLI help describes recommendations rather than applying changes', () => {
  const result = cli(['--help'])
  assert.equal(result.status, 0); assert.match(result.stdout, /Read-only recommendation/)
  assert.match(result.stdout, /No activation or publication/)
})
test('CLI rejects missing, duplicate and unexpected arguments without echoing them', () => {
  for (const args of [[], ['--evidence', PRIVATE], [...normalArgs(), '--activate', PRIVATE], ['--evidence', evidencePath, '--evidence', expectedPath]]) {
    const result = cli(args); assert.equal(result.status, 2)
    assert.deepEqual(JSON.parse(result.stdout).reasons, ['invalid_input_files_or_arguments'])
  }
})
test('CLI safely rejects invalid JSON, oversized files, missing files and non-files', () => {
  const invalid = cli(normalArgs(), '{"prompt":"' + PRIVATE + '"')
  assert.equal(invalid.status, 2)
  const oversized = cli(normalArgs(), ' '.repeat(64_001) + PRIVATE)
  assert.equal(oversized.status, 2)
  const missing = cli(['--evidence', join(temporary, PRIVATE), '--expected', expectedPath])
  assert.equal(missing.status, 2)
  const folder = join(temporary, 'folder'); mkdirSync(folder)
  const nonFile = cli(['--evidence', folder, '--expected', expectedPath])
  assert.equal(nonFile.status, 2)
})

const results = []
try {
  for (const { name, run } of cases) {
    try { run(); results.push({ name, status: 'passed' }) }
    catch (error) { results.push({ name, status: 'failed', error: error.message }); console.error(name + ': ' + error.message); process.exitCode = 1 }
  }
} finally { rmSync(temporary, { recursive: true, force: true }) }

const sourcePaths = ['lib/a2/swarm/canary.ts', 'lib/a2/swarm/canary-evidence.ts', 'lib/a2/swarm/contracts.ts',
  'scripts/check-a2-swarm-canary.mjs', 'scripts/test-a2-swarm-canary.mjs']
const evidence = {
  suite: 'a2-swarm-canary', cases: cases.length, passed: results.filter(item => item.status === 'passed').length,
  actualSelector: true, actualEvidenceEvaluator: true, actualCli: true, cliRuns,
  inputs: 'All synthetic fixtures; source:live exercises only validation code paths.',
  liveTelemetryCertified: false, liveProvenanceCertified: false, productionRollout: false, networkRequests: 0,
  sourceHashes: sourcePaths.map(path => ({ path, sha256: createHash('sha256').update(readFileSync(join(root, path))).digest('hex') })),
  results,
}
if (process.env.DTC_AGENTIC_QA_OUTPUT) {
  mkdirSync(process.env.DTC_AGENTIC_QA_OUTPUT, { recursive: true })
  writeFileSync(join(process.env.DTC_AGENTIC_QA_OUTPUT, 'a2-swarm-canary.json'), JSON.stringify(evidence, null, 2) + '\n')
}
console.log(JSON.stringify({ suite: evidence.suite, cases: evidence.cases, passed: evidence.passed, cliRuns,
  liveTelemetryCertified: false, liveProvenanceCertified: false, productionRollout: false, networkRequests: 0 }))
