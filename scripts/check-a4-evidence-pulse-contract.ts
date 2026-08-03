import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { computeA4EvidencePulse } from '../lib/a4/evidence-pulse'
import type { A4Decision, A4VerifiedSignal } from '../lib/a4/strategic-radar'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

function signal(
  id: string,
  overrides: Partial<A4VerifiedSignal> = {},
): A4VerifiedSignal {
  return {
    id,
    title: `Señal verificable ${id}`,
    category: 'labor_market',
    classification: 'fact',
    summary:
      'Una fuente verificable muestra un cambio concreto que merece seguimiento estratégico.',
    relevance:
      'La señal afecta la forma de observar el mercado y preparar decisiones futuras.',
    confidence: 4,
    source_type: 'external_url',
    source_name: 'Fuente verificable',
    source_url: 'https://example.com/evidencia',
    source_reference: null,
    source_date: '2026-08-03',
    status: 'active',
    created_at: '2026-08-03T12:00:00.000Z',
    updated_at: '2026-08-03T12:00:00.000Z',
    ...overrides,
  }
}

function decision(
  id: string,
  signalId: string,
  reviewOn: string,
  overrides: Partial<A4Decision> = {},
): A4Decision {
  return {
    id,
    signal_id: signalId,
    decision: `Decisión verificable ${id}`,
    rationale:
      'La decisión se vincula a una señal persistida y conserva la incertidumbre explícita.',
    expected_evidence:
      'Se observará un dato futuro que permita confirmar, modificar o descartar la postura.',
    status: 'watching',
    review_on: reviewOn,
    outcome: null,
    reviewed_at: null,
    created_at: `${reviewOn}T12:00:00.000Z`,
    updated_at: `${reviewOn}T12:00:00.000Z`,
    ...overrides,
  }
}

const signals: A4VerifiedSignal[] = [
  signal('11111111-1111-4111-8111-111111111111'),
  signal('22222222-2222-4222-8222-222222222222', {
    category: 'role',
    classification: 'hypothesis',
    confidence: 2,
    source_date: '2026-07-31',
  }),
  signal('33333333-3333-4333-8333-333333333333', {
    category: 'industry',
    source_date: '2026-06-20',
  }),
  signal('44444444-4444-4444-8444-444444444444', {
    category: 'macro',
    source_date: '2026-08-02',
    status: 'archived',
  }),
]

const decisions: A4Decision[] = [
  decision(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    signals[0].id,
    '2026-08-01',
  ),
  decision(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    signals[1].id,
    '2026-08-03',
    { status: 'testing' },
  ),
  decision(
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    signals[2].id,
    '2026-08-08',
    { status: 'committed' },
  ),
  decision(
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    signals[0].id,
    '2026-08-20',
  ),
  decision(
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    signals[0].id,
    '2026-07-30',
    {
      status: 'reviewed',
      outcome: 'La evidencia observada permitió cerrar la revisión con trazabilidad.',
      reviewed_at: '2026-07-30T16:00:00.000Z',
    },
  ),
]

const pulse = computeA4EvidencePulse(
  signals,
  decisions,
  new Date('2026-08-03T12:00:00-04:00'),
)

assert.equal(pulse.today, '2026-08-03')
assert.equal(pulse.priority, 'overdue_reviews')
assert.equal(pulse.activeSignals.length, 3)
assert.equal(pulse.recentSignals.length, 2)
assert.equal(pulse.staleSignals.length, 1)
assert.equal(pulse.facts, 2)
assert.equal(pulse.hypotheses, 1)
assert.equal(pulse.lowConfidenceHypotheses.length, 1)
assert.equal(pulse.coveredCategories, 3)
assert.equal(pulse.uncoveredCategories.length, 4)
assert.equal(pulse.overdueReviews, 1)
assert.equal(pulse.reviewsToday, 1)
assert.equal(pulse.reviewsNext7Days, 1)
assert.equal(pulse.reviewsLater, 1)
assert.equal(pulse.closedDecisions, 1)
assert.deepEqual(
  pulse.reviewQueue.map((item) => item.timing),
  ['overdue', 'due_today', 'next_7_days', 'later'],
)
assert.equal(
  pulse.reviewQueue[0].decision.id,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
)
assert.equal(
  pulse.reviewQueue[3].decision.id,
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
)

const pulseSource = source('lib/a4/evidence-pulse.ts')
const component = source('components/a4/evidence-pulse.tsx')
const page = source('app/despega/a4/page.tsx')
const workflow = source('.github/workflows/typecheck.yml')

assert.ok(pulseSource.includes("timeZone: 'America/Santiago'"))
assert.ok(pulseSource.includes("signal.status === 'active'"))
assert.ok(pulseSource.includes("decision.status === 'reviewed'"))
assert.ok(pulseSource.includes("decision.status === 'discarded'"))
assert.ok(pulseSource.includes("priority = 'overdue_reviews'"))
assert.ok(pulseSource.includes("priority = 'reviews_today'"))
assert.ok(pulseSource.includes("priority = 'building_evidence'"))
assert.ok(pulseSource.includes("priority = 'refresh_sources'"))
assert.ok(!pulseSource.includes('strategicScore'))
assert.ok(!pulseSource.includes('Math.random'))

assert.ok(component.includes('Pulso de Evidencia'))
assert.ok(component.includes('Agenda de revisión'))
assert.ok(component.includes('Delta verificable'))
assert.ok(component.includes('no genera noticias, tesis ni puntajes estratégicos'))
assert.ok(component.includes('El Radar no inferirá qué'))
assert.ok(component.includes('href="#a4-workspace"'))
assert.ok(page.includes("import { EvidencePulse }"))
assert.ok(page.includes('<EvidencePulse signals={signals} decisions={decisions} />'))
assert.ok(page.includes('id="a4-workspace"'))
assert.ok(workflow.includes('check-a4-evidence-pulse-contract.ts'))

console.log(
  JSON.stringify({
    timezone: pulse.today,
    activeSignals: pulse.activeSignals.length,
    recentSignals: pulse.recentSignals.length,
    staleSignals: pulse.staleSignals.length,
    reviewQueue: pulse.reviewQueue.map((item) => item.timing),
    deterministicPriority: pulse.priority,
    noGeneratedThesis: true,
    noSyntheticScore: true,
  }),
)
