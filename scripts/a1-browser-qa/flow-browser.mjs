import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,createWriteStream} from 'node:fs'
import {join,resolve} from 'node:path'
import {createRequire} from 'node:module'
import {spawn} from 'node:child_process'

assert.equal(process.env.A1_BROWSER_LAB,'yes')
const root=resolve(process.env.A1_LAB_ROOT),base='http://localhost:3107'
const status=JSON.parse(readFileSync(join(root,'status.json'),'utf8'))
assert.ok(['localhost','127.0.0.1'].includes(new URL(status.API_URL).hostname),'Remote projects forbidden')
const fixture=JSON.parse(readFileSync(join(root,'fixtures.private.json'),'utf8'))
const user=fixture.users.find(u=>u.label==='alpha')
const tools=createRequire(join(process.env.A1_TOOLS_ROOT,'package.json'))
const app=createRequire(join(process.cwd(),'package.json'))
const {chromium}=tools('playwright'),{default:AxeBuilder}=tools('@axe-core/playwright'),{createClient}=app('@supabase/supabase-js')
const steps=[],violations=[],errors=[],evidence=join(root,'evidence')
const log=createWriteStream(join(root,'flow-server.private.log'))
const server=spawn(process.execPath,[join(process.cwd(),'node_modules/next/dist/bin/next'),'dev','--hostname','localhost','--port','3107'],{cwd:join(root,'app-runtime'),env:{...process.env,NEXT_PUBLIC_SUPABASE_URL:status.API_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY:status.ANON_KEY,SUPABASE_SERVICE_ROLE_KEY:status.SERVICE_ROLE_KEY,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']})
server.stdout.pipe(log);server.stderr.pipe(log)
let browser,page
const record=(name)=>{steps.push({name,status:'PASS'});console.log(`Journey browser: ${name}: PASS`)}
try{
 let ready=false;for(let i=0;i<90;i++){try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,1000))}assert.ok(ready)
 browser=await chromium.launch({headless:true})
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
 await context.route('**/*',route=>['localhost','127.0.0.1'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort())
 page=await context.newPage();page.on('pageerror',error=>errors.push(error.name))
 await page.goto(base+'/despega/recorrido?source=resume');await page.waitForURL('**/auth/signin?next=%2Fdespega%2Frecorrido');record('anonymous_map_redirect_preserves_destination')
 await page.getByLabel('Correo de prueba',{exact:true}).fill(user.email);await page.getByLabel('Contraseña de prueba',{exact:true}).fill(fixture.password);await page.getByRole('button',{name:'Entrar al laboratorio'}).click()
 await page.waitForURL('**/despega/recorrido');record('authenticated_return_to_requested_route')
 await page.goto(base+'/despega/a1-report')
 await page.getByRole('heading',{name:'Más allá de una combinación de letras'}).waitFor()
 await page.setViewportSize({width:390,height:844})
 const transition=page.getByRole('button',{name:'Continuar a la introducción de Tu Ruta',exact:true})
 await transition.scrollIntoViewIfNeeded()
 const size=await transition.evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth,height:el.getBoundingClientRect().height}))
 assert.ok(size.scroll<=size.client+1&&size.height>=44,JSON.stringify(size))
 await page.screenshot({path:join(evidence,'a1-mobile-transition-390x844.png')});record('report_transition_label_390x844_not_clipped')
 await page.goto(base+'/despega/recorrido');await page.getByRole('heading',{name:'Tu siguiente paso tiene contexto'}).waitFor()
 assert.equal(await page.locator('[data-next-step]').getAttribute('href'),'/despega/a3/career-mirror')
 assert.equal(await page.locator('[data-stage-id]').count(),4)
 assert.ok((await page.locator('[data-stage-id="A2"]').innerText()).includes('6/30'))
 assert.equal(await page.locator('[data-stage-id="A4"] a').count(),0);record('day7_checkpoint_real_owner_scoped_loader')
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:1000});await page.waitForTimeout(250)
  const bounds=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(bounds.scroll<=bounds.width+1,JSON.stringify(bounds))
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  const severe=result.violations.filter(v=>v.impact==='serious'||v.impact==='critical')
  violations.push(...severe.map(v=>({width,id:v.id,description:v.description,targets:v.nodes.map(n=>n.target)})))
  await page.screenshot({path:join(evidence,`flow-${width}.png`),fullPage:true})
  assert.equal(severe.length,0,`Flow accessibility failed at ${width}`);record(`map_${width}_overflow_accessibility`)
 }
 // The lab seeds progress sources through its explicit owner policies; this is not the production completion writer.
 const scoped=createClient(status.API_URL,status.ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
 assert.ifError((await scoped.auth.signInWithPassword({email:user.email,password:fixture.password})).error)
 assert.ifError((await scoped.from('a2_user_task_completions').insert({user_id:user.id,day:1,completed_at:new Date().toISOString()})).error)
 await page.reload();assert.ok((await page.locator('[data-stage-id="A2"]').innerText()).includes('6/30'));record('duplicate_completion_not_double_counted')
 assert.ifError((await scoped.from('a3_user_progress').update({completed_module_ids:['career-mirror']}).eq('user_id',user.id)).error)
 await page.reload();assert.equal(await page.locator('[data-next-step]').getAttribute('href'),'/despega/a3');record('checkpoint_source_change_updates_next_action')
 assert.ifError((await scoped.from('a3_route_progression').update({route_completed_at:'2026-09-07T12:00:00'}).eq('user_id',user.id)).error)
 await page.reload();assert.equal(await page.locator('[data-stage-id="A4"] a').count(),0);record('closure_without_access_does_not_offer_radar')
 const signout=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/auth/signout'&&r.request().method()==='POST')
 await page.getByRole('button',{name:'Cerrar sesión de laboratorio'}).click();assert.equal((await signout).status(),303);await page.waitForURL('**/auth/signin');record('real_signout_route_clears_session')
 await page.goBack();await page.waitForTimeout(500);assert.ok(new URL(page.url()).pathname==='/auth/signin');assert.equal(await page.getByRole('heading',{name:'Tu siguiente paso tiene contexto'}).count(),0);record('browser_back_does_not_restore_protected_content')
 assert.deepEqual(errors,[]);record('no_javascript_exceptions')
}catch(error){process.exitCode=1;steps.push({name:'suite',status:'FAIL',message:String(error instanceof Error?error.message:'unknown').split(fixture.password).join('[REDACTED]')});if(page)await page.screenshot({path:join(evidence,'flow-failure.png'),fullPage:true}).catch(()=>{})}
finally{if(browser)await browser.close();server.kill('SIGTERM');log.end();writeFileSync(join(evidence,'flow-results.json'),JSON.stringify({commit:process.env.A1_SOURCE_COMMIT,scope:'actual flow loader/model/component; real local Auth and PostgREST; source fixtures and fixed lab admission, not production journey',steps,violations,errors,verdict:process.exitCode?'FAIL':'PASS'},null,2))}
