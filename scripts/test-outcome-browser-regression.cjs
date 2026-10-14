/** Real React components + actual DTC CSS in Chromium; synthetic API only.
 * Does not certify Supabase Auth/RLS or the full authenticated application shell.
 * Install pinned tools outside the repository; see the validation record.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const {createRequire} = require('node:module');
const {execFileSync} = require('node:child_process');
assert.equal(process.env.DTC_OUTCOME_BROWSER_LAB, 'yes');
const root = process.cwd();
const tools = path.resolve(process.env.DTC_OUTCOME_BROWSER_TOOLS);
const qa = createRequire(path.join(tools,'package.json'));
const work = fs.mkdtempSync(path.join(os.tmpdir(),'dtc-outcome-browser-'));
const output = path.resolve(process.env.DTC_OUTCOME_BROWSER_OUTPUT || work);
fs.mkdirSync(output,{recursive:true});
const checks = [], axes = [], errors = [];
const check = (name, condition) => { assert.ok(condition,name); checks.push(name); };
const TEXT = 'Esta respuesta sintética explica mi aporte al equipo y un resultado concreto de mi trabajo.';
const KEYS = {a1:'a1_professional_clarity',a2:'a2_execution_checkpoint',a3:'a3_structured_interview'};
let browser,server,browserVersion;
async function main(){
 const entry = `import React from 'react';import {createRoot} from 'react-dom/client';
 import {A1ProfessionalClarityForm as A1} from '${root}/components/outcomes/a1-professional-clarity-form';
 import {A2ExecutionOutcomeForm as A2} from '${root}/components/outcomes/a2-execution-outcome-form';
 import {A3InterviewOutcomeForm as A3} from '${root}/components/outcomes/a3-interview-outcome-form';
 const p=new URLSearchParams(location.search);const Component=({a1:A1,a2:A2,a3:A3})[p.get('module')||'a1'];
 document.documentElement.classList.toggle('dark',p.get('theme')==='dark');
 createRoot(document.getElementById('root')).render(<main className="mx-auto max-w-5xl p-4"><h1>Registro de respuestas · laboratorio</h1><Component role={p.get('role')==='follow_up'?'follow_up':'baseline'} onSaved={()=>{document.getElementById('continued').textContent='Continuación elegida'}}/><p id="continued" role="status"/></main>);`;
 await qa('esbuild').build({stdin:{contents:entry,loader:'tsx',resolveDir:root},outfile:work+'/app.js',bundle:true,platform:'browser',jsx:'automatic',tsconfig:root+'/tsconfig.json',nodePaths:[root+'/node_modules'],define:{'process.env.NODE_ENV':'"production"'},logLevel:'silent'});
 // Font downloads are excluded. The browser's bundled Latin fonts are required and checked below.
 fs.writeFileSync(work+'/style-in.css',fs.readFileSync(root+'/app/globals.css','utf8').replace(/^@import url\(.*$/gm,''));
 execFileSync(root+'/node_modules/.bin/tailwindcss',['-c',root+'/tailwind.config.ts','-i',work+'/style-in.css','-o',work+'/style.css'],{cwd:root,stdio:'pipe'});
 server=http.createServer((req,res)=>{
  if(req.url==='/app.js'||req.url==='/style.css'){res.setHeader('Content-Type',req.url.endsWith('.js')?'text/javascript':'text/css');res.end(fs.readFileSync(work+req.url));return;}
  res.setHeader('Content-Type','text/html');res.end('<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Laboratorio DTC</title><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>');
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const chromeBase=path.join(path.dirname(qa.resolve('@sparticuz/chromium')),'..');
 const {inflate}=await import(path.join(chromeBase,'build/lambdafs.js'));
 await inflate(path.join(chromeBase,'bin/al2023.tar.br'));
 const chrome=(await import(qa.resolve('@sparticuz/chromium'))).default;
 const executablePath=await chrome.executablePath();
 // Keep each scenario in its own process. Do not reuse a browser after closing a
 // single-process context; never hide crashes or skip the remaining scenarios.
 // No cross-origin/web-security relaxation is needed for this loopback fixture.
 const browserArgs=chrome.args.filter(arg=>!['--disable-web-security','--disable-site-isolation-trials','--allow-running-insecure-content'].includes(arg));
 const json=(route,body,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
 for(const theme of ['light','dark'])for(const width of [390,1440])for(const module of Object.keys(KEYS)){
  const name=`${module}/${width}/${theme}`;
  let context;
  try{
   browser=await qa('playwright-core').chromium.launch({args:browserArgs,executablePath,headless:true,
    env:{...process.env,LD_LIBRARY_PATH:'/tmp/al2023/lib',FONTCONFIG_PATH:'/tmp/fonts'}});
   browserVersion=browser.version();
   context=await browser.newContext({viewport:{width,height:844}});
   const page=await context.newPage();page.setDefaultTimeout(6000);page.on('pageerror',e=>errors.push({name,message:e.message}));
   let records=[],posts=[],failNext=true,readFailure=false;
   const key=KEYS[module];
   await context.route('**/*',async route=>{
    const url=new URL(route.request().url());if(url.origin!==base)return route.abort();
    if(url.pathname!=='/api/outcomes/observations')return route.continue();
    if(route.request().method()==='GET'){
     if(readFailure)return json(route,{error:'Synthetic read failure'},503);
     const baseline=records.find(v=>v.measurementRole==='baseline')||null,followUp=records.find(v=>v.measurementRole==='follow_up')||null;
     return json(route,{instrumentKey:key,instrumentVersion:'2-capture',baseline,followUp,pairStatus:baseline?(followUp?'available':'baseline_only'):(followUp?'follow_up_only':'empty'),evaluationStatus:'not_evaluated',comparable:false});
    }
    const body=route.request().postDataJSON();posts.push(body);
    if(failNext){failNext=false;return json(route,{error:'Synthetic write failure'},503);}
    const existing=records.find(v=>v.observationId===body.observationId);
    if(!existing)records.push({observationId:body.observationId,observedAt:body.measurementRole==='baseline'?'2026-10-01T12:00:00Z':'2026-10-02T12:00:00Z',measurementRole:body.measurementRole,responsePayload:body.responsePayload});
    return json(route,{stored:true,observationId:body.observationId,instrumentVersion:'2-capture',measurementStatus:'recorded_pending_evaluation'},existing?200:201);
   });
   const go=role=>page.goto(base+`/?module=${module}&role=${role}&theme=${theme}`);
   const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
   const fill=async()=>{for(const input of await page.locator('textarea').all())await input.fill(TEXT);};
   const audit=async stage=>{await page.addScriptTag({path:qa.resolve('axe-core/axe.min.js')});const result=await page.evaluate(()=>axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));axes.push({name,stage,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary,checks:[...n.any,...n.all,...n.none].map(c=>({id:c.id,data:c.data,message:c.message}))}))})),incomplete:result.incomplete.map(v=>v.id)});};
   await go('baseline');await page.locator('textarea').first().waitFor();
   check(name+': browser fonts have actual metrics',(await page.getByRole('heading',{level:1}).boundingBox()).height>10);
   check(name+': initial empty form cannot save',await page.getByRole('button',{name:'Guardar mi punto de partida'}).isDisabled());
   check(name+': no horizontal overflow',await overflow());await fill();
   await page.getByRole('button',{name:'Guardar mi punto de partida'}).click();
   await page.getByRole('alert').waitFor();
   check(name+': failed save error visible',(await page.getByRole('alert').boundingBox()).height>10);
   check(name+': failure preserves all answers',(await page.locator('textarea').evaluateAll(inputs=>inputs.map(e=>e.value))).every(v=>v===TEXT));
   await audit('write-error');
   await page.getByRole('button',{name:'Guardar mi punto de partida'}).focus();await page.keyboard.press('Enter');
   await page.getByRole('heading',{name:'Tus respuestas quedaron guardadas'}).waitFor();
   check(name+': retry retains request identity',posts.length===2&&posts[0].observationId===posts[1].observationId);
   check(name+': no client score or owner',!('score' in posts[1])&&!('confidence' in posts[1])&&!('user_id' in posts[1]));
   await page.getByText('Revisar lo que guardé',{exact:true}).click();
   check(name+': review answers available',(await page.locator('dd:visible').count())>0);
   await page.getByRole('button',{name:'Continuar mi recorrido'}).click();
   check(name+': continuation explicit',await page.locator('#continued').innerText()==='Continuación elegida');
   await page.reload();await page.getByText('Leer mis respuestas: punto de partida',{exact:true}).click();
   const reloadedText=await page.locator('dd:visible').allTextContents();
   check(name+': saved text recovered on reload',reloadedText.length>0&&reloadedText.every(t=>t===TEXT));
   check(name+': readback does not fill a new draft',(await page.locator('textarea').evaluateAll(inputs=>inputs.map(e=>e.value))).every(v=>v===''));
   await go('follow_up');await fill();await page.getByRole('button',{name:'Guardar mi seguimiento'}).click();await page.getByRole('heading',{name:'Tus respuestas quedaron guardadas'}).waitFor();
   await page.getByText('Leer mis respuestas: punto de partida',{exact:true}).click();await page.getByText('Leer mis respuestas: seguimiento',{exact:true}).click();
   check(name+': both phases readable',(await page.locator('time').count())===2);
   check(name+': no fabricated improvement',(await page.locator('main').innerText()).includes('sin evaluar'));
   check(name+': expanded text no overflow',await overflow());await audit('saved-follow-up');
   if(module==='a1')await page.screenshot({path:output+`/${name.replaceAll('/','-')}.png`,fullPage:true});
   readFailure=true;await page.reload();await page.getByRole('alert').waitFor();
   check(name+': unavailable history is not empty',(await page.getByRole('alert').innerText()).includes('no significa'));
   readFailure=false;await page.getByRole('button',{name:'Reintentar lectura'}).click();await page.getByText('Leer mis respuestas: punto de partida',{exact:true}).waitFor();
   check(name+': history read retry recovers',await page.getByText('Leer mis respuestas: seguimiento',{exact:true}).isVisible());
   fs.writeFileSync(output+'/browser-progress.json',JSON.stringify({lastCompleted:name,checks,axes,errors},null,2));
  }finally{
   try{if(context)await context.close();}finally{if(browser)await browser.close();browser=null;}
  }
 }
 check('no client runtime exceptions',errors.length===0);
 const result={suite:'outcome-browser-regression',applicationHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),browser:browserVersion,checks:checks.length,passed:checks.length,scenarios:12,api:'synthetic',fullAuthenticatedShell:false,axe:axes,errors};
 fs.writeFileSync(output+'/browser-results.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({suite:result.suite,checks:result.checks,scenarios:12,axeViolations:axes.reduce((n,a)=>n+a.violations.length,0),runtimeErrors:errors.length,output}));
 if(axes.some(a=>a.violations.length))process.exitCode=1;
}
main().catch(e=>{fs.writeFileSync(output+'/browser-failure.json',JSON.stringify({message:e.message,stack:e.stack,checks,axes,errors},null,2));console.error(e.message);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));});
