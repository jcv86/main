import assert from 'node:assert/strict'
import { deriveEconomicOutcome, deriveJobSearchFunnel, deriveTimeToJobDays, safeRate } from '../lib/outcomes-chile/metrics'

assert.equal(safeRate(1,4),25)
assert.equal(safeRate(1,0),null)
const funnel=deriveJobSearchFunnel(['application','application','application','application','employer_response','interview','process_advance','offer'])
assert.deepEqual(funnel,{rateBasis:'recorded_event_ratio_not_process_conversion',applications:4,employerResponses:1,interviews:1,processAdvances:1,offers:1,responseRate:25,interviewRate:25,advanceRate:100,offerRate:100})
assert.equal(deriveJobSearchFunnel([]).responseRate,null)
assert.deepEqual(deriveEconomicOutcome(1000000,1200000),{baselineMonthlyNetClp:1000000,latestMonthlyNetClp:1200000,monthlyLiftClp:200000,salaryLiftPct:20,annualizedLiftClp:2400000})
assert.deepEqual(deriveEconomicOutcome(1000000,800000),{baselineMonthlyNetClp:1000000,latestMonthlyNetClp:800000,monthlyLiftClp:-200000,salaryLiftPct:-20,annualizedLiftClp:-2400000})
assert.equal(deriveEconomicOutcome(0,800000).salaryLiftPct,null)
for (const amount of [NaN, Infinity, -1, 0.5, 100000001]) assert.equal(deriveEconomicOutcome(amount,800000).monthlyLiftClp,null)
assert.equal(deriveEconomicOutcome(null,800000).annualizedLiftClp,null)
assert.equal(deriveTimeToJobDays(new Date('2026-01-01'),new Date('2026-02-01')),31)
assert.equal(deriveTimeToJobDays(new Date('2026-02-01'),new Date('2026-01-01')),null)
assert.equal(deriveTimeToJobDays(new Date('invalid'),new Date('2026-01-01')),null)
console.log(JSON.stringify({outcomesChileMetrics:'PASS',causalClaim:false}))
