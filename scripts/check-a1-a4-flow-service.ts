import assert from 'node:assert/strict'
import { readJourneyFlow } from '../lib/journey/flow-service'
const userId='synthetic-owner'
const journey={user:{id:userId},profile:{onboarding_conozcamonos_1_completed:true,a1_cerebral_intro_seen:true,a1_cerebral_completed:true,conozcamonos_2_completed:true,a1_report_seen:true,a2_intro_seen:true},access:{a1:true,a2:true,a3:true,a4:true},state:{currentModule:'A3',highestA2DayUnlocked:7}}
const rows:Record<string,unknown>={a2_user_task_completions:[{day:1},{day:2},{day:2}],a3_user_progress:{completed_module_ids:['career-mirror']},a3_route_progression:{route_completed_at:'2026-09-07T12:00:00'},despega_journey_state:{metadata:{a2_horizon:30}}}
let queries:Array<{table:string;filters:Array<unknown[]>}> = []
function port(identity:string|null=userId,failedTable=''){
 return {auth:{getUser:async()=>({data:{user:identity?{id:identity}:null},error:null})},from:(table:string)=>{
  const entry={table,filters:[] as unknown[][]};queries.push(entry)
  const q:any={select:()=>q,eq:(...args:unknown[])=>{entry.filters.push(args);return q},not:(...args:unknown[])=>{entry.filters.push(['not',...args]);return q},maybeSingle:()=>q,then:(resolve:any,reject:any)=>Promise.resolve({data:rows[table],error:table===failedTable?{message:'sensitive provider message'}:null}).then(resolve,reject)};return q
 }} as any
}
async function main(){
 const f=await readJourneyFlow(journey,port());assert.equal(f.next.href,'/despega/a4');assert.equal(f.cycleCompletedDays,2);assert.equal(queries.length,4);assert.ok(queries.every(q=>q.filters.some(a=>a[0]==='user_id'&&a[1]===userId)))
 queries=[];await assert.rejects(()=>readJourneyFlow(journey,port('other')),/verificar la identidad/);assert.equal(queries.length,0)
 await assert.rejects(()=>readJourneyFlow(journey,port(null)),/verificar la identidad/);assert.equal(queries.length,0)
 for(const table of Object.keys(rows)){await assert.rejects(()=>readJourneyFlow(journey,port(userId,table)),error=>error instanceof Error&&!error.message.includes('sensitive')&&error.message.includes('No pudimos verificar el progreso'))}
 rows.a3_route_progression=null;const pending=await readJourneyFlow(journey,port());assert.equal(pending.radarAvailable,false)
 console.log('A1-A4 flow service: PASS (identity, four owner-scoped reads, four redacted error paths, legacy closure marker, no writes; synthetic query port)')
}
main().catch(error=>{console.error(error);process.exitCode=1})
