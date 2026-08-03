import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const progressRoute = source('app/api/a3/save-module-progress/route.ts')
const rewardRoute = source('app/api/a3/training-completion/route.ts')
const legacyCompletion = source('app/api/a3/complete-module/route.ts')
const lessonPage = source(
  'app/despega/a3/entrenamiento-guiado/[moduleId]/[lessonId]/page.tsx',
)
const resultCard = source('components/training-results-card.tsx')

for (const route of [progressRoute, rewardRoute, legacyCompletion]) {
  assert.ok(route.includes('status: 410'))
  assert.ok(route.includes("canonicalEndpoint: '/api/a3/module-completion'"))
  assert.ok(!route.includes('request.json()'))
  assert.ok(!route.includes('createAdminClient'))
  assert.ok(!route.includes(".insert("))
  assert.ok(!route.includes(".update("))
}

assert.ok(progressRoute.includes("code: 'A3_UNVERIFIED_PROGRESS_RETIRED'"))
assert.ok(rewardRoute.includes("code: 'A3_UNVERIFIED_REWARDS_RETIRED'"))
assert.ok(legacyCompletion.includes("code: 'LEGACY_A3_COMPLETION_RETIRED'"))

assert.ok(lessonPage.includes("import { redirect } from 'next/navigation'"))
assert.ok(lessonPage.includes('LEGACY_MODULE_DESTINATIONS'))
assert.ok(lessonPage.includes("redirect(LEGACY_MODULE_DESTINATIONS[moduleId] || '/despega/a3')"))
assert.ok(!lessonPage.includes("'use client'"))
assert.ok(!lessonPage.includes('/api/a3/training-completion'))
assert.ok(!lessonPage.includes('PUNTUACIÓN'))
assert.ok(!lessonPage.includes('95'))

assert.ok(!resultCard.includes('/api/a3/training-completion'))
assert.ok(!resultCard.includes('/api/gamification/claim-reward'))
assert.ok(!resultCard.includes('fetch('))
assert.ok(!resultCard.includes('DTC Ganados'))
assert.ok(resultCard.includes('XP confirmado por el flujo canónico'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    retiredMutationEndpoints: 3,
    legacyLessonRoutesRedirected: true,
    browserAwardRequestsRemoved: true,
    fakeRewardFallbackRemoved: true,
    canonicalCompletionEndpoint: '/api/a3/module-completion',
    liveHttpCheckedInThisScript: false,
  }),
)
