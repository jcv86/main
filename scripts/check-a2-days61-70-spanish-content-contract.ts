import assert from 'node:assert/strict'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'

const expectedTitles = [
  'Mentalidad de recruiter',
  'Los primeros 60 segundos',
  'Recorrido del CV',
  'Paquete de preguntas del recruiter',
  'Preguntas de la persona candidata',
  'Calentamiento para la simulación',
  'Ritual de inicio en calma',
  'Checkpoint A3 8: Primera simulación con recruiter',
  'Revisión de la simulación',
  'Repara la respuesta más débil',
]

const missions = Array.from({ length: 10 }, (_, index) => A2_DAILY_MISSIONS[index + 61])
assert.deepEqual(missions.map((mission) => mission.title), expectedTitles)
assert.ok(missions.every((mission) => mission.phaseLabel === 'Simulación y certificación'))

const content = missions.flatMap((mission) => [
  mission.title, mission.subtitle, mission.userGoal, mission.whyItMatters,
  ...mission.instructions, mission.deliverable,
  ...(mission.dtcValidation.criteria ?? []), mission.completionResult.onPass,
]).join('\n')

for (const obsoletePhrase of [
  'Coach creates', 'Coach checks', 'Coach gives', 'Coach adjusts',
  'DTC analyzes', 'DTC flags', 'DTC identifies', 'DTC diagnoses', '160 XP',
]) assert.equal(content.includes(obsoletePhrase), false, obsoletePhrase)

assert.match(A2_DAILY_MISSIONS[68].deliverable, /Finalización verificada/)
assert.match(A2_DAILY_MISSIONS[70].instructions.join(' '), /alternativa breve/)

console.log(JSON.stringify({
  evidenceLevel: 'runtime_module', reviewedDays: [61, 70],
  spanishTitles: expectedTitles.length, unsupportedAutomationCopyRemoved: true, xpCopyRemoved: true,
}))
