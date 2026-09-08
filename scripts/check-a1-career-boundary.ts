import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildA1ProfessionalReport } from '../lib/reports/a1-professional-report'
import { careerA1Projection, sanitizeCareerIdentityRow, sanitizeCareerRows, assertNoA1IdentityPatch } from '../lib/career/a1-read-boundary'
import { SupabaseCareerService, CareerAccessError } from '../lib/career/supabase-career-service'
import type { SupabaseClient } from '@supabase/supabase-js'

let checks = 0
function check(name: string, run: () => void) { try { run(); checks++ } catch (error) { throw new Error(name, { cause: error }) } }
const scores = { D: 20, I: 8, S: -14, C: -14 }
const report = buildA1ProfessionalReport({ rawScores: scores, dominantPattern: 'D', secondaryPattern: 'I', completedAt: '2026-09-07T18:00:00Z' })
const row = {
  id: 'identity-fixture', user_id: 'owner', version: 7,
  strengths: [{ key: 'D', score: 20 }, 'Preparar informes'], growth_areas: [{ key: 'S', score: 0 }],
  communication_profile: { framework: 'DISC', dominantPattern: 'D', secondaryPattern: 'I', scores: { D: 20, I: 8, S: 0, C: 0 }, confidence: 70, a3Module: { verified: true } },
  metadata: { existing: 'preserved' },
}
check('negative net scores remain negative and no confidence is manufactured', () => {
  const projection = careerA1Projection(report)
  assert.equal(projection.rawScores?.S, -14)
  assert.equal(projection.displayIntensities?.S, 25)
  assert.ok(!('confidence' in projection))
  assert.equal(projection.kind, 'self_reported_preferences')
})
check('legacy aliases and numerical strengths are quarantined; A3 preserved', () => {
  const output = sanitizeCareerIdentityRow(row, report)
  assert.deepEqual(output.strengths, ['Preparar informes'])
  assert.deepEqual(output.growth_areas, [])
  assert.deepEqual(output.communication_profile.a3Module, { verified: true })
  assert.ok(!('dominantPattern' in output.communication_profile))
  assert.ok(!('scores' in output.communication_profile))
  assert.ok(!('confidence' in output.communication_profile))
  assert.equal(output.metadata.existing, 'preserved')
})
check('non-DISC A3 top-level fields are retained', () => {
  const communication_profile = { framework: 'a3-rubric', scores: { communication: 81 }, confidence: 50 }
  const output = sanitizeCareerIdentityRow({ ...row, communication_profile }, report).communication_profile
  assert.equal(output.framework, 'a3-rubric')
  assert.deepEqual(output.scores, communication_profile.scores)
  assert.equal(output.confidence, 50)
})
check('missing assessment never falls back to old stored DISC', () => {
  const output = sanitizeCareerIdentityRow(row, null)
  assert.equal(output.communication_profile.a1.status, 'missing')
  assert.equal(output.communication_profile.a1.rawScores, null)
})
check('ambiguous pattern uses canonical evidence, not old labels', () => {
  const tied = buildA1ProfessionalReport({ rawScores: { D: 0, I: 0, S: 0, C: 0 }, dominantPattern: 'D', secondaryPattern: 'I' })
  const output = sanitizeCareerIdentityRow(row, tied).communication_profile.a1
  assert.equal(output.status, 'ambiguous')
  assert.equal(output.primary, null)
  assert.equal(output.secondary, null)
  assert.deepEqual(output.primaryCandidates, ['D', 'I', 'S', 'C'])
})
check('impossible scores do not leak through the projection', () => {
  const invalid = buildA1ProfessionalReport({ rawScores: { D: 28, I: 28, S: -28, C: -28 } })
  assert.equal(careerA1Projection(invalid).status, 'unavailable')
  assert.equal(careerA1Projection(invalid).rawScores, null)
})
const rows = {
  skills: [{ id: 'disc-skill', skill_key: 'disc.d', confidence: 70 }, { id: 'a3-skill', skill_key: 'a3.practice', score: 82 }],
  skillEdges: [{ id: 'edge-a1', source_skill_id: 'disc-skill', target_skill_id: 'a3-skill' }, { id: 'edge-other', source_skill_id: 'a3-skill', target_skill_id: 'a3-skill' }],
  recentEvidence: [{ id: 'a1-evidence', source_module: 'a1', confidence: 70 }, { id: 'a3-evidence', source_module: 'a3', skill_id: 'a3-skill' }],
  memories: [{ id: 'm-a1', metadata: { module: 'a1' } }, { id: 'm-linked', source_evidence_id: 'old-a1-evidence' }, { id: 'm-other', source_evidence_id: 'a3-evidence' }],
  a1EvidenceIds: ['old-a1-evidence'],
}
check('linked skills, evidence and memories do not reintroduce DISC capabilities', () => {
  const safe = sanitizeCareerRows(rows)
  assert.deepEqual(safe.skills.map((item) => item.id), ['a3-skill'])
  assert.deepEqual(safe.skillEdges.map((item) => item.id), ['edge-other'])
  assert.deepEqual(safe.recentEvidence.map((item) => item.id), ['a3-evidence'])
  assert.deepEqual(safe.memories.map((item) => item.id), ['m-other'])
})
check('read operations preserve history', () => {
  const before = JSON.stringify({ row, rows })
  sanitizeCareerIdentityRow(row, report); sanitizeCareerRows(rows)
  assert.equal(JSON.stringify({ row, rows }), before)
})
for (const key of ['a1', 'scores', 'dominantPattern', 'confidence', 'DISC']) check(`agent patch cannot replace ${key}`, () => assert.throws(() => assertNoA1IdentityPatch({ communicationProfile: { [key]: 70 } }), TypeError))
check('unrelated communication patch remains available', () => assert.doesNotThrow(() => assertNoA1IdentityPatch({ communicationProfile: { a3Practice: { summary: 'Declared context' } } })))
check('source boundaries and user-owned loading are wired', () => {
  const service = readFileSync('lib/career/supabase-career-service.ts', 'utf8')
  assert.ok(service.includes('sanitizeCareerRows'))
  assert.ok(service.includes('sanitizeCareerIdentityRow'))
  assert.ok(service.includes('await this.readA1(userId)'))
  assert.ok(!service.includes('createAdminClient'))
  const page = readFileSync('app/despega/career-identity/page.tsx', 'utf8')
  assert.ok(page.indexOf('auth.getUser()') < page.indexOf('loadA1Report(user.id)'))
  assert.ok(page.indexOf('if (!access?.allowed)') < page.indexOf('career.getIdentity(user.id)'))
  assert.ok(!page.includes('await career.ensureIdentity'))
})

