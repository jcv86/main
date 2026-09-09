import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Keep this list deliberately small and reviewable. These are the production
// surfaces that previously logged user content or direct identifiers.
const protectedSources = [
  'lib/hooks/use-speech-recognition.ts',
  'components/conozcamonos/voice-input.tsx',
  'components/persistent-ai-coach.tsx',
  'components/session-wrapper.tsx',
  'components/activity-calendar.tsx',
  'lib/dtc-agentos/evaluation/evaluator.ts',
  'lib/openai-direct.ts',
  'app/api/a1/insights/route.ts',
  'app/api/conozcamonos/validate-response/route.ts',
  'app/admin/brain/page.tsx',
  'lib/email-templates.ts',
  'lib/multimodal/encryption.ts',
  'app/api/a3/progress/route.ts',
  'lib/canon-orchestrator.ts',
  'lib/notifications/job-notifications.ts',
  'lib/despega/notification-actions.ts',
  'lib/supabase/task-completions.ts',
  'lib/supabase/dtc-documents.ts',
  'app/api/a3/module-completion/route.ts',
  'app/api/a3/module-completion/basic-interview-mission/route.ts',
  'app/api/a3/module-completion/risk-difficult-questions-lab/route.ts',
] as const

// Exact regression signatures are used instead of banning ordinary variable
// names: application logic must still be able to process private data, while
// log sinks must never receive it.
const forbiddenSignatures = [
  'console.log("[v0] Transcript:", transcript)',
  "console.log('[v0] Result:', { transcript",
  "console.log('[v0] Final transcript set:', finalTranscript.trim())",
  "console.log('[v0] Final transcript received:', transcript)",
  'console.log("[v0] Sending message:", currentMessage)',
  'console.log("[v0] User email from session:", session.user.email)',
  "'User:', newSession?.user?.email",
  'for email:", userEmail',
  'for:", userEmail, "date:',
  'Phone number fetched:", data.phone_number',
  "Raw response:', text",
  "Failed to parse JSON response:', responseText",
  "Failed to parse OpenAI response:', content",
  'Response text:", responseText',
  'Response was:", responseText',
  'Parsed JSON data:", data',
  'OpenAI validation response:`, aiContent',
  'OpenAI rejected response:`, aiValidation.reason',
  '${template.subject} → ${email}',
  'for user ${userId}',
  "for user:', request.userId",
  'completion.user_id}:`, error',
  'userId: user.id',
  '{ type, sourceModule, userId }',
  "completion response:', data",
] as const

for (const relativePath of protectedSources) {
  const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8')
  for (const signature of forbiddenSignatures) {
    assert.ok(!source.includes(signature), `${relativePath} reintroduced sensitive logging: ${signature}`)
  }
}

console.log(`Sensitive log contract: PASS (${protectedSources.length} allowlisted production surfaces)`)
