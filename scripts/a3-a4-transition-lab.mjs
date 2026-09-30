import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'

assert.equal(process.env.A3_A4_TRANSITION_LAB,'yes')
const root=resolve(process.env.A3_A4_LAB_ROOT)
const status=JSON.parse(readFileSync(join(root,'status.json'),'utf8'))
for(const raw of [status.API_URL,status.DB_URL]) assert.ok(['127.0.0.1','localhost'].includes(new URL(raw).hostname))
const fixture=JSON.parse(readFileSync(join(root,'fixture.private.json'),'utf8'))
const db=new Client({connectionString:status.DB_URL});await db.connect()
const admin=createClient(status.API_URL,status.SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
try{
 const before=await db.query('select current_module,a4_unlocked_at from public.despega_journey_state where user_id=$1',[fixture.userId])
 assert.equal(before.rows[0].a4_unlocked_at,null)
 const profileBefore=await db.query('select a4_unlocked from public.despega_user_profiles where user_id=$1',[fixture.userId])
 assert.equal(profileBefore.rows[0].a4_unlocked,false)
 const {data,error}=await admin.rpc('complete_a3_module_atomic',{p_user_id:fixture.userId,p_module_id:'basic-interview-mission',p_module_number:10,p_module_xp:100,p_checkpoint_day:88,p_training_type:'interviewer',p_score:90,p_pass_score:70,p_feedback:{source:'a3-a4-transition-lab'},p_responses:[],p_deliverable:{verified:true},p_next_module_id:'basic-interview-mission',p_next_module_number:10,p_total_modules:10,p_unlock_advanced:true,p_complete_route:true})
 assert.ifError(error);assert.equal(data?.routeCompleted,true);assert.equal(data?.a4Unlocked,true)
 const after=await db.query('select current_module,a4_unlocked_at from public.despega_journey_state where user_id=$1',[fixture.userId])
 assert.equal(after.rows[0].current_module,'A4');assert.ok(after.rows[0].a4_unlocked_at)
 const profileAfter=await db.query('select a4_unlocked from public.despega_user_profiles where user_id=$1',[fixture.userId])
 assert.equal(profileAfter.rows[0].a4_unlocked,true)
 const route=await db.query('select route_completed_at from public.a3_route_progression where user_id=$1',[fixture.userId]);assert.ok(route.rows[0].route_completed_at)
 writeFileSync(join(root,'evidence.json'),JSON.stringify({commit:process.env.A3_A4_SOURCE_COMMIT,before:{a4:false},rpc:{routeCompleted:data.routeCompleted,a4Unlocked:data.a4Unlocked},after:{module:after.rows[0].current_module,a4:true},verdict:'PASS'},null,2))
 console.log('A3->A4 atomic transition: PASS')
}finally{await db.end()}
