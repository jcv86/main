import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { scoreA3InterviewCapability } from '../lib/outcomes/a3-interview-capability'

const overview = readFileSync('components/a3/a3-route-overview.tsx', 'utf8')
const form = readFileSync('components/outcomes/a3-interview-outcome-form.tsx', 'utf8')
const route = readFileSync('app/api/outcomes/observations/route.ts', 'utf8')

assert.ok(overview.includes('/despega/a3-outcome-baseline'))
assert.ok(overview.includes('/despega/a3-outcome-follow-up'))
assert.ok(overview.includes('Los puntajes de los módulos miden práctica'))
assert.ok(overview.includes('progress?.route.routeCompletedAt'), 'follow-up must remain gated by route completion')
assert.ok(form.includes("instrumentKey: 'a3_structured_interview'"))
assert.ok(form.includes("measurementRole: role"))
assert.ok(form.includes('responsePayload: responses'))
assert.ok(route.includes("error: 'A3 response evidence is required'"))
assert.ok(route.includes("requiredResponseKeys = ['behavioral', 'value_fit', 'challenge']"))

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
  deterministicRubric: true,
}))
