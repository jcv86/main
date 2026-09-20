import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { scoreA2ExecutionCapability } from '../lib/outcomes/a2-execution-capability'

const dashboard = readFileSync('app/despega/a2/page.tsx', 'utf8')
const route = readFileSync('app/api/outcomes/observations/route.ts', 'utf8')
const form = readFileSync('components/outcomes/a2-execution-outcome-form.tsx', 'utf8')
const instruments = readFileSync('lib/outcomes/instruments.ts', 'utf8')

assert.ok(instruments.includes("instrumentKey: 'a2_execution_checkpoint'"))
assert.ok(instruments.includes("'objective_specificity'"))
assert.ok(instruments.includes("'review_discipline'"))
assert.ok(route.includes("error: 'A2 response evidence is required'"))
assert.ok(route.includes("requiredResponseKeys = ['objective', 'actions', 'evidence', 'obstacle', 'review']"))
assert.ok(form.includes('Completar más misiones') === false, 'form should focus on construct, not progress')
assert.ok(form.includes('Esto no mide cuántas misiones completas.'))
assert.ok(dashboard.includes("progress.completed_days.includes(30)"), 'follow-up must require verified Day 30 completion')
assert.ok(dashboard.includes('Completar más misiones no se presenta como mejora de capacidad.'))
assert.ok(!dashboard.includes("averageScore") || dashboard.includes("Puntaje promedio"), 'legacy mission average may remain operational but not outcome-labeled')

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
  deterministicRubric: true,
}))
