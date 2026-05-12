'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Trophy, Gift, Medal, Star, Lock, Unlock, Zap, Award } from 'lucide-react'

export default function RewardsPage() {
  // PLACEHOLDER: Full rewards structure - customize with your prize details
  const REWARDS = [
    {
      id: 'completion-trophy',
      title: '🏆 Trofeo de Completitud',
      description: '¡Completaste los 10 módulos del entrenamiento!',
      status: 'unlocked',
      xpReward: 290,
      rarity: 'legendary'
    },
    {
      id: 'master-badge',
      title: '⭐ Insignia Máster',
      description: 'Dominaste todas las técnicas de entrevista',
      status: 'unlocked',
      xpReward: 100,
      rarity: 'epic'
    },
    {
      id: 'simulation-master',
      title: '🎯 Experto en Simulaciones',
      description: 'Completaste 5 simulaciones de entrevista completas',
      status: 'unlocked',
      xpReward: 50,
      rarity: 'epic'
    },
    {
      id: 'star-master',
      title: '⭐ Maestro STAR',
      description: 'Dominaste la técnica STAR con puntuación 100/100',
      status: 'locked', // TODO: unlock based on actual scores
      xpReward: 75,
      rarity: 'rare'
    },
    {
      id: 'streak-30',
      title: '🔥 Racha de 30 Días',
      description: 'Práctica consistente por 30 días consecutivos',
      status: 'locked',
      xpReward: 100,
      rarity: 'rare'
    },
    {
      id: 'perfect-score',
      title: '💯 Puntuación Perfecta',
      description: 'Obtuvo 100/100 en todos los módulos',
      status: 'locked',
      xpReward: 150,
      rarity: 'legendary'
    }
  ]

  const UNLOCKS = [
    {
      id: 'advanced-track',
      title: '🚀 Pista Avanzada Desbloqueada',
      description: 'Acceso a entrenamientos avanzados con ejecutivos',
      type: 'feature',
      available: true
    },
    {
      id: 'mentorship',
      title: '👥 Programa de Mentoría',
      description: 'Sesión gratuita de mentoría (1 hora) con coach profesional',
      type: 'service',
      available: true
    },
    {
      id: 'resume-review',
      title: '📄 Revisión de CV Premium',
      description: 'Revisión profesional de tu CV con recomendaciones personalizadas',
      type: 'service',
      available: true
    },
    {
      id: 'interview-coach',
      title: '🎓 Sesión de Coaching',
      description: 'Sesión privada de coaching de entrevista (45 min)',
      type: 'service',
      available: true
    },
    {
      id: 'network-access',
      title: '🤝 Acceso a Red Profesional',
      description: 'Acceso exclusivo a red de reclutadores y profesionales',
      type: 'feature',
      available: true
    },
    {
      id: 'certificate',
      title: '🎖️ Certificado de Completitud',
      description: 'Certificado verificable que puedes compartir',
      type: 'credential',
      available: true
    }
  ]

  const rarityColors = {
    legendary: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
    epic: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
    rare: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50'
  }

  const rarityIcons = {
    legendary: '👑',
    epic: '⭐',
    rare: '💎'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/despega/a3" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center border border-yellow-500/50">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">¡Premios Desbloqueados!</h1>
              <p className="text-white/60 mt-1">Felicidades por completar el tour de entrenamiento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card className="rounded-[2px] bg-black border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white/60 text-sm">XP Total Ganado</p>
                <p className="text-3xl font-bold text-yellow-400">+290 XP</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2px] bg-black border-purple-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <Medal className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white/60 text-sm">Insignias</p>
                <p className="text-3xl font-bold text-purple-400">3/6</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2px] bg-black border-blue-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <Gift className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white/60 text-sm">Beneficios</p>
                <p className="text-3xl font-bold text-blue-400">6/6</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2px] bg-black border-green-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white/60 text-sm">Nivel</p>
                <p className="text-3xl font-bold text-green-400">Máster</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6 text-yellow-400" />
            Insignias de Logro
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {REWARDS.map((reward) => (
              <Card
                key={reward.id}
                className={`bg-black border-2 ${
                  reward.status === 'unlocked'
                    ? `bg-gradient-to-br ${rarityColors[reward.rarity as keyof typeof rarityColors]} border-yellow-500/50`
                    : 'border-white/20 opacity-60'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-4xl">{rarityIcons[reward.rarity as keyof typeof rarityIcons]}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{reward.title}</h3>
                        <p className="text-white/60 text-sm mt-1">{reward.description}</p>
                      </div>
                    </div>
                    {reward.status === 'unlocked' ? (
                      <Unlock className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Lock className="w-5 h-5 text-white/40 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="text-xs text-white/60">{reward.rarity.toUpperCase()}</span>
                    <Badge className={reward.status === 'unlocked' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-white/60'}>
                      +{reward.xpReward} XP
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits/Unlocks Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-400" />
            Beneficios Desbloqueados
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {UNLOCKS.map((unlock) => (
              <Card
                key={unlock.id}
                className="bg-black border-purple-500/30 hover:border-purple-500/60 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {unlock.title}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">{unlock.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                    <Badge className="text-xs bg-blue-500/20 text-blue-300 capitalize">{unlock.type}</Badge>
                    {unlock.available && (
                      <Button className="text-xs h-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Reclamar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">¿Qué Sigue?</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Has desbloqueado acceso a entrenamientos avanzados, mentoría personalizada, y más. Ahora es el momento de llevarte al siguiente nivel o aplicar a esa posición que siempre quisiste.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/despega/a3">
              <Button className="rounded-[20px] bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                Explorar Pista Avanzada
              </Button>
            </Link>
            <Button variant="outline" className="border-yellow-500/30 text-white hover:bg-yellow-500/10">
              Descargar Certificado
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
