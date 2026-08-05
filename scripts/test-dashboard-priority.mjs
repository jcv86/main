import fs from 'node:fs'

const dashboard = fs.readFileSync('app/despega/dashboard/page.tsx', 'utf8')

const requirements = [
  ['canonical page container', dashboard.includes('<PageContainer>')],
  ['canonical page stack', dashboard.includes('<PageStack>')],
  ['canonical page header', dashboard.includes('<PageHeader')],
  ['next action section', dashboard.includes('Tu siguiente acción')],
  ['career identity summary', dashboard.includes('Career Identity')],
  ['radar strategic summary', dashboard.includes('Radar Estratégico')],
  ['journey business logic preserved', dashboard.includes('getJourneyForCurrentUser')],
  ['canonical next path preserved', dashboard.includes('getCanonicalNextPath')],
  ['stage status preserved', dashboard.includes('const stageStatus')],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length > 0) {
  console.error('Dashboard priority contract failed:')
  for (const [name] of failures) console.error(`- ${name}`)
  process.exit(1)
}

const sourceWithoutCanonicalShadows = dashboard.replaceAll(/shadow-\[var\(--dtc-shadow-[^)]+\)\]/g, '')
const banned = [
  /<main\b/,
  /max-w-(?:5xl|6xl|7xl)\b/,
  /style=\{\{/,
  /bg-black\b/,
  /bg-purple-/,
  /shadow-(?:sm|md|lg|xl|2xl)\b/,
]

for (const pattern of banned) {
  if (pattern.test(sourceWithoutCanonicalShadows)) {
    console.error(`Dashboard priority contract failed: banned pattern ${pattern}`)
    process.exit(1)
  }
}

console.log('Dashboard priority contract passed')
