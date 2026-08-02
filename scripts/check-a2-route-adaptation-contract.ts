import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { A2_DAILY_MISSIONS } from '../lib/a2-missions-full'
import {
  ACTIVE_A2_ROUTE_CODES,
  buildA2RouteAdaptation,
} from '../lib/a2/route-adaptation'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

assert.deepEqual(ACTIVE_A2_ROUTE_CODES.sort(), [
  'COLAB_EX',
  'EMPREND',
  'LIDER_EJ',
  'TECH_ESP',
])

const routeNames = new Set<string>()
const routeFocuses = new Set<string>()
let combinations = 0

for (const routeCode of ACTIVE_A2_ROUTE_CODES) {
  const firstAdaptation = buildA2RouteAdaptation(
    { code: routeCode, name: routeCode },
    A2_DAILY_MISSIONS[1],
  )
  routeNames.add(firstAdaptation.routeName)
  routeFocuses.add(firstAdaptation.focus)

  for (let day = 1; day <= 90; day += 1) {
    const mission = A2_DAILY_MISSIONS[day]
    const adaptation = buildA2RouteAdaptation(
      { code: routeCode, name: routeCode },
      mission,
    )
    combinations += 1

    assert.equal(adaptation.routeCode, routeCode)
    assert.ok(adaptation.routeName.length >= 8)
    assert.ok(adaptation.focus.length >= 15)
    assert.ok(adaptation.focusQuestion.length >= 25)
    assert.ok(adaptation.evidencePrompt.length >= 30)
    assert.ok(adaptation.applicationPrompt.length >= 30)
    assert.ok(adaptation.qualitySignals.length >= 4)
    assert.equal(new Set(adaptation.qualitySignals).size, adaptation.qualitySignals.length)

    const combinedText = [
      adaptation.focus,
      adaptation.focusQuestion,
      adaptation.evidencePrompt,
      adaptation.applicationPrompt,
      ...adaptation.qualitySignals,
    ].join(' ')

    for (const forbidden of [
      'debes',
      'deberías',
      'te recomendamos',
      'tienes que',
      'lo correcto es',
    ]) {
      assert.ok(
        !combinedText.toLowerCase().includes(forbidden),
        `${routeCode} day ${day} contains prescriptive language: ${forbidden}`,
      )
    }

    if (mission.missionType === 'field_action') {
      assert.ok(
        adaptation.qualitySignals.some((signal) =>
          signal.toLowerCase().includes('fuera de la plataforma'),
        ),
      )
    }
    if (mission.missionType === 'milestone') {
      assert.ok(
        adaptation.qualitySignals.some((signal) =>
          signal.toLowerCase().includes('síntesis del tramo'),
        ),
      )
    }
    if (mission.missionType === 'a3_checkpoint') {
      assert.ok(
        adaptation.qualitySignals.some((signal) =>
          signal.toLowerCase().includes('entrenamiento'),
        ),
      )
    }
  }
}

assert.equal(combinations, 360)
assert.equal(routeNames.size, 4)
assert.equal(routeFocuses.size, 4)

const fallback = buildA2RouteAdaptation(null, A2_DAILY_MISSIONS[12])
assert.equal(fallback.routeCode, 'RUTA_DTC')
assert.equal(fallback.routeName, 'Tu Ruta DTC')
assert.ok(fallback.qualitySignals.length >= 3)

const dayStateRoute = source('app/api/a2/day-state/[day]/route.ts')
const clientDayState = source('lib/a2/client-day-state.ts')
const dayTemplate = source('components/a2-day-page-template.tsx')
const routeCard = source('components/a2-route-context-card.tsx')
const workspace = source('components/a2-generic-mission-workspace.tsx')

assert.ok(dayStateRoute.includes('resolveA2Route(userId, supabase)'))
assert.ok(dayStateRoute.includes('buildA2RouteAdaptation(route, mission)'))
assert.ok(dayStateRoute.includes('adaptation,'))
assert.ok(dayStateRoute.includes('route: route'))
assert.ok(dayStateRoute.includes('activeHorizon: snapshot.activeHorizon'))

assert.ok(clientDayState.includes('A2RouteAdaptation'))
assert.ok(clientDayState.includes('adaptation: A2RouteAdaptation'))
assert.ok(clientDayState.includes('!payload.adaptation'))

assert.ok(dayTemplate.includes('A2RouteContextCard'))
assert.ok(dayTemplate.includes('adaptation={dayState.adaptation}'))
assert.ok(dayTemplate.includes('{dayState.adaptation.routeName}'))
assert.ok(
  dayTemplate.indexOf('<A2RouteContextCard') < dayTemplate.indexOf('{children ? ('),
  'Route adaptation must be visible before specialized Day 1–10 experiences',
)

for (const label of [
  'Enfoque de tu ruta',
  'Evidencia conectada con tu ruta',
  'Aplicación observable',
  'Señales de calidad para esta misión',
]) {
  assert.ok(routeCard.includes(label), `Route card must show ${label}`)
}
assert.ok(routeCard.includes('adaptation.qualitySignals.map'))

assert.ok(workspace.includes('adaptation?: A2RouteAdaptation'))
assert.ok(workspace.includes('adaptation.evidencePrompt'))
assert.ok(workspace.includes('adaptation.focusQuestion'))
assert.ok(workspace.includes('adaptation.applicationPrompt'))
assert.ok(workspace.includes('adaptation.qualitySignals.map'))
assert.ok(workspace.includes('Evidencia para {adaptation.routeName}'))

console.log(
  JSON.stringify({
    activeRoutes: ACTIVE_A2_ROUTE_CODES,
    missionsPerRoute: 90,
    combinations,
    routeSpecificPrompts: true,
    specializedDaysCovered: true,
    neutralLanguage: true,
  }),
)
