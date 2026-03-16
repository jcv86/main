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
  BarChart3,
  LogOut
} from 'lucide-react'

const stages = [
  {
    name: 'A1: Origen',
    icon: CheckCircle2,
    routes: [
      { label: 'Conozcámonos 1', href: '/despega/conozcamonos-1' },
      { label: 'A1 Cerebral Assessment', href: '/despega/a1-cerebral' },
      { label: 'A1 Report', href: '/despega/a1-report' },
    ]
  },
  {
    name: 'A2: Ruta',
    icon: MapPin,
    routes: [
      { label: 'Conozcámonos 2', href: '/despega/conozcamonos-2' },
      { label: 'Rutas 30/60/90', href: '/despega/a2-routes' },
    ]
  },
  {
    name: 'A3: Impulso',
    icon: Zap,
    routes: [
      { label: 'Interview 0', href: '/despega/interview-0' },
      { label: 'Dashboard A3', href: '/despega/a3-dashboard' },
      { label: 'CV Builder', href: '/despega/cv-builder' },
      { label: 'Market Insights', href: '/despega/market-insights' },
      { label: 'Simulaciones', href: '/despega/interview-simulations' },
    ]
  },
  {
    name: 'A4: Radar',
    icon: Radar,
    routes: [
      { label: 'Radar & News', href: '/despega/a4-radar' },
    ]
  }
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

            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Admin
              </Button>
            </Link>
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

            <Link href="/admin/dashboard">
              <Button variant="ghost" className="w-full justify-start flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Admin
              </Button>
            </Link>

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
