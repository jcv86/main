import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const intro = readFileSync(join(root, 'app/despega/a4-intro/page.tsx'), 'utf8')
const shell = readFileSync(join(root, 'components/layout/app-shell.tsx'), 'utf8')
const navbar = readFileSync(join(root, 'components/despega-navbar.tsx'), 'utf8')

assert.match(intro, /redirect\(['"]\/despega\/a4['"]\)/, 'The legacy A4 intro must redirect to the canonical guarded route.')
assert.doesNotMatch(intro, /createClient|localStorage|demo_user|upsert/, 'The legacy alias must not authenticate or write from the browser.')
assert.doesNotMatch(intro, /Coach IA 24\/7|salarios|posiciones abiertas|rastrea el mercado/, 'Unsupported legacy promises must not remain reachable.')
assert.match(shell, /label: 'A4 · Radar Estratégico',[\s\S]*?href: '\/despega\/a4'/, 'The application shell must link directly to canonical A4.')
assert.match(navbar, /label: 'Radar Estratégico', href: '\/despega\/a4'/, 'The legacy navbar must link directly to canonical A4.')

console.log('A4 canonical guarded entry contract passed.')
