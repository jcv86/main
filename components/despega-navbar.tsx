'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  ChevronDown,
  Home,
  CheckCircle2,
  MapPin,
  Zap,
  Radar,
  LogOut
} from 'lucide-react'

const stages = [
  {
    name: 'Información',
    icon: Home,
    routes: [
      { label: 'Bienvenida', href: '/despega/bienvenida' },
      { label: 'Dashboard', href: '/despega' },
    ]
  },
  {
    name: 'A1: El Ritual',
    icon: CheckCircle2,
    routes: [
      { label: 'Conozcámonos 1', href: '/despega/conozcamonos-1' },
      { label: 'Intro - Descubre Tu Perfil', href: '/despega/a1-cerebral-intro' },
      { label: 'Test de Perfil (28 preguntas)', href: '/despega/a1-cerebral' },
      { label: 'Tu Perfil Cerebral', href: '/despega/a1-report' },
    ]
  },
  {
    name: 'A2: Exploración',
    icon: MapPin,
    routes: [
      { label: 'Explora y Diseña Tu Ruta', href: '/despega/conozcamonos-2' },
      { label: 'Tu Ruta Personalizada', href: '/despega/a2-routes' },
    ]
  },
  {
    name: 'A3: Entrenamiento',
    icon: Zap,
    routes: [
      { label: 'Intro - Entrenamiento Intensivo', href: '/despega/a3-intro' },
      { label: 'Dashboard de Entrenamiento', href: '/despega/a3-dashboard' },
    ]
  },
  {
    name: 'A4: La Realidad',
    icon: Radar,
    routes: [
      { label: 'Intro - Ejecución y Contexto', href: '/despega/a4-intro' },
      { label: 'Dashboard - La Realidad', href: '/despega/a4' },
    ]
  },
]

export function DespeganNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/auth/signin')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/despega" className="flex items-center gap-2 font-bold text-lg text-purple-600 dark:text-purple-400">
            <Home className="w-5 h-5" />
            <span>Despega</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/despega">
              <Button 
                variant={pathname === '/despega' ? 'default' : 'ghost'}
                size="sm"
              >
                Dashboard
              </Button>
            </Link>

            {stages.map((stage) => (
              <div key={stage.name} className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <stage.icon className="w-4 h-4" />
                  {stage.name}
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {/* Dropdown */}
                <div className="absolute left-0 mt-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {stage.routes.map((route) => (
                    <Link key={route.href} href={route.href}>
                      <Button
                        variant={pathname === route.href ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start rounded-none first:rounded-t-lg last:rounded-b-lg"
                      >
                        {route.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex items-center gap-2">
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 max-h-96 overflow-y-auto">
            <Link href="/despega">
              <Button variant="ghost" className="w-full justify-start mb-2">
                Dashboard
              </Button>
            </Link>

            {stages.map((stage) => (
              <div key={stage.name}>
                <button
                  onClick={() => setExpandedStage(expandedStage === stage.name ? null : stage.name)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <stage.icon className="w-4 h-4" />
                    {stage.name}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${expandedStage === stage.name ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedStage === stage.name && (
                  <div className="ml-4 space-y-1">
                    {stage.routes.map((route) => (
                      <Link key={route.href} href={route.href}>
                        <Button
                          variant={pathname === route.href ? 'default' : 'ghost'}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          {route.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start gap-2 mt-4"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
