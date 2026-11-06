import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { closureLab } from './closure-lab.mjs'

const { root, app, repo, evidence } = closureLab()
assert.ok(!existsSync(join(root, 'closure-prepared.json')), 'Prepare the closure phase only once per disposable stack')
const copied = []
function copy(path) {
  const source = join(repo, path), target = join(app, path)
  assert.ok(existsSync(source), `Missing application source: ${path}`)
  mkdirSync(dirname(target), { recursive: true })
  cpSync(source, target)
  assert.deepEqual(readFileSync(source), readFileSync(target), `Unchanged source required: ${path}`)
  copied.push({ path, sha256: createHash('sha256').update(readFileSync(target)).digest('hex') })
}

// Refresh shared sources after the earlier minimal-shell suites have finished.
// No auth, data-access, layout, context or capture implementation is stubbed.
for (const path of ['lib', 'components', 'hooks', 'contexts']) {
  cpSync(join(repo, path), join(app, path), { recursive: true })
}
for (const path of [
  'middleware.ts', 'app/providers.tsx', 'app/design-system.css',
  'app/despega/layout.tsx', 'components/layout/app-shell.tsx',
  'components/layout/shell-breadcrumbs.tsx', 'contexts/coach-context.tsx',
  'components/session-wrapper.tsx', 'components/coach-provider-wrapper.tsx',
  'components/outcomes/outcome-response-capture-form.tsx',
  'components/outcomes/outcome-capture-history.tsx',
  'lib/journey/service.ts', 'lib/journey/flow-service.ts',
  'lib/journey/next-action.ts', 'lib/journey/next-action-service.ts',
  'components/journey/journey-flow-panel.tsx', 'components/journey/guided-next-action.tsx',
  'lib/outcomes/response-capture.ts', 'lib/outcomes/response-history.ts',
  'app/despega/recorrido/page.tsx',
  'app/despega/a1-cerebral-intro/page.tsx', 'app/despega/a1-cerebral-intro/layout.tsx',
  'app/despega/a2/layout.tsx', 'app/despega/a2/page.tsx',
  'app/despega/a2/intro/layout.tsx', 'app/despega/a2/intro/page.tsx',
  'app/despega/a3/layout.tsx', 'app/despega/a3/page.tsx',
  'app/despega/objetivo-laboral/page.tsx',
  'app/despega/a4/job-matching/opportunity-search-experience.tsx',
  'app/despega/a4/job-matching/search-intent-form.tsx',
  'app/despega/a4/job-matching/real-opportunity-results.tsx',
  'app/despega/a4/job-matching/personal-orientation.tsx',
  'app/api/outcomes/observations/route.ts', 'app/api/outcomes/a1-status/route.ts',
  'app/api/journey/module-access/route.ts', 'app/api/journey/transition/route.ts',
  'app/api/a2/progress/route.ts', 'app/api/a2/activity/route.ts',
  'app/api/a2/complete-day/route.ts', 'app/api/a2/practice-adjustments/route.ts',
  'app/api/a3/user-progress/route.ts', 'app/api/v1-analytics/route.ts',
  'app/api/gamification/global/route.ts', 'app/api/auth/signout/route.ts',
  'app/api/a4/search-intents/route.ts',
  'app/api/a4/opportunities/catalog/route.ts', 'app/api/career/objective/route.ts',
]) copy(path)
for (const stage of ['a1', 'a2', 'a3']) {
  for (const role of ['baseline', 'follow-up']) copy(`app/despega/${stage}-outcome-${role}/page.tsx`)
}

// Only root font loading/SEO/footer and the existing password login stay laboratory-specific.
// AppShell owns the sole outer main landmark; do not retain the previous lab main/header.
writeFileSync(join(app, 'app/layout.tsx'), `import './globals.css'
import './design-system.css'
import { Providers } from './providers'
export const metadata = { title: 'Cierre DTC · evidencia sintética local', robots: { index: false, follow: false } }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="es-CL" className="dark" suppressHydrationWarning><body style={{ '--font-montserrat': 'Arial', '--font-lora': 'Georgia' } as React.CSSProperties}><Providers>{children}</Providers></body></html>
}
`)
const manifest = {
  commit: process.env.A1_SOURCE_COMMIT,
  environment: 'disposable-local-supabase-and-next',
  copied,
  genuine: ['Supabase Auth password sessions, JWT and cookies', 'canonical outcome migrations and owner SELECT RLS',
    'actual observations GET/POST', 'actual app/despega/layout, AppShell, Providers and contexts',
    'six actual A1/A2/A3 capture pages', 'actual A1 intro, A2 intro/dashboard, A3 dashboard and journey map',
    'actual saved labor objective GET/POST with owner RLS and concurrent revision protection',
    'actual early labor objective page and session/pilot API; A4 catalog remains independently gated',
    'actual A2 complete-day and practice-adjustment handlers reject a pilot before canonical A2 entry'],
  fixtures: ['new synthetic Auth owners and local pilot memberships',
    'minimal supporting tables, A1/C1/C2 evidence and explicitly seeded A2/A3 milestones'],
  substitutions: ['root document/font loading and existing laboratory password form'],
  notVerified: ['external OAuth providers', 'production or Vercel deployment', 'remote migrations',
    'completion of A2/A3 training by a real participant', 'external market/AI services', 'psychometric validity'],
  privacy: 'Only synthetic screenshots and sanitized verdicts are uploaded. No cookies, storageState, HAR, traces or private server logs.',
}
writeFileSync(join(root, 'closure-prepared.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(evidence, 'closure-scope.json'), JSON.stringify(manifest, null, 2))
console.log('Closure phase prepared with unchanged capture pages, AppShell, contexts and real APIs.')
