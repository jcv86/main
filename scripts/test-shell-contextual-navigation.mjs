import fs from 'node:fs'

const shell = fs.readFileSync('components/layout/app-shell.tsx', 'utf8')

const requirements = [
  ['route contexts', shell.includes('const routeContexts') && shell.includes('getRouteContext')],
  ['contextual header', shell.includes('routeContext.eyebrow') && shell.includes('routeContext.title')],
  ['escape closes drawer', shell.includes("event.key === 'Escape'")],
  ['body scroll lock', shell.includes("document.body.style.overflow = 'hidden'")],
  ['focus restoration', shell.includes('menuButtonRef.current?.focus()')],
  ['drawer initial focus', shell.includes('closeButtonRef.current?.focus()')],
  ['aria controls', shell.includes('aria-controls="mobile-navigation"')],
  ['journey state', shell.includes('currentJourneyIndex') && shell.includes('completed')],
  ['active state label', shell.includes("'En progreso'")],
  ['pending state label', shell.includes("'Pendiente'")],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length > 0) {
  console.error('Shell contextual navigation contract failed:')
  for (const [name] of failures) console.error(`- ${name}`)
  process.exit(1)
}

const sourceWithoutCanonicalShadows = shell.replaceAll(/shadow-\[var\(--dtc-shadow-[^)]+\)\]/g, '')
const banned = [/style=\{\{/, /bg-black\b/, /bg-purple-/, /shadow-(?:sm|md|lg|xl|2xl)\b/, /\bLora\b/]
for (const pattern of banned) {
  if (pattern.test(sourceWithoutCanonicalShadows)) {
    console.error(`Shell contextual navigation contract failed: banned pattern ${pattern}`)
    process.exit(1)
  }
}

console.log('Shell contextual navigation contract passed')
