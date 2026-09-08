import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { randomBytes } from 'node:crypto'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'
import { DISC_TEST_QUESTIONS } from '../../lib/disc-test-questions'

async function main() {
  assert.equal(process.env.A1_BROWSER_LAB, 'yes')
  const root = resolve(process.env.A1_LAB_ROOT!)
  const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
  const url = new URL(status.API_URL), dbUrl = new URL(status.DB_URL)
  assert.ok(['127.0.0.1', 'localhost'].includes(url.hostname) && ['127.0.0.1', 'localhost'].includes(dbUrl.hostname), 'Only local Supabase is allowed')
  assert.ok(status.ANON_KEY && status.SERVICE_ROLE_KEY)
  const password = `Fixture-${randomBytes(18).toString('hex')}`
  for (const value of [password, status.ANON_KEY, status.SERVICE_ROLE_KEY, status.DB_URL]) console.log(`::add-mask::${value}`)
  const db = new Client({ connectionString: status.DB_URL }); await db.connect()
  try {
    const { rows } = await db.query("select to_regclass('public.a1_cerebral_assessment') as present")
    assert.equal(rows[0].present, null, 'Refuse to seed a non-empty assessment database')
    await db.query(`
      create table public.users(id uuid primary key references auth.users(id),email text,full_name text,avatar_url text,created_at timestamptz default now(),updated_at timestamptz default now());
      create table public.a1_cerebral_assessment(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.users(id),questions jsonb not null,responses jsonb not null,disc_profile jsonb not null,dominant_pattern text not null,secondary_pattern text,completed_at timestamptz not null default now(),created_at timestamptz not null default now());
      create table public.canon_conozcamonos_1_responses(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),responses jsonb not null,completed_at timestamptz,updated_at timestamptz default now());
      create table public.canon_conozcamonos_2_responses(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),responses jsonb not null,completed_at timestamptz,updated_at timestamptz default now());
      create table public.qa_pilot_allowlist(user_id uuid primary key references auth.users(id));
      create function public.resolve_pilot_access(p_user_id uuid,p_claim_id uuid default null) returns table(allowed boolean) language sql security invoker set search_path='' as $$ select exists(select 1 from public.qa_pilot_allowlist where user_id=p_user_id) $$;
      grant all on public.qa_pilot_allowlist to service_role;
      grant execute on function public.resolve_pilot_access(uuid,uuid) to service_role;
      alter table public.users enable row level security;
      create policy lab_users_owner on public.users for all to authenticated using(auth.uid()=id) with check(auth.uid()=id);
      alter table public.a1_cerebral_assessment enable row level security;
      create policy a1_cerebral_assessment_owner_all on public.a1_cerebral_assessment for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
      alter table public.canon_conozcamonos_1_responses enable row level security;
      create policy lab_c1_owner on public.canon_conozcamonos_1_responses for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
      alter table public.canon_conozcamonos_2_responses enable row level security;
      create policy lab_c2_owner on public.canon_conozcamonos_2_responses for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
      grant select,insert,update,delete on public.users,public.a1_cerebral_assessment,public.canon_conozcamonos_1_responses,public.canon_conozcamonos_2_responses to authenticated,service_role;
      grant select on public.a1_cerebral_assessment,public.canon_conozcamonos_1_responses,public.canon_conozcamonos_2_responses to anon;
    `)
    for (const path of ['20260804061000_career_identity_foundation.sql','20260804070000_a1_career_identity_dual_write.sql','20260804125500_a1_career_identity_revoke_anon.sql','20260907204000_a1_owner_boundary.sql','20260907211500_a1_source_writer_v2.sql']) await db.query(readFileSync(join('supabase/migrations',path),'utf8'))
    await db.query("notify pgrst, 'reload schema'")
    const admin = createClient(status.API_URL,status.SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
    const users: Array<{label:string;email:string;id:string}> = []
    for (const label of ['alpha','beta','empty','tied']) {
      const email = `dtc-qa-${label}@example.invalid`
      const { data, error } = await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:`QA sintético ${label}`}})
      assert.ifError(error); assert.ok(data.user)
      const id = data.user.id; users.push({label,email,id})
      await db.query('insert into public.users(id,email,full_name) values($1,$2,$3)',[id,email,`QA sintético ${label}`])
      await db.query('insert into public.qa_pilot_allowlist values($1)',[id])
      const challenge = label === 'alpha' ? 'CASO ALPHA SINTÉTICO. ' + 'Coordinar decisiones con evidencia y comunicar sus límites. '.repeat(12) : `CASO ${label.toUpperCase()} SINTÉTICO, no datos de una persona real.`
      const c1 = {'1':['Empleado','Independiente'],'2':['5-10 años'],'3':challenge,'4':`Objetivo inicial ${label}`,'6':['3-5 horas']}
      const c2 = {'1':`Objetivo posterior ${label}`,'2':'Sector sintético','3':`Rol ${label}`,'4':['Comunicación'],'5':'Menos de 5 horas','6':['Práctica'],'7':['Tiempo limitado'],'8':'Flexible'}
      await db.query('insert into public.canon_conozcamonos_1_responses(user_id,responses,completed_at) values($1,$2,now())',[id,c1])
      await db.query('insert into public.canon_conozcamonos_2_responses(user_id,responses,completed_at) values($1,$2,now())',[id,c2])
    }
    const fixture = (tied=false) => {
      const more: Record<string,string>={},less:Record<string,string>={}
      DISC_TEST_QUESTIONS.forEach((q,i)=>{more[q.id]=q.opciones[tied?i%4:i<20?0:1].texto;less[q.id]=q.opciones[tied?(i+1)%4:i%2?2:3].texto})
      return {more,less}
    }
    writeFileSync(join(root,'fixtures.private.json'),JSON.stringify({users,password,ordinary:fixture(),tied:fixture(true)}),{mode:0o600})
    console.log('Four synthetic users created through real local Supabase Auth; real selected SQL installed. No remote project or email delivery used.')
  } finally { await db.end() }
}
main().catch(error=>{console.error('A1 lab setup failed:',error instanceof Error?error.message:'unknown');process.exitCode=1})
