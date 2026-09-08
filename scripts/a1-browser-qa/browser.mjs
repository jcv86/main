import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, createWriteStream, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'

assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Only an explicitly disposable lab may run')
const root=resolve(process.env.A1_LAB_ROOT), base='http://localhost:3107'
const status=JSON.parse(readFileSync(join(root,'status.json'),'utf8'))
const fixtures=JSON.parse(readFileSync(join(root,'fixtures.private.json'),'utf8'))
assert.ok(['127.0.0.1','localhost'].includes(new URL(status.API_URL).hostname),'Remote Supabase forbidden')
const requireTool=createRequire(join(process.env.A1_TOOLS_ROOT,'package.json'))
const {chromium}=requireTool('playwright')
const {default:AxeBuilder}=requireTool('@axe-core/playwright')
const requireApp=createRequire(join(process.cwd(),'package.json'))
const {createClient}=requireApp('@supabase/supabase-js')
const evidence=join(root,'evidence'), steps=[], visualFailures=[], pageErrors=[]
const redact=value=>{let text=String(value);for(const secret of [fixtures.password,status.ANON_KEY,status.SERVICE_ROLE_KEY,status.DB_URL])if(secret)text=text.split(secret).join('[REDACTED]');return text.replace(/\u001b\[[0-9;]*m/g,'')}
const serverLog=join(root,'server.private.log'), output=createWriteStream(serverLog)
const server=spawn(process.execPath,[join(process.cwd(),'node_modules/next/dist/bin/next'),'dev','--hostname','localhost','--port','3107'],{
 cwd:join(root,'app-runtime'), env:{...process.env,NEXT_PUBLIC_SUPABASE_URL:status.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:status.ANON_KEY,SUPABASE_SERVICE_ROLE_KEY:status.SERVICE_ROLE_KEY,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']})
server.stdout.pipe(output);server.stderr.pipe(output)
let browser,page
async function step(name,run){await run();steps.push({name,status:'PASS'});console.log(`A1 browser: ${name}: PASS`)}
async function context(){const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await c.route('**/*',route=>{const u=new URL(route.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)?route.continue():route.abort()});c.on('page',p=>p.on('pageerror',error=>pageErrors.push(redact(error.message))));return c}
async function login(p,label,next='/despega/a1-report'){const u=fixtures.users.find(u=>u.label===label);await p.goto(base+'/auth/signin?next='+encodeURIComponent(next));await p.getByLabel('Correo de prueba',{exact:true}).fill(u.email);await p.getByLabel('Contraseña de prueba',{exact:true}).fill(fixtures.password);await p.getByRole('button',{name:'Entrar al laboratorio'}).click();await p.waitForURL('**'+next);await p.waitForLoadState('networkidle');return u}
async function browserSave(p,responses){return p.evaluate(async responses=>{const r=await fetch('/api/a1-cerebral-save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({responses})});return {status:r.status,body:await r.json()}},responses)}
async function clarificationSave(p,expected=200){const wait=p.waitForResponse(r=>new URL(r.url()).pathname==='/api/a1/clarifications'&&r.request().method()==='PUT');await p.getByRole('button',{name:'Guardar mis matices',exact:true}).click();const result=await wait;if(result.status()!==expected)throw new Error(JSON.stringify({status:result.status(),expected,body:await result.text(),origin:result.request().headers().origin,requestOrigin:result.headers()['x-lab-request-origin'],headerOrigin:result.headers()['x-lab-header-origin']}));await p.waitForTimeout(1000)}
async function visibleText(p,text){await p.getByText(text,{exact:false}).first().waitFor({state:'visible'})}
async function visual(p,name,width){
 const height=width===390?844:1000
 await p.setViewportSize({width,height});await p.waitForTimeout(350);await p.screenshot({path:join(evidence,name+'.png'),fullPage:true})
 const bounds=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,radios:[...document.querySelectorAll('[data-dtc-report] input[type="radio"]')].map(r=>({width:r.getBoundingClientRect().width,labelWidth:r.closest('label')?.getBoundingClientRect().width}))}))
 if(bounds.scroll>bounds.width+1)visualFailures.push({name,issue:'horizontal_overflow',...bounds})
 if(bounds.radios.some(r=>r.width>32||r.width<14))visualFailures.push({name,issue:'choice_control_size',radios:bounds.radios})
 const scan=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
 const violations=scan.violations.filter(v=>v.impact==='serious'||v.impact==='critical').map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))}))
 if(violations.length)visualFailures.push({name,issue:'accessibility',violations})
 steps.push({name:'visual_'+name,status:visualFailures.some(v=>v.name===name)?'FAIL':'PASS',width:bounds.width,radioCount:bounds.radios.length})
}
try{
 let ready=false;for(let i=0;i<120;i++){if(server.exitCode!==null)throw new Error('Lab server stopped before readiness');try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,1000))}assert.ok(ready,'Lab Next server did not become ready')
 browser=await chromium.launch({headless:true})
 const c=await context();page=await c.newPage()
 await step('unauthenticated_route_preserves_destination_and_rejects_save',async()=>{await page.goto(base+'/despega/a1-report');await page.waitForURL('**/auth/signin?next=%2Fdespega%2Fa1-report');const r=await browserSave(page,fixtures.ordinary);assert.equal(r.status,401)})
 await step('real_local_auth_cookie_login',async()=>{await login(page,'alpha');await visibleText(page,'Aún no hay una evaluación');assert.ok((await c.cookies()).some(cookie=>cookie.name.includes('auth-token')))})
 await step('actual_http_save_through_postgrest',async()=>{const r=await browserSave(page,fixtures.ordinary);assert.equal(r.status,200,JSON.stringify(r.body));assert.equal(r.body.success,true);assert.deepEqual(r.body.profile,{D:20,I:8,S:-14,C:-14});await page.reload();await visibleText(page,'Más allá de una combinación de letras');await visibleText(page,'Objetivo posterior alpha')})
 const older=await c.newPage();await older.goto(base+'/despega/a1-report');await visibleText(older,'Añade los matices')
 await step('clarification_save_and_reload',async()=>{await page.getByLabel('No me representa',{exact:true}).check();await clarificationSave(page);await visibleText(page,'Tu perspectiva sobre la lectura:');await page.reload();await visibleText(page,'Tu perspectiva sobre la lectura:');assert.equal(await page.getByLabel('No me representa',{exact:true}).isChecked(),true)})
 await step('stale_second_tab_conflict_and_recovery',async()=>{await older.getByLabel('Me representa',{exact:true}).check();await clarificationSave(older,409);await visibleText(older,'El informe cambió');assert.equal(await older.getByLabel('Me representa',{exact:true}).isChecked(),true);await older.getByRole('button',{name:'Recargar versión actual'}).click();await older.waitForTimeout(1500);assert.equal(await older.getByLabel('No me representa',{exact:true}).isChecked(),true);await older.close()})
 await step('clarification_withdrawal',async()=>{const wait=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/a1/clarifications'&&r.request().method()==='PUT');await page.getByRole('button',{name:'Retirar mis aclaraciones'}).click();assert.equal((await wait).status(),200);await page.reload();assert.equal(await page.getByRole('heading',{name:'Los matices que tú añadiste',exact:true}).count(),0)})
 await step('clarification_partial_optional_selection',async()=>{await page.locator('input[name^="clarification-"]').first().check();await page.getByLabel('Depende del contexto',{exact:true}).check();await clarificationSave(page);await page.reload();await visibleText(page,'Los matices que tú añadiste')})
 await visual(page,'a1-desktop',1440);await visual(page,'a1-mobile',390)
 await page.setViewportSize({width:1440,height:1000})
 await step('print_includes_evidence_and_restores_disclosures',async()=>{
  await page.locator('details').first().evaluate(el=>el.open=true)
  const originallyOpen=await page.locator('details[open]').count()
  await page.evaluate(()=>window.addEventListener('beforeprint',()=>{document.documentElement.dataset.qaPrintOpen=String(document.querySelectorAll('[data-dtc-report] details[open]').length)}))
  await page.emulateMedia({media:'print'})
  assert.equal(await page.locator('[data-lab-chrome]').isVisible(),false);assert.equal(await page.locator('#a1-clarifications-heading').isVisible(),false)
  await page.pdf({path:join(evidence,'a1-synthetic.pdf'),format:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="width:100%;text-align:center;font-size:8px;color:#555">QA SINTÉTICO · NO PRODUCCIÓN · <span class="pageNumber"></span> / <span class="totalPages"></span></div>'})
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.qaPrintOpen),'6')
  assert.equal(await page.locator('details[open]').count(),originallyOpen)
  await page.emulateMedia({media:'screen'})
 })
 await step('identity_uses_same_source_without_disc_skills',async()=>{await page.goto(base+'/despega/career-identity');await visibleText(page,'Lo que sabes de ti, con su evidencia');await visibleText(page,'Objetivo posterior alpha');await visibleText(page,'Todavía no hay registros de habilidades');assert.ok(!(await page.locator('body').innerText()).includes('Objetivo posterior beta'))})
 await visual(page,'identity-desktop',1440);await visual(page,'identity-mobile',390)
 await step('preferences_real_http_save_reload_and_restore',async()=>{
  await page.goto(base+'/despega/settings');await visibleText(page,'Preferencias de perfil')
  const weekly=page.getByRole('checkbox',{name:'Resumen semanal de insights'})
  assert.equal(await weekly.isChecked(),true);await weekly.uncheck()
  let wait=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/preferences'&&r.request().method()==='POST')
  await page.getByRole('button',{name:'Guardar Cambios'}).click();assert.equal((await wait).status(),200)
  await page.reload();assert.equal(await weekly.isChecked(),false)
  await weekly.check();wait=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/preferences'&&r.request().method()==='POST')
  await page.getByRole('button',{name:'Guardar Cambios'}).click();assert.equal((await wait).status(),200)
  await page.reload();assert.equal(await weekly.isChecked(),true)
 })
 await visual(page,'settings-desktop',1440);await visual(page,'settings-mobile-390x844',390)
 await step('real_jwt_postgrest_cross_owner_isolation',async()=>{const beta=fixtures.users.find(u=>u.label==='beta'),alpha=fixtures.users.find(u=>u.label==='alpha');const other=createClient(status.API_URL,status.ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});const auth=await other.auth.signInWithPassword({email:beta.email,password:fixtures.password});assert.ifError(auth.error);for(const table of ['a1_cerebral_assessment','canon_conozcamonos_1_responses','canon_conozcamonos_2_responses','user_preferences']){const result=await other.from(table).select('id').eq('user_id',alpha.id);assert.ifError(result.error);assert.deepEqual(result.data,[])}const r=await other.from('canon_conozcamonos_2_responses').update({responses:{forged:true}}).eq('user_id',alpha.id).select('id');assert.ifError(r.error);assert.deepEqual(r.data,[]);const preferences=await other.from('user_preferences').update({theme:'light'}).eq('user_id',alpha.id).select('id');assert.ifError(preferences.error);assert.deepEqual(preferences.data,[]);await other.auth.signOut()})
 await step('preferences_without_cookie_are_rejected',async()=>{const anonymousContext=await context(),anonymous=await anonymousContext.newPage();await anonymous.goto(base);const response=await anonymous.evaluate(async()=>{const r=await fetch('/api/preferences');return r.status});assert.equal(response,401);await anonymousContext.close()})
 await step('session_cookie_removed_is_rejected',async()=>{await page.goto(base+'/despega/a1-report');await visibleText(page,'Más allá de una combinación de letras');await c.clearCookies();const r=await page.evaluate(async()=>{const response=await fetch('/api/a1/clarifications',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({})});return response.status});assert.equal(r,401);await page.reload();await page.waitForURL('**/auth/signin?next=%2Fdespega%2Fa1-report')})
 const emptyContext=await context(),empty=await emptyContext.newPage();await login(empty,'empty');await empty.goto(base+'/despega/career-identity');await visibleText(empty,'Sin evaluación disponible');await visual(empty,'identity-empty-mobile',390);await emptyContext.close()
 const tiedContext=await context(),tied=await tiedContext.newPage();await login(tied,'tied');const tieSave=await browserSave(tied,fixtures.tied);assert.equal(tieSave.status,200);await tied.reload();await visibleText(tied,'Hay más de una lectura posible del patrón');await visual(tied,'a1-tied-mobile',390);await tiedContext.close()
 await step('no_browser_javascript_exceptions',async()=>assert.deepEqual(pageErrors,[]))
 if(visualFailures.length){console.error('Visual failures: '+redact(JSON.stringify(visualFailures)));throw new Error('Visual or accessibility assertions failed; inspect sanitized evidence')}
 console.log(`A1 browser laboratory: PASS (${steps.length} recorded checks; real local Auth/JWT/PostgREST and actual modules; production journey not tested)`)
}catch(error){steps.push({name:'suite',status:'FAIL',message:redact(error instanceof Error?error.message:error)});if(page)await page.screenshot({path:join(evidence,'failure.png'),fullPage:true}).catch(()=>{});process.exitCode=1;console.error('A1 browser laboratory failed; see sanitized artifact.')}
finally{
 if(browser)await browser.close();server.kill('SIGTERM');output.end()
 writeFileSync(join(evidence,'results.json'),JSON.stringify({commit:process.env.A1_SOURCE_COMMIT,scope:'real local Auth/JWT/PostgREST, actual route exports and components in a minimal lab; not production E2E',steps,visualFailures,pageErrors,verdict:process.exitCode?'FAIL':'PASS',completedAt:new Date().toISOString()},null,2))
 if(process.exitCode&&existsSync(serverLog))writeFileSync(join(evidence,'server-tail.sanitized.txt'),redact(readFileSync(serverLog,'utf8').split('\n').slice(-100).join('\n')))
}
