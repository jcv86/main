import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  validateDecisionInput,
  validateDecisionUpdate,
  validateSignalInput,
} from '../lib/a4/strategic-radar'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const now = new Date('2026-08-02T12:00:00-04:00')
const validSignal = {
  title: 'Aumentan las vacantes de operaciones con foco en automatización',
  category: 'labor_market',
  classification: 'fact',
  summary:
    'Tres publicaciones recientes para jefaturas de operaciones incluyen automatización, seguimiento de indicadores y coordinación transversal como requisitos explícitos.',
  relevance:
    'La señal permite revisar si la evidencia profesional y el relato de entrevistas muestran esas capacidades con suficiente precisión.',
  confidence: 4,
  sourceType: 'external_url',
  sourceName: 'Portal laboral verificable',
  sourceUrl: 'https://example.com/vacantes-operaciones',
  sourceReference: '',
  sourceDate: '2026-08-01',
}

const signalResult = validateSignalInput(validSignal, now)
assert.equal(signalResult.valid, true, signalResult.errors.join('; '))
assert.equal(signalResult.value?.classification, 'fact')
assert.equal(signalResult.value?.confidence, 4)

const futureSignal = validateSignalInput(
  { ...validSignal, sourceDate: '2026-08-03' },
  now,
)
assert.equal(futureSignal.valid, false)
assert.ok(futureSignal.errors.some((error) => error.includes('futuro')))

const sourceLessSignal = validateSignalInput(
  { ...validSignal, sourceUrl: '', sourceReference: '' },
  now,
)
assert.equal(sourceLessSignal.valid, false)
assert.ok(sourceLessSignal.errors.some((error) => error.includes('URL')))

const invalidExternalUrl = validateSignalInput(
  { ...validSignal, sourceUrl: 'documento local' },
  now,
)
assert.equal(invalidExternalUrl.valid, false)
assert.ok(invalidExternalUrl.errors.some((error) => error.includes('http')))

const validDecision = validateDecisionInput(
  {
    signalId: '11111111-1111-4111-8111-111111111111',
    decision: 'Probar una versión del relato profesional que explicite automatización.',
    rationale:
      'La señal aparece en varias vacantes y se relaciona con evidencia profesional ya desarrollada durante Entrenamiento.',
    expectedEvidence:
      'Observar si la nueva versión mejora claridad, preguntas de seguimiento y coherencia con el rol objetivo.',
    status: 'testing',
    reviewOn: '2026-08-09',
  },
  now,
)
assert.equal(validDecision.valid, true, validDecision.errors.join('; '))
assert.ok(validDecision.value)

const pastDecision = validateDecisionInput(
  {
    ...validDecision.value,
    reviewOn: '2026-08-01',
  },
  now,
)
assert.equal(pastDecision.valid, false)
assert.ok(pastDecision.errors.some((error) => error.includes('anterior')))

const incompleteReview = validateDecisionUpdate({
  status: 'reviewed',
  outcome: '',
})
assert.equal(incompleteReview.valid, false)
assert.ok(incompleteReview.errors.some((error) => error.includes('resultado')))

const completedReview = validateDecisionUpdate({
  status: 'reviewed',
  outcome:
    'La nueva versión generó preguntas más específicas y permitió sostener el relato con evidencia cuantitativa.',
})
assert.equal(completedReview.valid, true, completedReview.errors.join('; '))

const migration = source('migrations/08-a4-signal-decision-log.sql')
const signalRoute = source('app/api/a4/signals/route.ts')
const decisionRoute = source('app/api/a4/decisions/route.ts')
const page = source('app/despega/a4/page.tsx')
const workspace = source('components/a4/strategic-radar-workspace.tsx')
const access = source('lib/a4/access-control.ts')

assert.ok(migration.includes('create table if not exists public.a4_verified_signals'))
assert.ok(migration.includes('create table if not exists public.a4_decision_log'))
assert.ok(migration.includes("classification in ('fact', 'hypothesis')"))
assert.ok(migration.includes('source_date date not null'))
assert.ok(migration.includes('alter table public.a4_verified_signals enable row level security'))
assert.ok(migration.includes('alter table public.a4_decision_log enable row level security'))
assert.ok(migration.includes('to authenticated'))
assert.ok(migration.includes('with check'))
assert.ok(migration.includes('(user_id, created_at desc)'))
assert.ok(!migration.includes('auth.role()'))

assert.ok(access.includes(".from('a3_route_progression')"))
assert.ok(access.includes(".select('route_completed_at')"))
assert.ok(signalRoute.includes('resolveServerUser()'))
assert.ok(signalRoute.includes('checkA4Access('))
assert.ok(signalRoute.includes('validateSignalInput('))
assert.ok(signalRoute.includes(".eq('user_id', resolved.currentUser!.id)"))
assert.ok(decisionRoute.includes('resolveServerUser()'))
assert.ok(decisionRoute.includes('checkA4Access('))
assert.ok(decisionRoute.includes('validateDecisionInput('))
assert.ok(decisionRoute.includes(".from('a4_verified_signals')"))
assert.ok(decisionRoute.includes(".eq('user_id', resolved.currentUser!.id)"))
assert.ok(decisionRoute.includes('validateDecisionUpdate('))

assert.ok(page.includes("if (!journey.access.a4) redirect('/despega/a3')"))
assert.ok(page.includes(".from('a4_verified_signals')"))
assert.ok(page.includes(".from('a4_decision_log')"))
assert.ok(!page.includes(".from('a4_noticias')"))
assert.ok(!page.includes(".from('a4_signal_history')"))
assert.ok(!page.includes(".from('a4_strategic_score')"))
assert.ok(workspace.includes("fetch('/api/a4/signals'"))
assert.ok(workspace.includes("fetch('/api/a4/decisions'"))
assert.ok(workspace.includes('Hecho verificable'))
assert.ok(workspace.includes('Hipótesis por contrastar'))
assert.ok(workspace.includes('Fecha de la fuente'))
assert.ok(workspace.includes('Evidencia que observarás'))
assert.ok(!workspace.includes('action_recommended'))

console.log(
  JSON.stringify({
    canonicalSignalTable: true,
    canonicalDecisionTable: true,
    sourceAndDateRequired: true,
    factHypothesisSeparation: true,
    serverOwnedWrites: true,
    verifiedA4Access: true,
    explicitReviewLoop: true,
    legacyNewsExcluded: true,
  }),
)
