import fs from 'node:fs'

const shell = fs.readFileSync('components/layout/app-shell.tsx', 'utf8')
const layout = fs.readFileSync('app/despega/layout.tsx', 'utf8')

const requirements = [
  ['AppShell export', shell.includes('export function AppShell')],
  ['skip link', shell.includes('Saltar al contenido') && shell.includes('href="#main-content"')],
  ['main landmark', shell.includes('<main id="main-content"')],
  ['desktop sidebar', shell.includes('<aside') && shell.includes('lg:flex')],
  ['mobile dialog', shell.includes('aria-modal="true"')],
  ['accessible current route', shell.includes("aria-current={active ? 'page' : undefined}")],
  ['router replace on logout', shell.includes("router.replace('/auth/signin')")],
  ['canonical shadows', shell.includes('var(--dtc-shadow-')],
  ['layout imports AppShell', layout.includes("import { AppShell } from '@/components/layout/app-shell'")],
  ['layout renders AppShell', /<AppShell>[\s\S]*?<\/AppShell>/.test(layout)],
  ['legacy navbar removed from layout', !layout.includes('DespegaNavbar')],
]

const failures = requirements.filter(([, passed]) => !passed)
if (failures.length > 0) {
  console.error('Shell system contract failed:')
  for (const [name] of failures) console.error(`- ${name}`)
  process.exit(1)
}

const sourceWithoutCanonicalShadows = shell.replaceAll(/shadow-\[var\(--dtc-shadow-[^)]+\)\]/g, '')
const banned = [
  /style=\{\{/,
  /bg-black\b/,
  /bg-purple-/,
  /shadow-(?:sm|md|lg|xl|2xl)\b/,
]

for (const pattern of banned) {
  if (pattern.test(sourceWithoutCanonicalShadows)) {
    console.error(`Shell system contract failed: banned pattern ${pattern}`)
    process.exit(1)
  }
}

console.log('Shell system contract passed')
