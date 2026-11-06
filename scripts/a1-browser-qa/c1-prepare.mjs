import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { closureLab } from './closure-lab.mjs'
import { assertAuthSources } from './auth-lab.mjs'

const { root, app, repo, evidence } = closureLab()
const auth = JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8'))
assertAuthSources(auth, app, repo)
assert.ok(!existsSync(join(root, 'c1-prepared.json')), 'Prepare C1 once per disposable stack')
const copied = []
for (const path of ['app/despega/conozcamonos-1/page.tsx', 'app/api/assessments/drafts/[assessmentType]/route.ts',
  'lib/c1-responses.ts', 'lib/assessment-drafts.ts', 'lib/use-assessment-draft.ts']) {
  const source = join(repo, path), target = join(app, path)
  mkdirSync(dirname(target), { recursive: true })
  cpSync(source, target)
  assert.deepEqual(readFileSync(source), readFileSync(target))
  copied.push({ path, sha256: createHash('sha256').update(readFileSync(target)).digest('hex') })
}
const manifest = {
  commit: process.env.A1_SOURCE_COMMIT, environment: 'disposable-local-c1', copied,
  genuine: ['actual C1 page and draft handler', 'real email login, Supabase cookies and AppShell from Auth phase',
    'canonical assessment_drafts migration and owner RLS', 'final C1 insert and completion flag via actual browser client'],
  fixtures: ['two synthetic owners admitted by the preceding real invitation flow; no new membership, profile or completion is seeded',
    'Q2/Q3/Q4 answers are explicitly prefilled through the real draft API to isolate the Other-text regression'],
  substitutions: [...auth.substitutions.filter(value => !value.includes('sign-out')),
    'one deliberately failed draft PUT per viewport to verify visible recovery and retained text'],
  notVerified: ['external voice/AI assistance and text-quality validation', 'production schema or a remote deployment',
    'atomic final submission across response, draft and profile tables'],
  privacy: 'Only synthetic screenshots and sanitized verdicts; no passwords, tokens or private server logs.',
}
writeFileSync(join(root, 'c1-prepared.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(evidence, 'c1-scope.json'), JSON.stringify(manifest, null, 2))
console.log('C1 phase prepared: actual page, draft API and custom-text persistence.')
