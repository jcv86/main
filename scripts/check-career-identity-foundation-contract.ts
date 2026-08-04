import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { assertConfidence, assertWeight } from "../lib/career/agent-contract"

const migration = readFileSync("supabase/migrations/20260804061000_career_identity_foundation.sql", "utf8")
const service = readFileSync("lib/career/supabase-career-service.ts", "utf8")

for (const table of [
  "career_identities",
  "career_goals",
  "career_skills",
  "career_skill_edges",
  "career_evidence",
  "career_memories",
  "career_profile_snapshots",
  "career_agent_events",
]) {
  assert.match(migration, new RegExp(`create table if not exists public\\.${table}`))
  assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`))
}

assert.match(migration, /career_agent_events_owner_select/)
assert.match(migration, /career_agent_events_owner_insert/)
assert.doesNotMatch(migration, /career_agent_events_owner_all/)
assert.match(migration, /auth\.uid\(\) = user_id/g)
assert.match(migration, /check \(confidence between 0 and 100\)/)
assert.match(migration, /check \(weight between -1 and 1\)/)
assert.match(migration, /check \(expires_at is null or expires_at > observed_at\)/)
assert.match(migration, /check \(valid_until is null or valid_until > valid_from\)/)

assert.match(service, /auth\.getUser\(\)/)
assert.match(service, /data\.user\.id !== userId/)
assert.doesNotMatch(service, /createAdminClient|SUPABASE_SERVICE_ROLE_KEY/)
assert.match(service, /career_agent_events/)
assert.match(service, /correlation_id/)
assert.match(service, /outcome:/)

for (const value of [0, 50, 100]) assert.doesNotThrow(() => assertConfidence(value))
for (const value of [-0.1, 100.1, Number.NaN, Number.POSITIVE_INFINITY]) {
  assert.throws(() => assertConfidence(value), RangeError)
}
for (const value of [-1, 0, 1]) assert.doesNotThrow(() => assertWeight(value))
for (const value of [-1.01, 1.01, Number.NaN]) assert.throws(() => assertWeight(value), RangeError)

console.log("Career Identity foundation contract: OK")
