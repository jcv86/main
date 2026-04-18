'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ASection, ASectionPart } from '@/components/a-section-layout'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Newspaper, TrendingUp, CheckCircle2, Zap, Radar, ArrowRight } from 'lucide-react'

export default function A4RadarPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Create placeholder radar entry
      await supabase.from('user_a4_radar').upsert({
        user_id: user.id,
        progress_stage: 'a4_active',
        updated_at: new Date().toISOString()
      })

      setLoading(false)
    } catch (err) {
      console.error('[v0] Error:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-muted/30">Activando tu Radar...</p>
        </div>
      </div>
    )
  }

  return (
    <ASection
      title="A4: Radar"
      subtitle="Monitoreo continuo y oportunidades"
      icon="📡"
      colorClass="from-teal-500 to-green"
    >
      {/* EXPLICACIÓN */}
      <ASectionPart title="¿Qué es A4: Radar?" icon={<Zap />}>
        <p className="text-muted/30 mb-4">
          En A4: Radar, tu transformación Despega entra en la fase de acción. Aquí monitoreas oportunidades en tiempo real, 
          recibes alertas sobre posiciones que coinciden con tu perfil, y mantienes un pulso constante del mercado. 
          Es tu sistema de seguimiento y aceleración para conseguir resultados.
        </p>
        <p className="text-muted/40 text-sm">
          ⏱️ Duración: Indefinido. A4 es tu herramienta permanente mientras buscas.
        </p>
      </ASectionPart>

      {/* FLUJO / PROCESO */}
      <ASectionPart title="Cómo Funciona el Radar" icon={<Radar />}>
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-[20px] bg-teal-500/20 border border-teal-500/50 flex items-center justify-center flex-shrink-0 text-teal-400 font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-white">Tu Perfil Se Carga</p>
                <p className="text-sm text-muted/40">Tus datos de A1-A3 alimentan el sistema de matching</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-[20px] bg-teal-500/20 border border-teal-500/50 flex items-center justify-center flex-shrink-0 text-teal-400 font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-white">Algoritmo Busca Coincidencias</p>
                <p className="text-sm text-muted/40">Escaneamos el mercado por ofertas que coincidan</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-[20px] bg-teal-500/20 border border-teal-500/50 flex items-center justify-center flex-shrink-0 text-teal-400 font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-white">Recibes Alertas</p>
                <p className="text-sm text-muted/40">Notificaciones de posiciones que son TU fit</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-[20px] bg-teal-500/20 border border-teal-500/50 flex items-center justify-center flex-shrink-0 text-teal-400 font-bold text-sm">4</div>
              <div>
                <p className="font-semibold text-white">Tomas Acción</p>
                <p className="text-sm text-muted/40">Aplicas, entrevishas, y avanzas en tu búsqueda</p>
              </div>
            </div>
          </div>
        </div>
      </ASectionPart>

      {/* RESULTADOS */}
      <ASectionPart title="Componentes del Radar" icon={<CheckCircle2 />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700 hover:border-teal-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-teal-400" />
                News Feed Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted/40">
                Noticias y actualizaciones sobre empresas e industrias de tu interés
              </p>
              <ul className="space-y-1 text-xs text-muted/40">
                <li>✓ Hirings en tu industria</li>
                <li>✓ Funding rounds y crecimiento</li>
                <li>✓ Cambios en liderazgo</li>
                <li>✓ Tendencias del mercado</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 hover:border-teal-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Job Matching IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted/40">
                Análisis automático del fit entre tu perfil y posiciones disponibles
              </p>
              <ul className="space-space-y-1 text-xs text-muted/40">
                <li>✓ Análisis de skills match</li>
                <li>✓ Fit cultural basado en DISC</li>
                <li>✓ Análisis salarial</li>
                <li>✓ Ranking de oportunidades</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 hover:border-teal-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Radar className="w-5 h-5 text-cyan-400" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted/40">
                Sigue tu avance completo desde A1 hasta oportunidades aplicadas
              </p>
              <ul className="space-y-1 text-xs text-muted/40">
                <li>✓ Readiness score en tiempo real</li>
                <li>✓ Aplicaciones enviadas</li>
                <li>✓ Entrevistas coordinadas</li>
                <li>✓ Ofrecimiento recibidos</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 hover:border-teal-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Coach IA Transversal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted/40">
                Asistente inteligente disponible en todos los stages
              </p>
              <ul className="space-y-1 text-xs text-muted/40">
                <li>✓ Preguntas sobre estrategia</li>
                <li>✓ Revisión de documentos</li>
                <li>✓ Prep de entrevistas</li>
                <li>✓ Negociación de ofertas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </ASectionPart>

      {/* DASHBOARD / ACCIONES */}
      <ASectionPart title="Próximos Pasos" icon={<CheckCircle2 />}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/40 border-slate-700 hover:border-teal-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Tu Transformación Está Completa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted/30">
                  Has pasado por A1 (Origen), A2 (Ruta), A3 (Impulso). Ahora con A4 (Radar), 
                  tienes todas las herramientas para buscar y asegurar tu próxima oportunidad con confianza.
                </p>
                <Button 
                  onClick={() => router.push('/despega')}
                  className="w-full bg-blue hover:bg-teal-700"
                  size="sm"
                >
                  Ver Dashboard Completo
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700 hover:border-teal-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Sigue Monitoreando</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted/30">
                  A4 es permanente. Vuelve regularmente para:
                </p>
                <ul className="space-y-1 text-xs text-muted/40">
                  <li>✓ Ver nuevas oportunidades</li>
                  <li>✓ Revisar tu readiness score</li>
                  <li>✓ Hablar con el coach</li>
                  <li>✓ Trackear aplicaciones</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="p-6 bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border border-teal-500/30 rounded-lg">
            <p className="text-muted/30 mb-4">
              <strong>¿Listo para empezar?</strong> Ve al dashboard principal para ver todas las oportunidades 
              que el Radar ha identificado para ti. Tu search ha comenzado.
            </p>
            <Button 
              onClick={() => router.push('/despega')}
              className="bg-blue hover:bg-teal-700"
            >
              Ir al Dashboard Despega
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </ASectionPart>
    </ASection>
  )
}
