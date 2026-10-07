export type EmployerSource = 'lever' | 'greenhouse'

export interface EmployerBoard {
  readonly source: EmployerSource
  readonly board: string
  readonly company: string
}

/** Explicitly reviewed public boards. Two per three-hour slot; maximum 18h revisit. */
export const EMPLOYER_BOARDS: readonly EmployerBoard[] = Object.freeze([
  { source: 'lever', board: 'fintual', company: 'Fintual' },
  { source: 'greenhouse', board: 'cabify', company: 'Cabify' },
  { source: 'greenhouse', board: 'chile', company: 'Checkr' },
  { source: 'lever', board: 'applydigital', company: 'APPLY' },
  { source: 'lever', board: 'coderio', company: 'Coderio' },
  { source: 'greenhouse', board: 'pagerduty', company: 'PagerDuty' },
].map(board => Object.freeze(board as EmployerBoard)))

if (EMPLOYER_BOARDS.length > 12 || EMPLOYER_BOARDS.length % 2 !== 0) {
  throw new Error('Employer rotation requires an even number of boards, at most twelve')
}

export function planEmployerBoards(slot: number): EmployerBoard[] {
  if (!Number.isSafeInteger(slot) || slot < 0) throw new RangeError('Invalid employer slot')
  const start = (slot % (EMPLOYER_BOARDS.length / 2)) * 2
  return [EMPLOYER_BOARDS[start], EMPLOYER_BOARDS[start + 1]]
}

export function employerBoardKey(board: EmployerBoard): string {
  return `${board.source}:${board.board}`
}

export function employerJobId(source: EmployerSource, value: unknown): string | null {
  if (source === 'lever') {
    return typeof value === 'string' && /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.test(value) ? value : null
  }
  const id = typeof value === 'number' && Number.isSafeInteger(value) ? String(value) : value
  return typeof id === 'string' && /^[1-9]\d{0,15}$/.test(id) && Number.isSafeInteger(Number(id)) ? id : null
}

/** Exact source identity: no userinfo, port, query, fragment, escapes or arbitrary board. */
export function isEmployerJobUrl(source: EmployerSource, sourceId: string, value: unknown): boolean {
  if (typeof value !== 'string' || typeof sourceId !== 'string') return false
  const parts = sourceId.split(':')
  if (parts.length !== 2) return false
  const [board, id] = parts
  if (!EMPLOYER_BOARDS.some(entry => entry.source === source && entry.board === board)) return false
  if (!employerJobId(source, id)) return false
  const urls = source === 'lever'
    ? [`https://jobs.lever.co/${board}/${id}`]
    : [`https://job-boards.greenhouse.io/${board}/jobs/${id}`, `https://boards.greenhouse.io/${board}/jobs/${id}`]
  return urls.some(url => value === url || value === `${url}/`)
}

export function employerApiUrl(board: EmployerBoard, skip = 0): string {
  if (!EMPLOYER_BOARDS.some(entry => entry.source === board.source && entry.board === board.board)) {
    throw new Error('Employer board is not registered')
  }
  return board.source === 'lever'
    ? `https://api.lever.co/v0/postings/${board.board}?mode=json&skip=${skip}&limit=100`
    : `https://boards-api.greenhouse.io/v1/boards/${board.board}/jobs?content=true`
}
