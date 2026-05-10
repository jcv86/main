import { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface ASectionProps {
  title: string
  subtitle: string
  icon: string
  colorClass: string
  children: ReactNode
}

interface ASectionPart {
  title: string
  icon: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

export function ASection({ title, subtitle, icon, colorClass, children }: ASectionProps) {
  return (
    <div className="min-h-screen bg-background text-white p-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header - Improved */}
        <div className="mb-20">
          <div className="flex items-start gap-8 mb-8">
            <span className="text-7xl flex-shrink-0">{icon}</span>
            <div className="flex-1">
              <h1 className="text-6xl md:text-7xl leading-tight mb-4" style={{ color: 'rgb(80, 160, 170)', fontWeight: '200' }}>
                {title}
              </h1>
              <p className="text-2xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{subtitle}</p>
            </div>
          </div>
          <div className="h-1.5 w-40 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}></div>
        </div>

        {children}
      </div>
    </div>
  )
}

export function ASectionPart({ title, icon, children, defaultOpen = true }: ASectionPart) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="text-4xl flex-shrink-0" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>{icon}</div>
        <h2 className="text-4xl text-white" style={{ fontWeight: '300' }}>{title}</h2>
      </div>
      
      <div className="bg-background">
        {children}
      </div>
    </div>
  )
}
