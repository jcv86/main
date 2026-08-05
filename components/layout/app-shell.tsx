'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import useSWR from 'swr'
import {
  BarChart3,
  Brain,
  Briefcase,
  Check,
  ChevronRight,
  Circle,
  Compass,
  FileText,
  Home,
  LogOut,
  Menu,
  Radar,
  Settings,
  Sparkles,
  Target,
  UserCircle,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  match?: (pathname: string) => boolean
  journeyIndex?: number
}

type NavGroup = {
  label: string
  items: NavItem[]
}

type XPData = {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  daily_streak: number
}

type RouteContext = {
  eyebrow: string
  title: string
  description: string
}

const fetcher = (url: string) => fetch(url).then((response) => response.json())

const navigation: NavGroup[] = [
  {
    label: 'Tu espacio',
    items: [
      { label: 'Inicio', href: '/despega', icon: Home, match: (pathname) => pathname === '/despega' },
      { label: 'Mi evolución', href: '/despega/gamificacion', icon: BarChart3 },
    ],
  },
  {
    label: 'Tu recorrido',
    items: [
      {
        label: 'A1 · Despega Cerebral',
        href: '/despega/a1-cerebral-intro',
        icon: Brain,
        journeyIndex: 0,
        match: (pathname) =>
          pathname.includes('conozcamonos-1') || pathname.includes('a1-cerebral') || pathname.includes('a1-report'),
      },
      {
        label: 'A2 · Tu Ruta',
        href: '/despega/conozcamonos-2',
        icon: Compass,
        journeyIndex: 1,
        match: (pathname) => pathname.includes('conozcamonos-2') || pathname.includes('/a2'),
      },
      {
        label: 'A3 · Entrenamiento',
        href: '/despega/a3-intro',
        icon: Target,
        journeyIndex: 2,
        match: (pathname) => pathname.includes('/a3') || pathname.includes('interview'),
      },
      {
        label: 'A4 · Radar Estratégico',
        href: '/despega/a4-intro',
        icon: Radar,
        journeyIndex: 3,
        match: (pathname) => pathname.includes('/a4'),
      },
    ],
  },
  {
    label: 'Identidad profesional',
    items: [
      { label: 'Career Identity', href: '/despega/career-identity', icon: Sparkles },
      { label: 'Documentos', href: '/despega/a4-documents', icon: FileText },
      { label: 'Configuración', href: '/despega/settings', icon: Settings },
    ],
  },
]

const routeContexts: Array<{ match: (pathname: string) => boolean; context: RouteContext }> = [
  {
    match: (pathname) => pathname === '/despega',
    context: {
      eyebrow: 'Inicio',
      title: 'Tu centro de evolución profesional',
      description: 'Revisa tu avance y continúa desde el siguiente paso relevante.',
    },
  },
  {
    match: (pathname) =>
      pathname.includes('conozcamonos-1') || pathname.includes('a1-cerebral') || pathname.includes('a1-report'),
    context: {
      eyebrow: 'A1 · Despega Cerebral',
      title: 'Comprende cómo piensas y trabajas',
      description: 'Convierte autoconocimiento en evidencia útil para tu desarrollo.',
    },
  },
  {
    match: (pathname) => pathname.includes('conozcamonos-2') || pathname.includes('/a2'),
    context: {
      eyebrow: 'A2 · Tu Ruta',
      title: 'Construye una ruta con dirección',
      description: 'Organiza prioridades, hábitos y acciones conectadas con tu objetivo.',
    },
  },
  {
    match: (pathname) => pathname.includes('/a3') || pathname.includes('interview'),
    context: {
      eyebrow: 'A3 · Entrenamiento',
      title: 'Practica antes del momento decisivo',
      description: 'Entrena respuestas, criterio y confianza con situaciones profesionales reales.',
    },
  },
  {
    match: (pathname) => pathname.includes('/a4'),
    context: {
      eyebrow: 'A4 · Radar Estratégico',
      title: 'Observa el mercado con contexto',
      description: 'Conecta señales externas con decisiones concretas para tu carrera.',
    },
  },
  {
    match: (pathname) => pathname.includes('career-identity'),
    context: {
      eyebrow: 'Career Identity',
      title: 'Tu identidad profesional en evolución',
      description: 'Reúne habilidades, evidencia, decisiones y progreso en un solo lugar.',
    },
  },
  {
    match: (pathname) => pathname.includes('gamificacion'),
    context: {
      eyebrow: 'Mi evolución',
      title: 'Mide avance, no actividad vacía',
      description: 'Observa consistencia, evidencia y progreso acumulado en tu recorrido.',
    },
  },
  {
    match: (pathname) => pathname.includes('settings'),
    context: {
      eyebrow: 'Configuración',
      title: 'Administra tu experiencia',
      description: 'Controla tu perfil y las preferencias asociadas a tu recorrido.',
    },
  },
]

