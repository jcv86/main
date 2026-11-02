import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CAPTURE_INSTRUMENTS, OUTCOME_CAPTURE_VERSION, parseOutcomeCapture, captureObservation } from '../lib/outcomes/response-capture'
import { scoreA1ProfessionalClarity } from '../lib/outcomes/a1-professional-clarity'

const intro = readFileSync('app/despega/a1-cerebral-intro/page.tsx', 'utf8')
const report = readFileSync('app/despega/a1-report/page.tsx', 'utf8')
const baseline = readFileSync('app/despega/a1-outcome-baseline/page.tsx', 'utf8')
const followUp = readFileSync('app/despega/a1-outcome-follow-up/page.tsx', 'utf8')
const form = readFileSync('components/outcomes/a1-professional-clarity-form.tsx', 'utf8')
const migration = readFileSync('supabase/migrations/20260920141000_outcome_response_payload.sql', 'utf8')

assert.ok(intro.includes("baselineCompleted ? '/despega/a1-cerebral' : '/despega/a1-outcome-baseline'"), 'A1 intro must require baseline before assessment and resume assessment after baseline')
assert.ok(baseline.includes("router.push('/despega/a1-cerebral-intro')"), 'baseline must return to canonical A1 intro')
assert.ok(report.includes("router.push('/despega/a1-outcome-follow-up')"), 'A1 report must route to comparable follow-up')
assert.ok(followUp.includes("router.push('/despega/a2/intro')"), 'follow-up must continue to A2 intro after canonical C2-before-report flow')
assert.ok(migration.includes('response_payload jsonb'))

// Shared capture replaces browser scoring. Keep entry/continuation gates and the v1 regression below.
const shared = readFileSync('components/outcomes/outcome-response-capture-form.tsx', 'utf8')
assert.ok(form.includes('OutcomeResponseCaptureForm'))
assert.ok(form.includes('instrumentKey="a1_professional_clarity"'))
assert.ok(!form.includes('scoreA'), 'the current wrapper must not grade capability')
assert.ok(shared.includes("role === 'baseline' ? 'Guardar mi punto de partida' : 'Guardar mi seguimiento'"))
assert.ok(shared.includes('No hay una evaluación automática en curso.'))
assert.ok(shared.includes('OutcomeCaptureHistory'))
const currentInstrument = CAPTURE_INSTRUMENTS.a1_professional_clarity
assert.deepEqual(currentInstrument.prompts.map(prompt => prompt.key), ["target", "value", "evidence", "gap"])
assert.equal(currentInstrument.minimumWords, 5)
const captured = parseOutcomeCapture({
  observationId: '00000000-0000-4000-8000-000000000777', instrumentKey: 'a1_professional_clarity',
  instrumentVersion: OUTCOME_CAPTURE_VERSION, outcomeKey: currentInstrument.outcomeKey, measurementRole: 'baseline',
  responsePayload: Object.fromEntries(currentInstrument.prompts.map(({key}) => [key, 'Este ejercicio sintético contiene respuestas completas sin afirmar una mejora profesional real.'])),
})
const record = captureObservation(captured, 'synthetic-owner', '2026-10-14T12:00:00Z')
assert.equal(record.score, null); assert.equal(record.confidence, null)
assert.deepEqual(record.response_payload, captured.responsePayload)
// Historical heuristic unit regression only; not an outcome or a calibrated rubric.
const weak = scoreA1ProfessionalClarity({
  target: 'No lo tengo muy claro todavía',
  value: 'No sé bien qué aporto aún',
  evidence: 'No tengo un ejemplo concreto ahora',
  gap: 'Necesito entender mejor mi brecha',
})
const strong = scoreA1ProfessionalClarity({
  target: 'Busco un rol de gestión de riesgo en un equipo financiero donde pueda mejorar decisiones con datos.',
  value: 'Puedo aportar análisis de riesgo, priorización y diseño de procesos para que el equipo decida con mayor velocidad.',
  evidence: 'Lideré un proyecto de mejora que redujo el plazo del proceso y permitió al equipo cumplir una meta exigente.',
  gap: 'Necesito desarrollar comunicación ejecutiva porque debo sintetizar mejor la evidencia para líderes y clientes.',
})
assert.ok(strong.score > weak.score)
assert.ok(strong.score <= 16)

console.log(JSON.stringify({
  baselineBeforeAssessment: true,
  followUpAfterReport: true,
  privateResponseEvidence: true,
  legacyHeuristicRegressionOnly: true,
  currentCaptureUnscored: true,
  canonicalContinuation: true,
}))
