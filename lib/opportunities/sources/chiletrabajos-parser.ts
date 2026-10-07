import { load } from 'cheerio'

export type ChileTrabajosWorkMode = 'remote' | 'hybrid' | 'onsite'

export interface ChileTrabajosPublicJob {
  source: 'chiletrabajos'
  sourceId: string
  title: string
  company: string
  location: string | null
  publishedAt: string | null
  expiresAt: string | null
  originalUrl: string
  description?: string
  workMode?: ChileTrabajosWorkMode | null
  verificationStatus: 'verified_active' | 'stale' | 'unavailable' | 'unknown'
}

export class ChileTrabajosProviderError extends Error {
  constructor(
    public readonly kind: 'invalid_request' | 'parse_failed' | 'unavailable',
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ChileTrabajosProviderError'
  }
}

function compact(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function normalized(value: string): string {
  return compact(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function sourceUrl(value: string): URL | null {
  try {
    const url = new URL(value)
    if (
      url.protocol !== 'https:' ||
      !['www.chiletrabajos.cl', 'chiletrabajos.cl'].includes(url.hostname.toLowerCase()) ||
      (url.port && url.port !== '443') ||
      url.username || url.password
    ) return null
    return url
  } catch {
    return null
  }
}

export function chileTrabajosIdFromUrl(value: string): string | null {
  const url = sourceUrl(value)
  if (!url) return null
  return url.pathname.match(/^\/trabajo\/(?:[^/]+-)?(\d{5,10})\/?$/i)?.[1] || null
}

export function isChileTrabajosJobUrl(value: string, id?: string): boolean {
  const found = chileTrabajosIdFromUrl(value)
  return Boolean(found && (!id || found === id))
}

export function isChileTrabajosListingUrl(value: string): boolean {
  const url = sourceUrl(value)
  return Boolean(url && /^\/encuentra-un-empleo\/?$/.test(url.pathname))
}

const CHILE_CLOCK = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Santiago', calendar: 'iso8601', numberingSystem: 'latn',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})

function localParts(timestamp: number): number[] {
  const parts = CHILE_CLOCK.formatToParts(new Date(timestamp))
  return ['year', 'month', 'day', 'hour', 'minute', 'second'].map(type => Number(parts.find(part => part.type === type)?.value))
}

function chileLocalTimestamp(parts: number[], millis: number): string | null {
  const [year, month, day, hour, minute, second] = parts
  const wallClockUtc = Date.UTC(year, month - 1, day, hour, minute, second, millis)
  const offsets = new Set<number>()
  // Read the actual IANA zone offsets around this date; never assume UTC-3 all year.
  for (const delta of [-36, 0, 36]) {
    const sample = Math.floor((wallClockUtc + delta * 3_600_000) / 1000) * 1000
    const [y, m, d, h, min, sec] = localParts(sample)
    offsets.add(Date.UTC(y, m - 1, d, h, min, sec) - sample)
  }
  const candidates = [...offsets].map(offset => wallClockUtc - offset).filter(candidate =>
    localParts(candidate).every((part, index) => part === parts[index]),
  ).sort((a, b) => a - b)
  // A nonexistent DST hour is unknown. For an ambiguous hour, use the earlier expiry.
  return candidates.length ? new Date(candidates[0]).toISOString() : null
}

export function normalizeChileTrabajosDate(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const raw = compact(value)
  let match = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?=$|[T\s(])/)
  let year: number
  let month: number
  let day: number
  if (match) {
    year = Number(match[1]); month = Number(match[2]); day = Number(match[3])
  } else {
    match = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?=$|[\s(])/)
    if (match) {
      day = Number(match[1]); month = Number(match[2]); year = Number(match[3])
    } else {
      const spanish = normalized(raw).match(/^(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})$/)
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      if (!spanish) return null
      day = Number(spanish[1]); month = months.indexOf(spanish[2]) + 1; year = Number(spanish[3])
    }
  }
  if (year < 2000 || year > 2200 || month < 1 || month > 12 || day < 1 || day > 31) return null
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  const ymd = [String(year).padStart(4, '0'), String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-')
  const time = raw.match(/^\d{4}-\d{2}-\d{2}[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:?\d{2})?$/i)
  if (time) {
    const hours = Number(time[1]), minutes = Number(time[2]), seconds = Number(time[3] || 0)
    const millis = Number((time[4] || '').padEnd(3, '0') || 0)
    if (hours > 23 || minutes > 59 || seconds > 59) return null
    if (time[5]) {
      const timestamp = new Date(ymd + 'T' + time[1] + ':' + time[2] + ':' + String(seconds).padStart(2, '0') + '.' + String(millis).padStart(3, '0') + time[5])
      return Number.isFinite(timestamp.getTime()) ? timestamp.toISOString() : null
    }
    return chileLocalTimestamp([year, month, day, hours, minutes, seconds], millis)
  }
  if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}/.test(raw) && !/^\d{1,2}[/-]\d{1,2}[/-]\d{4}(?:\s*\([^)]*\))?$/.test(raw)) return null
  if (/^\d{4}-\d{2}-\d{2}[T ]\d/.test(raw)) return null
  if (/^\d{4}-\d{2}-\d{2}/.test(raw) && !/^\d{4}-\d{2}-\d{2}(?:\s*\([^)]*\))?$/.test(raw)) return null
  return ymd
}

