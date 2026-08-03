import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { computeA4EvidencePulse } from '../lib/a4/evidence-pulse'
import {
  compareA4DailySnapshots,
  dailySnapshotFromPulse,
  normalizeA4DailySnapshot,
} from '../lib/a4/daily-snapshots'
import type { A4Decision, A4VerifiedSignal } from '../lib/a4/strategic-radar'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const now = new Date('2026-08-03T04:30:00.000Z')
const signals: A4VerifiedSignal[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Automatización aparece en vacantes de operaciones',
    category: 'labor_market',
    classification: 'fact',
    summary:
      'Tres vacantes verificadas incluyen automatización y seguimiento de indicadores como requisitos explícitos.',
    relevance:
      'La evidencia permite contrastar el relato profesional con capacidades visibles en el mercado objetivo.',
    confidence: 4,
    source_type: 'external_url',
    source_name: 'Portal laboral',
    source_url: 'https://example.com/operaciones',
    source_reference: null,
    source_date: '2026-08-02',
    status: 'active',
    created_at: '2026-08-02T12:00:00.000Z',
    updated_at: '2026-08-02T12:00:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Hipótesis sobre una nueva prioridad del rol objetivo',
    category: 'role',
    classification: 'hypothesis',
    summary:
      'Dos conversaciones sugieren una mayor valoración de coordinación transversal, pero falta evidencia adicional.',
    relevance:
      'La hipótesis puede orientar una prueba de relato sin convertirse todavía en una conclusión.',
    confidence: 2,
    source_type: 'direct_observation',
    source_name: 'Conversaciones profesionales',
    source_url: null,
    source_reference: 'Notas de reuniones del 1 y 2 de agosto',
    source_date: '2026-08-01',
    status: 'active',
    created_at: '2026-08-01T12:00:00.000Z',
    updated_at: '2026-08-01T12:00:00.000Z',
  },
]
const decisions: A4Decision[] = [
  {
    id: '33333333-3333-4333-8333-333333333333',
    signal_id: signals[0].id,
    decision: 'Probar una versión del relato que explicite automatización.',
    rationale:
      'La señal está respaldada por vacantes recientes y puede contrastarse en conversaciones reales.',
    expected_evidence:
      'Observar si aparecen preguntas más específicas y si la evidencia profesional resulta suficiente.',
    status: 'testing',
    review_on: '2026-08-03',
    outcome: null,
    reviewed_at: null,
    created_at: '2026-08-02T14:00:00.000Z',
    updated_at: '2026-08-02T14:00:00.000Z',
  },
]

const pulse = computeA4EvidencePulse(signals, decisions, now)
const insert = dailySnapshotFromPulse(pulse)
assert.equal(insert.snapshot_date, '2026-08-03')
assert.equal(insert.timezone, 'America/Santiago')
assert.equal(insert.active_signals, 2)
assert.equal(insert.facts, 1)
assert.equal(insert.hypotheses, 1)
assert.equal(insert.low_confidence_hypotheses, 1)
assert.equal(insert.reviews_today, 1)
assert.equal(insert.open_decisions, 1)
assert.equal(insert.category_counts.labor_market, 1)
assert.equal(insert.category_counts.role, 1)
assert.equal(insert.category_counts.company, 0)

const current = normalizeA4DailySnapshot({
  id: '44444444-4444-4444-8444-444444444444',
  ...insert,
  created_at: '2026-08-03T04:30:00.000Z',
  updated_at: '2026-08-03T04:30:00.000Z',
})
const previous = normalizeA4DailySnapshot({
  ...current,
  id: '55555555-5555-4555-8555-555555555555',
  snapshot_date: '2026-08-02',
  active_signals: 1,
  facts: 1,
  hypotheses: 0,
  recent_signals: 1,
  low_confidence_hypotheses: 0,
  covered_categories: 1,
  category_counts: { labor_market: 1 },
  reviews_today: 0,
  open_decisions: 0,
  updated_at: '2026-08-02T22:00:00.000Z',
})
const comparison = compareA4DailySnapshots(current, previous)
assert.ok(comparison)
assert.equal(comparison?.daysApart, 1)
assert.equal(
  comparison?.metrics.find((metric) => metric.id === 'active_signals')?.delta,
  1,
)
assert.equal(
  comparison?.metrics.find((metric) => metric.id === 'covered_categories')?.delta,
  1,
)
assert.deepEqual(
  comparison?.categoryChanges.map((category) => category.id),
  ['role'],
)
assert.equal(compareA4DailySnapshots(current, current), null)

const migration = source('migrations/09-a4-daily-evidence-snapshots.sql')
const apiRoute = source('app/api/a4/snapshots/route.ts')
const page = source('app/despega/a4/page.tsx')
const component = source('components/a4/daily-snapshot-history.tsx')
const library = source('lib/a4/daily-snapshots.ts')

assert.ok(migration.includes('create table if not exists public.a4_daily_evidence_snapshots'))
assert.ok(migration.includes('unique (user_id, snapshot_date)'))
assert.ok(migration.includes("timezone = 'America/Santiago'"))
assert.ok(migration.includes('active_signals = facts + hypotheses'))
assert.ok(migration.includes("jsonb_typeof(category_counts) = 'object'"))
assert.ok(migration.includes('enable row level security'))
assert.ok(migration.includes('grant select on public.a4_daily_evidence_snapshots to authenticated'))
assert.ok(migration.includes('grant all on public.a4_daily_evidence_snapshots to service_role'))
assert.ok(!migration.includes('grant insert on public.a4_daily_evidence_snapshots to authenticated'))
assert.ok(!migration.includes('for insert\nto authenticated'))

assert.ok(apiRoute.includes('resolveServerUser()'))
assert.ok(apiRoute.includes('checkA4Access('))
assert.ok(apiRoute.includes('computeA4EvidencePulse('))
assert.ok(apiRoute.includes('dailySnapshotFromPulse('))
assert.ok(apiRoute.includes("onConflict: 'user_id,snapshot_date'"))
assert.ok(apiRoute.includes(".eq('user_id', userId)"))
assert.ok(apiRoute.includes(".from('a4_verified_signals')"))
assert.ok(apiRoute.includes(".from('a4_decision_log')"))
assert.ok(!apiRoute.includes('request.json()'))
assert.ok(!apiRoute.includes('OpenAI'))

assert.ok(page.includes(".from('a4_daily_evidence_snapshots')"))
assert.ok(page.includes('<DailySnapshotHistory initialSnapshots={snapshots} />'))
assert.ok(component.includes("fetch('/api/a4/snapshots'"))
assert.ok(component.includes("method: 'POST'"))
assert.ok(component.includes('compareA4DailySnapshots'))
assert.ok(component.includes('Un único corte por día'))
assert.ok(component.includes('La comparación usa el'))
assert.ok(component.includes('último día disponible'))
assert.ok(library.includes('A4_SIGNAL_CATEGORIES'))
assert.ok(library.includes('categoryChanges'))
assert.ok(!component.includes('IA'))
assert.ok(!component.includes('a4_noticias'))

console.log(
  JSON.stringify({
    snapshotDate: insert.snapshot_date,
    serverOwnedMetrics: true,
    uniqueDailyCut: true,
    ownerReadOnlyRls: true,
    factualDelta: true,
    categoryDelta: true,
    santiagoTimezone: true,
    legacyNewsExcluded: true,
  }),
)
