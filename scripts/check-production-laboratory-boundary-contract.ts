import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const middleware = source('middleware.ts')
const demoRoute = source('app/api/auth/demo/route.ts')

assert.ok(middleware.includes('process.env.VERCEL_ENV && isProductionLaboratoryRoute(pathname)'))
assert.ok(middleware.includes('status: 404'))
assert.ok(middleware.includes("const PRODUCTION_LAB_ROUTE_PREFIXES = ['/test', '/demo', '/design-system']"))
assert.ok(middleware.includes("const PRODUCTION_LAB_ROUTES = ['/auth/debug', '/auth/test']"))
assert.ok(middleware.includes('pathname.startsWith(`${prefix}-`)'))
assert.ok(!middleware.includes("searchParams.get('preview')"))
assert.ok(!middleware.includes('hasPreviewQuery'))
assert.ok(!middleware.includes("request.cookies.get('dtc_preview_access')"))

assert.ok(demoRoute.includes("code: 'DEMO_AUTH_RETIRED'"))
assert.ok(!demoRoute.includes('dtc_preview_access'))
assert.ok(!demoRoute.includes("DEMO_COOKIE_NAME, 'preview'"))

console.log(JSON.stringify({
  evidenceLevel: 'source_contract',
  productionDemoIssuance: 'retired',
  queryStringAuthorization: false,
  productionLaboratories: 'not_found',
  deployedLaboratoriesRetired: true,
}))
