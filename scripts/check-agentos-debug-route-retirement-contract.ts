import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const contextRoute = source('app/api/dtc-agentos/context/route.ts')
const unlockRoute = source('app/api/dtc-agentos/unlock-status/route.ts')
const contextBuilder = source('lib/dtc-agentos/context/context-builder.ts')
const rulesEngine = source('lib/dtc-agentos/unlock/rules-engine.ts')

assert.ok(contextRoute.includes("code: 'AGENTOS_CONTEXT_INSPECTION_RETIRED'"))
assert.ok(contextRoute.includes('status: 410'))
assert.ok(contextRoute.includes('export async function GET()'))
assert.ok(!contextRoute.includes('buildDtcContext'))
assert.ok(!contextRoute.includes('context.memory'))
assert.ok(!contextRoute.includes('searchParams'))
assert.ok(!contextRoute.includes('details: String(error)'))

assert.ok(unlockRoute.includes("code: 'AGENTOS_UNLOCK_INSPECTION_RETIRED'"))
assert.ok(unlockRoute.includes('status: 410'))
assert.ok(unlockRoute.includes('export async function GET()'))
assert.ok(!unlockRoute.includes('checkUnlock'))
assert.ok(!unlockRoute.includes('KEY_UNLOCK_MAP'))
assert.ok(!unlockRoute.includes('missing: result.missing'))
assert.ok(!unlockRoute.includes('details: String(error)'))

assert.ok(contextBuilder.includes('export async function buildDtcContext'))
assert.ok(rulesEngine.includes('export async function checkUnlock'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    publicContextInspectionRetired: true,
    publicUnlockInspectionRetired: true,
    memoryExposedOverGenericHttp: false,
    internalRuleDetailsExposedOverGenericHttp: false,
    internalContextBuilderPreserved: true,
    internalRulesEnginePreserved: true,
    liveHttpCheckedInThisScript: false,
  }),
)
