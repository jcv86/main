import fs from 'node:fs'

const breadcrumbs = fs.readFileSync('components/layout/shell-breadcrumbs.tsx', 'utf8')
const pageFoundation = fs.readFileSync('components/layout/page-foundation.tsx', 'utf8')
const asyncState = fs.readFileSync('components/layout/async-state.tsx', 'utf8')
const layout = fs.readFileSync('app/despega/layout.tsx', 'utf8')

const requirements = [
  ['breadcrumb navigation landmark', breadcrumbs.includes('aria-label="Ruta de navegación"')],
  ['breadcrumb current page', breadcrumbs.includes('aria-current="page"')],
  ['breadcrumb route labels', breadcrumbs.includes('routeLabels')],
  ['page container', pageFoundation.includes('export function PageContainer')],
  ['page header', pageFoundation.includes('export function PageHeader')],
  ['page section', pageFoundation.includes('export function PageSection')],
  ['loading state', asyncState.includes('export function LoadingState')],
  ['empty state', asyncState.includes('export function EmptyState')],
  ['error state', asyncState.includes('export function ErrorState')],
  ['offline state', asyncState.includes('export function OfflineState')],
  ['retry support', asyncState.includes('onRetry')],
  ['breadcrumbs integrated', layout.includes('<ShellBreadcrumbs />')],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length > 0) {
  console.error('Shell page foundation contract failed:')
  for (const [name] of failures) console.error(`- ${name}`)
  process.exit(1)
}

const source = `${breadcrumbs}\n${pageFoundation}\n${asyncState}`
const sourceWithoutCanonicalShadows = source.replaceAll(/shadow-\[var\(--dtc-shadow-[^)]+\)\]/g, '')
const banned = [/style=\{\{/, /bg-black\b/, /bg-purple-/, /shadow-(?:sm|md|lg|xl|2xl)\b/, /\bLora\b/]
for (const pattern of banned) {
  if (pattern.test(sourceWithoutCanonicalShadows)) {
    console.error(`Shell page foundation contract failed: banned pattern ${pattern}`)
    process.exit(1)
  }
}

console.log('Shell page foundation contract passed')
