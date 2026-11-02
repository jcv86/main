import {
  CAPTURE_INSTRUMENTS, OUTCOME_CAPTURE_VERSION, isRecord, parseOutcomeCapture,
  type CaptureInstrumentKey, type MeasurementRole,
} from './response-capture'

export interface SavedCapture {
  observationId: string
  observedAt: string
  measurementRole: MeasurementRole
  responsePayload: Record<string, string>
}
export type CapturePairStatus = 'empty' | 'baseline_only' | 'follow_up_only' | 'available' | 'out_of_order'
export interface CaptureHistory {
  instrumentKey: CaptureInstrumentKey
  instrumentVersion: typeof OUTCOME_CAPTURE_VERSION
  baseline: SavedCapture | null
  followUp: SavedCapture | null
  pairStatus: CapturePairStatus
  evaluationStatus: 'not_evaluated'
  comparable: false
}
export function captureInstrumentKey(value: unknown): CaptureInstrumentKey | null {
  return typeof value === 'string' && Object.hasOwn(CAPTURE_INSTRUMENTS, value) ? value as CaptureInstrumentKey : null
}

/** Revalidates selected owner-bound rows; invalid data is not a missing measurement. */
export function savedCaptureFromRow(row: unknown, instrumentKey: CaptureInstrumentKey, role: MeasurementRole, now?: Date): SavedCapture | null {
  if (row === null) return null
  if (!isRecord(row) || row.instrument_key !== instrumentKey || row.measurement_role !== role
      || typeof row.observed_at !== 'string' || !Number.isFinite(Date.parse(row.observed_at))
      || (now && Date.parse(row.observed_at) > now.getTime() + 1000)) throw new Error('Invalid capture record')
  try {
    const capture = parseOutcomeCapture({
      observationId: row.id, instrumentKey: row.instrument_key, instrumentVersion: row.instrument_version,
      outcomeKey: row.outcome_key, measurementRole: row.measurement_role, responsePayload: row.response_payload,
    })
    return { observationId: capture.observationId, observedAt: row.observed_at,
      measurementRole: role, responsePayload: capture.responsePayload }
  } catch { throw new Error('Invalid capture record') }
}

/** Temporal pairing is for reading answers, never evidence of a capability improvement. */
export function captureHistory(instrumentKey: CaptureInstrumentKey, baseline: SavedCapture | null, followUp: SavedCapture | null): CaptureHistory {
  const pairStatus: CapturePairStatus = !baseline && !followUp ? 'empty'
    : !baseline ? 'follow_up_only' : !followUp ? 'baseline_only'
    : Date.parse(followUp.observedAt) > Date.parse(baseline.observedAt) ? 'available' : 'out_of_order'
  return { instrumentKey, instrumentVersion: OUTCOME_CAPTURE_VERSION, baseline, followUp,
    pairStatus, evaluationStatus: 'not_evaluated', comparable: false }
}

/** Validate the client response too; a successful HTTP status is not enough. */
export function historyFromResponse(value: unknown, instrumentKey: CaptureInstrumentKey): CaptureHistory {
  if (!isRecord(value) || value.instrumentKey !== instrumentKey
      || value.instrumentVersion !== OUTCOME_CAPTURE_VERSION
      || value.evaluationStatus !== 'not_evaluated' || value.comparable !== false) throw new Error('Invalid capture history')
  const read = (item: unknown, role: MeasurementRole) => {
    if (item === null) return null
    if (!isRecord(item) || item.measurementRole !== role) throw new Error('Invalid capture history')
    return savedCaptureFromRow({ id: item.observationId, observed_at: item.observedAt, measurement_role: item.measurementRole,
      instrument_key: instrumentKey, instrument_version: OUTCOME_CAPTURE_VERSION,
      outcome_key: CAPTURE_INSTRUMENTS[instrumentKey].outcomeKey, response_payload: item.responsePayload }, instrumentKey, role)
  }
  const result = captureHistory(instrumentKey, read(value.baseline, 'baseline'), read(value.followUp, 'follow_up'))
  if (value.pairStatus !== result.pairStatus) throw new Error('Invalid capture history')
  return result
}
