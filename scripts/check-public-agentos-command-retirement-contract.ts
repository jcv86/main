import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const publicRoute = source('app/api/dtc-agentos/execute-command/route.ts')
const executor = source('lib/dtc-agentos/commands/execute-command.ts')
const registry = source('lib/dtc-agentos/registries/commands.ts')

assert.ok(publicRoute.includes("code: 'PUBLIC_AGENTOS_COMMAND_EXECUTION_RETIRED'"))
assert.ok(publicRoute.includes('status: 410'))
assert.ok(publicRoute.includes("'Cache-Control': 'no-store'"))
assert.ok(!publicRoute.includes('request.json()'))
assert.ok(!publicRoute.includes('executeCommand('))
assert.ok(!publicRoute.includes('createClient'))
assert.ok(!publicRoute.includes('commandId'))
assert.ok(!publicRoute.includes('agentId'))
assert.ok(!publicRoute.includes('modeId'))
assert.ok(!publicRoute.includes('params'))

assert.ok(executor.includes('export async function executeCommand('))
assert.ok(registry.includes("'/dtc:memory-update'"))
assert.ok(registry.includes("'/dtc:unlock-check'"))
assert.ok(registry.includes("allowedAgents: ['system']"))
assert.ok(registry.includes("allowedModes: ['background']"))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    genericPublicCommandEndpointRetired: true,
    arbitraryCommandParamsAcceptedOverHttp: false,
    internalExecutorPreserved: true,
    systemOnlyCommandsRemainInternal: true,
    liveHttpCheckedInThisScript: false,
  }),
)
