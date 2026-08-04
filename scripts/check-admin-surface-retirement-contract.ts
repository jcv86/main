// Contrato fuente permanente: la administración permanece retirada hasta existir roles y auditoría reales.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const helper = source('lib/admin/unconfigured.ts')
const management = source('lib/dtc-agentos/admin/platform-management.ts')
const adminPage = source('app/admin/page.tsx')
const usersPage = source('app/admin/users/page.tsx')
const protectedRoute = source('components/admin/protected-admin-route.tsx')
const unavailableScreen = source('components/admin/admin-unavailable.tsx')

const unavailableRoutes = [
  'app/api/admin/users/route.ts',
  'app/api/admin/metrics/route.ts',
  'app/api/admin/export/route.ts',
  'app/api/admin/user-status/route.ts',
  'app/api/admin/pillar-access/route.ts',
]

assert.ok(helper.includes("ADMIN_UNAVAILABLE_CODE = 'ADMIN_MODEL_NOT_CONFIGURED'"))
assert.ok(helper.includes('{ status: 503 }'))
assert.ok(helper.includes("code: 'ADMIN_PILLAR_OVERRIDE_RETIRED'"))
assert.ok(helper.includes('{ status: 410 }'))

for (const path of unavailableRoutes) {
  const route = source(path)
  assert.ok(route.includes("from '@/lib/admin/unconfigured'"))
  assert.ok(route.includes('adminUnavailableResponse()'))
  assert.ok(!route.includes('request.json()'))
  assert.ok(!route.includes('createClient'))
  assert.ok(!route.includes('createAdminClient'))
  assert.ok(!route.includes(".insert("))
  assert.ok(!route.includes(".update("))
  assert.ok(!route.includes(".delete("))
}

const pillarOverride = source('app/api/admin/pillar-unlock/route.ts')
assert.ok(pillarOverride.includes('retiredPillarOverrideResponse()'))
assert.ok(!pillarOverride.includes('travis@nuanu.com'))
assert.ok(!pillarOverride.includes('admin_users'))
assert.ok(!pillarOverride.includes('request.json()'))
assert.ok(!pillarOverride.includes(".insert("))
assert.ok(!pillarOverride.includes(".delete("))

for (const content of [management, protectedRoute, adminPage, usersPage]) {
  assert.ok(!content.includes('NEXT_PUBLIC_ADMIN_EMAILS'))
  assert.ok(!content.includes('admin_roles'))
  assert.ok(!content.includes('pillar_access'))
  assert.ok(!content.includes('admin_logs'))
  assert.ok(!content.includes('travis@nuanu.com'))
}

assert.ok(!management.includes("from '@/lib/supabase/server'"))
assert.ok(management.includes('ADMIN_UNAVAILABLE_ERROR'))
assert.ok(adminPage.includes('<AdminUnavailable />'))
assert.ok(usersPage.includes('<AdminUnavailable />'))
assert.ok(protectedRoute.includes('<AdminUnavailable />'))
assert.ok(unavailableScreen.includes('Administración aún no configurada'))
assert.ok(unavailableScreen.includes('No se usarán correos públicos'))
assert.ok(!adminPage.includes('dynamic('))
assert.ok(!usersPage.includes('fetch('))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    unavailableAdminApis: unavailableRoutes.length,
    destructivePillarOverrideRetired: true,
    publicEmailAllowlistRemoved: true,
    missingDatabaseTablesNoLongerQueried: true,
    adminPagesMakeNetworkRequests: false,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
