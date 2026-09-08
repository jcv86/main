'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { 
  Save, 
  Moon, 
  Sun, 
  Bell, 
  Clock, 
  Eye, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserPreferences {
  language: string
  timezone: string
  theme: string
  email_notifications: boolean
  notifications_enabled: boolean
  achievement_notifications: boolean
  goal_reminders: boolean
  weekly_insights_email: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]

const TIMEZONES = [
  { value: 'America/Santiago', label: 'Santiago, Chile (UTC-3)' },
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'Europe/London', label: 'London (UTC+0)' },
  { value: 'Europe/Madrid', label: 'Madrid (UTC+1)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+10)' },
]

export default function SettingsPage() {
  const { user } = useAuthRedirect()
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({})
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  const { data: prefData, isLoading, mutate } = useSWR(
    '/api/preferences',
    fetcher,
    { revalidateOnFocus: true }
  )

  useEffect(() => {
    if (prefData) {
      setPreferences(prefData)
    }
  }, [prefData])

  const handlePreferenceChange = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    if (!user?.id) {
      setError('Tu sesión expiró. Vuelve a ingresar para guardar tus preferencias.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'No pudimos guardar tus preferencias.')
      }

      setSaveSuccess(true)
      mutate()
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error al guardar preferencias:', err)
      setError(err instanceof Error ? err.message : 'No pudimos guardar tus preferencias.')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[rgba(80,160,170,0.2)] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl min-w-0 px-0 py-4 pb-20 sm:px-4 sm:py-8">
      {/* Header with pillar color accent */}
      <div className="mb-8 border-l-4 border-l-purple pl-4 sm:pl-6">
        <h1 className="text-3xl font-bold text-white mb-2 sm:text-4xl">Preferencias de perfil</h1>
        <p className="text-white/70 text-lg">Personaliza tu experiencia en Despega Tu Carrera</p>
        
        {/* Pillar color indicators */}
        <div className="flex gap-2 mt-4">
          <div className="h-1 flex-1 bg-gradient-to-r from-blue via-orange to-purple rounded"></div>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Preferencias guardadas correctamente
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-[rgba(80,160,170,0.5)]/10 border border-[rgb(80,160,170)]/30 text-[rgb(80,160,170)] text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">

        {/* Display & Theme - A2 Ritual (Blue) */}
        <div className="min-w-0 rounded-lg border-2 border-blue/30 bg-blue/5 p-4 backdrop-blur-sm transition-colors hover:border-blue/50 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue/30 border border-blue/50">
              <Sun className="w-5 h-5 text-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Apariencia y Tema</h2>
              <p className="text-xs text-blue/60">Personaliza tu interfaz</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Tema</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'dark', label: 'Oscuro', icon: Moon },
                  { value: 'light', label: 'Claro', icon: Sun },
                ].map(theme => {
                  const Icon = theme.icon
                  return (
                    <button
                      key={theme.value}
                      onClick={() => handlePreferenceChange('theme', theme.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        preferences.theme === theme.value
                          ? 'bg-blue text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {theme.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Idioma</label>
              <select
                value={preferences.language || 'es'}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-[rgb(80,160,170)]/20 text-white focus:outline-none focus:ring-2 focus:ring-blue/50"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications - A3 Exploration (Orange) */}
        <div className="min-w-0 rounded-lg border-2 border-orange/30 bg-orange/5 p-4 backdrop-blur-sm transition-colors hover:border-orange/50 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-orange/30 border border-orange/50">
              <Bell className="w-5 h-5 text-orange" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Notificaciones</h2>
              <p className="text-xs text-orange/60">Mantente actualizado</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'notifications_enabled', label: 'Habilitar todas las notificaciones' },
              { key: 'email_notifications', label: 'Notificaciones por correo' },
              { key: 'achievement_notifications', label: 'Alertas de logros y badges' },
              { key: 'goal_reminders', label: 'Recordatorios de objetivos' },
              { key: 'weekly_insights_email', label: 'Resumen semanal de insights' },
            ].map(notif => (
              <label key={notif.key} className="flex min-w-0 cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={preferences[notif.key as keyof typeof preferences] === true}
                  onChange={(e) => handlePreferenceChange(notif.key as keyof UserPreferences, e.target.checked)}
                  className="w-4 h-4 rounded accent-orange"
                />
                <span className="min-w-0 flex-1 break-words text-sm leading-relaxed text-white/80 sm:text-base">{notif.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-lg border-2 border-purple/30 bg-purple/5 p-4 backdrop-blur-sm transition-colors hover:border-purple/50 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg border border-purple/50 bg-purple/30 p-2">
              <Clock className="h-5 w-5 text-purple" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Zona horaria</h2>
              <p className="text-xs text-purple/60">Ajusta fechas y recordatorios</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tu Zona Horaria
              </label>
              <select
                value={preferences.timezone || 'America/Santiago'}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full min-w-0 rounded-lg border border-[rgb(80,160,170)]/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple/50 sm:px-4"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        <div className="min-w-0 rounded-lg border-2 border-cyan/30 bg-cyan/5 p-4 backdrop-blur-sm transition-colors hover:border-cyan/50 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan/30 border border-cyan/50">
              <Eye className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Privacidad y datos</h2>
              <p className="text-xs text-cyan/60">Qué ocurre con esta información</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-white/65">Esta pantalla solo guarda las preferencias visibles de idioma, tema, zona horaria y notificaciones. La administración o eliminación de datos personales se gestiona mediante una solicitud al equipo de DTC.</p>
          <a href="/privacy" className="mt-4 inline-flex text-sm font-semibold text-cyan hover:text-cyan/80">Revisar política de privacidad</a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 mt-8 flex flex-col items-stretch gap-3 rounded-lg border border-[rgb(80,160,170)]/10 bg-black/90 p-4 backdrop-blur sm:flex-row sm:items-center">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue text-white hover:bg-blue/90"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <p className="text-white/60 text-sm">Tus cambios se guardan de forma segura</p>
      </div>
    </div>
  )
}
