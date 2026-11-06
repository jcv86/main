/** Isolation checks for the dedicated UAT deployment. Never relax Auth or RLS. */
export const PRODUCTION_SUPABASE_REF = 'dcfrbwxbejtbcouionna'
export const UAT_ENVIRONMENT_HEADER = 'X-DTC-Environment'
export const UAT_BACKEND_HEADER = 'X-DTC-UAT-Backend'

type Environment = Record<string, string | undefined>

export type UatEnvironment = {
  enabled: boolean
  valid: boolean
  projectRef: string | null
  appOrigin: string | null
  issues: string[]
}

function canonicalOrigin(value: string | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port
      || url.pathname !== '/' || url.search || url.hash) return null
    return url.origin
  } catch {
    return null
  }
}

export function isProductionAppOrigin(origin: string): boolean {
  try {
    const hostname = new URL(origin).hostname
    return hostname === 'despegatucarrera.com'
      || hostname === 'www.despegatucarrera.com'
      || hostname === 'despegatucarrera.pro'
      || hostname === 'www.despegatucarrera.pro'
      || (hostname.startsWith('v0-fork-of-despega-tu-carrera-clone')
        && hostname.endsWith('.vercel.app'))
  } catch {
    return true
  }
}

function legacyKeyRef(value: string | undefined): string | null {
  if (!value || value.split('.').length !== 3) return null
  try {
    const payload = value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')))
    return typeof decoded.ref === 'string' ? decoded.ref : null
  } catch {
    return null
  }
}

/** Diagnostics contain variable names and reasons, never credentials or values. */
export function inspectUatEnvironment(env: Environment, required = false): UatEnvironment {
  if (env.DTC_ENVIRONMENT !== 'uat') {
    return {
      enabled: false,
      valid: !required,
      projectRef: null,
      appOrigin: null,
      issues: required ? ['DTC_ENVIRONMENT must be uat.'] : [],
    }
  }

  const issues: string[] = []
  const projectRef = env.DTC_UAT_SUPABASE_REF || null
  if (!projectRef || !/^[a-z]{20}$/.test(projectRef) || projectRef === PRODUCTION_SUPABASE_REF) {
    issues.push('DTC_UAT_SUPABASE_REF must identify a separate UAT project.')
  }

  const supabaseOrigin = canonicalOrigin(env.NEXT_PUBLIC_SUPABASE_URL)
  if (!projectRef || supabaseOrigin !== `https://${projectRef}.supabase.co`) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL must match the declared UAT project.')
  }
  if (env.SUPABASE_URL && canonicalOrigin(env.SUPABASE_URL) !== supabaseOrigin) {
    issues.push('SUPABASE_URL must match NEXT_PUBLIC_SUPABASE_URL.')
  }

  const appOrigin = canonicalOrigin(env.NEXT_PUBLIC_APP_URL)
  if (!appOrigin || isProductionAppOrigin(appOrigin)) {
    issues.push('NEXT_PUBLIC_APP_URL must be the separate HTTPS UAT application origin.')
  }
  for (const name of ['NEXT_PUBLIC_SITE_URL', 'SITE_URL', 'NEXTAUTH_URL']) {
    if (env[name] && canonicalOrigin(env[name]) !== appOrigin) {
      issues.push(`${name} must match the UAT application origin.`)
    }
  }

  for (const name of ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) {
    if (!env[name]?.trim()) issues.push(`${name} is required for the UAT project.`)
    const keyRef = legacyKeyRef(env[name])
    if (keyRef && keyRef !== projectRef) issues.push(`${name} belongs to a different Supabase project.`)
  }

  // This application uses the Supabase HTTP clients. A dedicated UAT project
  // must not inherit direct PostgreSQL connections or public secret aliases.
  for (const name of Object.keys(env)) {
    if (!env[name]) continue
    if (name.startsWith('POSTGRES_') || name === 'DATABASE_URL') {
      issues.push(`${name} must not be inherited by this UAT deployment.`)
    }
  }
  for (const name of [
    'NEXT_PUBLIC_OPENAI_API_KEY', 'NEXT_PUBLIC_CRON_SECRET',
    'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
  ]) {
    if (env[name]) issues.push(`${name} must be absent in this UAT deployment.`)
  }

  return { enabled: true, valid: issues.length === 0, projectRef, appOrigin, issues }
}

/** Explicit reads also work in the Edge runtime; no secret is sent in headers. */
export function currentUatEnvironment(): UatEnvironment {
  return inspectUatEnvironment({
    DTC_ENVIRONMENT: process.env.DTC_ENVIRONMENT,
    DTC_UAT_SUPABASE_REF: process.env.DTC_UAT_SUPABASE_REF,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SITE_URL: process.env.SITE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_CRON_SECRET: process.env.NEXT_PUBLIC_CRON_SECRET,
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SERVICE_ROLE_KEY: process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  })
}

export function isAllowedUatRequestOrigin(
  origin: string,
  environment: UatEnvironment,
  vercelUrl?: string,
): boolean {
  if (!environment.enabled || !environment.valid || isProductionAppOrigin(origin)) return false
  const deploymentOrigin = vercelUrl ? canonicalOrigin(`https://${vercelUrl}`) : null
  return origin === environment.appOrigin || origin === deploymentOrigin
}

export function isDisabledUatExternalAction(pathname: string): boolean {
  return ['/api/cron', '/api/emails', '/api/contact'].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
