import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { routeVeraQuery, type VeraTrack } from '../lib/vera/brain-v2'

const CASES: Array<{ query: string; expected: VeraTrack }> = [
  { query: '¿Qué significa la UF?', expected: 'fast' },
  { query: 'Explícame qué es el IMACEC', expected: 'fast' },
  { query: '¿Cómo funciona A2?', expected: 'fast' },
  { query: '¿Qué es una entrevista por competencias?', expected: 'fast' },
  { query: '¿Qué significa un perfil DISC alto en D?', expected: 'fast' },
  { query: 'Compara esta oferta con mi ruta y mis objetivos', expected: 'agentic' },
  { query: 'Según mi perfil, ¿calza conmigo este cargo?', expected: 'agentic' },
  { query: 'Quiero decidir entre dos ofertas según lo que definí en A2', expected: 'agentic' },
  { query: 'Practiquemos una entrevista para este cargo', expected: 'agentic' },
  { query: 'Simula conmigo una pregunta difícil de entrevista', expected: 'agentic' },
  { query: 'Con lo que sabes de mí, ¿qué patrón ves en mis decisiones?', expected: 'agentic' },
  { query: '¿Qué brechas tengo para postular a esta gerencia?', expected: 'agentic' },
  { query: 'Analiza mi CV frente a esta oferta', expected: 'agentic' },
  { query: '¿Qué dice mi progreso A1-A4 sobre lo que estoy evitando?', expected: 'agentic' },
  { query: '¿Qué tendencias hay hoy en el mercado laboral chileno?', expected: 'fast' },
]

let correct = 0
for (const testCase of CASES) {
  const decision = routeVeraQuery(testCase.query)
  if (decision.track === testCase.expected) correct += 1
}

const accuracy = correct / CASES.length
assert.ok(accuracy >= 0.9, `Vera router benchmark below target: ${accuracy}`)

const route = readFileSync(join(process.cwd(), 'app/api/despega/a4-coach/route.ts'), 'utf8')
const brain = readFileSync(join(process.cwd(), 'lib/vera/brain-v2.ts'), 'utf8')
const tools = readFileSync(join(process.cwd(), 'lib/vera/tool-catalog.ts'), 'utf8')
const context = readFileSync(join(process.cwd(), 'lib/vera/context-pack.ts'), 'utf8')

assert.ok(route.includes('resolveServerUser()'), 'A4 Vera route must verify Supabase session')
assert.ok(route.includes('requestSchema.safeParse(payload)'), 'A4 Vera route must validate payload')
assert.ok(route.includes("'authentication_required'"), 'A4 Vera route must reject anonymous access')
assert.ok(route.includes("store: false"), 'A4 Vera route must disable provider response storage')
assert.ok(route.includes("runVeraTool('journey_context')"), 'Agentic path must use server-owned journey tool')
assert.ok(route.includes("'x-vera-track'"), 'Response must expose non-sensitive routing mode')
assert.ok(!route.includes('userId?:'), 'A4 Vera request must not accept client-controlled user id')
assert.ok(!route.includes('SUPABASE_SERVICE_ROLE_KEY'), 'A4 Vera route must not construct privileged clients')
assert.ok(tools.includes('getSharedJourneyContext()'), 'Tool catalogue must use canonical journey context')
assert.ok(tools.includes('callers never provide a user id'), 'Tool catalogue must document server-owned identity')
assert.ok(context.includes('SENSITIVE_KEY'), 'Evidence pack must filter sensitive identity fields')
assert.ok(context.includes('.slice(0, 8)'), 'Evidence pack must bound arrays')
assert.ok(brain.includes("track: agentic ? 'agentic' : 'fast'"), 'Router must expose Fast/Agentic split')
assert.ok(brain.includes('decision final pertenece al usuario'), 'Coach policy must preserve user agency')

console.log(
  JSON.stringify({
    evidenceLevel: 'runtime_router_plus_source_contract',
    cases: CASES.length,
    correct,
    accuracy,
    fastTrack: true,
    agenticTrack: true,
    canonicalJourneyTool: true,
    userAgencyPolicy: true,
    clientControlledUserIdAccepted: false,
  }),
)
