import { NextRequest, NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { recordEmploymentOutcome, recordJobSearchEvent, recordSalaryOutcome } from '@/lib/outcomes-chile/capture'
import { loadOutcomesChileSummary } from '@/lib/outcomes-chile/service'

export async function GET() {
  const user=await resolveServerUser()
  if(!user) return NextResponse.json({error:'No autenticado'},{status:401})
  try { return NextResponse.json(await loadOutcomesChileSummary(user.id)) }
  catch(error){ console.error('[outcomes-chile] summary',error); return NextResponse.json({error:'No pudimos cargar tus resultados.'},{status:500}) }
}

export async function POST(request: NextRequest) {
  const user=await resolveServerUser()
  if(!user) return NextResponse.json({error:'No autenticado'},{status:401})
  let body:Record<string,unknown>
  try{body=await request.json()}catch{return NextResponse.json({error:'Solicitud inválida'},{status:400})}
  try{
    if(body.action==='job_search_event') return NextResponse.json({data:await recordJobSearchEvent(user.id,body)},{status:201})
    if(body.action==='employment_outcome') return NextResponse.json({data:await recordEmploymentOutcome(user.id,body)},{status:201})
    if(body.action==='salary_outcome') return NextResponse.json({data:await recordSalaryOutcome(user.id,body)},{status:201})
    return NextResponse.json({error:'Acción no soportada'},{status:400})
  }catch(error){
    const code=error instanceof Error?error.message:'OUTCOME_CAPTURE_FAILED'
    const validation=code.startsWith('INVALID_')||code==='ROLE_REQUIRED'
    if(!validation) console.error('[outcomes-chile] capture',error)
    return NextResponse.json({error:validation?code:'No pudimos registrar el resultado.'},{status:validation?422:500})
  }
}
