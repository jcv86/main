'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  despega: 'Inicio',
  gamificacion: 'Mi evolución',
  'conozcamonos-1': 'Conozcámonos',
  'a1-cerebral-intro': 'Despega Cerebral',
  'a1-cerebral': 'Despega Cerebral',
  'a1-report': 'Tu análisis personal',
  'conozcamonos-2': 'Objetivos profesionales',
  'a2-routes': 'Tu Ruta',
  a2: 'Tu Ruta',
  'a3-intro': 'Entrenamiento',
  a3: 'Entrenamiento',
  interview: 'Entrevista',
  'a4-intro': 'Radar Estratégico',
  a4: 'Radar Estratégico',
  'a4-documents': 'Documentos',
  'career-identity': 'Career Identity',
  settings: 'Configuración',
}

function humanize(segment: string) {
  const decoded = decodeURIComponent(segment)
  if (/^\d+$/.test(decoded)) return `Paso ${decoded}`

  return decoded
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function ShellBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (pathname === '/despega') return null

  const crumbs = segments.slice(1).map((segment, index) => {
    const href = `/${segments.slice(0, index + 2).join('/')}`
    return {
      href,
      label: routeLabels[segment] ?? humanize(segment),
    }
  })

  return (
    <nav aria-label="Ruta de navegación" className="mb-5 overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <li>
          <Link
            href="/despega"
            className="inline-flex items-center gap-1.5 rounded-[var(--dtc-radius-sm)] px-2 py-1.5 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            Inicio
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const current = index === crumbs.length - 1

          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-border" aria-hidden="true" />
              {current ? (
                <span aria-current="page" className="px-2 py-1.5 text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="rounded-[var(--dtc-radius-sm)] px-2 py-1.5 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