function isActive(item: NavItem, pathname: string) {
  return item.match ? item.match(pathname) : pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function getJourneyIndex(pathname: string) {
  const journeyItems = navigation[1].items
  return journeyItems.findIndex((item) => isActive(item, pathname))
}

function getRouteContext(pathname: string): RouteContext {
  return (
    routeContexts.find((entry) => entry.match(pathname))?.context ?? {
      eyebrow: 'DespegaTuCarrera',
      title: 'Tu sistema de evolución profesional',
      description: 'Avanza con dirección, práctica y evidencia conectada.',
    }
  )
}

function ShellNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const currentJourneyIndex = getJourneyIndex(pathname)

  return (
    <nav aria-label="Navegación principal" className="space-y-7">
      {navigation.map((group) => (
        <section key={group.label} aria-labelledby={`nav-${group.label.replaceAll(' ', '-').toLowerCase()}`}>
          <h2
            id={`nav-${group.label.replaceAll(' ', '-').toLowerCase()}`}
            className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {group.label}
          </h2>
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(item, pathname)
              const completed =
                item.journeyIndex !== undefined && currentJourneyIndex >= 0 && item.journeyIndex < currentJourneyIndex
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex min-h-11 items-center gap-3 rounded-[var(--dtc-radius-md)] px-3 py-2.5 text-sm font-medium outline-none transition-[background-color,color,transform] duration-180 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    active
                      ? 'bg-[hsl(var(--primary)/0.14)] text-foreground shadow-[var(--dtc-shadow-inset)]'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--dtc-radius-sm)] border transition-colors',
                      active
                        ? 'border-[hsl(var(--primary)/0.32)] bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--dtc-indigo-300))]'
                        : completed
                          ? 'border-[hsl(var(--success)/0.28)] bg-[hsl(var(--success)/0.1)] text-success'
                          : 'border-transparent bg-muted/50 text-muted-foreground group-hover:border-border group-hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.journeyIndex !== undefined ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-label={active ? 'En progreso' : completed ? 'Etapa anterior' : 'Pendiente'}>
                      {active ? (
                        <Circle className="h-2.5 w-2.5 fill-current text-[hsl(var(--dtc-indigo-300))]" />
                      ) : completed ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Circle className="h-2.5 w-2.5 text-muted-foreground/55" />
                      )}
                    </span>
                  ) : (
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-180',
                        active
                          ? 'translate-x-0 text-[hsl(var(--dtc-indigo-300))]'
                          : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                      )}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthRedirect()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const routeContext = getRouteContext(pathname)

  const isDemoUser = typeof window !== 'undefined' && localStorage.getItem('demo_user') !== null
  const { data: xpData } = useSWR<XPData>(isDemoUser ? null : '/api/gamification/global', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 5000,
    dedupingInterval: 2000,
  })

  React.useEffect(() => setMobileOpen(false), [pathname])

  React.useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      menuButtonRef.current?.focus()
    }
  }, [mobileOpen])

  const progress = xpData?.xp_to_next_level
    ? Math.min(100, Math.round((xpData.total_xp / xpData.xp_to_next_level) * 100))
    : 0

  const handleLogout = async () => {
    localStorage.removeItem('demo_user')
    document.cookie = 'demo_user=; path=/; max-age=0'
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } finally {
      router.replace('/auth/signin')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-[var(--dtc-radius-sm)] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/88 backdrop-blur-xl lg:pl-72">
        <div className="flex min-h-16 items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir navegación"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {routeContext.eyebrow}
            </p>
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">{routeContext.title}</p>
            <p className="hidden truncate text-xs text-muted-foreground xl:block">{routeContext.description}</p>
          </div>

          <div className="hidden min-w-48 items-center gap-3 sm:flex">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-semibold text-muted-foreground">
                <span>Nivel {xpData?.current_level ?? 1}</span>
                <span>{xpData?.daily_streak ?? 0} días</span>
              </div>
              <Progress value={progress} aria-label="Progreso al siguiente nivel" />
            </div>
          </div>

          <Button variant="ghost" size="icon" aria-label="Perfil" asChild>
            <Link href="/despega/settings">
              <UserCircle className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-border bg-card/92 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--dtc-radius-md)] bg-primary text-primary-foreground shadow-[var(--dtc-shadow-sm)]">
            <Briefcase className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-tight">DespegaTuCarrera</p>
            <p className="text-xs text-muted-foreground">Evolución con evidencia</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <ShellNavigation pathname={pathname} />
        </div>
        <div className="border-t border-border p-4">
          <div className="mb-3 rounded-[var(--dtc-radius-md)] border border-border bg-background/50 p-3">
            <p className="truncate text-sm font-semibold">{user?.email ?? 'Sesión de demostración'}</p>
            <p className="mt-1 text-xs text-muted-foreground">Tu información permanece conectada a tu recorrido.</p>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación móvil"
        >
          <button
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-label="Cerrar navegación"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(88vw,22rem)] flex-col border-r border-border bg-card shadow-[var(--dtc-shadow-xl)]">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div>
                <p className="text-sm font-bold">DespegaTuCarrera</p>
                <p className="text-xs text-muted-foreground">Tu recorrido</p>
              </div>
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar navegación"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <ShellNavigation pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-border p-4">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] outline-none">
          <div className="mx-auto w-full max-w-[var(--dtc-content-max,88rem)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>
        <footer className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          DespegaTuCarrera · Potenciado por N3uralia
        </footer>
      </div>
    </div>
  )
}
