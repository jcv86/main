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

const uploadRoute = source('app/api/a2/day1/upload/route.ts')
const coachRoute = source('app/api/a2/day1/coach-enhance/route.ts')
const analyzeRoute = source('app/api/a2/day1/analyze/route.ts')
const canonicalCoach = source('app/api/a2/coach-assist/route.ts')
const canonicalExperience = source('components/a2-day1-experience.tsx')
const canonicalIntro = source('components/a2-day1-intro.tsx')

assert.ok(uploadRoute.includes("code: 'A2_DAY1_PUBLIC_UPLOAD_RETIRED'"))
assert.ok(uploadRoute.includes("replacement: '/api/a2/day1/analyze'"))
assert.ok(uploadRoute.includes('status: 410'))
assert.ok(!uploadRoute.includes("from '@vercel/blob'"))
assert.ok(!uploadRoute.includes('put('))
assert.ok(!uploadRoute.includes("access: 'public'"))
assert.ok(!uploadRoute.includes("cookieStore.get('demo_user')"))
assert.ok(!uploadRoute.includes('request.formData()'))

assert.ok(coachRoute.includes("code: 'A2_DAY1_MOCK_COACH_RETIRED'"))
assert.ok(coachRoute.includes("replacement: '/api/a2/coach-assist'"))
assert.ok(coachRoute.includes('status: 410'))
assert.ok(!coachRoute.includes("cookieStore.get('demo_user')"))
assert.ok(!coachRoute.includes('Placeholder enhancement'))
assert.ok(!coachRoute.includes('Senior ${role}'))
assert.ok(!coachRoute.includes('request.json()'))

for (const path of [
  'components/a2-day1-modal.tsx',
  'components/a2-day1-step6-upload.tsx',
  'components/a2-day1-step2-coach.tsx',
]) {
  assert.equal(
    existsSync(join(process.cwd(), path)),
    false,
    `${path} must remain deleted because the legacy modal has no active caller.`,
  )
}

assert.ok(analyzeRoute.includes('resolveServerUser()'))
assert.ok(analyzeRoute.includes('const userId = currentUser.id'))
assert.ok(analyzeRoute.includes('analyzeA2Day1Submission(userId, input)'))
assert.ok(analyzeRoute.includes('buildDay1PersistencePayload(userId'))
assert.ok(!analyzeRoute.includes('demo_user'))

assert.ok(canonicalCoach.includes('resolveServerUser()'))
assert.ok(canonicalCoach.includes('requestSchema.safeParse(payload)'))
assert.ok(canonicalCoach.includes("model: 'gpt-4o-mini'"))
assert.ok(canonicalCoach.includes('store: false'))
assert.ok(!canonicalCoach.includes('body.userId'))
assert.ok(!canonicalCoach.includes('SUPABASE_SERVICE_ROLE_KEY'))

assert.ok(!canonicalExperience.includes('A2Day1Upload'))
assert.ok(!canonicalExperience.includes('A2Day1Step5ExternalSave'))
assert.ok(!canonicalExperience.includes("'Sube Tu Documento'"))
assert.ok(!canonicalExperience.includes("'Guardar Externamente'"))
assert.ok(canonicalExperience.includes("'Análisis y Puntuación'"))
assert.ok(!canonicalIntro.includes('luego lo subirás'))
assert.ok(!canonicalIntro.includes('editarlo afuera'))
assert.ok(canonicalIntro.includes('Guardarlo de forma segura en tu recorrido'))

const activeFiles = [
  ...executableFiles('app'),
  ...executableFiles('components'),
  ...executableFiles('hooks'),
  ...executableFiles('lib'),
]
for (const path of activeFiles) {
  const content = source(path)
  assert.ok(!content.includes('/api/a2/day1/upload'), `${path} still calls the retired upload route.`)
  assert.ok(!content.includes('/api/a2/day1/coach-enhance'), `${path} still calls the retired mock coach route.`)
  assert.ok(!content.includes('A2Day1Modal'), `${path} still references the retired legacy modal.`)
}

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    retiredRoutes: 2,
    deletedDeadComponents: 3,
    unsignedDemoCookieAccepted: false,
    publicPersonalFileUploadReachable: false,
    mockCoachReachable: false,
    canonicalDay1ServerOwned: true,
    canonicalCoachAuthenticated: true,
    canonicalDay1StructuredFlow: true,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
