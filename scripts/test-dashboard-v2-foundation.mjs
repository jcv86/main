import fs from 'node:fs'

const source = fs.readFileSync('app/despega/dashboard/page.tsx', 'utf8')

const requirements = [
  ['uses canonical page container', source.includes('<PageContainer>')],
  ['uses canonical page header', source.includes('<PageHeader')],
  ['narrative next action', source.includes('Siguiente acción') && source.includes('continueAction.title')],
  ['evolution summary', source.includes('Tu evolución, de un vistazo')],
  ['career identity summary', source.includes('Career Identity') && source.includes('En evolución')],
  ['journey stages preserved', source.includes('PRODUCT_STAGE_ORDER.map')],
  ['canonical next path preserved', source.includes('getCanonicalNextPath(profile)')],
  ['radar access preserved', source.includes('access.a4') && source.includes('Abrir Radar')],
  ['route actions preserved', source.includes('continueAction.href')],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length > 0) {
  console.error('Dashboard v2 foundation contract failed:')
  for (const [name] of failures) console.error(`- ${name}`)
  process.exit(1)
}

const sourceWithoutCanonicalShadows = source.replaceAll(/shadow-\[var\(--dtc-shadow-[^)]+\)\]/g, '')
const banned = [
  /style=\{\{/,
  /bg-black\b/,
  /bg-purple-/,
  /shadow-(?:sm|md|lg|xl|2xl)\b/,
  /\bLora\b/,
  /<main\b/,
]

for (const pattern of banned) {
  if (pattern.test(sourceWithoutCanonicalShadows)) {
    console.error(`Dashboard v2 foundation contract failed: banned pattern ${pattern}`)
    process.exit(1)
  }
}

console.log('Dashboard v2 foundation contract passed')