// Exercise the real service against an in-memory query port. This is not an RLS substitute.
async function serviceTests() {
  const database: Record<string, any[]> = {
    career_identities: [row],
    a1_cerebral_assessment: [{ user_id: 'owner', disc_profile: scores, responses: {}, dominant_pattern: 'D', secondary_pattern: 'I', completed_at: '2026-09-07T18:00:00Z' }],
    career_identity_goals: [], career_skills: rows.skills.map((item) => ({ ...item, user_id: 'owner' })),
    career_skill_edges: rows.skillEdges.map((item) => ({ ...item, user_id: 'owner' })),
    career_memories: rows.memories.map((item) => ({ ...item, user_id: 'owner', superseded_by: null })),
    career_evidence: [...rows.recentEvidence, { id: 'old-a1-evidence', source_module: 'a1' }].map((item) => ({ ...item, user_id: 'owner' })),
  }
  let queries = 0, writes = 0, provenanceBatches = 0
  let authFailure = false, sourceFailure = false, provenanceFailure = false
  const client = {
    auth: { getUser: async () => ({ data: { user: { id: 'owner' } }, error: authFailure ? new Error('synthetic expired session') : null }) },
    from: (table: string) => {
      queries++
      let data = [...(database[table] ?? [])]
      let provenance = false
      const result = () => ({ data, error: table === 'a1_cerebral_assessment' && sourceFailure || provenance && provenanceFailure ? new Error('PRIVATE SOURCE DETAIL') : null })
      const builder: any = {
        select: () => builder,
        eq: (field: string, value: unknown) => { data = data.filter((item) => item[field] === value); return builder },
        neq: (field: string, value: unknown) => { data = data.filter((item) => item[field] !== value); return builder },
        in: (field: string, values: unknown[]) => { assert.ok(values.length <= 100); provenance = true; provenanceBatches++; data = data.filter((item) => values.includes(item[field])); return builder },
        is: (field: string, value: unknown) => { data = data.filter((item) => (item[field] ?? null) === value); return builder },
        order: () => builder,
        limit: (limit: number) => { data = data.slice(0, limit); return builder },
        maybeSingle: async () => ({ ...result(), data: data[0] ?? null }),
        then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => Promise.resolve(result()).then(resolve, reject),
        update: () => { writes++; throw new Error('Unexpected mutation') },
        insert: () => { writes++; throw new Error('Unexpected mutation') },
      }
      return builder
    },
  } as unknown as SupabaseClient
  const service = new SupabaseCareerService(client)
  await assert.rejects(service.getContext('someone-else'), CareerAccessError)
  assert.equal(queries, 0); checks++
  authFailure = true
  await assert.rejects(service.getIdentity('owner'), CareerAccessError)
  assert.equal(queries, 0); checks++
  authFailure = false
  const identity = await service.getIdentity('owner')
  assert.equal((identity?.communicationProfile.a1 as any).rawScores.S, -14)
  assert.deepEqual(identity?.strengths, ['Preparar informes']); checks++
  const context = await service.getContext('owner')
  assert.deepEqual(context.skills.map((skill) => skill.id), ['a3-skill'])
  assert.deepEqual(context.recentEvidence.map((item) => item.id), ['a3-evidence'])
  assert.deepEqual(context.memories.map((memory) => memory.id), ['m-other'])
  assert.equal(writes, 0); checks++
  sourceFailure = true
  await assert.rejects(service.getIdentity('owner'), (error: Error) => !error.message.includes('PRIVATE') && error.message.includes('fuente A1'))
  sourceFailure = false; checks++
  for (let i = 0; i < 205; i++) {
    database.career_evidence.push({ id: `archived-a1-${i}`, source_module: 'a1', user_id: 'owner' })
    database.career_memories.push({ id: `linked-memory-${i}`, source_evidence_id: `archived-a1-${i}`, user_id: 'owner', superseded_by: null })
  }
  provenanceBatches = 0
  const large = await service.getContext('owner')
  assert.equal(provenanceBatches, 3)
  assert.deepEqual(large.memories.map((memory) => memory.id), ['m-other']); checks++
  provenanceFailure = true
  await assert.rejects(service.getContext('owner'), (error: Error) => !error.message.includes('PRIVATE') && error.message.includes('procedencia'))
  provenanceFailure = false; checks++
  database.a1_cerebral_assessment = []
  const missing = await service.getIdentity('owner')
  assert.equal((missing?.communicationProfile.a1 as any).status, 'missing'); checks++
  assert.equal(writes, 0)
  console.log(`A1 Career read boundary: PASS (${checks} grouped checks; real service with synthetic query port, no live database)`)
}
serviceTests().catch((error) => { console.error(error); process.exitCode = 1 })
