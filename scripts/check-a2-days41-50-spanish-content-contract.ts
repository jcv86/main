import assert from 'node:assert/strict'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'

const expectedTitles = [
  'El argumento de contratación',
  'Desafío de compresión',
  'Checkpoint A3 5: Arquitectura de respuestas',
  'Caza de respuestas débiles',
  'Ronda de práctica 1',
  'Ronda de práctica 2',
  'Inyección de evidencia',
  'La trampa de las repreguntas',
  'Sesión de revisión',
  'Bóveda de mejores versiones',
]

const missions = Array.from({ length: 10 }, (_, index) => A2_DAILY_MISSIONS[index + 41])
assert.deepEqual(missions.map((mission) => mission.title), expectedTitles)
assert.ok(missions.every((mission) => mission.phaseLabel === 'Alineación con el rol'))

const content = missions.flatMap((mission) => [
  mission.title,
  mission.subtitle,
  mission.userGoal,
  mission.whyItMatters,
  ...mission.instructions,
  mission.deliverable,
  ...(mission.dtcValidation.criteria ?? []),
  mission.completionResult.onPass,
]).join('\n')

for (const obsoletePhrase of [
  'DTC flags',
  'Coach improves',
  'DTC removes noise',
  '120 XP',
  'DTC detects patterns',
  'Coach explains',
  'DTC shows before/after',
  'DTC creates practice readiness score',
  'DTC prepares',
]) {
  assert.equal(content.includes(obsoletePhrase), false, obsoletePhrase)
}

assert.match(A2_DAILY_MISSIONS[43].deliverable, /Finalización verificada/)
assert.match(A2_DAILY_MISSIONS[48].deliverable, /seis repreguntas y tres respuestas/)
assert.match(A2_DAILY_MISSIONS[50].deliverable, /seis respuestas finales/)

console.log(JSON.stringify({
  evidenceLevel: 'runtime_module',
  reviewedDays: [41, 50],
  spanishTitles: expectedTitles.length,
  unsupportedAutomationCopyRemoved: true,
  xpCopyRemoved: true,
}))
