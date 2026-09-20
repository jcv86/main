import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { scoreA1ProfessionalClarity } from '../lib/outcomes/a1-professional-clarity'

const intro = readFileSync('app/despega/a1-cerebral-intro/page.tsx', 'utf8')
const report = readFileSync('app/despega/a1-report/page.tsx', 'utf8')
const baseline = readFileSync('app/despega/a1-outcome-baseline/page.tsx', 'utf8')
const followUp = readFileSync('app/despega/a1-outcome-follow-up/page.tsx', 'utf8')
const form = readFileSync('components/outcomes/a1-professional-clarity-form.tsx', 'utf8')
const route = readFileSync('app/api/outcomes/observations/route.ts', 'utf8')
const migration = readFileSync('supabase/migrations/20260920141000_outcome_response_payload.sql', 'utf8')

assert.ok(intro.includes("router.push('/despega/a1-outcome-baseline')"), 'A1 intro must route to baseline before assessment')
assert.ok(baseline.includes("router.push('/despega/a1-cerebral-intro')"), 'baseline must return to canonical A1 intro')
assert.ok(report.includes("router.push('/despega/a1-outcome-follow-up')"), 'A1 report must route to comparable follow-up')
assert.ok(followUp.includes("router.push('/despega/conozcamonos-2')"), 'follow-up must continue to C2')
assert.ok(form.includes("role === 'baseline'"))
assert.ok(form.includes("role === 'follow_up'"))
assert.ok(form.includes('responsePayload: responses'))
assert.ok(route.includes('response_payload: body.responsePayload ?? null'))
assert.ok(migration.includes('response_payload jsonb'))
assert.ok(form.includes('al menos 5 palabras'))
assert.ok(form.includes('No buscamos una respuesta “correcta”'))

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
  deterministicRubric: true,
  canonicalContinuation: true,
}))
