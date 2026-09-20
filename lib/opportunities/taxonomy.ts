export interface OpportunityCategory { key:string; label:string; terms:string[] }
export const OPPORTUNITY_CATEGORIES:OpportunityCategory[]=[
 {key:'commercial',label:'Comercial y Ventas',terms:['comercial','ventas','sales','account','ejecutivo de negocios','business development']},
 {key:'finance',label:'Finanzas',terms:['finanzas','financiero','tesoreria','contabilidad','contador','controller']},
 {key:'risk',label:'Riesgo y Crédito',terms:['riesgo','credito','cobranza','risk','credit']},
 {key:'operations',label:'Operaciones',terms:['operaciones','operacional','logistica','supply','abastecimiento']},
 {key:'technology',label:'Tecnología y Datos',terms:['software','developer','desarrollador','data','datos','tecnologia','ti ','ingeniero informatico','analytics']},
 {key:'people',label:'Personas y RR.HH.',terms:['recursos humanos','rrhh','people','talento','seleccion','remuneraciones']},
 {key:'marketing',label:'Marketing y Comunicaciones',terms:['marketing','comunicaciones','contenido','brand','producto']},
 {key:'legal',label:'Legal y Compliance',terms:['legal','abogado','compliance','cumplimiento','juridico']},
 {key:'administration',label:'Administración',terms:['administracion','administrativo','asistente','office']},
 {key:'engineering',label:'Ingeniería y Proyectos',terms:['ingeniero','ingenieria','proyectos','project','mantenimiento']},
]
const norm=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
export function categorizeOpportunity(title:string){const n=norm(title);return OPPORTUNITY_CATEGORIES.find(c=>c.terms.some(t=>n.includes(norm(t))))||{key:'other',label:'Otros',terms:[]}}
export function normalizeRoleTitle(title:string){return title.replace(/\s+/g,' ').replace(/\s*[-–|].*$/,'').trim()}
