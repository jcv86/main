import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const sql=readFileSync('supabase/migrations/20260930200000_dtc_outcomes_chile_foundation.sql','utf8')
for(const table of ['dtc_job_search_events','dtc_employment_outcomes','dtc_salary_outcomes','dtc_outcome_followups','dtc_chile_benchmarks','dtc_outcome_verifications']) assert.ok(sql.includes('public.'+table),table)
for(const status of ['self_reported','corroborated','verified']) assert.ok(sql.includes(status),'verification '+status)
for(const day of ['30','90','180']) assert.ok(sql.includes(day),'followup '+day)
for(const source of ['ine_esi','ine_ene','sence_enadel']) assert.ok(sql.includes(source),'benchmark '+source)
for(const dimension of ['region_code','occupation_code','education_level','employment_category']) assert.ok(sql.includes(dimension),'benchmark dimension '+dimension)
assert.ok(sql.includes('force row level security'),'forced RLS')
assert.ok(sql.includes('grant select'),'owner read')
assert.ok(!sql.includes('grant insert'),'no browser inserts')
assert.ok(!sql.includes('grant update'),'no browser updates')
assert.ok(sql.includes('Never infer causal impact'),'causal discipline')
console.log(JSON.stringify({foundation:'DTC Outcomes Chile v1',tables:6,followups:[30,90,180],verification:['self_reported','corroborated','verified'],benchmarks:['INE ESI','INE ENE','SENCE ENADEL'],serverOwnedWrites:true}))
