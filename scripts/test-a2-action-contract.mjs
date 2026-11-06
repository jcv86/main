/** Real shared contracts; no network, model, database or participant UAT. */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  a2ActionCommandSchema, a2ActionDraftSchema, a2ActionProposalSchema, a2ActionReceiptSchema,
  a2ActionResultSchema, a2ActionResultMatchesCommand, a2ActionStoredContent,
} from '../lib/a2/assistant-action-contract.ts'
import { readAdjustmentContent } from '../lib/a2/practice-adjustment.ts'
import { a2PlanToday, validateA2PlanReviewDate } from '../lib/a2/plan-contract.ts'

const requestId = '00000000-0000-4000-8000-000000000101'
const documentId = '00000000-0000-4000-8000-000000000202'
const adjustment = { outcome: 'could_not', barrier: 'time', retainedWork: 'Un esquema propio.',
  nextAction: 'Practicar cinco minutos y anotar una mejora.', reviewDate: '2026-11-07' }
const command = () => ({ version: 'dtc-a2-action-command.v1', tool: 'save_practice_adjustment',
  requestId, dayNumber: 3, expectedContextHash: 'a'.repeat(64), adjustment: { ...adjustment } })
const receipt = () => ({ version: 'dtc-a2-action-receipt.v1', requestId, documentId, dayNumber: 3,
  committedAt: '2026-11-06T22:00:00Z', replayed: false })
const cases = [], results = []
const test = (name, run) => cases.push({ name, run })
const draft = () => { const { reviewDate, ...value } = adjustment; return value }

