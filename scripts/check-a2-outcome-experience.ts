import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CAPTURE_INSTRUMENTS, OUTCOME_CAPTURE_VERSION, parseOutcomeCapture, captureObservation } from '../lib/outcomes/response-capture'
import { scoreA2ExecutionCapability } from '../lib/outcomes/a2-execution-capability'

const dashboard = readFileSync('app/despega/a2/page.tsx', 'utf8')
const form = readFileSync('components/outcomes/a2-execution-outcome-form.tsx', 'utf8')
const instruments = readFileSync('lib/outcomes/instruments.ts', 'utf8')

assert.ok(instruments.includes("instrumentKey: 'a2_execution_checkpoint'"))
assert.ok(instruments.includes("'objective_specificity'"))
assert.ok(instruments.includes("'review_discipline'"))
assert.ok(dashboard.includes("progress.completed_days.includes(30)"), 'follow-up must require verified Day 30 completion')
assert.ok(dashboard.includes('Completar más misiones no se presenta como mejora de capacidad.'))
assert.ok(!dashboard.includes("averageScore") || dashboard.includes("Puntaje promedio"), 'legacy mission average may remain operational but not outcome-labeled')

// Shared capture replaces browser scoring. Keep entry/continuation gates and the v1 regression below.
const shared = readFileSync('components/outcomes/outcome-response-capture-form.tsx', 'utf8')
assert.ok(form.includes('OutcomeResponseCaptureForm'))
assert.ok(form.includes('instrumentKey="a2_execution_checkpoint"'))
assert.ok(!form.includes('scoreA'), 'the current wrapper must not grade capability')
assert.ok(shared.includes("role === 'baseline' ? 'Guardar mi punto de partida' : 'Guardar mi seguimiento'"))
assert.ok(shared.includes('No hay una evaluación automática en curso.'))
assert.ok(shared.includes('OutcomeCaptureHistory'))
const currentInstrument = CAPTURE_INSTRUMENTS.a2_execution_checkpoint
assert.deepEqual(currentInstrument.prompts.map(prompt => prompt.key), ["objective", "actions", "evidence", "obstacle", "review"])
assert.equal(currentInstrument.minimumWords, 6)
const captured = parseOutcomeCapture({
  observationId: '00000000-0000-4000-8000-000000000777', instrumentKey: 'a2_execution_checkpoint',
  instrumentVersion: OUTCOME_CAPTURE_VERSION, outcomeKey: currentInstrument.outcomeKey, measurementRole: 'baseline',
  responsePayload: Object.fromEntries(currentInstrument.prompts.map(({key}) => [key, 'Este ejercicio sintético contiene respuestas completas sin afirmar una mejora profesional real.'])),
})
const record = captureObservation(captured, 'synthetic-owner', '2026-10-14T12:00:00Z')
assert.equal(record.score, null); assert.equal(record.confidence, null)
assert.deepEqual(record.response_payload, captured.responsePayload)
// Historical heuristic unit regression only; not an outcome or a calibrated rubric.
const weak = scoreA2ExecutionCapability({
  objective: 'Quiero avanzar algo durante esta semana',
  actions: 'Voy a hacer algunas cosas para avanzar',
  evidence: 'Veré si siento que avancé bastante',
  obstacle: 'Puede que tenga algún problema esta semana',
  review: 'Después revisaré cómo me fue esta semana',
})
const strong = scoreA2ExecutionCapability({
  objective: 'Quiero conseguir tres conversaciones con reclutadores del rol objetivo durante los próximos siete días.',
  actions: 'Primero investigaré diez empresas, luego contactaré cinco personas cada día y agendaré las respuestas recibidas.',
  evidence: 'La evidencia será tener tres reuniones confirmadas, mensajes respondidos y un registro actualizado con cada resultado.',
  obstacle: 'Si la tasa de respuesta es baja, usaré una alternativa: ajustaré el mensaje y contactaré una segunda lista de empresas.',
  review: 'Si logro tres conversaciones continuaré; si consigo una o dos adaptaré el mensaje; si no consigo ninguna detendré el enfoque y revisaré el canal.',
})
assert.ok(strong.score > weak.score)
assert.ok(strong.score <= 20)

console.log(JSON.stringify({
  repeatedInstrument: true,
  day30VerifiedGate: true,
  missionAverageNotOutcome: true,
  serverEvidenceRequired: true,
  legacyHeuristicRegressionOnly: true,
  currentCaptureUnscored: true,
}))
