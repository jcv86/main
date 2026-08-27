import assert from 'node:assert/strict'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'

const expectedTitles = [
  'Inventario de preguntas difíciles',
  'Fórmula personal de respuesta',
  'Historia de salida laboral',
  'Respuesta sobre una debilidad',
  'Conversación salarial con preparación',
  'Revisión del lenguaje defensivo',
  'Ensayo breve bajo presión',
  'Checkpoint A3 9: Laboratorio de preguntas difíciles',
  'Sprint de mercado',
  'Priorización de oportunidades',
]

const missions = Array.from({ length: 10 }, (_, index) => A2_DAILY_MISSIONS[index + 71])
assert.deepEqual(missions.map((mission) => mission.title), expectedTitles)
assert.ok(missions.every((mission) => mission.phaseLabel === 'Preguntas difíciles y mercado real'))

const content = missions.flatMap((mission) => [
  mission.title, mission.subtitle, mission.userGoal, mission.whyItMatters,
  ...mission.instructions, mission.deliverable,
  ...(mission.dtcValidation.criteria ?? []), mission.completionResult.onPass, mission.completionResult.onFail,
]).join('\n')

for (const obsoletePhrase of [
  'Coach creates', 'Coach reviews', '170 XP', 'cost thousands', 'closes doors immediately',
  'THE question', 'ANY difficult question', 'triple your callback',
]) assert.equal(content.includes(obsoletePhrase), false, obsoletePhrase)

assert.match(A2_DAILY_MISSIONS[75].instructions.join(' '), /sueldo líquido y bruto/)
assert.match(A2_DAILY_MISSIONS[78].deliverable, /Finalización verificada/)
assert.match(A2_DAILY_MISSIONS[80].instructions.join(' '), /sin tratar el puntaje como probabilidad/)

console.log(JSON.stringify({
  evidenceLevel: 'runtime_module', reviewedDays: [71, 80], spanishTitles: expectedTitles.length,
  unsupportedAutomationCopyRemoved: true, deterministicClaimsRemoved: true, xpCopyRemoved: true,
}))
