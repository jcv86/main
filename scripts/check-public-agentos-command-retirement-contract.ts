import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const commandRoute = source('app/api/dtc-agentos/execute-command/route.ts')
const contextRoute = source('app/api/dtc-agentos/context/route.ts')
const unlockRoute = source('app/api/dtc-agentos/unlock-status/route.ts')
const executor = source('lib/dtc-agentos/commands/execute-command.ts')
const registry = source('lib/dtc-agentos/registries/commands.ts')
const contextBuilder = source('lib/dtc-agentos/context/context-builder.ts')
const rulesEngine = source('lib/dtc-agentos/unlock/rules-engine.ts')

assert.ok(commandRoute.includes("code: 'PUBLIC_AGENTOS_COMMAND_EXECUTION_RETIRED'"))
assert.ok(commandRoute.includes('status: 410'))
assert.ok(commandRoute.includes("'Cache-Control': 'no-store'"))
assert.ok(!commandRoute.includes('request.json()'))
assert.ok(!commandRoute.includes('executeCommand('))
assert.ok(!commandRoute.includes('createClient'))
assert.ok(!commandRoute.includes('commandId'))
assert.ok(!commandRoute.includes('agentId'))
assert.ok(!commandRoute.includes('modeId'))
assert.ok(!commandRoute.includes('params'))

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

assert.ok(executor.includes('export async function executeCommand('))
assert.ok(registry.includes("'/dtc:memory-update'"))
assert.ok(registry.includes("'/dtc:unlock-check'"))
assert.ok(registry.includes("allowedAgents: ['system']"))
assert.ok(registry.includes("allowedModes: ['background']"))
assert.ok(contextBuilder.includes('export async function buildDtcContext'))
assert.ok(rulesEngine.includes('export async function checkUnlock'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    genericPublicCommandEndpointRetired: true,
    publicContextInspectionRetired: true,
    publicUnlockInspectionRetired: true,
    arbitraryCommandParamsAcceptedOverHttp: false,
    memoryExposedOverGenericHttp: false,
    internalRuleDetailsExposedOverGenericHttp: false,
    internalExecutorPreserved: true,
    internalContextBuilderPreserved: true,
    internalRulesEnginePreserved: true,
    systemOnlyCommandsRemainInternal: true,
    liveHttpCheckedInThisScript: false,
  }),
)
