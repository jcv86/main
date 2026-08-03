export interface SantiagoCronWindow {
  date: string
  hour: number
  minute: number
  shouldRun: boolean
}

export function getSantiagoCronWindow(now = new Date()): SantiagoCronWindow {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || ''
  const date = `${value('year')}-${value('month')}-${value('day')}`
  const hour = Number(value('hour'))
  const minute = Number(value('minute'))

  return {
    date,
    hour,
    minute,
    shouldRun: hour === 8,
  }
}
