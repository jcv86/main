/** Explicit public-provider smoke. Never opens a database or sends applications. */
import { EMPLOYER_BOARDS, fetchEmployerBatch } from '../lib/opportunities/sources/employers.ts'
import { EMPLOYER_REQUEST_TIMEOUT_MS } from '../lib/opportunities/employer-refresh.ts'

if (!process.argv.includes('--live')) {
  throw new Error('Pass --live to verify the registered public job sources without database writes')
}

const started = Date.now()
const boards = []
const samples = []
for (let slot = 0; slot < Math.ceil(EMPLOYER_BOARDS.length / 2); slot += 1) {
  const result = await fetchEmployerBatch(slot, { timeoutMs: EMPLOYER_REQUEST_TIMEOUT_MS })
  boards.push(...result.boards)
  samples.push(...result.jobs.slice(0, 2).map(job => ({
    source: job.source,
    sourceId: job.sourceId,
    title: job.title,
    company: job.company,
    location: job.location,
    workMode: job.workMode ?? null,
    originalUrl: job.originalUrl,
    lastVerifiedAt: job.lastVerifiedAt,
  })))
}
const healthy = boards.every(board => ['ok', 'no_matches'].includes(board.outcome))
console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  durationMs: Date.now() - started,
  healthy,
  mode: 'public_provider_read_only',
  totalReceived: boards.reduce((sum, board) => sum + board.received, 0),
  totalReturned: boards.reduce((sum, board) => sum + board.returned, 0),
  boards: boards.map(({ observedSourceIds, ...diagnostics }) => diagnostics),
  samples,
}, null, 2))
if (!healthy) process.exitCode = 1
