'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MapPin, CalendarDays, SearchX, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OpportunityProfileEvidence } from './opportunity-search-experience'
import { Button } from '@/components/ui/button'
import { OPPORTUNITY_SOURCE_LABELS, type OpportunitySource } from '@/lib/opportunities/types'
import { opportunityFilterParams, type OpportunityFilters, type OpportunityView } from '@/lib/opportunities/search-query'

interface Opportunity {sourceId:string;title:string;company:string;location:string|null;publishedAt:string|null;expiresAt:string|null;originalUrl:string;verificationStatus:'verified_active';description?:string|null;requirements?:string[];skills?:string[];source?:string;region?:string|null;workMode?:'onsite'|'hybrid'|'remote'|null;lastVerifiedAt?:string}
interface Payload {
 needs_intent: boolean
 mode?: 'available_now' | 'explore' | 'saved'
 count?: number
 inventory_status?: 'ready' | 'empty'
 opportunities: Opportunity[]
 applied_filters?: OpportunityFilters
 total_matching?: number
 scope?: { limit: number; limitReached: boolean }
 pagination?: { offset: number; next_offset: number | null; snapshot: string }
}
interface ResultError { message: string; status?: number; code?: string }
const EMPTY_FILTERS: OpportunityFilters = { targetRoles: [], locations: [], workModes: [], breadth: 'related' }
const BREADTH_LABELS = { precise: 'Cargo exacto', related: 'Cargos relacionados', exploratory: 'También áreas cercanas' }


const WORK_MODE_LABELS={onsite:'Presencial',hybrid:'Híbrido',remote:'Remoto'} as const

function PublishedDate({value}:{value:string|null}) {
 if(!value)return null
 const normalized=value.trim()
 const dateOnly=/^\d{4}-\d{2}-\d{2}$/.test(normalized)
 const date=new Date(dateOnly?normalized+'T12:00:00Z':normalized)
 if(!Number.isFinite(date.getTime()))return null
 const label=new Intl.DateTimeFormat('es-CL',{
  day:'2-digit',month:'2-digit',year:'numeric',
  timeZone:dateOnly?'UTC':'America/Santiago',
 }).format(date)
 return <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4"/><time dateTime={normalized}>{label}</time></span>
}

function SourceDetails({source,verifiedAt}:{source?:string;verifiedAt?:string}) {
 const sourceLabel=source&&Object.prototype.hasOwnProperty.call(OPPORTUNITY_SOURCE_LABELS,source)
  ?OPPORTUNITY_SOURCE_LABELS[source as OpportunitySource]:null
 const checked=verifiedAt?new Date(verifiedAt):null
 const checkedLabel=checked&&Number.isFinite(checked.getTime())
  ?new Intl.DateTimeFormat('es-CL',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'America/Santiago'}).format(checked):null
 if(!sourceLabel&&!checkedLabel)return null
 return <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
  {sourceLabel&&<span>Fuente: {sourceLabel}</span>}
  {checkedLabel&&<span>Verificada el <time dateTime={verifiedAt}>{checkedLabel}</time> (Chile)</span>}
 </div>
}

const normalize=(value:string)=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ')
function actionFor(items:string[],fallback?:string){
 const text=normalize([...items,fallback||''].join(' '))
 if(/cv|curriculum|resume/.test(text)) return {href:'/despega/a3/cv-builder-studio',label:'Mejorar mi CV'}
 if(/entrevista|interview|respuesta/.test(text)) return {href:'/despega/a3/simulations',label:'Practicar entrevista'}
 return {href:'/despega/a3',label:items.length?'Trabajar esta brecha':'Revisar mi preparación'}
}
function evidenceFor(job:Opportunity,profile?:OpportunityProfileEvidence|null){
 const published=[job.title,...(job.requirements||[]),...(job.skills||[])].map(normalize).join(' ')
 const strengths=(profile?.strengths||[]).filter(item=>{const terms=normalize(item).split(/\s+/).filter(x=>x.length>=4);return terms.some(term=>published.includes(term))}).slice(0,3)
 const phrase=(value:string)=>' '+normalize(value).replace(/\s+/g,' ').trim()+' '
 const roleAligned=Boolean(profile?.targetRole?.trim())&&phrase(job.title).includes(phrase(profile!.targetRole!))
 const gaps=(profile?.missingProof||[]).filter(item=>{const terms=normalize(item).split(/\s+/).filter(x=>x.length>=4);return terms.some(term=>published.includes(term))}).slice(0,3)
 return {strengths,roleAligned,gaps}
}

