'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, MapPin, ShieldCheck, CalendarDays, SearchX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Opportunity {sourceId:string;title:string;company:string;location:string|null;publishedAt:string|null;expiresAt:string|null;originalUrl:string;verificationStatus:'verified_active'}
interface Payload {needs_intent:boolean;count?:number;source?:string;fetched_at?:string;query_plan?:string[];intent?:{target_roles:string[];breadth:string;locations:string[];work_modes:string[]};opportunities:Opportunity[]}

export function RealOpportunityResults({refreshKey=0}:{refreshKey?:number}) {
 const [data,setData]=useState<Payload|null>(null)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState<string|null>(null)
 useEffect(()=>{let active=true;(async()=>{setLoading(true);try{const r=await fetch('/api/a4/opportunities/for-me',{cache:'no-store'});const body=await r.json();if(!r.ok)throw new Error(body.error||'No pudimos cargar oportunidades.');if(active){setData(body);setError(null)}}catch(e){if(active)setError(e instanceof Error?e.message:'No pudimos cargar oportunidades.')}finally{if(active)setLoading(false)}})();return()=>{active=false}},[refreshKey])
 if(loading)return <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"><div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded-full bg-[hsl(var(--dtc-indigo-900))]"/><p className="text-sm font-medium text-foreground">Buscando oportunidades vigentes…</p><p className="mt-1 text-xs text-muted-foreground">Contrastamos tu dirección con fuentes verificables.</p></div>
 if(error)return <Card className="border-border bg-card shadow-sm"><CardContent className="pt-6"><p className="font-medium text-foreground">No pudimos actualizar las oportunidades.</p><p className="mt-1 text-sm text-muted-foreground">{error}</p></CardContent></Card>
 if(!data||data.needs_intent)return <Card><CardContent className="pt-6 text-sm text-slate-600">Confirma primero qué tipo de oportunidad quieres encontrar. No buscamos ni recomendamos cargos sin esa dirección.</CardContent></Card>
 return <section className="space-y-5" aria-labelledby="real-jobs-heading">
  <div><h2 id="real-jobs-heading" className="text-2xl font-semibold tracking-tight text-foreground">Oportunidades encontradas para tu búsqueda</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{data.count||0} publicaciones activas verificadas ahora. Fuente actual: Chiletrabajos. DTC no garantiza encaje ni resultado de una postulación.</p></div>
  {data.opportunities.length===0?<Card className="border-dashed border-border bg-card shadow-none"><CardContent className="flex flex-col items-center px-6 py-10 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted"><SearchX className="h-5 w-5 text-muted-foreground"/></div><p className="font-semibold text-foreground">Nada suficientemente relevante por ahora</p><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">No encontramos una publicación vigente con evidencia suficiente de relación con tu búsqueda. Ajusta tus cargos o amplía la búsqueda; no rellenaremos este espacio con ofertas irrelevantes.</p></CardContent></Card>:<div className="grid gap-4">{data.opportunities.map(job=><Card key={job.originalUrl} className="group overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md"><CardHeader className="pb-3"><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-xl tracking-tight text-foreground">{job.title}</CardTitle><p className="mt-1 text-sm font-medium text-muted-foreground">{job.company}</p></div><Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800"><ShieldCheck className="mr-1 h-3.5 w-3.5"/>Publicación activa</Badge></div></CardHeader><CardContent className="space-y-4">
   <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">{job.location&&<span className="flex items-center gap-1"><MapPin className="h-4 w-4"/>{job.location}</span>}{job.publishedAt&&<span className="flex items-center gap-1"><CalendarDays className="h-4 w-4"/>Publicada {job.publishedAt.split(' ')[0]}</span>}{job.expiresAt&&<span>Expira: {job.expiresAt.split(' ')[0]}</span>}</div>
   <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Por qué apareció</p><p className="mt-1">Coincide con una consulta derivada de los cargos que tú confirmaste. Todavía no afirmamos compatibilidad de habilidades porque esta fuente no entrega suficiente evidencia estructurada para hacerlo con rigor.</p></div>
   <Button asChild className="bg-[hsl(var(--dtc-indigo-900))] text-white hover:opacity-90"><a href={job.originalUrl} target="_blank" rel="noopener noreferrer">Ver publicación original <ExternalLink className="ml-2 h-4 w-4"/></a></Button>
  </CardContent></Card>)}</div>}
 </section>
}
