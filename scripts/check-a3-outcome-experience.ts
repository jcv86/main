import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CAPTURE_INSTRUMENTS, OUTCOME_CAPTURE_VERSION, parseOutcomeCapture, captureObservation } from '../lib/outcomes/response-capture'
import { scoreA3InterviewCapability } from '../lib/outcomes/a3-interview-capability'

const overview = readFileSync('components/a3/a3-route-overview.tsx', 'utf8')
const form = readFileSync('components/outcomes/a3-interview-outcome-form.tsx', 'utf8')

assert.ok(overview.includes('/despega/a3-outcome-baseline'))
assert.ok(overview.includes('/despega/a3-outcome-follow-up'))
assert.ok(overview.includes('Los puntajes de los módulos miden práctica'))
assert.ok(overview.includes('progress?.route.routeCompletedAt'), 'follow-up must remain gated by route completion')

// Shared capture replaces browser scoring. Keep entry/continuation gates and the v1 regression below.
const shared = readFileSync('components/outcomes/outcome-response-capture-form.tsx', 'utf8')
assert.ok(form.includes('OutcomeResponseCaptureForm'))
assert.ok(form.includes('instrumentKey="a3_structured_interview"'))
assert.ok(!form.includes('scoreA'), 'the current wrapper must not grade capability')
assert.ok(shared.includes("role === 'baseline' ? 'Guardar mi punto de partida' : 'Guardar mi seguimiento'"))
assert.ok(shared.includes('No hay una evaluación automática en curso.'))
assert.ok(shared.includes('OutcomeCaptureHistory'))
const currentInstrument = CAPTURE_INSTRUMENTS.a3_structured_interview
assert.deepEqual(currentInstrument.prompts.map(prompt => prompt.key), ["behavioral", "value_fit", "challenge"])
assert.equal(currentInstrument.minimumWords, 8)
const captured = parseOutcomeCapture({
  observationId: '00000000-0000-4000-8000-000000000777', instrumentKey: 'a3_structured_interview',
  instrumentVersion: OUTCOME_CAPTURE_VERSION, outcomeKey: currentInstrument.outcomeKey, measurementRole: 'baseline',
  responsePayload: Object.fromEntries(currentInstrument.prompts.map(({key}) => [key, 'Este ejercicio sintético contiene respuestas completas sin afirmar una mejora profesional real.'])),
})
const record = captureObservation(captured, 'synthetic-owner', '2026-10-14T12:00:00Z')
assert.equal(record.score, null); assert.equal(record.confidence, null)
assert.deepEqual(record.response_payload, captured.responsePayload)
// Historical heuristic unit regression only; not an outcome or a calibrated rubric.
const weak = scoreA3InterviewCapability({
  behavioral: 'Tuve un problema y traté de resolverlo con mi equipo',
  value_fit: 'Creo que mi experiencia puede servir bastante para este rol',
  challenge: 'Tengo algunas cosas que todavía debo seguir mejorando',
})
const strong = scoreA3InterviewCapability({
  behavioral: 'En un proyecto con plazo crítico, mi objetivo era recuperar el atraso. Primero organicé al equipo, después implementé un proceso semanal y logramos entregar la meta a tiempo.',
  value_fit: 'Mi experiencia en gestión de proyectos y clientes aporta valor al rol porque puedo convertir problemas operativos en prioridades claras para el equipo y la empresa.',
  challenge: 'Mi principal brecha es sintetizar bajo presión. Estoy mejorando con práctica semanal, feedback estructurado y un plan para responder preguntas difíciles con mayor claridad.',
})
assert.ok(strong.score > weak.score)
assert.ok(strong.score <= 20)

console.log(JSON.stringify({
  trainingTelemetrySeparated: true,
  baselineAvailable: true,
  followUpGatedByCompletion: true,
  serverEvidenceRequired: true,
  legacyHeuristicRegressionOnly: true,
  currentCaptureUnscored: true,
}))
