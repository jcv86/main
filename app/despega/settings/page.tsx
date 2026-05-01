'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { 
  Save, 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Clock, 
  Eye, 
  LogIn,
  Volume2,
  AlertCircle
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

const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual - Aprendo mejor con gráficos e imágenes' },
  { value: 'auditory', label: 'Auditivo - Prefiero escuchar explicaciones' },
  { value: 'kinesthetic', label: 'Kinestésico - Aprendo haciendo práctica' },
  { value: 'reading', label: 'Lectura/Escritura - Prefiero texto y documentos' },
]

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
]

const CONTACT_METHODS = [
  { value: 'email', label: 'Correo Electrónico' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'both', label: 'Ambos' },
]

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<Partial<UserPreferences & {
    learning_style: string
    difficulty_level: string
    preferred_contact: string
  }>>({})
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

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })

      if (!response.ok) {
        throw new Error('Error al guardar las preferencias')
      }

      setSaveSuccess(true)
      mutate()
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Preferencias de Perfil</h1>
        <p className="text-white/60">Personaliza tu experiencia en Despega Tu Carrera</p>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          Preferencias guardadas exitosamente
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">

        {/* Display & Theme */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue/20">
              <Sun className="w-5 h-5 text-blue" />
            </div>
            <h2 className="text-xl font-semibold text-white">Apariencia y Tema</h2>
          </div>

          <div className="space-y-4">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Tema</label>
              <div className="flex gap-3">
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
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue/50"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-orange/20">
              <Bell className="w-5 h-5 text-orange" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'notifications_enabled', label: 'Habilitar todas las notificaciones' },
              { key: 'email_notifications', label: 'Notificaciones por correo' },
              { key: 'achievement_notifications', label: 'Alertas de logros y badges' },
              { key: 'goal_reminders', label: 'Recordatorios de objetivos' },
              { key: 'weekly_insights_email', label: 'Resumen semanal de insights' },
            ].map(notif => (
              <label key={notif.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={preferences[notif.key as keyof typeof preferences] === true}
                  onChange={(e) => handlePreferenceChange(notif.key, e.target.checked)}
                  className="w-4 h-4 rounded accent-orange"
                />
                <span className="text-white/80">{notif.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple/20">
              <Volume2 className="w-5 h-5 text-purple" />
            </div>
            <h2 className="text-xl font-semibold text-white">Preferencias de Aprendizaje</h2>
          </div>

          <div className="space-y-4">
            {/* Learning Style */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Tu Estilo de Aprendizaje</label>
              <div className="space-y-2">
                {LEARNING_STYLES.map(style => (
                  <label key={style.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="learning_style"
                      value={style.value}
                      checked={preferences.learning_style === style.value}
                      onChange={(e) => handlePreferenceChange('learning_style', e.target.value)}
                      className="w-4 h-4 accent-purple"
                    />
                    <span className="text-white/80">{style.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Nivel de Dificultad Preferido</label>
              <div className="flex gap-3">
                {DIFFICULTY_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => handlePreferenceChange('difficulty_level', level.value)}
                    className={`px-4 py-2 rounded-lg transition-all text-sm ${
                      preferences.difficulty_level === level.value
                        ? 'bg-purple text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red/20">
              <LogIn className="w-5 h-5 text-red" />
            </div>
            <h2 className="text-xl font-semibold text-white">Comunicación</h2>
          </div>

          <div className="space-y-4">
            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tu Zona Horaria
              </label>
              <select
                value={preferences.timezone || 'America/Santiago'}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-red/50"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Método de Contacto Preferido</label>
              <div className="flex gap-3">
                {CONTACT_METHODS.map(method => (
                  <button
                    key={method.value}
                    onClick={() => handlePreferenceChange('preferred_contact', method.value)}
                    className={`px-4 py-2 rounded-lg transition-all text-sm ${
                      preferences.preferred_contact === method.value
                        ? 'bg-red text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue/20">
              <Eye className="w-5 h-5 text-blue" />
            </div>
            <h2 className="text-xl font-semibold text-white">Privacidad y Datos</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded accent-blue mt-0.5"
              />
              <div>
                <span className="text-white/80 block">Compartir datos anónimos para mejorar la plataforma</span>
                <span className="text-white/40 text-sm">Nos ayuda a mejorar tu experiencia sin compartir información personal</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded accent-blue mt-0.5"
              />
              <div>
                <span className="text-white/80 block">Usar mi perfil para recomendaciones</span>
                <span className="text-white/40 text-sm">Personalizamos contenido basado en tu perfil y progreso</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center gap-3 sticky bottom-0 bg-black/80 backdrop-blur p-4 rounded-lg border border-white/10">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue hover:bg-blue/90 text-white flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <p className="text-white/60 text-sm">Tus cambios se guardan de forma segura</p>
      </div>
    </div>
  )
}

function Check({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
