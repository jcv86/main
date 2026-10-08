export interface OpportunityCategory {
  key: string
  label: string
  terms: string[]
}
export const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
 {key:'leadership',label:'Gerencia y Dirección',terms:['gerente general','gerente de','gerenta de','subgerente de','director de','directora de','director of','director comercial','director ejecutivo','country manager','general manager','chief executive','chief financial','chief operating','chief technology','ceo','cfo','coo','cto']},
 {key:'commercial',label:'Comercial y Ventas',terms:['comercial','comerciales','venta','ventas','sales','account manager','account executive','key account','ejecutivo de negocios','ejecutiva de negocios','ejecutivo de cuentas','ejecutiva de cuentas','business development','vendedor','vendedora','vendedores']},
 {key:'finance',label:'Finanzas y Contabilidad',terms:['finanzas','financiero','financiera','financieros','financieras','finance','financial','tesoreria','treasury','contabilidad','contable','contador','contadora','accounting','accountant','controller','auditor','auditora','audit']},
 {key:'risk',label:'Riesgo, Crédito y Cobranza',terms:['riesgo','riesgos','credito','creditos','cobranza','cobranzas','risk','credit','fraude','fraud','collections']},
 {key:'operations',label:'Operaciones y Logística',terms:['operaciones','operacional','operations','logistica','logistico','logisticas','logisticos','logistics','supply','abastecimiento','procurement','purchasing','bodega','warehouse','distribucion','distribution','conductor','conductora','chofer','repartidor','repartidora','driver','operario','operaria']},
 {key:'technology',label:'Tecnología, Datos y Producto',terms:['software','developer','developers','desarrollador','desarrolladora','data','datos','tecnologia','technology','informatica','informatico','programador','programadora','analytics','business intelligence','product manager','product owner','product lead','ux','cloud','devops','frontend','front end','backend','back end','full stack','ciberseguridad','cybersecurity','machine learning','inteligencia artificial','artificial intelligence','software tester','test automation']},
 {key:'people',label:'Personas y RR.HH.',terms:['recursos humanos','rrhh','rr hh','human resources','hr','hrbp','people','talento','talent','seleccion','remuneraciones','reclutamiento','reclutador','reclutadora','recruiter','recruitment','recruiting','payroll','compensation']},
 {key:'marketing',label:'Marketing y Comunicaciones',terms:['marketing','comunicaciones','communications','comunicacion','contenido','content writer','content strategist','brand','community','publicidad','public relations']},
 {key:'legal',label:'Legal y Compliance',terms:['legal','abogado','abogada','lawyer','attorney','counsel','paralegal','compliance','cumplimiento','juridico','juridica','fiscalia']},
 {key:'administration',label:'Administración y Servicio',terms:['administracion','administrativo','administrativa','administration','administrative','asistente','assistant','secretaria','secretario','secretary','recepcion','recepcionista','receptionist','servicio al cliente','atencion al cliente','customer service','customer support','customer success']},
 {key:'engineering',label:'Ingeniería y Proyectos',terms:['ingeniero','ingeniera','ingenieria','engineer','engineering','proyectos','project manager','project management','mantenimiento','maintenance','construccion','construction','mineria','mining']},
 {key:'health',label:'Salud',terms:['medico','medica','enfermero','enfermera','enfermeria','salud','clinica','clinico','kinesiologo','kinesiologa','kinesiologia','tecnologo medico','tecnologa medica','nurse','nursing','physician','medical','healthcare','health']},
 {key:'education',label:'Educación',terms:['docente','profesor','profesora','educador','educadora','academico','academica','educacion','teacher','teaching','professor','educator','education']},
]

export const OTHER_OPPORTUNITY_CATEGORY: OpportunityCategory = { key: 'other', label: 'Otros', terms: [] }

