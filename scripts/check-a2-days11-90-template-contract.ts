import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getAllCheckpointDays } from '../lib/a3-checkpoint-map'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const template = source('components/a2-day-page-template.tsx')
const stateRoute = source('app/api/a2/day-state/[day]/route.ts')
const stateClient = source('lib/a2/client-day-state.ts')

assert.deepEqual(getAllCheckpointDays(), [7, 16, 27, 35, 43, 51, 58, 68, 78, 88])
for (const day of getAllCheckpointDays()) {
  const page = source(`app/despega/a2/dia-${day}/page.tsx`)
  assert.ok(page.includes(`<A2DayPageTemplate dayNumber={DIA_NUM}`))
}

assert.ok(template.includes('Boolean(checkpoint && !checkpointCompleted)'))
assert.ok(template.includes('Ya lo completé: verificar'))
assert.ok(template.includes("window.addEventListener('focus', refreshCheckpoint)"))
assert.ok(template.includes("document.addEventListener('visibilitychange', refreshCheckpoint)"))
assert.ok(template.includes('dayState.draftScope'))
assert.ok(template.includes('dtc:a2:${dayState.draftScope}:mission-draft:${dayNumber}'))

assert.ok(stateRoute.includes("createHash('sha256').update(userId)"))
assert.ok(stateRoute.includes('draftScope,'))
assert.ok(stateClient.includes('draftScope: string'))
assert.ok(stateClient.includes("typeof payload.draftScope !== 'string'"))

assert.equal(existsSync(join(process.cwd(), 'lib/a2-day-page-template.tsx')), false)

console.log(JSON.stringify({
  evidenceLevel: 'source_and_runtime_module',
  checkpointDays: getAllCheckpointDays(),
  checkpointClientGate: true,
  checkpointReturnRefresh: true,
  accountScopedDrafts: true,
  unguardedLegacyTemplateRemoved: true,
}))
