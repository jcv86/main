export interface OpportunityCategory { key:string; label:string; terms:string[] }
export const OPPORTUNITY_CATEGORIES:OpportunityCategory[]=[
 {key:'leadership',label:'Gerencia y Dirección',terms:['gerente general','gerente de','director','country manager','general manager','chief ','ceo','cfo','coo','cto']},
 {key:'commercial',label:'Comercial y Ventas',terms:['comercial','ventas','sales','account manager','key account','ejecutivo de negocios','business development','vendedor']},
 {key:'finance',label:'Finanzas y Contabilidad',terms:['finanzas','financiero','tesoreria','contabilidad','contador','controller','auditor']},
 {key:'risk',label:'Riesgo, Crédito y Cobranza',terms:['riesgo','credito','cobranza','risk','credit','fraude']},
 {key:'operations',label:'Operaciones y Logística',terms:['operaciones','operacional','logistica','supply','abastecimiento','bodega','distribucion']},
 {key:'technology',label:'Tecnología, Datos y Producto',terms:['software','developer','desarrollador','data','datos','tecnologia','informatica','programador','analytics','product manager','ux','cloud','devops']},
 {key:'people',label:'Personas y RR.HH.',terms:['recursos humanos','rrhh','people','talento','seleccion','remuneraciones','reclutamiento']},
 {key:'marketing',label:'Marketing y Comunicaciones',terms:['marketing','comunicaciones','contenido','brand','community','publicidad']},
 {key:'legal',label:'Legal y Compliance',terms:['legal','abogado','compliance','cumplimiento','juridico','fiscalia']},
 {key:'administration',label:'Administración y Servicio',terms:['administracion','administrativo','asistente','secretaria','recepcion','servicio al cliente','customer service']},
 {key:'engineering',label:'Ingeniería y Proyectos',terms:['ingeniero','ingenieria','proyectos','project manager','mantenimiento','construccion','mineria']},
 {key:'health',label:'Salud',terms:['medico','enfermer','salud','clinica','kinesi','tecnologo medico']},
 {key:'education',label:'Educación',terms:['docente','profesor','educador','academico','educacion']},
]
const norm=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+.# ]/g,' ').replace(/\s+/g,' ').trim()
export function categorizeOpportunity(title:string){const n=norm(title);return OPPORTUNITY_CATEGORIES.find(c=>c.terms.some(t=>n.includes(norm(t))))||{key:'other',label:'Otros',terms:[]}}
export function normalizeRoleTitle(title:string){return title.replace(/\s+/g,' ').replace(/\s*[-–|/]\s*(santiago|rm|region|remoto|hibrido).*$/i,'').trim()}
export function catalogFromJobs(jobs:{title:string}[]){const roles=new Map<string,number>();const areas=new Map<string,number>();for(const job of jobs){const role=normalizeRoleTitle(job.title);if(role)roles.set(role,(roles.get(role)||0)+1);const area=categorizeOpportunity(job.title).label;areas.set(area,(areas.get(area)||0)+1)}return {areas:[...areas].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label)),roles:[...roles].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label))}}
