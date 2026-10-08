'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MapPin, CalendarDays, SearchX, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OpportunityProfileEvidence } from './opportunity-search-experience'
import { Button } from '@/components/ui/button'
import { OPPORTUNITY_SOURCE_LABELS, type OpportunitySource } from '@/lib/opportunities/types'
import { opportunityFilterParams, type OpportunityFilters, type OpportunityView } from '@/lib/opportunities/search-query'
import type { OpportunityMatch } from '@/lib/opportunities/matching'
import type { OpportunityFieldEvidence } from '@/lib/opportunities/opportunity-evidence'

interface Opportunity {
 sourceId: string
 title: string
 company: string
 location: string | null
 publishedAt: string | null
 expiresAt: string | null
 originalUrl: string
 verificationStatus: 'verified_active'
 description?: string | null
 requirements?: string[]
 skills?: string[]
 source?: string
 region?: string | null
 workMode?: 'onsite' | 'hybrid' | 'remote' | null
 lastVerifiedAt?: string
 match?: OpportunityMatch
 fieldEvidence?: OpportunityFieldEvidence[]
}
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
 return <span className="flex items-center gap-1"><CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0"/><span className="sr-only">Publicada el </span><time dateTime={normalized}>{label}</time></span>
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

function descriptionPreview(description: string) {
 const text = description.replace(/\s+/g, ' ').trim()
 if (text.length <= 240) return text
 const boundary = text.lastIndexOf(' ', 240)
 return text.slice(0, boundary >= 120 ? boundary : 240).trimEnd() + '…'
}

/** These labels are issued by the same server evaluation that included the offer. */
export function OpportunityMatchReasons({ match }: { match?: OpportunityMatch }) {
 if (!match?.reasons?.length) return null
 return <div className="rounded-xl border border-border bg-muted/20 p-4">
  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Por qué aparece</p>
  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-foreground">
   {match.reasons.map(reason => <li key={reason.code + ':' + reason.label} className="break-words">{reason.label}</li>)}
  </ul>
 </div>
}

function EvidenceExcerpt({ evidence, value }: { evidence?: OpportunityFieldEvidence; value: string }) {
 if (!evidence?.excerpt?.trim()) return null
 // Avoid repeating a structured field verbatim underneath the same field.
 if (evidence.excerpt.trim().toLocaleLowerCase('es-CL') === value.trim().toLocaleLowerCase('es-CL')) return null
 return <p className="mt-1.5 break-words text-xs leading-relaxed text-muted-foreground">
  <span className="font-medium">{evidence.origin === 'description' ? 'En la descripción: ' : 'Dato de la publicación: '}</span>
  <q>{evidence.excerpt}</q>
 </p>
}

