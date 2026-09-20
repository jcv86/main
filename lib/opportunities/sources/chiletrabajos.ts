export interface ChileTrabajosPublicJob {
  source: 'chiletrabajos'
  sourceId: string
  title: string
  company: string
  location: string | null
  publishedAt: string | null
  expiresAt: string | null
  originalUrl: string
  verificationStatus: 'verified_active' | 'stale' | 'unavailable' | 'unknown'
}

function decode(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export async function probeChileTrabajosJob(id: string): Promise<ChileTrabajosPublicJob> {
  if (!/^\d{5,10}$/.test(id)) throw new Error('invalid Chiletrabajos job id')
  const originalUrl = `https://www.chiletrabajos.cl/trabajo/${id}`
  const response = await fetch(originalUrl, {
    headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'DespegaTuCarrera/1.0 (+https://www.despegatucarrera.com)' },
    cache: 'no-store',
    redirect: 'follow',
  })
  if (!response.ok) throw new Error(`Chiletrabajos unavailable: ${response.status} ${response.statusText}`)
  const html = await response.text()
  const title = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
  const company = decode(html.match(/Buscado\s*<\/[^>]+>\s*<[^>]+>([\s\S]*?)<\//i)?.[1] || html.match(/<h3[^>]*>\s*(?:<[^>]+>)*\s*([^,<]+),/i)?.[1] || '')
  const location = decode(html.match(/Ubicaci[oó]n\s*<\/[^>]+>\s*<[^>]+>([\s\S]*?)<\//i)?.[1] || '') || null
  const date = decode(html.match(/Fecha\s*<\/[^>]+>\s*<[^>]+>([\s\S]*?)<\//i)?.[1] || '') || null
  const expires = decode(html.match(/Expira\s*<\/[^>]+>\s*<[^>]+>([\s\S]*?)<\//i)?.[1] || '') || null
  const expired = /ha expirado|ha sido desactivado/i.test(html)
  if (!title) throw new Error('Chiletrabajos payload shape not recognized')
  return {
    source: 'chiletrabajos',
    sourceId: id,
    title,
    company: company || 'Empresa no informada',
    location,
    publishedAt: date,
    expiresAt: expires,
    originalUrl: response.url || originalUrl,
    verificationStatus: expired ? 'stale' : 'verified_active',
  }
}
