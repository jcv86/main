import assert from 'node:assert/strict'
import { recordJourneyTransition } from '../lib/journey/transitions'
import { setJourneyTestClient } from './fixtures/journey-supabase'
let writes: unknown[] = []
let assessment: unknown = { disc_profile: {D:14,I:-14,S:1,C:-1}, responses:null, completed_at:'2026-09-07T12:00:00Z' }
let profile: Record<string,unknown> = {conozcamonos_2_completed:true,a1_report_seen:true}
let readError=false
const owner='fixture-owner'
const client={from:(table:string)=>{
 const filters:unknown[][]=[]
 const q:any={select:()=>q,eq:(...v:unknown[])=>{filters.push(v);return q},order:()=>q,limit:()=>q,maybeSingle:()=>q,
 upsert:(v:any)=>{assert.equal(v.user_id,owner);writes.push(v);return Promise.resolve({error:null})},
 then:(ok:any,no:any)=>{assert.ok(filters.some(v=>v[0]==='user_id'&&v[1]===owner));return Promise.resolve({data:table==='a1_cerebral_assessment'?assessment:profile,error:readError?new Error('fixture read failure'):null}).then(ok,no)}};return q
}}
setJourneyTestClient(client)
async function main(){
 const result=await recordJourneyTransition(owner,'a1_report');assert.equal(result.nextPath,'/despega/a2/intro');assert.equal(writes.length,1)
 writes=[];assessment={disc_profile:{D:0,I:0,S:0,C:0},dominant_pattern:'D',secondary_pattern:'I',responses:null};await recordJourneyTransition(owner,'a1_report');assert.equal(writes.length,1,'A legitimate tie remains reviewable')
 for(const raw of [{},{D:99,I:0,S:0,C:-99},{D:1,I:1,S:1,C:1}]){writes=[];assessment={disc_profile:raw,responses:null};await assert.rejects(()=>recordJourneyTransition(owner,'a1_report'));assert.equal(writes.length,0)}
 writes=[];assessment={disc_profile:{D:14,I:-14,S:1,C:-1},responses:{more:{},less:{}}};await assert.rejects(()=>recordJourneyTransition(owner,'a1_report'));assert.equal(writes.length,0)
 assessment={disc_profile:{D:14,I:-14,S:1,C:-1},responses:null};profile={conozcamonos_2_completed:false};await assert.rejects(()=>recordJourneyTransition(owner,'a1_report'),/Conozcámonos 2/);assert.equal(writes.length,0)
 profile={conozcamonos_2_completed:true,a1_report_seen:false};await assert.rejects(()=>recordJourneyTransition(owner,'a2_intro'),/revisa tu informe/);assert.equal(writes.length,0)
 profile={conozcamonos_2_completed:true,a1_report_seen:true};const intro=await recordJourneyTransition(owner,'a2_intro');assert.equal(intro.nextPath,'/despega/a2');assert.equal(writes.length,1)
 writes=[];readError=true;await assert.rejects(()=>recordJourneyTransition(owner,'a1_report'));assert.equal(writes.length,0)
 console.log('Journey transition evidence: PASS (10 cases on actual service; synthetic database port, not deployed HTTP)')
}
main().catch(error=>{console.error(error);process.exitCode=1})
