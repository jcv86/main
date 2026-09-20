'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Breadth='precise'|'related'|'exploratory'
const BREADTHS:{value:Breadth;title:string;copy:string}[]=[
 {value:'precise',title:'Exacta',copy:'Cargos muy parecidos a los que buscas.'},
 {value:'related',title:'Flexible',copy:'También considera cargos relacionados.'},
 {value:'exploratory',title:'Amplia',copy:'Incluye otras opciones que podrían interesarte.'},
]

export function SearchIntentForm({seedRole,onSaved}:{seedRole?:string|null;onSaved?:()=>void}) {
 const [roles,setRoles]=useState<string[]>(seedRole?.trim()?[seedRole.trim()]:[])
 const [role,setRole]=useState('')
 const [breadth,setBreadth]=useState<Breadth>('related')
 const [location,setLocation]=useState('Santiago')
 const [modes,setModes]=useState<string[]>(['hybrid','remote'])
 const [saving,setSaving]=useState(false)
 const [message,setMessage]=useState<string|null>(null)

 function addRole(){const value=role.trim();if(value&&!roles.some(r=>r.toLowerCase()===value.toLowerCase()))setRoles(v=>[...v,value]);setRole('')}
 async function submit(event:FormEvent){event.preventDefault();setMessage(null);if(!roles.length){setMessage('Agrega al menos un cargo.');return}setSaving(true)
  try{const response=await fetch('/api/a4/search-intents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({targetRoles:roles,breadth,locations:location.trim()?[location.trim()]:[],workModes:modes,isPrimary:true})});const data=await response.json();if(!response.ok)throw new Error(data.error||'No pudimos realizar la búsqueda.');setMessage(null);onSaved?.()}
  catch(error){setMessage(error instanceof Error?error.message:'No pudimos realizar la búsqueda.')}finally{setSaving(false)}
 }
 return <Card className="overflow-hidden border-border bg-card shadow-sm"><CardHeader><CardTitle className="text-2xl">¿Qué trabajo estás buscando?</CardTitle><p className="text-sm text-muted-foreground">Puedes buscar uno o varios cargos.</p></CardHeader><CardContent><form onSubmit={submit} className="space-y-7">
  <div><label className="text-sm font-semibold text-foreground">Cargo</label><div className="mt-3 flex flex-wrap gap-2">{roles.map(r=><button type="button" key={r} onClick={()=>setRoles(v=>v.filter(x=>x!==r))} className="rounded-full border border-border bg-muted px-3 py-1.5 text-sm text-foreground">{r} <span aria-hidden>×</span></button>)}</div><div className="mt-3 flex gap-2"><input value={role} onChange={e=>setRole(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addRole()}}} placeholder="Ej.: Analista de Riesgo" className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"/><Button type="button" variant="outline" onClick={addRole}>Agregar</Button></div></div>
  <fieldset><legend className="text-sm font-semibold text-foreground">Tipo de búsqueda</legend><div className="mt-3 grid gap-3 md:grid-cols-3">{BREADTHS.map(item=><label key={item.value} className={`cursor-pointer rounded-xl border p-4 ${breadth===item.value?'border-[hsl(var(--dtc-indigo-300))] bg-muted/60 ring-1 ring-[hsl(var(--dtc-indigo-300))]':'border-border bg-card'}`}><input className="sr-only" type="radio" name="breadth" value={item.value} checked={breadth===item.value} onChange={()=>setBreadth(item.value)}/><span className="font-semibold text-foreground">{item.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.copy}</span></label>)}</div></fieldset>
  <div className="grid gap-5 md:grid-cols-2"><div><label className="text-sm font-semibold text-foreground">Ubicación</label><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Ciudad o región" className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"/></div><fieldset><legend className="text-sm font-semibold text-foreground">Modalidad</legend><div className="mt-3 flex flex-wrap gap-3">{[['onsite','Presencial'],['hybrid','Híbrido'],['remote','Remoto'],['flexible','Cualquiera']].map(([value,label])=><label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={modes.includes(value)} onChange={()=>setModes(v=>v.includes(value)?v.filter(x=>x!==value):[...v,value])}/>{label}</label>)}</div></fieldset></div>
  {message&&<p role="status" className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-foreground">{message}</p>}
  <Button disabled={saving} className="bg-[hsl(var(--dtc-indigo-900))] text-white hover:opacity-90">{saving?'Buscando…':'Buscar oportunidades'}</Button>
 </form></CardContent></Card>
}