export function isChileTrabajosExpired(value: unknown, now = new Date()): boolean {
  const date = normalizeChileTrabajosDate(value)
  if (!date) return false
  if (date.length > 10) return new Date(date).getTime() <= now.getTime()
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = (type: string) => parts.find(part => part.type === type)?.value || ''
  const todayInChile = [get('year'), get('month'), get('day')].join('-')
  // A date-only expiry remains valid through the end of that Chilean day.
  return date < todayInChile
}

const AD_SELECTORS = [
  'script', 'style', 'noscript', 'iframe', 'ins', 'nav', 'footer',
  '.adsbygoogle', '.advertisement', '.advertising', '.publicidad', '.ad-container', '.botones-desc',
  '[id^="google_ads"]', '[id^="div-gpt-ad"]', '[aria-label="Publicidad"]',
].join(',')

function textFromHtml(html: string): string {
  const $ = load(html, null, false)
  $(AD_SELECTORS).remove()
  $('*').each((_, element) => {
    const node = $(element)
    if (!node.children().length && /^(?:publicidad|advertisement|anuncio patrocinado)$/i.test(compact(node.text()))) node.remove()
  })
  $('br, p, li, div, section, h1, h2, h3, h4').after('\n')
  return compact($.root().text())
}

function usefulDescription(value: string): boolean {
  return value.length >= 40 && value.split(/\s+/).length >= 6 &&
    !/^(?:publicidad|advertisement)(?:\s|$)/i.test(value)
}

function descriptionFromHtml($: ReturnType<typeof load>): string {
  const scope = $('#detalle-oferta').first()
  const select = (selector: string) => scope.length ? scope.find(selector) : $(selector)
  for (const selector of ['.job-item.detalle > .p-x-3.overflow-hidden > div > p.mb-0', '[itemprop="description"]', '#job-description', '#job_description', '#description', '.job-description', '.job_description', '.job-desc']) {
    for (const element of select(selector).toArray()) {
      const value = textFromHtml($(element).html() || '')
      if (usefulDescription(value)) return value
    }
  }
  const headings = select('h2,h3,h4,h5,legend').filter((_, element) =>
    /^(?:descripcion(?: de)?(?: la)?(?: oferta)?(?: de)?(?: trabajo|cargo|puesto)?|detalle(?:s)? del (?:cargo|trabajo))$/.test(normalized($(element).text())),
  )
  for (const heading of headings.toArray()) {
    let cursor = $(heading)
    // The heading may be wrapped. Never scan a whole page or a related-jobs section.
    for (let depth = 0; depth < 3; depth++) {
      let fragment = ''
      for (const sibling of cursor.nextAll().toArray()) {
        const node = $(sibling)
        if (node.is('h1,h2,h3,h4,h5,footer,nav,aside') ||
          node.find('h1,h2,h3,h4,h5').length ||
          /(?:related|similar|share|social|publicidad|advertisement)/i.test(node.attr('class') || '')) break
        fragment += $.html(sibling) || ''
        const value = textFromHtml(fragment)
        if (usefulDescription(value) && node.is('div,section,article')) return value
      }
      const value = textFromHtml(fragment)
      if (usefulDescription(value)) return value
      const parent = cursor.parent()
      if (!parent.length || parent.is('body,html,main')) break
      cursor = parent
    }
  }
  return ''
}

