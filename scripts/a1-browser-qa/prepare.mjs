import { cpSync, existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import assert from 'node:assert/strict'

const root = resolve(process.env.A1_LAB_ROOT || '')
assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Explicit disposable lab opt-in required')
assert.ok(root.startsWith(resolve(process.env.RUNNER_TEMP || tmpdir()) + '/'), 'Lab must be in temporary storage')
assert.ok(!existsSync(root), 'Never overwrite an existing lab')
const repo = process.cwd(), app = join(root, 'app-runtime')
mkdirSync(app, { recursive: true }); mkdirSync(join(root, 'stack')); mkdirSync(join(root, 'evidence'))
for (const path of ['lib', 'components', 'hooks']) cpSync(join(repo, path), join(app, path), { recursive: true })
for (const path of ['tailwind.config.ts', 'postcss.config.js', 'postcss.config.mjs']) if (existsSync(join(repo, path))) cpSync(join(repo, path), join(app, path))
symlinkSync(join(repo, 'node_modules'), join(app, 'node_modules'), 'dir')
const write = (path, text) => { mkdirSync(dirname(join(app, path)), { recursive: true }); writeFileSync(join(app, path), text) }
write('package.json', JSON.stringify({ name: 'dtc-isolated-a1-qa', private: true, version: '0.0.0' }))
write('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true, strict: false, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', paths: { '@/*': ['./*'] } }, include: ['app/**/*.ts', 'app/**/*.tsx', 'next-env.d.ts'], exclude: ['node_modules'] }))
write('next.config.mjs', `export default { devIndicators: false, experimental: { cpus: 2 } }\n`)
write('postcss.config.mjs', `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }\n`)
write('app/globals.css', readFileSync(join(repo, 'app/globals.css'), 'utf8'))
write('app/layout.tsx', `import './globals.css'
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="es" className="dark"><body style={{'--font-montserrat':'Arial','--font-lora':'Georgia'} as React.CSSProperties}><header data-lab-chrome className="border-b p-4 text-sm">LABORATORIO SINTÉTICO · componentes reales, no producción<nav className="mt-2 flex flex-wrap gap-4"><a href="/despega/a1-report">A1</a><a href="/despega/career-identity">Identidad profesional</a><a href="/despega/settings">Configuración</a><a href="/login">Acceso de laboratorio</a></nav></header><main id="main-content"><div className="mx-auto max-w-7xl p-4">{children}</div></main></body></html> }
`)
write('app/page.tsx', `export default function Page(){return <p>Laboratorio A1 listo</p>}\n`)
write('app/login/page.tsx', `'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {createClient} from '@/lib/supabase/client'
export default function Login(){const [email,E]=useState(''),[password,P]=useState(''),[error,X]=useState('');const router=useRouter();return <form className="mx-auto max-w-md space-y-4 py-8" onSubmit={async e=>{e.preventDefault();const result=await createClient().auth.signInWithPassword({email,password});if(result.error){X('No se pudo iniciar la sesión');return}router.replace('/despega/a1-report');router.refresh()}}><h1 className="text-2xl">Acceso sintético de laboratorio</h1><label className="block">Correo de prueba<input type="email" value={email} onChange={e=>E(e.target.value)} className="block border p-2 text-black"/></label><label className="block">Contraseña de prueba<input type="password" value={password} onChange={e=>P(e.target.value)} className="block border p-2 text-black"/></label><button type="submit" className="border p-3">Entrar al laboratorio</button><p role="status">{error}</p></form>}
`)
write('app/despega/a1-report/page.tsx', `import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {loadA1Report} from '@/lib/reports/user-report-data'
import {A1CanonicalReport} from '@/components/a1-canonical-report'
export const dynamic='force-dynamic'
export default async function Page(){const s=await createClient();const {data:{user},error}=await s.auth.getUser();if(error||!user)redirect('/login');const report=await loadA1Report(user.id);return report?<A1CanonicalReport report={report}/>:<h1>Aún no hay una evaluación de laboratorio</h1>}
`)
write('app/despega/career-identity/page.tsx', `import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {loadA1Report} from '@/lib/reports/user-report-data'
import {SupabaseCareerService} from '@/lib/career/supabase-career-service'
import {IdentityOverview} from '@/components/career/identity-overview'
export const dynamic='force-dynamic'
export default async function Page(){const s=await createClient();const {data:{user},error}=await s.auth.getUser();if(error||!user)redirect('/login');const service=new SupabaseCareerService(s);const identity=await service.getIdentity(user.id);const context=identity?await service.getContext(user.id):null;return <IdentityOverview a1={await loadA1Report(user.id)} context={context}/>}
`)
for (const path of ['app/api/a1-cerebral-save/route.ts', 'app/api/a1/clarifications/route.ts']) write(path, readFileSync(join(repo, path), 'utf8'))
for (const path of ['app/api/preferences/route.ts', 'app/despega/settings/page.tsx']) write(path, readFileSync(join(repo, path), 'utf8'))
writeFileSync(join(root, 'evidence/scope.json'), JSON.stringify({ commit: process.env.A1_SOURCE_COMMIT, environment: 'disposable-local-supabase-and-next', genuine: ['Supabase Auth', 'JWT', 'PostgREST', 'PostgreSQL', 'actual A1 save, clarification and preferences route exports', 'actual report, identity and settings components', 'Chromium at 1440 and 390x844'], substituted: ['minimal laboratory page shell and login form', 'C1/C2 capture seeded as synthetic fixtures', 'pilot admission function is a lab allowlist fixture', 'system fallback font, not production font loading'], notVerified: ['production OAuth provider or Vercel preview session', 'full production middleware/journey/onboarding', 'A2-A4 integral route', 'psychometric validity'] }, null, 2))
console.log('Isolated A1 browser application prepared; no production routes or environment copied.')
