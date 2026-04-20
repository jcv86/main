'use client'

import { useState, useRef } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { useAvatarPreferences } from '@/lib/hooks/use-avatar-preferences'
import { AvatarPicker } from '@/components/avatar-picker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ArrowRight, Sparkles, CheckCircle2, Camera, Upload } from 'lucide-react'
import Link from 'next/link'

export default function AvatarSetupPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const { preferences, updatePreferences, loading: prefsLoading } = useAvatarPreferences(user?.id)
  const [interviewerAvatar, setInterviewerAvatar] = useState('')
  const [userPhotoUrl, setUserPhotoUrl] = useState('')
  const [saved, setSaved] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  const isLoading = authLoading || prefsLoading

  // Get profile photo from auth user metadata
  const profilePhoto = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || userPhotoUrl

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        setUserPhotoUrl(imageData)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setCameraActive(false)
    }
  }

  const handleSave = async () => {
    if (interviewerAvatar) {
      await updatePreferences({
        interviewer_avatar_id: interviewerAvatar,
        ...(userPhotoUrl && { user_avatar_url: userPhotoUrl, user_avatar_source: 'camera' })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-blue/10 text-blue dark:bg-blue/30 dark:text-blue/30 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Configuración de Entrevista
          </Badge>
          <h1 className="text-4xl font-bold text-muted/90 dark:text-white mb-3">
            Tu Perfil y Entrevistador
          </h1>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground">
            Usa tu foto de perfil y selecciona quién te entrevistará en las sesiones de práctica.
          </p>
        </div>

        {/* Profile Photo Section */}
        <Card className="border-muted/20 dark:border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Tu Foto de Perfil
            </CardTitle>
            <CardDescription>
              Se utilizará tu foto de {user?.user_metadata?.provider === 'google' ? 'Google' : user?.user_metadata?.provider === 'linkedin' ? 'LinkedIn' : 'perfil'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Photo Display */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profilePhoto} alt="Tu foto" />
                <AvatarFallback className="text-lg">{user?.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-semibold text-muted/90 dark:text-white">{user?.email}</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  {profilePhoto ? 'Foto cargada automáticamente' : 'Captura una foto para comenzar'}
                </p>
              </div>
            </div>

            {/* Camera Capture Option */}
            {!profilePhoto && (
              <div className="space-y-3">
                <Button
                  onClick={startCamera}
                  disabled={cameraActive}
                  className="w-full"
                  variant="outline"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {cameraActive ? 'Cámara Activa' : 'Usar Cámara'}
                </Button>

                {cameraActive && (
                  <div className="space-y-3">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-[28px] bg-black"
                    />
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto} className="flex-1 bg-blue hover:bg-blue">
                        Capturar Foto
                      </Button>
                      <Button onClick={stopCamera} variant="outline" className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        {/* Interviewer Avatar Picker */}
        <div>
          <AvatarPicker
            type="interviewer"
            value={interviewerAvatar || preferences.interviewer_avatar_id}
            onChange={setInterviewerAvatar}
            title="Selecciona tu Entrevistador"
            description="Elige quién conducirá tus entrevistas de práctica"
          />
        </div>

        {/* Benefits */}
        <Card className="border-muted/20 dark:border-muted/80 bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green" />
              Por qué usar tu foto real
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-muted/90 dark:text-white">Realismo Máximo</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Las entrevistas son más auténticas cuando ves tu verdadera apariencia frente al entrevistador
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-muted/90 dark:text-white">Retroalimentación Real</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Recibe feedback basado en cómo realmente te ves, no en un avatar genérico
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-muted/90 dark:text-white">Preparación Efectiva</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Entrena con tu apariencia real para ganar confianza en entrevistas verdaderas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSave}
            disabled={!interviewerAvatar}
            size="lg"
            className="bg-blue hover:bg-blue text-white"
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
        <Card className="border-yellow/30 dark:border-yellow bg-yellow/5 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              💡 Puedes cambiar tu entrevistador en cualquier momento. Los cambios se aplican inmediatamente a tus nuevos entrenamientos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
