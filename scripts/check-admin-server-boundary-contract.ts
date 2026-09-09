import assert from 'node:assert/strict'
import fs from 'node:fs'

const read = (path: string) => fs.readFileSync(path, 'utf8')
const layout = read('app/admin/layout.tsx')
const guard = read('lib/auth/require-superadmin.ts')
const knowledgeRoute = read('app/api/admin/knowledge-base/route.ts')
const dashboardRoute = read('app/api/admin/dashboard/route.ts')
const browserReaders = [
  read('app/admin/knowledge-base/page.tsx'),
  read('app/admin/dashboard/page.tsx'),
  read('app/admin/progress-dashboard/page.tsx'),
  read('components/admin-dashboard.tsx'),
  read('components/admin-user-management.tsx'),
]

assert.match(layout, /await requireSuperadminPage\('\/admin'\)/)
assert.doesNotMatch(layout, /['"]use client['"]/) 
assert.match(guard, /role\?\.role !== 'superadmin'/)
assert.match(guard, /auth\.getUser\(\)/)
assert.match(guard, /import 'server-only'/)
for (const route of [knowledgeRoute, dashboardRoute]) {
  assert.match(route, /getSuperadminUser\(\)/)
  assert.match(route, /status: 403/)
  assert.match(route, /private, no-store, max-age=0/)
  assert.match(route, /createAdminClient\(\)/)
}
for (const reader of browserReaders) {
  assert.doesNotMatch(reader, /from ['"]@\/lib\/supabase\/client['"]/) 
}

console.log('Admin server boundary contract passed')
