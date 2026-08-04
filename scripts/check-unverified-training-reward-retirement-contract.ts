import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

function executableFiles(rootPath: string): string[] {
  const absoluteRoot = join(process.cwd(), rootPath)
  if (!existsSync(absoluteRoot)) return []

  const files: string[] = []
  for (const entry of readdirSync(absoluteRoot)) {
    const absolute = join(absoluteRoot, entry)
    const stats = statSync(absolute)
    if (stats.isDirectory()) {
      files.push(...executableFiles(relative(process.cwd(), absolute)))
      continue
    }
    if (['.ts', '.tsx', '.js', '.jsx'].includes(extname(entry))) {
      files.push(relative(process.cwd(), absolute))
    }
  }
  return files
}

assert.equal(
  existsSync(join(process.cwd(), 'lib/auth-helper.ts')),
  false,
  'The unsigned JWT identity helper must remain deleted.',
)
assert.equal(
  existsSync(join(process.cwd(), 'lib/training-progress-tracker.ts')),
  false,
  'The client-scored parallel training reward tracker must remain deleted.',
)

for (const path of [...executableFiles('app'), ...executableFiles('lib')]) {
  const content = source(path)
  assert.ok(!content.includes("cookieStore.get('sb-auth-token')"), `${path} reads a legacy auth cookie directly.`)
  assert.ok(!content.includes('Buffer.from(parts[1]'), `${path} decodes a JWT payload without verification.`)
  assert.ok(!content.includes("from './auth-helper'"), `${path} imports the retired auth helper.`)
  assert.ok(!content.includes("from '@/lib/auth-helper'"), `${path} imports the retired auth helper.`)
  assert.ok(!content.includes('saveTrainingSession('), `${path} exposes the retired parallel training writer.`)
}

const canonicalCompletion = source('app/api/a3/module-completion/route.ts')
assert.ok(canonicalCompletion.includes('resolveServerUser()'))
assert.ok(canonicalCompletion.includes('checkA3ModuleAccess('))
assert.ok(canonicalCompletion.includes('validateA3ModuleSubmission('))
assert.ok(canonicalCompletion.includes("'complete_a3_module_atomic'"))
assert.ok(canonicalCompletion.includes('p_score: validation.score'))
assert.ok(canonicalCompletion.includes('p_module_xp: module.xp'))
assert.ok(!canonicalCompletion.includes('body.score'))
assert.ok(!canonicalCompletion.includes('body.xp'))
assert.ok(!canonicalCompletion.includes('body.points'))
assert.ok(!canonicalCompletion.includes(".from('user_dtc_balance').upsert"))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    unsignedJwtIdentityHelperRetired: true,
    parallelTrainingRewardTrackerRetired: true,
    canonicalA3IdentityServerVerified: true,
    canonicalA3SubmissionValidated: true,
    canonicalA3CompletionAtomic: true,
    clientControlledScoreOrRewardsAccepted: false,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