function readField($: ReturnType<typeof load>, labels: string[]): string {
  const scope = $('#detalle-oferta').first()
  const select = (selector: string) => scope.length ? scope.find(selector) : $(selector)
  const matches = (text: string) => labels.includes(normalized(text).replace(/[:\s]+$/, ''))
  for (const row of select('tr').toArray()) {
    const cells = $(row).children('th,td')
    if (cells.length > 1 && matches(cells.first().text())) return compact(cells.eq(1).text())
  }
  for (const element of select('dt').toArray()) {
    if (matches($(element).text())) return compact($(element).next('dd').text())
  }
  for (const element of select('label,strong,b,span,th,td,div').toArray()) {
    const node = $(element)
    if (!matches(node.text()) || node.text().length > 40) continue
    const sibling = compact(node.next().text())
    if (sibling && sibling.length <= 300 && !matches(sibling)) return sibling
    const parent = node.parent()
    if (parent.is('body,html,main,table,tbody,section,article')) continue
    const rest = compact(parent.clone().children().first().remove().end().end().text())
    if (rest && rest.length <= 300 && !matches(rest)) return rest
  }
  return ''
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function jobPostings($: ReturnType<typeof load>): Record<string, unknown>[] {
  const found: Record<string, unknown>[] = []
  const visit = (value: unknown, depth = 0) => {
    if (depth > 8 || found.length > 30) return
    if (Array.isArray(value)) { value.slice(0, 40).forEach(item => visit(item, depth + 1)); return }
    const item = record(value)
    if (!item) return
    const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']]
    if (types.includes('JobPosting')) found.push(item)
    if (item['@graph']) visit(item['@graph'], depth + 1)
    if (item.mainEntity) visit(item.mainEntity, depth + 1)
  }
  $('script[type="application/ld+json"]').each((_, element) => {
    try { visit(JSON.parse($(element).text())) } catch { /* HTML markers remain independently checkable. */ }
  })
  return found
}

function postingId(posting: Record<string, unknown>): string | null {
  const identifier = posting.identifier
  const value = record(identifier)?.value ?? identifier
  return (typeof value === 'string' || typeof value === 'number') && /^\d{5,10}$/.test(String(value)) ? String(value) : null
}

function postingLocation(posting: Record<string, unknown> | undefined): string {
  const entries = Array.isArray(posting?.jobLocation) ? posting.jobLocation : [posting?.jobLocation]
  const values = entries.flatMap(entry => {
    const address = record(record(entry)?.address)
    if (!address) return []
    const city = typeof address.addressLocality === 'string' ? address.addressLocality : ''
    const region = typeof address.addressRegion === 'string' ? address.addressRegion : ''
    return [compact([city, region].filter(Boolean).join(', '))].filter(Boolean)
  })
  return [...new Set(values)].join(' · ')
}

export function inferChileTrabajosWorkMode(
  explicitValue: string,
  description: string,
  jobLocationType?: unknown,
): ChileTrabajosWorkMode | null {
  const offered = new Set<ChileTrabajosWorkMode>()
  const denied = new Set<ChileTrabajosWorkMode>()
  const modeOf = (value: string): ChileTrabajosWorkMode =>
    /^hibrid[oa]$/.test(value) ? 'hybrid' : /^presencial$/.test(value) ? 'onsite' : 'remote'
  const modeWords = '(remot[oa]|teletrabajo|a distancia|presencial|hibrid[oa])'
  const affirmativePatterns = [
    new RegExp('\\b(?:modalidad|trabajo|jornada|cargo|puesto|esquema|formato|modelo|sistema)(?:\\s+(?:de|es|sera|en|trabajo)){0,3}\\s*[:=-]?\\s*(?:100\\s*%\\s*)?' + modeWords + '\\b', 'g'),
    new RegExp('\\b(?:ofrecemos|ofrece|incluye|incluimos|permite|permitimos)\\s+(?:(?:el|la|un|una|en|modalidad|de|trabajo)\\s+){0,4}(?:100\\s*%\\s*)?' + modeWords + '\\b', 'g'),
    new RegExp('^(?:100\\s*%\\s*)?' + modeWords + '(?:\\s+100\\s*%)?$', 'g'),
  ]
  const negative = /\b(?:no|sin|nunca|jamas|descarta(?:mos|n)?|descartad[oa]s?|excluye(?:n)?|excluimos|excluid[oa]s?|prohibe|prohibid[oa])\b/
  const historicalOrConditional = /\b(?:experiencia|anterior(?:es)?|previ[oa]s?|historial|conocimientos?|certificacion|formacion|capacitacion|cursos?|posibilidad|posible|opcion|opcional|eventual(?:mente)?|podria(?:n)?|podra(?:n)?|potencial(?:mente)?|preferencia|idealmente|deseable)\b/

  const inspectClause = (raw: string) => {
    const clause = normalized(raw).replace(/^[:=\s]+|[:=\s]+$/g, '')
    if (!clause) return
    if (negative.test(clause)) {
      // A negated clause never establishes a mode. Retain contradictions with
      // explicit fields/JobPosting so "TELECOMMUTE" + "no teletrabajo" is unknown.
      for (const match of clause.matchAll(new RegExp('\\b' + modeWords + '\\b', 'g'))) denied.add(modeOf(match[1]))
      return
    }
    // Mentions in previous experience, training or possible future benefits are
    // not an affirmative statement about the current offer.
    if (historicalOrConditional.test(clause)) return
    for (const pattern of affirmativePatterns) {
      pattern.lastIndex = 0
      for (const match of clause.matchAll(pattern)) offered.add(modeOf(match[1]))
    }
  }

  // Keep clauses separate: "Modalidad presencial. No hay teletrabajo" is onsite.
  // Colons remain inside a clause because they connect labels to their values.
  for (const clause of explicitValue.split(/[.!?;,\n]+/)) inspectClause(clause)
  for (const clause of description.split(/[.!?;,\n]+/)) inspectClause(clause)
  if (typeof jobLocationType === 'string' && jobLocationType.toUpperCase() === 'TELECOMMUTE') offered.add('remote')
  if (offered.size !== 1) return null
  const mode = [...offered][0]
  return denied.has(mode) ? null : mode
}

export function parseChileTrabajosJobHtml(
  html: string,
  id: string,
  originalUrl: string,
  now = new Date(),
): ChileTrabajosPublicJob {
  if (!/^\d{5,10}$/.test(id)) throw new ChileTrabajosProviderError('invalid_request', 'invalid_id', 'Invalid Chiletrabajos job ID')
  if (!isChileTrabajosJobUrl(originalUrl, id)) throw new ChileTrabajosProviderError('parse_failed', 'job_identity', 'Chiletrabajos job URL did not match the requested ID')
  const $ = load(html)
  const canonical = $('link[rel="canonical"]').attr('href')
  let canonicalMatches = false
  if (canonical) {
    let canonicalUrl: string
    try { canonicalUrl = new URL(canonical, originalUrl).toString() } catch { canonicalUrl = '' }
    if (!isChileTrabajosJobUrl(canonicalUrl, id)) throw new ChileTrabajosProviderError('parse_failed', 'job_identity', 'Chiletrabajos canonical URL did not match the requested ID')
    canonicalMatches = true
  }
  const visibleId = readField($, ['id']).match(/\d{5,10}/)?.[0]
  if (visibleId && visibleId !== id) throw new ChileTrabajosProviderError('parse_failed', 'job_identity', 'Chiletrabajos page ID did not match the requested ID')
  const postings = jobPostings($)
  const posting = postings.find(item => {
    const declaredId = postingId(item)
    const declaredUrl = typeof item.url === 'string' ? item.url : ''
    if (declaredId && declaredId !== id) return false
    if (declaredUrl && !isChileTrabajosJobUrl(declaredUrl, id)) return false
    return declaredId === id || Boolean(declaredUrl) || (postings.length === 1 && (visibleId === id || canonicalMatches))
  })
  const title = textFromHtml(typeof posting?.title === 'string' ? posting.title : $('h1').first().html() || '')
  if (!title || /^(?:chiletrabajos|iniciar sesion|ingresa a tu cuenta|buscar empleos?|access denied|just a moment|verifica(?:r)? tu identidad)/.test(normalized(title)) ||
    /(?:just a moment|access denied|attention required)/i.test($('title').text())) {
    throw new ChileTrabajosProviderError('parse_failed', 'payload_shape', 'Chiletrabajos job details were not recognized')
  }
  const companyRaw = record(posting?.hiringOrganization)?.name
  const company = compact(typeof companyRaw === 'string' ? textFromHtml(companyRaw) : readField($, ['buscado', 'empresa', 'empleador']))
  const location = compact(postingLocation(posting) || readField($, ['ubicacion', 'localidad', 'ciudad'])) || null
  const publishedRaw = posting?.datePosted || readField($, ['fecha', 'fecha de publicacion'])
  const expiresRaw = posting?.validThrough || readField($, ['expira', 'vence', 'fecha de expiracion'])
  const publishedAt = normalizeChileTrabajosDate(publishedRaw)
  const expiresAt = normalizeChileTrabajosDate(expiresRaw)
  const structuredDescription = typeof posting?.description === 'string' ? textFromHtml(posting.description) : ''
  const description = usefulDescription(structuredDescription) ? structuredDescription : descriptionFromHtml($)
  const offerScope = $('#detalle-oferta').first()
  const bodyText = textFromHtml((offerScope.length ? offerScope.html() : $('body').html()) || '')
  const explicitlyClosed = /\b(?:ha expirado|ha sido desactivad[oa]|oferta (?:expirada|finalizada|cerrada)|anuncio (?:expirado|finalizado|cerrado)|ya no (?:acepta|recibe) postulaciones)\b/i.test(normalized(bodyText))
  const identityConfirmed = visibleId === id || Boolean(posting) || canonicalMatches
  const complete = identityConfirmed && Boolean(company) && usefulDescription(description) &&
    Boolean(publishedAt || expiresAt || posting)
  const invalidExpiry = Boolean(expiresRaw) && !expiresAt
  const status = explicitlyClosed || isChileTrabajosExpired(expiresAt, now) ? 'stale' :
    complete && !invalidExpiry ? 'verified_active' : 'unknown'
  const url = new URL(originalUrl)
  // Provider tracking parameters and fragments are not part of an offer identity.
  url.search = ''; url.hash = ''
  return {
    source: 'chiletrabajos', sourceId: id, title, company: company || 'Empresa no informada',
    location, publishedAt, expiresAt, originalUrl: url.toString(),
    description: description || undefined,
    workMode: inferChileTrabajosWorkMode(readField($, ['modalidad', 'modalidad de trabajo']), description, posting?.jobLocationType),
    verificationStatus: status,
  }
}

export function parseChileTrabajosListingHtml(html: string, listingUrl: string): string[] {
  if (!isChileTrabajosListingUrl(listingUrl)) throw new ChileTrabajosProviderError('parse_failed', 'listing_identity', 'Chiletrabajos listing URL was not recognized')
  const $ = load(html)
  const ids: string[] = []
  for (const element of $('a[href]').toArray()) {
    const node = $(element)
    if (node.closest('nav,header,footer,aside').length) continue
    let url: string
    try { url = new URL(node.attr('href') || '', listingUrl).toString() } catch { continue }
    const id = chileTrabajosIdFromUrl(url)
    if (id && !ids.includes(id)) ids.push(id)
    if (ids.length >= 30) break
  }
  if (ids.length) return ids
  const text = normalized(textFromHtml($('body').html() || ''))
  const empty = /\b(?:no se encontraron|no encontramos|sin resultados|no hay ofertas|no hay empleos|ninguna oferta)\b/.test(text)
  const searchForm = $('form').toArray().some(element =>
    /encuentra-un-empleo/.test($(element).attr('action') || '') ||
    $(element).find('input[name="2"],input[name="q"],input[name="search"]').length > 0,
  )
  if (empty && (searchForm || /\b(?:ofertas|empleos|trabajos)\b/.test(text))) return []
  throw new ChileTrabajosProviderError('parse_failed', 'listing_shape', 'Chiletrabajos search results were not recognized')
}
