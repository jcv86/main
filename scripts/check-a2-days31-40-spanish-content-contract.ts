import assert from 'node:assert/strict'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'

const expectedTitles = [
  'Radar de mercado',
  'Elige el terreno de práctica',
  'Detective de requisitos',
  'Mapa de encaje y brechas',
  'Checkpoint A3 4: Decodificador de ofertas',
  'Pronóstico de preguntas',
  'Escena de apertura',
  'Motor de motivación',
  'Fortaleza con historia',
  'Historia de origen STAR',
]

const missions = Array.from({ length: 10 }, (_, index) => A2_DAILY_MISSIONS[index + 31])
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
]).join('\n')

for (const obsoletePhrase of [
  'Upload links',
  'DTC analyzes',
  'DTC shows opportunity matrix',
  'DTC generates structured',
  'Coach generates Fit vs Gap Summary',
  'Coach creates versions',
  'Coach-enhanced version',
  'Earn XP',
]) {
  assert.equal(content.includes(obsoletePhrase), false, obsoletePhrase)
}

assert.match(A2_DAILY_MISSIONS[33].instructions.join(' '), /qué proviene del aviso y qué es una inferencia/)
assert.match(A2_DAILY_MISSIONS[35].deliverable, /Finalización verificada/)
assert.match(A2_DAILY_MISSIONS[40].deliverable, /completa y de 60 segundos/)

console.log(JSON.stringify({
  evidenceLevel: 'runtime_module',
  reviewedDays: [31, 40],
  spanishTitles: expectedTitles.length,
  unsupportedAutomationCopyRemoved: true,
  checkpointXpCopyRemoved: true,
}))
