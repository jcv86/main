import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'

const breadths = new Set(['precise','related','exploratory'])
const modes = new Set(['onsite','hybrid','remote','flexible'])

function cleanList(value: unknown, max = 8) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((v): v is string => typeof v === 'string').map(v=>v.trim()).filter(Boolean))].slice(0,max)
}

export async function GET() {
  const user = await resolveServerUser()
  if (!user) return NextResponse.json({error:'No autenticado'},{status:401})
  const supabase=createAdminClient()
  const {data,error}=await supabase.from('career_search_intents').select('*').eq('user_id',user.id).eq('is_active',true).order('is_primary',{ascending:false}).order('updated_at',{ascending:false})
  if(error) return NextResponse.json({error:'No fue posible cargar tus búsquedas.'},{status:500})
  return NextResponse.json({intents:data||[]})
}

export async function POST(request:Request) {
  const user=await resolveServerUser()
  if(!user) return NextResponse.json({error:'No autenticado'},{status:401})
  const body=await request.json().catch(()=>({}))
  const targetRoles=cleanList(body.targetRoles,8)
  if(!targetRoles.length) return NextResponse.json({error:'Agrega al menos un cargo o dirección profesional.'},{status:400})
  const breadth=typeof body.breadth==='string'&&breadths.has(body.breadth)?body.breadth:'related'
  const workModes=cleanList(body.workModes,4).filter(v=>modes.has(v))
  const locations=cleanList(body.locations,6)
  const supabase=createAdminClient()
  const isPrimary=body.isPrimary!==false
  if(isPrimary) await supabase.from('career_search_intents').update({is_primary:false}).eq('user_id',user.id)
  const {data,error}=await supabase.from('career_search_intents').insert({
    user_id:user.id,
    name:typeof body.name==='string'&&body.name.trim()?body.name.trim().slice(0,80):'Mi búsqueda principal',
    target_roles:targetRoles,breadth,locations,work_modes:workModes,
    industries:cleanList(body.industries,8),excluded_industries:cleanList(body.excludedIndustries,8),
    seniority_min:typeof body.seniorityMin==='string'?body.seniorityMin.slice(0,60):null,
    salary_min_clp:Number.isInteger(body.salaryMinClp)&&body.salaryMinClp>=0?body.salaryMinClp:null,
    employment_types:cleanList(body.employmentTypes,6),languages:cleanList(body.languages,6),
    is_primary:isPrimary,is_active:true,source:'user_confirmed',
  }).select('*').single()
  if(error) return NextResponse.json({error:'No fue posible guardar tu búsqueda.'},{status:500})
  return NextResponse.json({intent:data},{status:201})
}
