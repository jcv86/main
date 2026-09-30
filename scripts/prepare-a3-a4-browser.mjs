import assert from 'node:assert/strict'
import { cpSync, existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
assert.equal(process.env.A3_A4_TRANSITION_LAB,'yes')
const root=resolve(process.env.A3_A4_LAB_ROOT),repo=process.cwd(),app=join(root,'app-runtime')
mkdirSync(app,{recursive:true})
for(const path of ['lib','components','hooks']) cpSync(join(repo,path),join(app,path),{recursive:true})
for(const path of ['tailwind.config.ts','postcss.config.js','postcss.config.mjs']) if(existsSync(join(repo,path))) cpSync(join(repo,path),join(app,path))
symlinkSync(join(repo,'node_modules'),join(app,'node_modules'),'dir')
const write=(p,t)=>{mkdirSync(dirname(join(app,p)),{recursive:true});writeFileSync(join(app,p),t)}
write('package.json',JSON.stringify({name:'dtc-a3-a4-lab',private:true,version:'0.0.0'}))
write('tsconfig.json',JSON.stringify({compilerOptions:{target:'ES2022',lib:['dom','dom.iterable','esnext'],allowJs:true,skipLibCheck:true,strict:false,noEmit:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'preserve',paths:{'@/*':['./*']}},include:['app/**/*.ts','app/**/*.tsx','next-env.d.ts'],exclude:['node_modules']}))
write('next.config.mjs',"export default { devIndicators: false, experimental: { cpus: 2 } }\n")
if(existsSync(join(repo,'middleware.ts'))) write('middleware.ts',readFileSync(join(repo,'middleware.ts'),'utf8'))
write('app/layout.tsx',"export default function Layout({children}:{children:React.ReactNode}){return <html lang='es'><body>{children}</body></html>}\n")
write('app/page.tsx',"export default function Page(){return <p>A3-A4 LAB READY</p>}\n")
write('app/auth/signin/page.tsx',"'use client'\nimport {useState} from 'react'\nimport {useRouter,useSearchParams} from 'next/navigation'\nimport {createClient} from '@/lib/supabase/client'\nexport default function Login(){const [email,E]=useState(''),[password,P]=useState('');const router=useRouter(),params=useSearchParams();return <form onSubmit={async e=>{e.preventDefault();const r=await createClient().auth.signInWithPassword({email,password});if(!r.error){router.replace(params.get('next')||'/despega/a4');router.refresh()}}}><label>Correo de prueba<input value={email} onChange={e=>E(e.target.value)}/></label><label>Contraseña de prueba<input type='password' value={password} onChange={e=>P(e.target.value)}/></label><button type='submit'>Entrar al laboratorio</button></form>}\n")
console.log('A3-A4 browser runtime prepared')
