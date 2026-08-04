import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const legacyTaskWriter = source('app/api/a2/complete-task/route.ts')
const signalRoute = source('app/api/a2/extract-signals/route.ts')
const day3Client = source('components/a2-day3-experience.tsx')
const canonicalCompletion = source('app/api/a2/complete-day/route.ts')

assert.ok(legacyTaskWriter.includes("code: 'A2_LEGACY_TASK_WRITER_RETIRED'"))
assert.ok(legacyTaskWriter.includes("replacement: '/api/a2/complete-day'"))
assert.ok(legacyTaskWriter.includes('status: 410'))
assert.ok(legacyTaskWriter.includes('export async function POST()'))
assert.ok(legacyTaskWriter.includes('export async function GET()'))
assert.ok(!legacyTaskWriter.includes('completedTasks'))
assert.ok(!legacyTaskWriter.includes('new Map'))
assert.ok(!legacyTaskWriter.includes('xpEarned'))
assert.ok(!legacyTaskWriter.includes('userId'))
assert.ok(!legacyTaskWriter.includes('request.json()'))
assert.ok(!legacyTaskWriter.includes('searchParams'))

assert.ok(signalRoute.includes('resolveServerUser()'))
assert.ok(signalRoute.includes('createAdminClient()'))
assert.ok(signalRoute.includes('dayNumber: z.literal(3)'))
assert.ok(signalRoute.includes(".from('a2_market_signals')"))
assert.ok(signalRoute.includes(".eq('user_id', currentUser.id)"))
assert.ok(signalRoute.includes(".eq('day_number', parsedRequest.data.dayNumber)"))
assert.ok(signalRoute.includes('boundedMarketSignals.length < 3'))
assert.ok(signalRoute.includes("model: 'gpt-4o-mini'"))
assert.ok(signalRoute.includes('store: false'))
assert.ok(signalRoute.includes("response_format: { type: 'json_object' }"))
assert.ok(signalRoute.includes('aiResponseSchema.safeParse'))
assert.ok(signalRoute.includes(".from('a2_extracted_signals')"))
assert.ok(signalRoute.includes('user_id: currentUser.id'))
assert.ok(signalRoute.includes("source: aiSignals ? 'openai_validated' : 'deterministic_fallback'"))
assert.ok(!signalRoute.includes('interface ExtractSignalsRequest'))
assert.ok(!signalRoute.includes('const { marketSignals, userId, dayNumber } = body'))
assert.ok(!signalRoute.includes('createExtractedSignal('))
assert.ok(!signalRoute.includes('body.userId'))
assert.ok(!signalRoute.includes('body.user_id'))

assert.ok(day3Client.includes("fetch('/api/a2/extract-signals'"))
assert.ok(day3Client.includes("credentials: 'include'"))
assert.ok(day3Client.includes('JSON.stringify({ dayNumber: 3 })'))
assert.ok(!day3Client.includes('marketSignals,\n          userId'))
assert.ok(!day3Client.includes('userId,\n          dayNumber'))
assert.ok(!day3Client.includes('createExtractedSignal'))

assert.ok(canonicalCompletion.includes('resolveServerUser()'))
assert.ok(canonicalCompletion.includes('const userId = currentUser.id'))
assert.ok(canonicalCompletion.includes('validateA2MissionSubmission'))
assert.ok(canonicalCompletion.includes('validateA2SpecializedDaySubmission'))
assert.ok(canonicalCompletion.includes('analyzeA2Day1Submission'))
assert.ok(canonicalCompletion.includes(".from('a2_user_task_completions')"))
assert.ok(!canonicalCompletion.includes('body.userId'))
assert.ok(!canonicalCompletion.includes('body.xpEarned'))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    legacyTaskWriterRetired: true,
    clientControlledXpAccepted: false,
    day3IdentityResolvedByServer: true,
    day3VacanciesLoadedFromPersistence: true,
    clientSuppliedMarketSignalsAccepted: false,
    aiOutputSchemaValidated: true,
    openAiStorageDisabled: true,
    canonicalA2CompletionPreserved: true,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
