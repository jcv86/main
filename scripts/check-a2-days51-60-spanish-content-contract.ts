import assert from 'node:assert/strict'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'

const expectedTitles = [
  'Checkpoint A3 6: Sala de práctica',
  'Línea base de tu voz',
  'El poder de la pausa',
  'Control de velocidad',
  'Cierres profesionales',
  'Grabación de motivación',
  'Evidencia antes y después',
  'Checkpoint A3 7: Gimnasio de comunicación',
  'Tus reglas al hablar',
  'Revisión de práctica',
]

const missions = Array.from({ length: 10 }, (_, index) => A2_DAILY_MISSIONS[index + 51])
assert.deepEqual(missions.map((mission) => mission.title), expectedTitles)
assert.ok(missions.every((mission) => mission.phaseLabel === 'Alineación con el rol'))

const content = missions.flatMap((mission) => [
  mission.title,
  mission.subtitle,
  mission.userGoal,
  mission.whyItMatters,
  ...mission.instructions,
  mission.deliverable,
  mission.completionResult.onPass,
]).join('\n')

for (const obsoletePhrase of ['Earn XP', 'A3 Module 6 completion', 'A3 Module 7 completion', 'Role Alignment phase']) {
  assert.equal(content.includes(obsoletePhrase), false, obsoletePhrase)
}

assert.match(A2_DAILY_MISSIONS[51].deliverable, /Finalización verificada/)
assert.match(A2_DAILY_MISSIONS[57].deliverable, /Comparación antes y después/)
assert.match(A2_DAILY_MISSIONS[60].completionResult.onPass, /Simulación y certificación/)

console.log(JSON.stringify({
  evidenceLevel: 'runtime_module',
  reviewedDays: [51, 60],
  spanishTitles: expectedTitles.length,
  checkpointXpCopyRemoved: true,
  phaseTwoComplete: true,
}))
