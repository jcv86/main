import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const workspace = readFileSync('components/a4/strategic-radar-workspace.tsx', 'utf8')
const page = readFileSync('app/despega/a4/page.tsx', 'utf8')

for (const phrase of [
  '1 · Contrasta tu hipótesis',
  '2 · ¿Qué ocurrió con esa evidencia?',
  '3 · ¿Qué ocurrió externamente?',
  'La evidencia respaldó la decisión',
  'La evidencia no respaldó la decisión',
  'La evidencia fue inconclusa',
  'Postulación enviada',
  'Respuesta de recruiter',
  'Llegué a entrevista',
  'Recibí una oferta',
  'Acepté una oferta',
  'No implica que DTC los haya causado.',
]) assert.ok(workspace.includes(phrase), `missing A4 review UX contract: ${phrase}`)

assert.ok(workspace.includes('reviewClassification: decision.review_classification'))
assert.ok(workspace.includes('externalOutcomes: decision.external_outcomes'))
assert.ok(page.includes('review_classification,external_outcomes'))
assert.ok(workspace.includes("edit.status === 'reviewed'"))

console.log(JSON.stringify({
  expectedVsObservedVisible: true,
  evidenceClassificationExplicit: true,
  externalOutcomesExplicit: true,
  causalLanguageGuarded: true,
  persistedReviewHydrated: true,
}))
