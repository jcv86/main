'use client'

import { useSharedContext } from '@/contexts/shared-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function A2A4IntegrationPanel() {
  const { context } = useSharedContext()

  if (!context.a2_mission && context.a4_relevant_news.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-950/30 dark:to-cyan-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Tu Plan + Contexto del Mercado
        </CardTitle>
        <CardDescription>
          Cómo se conectan A2 y A4 para potenciar tu transformación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* A2 SIDE */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">Tu Plan (A2)</h4>
            {context.a2_mission ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {context.a2_mission}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">Crea tu misión en A2</p>
            )}
          </div>

          {/* CONNECTION ARROW */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple/40" />
              <span className="text-xs font-semibold text-purple-600 dark:text-purple/40 text-center">
                Se retroalimentan
              </span>
              <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple/40 rotate-180" />
            </div>
          </div>

          {/* A4 SIDE */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-4 border border-cyan-200 dark:border-cyan-800">
            <h4 className="font-bold text-cyan-900 dark:text-cyan-100 mb-2">Contexto (A4)</h4>
            {context.a4_relevant_news.length > 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {context.a4_relevant_news[0]}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">Explora noticias en A4</p>
            )}
          </div>
        </div>

        {/* WHY TOGETHER */}
        <div className="bg-purple-100 dark:bg-purple/30 rounded-[28px] p-3 text-sm text-slate-700 dark:text-slate-300 space-y-2">
          <p className="font-semibold text-purple-900 dark:text-purple-100">Por qué funcionan mejor juntas:</p>
          <ul className="space-y-1 text-xs">
            <li>• Tu plan (A2) te enfoca en lo que QUIERES hacer</li>
            <li>• El contexto (A4) te muestra lo que el MERCADO necesita</li>
            <li>• A3 usa ambos para entrenamientos REALES y personalizados</li>
          </ul>
        </div>

        <div className="flex gap-2 justify-center pt-2">
          <Link href="/despega/a2/dashboard">
            <button className="text-xs font-semibold text-green dark:text-green/40 hover:underline">
              Ir a A2
            </button>
          </Link>
          <span className="text-xs text-slate-400">|</span>
          <Link href="/despega/a4-base">
            <button className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
              Ir a A4
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
