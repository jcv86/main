"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Bell, Shield, Palette, Download, Trash2, AlertTriangle, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UserSettings {
  notifications: {
    email_updates: boolean
    career_tips: boolean
    job_alerts: boolean
    assessment_reminders: boolean
    marketing_emails: boolean
  }
  privacy: {
    profile_visibility: "public" | "private" | "contacts"
    show_activity: boolean
    allow_contact: boolean
    data_sharing: boolean
  }
  preferences: {
    language: string
    timezone: string
    theme: "light" | "dark" | "system"
    currency: string
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email_updates: true,
      career_tips: true,
      job_alerts: true,
      assessment_reminders: true,
      marketing_emails: false,
    },
    privacy: {
      profile_visibility: "public",
      show_activity: true,
      allow_contact: true,
      data_sharing: false,
    },
    preferences: {
      language: "es",
      timezone: "America/Santiago",
      theme: "system",
      currency: "CLP",
    },
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async () => {
    // In real app, save to API
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleExportData = () => {
    // In real app, trigger data export
    const data = {
      user_profile: user,
      settings: settings,
      export_date: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "my-career-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    // In real app, delete account
    console.log("Account deletion requested")
    setShowDeleteConfirm(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground">Gestiona tus preferencias y configuración de cuenta</p>
      </div>

      {showSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Configuración guardada exitosamente</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="privacy">Privacidad</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="account">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones por Email
              </CardTitle>
              <CardDescription>Controla qué notificaciones quieres recibir por correo electrónico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones de la plataforma</Label>
                    <p className="text-sm text-muted-foreground">
                      Nuevas funciones, mejoras y actualizaciones importantes
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email_updates}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email_updates: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Consejos de carrera</Label>
                    <p className="text-sm text-muted-foreground">Tips semanales para el desarrollo profesional</p>
                  </div>
                  <Switch
                    checked={settings.notifications.career_tips}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, career_tips: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de empleo</Label>
                    <p className="text-sm text-muted-foreground">Nuevas oportunidades que coincidan con tu perfil</p>
                  </div>
                  <Switch
                    checked={settings.notifications.job_alerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, job_alerts: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorios de evaluación</Label>
                    <p className="text-sm text-muted-foreground">
                      Recordatorios para completar evaluaciones pendientes
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.assessment_reminders}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, assessment_reminders: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emails de marketing</Label>
                    <p className="text-sm text-muted-foreground">Promociones, eventos y contenido promocional</p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing_emails}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, marketing_emails: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Privacidad
              </CardTitle>
              <CardDescription>Controla quién puede ver tu información y cómo se usa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Visibilidad del perfil</Label>
                  <Select
                    value={settings.privacy.profile_visibility}
                    onValueChange={(value: "public" | "private" | "contacts") =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, profile_visibility: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público - Visible para todos</SelectItem>
                      <SelectItem value="contacts">Contactos - Solo mis contactos</SelectItem>
                      <SelectItem value="private">Privado - Solo yo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Controla quién puede ver tu perfil profesional</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mostrar actividad</Label>
                    <p className="text-sm text-muted-foreground">Permitir que otros vean tu actividad reciente</p>
                  </div>
                  <Switch
                    checked={settings.privacy.show_activity}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, show_activity: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir contacto</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que reclutadores y profesionales te contacten
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.allow_contact}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, allow_contact: checked },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compartir datos para mejoras</Label>
                    <p className="text-sm text-muted-foreground">
                      Ayudar a mejorar la plataforma compartiendo datos anónimos
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.data_sharing}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, data_sharing: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Preferencias de la Aplicación
              </CardTitle>
              <CardDescription>Personaliza tu experiencia en la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, language: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Zona horaria</Label>
                  <Select
                    value={settings.preferences.timezone}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, timezone: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select
                    value={settings.preferences.theme}
                    onValueChange={(value: "light" | "dark" | "system") =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, theme: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Select
                    value={settings.preferences.currency}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, currency: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cuenta</CardTitle>
              <CardDescription>Opciones avanzadas para tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Exportar mis datos</h4>
                    <p className="text-sm text-muted-foreground">Descarga una copia de toda tu información</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cambiar contraseña</h4>
                    <p className="text-sm text-muted-foreground">Actualiza tu contraseña de acceso</p>
                  </div>
                  <Button variant="outline">Cambiar</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Autenticación de dos factores</h4>
                    <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
              <CardDescription>Acciones irreversibles para tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-600">Eliminar cuenta</h4>
                    <p className="text-sm text-muted-foreground">Elimina permanentemente tu cuenta y todos tus datos</p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="space-y-3">
                      <p className="font-medium">¿Estás seguro de que quieres eliminar tu cuenta?</p>
                      <p className="text-sm">Esta acción no se puede deshacer. Se eliminarán permanentemente:</p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li>Tu perfil y toda la información personal</li>
                        <li>Resultados de evaluaciones y tests</li>
                        <li>Historial de conversaciones con el coach</li>
                        <li>CVs creados y guardados</li>
                      </ul>
                      <div className="flex gap-2 pt-2">
                        <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                          Sí, eliminar mi cuenta
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} size="lg">
          <Settings className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}
