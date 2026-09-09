import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const progressSource = readFileSync('app/api/a2/progress/route.ts', 'utf8')
const transcriptionSource = readFileSync('app/api/a2/transcribe/route.ts', 'utf8')

assert.match(progressSource, /if \(!currentUser\)/)
assert.match(progressSource, /code: 'unauthenticated'/)
assert.match(progressSource, /status: 401/)
assert.doesNotMatch(
  progressSource.match(/if \(!currentUser\)[\s\S]*?\n    }/)?.[0] ?? '',
  /emptyProgress\(\)/,
  'An unauthenticated request must not look like a new A2 journey.',
)

assert.match(transcriptionSource, /code: 'a2_transcription_retired'/)
assert.match(transcriptionSource, /status: 410/)
assert.doesNotMatch(transcriptionSource, /GROQ_API_KEY|api\.groq\.com/)
assert.doesNotMatch(transcriptionSource, /request\.formData|formData\.get/)
assert.doesNotMatch(transcriptionSource, /status:\s*200/)

console.log(
  JSON.stringify({
    a2ProgressUnauthenticatedStatus: 401,
    retiredTranscriptionStatus: 410,
    retiredEndpointAcceptsUploads: false,
    retiredEndpointCallsExternalProvider: false,
  }),
)
