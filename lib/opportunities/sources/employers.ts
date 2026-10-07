import type { CanonicalOpportunity } from '../types'
import {
  EMPLOYER_BOARDS, employerApiUrl, employerBoardKey, employerJobId, planEmployerBoards,
  type EmployerBoard, type EmployerSource,
} from './employer-registry'
import { normalizeEmployerJob } from './employer-normalize'
import {
  createEmployerRequestContext, EmployerRequestError, fetchEmployerJson,
  type EmployerRequestContext, type EmployerRequestOptions,
} from './employer-request'

export { EMPLOYER_BOARDS, employerBoardKey, isEmployerJobUrl, planEmployerBoards } from './employer-registry'
export type { EmployerBoard, EmployerSource } from './employer-registry'
export { normalizeEmployerJob } from './employer-normalize'

export interface EmployerBoardResult {
  source: EmployerSource
  board: string
  boardKey: string
  outcome: 'ok' | 'no_matches' | 'partial' | 'unavailable' | 'parse_failed' | 'rate_limited' | 'cooldown'
  received: number
  accepted: number
  rejected: number
  excluded: number
  returned: number
  completeSnapshot: boolean
  observedSourceIds: string[]
  retryAfterUntil?: string
  failureCode?: string
}

export interface EmployerFetchOptions extends EmployerRequestOptions {
  cooldowns?: Record<string, string>
}

export interface EmployerBatchResult {
  jobs: CanonicalOpportunity[]
  boards: EmployerBoardResult[]
}

const MAX_JOBS_PER_BOARD = 50
const MAX_ROWS_PER_BOARD = 500
const LEVER_PAGE_SIZE = 100
const MAX_LEVER_PAGES = 5

function initialResult(board: EmployerBoard): EmployerBoardResult {
  return {
    source: board.source, board: board.board, boardKey: employerBoardKey(board),
    outcome: 'unavailable', received: 0, accepted: 0, rejected: 0, excluded: 0, returned: 0,
    completeSnapshot: false, observedSourceIds: [],
  }
}

