import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync('app/api/despega/profile/route.ts', 'utf8')

assert.ok(source.includes('profileUpdateSchema'), 'profile updates must use an explicit schema')
assert.ok(source.includes('.strict()'), 'unknown profile fields must be rejected')
assert.ok(source.includes('...parsed.data,\n        user_id: user.id'), 'authenticated user id must override request data')
assert.ok(!source.includes('...body'), 'raw request bodies must never reach the profile upsert')
assert.ok(!source.includes('.select("*")'), 'profile reads must use an explicit field list')
assert.ok(source.includes('Object.keys(parsed.data).length === 0'), 'empty updates must be rejected')

console.log(JSON.stringify({ profileApiHardening: true }))
