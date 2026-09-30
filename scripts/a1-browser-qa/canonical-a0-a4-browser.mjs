import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

assert.equal(process.env.A1_BROWSER_LAB, 'yes')
const root=resolve(process.env.A1_LAB_ROOT),appRoot=join(root,'app-runtime'),base='http://localhost:3114'
const status=JSON.parse(readFileSync(join(root,'status.json'),'utf8')),fixtures=JSON.parse(readFileSync(join(root,'fixtures.private.json'),'utf8'))
assert.ok(['127.0.0.1','localhost'].includes(new URL(status.API_URL).hostname))
const write=(path,content)=>{const target=join(appRoot,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,content)}
write('app/despega/page.tsx',"import {redirect} from 'next/navigation'\nimport {createClient} from '@/lib/supabase/server'\nimport {getJourneyForCurrentUser} from '@/lib/journey/service'\nimport {loadJourneyFlow} from '@/lib/journey/flow-service'\nexport const dynamic='force-dynamic'\nexport default async function Page(){const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/auth/signin');const journey=await getJourneyForCurrentUser();if(!journey)redirect('/auth/signin');const flow=await loadJourneyFlow(journey);return <main><h1>JOURNEY NEXT</h1><a data-next href={flow.next.href}>{flow.next.label}</a><p data-next-title>{flow.next.title}</p></main>}\n")
const requireTool=createRequire(join(process.env.A1_TOOLS_ROOT,'package.json')), {chromium}=requireTool('playwright')
const output=createWriteStream(join(root,'canonical-a0-a4-server.private.log'))
const server=spawn(process.execPath,[join(process.cwd(),'node_modules/next/dist/bin/next'),'dev','--hostname','localhost','--port','3114'],{cwd:appRoot,env:{...process.env,VERCEL_ENV:'preview',NEXT_PUBLIC_SUPABASE_URL:status.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:status.ANON_KEY,SUPABASE_SERVICE_ROLE_KEY:status.SERVICE_ROLE_KEY,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});server.stdout.pipe(output);server.stderr.pipe(output)
async function login(page,user){await page.goto(base+'/auth/signin?next=/despega');await page.getByLabel('Correo de prueba',{exact:true}).fill(user.email);await page.getByLabel('Contraseña de prueba',{exact:true}).fill(fixtures.password);await page.getByRole('button',{name:'Entrar al laboratorio'}).click();await page.waitForURL('**/despega')}
let browser
try{let ready=false;for(let i=0;i<120;i++){if(server.exitCode!==null)throw new Error('server stopped');try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,500))}assert.ok(ready)
browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:390,height:844}});await context.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());const page=await context.newPage();const user=fixtures.users.find(u=>u.label==='beta');assert.ok(user);await login(page,user);const href=await page.locator('[data-next]').getAttribute('href');assert.ok(typeof href==='string'&&href.startsWith('/despega/'));writeFileSync(join(root,'evidence/canonical-a0-a4-results.json'),JSON.stringify({commit:process.env.A1_SOURCE_COMMIT,viewport:'390x844',auth:'real local Supabase Auth',journeyNext:href,network:'localhost only',verdict:'PASS'},null,2));console.log('Canonical A0-A4 browser foundation: PASS',href)}
catch(error){process.exitCode=1;writeFileSync(join(root,'evidence/canonical-a0-a4-results.json'),JSON.stringify({commit:process.env.A1_SOURCE_COMMIT,verdict:'FAIL',message:error instanceof Error?error.message:'unknown'},null,2));console.error(error)}
finally{if(browser)await browser.close();server.kill('SIGTERM');output.end()}
