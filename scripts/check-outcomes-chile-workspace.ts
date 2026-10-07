import assert from 'node:assert/strict'
import { buildChileImpact, type ChileImpactEvidence, type ChileFollowup } from '../lib/outcomes-chile/impact'
import { buildChileWorkspace } from '../lib/outcomes-chile/workspace'

const CUTOFF = '2026-10-07T13:00:00Z'
const record = { created_at: '2026-09-01T12:00:00Z', verification_status: 'self_reported' as const }
const job = {
  ...record, id: 'job', role_title: 'Analista de operaciones', outcome_type: 'job_started',
  effective_date: '2026-09-07', region_code: null, occupation_code: null, employment_category: null,
}
const followup: ChileFollowup = {
  ...record, id: 'followup', employment_outcome_id: 'job', followup_day: 30,
  due_at: '2026-10-07', completed_at: null, employment_active: null, same_role: null,
}
const evidence: ChileImpactEvidence = {
  events: [{ ...record, id: 'event', event_type: 'interview', target_role: 'Analista', occurred_at: '2026-10-01T01:30:00Z' }],
  employment: [job],
  salary: [{ ...record, id: 'zero', measurement_role: 'baseline', monthly_net_clp: 0, measured_at: '2026-09-01', employment_outcome_id: null }],
  followups: [followup],
}

const workspace = buildChileWorkspace(evidence, CUTOFF)
assert.equal(workspace.asOfDate, '2026-10-07')
assert.equal(workspace.employmentOptions[0].roleTitle, job.role_title)
assert.equal(workspace.history.find((row) => row.id === 'zero')?.monthlyNetClp, 0)
assert.equal(workspace.history.find((row) => row.id === 'event')?.date, '2026-09-30', 'event history uses the Santiago calendar')
assert.equal(workspace.history.find((row) => row.id === 'event')?.detail, 'Analista')
assert.equal(workspace.historyCount, 3, 'an uncompleted follow-up is not recorded as an observed result')

const beforeChileMidnight = buildChileWorkspace(evidence, '2026-10-07T02:00:00Z')
assert.equal(beforeChileMidnight.asOfDate, '2026-10-06')
assert.equal(beforeChileMidnight.followups[0].state, 'upcoming')
assert.equal(beforeChileMidnight.followups[0].canComplete, false)
assert.equal(workspace.followups[0].state, 'due')
assert.equal(workspace.followups[0].canComplete, true)
assert.equal(buildChileWorkspace(evidence, '2026-10-08T13:00:00Z').followups[0].state, 'overdue')

const followups: ChileFollowup[] = [
  { ...followup, id: 'locked', verification_status: 'verified' },
  { ...followup, id: 'done', completed_at: '2026-10-07T12:00:00Z', employment_active: false },
  { ...followup, id: 'early', completed_at: '2026-10-06T12:00:00Z', employment_active: true, same_role: true },
  { ...followup, id: 'future-completion', completed_at: '2026-10-08T12:00:00Z', employment_active: true },
]
const reviewed = buildChileWorkspace({ ...evidence, followups }, CUTOFF)
assert.ok(reviewed.followups.every((row) => !row.canComplete), 'reviewed and previously completed records cannot be overwritten in the UI')
assert.equal(reviewed.followups.find((row) => row.id === 'done')?.state, 'completed')
assert.equal(reviewed.followups.find((row) => row.id === 'done')?.employmentActive, false)
assert.equal(reviewed.followups.find((row) => row.id === 'early')?.state, 'needs_review')
assert.equal(reviewed.followups.find((row) => row.id === 'future-completion')?.state, 'needs_review')
assert.deepEqual(reviewed.history.filter((row) => row.kind === 'followup').map((row) => row.id), ['done'])

const corrupt: ChileImpactEvidence = {
  ...evidence,
  employment: [job, { ...job, id: 'future-job', effective_date: '2026-10-08' }],
  events: [...evidence.events, { ...evidence.events[0], id: 'future-event', occurred_at: '2026-10-08T12:00:00Z' }],
  salary: [...evidence.salary,
    { ...evidence.salary[0], id: 'future-salary', measured_at: '2026-10-08' },
    { ...evidence.salary[0], id: 'invalid-salary', monthly_net_clp: -10 },
  ],
  followups: [followup,
    { ...followup, id: 'orphan', employment_outcome_id: 'not-owned-or-missing' },
    { ...followup, id: 'wrong-date', due_at: '2026-10-08' },
  ],
}
assert.deepEqual(buildChileWorkspace(corrupt, CUTOFF), workspace, 'invalid or future observations cannot appear as current history or selectable employment')
const impact = buildChileImpact(corrupt, null, CUTOFF)
assert.equal(impact.evidenceCoverage.included.events, workspace.history.filter((row) => row.kind === 'event').length)
assert.equal(impact.evidenceCoverage.included.salary, workspace.history.filter((row) => row.kind === 'salary').length)
assert.equal(impact.evidenceCoverage.included.followups, workspace.followupCount)

const many: ChileImpactEvidence = {
  events: Array.from({ length: 1201 }, (_, i) => ({ ...evidence.events[0], id: `event-${String(i).padStart(4, '0')}`, event_type: 'application' })),
  employment: Array.from({ length: 101 }, (_, i) => ({ ...job, id: `job-${i}` })),
  salary: evidence.salary,
  followups: Array.from({ length: 101 }, (_, i) => ({
    ...followup, id: `followup-${i}`, employment_outcome_id: `job-${i}`,
    ...(i < 80 ? { completed_at: '2026-10-07T12:00:00Z', employment_active: true } : {}),
  })),
}
const bounded = buildChileWorkspace(many, CUTOFF)
assert.deepEqual([bounded.employmentOptions.length, bounded.employmentOptionCount, bounded.employmentOptionsTruncated], [100, 101, true])
assert.deepEqual([bounded.followups.length, bounded.followupCount, bounded.followupsTruncated], [60, 101, true])
assert.deepEqual([bounded.history.length, bounded.historyCount, bounded.historyTruncated], [30, 1383, true])
assert.equal(bounded.followups.filter((row) => row.canComplete).length, 21, 'all due responses precede completed history in the bounded list')
assert.equal(buildChileImpact(many, null, CUTOFF).observed.jobSearch.applications, 1201, 'presentation limits do not truncate aggregate evidence')
assert.deepEqual(buildChileWorkspace({ ...many, events: [...many.events].reverse() }, CUTOFF), bounded, 'stable ordering survives database row ordering changes')
assert.deepEqual(buildChileWorkspace({ events: [], employment: [], salary: [], followups: [] }, CUTOFF), {
  asOfDate: '2026-10-07', employmentOptions: [], employmentOptionCount: 0, employmentOptionsTruncated: false,
  followups: [], followupCount: 0, followupsTruncated: false, history: [], historyCount: 0, historyTruncated: false,
})
assert.throws(() => buildChileWorkspace(evidence, 'invalid'), /INVALID_IMPACT_COMPUTED_AT/)
console.log(JSON.stringify({ outcomesChileWorkspace: 'PASS', calendar: 'America/Santiago', presentationBounded: true, aggregateEvidenceTruncated: false, followupEligibility: true, evidence: 'synthetic-runtime' }))
