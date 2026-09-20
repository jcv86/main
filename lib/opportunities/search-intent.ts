export type SearchBreadth='precise'|'related'|'exploratory'
export interface CareerSearchIntent { targetRoles:string[]; breadth:SearchBreadth; locations:string[]; workModes:string[] }
const ADJACENT:Record<string,string[]>={
  'riesgo':['crédito','risk manager','credit manager','control de riesgo'],
  'crédito':['riesgo','credit manager','riesgo crediticio'],
  'operaciones':['operations manager','jefe de operaciones','excelencia operacional'],
  'finanzas':['finance manager','planificación financiera','fp&a','control de gestión'],
  'producto':['product manager','product owner','product lead'],
}
export function planOpportunityQueries(intent:CareerSearchIntent):string[]{
 const exact=[...new Set(intent.targetRoles.map(v=>v.trim()).filter(Boolean))]
 if(intent.breadth==='precise') return exact.slice(0,8)
 const adjacent=exact.flatMap(role=>{
   const lower=role.toLowerCase()
   return Object.entries(ADJACENT).flatMap(([key,values])=>lower.includes(key)?values:[])
 })
 const exploratory=intent.breadth==='exploratory'?exact.flatMap(role=>[
   role.replace(/subgerente/ig,'gerente'),
   role.replace(/jefe/ig,'gerente'),
   role.replace(/gerente/ig,'head'),
 ]):[]
 return [...new Set([...exact,...adjacent,...exploratory].map(v=>v.trim()).filter(Boolean))].slice(0,16)
}