async function collectBoard(board: EmployerBoard, ctx: EmployerRequestContext, cycle: number): Promise<{ jobs: CanonicalOpportunity[]; result: EmployerBoardResult }> {
  const result = initialResult(board)
  const jobs: CanonicalOpportunity[] = []
  const observed = new Set<string>()
  const seen = new Map<string, 'accepted' | 'excluded' | 'rejected'>()
  let complete = false
  let processed = 0
  let skip = 0
  try {
    for (let page = 0; page < (board.source === 'lever' ? MAX_LEVER_PAGES : 1); page++) {
      const payload = await fetchEmployerJson(ctx, employerApiUrl(board, skip))
      let rows: unknown[]
      let terminal = false
      let payloadComplete = true
      if (board.source === 'lever') {
        if (!Array.isArray(payload)) throw new EmployerRequestError('parse_failed', 'payload_shape')
        rows = payload
        terminal = rows.length < LEVER_PAGE_SIZE
        if (rows.length > LEVER_PAGE_SIZE) { payloadComplete = false; result.failureCode = 'unexpected_page_size' }
      } else {
        const data = payload !== null && typeof payload === 'object' && !Array.isArray(payload) ? payload as Record<string, unknown> : {}
        if (!Array.isArray(data.jobs)) throw new EmployerRequestError('parse_failed', 'payload_shape')
        rows = data.jobs
        const meta = data.meta !== null && typeof data.meta === 'object' && !Array.isArray(data.meta) ? data.meta as Record<string, unknown> : {}
        payloadComplete = typeof meta.total === 'number' && Number.isSafeInteger(meta.total) && meta.total === rows.length
        if (!payloadComplete) result.failureCode = 'snapshot_count_mismatch'
        terminal = true
      }
      result.received += rows.length
      const room = MAX_ROWS_PER_BOARD - processed
      const considered = rows.slice(0, Math.min(room, board.source === 'lever' ? LEVER_PAGE_SIZE : MAX_ROWS_PER_BOARD))
      if (considered.length !== rows.length) { payloadComplete = false; result.failureCode ||= 'row_limit' }
      const verifiedAt = new Date(ctx.now()).toISOString()
      for (const row of considered) {
        if (ctx.remaining() <= 0 || ctx.signal.aborted) throw new EmployerRequestError('unavailable', ctx.signal.aborted ? 'aborted' : 'budget_exhausted')
        processed++
        const rawId = row !== null && typeof row === 'object' ? (row as Record<string, unknown>).id : undefined
        const id = employerJobId(board.source, rawId)
        if (id && seen.has(id) && seen.get(id) !== 'rejected') {
          result.rejected++
          result.failureCode ||= 'duplicate_id'
          continue
        }
        const normalized = normalizeEmployerJob(board, row, verifiedAt)
        // An incomplete first copy must not hide a later, fully validated copy.
        // The earlier rejection remains and prevents absence reconciliation.
        // Accepted or explicitly excluded identities cannot be replaced.
        if (id) seen.set(id, normalized.kind)
        if (normalized.kind === 'rejected') {
          result.rejected++
          result.failureCode ||= normalized.reason
        } else if (normalized.kind === 'excluded') result.excluded++
        else {
          observed.add(normalized.job.sourceId)
          jobs.push(normalized.job)
        }
      }
      result.accepted = observed.size
      if (observed.size > MAX_JOBS_PER_BOARD) {
        result.failureCode ||= 'eligible_limit'
        break
      }
      if (!payloadComplete) break
      if (terminal) { complete = true; break }
      if (page + 1 === MAX_LEVER_PAGES || processed >= MAX_ROWS_PER_BOARD) {
        result.failureCode ||= 'page_limit'
        break
      }
      skip += rows.length
    }
    result.completeSnapshot = complete && result.rejected === 0
    result.outcome = result.completeSnapshot ? (jobs.length ? 'ok' : 'no_matches') : jobs.length ? 'partial' : result.rejected ? 'parse_failed' : 'partial'
  } catch (error) {
    const failure = error instanceof EmployerRequestError ? error : new EmployerRequestError('unavailable', 'provider_error')
    result.outcome = jobs.length ? 'partial' : failure.outcome
    result.failureCode = failure.code
    if (failure.retryAfterUntil) result.retryAfterUntil = failure.retryAfterUntil
  }
  result.accepted = observed.size
  // Rotate only within the eligible rows already received. The request/page
  // budgets and the partial-snapshot boundary above remain unchanged.
  // Reduce before multiplying so every safe integer slot stays deterministic.
  const offset = jobs.length > MAX_JOBS_PER_BOARD
    ? ((cycle % jobs.length) * MAX_JOBS_PER_BOARD) % jobs.length : 0
  const selected = jobs.length > MAX_JOBS_PER_BOARD
    ? [...jobs.slice(offset), ...jobs.slice(0, offset)].slice(0, MAX_JOBS_PER_BOARD)
    : jobs
  result.returned = selected.length
  result.observedSourceIds = [...observed]
  return { jobs: selected, result }
}

/** Two allowlisted boards per slot, 18s wall budget, public reads only. */
export async function fetchEmployerBatch(slot: number, options: EmployerFetchOptions = {}): Promise<EmployerBatchResult> {
  const boards = planEmployerBoards(slot)
  const cycle = Math.floor(slot / (EMPLOYER_BOARDS.length / 2))
  const ctx = createEmployerRequestContext(options)
  try {
    const batches = await Promise.all(boards.map(async board => {
      const cooldown = options.cooldowns?.[employerBoardKey(board)]
      if (typeof cooldown === 'string' && Date.parse(cooldown) > ctx.now()) {
        return { jobs: [] as CanonicalOpportunity[], result: {
          ...initialResult(board), outcome: 'cooldown' as const, retryAfterUntil: new Date(cooldown).toISOString(),
        } }
      }
      return collectBoard(board, ctx, cycle)
    }))
    return { jobs: batches.flatMap(batch => batch.jobs), boards: batches.map(batch => batch.result) }
  } finally { ctx.dispose() }
}
