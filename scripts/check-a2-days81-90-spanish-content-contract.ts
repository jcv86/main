import assert from 'node:assert/strict'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'

const expectedTitles = [
  'Sprint de adaptación del CV',
  'Constructor de paquetes de postulación',
  'Envía o simula',
  'Sistema de seguimiento',
  'Revisión del mercado real',
  'Lista de revisión del recorrido',
  'Paquete final de calentamiento',
  'Checkpoint A3 10: Revisión final de entrevista',
  'Revisión después de la acción',
  'Tu reporte de 90 días',
]

const missions = Array.from({ length: 10 }, (_, index) => A2_DAILY_MISSIONS[index + 81])
assert.deepEqual(missions.map((mission) => mission.title), expectedTitles)
assert.deepEqual(missions.map((mission) => mission.phaseLabel), [
  ...Array(5).fill('Postulaciones y seguimiento'),
  ...Array(3).fill('Preparación final A3'),
  ...Array(2).fill('Cierre y próximos pasos'),
])

const allMissions = Object.values(A2_DAILY_MISSIONS)
assert.equal(allMissions.length, 90)
const content = allMissions.flatMap((mission) => [
  mission.title, mission.subtitle, mission.userGoal, mission.whyItMatters,
  ...mission.instructions, mission.deliverable,
  ...(mission.dtcValidation.criteria ?? []), mission.completionResult.onPass, mission.completionResult.onFail,
]).join('\n')

for (const obsoletePhrase of [
  'Coach creates', 'Coach reviews', 'Coach checks', 'Coach gives', 'Coach adjusts',
  'DTC analyzes', 'DTC flags', 'DTC detects', 'DTC identifies', 'DTC diagnoses', 'DTC prepares',
  'Earn XP', 'XP awarded', '220 XP', 'triple your callback rate', 'increase callback rate by 30-40%',
]) assert.equal(content.includes(obsoletePhrase), false, obsoletePhrase)

assert.match(A2_DAILY_MISSIONS[83].deliverable, /Registro verificable/)
assert.match(A2_DAILY_MISSIONS[84].instructions.join(' '), /sin enviar mensajes automáticamente/)
assert.match(A2_DAILY_MISSIONS[88].whyItMatters, /no garantiza resultados laborales/)
assert.match(A2_DAILY_MISSIONS[90].completionResult.onPass, /reporte final con próximos pasos/)

console.log(JSON.stringify({
  evidenceLevel: 'runtime_module', reviewedDays: [81, 90], totalMissions: allMissions.length,
  spanishTitles: expectedTitles.length, unsupportedAutomationCopyRemovedAcrossA2: true,
  deterministicClaimsRemoved: true, xpCopyRemovedAcrossA2: true,
}))
