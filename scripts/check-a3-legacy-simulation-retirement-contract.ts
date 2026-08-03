import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const redirects: Record<string, string> = {
  'app/despega/a3/entrenamiento-guiado/page.tsx':
    '/despega/a3/coach-practice-room',
  'app/despega/a3/entrenamiento-estructurado/page.tsx':
    '/despega/a3/first-recruiter-simulation',
  'app/despega/a3/entrenamiento-desafiante/page.tsx':
    '/despega/a3/risk-difficult-questions-lab',
  'app/despega/a3/entrenamiento-conversacional/page.tsx':
    '/despega/a3/communication-gym',
  'app/despega/a3/conversational-interview/page.tsx':
    '/despega/a3/first-recruiter-simulation',
  'app/despega/a3/simulaciones-estructurada/page.tsx':
    '/despega/a3/first-recruiter-simulation',
  'app/despega/a3/simulacion-real/page.tsx':
    '/despega/a3/basic-interview-mission',
  'app/despega/a3/simulations/page.tsx':
    '/despega/a3/basic-interview-mission',
}

for (const [path, destination] of Object.entries(redirects)) {
  const page = source(path)
  assert.ok(page.includes("import { redirect } from 'next/navigation'"))
  assert.ok(page.includes(`redirect('${destination}')`))
  assert.ok(!page.includes("'use client'"))
  assert.ok(!page.includes('Math.random'))
  assert.ok(!page.includes('createClient'))
  assert.ok(!page.includes('ConversationalInterviewSimulator'))
  assert.ok(!page.includes('ModuleCompletionScreen'))
}

const navigation = source('lib/module-navigation.ts')
for (const destination of new Set(Object.values(redirects))) {
  assert.ok(navigation.includes(destination))
}
for (const retiredPath of [
  '/despega/a3/entrenamiento-guiado',
  '/despega/a3/entrenamiento-estructurado',
  '/despega/a3/entrenamiento-desafiante',
  '/despega/a3/entrenamiento-conversacional',
  '/despega/a3/simulacion-real',
]) {
  assert.ok(!navigation.includes(`: '${retiredPath}'`))
}

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    retiredRoutes: Object.keys(redirects).length,
    canonicalDestinations: [...new Set(Object.values(redirects))],
    randomScoresReachableFromRetiredRoutes: false,
    clientDatabaseWritesReachableFromRetiredRoutes: false,
    liveHttpCheckedInThisScript: false,
    browserNavigationCheckedInThisScript: false,
  }),
)
