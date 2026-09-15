'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { AlertCircle, Bell, CheckCircle2, Clock, Eye, Moon, Save, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

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

const NOTIFICATIONS: Array<{ key: keyof UserPreferences; label: string }> = [
  { key: 'notifications_enabled', label: 'Habilitar todas las notificaciones' },
  { key: 'email_notifications', label: 'Notificaciones por correo' },
  { key: 'achievement_notifications', label: 'Alertas de logros y badges' },
  { key: 'goal_reminders', label: 'Recordatorios de objetivos' },
  { key: 'weekly_insights_email', label: 'Resumen semanal de insights' },
]

async function fetchPreferences(url: string): Promise<UserPreferences> {
  const response = await fetch(url, { cache: 'no-store' })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'No pudimos cargar tus preferencias.')
  return payload as UserPreferences
}

export default function SettingsPage() {
  const { user } = useAuthRedirect()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  const { data, error: loadError, isLoading, mutate } = useSWR<UserPreferences>(
    '/api/preferences',
    fetchPreferences,
    { revalidateOnFocus: true },
  )

  useEffect(() => {
    if (data) setPreferences(data)
  }, [data])

  const change = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((current) => current ? { ...current, [key]: value } : current)
    setSaveSuccess(false)
  }

  const save = async () => {
    if (!user?.id) {
      setError('Tu sesión expiró. Vuelve a ingresar para guardar tus preferencias.')
      return
    }
    if (!preferences) return

    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error || 'No pudimos guardar tus preferencias.')

      setPreferences(payload as UserPreferences)
      setSaveSuccess(true)
      await mutate(payload as UserPreferences, { revalidate: false })
      window.setTimeout(() => setSaveSuccess(false), 3000)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No pudimos guardar tus preferencias.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || (!preferences && !loadError)) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8" aria-busy="true" aria-label="Cargando preferencias">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 rounded-lg bg-[rgba(80,160,170,0.2)]" />
          ))}
        </div>
      </div>
    )
  }

  if (loadError || !preferences) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          No pudimos cargar tus preferencias. Recarga la página para intentarlo nuevamente.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl min-w-0 px-0 py-4 pb-20 sm:px-4 sm:py-8">
      <header className="mb-8 border-l-4 border-l-purple pl-4 sm:pl-6">
        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Preferencias de perfil</h1>
        <p className="text-lg text-white/70">Personaliza tu experiencia en Despega Tu Carrera</p>
        <div className="mt-4 h-1 rounded bg-gradient-to-r from-blue via-orange to-purple" />
      </header>

      {saveSuccess && (
        <div role="status" className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          Preferencias guardadas correctamente
        </div>
      )}

      {error && (
        <div role="alert" className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <section className="min-w-0 rounded-lg border-2 border-blue/30 bg-blue/5 p-4 sm:p-6" aria-labelledby="appearance-heading">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-blue/50 bg-blue/30 p-2"><Sun className="h-5 w-5 text-blue" /></div>
            <div>
              <h2 id="appearance-heading" className="text-xl font-semibold text-white">Apariencia y Tema</h2>
              <p className="text-xs text-white/70">Personaliza tu interfaz</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-3 text-sm font-medium text-white">Tema</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'dark', label: 'Oscuro', icon: Moon },
                  { value: 'light', label: 'Claro', icon: Sun },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => change('theme', value)}
                    aria-pressed={preferences.theme === value}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${preferences.theme === value ? 'bg-blue text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="settings-language" className="mb-3 block text-sm font-medium text-white">Idioma</label>
              <select
                id="settings-language"
                value={preferences.language}
                onChange={(event) => change('language', event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue/50"
              >
                {LANGUAGES.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="min-w-0 rounded-lg border-2 border-orange/30 bg-orange/5 p-4 sm:p-6" aria-labelledby="notifications-heading">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-orange/50 bg-orange/30 p-2"><Bell className="h-5 w-5 text-orange" /></div>
            <div>
              <h2 id="notifications-heading" className="text-xl font-semibold text-white">Notificaciones</h2>
              <p className="text-xs text-white/70">Mantente actualizado</p>
            </div>
          </div>

          <div className="space-y-2">
            {NOTIFICATIONS.map(({ key, label }) => (
              <label key={key} className="flex min-w-0 cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={preferences[key] === true}
                  onChange={(event) => change(key, event.target.checked as never)}
                  className="mt-1 h-4 w-4 rounded accent-orange"
                />
                <span className="min-w-0 flex-1 break-words text-sm leading-relaxed text-white/80 sm:text-base">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="min-w-0 rounded-lg border-2 border-purple/30 bg-purple/5 p-4 sm:p-6" aria-labelledby="timezone-heading">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-purple/50 bg-purple/30 p-2"><Clock className="h-5 w-5 text-purple" /></div>
            <div>
              <h2 id="timezone-heading" className="text-xl font-semibold text-white">Zona horaria</h2>
              <p className="text-xs text-white/70">Ajusta fechas y recordatorios</p>
            </div>
          </div>

          <label htmlFor="settings-timezone" className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <Clock className="h-4 w-4" /> Tu Zona Horaria
          </label>
          <select
            id="settings-timezone"
            value={preferences.timezone}
            onChange={(event) => change('timezone', event.target.value)}
            className="w-full min-w-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple/50 sm:px-4"
          >
            {TIMEZONES.map((timezone) => <option key={timezone.value} value={timezone.value}>{timezone.label}</option>)}
          </select>
        </section>

        <section className="min-w-0 rounded-lg border-2 border-cyan/30 bg-cyan/5 p-4 sm:p-6" aria-labelledby="privacy-heading">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-cyan/50 bg-cyan/30 p-2"><Eye className="h-5 w-5 text-cyan" /></div>
            <div>
              <h2 id="privacy-heading" className="text-xl font-semibold text-white">Privacidad y datos</h2>
              <p className="text-xs text-white/70">Qué ocurre con esta información</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/65">Esta pantalla solo guarda las preferencias visibles de idioma, tema, zona horaria y notificaciones. La administración o eliminación de datos personales se gestiona mediante una solicitud al equipo de DTC.</p>
          <a href="/privacy" className="mt-4 inline-flex text-sm font-semibold text-cyan hover:text-cyan/80">Revisar política de privacidad</a>
        </section>
      </div>

      <div className="sticky bottom-0 mt-8 flex flex-col items-stretch gap-3 rounded-lg border border-white/10 bg-black/90 p-4 backdrop-blur sm:flex-row sm:items-center">
        <Button onClick={() => void save()} disabled={saving} className="flex items-center gap-2 bg-blue text-white hover:bg-blue/90">
          <Save className="h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <p className="text-sm text-white/60">Tus cambios se guardan de forma segura</p>
      </div>
    </div>
  )
}
