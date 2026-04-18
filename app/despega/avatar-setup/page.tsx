'use client'

import { useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { useAvatarPreferences } from '@/lib/hooks/use-avatar-preferences'
import { AvatarPicker } from '@/components/avatar-picker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AvatarSetupPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const { preferences, updatePreferences, loading: prefsLoading } = useAvatarPreferences(user?.id)
  const [userAvatar, setUserAvatar] = useState('')
  const [interviewerAvatar, setInterviewerAvatar] = useState('')
  const [saved, setSaved] = useState(false)

  const isLoading = authLoading || prefsLoading

  const handleSave = async () => {
    if (userAvatar || interviewerAvatar) {
      await updatePreferences({
        ...(userAvatar && { user_avatar_id: userAvatar }),
        ...(interviewerAvatar && { interviewer_avatar_id: interviewerAvatar })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Personalización de Avatar
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Configura tu Experiencia
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Elige cómo quieres presentarte y quién te entrevistará. Esta configuración se aplica en todas las secciones de entrenamiento.
          </p>
        </div>

        {/* Avatar Pickers */}
        <div className="grid md:grid-cols-2 gap-8">
          <AvatarPicker
            type="user"
            value={userAvatar || preferences.user_avatar_id}
            onChange={setUserAvatar}
            title="Tu Avatar"
            description="Cómo deseas presentarte en las entrevistas"
          />

          <AvatarPicker
            type="interviewer"
            value={interviewerAvatar || preferences.interviewer_avatar_id}
            onChange={setInterviewerAvatar}
            title="Entrevistador"
            description="Quién conducirá tus entrevistas de práctica"
          />
        </div>

        {/* Benefits */}
        <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Por qué personalizar avatares
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white">Realismo Aumentado</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Las entrevistas se sienten más naturales y auténticas con avatares realistas
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white">Personificación</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Elige un avatar que represente tu estilo profesional o imagen que deseas proyectar
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white">Coherencia Visual</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Los avatares aparecen consistentemente en todos tus entrenamientos y retroalimentación
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSave}
            disabled={!userAvatar && !interviewerAvatar}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {saved ? 'Configuración Guardada ✓' : 'Guardar Configuración'}
          </Button>

          <Link href="/despega/a3">
            <Button variant="outline" size="lg">
              Ir a Entrenamientos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Info */}
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              💡 Puedes cambiar tu configuración de avatares en cualquier momento desde tu perfil. Los cambios se aplican inmediatamente a tus nuevos entrenamientos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
