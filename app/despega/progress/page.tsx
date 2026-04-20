'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Zap, Trophy, Target, Gift, TrendingUp, Award, Flame } from 'lucide-react'

export default function HowToEarnXPPage() {
  const [expandedPhase, setExpandedPhase] = useState<string>('all')

  type XPItem = {
    action: string
    xp: number
    icon: typeof Flame
    streak?: string
  }

  type XPRule = {
    phase: string
    category: string
    items: XPItem[]
  }

  const xpRules: XPRule[] = [
    {
      phase: 'Todas',
      category: 'Diarias',
      items: [
        { action: 'Iniciar sesión diario', xp: 10, icon: Flame, streak: 'x2 con racha 7+' },
        { action: 'Completar 1 desafío diario', xp: 25, icon: Target, streak: 'x2 con racha 7+' },
        { action: 'Completar 3 desafíos diarios (bonus)', xp: 50, icon: Trophy, streak: 'x2 con racha 7+' },
      ]
    },
    {
      phase: 'A1: El Ritual',
      category: 'Fase 1',
      items: [
        { action: 'Completar "Inicia Tu Jornada"', xp: 50, icon: CheckCircle2, streak: undefined },
        { action: 'Completar "Descubre Tu Potencial"', xp: 75, icon: CheckCircle2, streak: undefined },
        { action: 'Completar "Identifica Tu Estilo" (test)', xp: 100, icon: Award, streak: undefined },
        { action: 'Ver "Tu Análisis Personal"', xp: 50, icon: CheckCircle2, streak: undefined },
        { action: 'Fase A1 completa (bonus)', xp: 200, icon: Trophy, streak: undefined },
      ]
    },
    {
      phase: 'A2: Exploración',
      category: 'Fase 2',
      items: [
        { action: 'Completar "Define Tus Objetivos"', xp: 75, icon: CheckCircle2, streak: undefined },
        { action: 'Generar "Tu Ruta Personalizada"', xp: 100, icon: CheckCircle2, streak: undefined },
        { action: 'Revisar ruta completa', xp: 50, icon: CheckCircle2, streak: undefined },
        { action: 'Fase A2 completa (bonus)', xp: 250, icon: Trophy, streak: undefined },
      ]
    },
    {
      phase: 'A3: Entrenamiento',
      category: 'Fase 3',
      items: [
        { action: 'Completar "Interview 0" (5 preguntas)', xp: 75, icon: CheckCircle2, streak: undefined },
        { action: 'Completar "Identifica Tu Estilo"', xp: 100, icon: CheckCircle2, streak: undefined },
        { action: 'Realizar 1 Simulación Guiada', xp: 150, icon: Zap, streak: undefined },
        { action: 'Realizar Análisis Multimodal con Video', xp: 200, icon: Award, streak: undefined },
        { action: 'Completar CV ATS Optimizer', xp: 75, icon: CheckCircle2, streak: undefined },
        { action: 'Usar "Ajuste por Vacante"', xp: 100, icon: Target, streak: undefined },
        { action: 'Realizar 1 Simulación Estructurada', xp: 150, icon: Zap, streak: undefined },
        { action: 'Realizar 1 Simulación Desafiante', xp: 200, icon: Trophy, streak: undefined },
        { action: 'Fase A3 completa (bonus)', xp: 500, icon: Trophy, streak: undefined },
      ]
    },
    {
      phase: 'A4: La Realidad',
      category: 'Fase 4',
      items: [
        { action: 'Ver "Contexto del Mercado"', xp: 75, icon: CheckCircle2, streak: undefined },
        { action: 'Acceder "Tu Dashboard Ejecutivo"', xp: 100, icon: CheckCircle2, streak: undefined },
        { action: 'Usar 3+ herramientas de A4', xp: 150, icon: Zap, streak: undefined },
        { action: 'Tomar decisión estratégica (logging)', xp: 100, icon: Target, streak: undefined },
        { action: 'Fase A4 completa (bonus)', xp: 500, icon: Trophy, streak: undefined },
      ]
    },
    {
      phase: 'Todas',
      category: 'Bonificaciones Especiales',
      items: [
        { action: 'Alcanzar racha de 7 días', xp: 300, icon: Flame, streak: 'x1.5 multiplicador' },
        { action: 'Alcanzar racha de 30 días', xp: 1000, icon: Trophy, streak: 'x2.0 multiplicador' },
        { action: 'Completar ciclo entero C1→A4', xp: 2000, icon: Award, streak: 'Bonus masivo' },
        { action: 'Referir a un amigo', xp: 500, icon: Gift, streak: undefined },
      ]
    }
  ]

  const streakBenefits = [
    { days: '3 días', bonus: 'x1.2 multiplicador XP' },
    { days: '7 días', bonus: 'x1.5 multiplicador XP' },
    { days: '14 días', bonus: 'x2.0 multiplicador XP' },
    { days: '30 días', bonus: 'x2.0 + Badge de Leyenda' },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold bg-background">
            ¿Cómo Ganar Puntos (XP)?
          </h1>
          <p className="text-xl text-muted-foreground">
            Cada acción en tu jornada de transformación te da XP. Cuanto más activo, más puntos ganas.
          </p>
        </div>

        {/* MAIN RULES */}
        <div className="space-y-6">
          {xpRules.map((rule, idx) => (
            <Card key={idx} className="bg-muted/80/50 border-muted/70 hover:border-blue/50 transition-colors">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedPhase(expandedPhase === rule.phase ? '' : rule.phase)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-cyan/40" />
                    <div>
                      <CardTitle className="text-lg">{rule.phase}</CardTitle>
                      <p className="text-sm text-muted-foreground">{rule.category}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue/50/20 text-cyan/30 border-blue/50">
                    {rule.items.length} acciones
                  </Badge>
                </div>
              </CardHeader>

              {(expandedPhase === rule.phase || rule.phase === 'Todas') && (
                <CardContent className="space-y-3 pt-0">
                  {rule.items.map((item, itemIdx) => {
                    const IconComponent = item.icon
                    return (
                      <div 
                        key={itemIdx}
                        className="flex items-center justify-between p-3 rounded-[28px] bg-muted/70/30 border border-muted/60/50 hover:border-blue/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <IconComponent className="w-5 h-5 text-cyan/40 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{item.action}</p>
                            {item.streak && <p className="text-xs text-cyan/30">{item.streak}</p>}
                          </div>
                        </div>
                        <Badge className="bg-yellow/50/20 text-amber-300 border-amber-500/50 font-bold">
                          +{item.xp} XP
                        </Badge>
                      </div>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* STREAK MULTIPLIER */}
        <Card className="bg-background">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange/40" />
              <CardTitle>Sistema de Racha 🔥</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted/30 mb-4">
              ¡No rompas tu racha! Mientras más días consecutivos estés activo, mayor el multiplicador de XP:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {streakBenefits.map((benefit, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-[28px] bg-muted/80/50 border border-orange/30 text-center"
                >
                  <p className="font-bold text-lg text-orange/40">{benefit.days}</p>
                  <p className="text-sm text-muted/30">{benefit.bonus}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TIPS */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan/40" />
              Tips para Maximizar XP
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">✨ Maximiza tu XP:</p>
              <ul className="text-sm text-muted/30 space-y-1 ml-4">
                <li>• Completa los 3 desafíos diarios para el bonus de 50 XP</li>
                <li>• Mantén tu racha - el multiplicador te puede dar hasta 2x más XP</li>
                <li>• Avanza en las fases - los bonificadores finales son enormes (500+ XP)</li>
                <li>• Usa todas las herramientas de cada fase para desbloquear rewards especiales</li>
                <li>• Referir amigos = 500 XP bonus por referencia</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* LEVEL PROGRESSION */}
        <Card className="bg-muted/80/50 border-muted/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan/40" />
              Sistema de Niveles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted/30">
                <span className="font-bold">1,000 XP = 1 Nivel</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-[28px] bg-muted/70/50 border border-blue/30">
                  <p className="text-xs text-muted-foreground">Novato</p>
                  <p className="text-lg font-bold">Niveles 1-5</p>
                  <p className="text-xs text-muted-foreground">0-5,000 XP</p>
                </div>
                <div className="p-3 rounded-[28px] bg-muted/70/50 border border-blue/30">
                  <p className="text-xs text-muted-foreground">Intermedio</p>
                  <p className="text-lg font-bold">Niveles 6-15</p>
                  <p className="text-xs text-muted-foreground">5,000-15,000 XP</p>
                </div>
                <div className="p-3 rounded-[28px] bg-muted/70/50 border border-blue/30">
                  <p className="text-xs text-muted-foreground">Experto</p>
                  <p className="text-lg font-bold">Niveles 16+</p>
                  <p className="text-xs text-muted-foreground">15,000+ XP</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
