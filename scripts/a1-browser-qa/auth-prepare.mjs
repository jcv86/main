import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { closureLab } from './closure-lab.mjs'
import { assertAuthSources } from './auth-lab.mjs'

const { root, app, repo, evidence } = closureLab()
assert.ok(existsSync(join(root, 'closure-prepared.json')), 'Run the actual AppShell closure phase first')
assert.ok(!existsSync(join(root, 'auth-prepared.json')), 'Prepare real email authentication only once per disposable stack')
const copied = []
function copy(path) {
  const source = join(repo, path), target = join(app, path)
  assert.ok(existsSync(source), `Missing application source: ${path}`)
  mkdirSync(dirname(target), { recursive: true })
  cpSync(source, target)
  assert.deepEqual(readFileSync(source), readFileSync(target))
  copied.push({ path, sha256: createHash('sha256').update(readFileSync(target)).digest('hex') })
}
function copyDirectory(path) {
  for (const entry of readdirSync(join(repo, path), { withFileTypes: true })) {
    const child = `${path}/${entry.name}`
    if (entry.isDirectory()) copyDirectory(child)
    else if (entry.isFile()) copy(child)
    else throw new Error(`Unexpected source link in ${path}`)
  }
}

// This final phase retires the earlier fixture login. Every authentication page,
// handler and helper is copied byte-for-byte; there is no successful Auth stub.
for (const path of ['lib/auth', 'components/auth']) copyDirectory(path)
for (const path of [
  'app/auth/signin/page.tsx', 'app/auth/email-login/page.tsx',
  'app/api/auth/email-login/route.ts', 'app/api/auth/signout/route.ts',
  'app/api/auth/invitation/claim/route.ts', 'app/api/auth/pilot-status/route.ts',
  'app/providers.tsx', 'components/session-wrapper.tsx', 'components/layout/app-shell.tsx',
  'lib/supabase/server.ts', 'lib/supabase/client.ts', 'lib/supabase/middleware.ts',
  'lib/middleware/rate-limit.ts', 'middleware.ts', 'public/dtc-logo.png', 'public/favicon.ico',
]) copy(path)

// Read-only instrumentation lives only under RUNNER_TEMP. It observes the actual
// Provider rather than inferring its state from cookies or AppShell's getUser().
writeFileSync(join(app, 'app/auth-session-observer.tsx'), `'use client'
import { useSession } from '@/components/session-wrapper'
export function AuthSessionObserver() {
  const { user, isLoading } = useSession()
  return <span hidden data-auth-lab-session data-state={isLoading ? 'loading' : user ? 'authenticated' : 'signed_out'} data-user-id={user?.id ?? ''} />
}
`)
writeFileSync(join(app, 'app/layout.tsx'), `import './globals.css'
import './design-system.css'
import { Providers } from './providers'
import { AuthSessionObserver } from './auth-session-observer'
export const metadata = { title: 'Acceso DTC · evidencia sintética local', robots: { index: false, follow: false } }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="es-CL" className="dark" suppressHydrationWarning><body style={{ '--font-montserrat': 'Arial', '--font-lora': 'Georgia' } as React.CSSProperties}><Providers><AuthSessionObserver />{children}</Providers></body></html>
}
`)
const manifest = {
  commit: process.env.A1_SOURCE_COMMIT,
  environment: 'disposable-local-real-email-auth',
  copied,
  genuine: ['canonical sign-in and email/password pages', 'email-login and sign-out route handlers',
    'Supabase Auth password exchange and SSR cookies', 'signed invitation claim and real resolve_pilot_access SQL',
    'actual Providers, SessionWrapper, AppShell and protected journey map', 'unchanged login quota and middleware'],
  fixtures: ['four new confirmed synthetic Auth users, with no pre-created pilot membership or progress',
    'two issued invitation hashes; membership must be created by the real login flow',
    'two existing synthetic returning users from the preceding closure suite'],
  substitutions: ['root document metadata and system font loading',
    'hidden read-only useSession observer in the temporary root; no auth methods or state are changed',
    'declared email HTML503/JSON429 and sign-out HTTP503 failures per viewport; every success uses real Auth'],
  quotas: 'Each bounded case has a distinct TEST-NET-1 forwarded IP, set only by the loopback test browser. The quota case intentionally makes six login attempts. No limiter configuration is changed.',
  notVerified: ['external OAuth exchange or provider configuration', 'production/Vercel or remote Supabase',
    'complete onboarding after a new pilot enters the protected journey map',
    'legacy A4 strategic/economic background URLs return HTTP404 in this runtime and are outside the authentication proof; no market context is asserted'],
  navigation: 'Artificial URL-case changes, reloads, Back and context closure wait for both actual Provider background reads. A non-ok response settles at headers because the Provider does not consume that body; successful reads settle at requestfinished. Product login/logout navigation is untouched. Failed requests and readiness counters are recorded; all JavaScript errors remain fatal.',
  privacy: 'No cookies, invitation tokens, passwords, storageState, HAR, traces or private server logs are uploaded.',
}
assertAuthSources(manifest, app, repo)
writeFileSync(join(root, 'auth-prepared.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(evidence, 'auth-scope.json'), JSON.stringify(manifest, null, 2))
console.log('Real email-auth phase prepared: unchanged pages/APIs and a read-only session observer.')
