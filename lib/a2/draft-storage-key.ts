const A2_DRAFT_PREFIX = 'dtc:a2'

export function createA2DraftStorageKey(userId: string, dayNumber: number): string {
  const normalizedUserId = userId.trim()
  if (!normalizedUserId) throw new Error('A user scope is required for A2 drafts.')
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 90) {
    throw new Error('A valid A2 day is required for drafts.')
  }

  return `${A2_DRAFT_PREFIX}:${encodeURIComponent(normalizedUserId)}:day:${dayNumber}:draft`
}

export function createLegacyA2DraftStorageKey(dayNumber: number): string {
  return `a2_day_draft_${dayNumber}`
}