/** Plain text only: no provider HTML and no additional request or saved action. */
export function PublishedOpportunityDetail({ job }: { job: Opportunity }) {
 const description = job.description?.trim() ?? ''
 const requirements = job.requirements?.filter(item => item.trim()) ?? []
 const skills = job.skills?.filter(item => item.trim()) ?? []
 const evidence = job.fieldEvidence ?? []
 const modeEvidence = job.workMode ? evidence.find(item =>
  item.field === 'workMode' && item.value === job.workMode
  && ![job.workMode, WORK_MODE_LABELS[job.workMode!].toLocaleLowerCase('es-CL')].includes(item.excerpt.trim().toLocaleLowerCase('es-CL')),
 ) : undefined
 return <div className="min-w-0 space-y-3">
  {description ? <p className="break-words text-sm leading-relaxed text-foreground">{descriptionPreview(description)}</p> : <p className="text-sm text-muted-foreground">No hay una descripción disponible en esta ficha.</p>}
  <details className="group/detail min-w-0 rounded-xl border border-border bg-muted/30">
   <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
    <span>Ver detalle<span className="sr-only"> de {job.title}</span></span>
    <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 group-open/detail:rotate-180" />
   </summary>
   <div className="min-w-0 space-y-5 border-t border-border p-4">
    <p className="text-xs leading-relaxed text-muted-foreground">Este detalle muestra el texto disponible de la publicación. Consulta el aviso original para revisar todas sus condiciones.</p>
    {modeEvidence && <div>
     <h4 className="text-sm font-semibold text-foreground">Modalidad informada</h4>
     <p className="mt-1 text-sm text-foreground">{WORK_MODE_LABELS[job.workMode!]}</p>
     <EvidenceExcerpt evidence={modeEvidence} value={WORK_MODE_LABELS[job.workMode!]} />
    </div>}
    <div>
     <h4 className="text-sm font-semibold text-foreground">Descripción del aviso</h4>
     {description ? <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">{description}</p> : <p className="mt-2 text-sm text-muted-foreground">No informada en esta ficha.</p>}
    </div>
    <div>
     <h4 className="text-sm font-semibold text-foreground">Requisitos informados</h4>
     {requirements.length ? <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
      {requirements.map((item, index) => <li key={index + ':' + item} className="break-words">
       {item}
       <EvidenceExcerpt evidence={evidence.find(proof => proof.field === 'requirements' && proof.value === item)} value={item} />
      </li>)}
     </ul> : <p className="mt-2 text-sm text-muted-foreground">No identificados en esta ficha. Revisa la descripción y el aviso original.</p>}
    </div>
    <div>
     <h4 className="text-sm font-semibold text-foreground">Habilidades informadas</h4>
     {skills.length ? <ul className="mt-2 space-y-3 text-sm text-foreground">
      {skills.map((skill, index) => <li key={index + ':' + skill} className="min-w-0">
       <span className="inline-block max-w-full break-words rounded-lg bg-background px-2.5 py-1">{skill}</span>
       <EvidenceExcerpt evidence={evidence.find(proof => proof.field === 'skills' && proof.value === skill)} value={skill} />
      </li>)}
     </ul> : <p className="mt-2 text-sm text-muted-foreground">No identificadas en esta ficha. Revisa la descripción y el aviso original.</p>}
    </div>
   </div>
  </details>
 </div>
}

export function RealOpportunityResults({ view = 'saved', filters = EMPTY_FILTERS, refreshKey = 0, onExplore }: {
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
  {data.opportunities.length === 0 ? <Card className="border-dashed border-border bg-card shadow-none"><CardContent className="flex flex-col items-center px-6 py-10 text-center"><SearchX aria-hidden="true" className="mb-4 h-6 w-6 text-muted-foreground" /><p className="font-semibold text-foreground">{data.inventory_status === 'empty' ? 'No hay ofertas verificadas disponibles en este momento' : view === 'saved' ? 'Tu búsqueda guardada no tiene coincidencias ahora' : 'No encontramos coincidencias con los filtros aplicados'}</p><p className="mt-2 max-w-lg text-sm text-muted-foreground">{data.inventory_status === 'empty' ? 'Vuelve a consultar más tarde. No necesitas cambiar tus filtros por este estado del catálogo.' : view === 'saved' ? 'Puedes explorar otras ofertas sin cambiar tu búsqueda guardada.' : 'Prueba otro cargo o quita un filtro y pulsa Ver ofertas. Solo incluimos una región o modalidad concreta cuando la fuente informa ese dato.'}</p>{view === 'saved' && onExplore && <Button type="button" variant="outline" className="mt-4 min-h-11" onClick={onExplore}>Explorar sin cambiar mi búsqueda</Button>}</CardContent></Card> : <div className="grid min-w-0 gap-4">{data.opportunities.map(job=><Card key={job.originalUrl} className="group min-w-0 overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md"><CardHeader className="pb-3"><CardTitle className="break-words text-xl tracking-tight text-foreground">{job.title}</CardTitle><p className="mt-1 break-words text-sm font-medium text-muted-foreground">{job.company}</p></CardHeader><CardContent className="min-w-0 space-y-4">
   <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><span className="flex min-w-0 items-start gap-1"><MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0"/><span className="break-words">{job.location?.trim() || 'Ubicación: No informada en esta ficha'}</span></span><span>{job.workMode ? WORK_MODE_LABELS[job.workMode] : 'Modalidad: No informada en esta ficha'}</span><PublishedDate value={job.publishedAt}/></div>
   <SourceDetails source={job.source} verifiedAt={job.lastVerifiedAt}/>
   <OpportunityMatchReasons match={job.match}/>
   <PublishedOpportunityDetail job={job}/>
   <Button asChild className="min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white"><a href={job.originalUrl} target="_blank" rel="noopener noreferrer">Ver oferta <span className="sr-only">original de {job.title} (abre otra pestaña)</span><ExternalLink aria-hidden="true" className="ml-2 h-4 w-4 shrink-0"/></a></Button>
  </CardContent></Card>)}</div>}
  {data.pagination?.next_offset !== null && data.pagination?.next_offset !== undefined && <div className="space-y-2"><Button type="button" variant="outline" disabled={loadingMore} onClick={loadMore} className="min-h-11">{loadingMore ? 'Cargando más…' : moreError ? 'Reintentar cargar más' : 'Ver más ofertas'}</Button>{moreError && <p role="alert" className="text-sm text-muted-foreground">{moreError}</p>}</div>}
 </section>
}