export function normalizeOpportunityText(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '').replace(/[^a-z0-9+.# ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function categoryIdentity(value: string): string {
  return normalizeOpportunityText(value).replace(/[^a-z0-9]/g, '')
}

/** A selected area is an identifier, not a job title to classify again. */
export function resolveOpportunityCategory(value: string): OpportunityCategory | null {
  const identity = categoryIdentity(value)
  if (!identity) return null
  return [...OPPORTUNITY_CATEGORIES, OTHER_OPPORTUNITY_CATEGORY].find(category =>
    categoryIdentity(category.key) === identity || categoryIdentity(category.label) === identity
  ) || null
}

export function categorizeOpportunity(title: string): OpportunityCategory {
  const selectedArea = resolveOpportunityCategory(title)
  if (selectedArea) return selectedArea
  const words = (value: string) => ' ' + normalizeOpportunityText(value).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' '
  const normalized = words(title)
  return OPPORTUNITY_CATEGORIES.find(category => category.terms.some(term => {
    // Occupation phrases, including acronyms, must have complete token boundaries.
    // "UX" in auxiliar and "sales" in Salesforce are not occupational evidence.
    return normalized.includes(words(term))
  })) || OTHER_OPPORTUNITY_CATEGORY
}

export function normalizeRoleTitle(title: string): string {
  return title.replace(/\s+/g, ' ').replace(/\s*[-–|/]\s*(santiago|rm|region|remoto|hibrido).*$/i, '').trim()
}

export function catalogFromJobs(jobs: { title: string }[]) {
  const roles = new Map<string, number>()
  const areas = new Map<string, number>()
  for (const job of jobs) {
    const role = normalizeRoleTitle(job.title)
    if (role) roles.set(role, (roles.get(role) || 0) + 1)
    const area = categorizeOpportunity(job.title).label
    areas.set(area, (areas.get(area) || 0) + 1)
  }
  const byCount = (a: { label: string; count: number }, b: { label: string; count: number }) =>
    b.count - a.count || a.label.localeCompare(b.label)
  return {
    areas: [...areas].map(([label, count]) => ({ label, count })).sort(byCount),
    roles: [...roles].map(([label, count]) => ({ label, count })).sort(byCount),
  }
}

const CHILE_REGIONS = [
  ['Arica y Parinacota', ['arica', 'parinacota']],
  ['Tarapacá', ['iquique', 'tarapaca', 'alto hospicio']],
  ['Antofagasta', ['antofagasta', 'calama']],
  ['Atacama', ['copiapo', 'atacama', 'vallenar']],
  ['Coquimbo', ['la serena', 'coquimbo', 'ovalle']],
  ['Valparaíso', ['valparaiso', 'vina del mar', 'quilpue', 'villa alemana']],
  ['Metropolitana', ['santiago', 'metropolitana', 'rm', 'las condes', 'providencia', 'vitacura', 'maipu', 'pudahuel', 'quilicura', 'nunoa', 'puente alto']],
  ['O’Higgins', ['rancagua', 'ohiggins', 'san fernando']],
  ['Maule', ['talca', 'curico', 'maule', 'linares']],
  ['Ñuble', ['chillan', 'nuble']],
  ['Biobío', ['concepcion', 'talcahuano', 'biobio', 'los angeles']],
  ['La Araucanía', ['temuco', 'araucania']],
  ['Los Ríos', ['valdivia', 'los rios']],
  ['Los Lagos', ['puerto montt', 'osorno', 'los lagos', 'castro']],
  ['Aysén', ['coyhaique', 'aysen']],
  ['Magallanes', ['punta arenas', 'magallanes']],
] as const

function regionsInText(value: string): string[] {
  const normalized = ' ' + normalizeOpportunityText(value).replace(/[^a-z0-9 ]/g, ' ') + ' '
  return CHILE_REGIONS.filter(([region, terms]) =>
    [region, ...terms].some(term => normalized.includes(' ' + normalizeOpportunityText(term) + ' '))
  ).map(([region]) => region)
}

/** Unknown or conflicting locations remain unknown; words such as "comercial" are not cities. */
export function inferChileRegion(location: string | null, title?: string): string | null {
  const locations = regionsInText(location || '')
  if (locations.length) return locations.length === 1 ? locations[0] : null
  // Legacy callers may explicitly opt into title inference. Index readers use location only.
  const titles = regionsInText(title || '')
  return titles.length === 1 ? titles[0] : null
}

export function resolveChileRegion(value: string): string | null {
  return inferChileRegion(value)
}

export function regionCatalogFromJobs(jobs: { location: string | null; region?: string | null }[]) {
  const counts = new Map<string, number>()
  for (const job of jobs) {
    const region = inferChileRegion(job.location)
    if (region) counts.set(region, (counts.get(region) || 0) + 1)
  }
  return [...counts].map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}
