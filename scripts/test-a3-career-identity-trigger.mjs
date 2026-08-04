import fs from 'node:fs'

const path = 'supabase/migrations/20260804150000_a3_career_identity_module_completion.sql'
const sql = fs.readFileSync(path, 'utf8')

const required = [
  'security invoker',
  'set search_path = public',
  'a3_progress_career_identity_sync',
  'sync_a3_progress_to_career_identity',
  "'a3-module-' || v_module_id",
  "'a3-completion-writer'",
  'on conflict (user_id, source_module, source_type, source_ref)',
  "v_user_id := new.user_id::uuid",
  'except',
]

for (const token of required) {
  if (!sql.toLowerCase().includes(token.toLowerCase())) {
    throw new Error(`Missing A3 Career Identity contract token: ${token}`)
  }
}

for (const forbidden of ['security definer', 'service_role']) {
  if (sql.toLowerCase().includes(forbidden)) {
    throw new Error(`Forbidden A3 trigger contract token: ${forbidden}`)
  }
}

const modules = [
  'career-mirror',
  'value-mining-lab',
  'cv-builder-studio',
  'job-decoder',
  'answer-architecture',
  'coach-practice-room',
  'communication-gym',
  'first-recruiter-simulation',
  'risk-difficult-questions-lab',
  'basic-interview-mission',
]

for (const moduleId of modules) {
  if (!sql.includes(moduleId)) throw new Error(`Missing module mapping: ${moduleId}`)
}

console.log('A3 Career Identity trigger contract passed')
