import { createHash } from 'node:crypto'
import { UNDERSTANDING_VERSION, record } from './individual-evidence'
import { CLARIFICATION_KEY } from './individual-understanding'

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable)
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, stable(item)]))
  return value
}
/** Revision is a consistency token, never an authorization token. Excludes feedback itself. */
export function a1SourceRevision(assessment: unknown, c1: unknown, c2: unknown): string {
  const row = record(c2)
  const responses = { ...record(row.responses) }
  delete responses[CLARIFICATION_KEY]
  const payload = [UNDERSTANDING_VERSION, assessment, c1, { id: row.id, completed_at: row.completed_at, responses }]
  return createHash('sha256').update(JSON.stringify(stable(payload))).digest('hex')
}

export function a1EditRevision(c2: unknown): string {
  return createHash('sha256').update(JSON.stringify(stable(c2))).digest('hex')
}
