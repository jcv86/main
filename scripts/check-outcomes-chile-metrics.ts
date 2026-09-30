import assert from 'node:assert/strict'
import { deriveEconomicOutcome, deriveJobSearchFunnel, deriveTimeToJobDays, safeRate } from '../lib/outcomes-chile/metrics'

assert.equal(safeRate(1,4),25)
assert.equal(safeRate(1,0),null)
const funnel=deriveJobSearchFunnel(['application','application','application','application','employer_response','interview','process_advance','offer'])
assert.deepEqual(funnel,{applications:4,employerResponses:1,interviews:1,processAdvances:1,offers:1,responseRate:25,interviewRate:25,advanceRate:100,offerRate:100})
assert.equal(deriveJobSearchFunnel([]).responseRate,null)
assert.deepEqual(deriveEconomicOutcome(1000000,1200000),{baselineMonthlyNetClp:1000000,latestMonthlyNetClp:1200000,monthlyLiftClp:200000,salaryLiftPct:20,observedAnnualLiftClp:2400000})
assert.deepEqual(deriveEconomicOutcome(1000000,800000),{baselineMonthlyNetClp:1000000,latestMonthlyNetClp:800000,monthlyLiftClp:-200000,salaryLiftPct:-20,observedAnnualLiftClp:-2400000})
assert.equal(deriveEconomicOutcome(0,800000).salaryLiftPct,null)
assert.equal(deriveTimeToJobDays(new Date('2026-01-01'),new Date('2026-02-01')),31)
assert.equal(deriveTimeToJobDays(new Date('2026-02-01'),new Date('2026-01-01')),null)
console.log(JSON.stringify({outcomesChileMetrics:'PASS',causalClaim:false}))
