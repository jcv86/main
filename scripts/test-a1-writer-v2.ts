import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { DISC_TEST_QUESTIONS } from '../lib/disc-test-questions'
import { validateAndScoreDiscResponses } from '../lib/a1/disc-scoring'

const url = new URL(process.env.A1_WRITER_TEST_DATABASE_URL || 'postgres://invalid/invalid')
if (process.env.A1_WRITER_DISPOSABLE !== 'yes' || !['127.0.0.1','localhost','[::1]'].includes(url.hostname)
  || url.pathname !== '/dtc_a1_writer_test') throw new Error('Disposable loopback database opt-in required')
const clients = Array.from({length:3},()=>new pg.Client({connectionString:url.toString()}))
const [admin, first, second] = clients
const owner='00000000-0000-4000-8000-000000000011',other='00000000-0000-4000-8000-000000000022'
let checks=0
const snapshotTables=['a1_cerebral_assessment','career_identities','career_skills','career_evidence','career_memories','career_agent_events']
async function snapshot(tables=snapshotTables) {
  const result:Record<string,unknown>={}
  for (const table of tables) {
    // Table names come from the fixed test allowlist, never user input.
    assert.ok(snapshotTables.includes(table))
    result[table]=(await admin.query(`select coalesce(jsonb_agg(to_jsonb(t) order by id),'[]'::jsonb) as rows from public.${table} t`)).rows[0].rows
  }
  return result
}
function fixture(seed:number) {
  let state=seed||1
  const next=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state}
  const answers={more:{} as Record<string,string>,less:{} as Record<string,string>}
  for(const q of DISC_TEST_QUESTIONS){const a=next()%4;const b=(a+1+next()%3)%4;answers.more[q.id]=q.opciones[a].texto;answers.less[q.id]=q.opciones[b].texto}
  return answers
}
function uniform(a:number,b:number) {
  return {more:Object.fromEntries(DISC_TEST_QUESTIONS.map(q=>[q.id,q.opciones[a].texto])),less:Object.fromEntries(DISC_TEST_QUESTIONS.map(q=>[q.id,q.opciones[b].texto]))}
}
const sqlCall='select * from public.save_a1_cerebral_with_career_identity($1::jsonb,$2::jsonb,$3::jsonb,$4::text,$5::text,$6::text)'
function args(responses:unknown,key='fixture') {
  // Intentionally forged aggregates/snapshot: the database must ignore them and recompute.
  return [JSON.stringify(responses),JSON.stringify([{id:1,pregunta:'FORGED',opciones:[]}]),JSON.stringify({D:999,I:999,S:999,C:999}),'Z','Z',key]
}
async function beginAs(client:any,user:string|null,role='authenticated') {
  assert.ok(['authenticated','anon'].includes(role))
  await client.query('begin')
  await client.query(`set local role ${role}`)
  await client.query("select set_config('request.jwt.claim.sub',$1,true)",[user||''])
}
async function submit(client:any,user:string|null,responses:unknown,key='fixture',role='authenticated') {
  await beginAs(client,user,role)
  try {const result=await client.query(sqlCall,args(responses,key));await client.query('commit');return result.rows[0]}
  catch(error){await client.query('rollback');throw error}
}
async function rejects(responses:unknown,code:string,user:string|null=owner,role='authenticated') {
  const before=await snapshot()
  await assert.rejects(submit(first,user,responses,'invalid',role),(error:any)=>error.code===code)
  assert.deepEqual(await snapshot(),before);checks++
}
async function main() {
  await Promise.all(clients.map(client=>client.connect()))
  const existing=await admin.query("select to_regclass('public.a1_cerebral_assessment') as assessment,to_regclass('public.career_identities') as identity,to_regnamespace('auth') as auth")
  assert.ok(Object.values(existing.rows[0]).every(value=>value===null),'Refuse existing database state')
  await admin.query(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth,public to anon,authenticated;
    grant execute on function auth.uid() to anon,authenticated;
    create table public.a1_cerebral_assessment(
      id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),
      questions jsonb not null,responses jsonb not null,disc_profile jsonb not null,dominant_pattern varchar not null,
      secondary_pattern varchar,completed_at timestamptz not null,created_at timestamptz default now());
    alter table public.a1_cerebral_assessment enable row level security;
    create policy a1_cerebral_assessment_owner_all on public.a1_cerebral_assessment for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
    grant select,insert,update,delete on public.a1_cerebral_assessment to authenticated;
    create table public.canon_conozcamonos_1_responses(id uuid primary key,user_id uuid not null);
    create table public.canon_conozcamonos_2_responses(id uuid primary key,user_id uuid not null);
  `)
  await admin.query('insert into auth.users(id) values($1),($2)',[owner,other])
  await admin.query(readFileSync('supabase/migrations/20260804061000_career_identity_foundation.sql','utf8'))
  await admin.query(readFileSync('supabase/migrations/20260804070000_a1_career_identity_dual_write.sql','utf8'))
  await admin.query(readFileSync('supabase/migrations/20260804125500_a1_career_identity_revoke_anon.sql','utf8'))
  // Create genuine legacy projections in the disposable database to prove they are not erased.
  await beginAs(first,owner)
  const old=validateAndScoreDiscResponses(fixture(7)).value!
  await first.query(sqlCall,[JSON.stringify(old.responses),JSON.stringify(old.questions),JSON.stringify(old.scores),old.dominantPattern,old.secondaryPattern,'old-fixture'])
  await first.query('commit')
  await admin.query(`update public.career_identities set
    communication_profile=communication_profile||'{"a3Practice":{"sessions":2},"custom":"preserve"}'::jsonb,
    strengths='["Práctica registrada"]',growth_areas='["Objetivo de práctica"]',motivators='["Preferencia declarada"]'
    where user_id=$1`,[owner])
  await admin.query(`insert into public.career_memories(user_id,identity_id,memory_type,key,content,source_evidence_id)
    select $1,id,'pattern','legacy.disc','{"fixture":"historical inference"}'::jsonb,
      (select id from public.career_evidence where user_id=$1 limit 1)
    from public.career_identities where user_id=$1`,[owner])
  const immutable=await snapshot(['career_skills','career_evidence','career_memories'])
  const oldAssessment=(await snapshot(['a1_cerebral_assessment'])).a1_cerebral_assessment as any[]
  const beforeDDL=await snapshot()
  const migration=readFileSync('supabase/migrations/20260907211500_a1_source_writer_v2.sql','utf8')
  await admin.query(migration);await admin.query(migration)
  assert.deepEqual(await snapshot(),beforeDDL);checks++
  await admin.query(readFileSync('supabase/migrations/20260907204000_a1_owner_boundary.sql','utf8'))
  const permissions=(await admin.query(`select prosecdef,has_function_privilege('anon',p.oid,'execute') as anon_exec,
    has_function_privilege('authenticated',p.oid,'execute') as auth_exec
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='save_a1_cerebral_with_career_identity'`)).rows[0]
  assert.deepEqual(permissions,{prosecdef:false,anon_exec:false,auth_exec:true});checks++

  const fixtures=[]
  for(let a=0;a<4;a++) for(let b=0;b<4;b++) if(a!==b) fixtures.push(uniform(a,b))
  fixtures.push({more:Object.fromEntries(DISC_TEST_QUESTIONS.map((q,i)=>[q.id,q.opciones[i%4].texto])),less:Object.fromEntries(DISC_TEST_QUESTIONS.map((q,i)=>[q.id,q.opciones[(i+1)%4].texto]))})
  for(let i=1;i<=24;i++) fixtures.push(fixture(i))
  for(const [index,responses] of fixtures.entries()) {
    const expected=validateAndScoreDiscResponses(responses).value!
    const saved=await submit(first,owner,{...responses,_meta:{questionnaireVersion:'dtc-disc-28.v1',patternEvidence:{primary:'FORGED'},confidence:100}},`valid-${index}`)
    const row=(await admin.query('select * from public.a1_cerebral_assessment where id=$1',[saved.assessment_id])).rows[0]
    const identity=(await admin.query('select * from public.career_identities where id=$1',[saved.identity_id])).rows[0]
    assert.deepEqual(row.disc_profile,expected.scores)
    assert.deepEqual(row.questions,DISC_TEST_QUESTIONS)
    assert.deepEqual(row.responses.more,expected.responses.more);assert.deepEqual(row.responses.less,expected.responses.less)
    assert.deepEqual(row.responses._meta.patternEvidence,expected.responses._meta?.patternEvidence)
    assert.equal(row.responses._meta.writerVersion,'a1-source-writer.v2')
    assert.equal(row.responses._meta.compatibilityLabelsOnly,expected.responses._meta?.compatibilityLabelsOnly)
    assert.equal(identity.version,saved.identity_version)
    const projection=identity.communication_profile.a1
    assert.deepEqual(projection.rawScores,expected.scores)
    assert.deepEqual(projection.patternEvidence,expected.responses._meta?.patternEvidence)
    for(const key of ['D','I','S','C'] as const) assert.equal(projection.displayIntensities[key],Math.round((expected.scores[key]+28)/56*100))
    assert.equal(projection.assessmentId,saved.assessment_id)
    assert.equal(projection.kind,'self_reported_preferences')
    assert.ok(!('confidence' in projection));assert.ok(!('scores' in identity.communication_profile))
    assert.deepEqual(identity.communication_profile.a3Practice,{sessions:2});assert.equal(identity.communication_profile.custom,'preserve')
    assert.deepEqual(identity.strengths,['Práctica registrada']);assert.deepEqual(identity.growth_areas,['Objetivo de práctica'])
    assert.deepEqual(identity.motivators,['Preferencia declarada'])
    assert.equal(row.user_id,owner);checks++
  }
  assert.deepEqual(await snapshot(['career_skills','career_evidence','career_memories']),immutable);checks++
  const preserved=(await admin.query('select to_jsonb(t) as record from public.a1_cerebral_assessment t where id=$1',[oldAssessment[0].id])).rows[0].record
  // Compare serialized values to account for the pg driver parsing timestamp columns as Date.
  assert.deepEqual(JSON.parse(JSON.stringify(preserved)),JSON.parse(JSON.stringify(oldAssessment[0])));checks++
  const copy=()=>JSON.parse(JSON.stringify(fixtures[0]))
  for(const invalid of [null,[],{}, {more:[],less:{}},{more:{},less:{}}]) await rejects(invalid,'22023')
  let invalid=copy();delete invalid.more['1'];await rejects(invalid,'22023')
  invalid=copy();invalid.less['29']='extra';await rejects(invalid,'22023')
  invalid=copy();invalid.more['1']=false;await rejects(invalid,'22023')
  invalid=copy();invalid.more['1']='Invented choice';await rejects(invalid,'22023')
  invalid=copy();invalid.more['1']=invalid.less['1'];await rejects(invalid,'22023')
  invalid=copy();invalid._meta={questionnaireVersion:'future.v5'};await rejects(invalid,'22023')
  invalid=copy();invalid.padding='x'.repeat(33000);await rejects(invalid,'22023')
  await rejects(fixtures[0],'28000',null)
  await rejects(fixtures[0],'42501',null,'anon')
  const ownSecond=await submit(second,other,fixtures[0],'other-user')
  const secondData=(await admin.query('select user_id from public.a1_cerebral_assessment where id=$1',[ownSecond.assessment_id])).rows[0]
  assert.equal(secondData.user_id,other);checks++
  await beginAs(first,owner)
  assert.equal((await first.query('select * from public.a1_cerebral_assessment where user_id=$1',[other])).rowCount,0)
  await first.query('rollback');checks++

  // Force an audit failure after assessment insertion and identity upsert: all must roll back.
  await admin.query(`create function public.fixture_reject_audit() returns trigger language plpgsql as $$ begin
    if new.correlation_id='fixture-fail' then raise exception using errcode='P0001',message='synthetic audit failure'; end if;return new;end;$$;
    create trigger fixture_reject_audit before insert on public.career_agent_events for each row execute function public.fixture_reject_audit();`)
  const beforeFault=await snapshot()
  await assert.rejects(submit(first,owner,fixture(99),'fixture-fail'),(error:any)=>error.code==='P0001')
  assert.deepEqual(await snapshot(),beforeFault);checks++
  const concurrent=await Promise.all([submit(first,owner,fixture(51),'parallel-a'),submit(second,owner,fixture(52),'parallel-b')])
  assert.notEqual(concurrent[0].assessment_id,concurrent[1].assessment_id)
  const latest=(await admin.query('select id from public.a1_cerebral_assessment where user_id=$1 order by completed_at desc,id desc limit 1',[owner])).rows[0]
  let current=(await admin.query('select communication_profile from public.career_identities where user_id=$1',[owner])).rows[0]
  assert.equal(current.communication_profile.a1.assessmentId,latest.id);checks++
  // A transaction that started earlier but writes later must produce the newest source date.
  await beginAs(first,owner)
  await submit(second,owner,fixture(53),'began-later')
  const wroteLater=(await first.query(sqlCall,args(fixture(54),'wrote-later'))).rows[0]
  await first.query('commit')
  const latestAfter=(await admin.query('select id from public.a1_cerebral_assessment where user_id=$1 order by completed_at desc,id desc limit 1',[owner])).rows[0]
  current=(await admin.query('select communication_profile from public.career_identities where user_id=$1',[owner])).rows[0]
  assert.equal(latestAfter.id,wroteLater.assessment_id);assert.equal(current.communication_profile.a1.assessmentId,wroteLater.assessment_id);checks++
  assert.deepEqual(await snapshot(['career_skills','career_evidence','career_memories']),immutable);checks++
  console.log(`A1 source writer v2: PASS (${checks} grouped PostgreSQL checks; ${fixtures.length} SQL/TypeScript parity fixtures; real disposable PostgreSQL, synthetic auth.uid and users; no production writes)`)
}
main().catch((error)=>{console.error(error);process.exitCode=1}).finally(async()=>{await Promise.allSettled(clients.map(client=>client.end()))})
