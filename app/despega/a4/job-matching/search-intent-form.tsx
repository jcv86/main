'use client'

import { FormEvent, useState } from 'react'
import { Search, MapPin, Briefcase, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const REGIONS=['Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso','Metropolitana','O’Higgins','Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes']
const MODES=[['onsite','Presencial'],['hybrid','Híbrido'],['remote','Remoto']] as const

function Chips({values,onRemove}:{values:string[];onRemove:(v:string)=>void}){return <div className="flex flex-wrap gap-1.5">{values.map(v=><span key={v} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">{v}<button type="button" onClick={()=>onRemove(v)} aria-label={`Quitar ${v}`}><X className="h-3 w-3"/></button></span>)}</div>}

export function SearchIntentForm({seedRole,onSaved}:{seedRole?:string|null;onSaved?:()=>void}) {
 const [roles,setRoles]=useState<string[]>(seedRole?.trim()?[seedRole.trim()]:[])
 const [role,setRole]=useState('')
 const [regions,setRegions]=useState<string[]>(['Metropolitana'])
 const [modes,setModes]=useState<string[]>(['hybrid','remote'])
 const [saving,setSaving]=useState(false)
 const [message,setMessage]=useState<string|null>(null)
 function addRole(){const v=role.trim();if(v&&!roles.some(r=>r.toLowerCase()===v.toLowerCase()))setRoles(x=>[...x,v]);setRole('')}
 function toggle(value:string,setter:React.Dispatch<React.SetStateAction<string[]>>){setter(xs=>xs.includes(value)?xs.filter(x=>x!==value):[...xs,value])}
 async function submit(event:FormEvent){event.preventDefault();setMessage(null);if(!roles.length){setMessage('Agrega al menos un cargo o área.');return}setSaving(true)
  try{const response=await fetch('/api/a4/search-intents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({targetRoles:roles,breadth:'related',locations:regions,workModes:modes.length?modes:['onsite','hybrid','remote'],isPrimary:true})});const data=await response.json();if(!response.ok)throw new Error(data.error||'No pudimos realizar la búsqueda.');onSaved?.()}
  catch(error){setMessage(error instanceof Error?error.message:'No pudimos realizar la búsqueda.')}finally{setSaving(false)}
 }
 return <Card className="overflow-visible border-border/80 bg-card shadow-sm"><CardHeader className="pb-5"><div className="flex items-start gap-3"><div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--dtc-indigo-900))] text-white sm:flex"><Search className="h-5 w-5"/></div><div><CardTitle className="text-2xl tracking-tight">¿Qué trabajo estás buscando?</CardTitle><p className="mt-1 text-sm text-muted-foreground">Puedes elegir uno o varios cargos, regiones y modalidades.</p></div></div></CardHeader>
 <CardContent><form onSubmit={submit} className="space-y-5"><div className="grid gap-4 xl:grid-cols-[1.15fr_1fr_1fr]">
  <div className="space-y-2"><label className="text-sm font-medium">Cargos o áreas</label><div className="flex gap-2"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><input value={role} onChange={e=>setRole(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addRole()}}} placeholder="Ej.: Analista de Riesgo" className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm"/></div><Button type="button" variant="outline" className="h-11 rounded-xl" onClick={addRole}>Agregar</Button></div><Chips values={roles} onRemove={v=>setRoles(x=>x.filter(i=>i!==v))}/></div>
  <div className="space-y-2"><label className="text-sm font-medium">Regiones</label><details className="group relative"><summary className="flex h-11 cursor-pointer list-none items-center rounded-xl border border-input bg-background px-3 text-sm"><MapPin className="mr-2 h-4 w-4 text-muted-foreground"/><span className="truncate">{regions.length?regions.join(', '):'Todas las regiones'}</span></summary><div className="absolute left-0 z-30 mt-2 max-h-80 min-w-full overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-popover p-2 shadow-xl">{REGIONS.map(r=><label key={r} className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm leading-5 hover:bg-muted [&>input]:h-4 [&>input]:w-4 [&>input]:shrink-0"><input type="checkbox" checked={regions.includes(r)} onChange={()=>toggle(r,setRegions)}/>{r}</label>)}</div></details><Chips values={regions} onRemove={v=>setRegions(x=>x.filter(i=>i!==v))}/></div>
  <div className="space-y-2"><label className="text-sm font-medium">Modalidad</label><details className="group relative"><summary className="flex h-11 cursor-pointer list-none items-center rounded-xl border border-input bg-background px-3 text-sm"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/><span className="truncate">{modes.length?MODES.filter(([v])=>modes.includes(v)).map(([,l])=>l).join(', '):'Cualquier modalidad'}</span></summary><div className="absolute left-0 z-30 mt-2 min-w-full overflow-hidden rounded-xl border border-border bg-popover p-2 shadow-xl"><label className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm leading-5 hover:bg-muted [&>input]:h-4 [&>input]:w-4 [&>input]:shrink-0"><input type="checkbox" checked={modes.length===0} onChange={()=>setModes([])}/>Cualquier modalidad</label>{MODES.map(([v,l])=><label key={v} className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm leading-5 hover:bg-muted [&>input]:h-4 [&>input]:w-4 [&>input]:shrink-0"><input type="checkbox" checked={modes.includes(v)} onChange={()=>toggle(v,setModes)}/>{l}</label>)}</div></details><Chips values={MODES.filter(([v])=>modes.includes(v)).map(([,l])=>l)} onRemove={label=>{const found=MODES.find(([,l])=>l===label);if(found)setModes(x=>x.filter(i=>i!==found[0]))}}/></div>
 </div>
 {message&&<p role="status" className="text-sm text-destructive">{message}</p>}
 <div className="flex justify-end"><Button disabled={saving} className="h-11 rounded-xl bg-[hsl(var(--dtc-indigo-900))] px-7 text-white hover:opacity-90"><Search className="mr-2 h-4 w-4"/>{saving?'Buscando…':'Buscar oportunidades'}</Button></div>
 </form></CardContent></Card>
}
