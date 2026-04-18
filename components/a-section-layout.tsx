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
    <div className="min-h-screen bg-slate-950 text-white p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">{icon}</span>
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                {title}
              </h1>
              <p className="text-lg text-muted/40 mt-2">{subtitle}</p>
            </div>
          </div>
          <div className="h-1 w-24 rounded-[20px] bg-background"></div>

        {children}
      </div>
    </div>
  )
}

export function ASectionPart({ title, icon, children, defaultOpen = true }: ASectionPart) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl text-purple/40">{icon}</div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
      
      <div className="bg-background">
        {children}
      </div>
    </div>
  )
}
