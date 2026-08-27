import assert from 'node:assert/strict'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'

const expectedTitles = [
  'El contrato contigo',
  'Tu sistema operativo profesional',
  'La prueba profesional de 10 segundos',
  'Fortalezas con evidencia',
  'El mapa de perfiles comparables',
  'Forja de identidad profesional',
  'Checkpoint A3 1: Espejo de carrera',
  'Excavación de recuerdos profesionales',
  'De recuerdos a tareas',
  'Por qué fue importante',
  'Alquimia de valor I',
  'Alquimia de valor II',
  'Etiquetas de impacto',
  'Historia de responsabilidad',
  'La cámara de evidencia',
  'Checkpoint A3 2: Laboratorio de minería de valor',
  'Búsqueda de evidencia para el CV',
  'Esqueleto del CV',
  'Los primeros 10 segundos del reclutador',
  'Cirugía del resumen',
  'Mejora de viñetas I',
  'Mejora de viñetas II',
  'Arquitectura de habilidades',
  'Juicio a las palabras vacías',
  'Prueba de resistencia del CV',
  'Ritual de exportación',
  'Checkpoint A3 3: Estudio de construcción de CV',
  'Ojos de reclutador',
  'Portafolio de fundamentos',
  'Revisión de fundamentos',
]

const missions = Array.from({ length: 30 }, (_, index) => A2_DAILY_MISSIONS[index + 1])
assert.equal(missions.length, 30)
assert.ok(missions.every(Boolean))
assert.deepEqual(missions.map((mission) => mission.title), expectedTitles)
assert.ok(missions.every((mission) => mission.phaseLabel === 'Fundamentos'))

const userFacingContent = missions.flatMap((mission) => [
  mission.title,
  mission.subtitle,
  mission.userGoal,
  mission.whyItMatters,
  ...mission.instructions,
  mission.deliverable,
  ...(mission.dtcValidation.criteria ?? []),
  mission.completionResult.onPass,
  mission.completionResult.onFail,
]).join('\n')

for (const obsoletePhrase of [
  'Save to Notion',
  'Upload document to DTC',
  'Earn XP',
  '15+ documented wins',
  '10 structured achievement stories',
]) {
  assert.equal(userFacingContent.includes(obsoletePhrase), false, obsoletePhrase)
}

assert.match(A2_DAILY_MISSIONS[8].deliverable, /cinco recuerdos completos y tres seleccionados/)
assert.match(A2_DAILY_MISSIONS[9].deliverable, /tres tareas guardadas/)
assert.match(A2_DAILY_MISSIONS[10].deliverable, /valor y el impacto de una tarea real/)
assert.equal(A2_DAILY_MISSIONS[10].subtitle.includes('Primer tercio'), false)
assert.match(A2_DAILY_MISSIONS[30].subtitle, /Primer tercio completado/)

console.log(JSON.stringify({
  evidenceLevel: 'runtime_module',
  reviewedDays: [1, 30],
  spanishTitles: expectedTitles.length,
  phaseLabel: 'Fundamentos',
  obsoleteFlowCopyRemoved: true,
}))
