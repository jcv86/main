export interface JobSearchFunnel {
  rateBasis: 'recorded_event_ratio_not_process_conversion'
  applications: number
  employerResponses: number
  interviews: number
  processAdvances: number
  offers: number
  responseRate: number | null
  interviewRate: number | null
  advanceRate: number | null
  offerRate: number | null
}

export interface EconomicOutcome {
  baselineMonthlyNetClp: number | null
  latestMonthlyNetClp: number | null
  monthlyLiftClp: number | null
  salaryLiftPct: number | null
  annualizedLiftClp: number | null
}

export function safeRate(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) return null
  return Math.round((numerator / denominator) * 10000) / 100
}

export function deriveJobSearchFunnel(types: string[]): JobSearchFunnel {
  const count = (type: string) => types.filter((value) => value === type).length
  const applications = count('application')
  const employerResponses = count('employer_response')
  const interviews = count('interview')
  const processAdvances = count('process_advance')
  const offers = count('offer')
  return {
    rateBasis: 'recorded_event_ratio_not_process_conversion',
    applications,
    employerResponses,
    interviews,
    processAdvances,
    offers,
    responseRate: safeRate(employerResponses, applications),
    interviewRate: safeRate(interviews, applications),
    advanceRate: safeRate(processAdvances, interviews),
    offerRate: safeRate(offers, interviews),
  }
}

export function deriveEconomicOutcome(
  baselineMonthlyNetClp: number | null,
  latestMonthlyNetClp: number | null,
): EconomicOutcome {
  const validAmount = (amount: number | null) =>
    amount !== null && Number.isInteger(amount) && amount >= 0 && amount <= 100_000_000 ? amount : null
  baselineMonthlyNetClp = validAmount(baselineMonthlyNetClp)
  latestMonthlyNetClp = validAmount(latestMonthlyNetClp)
  if (baselineMonthlyNetClp === null || latestMonthlyNetClp === null) {
    return { baselineMonthlyNetClp, latestMonthlyNetClp, monthlyLiftClp: null, salaryLiftPct: null, annualizedLiftClp: null }
  }
  const monthlyLiftClp = latestMonthlyNetClp - baselineMonthlyNetClp
  return {
    baselineMonthlyNetClp,
    latestMonthlyNetClp,
    monthlyLiftClp,
    salaryLiftPct: baselineMonthlyNetClp > 0 ? safeRate(monthlyLiftClp, baselineMonthlyNetClp) : null,
    // A constant-monthly-difference projection; not twelve months of observed income.
    annualizedLiftClp: monthlyLiftClp * 12,
  }
}

export function deriveTimeToJobDays(startedAt: Date | null, effectiveDate: Date | null): number | null {
  if (!startedAt || !effectiveDate || !Number.isFinite(startedAt.getTime()) || !Number.isFinite(effectiveDate.getTime())) return null
  const days = Math.floor((effectiveDate.getTime() - startedAt.getTime()) / 86_400_000)
  return days >= 0 ? days : null
}
