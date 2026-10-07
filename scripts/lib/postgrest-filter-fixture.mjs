import assert from 'node:assert/strict'

function terms(value) {
  const result = []
  let depth = 0, start = 0
  for (let index = 0; index < value.length; index++) {
    if (value[index] === '(') depth++
    if (value[index] === ')') depth--
    if (value[index] === ',' && depth === 0) { result.push(value.slice(start, index)); start = index + 1 }
  }
  assert.equal(depth, 0, 'Balanced PostgREST expression')
  result.push(value.slice(start))
  return result
}

/** Independent SQL-like evaluation of the bounded, quoted-value-free fixture grammar. */
export function matchesPostgrestFilter(row, expression) {
  const group = /^(and|or)\((.*)\)$/.exec(expression)
  if (group) return group[1] === 'and'
    ? terms(group[2]).every(term => matchesPostgrestFilter(row, term))
    : terms(group[2]).some(term => matchesPostgrestFilter(row, term))
  const match = /^([a-z_]+)\.(not\.)?(is|eq|gt|gte|lt|lte|like)\.(.*)$/.exec(expression)
  assert.ok(match, 'Supported fixture predicate: ' + expression)
  const [, field, negated, operator, raw] = match
  const value = raw === '""' ? '' : raw
  const actual = row[field]
  if (operator === 'is') { assert.equal(value, 'null'); return actual === null || actual === undefined }
  if (actual === null || actual === undefined) return false
  let result
  if (operator === 'like') {
    const regex = '^' + value.split('').map(char => char === '*' || char === '%' ? '.*' : char === '_' ? '.' : char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('') + '$'
    result = typeof actual === 'string' && new RegExp(regex).test(actual)
  } else if (operator === 'eq') result = actual === value
  else if (operator === 'gt') result = actual > value
  else if (operator === 'gte') result = actual >= value
  else if (operator === 'lt') result = actual < value
  else result = actual <= value
  return negated ? !result : result
}
