export interface OpportunityCategory {
  key: string
  label: string
  terms: string[]
}
export const OPPORTUNITY_CATEGORIES:OpportunityCategory[]=[
 {key:'leadership',label:'Gerencia y Dirección',terms:['gerente general','gerente de','director de','director comercial','director ejecutivo','country manager','general manager','chief executive','chief financial','chief operating','chief technology','ceo','cfo','coo','cto']},
 {key:'commercial',label:'Comercial y Ventas',terms:['comercial','ventas','sales','account manager','key account','ejecutivo de negocios','business development','vendedor']},
 {key:'finance',label:'Finanzas y Contabilidad',terms:['finanzas','financiero','tesoreria','contabilidad','contador','controller','auditor']},
 {key:'risk',label:'Riesgo, Crédito y Cobranza',terms:['riesgo','credito','cobranza','risk','credit','fraude']},
 {key:'operations',label:'Operaciones y Logística',terms:['operaciones','operacional','logistica','supply','abastecimiento','bodega','distribucion','conductor','conductora','chofer','repartidor']},
 {key:'technology',label:'Tecnología, Datos y Producto',terms:['software','developer','desarrollador','data','datos','tecnologia','informatica','programador','analytics','product manager','ux','cloud','devops']},
 {key:'people',label:'Personas y RR.HH.',terms:['recursos humanos','rrhh','people','talento','seleccion','remuneraciones','reclutamiento']},
 {key:'marketing',label:'Marketing y Comunicaciones',terms:['marketing','comunicaciones','contenido','brand','community','publicidad']},
 {key:'legal',label:'Legal y Compliance',terms:['legal','abogado','compliance','cumplimiento','juridico','fiscalia']},
 {key:'administration',label:'Administración y Servicio',terms:['administracion','administrativo','asistente','secretaria','recepcion','servicio al cliente','customer service']},
 {key:'engineering',label:'Ingeniería y Proyectos',terms:['ingeniero','ingenieria','proyectos','project manager','mantenimiento','construccion','mineria']},
 {key:'health',label:'Salud',terms:['medico','enfermer','salud','clinica','kinesi','tecnologo medico']},
 {key:'education',label:'Educación',terms:['docente','profesor','educador','academico','educacion']},
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

const LEADERSHIP_ACRONYMS = new Set(['ceo', 'cfo', 'coo', 'cto'])

export function categorizeOpportunity(title: string): OpportunityCategory {
  const selectedArea = resolveOpportunityCategory(title)
  if (selectedArea) return selectedArea
  const normalized = normalizeOpportunityText(title)
  const words = new Set(normalized.split(/[^a-z0-9]+/).filter(Boolean))
  return OPPORTUNITY_CATEGORIES.find(category => category.terms.some(term => {
    const normalizedTerm = normalizeOpportunityText(term)
    // CTO must not match "conductor", "arquitecto" or "proyectos".
    return LEADERSHIP_ACRONYMS.has(normalizedTerm)
      ? words.has(normalizedTerm)
      : normalized.includes(normalizedTerm)
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