export function RealOpportunityResults({ view = 'saved', filters = EMPTY_FILTERS, refreshKey = 0, profileEvidence, onExplore }: {
 view?: OpportunityView; filters?: OpportunityFilters; refreshKey?: number; profileEvidence?: OpportunityProfileEvidence | null; onExplore?: () => void
}) {
 const [data, setData] = useState<Payload | null>(null)
 const [loading, setLoading] = useState(true)
 const [loadingMore, setLoadingMore] = useState(false)
 const [error, setError] = useState<ResultError | null>(null)
 const [moreError, setMoreError] = useState<string | null>(null)
 const [notice, setNotice] = useState<string | null>(null)
 const [retry, setRetry] = useState(0)
 const generation = useRef(0)
 const controller = useRef<AbortController | null>(null)
 const params = view === 'explore' ? opportunityFilterParams(filters) : new URLSearchParams()
 params.set('view', view)
 const requestUrl = '/api/a4/opportunities/for-me?' + params.toString()
 async function read(url: string, signal: AbortSignal): Promise<Payload> {
  const response = await fetch(url, { cache: 'no-store', signal })
  const body = await response.json()
  if (!response.ok) throw { message: body.error || 'No pudimos cargar las oportunidades.', status: response.status, code: body.code }
  if (!Array.isArray(body.opportunities)) throw { message: 'No pudimos cargar las oportunidades.' }
  return body
 }
 useEffect(() => { setNotice(null) }, [requestUrl, refreshKey])
 useEffect(() => {
  const current = ++generation.current
  const pending = new AbortController()
  controller.current?.abort(); controller.current = pending
  setLoading(true); setLoadingMore(false); setData(null); setError(null); setMoreError(null)
  read(requestUrl, pending.signal).then(body => {
   if (generation.current === current && !pending.signal.aborted) setData(body)
  }).catch(reason => {
   if (generation.current === current && !pending.signal.aborted) setError(reason)
  }).finally(() => { if (generation.current === current && !pending.signal.aborted) setLoading(false) })
  return () => { pending.abort(); controller.current?.abort() }
 }, [requestUrl, refreshKey, retry])
 async function loadMore() {
  if (!data?.pagination || data.pagination.next_offset === null || loadingMore) return
  const current = generation.current
  const pending = new AbortController()
  controller.current = pending; setLoadingMore(true); setMoreError(null)
  const next = new URLSearchParams(params)
  next.set('offset', String(data.pagination.next_offset)); next.set('snapshot', data.pagination.snapshot)
  try {
   const body = await read('/api/a4/opportunities/for-me?' + next.toString(), pending.signal)
   if (generation.current !== current || pending.signal.aborted) return
   setData(previous => {
    if (!previous) return previous
    const known = new Set(previous.opportunities.map(job => job.source + ':' + job.sourceId))
    return { ...body, opportunities: [...previous.opportunities, ...body.opportunities.filter(job => !known.has(job.source + ':' + job.sourceId))] }
   })
  } catch (reason) {
   if (generation.current !== current || pending.signal.aborted) return
   const failure = reason as ResultError
   if (failure.status === 401 || failure.status === 403) {
    setError(failure); setData(null)
   } else if (failure.code === 'inventory_changed') {
    setNotice('Las ofertas se actualizaron. Volvimos a cargar la primera página con los mismos filtros.')
    setRetry(value => value + 1)
   } else setMoreError('No pudimos cargar más ofertas. Las que ya abriste siguen disponibles; puedes reintentar.')
  } finally { if (generation.current === current && !pending.signal.aborted) setLoadingMore(false) }
 }
 if (loading) return <div role="status" className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"><p className="text-sm font-medium text-foreground">Cargando oportunidades…</p></div>
 if (error) return <Card className="border-border bg-card shadow-sm"><CardContent className="space-y-3 pt-6"><p role="alert" className="font-medium text-foreground">{error.status === 401 ? 'Tu sesión terminó.' : error.status === 403 ? 'A4 todavía no está disponible en tu recorrido.' : 'No pudimos cargar las oportunidades.'}</p>{error.status === 401 || error.status === 403 ? <Button asChild className="min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white"><Link href={error.status === 401 ? '/auth/signin' : '/despega'}>{error.status === 401 ? 'Volver a iniciar sesión' : 'Volver a mi recorrido'}</Link></Button> : <Button type="button" variant="outline" className="min-h-11" onClick={() => setRetry(value => value + 1)}>Reintentar</Button>}</CardContent></Card>
 if (!data) return null
 if (view === 'saved' && data.needs_intent) return <Card><CardContent className="space-y-3 pt-6"><h2 className="text-xl font-semibold">Todavía no tienes una búsqueda guardada</h2><p className="text-sm text-muted-foreground">Puedes explorar las ofertas actuales y guardar tus preferencias cuando quieras.</p><Button type="button" className="min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white" onClick={onExplore}>Explorar ofertas</Button></CardContent></Card>
 const applied = data.applied_filters ?? filters
 const anyMode = !applied.workModes.length || ['onsite', 'hybrid', 'remote'].every(mode => applied.workModes.includes(mode))
 const chips = [...(applied.targetRoles.length ? applied.targetRoles : ['Todos los cargos']), ...(applied.locations.length ? applied.locations : ['Todas las regiones']), ...(anyMode ? ['Cualquier modalidad'] : applied.workModes.map(mode => WORK_MODE_LABELS[mode as keyof typeof WORK_MODE_LABELS] || mode)), ...(applied.targetRoles.length ? [BREADTH_LABELS[applied.breadth]] : [])]
 return <section className="space-y-5" aria-labelledby="real-jobs-heading">
  <div className="space-y-3"><h2 id="real-jobs-heading" className="text-2xl font-semibold tracking-tight text-foreground">{view === 'saved' ? 'Resultados de mi búsqueda guardada' : 'Resultados de la exploración'}</h2>
   <p className="text-sm text-muted-foreground">{view === 'saved' ? 'Estos resultados usan tu búsqueda principal guardada.' : 'Estos resultados usan los filtros aplicados. Tu búsqueda guardada no cambia.'}</p>
   <div aria-label="Filtros aplicados" className="flex flex-wrap gap-2">{chips.map((label, index) => <span key={index} className="max-w-full break-words rounded-full bg-muted px-3 py-1.5 text-xs">{label}</span>)}</div>
   {!!data.opportunities.length && <p role="status" className="text-sm text-muted-foreground">Mostrando {data.opportunities.length} de {data.total_matching ?? data.count ?? data.opportunities.length} ofertas{data.scope?.limitReached ? ' del catálogo consultado' : ''}.</p>}
   {data.scope?.limitReached && <p className="text-xs text-muted-foreground">El catálogo consultado incluye hasta {data.scope.limit} ofertas verificadas recientes. Los conteos y filtros se aplican a ese conjunto.</p>}
   {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
  </div>
  {data.opportunities.length === 0 ? <Card className="border-dashed border-border bg-card shadow-none"><CardContent className="flex flex-col items-center px-6 py-10 text-center"><SearchX className="mb-4 h-6 w-6 text-muted-foreground" /><p className="font-semibold text-foreground">{data.inventory_status === 'empty' ? 'No hay ofertas verificadas disponibles en este momento' : view === 'saved' ? 'Tu búsqueda guardada no tiene coincidencias ahora' : 'No encontramos coincidencias con los filtros aplicados'}</p><p className="mt-2 max-w-lg text-sm text-muted-foreground">{data.inventory_status === 'empty' ? 'Vuelve a consultar más tarde. No necesitas cambiar tus filtros por este estado del catálogo.' : view === 'saved' ? 'Puedes explorar otras ofertas sin cambiar tu búsqueda guardada.' : 'Prueba otro cargo o quita un filtro y pulsa Ver ofertas. Solo incluimos una región o modalidad concreta cuando la fuente informa ese dato.'}</p>{view === 'saved' && onExplore && <Button type="button" variant="outline" className="mt-4 min-h-11" onClick={onExplore}>Explorar sin cambiar mi búsqueda</Button>}</CardContent></Card> : <div className="grid gap-4">{data.opportunities.map(job=><Card key={job.originalUrl} className="group overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md"><CardHeader className="pb-3"><CardTitle className="text-xl tracking-tight text-foreground">{job.title}</CardTitle><p className="mt-1 text-sm font-medium text-muted-foreground">{job.company}</p></CardHeader><CardContent className="space-y-4">
   <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">{job.location&&<span className="flex items-center gap-1"><MapPin className="h-4 w-4"/>{job.location}</span>}{job.workMode&&<span>{WORK_MODE_LABELS[job.workMode]}</span>}<PublishedDate value={job.publishedAt}/></div>
   <SourceDetails source={job.source} verifiedAt={job.lastVerifiedAt}/>
   {(job.description||job.requirements?.length||job.skills?.length)?<div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evidencia publicada por la fuente</p>
    {job.description&&<p className="line-clamp-4 text-sm leading-relaxed text-foreground">{job.description}</p>}
    {job.requirements?.length?<div><p className="text-sm font-semibold text-foreground">Requisitos informados</p><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{job.requirements.slice(0,4).map(item=><li key={item}>• {item}</li>)}</ul></div>:null}
    {job.skills?.length?<div className="flex flex-wrap gap-2">{job.skills.slice(0,8).map(skill=><span key={skill} className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground">{skill}</span>)}</div>:null}
   </div>:<p className="text-xs text-muted-foreground">Esta fuente no entregó requisitos estructurados. Revisa la publicación original antes de decidir.</p>}
   {(()=>{const evidence=evidenceFor(job,profileEvidence);return (evidence.roleAligned||evidence.strengths.length||evidence.gaps.length)?<div className="grid gap-3 sm:grid-cols-2">
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
     <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{evidence.strengths.length?'Evidencia relacionada':'Objetivo declarado'}</p>
     <ul className="mt-2 space-y-1 text-sm text-foreground">{evidence.roleAligned?<li>• Coincidencia de título con tu objetivo declarado: {profileEvidence?.targetRole}.</li>:null}{evidence.strengths.map(item=><li key={item}>• Evidencia de tu perfil relacionada: {item}</li>)}</ul>
    </div>
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
     <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">Antes de postular</p>
     {evidence.gaps.length?<ul className="mt-2 space-y-1 text-sm text-foreground">{evidence.gaps.map(item=><li key={item}>• Falta evidencia registrada sobre: {item}</li>)}</ul>:<p className="mt-2 text-sm text-foreground">{profileEvidence?.nextBestActions?.[0]||'Confirma en la publicación original los requisitos que no estén estructurados.'}</p>}
     {(evidence.gaps.length||profileEvidence?.nextBestActions?.length)?(()=>{const action=actionFor(evidence.gaps,profileEvidence?.nextBestActions?.[0]);return <Button asChild variant="outline" size="sm" className="mt-3 min-h-11"><Link href={action.href}>{action.label}<ArrowRight className="ml-2 h-3.5 w-3.5"/></Link></Button>})():null}
    </div>
   </div>:null})()}
   <Button asChild className="min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white"><a href={job.originalUrl} target="_blank" rel="noopener noreferrer">Ver oferta <ExternalLink className="ml-2 h-4 w-4"/></a></Button>
  </CardContent></Card>)}</div>}
  {data.pagination?.next_offset !== null && data.pagination?.next_offset !== undefined && <div className="space-y-2"><Button type="button" variant="outline" disabled={loadingMore} onClick={loadMore} className="min-h-11">{loadingMore ? 'Cargando más…' : moreError ? 'Reintentar cargar más' : 'Ver más ofertas'}</Button>{moreError && <p role="alert" className="text-sm text-muted-foreground">{moreError}</p>}</div>}
 </section>
}
