import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

assert.equal(process.env.A3_A4_TRANSITION_LAB,'yes')
const root=resolve(process.env.A3_A4_LAB_ROOT),appRoot=join(root,'app-runtime'),base='http://localhost:3115'
const status=JSON.parse(readFileSync(join(root,'status.json'),'utf8')),fixture=JSON.parse(readFileSync(join(root,'fixture.private.json'),'utf8'))
const write=(p,c)=>{const t=join(appRoot,p);mkdirSync(dirname(t),{recursive:true});writeFileSync(t,c)}
write('app/despega/a4/page.tsx',"import {requireJourneyModule} from '@/lib/journey/service'\nexport const dynamic='force-dynamic'\nexport default async function Page(){await requireJourneyModule('A4');return <h1>A4 ACCESS GRANTED</h1>}\n")
const requireTool=createRequire(join(process.env.A3_A4_TOOLS_ROOT,'package.json')), {chromium}=requireTool('playwright')
const output=createWriteStream(join(root,'browser.private.log'))
const server=spawn(process.execPath,[join(process.cwd(),'node_modules/next/dist/bin/next'),'dev','--hostname','localhost','--port','3115'],{cwd:appRoot,env:{...process.env,VERCEL_ENV:'preview',NEXT_PUBLIC_SUPABASE_URL:status.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:status.ANON_KEY,SUPABASE_SERVICE_ROLE_KEY:status.SERVICE_ROLE_KEY,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});server.stdout.pipe(output);server.stderr.pipe(output)
let browser
try{
 let ready=false;for(let i=0;i<120;i++){try{if((await fetch(base)).status<500){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,500))}assert.ok(ready)
 browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:390,height:844}});await context.route('**/*',r=>['localhost','127.0.0.1'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());const page=await context.newPage()
 await page.goto(base+'/auth/signin?next=/despega/a4');await page.getByLabel('Correo de prueba',{exact:true}).fill(fixture.email);await page.getByLabel('Contraseña de prueba',{exact:true}).fill(fixture.password);await page.getByRole('button',{name:'Entrar al laboratorio'}).click();await page.waitForLoadState('networkidle')
 await page.goto(base+'/despega/a4?verified=atomic-transition');await page.getByRole('heading',{name:'A4 ACCESS GRANTED'}).waitFor({state:'visible'})
 console.log('A3->A4 browser entry after atomic transition: PASS')
}finally{if(browser)await browser.close();server.kill('SIGTERM');output.end()}