test('A confirmed action remains compatible with the canonical adjustment reader', () => {
  const normalized = a2ActionCommandSchema.parse(command())
  const content = a2ActionStoredContent(normalized)
  assert.deepEqual(readAdjustmentContent(JSON.stringify(content)), content)
  assert.equal(content.version, 1); assert.equal(content.dayNumber, 3)
  assert.equal(content.draft, undefined); assert.equal(content.requestId, undefined)
})
test('A model draft can leave unknown retained work blank but a confirmed action cannot', () => {
  assert.equal(a2ActionDraftSchema.safeParse({ ...draft(), retainedWork: '' }).success, true)
  const value = command(); value.adjustment.retainedWork = ' '
  assert.equal(a2ActionCommandSchema.safeParse(value).success, false)
})
for (const extra of ['userId', 'actorId', 'url', 'sql', 'confirmedByModel', 'completed', 'xp']) {
  test('No additional authority enters a command through ' + extra, () => {
    assert.equal(a2ActionCommandSchema.safeParse({ ...command(), [extra]: 'forged' }).success, false)
  })
}
for (const tool of ['complete_day', 'send_application', 'execute_command', 'update_objective']) {
  test('Only the purpose-specific adjustment tool is accepted: ' + tool, () => {
    assert.equal(a2ActionCommandSchema.safeParse({ ...command(), tool }).success, false)
  })
}
for (const invalid of ['2026-02-29', '2026-11-31', '2026-1-01', '2026-11-07T00:00:00Z']) {
  test('A malformed calendar date cannot become a confirmed review: ' + invalid, () => {
    const value = command(); value.adjustment.reviewDate = invalid
    assert.equal(a2ActionCommandSchema.safeParse(value).success, false)
  })
}
test('The review window uses Chile calendar days and includes its exact 30-day boundary', () => {
  assert.equal(a2PlanToday(new Date('2026-11-07T02:59:59Z')), '2026-11-06')
  assert.equal(a2PlanToday(new Date('2026-11-07T03:00:00Z')), '2026-11-07')
  assert.equal(validateA2PlanReviewDate('2026-12-06', '2026-11-06').ok, true)
  assert.equal(validateA2PlanReviewDate('2026-12-07', '2026-11-06').ok, false)
  assert.equal(validateA2PlanReviewDate('2026-11-05', '2026-11-06').ok, false)
})
for (const invalid of ['a\u0000b', '\ud800', '\udc00', 'a\ud800b']) {
  test('Non-storable text is rejected before persistence: ' + JSON.stringify(invalid), () => {
    const value = command(); value.adjustment.nextAction = invalid
    assert.equal(a2ActionCommandSchema.safeParse(value).success, false)
  })
}
test('Valid emoji and accents survive review normalization and storage', () => {
  const value = command(); value.adjustment.nextAction = '  Revisar una acción 🧭.  '
  const checked = a2ActionCommandSchema.parse(value)
  assert.equal(checked.adjustment.nextAction, 'Revisar una acción 🧭.')
  assert.equal(readAdjustmentContent(a2ActionStoredContent(checked)).nextAction, checked.adjustment.nextAction)
})
test('The proposal carries no date, request identifier, execution result or URL from a model', () => {
  const proposal = { version: 'dtc-a2-action-proposal.v1', tool: 'save_practice_adjustment',
    dayNumber: 3, expectedContextHash: 'a'.repeat(64), draft: draft() }
  assert.equal(a2ActionProposalSchema.safeParse(proposal).success, true)
  assert.equal(a2ActionProposalSchema.safeParse({ ...proposal, receipt: receipt() }).success, false)
  assert.equal(a2ActionProposalSchema.safeParse({ ...proposal, draft: { ...draft(), reviewDate: '2026-11-07' } }).success, false)
})
test('Receipt and presently observed effect are separate and independently validated', () => {
  const present = a2ActionResultSchema.parse({ version: 'dtc-a2-action-result.v1', receipt: receipt(),
    effect: 'present', adjustment })
  assert.equal(a2ActionResultMatchesCommand(present, command()), true)
  for (const effect of ['changed', 'removed']) {
    const replay = a2ActionResultSchema.parse({ ...present, receipt: { ...receipt(), replayed: true }, effect, adjustment: null })
    assert.equal(a2ActionResultMatchesCommand(replay, command()), true)
    assert.equal(a2ActionResultSchema.safeParse({ ...replay, adjustment }).success, false)
  }
  assert.equal(a2ActionResultSchema.safeParse({ ...present, adjustment: null }).success, false)
})
test('A mismatched request, day or confirmed content cannot be acknowledged by the UI', () => {
  const present = { version: 'dtc-a2-action-result.v1', receipt: receipt(), effect: 'present', adjustment }
  for (const result of [
    { ...present, receipt: { ...receipt(), requestId: documentId } },
    { ...present, receipt: { ...receipt(), dayNumber: 4 } },
    { ...present, adjustment: { ...adjustment, nextAction: 'Distinta' } },
  ]) assert.equal(a2ActionResultMatchesCommand(a2ActionResultSchema.parse(result), command()), false)
  assert.equal(a2ActionReceiptSchema.safeParse({ ...receipt(), documentId: 'invented' }).success, false)
})
test('A repeated input normalizes to the same command without changing its request identity', () => {
  const first = command(); first.adjustment.retainedWork = '  Un esquema propio.  '
  assert.deepEqual(a2ActionCommandSchema.parse(first), a2ActionCommandSchema.parse(command()))
})
test('UUID case normalizes before the database receipt is matched', () => {
  const id = 'ABCDEF12-ABCD-4ABC-8ABC-ABCDEF123456'
  const checked = a2ActionCommandSchema.parse({ ...command(), requestId: id })
  assert.equal(checked.requestId, id.toLowerCase())
  const result = a2ActionResultSchema.parse({ version: 'dtc-a2-action-result.v1',
    receipt: { ...receipt(), requestId: id, documentId: id }, effect: 'present', adjustment })
  assert.equal(result.receipt.documentId, id.toLowerCase())
  assert.equal(a2ActionResultMatchesCommand(result, checked), true)
})

for (const { name, run } of cases) {
  try { await run(); results.push({ name, status: 'passed' }) }
  catch (error) { results.push({ name, status: 'failed', error: error.message }); process.exitCode = 1; console.error(name + ': ' + error.message) }
}
const evidence = { suite: 'a2-assistant-action-contract', cases: cases.length,
  passed: results.filter(result => result.status === 'passed').length, actualContracts: true,
  realDatabase: false, modelCalls: 0, externalNetworkCalls: 0, results,
  sourceHashes: ['lib/a2/assistant-action-contract.ts', 'scripts/test-a2-action-contract.mjs'].map(path => ({
    path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex'),
  })),
}
if (process.env.DTC_AGENTIC_QA_OUTPUT) {
  mkdirSync(process.env.DTC_AGENTIC_QA_OUTPUT, { recursive: true })
  writeFileSync(join(process.env.DTC_AGENTIC_QA_OUTPUT, 'a2-action-contract.json'), JSON.stringify(evidence, null, 2) + '\n')
}
console.log(JSON.stringify({ suite: evidence.suite, cases: evidence.cases, passed: evidence.passed, modelCalls: 0, externalNetworkCalls: 0 }))
