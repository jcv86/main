import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

export type A4SourceVerificationStatus =
  | 'verified'
  | 'restricted'
  | 'unavailable'
  | 'not_applicable'

export type A4SourceAuthority = 'official' | 'requires_corroboration' | 'documented_internal'

export interface A4SourceVerification {
  status: A4SourceVerificationStatus
  authority: A4SourceAuthority
  checkedAt: string
  httpStatus: number | null
  finalUrl: string | null
  note: string
}

export class A4SourceVerificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'A4SourceVerificationError'
  }
}

const OFFICIAL_HOSTS = new Set([
  'bcentral.cl',
  'ine.gob.cl',
  'sence.cl',
  'chileatiende.gob.cl',
  'oecd.org',
  'worldbank.org',
  'ilo.org',
])

function isOfficialHostname(hostname: string): boolean {
  return (
    hostname.endsWith('.gob.cl') ||
    hostname.endsWith('.gov') ||
    hostname.endsWith('.gov.uk') ||
    hostname.endsWith('.europa.eu') ||
    [...OFFICIAL_HOSTS].some(
      (official) => hostname === official || hostname.endsWith(`.${official}`),
    )
  )
}

function isPrivateIpv4(address: string): boolean {
  const parts = address.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true
  const [a, b] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  )
}

export function isPrivateNetworkAddress(address: string): boolean {
  const normalized = address.toLowerCase().split('%')[0]
  if (normalized.startsWith('::ffff:')) {
    return isPrivateIpv4(normalized.slice(7))
  }
  if (isIP(normalized) === 4) return isPrivateIpv4(normalized)
  if (isIP(normalized) !== 6) return true
  return (
    normalized === '::' ||
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe8') ||
    normalized.startsWith('fe9') ||
    normalized.startsWith('fea') ||
    normalized.startsWith('feb')
  )
}

export function parseSafePublicSourceUrl(input: string): URL {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new A4SourceVerificationError('La URL de la fuente no es válida.')
  }
  const hostname = url.hostname.toLowerCase()
  if (url.protocol !== 'https:') {
    throw new A4SourceVerificationError('La fuente externa debe usar HTTPS.')
  }
  if (url.username || url.password) {
    throw new A4SourceVerificationError('La URL no puede incluir credenciales.')
  }
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname === 'example.com' ||
    hostname.endsWith('.example.com')
  ) {
    throw new A4SourceVerificationError('Usa una fuente pública real, no una dirección local o de ejemplo.')
  }
  if (isIP(hostname) && isPrivateNetworkAddress(hostname)) {
    throw new A4SourceVerificationError('La fuente debe estar alojada en una red pública.')
  }
  url.hash = ''
  return url
}

async function assertPublicHostname(hostname: string): Promise<void> {
  if (isIP(hostname)) return
  let addresses: Array<{ address: string }>
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true })
  } catch {
    throw new A4SourceVerificationError('No pudimos resolver el dominio de la fuente.')
  }
  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => isPrivateNetworkAddress(address))
  ) {
    throw new A4SourceVerificationError('El dominio de la fuente no apunta a una red pública segura.')
  }
}

async function requestSource(url: URL, method: 'HEAD' | 'GET'): Promise<Response> {
  await assertPublicHostname(url.hostname.toLowerCase())
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)
  try {
    return await fetch(url, {
      method,
      redirect: 'manual',
      cache: 'no-store',
      headers:
        method === 'GET'
          ? { Range: 'bytes=0-0', 'User-Agent': 'DespegaTuCarrera-SourceCheck/1.0' }
          : { 'User-Agent': 'DespegaTuCarrera-SourceCheck/1.0' },
      signal: controller.signal,
    })
  } catch {
    throw new A4SourceVerificationError('La fuente no respondió dentro del tiempo esperado.')
  } finally {
    clearTimeout(timeout)
  }
}

export async function verifyExternalSourceUrl(
  input: string,
  now = new Date(),
): Promise<A4SourceVerification> {
  let current = parseSafePublicSourceUrl(input)

  for (let redirects = 0; redirects <= 3; redirects += 1) {
    let response = await requestSource(current, 'HEAD')
    if (response.status === 405 || response.status === 501) {
      response = await requestSource(current, 'GET')
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) {
        throw new A4SourceVerificationError('La fuente redirige sin indicar un destino.')
      }
      current = parseSafePublicSourceUrl(new URL(location, current).toString())
      continue
    }

    const authority: A4SourceAuthority = isOfficialHostname(current.hostname.toLowerCase())
      ? 'official'
      : 'requires_corroboration'
    if (response.ok) {
      return {
        status: 'verified',
        authority,
        checkedAt: now.toISOString(),
        httpStatus: response.status,
        finalUrl: current.toString(),
        note:
          authority === 'official'
            ? 'Enlace disponible en un dominio oficial reconocido.'
            : 'Enlace disponible; contrasta su contenido con una fuente primaria u oficial.',
      }
    }
    if (response.status === 401 || response.status === 403) {
      return {
        status: 'restricted',
        authority,
        checkedAt: now.toISOString(),
        httpStatus: response.status,
        finalUrl: current.toString(),
        note: 'El servidor respondió, pero exige autorización o restringe verificadores automáticos.',
      }
    }
    throw new A4SourceVerificationError(
      `La fuente respondió con estado HTTP ${response.status}; corrige el enlace antes de guardarlo.`,
    )
  }

  throw new A4SourceVerificationError('La fuente excede el máximo seguro de redirecciones.')
}

export function nonExternalSourceVerification(
  now = new Date(),
): A4SourceVerification {
  return {
    status: 'not_applicable',
    authority: 'documented_internal',
    checkedAt: now.toISOString(),
    httpStatus: null,
    finalUrl: null,
    note: 'Documento u observación identificada mediante una referencia verificable.',
  }
}
