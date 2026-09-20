'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Breadth='precise'|'related'|'exploratory'
const BREADTHS:{value:Breadth;title:string;copy:string}[]=[
 {value:'precise',title:'Precisa',copy:'Prioriza cargos muy parecidos a los que escribas.'},
 {value:'related',title:'Relacionada',copy:'Incluye cargos adyacentes que podrían tener sentido para tu objetivo.'},
 {value:'exploratory',title:'Exploratoria',copy:'Abre caminos cercanos para descubrir opciones que quizás no habías considerado.'},
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
 async function submit(event:FormEvent){event.preventDefault();setMessage(null);if(!roles.length){setMessage('Agrega al menos un cargo o dirección profesional.');return}setSaving(true)
  try{const response=await fetch('/api/a4/search-intents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({targetRoles:roles,breadth,locations:location.trim()?[location.trim()]:[],workModes:modes,isPrimary:true})});const data=await response.json();if(!response.ok)throw new Error(data.error||'No fue posible guardar tu búsqueda.');setMessage('Búsqueda guardada. Ya estamos buscando oportunidades reales.');onSaved?.()}
  catch(error){setMessage(error instanceof Error?error.message:'No fue posible guardar tu búsqueda.')}finally{setSaving(false)}
 }
 return <Card className="border-slate-200 shadow-sm"><CardHeader><p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Tu búsqueda laboral</p><CardTitle className="text-2xl">¿Qué tipo de oportunidad quieres encontrar ahora?</CardTitle><p className="max-w-3xl text-sm text-slate-600">Ya conocemos parte de tu recorrido. Confirma o ajusta hacia dónde quieres orientar la búsqueda. Tú decides el objetivo; DTC sólo ayuda a traducirlo a las distintas fuentes.</p></CardHeader><CardContent><form onSubmit={submit} className="space-y-7">
  <div><label className="text-sm font-semibold text-slate-900">Cargos o direcciones que te interesan</label><div className="mt-3 flex flex-wrap gap-2">{roles.map(r=><button type="button" key={r} onClick={()=>setRoles(v=>v.filter(x=>x!==r))} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900">{r} <span aria-hidden>×</span></button>)}</div><div className="mt-3 flex gap-2"><input value={role} onChange={e=>setRole(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addRole()}}} placeholder="Ej.: Gerente de Riesgo" className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm"/><Button type="button" variant="outline" onClick={addRole}>Agregar</Button></div><p className="mt-2 text-xs text-slate-500">Puedes agregar varios. Toca uno para quitarlo.</p></div>
  <fieldset><legend className="text-sm font-semibold text-slate-900">¿Qué tan amplia quieres la búsqueda?</legend><div className="mt-3 grid gap-3 md:grid-cols-3">{BREADTHS.map(item=><label key={item.value} className={`cursor-pointer rounded-xl border p-4 ${breadth===item.value?'border-emerald-500 bg-emerald-50':'border-slate-200 bg-white'}`}><input className="sr-only" type="radio" name="breadth" value={item.value} checked={breadth===item.value} onChange={()=>setBreadth(item.value)}/><span className="font-semibold text-slate-900">{item.title}</span><span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.copy}</span></label>)}</div></fieldset>
  <div className="grid gap-5 md:grid-cols-2"><div><label className="text-sm font-semibold text-slate-900">¿Dónde trabajarías?</label><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Ciudad, región o Chile" className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"/></div><fieldset><legend className="text-sm font-semibold text-slate-900">Modalidad</legend><div className="mt-3 flex flex-wrap gap-3">{[['onsite','Presencial'],['hybrid','Híbrido'],['remote','Remoto'],['flexible','Me da igual']].map(([value,label])=><label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={modes.includes(value)} onChange={()=>setModes(v=>v.includes(value)?v.filter(x=>x!==value):[...v,value])}/>{label}</label>)}</div></fieldset></div>
  {message&&<p role="status" className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}
  <Button disabled={saving} className="bg-emerald-700 text-white hover:bg-emerald-800">{saving?'Guardando…':'Buscar oportunidades para mí'}</Button>
 </form></CardContent></Card>
}
