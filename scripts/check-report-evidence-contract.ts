import assert from 'node:assert/strict'
import {
  A1_DIMENSIONS, formatReportDate, latestReportTimestamp, netScoreToIntensity,
  normalizeReportTimestamp, readA1ScoreEvidence, resolveA1Patterns,
} from '../lib/reports/report-evidence'

let checks = 0
function check(name: string, run: () => void) {
  try { run(); checks += 1 } catch (error) { throw new Error(`Report evidence contract failed: ${name}`, { cause: error }) }
}
const limit = 28
const complete = { D: 18, I: 5, S: -8, C: -15 }
for (const value of [undefined, null, '', '   ']) {
  check(`absent score ${String(value)}`, () => {
    const evidence = readA1ScoreEvidence({ ...complete, D: value }, limit)
    assert.equal(evidence.scores.D, null)
    assert.equal(evidence.status, 'partial')
    assert.deepEqual(evidence.missingDimensions, ['D'])
    assert.equal(netScoreToIntensity(evidence.scores.D, limit), null)
    assert.deepEqual(resolveA1Patterns(evidence, 'D', 'I'), { primary: null, secondary: null, source: 'unavailable' })
  })
}
for (const value of [false, true, [], [0], {}, 'bad', NaN, Infinity, -Infinity, 1.5, 29, -29, '29', '0x10', '1e1']) {
  check(`malformed score ${String(value)}`, () => {
    const evidence = readA1ScoreEvidence({ ...complete, C: value }, limit)
    assert.equal(evidence.scores.C, null)
    assert.equal(evidence.status, 'invalid')
    assert.deepEqual(evidence.invalidDimensions, ['C'])
    assert.equal(resolveA1Patterns(evidence, 'D', 'I').source, 'unavailable')
  })
}
for (const raw of [undefined, null, [], 'not an object', {}, Object.create(complete)]) {
  check('missing input never becomes four neutral scores', () => {
    const evidence = readA1ScoreEvidence(raw, limit)
    assert.equal(evidence.availableDimensions, 0)
    assert.equal(evidence.status, 'missing')
    assert.ok(A1_DIMENSIONS.every((key) => evidence.scores[key] === null))
  })
}
check('real zero remains distinct from missing', () => {
  const evidence = readA1ScoreEvidence({ D: 0, I: 0, S: 0, C: 0 }, limit)
  assert.equal(evidence.status, 'complete')
  assert.equal(netScoreToIntensity(evidence.scores.D, limit), 50)
  assert.deepEqual(resolveA1Patterns(evidence), { primary: null, secondary: null, source: 'unavailable' })
  assert.deepEqual(resolveA1Patterns(evidence, 's', 'c'), { primary: 'S', secondary: 'C', source: 'canonical' })
})
check('numeric strings preserve legacy compatibility', () => {
  assert.deepEqual(readA1ScoreEvidence({ D: ' 18 ', I: '+5', S: '-8', C: '-15.0' }, limit).scores, complete)
})
check('canonical patterns remain authoritative', () => {
  assert.deepEqual(resolveA1Patterns(readA1ScoreEvidence(complete, limit), 'S', 'C'), {
    primary: 'S', secondary: 'C', source: 'canonical',
  })
})
check('unique fallback is labeled derived', () => {
  assert.deepEqual(resolveA1Patterns(readA1ScoreEvidence(complete, limit)), { primary: 'D', secondary: 'I', source: 'derived' })
})
check('duplicate canonical pattern is not repeated', () => {
  assert.deepEqual(resolveA1Patterns(readA1ScoreEvidence(complete, limit), 'D', 'D'), { primary: 'D', secondary: 'I', source: 'derived' })
})
check('secondary ties are not resolved alphabetically', () => {
  assert.deepEqual(resolveA1Patterns(readA1ScoreEvidence({ D: 8, I: 0, S: 0, C: -8 }, limit), 'D'), {
    primary: 'D', secondary: null, source: 'unavailable',
  })
})
for (let score = -limit; score <= limit; score += 1) {
  check(`signed scale ${score}`, () => {
    const intensity = netScoreToIntensity(score, limit)!
    assert.equal(intensity, Math.round((score + limit) / (2 * limit) * 100))
    assert.ok(intensity >= 0 && intensity <= 100)
    if (score > -limit) assert.ok(intensity >= netScoreToIntensity(score - 1, limit)!)
  })
}
check('conversion guards and endpoint saturation', () => {
  assert.equal(netScoreToIntensity(null, limit), null)
  assert.equal(netScoreToIntensity(NaN, limit), null)
  assert.equal(netScoreToIntensity(Infinity, limit), null)
  assert.equal(netScoreToIntensity(-999, limit), 0)
  assert.equal(netScoreToIntensity(999, limit), 100)
  assert.throws(() => readA1ScoreEvidence({}, 0), RangeError)
  assert.throws(() => netScoreToIntensity(0, -1), RangeError)
})
for (const value of [undefined, null, '', 'bad', '0', '2026-08-28', '2026-08-28T12:00:00',
  '2026-02-30T12:00:00Z', '2026-13-01T12:00:00Z', '2026-08-28T25:00:00Z', '2026-08-28T12:00:00+30:00']) {
  check(`unknown timestamp ${String(value)}`, () => {
    assert.equal(normalizeReportTimestamp(value), null)
    assert.equal(formatReportDate(value), 'Fecha no disponible')
  })
}
check('timestamps preserve explicit offsets and leap dates', () => {
  assert.equal(normalizeReportTimestamp('2026-08-28T09:00:00-03:00'), '2026-08-28T12:00:00.000Z')
  assert.equal(normalizeReportTimestamp('2028-02-29T12:00:00.123456+00:00'), '2028-02-29T12:00:00.123Z')
  assert.equal(normalizeReportTimestamp('2026-02-29T12:00:00Z'), null)
})
check('evidence timestamp includes context completed after assessment', () => {
  assert.equal(latestReportTimestamp(['2026-08-28T12:00:00Z', null, 'bad', '2026-08-29T12:00:00Z']), '2026-08-29T12:00:00.000Z')
  assert.equal(latestReportTimestamp([null, undefined, 'bad']), null)
})
check('formatting is fixed to Chile, not the server timezone', () => {
  const formatted = formatReportDate('2026-08-28T02:00:00Z')
  assert.ok(formatted.includes('27') && formatted.includes('agosto') && formatted.includes('2026'))
})
console.log(`DTC report evidence contract: PASS (${checks} cases)`)
