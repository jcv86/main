import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/migrations/20260920135500_outcome_engine_s1_foundation.sql', 'utf8')
const design = readFileSync('docs/dtc/DTC_OUTCOME_ENGINE_S1.md', 'utf8')
const readiness = readFileSync('lib/readiness-score.ts', 'utf8')

for (const key of [
  'professional_clarity',
  'execution_capability',
  'interview_capability',
  'career_decision_quality',
]) {
  assert.ok(sql.includes(key), `missing outcome taxonomy key: ${key}`)
}

for (const required of [
  'measurement_role',
  'instrument_key',
  'instrument_version',
  'evidence_refs',
  'force row level security',
  'dtc_outcome_observations_owner_select',
  'dtc_outcome_snapshots_owner_select',
  'grant select on table public.dtc_outcome_observations to authenticated',
  'grant select on table public.dtc_outcome_snapshots to authenticated',
  'comparable boolean not null default false',
  'normalized_delta is null',
]) {
  assert.ok(sql.toLowerCase().includes(required.toLowerCase()), `missing outcome contract: ${required}`)
}

assert.ok(!sql.toLowerCase().includes('grant insert on table public.dtc_outcome'), 'browser roles must not write outcome evidence directly')
assert.ok(!sql.toLowerCase().includes('grant update on table public.dtc_outcome'), 'browser roles must not rewrite outcome evidence')
assert.ok(!sql.toLowerCase().includes('grant delete on table public.dtc_outcome'), 'browser roles must not delete outcome evidence')
assert.ok(design.includes('A completion percentage, XP total or number of modules is not by itself a user outcome.'))
assert.ok(design.includes('no universal career score'))
assert.ok(readiness.includes("recommendations.push('¡Listo para aplicar activamente!')"), 'legacy completeness heuristic must remain visible to the audit until explicitly retired')

console.log(JSON.stringify({
  outcomeTaxonomyFrozen: true,
  ownerReadOnlyBrowserBoundary: true,
  serverOwnedEvidence: true,
  incomparableDeltaFailsClosed: true,
  legacyReadinessHeuristicFlagged: true,
}))
