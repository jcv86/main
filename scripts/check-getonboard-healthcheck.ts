import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const route = readFileSync('app/api/health/opportunities/getonboard/route.ts','utf8')
assert.ok(route.includes("provider: 'getonboard'"))
assert.ok(route.includes('valid_original_urls'))
assert.ok(route.includes('opportunities.slice(0, 3)'))
assert.ok(!route.includes('resolveServerUser'))
assert.ok(!route.includes('raw:'))
assert.ok(route.includes("{ status: opportunities.length > 0 ? 200 : 503 }"))
console.log(JSON.stringify({ publicSafe:true, noPrivateUserData:true, sampleBounded:true, failClosed:true }))
