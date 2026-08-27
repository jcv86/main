import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const migrationPath = resolve(
  root,
  'supabase/migrations/20260827090000_secure_active_a2_a3_relations.sql',
)
const retiredRoutePath = resolve(root, 'app/api/a3-responses/route.ts')
const policyRetirementPath = resolve(
  root,
  'supabase/migrations/20260827091000_retire_public_a2_route_policy.sql',
)
const interviewRoutePath = resolve(
  root,
  'app/api/a3/interview-feedback/[userId]/route.ts',
)

assert.ok(existsSync(migrationPath), 'the A2/A3 data-boundary migration must exist')
assert.ok(!existsSync(retiredRoutePath), 'the incompatible legacy response route must stay retired')

const migration = readFileSync(migrationPath, 'utf8')
const policyRetirement = readFileSync(policyRetirementPath, 'utf8')
const interviewRoute = readFileSync(interviewRoutePath, 'utf8')
const protectedRelations = [
  'a2_learning_routes',
  'a3_preguntas_entrevista',
  'a3_respuestas_entrevista',
  'a3_entrevista_feedback_ia',
]

for (const relation of protectedRelations) {
  assert.match(
    migration,
    new RegExp(`alter table public\\.${relation} enable row level security`, 'i'),
    `${relation} must have RLS enabled`,
  )
  assert.match(
    migration,
    new RegExp(`revoke all on table public\\.${relation} from anon, authenticated`, 'i'),
    `${relation} must reject direct browser-role access`,
  )
  assert.match(
    migration,
    new RegExp(`grant select, insert, update, delete on table public\\.${relation} to service_role`, 'i'),
    `${relation} must remain available to authenticated server routes`,
  )
}

assert.match(
  policyRetirement,
  /drop policy if exists "Rutas visibles para todos" on public\.a2_learning_routes/i,
  'the obsolete public A2 route policy must stay retired',
)

assert.match(interviewRoute, /resolveServerUser\(\)/)
assert.match(interviewRoute, /currentUser\.id !== userId/)
assert.match(interviewRoute, /createAdminClient\(\)/)
assert.match(interviewRoute, /\.eq\('user_id', userId\)/)
assert.match(interviewRoute, /complete_a3_interview_response/)

console.log('A2/A3 data-boundary contract passed')
